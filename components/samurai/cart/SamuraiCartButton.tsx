"use client";

import { useSamuraiCart } from "./samuraiCartStore";

export default function SamuraiCartButton() {
  const open = useSamuraiCart((s) => s.open);
  const count = useSamuraiCart((s) =>
    s.items.reduce((sum, i) => sum + i.qty, 0),
  );

  return (
    <button
      onClick={open}
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        background: "crimson",
        color: "white",
        padding: "12px 16px",
        borderRadius: 10,
        border: "none",
        cursor: "pointer",
        zIndex: 9999,
      }}
    >
      🛒 {count}
    </button>
  );
}
