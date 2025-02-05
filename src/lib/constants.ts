export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi (हिन्दी)' },
  { code: 'te', name: 'Telugu (తెలుగు)' },
  { code: 'ta', name: 'Tamil (தமிழ்)' },
  { code: 'ml', name: 'Malayalam (മലയാളം)' },
  { code: 'kn', name: 'Kannada (ಕನ್ನಡ)' },
  { code: 'bn', name: 'Bengali (বাংলা)' },
  { code: 'gu', name: 'Gujarati (ગુજરાતી)' },
  { code: 'mr', name: 'Marathi (मराठी)' },
  { code: 'pa', name: 'Punjabi (ਪੰਜਾਬੀ)' },
  { code: 'ur', name: 'Urdu (اردو)' },
  { code: 'or', name: 'Odia (ଓଡ଼ିଆ)' }
] as const;

export const LANGUAGE_CODES = {
  ENGLISH: 'en',
  HINDI: 'hi',
  TELUGU: 'te',
  TAMIL: 'ta',
  MALAYALAM: 'ml',
  KANNADA: 'kn',
  BENGALI: 'bn',
  GUJARATI: 'gu',
  MARATHI: 'mr',
  PUNJABI: 'pa',
  URDU: 'ur',
  ODIA: 'or'
} as const; 