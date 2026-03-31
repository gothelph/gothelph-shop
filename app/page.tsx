"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

const navItems = [
  { href: "#catalog", label: "каталог" },
  { href: "#collections", label: "коллекции" },
  { href: "#about", label: "о бренде" },
];

const cartItems = [
  { id: 1, title: "GOTHELPH Hoodie", size: "L", qty: 1, price: 5900 },
  { id: 2, title: "GOTHELPH T-Shirt", size: "M", qty: 2, price: 2900 },
];

export default function Home() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [authMessage, setAuthMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const cartTotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.price * item.qty, 0),
    [],
  );

  useEffect(() => {
    const savedToken = window.localStorage.getItem("accessToken");
    if (savedToken) {
      setAccessToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!res.ok) {
          setAccessToken(null);
          window.localStorage.removeItem("accessToken");
          setAuthMessage("Сессия истекла, войдите снова.");
        }
      } catch {
        setAuthMessage("Ошибка проверки сессии.");
      }
    };

    void verifyToken();
  }, [accessToken]);

  const saveAccessToken = (token: string) => {
    setAccessToken(token);
    window.localStorage.setItem("accessToken", token);
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthMessage("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerForm),
      });
      const data = await res.json();

      if (!res.ok) {
        setAuthMessage(data?.error?.message ?? "Ошибка регистрации");
        return;
      }

      setAuthMessage("Регистрация успешна. Теперь войдите.");
      setAuthMode("login");
      setLoginForm((prev) => ({ ...prev, email: registerForm.email }));
      setRegisterForm({ username: "", email: "", password: "" });
    } catch {
      setAuthMessage("Сервер недоступен. Попробуйте позже.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();

      if (!res.ok) {
        setAuthMessage(data?.error?.message ?? "Ошибка входа");
        return;
      }

      if (data?.accessToken) {
        saveAccessToken(data.accessToken);
      }

      setAuthMessage("Вы успешно вошли.");
      setIsAuthOpen(false);
      setLoginForm({ email: "", password: "" });
    } catch {
      setAuthMessage("Сервер недоступен. Попробуйте позже.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setAccessToken(null);
      window.localStorage.removeItem("accessToken");
      setAuthMessage("Вы вышли из аккаунта.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 pt-8 md:px-10">
        <nav className="hidden gap-8 text-3xl font-medium md:flex">
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

        <div className="flex items-center gap-4">
          <nav className="hidden gap-8 text-3xl font-medium xl:flex">
            {navItems.map((item) => (
              <Link
                key={`right-${item.href}`}
                href={item.href}
                className="transition hover:opacity-60"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => {
              setAuthMode("register");
              setIsAuthOpen(true);
              setAuthMessage("");
            }}
            className="rounded border border-neutral-300 bg-white px-4 py-2 text-lg transition hover:bg-neutral-200"
          >
            регистрация
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode("login");
              setIsAuthOpen(true);
              setAuthMessage("");
            }}
            className="rounded border border-neutral-300 bg-white px-4 py-2 text-lg transition hover:bg-neutral-200"
          >
            вход
          </button>
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="rounded border border-neutral-300 bg-white px-4 py-2 text-lg transition hover:bg-neutral-200"
          >
            корзина
          </button>
          {accessToken && (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded border border-neutral-300 bg-white px-4 py-2 text-lg transition hover:bg-neutral-200"
            >
              выйти
            </button>
          )}
        </div>
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
            GOTHELPH — визуальный стиль, уличная мода и вдохновение поп-культурой.
          </p>
        </section>
      </main>

      {isAuthOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-2xl font-semibold">
                {authMode === "register" ? "Регистрация" : "Вход"}
              </h3>
              <button
                type="button"
                onClick={() => setIsAuthOpen(false)}
                className="text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="mb-4 flex gap-2">
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className={`rounded px-3 py-1 text-sm ${authMode === "login" ? "bg-neutral-900 text-white" : "bg-neutral-200"}`}
              >
                Вход
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("register")}
                className={`rounded px-3 py-1 text-sm ${authMode === "register" ? "bg-neutral-900 text-white" : "bg-neutral-200"}`}
              >
                Регистрация
              </button>
            </div>

            {authMode === "register" ? (
              <form className="space-y-3" onSubmit={handleRegister}>
                <input
                  className="w-full rounded border border-neutral-300 px-3 py-2"
                  type="text"
                  placeholder="Username"
                  value={registerForm.username}
                  onChange={(e) =>
                    setRegisterForm((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                  required
                />
                <input
                  className="w-full rounded border border-neutral-300 px-3 py-2"
                  type="email"
                  placeholder="Email"
                  value={registerForm.email}
                  onChange={(e) =>
                    setRegisterForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  required
                />
                <input
                  className="w-full rounded border border-neutral-300 px-3 py-2"
                  type="password"
                  placeholder="Password"
                  value={registerForm.password}
                  onChange={(e) =>
                    setRegisterForm((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded bg-neutral-900 px-4 py-2 text-white transition hover:bg-neutral-700 disabled:opacity-70"
                >
                  {isSubmitting ? "Сохраняем..." : "Создать аккаунт"}
                </button>
              </form>
            ) : (
              <form className="space-y-3" onSubmit={handleLogin}>
                <input
                  className="w-full rounded border border-neutral-300 px-3 py-2"
                  type="email"
                  placeholder="Email"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                />
                <input
                  className="w-full rounded border border-neutral-300 px-3 py-2"
                  type="password"
                  placeholder="Password"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded bg-neutral-900 px-4 py-2 text-white transition hover:bg-neutral-700 disabled:opacity-70"
                >
                  {isSubmitting ? "Входим..." : "Войти"}
                </button>
              </form>
            )}
            {authMessage && (
              <p className="mt-3 text-sm text-neutral-700">{authMessage}</p>
            )}
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
    </div>
  );
}
