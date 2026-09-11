import React from "react";

const Roadmap = () => {
    const stages = [
        { stage: "STAGE 01", title: "Automated BLE Attendance", status: "IMPLEMENTED", desc: "Hands-free presence detection and entry/exit logging." },
        { stage: "STAGE 02", title: "Workforce Analytics Engine", status: "IMPLEMENTED", desc: "Planned vs actual hours and active utilization calculations." },
        { stage: "STAGE 03", title: "Labor Cost Visibility", status: "IMPLEMENTED", desc: "Configured hourly rates mapped to tracked presence hours." },
        { stage: "STAGE 04", title: "Multi-Zone Intelligence", status: "PLANNED ROADMAP", desc: "Multi-receiver spatial tracking across factory zones." }
    ];

    return (
        <section id="architecture" style={styles.section}>
            <div style={styles.container}>
                <div style={styles.header}>
                    <div style={styles.eyebrow}>PRODUCT ROADMAP</div>
                    <h2 style={styles.headline}>Start focused. Scale the architecture.</h2>
                    <p style={styles.subtext}>
                        Built on a modular database and firmware architecture designed for multi-receiver expansion.
                    </p>
                </div>

                <div style={styles.grid}>
                    {stages.map((st, idx) => (
                        <div key={idx} style={styles.card}>
                            <div style={styles.cardHeader}>
                                <span style={styles.stageLabel}>{st.stage}</span>
                                <span style={st.status === "IMPLEMENTED" ? styles.statusActive : styles.statusPlanned}>
                                    {st.status}
                                </span>
                            </div>
                            <h3 style={styles.title}>{st.title}</h3>
                            <p style={styles.desc}>{st.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const styles = {
    section: {
        backgroundColor: "#0F172A",
        padding: "100px 0",
        color: "#F8FAFC"
    },
    container: {
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "0 24px"
    },
    header: {
        textAlign: "center",
        maxWidth: "700px",
        margin: "0 auto 60px auto"
    },
    eyebrow: {
        fontSize: "12px",
        fontWeight: "700",
        color: "#10B981",
        letterSpacing: "0.1em",
        marginBottom: "12px"
    },
    headline: {
        fontSize: "36px",
        fontWeight: "800",
        letterSpacing: "-0.02em",
        marginBottom: "16px"
    },
    subtext: {
        fontSize: "16px",
        color: "#94A3B8"
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px"
    },
    card: {
        backgroundColor: "#1E293B",
        borderRadius: "16px",
        padding: "24px",
        border: "1px solid rgba(255, 255, 255, 0.08)"
    },
    cardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "16px"
    },
    stageLabel: {
        fontSize: "11px",
        fontWeight: "700",
        color: "#64748B"
    },
    statusActive: {
        fontSize: "10px",
        fontWeight: "700",
        backgroundColor: "rgba(16, 185, 129, 0.15)",
        color: "#10B981",
        padding: "2px 6px",
        borderRadius: "4px"
    },
    statusPlanned: {
        fontSize: "10px",
        fontWeight: "700",
        backgroundColor: "rgba(148, 163, 184, 0.15)",
        color: "#94A3B8",
        padding: "2px 6px",
        borderRadius: "4px"
    },
    title: {
        fontSize: "16px",
        fontWeight: "700",
        color: "#F8FAFC",
        marginBottom: "8px"
    },
    desc: {
        fontSize: "13px",
        color: "#94A3B8",
        lineHeight: "1.5",
        margin: 0
    }
};

export default Roadmap;