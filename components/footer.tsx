"use client";

import Link from "next/link";
import { useState, RefObject } from "react";
import Eyes from "./ctulhu-eyes";

type FooterProps = {
  topRef: RefObject<HTMLDivElement | null>;
};

export function Footer({ topRef }: FooterProps) {
  const [openContacts, setOpenContacts] = useState(false);

  return (
    <div className="bg-black flex flex-col items-center gap-[30px] justify-center w-full min-h-[20vh] py-[50px] text-lg mt-100">
      <Eyes />

      <div className="flex flex-col items-center gap-[10px] text-white">
        {/* CONTACTS TOGGLE */}
        <button
          onClick={() => setOpenContacts((v) => !v)}
          className="hover:opacity-70 transition"
        >
          КОНТАКТЫ
        </button>

        {openContacts && (
          <div className="flex flex-col gap-2 text-sm text-center mt-2">
            <div>
              <div className="font-semibold">Телефон</div>
              <a href="tel:+79999999999">+7 (999) 999-99-99</a>
            </div>

            <div>
              <div className="font-semibold">Адрес</div>
              <p>Мензаберранзан, ул. ДоУрден, 9</p>
            </div>

            <div>
              <div className="font-semibold">Email</div>
              <a href="mailto:info@example.com">ktulhu.ftagn@example.com</a>
            </div>
          </div>
        )}

        {/* HOME */}
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            topRef.current?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          HOMEPAGE
        </Link>
      </div>
    </div>
  );
}
