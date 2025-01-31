import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Send, ThumbsUp, AlertCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { chatSession } from "@/scripts";
import { toast } from "sonner";

interface CompanyMockInterviewProps {
  companyProfile: any;
  onBack: () => void;
}

interface InterviewQuestion {
  id: number;
  question: string;
  answer?: string;
  feedback?: string;
  score?: number;
}

interface OverallFeedback {
  overallFeedback: string;
  averageScore: number;
  strengths: string[];
  areasToImprove: string[];
  nextSteps: string[];
  cultureFit?: string;
}

export function CompanyMockInterview({ companyProfile, onBack }: CompanyMockInterviewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [userAnswer, setUserAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [overallFeedback, setOverallFeedback] = useState<OverallFeedback>({
    overallFeedback: "",
    averageScore: 0,
    strengths: [],
    areasToImprove: [],
    nextSteps: []
  });

  // Generate interview questions based on company profile
  const generateQuestions = async () => {
    setIsLoading(true);
    try {
      const prompt = `
        Generate 5 interview questions for ${companyProfile.name} for the position of ${companyProfile.jobRole}.
        
        Company Context:
        - Industry: ${companyProfile.industry}
        - Interview Style: ${companyProfile.interviewStyle}
        - Technical Stack: ${companyProfile.technicalStack?.join(", ") || "Not specified"}
        - Company Values: ${companyProfile.culture.values.join(", ")}
        - Work Environment: ${companyProfile.culture.environment}
        
        Requirements:
        1. Mix of technical and behavioral questions
        2. Questions should align with company values
        3. Include role-specific scenarios
        4. Focus on both skills and cultural fit
        
        Return ONLY a JSON array in this exact format (no additional text):
        [
          {
            "id": 1,
            "question": "First question text"
          },
          {
            "id": 2,
            "question": "Second question text"
          }
          ... (total 5 questions)
        ]
      `;

      const result = await chatSession.sendMessage(prompt);
      
      // Extract JSON from the response
      const jsonMatch = result.response.text().match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("Invalid response format");
      }
      
      const generatedQuestions = JSON.parse(jsonMatch[0]);
      
      // Validate the questions array
      if (!Array.isArray(generatedQuestions) || generatedQuestions.length !== 5) {
        throw new Error("Invalid number of questions generated");
      }

      // Validate each question object
      const validQuestions = generatedQuestions.every(q => 
        typeof q === 'object' &&
        typeof q.id === 'number' &&
        typeof q.question === 'string' &&
        q.question.trim().length > 0
      );

      if (!validQuestions) {
        throw new Error("Invalid question format");
      }

      setQuestions(generatedQuestions);
      toast.success("Interview questions generated successfully!");
    } catch (error) {
      console.error("Error generating questions:", error);
      toast.error("Failed to generate interview questions. Please try again.");
      // Set some default questions as fallback
      setQuestions([
        {
          id: 1,
          question: `Tell me about your experience with ${companyProfile.technicalStack?.[0] || 'relevant technologies'}.`
        },
        {
          id: 2,
          question: `How do you align with our company value of ${companyProfile.culture.values[0]}?`
        },
        {
          id: 3,
          question: "Describe a challenging project you've worked on and how you handled it."
        },
        {
          id: 4,
          question: "How do you approach learning new technologies or methodologies?"
        },
        {
          id: 5,
          question: "Where do you see yourself professionally in the next few years?"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize questions when component mounts
  useEffect(() => {
    generateQuestions();
  }, []); // Empty dependency array for initialization

  // Submit answer and get feedback
  const submitAnswer = async () => {
    if (!userAnswer.trim()) {
      toast.error("Please provide an answer");
      return;
    }

    setIsLoading(true);
    try {
      const currentQuestion = questions[currentQuestionIndex];
      const prompt = `
        Evaluate this interview answer for ${companyProfile.name}.
        
        Question: "${currentQuestion.question}"
        Answer: "${userAnswer}"
        
        Company Context:
        - Industry: ${companyProfile.industry}
        - Values: ${companyProfile.culture.values.join(", ")}
        - Work Style: ${companyProfile.culture.workStyle}
        
        Provide a JSON response with this EXACT structure (replace content only):
        {
          "feedback": "2-3 sentences of specific, constructive feedback",
          "score": 75,
          "strengths": [
            "Clear strength point 1",
            "Clear strength point 2"
          ],
          "improvements": [
            "Specific improvement 1",
            "Specific improvement 2"
          ]
        }
      `;

      const result = await chatSession.sendMessage(prompt);
      
      // Extract JSON from the response
      const jsonMatch = result.response.text().match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Invalid response format");
      }
      
      let feedback;
      try {
        feedback = JSON.parse(jsonMatch[0]);
      } catch (error) {
        console.error("JSON parse error:", error);
        throw new Error("Failed to parse feedback JSON");
      }

      // Validate feedback object structure
      const requiredFields = {
        feedback: 'string',
        score: 'number',
        strengths: 'array',
        improvements: 'array'
      };

      for (const [field, type] of Object.entries(requiredFields)) {
        if (!feedback[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
        if (type === 'array' && !Array.isArray(feedback[field])) {
          throw new Error(`${field} must be an array`);
        }
        if (type !== 'array' && typeof feedback[field] !== type) {
          throw new Error(`${field} must be a ${type}`);
        }
      }

      // Additional validation
      if (feedback.score < 0 || feedback.score > 100) {
        throw new Error("Score must be between 0 and 100");
      }

      if (!feedback.strengths.length || !feedback.improvements.length) {
        throw new Error("Strengths and improvements arrays cannot be empty");
      }

      // Format feedback message with clear sections
      const formattedFeedback = `
Feedback: ${feedback.feedback}

Key Strengths:
${feedback.strengths.map(s => `• ${s}`).join('\n')}

Areas to Improve:
${feedback.improvements.map(i => `• ${i}`).join('\n')}

Score: ${Math.round(feedback.score)}/100
      `.trim();

      // Update question with answer and feedback
      const updatedQuestions = [...questions];
      updatedQuestions[currentQuestionIndex] = {
        ...currentQuestion,
        answer: userAnswer,
        feedback: formattedFeedback,
        score: Math.round(feedback.score)
      };
      setQuestions(updatedQuestions);

      // Move to next question or complete interview
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setUserAnswer("");
        toast.success("Answer evaluated! Moving to next question.");
      } else {
        toast.success("Interview complete! Generating final feedback...");
        await generateOverallFeedback(updatedQuestions);
        setIsComplete(true);
      }
    } catch (error) {
      console.error("Error evaluating answer:", error);
      toast.error("Failed to evaluate answer. Using basic feedback.");
      
      // Provide meaningful fallback feedback
      const basicFeedback = `
Thank you for your answer. Here's some general feedback:

Key Strengths:
• Provided a detailed response
• Addressed the question directly

Areas to Improve:
• Consider providing more specific examples
• Align response more closely with company values

Score: 70/100 (default score)
      `.trim();

      const updatedQuestions = [...questions];
      updatedQuestions[currentQuestionIndex] = {
        ...questions[currentQuestionIndex],
        answer: userAnswer,
        feedback: basicFeedback,
        score: 70
      };
      setQuestions(updatedQuestions);
      
      // Move to next question or complete
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setUserAnswer("");
      } else {
        await generateOverallFeedback(updatedQuestions);
        setIsComplete(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Generate overall feedback at the end
  const generateOverallFeedback = async (completedQuestions: InterviewQuestion[]) => {
    try {
      // Calculate average score first
      const totalScore = completedQuestions.reduce((acc, q) => acc + (q.score || 0), 0);
      const averageScore = Math.round(totalScore / completedQuestions.length);

      const prompt = `
        Generate comprehensive feedback for a mock interview with ${companyProfile.name}.

        Company Details:
        - Industry: ${companyProfile.industry}
        - Values: ${companyProfile.culture.values.join(", ")}
        - Work Style: ${companyProfile.culture.workStyle}
        - Interview Style: ${companyProfile.interviewStyle}

        Interview Performance:
        - Average Score: ${averageScore}%
        ${completedQuestions.map((q, index) => `
        Question ${index + 1}: ${q.question}
        Answer: ${q.answer}
        Score: ${q.score}/100
        `).join('\n')}

        Provide a detailed evaluation focusing on:
        1. Overall performance analysis
        2. Key strengths shown (3-4 points)
        3. Areas needing improvement (3-4 points)
        4. Specific next steps for preparation
        5. Cultural fit assessment

        Format the response EXACTLY as follows (keep the structure, replace the content):
        {
          "overallFeedback": "Clear analysis of performance, 2-3 sentences",
          "averageScore": ${averageScore},
          "strengths": [
            "Specific strength point 1",
            "Specific strength point 2",
            "Specific strength point 3"
          ],
          "areasToImprove": [
            "Specific improvement area 1",
            "Specific improvement area 2",
            "Specific improvement area 3"
          ],
          "nextSteps": [
            "Actionable next step 1",
            "Actionable next step 2",
            "Actionable next step 3"
          ],
          "cultureFit": "Assessment of cultural alignment with ${companyProfile.name}"
        }
      `;

      const result = await chatSession.sendMessage(prompt);
      
      // Extract JSON from the response
      const jsonMatch = result.response.text().match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Invalid response format");
      }
      
      let feedback;
      try {
        feedback = JSON.parse(jsonMatch[0]);
      } catch (error) {
        console.error("JSON parse error:", error);
        throw new Error("Failed to parse feedback JSON");
      }

      // Validate the feedback object
      if (!feedback || typeof feedback !== 'object') {
        throw new Error("Invalid feedback object");
      }

      // Ensure all required fields are present and have correct types
      const requiredFields = {
        overallFeedback: 'string',
        averageScore: 'number',
        strengths: 'array',
        areasToImprove: 'array',
        nextSteps: 'array'
      };

      for (const [field, type] of Object.entries(requiredFields)) {
        if (!feedback[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
        if (type === 'array' && !Array.isArray(feedback[field])) {
          throw new Error(`${field} must be an array`);
        }
        if (type !== 'array' && typeof feedback[field] !== type) {
          throw new Error(`${field} must be a ${type}`);
        }
      }

      // Ensure arrays have content
      ['strengths', 'areasToImprove', 'nextSteps'].forEach(field => {
        if (!feedback[field].length) {
          throw new Error(`${field} array cannot be empty`);
        }
      });

      // If we get here, the feedback is valid
      setOverallFeedback({
        ...feedback,
        averageScore: Math.round(feedback.averageScore) // Ensure score is rounded
      });

      toast.success("Interview feedback generated successfully!");
    } catch (error) {
      console.error("Error generating overall feedback:", error);
      toast.error("Failed to generate detailed feedback");
      
      // Provide meaningful fallback feedback
      const averageScore = Math.round(
        completedQuestions.reduce((acc, q) => acc + (q.score || 0), 0) / completedQuestions.length
      );

      setOverallFeedback({
        overallFeedback: `You've completed the mock interview for ${companyProfile.name}. Your responses have been recorded and scored.`,
        averageScore,
        strengths: [
          "Completed all interview questions",
          `Demonstrated interest in ${companyProfile.name}`,
          "Provided detailed responses to questions"
        ],
        areasToImprove: [
          "Continue practicing with more mock interviews",
          "Focus on providing specific examples",
          "Research more about company values and culture"
        ],
        nextSteps: [
          "Review your answers and the feedback provided",
          `Research more about ${companyProfile.name}'s technical requirements`,
          "Practice answering similar questions with different examples",
          "Focus on aligning responses with company values"
        ],
        cultureFit: `Consider how your experiences and values align with ${companyProfile.name}'s culture and values: ${companyProfile.culture.values.join(", ")}`
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Company Profile
      </Button>

      <Card className="p-6">
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              Mock Interview: {companyProfile.name}
            </h2>
            <div className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>

          {isComplete ? (
            <div className="space-y-6">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <ThumbsUp className="h-5 w-5" />
                Interview Complete
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Overall Performance</h4>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">{overallFeedback.overallFeedback}</p>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Average Score:</span>
                      <span className="text-muted-foreground">{overallFeedback.averageScore}%</span>
                    </div>
                    {overallFeedback.cultureFit && (
                      <div className="mt-2">
                        <span className="font-medium">Culture Fit:</span>
                        <p className="text-muted-foreground mt-1">{overallFeedback.cultureFit}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Key Strengths</h4>
                    <ul className="space-y-2">
                      {overallFeedback.strengths.map((strength, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <ThumbsUp className="h-5 w-5 text-green-500" />
                          <span className="text-muted-foreground">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Areas to Improve</h4>
                    <ul className="space-y-2">
                      {overallFeedback.areasToImprove.map((area, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-primary" />
                          <span className="text-muted-foreground">{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Next Steps</h4>
                  <ul className="space-y-2">
                    {overallFeedback.nextSteps.map((step, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-medium">
                          {index + 1}
                        </div>
                        <span className="text-muted-foreground">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4">
                  <Button onClick={onBack} className="w-full flex items-center justify-center gap-2">
                    <ArrowLeft className="h-5 w-5" />
                    Return to Company Profile
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.length > 0 ? (
                <>
                  <div className="space-y-4">
                    <h3 className="font-medium">Question:</h3>
                    <p>{questions[currentQuestionIndex].question}</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Your Answer:</h3>
                    <Textarea
                      placeholder="Type your answer here..."
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      rows={6}
                    />
                  </div>

                  <Button
                    onClick={submitAnswer}
                    disabled={isLoading || !userAnswer.trim()}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      "Evaluating..."
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Submit Answer
                      </>
                    )}
                  </Button>

                  {questions[currentQuestionIndex].feedback && (
                    <Alert>
                      <AlertCircle className="h-5 w-5" />
                      <AlertDescription>
                        {questions[currentQuestionIndex].feedback}
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading questions...</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 