import React, { useState, useEffect } from "react";
import { RiBroadcastLine, RiCpuLine, RiCloudLine, RiCalendarCheckLine, RiBarChartGroupedLine } from "react-icons/ri";

const SolutionFlow = () => {
    const [activeStage, setActiveStage] = useState(0);
    const [hoveredStage, setHoveredStage] = useState(null);

    // Continuous 6-second signal pulse cycle across the 5 stages
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStage((prev) => (prev + 1) % 5);
        }, 1200);
        return () => clearInterval(interval);
    }, []);

    const stages = [
        {
            num: "01",
            title: "BLE BEACON",
            label: "EMPLOYEE TAG",
            desc: "Low-power BLE identity signal.",
            detail: "SparkFun IN100 tag carried by worker emitting advertised UUID.",
            icon: <RiBroadcastLine size={18} />
        },
        {
            num: "02",
            title: "ESP32 GATEWAY",
            label: "SIGNAL RECEIVER",
            desc: "Gate receiver & debounce engine.",
            detail: "BLE scanner verifies presence, debounces jitter, and formats logs.",
            icon: <RiCpuLine size={18} />
        },
        {
            num: "03",
            title: "CLOUD SYNC",
            label: "FIREBASE RTDB",
            desc: "Wi-Fi real-time JSON stream.",
            detail: "Entry/exit timestamps stream into Firebase Realtime Database.",
            icon: <RiCloudLine size={18} />
        },
        {
            num: "04",
            title: "ATTENDANCE",
            label: "WORK SESSIONS",
            desc: "Automated session duration.",
            detail: "Presence events close into work sessions to calculate active hours.",
            icon: <RiCalendarCheckLine size={18} />
        },
        {
            num: "05",
            title: "INSIGHT ENGINE",
            label: "LABOR VISIBILITY",
            desc: "Shift variance & labor cost.",
            detail: "Tracked time becomes workforce utilization and estimated labor cost.",
            icon: <RiBarChartGroupedLine size={18} />
        }
    ];

    return (
        <section id="how-it-works" style={styles.section}>
            <div style={styles.container}>
                {/* Header Section */}
                <div style={styles.header}>
                    <span style={styles.eyebrow}>THE PIPELINE</span>
                    <h2 style={styles.displayHeading}>
                        ONE CONTINUOUS FLOW<br />
                        FROM SIGNAL<br />
                        TO DECISION.
                    </h2>
                </div>

                {/* System Pipeline Container */}
                <div style={styles.pipelineWrapper}>
                    {/* The Continuous Connected Line */}
                    <div style={styles.trackLine}>
                        {/* Traveling Signal Pulse Particle */}
                        <div
                            style={{
                                ...styles.pulseParticle,
                                left: `${activeStage * 22 + 4}%`
                            }}
                        />
                    </div>

                    {/* 5 Integrated Pipeline Nodes */}
                    <div style={styles.stagesRow}>
                        {stages.map((stage, idx) => {
                            const isActive = activeStage === idx;
                            const isHovered = hoveredStage === idx;

                            return (
                                <div
                                    key={idx}
                                    style={styles.stageNode}
                                    onMouseEnter={() => setHoveredStage(idx)}
                                    onMouseLeave={() => setHoveredStage(null)}
                                >
                                    {/* Node Dot / Reaction Indicator */}
                                    <div style={{
                                        ...styles.nodeDot,
                                        backgroundColor: isActive ? "#2563EB" : "#3F3F46",
                                        boxShadow: isActive ? "0 0 16px #2563EB" : "none",
                                        transform: isActive ? "scale(1.25)" : "scale(1)"
                                    }}>
                                        <span style={{
                                            ...styles.nodeIcon,
                                            color: isActive ? "#FAF9F6" : "#A1A1AA"
                                        }}>
                                            {stage.icon}
                                        </span>
                                    </div>

                                    {/* Stage Typography & Markers */}
                                    <div style={styles.stageTextGroup}>
                                        <span style={styles.stageNum}>{stage.num}</span>
                                        <h3 style={{
                                            ...styles.stageTitle,
                                            color: isActive ? "#FAF9F6" : "#A1A1AA"
                                        }}>
                                            {stage.title}
                                        </h3>
                                        <span style={styles.stageLabel}>{stage.label}</span>
                                        <p style={styles.stageDesc}>{stage.desc}</p>
                                    </div>

                                    {/* Hover Detail Expansion Panel */}
                                    {isHovered && (
                                        <div style={styles.detailPopup}>
                                            <span style={styles.popupHeader}>{stage.title} SPEC</span>
                                            <p style={styles.popupBody}>{stage.detail}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Mini Data Transformation Story */}
                <div style={styles.transformationCard}>
                    <div style={styles.cardTopRow}>
                        <span style={styles.cardHeaderTitle}>DATA TRANSFORMATION SEQUENCE</span>
                        <span style={styles.cardDemoBadge}>DEMO DATA</span>
                    </div>

                    <div style={styles.sequenceGrid}>
                        <div style={styles.seqItem}>
                            <span style={styles.seqStep}>RAW SIGNAL</span>
                            <span style={styles.seqCode}>B001 &bull; RSSI -61dBm</span>
                            <span style={styles.seqTime}>09:04:12 AM</span>
                        </div>
                        <span style={styles.seqArrow}>&rarr;</span>

                        <div style={styles.seqItem}>
                            <span style={styles.seqStep}>ATTENDANCE EVENT</span>
                            <span style={styles.seqCode}>EMP001 &bull; ENTRY</span>
                            <span style={styles.seqTime}>09:04 AM GATE #1</span>
                        </div>
                        <span style={styles.seqArrow}>&rarr;</span>

                        <div style={styles.seqItem}>
                            <span style={styles.seqStep}>WORK SESSION</span>
                            <span style={styles.seqCode}>09:04 &rarr; 18:03</span>
                            <span style={styles.seqTime}>8h 21m Tracked</span>
                        </div>
                        <span style={styles.seqArrow}>&rarr;</span>

                        <div style={styles.seqItem}>
                            <span style={styles.seqStep}>WORKFORCE INSIGHT</span>
                            <span style={styles.seqCode}>Shift: 8h | Tracked: 8h 21m</span>
                            <span style={{ ...styles.seqTime, color: "#16A34A" }}>Variance: +21m</span>
                        </div>
                        <span style={styles.seqArrow}>&rarr;</span>

                        <div style={styles.seqItem}>
                            <span style={styles.seqStep}>EST. LABOR COST</span>
                            <span style={{ ...styles.seqCode, color: "#2563EB", fontSize: "16px" }}>₹730.63</span>
                            <span style={styles.seqTime}>₹87.50 / hr Rate</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const styles = {
    section: {
        backgroundColor: "var(--bg-dark)",
        color: "var(--text-light)",
        padding: "32px 0",
        borderBottom: "1px solid var(--border-dark)",
        position: "relative",
        overflow: "hidden"
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
    displayHeading: {
        fontSize: "48px",
        fontWeight: "900",
        lineHeight: "0.96",
        letterSpacing: "-0.03em",
        color: "var(--text-light)",
        margin: 0
    },

    pipelineWrapper: {
        position: "relative",
        marginBottom: "56px",
        paddingTop: "24px"
    },
    trackLine: {
        position: "absolute",
        top: "48px",
        left: "2%",
        right: "2%",
        height: "2px",
        backgroundColor: "var(--bg-dark-soft)",
        zIndex: 1
    },
    pulseParticle: {
        position: "absolute",
        top: "-4px",
        width: "32px",
        height: "10px",
        borderRadius: "5px",
        backgroundColor: "var(--accent)",
        boxShadow: "0 0 16px var(--accent)",
        transition: "left 1.2s cubic-bezier(0.4, 0, 0.2, 1)"
    },

    stagesRow: {
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: "16px",
        position: "relative",
        zIndex: 2
    },
    stageNode: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        position: "relative",
        cursor: "pointer"
    },
    nodeDot: {
        width: "44px",
        height: "44px",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "20px",
        transition: "all 0.4s ease"
    },
    nodeIcon: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },

    stageTextGroup: {
        display: "flex",
        flexDirection: "column"
    },
    stageNum: {
        fontSize: "11px",
        fontWeight: "800",
        color: "var(--accent)",
        letterSpacing: "0.08em",
        marginBottom: "4px"
    },
    stageTitle: {
        fontSize: "14px",
        fontWeight: "900",
        letterSpacing: "0.04em",
        margin: "0 0 2px 0",
        transition: "color 0.3s ease"
    },
    stageLabel: {
        fontSize: "10px",
        fontWeight: "800",
        color: "var(--text-muted-light)",
        letterSpacing: "0.1em",
        marginBottom: "8px"
    },
    stageDesc: {
        fontSize: "13px",
        color: "var(--text-muted-light)",
        lineHeight: "1.5",
        margin: 0
    },

    detailPopup: {
        position: "absolute",
        bottom: "-85px",
        left: "0",
        right: "10px",
        backgroundColor: "var(--bg-dark-soft)",
        border: "1px solid var(--border-dark)",
        borderRadius: "8px",
        padding: "12px",
        zIndex: 10,
        boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
    },
    popupHeader: {
        fontSize: "10px",
        fontWeight: "800",
        color: "var(--accent)",
        letterSpacing: "0.08em",
        display: "block",
        marginBottom: "4px"
    },
    popupBody: {
        fontSize: "12px",
        color: "var(--text-light)",
        lineHeight: "1.4",
        margin: 0
    },

    transformationCard: {
        backgroundColor: "var(--bg-dark-soft)",
        border: "1px solid var(--border-dark)",
        borderRadius: "16px",
        padding: "24px"
    },
    cardTopRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "18px"
    },
    cardHeaderTitle: {
        fontSize: "10px",
        fontWeight: "800",
        color: "var(--text-muted-light)",
        letterSpacing: "0.08em"
    },
    cardDemoBadge: {
        fontSize: "9px",
        fontWeight: "800",
        color: "var(--text-muted-light)",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        padding: "2px 6px",
        borderRadius: "4px",
        letterSpacing: "0.08em"
    },
    sequenceGrid: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
    },
    seqItem: {
        display: "flex",
        flexDirection: "column",
        gap: "4px"
    },
    seqStep: {
        fontSize: "10px",
        fontWeight: "800",
        color: "var(--text-muted-light)",
        letterSpacing: "0.08em"
    },
    seqCode: {
        fontSize: "14px",
        fontWeight: "800",
        color: "var(--text-light)"
    },
    seqTime: {
        fontSize: "12px",
        color: "var(--text-muted-light)"
    },
    seqArrow: {
        color: "var(--text-muted-light)",
        fontSize: "18px",
        fontWeight: "700"
    }
};

export default SolutionFlow;