"use client";
import { useEffect, useState } from "react";

const NUM_SHAPES = 12;
const NUM_LINES = 8;

export default function DesignBgCSS() {
    const [shapes] = useState(
        Array.from({ length: NUM_SHAPES }, (_, i) => ({
            id: i,
            size: 30 + Math.random() * 80,
            x: Math.random() * 100, // percent
            y: Math.random() * 100,
            speed: 3 + Math.random() * 4, // duration in s
            opacity: 0.03 + Math.random() * 0.06,
        }))
    );

    const [lines] = useState(
        Array.from({ length: NUM_LINES }, (_, i) => ({
            id: i,
            left: (i * 100) / NUM_LINES,
            offset: Math.random() * 20,
        }))
    );

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
            {/* Circles */}
            {shapes.map((s) => (
                <div
                    key={s.id}
                    className="absolute rounded-full"
                    style={{
                        width: `${s.size}px`,
                        height: `${s.size}px`,
                        left: `${s.x}%`,
                        top: `${s.y}%`,
                        opacity: s.opacity,
                        background: "radial-gradient(circle, rgba(167,139,250,0.4) 0%, transparent 100%)",
                        animation: `floatShape ${s.speed + 2}s ease-in-out infinite alternate`,
                    }}
                />
            ))}

            {/* Lines */}
            {lines.map((l) => (
                <div
                    key={l.id}
                    className="absolute top-0 h-full w-[1px] bg-purple-300 opacity-5"
                    style={{
                        left: `${l.left}%`,
                        animation: `floatLine 8s ease-in-out infinite alternate`,
                        transform: `translateX(${l.offset}px)`,
                    }}
                />
            ))}

            {/* Keyframes */}
            <style jsx>{`
        @keyframes floatShape {
          0% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-20px) translateX(15px);
          }
          100% {
            transform: translateY(0px) translateX(0px);
          }
        }
        @keyframes floatLine {
          0% {
            transform: translateX(0px);
          }
          50% {
            transform: translateX(20px);
          }
          100% {
            transform: translateX(0px);
          }
        }
      `}</style>
        </div>
    );
}