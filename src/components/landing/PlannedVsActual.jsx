import React from "react";
import { Reveal } from "./Reveal";

const PlannedVsActual = () => {
    const shiftData = [
        { emp: "EMP001 &bull; Anmol Patil", planned: "8h 00m", tracked: "7h 42m", variance: "-18m", status: "Optimal" },
        { emp: "EMP002 &bull; Manthan Patil", planned: "8h 00m", tracked: "8h 11m", variance: "+11m", status: "Optimal" },
        { emp: "EMP003 &bull; Ramesh Kumar", planned: "8h 00m", tracked: "6h 48m", variance: "-1h 12m", status: "Under Hours" }
    ];

    return (
        <section id="insights" style={styles.section}>
            <div style={styles.container}>
                <Reveal delay={0}>
                    <div style={styles.header}>
                        <span style={styles.eyebrow}>VARIANCE ANALYSIS</span>
                        <h2 style={styles.heading}>PLAN THE TIME. SEE THE REALITY.</h2>
                        <p style={styles.subtext}>
                            EMPTRACK highlights subtle workforce time gaps by mapping scheduled shifts directly against BLE-tracked presence.
                        </p>
                    </div>
                </Reveal>

                <Reveal delay={0.2}>
                    <div style={styles.tableCard}>
                        <div style={styles.tableHeader}>
                            <span>PLANNED VS TRACKED WORKFORCE SHIFTS &bull; DEMO</span>
                            <span style={styles.alertBadge}>1 WORKER BELOW SHIFT SCHEDULE</span>
                        </div>

                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Worker</th>
                                    <th style={styles.th}>Planned</th>
                                    <th style={styles.th}>Tracked</th>
                                    <th style={styles.th}>Variance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {shiftData.map((row, idx) => (
                                    <tr key={idx} style={styles.tr}>
                                        <td style={styles.tdName} dangerouslySetInnerHTML={{ __html: row.emp }} />
                                        <td style={styles.td}>{row.planned}</td>
                                        <td style={styles.tdBold}>{row.tracked}</td>
                                        <td style={{ ...styles.tdBold, color: row.variance.startsWith("-") ? "#DC2626" : "#059669" }}>
                                            {row.variance}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Reveal>
            </div>
        </section>
    );
};

const styles = {
    section: {
        backgroundColor: "var(--bg-light-soft)",
        padding: "40px 0",
        borderBottom: "1px solid var(--border-light)"
    },
    container: {
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "0 32px"
    },
    header: {
        maxWidth: "800px",
        marginBottom: "48px",
        textAlign: "left"
    },
    eyebrow: {
        fontSize: "11px",
        fontWeight: "800",
        letterSpacing: "0.12em",
        color: "var(--text-muted-dark)",
        display: "block",
        marginBottom: "16px"
    },
    heading: {
        fontSize: "40px",
        fontWeight: "900",
        letterSpacing: "-0.03em",
        color: "var(--text-dark)",
        margin: "0 0 16px 0"
    },
    subtext: {
        fontSize: "17px",
        color: "var(--text-muted-dark)"
    },
    tableCard: {
        backgroundColor: "var(--bg-light)",
        border: "1px solid var(--border-light)",
        borderRadius: "20px",
        padding: "32px"
    },
    tableHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "10px",
        fontWeight: "800",
        letterSpacing: "0.08em",
        color: "var(--text-muted-dark)",
        paddingBottom: "20px",
        borderBottom: "1px solid var(--border-light)",
        marginBottom: "20px"
    },
    alertBadge: {
        backgroundColor: "rgba(220, 38, 38, 0.12)",
        color: "#DC2626",
        padding: "4px 10px",
        borderRadius: "4px",
        fontSize: "10px",
        fontWeight: "800"
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        textAlign: "left"
    },
    th: {
        fontSize: "10px",
        fontWeight: "800",
        color: "var(--text-muted-dark)",
        letterSpacing: "0.08em",
        paddingBottom: "14px",
        borderBottom: "1px solid var(--border-light)"
    },
    tr: {
        borderBottom: "1px solid var(--border-light)"
    },
    tdName: {
        padding: "16px 0",
        fontSize: "15px",
        fontWeight: "700",
        color: "var(--text-dark)"
    },
    td: {
        padding: "16px 0",
        fontSize: "14px",
        color: "var(--text-muted-dark)"
    },
    tdBold: {
        padding: "16px 0",
        fontSize: "15px",
        fontWeight: "800",
        color: "var(--text-dark)"
    }
};

export default PlannedVsActual;