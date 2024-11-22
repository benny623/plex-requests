import { query } from "@/lib/db";

export default async function handler(req, res) {
  console.log(`Delete recieved ${JSON.stringify(req.query)}`);

  const { id } = req.query; // Get request ID

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

    res.status(200).json({ message: "Request deletion successful" });
  } catch (err) {
    console.error("Error deleting request:", err);
    res.status(500).json({ error: "Error deleting request" });
  }
}
