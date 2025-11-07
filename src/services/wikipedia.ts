export type WikipediaSummary = {
  title: string;
  extract: string;
  url: string;
};

const WIKI_API = 'https://en.wikipedia.org/api/rest_v1';

export async function fetchWikipediaSummary(title: string): Promise<WikipediaSummary | null> {
  try {
    const titleVariations = [
      title,
      `${title} (film)`,
      `${title} (movie)`,
    ];

    for (const titleVariation of titleVariations) {
      const encoded = encodeURIComponent(titleVariation);
      const exactResponse = await fetch(`${WIKI_API}/page/summary/${encoded}`, {
        headers: { 'Accept': 'application/json' },
      });

      if (exactResponse.ok) {
        const data = await exactResponse.json();
        if (data?.extract && data?.content_urls?.desktop?.page) {
          return {
            title: data.title,
            extract: data.extract,
            url: data.content_urls.desktop.page,
          };
        }
      }
    }

    const encoded = encodeURIComponent(title);
    const searchResponse = await fetch(
      `https://en.wikipedia.org/w/rest.php/v1/search/title?q=${encoded}&limit=1`,
      {
        headers: { 'Accept': 'application/json' },
      }
    );

    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      const hit = searchData?.pages?.[0];

      if (hit?.title) {
        const encodedTitle = encodeURIComponent(hit.title);
        const summaryResponse = await fetch(`${WIKI_API}/page/summary/${encodedTitle}`, {
          headers: { 'Accept': 'application/json' },
        });

        if (summaryResponse.ok) {
          const summaryData = await summaryResponse.json();
          if (summaryData?.extract && summaryData?.content_urls?.desktop?.page) {
            return {
              title: summaryData.title,
              extract: summaryData.extract,
              url: summaryData.content_urls.desktop.page,
            };
          }
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Error fetching Wikipedia summary:', error);
    return null;
  }
}

