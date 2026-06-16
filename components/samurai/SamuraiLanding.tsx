"use client";

import SakuraCanvas from "./SakuraCanvas";
import Products from "./Products";
import styles from "./samurai.module.css";
import transition from "./pageTransitions.module.css";
import SamuraiFooter from "./SamuraiFooter";
import { useRouter } from "next/navigation";
import ProductModal from "./ProductModal";
import SamuraiCartButton from "./cart/SamuraiCartButton";
import SamuraiCartDrawer from "./cart/SamuraiCartDrawer";

export default function SamuraiLanding() {
  const router = useRouter();

  return (
    <div className={`${styles.page} ${transition.pageEnter}`}>
      <SakuraCanvas />

      <header className={styles.hero}>
        <h1>道 – Путь Самурая</h1>
        <p>Честь. Дисциплина. Клинок.</p>

        <button onClick={() => router.push("/catalog")} className={styles.btn}>
          ВЕРНУТЬСЯ
        </button>
      </header>

      <Products />
      <ProductModal />
      <SamuraiFooter />
      <SamuraiCartButton />
      <SamuraiCartDrawer />
    </div>
  );
}
