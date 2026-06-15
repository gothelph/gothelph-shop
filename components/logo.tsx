"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";


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
        className={`left-1/2 -translate-x-1/2 transition-all duration-300 ${ scrolled || !isHome ? "fixed top-12" : "absolute mt-[150px]" } `}
      >
        {!scrolled && isHome && (
          <div className={`flex justify-center mb-[20px] transition-all duration-300 ${isHome && scrolled ? "opacity-0 h-0 mb-0" : "opacity-100"}`} >
            <Image
              height={150}
              width={105}
              src="/logo.jpg"
              alt="логотип"
            />
          </div>
        )}

        <Link
          href="/"
          className={`font-bold transition-all duration-300 ${scrolled || !isHome ? "text-lg" : "text-8xl font-thin"}
        `}
        >
          GOTHELPH
        </Link>
      </div>
    </>
  );
}
