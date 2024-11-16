import { query } from "@/lib/db";

export default async function handler(req, res) {
  console.log(`Update recieved ${JSON.stringify(req.body)}`);

  const { id } = req.query; // Get request ID
  const { status } = req.body; // Get updated data

  try {
    const queryText = `
      UPDATE requests
      SET request_status = $1
      WHERE request_id = $2
      RETURNING *
    `;

    const { rows } = await query(queryText, [status, id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    res
      .status(200)
      .json({ message: "Request update successful", request: rows[0] });
  } catch (err) {
    console.error("Error updating request:", err);
    res.status(500).json({ error: "Error updating request" });
  }
}
