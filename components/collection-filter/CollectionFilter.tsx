"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/productcard/productcard";
import styles from "./collection-filter.module.css";
import { useAuthContext } from "@/hooks/useAuthContext";

interface Collection {
  id: string;
  title?: string;
  name?: string;
  description?: string;
}

interface Product {
  id: string;
  name: string;
  type: string;
  price: number;
  image: string;
  brandId: number | null;
}

export function CollectionFilter() {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const { roles } = useAuthContext();
  const isAdmin = roles.includes("admin");

  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const initialId = params.id as string | undefined;
  const initialCategory = searchParams.get("category");

  const [collections, setCollections] = useState<Collection[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<{ id: number; name: string }[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    initialId || null,
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialCategory || null,
  );

  const [editCollection, setEditCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async (collectionId?: string | null) => {
    setLoading(true);
    try {
      const url = collectionId
        ? `/api/products?collection_id=${collectionId}`
        : "/api/products";

      const res = await fetch(url);
      const data = await res.json();
      setProducts(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.all([
      fetch("/api/collections").then((r) => r.json()),
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/brands").then((r) => r.json()),
    ]).then(([collectionsData, productsData, brandsData]) => {
      setCollections(collectionsData.data || []);
      setProducts(productsData || []);
      setBrands(brandsData || []);
    });
  }, []);

  const handleSelectCollection = async (collectionId: string | null) => {
    setSelectedCollection(collectionId);
    setSelectedCategory(null);
    setSelectedBrand(null);
    await fetchProducts(collectionId);
  };

  const saveCollection = async () => {
    if (!editCollection) return;

    await fetch("/api/collections", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        collectionId: editCollection.id,
        title: editCollection.title || editCollection.name,
        description: editCollection.description,
      }),
    });

    setEditCollection(null);

    const res = await fetch("/api/collections");
    const data = await res.json();
    setCollections(data.data || []);
  };

  const categories = Array.from(
    new Set(products.map((p) => p.type).filter(Boolean)),
  );

  const filteredProducts = products.filter((p) => {
    const matchType = selectedCategory ? p.type === selectedCategory : true;
    const matchBrand = selectedBrand
      ? p.brandId?.toString() === selectedBrand
      : true;

    return matchType && matchBrand;
  });

  return (
    <div className={styles.container}>
      {/* COLLECTIONS */}
      <div className={styles.buttons}>
        <Button
          variant={selectedCollection === null ? "default" : "outline"}
          onClick={() => handleSelectCollection(null)}
        >
          Все товары
        </Button>

        {collections.map((c) => (
          <div key={c.id} style={{ display: "flex", gap: 6 }}>
            <Button
              variant={selectedCollection === c.id ? "default" : "outline"}
              onClick={() => handleSelectCollection(c.id)}
            >
              {c.title || c.name}
            </Button>
          </div>
        ))}
      </div>

      <div className={styles.buttons}>
        <Button
          variant={selectedBrand === null ? "default" : "outline"}
          onClick={() => setSelectedBrand(null)}
        >
          Все бренды
        </Button>

        {brands.map(({ id, name }) => (
          <Button
            key={id}
            variant={selectedBrand === id.toString() ? "default" : "outline"}
            onClick={() => setSelectedBrand(id.toString())}
          >
            {name}
          </Button>
        ))}
      </div>

      {/* EDIT COLLECTION */}
      {isAdmin && editCollection && (
        <div className={styles.adminBox}>
          <input
            value={editCollection.title || editCollection.name || ""}
            onChange={(e) =>
              setEditCollection({
                ...editCollection,
                title: e.target.value,
              })
            }
          />

          <textarea
            value={editCollection.description || ""}
            onChange={(e) =>
              setEditCollection({
                ...editCollection,
                description: e.target.value,
              })
            }
          />

          <Button onClick={saveCollection}>Сохранить</Button>
          <Button variant="outline" onClick={() => setEditCollection(null)}>
            Отмена
          </Button>
        </div>
      )}

      {/* CATEGORIES */}
      <div className={styles.buttons}>
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => setSelectedCategory(null)}
        >
          Все категории
        </Button>

        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* PRODUCTS */}
      {loading ? (
        <p className={styles.loading}>Загрузка...</p>
      ) : (
        <div className={styles.products}>
          {filteredProducts.length === 0 && (
            <p className={styles.empty}>Товары не найдены</p>
          )}

          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => router.push(`/product/${product.id}`)}
              style={{ cursor: "pointer" }}
            >
              <ProductCard
                item={product}
                isAdmin={isAdmin}
                collectionId={selectedCollection || ""}
                onDelete={() => {}}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CollectionFilter;
