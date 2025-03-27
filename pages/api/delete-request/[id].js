import { query } from "@/lib/db";
import { checkAdmin } from "@/lib/helpers";

export default async function handler(req, res) {
  const { id } = req.query; // Get request ID
  const token = req.headers.authorization?.split(" ")[1]; // Get the token from auth headers

  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const isAdmin = await checkAdmin(token);

  if (!isAdmin || !token) {
    return res.status(405).json({ error: "Unauthorized" });
  }

  try {
    const { rows } = await query(
      `
      DELETE FROM requests
      WHERE
        request_id = $1
      RETURNING
        request_id
    `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    return res.status(200).json({ message: "Request deletion successful" });
  } catch (err) {
    console.error("Error deleting request:", err);
    return res.status(500).json({ error: "Error deleting request" });
  }
}
