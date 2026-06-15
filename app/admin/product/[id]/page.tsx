"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useAuthContext } from "@/hooks/useAuthContext";

type Product = {
  id: string;
  name: string;
  type: string;
  price: number;
  image: string;
  description: string;
  categoryId: string;
};

export default function AdminProductPage() {
  const params = useParams();
  const { roles } = useAuthContext();

  const isAdmin = roles.includes("admin");

  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then((r) => r.json())
      .then(setProduct);
  }, [params.id]);

  const save = async () => {
    await fetch(`/api/products/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: params.id,
        name: product?.name,
        price: product?.price,
        description: product?.description,
        categoryId: product?.categoryId,
        imageUrl: product?.image,
      }),
    });
  };

  const uploadImage = async (file: File) => {
    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: form,
    });

    const data = await res.json();

    setProduct((p) => (p ? { ...p, image: data.url } : p));
  };

  if (!isAdmin) return <div>Нет доступа</div>;
  if (!product) return <div>Загрузка...</div>;

  return (
    <div>
      <h1>Редактирование товара</h1>

      <input
        value={product.name}
        onChange={(e) => setProduct({ ...product, name: e.target.value })}
      />

      <input
        value={product.type}
        onChange={(e) => setProduct({ ...product, type: e.target.value })}
      />

      <input
        type="number"
        value={product.price}
        onChange={(e) =>
          setProduct({ ...product, price: Number(e.target.value) })
        }
      />

      <textarea
        value={product.description}
        onChange={(e) =>
          setProduct({ ...product, description: e.target.value })
        }
      />

      <Image src={product.image} alt="" width={200} height={200} />

      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadImage(file);
        }}
      />

      <button onClick={save}>Сохранить</button>
    </div>
  );
}
