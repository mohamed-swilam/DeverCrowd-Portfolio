"use client";

import { Link } from "@/i18n/navigation";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Settings,
  Users,
  MessageSquare,
  Code2,
  LogOut,
  ExternalLink,
  Tags,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { post } from "@/data/api";
import { clearAdminCookie, STORAGE_TOKEN_KEY } from "@/lib/auth";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard, match: "exact" },
  { name: "Blog", href: "/admin/blogs", icon: FileText, match: "prefix" },
  { name: "Projects", href: "/admin/projects", icon: Briefcase, match: "prefix" },
  { name: "Pricing", href: "/admin/pricing", icon: Tags, match: "prefix" },
  { name: "Admins", href: "/admin/admins", icon: Users, match: "prefix" },
  { name: "Messages", href: "/admin/messages", icon: MessageSquare, match: "prefix" },
];

function isActivePath(pathname, href, mode) {
  if (mode === "exact") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebarNav({ className, onNavigate }) {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState("");

  useEffect(() => {
    setUsername(localStorage.getItem("username") ?? "");
  }, []);
  const handleLogout = async () => {
    try {
      await post("/api/admin/logout", {});
    } catch {
      /* still clear local session */
    }
    clearAdminCookie(STORAGE_TOKEN_KEY);
    clearAdminCookie("username");
    toast.message("Signed out");
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <Link
        href="/"
        onClick={onNavigate}
        className="flex items-center gap-2 border-b border-border px-5 py-4 transition hover:bg-muted/50"
      >
        <Code2 className="h-8 w-8 shrink-0 text-primary" aria-hidden />
        <span className="text-lg font-bold tracking-tight gradient-text">DeverCrowd</span>
      </Link>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Admin">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActivePath(pathname, item.href, item.match);
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5 shrink-0 opacity-90" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <Button variant="outline" size="sm" className="mb-2 w-full justify-start gap-2" asChild>
          <a href="/" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
            View site
          </a>
        </Button>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 px-3 py-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
            DC
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{username}</p>
            <p className="truncate text-xs text-muted-foreground">Dashboard</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            className="shrink-0"
            aria-label="Sign out"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
