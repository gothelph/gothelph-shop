"use client";

import { useState } from "react";
import { useAuthContext } from "@/hooks/useAuthContext";
import styles from "./profile.module.css";

export default function ProfileForm() {
  const { userName, accessToken } = useAuthContext();

  const [name, setName] = useState(userName || "");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await fetch("/api/user/update", {
      method: "POST",
      body: JSON.stringify({ name, email, phone }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };

  return (
    <div className={styles.page}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.title}>
          {userName ? userName.toUpperCase() : "PROFILE"}
        </h1>

        <input
          className={styles.input}
          placeholder="NAME"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className={styles.input}
          placeholder="EMAIL"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className={styles.input}
          placeholder="PHONE"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button className={styles.button} type="submit">
          SAVE
        </button>
      </form>
    </div>
  );
}
