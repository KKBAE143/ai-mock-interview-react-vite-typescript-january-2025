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
    
    Example format:
    [
      {
        "title": "Example title",
        "link": "#",
        "pubDate": "${currentDate}",
        "source": "AI Business News",
        "description": "Example description"
      }
    ]

    Focus on:
    1. ONLY very recent events (today/yesterday)
    2. Real business developments and market updates
    3. Current product launches or announcements
    4. Recent partnerships or business changes
    5. Market performance and business metrics
  `;

  try {
    const result = await chatSession.sendMessage(fallbackPrompt);
    console.log('AI Response:', result);

    if (typeof result === 'string') {
      try {
        // Try to parse the string response as JSON
        const parsedNews = JSON.parse(result);
        if (Array.isArray(parsedNews)) {
          return parsedNews;
        }
        // If it's an object with a news array
        if (parsedNews.news && Array.isArray(parsedNews.news)) {
          return parsedNews.news;
        }
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        // Try to extract JSON from the string using regex
        const jsonMatch = result.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const extractedJson = JSON.parse(jsonMatch[0]);
          if (Array.isArray(extractedJson)) {
            return extractedJson;
          }
        }
      }
    } else if (result && typeof result === 'object') {
      // If it's already a parsed object
      if (Array.isArray(result)) {
        return result;
      }
      if (result.news && Array.isArray(result.news)) {
        return result.news;
      }
    }

    throw new Error('Invalid AI response format');
  } catch (error) {
    console.error('Error generating AI news:', error);
    // Return a default news item as last resort
    return [{
      title: `Latest Updates from ${companyName}`,
      link: '#',
      pubDate: new Date().toISOString(),
      source: 'AI Business News',
      description: `Stay tuned for the latest updates from ${companyName}. Our AI system is currently processing recent developments and will provide detailed news shortly.`
    }];
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
    return generateAINews(companyName);
  } catch (error) {
    console.error("Error in fetchCompanyNews:", error);
    
    // Return a default news item as absolute last resort
    return [{
      title: `Latest Updates from ${companyName}`,
      link: '#',
      pubDate: new Date().toISOString(),
      source: 'AI Business News',
      description: `Stay tuned for the latest updates from ${companyName}. Our AI system is currently processing recent developments and will provide detailed news shortly.`
    }];
  }
} 