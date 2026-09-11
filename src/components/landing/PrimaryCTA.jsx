import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiArrowRightUpLine } from "react-icons/ri";

const PrimaryCTA = ({ secondaryColor = "#18181B" }) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - (rect.left + rect.width / 2)) * 0.05;
        const y = (e.clientY - (rect.top + rect.height / 2)) * 0.05;
        setMagneticOffset({ x: Math.max(-3, Math.min(3, x)), y: Math.max(-3, Math.min(3, y)) });
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setMagneticOffset({ x: 0, y: 0 });
    };

    return (
        <div style={styles.ctaWrapper}>
            <div style={styles.ambientGlow} />

            <div style={styles.buttonGroup}>
                <button
                    onClick={() => navigate("/home")}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{
                        ...styles.button,
                        transform: `translate3d(${magneticOffset.x}px, ${magneticOffset.y - (isHovered ? 2 : 0)}px, 0)`,
                        boxShadow: isHovered
                            ? "0 12px 32px -4px rgba(37, 99, 235, 0.4), 0 0 0 1px rgba(96, 165, 250, 0.5) inset"
                            : "0 4px 20px -2px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset"
                    }}
                >
                    <div
                        style={{
                            ...styles.lightLayer,
                            opacity: isHovered ? 0.9 : 0.55
                        }}
                    />

                    <span style={styles.label}>EXPLORE EMPTRACK</span>

                    <span
                        style={{
                            ...styles.arrow,
                            transform: isHovered ? "translateX(6px)" : "translateX(0px)"
                        }}
                    >
                        &rarr;
                    </span>
                </button>

                <a href="#technology" style={{ ...styles.secondaryLink, color: secondaryColor }}>
                    VIEW ARCHITECTURE <RiArrowRightUpLine size={14} style={{ marginLeft: "4px" }} />
                </a>
            </div>
        </div>
    );
};

const styles = {
    ctaWrapper: {
        position: "relative",
        display: "flex",
        justifyContent: "center",
        width: "100%"
    },
    ambientGlow: {
        position: "absolute",
        top: "-30px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "300px",
        height: "100px",
        background: "radial-gradient(circle, rgba(76, 115, 232, 0.22) 0%, rgba(14, 165, 233, 0.08) 50%, transparent 75%)",
        filter: "blur(24px)",
        pointerEvents: "none",
        zIndex: 0,
        animation: "ambientPulse 14s ease-in-out infinite alternate"
    },
    buttonGroup: {
        position: "relative",
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "24px"
    },
    button: {
        position: "relative",
        height: "54px",
        minWidth: "210px",
        padding: "0 28px",
        borderRadius: "999px",
        backgroundColor: "#111214",
        color: "#F5F4EF",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "14px",
        overflow: "hidden",
        transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        outline: "none"
    },
    lightLayer: {
        position: "absolute",
        top: "-50%",
        left: "-50%",
        width: "200%",
        height: "200%",
        background: "radial-gradient(circle at 30% 50%, rgba(76, 115, 232, 0.65), rgba(14, 165, 233, 0.25) 40%, transparent 70%)",
        filter: "blur(20px)",
        pointerEvents: "none",
        animation: "lightDrift 7s ease-in-out infinite alternate",
        transition: "opacity 0.35s ease"
    },
    label: {
        position: "relative",
        zIndex: 2,
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.1em",
        color: "#FAF9F6",
        textTransform: "uppercase"
    },
    arrow: {
        position: "relative",
        zIndex: 2,
        fontSize: "16px",
        fontWeight: "600",
        color: "#FAF9F6",
        transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)"
    },
    secondaryLink: {
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "0.08em",
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        padding: "8px 0",
        transition: "color 0.2s ease"
    }
};

export default PrimaryCTA;