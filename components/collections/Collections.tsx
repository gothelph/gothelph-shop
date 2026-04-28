"use client";

import { Collection } from "@/types/collection";

type Props = {
  data: Collection[];
  isAdmin: boolean;
  accessToken: string;
  onReload: () => Promise<void>;
};

export default function Collections({ data }: Props) {
  if (data.length === 0) {
    return (
      <section id="collections" className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-4">Коллекции</h2>
        <p className="text-gray-500">Данные коллекций пока не загружены.</p>
      </section>
    );
  }
}
