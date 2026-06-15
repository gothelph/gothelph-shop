"use client";

import { useRef, useState } from "react";

import Header from "@/components/header/Header";
import Collections from "@/components/collections/Collections";
import { useCollections } from "@/hooks/useCollections";
import { CategoriesCarousel } from "@/components/carousel/carousel";
import { ParallaxHero } from "@/components/paralax";
import { Cover } from "@/components/cover";
import { Collage } from "@/components/collections/Collage";
import { Footer } from "@/components/footer";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { collections, error: collectionsError, reload } = useCollections();
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(null);
  const topRef = useRef<HTMLDivElement>(null);
  const activeCollections = selectedCollectionId
    ? collections.filter((c) => c.id === selectedCollectionId)
    : collections;

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
      {/* TOP SECTION */}
      <div className="h-100vh flex flex-col justify-between" ref={topRef}>
        <Header
          navItems={[
            { href: "#catalog", label: "КОЛЛЕКЦИИ", className: "text-lg" },
            { href: "#contacts", label: "КОНТАКТЫ", className: "text-lg" },
          ]}
        />

        <Cover />
        <ParallaxHero />
      </div>

      {/* CAROUSEL */}
      <CategoriesCarousel
        categories={[
          { name: "Аксессуары", image: "/orig.jpg" },
          { name: "Одежда", image: "/12.png" },
          { name: "Игрушки", image: "/cat.jpg" },
        ]}
        onSelect={(cat) => {
          router.push(`/catalog?category=${cat}`);
        }}
      />

      {/* COLLAGE */}
      <div id="catalog">
        <Collage
          items={collageItems}
          onSelect={(id: string) => setSelectedCollectionId(id)}
        />
      </div>

      {/* ERROR */}
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

      {/* COLLECTIONS */}
      <Collections
        data={activeCollections}
        isAdmin={false}
        accessToken={""}
        onReload={reload}
      />

      {/* FOOTER */}
      <div id="contacts">
        <Footer topRef={topRef} />
      </div>
    </div>
  );
}
