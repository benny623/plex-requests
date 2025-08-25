import { query } from "@/lib/db";
import { checkAdmin } from "@/lib/helpers";

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(" ")[1];

  const isAdmin = await checkAdmin(token);

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let queryStr = `
      SELECT
        request_id, 
        request_title,
        request_type,
        request_status,
        request_note,
        request_optional,
        request_timestamp,
        request_modified_timestamp
      FROM requests
      WHERE
        request_status <> 'Complete'
      ORDER BY
        CASE
          WHEN request_status = 'In Progress' THEN 0
          ELSE 1
        END,
        request_timestamp DESC;
    `;

    // If the user is an admin, select all fields
    if (isAdmin && token) {
      queryStr = `
        SELECT
          *
        FROM requests
        WHERE
          request_status <> 'Complete'
        ORDER BY
          CASE
            WHEN request_status = 'In Progress' THEN 0
            ELSE 1
          END,
          request_timestamp DESC;
      `;
    }

    const result = await query(queryStr);

    return res.status(200).json(result.rows || []);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
