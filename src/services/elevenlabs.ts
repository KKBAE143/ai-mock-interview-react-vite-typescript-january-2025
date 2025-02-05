import { ElevenLabsClient } from "elevenlabs";

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;

// Voice IDs for different languages with Indian voices
export const VOICE_IDS: { [key: string]: string } = {
  en: "21m00Tcm4TlvDq8ikWAM", // English - Rachel
  hi: "pNInz6obpgDQGcFmaJgB", // Hindi
  te: "IKne3meq5aSn9XLyUdCD", // Telugu
  ta: "XB0fDUnXU5powFXDhCwa", // Tamil
  ml: "ThT5KcBeYPX3keUQqHPh", // Malayalam
  kn: "AZnzlk1XvdvUeBnXmlld", // Kannada
  bn: "pMsXgVXv3BLzUgYF7YG4", // Bengali
  gu: "Yko7PKHZNXotIFUBG7I1", // Gujarati
  mr: "t0jbNlBVZ17f02VDIeMI", // Marathi
  pa: "7GOCaJ7TTkJOIxVR9tBi", // Punjabi
  ur: "ErXwobaYiN019PkySvjV", // Urdu
  or: "MF3mGyEYCl7XYWbV9V6O", // Odia
};

// Voice settings for different languages
const getVoiceSettings = (language: string) => {
  const defaultSettings = {
    stability: 0.75,
    similarity_boost: 0.75,
    style: 0.5,
    use_speaker_boost: true,
  };

  const languageSettings: { [key: string]: typeof defaultSettings } = {
    hi: { ...defaultSettings, stability: 0.8 },
    te: { ...defaultSettings, stability: 0.8 },
    ta: { ...defaultSettings, stability: 0.8 },
    ml: { ...defaultSettings, stability: 0.8 },
    kn: { ...defaultSettings, stability: 0.8 },
  };

  return languageSettings[language] || defaultSettings;
};

// Initialize ElevenLabs client
const client = new ElevenLabsClient({
  apiKey: ELEVENLABS_API_KEY,
});

export const textToSpeech = async (text: string, language: string = 'en') => {
  try {
    if (!ELEVENLABS_API_KEY) {
      throw new Error("ElevenLabs API key not configured");
    }

    const voiceId = VOICE_IDS[language] || VOICE_IDS.en;
    const voiceSettings = getVoiceSettings(language);

    // Make a direct API call instead of using the SDK
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: voiceSettings
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail?.message || 'Failed to generate speech');
    }

    const audioBlob = await response.blob();
    return audioBlob;
  } catch (error) {
    console.error("Text-to-speech error:", error);
    throw error;
  }
}; 