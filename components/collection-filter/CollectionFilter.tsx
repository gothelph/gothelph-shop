"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/productcard/productcard";
import styles from "./collection-filter.module.css";

type Collection = {
  id: string;
  title?: string;
  name?: string;
  description?: string;
};

type Product = {
  id: string;
  name: string;
  type: string;
  price: number;
  image: string;
};

export function CollectionFilter() {
  const router = useRouter();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async (collectionId?: string) => {
    setLoading(true);
    try {
      const url = collectionId 
        ? `/api/products?collection_id=${collectionId}` 
        : "/api/products";
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.all([
      fetch("/api/collections").then((r) => r.json()),
      fetch("/api/products").then((r) => r.json()),
    ]).then(([collectionsData, productsData]) => {
      setCollections(collectionsData.data || []);
      setProducts(productsData || []);
    }).catch((err) => console.error(err));
  }, []);

  const handleSelectCollection = async (collectionId: string | null) => {
    setSelectedCollection(collectionId);
    if (collectionId === null) {
      await fetchProducts();
    } else {
      await fetchProducts(collectionId);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.buttons}>
        <Button
          variant={selectedCollection === null ? "default" : "outline"}
          onClick={() => handleSelectCollection(null)}
        >
          Все товары
        </Button>
        {collections.map((c) => (
          <Button
            key={c.id}
            variant={selectedCollection === c.id ? "default" : "outline"}
            onClick={() => handleSelectCollection(c.id)}
          >
            {c.title || c.name}
          </Button>
        ))}
      </div>

      {loading ? (
        <p className={styles.loading}>Загрузка...</p>
      ) : (
        <div className={styles.products}>
          {products.length === 0 && (
            <p className={styles.empty}>Товары не найдены</p>
          )}
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => router.push(`/product/${product.id}`)}
              style={{ cursor: "pointer" }}
            >
              <ProductCard
                item={product}
                isAdmin={false}
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
