import axios from 'axios';

interface SalaryRange {
  min: number;
  max: number;
  median: number;
}

interface CityData {
  city: string;
  percentage: number;
  tier: "1" | "2";
  salaryRange: SalaryRange;
}

const ADZUNA_APP_ID = import.meta.env.VITE_ADZUNA_APP_ID;
const ADZUNA_API_KEY = import.meta.env.VITE_ADZUNA_API_KEY;

if (!ADZUNA_APP_ID || !ADZUNA_API_KEY) {
  console.error('Adzuna credentials are not set in environment variables');
}

export async function fetchRealTimeSalaryData(role: string, location: string): Promise<SalaryRange> {
  try {
    // Convert location to match Adzuna's location format
    const formattedLocation = location.toLowerCase().replace(' ', '-');
    
    // Fetch salary data from Adzuna
    const response = await axios.get(
      `https://api.adzuna.com/v1/api/jobs/in/history?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_API_KEY}&what=${encodeURIComponent(role)}&where=${encodeURIComponent(formattedLocation)}&months=1`
    );

    // Get salary statistics from the response
    const salaryData = response.data.month.map((m: any) => m.average);
    const averageSalary = salaryData.reduce((a: number, b: number) => a + b, 0) / salaryData.length;

    // Calculate min and max based on market research (typically ±20% from average)
    const min = Math.round(averageSalary * 0.8);
    const max = Math.round(averageSalary * 1.2);
    const median = Math.round(averageSalary);

    return {
      min,
      max,
      median
    };
  } catch (error) {
    console.error('Error fetching salary data:', error);
    
    // Fallback data based on industry standards if API fails
    const fallbackData = getFallbackSalaryData(role, location);
    console.log('Using fallback data:', fallbackData);
    return fallbackData;
  }
}

// Fallback function to provide reasonable estimates when API fails
function getFallbackSalaryData(role: string, location: string): SalaryRange {
  const baseSalaries: { [key: string]: number } = {
    'software developer': 1200000,
    'frontend developer': 1000000,
    'backend developer': 1100000,
    'full stack developer': 1300000,
    'data scientist': 1400000,
    'devops engineer': 1500000,
    'embedded developer': 1000000,
    'mobile developer': 1200000,
    'ui developer': 900000,
    'qa engineer': 800000
  };

  const locationMultipliers: { [key: string]: number } = {
    'bangalore': 1.0,
    'mumbai': 0.95,
    'delhi': 0.95,
    'hyderabad': 0.9,
    'pune': 0.85,
    'chennai': 0.85,
    'kolkata': 0.8,
    'ahmedabad': 0.75,
    'chandigarh': 0.7,
    'indore': 0.65
  };

  const defaultSalary = 1000000; // Default fallback
  const baseSalary = baseSalaries[role.toLowerCase()] || defaultSalary;
  const multiplier = locationMultipliers[location.toLowerCase()] || 1;

  const adjustedMedian = Math.round(baseSalary * multiplier);

  return {
    min: Math.round(adjustedMedian * 0.8),
    max: Math.round(adjustedMedian * 1.2),
    median: adjustedMedian
  };
}

export async function getCityComparisonData(role: string): Promise<CityData[]> {
  const cities = [
    { name: "Bangalore", tier: "1" },
    { name: "Mumbai", tier: "1" },
    { name: "Delhi NCR", tier: "1" },
    { name: "Hyderabad", tier: "1" },
    { name: "Pune", tier: "1" },
    { name: "Chennai", tier: "1" },
    { name: "Kolkata", tier: "2" },
    { name: "Ahmedabad", tier: "2" },
    { name: "Chandigarh", tier: "2" },
    { name: "Indore", tier: "2" }
  ];

  try {
    // Fetch base salary (Bangalore) first
    const bangaloreSalary = await fetchRealTimeSalaryData(role, "Bangalore");
    const baseMedian = bangaloreSalary.median;

    // Fetch data for all cities in parallel with rate limiting
    const cityDataPromises = cities.map(async (city, index) => {
      // Add delay to prevent rate limiting (1 second between requests)
      await new Promise(resolve => setTimeout(resolve, index * 1000));
      
      const salaryRange = await fetchRealTimeSalaryData(role, city.name);
      const percentage = Math.round((salaryRange.median / baseMedian) * 100);

      return {
        city: city.name,
        percentage,
        tier: city.tier as "1" | "2",
        salaryRange
      };
    });

    const cityData = await Promise.all(cityDataPromises);
    return cityData;
  } catch (error) {
    console.error('Error fetching city comparison data:', error);
    throw new Error('Failed to fetch city comparison data');
  }
}

// Function to get role-specific salary insights
export async function getRoleSalaryInsights(role: string, experience: number) {
  try {
    const cityData = await getCityComparisonData(role);
    
    // Calculate experience-based adjustments
    // 0-2 years: base salary
    // 3-5 years: 30% increase
    // 6-8 years: 60% increase
    // 9+ years: 100% increase
    let experienceMultiplier = 1;
    if (experience >= 9) {
      experienceMultiplier = 2;
    } else if (experience >= 6) {
      experienceMultiplier = 1.6;
    } else if (experience >= 3) {
      experienceMultiplier = 1.3;
    }
    
    return cityData.map(city => ({
      ...city,
      salaryRange: {
        min: Math.round(city.salaryRange.min * experienceMultiplier),
        max: Math.round(city.salaryRange.max * experienceMultiplier),
        median: Math.round(city.salaryRange.median * experienceMultiplier)
      }
    }));
  } catch (error) {
    console.error('Error getting role salary insights:', error);
    throw new Error('Failed to get role salary insights');
  }
} 