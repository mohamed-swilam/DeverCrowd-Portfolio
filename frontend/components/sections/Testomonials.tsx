"use client";
import H1 from "@/components/ui/H1";
import P from "@/components/ui/P";
import testimonials from "@/data/dynamic/testimonials";
import { useRef } from "react";

// ── نقسم الـ testimonials لشريطين، ولو عددهم قليل نكررهم
const half = Math.ceil(testimonials.length / 2);
const row1 = testimonials.slice(0, half);
const row2 = testimonials.slice(half);

// نكرر كل شريط 3 مرات عشان يبان اللف مستمر بدون فراغات
const repeat = <T,>(arr: T[], times = 3): T[] =>
  Array.from({ length: times }, () => arr).flat();

interface TestCardProps {
  name: string;
  image: string;
  role: string;
  test: string;
}

const TestCard = ({ name, role, image, test }: TestCardProps) => (
  <div className="group relative flex flex-col gap-4 rounded-2xl border border-white/8 bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 w-[320px] shrink-0 select-none">

    {/* Header: صورة + اسم + رول + نجوم */}
    <div className="flex items-center gap-3">
      <div className="relative shrink-0">
        <img
          src={image}
          alt={name}
          className="size-11 rounded-full object-cover ring-2 ring-primary/20"
        />
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <p className="text-sm font-semibold text-foreground capitalize leading-tight truncate">
          {name}
        </p>
        <p className="text-xs text-muted-foreground font-medium leading-tight truncate">
          {role}
        </p>
      </div>
      {/* quote icon في الكونر */}
      <span className="ml-auto text-4xl font-bold leading-none text-primary/15 select-none self-start">
        "
      </span>
    </div>

    <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

    {/* نص الـ review */}
    <p className="text-sm leading-relaxed text-muted-foreground line-clamp-4">
      {test}
    </p>
        {/* نجوم */}
        <div className="flex items-center gap-0.5 mt-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} className="size-3 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
  </div>
);

// ── شريط واحد متحرك
interface MarqueeRowProps {
  items: TestCardProps[];
  direction: "left" | "right";
  speed?: number; // ثواني لكل دورة كاملة
}

const MarqueeRow = ({ items, direction, speed = 40 }: MarqueeRowProps) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (trackRef.current) trackRef.current.style.animationPlayState = "paused";
  };
  const handleMouseLeave = () => {
    if (trackRef.current) trackRef.current.style.animationPlayState = "running";
  };

  const repeated = repeat(items, 4);

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={trackRef}
        className="flex gap-4"
        style={{
          width: "max-content",
          animation: `marquee-${direction} ${speed}s linear infinite`,
        }}
      >
        {repeated.map((item, i) => (
          <TestCard key={i} {...item} />
        ))}
      </div>
    </div>
  );
};

const Testimonials = () => {
  return (
    <section
      id="testimonials"
      className="relative flex w-full flex-col items-center justify-center py-16 overflow-hidden gap-4"
    >
      <style>{`
        @keyframes marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      {/* blur decoration */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-96 rounded-full bg-white/5 blur-3xl opacity-90 pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col items-center gap-2 px-4 sm:px-16">
        <H1>What Our Clients Say</H1>
        <P variant="muted" className="max-w-2xl text-center mb-2">
          We don't just deliver code — we deliver results. Here's what the people
          we've worked with have to say about the experience.
        </P>
      </div>

      {/* fade على الجانبين */}
      <div className="relative z-10 w-full md:w-[70%] flex flex-col gap-4 mt-4"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        }}
      >
        <MarqueeRow items={row1.length ? row1 : testimonials} direction="left" speed={35} />
        <MarqueeRow items={row2.length ? row2 : testimonials} direction="right" speed={30} />
      </div>
    </section>
  );
};

export default Testimonials;