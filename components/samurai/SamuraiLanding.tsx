"use client";

import SakuraCanvas from "./SakuraCanvas";
import Products from "./Products";
import styles from "./samurai.module.css";
import transition from "./pageTransitions.module.css";

export default function SamuraiLanding() {
  return (
    <div className={`${styles.page} ${transition.pageEnter}`}>
      <SakuraCanvas />

      <header className={styles.hero}>
        <h1>道 – Путь Самурая</h1>
        <p>Честь. Дисциплина. Клинок.</p>
        <button>Войти в кодекс</button>
      </header>

      <Products />
    </div>
  );
}
