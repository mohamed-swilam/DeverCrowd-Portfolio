"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { get } from "@/data/api";
import { normalizeProject, type Project, type NormalizedProject } from "@/hooks/useProjects";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

import { motion } from "motion/react";
import { ArrowLeft, ExternalLink, AlertCircle, Loader2 } from "lucide-react";
import { BsGithub } from "react-icons/bs";
import { useLenis } from "@/hooks/useLenis";

export default function ProjectDetail() {
  useLenis();
  const { id } = useParams<{ id: string }>();

  const { data: project, isLoading, isError } = useQuery<NormalizedProject>({
    queryKey: ["project", id],
    queryFn: async () => {
      // Note: assuming /api/projects/:id exists, otherwise we fetch all and find
      try {
        const res = await get<{ project: Project }>(`/api/projects/${id}`);
        if (res.ok && res.data?.project) {
          return normalizeProject(res.data.project);
        }
      } catch (err) {}
      
      // Fallback: fetch all and find if single fetch fails
      const allRes = await get<{ projects: Project[] }>("/api/projects");
      if (!allRes.ok) throw new Error("Failed to load project");
      const found = (allRes.data?.projects ?? []).find(p => p._id === id);
      if (!found) throw new Error("Project not found");
      return normalizeProject(found);
    },
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
          <AlertCircle className="h-5 w-5" />
          Project not found or failed to load.
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        
        {/* Back Link */}
        <motion.div
           initial={{ opacity: 0, x: -10 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.4 }}
        >
          <Link href="/works" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to projects
          </Link>
        </motion.div>

        {/* Hero Image */}
        <motion.div 
          className="relative h-[40vh] min-h-[300px] w-full overflow-hidden rounded-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src={project.pic}
            alt={project.title}
            fill
            className="object-cover"
            unoptimized={project.pic?.startsWith("http")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
          
          <div className="absolute bottom-6 right-6 flex gap-3">
            {project.live && (
              <Link
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-primary/90 hover:scale-105"
              >
                <ExternalLink className="h-4 w-4" />
                Live Demo
              </Link>
            )}
            {project.github && (
              <Link
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl bg-black/40 backdrop-blur-md px-5 py-2.5 text-sm font-semibold text-white border border-white/20 shadow-lg transition hover:bg-black/60 hover:scale-105"
              >
                <BsGithub className="h-4 w-4" />
                View Code
              </Link>
            )}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div 
          className="mt-12 space-y-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Header */}
          <div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">{project.title}</h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl">{project.description}</p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Client", value: project.client },
              { label: "Timeline", value: project.timeSpend },
              { label: "Category", value: project.category },
              { label: "Status", value: project.status },
            ].map(({ label, value }) =>
              value ? (
                <div key={label} className="rounded-2xl border border-border bg-card p-5">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{label}</p>
                  <p className="text-base font-semibold text-foreground">{value}</p>
                </div>
              ) : null
            )}
          </div>

          <hr className="border-border" />

          {/* Detailed Lists */}
          <div className="grid md:grid-cols-2 gap-12">
            {[
              { label: "Core Stack", items: project.stack },
              { label: "Industry", items: project.industry },
              { label: "Scope of Work", items: project.scope },
            ].map(({ label, items }) =>
              items && items.length > 0 ? (
                <div key={label}>
                  <h3 className="text-lg font-bold text-foreground mb-4">{label}</h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item, i) => (
                      <span
                        key={i}
                        className="rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary shadow-sm"
                      >
                        {item.name}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null
            )}
          </div>

        </motion.div>
      </div>
    </main>
  );
}
