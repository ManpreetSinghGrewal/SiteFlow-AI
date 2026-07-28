import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

const COLORS = [
  "rgba(56, 189, 248, 0.7)",  // sky
  "rgba(139, 92, 246, 0.7)",  // violet
  "rgba(236, 72, 153, 0.7)",  // pink
  "rgba(59, 130, 246, 0.7)",  // blue
];

export function ParticleCursor() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    let count = 0;

    const handleMouseMove = (e: MouseEvent) => {
      count++;
      if (count % 2 !== 0) return; // throttle particle creation

      const newParticle: Particle = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 6 + 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      };

      setParticles((prev) => [...prev.slice(-18), newParticle]);
    };

    window.addEventListener("mousemove", handleMouseMove);

    const cleanupInterval = setInterval(() => {
      setParticles((prev) => (prev.length > 0 ? prev.slice(1) : []));
    }, 60);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(cleanupInterval);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[99990] overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full transition-all duration-700 ease-out animate-ping-once"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `0 0 10px ${p.color}`,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  );
}
