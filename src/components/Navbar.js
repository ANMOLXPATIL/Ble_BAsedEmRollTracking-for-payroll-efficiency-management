import React from "react";
import { RiDashboardLine } from "react-icons/ri";
import { FcTodoList } from "react-icons/fc";
import { RiPlayListAddLine } from "react-icons/ri";
import { RiLogoutCircleLine } from "react-icons/ri";

function NavBar({ menu, setmenu, logOut }) {
    const styling = {
        borderRight: "2px solid green",
        padding: "10px 0",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "50px",
    };

    const inactiveStyling = {
        padding: "10px 0",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "50px",
    };

    return (
        <div
            style={{
                width: "15%",
                backgroundColor: "#f4f4f9",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: "20px",
            }}
        >
            {/* Dashboard */}
            <div
                style={menu === "dashboard" ? styling : inactiveStyling}
                onClick={() => setmenu("dashboard")}
            >
                <RiDashboardLine size={24} color={menu === "dashboard" ? "green" : "teal"} />
            </div>

            {/* List All Employees */}
            <div
                style={menu === "listAll" ? styling : inactiveStyling}
                onClick={() => setmenu("listAll")}
            >
                <FcTodoList size={24} />
            </div>

            {/* Create Employee */}
            <div
                style={menu === "createEmployee" ? styling : inactiveStyling}
                onClick={() => setmenu("createEmployee")}
            >
                <RiPlayListAddLine size={24} color={menu === "createEmployee" ? "green" : "teal"} />
            </div>

            {/* Logout */}
            <div
                style={{
                    ...inactiveStyling,
                    marginTop: "auto",
                    marginBottom: "20px",
                }}
                onClick={logOut}
            >
                <RiLogoutCircleLine size={24} color="red" />
            </div>
        </div>
    );
}

export default NavBar;