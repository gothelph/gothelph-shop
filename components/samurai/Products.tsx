"use client";

import ProductCard from "./ProductCard";
import styles from "./samurai.module.css";
import { useEffect, useState } from "react";

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/brands/1");

        if (!res.ok) throw new Error("Ошибка загрузки");

        const data = await res.json();
        setProducts(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <section className={styles.products}>
      <h2>Артефакты воина</h2>

      <div className={styles.grid}>
        {products.map((p: any) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
