import { GoogleGenerativeAI } from '@google/generative-ai';

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

  console.log('Initializing Gemini model...');
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `You are a salary data analysis API. Your task is to provide salary insights for the following profile in a strict JSON format.

Input Data:
- Role: ${role}
- Experience: ${experience} years
- Location: ${location}
- Skills: ${skills.join(', ')}

Instructions:
1. Analyze the salary data for this profile
2. Return ONLY a JSON object with no additional text or explanation
3. Use the exact structure provided below
4. Ensure all numbers are plain numbers without commas or currency symbols
5. All salary values should be in INR

Required JSON Structure:
{
  "baseData": {
    "minimum": 800000,
    "average": 1200000,
    "maximum": 1800000,
    "currency": "INR"
  },
  "experienceLevels": {
    "entry": {
      "min": 600000,
      "max": 900000
    },
    "mid": {
      "min": 900000,
      "max": 1400000
    },
    "senior": {
      "min": 1400000,
      "max": 2000000
    }
  },
  "cityAdjustments": [
    {
      "city": "Bangalore",
      "percentage": 100
    },
    {
      "city": "Mumbai",
      "percentage": 95
    }
  ],
  "skillPremiums": [
    {
      "skill": "React",
      "percentage": 15
    }
  ],
  "benefits": [
    {
      "name": "Health Insurance",
      "description": "Comprehensive health coverage",
      "isAvailable": true
    }
  ],
  "predictions": [
    {
      "year": 2024,
      "predicted": 1300000,
      "confidence": 85
    }
  ],
  "lastUpdated": "2024-02-03",
  "marketDemand": "High"
}

Remember: Return ONLY the JSON object, no other text.`;

  try {
    console.log('Sending request to Gemini...');
    const result = await model.generateContent(prompt);
    console.log('Received response from Gemini');
    
    const response = await result.response;
    const text = response.text();
    
    console.log('Raw response:', text);
    
    // Clean the response text to ensure it's valid JSON
    const cleanedText = text.trim()
      .replace(/^```json/g, '') // Remove JSON code block markers if present
      .replace(/```$/g, '')     // Remove ending code block marker if present
      .trim();
    
    console.log('Cleaned response:', cleanedText);
    
    try {
      const parsedData = JSON.parse(cleanedText);
      
      // Validate the required structure
      if (!parsedData.baseData || !parsedData.experienceLevels || !parsedData.marketDemand) {
        throw new Error('Response missing required fields');
      }
      
      console.log('Successfully parsed JSON response');
      return parsedData;
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', cleanedText);
      throw new Error('Invalid JSON response from AI model');
    }
  } catch (error) {
    console.error('Error in Gemini API call:', error);
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

  const prompt = `You are a salary negotiation expert API. Generate detailed negotiation recommendations for the following profile in JSON format.

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
1. Analyze the profile and market conditions
2. Return ONLY a JSON object with no additional text
3. Provide practical negotiation advice and scripts
4. All salary values should be in INR
5. Include market-based justifications

Required JSON Structure:
{
  "marketContext": {
    "positionStrength": "strong",
    "keyMarketFactors": [
      "High demand for full-stack developers",
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
      "category": "Technical Expertise",
      "points": [
        "5 years of experience in cloud architecture",
        "Led 3 successful digital transformation projects"
      ],
      "importance": "high"
    }
  ],
  "talkingPoints": [
    {
      "situation": "Initial Offer Discussion",
      "script": "I appreciate the offer of X. Based on my research and experience, similar roles in the market are commanding Y. Could we discuss how we might bridge this gap?",
      "tips": [
        "Pause after stating your position",
        "Use market data to support your case"
      ]
    }
  ],
  "additionalBenefits": [
    {
      "benefit": "Remote Work",
      "description": "2-3 days per week remote work flexibility",
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