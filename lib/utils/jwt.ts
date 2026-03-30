import jwt from "jsonwebtoken";

// Проверка переменной окружения сразу при загрузке модуля
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

const JWT_SECRET = process.env.JWT_SECRET;

export const generateAccessToken = (userId: number, roles: string[]) => {
  return jwt.sign({ userId, roles }, JWT_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (userId: number) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
