import { Pool } from "pg";

const pool = new Pool({
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT || 5432,
});

export async function query(queryText, params) {
  const res = await pool.query(queryText, params);
  return res;
}
