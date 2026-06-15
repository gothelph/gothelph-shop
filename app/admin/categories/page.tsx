"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "@/hooks/useAuthContext";

type Category = {
  id: string;
  name: string;
};

export default function CategoriesAdminPage() {
  const { roles } = useAuthContext();
  const isAdmin = roles.includes("admin");

  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState<Category | null>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories);
  }, []);

  if (!isAdmin) return <div>Нет доступа</div>;

  const refresh = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data || []);
  };

  const save = async () => {
    await fetch("/api/categories", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        editing ? { categoryId: editing.id, name } : { name },
      ),
    });

    setName("");
    setEditing(null);
    refresh();
  };

  const remove = async (id: string) => {
    await fetch("/api/categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryId: id }),
    });

    refresh();
  };

  return (
    <div>
      <h1>Категории</h1>

      <input
        placeholder="Название"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={save}>{editing ? "Сохранить" : "Добавить"}</button>

      <hr />

      {categories.map((c) => (
        <div key={c.id}>
          <b>{c.name}</b>

          <button
            onClick={() => {
              setEditing(c);
              setName(c.name);
            }}
          >
            Редактировать
          </button>

          <button onClick={() => remove(c.id)}>Удалить</button>
        </div>
      ))}
    </div>
  );
}
