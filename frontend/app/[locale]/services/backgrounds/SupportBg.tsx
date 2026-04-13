"use client";

export default function SupportBgCSS() {
    const NUM_NODES = 20;

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
            {[...Array(NUM_NODES)].map((_, i) => {
                const size = 2 + Math.random() * 3;
                const x = Math.random() * 100;
                const y = Math.random() * 100;
                const delay = Math.random() * 5;

                return (
                    <div
                        key={i}
                        className="absolute rounded-full bg-orange-400"
                        style={{
                            width: `${size}px`,
                            height: `${size}px`,
                            left: `${x}%`,
                            top: `${y}%`,
                            opacity: 0.2,
                            animation: `pulseMove 6s ease-in-out ${delay}s infinite alternate`,
                        }}
                    />
                );
            })}

            <style jsx>{`
        @keyframes pulseMove {
          0% { transform: translate(0, 0) scale(1); opacity: 0.15; }
          50% { transform: translate(10px, -10px) scale(1.3); opacity: 0.25; }
          100% { transform: translate(-10px, 10px) scale(1); opacity: 0.15; }
        }
      `}</style>
        </div>
    );
}