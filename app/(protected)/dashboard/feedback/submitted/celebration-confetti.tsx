"use client";

import { useEffect, useState } from "react";

const COLORS = ["#d4a853", "#e8c778", "#4ade80", "#60a5fa", "#f472b6", "#a78bfa"];

// Generate particles once on mount with stable random values
function generateParticles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 1.5,
    duration: 2 + Math.random() * 2,
    color: COLORS[i % COLORS.length],
    rotation: Math.random() * 360,
    size: 6 + Math.random() * 6,
  }));
}

export function CelebrationConfetti() {
  const [particles] = useState(() => generateParticles(50));
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          <div
            className="rounded-sm"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              transform: `rotate(${p.rotation}deg)`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
