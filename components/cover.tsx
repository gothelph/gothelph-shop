"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function Cover() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative h-[80vh] overflow-hidden">
      {/* 🌲 ФОН */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translateY(${scrollY * 0.3}px) scale(1.1)`,
        }}
      >
        <Image
          src="/samurai.png"
          alt="forest background"
          fill
          className="object-cover"
        />
      </div>

      {/* 🌳 ПЕРЕДНИЙ СЛОЙ */}
      <div
        className="absolute -top-24 -bottom-24 left-0 right-0"
        style={{
          transform: `translate3d(0, ${-scrollY * 0.5}px, 0) scale(1.3)`,
        }}
      >
        <Image
          src="/дым.png"
          alt="foreground trees"
          fill
          className="object-cover"
        />
      </div>

      {/* затемнение */}
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
}
