import { query } from "@/lib/db";
import { checkAdmin } from "@/lib/helpers";

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(" ")[1];

  const isAdmin = await checkAdmin(token);

  if (!isAdmin || !token) {
    try {
      const result = await query(`
          SELECT 
            request_id, 
            request_title, 
            request_type, 
            request_status,
            request_note,
            request_optional,
            request_timestamp
          FROM requests
          WHERE
            request_status = 'Complete'
          ORDER BY
            request_timestamp DESC;
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

  try {
    const result = await query(`
          SELECT 
            *
          FROM requests
          WHERE
            request_status = 'Complete'
          ORDER BY
            request_timestamp DESC;
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
