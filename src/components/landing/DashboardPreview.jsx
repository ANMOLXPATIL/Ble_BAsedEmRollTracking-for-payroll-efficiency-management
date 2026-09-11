import React from "react";
import { RiQuestionAnswerLine } from "react-icons/ri";

const DashboardPreview = () => {
    const questions = [
        "How many workers are on-site right now?",
        "How many presence hours were tracked today?",
        "What is the estimated labor cost per department?",
        "Which shifts show the largest time variance?",
        "Are there any missing or open check-out events?"
    ];

    return (
        <section style={styles.section}>
            <div style={styles.container}>
                <div style={styles.header}>
                    <div style={styles.eyebrow}>OWNER-FIRST DESIGN</div>
                    <h2 style={styles.headline}>Built around the questions that matter to business owners.</h2>
                    <p style={styles.subtext}>
                        Rather than cluttering screens with raw logs, EMPTRACK turns data into direct operational answers.
                    </p>
                </div>

                <div style={styles.questionsGrid}>
                    {questions.map((q, idx) => (
                        <div key={idx} style={styles.qCard}>
                            <RiQuestionAnswerLine size={20} color="#10B981" />
                            <span style={styles.qText}>{q}</span>
                        </div>
                    ))}
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
    header: {
        textAlign: "center",
        maxWidth: "700px",
        margin: "0 auto 50px auto"
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
        color: "#64748B"
    },
    questionsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px"
    },
    qCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: "12px",
        padding: "20px",
        border: "1px solid #E2E8F0",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
    },
    qText: {
        fontSize: "15px",
        fontWeight: "600",
        color: "#0F172A"
    }
};

export default DashboardPreview;