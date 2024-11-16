const express = require("express");
const next = require("next");
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_NAME,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT || 5432,
});

// Next.js server setup
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Middleware to parse JSON bodies
  server.use(express.json());

  // Get all requests
  server.get("/api/requests", async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT *
        FROM requests r
        ORDER BY request_timestamp DESC;
      `);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Get only New/In Progress requests
  server.get("/api/current-requests", async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT *
        FROM requests
        WHERE request_status <> 'Complete'
        ORDER BY request_timestamp DESC;
      `);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Get completed requests
  server.get("/api/completed-requests", async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT *
        FROM requests
        WHERE request_status = 'Complete'
        ORDER BY request_timestamp DESC;
      `);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Add new request
  server.post("/api/send", async (req, res) => {
    console.log(`Request recieved ${JSON.stringify(req.body)}`);
    const { title, year, requestor, status, type } = req.body; // Get form and user data

    try {
      // Run SQL query to insert data
      const result = await pool.query(
        `
        INSERT INTO requests(request_title, request_year, request_requestor, request_status, request_timestamp, request_type)
        VALUES($1, $2, $3, $4, NOW(), $5)
        RETURNING *
      `,
        [title, parseInt(year) || null, requestor, status, type]
      );

      // Send back the inserted data
      res.status(201).json({
        message: "POST success",
        item: result.rows[0],
      });
    } catch (err) {
      console.error("POST failure:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Update request via ID
  server.put("/api/update/:id", async (req, res) => {
    console.log(`Update recieved ${JSON.stringify(req.body)}`);

    const { id } = req.params;
    const { status } = req.body; // Get updated data

    try {
      const query = `
      UPDATE requests
      SET request_status = $1
      WHERE request_id = $2
      RETURNING *
    `;

      const { rows } = await pool.query(query, [status, id]);

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
  });

  // Default Next.js request handler
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  // Start the server
  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});
