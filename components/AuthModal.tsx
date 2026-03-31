"use client";

import { FormEvent } from "react";

type Props = {
  isOpen: boolean;
  mode: "login" | "register";
  onClose: () => void;
  onSwitch: (mode: "login" | "register") => void;
  onLogin: (e: FormEvent) => void;
  onRegister: (e: FormEvent) => void;
  message: string;
};

export default function AuthModal({
  isOpen,
  mode,
  onClose,
  onSwitch,
  onLogin,
  onRegister,
  message,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6">
        <button onClick={onClose}>×</button>

        <button onClick={() => onSwitch("login")}>Вход</button>
        <button onClick={() => onSwitch("register")}>Регистрация</button>

        {mode === "login" ? (
          <form onSubmit={onLogin}>
            <input placeholder="email" />
            <input placeholder="password" />
            <button type="submit">Войти</button>
          </form>
        ) : (
          <form onSubmit={onRegister}>
            <input placeholder="username" />
            <input placeholder="email" />
            <input placeholder="password" />
            <button type="submit">Регистрация</button>
          </form>
        )}

        {message && <p>{message}</p>}
      </div>
    </div>
  );
}
