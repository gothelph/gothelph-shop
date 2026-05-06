"use client";

import { useMemo } from "react";
import Header from "@/components/header/Header";
import Collections from "@/components/collections/Collections";
import { useCollections } from "@/hooks/useCollections";
import { CategoriesCarousel } from "@/components/carousel/carousel";
import { ParallaxHero } from "@/components/paralax";
import { Cover } from "@/components/cover";
import { Collage } from "@/components/collections/Collage";
import { Footer } from "@/components/footer";

export default function Home() {
  const { collections, error: collectionsError, reload } = useCollections();

  const collageItems = collections.map((collection) => {
    const image = collection.subcollections?.[0]?.items?.[0]?.image || null;

    return {
      id: collection.id,
      title: collection.title,
      image,
    };
  });

  return (
    <div>
      <div className="h-100vh flex flex-col justify-between">
        <Header
          navItems={[
            { href: "#catalog", label: "КОЛЛЕКЦИИ", className: "text-lg" },
            { href: "#contacts", label: "КОНТАКТЫ", className: "text-lg" },
          ]}
        />

        <Cover />
        <ParallaxHero />
      </div>
      <CategoriesCarousel
        categories={[
          { name: "Аксессуары", image: "/orig.jpg" },
          { name: "Одежда", image: "/одежда.png" },
          { name: "Игрушки", image: "/cat.jpg" },
        ]}
        onSelect={(cat) => console.log(cat)}
      />

      <Collage items={collageItems} />

      {collectionsError && (
        <p
          style={{
            color: "#b91c1c",
            maxWidth: "72rem",
            margin: "1rem auto",
            padding: "0 1rem",
          }}
        >
          {collectionsError}
        </p>
      )}

      <Collections
        data={collections}
        isAdmin={false}
        accessToken={""}
        onReload={reload}
      />

      <Footer />
    </div>
  );
}
