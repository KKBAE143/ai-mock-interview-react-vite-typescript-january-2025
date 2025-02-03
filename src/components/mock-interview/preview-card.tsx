import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, MessageSquare, Check, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { getFeedback } from "@/api/feedback";

const INTERVIEW_QUESTIONS = [
  "Tell me about a challenging project you've worked on and how you overcame obstacles.",
  "Describe a situation where you had to learn a new technology quickly. How did you approach it?",
  "Can you explain a time when you had to deal with a difficult team member?",
  "What's the most complex technical problem you've solved? How did you solve it?",
  "Tell me about a time when you had to make a difficult decision with limited information.",
  "Describe a project where you had to meet a tight deadline. How did you manage it?",
  "How do you handle disagreements with team members about technical decisions?",
  "Tell me about a time when you received critical feedback. How did you respond?",
  "Describe a situation where you had to optimize code performance. What was your approach?",
  "How do you stay updated with the latest technology trends in your field?",
  "Tell me about a time when you had to lead a project. What challenges did you face?",
  "Describe a situation where you had to balance quality with meeting deadlines.",
  "How do you approach debugging complex issues in production?",
  "Tell me about a time when you had to refactor legacy code. What was your strategy?",
  "Describe a situation where you had to explain technical concepts to non-technical stakeholders."
];

interface PreviewCardProps {
  onSubmitAnswer: (answer: string) => Promise<void>;
}

export function PreviewCard({ onSubmitAnswer }: PreviewCardProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [answer, setAnswer] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(
    INTERVIEW_QUESTIONS[Math.floor(Math.random() * INTERVIEW_QUESTIONS.length)]
  );
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  const generateNewQuestion = () => {
    let newQuestion = currentQuestion;
    while (newQuestion === currentQuestion) {
      newQuestion = INTERVIEW_QUESTIONS[Math.floor(Math.random() * INTERVIEW_QUESTIONS.length)];
    }
    setCurrentQuestion(newQuestion);
    setAnswer("");
    setFeedback(null);
  };

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined' && 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join(' ');
        setAnswer(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: "Error",
          description: "Failed to recognize speech. Please try again or use the type option.",
          variant: "destructive",
        });
        stopRecording();
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      if (!recognitionRef.current) {
        throw new Error('Speech recognition not supported');
      }

      await navigator.mediaDevices.getUserMedia({ audio: true });
      recognitionRef.current.start();
      setIsRecording(true);
      setIsTyping(true);
      
      toast({
        title: "Recording Started",
        description: "Speak clearly into your microphone. Click stop when finished.",
        variant: "default",
      });
    } catch (error) {
      console.error("Microphone access error:", error);
      toast({
        title: "Error",
        description: "Failed to access microphone. Please check your permissions and try again.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = async () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      
      // Wait a brief moment for the final transcript to be processed
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (answer.trim()) {
        // Automatically submit the answer
        handleSubmit();
      } else {
        toast({
          title: "No Answer Detected",
          description: "Please try recording again or switch to typing mode.",
          variant: "destructive",
        });
      }
    }
  };

  const startTyping = () => {
    setIsTyping(true);
    setIsRecording(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    toast({
      title: "Type Mode",
      description: "You can now type your answer. Click Submit when ready.",
      variant: "default",
    });
  };

  const handleSubmit = async () => {
    if (!answer.trim()) {
      toast({
        title: "Error",
        description: "Please provide an answer before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      console.log("Submitting answer:", answer); // Debug log
      
      const feedbackData = await getFeedback(answer);
      console.log("Feedback data:", feedbackData); // Debug log

      setFeedback(feedbackData);
      
      // Only call onSubmitAnswer after we have feedback
      await onSubmitAnswer(answer);
      
      toast({
        title: "Success",
        description: "Your answer has been processed. Check the feedback below.",
        variant: "default",
      });
      
      // Don't clear the answer immediately so user can see their response with feedback
      setTimeout(() => {
        setAnswer("");
        setIsTyping(false);
      }, 3000);
    } catch (error) {
      console.error("Feedback error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process your answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Mock Interview</h2>
        <div className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium">
          Live Demo
        </div>
      </div>

      {/* Question with Refresh Button */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-start gap-4">
          <p className="text-gray-900 font-medium flex-grow">
            "{currentQuestion}"
          </p>
          <Button
            variant="ghost"
            size="icon"
            onClick={generateNewQuestion}
            className="shrink-0 text-gray-500 hover:text-gray-700"
            disabled={isRecording || isProcessing}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Answer Input */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-700">Your Answer</label>
          {answer && <span className="text-xs text-gray-500">{answer.length} characters</span>}
        </div>
        <Textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={isTyping ? "Type your answer here..." : "Click Record or Type to start..."}
          className="min-h-[100px] resize-none"
          disabled={isRecording || isProcessing}
        />
      </div>

      {/* Status Indicators */}
      {(isRecording || isTyping || isProcessing) && (
        <div className="flex items-center gap-2 text-sm mb-4">
          {isRecording && (
            <span className="flex items-center gap-2 text-purple-600">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="rounded-full h-2 w-2 bg-purple-600"></span>
              </span>
              Recording...
            </span>
          )}
          {isTyping && !isRecording && (
            <span className="text-blue-600">Type mode active</span>
          )}
          {isProcessing && (
            <span className="flex items-center gap-2 text-blue-600">
              <Loader2 className="h-3 w-3 animate-spin" />
              Processing...
            </span>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {!isTyping ? (
          <>
            <Button
              variant={isRecording ? "destructive" : "outline"}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
              className="flex items-center gap-2"
            >
              <Mic className="w-4 h-4" />
              {isRecording ? "Stop" : "Record"}
            </Button>
            <Button
              variant="outline"
              onClick={startTyping}
              disabled={isProcessing || isRecording}
              className="flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Type
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={() => setIsTyping(false)}
              disabled={isProcessing}
              className="flex items-center gap-2"
            >
              <Mic className="w-4 h-4" />
              Switch to Record
            </Button>
            <Button
              variant="default"
              onClick={handleSubmit}
              disabled={isProcessing || !answer.trim()}
              className="bg-gradient-to-r from-purple-600 to-indigo-600"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              Submit
            </Button>
          </>
        )}
      </div>

      {/* Feedback Section */}
      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t pt-4"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Feedback</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Score:</span>
              <span className={`text-lg font-bold ${feedback.score >= 60 ? 'text-green-600' : feedback.score >= 40 ? 'text-amber-600' : 'text-red-600'}`}>
                {feedback.score}/100
              </span>
            </div>
          </div>

          <p className="text-gray-700 mb-4">{feedback.feedback}</p>

          <div className={`${feedback.strengths?.length > 0 ? 'grid grid-cols-2' : ''} gap-4`}>
            {feedback.strengths?.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Strengths</h4>
                <ul className="space-y-2">
                  {feedback.strengths.map((strength: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className={`${!feedback.strengths?.length ? 'w-full' : ''}`}>
              <h4 className="font-medium text-gray-900 mb-2">Areas to Improve</h4>
              <ul className="space-y-2">
                {feedback.improvements.map((improvement: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
} 