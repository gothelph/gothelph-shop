"use client";

import Categories from "@/components/catalog/Catalog";

export default function App() {
  return (
    <div>
      <Categories />
    </div>
  );
}

// import { FormEvent, useMemo, useState } from "react";
// import Header from "@/components/header/Header";
// import CartDrawer from "@/components/card-drawer/CartDrawer";
// import AuthModal from "@/components/auth-modal/AuthModal";
// import Collections from "@/components/collections/Collections";
// import { useAuth } from "@/hooks/useAuth";
// import { useCollections } from "@/hooks/useCollections";
// import { CategoriesCarousel } from "@/components/carousel/carousel";
// import { ParallaxHero } from "@/components/paralax";
// import { Cover } from "@/components/cover";
// import { Collage } from "@/components/collections/Collage";
// import { Footer } from "@/components/footer";

// export default function Home() {
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [isAuthOpen, setIsAuthOpen] = useState(false);
//   const [authMode, setAuthMode] = useState<"login" | "register">("login");

//   const [cartItems, setCartItems] = useState([
//     { id: 1, title: "Hoodie", size: "L", qty: 1, price: 5900 },
//   ]);

//   const {
//     isAuth,
//     roles,
//     message,
//     clearMessage,
//     login,
//     register,
//     logout,
//     accessToken,
//   } = useAuth();

//   const isAdmin = roles.includes("admin");

//   const { collections, error: collectionsError, reload } = useCollections();

//   const total = useMemo(
//     () => cartItems.reduce((acc, i) => acc + i.price * i.qty, 0),
//     [cartItems],
//   );

//   // 🔥 Collage данные (ВАЖНО)
//   const collageItems = collections.map((collection) => {
//     const image = collection.subcollections?.[0]?.items?.[0]?.image || null;

//     return {
//       id: Number(collection.id),
//       title: collection.title,
//       image,
//     };
//   });

//   // Логин
//   const onLogin = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const formData = new FormData(e.currentTarget);

//     const success = await login({
//       email: String(formData.get("email") || ""),
//       password: String(formData.get("password") || ""),
//     });

//     if (success) {
//       setIsAuthOpen(false);
//       e.currentTarget.reset();
//     }
//     return success;
//   };

//   // Регистрация
//   const onRegister = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const formData = new FormData(e.currentTarget);

//     const success = await register({
//       username: String(formData.get("username") || ""),
//       email: String(formData.get("email") || ""),
//       password: String(formData.get("password") || ""),
//     });

//     if (success) {
//       setAuthMode("login");
//       e.currentTarget.reset();
//     }
//     return success;
//   };

//   return (
//     <div>
//       <Header
//         navItems={[
//           { href: "#catalog", label: "КОЛЛЕКЦИИ", className: "text-lg" },
//           { href: "#collections", label: "КОНТАКТЫ", className: "text-lg" },
//         ]}
//         onOpenAuth={(mode) => {
//           clearMessage();
//           setAuthMode(mode);
//           setIsAuthOpen(true);
//         }}
//         onOpenCart={() => setIsCartOpen(true)}
//         onLogout={logout}
//         isAuth={isAuth}
//         isAdmin={isAdmin}
//         cartCount={cartItems.length}
//       />

//       <Cover />
//       <ParallaxHero />

//       <CategoriesCarousel
//         categories={[
//           { name: "Аксессуары", image: "/hero.jpg" },
//           { name: "Одежда", image: "/hero2.jpg" },
//           { name: "Игрушки", image: "/hero.jpg" },
//           { name: "Одежда", image: "/hero4.jpg" },
//           { name: "Одежда", image: "/hero4.jpg" },
//           { name: "Одежда", image: "/hero4.jpg" },
//           { name: "Одежда", image: "/hero4.jpg" },
//         ]}
//         onSelect={(cat) => console.log(cat)}
//       />

//       {/* 🔥 ВИТРИНА (реальный коллаж) */}
//       <Collage items={collageItems} />

//       {collectionsError && (
//         <p
//           style={{
//             color: "#b91c1c",
//             maxWidth: "72rem",
//             margin: "1rem auto",
//             padding: "0 1rem",
//           }}
//         >
//           {collectionsError}
//         </p>
//       )}

//       {/* 🧠 АДМИНКА */}
//       <Collections
//         data={collections}
//         isAdmin={isAdmin}
//         accessToken={accessToken}
//         onReload={reload}
//       />

//       <Footer />

//       <CartDrawer
//         isOpen={isCartOpen}
//         items={cartItems}
//         onClose={() => setIsCartOpen(false)}
//         onRemove={(id) =>
//           setCartItems((prev) => prev.filter((i) => i.id !== id))
//         }
//         onClear={() => setCartItems([])}
//         total={total}
//       />

//       <AuthModal
//         isOpen={isAuthOpen}
//         mode={authMode}
//         onClose={() => setIsAuthOpen(false)}
//         onSwitch={setAuthMode}
//         onLogin={onLogin}
//         onRegister={onRegister}
//         message={message}
//       />
//     </div>
//   );
// }
