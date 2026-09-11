import React from "react";
import { RiBattery2ChargeLine, RiWifiLine, RiCpuLine, RiPriceTag3Line } from "react-icons/ri";

const HardwareSection = () => {
    return (
        <section style={styles.section}>
            <div style={styles.container}>
                <div style={styles.grid}>
                    <div>
                        <div style={styles.eyebrow}>PHYSICAL SYSTEM SHOWCASE</div>
                        <h2 style={styles.headline}>Compact hardware setup. Sustainable low-power design.</h2>
                        <p style={styles.subtext}>
                            The working physical prototype consists of coin-cell powered SparkFun NanoBeacon IN100 tags and an ESP32 gateway receiver positioned at factory access gates.
                        </p>

                        <div style={styles.specsList}>
                            <div style={styles.specItem}>
                                <RiBattery2ChargeLine size={20} color="#10B981" />
                                <span>Long battery life on CR2032 coin cell</span>
                            </div>
                            <div style={styles.specItem}>
                                <RiWifiLine size={20} color="#3B82F6" />
                                <span>Seamless Wi-Fi cloud synchronization</span>
                            </div>
                            <div style={styles.specItem}>
                                <RiPriceTag3Line size={20} color="#6366F1" />
                                <span>Compact wearable worker tags</span>
                            </div>
                        </div>
                    </div>

                    <div style={styles.hardwareCard}>
                        <div style={styles.hardwareHeader}>
                            <span>HARDWARE SYSTEM COMPONENTS</span>
                            <span style={styles.badge}>PHYSICAL PROTOTYPE</span>
                        </div>
                        <div style={styles.componentBox}>
                            <div style={styles.compRow}>
                                <span style={styles.compName}>SparkFun IN100 Beacon</span>
                                <span style={styles.compVal}>2 Units (Active)</span>
                            </div>
                            <div style={styles.compRow}>
                                <span style={styles.compName}>ESP32 Gateway</span>
                                <span style={styles.compVal}>1 Unit (Wi-Fi + BLE)</span>
                            </div>
                            <div style={styles.compRow}>
                                <span style={styles.compName}>Power Supply</span>
                                <span style={styles.compVal}>5V USB Gateway Power</span>
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
        backgroundColor: "#F8FAFC",
        padding: "100px 0",
        borderBottom: "1px solid #E2E8F0"
    },
    container: {
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "0 24px"
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "1.1fr 0.9fr",
        gap: "60px",
        alignItems: "center"
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
        color: "#0F172A",
        letterSpacing: "-0.02em",
        marginBottom: "16px"
    },
    subtext: {
        fontSize: "16px",
        color: "#64748B",
        lineHeight: "1.6",
        marginBottom: "28px"
    },
    specsList: {
        display: "flex",
        flexDirection: "column",
        gap: "14px"
    },
    specItem: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        fontSize: "14px",
        fontWeight: "600",
        color: "#334155"
    },
    hardwareCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: "16px",
        border: "1px solid #E2E8F0",
        padding: "28px",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)"
    },
    hardwareHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "12px",
        fontWeight: "700",
        color: "#64748B",
        paddingBottom: "16px",
        borderBottom: "1px solid #E2E8F0",
        marginBottom: "20px"
    },
    badge: {
        backgroundColor: "#F1F5F9",
        color: "#0F172A",
        padding: "4px 8px",
        borderRadius: "6px"
    },
    componentBox: {
        display: "flex",
        flexDirection: "column",
        gap: "12px"
    },
    compRow: {
        display: "flex",
        justifyContent: "space-between",
        padding: "12px",
        backgroundColor: "#F8FAFC",
        borderRadius: "8px",
        fontSize: "14px"
    },
    compName: {
        fontWeight: "600",
        color: "#0F172A"
    },
    compVal: {
        color: "#64748B"
    }
};

export default HardwareSection;