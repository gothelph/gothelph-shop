import Link from "next/link";
import styles from "./samurai.module.css";
import { useSamuraiCart } from "./cart/samuraiCartStore";

export default function SamuraiFooter() {
  const open = useSamuraiCart((s) => s.open);
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.quote}>
          <p>「Следуй своему пути」</p>
          <span>— кодекс самурая</span>
        </div>

        <div className={styles.links}>
          <Link href="/">Главная</Link>
          <Link href="/samurai">Коллекция</Link>
          <button onClick={open} className={styles.linkBtn}>
            Корзина
          </button>
        </div>

        <div className={styles.bottom}>
          <span>道 – Путь продолжается</span>
        </div>
      </div>
    </footer>
  );
}
