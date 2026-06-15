"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./BrandPanel.css";

type Brand = {
  id: number;
  name: string;
};

export default function Brands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchBrands = async () => {
      const res = await fetch("/api/brands");
      const data = await res.json();
      setBrands(data);
    };

    fetchBrands();
  }, []);

  return (
    <div className="brands-container">
      {brands.map((brand) => (
        <button
          key={brand.id}
          className="brand-button"
          onClick={() => router.push(`/brand/${brand.id}`)}
        >
          {brand.name}
        </button>
      ))}
    </div>
  );
}
