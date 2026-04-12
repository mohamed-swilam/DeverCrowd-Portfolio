"use client";
import Link from "next/link";
import { FaEnvelope, FaQuestionCircle } from "react-icons/fa";
import { motion, Variants } from "motion/react";
import dynamic from "next/dynamic";
import { ClipLoader } from "react-spinners";
import LightRaysCSS from "@/components/shared/LightRaysCSS";
import P from "@/components/ui/P";

const CountUp = dynamic(() => import("@/components/ui/CountUp"), {
  loading: () => (
    <div className="flex justify-center items-center h-10">
      <ClipLoader color="var(--primary)" size={24} />
    </div>
  ),
  ssr: false,
});

interface Stat {
  to: number;
  label: string;
}

const stats: Stat[] = [
  { to: 5, label: "Projects" },
  { to: 3, label: "Customers" },
  { to: 4, label: "Yrs Exp." },
  { to: 3, label: "Industries" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: ["easeOut"] } },
};

const MotionP = motion.create(P);

const Hero = () => {
  return (
    <motion.section
      id="hero"
      className="relative flex justify-center items-center w-full min-h-screen overflow-hidden px-4 sm:px-16 pt-24"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="absolute inset-0 z-0">
        <LightRaysCSS
          eager
          raysOrigin="top-center"
          raysColor="#0f111a"
          raysSpeed={9}
          lightSpread={0.2}
          rayLength={1.65}
          followMouse={false}
          mouseInfluence={0.1}
          noiseAmount={0}
          distortion={0.12}
          pulsating={false}
          fadeDistance={0.55}
          saturation={0.9}
          opacity={0.42}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full gap-8">
        <motion.h1
          variants={itemVariants}
          className="font-extrabold text-center leading-tight"
          style={{ fontSize: "clamp(28px, 5vw, 52px)", color: "var(--foreground)" }}
        >
          Build{" "}
          <span style={{ background: "linear-gradient(135deg, var(--primary), var(--accent))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Digital Solutions
          </span>{" "}
          That Grow Your Business
        </motion.h1>

        <MotionP variant="muted" variants={itemVariants} className="text-center max-w-2xl">
          DeverCrowd is your digital product partner. We design and develop
          high-performing websites, mobile applications, and custom systems that
          increase leads, automate operations, and improve customer experience.
        </MotionP>

        <motion.div
          variants={itemVariants}
          className="w-full max-w-lg h-px"
          style={{ background: "linear-gradient(90deg, transparent, var(--primary), var(--accent), transparent)" }}
        />

        <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-lg">
          {stats.map(({ to, label }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center gap-1 p-4 rounded-full transition-all duration-300 hover:-translate-y-1"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "color-mix(in srgb, var(--primary) 50%, transparent)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
            >
              <div className="flex items-end gap-0.5 leading-none">
                <CountUp from={0} to={to} duration={1.5} separator="," className="text-2xl sm:text-3xl font-bold text-primary" />
                <span className="text-xs font-semibold mb-1 text-secondary">+</span>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div variants={itemVariants} className="flex items-center gap-4 flex-wrap justify-center">
          <Link
            href="/contact"
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)", boxShadow: "0 0 20px color-mix(in srgb, var(--primary) 35%, transparent)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--secondary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--primary)"; }}
          >
            <FaEnvelope />
            Book a Discovery Call
          </Link>

          <Link
            href="/works"
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200"
            style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "color-mix(in srgb, var(--accent) 60%, transparent)"; e.currentTarget.style.color = "var(--accent)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--foreground)"; }}
          >
            <FaQuestionCircle />
            View Our Work
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;
