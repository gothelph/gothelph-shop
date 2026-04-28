import { Pool } from "pg";

const pool = new Pool({
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  port: Number(process.env.DB_PORT),
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
});

const SCHEMA_REGEX = /^[a-z_][a-z0-9_]*$/;

if (!process.env.DB_SCHEMA || !SCHEMA_REGEX.test(process.env.DB_SCHEMA)) {
  throw new Error("Invalid DB_SCHEMA environment variable");
}

const DB_SCHEMA = process.env.DB_SCHEMA;

pool.on("connect", (client) => {
  // безопасная подстановка после проверки
  client.query(`SET search_path TO ${DB_SCHEMA}, public`).catch((err) => {
    console.error("Failed to set search_path:", err);
    process.exit(-1);
  });
});

pool.on("error", (error) => {
  console.error(error);
  process.exit(-1);
});

export default pool;
