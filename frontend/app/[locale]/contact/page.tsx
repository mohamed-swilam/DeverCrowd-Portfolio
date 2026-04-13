"use client";

import { useLenis } from "@/hooks/useLenis";
import { motion } from "motion/react";
import Info from "./Info";
import ContactForm from "./Form";
import { useTranslations } from "next-intl";

export default function ContactPage() {
  const t = useTranslations("Contact");
  useLenis();

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background">

      {/* CSS-only background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full opacity-20 blur-[120px]"
          style={{ background: "var(--primary)", animation: "blob1 12s ease-in-out infinite" }}
        />
        <div
          className="absolute top-1/2 -right-40 h-[400px] w-[400px] rounded-full opacity-15 blur-[120px]"
          style={{ background: "var(--accent)", animation: "blob2 15s ease-in-out infinite" }}
        />
        <div
          className="absolute -bottom-40 left-1/3 h-[350px] w-[350px] rounded-full opacity-10 blur-[100px]"
          style={{ background: "var(--primary)", animation: "blob3 18s ease-in-out infinite" }}
        />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes blob1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, 30px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.97); }
        }
        @keyframes blob2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-30px, -20px) scale(1.04); }
          66% { transform: translate(20px, 30px) scale(0.98); }
        }
        @keyframes blob3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.06); }
        }
      `}</style>

      <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 py-24 sm:px-6">

        {/* Page title */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.4em] text-primary/50">
            {t("subtitle")}
          </p>
          <h1 className="text-5xl font-black tracking-tight md:text-7xl">
            {t("title_start")}{" "}
            <span style={{
              background: "linear-gradient(135deg, var(--primary), var(--accent))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              {t("highlight")}
            </span>
          </h1>
        </motion.div>

        {/* Main content */}
        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-[1fr_1.6fr] lg:gap-16 lg:items-start">

          {/* Info */}
          <motion.div
            className="rounded-3xl border border-border bg-card/30 p-8 backdrop-blur-md"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Info />
          </motion.div>

          {/* Form */}
          <motion.div
            className="rounded-3xl border border-border bg-card/30 p-8 backdrop-blur-md"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground">{t("form.form_title")}</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {t("form.form_desc")}
              </p>
            </div>
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </main>
  );
}