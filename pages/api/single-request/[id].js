import { query } from "@/lib/db";

export default async function handler(req, res) {
  const { id } = req.query; // Get request ID

  try {
    const result = await query(
      `
        SELECT *
        FROM requests
        WHERE request_id = $1
    `,
      [id]
    );

    if (result && result.rows && result.rows.length === 0) {
      return res.status(200).json([]);
    }

    res.json(result.rows || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
