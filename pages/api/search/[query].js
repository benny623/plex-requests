import { loadJellyfinCache, searchJellyfin } from "@/lib/jellyfinCache";

export default async function handler(req, res) {
  const getMediaType = (type, genre, country) => {
    if (type !== "series" || type !== "movie") {
    }

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

  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    if (!global.jellyfinCacheLoaded) {
      await loadJellyfinCache();
      global.jellyfinCacheLoaded = true;
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

    if (rawData.Response === "False") {
      return res.status(404).json({ error: rawData.Error });
    }

    if (!rawData.Search) return [];

    const detailedResults = await Promise.all(
      rawData.Search.filter((item) => item.Type !== "game").map(
        async (result) => {
          const moreDataResponse = await fetch(
            `${process.env.OMDB_BASE_URL}/?apikey=${
              process.env.OMDB_API_KEY
            }&i=${encodeURIComponent(result.imdbID)}`
          );

          const moreData = await moreDataResponse.json();

          // Pre-define media title, year and type so we can use for the onServer check
          const title = moreData.Title;
          const year = parseInt(moreData.Year.split("–")[0]) || 0;
          const media_type = getMediaType(
            moreData.Type,
            moreData.Genre.split(",").map((tags) => tags.trim()),
            moreData.Country
          );

          return {
            id: moreData.imdbID,
            title,
            year,
            ...(moreData.Rated === "N/A"
              ? { rated: "NR" }
              : { rated: moreData.Rated }),
            genre: moreData.Genre.split(",").map((tags) => tags.trim()),
            ...(moreData.Plot !== "N/A" && { overview: moreData.Plot }),
            ...(moreData.Poster !== "N/A" &&
              (await checkImage(moreData.Poster)) && {
                poster: moreData.Poster,
              }),
            media_type,
            rating: parseFloat(moreData.imdbRating) || 0,
            ...(moreData.totalSeasons && {
              seasons: await getSeasonData(
                moreData.imdbID,
                parseInt(moreData.totalSeasons)
              ),
            }),
            votes: parseInt(moreData.imdbVotes.replace(/,/g, "")) || 0,
            onServer: await searchJellyfin(moreData.imdbID),
          };
        }
      )
    );

    res.status(200).json(detailedResults);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
