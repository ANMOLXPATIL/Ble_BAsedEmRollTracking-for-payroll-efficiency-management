import React from "react";

const AttendanceSection = () => {
    return (
        <section style={styles.section}>
            <div style={styles.container}>
                <div style={styles.grid}>
                    <div>
                        <span style={styles.eyebrow}>PASSIVE PRESENCE</span>
                        <h2 style={styles.heading}>
                            ATTENDANCE,<br />
                            WITHOUT AN<br />
                            EXTRA STEP.
                        </h2>
                        <p style={styles.subtext}>
                            Workers carry a lightweight BLE tag. Gate-station receivers detect presence automatically without requiring active check-ins, card tapping, or biometrics.
                        </p>

                        <div style={styles.noteBox}>
                            <span style={styles.noteTitle}>TECHNICAL RULE NOTE</span>
                            <p style={styles.noteBody}>
                                Presence is determined from BLE detection rules and configured timeout thresholds.
                            </p>
                        </div>
                    </div>

                    <div style={styles.timelineCard}>
                        <div style={styles.cardHeader}>
                            <span>DAILY TIMELINE LOG &bull; DEMO</span>
                            <span style={styles.badgeActive}>ACTIVE</span>
                        </div>

                        <div style={styles.timelineList}>
                            <div style={styles.timeItem}>
                                <span style={styles.timeLabel}>09:04 AM</span>
                                <span style={styles.eventEntry}>ENTRY DETECTED</span>
                            </div>
                            <div style={styles.timeItem}>
                                <span style={styles.timeLabel}>12:57 PM</span>
                                <span style={styles.eventExit}>EXIT DETECTED</span>
                            </div>
                            <div style={styles.timeItem}>
                                <span style={styles.timeLabel}>01:31 PM</span>
                                <span style={styles.eventEntry}>ENTRY DETECTED</span>
                            </div>
                            <div style={styles.timeItem}>
                                <span style={styles.timeLabel}>06:04 PM</span>
                                <span style={styles.eventExit}>EXIT DETECTED</span>
                            </div>
                        </div>

                        <div style={styles.totalRow}>
                            <span>TRACKED PRESENCE</span>
                            <span style={styles.totalVal}>8h 26m</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const styles = {
    section: {
        backgroundColor: "#F4F2ED",
        padding: "72px 0",
        borderBottom: "1px solid rgba(22, 23, 25, 0.08)"
    },
    container: {
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "0 32px"
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "64px",
        alignItems: "center"
    },
    eyebrow: {
        fontSize: "11px",
        fontWeight: "800",
        letterSpacing: "0.12em",
        color: "#66686D",
        display: "block",
        marginBottom: "16px"
    },
    heading: {
        fontSize: "48px",
        fontWeight: "900",
        lineHeight: "0.98",
        letterSpacing: "-0.03em",
        color: "#161719",
        marginBottom: "24px"
    },
    subtext: {
        fontSize: "17px",
        color: "#66686D",
        lineHeight: "1.6",
        marginBottom: "32px"
    },
    noteBox: {
        backgroundColor: "#EBE8E1",
        borderLeft: "3px solid #161719",
        padding: "16px 20px",
        borderRadius: "0 8px 8px 0"
    },
    noteTitle: {
        fontSize: "10px",
        fontWeight: "800",
        letterSpacing: "0.08em",
        color: "#66686D",
        display: "block",
        marginBottom: "4px"
    },
    noteBody: {
        fontSize: "13px",
        color: "#161719",
        margin: 0
    },

    timelineCard: {
        backgroundColor: "#EBE8E1",
        border: "1px solid rgba(22, 23, 25, 0.08)",
        borderRadius: "20px",
        padding: "32px"
    },
    cardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "10px",
        fontWeight: "800",
        letterSpacing: "0.08em",
        color: "#8C8E94",
        paddingBottom: "20px",
        borderBottom: "1px solid rgba(22, 23, 25, 0.08)",
        marginBottom: "24px"
    },
    badgeActive: {
        backgroundColor: "rgba(16, 185, 129, 0.12)",
        color: "#059669",
        padding: "2px 8px",
        borderRadius: "4px"
    },
    timelineList: {
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        marginBottom: "24px"
    },
    timeItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 16px",
        backgroundColor: "#F4F2ED",
        borderRadius: "8px",
        fontSize: "14px"
    },
    timeLabel: {
        fontWeight: "700",
        color: "#161719"
    },
    eventEntry: {
        fontWeight: "800",
        color: "#059669",
        fontSize: "12px",
        letterSpacing: "0.05em"
    },
    eventExit: {
        fontWeight: "800",
        color: "#66686D",
        fontSize: "12px",
        letterSpacing: "0.05em"
    },
    totalRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: "18px",
        borderTop: "1px solid rgba(22, 23, 25, 0.08)",
        fontSize: "11px",
        fontWeight: "800",
        letterSpacing: "0.05em",
        color: "#66686D"
    },
    totalVal: {
        fontSize: "20px",
        fontWeight: "900",
        color: "#161719"
    }
};

export default AttendanceSection;