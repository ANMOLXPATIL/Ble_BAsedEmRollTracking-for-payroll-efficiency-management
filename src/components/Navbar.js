import React from "react";
import { useNavigate } from "react-router-dom";
import { RiDashboardLine, RiPlayListAddLine, RiLogoutCircleLine } from "react-icons/ri";
import { FcTodoList } from "react-icons/fc";

function NavBar({ logOut }) {
    const navigate = useNavigate();

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
            <div style={styling} onClick={() => navigate("/dashboard")}>
                <RiDashboardLine size={24} color="green" />
            </div>

            {/* List All Employees */}
            <div style={inactiveStyling} onClick={() => navigate("/listAll")}>
                <FcTodoList size={24} />
            </div>

            {/* Create Employee */}
            <div style={inactiveStyling} onClick={() => navigate("/createEmployee")}>
                <RiPlayListAddLine size={24} color="teal" />
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
