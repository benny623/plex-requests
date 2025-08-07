export default async function handler(req, res) {
  const getMoreData = async (imdbID) => {
    try {
      const response = await fetch(
        `${process.env.OMDB_BASE_URL}/?apikey=${
          process.env.OMDB_API_KEY
        }&i=${encodeURIComponent(imdbID)}`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error(error);
      return {};
    }
  };

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

    const data = await Promise.all(
      rawData.Search?.map(async (result) => {
        const moreData = await getMoreData(result.imdbID);

        return {
          id: moreData.imdbID,
          title: moreData.Title,
          year: moreData.Year.split("–")[0],
          rated: moreData.Rated,
          genre: moreData.Genre.split(",").map((tags) => tags.trim()),
          overview: moreData.Plot,
          poster: moreData.Poster,
          media_type: getMediaType(
            moreData.Type,
            moreData.Genre.split(",").map((tags) => tags.trim()),
            moreData.Country
          ),
          rating: moreData.imdbRating,
          ...(moreData.totalSeasons && {
            seasons: await getSeasonData(
              moreData.imdbID,
              parseInt(moreData.totalSeasons)
            ),
          }),
        };
      })
    );

    res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
