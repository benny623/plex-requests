import { query } from "@/lib/db";
import { checkAdmin } from "@/lib/helpers";

export default async function handler(req, res) {
  const { id } = req.query; // Get request ID
  const { status } = req.body; // Get updated data
  const token = req.headers.authorization?.split(" ")[1]; // Get the token from auth headers

  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const isAdmin = await checkAdmin(token);

  if (!isAdmin || !token) {
    return res.status(405).json({ error: "Unauthorized" });
  }

  try {
    const { rows } = await query(
      `
        UPDATE
          requests
        SET
          request_status = $1
        WHERE
          request_id = $2
        RETURNING
          *
      `,
      [status, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    return res.status(200).json({ message: "Request update successful" });
  } catch (err) {
    console.error("Error updating request:", err);
    return res.status(500).json({ error: "Error updating request" });
  }
}
