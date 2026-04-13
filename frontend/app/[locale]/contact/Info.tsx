"use client";

import { motion } from "motion/react";
import { Link } from "@/i18n/navigation";

import { informations, socials } from "@/data/static/contact";
import { useTranslations } from "next-intl";

export default function Info() {
  const t = useTranslations("Contact");

  return (
    <div className="flex h-full flex-col justify-between gap-10">
      {/* Header */}
      <div>
        <motion.p
          className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary/60"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t("info.subtitle")}
        </motion.p>
        <motion.h1
          className="text-4xl font-black tracking-tight text-foreground md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {t("info.title_start")}
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, var(--primary), var(--accent))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {t("info.highlight")}
          </span>
        </motion.h1>
        <motion.p
          className="mt-4 text-sm text-muted-foreground leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {t("info.description")}
        </motion.p>
      </div>

      {/* Info items */}
      <div className="flex flex-col gap-3">
        {informations.map((info, i) => (
          <motion.div
            key={info.key}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card/40 px-5 py-4 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card/60"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg"
              style={{ background: "color-mix(in srgb, var(--primary) 12%, transparent)", color: "var(--primary)" }}
            >
              {info.icon}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t(`info.${info.key}`)}</p>
              <p className="text-sm font-medium text-foreground">{info.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <p className="text-xs uppercase tracking-widest text-muted-foreground/50">{t("info.devider")}</p>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Socials */}
      <motion.div
        className="flex flex-wrap gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        {socials.map((social, i) => (
          <Link
            key={i}
            href={social.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card/40 text-lg text-muted-foreground backdrop-blur-sm transition-all duration-200 hover:border-primary/40 hover:bg-primary/10 hover:text-primary hover:scale-110"
          >
            {social.icon}
          </Link>
        ))}
      </motion.div>
    </div>
  );
}