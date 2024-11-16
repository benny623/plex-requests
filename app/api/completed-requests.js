import { query } from "@/lib/db";

export default async function handler(req, res) {
  try {
    const result = await query(`
          SELECT *
          FROM requests
          WHERE request_status = 'Complete'
          ORDER BY request_timestamp DESC;
        `);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
