export default async function handler(req, res) {
  const getKeywords = async (type, id) => {
    try {
      const response = await fetch(
        `${process.env.TMDB_BASE_URL}/${type}/${id}/keywords?api_key=${process.env.TMDB_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();

      // Send keyword data
      return data.results || data.keywords;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const getSeasons = async (id) => {
    try {
      const response = await fetch(
        `${process.env.TMDB_BASE_URL}/tv/${id}?api_key=${process.env.TMDB_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();

      // Send season data
      return data.seasons || [];
    } catch (err) {
      console.error(err);
      return [];
    }
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

    // Parse raw data to json
    const rawData = await response.json();

    const data = await Promise.all(
      rawData.results?.map(async (i) => {
        // Filter out People and items that have a vote count less than 10
        if (i.media_type !== "person" && i.vote_count >= 10) {
          const keywords = await getKeywords(i.media_type, i.id); // Keyword data
          const seasons = i.media_type === "tv" ? await getSeasons(i.id) : null; // Season count data

          // Check if it's an Anime
          const isAnime = keywords?.some((keyword) => keyword.id === 210024);

          // Check if it's a Seasonal Movie
          const isSeasonal = keywords?.some((keyword) => keyword.id === 65);

          const getMediaType = (type) => {
            if (type === "tv") {
              return isAnime ? "Anime" : "TV Show";
            }

            // Capitalize type
            const baseType =
              String(type).charAt(0).toUpperCase() + String(type).slice(1);

            if (isAnime) {
              return `Anime ${baseType}`;
            }

            return isSeasonal ? `Seasonal ${baseType}` : baseType;
          };

          return {
            id: i.id,
            keywords: keywords || [],
            title: i.title || i.name,
            year: `${i.release_date || i.first_air_date}`.split("-")[0],
            overview: i.overview,
            poster: i.poster_path,
            media_type: getMediaType(i.media_type),
            rating: Math.round(i.vote_average * 10) / 10,
            ...(seasons && { seasons: seasons }),
          };
        }
        return null; // Filters out "person" items explicitly
      })
    );

    const filteredData = data.filter(Boolean);

    res.status(200).json(filteredData);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
}
