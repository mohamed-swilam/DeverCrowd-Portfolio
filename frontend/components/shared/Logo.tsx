import Image from "next/image";

interface LogoProps {
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export default function Logo({ width, height, className = "", priority = false }: LogoProps) {
  return (
    <Image
      alt="DeverCrowd logo"
      width={width}
      height={height}
      src="/logo.webp"
      className={className}
      priority={priority}
      sizes={`${width}px`}
      style={{ width: `${width}px`, height: "auto", maxWidth: "100%" }}

    />
  );
}