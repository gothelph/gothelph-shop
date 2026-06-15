"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/hooks/useAuthContext";

type User = {
  id: number;
  email: string;
  roles: string[];
};

export default function AdminPanel() {
  const router = useRouter();
  const { isAuth, roles, accessToken } = useAuthContext();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const payload = await res.json();

      if (!res.ok) {
        throw new Error(payload?.error?.message || "Failed to load users");
      }

      setUsers(payload.data || []);
    } catch (e: any) {
      setError(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (!isAuth || !roles.includes("admin")) {
      router.push("/");
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, [fetchUsers, isAuth, roles, router]);

  const handleRemoveUser = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const payload = await res.json();

      if (!res.ok) {
        throw new Error(payload?.error?.message || "Failed to remove user");
      }

      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (e: any) {
      setError(e.message || "Unknown error");
    }
  };

  const handleUpdateRole = async (id: number, role: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });
      const payload = await res.json();

      if (!res.ok) {
        throw new Error(payload?.error?.message || "Failed to update role");
      }

      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, roles: [role] } : user,
        ),
      );
    } catch (e: any) {
      setError(e.message || "Unknown error");
    }
  };

  const roleColor = (roles: string[]) => {
    return roles.includes("admin")
      ? "text-purple-600 bg-purple-50"
      : "text-gray-600 bg-gray-100";
  };

  if (loading) {
    return <div className="p-6">Loading users...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Error: {error}
        <div className="mt-2">
          <Button onClick={fetchUsers}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Пользователи</h2>

      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="border rounded-xl p-4 bg-white shadow-sm flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{user.email}</p>

              <span
                className={`inline-block mt-1 text-xs px-2 py-1 rounded-full ${roleColor(
                  user.roles,
                )}`}
              >
                {user.roles.join(", ") || "no roles"}
              </span>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => router.push(`/admin/users/${user.id}/orders`)}
              >
                Заказы
              </Button>

              <select
                className="border rounded-md px-2 py-1 text-sm"
                value={user.roles[0]}
                onChange={(e) => handleUpdateRole(user.id, e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              <Button
                className="text-sm px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600"
                onClick={() => handleRemoveUser(user.id)}
              >
                Удалить
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
