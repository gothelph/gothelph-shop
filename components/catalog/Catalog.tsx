"use client";
import Header from "../header/Header";
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
    fetch("http://localhost:3000/catalog")
      .then((res) => res.json())
      .then((data) => {
        setCollection(data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <Header navItems={[]} />
    </div>
  );
}

export default Categories;
