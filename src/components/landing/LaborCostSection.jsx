import React from "react";

const LaborCostSection = () => {
    return (
        <section style={styles.section}>
            <div style={styles.container}>
                <div style={styles.grid}>
                    <div style={styles.calcCard}>
                        <div style={styles.cardHeader}>
                            <span>ESTIMATED LABOR COST FORMULA</span>
                            <span style={styles.badge}>DEMO CONFIGURATION</span>
                        </div>

                        <div style={styles.mathRow}>
                            <div>
                                <span style={styles.mathSub}>CONFIGURED RATE</span>
                                <span style={styles.mathVal}>₹87.50 / hr</span>
                            </div>
                            <span style={styles.mathOp}>×</span>
                            <div>
                                <span style={styles.mathSub}>TRACKED TIME</span>
                                <span style={styles.mathVal}>7h 30m</span>
                            </div>
                            <span style={styles.mathOp}>=</span>
                            <div>
                                <span style={styles.mathSub}>ESTIMATED COST</span>
                                <span style={{ ...styles.mathVal, color: "#2563EB" }}>₹656.25</span>
                            </div>
                        </div>

                        <div style={styles.disclaimerNote}>
                            <strong>Disclaimer:</strong> Based on configured hourly labor rates and tracked presence. Not a replacement for statutory payroll processing.
                        </div>
                    </div>

                    <div>
                        <span style={styles.eyebrow}>FINANCIAL VISIBILITY</span>
                        <h2 style={styles.heading}>
                            KNOW WHAT<br />
                            TRACKED TIME<br />
                            REPRESENTS.
                        </h2>
                        <p style={styles.subtext}>
                            Owners can assign hourly labor rates per department or individual worker. EMPTRACK automatically converts presence hours into estimated labor cost metrics.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

const styles = {
    section: {
        backgroundColor: "var(--bg-light)",
        padding: "56px 0",
        borderBottom: "1px solid var(--border-light)"
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
    calcCard: {
        backgroundColor: "var(--bg-light-soft)",
        border: "1px solid var(--border-light)",
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
        color: "var(--text-muted-dark)",
        marginBottom: "24px"
    },
    badge: {
        backgroundColor: "rgba(20, 20, 18, 0.05)",
        color: "var(--text-dark)",
        padding: "2px 8px",
        borderRadius: "4px"
    },
    mathRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "var(--bg-light)",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "20px"
    },
    mathSub: {
        fontSize: "10px",
        fontWeight: "800",
        color: "var(--text-muted-dark)",
        letterSpacing: "0.05em",
        display: "block",
        marginBottom: "4px"
    },
    mathVal: {
        fontSize: "20px",
        fontWeight: "900",
        color: "var(--text-dark)"
    },
    mathOp: {
        fontSize: "22px",
        fontWeight: "800",
        color: "var(--text-muted-dark)"
    },
    disclaimerNote: {
        fontSize: "12px",
        color: "var(--text-muted-dark)",
        lineHeight: "1.5"
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
        fontSize: "48px",
        fontWeight: "900",
        lineHeight: "0.98",
        letterSpacing: "-0.03em",
        color: "var(--text-dark)",
        marginBottom: "24px"
    },
    subtext: {
        fontSize: "17px",
        color: "var(--text-muted-dark)",
        lineHeight: "1.6"
    }
};

export default LaborCostSection;