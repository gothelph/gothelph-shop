import { Collection } from "@/types/collection";

type Props = {
  data: Collection[];
};

export default function Collections({ data }: Props) {
  return (
    <section>
      <h2>Коллекции</h2>

      {data.map((collection) => (
        <div key={collection.id}>
          <h3>{collection.title}</h3>

          {collection.subcollections.map((sub) => (
            <div key={sub.id}>
              <h4>{sub.title}</h4>

              {sub.items.map((item) => (
                <div key={item.name}>
                  <p>{item.name}</p>
                  <p>{item.price} ₽</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}
