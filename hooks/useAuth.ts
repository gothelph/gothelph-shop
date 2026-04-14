"use client";

import { useCallback, useEffect, useState } from "react";

type AuthState = {
  isAuth: boolean;
  loading: boolean;
  roles: string[];
  userId: number | null;
  message: string;
};

type LoginPayload = { email: string; password: string };
type RegisterPayload = { username: string; email: string; password: string };

type UseAuthResult = AuthState & {
  login: (payload: LoginPayload) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  logout: () => Promise<void>;
  clearMessage: () => void;
  accessToken: string;
};

const ACCESS_TOKEN_KEY = "gothelph_access_token";

const readStoredToken = () =>
  typeof window === "undefined"
    ? ""
    : window.localStorage.getItem(ACCESS_TOKEN_KEY) || "";

export function useAuth(): UseAuthResult {
  const [accessToken, setAccessToken] = useState<string>("");
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<string[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const syncSession = useCallback(async (token: string) => {
    if (!token) return setLoading(false);

    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("AUTH_SYNC_FAILED");
      const payload = (await res.json()) as {
        data?: { userId: number; roles: string[] };
      };
      setIsAuth(true);
      setRoles(payload.data?.roles || []);
      setUserId(payload.data?.userId || null);
    } catch {
      if (typeof window !== "undefined")
        window.localStorage.removeItem(ACCESS_TOKEN_KEY);
      setAccessToken("");
      setIsAuth(false);
      setRoles([]);
      setUserId(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = readStoredToken();
    setAccessToken(token);
    void syncSession(token);
  }, [syncSession]);

  const login = useCallback(
    async ({ email, password }: LoginPayload) => {
      setMessage("");
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = (await res.json()) as {
        data?: { accessToken: string; roles: string[] };
        error?: { message?: string };
      };
      if (!res.ok || !payload.data?.accessToken) {
        setMessage(payload.error?.message || "Ошибка авторизации.");
        return false;
      }
      if (typeof window !== "undefined")
        window.localStorage.setItem(ACCESS_TOKEN_KEY, payload.data.accessToken);
      setAccessToken(payload.data.accessToken);
      await syncSession(payload.data.accessToken);
      setMessage("Вы успешно вошли в аккаунт.");
      return true;
    },
    [syncSession],
  );

  const register = useCallback(
    async ({ username, email, password }: RegisterPayload) => {
      setMessage("");
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const payload = (await res.json()) as { error?: { message?: string } };
      if (!res.ok) {
        setMessage(payload.error?.message || "Ошибка регистрации.");
        return false;
      }
      setMessage("Регистрация успешна. Теперь войдите в аккаунт.");
      return true;
    },
    [],
  );

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    if (typeof window !== "undefined")
      window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    setAccessToken("");
    setIsAuth(false);
    setRoles([]);
    setUserId(null);
    setMessage("Вы вышли из аккаунта.");
  }, []);

  return {
    isAuth,
    loading,
    roles,
    userId,
    message,
    login,
    register,
    logout,
    clearMessage: () => setMessage(""),
    accessToken,
  };
}
