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

  // return (
  //   <div className="flex p-50px">
  //     <button className="p-50px">Кнопка</button>
  //   </div>
  // );
  //   <section id="collections" className="max-w-6xl mx-auto px-4 py-16">
  //     <h2 className="text-3xl font-bold mb-6">Коллекции</h2>

  //     {statusMessage && (
  //       <p className="mb-4 text-sm text-gray-600">{statusMessage}</p>
  //     )}

  //     {data.map((collection) => (
  //       <article
  //         key={collection.id}
  //         className="mb-10 border rounded-2xl p-6 shadow-sm"
  //       >
  //         <h3 className="text-xl font-semibold">{collection.title}</h3>

  //         <p className="text-gray-600 mb-4">{collection.description}</p>

  //         {isAdmin && (
  //           <form
  //             onSubmit={(e) => handleCollectionSave(e, collection.id)}
  //             className="mb-6 space-y-3"
  //           >
  //             <div className="flex gap-3">
  //               <input
  //                 name="title"
  //                 defaultValue={collection.title}
  //                 placeholder="Название коллекции"
  //                 className="border rounded-lg px-3 py-2 w-full"
  //               />

  //               <input
  //                 name="description"
  //                 defaultValue={collection.description}
  //                 placeholder="Описание"
  //                 className="border rounded-lg px-3 py-2 w-full"
  //               />
  //             </div>

  //             <button
  //               type="submit"
  //               className="bg-black text-white px-4 py-2 rounded-lg"
  //             >
  //               Сохранить
  //             </button>
  //           </form>
  //         )}
  //       </article>
  //     ))}
  //   </section>
  // );
}
