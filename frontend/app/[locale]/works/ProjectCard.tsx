"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { BsArrowUpRight } from "react-icons/bs";
import type { NormalizedProject } from "@/hooks/useProjects";

import { Link } from "@/i18n/navigation";

interface ProjectCardProps {
    project: NormalizedProject;
    index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
    const [hovered, setHovered] = useState(false);
    const isWide = index % 5 === 0 || index % 5 === 3;

    return (
        <Link
            href={`/works/${project._id}`}
            className="group relative block overflow-hidden rounded-2xl border border-white/8 bg-card"
            style={{ aspectRatio: isWide ? "16/7" : "4/3" }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <Image
                src={project.pic}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                unoptimized={project.pic?.startsWith("http")}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <motion.div
                className="absolute inset-0 bg-primary/20"
                animate={{ opacity: hovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
            />

            <div className="absolute bottom-0 left-0 right-0 p-5">
                <motion.div
                    animate={{ y: hovered ? 0 : 8, opacity: hovered ? 1 : 0.85 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex items-end justify-between gap-3">
                        <div>
                            {project.category && (
                                <span className="mb-2 inline-block rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/70 backdrop-blur-sm">
                                    {project.category}
                                </span>
                            )}
                            <h3 className="text-lg font-bold text-white leading-tight">{project.title}</h3>
                            {project.client && (
                                <p className="mt-0.5 text-xs text-white/50">{project.client}</p>
                            )}
                        </div>

                        <motion.div
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
                            animate={{ scale: hovered ? 1 : 0.8, opacity: hovered ? 1 : 0 }}
                            transition={{ duration: 0.25 }}
                        >
                            <BsArrowUpRight className="h-4 w-4 text-white" />
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </Link>
    );
}