import { database } from "./firebase";
import { ref, get, set, push, child } from "firebase/database";

// Default Shift Configurations
export const DEFAULT_SHIFTS = {
    SHIFT_DAY: {
        id: "SHIFT_DAY",
        name: "Standard Day Shift",
        startTime: "09:00",
        endTime: "18:00",
        expectedWorkHours: 8.0, // 9h span minus 1h break = 8.0 expected hours
        status: "active"
    },
    SHIFT_NIGHT: {
        id: "SHIFT_NIGHT",
        name: "Night Production Shift",
        startTime: "21:00",
        endTime: "06:00",
        expectedWorkHours: 8.0,
        status: "active"
    }
};

// Phase 12: Multi-Receiver Gateway & Zone Registry
export const DEFAULT_GATEWAYS = {
    GATEWAY_01: {
        receiverId: "GATEWAY_01",
        zoneId: "ZONE_ENTRANCE",
        zoneName: "Main Gate & Entrance",
        status: "online",
        ip: "192.168.1.45"
    },
    GATEWAY_02: {
        receiverId: "GATEWAY_02",
        zoneId: "ZONE_ASSEMBLY",
        zoneName: "Assembly & Machining Floor",
        status: "online",
        ip: "192.168.1.46"
    },
    GATEWAY_03: {
        receiverId: "GATEWAY_03",
        zoneId: "ZONE_WAREHOUSE",
        zoneName: "Packaging & Warehouse",
        status: "online",
        ip: "192.168.1.47"
    }
};

// Seed default employees, shifts, gateways, and beacons if they don't exist
export const initializeRegistry = async () => {
    try {
        const dbRef = ref(database);
        
        // Seed gateways
        const gwSnap = await get(child(dbRef, "gateways"));
        if (!gwSnap.exists()) {
            await set(ref(database, "gateways"), DEFAULT_GATEWAYS);
        }

        // Seed shifts
        const shiftSnap = await get(child(dbRef, "shifts"));
        if (!shiftSnap.exists()) {
            await set(ref(database, "shifts"), DEFAULT_SHIFTS);
        }

        // Seed employees with shifts
        const empSnap = await get(child(dbRef, "employees"));
        if (!empSnap.exists()) {
            await set(ref(database, "employees"), {
                EMP001: {
                    id: "EMP001",
                    name: "Anmol Patil",
                    department: "Engineering & IoT",
                    hourlyRate: 700,
                    beaconId: "beacon_001",
                    shiftId: "SHIFT_DAY",
                    status: "active"
                },
                EMP002: {
                    id: "EMP002",
                    name: "Manthan Patil",
                    department: "Operations",
                    hourlyRate: 650,
                    beaconId: "beacon_002",
                    shiftId: "SHIFT_DAY",
                    status: "active"
                }
            });
        }

        // Seed beacons
        const beaconSnap = await get(child(dbRef, "beacons"));
        if (!beaconSnap.exists()) {
            await set(ref(database, "beacons"), {
                beacon_001: {
                    id: "beacon_001",
                    advertisedName: "Emp1Anmol@comp&iot",
                    employeeId: "EMP001",
                    status: "active"
                },
                beacon_002: {
                    id: "beacon_002",
                    advertisedName: "Emp2Manthan@comp&iot",
                    employeeId: "EMP002",
                    status: "active"
                }
            });
        }
    } catch (error) {
        console.error("Error initializing registry:", error);
    }
};

// Calculate planned vs actual workforce variance & utilization metrics
export const calculateWorkforceVariance = (actualTrackedHours = 0, expectedHours = 8.0) => {
    const actual = parseFloat(actualTrackedHours) || 0;
    const expected = parseFloat(expectedHours) || 8.0;

    const hourVariance = actual - expected; // e.g. 7.33 - 8.0 = -0.67 hrs (-40 mins)
    
    // Workforce Utilization Formula: (Actual Tracked Hours / Expected Hours) * 100
    const utilization = expected > 0 ? ((actual / expected) * 100).toFixed(1) : "0.0";

    const varianceMinutes = Math.round(hourVariance * 60);
    const absMins = Math.abs(varianceMinutes);
    const varHoursPart = Math.floor(absMins / 60);
    const varMinsPart = absMins % 60;

    let formattedVariance = "0m";
    if (varianceMinutes > 0) {
        formattedVariance = `+${varHoursPart > 0 ? `${varHoursPart}h ` : ""}${varMinsPart}m`;
    } else if (varianceMinutes < 0) {
        formattedVariance = `-${varHoursPart > 0 ? `${varHoursPart}h ` : ""}${varMinsPart}m`;
    }

    return {
        actualHours: actual,
        expectedHours: expected,
        hourVariance: parseFloat(hourVariance.toFixed(2)),
        formattedVariance,
        utilization: parseFloat(utilization),
        isPositive: hourVariance >= 0
    };
};

// Calculate organization-level workforce efficiency metrics from a shared dataset
export const calculateOrgWorkforceMetrics = (employeeDataMap = {}, todayTotalsMap = {}, shiftMap = {}, activeEmpIDs = []) => {
    // Combine employees registered in DB + active IDs detected today
    const allKnownIDs = Array.from(new Set([...Object.keys(employeeDataMap), ...Object.keys(todayTotalsMap), ...activeEmpIDs]))
        .filter((empID) => empID && !empID.startsWith("-"));

    const scheduledEmpIDs = allKnownIDs.filter((empID) => {
        const emp = employeeDataMap[empID];
        // Exclude inactive employees or workers explicitly on leave
        if (emp && (emp.status === "inactive" || emp.onLeave === true)) return false;
        return true;
    });

    const scheduledWorkerCount = scheduledEmpIDs.length;

    let totalExpectedHours = 0;
    let totalActualHours = 0;
    let totalExpectedLaborCost = 0;
    let totalEstimatedLaborCost = 0;
    let totalPositiveVariance = 0;
    let totalNegativeVariance = 0;

    scheduledEmpIDs.forEach((empID) => {
        const emp = employeeDataMap[empID] || {};
        const shift = shiftMap[emp.shiftId] || DEFAULT_SHIFTS.SHIFT_DAY;
        const expected = parseFloat(shift.expectedWorkHours) || 8.0;
        const actual = parseFloat(todayTotalsMap[empID] || 0);
        const rate = parseFloat(emp.hourlyRate) || 0;

        totalExpectedHours += expected;
        totalActualHours += actual;

        totalExpectedLaborCost += (expected * rate);
        totalEstimatedLaborCost += (actual * rate);

        const varHrs = actual - expected;
        if (varHrs >= 0) {
            totalPositiveVariance += varHrs;
        } else {
            totalNegativeVariance += Math.abs(varHrs);
        }
    });

    // Average calculations
    const avgTrackedHoursDecimal = scheduledWorkerCount > 0 ? totalActualHours / scheduledWorkerCount : 0;
    const avgExpectedHoursDecimal = scheduledWorkerCount > 0 ? totalExpectedHours / scheduledWorkerCount : 0;
    const avgVarianceDecimal = avgTrackedHoursDecimal - avgExpectedHoursDecimal;

    // Format average tracked hours as "7h 42m" or "0h"
    const formatHoursMinutes = (decimalHours) => {
        const absVal = Math.abs(decimalHours);
        const hrs = Math.floor(absVal);
        const mins = Math.round((absVal - hrs) * 60);
        if (mins === 0) return `${hrs}h`;
        return `${hrs}h ${mins}m`;
    };

    const formattedAvgTracked = formatHoursMinutes(avgTrackedHoursDecimal);
    const formattedAvgExpected = formatHoursMinutes(avgExpectedHoursDecimal);

    const varianceMinutes = Math.round(avgVarianceDecimal * 60);
    const absMins = Math.abs(varianceMinutes);
    const varHoursPart = Math.floor(absMins / 60);
    const varMinsPart = absMins % 60;

    let formattedAvgVariance = "0m";
    if (varianceMinutes > 0) {
        formattedAvgVariance = `+${varHoursPart > 0 ? `${varHoursPart}h ` : ""}${varMinsPart}m`;
    } else if (varianceMinutes < 0) {
        formattedAvgVariance = `-${varHoursPart > 0 ? `${varHoursPart}h ` : ""}${varMinsPart}m`;
    }

    // Workforce Utilization Formula: (Total Actual Tracked Hours / Total Expected Hours) * 100
    const workforceUtilization = totalExpectedHours > 0 
        ? ((totalActualHours / totalExpectedHours) * 100).toFixed(1)
        : "0.0";

    const costVariance = totalEstimatedLaborCost - totalExpectedLaborCost;

    return {
        scheduledWorkerCount,
        totalExpectedHours: parseFloat(totalExpectedHours.toFixed(1)),
        totalActualHours: parseFloat(totalActualHours.toFixed(1)),
        avgTrackedHoursDecimal: parseFloat(avgTrackedHoursDecimal.toFixed(2)),
        avgExpectedHoursDecimal: parseFloat(avgExpectedHoursDecimal.toFixed(2)),
        formattedAvgTracked,
        formattedAvgExpected,
        formattedAvgVariance,
        workforceUtilization: parseFloat(workforceUtilization),
        totalExpectedLaborCost,
        totalEstimatedLaborCost,
        costVariance
    };
};

// Record an event-oriented attendance event independently to /attendance/
export const recordAttendanceEvent = async ({
    dateStr,
    beaconId = "Emp1Anmol@comp&iot",
    type, // "ENTRY" or "EXIT"
    timestampStr,
    unixTimestamp,
    receiverId = "GATEWAY_01",
    zoneId = "ZONE_ENTRANCE",
    rssi = -60
}) => {
    const today = dateStr || new Date().toISOString().split("T")[0];
    const ts = unixTimestamp || Math.floor(Date.now() / 1000);
    const eventType = type.toUpperCase();
    const eventId = `${ts}_${eventType}`;
    
    const eventRef = ref(database, `attendance/${today}/${beaconId}/logs/${eventId}`);
    const eventData = {
        beaconId,
        gatewayId: receiverId,
        zoneId,
        type: eventType,
        timestamp: timestampStr || new Date().toISOString().replace("T", " ").slice(0, 19),
        unixTimestamp: ts,
        rssi,
        eventSource: "APPLICATION_LAYER"
    };
    await set(eventRef, eventData);
    return eventData;
};

// Convert raw independent attendance events into work sessions and calculate total time
export const processEventsToWorkSessions = (rawEvents = {}) => {
    // Explicitly sort logs by unixTimestamp ascending
    const eventList = Object.values(rawEvents).sort((a, b) => {
        const timeA = a.unixTimestamp || new Date(a.timestamp).getTime() / 1000 || 0;
        const timeB = b.unixTimestamp || new Date(b.timestamp).getTime() / 1000 || 0;
        return timeA - timeB;
    });

    if (eventList.length === 0) {
        return { sessions: [], totalTrackedSeconds: 0, totalHours: "0.00" };
    }

    const sessions = [];
    let currentEntry = null;

    eventList.forEach((ev) => {
        const evType = (ev.type || "").toUpperCase();
        if (evType === "ENTRY" || evType === "ENTER") {
            if (!currentEntry) {
                currentEntry = ev;
            }
        } else if ((evType === "EXIT") && currentEntry) {
            const startTime = currentEntry.unixTimestamp ? currentEntry.unixTimestamp * 1000 : new Date(currentEntry.timestamp).getTime();
            const endTime = ev.unixTimestamp ? ev.unixTimestamp * 1000 : new Date(ev.timestamp).getTime();
            const durationMs = Math.max(0, endTime - startTime);
            const durationSec = Math.floor(durationMs / 1000);

            const startHours = String(new Date(startTime).getHours()).padStart(2, "0");
            const startMins = String(new Date(startTime).getMinutes()).padStart(2, "0");
            const endHours = String(new Date(endTime).getHours()).padStart(2, "0");
            const endMins = String(new Date(endTime).getMinutes()).padStart(2, "0");

            const hours = Math.floor(durationSec / 3600);
            const mins = Math.floor((durationSec % 3600) / 60);

            sessions.push({
                sessionId: `SESS_${currentEntry.unixTimestamp || Date.now()}`,
                enterTime: currentEntry.timestamp,
                exitTime: ev.timestamp,
                formattedRange: `${startHours}:${startMins} → ${endHours}:${endMins}`,
                durationSeconds: durationSec,
                formattedDuration: `${hours}h ${mins}m`,
                receiverId: ev.gatewayId || ev.receiverId || "GATEWAY_01"
            });

            currentEntry = null;
        }
    });

    // Handle ongoing unclosed session (Currently ENTRYed)
    if (currentEntry) {
        const startTime = currentEntry.unixTimestamp ? currentEntry.unixTimestamp * 1000 : new Date(currentEntry.timestamp).getTime();
        const endTime = Date.now();
        const durationMs = Math.max(0, endTime - startTime);
        const durationSec = Math.floor(durationMs / 1000);

        const hours = Math.floor(durationSec / 3600);
        const mins = Math.floor((durationSec % 3600) / 60);

        sessions.push({
            sessionId: `SESS_ONGOING_${currentEntry.unixTimestamp}`,
            enterTime: currentEntry.timestamp,
            exitTime: null,
            formattedRange: `${currentEntry.timestamp ? currentEntry.timestamp.slice(11, 16) : "NOW"} → LIVE ON PREMISES`,
            durationSeconds: durationSec,
            formattedDuration: `${hours}h ${mins}m (Live)`,
            isOngoing: true,
            receiverId: currentEntry.gatewayId || currentEntry.receiverId || "GATEWAY_01"
        });
    }

    const totalTrackedSeconds = sessions.reduce((acc, s) => acc + s.durationSeconds, 0);
    const totalHours = (totalTrackedSeconds / 3600).toFixed(2);

    return {
        sessions,
        totalTrackedSeconds,
        totalHours
    };
};

// Fetch attendance events from canonical /attendance/ path
export const fetchAttendanceEvents = async (dateStr, beaconOrEmpId) => {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, `attendance/${dateStr}/${beaconOrEmpId}/logs`));
    return snapshot.exists() ? snapshot.val() : {};
};

// Fetch shift configurations
export const fetchShifts = async () => {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, "shifts"));
    return snapshot.exists() ? snapshot.val() : DEFAULT_SHIFTS;
};

// Fetch gateway configurations & active zone map
export const fetchGateways = async () => {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, "gateways"));
    return snapshot.exists() ? snapshot.val() : DEFAULT_GATEWAYS;
};

// Add or update an employee
export const addEmployee = async (employeeData) => {
    const empID = employeeData.id || `EMP${Date.now().toString().slice(-4)}`;
    const employeeRef = ref(database, `employees/${empID}`);
    await set(employeeRef, {
        id: empID,
        name: employeeData.name || "Unnamed Employee",
        department: employeeData.department || "General",
        hourlyRate: Number(employeeData.hourlyRate) || 500,
        beaconId: employeeData.beaconId || "beacon_001",
        shiftId: employeeData.shiftId || "SHIFT_DAY",
        email: employeeData.email || "",
        dp: employeeData.dp || "default",
        status: "active"
    });

    // If beacon mapping provided
    if (employeeData.beaconId && employeeData.beaconName) {
        const beaconRef = ref(database, `beacons/${employeeData.beaconId}`);
        await set(beaconRef, {
            id: employeeData.beaconId,
            advertisedName: employeeData.beaconName,
            employeeId: empID,
            status: "active"
        });
    }

    return empID;
};

// Fetch all employees
export const fetchEmployees = async () => {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, "employees"));
    return snapshot.exists() ? snapshot.val() : {};
};

// Fetch all beacons
export const fetchBeacons = async () => {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, "beacons"));
    return snapshot.exists() ? snapshot.val() : {};
};

