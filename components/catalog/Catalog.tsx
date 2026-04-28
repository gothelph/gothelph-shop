"use client";
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
        setCollection(data.data);
      })
      .catch((err) => console.error(err));
  }, []);

return (
    <div>
      <Header
        navItems={[]}
        onOpenAuth={() => {}}
        onLogout={() => {}}
        isAuth={false}
        isAdmin={false}
        userName=""
      />
      <Footer />
    </div>
  );
}

export default Categories;
