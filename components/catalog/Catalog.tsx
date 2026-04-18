"use client";
import Link from "next/link";
import Header from "../header/Header";
import { Footer } from "../footer";
import { useState, useEffect } from "react";

export function Categories() {
  type Collection = {
    id: string;
    name?: string;
    title?: string;
    description?: string;
  };

  const [collections, setCollection] = useState<Collection[]>([]);

  useEffect(() => {
    fetch("http://172.18.0.1:3000/api/collections")
      .then((res) => res.json())
      .then((data) => {
        console.log("collections:", data);
        setCollection(data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <Header
        navItems={[]}
        onOpenAuth={function (): void {
          throw new Error("Function not implemented.");
        }}
        onOpenCart={function (): void {
          throw new Error("Function not implemented.");
        }}
        onLogout={function (): void {
          throw new Error("Function not implemented.");
        }}
        isAuth={false}
        isAdmin={false}
        cartCount={0}
      />
      <div>
        {collections.map((c) => (
          <div key={c.id}>{c.name || c.title}</div>
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default Categories;
