"use client";

import { useQuery } from "@tanstack/react-query";
import { get } from "@/data/api";
import { Loader2, AlertCircle, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { useLenis } from "@/hooks/useLenis";

interface Blog {
  _id: string;
  slug: string;
  title: string;
  subtitle?: string;
  body?: string;
  tags?: string[];
  writer_name?: string;
  writer_pic?: string;
  category?: string;
  featured_image?: string;
  updatedAt?: string;
  createdAt?: string;
  status?: string;
  likes?: unknown[];
}

function usePublicBlogs() {
  return useQuery({
    queryKey: ["blogs", "public"],
    queryFn: async () => {
      const res = await get<{ blogs: Blog[] }>("/api/blogs");
      if (!res.ok) throw new Error(res.message || "Could not load blogs");
      return (res.data as { blogs: Blog[] })?.blogs ?? [];
    },
    staleTime: 1000 * 60 * 5,
  });
}

function readTime(body?: string): string {
  if (!body) return "1 min read";
  const words = body.replace(/<[^>]*>/g, "").split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

function formatDate(date?: string): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

// ─── Hero Card (first blog) ───────────────────────────────────────────────────
function HeroBlogCard({ blog }: { blog: Blog }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Link
        href={`/blogs/${blog.slug}`}
        className="group relative flex flex-col lg:flex-row overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_40px_color-mix(in_srgb,var(--primary)_8%,transparent)]"
      >
        {/* Image */}
        <div className="relative h-64 lg:h-80 lg:w-1/2 overflow-hidden bg-muted shrink-0">
          {blog.featured_image ? (
            <img
              src={blog.featured_image}
              alt={blog.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div
              className="h-full w-full"
              style={{
                background: "radial-gradient(ellipse at 40% 50%, color-mix(in srgb, var(--primary) 20%, transparent), color-mix(in srgb, var(--accent) 10%, transparent))",
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/20 lg:block hidden" />
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center gap-5 p-8 lg:p-12 lg:w-1/2">
          <div className="flex flex-wrap gap-2">
            {blog.tags?.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full px-3 py-1 text-xs font-medium"
                style={{ background: "color-mix(in srgb, var(--primary) 12%, transparent)", color: "var(--primary)" }}
              >
                #{tag}
              </span>
            ))}
          </div>

          <div>
            <h2 className="text-2xl font-black tracking-tight text-foreground md:text-3xl lg:text-4xl leading-tight line-clamp-3">
              {blog.title}
            </h2>
            {blog.subtitle && (
              <p className="mt-3 text-base text-muted-foreground line-clamp-2">{blog.subtitle}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {blog.writer_pic ? (
                <img src={blog.writer_pic} alt={blog.writer_name} className="h-8 w-8 rounded-full object-cover" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
                  style={{ background: "color-mix(in srgb, var(--primary) 15%, transparent)", color: "var(--primary)" }}>
                  {(blog.writer_name ?? "A")[0].toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-foreground">{blog.writer_name ?? "Admin"}</p>
                <p className="text-xs text-muted-foreground">{formatDate(blog.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {readTime(blog.body)}
              </span>
              <span
                className="flex items-center gap-1.5 font-medium transition-colors group-hover:text-primary"
                style={{ color: "var(--primary)" }}
              >
                Read more
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Regular Blog Card ────────────────────────────────────────────────────────
function BlogCard({ blog, index }: { blog: Blog; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="h-full"
    >
      <Link
        href={`/blogs/${blog.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_color-mix(in_srgb,var(--primary)_6%,transparent)]"
      >
        {/* Image */}
        <div className="relative h-52 w-full overflow-hidden bg-muted shrink-0">
          {blog.featured_image ? (
            <img
              src={blog.featured_image}
              alt={blog.title}
              className="absolute inset-0 h-full w-full max-h-52 object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div
              className="h-full w-full"
              style={{
                background: `radial-gradient(ellipse at 50% 50%, color-mix(in srgb, var(--primary) ${15 + index * 3}%, transparent), transparent)`,
              }}
            />
          )}
          {blog.category && (
            <span className="absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-sm"
              style={{ background: "rgba(0,0,0,0.5)", color: "white" }}>
              {blog.category}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-3 p-5">
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {blog.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{ background: "color-mix(in srgb, var(--primary) 10%, transparent)", color: "var(--primary)" }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <h3 className="text-lg font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {blog.title}
          </h3>

          {blog.subtitle && (
            <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{blog.subtitle}</p>
          )}

          <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
            <div className="flex items-center gap-2">
              {blog.writer_pic ? (
                <img src={blog.writer_pic} alt={blog.writer_name} className="h-6 w-6 rounded-full object-cover" />
              ) : (
                <div className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{ background: "color-mix(in srgb, var(--primary) 15%, transparent)", color: "var(--primary)" }}>
                  {(blog.writer_name ?? "A")[0].toUpperCase()}
                </div>
              )}
              <span className="text-xs text-muted-foreground">{blog.writer_name ?? "Admin"}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {readTime(blog.body)}
              </span>
              <span>{formatDate(blog.createdAt)}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BlogsPage() {
  useLenis();
  const { data: blogs = [], isLoading, isError } = usePublicBlogs();
  const published = blogs.filter((b) => b.status !== "draft");
  const [hero, ...rest] = published;

  return (
    <main className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      {/* Header */}
      <motion.div
        className="mb-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.4em] text-primary/60">
          Blog
        </p>
        <h1 className="text-5xl font-black tracking-tight md:text-7xl">
          Latest{" "}
          <span style={{
            background: "linear-gradient(135deg, var(--primary), var(--accent))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Articles
          </span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Insights, tutorials, and updates from the DeverCrowd team.
        </p>
      </motion.div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-24 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading articles…
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="flex items-center justify-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Failed to load articles. Please try again later.
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && published.length === 0 && (
        <p className="py-20 text-center text-muted-foreground">No articles published yet.</p>
      )}

      {/* Content */}
      {!isLoading && !isError && published.length > 0 && (
        <div className="space-y-12">
          {/* Hero */}
          {hero && <HeroBlogCard blog={hero} />}

          {/* Grid */}
          {rest.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((blog, i) => (
                <BlogCard key={blog._id} blog={blog} index={i} />
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}