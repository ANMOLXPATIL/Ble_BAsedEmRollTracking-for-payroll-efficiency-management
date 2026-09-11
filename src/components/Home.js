import React, { useEffect, useState } from "react";
import { database } from "../firebase";
import { ref, onValue } from "firebase/database";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "./Navbar";
import { 
    initializeRegistry, 
    fetchEmployees, 
    fetchBeacons, 
    fetchShifts, 
    DEFAULT_EMPLOYEES,
    DEFAULT_SHIFTS,
    calculateWorkforceVariance,
    calculateOrgWorkforceMetrics,
    processEventsToWorkSessions,
    getLocalDateString,
    resolveEmployeeId
} from "../dbOperations";
import { 
    RiAlertLine, 
    RiCpuLine
} from "react-icons/ri";

function Home() {
    const [employees, setEmployees] = useState({});
    const [beacons, setBeacons] = useState({});
    const [shifts, setShifts] = useState(DEFAULT_SHIFTS);
    const [gateways, setGateways] = useState({});
    const [activeEmpIDs, setActiveEmpIDs] = useState([]);
    const [inactiveEmpIDs, setInactiveEmpIDs] = useState([]);
    const [todayTotals, setTodayTotals] = useState({});
    const [todayDate, setTodayDate] = useState(() => getLocalDateString());
    const [activeTab, setActiveTab] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    // The dashboard is intentionally scoped to the current local calendar day.
    const targetDateStr = todayDate;

    useEffect(() => {
        const dateTimer = window.setInterval(() => {
            setTodayDate(getLocalDateString());
        }, 60 * 1000);

        return () => window.clearInterval(dateTimer);
    }, []);

    useEffect(() => {
        const loadRegistry = async () => {
            await initializeRegistry();
            const emps = await fetchEmployees();
            const bcons = await fetchBeacons();
            const shfts = await fetchShifts();
            const employeeRoster = Object.fromEntries(
                Object.entries(emps).filter(([employeeId, employee]) =>
                    employee && employee.id === employeeId
                )
            );
            setEmployees({ ...DEFAULT_EMPLOYEES, ...employeeRoster });
            setBeacons(bcons);
            setShifts(shfts);
        };

        loadRegistry();

        // Listen for Gateway Heartbeats (Phase 11)
        const gatewayRef = ref(database, "gateways");
        const unsubGateways = onValue(gatewayRef, (snap) => {
            setGateways(snap.val() || {});
        });

        const attendanceRef = ref(database, `attendance/${targetDateStr}`);
        const unsubscribe = onValue(attendanceRef, (snapshot) => {
            const data = snapshot.val() || {};
            const active = [];
            const inactive = [];
            const totals = {};

            // 1. Pre-fill all registered employees as inactive first
            if (employees && Object.keys(employees).length > 0) {
                Object.keys(employees).forEach((empID) => {
                    if (empID && !empID.startsWith("-") && empID !== "undefined") {
                        inactive.push(empID);
                    }
                });
            } else {
                // Default prototype fallbacks
                inactive.push("EMP001", "EMP002");
            }

            // 2. Iterate through canonical /attendance/{date}/{beaconId or empId}/logs/
            for (const key in data) {
                if (key.startsWith("-") || key === "undefined") continue;

                const resolvedEmpID = resolveEmployeeId(key, employees, beacons);
                if (!resolvedEmpID || !employees[resolvedEmpID]) continue;

                const logsObj = data[key].logs || {};
                
                // Explicitly sort logs by unixTimestamp (or timestamp string) ascending to guarantee chronological ordering!
                const logList = Object.values(logsObj).sort((a, b) => {
                    const timeA = a.unixTimestamp || (a.timestamp ? new Date(a.timestamp.replace(" ", "T")).getTime() / 1000 : 0);
                    const timeB = b.unixTimestamp || (b.timestamp ? new Date(b.timestamp.replace(" ", "T")).getTime() / 1000 : 0);
                    return timeA - timeB;
                });

                const latestLog = logList[logList.length - 1];

                // Determine Present vs Away status based on latest chronological event
                if (latestLog) {
                    const latestType = (latestLog.type || "").toUpperCase();
                    if (latestType === "ENTRY" || latestType === "ENTER") {
                        if (!active.includes(resolvedEmpID)) active.push(resolvedEmpID);
                        const idx = inactive.indexOf(resolvedEmpID);
                        if (idx > -1) inactive.splice(idx, 1);
                    } else if (latestType === "EXIT") {
                        if (!inactive.includes(resolvedEmpID) && !active.includes(resolvedEmpID)) {
                            inactive.push(resolvedEmpID);
                        }
                    }
                }

                // Calculate work sessions to derive total tracked hours
                const processed = processEventsToWorkSessions(logsObj);
                totals[resolvedEmpID] = processed.totalHours;
            }

            setActiveEmpIDs(active);
            setInactiveEmpIDs(inactive);
            setTodayTotals(totals);
        });

        return () => {
            unsubscribe();
            unsubGateways();
        };
    }, [targetDateStr, employees, beacons]);

    // Filter out raw firebase push keys (keys starting with - or not matching known employee registry)
    const allEmpIDs = Array.from(new Set([...Object.keys(employees), ...activeEmpIDs, ...inactiveEmpIDs]))
        .filter((id) => employees[id])
        .filter((id) => id && !id.startsWith("-") && id !== "undefined");

    // Organization-level Planned vs Actual metrics from shared helper
    const orgMetrics = calculateOrgWorkforceMetrics(employees, todayTotals, shifts, activeEmpIDs);

    // Phase 10: Time-aware Anomaly & Exception Detection Engine
    const exceptions = [];
    const currentHour = new Date().getHours();

    // Rule 1: Worker worked significantly less than expected (> 1 hour deficit)
    // Shift/time-aware: Only trigger shift deficit alerts after end-of-day or shift completion window (e.g. after 17:00)
    allEmpIDs.forEach((empID) => {
        const emp = employees[empID] || { name: empID };
        const shift = shifts[emp.shiftId] || DEFAULT_SHIFTS.SHIFT_DAY;
        const expected = parseFloat(shift.expectedWorkHours || 8.0);
        const actual = parseFloat(todayTotals[empID] || 0);
        const diff = actual - expected;

        // Only generate deficit alert if current time is near/after shift end (e.g., after 17:00) or if worker left and is no longer active
        const isShiftFinished = currentHour >= 17 || !activeEmpIDs.includes(empID);

        if (isShiftFinished && diff <= -1.0) {
            exceptions.push({
                id: `EX_UNDER_${empID}`,
                type: "UNDER_HOURS",
                empName: emp.name || empID,
                empID,
                title: "Significant Hours Deficit",
                reason: `Tracked ${actual}h vs ${expected}h expected (${diff.toFixed(1)}h difference).`,
                action: "Review attendance log with worker."
            });
        }
    });

    // Rule 2: Receiver Gateway Health check (Phase 11)
    const activeGatewayList = Object.values(gateways);
    if (activeGatewayList.length === 0) {
        exceptions.push({
            id: "EX_GW_NONE",
            type: "GATEWAY_OFFLINE",
            title: "GATEWAY_01 Status Notice",
            reason: "No active gateway heartbeats registered in past cycle.",
            action: "Verify ESP32 power and Wi-Fi connection."
        });
    } else {
        activeGatewayList.forEach((gw) => {
            const gwObj = (typeof gw === "object" && gw.status) ? gw.status : gw;
            const statusStr = (typeof gwObj === "object") ? (gwObj.status || "online") : gwObj;
            const receiverId = (typeof gwObj === "object") ? (gwObj.gatewayId || gwObj.receiverId || "GATEWAY_01") : "GATEWAY_01";

            if (statusStr !== "online") {
                exceptions.push({
                    id: `EX_GW_${receiverId}`,
                    type: "GATEWAY_OFFLINE",
                    title: `Gateway ${receiverId} Offline`,
                    reason: `Receiver status marked as ${statusStr}.`,
                    action: "Inspect ESP32 gateway power supply."
                });
            }
        });
    }

    const filteredEmpIDs = allEmpIDs.filter((empID) => {
        const empData = employees[empID] || {};
        const matchesSearch = (empData.name || empID).toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (empData.department || "").toLowerCase().includes(searchTerm.toLowerCase());
        
        if (!matchesSearch) return false;

        if (activeTab === "present") return activeEmpIDs.includes(empID);
        if (activeTab === "absent") return !activeEmpIDs.includes(empID);
        return true;
    });

    return (
        <div style={styles.container}>
            <div style={styles.navbar}>
                <NavBar />
            </div>

            <div style={styles.content}>
                {/* Header Banner */}
                <div style={styles.header}>
                    <div>
                        <div style={styles.topBadge}>
                            <span style={styles.liveDot}></span> BLE Gateway Active &bull; GATEWAY_01 Online ({targetDateStr})
                        </div>
                        <h1 style={styles.dashboardTitle}>Workforce Dashboard</h1>
                        <p style={styles.subtitle}>Owner & Manager Efficiency, Labor Cost, and Exception Monitor</p>
                    </div>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <button style={styles.registerBtn} onClick={() => navigate("/register")}>
                            + Add Worker
                        </button>
                    </div>
                </div>

                {/* Refined Top Summary Metrics Grid (PEOPLE -> TIME -> EFFICIENCY -> MONEY) */}
                <div style={styles.statsGrid}>
                    {/* 1. PEOPLE: PRESENT / TOTAL */}
                    <div style={styles.statCardDark}>
                        <div style={styles.statHeader}>PRESENT / TOTAL</div>
                        <div style={styles.statValueDark}>{activeEmpIDs.length} <span style={{fontSize:"16px", color:"#94A3B8"}}>/ {orgMetrics.scheduledWorkerCount}</span></div>
                        <div style={styles.statSubTextDark}>
                            {orgMetrics.scheduledWorkerCount === 0 ? "No scheduled workers" : `${orgMetrics.scheduledWorkerCount - activeEmpIDs.length} Away`}
                        </div>
                    </div>

                    {/* 2. TIME: AVG. TRACKED HOURS */}
                    <div style={styles.statCard}>
                        <div style={styles.statHeader}>AVG. TRACKED HOURS</div>
                        <div style={{ ...styles.statValue, color: "#10B981" }}>
                            {orgMetrics.scheduledWorkerCount === 0 ? "0h" : orgMetrics.formattedAvgTracked}
                        </div>
                        <div style={styles.statSubText}>
                            {orgMetrics.scheduledWorkerCount === 0 
                                ? "No scheduled workers" 
                                : `${orgMetrics.formattedAvgExpected} expected (${orgMetrics.formattedAvgVariance} vs plan)`}
                        </div>
                    </div>

                    {/* 3. EFFICIENCY: WORKFORCE UTILIZATION */}
                    <div style={styles.statCard}>
                        <div style={styles.statHeader}>WORKFORCE UTILIZATION</div>
                        <div style={{ ...styles.statValue, color: "#2563EB" }}>{orgMetrics.workforceUtilization}%</div>
                        <div style={styles.statSubText}>
                            {orgMetrics.totalActualHours}h tracked / {orgMetrics.totalExpectedHours}h expected
                        </div>
                    </div>

                    {/* 4. MONEY: ESTIMATED LABOR COST */}
                    <div style={styles.statCard}>
                        <div style={styles.statHeader}>EST. LABOR COST TODAY</div>
                        <div style={{ ...styles.statValue, color: "#6366F1" }}>₹{orgMetrics.totalEstimatedLaborCost.toLocaleString("en-IN")}</div>
                        <div style={styles.statSubText}>
                            ₹{orgMetrics.totalExpectedLaborCost.toLocaleString("en-IN")} planned ({orgMetrics.costVariance >= 0 ? "+" : "-"}₹{Math.abs(orgMetrics.costVariance).toFixed(0)} vs plan)
                        </div>
                    </div>
                </div>

                {/* Phase 10 & 11: Exception & Receiver Health Alert Banner */}
                {exceptions.length > 0 && (
                    <div style={styles.exceptionSection}>
                        <div style={styles.exceptionHeader}>
                            <RiAlertLine size={20} color="#D97706" />
                            <span style={styles.exceptionTitle}>Attention & Exception Monitor ({exceptions.length} alerts)</span>
                        </div>
                        <div style={styles.exceptionGrid}>
                            {exceptions.map((ex) => (
                                <div key={ex.id} style={styles.exceptionCard}>
                                    <div style={{ fontWeight: "700", color: "#92400E", fontSize: "14px" }}>{ex.title}</div>
                                    <div style={{ fontSize: "13px", color: "#B45309", marginTop: "4px" }}>{ex.reason}</div>
                                    <div style={{ fontSize: "12px", color: "#78350F", marginTop: "8px", fontStyle: "italic" }}>Action: {ex.action}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Receiver Health Status Widget (Phase 11) */}
                <div style={styles.receiverCard}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <RiCpuLine size={20} color="#10B981" />
                        <div>
                            <span style={{ fontWeight: "700", fontSize: "14px", color: "#0F172A" }}>GATEWAY_01 (Main Gate ESP32)</span>
                            <span style={{ fontSize: "12px", color: "#64748B", marginLeft: "10px" }}>IP: 192.168.1.45 &bull; Status: Online</span>
                        </div>
                    </div>
                    <span style={{ fontSize: "12px", color: "#059669", fontWeight: "600", backgroundColor: "#ECFDF5", padding: "4px 10px", borderRadius: "6px" }}>
                        Active Scan &bull; 3s Cycle
                    </span>
                </div>

                {/* Workforce Table */}
                <div style={styles.tablePanel}>
                    <div style={styles.tableHeaderBar}>
                        <div style={styles.tabButtons}>
                            <button 
                                style={activeTab === "all" ? styles.tabActive : styles.tabInactive}
                                onClick={() => setActiveTab("all")}
                            >
                                All Personnel ({allEmpIDs.length})
                            </button>
                            <button 
                                style={activeTab === "present" ? styles.tabActive : styles.tabInactive}
                                onClick={() => setActiveTab("present")}
                            >
                                Present ({activeEmpIDs.length})
                            </button>
                            <button 
                                style={activeTab === "absent" ? styles.tabActive : styles.tabInactive}
                                onClick={() => setActiveTab("absent")}
                            >
                                Away ({allEmpIDs.length - activeEmpIDs.length})
                            </button>
                        </div>

                        <input 
                            type="text"
                            placeholder="Search name or dept..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={styles.searchInput}
                        />
                    </div>

                    <div style={styles.tableContainer}>
                        {filteredEmpIDs.length === 0 ? (
                            <div style={styles.emptyState}>No workforce records found matching your filters.</div>
                        ) : (
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Worker Name</th>
                                        <th style={styles.th}>Shift Schedule</th>
                                        <th style={styles.th}>Expected</th>
                                        <th style={styles.th}>Tracked</th>
                                        <th style={styles.th}>Shift Variance</th>
                                        <th style={styles.th}>Est. Cost</th>
                                        <th style={styles.th}>Status</th>
                                        <th style={styles.th}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEmpIDs.map((empID) => {
                                        // Ignore raw firebase push keys
                                        if (empID.startsWith("-")) return null;

                                        const empData = employees[empID] || { name: empID, department: "Factory Floor", hourlyRate: 0, shiftId: "SHIFT_DAY" };
                                        const shift = shifts[empData.shiftId] || DEFAULT_SHIFTS.SHIFT_DAY;
                                        const isPresent = activeEmpIDs.includes(empID);
                                        const trackedHrs = parseFloat(todayTotals[empID] || 0);
                                        const expectedHrs = shift.expectedWorkHours || 8.0;
                                        const varMetrics = calculateWorkforceVariance(trackedHrs, expectedHrs);
                                        const estCost = trackedHrs * (empData.hourlyRate || 0);

                                        return (
                                            <tr key={empID} style={styles.tr}>
                                                <td style={styles.td}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                        <div style={styles.avatar}>
                                                            {empData.name ? empData.name.charAt(0).toUpperCase() : "?"}
                                                        </div>
                                                        <div>
                                                            <div style={styles.empName}>{empData.name}</div>
                                                            <div style={styles.empId}>{empID} &bull; {empData.department}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={styles.td}>
                                                    <span style={styles.deptTag}>{shift.name} ({shift.startTime}-{shift.endTime})</span>
                                                </td>
                                                <td style={styles.td}>{expectedHrs} hrs</td>
                                                <td style={styles.td}>
                                                    <span style={{ fontWeight: "700", color: "#0F172A" }}>{trackedHrs}</span> hrs
                                                </td>
                                                <td style={styles.td}>
                                                    <span style={{
                                                        fontWeight: "700",
                                                        color: varMetrics.isPositive ? "#059669" : "#DC2626",
                                                        backgroundColor: varMetrics.isPositive ? "#ECFDF5" : "#FEF2F2",
                                                        padding: "4px 8px",
                                                        borderRadius: "6px",
                                                        fontSize: "13px"
                                                    }}>
                                                        {varMetrics.formattedVariance}
                                                    </span>
                                                </td>
                                                <td style={styles.td}>
                                                    <span style={{ fontWeight: "700", color: "#0F172A" }}>₹{estCost.toFixed(0)}</span>
                                                </td>
                                                <td style={styles.td}>
                                                    <span style={isPresent ? styles.badgeActive : styles.badgeInactive}>
                                                        {isPresent ? "Live On-Site" : "Away / Off"}
                                                    </span>
                                                </td>
                                                <td style={styles.td}>
                                                    <Link to={`/employee/${empID}`} style={styles.actionBtn}>
                                                        Analytics &rarr;
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { display: "flex", minHeight: "100vh", fontFamily: "'Inter', sans-serif", backgroundColor: "#F8FAFC" },
    navbar: { width: "80px", backgroundColor: "#FFFFFF", borderRight: "1px solid #E2E8F0", position: "fixed", top: 0, bottom: 0, left: 0, zIndex: 10 },
    content: { marginLeft: "80px", flex: 1, padding: "40px", boxSizing: "border-box", maxWidth: "1400px" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" },
    topBadge: { display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "600", color: "#059669", backgroundColor: "#ECFDF5", padding: "4px 10px", borderRadius: "20px", marginBottom: "8px" },
    liveDot: { width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#10B981" },
    dashboardTitle: { fontSize: "32px", fontWeight: "700", margin: "0 0 4px 0", color: "#0F172A", letterSpacing: "-0.02em" },
    subtitle: { fontSize: "15px", color: "#64748B", margin: 0 },
    registerBtn: { padding: "12px 20px", backgroundColor: "#0F172A", color: "#FFFFFF", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" },
    
    statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "28px" },
    statCardDark: { backgroundColor: "#0F172A", padding: "24px", borderRadius: "16px", color: "#FFFFFF" },
    statHeader: { fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", color: "#94A3B8" },
    statValueDark: { fontSize: "36px", fontWeight: "700", marginTop: "12px", color: "#FFFFFF", letterSpacing: "-0.02em" },
    statSubTextDark: { fontSize: "13px", color: "#64748B", marginTop: "4px" },
    
    statCard: { backgroundColor: "#FFFFFF", padding: "24px", borderRadius: "16px", border: "1px solid #E2E8F0" },
    statValue: { fontSize: "36px", fontWeight: "700", marginTop: "12px", color: "#0F172A", letterSpacing: "-0.02em" },
    statSubText: { fontSize: "13px", color: "#64748B", marginTop: "4px" },

    exceptionSection: { backgroundColor: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: "16px", padding: "20px 24px", marginBottom: "28px" },
    exceptionHeader: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" },
    exceptionTitle: { fontWeight: "700", fontSize: "15px", color: "#92400E" },
    exceptionGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" },
    exceptionCard: { backgroundColor: "#FFFFFF", padding: "14px 18px", borderRadius: "10px", border: "1px solid #FCD34D" },

    receiverCard: { backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" },

    tablePanel: { backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8F0", overflow: "hidden" },
    tableHeaderBar: { padding: "20px 24px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" },
    tabButtons: { display: "flex", gap: "8px" },
    tabActive: { padding: "8px 16px", backgroundColor: "#F1F5F9", color: "#0F172A", border: "none", borderRadius: "8px", fontWeight: "600", fontSize: "14px", cursor: "pointer" },
    tabInactive: { padding: "8px 16px", backgroundColor: "transparent", color: "#64748B", border: "none", borderRadius: "8px", fontWeight: "500", fontSize: "14px", cursor: "pointer" },
    searchInput: { padding: "8px 16px", border: "1px solid #CBD5E1", borderRadius: "8px", fontSize: "14px", width: "220px", fontFamily: "inherit" },
    
    tableContainer: { overflowX: "auto" },
    emptyState: { padding: "40px", textAlign: "center", color: "#94A3B8", fontSize: "15px" },
    table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
    th: { padding: "16px 24px", fontSize: "12px", fontWeight: "600", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #E2E8F0", backgroundColor: "#F8FAFC" },
    tr: { borderBottom: "1px solid #F1F5F9" },
    td: { padding: "16px 24px", verticalAlign: "middle", fontSize: "14px", color: "#334155" },
    avatar: { width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", color: "#475569", fontWeight: "600", fontSize: "14px" },
    empName: { fontWeight: "600", color: "#0F172A", fontSize: "15px" },
    empId: { color: "#64748B", fontSize: "13px", marginTop: "2px" },
    deptTag: { backgroundColor: "#F1F5F9", padding: "4px 8px", borderRadius: "6px", fontSize: "13px", color: "#475569", fontWeight: "500" },
    badgeActive: { padding: "4px 10px", backgroundColor: "#ECFDF5", color: "#059669", borderRadius: "20px", fontSize: "12px", fontWeight: "600" },
    badgeInactive: { padding: "4px 10px", backgroundColor: "#F1F5F9", color: "#64748B", borderRadius: "20px", fontSize: "12px", fontWeight: "600" },
    actionBtn: { display: "inline-block", padding: "8px 14px", backgroundColor: "#0F172A", color: "#FFFFFF", textDecoration: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "500" },
};

export default Home;