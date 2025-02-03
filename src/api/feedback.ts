import { chatSession } from "@/scripts";

export async function getFeedback(answer: string) {
  try {
    if (!answer) {
      throw new Error("No answer provided");
    }

    // Validate minimum answer length and content
    if (answer.length < 50) {
      return {
        feedback: "Your answer is too brief. A good interview response should be detailed and comprehensive, typically at least a few sentences long.",
        score: 0,
        strengths: [],
        improvements: [
          "Provide a much more detailed response",
          "Include specific examples and context",
          "Structure your answer using the STAR method (Situation, Task, Action, Result)"
        ]
      };
    }

    const prompt = `
      You are a strict technical interviewer providing detailed, critical feedback on interview answers.
      The question asked was: "Tell me about a challenging project you've worked on and how you overcame obstacles."
      
      Evaluate this candidate's answer with high standards:
      "${answer}"
      
      Scoring criteria:
      - 0-20: Incomplete/irrelevant answer
      - 21-40: Basic answer lacking detail
      - 41-60: Adequate answer with some specifics
      - 61-80: Good answer with clear examples
      - 81-100: Excellent, comprehensive answer with specific details, challenges, solutions, and outcomes
      
      Consider:
      1. Does the answer describe a specific project?
      2. Are the challenges clearly explained?
      3. Are the solutions and actions detailed?
      4. Is there a clear outcome or result?
      5. Does it demonstrate problem-solving skills?
      
      Provide feedback in this JSON format:
      {
        "feedback": "3-4 sentences of specific, critical feedback highlighting major strengths and weaknesses",
        "score": <number between 0-100 based on the strict criteria above>,
        "strengths": [
          "Specific strength with example",
          "Specific strength with example"
        ],
        "improvements": [
          "Detailed suggestion for improvement",
          "Detailed suggestion for improvement",
          "Detailed suggestion for improvement"
        ]
      }

      Be strict and honest. If the answer is poor, the score should reflect that. Return ONLY the JSON object.
    `;

    console.log("Sending prompt to Gemini:", prompt);

    const result = await chatSession.sendMessage(prompt);
    const text = result.response.text();
    
    console.log("Raw Gemini response:", text);

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON found in response:", text);
      throw new Error("Invalid response format");
    }

    try {
      const feedback = JSON.parse(jsonMatch[0]);
      console.log("Parsed feedback:", feedback);
      return feedback;
    } catch (error) {
      console.error("JSON parse error:", error);
      throw new Error("Failed to parse feedback JSON");
    }
  } catch (error) {
    console.error("Feedback generation error:", error);
    throw error;
  }
} 