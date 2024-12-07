export const search = async (query) => {
  const response = await fetch(
    `${process.env.TMDB_BASE_URL}/search/movie?api_key=${
      process.env.TMDB_API_KEY
    }&query=${encodeURIComponent(query)}`
  );
  const data = await response.json();
  return data.results;
};
