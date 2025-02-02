import { chatSession } from "@/scripts";

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  description: string;
}

// NewsAPI response interfaces
interface NewsAPIArticle {
  title: string;
  url: string;
  publishedAt: string;
  source: {
    name: string;
  };
  description: string;
}

interface NewsAPIResponse {
  status: string;
  articles: NewsAPIArticle[];
  code?: string;
  message?: string;
}

async function fetchFromNewsAPI(companyName: string, apiKey: string): Promise<NewsItem[]> {
  const today = new Date();
  // Get news from the last 3 days for more recent coverage
  const threeDaysAgo = new Date(today);
  threeDaysAgo.setDate(today.getDate() - 3);

  // First try top-headlines for most recent news
  const headlinesResponse = await fetch(
    `https://newsapi.org/v2/top-headlines?` +
    `q=${encodeURIComponent(companyName)}` +
    `&language=en` +
    `&sortBy=publishedAt` +
    `&pageSize=5` +
    `&apiKey=${apiKey}`
  );

  const headlinesData: NewsAPIResponse = await headlinesResponse.json();

  // If we got headlines, use them
  if (headlinesData.status === 'ok' && headlinesData.articles.length > 0) {
    return headlinesData.articles.map(article => ({
      title: article.title,
      link: article.url,
      pubDate: article.publishedAt,
      source: article.source.name,
      description: article.description || 'No description available'
    }));
  }

  // If no headlines, try everything endpoint with recent date filter
  const response = await fetch(
    `https://newsapi.org/v2/everything?` +
    `q=${encodeURIComponent(`${companyName} AND (announcement OR launch OR update OR news)`)}` +
    `&from=${threeDaysAgo.toISOString().split('T')[0]}` +
    `&to=${today.toISOString().split('T')[0]}` +
    `&sortBy=publishedAt` +
    `&language=en` +
    `&pageSize=5` +
    `&apiKey=${apiKey}`
  );

  const data: NewsAPIResponse = await response.json();

  if (data.status === 'error') {
    throw new Error(data.message || 'Failed to fetch news');
  }

  if (data.status === 'ok' && data.articles.length > 0) {
    return data.articles.map(article => ({
      title: article.title,
      link: article.url,
      pubDate: article.publishedAt,
      source: article.source.name,
      description: article.description || 'No description available'
    }));
  }

  throw new Error('No recent news found');
}

async function generateAINews(companyName: string): Promise<NewsItem[]> {
  const currentDate = new Date().toISOString();
  const fallbackPrompt = `
    Generate a JSON array of 5 VERY RECENT (today/yesterday) business news items about ${companyName}. Each news item should have:
    - A realistic title focusing on very recent developments, product launches, or business updates
    - A "#" for the link
    - "${currentDate}" for pubDate (representing today)
    - "AI Business News" for source
    - A detailed description focusing on current events and developments
    
    Response format must be exactly:
    {
      "news": [
        {
          "title": "Example title",
          "link": "#",
          "pubDate": "${currentDate}",
          "source": "AI Business News",
          "description": "Example description"
        }
      ]
    }

    Requirements for the news items:
    1. MUST generate exactly 5 news items
    2. Focus on different aspects: product launches, financial updates, partnerships, technology developments, market trends
    3. Each description should be 2-3 sentences long
    4. Use specific details and numbers where appropriate
    5. Make titles descriptive and newsworthy
    6. Ensure all information is recent (2025) and plausible
  `;

  try {
    const result = await chatSession.sendMessage(fallbackPrompt);
    
    // First try to parse the entire response
    try {
      const parsedResponse = JSON.parse(result.response.text());
      if (parsedResponse.news && Array.isArray(parsedResponse.news)) {
        return parsedResponse.news;
      }
    } catch (parseError) {
      console.error('Initial parse error:', parseError);
    }

    // If that fails, try to extract JSON using regex
    const jsonMatch = result.response.text().match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const extractedJson = JSON.parse(jsonMatch[0]);
        if (extractedJson.news && Array.isArray(extractedJson.news)) {
          return extractedJson.news;
        }
      } catch (extractError) {
        console.error('JSON extraction error:', extractError);
      }
    }

    // If all parsing attempts fail, return default news items
    return [
      {
        title: `${companyName} Announces Strategic Growth Initiatives`,
        link: '#',
        pubDate: currentDate,
        source: 'AI Business News',
        description: `${companyName} unveils comprehensive growth strategy for 2025. The company plans to expand its market presence and introduce innovative solutions.`
      },
      {
        title: `${companyName} Reports Strong Q1 2025 Performance`,
        link: '#',
        pubDate: currentDate,
        source: 'AI Business News',
        description: `Recent financial results show robust growth in key markets. The company exceeded analyst expectations with significant revenue increase.`
      },
      {
        title: `${companyName} Launches New Technology Platform`,
        link: '#',
        pubDate: currentDate,
        source: 'AI Business News',
        description: `A cutting-edge platform aimed at enhancing customer experience has been released. The new solution incorporates AI and machine learning capabilities.`
      },
      {
        title: `${companyName} Forms Strategic Partnership`,
        link: '#',
        pubDate: currentDate,
        source: 'AI Business News',
        description: `A new collaboration has been announced to strengthen market position. The partnership focuses on developing next-generation solutions.`
      },
      {
        title: `${companyName} Expands Global Operations`,
        link: '#',
        pubDate: currentDate,
        source: 'AI Business News',
        description: `The company announces significant expansion of its global footprint. New offices and development centers are being established in key markets.`
      }
    ];
  } catch (error) {
    console.error('Error generating AI news:', error);
    throw new Error('Failed to generate company news');
  }
}

export async function fetchCompanyNews(companyName: string): Promise<NewsItem[]> {
  try {
    const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    // Only attempt to fetch from NewsAPI if we're on localhost
    if (isLocalhost && API_KEY && API_KEY !== 'your_newsapi_key_here') {
      try {
        const newsApiResults = await fetchFromNewsAPI(companyName, API_KEY);
        if (newsApiResults.length > 0) {
          return newsApiResults;
        }
      } catch (apiError) {
        console.error('Error fetching from NewsAPI:', apiError);
      }
    }

    // If NewsAPI fails or we're not on localhost, use AI generation
    console.log('Using AI news generation');
    const aiNews = await generateAINews(companyName);
    
    // Ensure we have at least 5 news items
    if (aiNews.length < 5) {
      const currentDate = new Date().toISOString();
      const defaultNews = [
        {
          title: `${companyName} Announces Strategic Growth Initiatives`,
          link: '#',
          pubDate: currentDate,
          source: 'AI Business News',
          description: `${companyName} unveils comprehensive growth strategy for 2025. The company plans to expand its market presence and introduce innovative solutions.`
        },
        {
          title: `${companyName} Reports Strong Q1 2025 Performance`,
          link: '#',
          pubDate: currentDate,
          source: 'AI Business News',
          description: `Recent financial results show robust growth in key markets. The company exceeded analyst expectations with significant revenue increase.`
        },
        {
          title: `${companyName} Launches New Technology Platform`,
          link: '#',
          pubDate: currentDate,
          source: 'AI Business News',
          description: `A cutting-edge platform aimed at enhancing customer experience has been released. The new solution incorporates AI and machine learning capabilities.`
        },
        {
          title: `${companyName} Forms Strategic Partnership`,
          link: '#',
          pubDate: currentDate,
          source: 'AI Business News',
          description: `A new collaboration has been announced to strengthen market position. The partnership focuses on developing next-generation solutions.`
        },
        {
          title: `${companyName} Expands Global Operations`,
          link: '#',
          pubDate: currentDate,
          source: 'AI Business News',
          description: `The company announces significant expansion of its global footprint. New offices and development centers are being established in key markets.`
        }
      ];

      // Fill in missing news items with default ones
      while (aiNews.length < 5) {
        aiNews.push(defaultNews[aiNews.length]);
      }
    }

    return aiNews;
  } catch (error) {
    console.error("Error in fetchCompanyNews:", error);
    
    // Return default news items as absolute last resort
    const currentDate = new Date().toISOString();
    return [
      {
        title: `${companyName} Announces Strategic Growth Initiatives`,
        link: '#',
        pubDate: currentDate,
        source: 'AI Business News',
        description: `${companyName} unveils comprehensive growth strategy for 2025. The company plans to expand its market presence and introduce innovative solutions.`
      },
      {
        title: `${companyName} Reports Strong Q1 2025 Performance`,
        link: '#',
        pubDate: currentDate,
        source: 'AI Business News',
        description: `Recent financial results show robust growth in key markets. The company exceeded analyst expectations with significant revenue increase.`
      },
      {
        title: `${companyName} Launches New Technology Platform`,
        link: '#',
        pubDate: currentDate,
        source: 'AI Business News',
        description: `A cutting-edge platform aimed at enhancing customer experience has been released. The new solution incorporates AI and machine learning capabilities.`
      },
      {
        title: `${companyName} Forms Strategic Partnership`,
        link: '#',
        pubDate: currentDate,
        source: 'AI Business News',
        description: `A new collaboration has been announced to strengthen market position. The partnership focuses on developing next-generation solutions.`
      },
      {
        title: `${companyName} Expands Global Operations`,
        link: '#',
        pubDate: currentDate,
        source: 'AI Business News',
        description: `The company announces significant expansion of its global footprint. New offices and development centers are being established in key markets.`
      }
    ];
  }
} 