import ProductCard from "./ProductCard";
import styles from "./samurai.module.css";

const PRODUCTS = [
  { id: 1, name: "Катана «Клинок рассвета»", price: "$299" },
  { id: 2, name: "Броня ронина", price: "$799" },
  { id: 3, name: "Свиток чести", price: "$59" },
];

export default function Products() {
  return (
    <section className={styles.products}>
      <h2>Артефакты воина</h2>

      <div className={styles.grid}>
        {PRODUCTS.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
