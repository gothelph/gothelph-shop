"use client";

import { useEffect, useRef } from "react";
import styles from "./cursor.module.css";

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const trail = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;

    let trailX = 0;
    let trailY = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (dot.current) {
        dot.current.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
      }
    };

    const animate = () => {
      trailX += (mouseX - trailX) * 0.12;
      trailY += (mouseY - trailY) * 0.12;

      if (trail.current) {
        trail.current.style.transform = `translate(${trailX - 12.5}px, ${trailY - 12.5}px)`;
      }

      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    animate();

    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <div ref={trail} className={styles.trail} />
      <div ref={dot} className={styles.dot} />
    </>
  );
}
