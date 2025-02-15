import React, { useEffect, useState } from "react";
import { database } from "../firebase";
import { ref, onValue } from "firebase/database";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "./Navbar"; // Import NavBar component

function Home() {
    // State variables
    const [activeEmployees, setActiveEmployees] = useState([]);
    const [inactiveEmployees, setInactiveEmployees] = useState([]);
    const [menu, setMenu] = useState("home");
    const [activeTab, setActiveTab] = useState("present");
    const navigate = useNavigate();

    useEffect(() => {
        // Retrieve today's date
        const today = new Date().toISOString().split("T")[0];
        const attendanceRef = ref(database, `attendance/${today}`);

        // Listener for attendance data
        onValue(attendanceRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) return;

            const active = [];
            const inactive = [];
            for (const empID in data) {
                const logs = data[empID].logs;
                const lastLog = Object.values(logs).pop();

                // Categorize employees as active or inactive
                lastLog.type === "entry" ? active.push(empID) : inactive.push(empID);
            }
            setActiveEmployees(active);
            setInactiveEmployees(inactive);
        });
    }, []);

    // Log out function
    const logOut = () => {
        console.log("Logged out");
        navigate("/login");
    };

    return (
        <div style={styles.container}>
            {/* Navbar */}
            <div style={styles.navbar}>
                <NavBar menu={menu} setmenu={setMenu} logOut={logOut} />
            </div>

            {/* Main Content */}
            <div style={styles.content}>
                {/* Statistics Cards */}
                <div style={styles.statsContainer}>
                    <StatsCard title="Total Employees" value={activeEmployees.length + inactiveEmployees.length} color="#007bff" />
                    <StatsCard title="Present Employees" value={activeEmployees.length} color="#28a745" />
                    <StatsCard title="Absent Employees" value={inactiveEmployees.length} color="#dc3545" />
                </div>

                {/* Tabs and Employee List */}
                <div style={styles.tabContainer}>
                    {/* Tab Buttons */}
                    <div style={styles.tabButtons}>
                        <TabButton active={activeTab === "present"} color="#007bff" onClick={() => setActiveTab("present")} text="Present Employees" />
                        <TabButton active={activeTab === "absent"} color="#dc3545" onClick={() => setActiveTab("absent")} text="Absent Employees" />
                    </div>

                    {/* Employee List */}
                    <div style={styles.employeeList}>
                        {(activeTab === "present" ? activeEmployees : inactiveEmployees).map((emp, index) => (
                            <EmployeeCard key={index} empID={emp} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Stats Card Component
const StatsCard = ({ title, value, color }) => (
    <div style={{ ...styles.statsCard, borderLeft: `5px solid ${color}` }}>
        <h3 style={styles.cardTitle}>{title}</h3>
        <p style={{ ...styles.cardValue, color }}>{value}</p>
    </div>
);

// Employee Card Component
const EmployeeCard = ({ empID }) => (
    <Link to={`/employee/${empID}`} style={styles.linkStyle}>
        <div style={styles.employeeCard}>
            <h3 style={styles.employeeName}>{empID}</h3>
        </div>
    </Link>
);

// Tab Button Component
const TabButton = ({ active, color, onClick, text }) => (
    <button style={{ ...styles.tabButton, backgroundColor: active ? color : "#f4f4f9", color: active ? "#fff" : "#000" }} onClick={onClick}>
        {text}
    </button>
);

// Styles
const styles = {
    container: { display: "flex", height: "100vh", fontFamily: "Arial, sans-serif", margin: 0 },
    navbar: { width: "75px", backgroundColor: "#f4f4f9", padding: "10px", display: "flex", flexDirection: "column", alignItems: "center", boxShadow: "2px 0 4px rgba(0, 0, 0, 0.1)", position: "fixed", top: 0, bottom: 0, left: 0, overflowY: "auto" },
    content: { marginLeft: "100px", flex: 1, padding: "20px", overflowY: "auto", boxSizing: "border-box" },
    statsContainer: { display: "flex", gap: "20px", marginBottom: "20px" },
    statsCard: { backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", width: "418px", textAlign: "center" },
    cardTitle: { color: "#000", fontSize: "1rem", fontWeight: "500" },
    cardValue: { fontSize: "2rem", fontWeight: "bold" },
    tabContainer: { backgroundColor: "#fff", padding: "20px", borderRadius: "20px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" },
    tabButtons: { display: "flex", justifyContent: "space-between", marginBottom: "20px" },
    tabButton: { padding: "20px 20px", border: "none", borderRadius: "500px", cursor: "pointer", fontSize: "1rem", fontWeight: "500", flex: 1, marginRight: "10px" },
    employeeList: { display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" },
    employeeCard: { backgroundColor: "#f4f4f4", padding: "25px", borderRadius: "15px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", transition: "box-shadow 0.4s ease", width: "1000px", display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", cursor: "pointer" },
    employeeName: { fontSize: "1.2rem", fontWeight: "600", margin: 0 },
    linkStyle: { textDecoration: "none", color: "inherit" },
};

export default Home;