"use client";
import { useState } from "react";

const CODE_LINES = [
  "const app = express()",
  "await db.connect()",
  "router.get('/api', handler)",
  "npm run build",
  "git commit -m 'feat'",
  "docker-compose up",
  "SELECT * FROM users",
  "res.json({ ok: true })",
  "useEffect(() => {}, [])",
  "export default function()",
  "import { motion }",
  "tailwind.config.js",
];

const NUM_STREAMS = 16;

export default function DevBgCSS() {
  const [streams] = useState(
    Array.from({ length: NUM_STREAMS }, (_, i) => ({
      id: i,
      x: `${(i * 100) / NUM_STREAMS}%`,
      y: Math.random() * -100,
      speed: 4 + Math.random() * 4, // duration in seconds
      lineIndex: Math.floor(Math.random() * CODE_LINES.length),
      fontSize: 10 + Math.random() * 4,
      opacity: 0.04 + Math.random() * 0.08,
    }))
  );

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden opacity-80 font-mono">
      {streams.map((s) => (
        <div
          key={s.id}
          className="absolute whitespace-nowrap"
          style={{
            left: s.x,
            top: `${s.y}px`,
            fontSize: `${s.fontSize}px`,
            opacity: s.opacity,
            animation: `fall ${s.speed}s linear infinite`,
          }}
        >
          {CODE_LINES[s.lineIndex]}
        </div>
      ))}

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(120vh);
          }
        }
      `}</style>
    </div>
  );
}