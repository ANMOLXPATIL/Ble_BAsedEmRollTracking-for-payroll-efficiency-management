import React from "react";
import PrimaryCTA from "./PrimaryCTA";
import { Reveal } from "./Reveal";

const CTASection = () => {
    return (
        <section id="cta" style={styles.section}>
            <div style={styles.container}>
                <Reveal delay={0}>
                    <h2 style={styles.heading}>
                        SEE THE WORK.<br />
                        UNDERSTAND THE COST.
                    </h2>
                </Reveal>
                <Reveal delay={0.1}>
                    <p style={styles.subtext}>From BLE presence signal to workforce insight.</p>
                </Reveal>
                <Reveal delay={0.2}>
                    <div style={styles.btnGroup}>
                        <PrimaryCTA secondaryColor="var(--text-light)" />
                    </div>
                </Reveal>
            </div>
        </section>
    );
};

const styles = {
    section: {
        backgroundColor: "var(--bg-dark)",
        color: "var(--text-light)",
        padding: "64px 0",
        textAlign: "center"
    },
    container: {
        maxWidth: "900px",
        margin: "0 auto",
        padding: "0 32px"
    },
    heading: {
        fontSize: "52px",
        fontWeight: "900",
        lineHeight: "0.98",
        letterSpacing: "-0.04em",
        color: "var(--text-light)",
        marginBottom: "20px"
    },
    subtext: {
        fontSize: "18px",
        color: "var(--text-muted-light)",
        marginBottom: "36px"
    },
    btnGroup: {
        display: "flex",
        justifyContent: "center",
        width: "100%"
    }
};

export default CTASection;