"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const SplashScreen = dynamic(() => import("@/components/shared/SplashScreen"), { ssr: false });

interface SplashGateProps {
  children: React.ReactNode;
}

export function SplashGate({ children }: SplashGateProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      setReady(true);
      return;
    }

    const key = "dc_splash_done";
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(key)) {
      setReady(true);
      return;
    }

    let cancelled = false;
    const start = performance.now();
    const minMs = 900;

    Promise.all([
      import("@/components/ui/CountUp"),
      import("framer-motion"),
    ])
      .catch(() => {})
      .finally(() => {
        if (cancelled) return;
        const elapsed = performance.now() - start;
        const wait = Math.max(0, minMs - elapsed);
        setTimeout(() => {
          if (typeof sessionStorage !== "undefined") sessionStorage.setItem(key, "1");
          setReady(true);
        }, wait);
      });

    return () => { cancelled = true; };
  }, [isAdmin]);

  const showSplash = !isAdmin && !ready;

  return (
    <>
      <div
        className={cn(
          "transition-opacity duration-500 ease-out",
          showSplash ? "pointer-events-none opacity-0" : "opacity-100"
        )}
        aria-hidden={showSplash}
      >
        {children}
      </div>
      {showSplash ? <SplashScreen /> : null}
    </>
  );
}