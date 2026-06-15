"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/header/Header";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/hooks/useAuthContext";
import styles from "./page.module.css";
import AdminMenu from "@/components/AdminMenu/AdminMenu";
import { useRouter } from "next/navigation";

type Order = {
  id: string;
  username: string;
  phone: string;
  email?: string | null;
  address: string;
  comment?: string | null;
  total: string;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  created_at: string;
};

export default function AdminOrdersPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { isAuth, roles, accessToken } = useAuthContext();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { id: userId } = await params;
      // Fetch all orders from the new API endpoint
      const res = await fetch(`/api/admin/users/${userId}/orders`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data: Order[] = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    if (!isAuth || !roles.includes("admin")) {
      router.push("/");
      return;
    }

    fetchOrders();
  }, [fetchOrders, isAuth, roles, router]);


  const handleUpdateStatus = async (orderId: string, newStatus: "shipped" | "delivered" | "cancelled") => {
    if (!accessToken) return;
    try {
      await fetch("/api/admin/orders/status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          id: orderId,
          status: newStatus,
        }),
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
        <Header />
        <AdminMenu />
        <div className={styles.container}>Загрузка заказов...</div>
      </div>
    );
  }

  return (
    <div className="">
      <Header />
      <AdminMenu />

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
                  <td>{order.username}</td>
                  <td>{order.phone}</td>
                  <td>{order.address}</td>
                  <td>{Number(order.total)?.toFixed(2)} ₽</td>
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

