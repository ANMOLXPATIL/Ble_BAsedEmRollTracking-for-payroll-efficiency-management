import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiCpuLine, RiArrowRightLine, RiMenu3Line, RiCloseLine } from "react-icons/ri";
import { useActiveSection, sectionsConfig } from "../../hooks/useActiveSection";

const Navbar = () => {
    const { activeSection, sectionTheme } = useActiveSection();
    const [scrollProgress, setScrollProgress] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    // Scroll progress bar calculation
    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (totalHeight > 0) {
                setScrollProgress((window.scrollY / totalHeight) * 100);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (id) => {
        setMobileMenuOpen(false);
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -80;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    };

    const isDarkTheme = sectionTheme === "dark";

    return (
        <header
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                transition: "background-color 0.4s ease, border-color 0.4s ease, color 0.4s ease",
                backgroundColor: isDarkTheme ? "rgba(28, 27, 25, 0.85)" : "rgba(244, 242, 237, 0.85)",
                backdropFilter: "blur(16px)",
                borderBottom: isDarkTheme ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(20, 20, 18, 0.08)",
                padding: "20px 0"
            }}
        >
            {/* Top 2px Subtle Scroll Progress Indicator */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "2px",
                    width: `${scrollProgress}%`,
                    backgroundColor: "var(--accent)",
                    transition: "width 0.1s ease-out"
                }}
            />

            <div style={styles.container}>
                {/* Brand */}
                <Link to="/" style={styles.logoLink}>
                    <div style={{
                        ...styles.logoMark,
                        backgroundColor: isDarkTheme ? "#FAF9F6" : "#111214",
                        color: isDarkTheme ? "#111214" : "#FAF9F6"
                    }}>
                        <RiCpuLine size={18} />
                    </div>
                    <div style={styles.logoTextGroup}>
                        <span style={{ ...styles.logoTitle, color: isDarkTheme ? "var(--text-light)" : "var(--text-dark)" }}>
                            EMPTRACK
                        </span>
                        <span style={{ ...styles.logoSubtitle, color: isDarkTheme ? "var(--text-muted-light)" : "var(--text-muted-dark)" }}>
                            BLE WORKFORCE INTELLIGENCE
                        </span>
                    </div>
                </Link>

                {/* Editorial Center Nav */}
                <nav style={styles.desktopNav}>
                    {sectionsConfig.map((sec) => {
                        const isActive = activeSection === sec.id;
                        return (
                            <div key={sec.id} style={{ position: "relative" }}>
                                <button
                                    onClick={() => scrollToSection(sec.id)}
                                    style={{
                                        ...styles.navLink,
                                        color: isDarkTheme
                                            ? (isActive ? "var(--text-light)" : "var(--text-muted-light)")
                                            : (isActive ? "var(--text-dark)" : "var(--text-muted-dark)"),
                                        fontWeight: isActive ? "700" : "500"
                                    }}
                                >
                                    {sec.label}
                                </button>
                                {/* Active Indicator Line */}
                                {isActive && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            bottom: "-10px",
                                            left: 0,
                                            right: 0,
                                            height: "2px",
                                            backgroundColor: "var(--accent)",
                                            borderRadius: "1px",
                                            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
                                        }}
                                    />
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* Right Actions */}
                <div style={styles.actionGroup}>
                    <button
                        onClick={() => navigate("/login")}
                        style={{
                            ...styles.signInBtn,
                            color: isDarkTheme ? "var(--text-light)" : "var(--text-dark)"
                        }}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => navigate("/home")}
                        style={{
                            ...styles.primaryBtn,
                            backgroundColor: isDarkTheme ? "var(--text-light)" : "var(--text-dark)",
                            color: isDarkTheme ? "var(--text-dark)" : "var(--text-light)"
                        }}
                    >
                        View Dashboard <RiArrowRightLine size={14} />
                    </button>

                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        style={styles.mobileMenuToggle}
                        aria-label="Toggle Menu"
                    >
                        {mobileMenuOpen ? (
                            <RiCloseLine size={24} color={isDarkTheme ? "#F5F4EF" : "#161719"} />
                        ) : (
                            <RiMenu3Line size={24} color={isDarkTheme ? "#F5F4EF" : "#161719"} />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown */}
            {mobileMenuOpen && (
                <div style={{
                    ...styles.mobileDropdown,
                    backgroundColor: isDarkTheme ? "var(--bg-dark)" : "var(--bg-light)",
                    borderBottom: isDarkTheme ? "1px solid var(--border-dark)" : "1px solid var(--border-light)"
                }}>
                    {sectionsConfig.map((sec) => (
                        <button
                            key={sec.id}
                            onClick={() => scrollToSection(sec.id)}
                            style={{
                                ...styles.mobileNavLink,
                                color: isDarkTheme ? "var(--text-light)" : "var(--text-dark)"
                            }}
                        >
                            {sec.label}
                        </button>
                    ))}
                    <button
                        onClick={() => navigate("/home")}
                        style={{
                            ...styles.mobilePrimaryBtn,
                            backgroundColor: isDarkTheme ? "var(--text-light)" : "var(--text-dark)",
                            color: isDarkTheme ? "var(--text-dark)" : "var(--text-light)"
                        }}
                    >
                        View Dashboard
                    </button>
                </div>
            )}
        </header>
    );
};

const styles = {
    container: {
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
    },
    logoLink: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        textDecoration: "none"
    },
    logoMark: {
        width: "36px",
        height: "36px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.3s ease"
    },
    logoTextGroup: {
        display: "flex",
        flexDirection: "column"
    },
    logoTitle: {
        fontSize: "17px",
        fontWeight: "800",
        letterSpacing: "0.08em"
    },
    logoSubtitle: {
        fontSize: "8.5px",
        fontWeight: "700",
        letterSpacing: "0.14em",
        marginTop: "-2px"
    },
    desktopNav: {
        display: "flex",
        alignItems: "center",
        gap: "36px"
    },
    navLink: {
        background: "none",
        border: "none",
        fontSize: "14px",
        cursor: "pointer",
        transition: "color 0.3s ease",
        letterSpacing: "0.01em",
        padding: 0
    },
    actionGroup: {
        display: "flex",
        alignItems: "center",
        gap: "16px"
    },
    signInBtn: {
        background: "transparent",
        border: "none",
        padding: "8px 16px",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer"
    },
    primaryBtn: {
        border: "none",
        padding: "10px 20px",
        borderRadius: "8px",
        fontSize: "13px",
        fontWeight: "600",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        letterSpacing: "0.02em",
        transition: "all 0.3s ease"
    },
    mobileMenuToggle: {
        display: "none",
        background: "none",
        border: "none",
        cursor: "pointer"
    },
    mobileDropdown: {
        padding: "24px 32px",
        display: "flex",
        flexDirection: "column",
        gap: "16px"
    },
    mobileNavLink: {
        background: "none",
        border: "none",
        fontSize: "16px",
        fontWeight: "600",
        textAlign: "left",
        cursor: "pointer"
    },
    mobilePrimaryBtn: {
        border: "none",
        padding: "14px",
        borderRadius: "8px",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "pointer",
        marginTop: "12px"
    }
};

export default Navbar;
