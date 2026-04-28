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
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/collections")
      .then((res) => res.json())
      .then((data) => setCollections(data.data || []))
      .catch((err) => console.error(err));
  }, []);

  const handleSelectCollection = async (collectionId: string) => {
    setSelectedCollection(collectionId);
    setLoading(true);
    try {
      const res = await fetch(`/api/products?collection_id=${collectionId}`);
      const data = await res.json();
      setProducts(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.buttons}>
        <Button
          variant={selectedCollection === null ? "default" : "outline"}
          onClick={() => {
            setSelectedCollection(null);
            setProducts([]);
          }}
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
          {products.length === 0 && selectedCollection && (
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
