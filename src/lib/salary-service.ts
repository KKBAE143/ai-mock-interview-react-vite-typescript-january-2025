interface CompensationRange {
  min: number;
  max: number;
  median: number;
}

interface IndustryData {
  baseSalaryMultiplier: number;
  equityPercentage: number;
  bonusPercentage: number;
  growthRate: number;
}

interface CompanyTypeMultiplier {
  baseSalaryMultiplier: number;
  equityMultiplier: number;
  bonusMultiplier: number;
  benefitsScore: number;
}

interface CareerLevel {
  multiplier: number;
  equityEligible: boolean;
  bonusEligible: boolean;
  managementTrack: boolean;
}

// Industry-specific data
const industryData: Record<string, IndustryData> = {
  technology: {
    baseSalaryMultiplier: 1.2,
    equityPercentage: 20,
    bonusPercentage: 15,
    growthRate: 12,
  },
  finance: {
    baseSalaryMultiplier: 1.3,
    equityPercentage: 15,
    bonusPercentage: 40,
    growthRate: 8,
  },
  healthcare: {
    baseSalaryMultiplier: 1.1,
    equityPercentage: 5,
    bonusPercentage: 10,
    growthRate: 7,
  },
  retail: {
    baseSalaryMultiplier: 0.9,
    equityPercentage: 5,
    bonusPercentage: 8,
    growthRate: 5,
  },
  manufacturing: {
    baseSalaryMultiplier: 1.0,
    equityPercentage: 8,
    bonusPercentage: 12,
    growthRate: 6,
  },
  consulting: {
    baseSalaryMultiplier: 1.25,
    equityPercentage: 10,
    bonusPercentage: 25,
    growthRate: 10,
  },
  media: {
    baseSalaryMultiplier: 1.1,
    equityPercentage: 12,
    bonusPercentage: 10,
    growthRate: 8,
  },
  telecommunications: {
    baseSalaryMultiplier: 1.15,
    equityPercentage: 10,
    bonusPercentage: 15,
    growthRate: 7,
  },
};

// Company type multipliers
const companyTypeMultipliers: Record<string, CompanyTypeMultiplier> = {
  startup: {
    baseSalaryMultiplier: 0.9,
    equityMultiplier: 2.0,
    bonusMultiplier: 0.5,
    benefitsScore: 3,
  },
  "small business": {
    baseSalaryMultiplier: 0.85,
    equityMultiplier: 0.5,
    bonusMultiplier: 0.7,
    benefitsScore: 2,
  },
  "mid-size company": {
    baseSalaryMultiplier: 1.0,
    equityMultiplier: 1.0,
    bonusMultiplier: 1.0,
    benefitsScore: 4,
  },
  "large enterprise": {
    baseSalaryMultiplier: 1.2,
    equityMultiplier: 1.2,
    bonusMultiplier: 1.3,
    benefitsScore: 5,
  },
  "fortune 500": {
    baseSalaryMultiplier: 1.3,
    equityMultiplier: 1.5,
    bonusMultiplier: 1.5,
    benefitsScore: 5,
  },
  multinational: {
    baseSalaryMultiplier: 1.25,
    equityMultiplier: 1.4,
    bonusMultiplier: 1.4,
    benefitsScore: 5,
  },
  "public sector": {
    baseSalaryMultiplier: 0.8,
    equityMultiplier: 0,
    bonusMultiplier: 0.3,
    benefitsScore: 4,
  },
  "non-profit": {
    baseSalaryMultiplier: 0.75,
    equityMultiplier: 0,
    bonusMultiplier: 0.2,
    benefitsScore: 3,
  },
};

// Career level multipliers
const careerLevels: Record<string, CareerLevel> = {
  entry: {
    multiplier: 1.0,
    equityEligible: false,
    bonusEligible: true,
    managementTrack: false,
  },
  mid: {
    multiplier: 1.5,
    equityEligible: true,
    bonusEligible: true,
    managementTrack: false,
  },
  senior: {
    multiplier: 2.0,
    equityEligible: true,
    bonusEligible: true,
    managementTrack: true,
  },
  lead: {
    multiplier: 2.5,
    equityEligible: true,
    bonusEligible: true,
    managementTrack: true,
  },
  director: {
    multiplier: 3.0,
    equityEligible: true,
    bonusEligible: true,
    managementTrack: true,
  },
  executive: {
    multiplier: 4.0,
    equityEligible: true,
    bonusEligible: true,
    managementTrack: true,
  },
};

// Experience multipliers
const experienceMultipliers = {
  0: 1.0,  // Fresh
  2: 1.2,  // Early career
  5: 1.5,  // Established
  8: 1.8,  // Experienced
  10: 2.0, // Senior
  15: 2.5, // Expert
};

// Location cost of living index (sample data)
const locationMultipliers: Record<string, number> = {
  "san francisco": 1.95,
  "new york": 1.8,
  "seattle": 1.65,
  "boston": 1.5,
  "austin": 1.3,
  "bangalore": 1.0,
  "london": 1.7,
  "singapore": 1.6,
  "tokyo": 1.75,
  "berlin": 1.4,
  // Add more cities as needed
};

export function calculateCompensation(
  role: string,
  industry: string,
  companyType: string,
  level: string,
  location: string,
  experience: number,
  skills: string[],
  baseSalary: number = 100000 // Default base salary
) {
  const industryInfo = industryData[industry.toLowerCase()] || industryData.technology;
  const companyInfo = companyTypeMultipliers[companyType.toLowerCase()] || companyTypeMultipliers["mid-size company"];
  const careerLevel = careerLevels[level.toLowerCase()] || careerLevels.mid;
  const locationMultiplier = locationMultipliers[location.toLowerCase()] || 1.0;

  // Get experience multiplier
  const expMultiplier = Object.entries(experienceMultipliers).reduce((acc, [years, multiplier]) => {
    return experience >= parseInt(years) ? multiplier : acc;
  }, 1.0);

  // Calculate skill premium (5% for each relevant skill)
  const skillPremium = Math.min(0.25, skills.length * 0.05);

  // Calculate base salary
  const adjustedBaseSalary = baseSalary *
    industryInfo.baseSalaryMultiplier *
    companyInfo.baseSalaryMultiplier *
    careerLevel.multiplier *
    expMultiplier *
    locationMultiplier *
    (1 + skillPremium);

  // Calculate equity
  const equity = careerLevel.equityEligible
    ? adjustedBaseSalary * (industryInfo.equityPercentage / 100) * companyInfo.equityMultiplier
    : 0;

  // Calculate bonus
  const bonus = careerLevel.bonusEligible
    ? adjustedBaseSalary * (industryInfo.bonusPercentage / 100) * companyInfo.bonusMultiplier
    : 0;

  // Calculate ranges
  const range: CompensationRange = {
    min: Math.round(adjustedBaseSalary * 0.9),
    max: Math.round(adjustedBaseSalary * 1.2),
    median: Math.round(adjustedBaseSalary),
  };

  return {
    base: range,
    equity: Math.round(equity),
    bonus: Math.round(bonus),
    total: {
      min: Math.round(range.min + equity + bonus),
      max: Math.round(range.max + equity + bonus),
      median: Math.round(range.median + equity + bonus),
    },
    multipliers: {
      industry: industryInfo.baseSalaryMultiplier,
      company: companyInfo.baseSalaryMultiplier,
      career: careerLevel.multiplier,
      experience: expMultiplier,
      location: locationMultiplier,
      skills: skillPremium,
    },
    metadata: {
      growthRate: industryInfo.growthRate,
      benefitsScore: companyInfo.benefitsScore,
      managementTrack: careerLevel.managementTrack,
    },
  };
}

export function getIndustryInfo(industry: string) {
  return industryData[industry.toLowerCase()];
}

export function getCompanyTypeInfo(companyType: string) {
  return companyTypeMultipliers[companyType.toLowerCase()];
}

export function getCareerLevelInfo(level: string) {
  return careerLevels[level.toLowerCase()];
}

export function getLocationMultiplier(location: string) {
  return locationMultipliers[location.toLowerCase()] || 1.0;
}

export function getExperienceMultiplier(years: number) {
  return Object.entries(experienceMultipliers).reduce((acc, [threshold, multiplier]) => {
    return years >= parseInt(threshold) ? multiplier : acc;
  }, 1.0);
} 