"use client";

import React, { useMemo, useRef, useState } from "react";

const DEFAULT_COLOR = "#0f111a";

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

const hexToRgb01 = hex => {
  const m = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
  return m
    ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255]
    : [1, 1, 1];
};

const rgb01ToCss = (r, g, b, a) => `rgba(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)},${a})`;

const getOrigin = origin => {
  switch (origin) {
    case "top-left":
      return { x: "0%", y: "0%", dir: "down" };
    case "top-right":
      return { x: "100%", y: "0%", dir: "down" };
    case "left":
      return { x: "0%", y: "50%", dir: "right" };
    case "right":
      return { x: "100%", y: "50%", dir: "left" };
    case "bottom-left":
      return { x: "0%", y: "100%", dir: "up" };
    case "bottom-center":
      return { x: "50%", y: "100%", dir: "up" };
    case "bottom-right":
      return { x: "100%", y: "100%", dir: "up" };
    default:
      return { x: "50%", y: "0%", dir: "down" }; // top-center
  }
};

/**
 * CSS-only light rays.
 * No WebGL/canvas: approximates the old shader using gradients + masks + optional mouse-driven transforms.
 */
export default function LightRaysCSS({
  raysOrigin = "top-center",
  raysColor = DEFAULT_COLOR,
  raysSpeed = 1,
  lightSpread = 1,
  rayLength = 2,
  pulsating = false,
  fadeDistance = 1.0,
  saturation = 1.0,
  followMouse = true,
  mouseInfluence = 0.1,
  noiseAmount = 0.0,
  distortion = 0.0,
  opacity = 0.55,
  className = "",
  eager = false,
}) {
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const lastMouseRef = useRef({ x: 0.5, y: 0.5 });
  const [active, setActive] = useState(Boolean(eager));

  const { x: originX, y: originY, dir } = useMemo(() => getOrigin(raysOrigin), [raysOrigin]);
  const isTopCenter = raysOrigin === "top-center";

  const [r, g, b] = useMemo(() => hexToRgb01(raysColor), [raysColor]);

  // Approximate old shader params with mask/gradient shaping.
  const spreadDeg = clamp(lightSpread * 22, 6, 70); // controls bright segment width
  const lenPct = clamp((rayLength / 5) * 100, 24, 72);
  const fadePct = clamp((fadeDistance / 2.2) * 100, 8, 64);
  const endAlpha = 0.06; // mask tail so it's not a hard cutoff
  const maskDirection = dir === "down" ? "to bottom" : dir === "up" ? "to top" : dir === "right" ? "to right" : "to left";

  const fadeMask = `linear-gradient(${maskDirection}, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${clamp(
    fadePct,
    0,
    lenPct
  )}%, rgba(0,0,0,${endAlpha}) 100%)`;

  const driftSeconds = clamp(20 / clamp(raysSpeed, 0.1, 5), 4, 30);
  const distortAmpDeg = clamp(distortion * 18, 0, 20);
  const mouseAmpPx = 14; // pixel translation magnitude base
  const effectiveMouseInfluence = followMouse ? mouseInfluence : 0;

  const onPointerMove = e => {
    if (!followMouse) return;
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const mx = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    const my = clamp((e.clientY - rect.top) / rect.height, 0, 1);
    lastMouseRef.current = { x: mx, y: my };

    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const el = containerRef.current;
      if (!el) return;
      // Store as CSS vars for transforms.
      el.style.setProperty("--mx", String(lastMouseRef.current.x));
      el.style.setProperty("--my", String(lastMouseRef.current.y));
    });
  };

  // Set initial mouse vars without waiting for events.
  const initialMouseVars = useMemo(
    () => ({
      "--mx": "0.5",
      "--my": "0.5",
      "--mouseInfluence": String(effectiveMouseInfluence),
      "--distortAmpDeg": `${distortAmpDeg}deg`,
      "--spreadDeg": `${spreadDeg}deg`,
      "--lenPct": `${lenPct}%`,
      "--fadeMask": fadeMask,
      "--saturation": String(saturation),
    }),
    [effectiveMouseInfluence, fadeMask, distortAmpDeg, lenPct, saturation, spreadDeg]
  );

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      onPointerMove={onPointerMove}
      onPointerEnter={() => {
        // Activates animations on interaction/visibility-like interaction.
        if (!active) setActive(true);
      }}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`.trim()}
      style={{
        ...initialMouseVars,
        opacity: active ? opacity : 0.001, // keep layout stable without a pop
        transition: "opacity 350ms ease",
      }}
    >
      {/* Rays layer */}
      <div
        className={isTopCenter ? "absolute -top-[55%] left-1/2 h-[210%] w-[220%] -translate-x-1/2" : "absolute inset-[-45%]"}
        style={{
          background: isTopCenter
            ? `repeating-conic-gradient(
                from 180deg at 50% 0%,
                transparent 0deg,
                transparent calc(var(--spreadDeg) * 0.42),
                rgba(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)},0.18) calc(var(--spreadDeg) * 0.42),
                rgba(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)},0.18) calc(var(--spreadDeg) * 0.9),
                rgba(146,56,248,0.09) calc(var(--spreadDeg) * 1.08),
                transparent calc(var(--spreadDeg) * 1.8)
              )`
            : `conic-gradient(from 200deg at var(--originX, ${originX}) var(--originY, ${originY}),
                transparent 0deg,
                rgba(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)},0.2) 0deg,
                rgba(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)},0.2) var(--spreadDeg),
                transparent ${spreadDeg * 1.9}deg,
                rgba(146,56,248,0.1) ${spreadDeg * 1.95}deg,
                transparent ${spreadDeg * 3.2}deg,
                rgba(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)},0.14) ${spreadDeg * 3.7}deg,
                transparent 360deg
              )`,
          // Mask makes the rays fade in the same direction as the old shader.
          WebkitMaskImage: "var(--fadeMask)",
          maskImage: "var(--fadeMask)",
          filter: `blur(30px) saturate(${saturation * 0.9})`,
          mixBlendMode: "screen",
          transformOrigin: `${originX} ${originY}`,
          animation: active
            ? `${pulsating ? `dc-pulsate 2.8s ease-in-out infinite, ` : ""}dc-rays-drift ${driftSeconds}s ease-in-out infinite`
            : "none",
          // Fallback: even without animation, keep a subtle static rays presence.
          opacity: active ? 1 : 0.001,
          // Mouse-driven distortion (approximates shader direction mixing)
          // translate/rotate depends on --mx/--my and mouseInfluence.
          willChange: "transform, opacity",
        }}
      />

      {/* Soft glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            dir === "down"
              ? "radial-gradient(ellipse at top, rgba(56,101,248,0.14), transparent 52%)"
              : dir === "up"
                ? "radial-gradient(ellipse at bottom, rgba(56,101,248,0.14), transparent 52%)"
                : "radial-gradient(ellipse at center, rgba(56,101,248,0.1), transparent 55%)",
          filter: `blur(18px) saturate(${saturation * 0.9})`,
          mixBlendMode: "screen",
          opacity: active ? 1 : 0.001,
          transition: "opacity 350ms ease",
        }}
      />

      {/* Noise texture overlay (approximation) */}
      {noiseAmount > 0 ? (
        <div
          className="absolute inset-0"
          style={{
            opacity: active ? clamp(noiseAmount, 0, 1) : 0,
            transition: "opacity 250ms ease",
            backgroundImage: `
              repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0) 2px),
              repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0) 2px),
              repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0) 3px)
            `,
            filter: "blur(0.2px)",
            mixBlendMode: "overlay",
            animation: active ? `dc-noise ${Math.round(clamp(1.5 / raysSpeed, 0.4, 3) * 10) / 10}s linear infinite` : "none",
          }}
        />
      ) : null}

      {/* Keyframes live here so this component stays self-contained */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes dc-rays-drift {
              0%   {
                transform:
                  translate3d(
                    calc((var(--mx) - 0.5) * ${mouseAmpPx}px * var(--mouseInfluence)),
                    calc((var(--my) - 0.5) * ${mouseAmpPx}px * var(--mouseInfluence)),
                    0
                  )
                  rotate(calc((var(--mx) - 0.5) * 2deg * var(--mouseInfluence) + var(--distortAmpDeg) * -0.35))
                  scale(1.02);
              }
              50%  {
                transform:
                  translate3d(
                    calc((var(--mx) - 0.5) * ${mouseAmpPx * 0.35}px * var(--mouseInfluence)),
                    calc((var(--my) - 0.5) * ${mouseAmpPx * 1.1}px * var(--mouseInfluence) + 2.5%),
                    0
                  )
                  rotate(calc((var(--my) - 0.5) * 1.8deg * var(--mouseInfluence) + var(--distortAmpDeg) * 0.35))
                  scale(1.04);
              }
              100% {
                transform:
                  translate3d(
                    calc((var(--mx) - 0.5) * ${mouseAmpPx}px * var(--mouseInfluence)),
                    calc((var(--my) - 0.5) * ${mouseAmpPx}px * var(--mouseInfluence)),
                    0
                  )
                  rotate(calc((var(--mx) - 0.5) * 2deg * var(--mouseInfluence) + var(--distortAmpDeg) * -0.35))
                  scale(1.02);
              }
            }

            @keyframes dc-pulsate {
              0%, 100% { opacity: 0.85; transform: scale(1.00); }
              50% { opacity: 1; transform: scale(1.03); }
            }

            @keyframes dc-noise {
              0% { background-position: 0 0, 0 0, 0 0; }
              100% { background-position: 20px 0, -20px 10px, 10px -15px; }
            }
          `,
        }}
      />
    </div>
  );
}

