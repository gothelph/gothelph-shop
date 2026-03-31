"use client";
import Link from "next/link";
import { useState } from "react";

const navItems = [
  { href: "#catalog", label: "каталог" },
  { href: "#collections", label: "коллекции" },
  { href: "#about", label: "о бренде" },
];

export default function Home() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const cartItems = [
    { id: 1, title: "GOTHELPH Hoodie", size: "L", qty: 1, price: 5900 },
  ];
  const cartTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );
  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 pt-8 md:px-0">
        <nav className="hidden gap-8 text-3xl font-medium md:flex whitespace-nowrap">
          {navItems.map((item) => (
            <Link
              key={`left-${item.href}`}
              href={item.href}
              className="transition hover:opacity-60"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col items-center gap-3">
          <div className="h-44 w-44 rounded border border-neutral-200 bg-[url('https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=900&auto=format&fit=crop')] bg-cover bg-center" />
          <p className="text-7xl tracking-wide">GOTHELPH</p>
        </div>

        <nav className="hidden gap-8 text-3xl font-medium md:flex">
          <button type="button" onClick={() => setIsLoginOpen(true)}>
            Войти
          </button>
          <button onClick={() => setIsRegisterOpen(true)}>
            Зарегистрироваться
          </button>
        </nav>
      </header>

      <section className="mx-auto mt-10 max-w-6xl px-6 md:px-10">
        <div className="relative h-[62vh] min-h-[400px] rounded-sm bg-[url('https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2200&auto=format&fit=crop')] bg-cover bg-center shadow">
          <a
            href="#catalog"
            className="absolute bottom-5 left-1/2 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full bg-white/80 text-3xl shadow transition hover:bg-white"
            aria-label="Перейти к каталогу"
          >
            ↓
          </a>
        </div>
      </section>

      <main className="mx-auto mt-16 max-w-6xl space-y-16 px-6 pb-20 md:px-10">
        <section id="catalog" className="space-y-4 scroll-mt-24">
          <h2 className="text-4xl font-semibold">Каталог</h2>
          <p className="text-xl text-neutral-700">
            Здесь будет основной список товаров, фильтры и быстрый доступ к
            карточкам.
          </p>
        </section>

        <section id="collections" className="space-y-4 scroll-mt-24">
          <h2 className="text-4xl font-semibold">Коллекции</h2>
          <p className="text-xl text-neutral-700">
            Сезонные дропы, лимитированные линейки и подборки по стилю.
          </p>
        </section>

        <section id="about" className="space-y-4 scroll-mt-24">
          <h2 className="text-4xl font-semibold">О бренде</h2>
          <p className="text-xl text-neutral-700">
            GOTHELPH — визуальный стиль, уличная мода и вдохновение
            аниме-культурой.
          </p>
        </section>
      </main>

      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-2xl font-semibold">Регистрация</h3>
              <button
                type="button"
                onClick={() => setIsRegisterOpen(false)}
                className="text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <form className="space-y-3">
              <input
                className="w-full rounded border border-neutral-300 px-3 py-2"
                type="text"
                placeholder="Username"
              />
              <input
                className="w-full rounded border border-neutral-300 px-3 py-2"
                type="email"
                placeholder="Email"
              />
              <input
                className="w-full rounded border border-neutral-300 px-3 py-2"
                type="password"
                placeholder="Password"
              />
              <button
                type="button"
                className="w-full rounded bg-neutral-900 px-4 py-2 text-white transition hover:bg-neutral-700"
              >
                Создать аккаунт
              </button>
            </form>
          </div>
        </div>
      )}

      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/40">
          <aside className="ml-auto flex h-full w-full max-w-md flex-col bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-2xl font-semibold">Корзина</h3>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-auto">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded border border-neutral-200 p-3 text-sm"
                >
                  <p className="font-medium">{item.title}</p>
                  <p className="text-neutral-600">
                    Размер: {item.size} · Кол-во: {item.qty}
                  </p>
                  <p className="mt-1 font-semibold">{item.price} ₽</p>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-neutral-200 pt-4">
              <p className="mb-3 flex items-center justify-between text-lg font-semibold">
                <span>Итого:</span>
                <span>{cartTotal} ₽</span>
              </p>
              <button
                type="button"
                className="w-full rounded bg-neutral-900 px-4 py-2 text-white transition hover:bg-neutral-700"
              >
                Оформить заказ
              </button>
            </div>
          </aside>
        </div>
      )}

      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-2xl font-semibold">Вход</h3>
              <button
                type="button"
                onClick={() => setIsLoginOpen(false)}
                className="text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <form className="space-y-3">
              <input
                className="w-full rounded border border-neutral-300 px-3 py-2"
                type="email"
                placeholder="Email"
              />
              <input
                className="w-full rounded border border-neutral-300 px-3 py-2"
                type="password"
                placeholder="Password"
              />
              <button
                type="button"
                className="w-full rounded bg-neutral-900 px-4 py-2 text-white"
              >
                Войти
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
