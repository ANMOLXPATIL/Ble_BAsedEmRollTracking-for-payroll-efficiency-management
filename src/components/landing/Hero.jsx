import React from "react";
import { RiBroadcastLine, RiCpuLine, RiTimerLine } from "react-icons/ri";
import PrimaryCTA from "./PrimaryCTA";
import { Reveal } from "./Reveal";

const Hero = () => {
    return (
        <section id="hero" style={styles.section}>
            <div style={styles.container}>
                {/* Left Asymmetrical Display Typography & Copy */}
                <div style={styles.leftCol}>
                    <Reveal delay={0}>
                        <div style={styles.eyebrowTag}>
                            <span style={styles.tagDot}></span> BLE WORKFORCE INTELLIGENCE
                        </div>
                    </Reveal>

                    <Reveal delay={0.1}>
                        <h1 style={styles.displayHeadline}>
                            TURN<br />
                            WORKFORCE<br />
                            TIME INTO<br />
                            <span style={styles.highlightText}>INSIGHT.</span>
                        </h1>
                    </Reveal>

                    <Reveal delay={0.2}>
                        <p style={styles.editorialSubtext}>
                            EMPTRACK uses BLE-based presence detection to automate attendance, 
                            track work hours, and give owners a clearer view of workforce utilization 
                            and estimated labor cost.
                        </p>
                    </Reveal>

                    <Reveal delay={0.3}>
                        <div style={styles.ctaGroup}>
                            <PrimaryCTA secondaryColor="#181817" />
                        </div>
                    </Reveal>

                    {/* Editorial Micro-Card 1 */}
                    <Reveal delay={0.4}>
                        <div style={styles.editorialCard1}>
                            <div style={styles.cardHeader}>
                                <RiBroadcastLine size={16} color="var(--text-dark)" />
                                <span style={styles.cardTitle}>PASSIVE ATTENDANCE</span>
                            </div>
                            <p style={styles.cardBody}>
                                BLE-based detection records presence without requiring employees to manually check in.
                            </p>
                        </div>
                    </Reveal>
                </div>

                {/* Right Architectural Product Visual Composition */}
                <div style={styles.rightCol}>
                    <Reveal delay={0.2}>
                        <div style={styles.visualCanvas}>
                            <div style={styles.demoBadge}>DEMO DATA</div>

                            {/* BLE Beacon & Gateway Hardware Render Composition */}
                            <div style={styles.hardwareStage}>
                                <div style={styles.beaconMock}>
                                    <div style={styles.beaconCore}></div>
                                    <span style={styles.beaconLabel}>IN100 TAG</span>
                                </div>

                                <div style={styles.signalVector}>
                                    <span style={styles.signalWave}></span>
                                </div>

                                <div style={styles.gatewayMock}>
                                    <RiCpuLine size={20} color="var(--text-dark)" />
                                    <span style={styles.gatewayLabel}>ESP32 GATEWAY</span>
                                </div>
                            </div>

                            {/* Floating Architectural Cards */}
                            <div style={styles.floatingBox1}>
                                <div style={styles.statusRow}>
                                    <span style={styles.statusDotActive}></span>
                                    <span style={styles.statusTitle}>BLE DETECTED</span>
                                </div>
                                <div style={styles.empName}>EMP001 &bull; Anmol Patil</div>
                                <div style={styles.timestampRow}>
                                    <span>Entry: 09:04 AM</span>
                                    <span style={styles.badgePresent}>PRESENT</span>
                                </div>
                            </div>

                            <div style={styles.floatingBox2}>
                                <div style={styles.cardLabel}>WORKFORCE TODAY</div>
                                <div style={styles.metricRow}>
                                    <div>
                                        <span style={styles.metricSub}>Expected</span>
                                        <span style={styles.metricVal}>64h</span>
                                    </div>
                                    <div>
                                        <span style={styles.metricSub}>Tracked</span>
                                        <span style={styles.metricVal}>59.4h</span>
                                    </div>
                                    <div>
                                        <span style={styles.metricSub}>Utilization</span>
                                        <span style={{ ...styles.metricVal, color: "var(--accent)" }}>92.8%</span>
                                    </div>
                                </div>
                            </div>

                            <div style={styles.floatingBox3}>
                                <div style={styles.cardLabel}>EST. LABOR COST TODAY</div>
                                <div style={styles.costVal}>₹5,198</div>
                                <div style={styles.costSub}>Tracked hours × Configured rates</div>
                            </div>
                        </div>
                    </Reveal>

                    {/* Editorial Micro-Card 2 */}
                    <Reveal delay={0.4}>
                        <div style={styles.editorialCard2}>
                            <div style={styles.cardHeader}>
                                <RiTimerLine size={16} color="var(--text-dark)" />
                                <span style={styles.cardTitle}>PLANNED VS ACTUAL</span>
                            </div>
                            <p style={styles.cardBody}>
                                Compare scheduled workforce time with actual tracked presence to highlight variance immediately.
                            </p>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
};

const styles = {
    section: {
        backgroundColor: "var(--bg-light)",
        paddingTop: "130px",
        paddingBottom: "80px",
        borderBottom: "1px solid var(--border-light)"
    },
    container: {
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "0 32px",
        display: "grid",
        gridTemplateColumns: "1.05fr 0.95fr",
        gap: "64px",
        alignItems: "flex-start"
    },
    leftCol: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        textAlign: "left"
    },
    eyebrowTag: {
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "11px",
        fontWeight: "700",
        letterSpacing: "0.12em",
        color: "var(--text-muted-dark)",
        textTransform: "uppercase",
        marginBottom: "24px"
    },
    tagDot: {
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        backgroundColor: "var(--accent)"
    },
    displayHeadline: {
        fontSize: "60px",
        fontWeight: "900",
        lineHeight: "0.95",
        letterSpacing: "-0.04em",
        color: "var(--text-dark)",
        margin: "0 0 24px 0"
    },
    highlightText: {
        color: "var(--accent)"
    },
    editorialSubtext: {
        fontSize: "17px",
        lineHeight: "1.6",
        color: "var(--text-muted-dark)",
        maxWidth: "480px",
        margin: "0 0 32px 0",
        fontWeight: "400"
    },
    ctaGroup: {
        display: "flex",
        alignItems: "center",
        gap: "20px",
        marginBottom: "40px"
    },
    editorialCard1: {
        backgroundColor: "var(--bg-light-soft)",
        border: "1px solid var(--border-light)",
        borderRadius: "12px",
        padding: "20px 24px",
        maxWidth: "420px"
    },
    cardHeader: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "8px"
    },
    cardTitle: {
        fontSize: "11px",
        fontWeight: "800",
        letterSpacing: "0.08em",
        color: "var(--text-dark)"
    },
    cardBody: {
        fontSize: "13px",
        color: "var(--text-muted-dark)",
        lineHeight: "1.5",
        margin: 0
    },

    rightCol: {
        position: "relative"
    },
    visualCanvas: {
        backgroundColor: "var(--bg-light-soft)",
        border: "1px solid var(--border-light)",
        borderRadius: "24px",
        padding: "32px",
        position: "relative"
    },
    demoBadge: {
        position: "absolute",
        top: "20px",
        right: "24px",
        fontSize: "9px",
        fontWeight: "800",
        letterSpacing: "0.12em",
        color: "var(--text-muted-dark)",
        backgroundColor: "rgba(20, 20, 18, 0.05)",
        padding: "4px 8px",
        borderRadius: "4px"
    },
    hardwareStage: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "var(--bg-light)",
        padding: "20px 24px",
        borderRadius: "16px",
        border: "1px solid var(--border-light)",
        marginBottom: "20px"
    },
    beaconMock: {
        display: "flex",
        alignItems: "center",
        gap: "10px"
    },
    beaconCore: {
        width: "12px",
        height: "12px",
        borderRadius: "50%",
        backgroundColor: "var(--accent)",
        boxShadow: "0 0 10px rgba(76, 115, 232, 0.4)"
    },
    beaconLabel: {
        fontSize: "11px",
        fontWeight: "800",
        color: "var(--text-dark)",
        letterSpacing: "0.05em"
    },
    signalVector: {
        flex: 1,
        height: "1px",
        backgroundColor: "var(--border-light)",
        margin: "0 16px"
    },
    gatewayMock: {
        display: "flex",
        alignItems: "center",
        gap: "8px"
    },
    gatewayLabel: {
        fontSize: "11px",
        fontWeight: "800",
        color: "var(--text-dark)",
        letterSpacing: "0.05em"
    },

    floatingBox1: {
        backgroundColor: "var(--bg-light)",
        border: "1px solid var(--border-light)",
        borderRadius: "14px",
        padding: "16px 20px",
        marginBottom: "14px"
    },
    statusRow: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        marginBottom: "4px"
    },
    statusDotActive: {
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        backgroundColor: "#10B981"
    },
    statusTitle: {
        fontSize: "10px",
        fontWeight: "800",
        color: "#10B981",
        letterSpacing: "0.08em"
    },
    empName: {
        fontSize: "15px",
        fontWeight: "700",
        color: "var(--text-dark)"
    },
    timestampRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "12px",
        color: "var(--text-muted-dark)",
        marginTop: "8px"
    },
    badgePresent: {
        backgroundColor: "rgba(16, 185, 129, 0.12)",
        color: "#059669",
        fontSize: "10px",
        fontWeight: "800",
        padding: "2px 8px",
        borderRadius: "4px"
    },

    floatingBox2: {
        backgroundColor: "var(--bg-light)",
        border: "1px solid var(--border-light)",
        borderRadius: "14px",
        padding: "16px 20px",
        marginBottom: "14px"
    },
    cardLabel: {
        fontSize: "10px",
        fontWeight: "800",
        letterSpacing: "0.08em",
        color: "var(--text-muted-dark)",
        marginBottom: "10px"
    },
    metricRow: {
        display: "flex",
        justifyContent: "space-between"
    },
    metricSub: {
        fontSize: "11px",
        color: "var(--text-muted-dark)",
        display: "block"
    },
    metricVal: {
        fontSize: "20px",
        fontWeight: "800",
        color: "var(--text-dark)"
    },

    floatingBox3: {
        backgroundColor: "var(--bg-dark)",
        color: "var(--text-light)",
        borderRadius: "14px",
        padding: "18px 20px"
    },
    costVal: {
        fontSize: "26px",
        fontWeight: "800",
        color: "var(--text-light)",
        margin: "4px 0"
    },
    costSub: {
        fontSize: "11px",
        color: "var(--text-muted-light)"
    },

    editorialCard2: {
        backgroundColor: "var(--bg-light-soft)",
        border: "1px solid var(--border-light)",
        borderRadius: "12px",
        padding: "20px 24px",
        marginTop: "20px"
    }
};

export default Hero;