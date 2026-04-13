"use client";
export const dynamic = 'force-dynamic';
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { AdminSidebarNav } from "@/components/admin/AdminSidebarNav";
import { AdminAuthGate } from "@/components/admin/AdminAuthGate";
import { cn } from "@/lib/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../globals.css";

const queryClient = new QueryClient();

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isLogin = pathname?.includes("/admin/login");

  useEffect(() => {
    setMounted(true);
    setMobileOpen(false);
  }, [pathname]);

  if (!mounted || isLogin) {
    return (
      <>
        <Toaster richColors position="top-right" closeButton />
        {children}
      </>
    );
  }

  return (
    <AdminAuthGate>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-muted/20">
          <Toaster richColors position="top-right" closeButton />

          <header className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-between gap-3 border-b border-border bg-card/90 px-4 backdrop-blur-md lg:hidden">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0"
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <span className="truncate text-sm font-semibold text-foreground">Admin</span>
          </header>

          <aside
            className={cn(
              "fixed inset-y-0 left-0 z-50 w-[min(100vw-3rem,18rem)] border-r border-border bg-card shadow-xl transition-transform duration-200 ease-out lg:hidden",
              mobileOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <div className="flex h-14 items-center justify-end border-b border-border px-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Close navigation menu"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <AdminSidebarNav className="h-[calc(100%-3.5rem)]" onNavigate={() => setMobileOpen(false)} />
          </aside>

          {mobileOpen ? (
            <button
              type="button"
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[1px] lg:hidden"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            />
          ) : null}

          <aside className="fixed inset-y-0 left-0 z-30 hidden h-full w-64 flex-col border-r border-border bg-card lg:flex">
            <AdminSidebarNav className="min-h-0 flex-1 overflow-hidden" />
          </aside>

          <main className="min-h-screen pt-14 lg:ml-64 lg:pt-0">{children}</main>
        </div>
      </QueryClientProvider>
    </AdminAuthGate>
  );
}