import pool from "@/lib/db";

interface Product {
  id: number;
  name: string;
  description: string;
}

const fetchProducts = async (): Promise<Product[]> => {
  try {
    const products = await pool.query<Product>("SELECT * from products");
    return products.rows;
  } catch (err) {
    console.error(err);
  }
  return [];
};

export default async function Home() {
  const products = await fetchProducts();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        {products.map((product) => (
          <div
            key={product.id}
          >{`${product.name} | ${product.description}`}</div>
        ))}
      </main>
    </div>
  );
}
