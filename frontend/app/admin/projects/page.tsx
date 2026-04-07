"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminLoader } from "@/components/admin/AdminLoader";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { cn } from "@/lib/utils";
import { mediaUrl } from "@/lib/mediaUrl";
import {
  useProjects,
  useDeleteProject,
  type Project,
} from "@/hooks/useProjects";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import P from "@/components/ui/P";

function statusBadgeClass(status: string): string {
  const s = (status || "").toLowerCase();
  if (s === "completed")
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
  if (s === "in progress" || s === "in_progress")
    return "border-primary/30 bg-primary/10 text-primary";
  if (s === "review")
    return "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-400";
  return "border-border bg-muted text-muted-foreground";
}

function ProjectCover({ src, title }: { src: string; title: string }) {
  const url = mediaUrl(src);
  const remote = typeof url === "string" && /^https?:\/\//.test(url);
  return (
    <div className="relative h-44 w-full overflow-hidden rounded-t-xl bg-muted">
      {src ? (
        <Image
          src={url}
          alt={title || "Project"}
          fill
          className="object-cover transition duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 400px"
          unoptimized={remote}
        />
      ) : (
        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
          No image
        </div>
      )}
    </div>
  );
}

export default function AdminProjectsPage() {
  const [search, setSearch] = useState("");
  const { data: projects = [], isLoading, isError, error } = useProjects();
  const deleteProject = useDeleteProject();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filtered = projects.filter((p) =>
    [p.title, p.description, p.client].some((f) =>
      (f || "").toLowerCase().includes(search.toLowerCase()),
    ),
  );

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <AdminLoader label="Loading projects…" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      <AdminPageHeader
        title="Projects"
        description="Create, edit, and organize client work."
      >
        <Button asChild className="gap-2">
          <Link href="/admin/projects/add">
            <Plus className="h-4 w-4" />
            New project
          </Link>
        </Button>
      </AdminPageHeader>

      {isError && projects.length === 0 && (
        <AdminEmptyState
          title="No projects loaded"
          description={(error as Error)?.message || "Could not load projects."}
          icon={Search}
        />
      )}

      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title, description, client…"
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search projects"
            />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {filtered.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {projects.length}
            </span>{" "}
            projects
          </p>
        </CardContent>
      </Card>

      {filtered.length === 0 && !isError ? (
        <AdminEmptyState
          title={search.trim() ? "No projects match" : "No projects yet"}
          description={
            search.trim()
              ? "Try a different search."
              : "Create your first project."
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((project) => (
            <Card
              key={project._id}
              className="group overflow-hidden border-border shadow-sm transition-shadow hover:shadow-md"
            >
              <CardHeader
                onClick={() => setSelectedProject(project)}
                className="p-0"
              >
                <ProjectCover src={project.pic} title={project.title} />
              </CardHeader>
              <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-normal",
                      statusBadgeClass(project.status),
                    )}
                  >
                    {project.status || "—"}
                  </Badge>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      asChild
                    >
                      <Link href={`/admin/projects/${project._id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => deleteProject.mutate(project._id)}
                      disabled={deleteProject.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="line-clamp-2 text-lg leading-snug">
                  {project.title}
                </CardTitle>
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {project.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground/80">
                    Client:
                  </span>{" "}
                  {project.client || "—"} ·{" "}
                  <span className="font-medium text-foreground/80">
                    Category:
                  </span>{" "}
                  {project.category || "—"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {selectedProject && (
        <Dialog
          open={!!selectedProject}
          onOpenChange={(open) => !open && setSelectedProject(null)}
        >
          <DialogContent className="sm:max-w-2xl w-full max-h-[90vh] p-6 overflow-y-auto">
            {/* Title */}
            <DialogTitle className="text-2xl font-bold mb-4">
              {selectedProject.title}
            </DialogTitle>

            {/* Image */}
            {selectedProject.pic && (
              <div className="w-full h-48 sm:h-60 mb-4 rounded-lg overflow-hidden">
                <ProjectCover src={selectedProject.pic} title={selectedProject.title} />
              </div>
            )}

            {/* Description */}
            <div className="text-sm">
              <p className="text-muted-foreground text-center">
                {selectedProject.description}
              </p>
            </div>
            <hr />
            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <p>
                <span className="font-medium">Client:</span>{" "}
                {selectedProject.client || "—"}
              </p>
              <p>
                <span className="font-medium">Time Spent:</span>{" "}
                {selectedProject.timeSpend || "—"}
              </p>
              <p>
                <span className="font-medium">Category:</span>{" "}
                {selectedProject.category || "—"}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={cn(
                    "px-2 py-1 rounded-full text-sm font-medium",
                    statusBadgeClass(selectedProject.status),
                  )}
                >
                  {selectedProject.status}
                </span>
              </p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {selectedProject.live && (
                <a
                  href={selectedProject.live}
                  target="_blank"
                  className="text-blue-500 underline break-all"
                >
                  Live Project
                </a>
              )}
              {selectedProject.github && (
                <a
                  href={selectedProject.github}
                  target="_blank"
                  className="text-blue-500 underline break-all"
                >
                  GitHub Repo
                </a>
              )}
            </div>

            {/* Stack / Industry / Scope */}
            <div className="grid grid-cols-1 sm:grid-cols-2 text-sm">
              {selectedProject.industry.length > 0 && (
                <div>
                  <p className="font-medium mb-1">Industry:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.industry.map((i) => (
                      <P
                      variant="eyebrow"
                      className="rounded-full bg-muted"
                      key={i.name}
                      >
                        {i.name}
                      </P>
                    ))}
                  </div>
                </div>
              )}
              {selectedProject.scope.length > 0 && (
                <div>
                  <p className="font-medium mb-1">Scope:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.scope.map((s) => (
                      <P
                      variant="eyebrow"
                      className="rounded-full bg-muted"
                      key={s.name}
                      >
                        {s.name}
                      </P>
                    ))}
                  </div>
                </div>
              )}
            </div>
              {selectedProject.stack.length > 0 && (
                <div>
                  <p className="font-medium mb-1">Stack:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.stack.map((s) => (
                      <P
                      variant="eyebrow"
                      className="rounded-full bg-muted"
                      key={s.name}
                      >
                        {s.name}
                      </P>
                    ))}
                  </div>
                </div>
              )}

            {/* Close Button */}
            <DialogClose asChild>
              <Button className="w-full mt-4">Close</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
