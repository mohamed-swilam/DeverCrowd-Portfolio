"use client";

import { useLenis } from "@/hooks/useLenis";
import { services } from "@/data/static/services";
import ServiceSection from "./ServiceSection";
import { motion } from "motion/react";
import { Link } from "@/i18n/navigation";

import { FaArrowAltCircleRight } from "react-icons/fa";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

const DesignBg = dynamic(() => import("./backgrounds/DesignBg"), { ssr: false });
const DevBg = dynamic(() => import("./backgrounds/DevBg"), { ssr: false });
const SecurityBg = dynamic(() => import("./backgrounds/SecurityBg"), { ssr: false });
const SupportBg = dynamic(() => import("./backgrounds/SupportBg"), { ssr: false });

const backgrounds = [<DesignBg />, <DevBg />, <SecurityBg />, <SupportBg />];

export default function ServicesPage() {
  const t = useTranslations("Services");
  useLenis();

  return (
    <main className="w-full">
      {/* Hero */}
      <section className="relative flex h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "radial-gradient(circle at 50% 50%, rgba(56,101,248,0.15) 0%, transparent 60%)",
          }}
        />

        <motion.p
          className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-primary/60"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {t("subtitle")}
        </motion.p>

        <motion.h1
          className="text-6xl font-black tracking-tight md:text-8xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
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
          className="mt-6 max-w-2xl text-lg text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {t("description")}
        </motion.p>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="h-10 w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent" />
        </motion.div>
      </section>

      {/* Services */}
      {services.map((service, i) => {
        const { key, ...serviceProps } = service;
        return (
          <ServiceSection
            key={key}
            {...serviceProps}
            title={t(`items.${i}.title`)}
            subtitle={t(`items.${i}.subtitle`)}
            text={t(`items.${i}.text`)}
            points={[
              t(`items.${i}.points.0`),
              t(`items.${i}.points.1`),
              t(`items.${i}.points.2`),
              t(`items.${i}.points.3`),
            ]}
            index={i}
            background={backgrounds[i]}
            isLast={i === services.length - 1}
          />
        );
      })}

      {/* CTA */}
      <section className="flex flex-col items-center justify-center gap-8 py-32 px-6 text-center">
        <motion.h2
          className="text-4xl font-black md:text-6xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {t("cta_start")}{" "}
          <span
            style={{
              background: "linear-gradient(135deg, var(--primary), var(--accent))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {t("cta_highlight")}
          </span>
        </motion.h2>

        <motion.div
          className="flex flex-col items-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Link
            href="/contact"
            className="flex items-center gap-3 rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, var(--primary), var(--accent))",
              boxShadow: "0 0 30px color-mix(in srgb, var(--primary) 30%, transparent)",
            }}
          >
            {t("cta_button")}
            <FaArrowAltCircleRight className="text-lg" />
          </Link>

          <Link
            href="/works"
            className="flex items-center gap-3 rounded-full border border-border bg-card/40 px-8 py-3.5 text-sm font-semibold text-foreground backdrop-blur-sm transition-all duration-300 hover:border-primary/40"
          >
            {t("works_button")}
          </Link>
        </motion.div>
      </section>
    </main>
  );
}