"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { FileText } from "lucide-react";
import blogs from "@/data/dynamic/blogs";

export default function BlogsPage() {
  const hasPosts = blogs.length > 0;

  return (
    <section className="relative min-h-[calc(100vh-4rem)] px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
        >
          Blog
        </motion.h1>
        <p className="mt-3 text-muted-foreground">
          Insights on web development, design, and building digital products.
        </p>
      </div>

      {hasPosts && (
        <ul className="mx-auto mt-12 max-w-3xl space-y-4">
          {blogs.map((post) => (
            <li key={post.id}>
              <article className="rounded-xl border border-border bg-card p-6 text-left transition hover:border-primary/40">
                <h2 className="text-lg font-semibold text-foreground">{post.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
                <Link
                  href={`/blogs/${post.slug}`}
                  className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
                >
                  Read more
                </Link>
              </article>
            </li>
          ))}
        </ul>
      )}

      {!hasPosts && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-16 flex max-w-md flex-col items-center rounded-2xl border border-dashed border-border bg-muted/30 px-8 py-14 text-center"
        >
          <FileText className="mb-4 h-12 w-12 text-muted-foreground" aria-hidden />
          <p className="font-medium text-foreground">No articles yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            We&apos;re preparing valuable content. Check back soon or{" "}
            <Link href="/contact" className="text-primary underline-offset-4 hover:underline">
              get in touch
            </Link>
            .
          </p>
        </motion.div>
      )}
    </section>
  );
}
