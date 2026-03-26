import { Pool } from "pg";

const pool = new Pool({
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  port: Number(process.env.DB_PORT),
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
});

pool.on("connect", (client) => {
  client.query(`SET search_path TO ${process.env.DB_SCHEMA}, public`);
});

pool.on("error", (error) => {
  console.error(error);
  process.exit(-1);
});

export default pool;
