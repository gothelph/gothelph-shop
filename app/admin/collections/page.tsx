"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "@/hooks/useAuthContext";

type Collection = {
  id: string;
  title: string;
  description?: string;
};

export default function CollectionsAdminPage() {
  const { roles } = useAuthContext();
  const isAdmin = roles.includes("admin");

  const [collections, setCollections] = useState<Collection[]>([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [editing, setEditing] = useState<Collection | null>(null);

  useEffect(() => {
    fetch("/api/collections")
      .then((r) => r.json())
      .then((d) => setCollections(d.data || []));
  }, []);

  if (!isAdmin) return <div>Нет доступа</div>;

  const refresh = async () => {
    const res = await fetch("/api/collections");
    const data = await res.json();
    setCollections(data.data || []);
  };

  const save = async () => {
    await fetch("/api/collections", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        editing
          ? {
              collectionId: editing.id,
              title: form.title,
              description: form.description,
            }
          : form,
      ),
    });

    setForm({ title: "", description: "" });
    setEditing(null);
    refresh();
  };

  const remove = async (id: string) => {
    await fetch("/api/collections", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collectionId: id }),
    });

    refresh();
  };

  return (
    <div>
      <h1>Коллекции</h1>

      <input
        placeholder="Название"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <input
        placeholder="Описание"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <button onClick={save}>{editing ? "Сохранить" : "Добавить"}</button>

      <hr />

      {collections.map((c) => (
        <div key={c.id}>
          <b>{c.title}</b>

          <button
            onClick={() => {
              setEditing(c);
              setForm({
                title: c.title,
                description: c.description || "",
              });
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
