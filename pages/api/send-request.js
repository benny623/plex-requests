import { query } from "@/lib/db";

export default async function handler(req, res) {
  const { title, email, type, optional } = req.body; // Get form and user data

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Run SQL query to insert data
    const result = await query(
      `
          INSERT INTO
            requests (request_title, request_requestor, request_status, request_type, request_optional, request_timestamp, request_modified_timestamp)
          VALUES
            ($1, $2, $3, $4, $5, NOW(), NOW())
          RETURNING
            *
        `,
      [title, email, "New", type, optional]
    );
    // Send back the inserted data
    res.status(201).json({
      message: "POST success",
      item: result.rows,
    });
  } catch (err) {
    console.error("POST failure:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
