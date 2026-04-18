"use client";
import { useEffect } from "react";

type Item = {
  id: number;
  title: string;
  size: string;
  qty: number;
  price: number;
};

type Props = {
  isOpen: boolean;
  items: Item[];
  onClose: () => void;
  onRemove: (id: number) => void;
  onClear: () => void;
  total: number;
};

export default function CartDrawer({
  isOpen,
  items,
  onClose,
  onRemove,
  onClear,
  total,
}: Props) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 transition ${
        isOpen ? "bg-black/40" : "pointer-events-none bg-transparent"
      }`}
      onClick={onClose}
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        className={`fixed top-[120px] right-0 w-full max-w-md h-[calc(100vh-120px)] bg-white p-6 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <button onClick={onClose}>×</button>

        {items.map((item) => (
          <div key={item.id}>
            <p>{item.title}</p>
            <p>{item.price} ₽</p>
            <button onClick={() => onRemove(item.id)}>Удалить</button>
          </div>
        ))}

        <p>Итого: {total} ₽</p>
        <button onClick={onClear}>Очистить</button>
      </aside>
    </div>
  );
}
