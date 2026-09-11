import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const ProtectedRoute = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div style={{
                display: "flex",
                height: "100vh",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#F4F2ED",
                fontFamily: "'Inter', sans-serif",
                color: "#181817"
            }}>
                <div style={{ fontSize: "14px", fontWeight: "600", letterSpacing: "0.05em" }}>
                    VERIFYING AUTHENTICATION...
                </div>
            </div>
        );
    }

    const isDemoMode = sessionStorage.getItem("emptrack_demo_mode") === "true";

    if (!user && !isDemoMode) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
