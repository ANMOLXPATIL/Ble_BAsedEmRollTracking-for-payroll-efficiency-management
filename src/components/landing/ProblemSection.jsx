import React from "react";
import { Reveal } from "./Reveal";

const ProblemSection = () => {
    return (
        <section id="product" style={styles.section}>
            <div style={styles.container}>
                <div style={styles.grid}>
                    {/* Left Column: Display Heading & Narrative */}
                    <div style={styles.leftCol}>
                        <Reveal delay={0}>
                            <span style={styles.eyebrow}>THE CORE QUESTION</span>
                            <h2 style={styles.displayHeading}>
                                ARE YOU GETTING<br />
                                THE WORKING TIME<br />
                                YOU ARE PAYING FOR?
                            </h2>
                        </Reveal>
                        <Reveal delay={0.1}>
                            <p style={styles.subtext}>
                                Attendance stamps confirm who entered the building. EMPTRACK compares expected workforce shift schedules directly against BLE-tracked presence to highlight utilization gaps and labor-cost variance.
                            </p>
                        </Reveal>
                    </div>

                    {/* Right Column: Minimal Data Visualization */}
                    <div style={styles.rightCol}>
                        <Reveal delay={0.2}>
                            <div style={styles.vizCard}>
                                <div style={styles.vizHeader}>
                                    <span>SHIFT UTILIZATION &bull; DEMO</span>
                                    <span style={styles.utilTag}>92.8% OPTIMAL</span>
                                </div>

                                {/* Bar 1: Expected */}
                                <div style={styles.barGroup}>
                                    <div style={styles.barMeta}>
                                        <span style={styles.barLabel}>SCHEDULED WORKFORCE TIME</span>
                                        <span style={styles.barVal}>64.0h</span>
                                    </div>
                                    <div style={styles.barBg}>
                                        <div style={{ ...styles.barFill, width: "100%", backgroundColor: "var(--text-dark)" }} />
                                    </div>
                                </div>

                                {/* Bar 2: Tracked */}
                                <div style={styles.barGroup}>
                                    <div style={styles.barMeta}>
                                        <span style={styles.barLabel}>TRACKED BLE PRESENCE</span>
                                        <span style={{ ...styles.barVal, color: "var(--accent)" }}>59.4h</span>
                                    </div>
                                    <div style={styles.barBg}>
                                        <div style={{ ...styles.barFill, width: "92.8%", backgroundColor: "var(--accent)" }} />
                                    </div>
                                </div>

                                {/* Metrics Footer */}
                                <div style={styles.vizFooter}>
                                    <div>
                                        <span style={styles.footerLabel}>VARIANCE GAP</span>
                                        <span style={{ ...styles.footerVal, color: "#DC2626" }}>-4.6 hrs</span>
                                    </div>
                                    <div>
                                        <span style={styles.footerLabel}>EST. COST IMPACT</span>
                                        <span style={styles.footerVal}>₹402.50</span>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>
        </section>
    );
};

const styles = {
    section: {
        backgroundColor: "var(--bg-light-soft)",
        padding: "110px 0",
        borderBottom: "1px solid var(--border-light)"
    },
    container: {
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "0 32px"
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "1.1fr 0.9fr",
        gap: "64px",
        alignItems: "center"
    },
    leftCol: {
        textAlign: "left"
    },
    eyebrow: {
        fontSize: "11px",
        fontWeight: "800",
        letterSpacing: "0.12em",
        color: "var(--text-muted-dark)",
        marginBottom: "16px",
        display: "block"
    },
    displayHeading: {
        fontSize: "48px",
        fontWeight: "900",
        lineHeight: "0.98",
        letterSpacing: "-0.03em",
        color: "var(--text-dark)",
        marginBottom: "20px"
    },
    subtext: {
        fontSize: "17px",
        color: "var(--text-muted-dark)",
        lineHeight: "1.6",
        maxWidth: "540px",
        margin: 0
    },

    rightCol: {
        width: "100%"
    },
    vizCard: {
        backgroundColor: "var(--bg-light)",
        border: "1px solid var(--border-light)",
        borderRadius: "20px",
        padding: "32px"
    },
    vizHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "10px",
        fontWeight: "800",
        letterSpacing: "0.08em",
        color: "var(--text-muted-dark)",
        marginBottom: "28px"
    },
    utilTag: {
        backgroundColor: "rgba(76, 115, 232, 0.12)",
        color: "var(--accent)",
        padding: "2px 8px",
        borderRadius: "4px"
    },
    barGroup: {
        marginBottom: "20px"
    },
    barMeta: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "8px"
    },
    barLabel: {
        fontSize: "10px",
        fontWeight: "800",
        letterSpacing: "0.08em",
        color: "var(--text-muted-dark)"
    },
    barVal: {
        fontSize: "16px",
        fontWeight: "800",
        color: "var(--text-dark)"
    },
    barBg: {
        height: "8px",
        backgroundColor: "rgba(20, 20, 18, 0.06)",
        borderRadius: "4px",
        overflow: "hidden"
    },
    barFill: {
        height: "100%",
        borderRadius: "4px",
        transition: "width 1s ease"
    },
    vizFooter: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: "20px",
        borderTop: "1px solid var(--border-light)",
        marginTop: "24px"
    },
    footerLabel: {
        fontSize: "10px",
        fontWeight: "800",
        color: "var(--text-muted-dark)",
        letterSpacing: "0.08em",
        display: "block",
        marginBottom: "4px"
    },
    footerVal: {
        fontSize: "18px",
        fontWeight: "900",
        color: "var(--text-dark)"
    }
};

export default ProblemSection;