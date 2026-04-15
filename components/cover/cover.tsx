"use client";

import styles from "./cover.module.css";
import Image from "next/image";

export function Cover() {
  return (
    <div>
      <Image
        className={styles.cover}
        src="/cover.jpeg"
        alt="cover"
        width={300}
        height={200}
      />
    </div>
  );
}
