// Role-specific base salaries (annual, in INR)
export const baseSalaries = {
  // Software Development Roles
  'software developer': { min: 500000, avg: 1200000, max: 2000000 },
  'frontend developer': { min: 450000, avg: 1000000, max: 1800000 },
  'backend developer': { min: 500000, avg: 1100000, max: 1900000 },
  'full stack developer': { min: 600000, avg: 1300000, max: 2200000 },
  'mobile developer': { min: 550000, avg: 1200000, max: 2000000 },
  'devops engineer': { min: 700000, avg: 1500000, max: 2500000 },
  
  // Data & AI Roles
  'data scientist': { min: 800000, avg: 1600000, max: 2800000 },
  'data engineer': { min: 700000, avg: 1400000, max: 2400000 },
  'machine learning engineer': { min: 900000, avg: 1800000, max: 3000000 },
  'ai engineer': { min: 1000000, avg: 2000000, max: 3500000 },
  
  // Specialized Engineering Roles
  'embedded developer': { min: 450000, avg: 1000000, max: 1800000 },
  'security engineer': { min: 800000, avg: 1600000, max: 2800000 },
  'cloud engineer': { min: 700000, avg: 1500000, max: 2500000 },
  'qa engineer': { min: 400000, avg: 800000, max: 1500000 },
  
  // UI/UX Roles
  'ui developer': { min: 400000, avg: 900000, max: 1600000 },
  'ux designer': { min: 500000, avg: 1100000, max: 2000000 },
  'product designer': { min: 600000, avg: 1300000, max: 2200000 }
};

// Location-based salary multipliers
export const locationMultipliers = {
  // Tier 1 Cities
  'bangalore': 1.0,    // Base reference
  'mumbai': 0.95,
  'delhi ncr': 0.95,
  'hyderabad': 0.90,
  'pune': 0.85,
  'chennai': 0.85,
  
  // Tier 2 Cities
  'kolkata': 0.80,
  'ahmedabad': 0.75,
  'chandigarh': 0.70,
  'indore': 0.65,
  
  // Default for other cities
  'default': 0.70
};

// Experience-based multipliers
export const experienceMultipliers = {
  'entry': { min: 0, max: 2, multiplier: 1.0 },
  'junior': { min: 3, max: 5, multiplier: 1.3 },
  'mid': { min: 6, max: 8, multiplier: 1.6 },
  'senior': { min: 9, max: 12, multiplier: 2.0 },
  'lead': { min: 13, max: 15, multiplier: 2.5 },
  'architect': { min: 15, max: 100, multiplier: 3.0 }
};

// Skill premiums by role
export const skillPremiums = {
  // Frontend Development
  'frontend': {
    'react': 15,
    'typescript': 12,
    'next.js': 18,
    'vue.js': 12,
    'angular': 10,
    'webpack': 8,
    'tailwind': 10
  },
  
  // Backend Development
  'backend': {
    'node.js': 14,
    'python': 12,
    'java': 10,
    'spring boot': 12,
    'postgresql': 8,
    'mongodb': 10,
    'graphql': 15
  },
  
  // Full Stack Development
  'fullstack': {
    'react': 12,
    'node.js': 12,
    'typescript': 10,
    'mongodb': 8,
    'aws': 15,
    'docker': 12,
    'kubernetes': 15
  },
  
  // DevOps
  'devops': {
    'aws': 20,
    'docker': 16,
    'kubernetes': 22,
    'terraform': 18,
    'jenkins': 12,
    'ansible': 14,
    'prometheus': 15
  },
  
  // Data Science & AI
  'data': {
    'python': 12,
    'tensorflow': 25,
    'pytorch': 28,
    'scikit-learn': 15,
    'spark': 20,
    'sql': 10,
    'machine learning': 30
  },
  
  // Embedded Development
  'embedded': {
    'c++': 20,
    'embedded c': 25,
    'rtos': 22,
    'arm': 18,
    'linux': 15,
    'iot': 20,
    'microcontrollers': 15
  }
};

// Market demand by role (updated quarterly)
export const marketDemand = {
  'software developer': 'High',
  'frontend developer': 'High',
  'backend developer': 'High',
  'full stack developer': 'High',
  'devops engineer': 'High',
  'data scientist': 'High',
  'machine learning engineer': 'High',
  'mobile developer': 'Medium',
  'embedded developer': 'Medium',
  'ui developer': 'Medium',
  'qa engineer': 'Medium',
  'default': 'Medium'
} as const;

// Helper function to get role category
export function getRoleCategory(role: string): keyof typeof skillPremiums {
  role = role.toLowerCase();
  if (role.includes('front') || role.includes('ui')) return 'frontend';
  if (role.includes('back')) return 'backend';
  if (role.includes('full') || role.includes('stack')) return 'fullstack';
  if (role.includes('devops') || role.includes('cloud')) return 'devops';
  if (role.includes('data') || role.includes('ml') || role.includes('ai')) return 'data';
  if (role.includes('embedded') || role.includes('firmware')) return 'embedded';
  return 'fullstack'; // default to fullstack
}

// Helper function to get experience level
export function getExperienceLevel(years: number) {
  for (const [level, range] of Object.entries(experienceMultipliers)) {
    if (years >= range.min && years <= range.max) {
      return level;
    }
  }
  return 'senior'; // default to senior for very experienced professionals
}

// Helper function to get location multiplier
export function getLocationMultiplier(location: string): number {
  const normalizedLocation = location.toLowerCase();
  return locationMultipliers[normalizedLocation] || locationMultipliers.default;
}

// Helper function to get base salary for a role
export function getBaseSalary(role: string) {
  const normalizedRole = role.toLowerCase();
  return baseSalaries[normalizedRole] || baseSalaries['software developer'];
}

// Helper function to get relevant skill premiums
export function getSkillPremiums(role: string, skills: string[]) {
  const category = getRoleCategory(role);
  const relevantPremiums = skillPremiums[category];
  
  return skills
    .map(skill => ({
      skill,
      percentage: relevantPremiums[skill.toLowerCase()] || 0
    }))
    .filter(premium => premium.percentage > 0);
}

// Helper function to get market demand
export function getMarketDemand(role: string): 'High' | 'Medium' | 'Low' {
  const normalizedRole = role.toLowerCase();
  return marketDemand[normalizedRole] || marketDemand.default;
} 