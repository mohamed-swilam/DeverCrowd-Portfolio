"use client";
export const dynamic = 'force-dynamic';

import dynamicImport  from "next/dynamic";
import Link from "next/link";
import { useQueries } from "@tanstack/react-query";
import { get } from "@/data/api";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users, FileText, Briefcase, MessageSquare,
  TrendingUp, CheckSquare, ArrowRight, Tags, Loader2,
} from "lucide-react";
import { motion } from "motion/react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

const AdminChartsSection = dynamicImport (() => import("./AdminChartsSection"), {
  ssr: false,
  loading: () => (
    <Card className="border-border">
      <CardHeader>
        <div className="h-5 w-40 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-4 w-64 max-w-full animate-pulse rounded bg-muted" />
      </CardHeader>
      <CardContent>
        <div className="h-[300px] animate-pulse rounded-lg bg-muted/60" />
      </CardContent>
    </Card>
  ),
});

export default function AdminDashboardPage() {
  const results = useQueries({
    queries: [
      {
        queryKey: ["dashboard", "blogs"],
        queryFn: async () => {
          const res = await get<{ blogs: any[] }>("/api/blogs?limit=1000");
          return res.data?.blogs ?? [];
        },
      },
      {
        queryKey: ["dashboard", "projects"],
        queryFn: async () => {
          const res = await get<{ projects: any[] }>("/api/projects");
          return res.data?.projects ?? [];
        },
      },
      {
        queryKey: ["dashboard", "messages"],
        queryFn: async () => {
          const res = await get<{ messages: any[] }>("/api/admin/message");
          return res.data?.messages ?? [];
        },
      },
      {
        queryKey: ["dashboard", "admins"],
        queryFn: async () => {
          const res = await get<{ profiles: any[] }>("/api/admin/profiles");
          return res.data?.profiles ?? [];
        },
      },
    ],
  });

  const [blogs, projects, messages, admins] = results;
  const isLoading = results.some((r) => r.isLoading);

  const stats = [
    {
      title: "Total projects",
      value: projects.data?.length ?? 0,
      icon: Briefcase,
      color: "text-blue-500",
    },
    {
      title: "Blog posts",
      value: blogs.data?.length ?? 0,
      icon: FileText,
      color: "text-emerald-500",
    },
    {
      title: "Team members",
      value: admins.data?.length ?? 0,
      icon: Users,
      color: "text-violet-500",
    },
    {
      title: "Messages",
      value: messages.data?.length ?? 0,
      icon: MessageSquare,
      color: "text-amber-500",
    },
  ];

  // Recent blogs for activity feed
  const recentBlogs = (blogs.data ?? []).slice(0, 2).map((b: any) => ({
    dot: "bg-[var(--chart-2)]",
    title: `Blog post "${b.title}" — ${b.status}`,
    time: new Date(b.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }));

  // Recent projects for activity feed
  const recentProjects = (projects.data ?? []).slice(0, 2).map((p: any) => ({
    dot: "bg-[var(--chart-1)]",
    title: `Project "${p.title}" added`,
    time: new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }));

  const activity = [...recentProjects, ...recentBlogs].slice(0, 4);

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      <AdminPageHeader
        title="Dashboard"
        description="Welcome back. Here's a snapshot of activity across your workspace."
      />

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="border-border shadow-sm transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {s.title}
                </CardTitle>
                <s.icon className={`h-4 w-4 ${s.color}`} aria-hidden />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : (
                  <div className="text-2xl font-semibold tracking-tight">
                    {s.value.toLocaleString()}
                  </div>
                )}
                <p className="mt-1 flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="mr-1 h-3 w-3 text-emerald-500" />
                  Live data
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ── Charts + Activity ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <AdminChartsSection
          blogs={blogs.data ?? []}
          projects={projects.data ?? []}
        />

        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Latest updates across projects and content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading activity…
              </div>
            ) : activity.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent activity.</p>
            ) : (
              activity.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.dot}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-snug text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Quick actions ─────────────────────────────────────────────────── */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle>Quick actions</CardTitle>
          <CardDescription>Shortcuts to common admin tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {[
              { href: "/admin/projects/add", icon: Briefcase, label: "New project" },
              { href: "/admin/blogs", icon: FileText, label: "Blog posts" },
              { href: "/admin/pricing", icon: Tags, label: "Pricing" },
              { href: "/admin/admins", icon: Users, label: "Manage admins" },
              { href: "/admin/messages", icon: MessageSquare, label: "Messages" },
              { href: "/admin/services", icon: CheckSquare, label: "Services" },
            ].map((action) => (
              <Button key={action.href} variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
                <Link href={action.href}>
                  <action.icon className="h-6 w-6 text-primary" />
                  <span>{action.label}</span>
                  <ArrowRight className="h-3 w-3 opacity-50" />
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}