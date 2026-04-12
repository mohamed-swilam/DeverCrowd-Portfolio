"use client";
import Logo from "@/components/shared/Logo";

export default function SplashScreen() {
  return (
    <div
      className="fixed inset-0 z-100 flex flex-col items-center justify-center"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="mb-8 opacity-90">
        <Logo width={160} height={48} priority className="mx-auto" />
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
      </div>
      <p className="mt-6 text-sm text-muted-foreground">Preparing your experience…</p>
    </div>
  );
}