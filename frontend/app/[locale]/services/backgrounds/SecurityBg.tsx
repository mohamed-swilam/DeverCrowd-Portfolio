"use client";

export default function SecurityBgCSS() {
    const NUM_PULSES = 3;

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
            {/* Grid */}
            <div
                className="absolute inset-0 w-full h-full"
                style={{
                    backgroundImage: `
            linear-gradient(to right, rgba(52,211,153,0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(52,211,153,0.04) 1px, transparent 1px)
          `,
                    backgroundSize: "40px 40px",
                }}
            />

            {/* Scanning Line */}
            <div
                className="absolute left-0 w-full h-20"
                style={{
                    background: "linear-gradient(to bottom, transparent, rgba(52,211,153,0.06), transparent)",
                    animation: "scan 3s linear infinite",
                }}
            />

            {/* Pulse Circles */}
            {[...Array(NUM_PULSES)].map((_, i) => (
                <div
                    key={i}
                    className="absolute left-1/2 top-1/2 rounded-full border border-green-500"
                    style={{
                        width: `${(i + 1) * 200}px`,
                        height: `${(i + 1) * 200}px`,
                        marginLeft: `-${((i + 1) * 200) / 2}px`,
                        marginTop: `-${((i + 1) * 200) / 2}px`,
                        opacity: 0.05,
                        animation: `pulse ${(3 + i)}s ease-out infinite`,
                    }}
                />
            ))}

            <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes pulse {
          0% { transform: scale(0); opacity: 0.05; }
          50% { transform: scale(1); opacity: 0.05; }
          100% { transform: scale(0); opacity: 0.05; }
        }
      `}</style>
        </div>
    );
}