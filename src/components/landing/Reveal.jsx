import React, { useEffect, useRef, useState } from "react";

export const Reveal = ({ children, delay = 0 }) => {
    const [hasEntered, setHasEntered] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setHasEntered(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            style={{
                opacity: hasEntered ? 1 : 0,
                transform: hasEntered ? "translateY(0px)" : "translateY(16px)",
                transition: `opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`
            }}
        >
            {children}
        </div>
    );
};
