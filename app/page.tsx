import Link from "next/link";

const navItems = [
  { href: "#catalog", label: "каталог" },
  { href: "#collections", label: "коллекции" },
  { href: "#about", label: "о бренде" },
];

export default function Home() {
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

        <nav className="hidden gap-8 text-3xl font-medium md:flex">
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
    </div>
  );
}
