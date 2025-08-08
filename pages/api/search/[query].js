export default async function handler(req, res) {
  const getMediaType = (type, genre, country) => {
    if (
      type === "series" &&
      genre.some((tag) => tag === "Animation") &&
      country === "Japan"
    ) {
      return "Anime";
    }

    if (
      type === "movie" &&
      genre.some((tag) => tag === "Animation") &&
      country === "Japan"
    ) {
      return "Anime Movie";
    }

    if (type === "series") {
      return "TV Show";
    }

    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getSeasonData = async (imdbID, count) => {
    const results = [];

    for (let i = 1; i <= count; i++) {
      try {
        const response = await fetch(
          `${process.env.OMDB_BASE_URL}/?apikey=${
            process.env.OMDB_API_KEY
          }&i=${encodeURIComponent(imdbID)}&Season=${i}`
        );

        if (!response.ok) {
          throw new Error(`Error fetching Season ${i}: ${response.statusText}`);
        }

        const rawData = await response.json();

        results.push({
          id: parseInt(rawData.Season),
          name: `Season ${rawData.Season}`,
          year: rawData.Episodes[0].Released.split("-")[0],
          episode_count: rawData.Episodes.length,
        });
      } catch (error) {
        console.error(error);
        results.push({ error: true, season: i });
      }
    }

    return results;
  };

  const checkImage = async (url) => {
    try {
      const res = await fetch(url, { method: "HEAD" });
      return res.ok && res.headers.get("content-type")?.startsWith("image/");
    } catch {
      return false;
    }
  };

  const calcRelevance = (item) => {
    const currentYear = new Date().getFullYear();
    const recencyScore = Math.max(0, 1 - (currentYear - item.year) / 30);
    const ratingScore = item.rating / 10;

    return recencyScore * 0.7 + ratingScore * 0.3;
  };

  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const response = await fetch(
      `${process.env.OMDB_BASE_URL}/?apikey=${
        process.env.OMDB_API_KEY
      }&s=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `Failed to fetch data: ${response.statusText}` });
    }

    const rawData = await response.json();

    if (!rawData.Search) return [];

    const detailedResults = await Promise.all(
      rawData.Search.map(async (result) => {
        const moreDataResponse = await fetch(
          `${process.env.OMDB_BASE_URL}/?apikey=${
            process.env.OMDB_API_KEY
          }&i=${encodeURIComponent(result.imdbID)}`
        );

        const moreData = await moreDataResponse.json();

        return {
          id: moreData.imdbID,
          title: moreData.Title,
          year: parseInt(moreData.Year.split("–")[0]) || 0,
          rated: moreData.Rated,
          ...(moreData.Rated === "N/A"
            ? { rated: "NR" }
            : { rated: moreData.Rated }),
          genre: moreData.Genre.split(",").map((tags) => tags.trim()),
          ...(moreData.Plot !== "N/A" && { overview: moreData.Plot }),
          ...(moreData.Poster !== "N/A" &&
            (await checkImage(moreData.Poster)) && { poster: moreData.Poster }),
          media_type: getMediaType(
            moreData.Type,
            moreData.Genre.split(",").map((tags) => tags.trim()),
            moreData.Country
          ),
          rating: parseFloat(moreData.imdbRating) || 0,
          ...(moreData.totalSeasons && {
            seasons: await getSeasonData(
              moreData.imdbID,
              parseInt(moreData.totalSeasons)
            ),
          }),
        };
      })
    );

    res
      .status(200)
      .json(
        detailedResults.sort((a, b) => calcRelevance(b) - calcRelevance(a))
      );
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
