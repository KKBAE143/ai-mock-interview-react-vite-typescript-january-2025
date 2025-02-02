import { GoogleGenerativeAI } from '@google/generative-ai';
import { getRoleSalaryInsights } from './salary-api';

// Check if API key is available
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error('VITE_GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

interface SalaryPredictionParams {
  role: string;
  experience: number;
  location: string;
  skills: string[];
}

export async function predictSalaryTrends({
  role,
  experience,
  location,
  skills
}: SalaryPredictionParams) {
  if (!role) throw new Error('Role is required');
  if (experience < 0) throw new Error('Experience must be a positive number');
  if (!location) throw new Error('Location is required');

  try {
    // Fetch real-time city comparison data
    const cityInsights = await getRoleSalaryInsights(role, experience);
    
    // Get base salary data from the selected location
    const locationData = cityInsights.find(city => 
      city.city.toLowerCase() === location.toLowerCase()
    );

    if (!locationData) {
      throw new Error('Location data not found');
    }

    // Calculate base salary data
    const baseData = {
      minimum: locationData.salaryRange.min,
      average: locationData.salaryRange.median,
      maximum: locationData.salaryRange.max,
      currency: "INR"
    };

    // Calculate experience-based salary ranges
    const experienceLevels = {
      entry: {
        min: Math.round(baseData.minimum * 0.7),
        max: Math.round(baseData.minimum * 1.2)
      },
      mid: {
        min: Math.round(baseData.average * 0.9),
        max: Math.round(baseData.average * 1.3)
      },
      senior: {
        min: Math.round(baseData.maximum * 0.8),
        max: Math.round(baseData.maximum * 1.2)
      }
    };

    // Format city adjustments from real-time data
    const cityAdjustments = cityInsights.map(city => ({
      city: city.city,
      percentage: city.percentage,
      tier: city.tier
    }));

    // Initialize Gemini for skill premiums and market analysis
    console.log('Initializing Gemini model...');
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are a salary insights API. Analyze the following role and provide skill premiums and market demand information.
    
    Role: ${role}
    Experience: ${experience} years
    Location: ${location}
    Skills: ${skills.join(', ')}

    Respond with ONLY a JSON object in this exact format:
    {
      "skillPremiums": [
        {
          "skill": "string",
          "percentage": number
        }
      ],
      "marketDemand": "High" | "Medium" | "Low"
    }

    Notes:
    - Include only skills relevant to the role
    - Percentage should be a number (15 not 15%)
    - marketDemand must be exactly "High", "Medium", or "Low"
    - Do not include any explanation or additional text
    - Ensure the JSON is properly formatted`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    console.log('Raw Gemini response:', text);

    // Clean the response text and parse JSON
    const cleanedText = text
      .replace(/```json\s*/g, '')
      .replace(/```\s*$/g, '')
      .trim();

    try {
      const aiResponse = JSON.parse(cleanedText);

      // Validate the response structure
      if (!aiResponse.skillPremiums || !Array.isArray(aiResponse.skillPremiums) || !aiResponse.marketDemand) {
        throw new Error('Invalid response structure from AI');
      }

      // Validate and clean skill premiums
      const validatedSkillPremiums = aiResponse.skillPremiums.map(premium => ({
        skill: String(premium.skill),
        percentage: Number(premium.percentage)
      })).filter(premium => !isNaN(premium.percentage));

      // Validate market demand
      const validMarketDemand = ['High', 'Medium', 'Low'].includes(aiResponse.marketDemand)
        ? aiResponse.marketDemand
        : 'Medium';

      // Return the combined data
      return {
        baseData,
        experienceLevels,
        cityAdjustments,
        skillPremiums: validatedSkillPremiums,
        marketDemand: validMarketDemand,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('Attempted to parse:', cleanedText);
      
      // Return default data if parsing fails
      return {
        baseData,
        experienceLevels,
        cityAdjustments,
        skillPremiums: [
          { skill: role, percentage: 10 }
        ],
        marketDemand: "Medium",
        lastUpdated: new Date().toISOString().split('T')[0]
      };
    }
  } catch (error) {
    console.error('Error in salary prediction:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to predict salary trends');
  }
}

export async function analyzeSalaryFactors(
  currentSalary: number,
  role: string,
  location: string
) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `
    Analyze the following salary information:
    Current Salary: ${currentSalary}
    Role: ${role}
    Location: ${location}
    
    Please provide the analysis in the following JSON format:
    {
      "comparison": {
        "difference": number,
        "percentage": number,
        "status": "above" | "below" | "at"
      },
      "factors": [
        {
          "name": string,
          "impact": number,
          "description": string
        }
      ],
      "recommendations": [
        {
          "title": string,
          "description": string,
          "priority": "High" | "Medium" | "Low"
        }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Error analyzing salary factors:', error);
    throw new Error('Failed to analyze salary factors');
  }
}

export interface NegotiationRecommendation {
  marketContext: {
    positionStrength: 'strong' | 'moderate' | 'challenging';
    keyMarketFactors: string[];
    competitiveSalaryRange: {
      min: number;
      target: number;
      max: number;
    };
  };
  negotiationPoints: {
    category: string;
    points: string[];
    importance: 'high' | 'medium' | 'low';
  }[];
  talkingPoints: {
    situation: string;
    script: string;
    tips: string[];
  }[];
  additionalBenefits: {
    benefit: string;
    description: string;
    negotiability: 'highly negotiable' | 'moderately negotiable' | 'rarely negotiable';
  }[];
}

export async function generateNegotiationRecommendations({
  role,
  experience,
  location,
  skills,
  currentSalary,
  targetSalary,
  companySize,
  industry
}: {
  role: string;
  experience: number;
  location: string;
  skills: string[];
  currentSalary?: number;
  targetSalary?: number;
  companySize?: string;
  industry?: string;
}): Promise<NegotiationRecommendation> {
  console.log('Initializing negotiation recommendations...');
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `You are a salary negotiation expert API. Generate detailed negotiation recommendations based on market data and industry standards. Focus on providing general market insights that would be applicable across companies in the same industry and location.

Input Profile:
- Role: ${role}
- Experience: ${experience} years
- Location: ${location}
- Skills: ${skills.join(', ')}
${currentSalary ? `- Current Salary: ${currentSalary} INR` : ''}
${targetSalary ? `- Target Salary: ${targetSalary} INR` : ''}
${companySize ? `- Company Size: ${companySize}` : ''}
${industry ? `- Industry: ${industry}` : ''}

Instructions:
1. Analyze the profile using general market data and industry standards
2. Return ONLY a JSON object with no additional text
3. Provide practical negotiation advice based on market conditions
4. All salary values should be in INR
5. Include market-based justifications
6. Focus on industry averages and trends rather than company-specific data
7. Consider location-based salary variations
8. Account for experience level and skill set impact on salary

Required JSON Structure:
{
  "marketContext": {
    "positionStrength": "strong",
    "keyMarketFactors": [
      "High demand for full-stack developers in Bangalore",
      "15% YoY growth in tech salaries",
      "Significant skill gap in cloud technologies"
    ],
    "competitiveSalaryRange": {
      "min": 1800000,
      "target": 2200000,
      "max": 2600000
    }
  },
  "negotiationPoints": [
    {
      "category": "Market Position",
      "points": [
        "Current market rate for this role and experience level",
        "Industry demand for specific skills"
      ],
      "importance": "high"
    }
  ],
  "talkingPoints": [
    {
      "situation": "Initial Offer Discussion",
      "script": "Based on my research of the current market rates in [location] for [role] positions, and considering my experience with [key skills], I believe a compensation in the range of X would be more aligned with the market.",
      "tips": [
        "Focus on market data rather than personal needs",
        "Highlight skills that command premium in current market"
      ]
    }
  ],
  "additionalBenefits": [
    {
      "benefit": "Remote Work",
      "description": "Standard in the industry for similar roles",
      "negotiability": "highly negotiable"
    }
  ]
}

Remember: Return ONLY the JSON object, no additional text.`;

  try {
    console.log('Sending request to Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Raw response:', text);
    
    const cleanedText = text.trim()
      .replace(/^```json/g, '')
      .replace(/```$/g, '')
      .trim();
    
    try {
      const parsedData = JSON.parse(cleanedText);
      
      if (!parsedData.marketContext || !parsedData.negotiationPoints || !parsedData.talkingPoints) {
        throw new Error('Response missing required fields');
      }
      
      return parsedData;
    } catch (parseError) {
      console.error('Failed to parse negotiation recommendations:', cleanedText);
      throw new Error('Invalid response format from AI model');
    }
  } catch (error) {
    console.error('Error generating negotiation recommendations:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate recommendations');
  }
} 