import { query } from "@/lib/db";

export default async function handler(req, res) {
  try {
    const result = await query(`
          SELECT *
          FROM requests
          WHERE request_status = 'Complete'
          ORDER BY request_timestamp DESC;
        `);

    if (result && result.rows && result.rows.length === 0) {
      return res.status(200).json([]);
    }

    res.json(result.rows || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
