export default async function handler(req, res) {
  const capitalizeFirst = (val) => {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  };

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

    const rawData = await response.json();

    const data = rawData.results
      ?.map((i) => {
        if (i.media_type !== "person") {
          return {
            id: i.id,
            title: i.title || i.name,
            year: `${i.release_date || i.first_air_date}`.split("-")[0],
            overview: i.overview,
            poster: i.poster_path,
            media_type:
              i.genre_ids?.[0] === 16 && i.original_language === "ja"
                ? i.media_type === "movie"
                  ? "Anime " + capitalizeFirst(i.media_type)
                  : "Anime"
                : i.media_type === "movie"
                ? capitalizeFirst(i.media_type)
                : "TV Show",
            rating: Math.round(i.vote_average * 10) / 10,
          };
        }
        return null; // Filters out "person" items explicitly
      })
      .filter(Boolean); // Removes null values

    res.status(200).json(data);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
}
