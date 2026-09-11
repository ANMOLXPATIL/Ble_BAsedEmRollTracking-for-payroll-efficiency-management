import React from "react";
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import ProblemSection from "../components/landing/ProblemSection";
import SolutionFlow from "../components/landing/SolutionFlow";
import AttendanceSection from "../components/landing/AttendanceSection";
import PlannedVsActual from "../components/landing/PlannedVsActual";
import LaborCostSection from "../components/landing/LaborCostSection";
import TechnologySection from "../components/landing/TechnologySection";
import ResponsibleDesign from "../components/landing/ResponsibleDesign";
import CTASection from "../components/landing/CTASection";
import Footer from "../components/landing/Footer";

const LandingPage = () => {
    return (
        <div style={{ backgroundColor: "var(--bg-light)", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
            <Navbar />
            <Hero />
            <SolutionFlow />
            <ProblemSection />
            <AttendanceSection />
            <PlannedVsActual />
            <LaborCostSection />
            <TechnologySection />
            <ResponsibleDesign />
            <CTASection />
            <Footer />
        </div>
    );
};

export default LandingPage;