"use client";

import { FormEvent } from "react";
import styles from "./AuthModal.module.css";

type Props = {
  isOpen: boolean;
  mode: "login" | "register";
  onClose: () => void;
  onSwitch: (mode: "login" | "register") => void;
  onLogin: (e: FormEvent<HTMLFormElement>) => void;
  onRegister: (e: FormEvent<HTMLFormElement>) => void;
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
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>{mode === "login" ? "Вход" : "Регистрация"}</h3>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Закрыть">
            ×
          </button>
        </div>

        <div className={styles.tabs}>
          <button
            className={mode === "login" ? styles.activeTab : styles.tab}
            onClick={() => onSwitch("login")}
            type="button"
          >
            Вход
          </button>
          <button
            className={mode === "register" ? styles.activeTab : styles.tab}
            onClick={() => onSwitch("register")}
            type="button"
          >
            Регистрация
          </button>
        </div>

        {mode === "login" ? (
          <form className={styles.form} onSubmit={onLogin}>
            <input className={styles.input} name="email" type="email" placeholder="email" required />
            <input
              className={styles.input}
              name="password"
              type="password"
              placeholder="password"
              required
            />
            <button className={styles.submit} type="submit">
              Войти
            </button>
          </form>
        ) : (
          <form className={styles.form} onSubmit={onRegister}>
            <input className={styles.input} name="username" placeholder="username" required minLength={3} />
            <input className={styles.input} name="email" type="email" placeholder="email" required />
            <input
              className={styles.input}
              name="password"
              type="password"
              placeholder="password"
              required
              minLength={6}
            />
            <button className={styles.submit} type="submit">
              Регистрация
            </button>
          </form>
        )}

        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
}
