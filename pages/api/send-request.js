import { query } from "@/lib/db";

export default async function handler(req, res) {
  console.log(`Request recieved ${JSON.stringify(req.body)}`);

  const { title, year, email, status, type } = req.body; // Get form and user data
  
  try {
    // Run SQL query to insert data
    const result = await query(
      `
          INSERT INTO requests(request_title, request_year, request_requestor, request_status, request_timestamp, request_type)
          VALUES($1, $2, $3, $4, NOW(), $5)
          RETURNING *
        `,
      [title, parseInt(year) || null, email, status, type]
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
