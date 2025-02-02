import axios from 'axios';
import {
  getBaseSalary,
  getLocationMultiplier,
  getExperienceLevel,
  experienceMultipliers,
  getSkillPremiums,
  getMarketDemand
} from './backup/salary-data';

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
    
    // Use backup data
    const baseSalaryData = getBaseSalary(role);
    const locationMultiplier = getLocationMultiplier(location);
    
    return {
      min: Math.round(baseSalaryData.min * locationMultiplier),
      max: Math.round(baseSalaryData.max * locationMultiplier),
      median: Math.round(baseSalaryData.avg * locationMultiplier)
    };
  }
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
    // Try to fetch real-time data first
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
    console.error('Error fetching city comparison data, using backup data:', error);
    
    // Use backup data
    const baseSalaryData = getBaseSalary(role);
    return cities.map(city => {
      const multiplier = getLocationMultiplier(city.name);
      return {
        city: city.name,
        percentage: Math.round(multiplier * 100),
        tier: city.tier as "1" | "2",
        salaryRange: {
          min: Math.round(baseSalaryData.min * multiplier),
          max: Math.round(baseSalaryData.max * multiplier),
          median: Math.round(baseSalaryData.avg * multiplier)
        }
      };
    });
  }
}

export async function getRoleSalaryInsights(role: string, experience: number) {
  try {
    const cityData = await getCityComparisonData(role);
    
    // Get experience multiplier from backup data
    const expLevel = getExperienceLevel(experience);
    const expMultiplier = experienceMultipliers[expLevel].multiplier;
    
    return cityData.map(city => ({
      ...city,
      salaryRange: {
        min: Math.round(city.salaryRange.min * expMultiplier),
        max: Math.round(city.salaryRange.max * expMultiplier),
        median: Math.round(city.salaryRange.median * expMultiplier)
      }
    }));
  } catch (error) {
    console.error('Error getting role salary insights:', error);
    throw new Error('Failed to get role salary insights');
  }
} 