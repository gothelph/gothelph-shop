import bcrypt from "bcrypt";
import pool from "@/lib/db";
import { errorResponse, okResponse } from "@/lib/utils/api-response";
import { validateRegisterPayload } from "@/lib/utils/auth-validation";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = validateRegisterPayload(body);

  if (!parsed.valid) {
    return errorResponse({
      status: 400,
      code: "VALIDATION_ERROR",
      message: "Invalid registration payload",
      details: parsed.details,
    });
  }

  const { username, email, password } = parsed.data;

  const hash = await bcrypt.hash(password, 10);

  const client = await pool.connect();

  try {
    await client.query("BEGIN"); // старт транзакции

    // Создаём пользователя
    const result = await client.query(
      `INSERT INTO gothelph.users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, email`,
      [username, email, hash],
    );
    const userId = result.rows[0].id;

    // Добавляем роль "user"
    await client.query(
      `INSERT INTO gothelph.user_roles (user_id, role_id)
       SELECT $1, id FROM gothelph.roles WHERE name='user'`,
      [userId],
    );

    await client.query("COMMIT"); // подтверждаем транзакцию

    return okResponse(result.rows[0], 201);
  } catch (error: unknown) {
    await client.query("ROLLBACK");

    if (error instanceof Error) {
      console.error("Registration error:", error.message);

      return errorResponse({
        status: 500,
        code: "REGISTRATION_FAILED",
        message: error.message, // временно для отладки
      });
    }

    console.error("Unknown error:", error);

    return errorResponse({
      status: 500,
      code: "REGISTRATION_FAILED",
      message: "Unknown error",
    });
  } finally {
    client.release(); // обязательно освобождаем соединение
  }
}
