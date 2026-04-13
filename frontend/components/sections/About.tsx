"use client";
import { motion } from "motion/react";
import H1 from "@/components/ui/H1";
import P from "@/components/ui/P";
import { vmc as staticVmc } from "@/data/static/about";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { Link } from "@/i18n/navigation";

import { useTranslations } from "next-intl";

export default function About() {
  const t = useTranslations("About");
  
  // Create localized vmc based on static icons but using our translations
  const vmc = [
    {
      icon: staticVmc[0].icon,
      title: t("vmc.vision_title"),
      desc: t("vmc.vision_desc")
    },
    {
      icon: staticVmc[1].icon,
      title: t("vmc.mission_title"),
      desc: t("vmc.mission_desc")
    },
    {
      icon: staticVmc[2].icon,
      title: t("vmc.approach_title"),
      desc: t("vmc.approach_desc")
    }
  ];

  return (
    <motion.section
      className="relative flex min-h-screen w-full flex-col items-center justify-around gap-6 px-4 py-16 sm:px-16 overflow-hidden"
      id="about"
    >
      <div className="absolute top-1 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-96 rounded-full bg-white/5 blur-3xl opacity-90 pointer-events-none z-0" />
      <H1>{t("title")}</H1>

      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="max-w-3xl rounded-xl text-sm text-foreground md:text-base">
          <P variant="muted">
            <span className="text-primary font-semibold">DeverCrowd</span>{t("description_1")}
            <br />
            {t("description_2")}
          </P>
        </div>
      </div>

      <div className="flex w-full items-center justify-center">
        <motion.div className="flex w-full max-w-6xl flex-col gap-4 md:flex-row">
          {vmc.map((item, i) => (
            <div
              key={i}
              className="group relative flex w-full flex-col items-center rounded-2xl border border-border bg-card/60 p-5 text-center backdrop-blur-md transition duration-300 hover:border-primary/30"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-muted/40 text-xl text-primary">
                {item.icon}
              </div>
              <h3 className="mb-1 text-lg font-semibold text-foreground">{item.title}</h3>
              <P variant="small">{item.desc}</P>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="flex justify-center">
        <Link href="/services" className="flex items-center gap-3 rounded-full border border-border bg-card/50 px-4 py-2 text-sm transition-all hover:border-primary/50">
          <P variant="muted">{t("explore")}</P>
          <FaArrowAltCircleRight className="text-xl text-primary" />
        </Link>
      </div>
    </motion.section>
  );
}