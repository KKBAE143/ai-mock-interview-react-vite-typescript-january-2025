import { chatSession } from "@/scripts";

interface InterviewExperience {
  role: string;
  date: string;
  difficulty: "Easy" | "Medium" | "Hard";
  outcome: "Accepted" | "Rejected" | "Pending";
  rounds: string[];
  tips: string[];
  questions: string[];
  source?: string;
  rating?: number;
  location?: string;
  experience?: string;
}

// Base interview data for common roles
const baseInterviewData: Record<string, InterviewExperience[]> = {
  "Software Engineer": [
    {
      role: "Software Engineer",
      date: new Date().toISOString(),
      difficulty: "Medium",
      outcome: "Accepted",
      location: "Bangalore",
      experience: "2-3 years",
      rating: 4,
      rounds: [
        "Online Assessment - DSA and Problem Solving",
        "Technical Round 1 - Core CS Fundamentals",
        "Technical Round 2 - System Design",
        "Hiring Manager Round",
        "HR Discussion"
      ],
      tips: [
        "Focus on DSA and problem-solving skills",
        "Practice system design for mid-level positions",
        "Be prepared for coding on whiteboard",
        "Review company's tech stack and recent projects",
        "Prepare questions about team culture and growth"
      ],
      questions: [
        "Implement a rate limiter",
        "Design a URL shortening service",
        "Explain SOLID principles with examples",
        "Difference between promises and async/await",
        "Experience with microservices architecture"
      ]
    }
  ]
};

// Function to determine interview difficulty based on rounds and questions
function determineInterviewDifficulty(rounds: number, technicalQuestions: number): "Easy" | "Medium" | "Hard" {
  const totalScore = rounds * 2 + technicalQuestions;
  if (totalScore > 15) return "Hard";
  if (totalScore > 10) return "Medium";
  return "Easy";
}

// Function to generate realistic interview rounds based on role and company
function generateInterviewRounds(role: string, companyTier: string): string[] {
  const commonRounds = [
    "Online Assessment",
    "Technical Round 1",
    "Technical Round 2",
    "Hiring Manager Round",
    "HR Discussion"
  ];

  const additionalRounds = {
    "FAANG": [
      "System Design Discussion",
      "Behavioral Assessment",
      "Bar Raiser Round",
      "Team Matching"
    ],
    "Unicorn": [
      "System Design Discussion",
      "Culture Fit Round",
      "Team Introduction"
    ],
    "Enterprise": [
      "Group Discussion",
      "Technical Presentation",
      "Team Round"
    ]
  };

  const rounds = [...commonRounds];
  if (companyTier in additionalRounds) {
    rounds.push(...additionalRounds[companyTier].slice(0, 2));
  }

  return rounds;
}

export async function fetchInterviewExperiences(
  companyName: string,
  role: string
): Promise<InterviewExperience[]> {
  try {
    console.log('Fetching interview experiences for:', { companyName, role });

    // Try to get real interview data from the AI model
    const prompt = `
      Generate recent interview experiences at ${companyName} for ${role} role.
      Consider:
      1. Current interview process (2025)
      2. Company's interview style
      3. Technical and behavioral rounds
      4. Common questions asked
      5. Success tips
      6. Recent changes in interview pattern

      Format the response as JSON with actual technical questions and detailed rounds.
    `;

    const result = await chatSession.sendMessage(prompt);
    const aiData = JSON.parse(result.response.text().match(/\{[\s\S]*\}/)[0]);
    
    // Combine AI-generated data with base data
    const baseData = baseInterviewData[role] || baseInterviewData["Software Engineer"];
    const combinedData = baseData.map(base => ({
      ...base,
      date: new Date().toISOString(), // Keep date current
      questions: [...base.questions, ...(aiData.questions || []).slice(0, 3)],
      tips: [...base.tips, ...(aiData.tips || []).slice(0, 3)],
      rounds: generateInterviewRounds(role, determineCompanyTier(companyName))
    }));

    // Add some AI-generated experiences
    const aiExperiences = (aiData.experiences || []).map(exp => ({
      role: role,
      date: new Date().toISOString(),
      difficulty: determineInterviewDifficulty(exp.rounds?.length || 5, exp.questions?.length || 5),
      outcome: ["Accepted", "Rejected", "Pending"][Math.floor(Math.random() * 3)],
      rounds: generateInterviewRounds(role, determineCompanyTier(companyName)),
      tips: exp.tips || baseData[0].tips,
      questions: exp.questions || baseData[0].questions,
      location: exp.location || "Bangalore",
      experience: exp.experience || "3-5 years",
      rating: exp.rating || 4
    }));

    return [...combinedData, ...aiExperiences].slice(0, 5); // Return max 5 experiences

  } catch (error) {
    console.error('Error fetching interview experiences:', error);
    
    // Return base data as fallback
    return baseInterviewData[role] || baseInterviewData["Software Engineer"];
  }
}

function determineCompanyTier(companyName: string): string {
  const lowerName = companyName.toLowerCase();
  
  const companies = {
    "FAANG": ["google", "amazon", "meta", "apple", "microsoft", "netflix"],
    "Unicorn": ["swiggy", "zomato", "byju", "razorpay", "zerodha", "phonepe", "ola", "paytm"],
    "Enterprise": ["ibm", "accenture", "tcs", "infosys", "wipro", "hcl", "cognizant"]
  };

  for (const [tier, companyList] of Object.entries(companies)) {
    if (companyList.some(company => lowerName.includes(company))) {
      return tier;
    }
  }
  
  return "Enterprise";
} 