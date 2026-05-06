"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function Logo() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) return;

    const handleScrolled = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScrolled);
    return () => window.removeEventListener("scroll", handleScrolled);
  }, [isHome]);

  return (
    <>
      <div
        className={`
        left-1/2 -translate-x-1/2 transition-all duration-300
        ${
          isHome
            ? scrolled
              ? "fixed top-12"
              : "absolute mt-[150px]"
            : "fixed top-4"
        }
      `}
      >
        {!scrolled && (
          <img
            src="/logo.jpg"
            alt="логотип"
            className={`h-[150px] justify-self-center mb-[20px] transition-all duration-300 ${isHome && scrolled ? "opacity-0 h-0 mb-0" : "opacity-100"}`}
          />
        )}

        <Link
          href="/"
          className={`
            
          font-bold transition-all duration-300
          ${isHome ? (scrolled ? "text-lg" : "text-8xl font-thin") : "text-lg"}
        `}
        >
          GOTHELPH
        </Link>
      </div>
    </>
  );
}
