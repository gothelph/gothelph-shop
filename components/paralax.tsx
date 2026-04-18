"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function ParallaxHero() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative h-[60vh] overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          transform: `translateY(${-offset * 0.5}px) scale(1.2)`,
        }}
      >
        <Image
          src="/forest-bg2.jpg"
          alt="forest background"
          fill
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 flex items-center justify-center h-full">
        <h1 className="text-white text-4xl font-bold">КАТАЛОГ</h1>
      </div>
    </div>
  );
}
