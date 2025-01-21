import { query } from "@/lib/db";
import { checkAdmin } from "@/lib/helpers";

export default async function handler(req, res) {
  const { id } = req.query; // Get request ID
  const token = req.headers.authorization?.split(" ")[1]; // Get the token from auth headers

  const isAdmin = await checkAdmin(token);

  if (!isAdmin || !token) {
    return res.status(405).json({ error: "Unauthorized" });
  }

  try {
    const result = await query(
      `
          SELECT *
          FROM
            requests
          WHERE
            request_id = $1
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
