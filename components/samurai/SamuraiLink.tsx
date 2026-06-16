"use client";

import { useRouter } from "next/navigation";
import { useTransitionStore } from "./transitionStore";

export default function SamuraiLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { setAnimating } = useTransitionStore();

  const handleClick = () => {
    setAnimating(true);

    setTimeout(() => {
      router.push(href);

      setTimeout(() => {
        setAnimating(false);
      }, 300);
    }, 600);
  };

  return (
    <div onClick={handleClick} style={{ cursor: "pointer" }}>
      {children}
    </div>
  );
}
