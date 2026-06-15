"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Header from "@/components/header/Header";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useAuthContext } from "@/hooks/useAuthContext";
import styles from "./product-page.module.css";

type Product = {
  id: string;
  name: string;
  type: string;
  price: number;
  image: string;
  description: string;
  productVariantId: string;
};

export default function ProductPage() {
  const params = useParams();
  const { roles } = useAuthContext();
  const isAdmin = roles.includes("admin");

  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const productId = params.id as string;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Товар не найден");
          return;
        }

        const data = await res.json();
        setProduct(data);
        setForm(data);
      } catch {
        setError("Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  const handleSave = async () => {
    if (!form) return;

    await fetch(`/api/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.name,
        price: form.price,
        description: form.description,
        image: form.image,
      }),
    });

    alert("Сохранено");
  };

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      productVariantId: product.productVariantId,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className={styles.container}>Загрузка...</div>
      </div>
    );
  }

  if (error || !product || !form) {
    return (
      <div>
        <Header />
        <div className={styles.container}>
          <p className={styles.error}>{error || "Товар не найден"}</p>
          <Button onClick={() => window.history.back()}>Назад</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header
        navItems={[
          { href: "/", label: "ГЛАВНАЯ", className: "text-lg" },
          { href: "/catalog", label: "КОЛЛЕКЦИИ", className: "text-lg" },
        ]}
      />

      <div className={styles.container}>
        <Button variant="outline" onClick={() => window.history.back()}>
          Назад
        </Button>

        <div className={styles.content}>
          <div className={styles.imageWrapper}>
            <Image
              src={form.image}
              alt={form.name}
              fill
              className={styles.image}
            />
          </div>

          <div className={styles.info}>
            {isAdmin ? (
              <>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <input
                  value={form.price}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      price: Number(e.target.value),
                    })
                  }
                />

                <input
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                />

                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                />

                <input
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="Image URL"
                />

                <Button onClick={handleSave}>Сохранить</Button>
              </>
            ) : (
              <>
                <h1 className={styles.name}>{product.name}</h1>
                <p className={styles.category}>{product.type}</p>
                <p className={styles.price}>{product.price} ₽</p>

                {product.description && (
                  <div className={styles.description}>
                    <p>{product.description}</p>
                  </div>
                )}

                <Button
                  className={styles.addButton}
                  onClick={handleAddToCart}
                  disabled={added}
                >
                  {added ? "Добавлено!" : "Добавить в корзину"}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
