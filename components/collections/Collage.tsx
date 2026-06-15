"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Item } from "@/types/collection";
import { useRouter } from "next/navigation";

interface CollageProps {
  items: Item[];
  onSelect: (id: string) => void;
}

export function Collage({ items, onSelect }: CollageProps) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      const p = 1 - rect.top / windowH;
      setProgress(Math.min(1, Math.max(0, p)));
    };

    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Нет товаров для отображения
      </div>
    );
  }

  return (
    <section
      ref={ref}
      className="relative min-h-[200vh] flex flex-col items-center justify-center px-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-[80px] w-full max-w-[1200px] mx-auto">
        {items.map((item, i) => {
          const isLeft = i % 2 === 0;
          const offset = (1 - progress) * 120;

          return (
            <div key={item.id} className="w-full flex justify-center">
              <div
                className="relative w-[40vw] max-w-[900px] h-[300px] md:h-[420px] overflow-hidden shadow-2xl transition-transform duration-300"
                onClick={() => router.push(`/catalog/${item.id}`)}
                style={{
                  transform: `
                    translateX(${isLeft ? -offset : offset}px)
                    scale(${0.9 + progress * 0.25})
                  `,
                  zIndex: items.length - i,
                  opacity: 0.4 + progress * 0.6,
                  clipPath: isLeft
                    ? "polygon(0 0, 100% 0, 85% 100%, 0% 100%)"
                    : "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)",
                }}
              >
                <Image
                  src={item.image || "/placeholder.jpg"}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 90vw, 40vw"
                />
                <div className="absolute bottom-0 w-full bg-black/40 text-white p-4 text-lg z-10">
                  {item.title}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
