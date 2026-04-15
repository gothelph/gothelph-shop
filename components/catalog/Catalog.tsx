"use client";

import Link from "next/link";

export function Categories() {
  return (
    <div>
      <Link href="/accessories">Карточка 1</Link>
      <Link href="/accessories">Карточка 2</Link>
      <Link href="/accessories">Карточка 3</Link>
    </div>
  );
}

export default Categories;
