"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header/Header";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/hooks/useAuthContext";
import styles from "./admin-orders.module.css";

type Order = {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  address: string;
  comment?: string | null;
  total: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  created_at: string;
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const { isAuth, roles, accessToken } = useAuthContext();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuth || !roles.includes("admin")) {
      router.push("/");
      return;
    }

    fetchOrders();
  }, [isAuth, roles, router]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Fetch all orders from the new API endpoint
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data: Order[] = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: "shipped" | "delivered" | "cancelled") => {
    if (!accessToken) return;
    try {
      // Update status via the PATCH endpoint
      await fetch("/api/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });

      // Refetch all orders to update the UI immediately
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  if (loading) {
    return (
      <div>
        <Header navItems={[{ href: "/", label: "ГЛАВНАЯ", className: "text-lg" }]} />
        <div className={styles.container}>Загрузка заказов...</div>
      </div>
    );
  }

  return (
    <div className="">
      <Header navItems={[{ href: "/", label: "ГЛАВНАЯ", className: "text-lg" }]} />

      <div className={styles.container}>
        <h1 className={styles.title}>Управление заказами</h1>
        
        {orders.length === 0 ? (
          <p>Заказов пока нет.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID Заказа</th>
                <th>Клиент</th>
                <th>Телефон</th>
                <th>Адрес</th>
                <th>Общая сумма</th>
                <th>Статус</th>
                <th>Дата</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className={styles.row}>
                  <td>{order.id}</td>
                  <td>{order.name}</td>
                  <td>{order.phone}</td>
                  <td>{order.address}</td>
                  <td>{order.total.toFixed(2)} ₽</td>
                  <td className={styles.statusCell}>{order.status}</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className={styles.actions}>
                    <div className="flex gap-2">
                      <Button 
                        variant="secondary" 
                        onClick={() => handleUpdateStatus(order.id, "shipped")}
                      >
                        Отправить
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handleUpdateStatus(order.id, "delivered")}
                      >
                        Доставлено
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={() => handleUpdateStatus(order.id, "cancelled")}
                      >
                        Отменить
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

(End of file - total 124 lines)