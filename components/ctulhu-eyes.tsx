"use client";

import { useEffect, useRef, useState } from "react";

export default function Eyes() {
  const leftPupil = useRef<HTMLDivElement>(null);
  const rightPupil = useRef<HTMLDivElement>(null);

  const [hoverLeft, setHoverLeft] = useState(false);
  const [hoverRight, setHoverRight] = useState(false);

  const [bubble, setBubble] = useState<null | { x: number; y: number }>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const pupils = [leftPupil.current, rightPupil.current];

      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;

      pupils.forEach((pupil) => {
        if (pupil) {
          pupil.style.transform = `translate(${x}px, ${y}px)`;
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    setBubble({ x: e.clientX, y: e.clientY });

    setTimeout(() => {
      setBubble(null);
    }, 800);
  };

  return (
    <div
      className="relative flex gap-10 justify-center bg-black-100"
      onClick={handleClick}
    >
      {/* LEFT EYE */}
      <div
        onMouseEnter={() => setHoverLeft(true)}
        onMouseLeave={() => setHoverLeft(false)}
        className={`w-20 bg-white rounded-full flex items-center justify-center transition-all duration-300 ${
          hoverLeft ? "h-10" : "h-20"
        }`}
      >
        <div
          ref={leftPupil}
          className="w-6 h-6 bg-black rounded-full transition-transform duration-75"
        />
      </div>

      {/* RIGHT EYE */}
      <div
        onMouseEnter={() => setHoverRight(true)}
        onMouseLeave={() => setHoverRight(false)}
        className={`w-20 bg-white rounded-full flex items-center justify-center transition-all duration-300 ${
          hoverRight ? "h-10" : "h-20"
        }`}
      >
        <div
          ref={rightPupil}
          className="w-6 h-6 bg-black rounded-full transition-transform duration-75"
        />
      </div>

      {/* COMIC BUBBLE */}
      {bubble && (
        <div
          className="bg-white fixed text-black font-bold text-xl pointer-events-none rounded-lg p-4"
          style={{
            left: bubble.x,
            top: bubble.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          Ай! больно!
        </div>
      )}
    </div>
  );
}
