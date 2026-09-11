import React from "react";
import { RiLockPasswordLine, RiUserFollowLine, RiShieldKeyholeLine, RiHistoryLine } from "react-icons/ri";

const SecuritySection = () => {
    const features = [
        { icon: <RiLockPasswordLine size={20} color="#10B981" />, title: "Firebase Authentication", desc: "Manager dashboard routes protected via Firebase Auth." },
        { icon: <RiUserFollowLine size={20} color="#3B82F6" />, title: "Beacon Registry Mapping", desc: "Physical tags decoupled from employee identities." },
        { icon: <RiShieldKeyholeLine size={20} color="#6366F1" />, title: "Database Security Rules", desc: "Structured write permissions for gateway endpoints." },
        { icon: <RiHistoryLine size={20} color="#F59E0B" />, title: "Audit Event Logs", desc: "Timestamped entry/exit history for dispute verification." }
    ];

    return (
        <section style={styles.section}>
            <div style={styles.container}>
                <div style={styles.header}>
                    <div style={styles.eyebrow}>DATA SECURITY & INTEGRITY</div>
                    <h2 style={styles.headline}>Protected system architecture.</h2>
                </div>

                <div style={styles.grid}>
                    {features.map((f, idx) => (
                        <div key={idx} style={styles.card}>
                            <div style={styles.iconBox}>{f.icon}</div>
                            <div>
                                <h4 style={styles.title}>{f.title}</h4>
                                <p style={styles.desc}>{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const styles = {
    section: {
        backgroundColor: "#F8FAFC",
        padding: "80px 0",
        borderBottom: "1px solid #E2E8F0"
    },
    container: {
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "0 24px"
    },
    header: {
        textAlign: "center",
        marginBottom: "40px"
    },
    eyebrow: {
        fontSize: "12px",
        fontWeight: "700",
        color: "#10B981",
        letterSpacing: "0.1em",
        marginBottom: "8px"
    },
    headline: {
        fontSize: "28px",
        fontWeight: "800",
        color: "#0F172A",
        letterSpacing: "-0.02em",
        margin: 0
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px"
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: "12px",
        padding: "20px",
        border: "1px solid #E2E8F0",
        display: "flex",
        alignItems: "flex-start",
        gap: "14px"
    },
    iconBox: {
        width: "36px",
        height: "36px",
        borderRadius: "8px",
        backgroundColor: "#F1F5F9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0
    },
    title: {
        fontSize: "15px",
        fontWeight: "700",
        color: "#0F172A",
        margin: "0 0 4px 0"
    },
    desc: {
        fontSize: "13px",
        color: "#64748B",
        lineHeight: "1.4",
        margin: 0
    }
};

export default SecuritySection;