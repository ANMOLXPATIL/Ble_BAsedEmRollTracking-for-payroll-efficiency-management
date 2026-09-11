import React from "react";

const AnalyticsSection = () => {
    return (
        <section id="analytics" style={styles.section}>
            <div style={styles.container}>
                <div style={styles.header}>
                    <div style={styles.eyebrow}>WORKFORCE VISIBILITY</div>
                    <h2 style={styles.headline}>From attendance records to workforce insights.</h2>
                    <p style={styles.subtext}>
                        EMPTRACK aggregates raw timestamps into shift utilization, variance, and estimated labor-cost trends.
                    </p>
                </div>

                <div style={styles.mockupContainer}>
                    <div style={styles.mockupTopBar}>
                        <div style={styles.dotGroup}>
                            <span style={{ ...styles.winDot, backgroundColor: "#EF4444" }}></span>
                            <span style={{ ...styles.winDot, backgroundColor: "#F59E0B" }}></span>
                            <span style={{ ...styles.winDot, backgroundColor: "#10B981" }}></span>
                        </div>
                        <span style={styles.mockupTitle}>EMPTRACK ANALYTICS ENGINE — DEMO DATA</span>
                    </div>

                    <div style={styles.mockupContent}>
                        {/* 4 Stat Cards */}
                        <div style={styles.statsGrid}>
                            <div style={styles.statCard}>
                                <span style={styles.statLabel}>Expected Shift Hours</span>
                                <span style={styles.statVal}>320 <span style={{ fontSize: "14px", color: "#64748B" }}>hrs</span></span>
                                <span style={styles.statSub}>40 Workers Scheduled</span>
                            </div>

                            <div style={styles.statCard}>
                                <span style={styles.statLabel}>Tracked Presence</span>
                                <span style={{ ...styles.statVal, color: "#10B981" }}>296 <span style={{ fontSize: "14px", color: "#64748B" }}>hrs</span></span>
                                <span style={{ ...styles.statSub, color: "#10B981" }}>-24 hrs variance</span>
                            </div>

                            <div style={styles.statCard}>
                                <span style={styles.statLabel}>Workforce Utilization</span>
                                <span style={{ ...styles.statVal, color: "#3B82F6" }}>92.5%</span>
                                <span style={styles.statSub}>Optimal efficiency</span>
                            </div>

                            <div style={styles.statCard}>
                                <span style={styles.statLabel}>Estimated Labor Cost</span>
                                <span style={{ ...styles.statVal, color: "#6366F1" }}>₹25,900</span>
                                <span style={styles.statSub}>Based on ₹87.50/hr avg</span>
                            </div>
                        </div>

                        {/* Visual Trend Bars Demo */}
                        <div style={styles.chartPanel}>
                            <h4 style={styles.chartTitle}>WEEKLY WORKFORCE HOURS (PLANNED VS TRACKED)</h4>
                            <div style={styles.barChartRow}>
                                {[
                                    { day: "Mon", planned: 64, tracked: 62 },
                                    { day: "Tue", planned: 64, tracked: 64 },
                                    { day: "Wed", planned: 64, tracked: 58 },
                                    { day: "Thu", planned: 64, tracked: 61 },
                                    { day: "Fri", planned: 64, tracked: 51 }
                                ].map((item, i) => (
                                    <div key={i} style={styles.barGroup}>
                                        <div style={styles.barsContainer}>
                                            <div style={{ ...styles.barPlanned, height: `${(item.planned / 70) * 100}%` }} title={`Planned: ${item.planned}h`}></div>
                                            <div style={{ ...styles.barTracked, height: `${(item.tracked / 70) * 100}%` }} title={`Tracked: ${item.tracked}h`}></div>
                                        </div>
                                        <span style={styles.barDay}>{item.day}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={styles.chartLegend}>
                                <span style={styles.legendItem}><span style={{ ...styles.legendDot, backgroundColor: "#334155" }}></span> Planned Shift Hours</span>
                                <span style={styles.legendItem}><span style={{ ...styles.legendDot, backgroundColor: "#10B981" }}></span> Tracked BLE Presence</span>
                            </div>
                        </div>
                    </div>
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
    mockupContainer: {
        backgroundColor: "#1E293B",
        borderRadius: "20px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        overflow: "hidden",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
    },
    mockupTopBar: {
        backgroundColor: "#0F172A",
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)"
    },
    dotGroup: {
        display: "flex",
        gap: "6px"
    },
    winDot: {
        width: "10px",
        height: "10px",
        borderRadius: "50%"
    },
    mockupTitle: {
        fontSize: "11px",
        fontWeight: "700",
        color: "#64748B",
        letterSpacing: "0.08em"
    },
    mockupContent: {
        padding: "32px"
    },
    statsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px",
        marginBottom: "32px"
    },
    statCard: {
        backgroundColor: "#0F172A",
        padding: "20px",
        borderRadius: "12px",
        border: "1px solid rgba(255, 255, 255, 0.05)"
    },
    statLabel: {
        fontSize: "12px",
        color: "#94A3B8",
        fontWeight: "600",
        display: "block",
        marginBottom: "8px"
    },
    statVal: {
        fontSize: "28px",
        fontWeight: "800",
        color: "#F8FAFC",
        display: "block"
    },
    statSub: {
        fontSize: "12px",
        color: "#64748B",
        marginTop: "4px",
        display: "block"
    },
    chartPanel: {
        backgroundColor: "#0F172A",
        padding: "24px",
        borderRadius: "12px",
        border: "1px solid rgba(255, 255, 255, 0.05)"
    },
    chartTitle: {
        fontSize: "12px",
        fontWeight: "700",
        color: "#94A3B8",
        letterSpacing: "0.05em",
        margin: "0 0 24px 0"
    },
    barChartRow: {
        display: "flex",
        justifyContent: "space-around",
        alignItems: "flex-end",
        height: "160px",
        paddingBottom: "12px",
        borderBottom: "1px solid #334155"
    },
    barGroup: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        height: "100%",
        justifyContent: "flex-end"
    },
    barsContainer: {
        display: "flex",
        alignItems: "flex-end",
        gap: "6px",
        height: "100%"
    },
    barPlanned: {
        width: "16px",
        backgroundColor: "#334155",
        borderRadius: "4px 4px 0 0"
    },
    barTracked: {
        width: "16px",
        backgroundColor: "#10B981",
        borderRadius: "4px 4px 0 0"
    },
    barDay: {
        fontSize: "12px",
        color: "#94A3B8",
        fontWeight: "600"
    },
    chartLegend: {
        display: "flex",
        gap: "24px",
        justifyContent: "center",
        marginTop: "16px"
    },
    legendItem: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "12px",
        color: "#94A3B8"
    },
    legendDot: {
        width: "8px",
        height: "8px",
        borderRadius: "2px"
    }
};

export default AnalyticsSection;