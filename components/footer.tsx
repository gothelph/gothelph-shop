"use client";
import Link from "next/link";
import Eyes from "./ctulhu-eyes";

export function Footer() {
  return (
    <div className="bg-black flex flex-col items-center gap-[50px] justify-center w-full min-h-[20vh] py-[50px] text-lg mt-100">
      <Eyes />
      <div className="flex flex-col gap-[10px] text-white">
        <Link href="">КОНТАКТЫ</Link>
        <Link href="">HOMEPAGE</Link>
      </div>
    </div>
  );
}
