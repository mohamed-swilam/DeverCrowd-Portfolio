"use client";

import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";

interface Item {
  createdAt?: string;
}

interface AdminChartsSectionProps {
  blogs?: Item[];
  projects?: Item[];
}

function groupByMonth(items: Item[]) {
  const months: Record<string, number> = {};
  items.forEach((item) => {
    if (!item.createdAt) return;
    const date = new Date(item.createdAt);
    const key = date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    months[key] = (months[key] ?? 0) + 1;
  });
  return months;
}

function buildChartData(blogs: Item[], projects: Item[]) {
  const blogsByMonth = groupByMonth(blogs);
  const projectsByMonth = groupByMonth(projects);

  const allKeys = Array.from(
    new Set([...Object.keys(blogsByMonth), ...Object.keys(projectsByMonth)])
  ).sort((a, b) => new Date("1 " + a).getTime() - new Date("1 " + b).getTime());

  // Show last 6 months max
  const recentKeys = allKeys.slice(-6);

  return recentKeys.map((key) => ({
    name: key.split(" ")[0], // e.g. "Jan"
    projects: projectsByMonth[key] ?? 0,
    blogs: blogsByMonth[key] ?? 0,
  }));
}

export default function AdminChartsSection({
  blogs = [],
  projects = [],
}: AdminChartsSectionProps) {
  const data = buildChartData(blogs, projects);

  const isEmpty = data.length === 0;

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle>Monthly activity</CardTitle>
        <CardDescription>
          Projects and blog posts created each month
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-0">
        {isEmpty ? (
          <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
            No data available yet.
          </div>
        ) : (
          <div style={{ width: "100%", height: 300, minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--foreground)",
                  }}
                />
                <Legend />
                <Bar dataKey="projects" name="Projects" fill="var(--chart-1)" radius={[4, 4, 0, 0]} maxBarSize={48} />
                <Bar dataKey="blogs" name="Blog posts" fill="var(--chart-2)" radius={[4, 4, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}