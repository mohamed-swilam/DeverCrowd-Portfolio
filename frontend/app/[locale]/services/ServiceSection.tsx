"use client";

import { useRef, ReactNode } from "react";
import { motion, useInView } from "motion/react";
import { ChevronDown } from "lucide-react";

interface ServiceSectionProps {
    title: string;
    subtitle: string;
    icon: ReactNode;
    text: string;
    accent: string;
    points: string[];
    bg: string;
    background: ReactNode;
    index: number;
    isLast: boolean;
}

export default function ServiceSection({
    title,
    subtitle,
    icon,
    text,
    accent,
    points,
    bg,
    background,
    index,
    isLast,
}: ServiceSectionProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: false, margin: "-20%" });
    const isEven = index % 2 === 0;

    return (
        <section
            ref={ref}
            className="relative flex h-screen w-full items-center justify-center overflow-hidden"
        >
            {/* Background animation */}
            <div className="absolute inset-0">{background}</div>

            {/* Gradient overlay */}
            <div
                className="absolute inset-0"
                style={{ background: bg }}
            />
            <div className="absolute inset-0 bg-background/60" />

            {/* Number */}
            <div
                className="absolute top-8 right-8 font-mono text-8xl font-black opacity-[0.04] select-none"
                style={{ color: accent }}
            >
                0{index + 1}
            </div>

            {/* Content */}
            <div className={`relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-6 md:flex-row md:gap-16 ${isEven ? "" : "md:flex-row-reverse"}`}>

                {/* Icon side */}
                <motion.div
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div
                        className="relative flex h-40 w-40 items-center justify-center rounded-3xl md:h-56 md:w-56"
                        style={{
                            background: `radial-gradient(circle at center, ${accent}18 0%, ${accent}06 100%)`,
                            border: `1px solid ${accent}20`,
                            boxShadow: `0 0 60px ${accent}15, inset 0 0 40px ${accent}08`,
                        }}
                    >
                        {/* Rotating ring */}
                        <motion.div
                            className="absolute inset-0 rounded-3xl"
                            style={{
                                border: `1px solid ${accent}30`,
                                boxShadow: `0 0 20px ${accent}10`,
                            }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        />

                        <motion.div
                            className="text-6xl md:text-8xl"
                            style={{ color: accent }}
                            animate={isInView ? {
                                filter: [`drop-shadow(0 0 0px ${accent})`, `drop-shadow(0 0 20px ${accent})`, `drop-shadow(0 0 0px ${accent})`],
                            } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            {icon}
                        </motion.div>
                    </div>

                    {/* Index indicator */}
                    <div className="mt-6 flex gap-2">
                        {[0, 1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-1 rounded-full transition-all duration-300"
                                style={{
                                    width: i === index ? 24 : 8,
                                    background: i === index ? accent : `${accent}30`,
                                }}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* Text side */}
                <div className="flex flex-col gap-6 md:max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <span
                            className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest"
                            style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}25` }}
                        >
                            {subtitle}
                        </span>
                        <h2 className="text-5xl font-black tracking-tight text-foreground md:text-7xl">
                            {title}
                        </h2>
                    </motion.div>

                    <motion.p
                        className="text-base text-muted-foreground leading-relaxed md:text-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {text}
                    </motion.p>

                    <motion.ul
                        className="flex flex-col gap-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        {points.map((point, i) => (
                            <motion.li
                                key={i}
                                className="flex items-center gap-3 text-sm text-foreground/80"
                                initial={{ opacity: 0, x: -10 }}
                                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                                transition={{ duration: 0.4, delay: 0.35 + i * 0.07 }}
                            >
                                <span
                                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs"
                                    style={{ background: `${accent}20`, color: accent }}
                                >
                                    ✓
                                </span>
                                {point}
                            </motion.li>
                        ))}
                    </motion.ul>
                </div>
            </div>

            {/* Scroll indicator */}
            {!isLast && (
                <motion.div
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    <ChevronDown className="h-5 w-5 text-muted-foreground/40" />
                </motion.div>
            )}
        </section>
    );
}