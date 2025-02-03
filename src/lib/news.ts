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

type NewsAPIResponse = {
  status: string;
  articles: NewsAPIArticle[];
  code?: string;
  message?: string;
}

async function fetchFromNewsAPI(companyName: string, apiKey: string): Promise<NewsItem[]> {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  // Create company keywords to filter out irrelevant matches
  const companyKeywords = companyName.split(' ').filter(word => 
    // Filter out common words that might cause false matches
    !['tcs', 'ltd', 'limited', 'corp', 'corporation', 'inc', 'incorporated'].includes(word.toLowerCase())
  ).join(' ');

  // More targeted search query
  const searchQuery = `("${companyName}" OR "${companyKeywords}") AND (announcement OR earnings OR acquisition OR launch OR partnership OR investment OR expansion OR quarterly OR financial OR product OR revenue OR growth OR market OR development)`;

  // Use domains of reputable business news sources
  const domains = 'reuters.com,bloomberg.com,ft.com,wsj.com,cnbc.com,businessinsider.com,techcrunch.com,forbes.com,economictimes.indiatimes.com,livemint.com,moneycontrol.com,ndtv.com,business-standard.com,financialexpress.com';

  // Try both top-headlines and everything endpoints with increased page size
  const [headlinesResponse, everythingResponse] = await Promise.all([
    fetch(
      `https://newsapi.org/v2/top-headlines?` +
      `q=${encodeURIComponent(`"${companyKeywords}"`)}` +
      `&language=en` +
      `&sortBy=publishedAt` +
      `&pageSize=25` +
      `&apiKey=${apiKey}`
    ),
    fetch(
      `https://newsapi.org/v2/everything?` +
      `q=${encodeURIComponent(searchQuery)}` +
      `&domains=${domains}` +
      `&from=${thirtyDaysAgo.toISOString().split('T')[0]}` +
      `&to=${today.toISOString().split('T')[0]}` +
      `&sortBy=relevancy` +
      `&language=en` +
      `&pageSize=25` +
      `&apiKey=${apiKey}`
    )
  ]);

  const [headlinesData, everythingData] = await Promise.all([
    headlinesResponse.json(),
    everythingResponse.json()
  ] as [Promise<NewsAPIResponse>, Promise<NewsAPIResponse>]);

  // Handle API errors
  if (headlinesData.status === 'error' && everythingData.status === 'error') {
    throw new Error(headlinesData.message || everythingData.message || 'Failed to fetch news');
  }

  // Combine and filter articles with stricter relevance checks
  const allArticles = [
    ...(headlinesData.status === 'ok' ? headlinesData.articles : []),
    ...(everythingData.status === 'ok' ? everythingData.articles : [])
  ].filter(article => {
    const titleLower = article.title?.toLowerCase() || '';
    const descLower = article.description?.toLowerCase() || '';
    const companyLower = companyName.toLowerCase();
    const keywordsLower = companyKeywords.toLowerCase();

    // Check if the article is specifically about the company
    const isRelevant = (
      // Must contain company name or keywords in title or first part of description
      (titleLower.includes(companyLower) || titleLower.includes(keywordsLower) ||
       (descLower.includes(companyLower) || descLower.includes(keywordsLower))) &&
      // Must have substantial content
      article.description?.length > 100 &&
      // Avoid articles that just mention the company in passing
      (titleLower.includes(companyLower) || 
       descLower.indexOf(companyLower) < 100 || 
       descLower.indexOf(keywordsLower) < 100)
    );

    return isRelevant;
  });

  // Remove duplicates with improved similarity detection
  const uniqueArticles = allArticles.filter((article, index, self) => {
    const titleWords = article.title.toLowerCase().split(' ');
    return index === self.findIndex(a => {
      const otherTitleWords = a.title.toLowerCase().split(' ');
      const commonWords = titleWords.filter(word => otherTitleWords.includes(word));
      return commonWords.length > titleWords.length * 0.7; // 70% similarity threshold
    });
  });

  if (uniqueArticles.length > 0) {
    return uniqueArticles
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 10) // Increased from 5 to 10 news items
      .map(article => ({
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
    Generate 5 HIGHLY SPECIFIC and REALISTIC news items about ${companyName} from the last 48 hours.
    Focus on actual recent developments, product launches, partnerships, or market activities.
    
    Requirements:
    1. Each news item must be SPECIFIC to ${companyName}'s actual business activities and industry
    2. Include real product names, technologies, and business areas where known
    3. Reference actual market conditions and industry trends
    4. Use precise details, numbers, and dates from 2025
    5. Vary the news types: product launches, financial updates, partnerships, industry innovations
    6. Make descriptions detailed and grounded in the company's real operations
    
    Return in this exact JSON format:
    {
      "news": [
        {
          "title": "Specific and realistic title",
          "link": "#",
          "pubDate": "${currentDate}",
          "source": "AI Business News",
          "description": "Detailed, factual description"
        }
      ]
    }
  `;

  const result = await chatSession.sendMessage(fallbackPrompt);
  
  try {
    // Try parsing the response as JSON first
    const parsedResponse = JSON.parse(result.response.text());
    if (parsedResponse.news && Array.isArray(parsedResponse.news)) {
      return parsedResponse.news;
    }
  } catch {
    // If direct parsing fails, try extracting JSON using regex
    const jsonMatch = result.response.text().match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const extractedJson = JSON.parse(jsonMatch[0]);
        if (extractedJson.news && Array.isArray(extractedJson.news)) {
          return extractedJson.news;
        }
      } catch (error) {
        console.error('Failed to extract JSON from AI response:', error);
      }
    }
  }
  
  throw new Error('Failed to generate valid news data');
}

export async function fetchCompanyNews(companyName: string): Promise<NewsItem[]> {
  const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
  
  try {
    // Always try NewsAPI first if key is available
    if (API_KEY && API_KEY !== 'your_newsapi_key_here') {
      try {
        const newsApiResults = await fetchFromNewsAPI(companyName, API_KEY);
        if (newsApiResults.length > 0) {
          return newsApiResults;
        }
      } catch (apiError) {
        console.error('NewsAPI error:', apiError);
        // Continue to AI generation on API error
      }
    }

    // Use AI generation as backup
    console.log('Falling back to AI news generation');
    return await generateAINews(companyName);

  } catch (error) {
    console.error('Error in fetchCompanyNews:', error);
    throw new Error('Failed to fetch company news. Please try again later.');
  }
} 