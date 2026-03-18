"use client";

import { motion, useScroll, useSpring } from "framer-motion";

const ScrollProgress = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 200,
        damping: 30,
        restDelta: 0.001,
    });

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-[3px] origin-left"
            style={{
                scaleX,
                zIndex: 99999,
                background: "linear-gradient(90deg, hsl(211, 99%, 32%), hsl(27, 63%, 43%), hsl(35, 80%, 55%))",
                boxShadow: "none",
            }}
        />
    );
};

export default ScrollProgress;
