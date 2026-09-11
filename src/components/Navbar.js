import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { 
    RiDashboardLine, 
    RiUserAddLine, 
    RiLogoutCircleLine,
    RiCpuLine
} from "react-icons/ri";

function NavBar() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleSignOut = async () => {
        try {
            sessionStorage.removeItem("emptrack_demo_mode");
            await signOut(auth);
            navigate("/login");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const isActive = (path) => location.pathname === path;

    const navItemStyle = (active) => ({
        width: "48px",
        height: "48px",
        borderRadius: "12px",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transition: "all 0.2s ease",
        backgroundColor: active ? "#0F172A" : "transparent",
        color: active ? "#FFFFFF" : "#64748B",
        marginBottom: "12px"
    });

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: "24px",
                paddingBottom: "24px",
                boxSizing: "border-box"
            }}
        >
            {/* Brand Logo / Icon */}
            <div
                style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    backgroundColor: "#0F172A",
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "800",
                    fontSize: "18px",
                    marginBottom: "32px",
                    letterSpacing: "-0.05em"
                }}
                title="Workforce Intelligence System"
                role="button"
                tabIndex={0}
                aria-label="Go to landing page"
                onClick={() => navigate("/")}
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        navigate("/");
                    }
                }}
            >
                <RiCpuLine size={22} color="#10B981" />
            </div>

            {/* Nav Items */}
            <div 
                style={navItemStyle(isActive("/home"))} 
                title="Workforce Dashboard"
                onClick={() => navigate("/home")}
            >
                <RiDashboardLine size={22} />
            </div>

            <div 
                style={navItemStyle(isActive("/register"))} 
                title="Register Worker"
                onClick={() => navigate("/register")}
            >
                <RiUserAddLine size={22} />
            </div>

            {/* Logout */}
            <div
                style={{
                    ...navItemStyle(false),
                    marginTop: "auto",
                    marginBottom: 0
                }}
                title="Sign Out"
                onClick={handleSignOut}
            >
                <RiLogoutCircleLine size={22} color="#EF4444" />
            </div>
        </div>
    );
}

export default NavBar;
