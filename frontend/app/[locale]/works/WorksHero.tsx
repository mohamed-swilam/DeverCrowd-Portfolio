"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useTranslations } from "next-intl";

export default function WorksHero() {
    const t = useTranslations("Works");
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

    return (
        <div ref={ref} className="relative flex h-[50vh] min-h-[320px] items-center justify-center overflow-hidden">
            <motion.div className="absolute inset-0" style={{ y }}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10" />
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 20% 50%, rgba(56,101,248,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(146,56,248,0.1) 0%, transparent 50%)",
                    }}
                />
            </motion.div>

            <motion.div className="relative z-10 text-center px-4" style={{ opacity }}>

                <motion.h1
                    className="text-5xl font-extrabold tracking-tight md:text-7xl"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    {t("title_start")}{" "}
                    <span
                        style={{
                            background: "linear-gradient(135deg, var(--primary), var(--accent))",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        {t("highlight")}
                    </span>
                </motion.h1>
                <motion.p
                    className="mt-4 text-base text-muted-foreground max-w-xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {t("description")}
                </motion.p>
            </motion.div>
        </div>
    );
}