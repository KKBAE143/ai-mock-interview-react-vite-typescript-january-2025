interface AmazonLevel {
  level: string;
  title: string;
  baseSalaryRange: {
    min: number;
    max: number;
  };
  rsuRange: {
    min: number;
    max: number;
  };
  signingBonusRange: {
    min: number;
    max: number;
  };
}

interface LocationMultiplier {
  city: string;
  multiplier: number;
  tier: string;
}

// Amazon India level-wise compensation data
const amazonLevels: Record<string, AmazonLevel> = {
  sde1: {
    level: "L4",
    title: "SDE I",
    baseSalaryRange: {
      min: 1500000,
      max: 2500000,
    },
    rsuRange: {
      min: 2000000,
      max: 4000000,
    },
    signingBonusRange: {
      min: 300000,
      max: 700000,
    },
  },
  sde2: {
    level: "L5",
    title: "SDE II",
    baseSalaryRange: {
      min: 2500000,
      max: 4000000,
    },
    rsuRange: {
      min: 4000000,
      max: 8000000,
    },
    signingBonusRange: {
      min: 500000,
      max: 1200000,
    },
  },
  senior: {
    level: "L6",
    title: "Senior SDE",
    baseSalaryRange: {
      min: 4000000,
      max: 7000000,
    },
    rsuRange: {
      min: 8000000,
      max: 15000000,
    },
    signingBonusRange: {
      min: 1000000,
      max: 2000000,
    },
  },
  principal: {
    level: "L7",
    title: "Principal SDE",
    baseSalaryRange: {
      min: 7000000,
      max: 12000000,
    },
    rsuRange: {
      min: 15000000,
      max: 30000000,
    },
    signingBonusRange: {
      min: 2000000,
      max: 4000000,
    },
  },
};

// Location-based multipliers for India
const locationMultipliers: LocationMultiplier[] = [
  { city: "bangalore", multiplier: 1.0, tier: "1" },
  { city: "hyderabad", multiplier: 0.95, tier: "1" },
  { city: "delhi", multiplier: 0.95, tier: "1" },
  { city: "mumbai", multiplier: 0.95, tier: "1" },
  { city: "pune", multiplier: 0.90, tier: "1" },
  { city: "chennai", multiplier: 0.90, tier: "1" },
];

// Experience multipliers
const experienceMultipliers = {
  entry: { years: [0, 2], multiplier: 1.0 },
  mid: { years: [3, 5], multiplier: 1.2 },
  senior: { years: [6, 8], multiplier: 1.4 },
  staff: { years: [9, 12], multiplier: 1.6 },
  principal: { years: [13, 100], multiplier: 1.8 },
};

// Skill premium percentages
const skillPremiums: Record<string, number> = {
  "System Design": 15,
  "Distributed Systems": 12,
  "AWS": 10,
  "Machine Learning": 15,
  "Leadership": 10,
  "Architecture": 12,
};

export function calculateAmazonCompensation(
  level: string,
  location: string,
  experience: number,
  skills: string[]
) {
  const levelData = amazonLevels[level];
  const locationData = locationMultipliers.find(
    (l) => l.city === location.toLowerCase()
  );
  
  // Get experience multiplier
  const expMultiplier = Object.values(experienceMultipliers).find(
    (e) => experience >= e.years[0] && experience <= e.years[1]
  )?.multiplier || 1.0;

  // Calculate skill premium
  const skillPremium = skills.reduce((acc, skill) => {
    return acc + (skillPremiums[skill] || 0);
  }, 0) / 100;

  // Apply multipliers
  const locationMultiplier = locationData?.multiplier || 0.9;
  const totalMultiplier = locationMultiplier * expMultiplier * (1 + skillPremium);

  return {
    baseSalary: {
      min: Math.round(levelData.baseSalaryRange.min * totalMultiplier),
      max: Math.round(levelData.baseSalaryRange.max * totalMultiplier),
    },
    rsu: {
      min: Math.round(levelData.rsuRange.min * totalMultiplier),
      max: Math.round(levelData.rsuRange.max * totalMultiplier),
    },
    signingBonus: {
      min: Math.round(levelData.signingBonusRange.min * totalMultiplier),
      max: Math.round(levelData.signingBonusRange.max * totalMultiplier),
    },
    multipliers: {
      location: locationMultiplier,
      experience: expMultiplier,
      skills: skillPremium,
    },
  };
}

export function getAmazonLevelInfo(level: string) {
  return amazonLevels[level];
}

export function getLocationMultiplier(location: string) {
  return locationMultipliers.find((l) => l.city === location.toLowerCase());
}

export function getSkillPremiums() {
  return skillPremiums;
}

export function getExperienceMultiplier(years: number) {
  return (
    Object.values(experienceMultipliers).find(
      (e) => years >= e.years[0] && years <= e.years[1]
    )?.multiplier || 1.0
  );
} 