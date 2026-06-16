"use client";

import styles from "./zaknafein.module.css";

export default function ZaknafeinNav() {
  return (
    <nav className={styles.nav}>
      <a href="#products">Продукты</a>
      <a href="#about">О нас</a>
      <a href="#contacts">Контакты</a>
    </nav>
  );
}
