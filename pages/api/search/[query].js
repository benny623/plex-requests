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

  const getMPAA = async (id, year) => {
    try {
      const response = await fetch(
        `${process.env.TMDB_BASE_URL}/movie/${id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=release_dates`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();

      // Filter data to only include US results
      const releaseDates = data?.release_dates?.results || [];
      const usResults = releaseDates.find((i) => i.iso_3166_1 === "US");

      if (!usResults || !usResults.release_dates) {
        return null;
      }

      // Grab the rating (based off of the release year)
      const filteredData = usResults.release_dates.find(
        (i) => i.release_date?.slice(0, 10) === year && i.certification
      )?.certification;

      // Send MPAA rating
      return filteredData || null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const getTVCR = async (id) => {
    try {
      const response = await fetch(
        `${process.env.TMDB_BASE_URL}/tv/${id}/content_ratings?api_key=${process.env.TMDB_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();

      // Filter data to only include US results
      const results = data?.results || [];
      const usResult = results.find((i) => i.iso_31661_1 === "US");

      // Send the rating
      return usResult?.rating || null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const getMediaType = (type, isAnime, isSeasonal) => {
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
        // Filter out People and media that have a vote count less than 10
        if (i.media_type !== "person" && i.vote_count >= 10) {
          const keywords = await getKeywords(i.media_type, i.id); // Keyword data
          const seasons = i.media_type === "tv" && (await getSeasons(i.id)); // Season count data
          const mpaa =
            i.media_type === "movie"
              ? await getMPAA(i.id, i.release_date)
              : null; // Get the MPAA rating
          const tvcr = i.media_type === "tv" && (await getTVCR(i.id));

          // Check if it's an Anime
          const isAnime = keywords?.some((keyword) => keyword.id === 210024);

          // Check if it's a Seasonal Movie
          const seasonalKeywordIds = [65, 207317, 336879, 323756, 3335, 4543]; // May need to add more to this or break out into own .json file
          const isSeasonal = keywords?.some((keyword) =>
            seasonalKeywordIds.includes(keyword.id)
          );

          return {
            id: i.id,
            keywords: keywords || [],
            title: i.title || i.name,
            year: `${i.release_date || i.first_air_date}`.split("-")[0],
            overview: i.overview,
            poster: i.poster_path,
            media_type: getMediaType(i.media_type, isAnime, isSeasonal),
            rating: Math.round(i.vote_average * 10) / 10,
            ...(seasons?.length && {
              seasons: seasons
                .filter((season) => !!season.air_date)
                .map(({ id, air_date, episode_count, name, poster_path }) => ({
                  id,
                  air_date,
                  episode_count,
                  name,
                  poster_path,
                })),
            }),
            ...(mpaa && { mpaa: mpaa }),
            ...(tvcr && { tvcr: tvcr }),
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
