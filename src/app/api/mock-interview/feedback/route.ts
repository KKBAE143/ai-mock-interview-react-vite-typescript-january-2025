import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { chatSession } from "@/scripts";

export async function POST(req: Request) {
  try {
    const { answer } = await req.json();

    if (!answer) {
      return NextResponse.json(
        { error: "No answer provided" },
        { status: 400 }
      );
    }

    const prompt = `
      You are an expert interviewer providing constructive feedback on interview answers.
      
      Evaluate this interview answer:
      "${answer}"
      
      Provide feedback in the following JSON format (keep the structure exactly as shown, just replace the content):
      {
        "feedback": "2-3 sentences of specific, constructive feedback",
        "score": <number between 0-100>,
        "strengths": [
          "Clear strength point 1",
          "Clear strength point 2"
        ],
        "improvements": [
          "Specific improvement 1",
          "Specific improvement 2"
        ]
      }

      Important: Return ONLY the JSON object, no other text or explanation.
    `;

    console.log("Sending prompt to Gemini:", prompt); // Debug log

    const result = await chatSession.sendMessage(prompt);
    const text = result.response.text();
    
    console.log("Raw Gemini response:", text); // Debug log

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON found in response:", text); // Debug log
      throw new Error("Invalid response format");
    }

    try {
      const feedback = JSON.parse(jsonMatch[0]);
      console.log("Parsed feedback:", feedback); // Debug log
      return NextResponse.json(feedback);
    } catch (error) {
      console.error("JSON parse error:", error);
      throw new Error("Failed to parse feedback JSON");
    }
  } catch (error) {
    console.error("Feedback generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate feedback" },
      { status: 500 }
    );
  }
} 