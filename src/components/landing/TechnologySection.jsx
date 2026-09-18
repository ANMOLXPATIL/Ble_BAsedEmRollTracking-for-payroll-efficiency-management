import React from "react";

const TechnologySection = () => {
    const techItems = [
        { title: "SPARKFUN IN100", sub: "BLE BEACON TAGS", desc: "Compact wearable tags emitting unique advertised UUID signals." },
        { title: "ESP32 GATEWAY", sub: "WIRELESS RECEIVER", desc: "Scans BLE signals, handles state debouncing, and syncs via Wi-Fi." },
        { title: "FIREBASE RTDB", sub: "CLOUD DATABASE", desc: "Low-latency timestamp JSON storage and real-time subscription streams." },
        { title: "REACT DASHBOARD", sub: "WEB FRONTEND", desc: "Modular web dashboard for worker metadata, timeline logs, and CSV exports." }
    ];

    return (
        <section id="technology" style={styles.section}>
            <div style={styles.container}>
                <div style={styles.header}>
                    <span style={styles.eyebrow}>ARCHITECTURE STACK</span>
                    <h2 style={styles.heading}>FROM SIGNAL TO DECISION.</h2>
                </div>

                <div style={styles.grid}>
                    {techItems.map((item, idx) => (
                        <div key={idx} style={styles.card}>
                            <h3 style={styles.title}>{item.title}</h3>
                            <span style={styles.sub}>{item.sub}</span>
                            <p style={styles.desc}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const styles = {
    section: {
        backgroundColor: "var(--bg-dark)",
        color: "var(--text-light)",
        padding: "40px 0",
        borderBottom: "1px solid var(--border-dark)"
    },
    container: {
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "0 32px"
    },
    header: {
        marginBottom: "56px",
        textAlign: "left"
    },
    eyebrow: {
        fontSize: "11px",
        fontWeight: "800",
        letterSpacing: "0.14em",
        color: "var(--text-muted-light)",
        display: "block",
        marginBottom: "16px"
    },
    heading: {
        fontSize: "40px",
        fontWeight: "900",
        letterSpacing: "-0.03em",
        color: "var(--text-light)",
        margin: 0
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px"
    },
    card: {
        backgroundColor: "var(--bg-dark-soft)",
        borderRadius: "16px",
        padding: "28px",
        border: "1px solid var(--border-dark)"
    },
    title: {
        fontSize: "15px",
        fontWeight: "900",
        color: "var(--text-light)",
        margin: "0 0 4px 0",
        letterSpacing: "0.05em"
    },
    sub: {
        fontSize: "10px",
        fontWeight: "800",
        color: "var(--text-muted-light)",
        display: "block",
        marginBottom: "12px",
        letterSpacing: "0.05em"
    },
    desc: {
        fontSize: "13px",
        color: "var(--text-muted-light)",
        lineHeight: "1.5",
        margin: 0
    }
};

export default TechnologySection;