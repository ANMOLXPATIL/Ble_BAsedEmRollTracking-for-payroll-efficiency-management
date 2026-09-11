import React from "react";
import { Link } from "react-router-dom";
import { RiCpuLine } from "react-icons/ri";

const Footer = () => {
    return (
        <footer style={styles.footer}>
            <div style={styles.container}>
                <div style={styles.topRow}>
                    <div>
                        <div style={styles.logoGroup}>
                            <div style={styles.logoMark}>
                                <RiCpuLine size={16} color="#FAF9F6" />
                            </div>
                            <span style={styles.logoTitle}>EMPTRACK</span>
                        </div>
                        <p style={styles.descriptor}>BLE-Powered Workforce Intelligence & Labor Cost Visibility.</p>
                    </div>

                    <div style={styles.navGroup}>
                        <Link to="/" style={styles.navLink}>Product</Link>
                        <Link to="/home" style={styles.navLink}>Dashboard</Link>
                        <Link to="/login" style={styles.navLink}>Sign In</Link>
                        <a href="https://github.com" target="_blank" rel="noreferrer" style={styles.navLink}>GitHub</a>
                    </div>
                </div>

                <div style={styles.bottomRow}>
                    <span>Engineering prototype built around BLE, ESP32, Firebase and React.</span>
                    <span>© {new Date().getFullYear()} EMPTRACK</span>
                </div>
            </div>
        </footer>
    );
};

const styles = {
    footer: {
        backgroundColor: "#0F0F11",
        color: "var(--text-muted-light)",
        padding: "60px 0 36px 0",
        borderTop: "1px solid var(--border-dark)",
        fontSize: "13px"
    },
    container: {
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "0 32px"
    },
    topRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingBottom: "40px",
        borderBottom: "1px solid var(--border-dark)"
    },
    logoGroup: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "12px"
    },
    logoMark: {
        width: "28px",
        height: "28px",
        borderRadius: "6px",
        backgroundColor: "var(--bg-dark-soft)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    logoTitle: {
        fontSize: "16px",
        fontWeight: "900",
        color: "var(--text-light)",
        letterSpacing: "0.08em"
    },
    descriptor: {
        color: "var(--text-muted-light)",
        maxWidth: "320px",
        margin: 0
    },
    navGroup: {
        display: "flex",
        gap: "28px"
    },
    navLink: {
        color: "var(--text-light)",
        textDecoration: "none",
        fontWeight: "600"
    },
    bottomRow: {
        display: "flex",
        justifyContent: "space-between",
        paddingTop: "28px",
        color: "var(--text-muted-light)",
        fontSize: "12px"
    }
};

export default Footer;