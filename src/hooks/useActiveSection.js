import { useState, useEffect } from "react";

export const sectionsConfig = [
    { id: "hero", label: "Home", theme: "light" },
    { id: "how-it-works", label: "Pipeline", theme: "dark" },
    { id: "product", label: "Insights", theme: "light" },
    { id: "technology", label: "Technology", theme: "dark" },
    { id: "cta", label: "Get Started", theme: "dark" }
];

export const useActiveSection = () => {
    const [activeSection, setActiveSection] = useState("hero");
    const [sectionTheme, setSectionTheme] = useState("light");

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: "-25% 0px -50% 0px",
            threshold: [0.1, 0.4]
        };

        const handleIntersect = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    setActiveSection(id);
                    const config = sectionsConfig.find((s) => s.id === id);
                    if (config) {
                        setSectionTheme(config.theme);
                    }
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersect, observerOptions);

        sectionsConfig.forEach((sec) => {
            const el = document.getElementById(sec.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    return { activeSection, sectionTheme };
};
