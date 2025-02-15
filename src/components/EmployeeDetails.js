import React, { useEffect, useState } from "react";
import { database } from "../firebase";
import { ref, onValue } from "firebase/database";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker"; // Calendar component
import "react-datepicker/dist/react-datepicker.css"; // Calendar styles

function EmployeeDetails() {
    const { id: empID } = useParams();
    const [details, setDetails] = useState({
        activeHoursToday: 0,
        presentDays: 0,
        avgActiveHours: 0,
    });
    const [selectedDate, setSelectedDate] = useState(null); // Selected date from calendar
    const [dateDetails, setDateDetails] = useState({
        activeHours: 0,
        logs: [],
    });
    const [selectedMonth, setSelectedMonth] = useState(null); // Selected month for export

    // Helper function to convert timestamp to 12-hour format
    const formatTimestampTo12Hour = (timestamp) => {
        const date = new Date(timestamp);
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${hours}:${formattedMinutes} ${ampm}`;
    };

    // Fetch monthly data
    useEffect(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const today = `${year}-${month}-${String(now.getDate()).padStart(2, "0")}`;
        const firstDayOfMonth = `${year}-${month}-01`;

        const attendanceRef = ref(database, `attendance`);
        onValue(attendanceRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) return;

            let totalActiveHoursToday = 0;
            let totalPresentDays = 0;
            let totalActiveHoursMonth = 0;

            for (const date in data) {
                if (date >= firstDayOfMonth && date <= today && data[date][empID]) {
                    const dailyTotal = data[date][empID].total || 0;

                    if (dailyTotal > 0) totalPresentDays++;
                    totalActiveHoursMonth += dailyTotal;

                    if (date === today) {
                        totalActiveHoursToday = dailyTotal;
                    }
                }
            }

            const avgActiveHours =
                totalPresentDays > 0
                    ? (totalActiveHoursMonth / totalPresentDays / 3600).toFixed(2)
                    : 0;

            setDetails({
                activeHoursToday: (totalActiveHoursToday / 3600).toFixed(2),
                presentDays: totalPresentDays,
                avgActiveHours: avgActiveHours,
            });
        });
    }, [empID]);

    // Fetch data for the selected date
    useEffect(() => {
        if (!selectedDate) return;

        const formattedDate = selectedDate.toISOString().split("T")[0];
        const attendanceRef = ref(database, `attendance/${formattedDate}/${empID}`);

        onValue(attendanceRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) {
                setDateDetails({ activeHours: 0, logs: [] });
                return;
            }

            const logs = Object.values(data.logs || {}).map((log) => ({
                ...log,
                timestamp: formatTimestampTo12Hour(log.timestamp), // Convert to 12-hour format
            }));
            const activeHours = ((data.total || 0) / 3600).toFixed(2);

            setDateDetails({
                activeHours: activeHours,
                logs: logs,
            });
        });
    }, [selectedDate, empID]);

    // Export Selected Month Data Function
    const exportMonthlyData = () => {
        if (!selectedMonth) {
            alert("Please select a month to export data.");
            return;
        }

        const year = selectedMonth.getFullYear();
        const month = String(selectedMonth.getMonth() + 1).padStart(2, "0");
        const firstDayOfMonth = `${year}-${month}-01`;
        const lastDayOfMonth = `${year}-${month}-${new Date(year, month, 0).getDate()}`;

        const attendanceRef = ref(database, `attendance`);

        onValue(attendanceRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) {
                alert("No data available for the selected month.");
                return;
            }

            const csvRows = ["Date,Active Hours (Hours),Entry/Exit Logs"]; // Header row

            for (const date in data) {
                if (date >= firstDayOfMonth && date <= lastDayOfMonth && data[date][empID]) {
                    const dailyTotal = data[date][empID].total || 0;
                    const logs = Object.values(data[date][empID].logs || {});

                    const activeHours = (dailyTotal / 3600).toFixed(2);
                    const formattedLogs = logs
                        .map((log) => `${formatTimestampTo12Hour(log.timestamp)} - ${log.type}`)
                        .join("; ");

                    csvRows.push(`${date},${activeHours},"${formattedLogs}"`);
                }
            }

            const csvContent = csvRows.join("\n");
            const blob = new Blob([csvContent], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${empID}-${year}-${month}-monthly-logs.csv`;
            a.click();
        });
    };

    // Export Selected Date Data Function
    const exportSelectedDateData = () => {
        if (!selectedDate) {
            alert("Please select a date to export data.");
            return;
        }

        const formattedDate = selectedDate.toISOString().split("T")[0];
        const attendanceRef = ref(database, `attendance/${formattedDate}/${empID}`);

        onValue(attendanceRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) {
                alert("No data available for the selected date.");
                return;
            }

            const logs = Object.values(data.logs || {});
            const activeHours = ((data.total || 0) / 3600).toFixed(2);

            const csvRows = [
                "Date,Active Hours (Hours),Entry/Exit Logs", // Header row
                `${formattedDate},${activeHours},"${logs
                    .map((log) => `${formatTimestampTo12Hour(log.timestamp)} - ${log.type}`)
                    .join("; ")}"`,
            ];

            const csvContent = csvRows.join("\n");
            const blob = new Blob([csvContent], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${empID}-${formattedDate}-logs.csv`;
            a.click();
        });
    };

    return (
        <div className="content">
            <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                <h2>Employee: {empID}</h2>
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select a date"
                    className="calendar-button"
                />
            </div>

            {/* Monthly Details */}
            <div className="details">
                <p>
                    <strong>Total Active Hours Today:</strong>{" "}
                    {details.activeHoursToday || 0} hours
                </p>
                <p>
                    <strong>Total Present Days (This Month):</strong>{" "}
                    {details.presentDays || 0} days
                </p>
                <p>
                    <strong>Average Active Hours (This Month):</strong>{" "}
                    {details.avgActiveHours || 0} hours/day
                </p>
            </div>

            {/* Selected Date Details */}
            {selectedDate && (
                <div className="selected-date-details">
                    <h3>Details for {selectedDate.toISOString().split("T")[0]}</h3>
                    <p>
                        <strong>Active Hours:</strong> {dateDetails.activeHours || 0} hours
                    </p>
                    <h4>Entry/Exit Logs:</h4>
                    <ul>
                        {dateDetails.logs.map((log, index) => (
                            <li key={index}>
                                {log.type === "entry" ? "Entry" : "Exit"} at {log.timestamp}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div style={{ marginTop: "20px" }}>
                <DatePicker
                    selected={selectedMonth}
                    onChange={(date) => setSelectedMonth(date)}
                    dateFormat="yyyy-MM"
                    showMonthYearPicker
                    placeholderText="Select a month"
                    className="calendar-button"
                />
                <button onClick={exportMonthlyData} style={{ marginLeft: "10px" }}>
                    Export Monthly Data
                </button>
                <button onClick={exportSelectedDateData} style={{ marginLeft: "10px" }}>
                    Export Selected Date Data
                </button>
            </div>
        </div>
    );
}

export default EmployeeDetails;