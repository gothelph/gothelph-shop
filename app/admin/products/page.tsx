"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header/Header";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/hooks/useAuthContext";
import styles from "./admin-products.module.css";

type Product = {
  id: string;
  name: string;
  price: number;
  type: string;
  image: string;
};

type ProductEditData = {
  id: string;
  name: string;
  price: number;
  categoryId: string | null;
  collectionId: string | null;
  description: string | null;
  imageUrl: string | null;
};

type Collection = {
  id: string;
  title?: string;
  name?: string;
};

type Category = {
  id: string;
  name: string;
};

export default function AdminProductsPage() {
  const router = useRouter();
  const { isAuth, roles, accessToken } = useAuthContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  const emptyForm = {
    name: "",
    price: "",
    categoryId: "",
    collectionId: "",
    description: "",
    imageUrl: "",
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!isAuth || !roles.includes("admin")) {
      router.push("/");
      return;
    }

    Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/collections").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]).then(([productsData, collectionsData, categoriesData]) => {
      setProducts(productsData || []);
      setCollections(collectionsData.data || []);
      setCategories(categoriesData || []);
      setLoading(false);
    });
  }, [isAuth, roles, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;

    const method = editing ? "PATCH" : "POST";
    const body = editing
      ? { id: editing.id, ...form, price: Number(form.price) }
      : { ...form, price: Number(form.price) };

    const res = await fetch("/api/admin/products", {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setShowForm(false);
      setEditing(null);
      setForm(emptyForm);
      const productsRes = await fetch("/api/products");
      const data = await productsRes.json();
      setProducts(data || []);
    }
  };

  const handleDelete = async (id: string) => {
    if (!accessToken) return;
    if (!confirm("Удалить товар?")) return;

    const res = await fetch("/api/admin/products", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleEdit = async (product: Product) => {
    if (!accessToken) return;

    const fallbackForm = {
      name: product.name,
      price: String(product.price),
      categoryId: "",
      collectionId: "",
      description: "",
      imageUrl: product.image === "/placeholder.png" ? "" : product.image,
    };

    setEditing(product);
    setForm(fallbackForm);
    setShowForm(true);

    const res = await fetch(`/api/admin/products?id=${product.id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) return;

    const data = (await res.json()) as ProductEditData;
    setForm({
      name: data.name || "",
      price: String(data.price ?? ""),
      categoryId: data.categoryId || "",
      collectionId: data.collectionId || "",
      description: data.description || "",
      imageUrl: data.imageUrl || "",
    });
  };

  if (loading) {
    return (
      <div>
        <Header
          navItems={[{ href: "/", label: "ГЛАВНАЯ", className: "text-lg" }]}
        />
        <div className={styles.container}>Загрузка...</div>
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
        <div className={styles.header}>
          <h1>Управление товарами</h1>
          <Button
            onClick={() => {
              setEditing(null);
              setForm(emptyForm);
              setShowForm(true);
            }}
          >
            Добавить товар
          </Button>
        </div>

        {showForm && (
          <form className={styles.form} onSubmit={handleSubmit}>
            <h2>{editing ? "Редактировать товар" : "Новый товар"}</h2>

            <label>
              Название *
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </label>

            <label>
              Цена *
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </label>

            <label>
              Категория
              <select
                value={form.categoryId}
                onChange={(e) =>
                  setForm({ ...form, categoryId: e.target.value })
                }
              >
                <option value="">Выберите категорию</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Коллекция
              <select
                value={form.collectionId}
                onChange={(e) =>
                  setForm({ ...form, collectionId: e.target.value })
                }
              >
                <option value="">Выберите коллекцию</option>
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title || c.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              URL изображения
              <input
                type="text"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              />
            </label>

            <label>
              Описание
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </label>

            <div className={styles.formButtons}>
              <Button type="submit">
                {editing ? "Сохранить" : "Добавить"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                  setForm(emptyForm);
                }}
              >
                Отмена
              </Button>
            </div>
          </form>
        )}

        <div className={styles.list}>
          {products.map((product) => (
            <div key={product.id} className={styles.item}>
              <div className={styles.itemInfo}>
                <p className={styles.itemName}>{product.name}</p>
                <p>
                  {product.price} ₽ - {product.type}
                </p>
              </div>
              <div className={styles.itemActions}>
                <Button variant="outline" onClick={() => handleEdit(product)}>
                  Редактировать
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(product.id)}
                >
                  Удалить
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
