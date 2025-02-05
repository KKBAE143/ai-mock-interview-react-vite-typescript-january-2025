import { NextResponse } from "next/server";
import { ElevenLabsClient } from "elevenlabs";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

// Voice IDs for different languages with Indian voices
const VOICE_IDS: { [key: string]: string } = {
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

  // Adjust settings for specific languages if needed
  const languageSettings: { [key: string]: typeof defaultSettings } = {
    hi: { ...defaultSettings, stability: 0.8 },
    te: { ...defaultSettings, stability: 0.8 },
    ta: { ...defaultSettings, stability: 0.8 },
    ml: { ...defaultSettings, stability: 0.8 },
    kn: { ...defaultSettings, stability: 0.8 },
  };

  return languageSettings[language] || defaultSettings;
};

export async function POST(request: Request) {
  try {
    const { text, language = 'en' } = await request.json();

    if (!ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: "ElevenLabs API key not configured" },
        { status: 500 }
      );
    }

    // Initialize ElevenLabs client with API key
    const client = new ElevenLabsClient({
      apiKey: ELEVENLABS_API_KEY,
    });

    const voiceId = VOICE_IDS[language] || VOICE_IDS.en;
    const voiceSettings = getVoiceSettings(language);

    // Use the SDK to convert text to speech
    const audioBuffer = await client.textToSpeech.convert(voiceId, {
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: voiceSettings,
      output_format: "mp3_44100_128",
    });

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("Text-to-speech error:", error);
    return NextResponse.json(
      { error: "Failed to process text-to-speech request" },
      { status: 500 }
    );
  }
} 