interface SalaryData {
  minimum: number;
  average: number;
  maximum: number;
  currency: string;
}

interface ExperienceLevel {
  entry: { min: number; max: number };
  mid: { min: number; max: number };
  senior: { min: number; max: number };
}

interface CityAdjustment {
  city: string;
  percentage: number;
}

interface SkillPremium {
  skill: string;
  percentage: number;
}

interface Benefits {
  name: string;
  description: string;
  isAvailable: boolean;
}

interface SalaryPrediction {
  year: number;
  predicted: number;
  confidence: number;
}

interface SalaryInsights {
  baseData: SalaryData;
  experienceLevels: ExperienceLevel;
  cityAdjustments: CityAdjustment[];
  skillPremiums: SkillPremium[];
  benefits: Benefits[];
  predictions: SalaryPrediction[];
  lastUpdated: string;
  marketDemand: 'Low' | 'Medium' | 'High';
}

export type {
  SalaryData,
  ExperienceLevel,
  CityAdjustment,
  SkillPremium,
  Benefits,
  SalaryPrediction,
  SalaryInsights
}; 