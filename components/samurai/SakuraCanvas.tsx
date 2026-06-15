"use client";

import { useEffect, useRef } from "react";

type Petal = {
  x: number;
  y: number;
  speed: number;
  size: number;
  drift: number;
};

export default function SakuraCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const petals: Petal[] = Array.from({ length: 80 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      speed: 1 + Math.random() * 2,
      size: 3 + Math.random() * 4,
      drift: (Math.random() - 0.5) * 1.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (const p of petals) {
        ctx.fillStyle = "rgba(255,182,193,0.8)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        p.y += p.speed;
        p.x += p.drift;

        if (p.y > h) {
          p.y = -10;
          p.x = Math.random() * w;
        }

        if (p.x > w) p.x = 0;
        if (p.x < 0) p.x = w;
      }

      requestAnimationFrame(draw);
    };

    draw();

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);

  return <canvas ref={canvasRef} style={styles.canvas} />;
}

const styles: any = {
  canvas: {
    position: "absolute",
    inset: 0,
    zIndex: 1,
    pointerEvents: "none",
  },
};
