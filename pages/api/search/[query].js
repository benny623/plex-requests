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

  const levenshtein = (a, b) => {
    const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b[i - 1] === a[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[b.length][a.length];
  };

  const calcRelevance = (item, query) => {
    const stopWords = new Set([
      "the",
      "a",
      "an",
      "of",
      "and",
      "to",
      "in",
      "on",
      "for",
    ]);

    const queryWords = query
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word && !stopWords.has(word));

    const titleWords = item.title
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word && !stopWords.has(word));

    let matchScore = 0;
    for (let qWord of queryWords) {
      for (let j = 0; j < titleWords.length; j++) {
        const tWord = titleWords[j];

        if (tWord === qWord) {
          matchScore += 1;
          if (j === 0) matchScore += 0.5;
        } else if (tWord.startsWith(qWord) || qWord.startsWith(tWord)) {
          matchScore += 0.5;
          if (j === 0) matchScore += 0.25;
        } else {
          const dist = levenshtein(qWord, tWord);
          if (
            (qWord.length <= 4 && dist <= 1) ||
            (qWord.length > 4 && dist <= 2)
          ) {
            matchScore += 0.4;
            if (j === 0) matchScore += 0.2;
          }
        }
      }
    }

    const maxPossible = queryWords.length * 1.5;
    let score = maxPossible > 0 ? matchScore / maxPossible : 0;

    const currentYear = new Date().getFullYear();
    const yearNum = parseInt(item.year, 10);

    if (!isNaN(yearNum) && currentYear - yearNum <= 3) {
      const recencyBoost = ((3 - (currentYear - yearNum)) / 3) * 0.3;
      score += recencyBoost;
    }

    return score;
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
          votes: parseInt(moreData.imdbVotes.replace(/,/g, "")) || 0,
        };
      })
    );

    res.status(200).json(
      detailedResults.sort((a, b) => {
        const scoreA = calcRelevance(a, query);
        const scoreB = calcRelevance(b, query);

        if (scoreB === scoreA) {
          return b.votes - a.votes;
        }
        return scoreB - scoreA;
      })
    );
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
