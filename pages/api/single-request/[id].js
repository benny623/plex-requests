import { query } from "@/lib/db";

export default async function handler(req, res) {
  const { id } = req.query; // Get request ID
  const token = req.headers.authorization?.split(" ")[1]; // Get the token from auth headers

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.BASE_URL;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  const checkAdmin = async (token) => {
    try {
      const res = await fetch(`${baseUrl}/api/check-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();

      console.log(`
        isAdmin? ${data.isAdmin}
        token: ${token}
        `);
      return data.isAdmin || false;
    } catch (err) {
      console.error("Error validating admin:", err);
      return false;
    }
  };

  const isAdmin = await checkAdmin(token);

  if (!isAdmin) {
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
