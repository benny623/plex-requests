export default function handler(req, res) {
  if (req.method === "POST") {
    const { token } = req.body;

    // Compare token with server-side env
    if (token === process.env.ADMIN_KEY) {
      return res.status(200).json({ isAdmin: true });
    }
    return res.status(403).json({ isAdmin: false });
  }

  res.status(405).json({ error: "Method not allowed." });
}
