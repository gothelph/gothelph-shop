"use client";

import Header from "@/components/header/Header";
import CollectionFilter from "@/components/collection-filter/CollectionFilter";
import Brands from "@/components/BrandPanel/BrandPanel";

export default function CatalogPage() {
  return (
    <div>
      <Header
        navItems={[{ href: "/", label: "ГЛАВНАЯ", className: "text-lg" }]}
      />
      <Brands />
      <CollectionFilter />
    </div>
  );
}
