/* eslint-disable @next/next/no-head-element */
"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "@/hooks/useAuthContext";

export default function OrdersList() {
  const { accessToken } = useAuthContext();
  const [orders, setOrders] = useState(new Map());

  useEffect(() => {
    if (!accessToken) return;

    fetch("/api/user/orders", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const groupByOrderId = new Map();
        for (const order of data.orders) {
          if (groupByOrderId.has(order.id)) {
            groupByOrderId.get(order.id).push(order);
          } else {
            groupByOrderId.set(order.id, [order]);
          }
        }

        setOrders(groupByOrderId);
      });
  }, [accessToken]);

  return (
    <div className="min-h-[50vh] bg-white text-black flex justify-center py-10">
      {/* фиксированный контейнер */}
      <div className="w-full max-w-2xl px-4">
        <h1 className="text-2xl font-semibold mb-6 border-b pb-2">
          Ваши заказы
        </h1>

        {orders.length === 0 ? (
          <div className="flex items-center justify-center h-40 border border-dashed border-black/20 rounded-xl">
            <p className="text-gray-500 text-sm tracking-wide">
              ПОКА ЧТО ПУСТО
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {[...orders.entries()].map(([id, order]) => (
              <div
                key={id}
                className="border border-black/10 rounded-xl p-4 shadow-sm hover:shadow-md transition"
              >
                <p className="text-sm text-gray-500 mb-1">
                  ORDER #{id} Status: {order[0].status}
                </p>
                {order.map(({ product_name }) => (
                  <p key={product_name} className="text-lg font-medium">
                    {product_name}
                  </p>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
