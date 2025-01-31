import { chatSession } from "@/scripts";

interface SalaryData {
  role: string;
  minSalary: number;
  maxSalary: number;
  average: number;
  currency: string;
  trend: "up" | "down" | "stable";
  lastUpdated: string;
  experience: {
    entry: { min: number; max: number };
    mid: { min: number; max: number };
    senior: { min: number; max: number };
  };
  location: {
    city: string;
    adjustment: number; // percentage adjustment for different cities
  }[];
  benefits: string[];
  marketDemand: "High" | "Medium" | "Low";
  skills: {
    name: string;
    impact: number; // percentage impact on salary
  }[];
}

// Base salary data for India (2025)
const baseSalaryData: Record<string, SalaryData> = {
  "Software Engineer": {
    role: "Software Engineer",
    minSalary: 600000,  // 6 LPA
    maxSalary: 2500000, // 25 LPA
    average: 1200000,   // 12 LPA
    currency: "INR",
    trend: "up",
    lastUpdated: new Date().toISOString(),
    experience: {
      entry: { min: 600000, max: 1000000 },    // 6-10 LPA
      mid: { min: 1000000, max: 1800000 },     // 10-18 LPA
      senior: { min: 1800000, max: 2500000 }   // 18-25 LPA
    },
    location: [
      { city: "Bangalore", adjustment: 100 },
      { city: "Hyderabad", adjustment: 90 },
      { city: "Mumbai", adjustment: 95 },
      { city: "Delhi NCR", adjustment: 95 },
      { city: "Pune", adjustment: 85 }
    ],
    benefits: [
      "Health Insurance for Family",
      "Annual Performance Bonus",
      "ESOP/RSU",
      "Flexible Work Hours",
      "Meal Cards"
    ],
    marketDemand: "High",
    skills: [
      { name: "React/Next.js", impact: 20 },
      { name: "TypeScript", impact: 15 },
      { name: "Node.js", impact: 15 }
    ]
  },
  "Frontend Developer": {
    role: "Frontend Developer",
    minSalary: 550000,  // 5.5 LPA
    maxSalary: 2200000, // 22 LPA
    average: 1100000,   // 11 LPA
    currency: "INR",
    trend: "up",
    lastUpdated: new Date().toISOString(),
    experience: {
      entry: { min: 550000, max: 900000 },     // 5.5-9 LPA
      mid: { min: 900000, max: 1600000 },      // 9-16 LPA
      senior: { min: 1600000, max: 2200000 }   // 16-22 LPA
    },
    location: [
      { city: "Bangalore", adjustment: 100 },
      { city: "Hyderabad", adjustment: 90 },
      { city: "Mumbai", adjustment: 95 },
      { city: "Delhi NCR", adjustment: 95 },
      { city: "Pune", adjustment: 85 }
    ],
    benefits: [
      "Health Insurance for Family",
      "Annual Performance Bonus",
      "Learning Allowance",
      "Flexible Work Hours",
      "Meal Cards"
    ],
    marketDemand: "High",
    skills: [
      { name: "React", impact: 25 },
      { name: "TypeScript", impact: 15 },
      { name: "Next.js", impact: 20 }
    ]
  },
  "Backend Developer": {
    role: "Backend Developer",
    minSalary: 600000,  // 6 LPA
    maxSalary: 2400000, // 24 LPA
    average: 1200000,   // 12 LPA
    currency: "INR",
    trend: "up",
    lastUpdated: new Date().toISOString(),
    experience: {
      entry: { min: 600000, max: 1000000 },    // 6-10 LPA
      mid: { min: 1000000, max: 1700000 },     // 10-17 LPA
      senior: { min: 1700000, max: 2400000 }   // 17-24 LPA
    },
    location: [
      { city: "Bangalore", adjustment: 100 },
      { city: "Hyderabad", adjustment: 90 },
      { city: "Mumbai", adjustment: 95 },
      { city: "Delhi NCR", adjustment: 95 },
      { city: "Pune", adjustment: 85 }
    ],
    benefits: [
      "Health Insurance for Family",
      "Annual Performance Bonus",
      "ESOP/RSU",
      "Flexible Work Hours",
      "Meal Cards"
    ],
    marketDemand: "High",
    skills: [
      { name: "Node.js", impact: 20 },
      { name: "Python", impact: 15 },
      { name: "AWS", impact: 25 }
    ]
  },
  "Full Stack Developer": {
    role: "Full Stack Developer",
    minSalary: 700000,  // 7 LPA
    maxSalary: 2800000, // 28 LPA
    average: 1400000,   // 14 LPA
    currency: "INR",
    trend: "up",
    lastUpdated: new Date().toISOString(),
    experience: {
      entry: { min: 700000, max: 1200000 },    // 7-12 LPA
      mid: { min: 1200000, max: 2000000 },     // 12-20 LPA
      senior: { min: 2000000, max: 2800000 }   // 20-28 LPA
    },
    location: [
      { city: "Bangalore", adjustment: 100 },
      { city: "Hyderabad", adjustment: 90 },
      { city: "Mumbai", adjustment: 95 },
      { city: "Delhi NCR", adjustment: 95 },
      { city: "Pune", adjustment: 85 }
    ],
    benefits: [
      "Health Insurance for Family",
      "Annual Performance Bonus",
      "ESOP/RSU",
      "Flexible Work Hours",
      "Meal Cards"
    ],
    marketDemand: "High",
    skills: [
      { name: "React", impact: 20 },
      { name: "Node.js", impact: 20 },
      { name: "AWS", impact: 15 }
    ]
  }
};

// Company tiers and their multipliers
const COMPANY_TIERS = {
  FAANG: {
    multiplier: 1.5,
    companies: ["Google", "Amazon", "Meta", "Apple", "Microsoft", "Netflix"]
  },
  Unicorn: {
    multiplier: 1.3,
    companies: ["Swiggy", "Zomato", "Byju's", "Razorpay", "Zerodha", "PhonePe", "Ola", "Paytm"]
  },
  Enterprise: {
    multiplier: 1.2,
    companies: ["IBM", "Accenture", "TCS", "Infosys", "Wipro", "HCL", "Cognizant"]
  },
  Startup: {
    multiplier: 1.0,
    companies: []
  }
};

// Update Adzuna API configuration
const ADZUNA_APP_ID = 'd2c567f4';  // Your actual app ID
const ADZUNA_API_KEY = 'eef87f527c2ed5419e701937ceb7ad65';  // Your actual API key

async function fetchAdzunaData(role: string): Promise<any> {
  try {
    console.log('Fetching Adzuna data for role:', role);
    
    const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?` +
      `app_id=${ADZUNA_APP_ID}&` +
      `app_key=${ADZUNA_API_KEY}&` +
      `results_per_page=10&` +
      `what=${encodeURIComponent(role)}&` +
      `where=bangalore&` +
      `content-type=application/json`;
    
    console.log('Adzuna API URL:', url);

    const response = await fetch(url);
    console.log('Adzuna API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Adzuna API error response:', errorText);
      throw new Error(`Adzuna API failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('Adzuna API Response data:', data);
    
    return {
      count: data.count || 0,
      mean_salary: data.mean_salary || null,
      results: data.results || []
    };
  } catch (error) {
    console.error('Error in fetchAdzunaData:', error);
    // Return a structured fallback object instead of null
    return {
      count: 0,
      mean_salary: null,
      results: []
    };
  }
}

function calculateMarketDemand(jobCount: number): "High" | "Medium" | "Low" {
  if (jobCount > 1000) return "High";
  if (jobCount > 500) return "Medium";
  return "Low";
}

function getTrend(avgSalary: number, role: string): "up" | "down" | "stable" {
  const baseSalary = baseSalaryData[role]?.average || 1200000;
  if (avgSalary > baseSalary * 1.1) return "up";
  if (avgSalary < baseSalary * 0.9) return "down";
  return "stable";
}

export async function fetchIndianSalaryData(
  companyName: string,
  role: string,
  industry: string
): Promise<SalaryData[]> {
  try {
    console.log('Starting fetchIndianSalaryData for:', { companyName, role, industry });

    // 1. Get base salary data
    const normalizedRole = normalizeRoleName(role);
    console.log('Normalized role:', normalizedRole);
    
    const baseData = baseSalaryData[normalizedRole] || baseSalaryData["Software Engineer"];
    console.log('Base salary data:', baseData);

    // 2. Determine company tier and apply multiplier
    const companyTier = determineCompanyTier(companyName);
    const tierMultiplier = COMPANY_TIERS[companyTier]?.multiplier || 1.0;
    console.log('Company tier and multiplier:', { companyTier, tierMultiplier });

    // 3. Try to get real market data from Adzuna
    const adzunaData = await fetchAdzunaData(role);
    console.log('Adzuna data received:', adzunaData);

    // 4. Prepare the final salary data
    const salaryData: SalaryData = {
      ...baseData,
      role: role,
      lastUpdated: new Date().toISOString(),
      marketDemand: calculateMarketDemand(adzunaData.count)
    };

    // 5. Apply company tier multiplier
    const adjustedSalary = {
      ...salaryData,
      minSalary: Math.round(salaryData.minSalary * tierMultiplier),
      maxSalary: Math.round(salaryData.maxSalary * tierMultiplier),
      average: Math.round(salaryData.average * tierMultiplier),
      experience: {
        entry: {
          min: Math.round(salaryData.experience.entry.min * tierMultiplier),
          max: Math.round(salaryData.experience.entry.max * tierMultiplier)
        },
        mid: {
          min: Math.round(salaryData.experience.mid.min * tierMultiplier),
          max: Math.round(salaryData.experience.mid.max * tierMultiplier)
        },
        senior: {
          min: Math.round(salaryData.experience.senior.min * tierMultiplier),
          max: Math.round(salaryData.experience.senior.max * tierMultiplier)
        }
      }
    };

    // 6. Add real-time insights if available
    if (adzunaData?.mean_salary) {
      adjustedSalary.trend = getTrend(adzunaData.mean_salary, normalizedRole);
    }

    console.log('Final adjusted salary data:', adjustedSalary);
    return [adjustedSalary];

  } catch (error) {
    console.error('Error in fetchIndianSalaryData:', error);
    
    // Always return base data with company tier adjustment
    const normalizedRole = normalizeRoleName(role);
    const baseData = baseSalaryData[normalizedRole] || baseSalaryData["Software Engineer"];
    const companyTier = determineCompanyTier(companyName);
    const tierMultiplier = COMPANY_TIERS[companyTier]?.multiplier || 1.0;

    const fallbackData = {
      ...baseData,
      role: role,
      lastUpdated: new Date().toISOString(),
      minSalary: Math.round(baseData.minSalary * tierMultiplier),
      maxSalary: Math.round(baseData.maxSalary * tierMultiplier),
      average: Math.round(baseData.average * tierMultiplier),
      experience: {
        entry: {
          min: Math.round(baseData.experience.entry.min * tierMultiplier),
          max: Math.round(baseData.experience.entry.max * tierMultiplier)
        },
        mid: {
          min: Math.round(baseData.experience.mid.min * tierMultiplier),
          max: Math.round(baseData.experience.mid.max * tierMultiplier)
        },
        senior: {
          min: Math.round(baseData.experience.senior.min * tierMultiplier),
          max: Math.round(baseData.experience.senior.max * tierMultiplier)
        }
      }
    };

    console.log('Using fallback data:', fallbackData);
    return [fallbackData];
  }
}

function normalizeRoleName(role: string): string {
  const roleMap: Record<string, string> = {
    "software engineer": "Software Engineer",
    "software developer": "Software Engineer",
    "frontend engineer": "Frontend Developer",
    "frontend developer": "Frontend Developer",
    "backend engineer": "Backend Developer",
    "backend developer": "Backend Developer",
    "full stack engineer": "Full Stack Developer",
    "full stack developer": "Full Stack Developer",
    "fullstack developer": "Full Stack Developer",
    "fullstack engineer": "Full Stack Developer"
  };

  const normalizedInput = role.toLowerCase().trim();
  return roleMap[normalizedInput] || "Software Engineer";
}

function determineCompanyTier(companyName: string): keyof typeof COMPANY_TIERS {
  const lowerName = companyName.toLowerCase();
  
  for (const [tier, data] of Object.entries(COMPANY_TIERS)) {
    if (data.companies.some(company => lowerName.includes(company.toLowerCase()))) {
      return tier as keyof typeof COMPANY_TIERS;
    }
  }
  
  return "Startup";
} 