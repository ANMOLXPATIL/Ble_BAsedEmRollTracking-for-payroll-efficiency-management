import React from "react";

const ResponsibleDesign = () => {
    return (
        <section style={styles.section}>
            <div style={styles.container}>
                <span style={styles.eyebrow}>RESPONSIBLE TECHNICAL DESIGN</span>
                <h2 style={styles.heading}>
                    PRESENCE IS NOT<br />
                    PRODUCTIVITY.
                </h2>
                <p style={styles.subtext}>
                    EMPTRACK measures attendance and tracked presence time. It does not claim that presence alone proves active productivity, providing business managers with honest operational visibility.
                </p>
            </div>
        </section>
    );
};

const styles = {
    section: {
        backgroundColor: "var(--bg-light)",
        padding: "64px 0",
        borderBottom: "1px solid var(--border-light)",
        textAlign: "left"
    },
    container: {
        maxWidth: "900px",
        margin: "0 auto",
        padding: "0 32px"
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
        marginBottom: "20px"
    },
    subtext: {
        fontSize: "17px",
        color: "var(--text-muted-dark)",
        lineHeight: "1.6"
    }
};

export default ResponsibleDesign;