import React, { useEffect, useState } from "react";
import { database } from "../firebase";
import { ref, onValue, get, child } from "firebase/database";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import NavBar from "./Navbar";
import { 
    processEventsToWorkSessions, 
    fetchShifts, 
    DEFAULT_SHIFTS,
    calculateWorkforceVariance,
    getLocalDateString,
    fetchEmployees,
    fetchBeacons,
    resolveEmployeeId,
    isAttendanceTransition
} from "../dbOperations";

function EmployeeDetails() {
    const { id: rawEmpID } = useParams();
    const navigate = useNavigate();

    let empID = rawEmpID;
    if (rawEmpID === "emp1") empID = "EMP001";
    if (rawEmpID === "emp2") empID = "EMP002";

    const [employeeInfo, setEmployeeInfo] = useState({
        name: empID,
        department: "Factory Floor",
        hourlyRate: 700,
        beaconId: "beacon_001",
        shiftId: "SHIFT_DAY"
    });

    const [shiftInfo, setShiftInfo] = useState(DEFAULT_SHIFTS.SHIFT_DAY);

    const [details, setDetails] = useState({
        activeHoursToday: 0,
        presentDays: 0,
        avgActiveHours: 0,
    });
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [sessionData, setSessionData] = useState({
        sessions: [],
        totalHours: 0,
        rawLogs: []
    });
    const [selectedMonth, setSelectedMonth] = useState(null);

    // Fetch employee metadata and mapped shift details
    useEffect(() => {
        const fetchEmpMeta = async () => {
            const dbRef = ref(database);
            const snapshot = await get(child(dbRef, `employees/${empID}`));
            if (snapshot.exists()) {
                const empData = snapshot.val();
                setEmployeeInfo(empData);
                
                const shiftSnap = await fetchShifts();
                if (shiftSnap && shiftSnap[empData.shiftId]) {
                    setShiftInfo(shiftSnap[empData.shiftId]);
                }
            }
        };
        fetchEmpMeta();
    }, [empID]);

    const formatTimestampTo12Hour = (timestamp) => {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return timestamp;
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${hours}:${formattedMinutes} ${ampm}`;
    };

    useEffect(() => {
        let unsubscribe = null;
        let cancelled = false;

        const subscribeToAttendance = async () => {
            const [employeeMap, beaconMap] = await Promise.all([
                fetchEmployees(),
                fetchBeacons()
            ]);
            if (cancelled) return;

            const now = new Date();
            const today = getLocalDateString(now);
            const firstDayOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
            const attendanceRef = ref(database, "attendance");

            unsubscribe = onValue(attendanceRef, (snapshot) => {
                const data = snapshot.val() || {};
                let totalActiveHoursToday = 0;
                let totalPresentDays = 0;
                let totalActiveHoursMonth = 0;

                Object.entries(data).forEach(([date, dateData]) => {
                    if (date < firstDayOfMonth || date > today) return;

                    const dailyLogs = {};
                    Object.entries(dateData || {}).forEach(([key, employeeRecord]) => {
                        if (resolveEmployeeId(key, employeeMap, beaconMap) !== empID) return;
                        Object.assign(dailyLogs, employeeRecord?.logs || {});
                    });

                    const dailySeconds = processEventsToWorkSessions(dailyLogs).totalTrackedSeconds;
                    if (dailySeconds > 0) totalPresentDays++;
                    totalActiveHoursMonth += dailySeconds;
                    if (date === today) totalActiveHoursToday = dailySeconds;
                });

                setDetails({
                    activeHoursToday: (totalActiveHoursToday / 3600).toFixed(2),
                    presentDays: totalPresentDays,
                    avgActiveHours: totalPresentDays > 0
                        ? (totalActiveHoursMonth / totalPresentDays / 3600).toFixed(2)
                        : 0
                });
            });
        };

        subscribeToAttendance();
        return () => {
            cancelled = true;
            if (unsubscribe) unsubscribe();
        };
    }, [empID]);

    useEffect(() => {
        if (!selectedDate) return;
        const formattedDate = getLocalDateString(selectedDate);

        const loadSessions = async () => {
            const dbRef = ref(database);
            const [dateSnapshot, employeeMap, beaconMap] = await Promise.all([
                get(child(dbRef, `attendance/${formattedDate}`)),
                fetchEmployees(),
                fetchBeacons()
            ]);
            const rawEvents = {};
            const dateData = dateSnapshot.val() || {};
            Object.entries(dateData).forEach(([key, employeeRecord]) => {
                if (resolveEmployeeId(key, employeeMap, beaconMap) === empID) {
                    Object.assign(rawEvents, employeeRecord?.logs || {});
                }
            });

            const transitionEvents = Object.fromEntries(
                Object.entries(rawEvents).filter(([, event]) => isAttendanceTransition(event))
            );
            const processed = processEventsToWorkSessions(transitionEvents);
            const rawLogList = Object.values(transitionEvents)
                .sort((a, b) => {
                    const timeA = a.unixTimestamp || (a.timestamp ? new Date(a.timestamp.replace(" ", "T")).getTime() / 1000 : 0);
                    const timeB = b.unixTimestamp || (b.timestamp ? new Date(b.timestamp.replace(" ", "T")).getTime() / 1000 : 0);
                    return timeA - timeB;
                })
                .map(ev => ({
                    ...ev,
                    formattedTime: formatTimestampTo12Hour(ev.timestamp)
                }));

            setSessionData({
                sessions: processed.sessions,
                totalHours: processed.totalHours,
                rawLogs: rawLogList
            });
        };

        loadSessions();
    }, [selectedDate, empID]);

    const exportMonthlyData = () => {
        if (!selectedMonth) {
            alert("Please select a month to export data.");
            return;
        }
        const year = selectedMonth.getFullYear();
        const month = String(selectedMonth.getMonth() + 1).padStart(2, "0");
        const firstDayOfMonth = `${year}-${month}-01`;
        const lastDayOfMonth = `${year}-${month}-${new Date(year, month, 0).getDate()}`;
        const exportData = async () => {
            const dbRef = ref(database);
            const [attendanceSnapshot, employeeMap, beaconMap] = await Promise.all([
                get(child(dbRef, "attendance")),
                fetchEmployees(),
                fetchBeacons()
            ]);
            const data = attendanceSnapshot.val();
            if (!data) {
                alert("No data available for the selected month.");
                return;
            }
            const csvRows = ["Date,Active Hours (Hours),Entry/Exit Logs"];
            for (const date in data) {
                if (date >= firstDayOfMonth && date <= lastDayOfMonth) {
                    const logsById = {};
                    Object.entries(data[date] || {}).forEach(([key, employeeRecord]) => {
                        if (resolveEmployeeId(key, employeeMap, beaconMap) === empID) {
                            Object.entries(employeeRecord?.logs || {}).forEach(([eventId, event]) => {
                                if (isAttendanceTransition(event)) {
                                    logsById[eventId] = event;
                                }
                            });
                        }
                    });
                    if (Object.keys(logsById).length > 0) {
                        const logs = Object.values(logsById);
                        const activeHours = (processEventsToWorkSessions(logsById).totalTrackedSeconds / 3600).toFixed(2);
                        const formattedLogs = logs
                            .map((log) => `${formatTimestampTo12Hour(log.timestamp)} - ${log.type}`)
                            .join("; ");
                        csvRows.push(`${date},${activeHours},"${formattedLogs}"`);
                    }
                }
            }
            const csvContent = csvRows.join("\n");
            const blob = new Blob([csvContent], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${employeeInfo.name || empID}-${year}-${month}-monthly-logs.csv`;
            a.click();
            URL.revokeObjectURL(url);
        };

        exportData();
    };

    // Phase 7 & 9 Metrics Calculation
    const expectedHours = shiftInfo.expectedWorkHours || 8.0;
    const trackedToday = parseFloat(details.activeHoursToday) || 0;
    const varMetrics = calculateWorkforceVariance(trackedToday, expectedHours);
    const estLaborCostToday = trackedToday * (employeeInfo.hourlyRate || 0);

    return (
        <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#F8FAFC", fontFamily: "'Inter', sans-serif" }}>
            <div style={{ width: "80px", position: "fixed", top: 0, bottom: 0, left: 0, backgroundColor: "#FFFFFF", borderRight: "1px solid #E2E8F0" }}>
                <NavBar />
            </div>

            <div style={{ marginLeft: "80px", flex: 1, padding: "40px", maxWidth: "1200px" }}>
                <div style={{ marginBottom: "24px" }}>
                    <button onClick={() => navigate("/home")} style={{ padding: "10px 20px", borderRadius: "8px", border: "1px solid #E2E8F0", background: "#FFFFFF", color: "#475569", cursor: "pointer", fontWeight: "500", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px", transition: "background-color 0.2s" }}>
                        &larr; Back to Dashboard
                    </button>
                </div>

                {/* Worker Identity & Shift Banner */}
                <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "28px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
                    <div>
                        <h1 style={{ margin: "0 0 6px 0", fontSize: "28px", fontWeight: "700", color: "#0F172A", letterSpacing: "-0.02em" }}>{employeeInfo.name}</h1>
                        <p style={{ margin: 0, color: "#64748B", fontSize: "14px" }}>
                            ID: {empID} &bull; Dept: {employeeInfo.department} &bull; Beacon Tag: {employeeInfo.beaconId || "beacon_001"}
                        </p>
                    </div>
                    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                        <div style={{ padding: "10px 16px", backgroundColor: "#F1F5F9", borderRadius: "10px", textAlign: "right" }}>
                            <div style={{ fontSize: "11px", color: "#64748B", textTransform: "uppercase", fontWeight: "700" }}>Shift Schedule</div>
                            <div style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A", marginTop: "2px" }}>{shiftInfo.name} ({shiftInfo.startTime}-{shiftInfo.endTime})</div>
                        </div>
                        <div style={{ padding: "10px 16px", backgroundColor: "#F1F5F9", borderRadius: "10px", textAlign: "right" }}>
                            <div style={{ fontSize: "11px", color: "#64748B", textTransform: "uppercase", fontWeight: "700" }}>Configured Rate</div>
                            <div style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A", marginTop: "2px" }}>₹{employeeInfo.hourlyRate}/hr</div>
                        </div>
                    </div>
                </div>

                {/* Phase 9: Comprehensive Performance & Financial Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "32px" }}>
                    <div style={{ background: "#FFFFFF", padding: "20px", borderRadius: "16px", border: "1px solid #E2E8F0" }}>
                        <span style={{ fontSize: "11px", color: "#64748B", textTransform: "uppercase", fontWeight: "700" }}>Tracked Today</span>
                        <h3 style={{ margin: "8px 0 0 0", fontSize: "28px", color: "#0F172A", fontWeight: "700" }}>{details.activeHoursToday} <span style={{fontSize:"14px", color:"#94A3B8"}}>hrs</span></h3>
                        <div style={{ fontSize: "12px", color: "#64748B", marginTop: "4px" }}>Expected: {expectedHours} hrs</div>
                    </div>

                    <div style={{ background: "#FFFFFF", padding: "20px", borderRadius: "16px", border: "1px solid #E2E8F0" }}>
                        <span style={{ fontSize: "11px", color: "#64748B", textTransform: "uppercase", fontWeight: "700" }}>Shift Variance</span>
                        <h3 style={{ margin: "8px 0 0 0", fontSize: "28px", color: varMetrics.isPositive ? "#059669" : "#DC2626", fontWeight: "700" }}>{varMetrics.formattedVariance}</h3>
                        <div style={{ fontSize: "12px", color: "#64748B", marginTop: "4px" }}>Utilization: {varMetrics.utilization}%</div>
                    </div>

                    <div style={{ background: "#FFFFFF", padding: "20px", borderRadius: "16px", border: "1px solid #E2E8F0" }}>
                        <span style={{ fontSize: "11px", color: "#64748B", textTransform: "uppercase", fontWeight: "700" }}>Est. Labor Cost Today</span>
                        <h3 style={{ margin: "8px 0 0 0", fontSize: "28px", color: "#6366F1", fontWeight: "700" }}>₹{estLaborCostToday.toFixed(0)}</h3>
                        <div style={{ fontSize: "12px", color: "#64748B", marginTop: "4px" }}>{trackedToday} hrs × ₹{employeeInfo.hourlyRate}</div>
                    </div>

                    <div style={{ background: "#FFFFFF", padding: "20px", borderRadius: "16px", border: "1px solid #E2E8F0" }}>
                        <span style={{ fontSize: "11px", color: "#64748B", textTransform: "uppercase", fontWeight: "700" }}>Monthly Attendance</span>
                        <h3 style={{ margin: "8px 0 0 0", fontSize: "28px", color: "#0F172A", fontWeight: "700" }}>{details.presentDays} <span style={{fontSize:"14px", color:"#94A3B8"}}>days</span></h3>
                        <div style={{ fontSize: "12px", color: "#64748B", marginTop: "4px" }}>Daily Avg: {details.avgActiveHours} hrs</div>
                    </div>
                </div>

                {/* Event Model & Work Session Breakdown */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                    <div style={{ backgroundColor: "#FFFFFF", padding: "28px", borderRadius: "16px", border: "1px solid #E2E8F0" }}>
                        <h3 style={{ marginTop: 0, marginBottom: "20px", fontSize: "16px", fontWeight: "700" }}>Work Sessions & Duration</h3>
                        <div style={{ marginBottom: "20px" }}>
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Select date to inspect sessions"
                                customInput={<input style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "14px", fontFamily: "inherit" }} />}
                            />
                        </div>

                        {selectedDate && (
                            <div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid #F1F5F9" }}>
                                    <span style={{ fontWeight: "600", color: "#334155" }}>{selectedDate.toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                                    <span style={{ backgroundColor: "#ECFDF5", padding: "4px 12px", borderRadius: "20px", fontSize: "13px", fontWeight: "700", color: "#059669" }}>Total: {sessionData.totalHours} hrs</span>
                                </div>

                                {sessionData.sessions.length === 0 ? (
                                    <p style={{ color: "#94A3B8", textAlign: "center", padding: "20px 0" }}>No work sessions recorded for this date.</p>
                                ) : (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                        {sessionData.sessions.map((sess, index) => (
                                            <div key={index} style={{ padding: "12px 16px", background: "#F8FAFC", borderRadius: "10px", border: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <div>
                                                    <div style={{ fontWeight: "700", fontSize: "14px", color: "#0F172A" }}>Session #{index + 1}: {sess.formattedRange}</div>
                                                    <div style={{ fontSize: "12px", color: "#64748B", marginTop: "2px" }}>Receiver: {sess.receiverId}</div>
                                                </div>
                                                <span style={{ fontWeight: "700", fontSize: "13px", color: sess.isOngoing ? "#2563EB" : "#0F172A", backgroundColor: sess.isOngoing ? "#EFF6FF" : "#F1F5F9", padding: "4px 10px", borderRadius: "6px" }}>
                                                    {sess.formattedDuration}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div style={{ backgroundColor: "#FFFFFF", padding: "28px", borderRadius: "16px", border: "1px solid #E2E8F0" }}>
                        <h3 style={{ marginTop: 0, marginBottom: "20px", fontSize: "16px", fontWeight: "700" }}>Raw Gateway Detection Logs</h3>
                        <p style={{ color: "#64748B", fontSize: "13px", marginBottom: "16px" }}>
                            Independent detection events (`ENTER` / `EXIT`) captured by BLE gateways.
                        </p>

                        {sessionData.rawLogs.length === 0 ? (
                            <p style={{ color: "#94A3B8", textAlign: "center", padding: "20px 0" }}>No detection events logged on this date.</p>
                        ) : (
                            <ul style={{ listStyleType: "none", paddingLeft: 0, margin: 0, maxHeight: "240px", overflowY: "auto", display: "flex", flexDirection: "column" }}>
                                {sessionData.rawLogs.slice().reverse().map((log, index) => (
                                    <li key={index} style={{ padding: "10px 14px", background: "#F8FAFC", borderRadius: "8px", marginBottom: "8px", borderLeft: (log.type === "ENTER" || log.type === "entry") ? "4px solid #10B981" : "4px solid #64748B", display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                                        <strong style={{ color: (log.type === "ENTER" || log.type === "entry") ? "#059669" : "#475569" }}>
                                            {(log.type || "EVENT").toUpperCase()}
                                        </strong>
                                        <span style={{ color: "#64748B" }}>{log.formattedTime} &bull; RSSI {log.rssi || -60}dBm</span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: "20px", marginTop: "20px" }}>
                            <DatePicker
                                selected={selectedMonth}
                                onChange={(date) => setSelectedMonth(date)}
                                dateFormat="MMMM yyyy"
                                showMonthYearPicker
                                placeholderText="Select month to export"
                                customInput={<input style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "14px", fontFamily: "inherit" }} />}
                            />
                            <button onClick={exportMonthlyData} style={{ marginTop: "12px", width: "100%", padding: "12px", backgroundColor: "#0F172A", color: "#FFFFFF", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}>
                                Download Monthly CSV
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmployeeDetails;