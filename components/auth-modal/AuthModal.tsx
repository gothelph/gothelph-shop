"use client";

import { FormEvent, useRef } from "react";
import styles from "./AuthModal.module.css";

type Props = {
  isOpen: boolean;
  mode: "login" | "register";
  onClose: () => void;
  onSwitch: (mode: "login" | "register") => void;
  onLogin: (e: FormEvent<HTMLFormElement>) => Promise<boolean>;
  onRegister: (e: FormEvent<HTMLFormElement>) => Promise<boolean>;
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
  const formRef = useRef<HTMLFormElement>(null);
  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let success = false;
    if (mode === "login") success = await onLogin(e);
    else success = await onRegister(e);
    if (success) formRef.current?.reset();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>{mode === "login" ? "Вход" : "Регистрация"}</h3>
          <button className={styles.closeBtn} onClick={onClose} type="button">
            ×
          </button>
        </div>

        <div className={styles.tabs}>
          <button
            className={mode === "login" ? styles.activeTab : styles.tab}
            type="button"
            onClick={() => onSwitch("login")}
          >
            Вход
          </button>
          <button
            className={mode === "register" ? styles.activeTab : styles.tab}
            type="button"
            onClick={() => onSwitch("register")}
          >
            Регистрация
          </button>
        </div>

        <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
          {mode === "login" ? (
            <>
              <input
                className={styles.input}
                name="email"
                type="email"
                placeholder="email"
                required
              />
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
            </>
          ) : (
            <>
              <input
                className={styles.input}
                name="username"
                placeholder="username"
                required
                minLength={3}
              />
              <input
                className={styles.input}
                name="email"
                type="email"
                placeholder="email"
                required
              />
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
            </>
          )}
        </form>

        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
}
