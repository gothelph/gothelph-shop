import styles from "./zaknafein.module.css";

export default function ZaknafeinAbout() {
  return (
    <section id="about" className={styles.about}>
      <div className={styles.aboutInner}>
        <h2>О Zaknafein</h2>

        <p>
          Zaknafein — это философия тьмы и совершенства. Родившийся в
          Мензоберранзане, бренд воплощает путь дроу-воина: точность, холодный
          расчёт и абсолютная дисциплина.
        </p>

        <p>
          Каждый клинок — это не просто оружие, а отражение воли. Мы создаём
          артефакты, которые принадлежат тем, кто принял тьму.
        </p>
      </div>
    </section>
  );
}
