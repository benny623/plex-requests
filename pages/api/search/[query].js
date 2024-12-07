export default async function handler(req, res) {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const response = await fetch(
      `${
        process.env.TMDB_BASE_URL
      }/search/multi?include_adult=false&page=1&api_key=${
        process.env.TMDB_API_KEY
      }&query=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `Failed to fetch data: ${response.statusText}` });
    }

    const data = await response.json();

    res.status(200).json(data);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
