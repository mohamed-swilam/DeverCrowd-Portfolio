import { MdDesignServices } from "react-icons/md";
import { IoTerminal } from "react-icons/io5";
import { BsShieldLockFill } from "react-icons/bs";
import { FaHandsHelping } from "react-icons/fa";

export const services = [
  {
    key: "design",
    subtitle: "UI/UX & Brand Identity",
    icon: <MdDesignServices />,
    accent: "#a78bfa",
    bg: "radial-gradient(ellipse at 60% 40%, rgba(167,139,250,0.12) 0%, transparent 70%), radial-gradient(ellipse at 20% 80%, rgba(139,92,246,0.08) 0%, transparent 60%)",
    text: "Turn ideas into interfaces that wow. We design sleek, modern visuals that grab attention, build trust, and keep users coming back.",
    points: [
      "Custom UI/UX design systems",
      "Brand identity & logo design",
      "Responsive web & mobile interfaces",
      "Prototyping & user testing",
    ],
  },
  {
    key: "development",
    subtitle: "Web & Mobile Engineering",
    icon: <IoTerminal />,
    accent: "#38bdf8",
    bg: "radial-gradient(ellipse at 40% 30%, rgba(56,189,248,0.12) 0%, transparent 70%), radial-gradient(ellipse at 80% 70%, rgba(14,165,233,0.08) 0%, transparent 60%)",
    text: "We build blazing-fast, scalable websites and platforms that work flawlessly — helping you grow, sell, and succeed online.",
    points: [
      "Full-stack web applications",
      "React Native mobile apps",
      "REST & GraphQL APIs",
      "Performance optimization",
    ],
  },
  {
    key: "security",
    subtitle: "Protection & Compliance",
    icon: <BsShieldLockFill />,
    accent: "#34d399",
    bg: "radial-gradient(ellipse at 50% 20%, rgba(52,211,153,0.12) 0%, transparent 70%), radial-gradient(ellipse at 30% 80%, rgba(16,185,129,0.08) 0%, transparent 60%)",
    text: "Sleep easy — your platform is protected. We secure your data, block threats, and ensure your users always feel safe.",
    points: [
      "Security audits & penetration testing",
      "SSL, firewall & DDoS protection",
      "GDPR & data compliance",
      "24/7 threat monitoring",
    ],
  },
  {
    key: "support",
    subtitle: "Ongoing Partnership",
    icon: <FaHandsHelping />,
    accent: "#fb923c",
    bg: "radial-gradient(ellipse at 70% 50%, rgba(251,146,60,0.12) 0%, transparent 70%), radial-gradient(ellipse at 20% 20%, rgba(249,115,22,0.08) 0%, transparent 60%)",
    text: "We're your tech partner, not just your developers. Get quick fixes, updates, and ongoing guidance to keep your platform running perfectly.",
    points: [
      "Priority bug fixes & updates",
      "Monthly performance reports",
      "Dedicated account manager",
      "24/7 emergency response",
    ],
  },
];
