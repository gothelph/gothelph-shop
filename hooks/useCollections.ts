import { Collection } from "@/types/collection";
import { useEffect, useState } from "react";

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/collections");
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Ошибка загрузки");
          return;
        }

        setCollections(data.data || []);
        setError("");
      } catch {
        setError("Ошибка сети");
      }
    };

    load();
  }, []);

  const reload = async () => {
    try {
      const res = await fetch("/api/collections");
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ошибка загрузки");
        return;
      }

      setCollections(data.data || []);
      setError("");
    } catch {
      setError("Ошибка сети");
    }
  };

  return { collections, error, reload };
}
