"use client";

import Header from "@/components/header/Header";
import CollectionFilter from "@/components/collection-filter/CollectionFilter";
import { Footer } from "@/components/footer";

export default function CatalogPage() {
  return (
    <div>
      <Header
        navItems={[
          { href: "/", label: "ГЛАВНАЯ", className: "text-lg" },
        ]}
        onOpenAuth={() => {}}
        onLogout={() => {}}
        isAuth={false}
        isAdmin={false}
        userName=""
      />

      <CollectionFilter />

      <Footer />
    </div>
  );
}