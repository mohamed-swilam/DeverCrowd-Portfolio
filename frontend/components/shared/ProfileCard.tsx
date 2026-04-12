"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ProfileCardProps {
  avatarUrl?: string;
  name?: string;
  title?: string;
  handle?: string;
  status?: string;
  contactText?: string;
  className?: string;
  onContactClick?: () => void;
}

const ProfileCard = ({
  avatarUrl,
  name = "Team Member",
  title = "Software Engineer",
  handle = "handle",
  status = "Online",
  contactText = "Contact",
  className,
  onContactClick,
}: ProfileCardProps) => {
  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/80 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl",
        className
      )}
      style={{ aspectRatio: "0.718", maxHeight: "540px" }}
    >
      {/* Avatar */}
      {avatarUrl && (
        <img
          src={avatarUrl}
          alt={name}
          loading="lazy"
          className="absolute bottom-0 left-1/2 w-full -translate-x-1/2 object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

      {/* Name & title — top */}
      <div className="relative z-10 px-5 pt-8 text-center">
        <h3
          className="text-2xl font-semibold"
          style={{
            backgroundImage: "linear-gradient(to bottom, #fff, #6f6fbe)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {name}
        </h3>
        <p
          className="mt-1 text-sm font-medium"
          style={{
            backgroundImage: "linear-gradient(to bottom, #fff, #4a4ac0)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {title}
        </p>
      </div>

      {/* Bottom info bar */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-3.5 py-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {/* Mini avatar */}
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/20">
            {avatarUrl && (
              <img
                src={avatarUrl}
                alt={name}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-white/90">@{handle}</span>
            <span className="flex items-center gap-1 text-xs text-white/60">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400" />
              {status}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onContactClick}
          className="rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold text-white/90 backdrop-blur-sm transition-all duration-200 hover:-translate-y-px hover:border-white/50 hover:bg-white/10"
        >
          {contactText}
        </button>
      </div>
    </div>
  );
};

export default React.memo(ProfileCard);