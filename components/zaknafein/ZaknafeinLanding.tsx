"use client";

import ZaknafeinHero from "./ZaknafeinHero";
import ZaknafeinProducts from "./ZaknafeinProducts";
import ZaknafeinCart from "./ZaknafeinCart";
import ZaknafeinFooter from "./ZaknafeinFooter";
import styles from "./zaknafein.module.css";
import ZaknafeinNav from "./ZaknafeinNav";
import ZaknafeinAbout from "./ZaknafeinAbout";
import ZaknafeinContacts from "./ZaknafeinContacts";
import ZaknafeinProductModal from "./ZaknafeinProductModal";
import { useRouter } from "next/navigation";

export default function ZaknafeinLanding() {
  const router = useRouter();

  return (
    <div className={styles.page}>
      <ZaknafeinNav />
      <ZaknafeinHero />
      <button onClick={() => router.push("/catalog")} className={styles.btn}>
        ВЕРНУТЬСЯ
      </button>
      <ZaknafeinProducts />

      <ZaknafeinAbout />

      <ZaknafeinContacts />

      <ZaknafeinCart />
      <ZaknafeinProductModal />

      <ZaknafeinFooter />
    </div>
  );
}
