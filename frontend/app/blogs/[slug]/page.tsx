"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Loader2, AlertCircle, Heart, Clock, ArrowLeft, Calendar, User } from "lucide-react";
import { get, post } from "@/data/api";
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
  likes?: unknown[];
  comments?: unknown[];
}

function readTime(body?: string): string {
  if (!body) return "1 min read";
  const words = body.replace(/<[^>]*>/g, "").split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

function formatDate(date?: string): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}

export default function BlogPage() {
  useLenis();
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [readProgress, setReadProgress] = useState(0);
  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await get<{ blog: Blog }>(`/api/blogs/${slug}`);
        if (!res.ok) throw new Error(res.message);
        const data = res.data as { blog: Blog };
        setBlog(data.blog);
        setLikes(data.blog.likes?.length ?? 0);
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBlog();
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const el = articleRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const progress = Math.min(100, Math.max(0, ((-top) / (height - window.innerHeight)) * 100));
      setReadProgress(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLike = async () => {
    if (liked) return;
    try {
      const res = await post(`/api/blogs/${slug}/like`, {});
      if (!res.ok) throw new Error();
      setLikes((l) => l + 1);
      setLiked(true);
    } catch {
      /* silent */
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center py-24 text-muted-foreground">
      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      Loading article…
    </div>
  );

  if (isError || !blog) return (
    <div className="mx-auto max-w-2xl px-4 py-24">
      <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
        <AlertCircle className="h-4 w-4 shrink-0" />
        Failed to load article.
      </div>
    </div>
  );

  return (
    <main className="relative min-h-screen bg-background">
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 z-50 h-0.5 bg-border w-full">
        <motion.div
          className="h-full origin-left"
          style={{
            background: "linear-gradient(90deg, var(--primary), var(--accent))",
            scaleX: readProgress / 100,
          }}
        />
      </div>

      {/* Featured image hero */}
      {blog.featured_image && (
        <div className="relative h-[50vh] w-full overflow-hidden">
          <img
            src={blog.featured_image}
            alt={blog.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
        </div>
      )}

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/blogs"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to articles
          </Link>
        </motion.div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <motion.div
            className="mb-4 flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {blog.tags.map((tag) => (
              <span key={tag}
                className="rounded-full px-3 py-1 text-xs font-medium"
                style={{ background: "color-mix(in srgb, var(--primary) 12%, transparent)", color: "var(--primary)" }}>
                #{tag}
              </span>
            ))}
          </motion.div>
        )}

        {/* Title */}
        <motion.h1
          className="mb-4 text-4xl font-black tracking-tight text-foreground md:text-5xl leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {blog.title}
        </motion.h1>

        {blog.subtitle && (
          <motion.p
            className="mb-6 text-xl text-muted-foreground leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {blog.subtitle}
          </motion.p>
        )}

        {/* Meta */}
        <motion.div
          className="mb-10 flex flex-wrap items-center gap-4 border-y border-border py-4 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <div className="flex items-center gap-2">
            {blog.writer_pic ? (
              <img src={blog.writer_pic} alt={blog.writer_name} className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
                style={{ background: "color-mix(in srgb, var(--primary) 15%, transparent)", color: "var(--primary)" }}>
                {(blog.writer_name ?? "A")[0].toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-medium text-foreground">{blog.writer_name ?? "Admin"}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(blog.createdAt)}
          </div>

          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {readTime(blog.body)}
          </div>

          {blog.category && (
            <span className="rounded-full border border-border px-2.5 py-0.5 text-xs">
              {blog.category}
            </span>
          )}
        </motion.div>

        {/* Body */}
        <motion.article
          ref={articleRef}
          className="prose prose-neutral dark:prose-invert max-w-none text-base leading-relaxed
            prose-headings:font-black prose-headings:tracking-tight
            prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-blockquote:border-primary prose-blockquote:text-muted-foreground
            prose-img:rounded-2xl prose-img:shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          dangerouslySetInnerHTML={{ __html: blog.body ?? "" }}
        />

        {/* Footer actions */}
        <motion.div
          className="mt-12 flex flex-col items-center gap-6 border-t border-border pt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <button
            onClick={handleLike}
            disabled={liked}
            className="flex items-center gap-3 rounded-full border border-border px-6 py-3 text-sm font-medium transition-all duration-200 hover:border-red-400/50 hover:bg-red-500/8 disabled:opacity-60"
            style={liked ? { borderColor: "rgba(239,68,68,0.4)", color: "rgb(239,68,68)" } : {}}
          >
            <Heart className={`h-5 w-5 transition-all ${liked ? "fill-red-500 text-red-500 scale-110" : ""}`} />
            {likes} {likes === 1 ? "like" : "likes"}
          </button>

          <Link
            href="/blogs"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all articles
          </Link>
        </motion.div>
      </div>
    </main>
  );
}