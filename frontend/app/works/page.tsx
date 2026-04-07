"use client";

import { useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { Loader2, AlertCircle } from "lucide-react";
import { useProjects, normalizeProject, type NormalizedProject } from "@/hooks/useProjects";
import { useLenis } from "@/hooks/useLenis";
import fallbackProjects from "@/data/dynamic/projects";
import WorksHero from "./WorksHero";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";

const fallback = fallbackProjects.map(normalizeProject);
const ALL = "All";

function getCategories(projects: NormalizedProject[]): string[] {
  const cats = projects.map((p) => p.category).filter(Boolean);
  return [ALL, ...Array.from(new Set(cats))];
}

export default function WorksPage() {
  useLenis();
  const { data: projects = [], isLoading, isError} = useProjects();
  const completed = projects.filter((p) => p.status === "completed");

  const [activeCategory, setActiveCategory] = useState(ALL);
  const [selectedProject, setSelectedProject] = useState<NormalizedProject | null>(null);

  const categories = getCategories(completed);
  const filtered = activeCategory === ALL
    ? completed
    : completed.filter((p) => p.category === activeCategory);

  return (
    <>
      <div className="min-h-screen bg-background">
        <WorksHero />

        {/* Filter */}
        <div className="sticky top-16 z-30 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex gap-1 overflow-x-auto py-3 scrollbar-none">
              {categories.map((cat) => (
                <motion.button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="relative shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
                  style={{
                    color: activeCategory === cat ? "var(--primary-foreground)" : "var(--muted-foreground)",
                  }}
                >
                  {activeCategory === cat && (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 rounded-full bg-primary"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
{/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-24 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading projects…
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="flex items-center justify-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Failed to load projects. Please try again later.
        </div>
      )}
        
        {/* Grid */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          {filtered.length === 0 ? (
            <div className="py-24 text-center text-muted-foreground">No projects found.</div>
          ) : (
            <motion.div layout className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((project, index) => (
                  <motion.div
                    key={project._id || project.name}
                    layout
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className={index % 5 === 0 || index % 5 === 3 ? "md:col-span-2" : "md:col-span-1"}
                  >
                    <ProjectCard
                      project={project}
                      index={index}
                      onClick={() => setSelectedProject(project)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
}
