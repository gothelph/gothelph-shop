"use client";

import SamuraiLanding from "@/components/samurai/SamuraiLanding";
import { useParams } from "next/navigation";

export default function BrandPage() {
  const { id } = useParams();

  console.log(id);

  if (id === "1") return <SamuraiLanding />;

  if (id === "2") {
    return <div style={{ background: "blue", color: "white" }}>ADIDAS</div>;
  }

  if (id === "3") {
    return <div style={{ background: "red", color: "white" }}>PUMA</div>;
  }

  return <div>Бренд не найден</div>;
}
