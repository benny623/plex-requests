let jellyfinCache = { items: [], lastUpdated: 0 };

export const loadJellyfinCache = async () => {
  try {
    const response = await fetch(
      `${process.env.JELLYFIN_BASE_URL}/Items?Recursive=true&IncludeItemTypes=Movie,Series&Fields=ProviderIds&api_key=${process.env.JELLYFIN_API_KEY}`
    );

    const data = await response.json();
    jellyfinCache = { items: data.Items || [], lastUpdated: Date.now() };
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const searchJellyfin = async (imdbId) => {
  if (Date.now() - jellyfinCache.lastUpdated > 10 * 60 * 1000) {
    await loadJellyfinCache();
  }

  return jellyfinCache.items.some((item) => item.ProviderIds?.Imdb === imdbId);
};
