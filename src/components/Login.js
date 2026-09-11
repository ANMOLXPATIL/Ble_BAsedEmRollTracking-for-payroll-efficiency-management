import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { 
    RiCpuLine, 
    RiMailLine, 
    RiLockPasswordLine, 
    RiEyeLine, 
    RiEyeOffLine, 
    RiGoogleFill,
    RiBroadcastLine,
    RiCloudLine,
    RiBarChartGroupedLine
} from "react-icons/ri";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/home");
        } catch (err) {
            setError(err.message || "Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError("");
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            navigate("/home");
        } catch (err) {
            setError(err.message || "Failed to sign in with Google.");
        }
    };

    return (
        <div style={styles.container}>
            {/* Ambient subtle light glow in background */}
            <div style={styles.ambientGlow} />

            <div style={styles.contentGrid}>
                {/* LEFT SIDE: EDITORIAL BRAND STORY & BLE VISUAL */}
                <div style={styles.leftCol}>
                    <Link to="/" style={styles.logoGroup}>
                        <div style={styles.logoMark}>
                            <RiCpuLine size={20} color="var(--text-light)" />
                        </div>
                        <span style={styles.logoTitle}>EMPTRACK</span>
                    </Link>

                    <div style={styles.brandHeroBlock}>
                        <h1 style={styles.brandHeadline}>
                            WORKFORCE<br />
                            INTELLIGENCE.
                        </h1>
                        <p style={styles.brandSubtext}>
                            Attendance, tracked hours and workforce insights — connected seamlessly through BLE presence hardware.
                        </p>
                    </div>

                    {/* BLE SYSTEM DIAGRAM VISUAL */}
                    <div style={styles.systemDiagram}>
                        <div style={styles.nodeItem}>
                            <div style={styles.nodeIconBox}>
                                <RiBroadcastLine size={16} color="var(--accent)" />
                            </div>
                            <span style={styles.nodeText}>BLE BEACON</span>
                        </div>

                        <span style={styles.diagramArrow}>&rarr;</span>

                        <div style={styles.nodeItem}>
                            <div style={styles.nodeIconBox}>
                                <RiCpuLine size={16} color="var(--text-light)" />
                            </div>
                            <span style={styles.nodeText}>ESP32</span>
                        </div>

                        <span style={styles.diagramArrow}>&rarr;</span>

                        <div style={styles.nodeItem}>
                            <div style={styles.nodeIconBox}>
                                <RiCloudLine size={16} color="var(--text-light)" />
                            </div>
                            <span style={styles.nodeText}>CLOUD</span>
                        </div>

                        <span style={styles.diagramArrow}>&rarr;</span>

                        <div style={styles.nodeItem}>
                            <div style={styles.nodeIconBox}>
                                <RiBarChartGroupedLine size={16} color="var(--accent)" />
                            </div>
                            <span style={styles.nodeText}>INSIGHT</span>
                        </div>
                    </div>

                    <div style={styles.statusFooter}>
                        <span style={styles.statusDot}></span>
                        <span style={styles.statusText}>SYSTEM READY &bull; BLE GATEWAY ACTIVE</span>
                    </div>
                </div>

                {/* RIGHT SIDE: REFINED WARM IVORY LOGIN SURFACE */}
                <div style={styles.rightCol}>
                    <div style={styles.loginCard}>
                        <div style={styles.cardHeader}>
                            <span style={styles.eyebrow}>SECURE ACCESS</span>
                            <h2 style={styles.cardHeadline}>WELCOME BACK</h2>
                            <p style={styles.cardSubtext}>Sign in to access your workforce management dashboard.</p>
                        </div>

                        {error && (
                            <div style={styles.errorAlert}>
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleLogin} style={styles.form}>
                            {/* Email */}
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>EMAIL ADDRESS</label>
                                <div style={styles.inputWrapper}>
                                    <RiMailLine size={18} color="var(--text-muted-dark)" style={{ marginLeft: "14px" }} />
                                    <input
                                        type="email"
                                        placeholder="manager@factory.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={styles.input}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>PASSWORD</label>
                                <div style={styles.inputWrapper}>
                                    <RiLockPasswordLine size={18} color="var(--text-muted-dark)" style={{ marginLeft: "14px" }} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={styles.input}
                                        required
                                    />
                                    <div 
                                        onClick={() => setShowPassword(!showPassword)} 
                                        style={styles.eyeToggle}
                                    >
                                        {showPassword ? <RiEyeOffLine size={18} color="var(--text-muted-dark)" /> : <RiEyeLine size={18} color="var(--text-muted-dark)" />}
                                    </div>
                                </div>
                            </div>

                            {/* Primary Login Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                style={{
                                    ...styles.submitBtn,
                                    transform: isHovered ? "translateY(-1px)" : "translateY(0)"
                                }}
                            >
                                <span style={{ position: "relative", zIndex: 2 }}>
                                    {loading ? "AUTHENTICATING..." : "SIGN IN TO DASHBOARD"}
                                </span>
                                <span 
                                    style={{
                                        ...styles.btnArrow,
                                        transform: isHovered ? "translateX(5px)" : "translateX(0)"
                                    }}
                                >
                                    &rarr;
                                </span>
                            </button>
                        </form>

                        <div style={styles.divider}>
                            <span style={styles.dividerText}>or continue with</span>
                        </div>

                        {/* Google Auth */}
                        <button type="button" onClick={handleGoogleSignIn} style={styles.googleBtn}>
                            <RiGoogleFill size={18} color="#4285F4" /> Sign in with Google
                        </button>

                        <div style={styles.footerNote}>
                            <span>Need access? </span>
                            <span style={{ fontWeight: "700", color: "var(--text-dark)" }}>Contact your administrator.</span>
                        </div>

                        <div style={styles.productTagline}>
                            BLE-POWERED WORKFORCE INTELLIGENCE
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        backgroundColor: "var(--bg-dark)",
        color: "var(--text-light)",
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        position: "relative",
        boxSizing: "border-box",
        overflow: "hidden"
    },
    ambientGlow: {
        position: "absolute",
        top: "20%",
        left: "20%",
        width: "500px",
        height: "500px",
        background: "radial-gradient(circle, rgba(76, 115, 232, 0.08) 0%, transparent 60%)",
        filter: "blur(60px)",
        pointerEvents: "none",
        zIndex: 0
    },
    contentGrid: {
        maxWidth: "1200px",
        width: "100%",
        display: "grid",
        gridTemplateColumns: "1.1fr 0.9fr",
        gap: "64px",
        alignItems: "center",
        position: "relative",
        zIndex: 1
    },

    /* Left Editorial Column */
    leftCol: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        textAlign: "left"
    },
    logoGroup: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        textDecoration: "none",
        marginBottom: "48px"
    },
    logoMark: {
        width: "36px",
        height: "36px",
        borderRadius: "8px",
        backgroundColor: "var(--bg-dark-soft)",
        border: "1px solid var(--border-dark)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    logoTitle: {
        fontSize: "18px",
        fontWeight: "900",
        color: "var(--text-light)",
        letterSpacing: "0.08em"
    },
    brandHeroBlock: {
        marginBottom: "40px"
    },
    brandHeadline: {
        fontSize: "48px",
        fontWeight: "900",
        lineHeight: "0.96",
        letterSpacing: "-0.03em",
        color: "var(--text-light)",
        margin: "0 0 20px 0"
    },
    brandSubtext: {
        fontSize: "16px",
        color: "var(--text-muted-light)",
        lineHeight: "1.6",
        maxWidth: "420px",
        margin: 0
    },

    systemDiagram: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        backgroundColor: "var(--bg-dark-soft)",
        border: "1px solid var(--border-dark)",
        padding: "16px 20px",
        borderRadius: "12px",
        marginBottom: "40px",
        width: "100%",
        maxWidth: "460px",
        boxSizing: "border-box"
    },
    nodeItem: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px"
    },
    nodeIconBox: {
        width: "32px",
        height: "32px",
        borderRadius: "8px",
        backgroundColor: "var(--bg-dark)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    nodeText: {
        fontSize: "9px",
        fontWeight: "800",
        color: "var(--text-muted-light)",
        letterSpacing: "0.05em"
    },
    diagramArrow: {
        color: "var(--text-muted-light)",
        fontSize: "14px",
        fontWeight: "700"
    },

    statusFooter: {
        display: "flex",
        alignItems: "center",
        gap: "8px"
    },
    statusDot: {
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        backgroundColor: "var(--accent)"
    },
    statusText: {
        fontSize: "10px",
        fontWeight: "800",
        color: "var(--text-muted-light)",
        letterSpacing: "0.08em"
    },

    /* Right Login Panel Surface */
    rightCol: {
        width: "100%",
        display: "flex",
        justifyContent: "center"
    },
    loginCard: {
        width: "100%",
        maxWidth: "440px",
        backgroundColor: "var(--bg-light)",
        border: "1px solid var(--border-dark)",
        borderRadius: "24px",
        padding: "40px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
        boxSizing: "border-box"
    },
    cardHeader: {
        marginBottom: "28px",
        textAlign: "left"
    },
    eyebrow: {
        fontSize: "10px",
        fontWeight: "800",
        letterSpacing: "0.12em",
        color: "var(--text-muted-dark)",
        display: "block",
        marginBottom: "8px"
    },
    cardHeadline: {
        fontSize: "24px",
        fontWeight: "900",
        letterSpacing: "-0.02em",
        color: "var(--text-dark)",
        margin: "0 0 6px 0"
    },
    cardSubtext: {
        fontSize: "13px",
        color: "var(--text-muted-dark)",
        margin: 0
    },
    errorAlert: {
        backgroundColor: "rgba(220, 38, 38, 0.08)",
        border: "1px solid rgba(220, 38, 38, 0.2)",
        color: "#DC2626",
        padding: "12px 16px",
        borderRadius: "10px",
        fontSize: "12px",
        fontWeight: "600",
        marginBottom: "20px"
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "18px"
    },
    inputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        textAlign: "left"
    },
    label: {
        fontSize: "10px",
        fontWeight: "800",
        letterSpacing: "0.08em",
        color: "var(--text-muted-dark)"
    },
    inputWrapper: {
        display: "flex",
        alignItems: "center",
        border: "1px solid var(--border-light)",
        borderRadius: "10px",
        backgroundColor: "var(--bg-light-soft)",
        transition: "border-color 0.2s ease"
    },
    input: {
        flex: 1,
        border: "none",
        background: "transparent",
        padding: "12px 14px",
        fontSize: "14px",
        color: "var(--text-dark)",
        outline: "none",
        fontFamily: "inherit"
    },
    eyeToggle: {
        padding: "0 14px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center"
    },
    submitBtn: {
        position: "relative",
        padding: "14px 20px",
        backgroundColor: "var(--bg-dark)",
        color: "var(--text-light)",
        border: "none",
        borderRadius: "10px",
        fontSize: "12px",
        fontWeight: "800",
        letterSpacing: "0.08em",
        cursor: "pointer",
        marginTop: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "all 0.25s ease",
        outline: "none"
    },
    btnArrow: {
        fontSize: "16px",
        fontWeight: "600",
        transition: "transform 0.25s ease"
    },
    divider: {
        position: "relative",
        textAlign: "center",
        margin: "24px 0",
        borderBottom: "1px solid var(--border-light)"
    },
    dividerText: {
        position: "relative",
        top: "9px",
        backgroundColor: "var(--bg-light)",
        padding: "0 12px",
        fontSize: "11px",
        color: "var(--text-muted-dark)"
    },
    googleBtn: {
        width: "100%",
        padding: "12px",
        backgroundColor: "var(--bg-light-soft)",
        color: "var(--text-dark)",
        border: "1px solid var(--border-light)",
        borderRadius: "10px",
        fontSize: "13px",
        fontWeight: "700",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        transition: "background-color 0.2s ease"
    },
    footerNote: {
        marginTop: "24px",
        textAlign: "center",
        fontSize: "12px",
        color: "var(--text-muted-dark)"
    },
    productTagline: {
        marginTop: "20px",
        paddingTop: "16px",
        borderTop: "1px solid var(--border-light)",
        textAlign: "center",
        fontSize: "9px",
        fontWeight: "800",
        color: "var(--text-muted-dark)",
        letterSpacing: "0.12em"
    }
};

export default Login;