"use client";

import { FormEvent, useRef, useState } from "react";
import { useAuthContext } from "@/hooks/useAuthContext";
import styles from "./AuthModal.module.css";

export default function AuthModal() {
  const { authModal, closeAuthModal, login, register, message, clearMessage } =
    useAuthContext();
  const formRef = useRef<HTMLFormElement>(null);
  const [localMode, setLocalMode] = useState(authModal.mode);

  if (!authModal.isOpen) return null;

  const { mode } = authModal;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let success = false;

    const formMode = localMode || mode;
    if (formMode === "login") {
      success = await login({
        email: String(formData.get("email") || ""),
        password: String(formData.get("password") || ""),
      });
    } else {
      success = await register({
        username: String(formData.get("username") || ""),
        email: String(formData.get("email") || ""),
        password: String(formData.get("password") || ""),
      });
    }

    if (success) {
      formRef.current?.reset();
      closeAuthModal();
    }
  };

  const displayMode = localMode || mode;

  return (
    <div className={styles.overlay} onClick={closeAuthModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>{displayMode === "login" ? "Вход" : "Регистрация"}</h3>
          <button className={styles.closeBtn} onClick={closeAuthModal} type="button">
            ×
          </button>
        </div>

        <div className={styles.tabs}>
          <button
            className={displayMode === "login" ? styles.activeTab : styles.tab}
            type="button"
            onClick={() => { clearMessage(); setLocalMode("login"); }}
          >
            Вход
          </button>
          <button
            className={displayMode === "register" ? styles.activeTab : styles.tab}
            type="button"
            onClick={() => { clearMessage(); setLocalMode("register"); }}
          >
            Регистрация
          </button>
        </div>

        <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
          {displayMode === "login" ? (
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