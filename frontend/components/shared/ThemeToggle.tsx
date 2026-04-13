"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const sparksRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="w-9 h-9 rounded-lg border border-border bg-muted/50" />;
  }

  const isDark = resolvedTheme === "dark";

  const fireSparks = () => {
    const sparks = sparksRef.current?.querySelectorAll<HTMLElement>(".spark");
    sparks?.forEach((s, i) => {
      s.style.animation = "none";
      void s.offsetWidth;
      s.style.animation = `sparkfly 0.4s ease-out ${i * 40}ms forwards`;
    });
  };

  const toggle = () => {
    if (!isDark) fireSparks();
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <>
      <style>{`
        .bulb-toggle { position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; user-select: none; }
        .bulb-svg { transition: filter 0.4s ease; }
        .bulb-toggle.on .bulb-svg { filter: drop-shadow(0 0 10px #fbbf24) drop-shadow(0 0 24px #f59e0b); }
        .bulb-toggle.on .bulb-glass { fill: #fef3c7; }
        .bulb-toggle.off .bulb-glass { fill: #374151; }
        .bulb-toggle.on .bulb-filament { stroke: #f59e0b; }
        .bulb-toggle.off .bulb-filament { stroke: #4b5563; }
        .bulb-toggle.on .bulb-shine { opacity: 0.6; }
        .bulb-toggle.off .bulb-shine { opacity: 0; }
        .bulb-toggle.on .bulb-glow { opacity: 1; }
        .bulb-toggle.off .bulb-glow { opacity: 0; }
        .bulb-toggle.on .bulb-rays { opacity: 1; }
        .bulb-toggle.off .bulb-rays { opacity: 0; }
        .bulb-glass { transition: fill 0.4s ease; }
        .bulb-filament { transition: stroke 0.3s; }
        .bulb-shine, .bulb-glow, .bulb-rays { transition: opacity 0.4s; }
        .wire-live { stroke-dasharray: 80; stroke-dashoffset: 80; transition: stroke-dashoffset 0.5s ease; }
        .bulb-toggle.on .wire-live { stroke-dashoffset: 0; stroke: #fbbf24; }
        .bulb-knob { transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1); }
        .bulb-toggle.on .bulb-knob { transform: translateX(22px); }
        .spark { position: absolute; width: 3px; height: 3px; border-radius: 50%; background: #fbbf24; opacity: 0; }
        @keyframes sparkfly {
          0%   { opacity: 1; transform: translate(0,0) scale(1); }
          100% { opacity: 0; transform: translate(var(--sx), var(--sy)) scale(0); }
        }
      `}</style>

      <button
        type="button"
        onClick={toggle}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        className={`bulb-toggle ${isDark ? "on" : "off"}`}
      >
        <svg
          className="bulb-svg"
          width="36"
          height="48"
          viewBox="0 0 110 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="bg2" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#fef9c3" />
              <stop offset="100%" stopColor="#fef3c7" stopOpacity="0" />
            </radialGradient>
          </defs>

          <ellipse className="bulb-glow" cx="55" cy="58" rx="42" ry="42" fill="url(#bg2)" opacity="0" />

          <g className="bulb-rays" opacity="0" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round">
            <line x1="55" y1="6"  x2="55" y2="14" />
            <line x1="85" y1="14" x2="80" y2="20" />
            <line x1="96" y1="42" x2="88" y2="44" />
            <line x1="14" y1="42" x2="22" y2="44" />
            <line x1="25" y1="14" x2="30" y2="20" />
          </g>

          <path
            className="bulb-glass"
            d="M55 20 C30 20 16 36 16 54 C16 68 24 78 32 86 C36 90 38 95 38 100 L72 100 C72 95 74 90 78 86 C86 78 94 68 94 54 C94 36 80 20 55 20 Z"
            stroke="#9ca3af"
            strokeWidth="1"
          />

          <path className="bulb-shine" d="M35 36 C38 30 46 26 54 25" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0" />

          <rect x="36" y="100" width="38" height="8" rx="2" fill="#4b5563" stroke="#6b7280" strokeWidth="0.5" />
          <rect x="38"  y="108" width="34" height="7" rx="1" fill="#6b7280" />
          <rect x="40"  y="115" width="30" height="7" rx="1" fill="#6b7280" />
          <rect x="42"  y="122" width="26" height="8" rx="2" fill="#374151" stroke="#4b5563" strokeWidth="0.5" />

          <path className="bulb-filament" d="M46 115 L46 92 Q46 86 50 84 Q53 82 55 78 Q57 82 60 84 Q64 86 64 92 L64 115" fill="none" strokeWidth="2" strokeLinejoin="round" />
          <path className="bulb-filament" d="M50 88 L51 84 L52 88 L53 84 L54 88 L55 84 L56 88 L57 84 L58 88 L59 84 L60 88" fill="none" strokeWidth="1.5" />

          <line x1="48" y1="130" x2="48" y2="160" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="62" y1="130" x2="62" y2="160" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" />
          <line className="wire-live" x1="48" y1="130" x2="48" y2="160" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
          <line className="wire-live" x1="62" y1="130" x2="62" y2="160" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
        </svg>

        {/* sparks */}
        <div ref={sparksRef} style={{ position: "absolute", top: 4, left: "50%", transform: "translateX(-50%)", pointerEvents: "none" }}>
          {[
            { sx: "-20px", sy: "-25px", l: "0",    t: "0" },
            { sx: "18px",  sy: "-30px", l: "4px",  t: "0" },
            { sx: "-14px", sy: "-18px", l: "-4px", t: "4px" },
            { sx: "24px",  sy: "-22px", l: "2px",  t: "2px" },
            { sx: "-8px",  sy: "-32px", l: "-2px", t: "0" },
          ].map((s, i) => (
            <span
              key={i}
              className="spark"
              style={{ "--sx": s.sx, "--sy": s.sy, left: s.l, top: s.t } as React.CSSProperties}
            />
          ))}
        </div>
      </button>
    </>
  );
}