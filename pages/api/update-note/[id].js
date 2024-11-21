import { query } from "@/lib/db";

export default async function handler(req, res) {
  console.log(`Update recieved ${JSON.stringify(req.body)}`);

  const { id } = req.query; // Get request ID
  const { note } = req.body; // Get updated data

  try {
    const { rows } = await query(
      `
      UPDATE
        requests
      SET
        request_note = $1
      WHERE
        request_id = $2
      RETURNING
        *
    `,
      [note, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({ message: "Request update successful" });
  } catch (err) {
    console.error("Error updating request:", err);
    res.status(500).json({ error: "Error updating request" });
  }
}
