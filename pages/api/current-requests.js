import { Client } from "pg";

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  try {
    const result = await client.query(`
          SELECT *
          FROM requests
          WHERE request_status <> 'Complete'
          ORDER BY request_timestamp DESC;
        `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
