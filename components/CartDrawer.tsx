"use client";

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40">
      <aside className="ml-auto h-full w-full max-w-md bg-white p-6">
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
