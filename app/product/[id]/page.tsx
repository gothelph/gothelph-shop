"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Header from "@/components/header/Header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import styles from "./product-page.module.css";

type Product = {
  id: string;
  name: string;
  type: string;
  price: number;
  image: string;
  description: string;
};

export default function ProductPage() {
  const params = useParams();
  const { addItem, items: cartItems, setIsOpen } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Товар не найден");
          return;
        }
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError("Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) {
    return (
      <div>
        <Header
          navItems={[{ href: "/catalog", label: "КОЛЛЕКЦИИ", className: "text-lg" }]}
          onOpenAuth={() => {}}
          onLogout={() => {}}
          isAuth={false}
          isAdmin={false}
          userName=""
        />
        <div className={styles.container}>
          <p>Загрузка...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div>
        <Header
          navItems={[{ href: "/catalog", label: "КОЛЛЕКЦИИ", className: "text-lg" }]}
          onOpenAuth={() => {}}
          onLogout={() => {}}
          isAuth={false}
          isAdmin={false}
          userName=""
        />
        <div className={styles.container}>
          <p className={styles.error}>{error || "Товар не найден"}</p>
          <Button onClick={() => window.history.back()}>Назад</Button>
        </div>
        <Footer />
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
        onOpenAuth={() => {}}
        onLogout={() => {}}
        isAuth={false}
        isAdmin={false}
        userName=""
      />

      <div className={styles.container}>
        <Button variant="outline" onClick={() => window.history.back()}>
          Назад
        </Button>

        <div className={styles.content}>
          <div className={styles.imageWrapper}>
            {product.image && (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className={styles.image}
              />
            )}
          </div>

          <div className={styles.info}>
            <h1 className={styles.name}>{product.name}</h1>
            <p className={styles.category}>{product.type}</p>
            <p className={styles.price}>{product.price} ₽</p>

            {product.description && (
              <div className={styles.description}>
                <h3>Описание</h3>
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
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
