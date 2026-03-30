import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import pool from "@/lib/db";

export async function POST(req: Request) {
  const { username, email, password } = await req.json();

  if (!username || !email || !password) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const hash = await bcrypt.hash(password, 10);

  const client = await pool.connect();

  try {
    await client.query("BEGIN"); // старт транзакции

    // 1️⃣ Создаём пользователя
    const result = await client.query(
      `INSERT INTO gothelph.users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, email`,
      [username, email, hash],
    );
    const userId = result.rows[0].id;

    // 2️⃣ Добавляем роль "user"
    await client.query(
      `INSERT INTO gothelph.user_roles (user_id, role_id)
       SELECT $1, id FROM gothelph.roles WHERE name='user'`,
      [userId],
    );

    await client.query("COMMIT"); // подтверждаем транзакцию

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    await client.query("ROLLBACK"); // откатываем изменения при ошибке
    console.error("Registration error:", error); // логируем на сервер

    return NextResponse.json(
      { error: "Registration failed" }, // клиенту не отдаём сырые ошибки БД
      { status: 400 },
    );
  } finally {
    client.release(); // обязательно освобождаем соединение
  }
}
