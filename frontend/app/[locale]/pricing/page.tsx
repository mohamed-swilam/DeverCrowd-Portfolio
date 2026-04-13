"use client";

import { useState, useMemo } from "react";
import { PricingPlan, usePublicPricingPlans } from "@/hooks/usePricing";
import { Check, Star, AlertCircle, Loader2, Globe, Smartphone, Layers, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "@/i18n/navigation";

import { useLenis } from "@/hooks/useLenis";
import { useTranslations } from "next-intl";

// ─── Types ─────────────────────────────────────────────────────────────────────
type ServiceType = "all" | "web" | "mobile" | "web+mobile" | "shopify";
type BillingCycle = "all" | "monthly" | "yearly" | "one-time";

// ─── Constants ─────────────────────────────────────────────────────────────────
const SERVICE_TABS: { value: ServiceType; label: string; icon: React.ReactNode }[] = [
  { value: "all", label: "All", icon: <Layers className="h-4 w-4" /> },
  { value: "web", label: "Web", icon: <Globe className="h-4 w-4" /> },
  { value: "mobile", label: "Mobile", icon: <Smartphone className="h-4 w-4" /> },
  { value: "web+mobile", label: "Web + Mobile", icon: <Layers className="h-4 w-4" /> },
  { value: "shopify", label: "Shopify", icon: <ShoppingBag className="h-4 w-4" /> },
];

const BILLING_TABS: { value: BillingCycle; label: string; badge?: string }[] = [
  { value: "all", label: "All" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly", badge: "Save 20%" },
  { value: "one-time", label: "One-time" },
];

// ─── Plan Card ─────────────────────────────────────────────────────────────────
function PlanCard({ plan, index }: { plan: PricingPlan; index: number }) {
  const t = useTranslations("Pricing");
  const hasDiscount = plan.discountPercent > 0;

  return (
    <motion.div
      key={plan._id}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, scale: 0.97 }}
      transition={{ duration: 0.35, delay: index * 0.07, ease: "easeOut" }}
      className={cn(
        "relative flex flex-col rounded-2xl border border-border bg-card p-7 overflow-visible",
        plan.highlighted && "border-primary/40 shadow-[0_0_0_1px_rgba(56,101,248,0.2)]"
      )}
    >
      {/* Most Popular badge */}
      {plan.highlighted && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold text-white"
            style={{ background: "linear-gradient(135deg, var(--primary), var(--accent))" }}
          >
            <Star style={{ width: 10, height: 10, fill: "white" }} />
            {t("most_popular")}
          </span>
        </div>
      )}

      {/* Discount ribbon */}
      {hasDiscount && (
        <div className="absolute top-4 -right-0.5 z-10">
          <div className="rounded-l-xl px-3 py-1 text-xs font-bold text-white flex flex-row-reverse gap-1"
            style={{ background: "linear-gradient(135deg, #e53e3e, #c53030)" }}>
            {t("off")} %{plan.discountPercent} 
          </div>
          <div className="absolute -bottom-2 right-0 w-0 h-0"
            style={{ borderLeft: "4px solid #9b2c2c", borderBottom: "4px solid transparent" }} />
        </div>
      )}

      {/* Title & description */}
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-foreground">{plan.title}</h3>
        {plan.description && (
          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{plan.description}</p>
        )}
      </div>

      {/* Price */}
      <div className="mb-2">
        {hasDiscount ? (
          <>
            <p className="text-sm text-muted-foreground line-through mb-1">
              {plan.currency} {plan.originalPrice}
            </p>
            <span className="text-4xl font-extrabold text-foreground">
              {plan.currency} {plan.realPrice ?? plan.originalPrice}
            </span>
          </>
        ) : (
          <span className="text-4xl font-extrabold text-foreground">
            {plan.originalPrice === 0 ? t("free") : `${plan.currency} ${plan.realPrice ?? plan.originalPrice}`}
          </span>
        )}
      </div>

      {/* Billing cycle badge */}
      <div className="mb-5">
        <span className="inline-block text-xs text-muted-foreground border border-border rounded-full px-2.5 py-0.5">
          {plan.billingCycle === "monthly" && t("billed_monthly")}
          {plan.billingCycle === "yearly" && t("billed_yearly")}
          {plan.billingCycle === "one-time" && t("billed_one_time")}
        </span>
      </div>

      <div className="h-px bg-border mb-5" />

      {/* Features */}
      {plan.features.length > 0 && (
        <ul className="mb-7 flex-1 space-y-3">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                style={{ background: "rgba(56,101,248,0.12)" }}>
                <Check style={{ width: 9, height: 9, color: "var(--primary)", strokeWidth: 2.5 }} />
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}

      {/* CTA */}
      <Link
        href="/contact"
        className={cn(
          "mt-auto block w-full rounded-xl px-4 py-2.5 text-center text-sm font-semibold transition-all duration-200",
          plan.highlighted
            ? "text-white hover:scale-[1.02] hover:shadow-[0_4px_20px_rgba(146,56,248,0.35)]"
            : "border border-border bg-background text-foreground hover:bg-muted"
        )}
        style={plan.highlighted ? {
          background: "linear-gradient(135deg, var(--primary), var(--accent))",
          boxShadow: "0 2px 12px rgba(146,56,248,0.25)"
        } : {}}
      >
        {t("get_started")}
      </Link>
    </motion.div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function PricingPage() {
  const t = useTranslations("Pricing");
  useLenis();
  const { data: plans = [], isLoading, isError } = usePublicPricingPlans();

  const [activeService, setActiveService] = useState<ServiceType>("all");
  const [activeBilling, setActiveBilling] = useState<BillingCycle>("all");

  // Filter plans based on selections
  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      const serviceMatch = activeService === "all" || (plan as any).serviceType === activeService;
      const billingMatch = activeBilling === "all" || plan.billingCycle === activeBilling;
      return serviceMatch && billingMatch;
    });
  }, [plans, activeService, activeBilling]);

  // Show only service tabs that have plans
  const availableServices = useMemo(() => {
    return SERVICE_TABS.filter((tab) => {
      if (tab.value === "all") return true;
      return plans.some((p) => (p as any).serviceType === tab.value);
    });
  }, [plans]);

  // Show only billing tabs that have plans
  const availableBilling = useMemo(() => {
    return BILLING_TABS.filter((tab) => {
      if (tab.value === "all") return true;
      return plans.some((p) => p.billingCycle === tab.value);
    });
  }, [plans]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">

      {/* Header */}
      <motion.div
        className="mb-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          {t("title_start")}{" "}
          <span style={{
            background: "linear-gradient(135deg, var(--primary), var(--accent))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            {t("highlight")}
          </span>{" "}
          {t("title_end")}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {t("description")}
        </p>
      </motion.div>

      {/* ── Service Type Filter ─────────────────────────────────────────────── */}
      <motion.div
        className="mb-6 flex flex-wrap items-center justify-center gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {availableServices.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveService(tab.value)}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-200",
              activeService === tab.value
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
            )}
          >
            {tab.icon}
            {t(tab.value === "web+mobile" ? "web_mobile" : tab.value)}
          </button>
        ))}
      </motion.div>

      {/* ── Billing Cycle Toggle ────────────────────────────────────────────── */}
      <motion.div
        className="mb-12 flex items-center justify-center "
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <div className="inline- rounded-xl border border-border bg-card p-1 gap-1">
          {availableBilling.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveBilling(tab.value)}
              className={cn(
                "relative inline-flex items-center gap-2 rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-200",
                activeBilling === tab.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t(tab.value === "one-time" ? "one_time" : tab.value)}
              {tab.badge && (
                <span className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                  activeBilling === tab.value
                    ? "bg-white/20 text-white"
                    : "bg-green-500/15 text-green-500"
                )}>
                  {t("save")} 20%
                </span>
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-24 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          {t("loading")}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="flex items-center justify-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {t("error")}
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && filteredPlans.length === 0 && (
        <motion.p
          className="py-20 text-center text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {t("empty")}
        </motion.p>
      )}

      {/* ── Plans Grid ──────────────────────────────────────────────────────── */}
      {!isLoading && !isError && filteredPlans.length > 0 && (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeService}-${activeBilling}`}
            className={cn(
              "grid gap-8 pt-6",
              filteredPlans.length === 1 && "mx-auto max-w-sm",
              filteredPlans.length === 2 && "sm:grid-cols-2",
              filteredPlans.length >= 3 && "sm:grid-cols-2 lg:grid-cols-3"
            )}
          >
            {filteredPlans.map((plan, index) => (
              <PlanCard key={plan._id} plan={plan} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </section>
  );
}