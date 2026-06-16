"use client";

import PortalTransition from "@/components/samurai/PortalTransition";

export default function SamuraiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PortalTransition />
      {children}
    </>
  );
}
