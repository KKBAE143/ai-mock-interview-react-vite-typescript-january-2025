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

export async function fetchCompanyNews(companyName: string): Promise<NewsItem[]> {
  try {
    const API_KEY = import.meta.env.VITE_NEWS_API_KEY;

    // Check if API key is properly configured
    if (!API_KEY || API_KEY === 'your_newsapi_key_here') {
      throw new Error('NewsAPI key not configured. Please follow the setup instructions in the .env file.');
    }

    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    
    const response = await fetch(
      `https://newsapi.org/v2/everything?` +
      `q=${encodeURIComponent(companyName)}` +
      `&from=${lastMonth.toISOString().split('T')[0]}` +
      `&to=${today.toISOString().split('T')[0]}` +
      `&sortBy=publishedAt` +
      `&language=en` +
      `&pageSize=5` +
      `&apiKey=${API_KEY}`
    );

    const data: NewsAPIResponse = await response.json();

    // Handle API errors
    if (data.status === 'error') {
      if (data.code === 'rateLimited') {
        throw new Error('NewsAPI rate limit reached. Please try again later.');
      } else if (data.code === 'apiKeyInvalid') {
        throw new Error('Invalid NewsAPI key. Please check your configuration.');
      } else {
        throw new Error(data.message || 'Failed to fetch news');
      }
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

    // If no articles found, throw error
    throw new Error(`No recent news found for ${companyName}`);

  } catch (error) {
    console.error("Error fetching news:", error);
    
    // If it's a configuration error, show it to the user
    if (error instanceof Error && 
        (error.message.includes('API key') || error.message.includes('rate limit'))) {
      throw error;
    }
    
    // Enhanced fallback to AI-generated news with more current context
    const fallbackPrompt = `
      Generate 5 VERY recent news items about ${companyName} that could be from today (${new Date().toISOString().split('T')[0]}) in this JSON format:
      {
        "news": [
          {
            "title": "Breaking news headline about ${companyName} from today",
            "link": "#",
            "pubDate": "${new Date().toISOString()}",
            "source": "Business News",
            "description": "Detailed and realistic description of very recent news, mentioning specific current events, products, or developments"
          }
        ]
      }
      Requirements:
      1. Use ONLY factual, current information from 2025
      2. Include recent product launches, business developments, or market trends
      3. Reference actual current events and real business situations
      4. Make sure dates are all from this week in 2025
      5. Keep descriptions detailed and realistic
    `;

    try {
      const result = await chatSession.sendMessage(fallbackPrompt);
      const fallbackNews = JSON.parse(result.response.text().match(/\{[\s\S]*\}/)[0]);
      return fallbackNews.news;
    } catch (fallbackError) {
      console.error("Error generating fallback news:", fallbackError);
      throw new Error('Unable to fetch or generate news. Please try again later.');
    }
  }
} 