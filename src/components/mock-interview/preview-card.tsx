import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto relative overflow-hidden"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-b from-purple-100/20 to-transparent rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-t from-blue-100/20 to-transparent rounded-full blur-3xl -z-10" />

      {/* Header */}
      <motion.div 
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-gray-900">Mock Interview</h2>
        <motion.div
          className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Live Demo
        </motion.div>
      </motion.div>

      {/* Question with Refresh Button */}
      <motion.div 
        className="bg-gray-50 rounded-lg p-4 mb-6 relative group hover:shadow-md transition-shadow duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex justify-between items-start gap-4">
          <p className="text-gray-900 font-medium flex-grow">
            "{currentQuestion}"
          </p>
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={generateNewQuestion}
              className="shrink-0 text-gray-500 hover:text-gray-700 transition-colors"
              disabled={isRecording || isProcessing}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Answer Input */}
      <motion.div 
        className="space-y-2 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-700">Your Answer</label>
          <AnimatePresence>
            {answer && (
              <motion.span 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-xs text-gray-500"
              >
                {answer.length} characters
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <Textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={isTyping ? "Type your answer here..." : "Click Record or Type to start..."}
          className="min-h-[100px] resize-none transition-all duration-300 focus:shadow-md"
          disabled={isRecording || isProcessing}
        />
      </motion.div>

      {/* Status Indicators */}
      <AnimatePresence>
        {(isRecording || isTyping || isProcessing) && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 text-sm mb-4 overflow-hidden"
          >
            {isRecording && (
              <motion.span 
                className="flex items-center gap-2 text-purple-600"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <span className="relative flex h-2 w-2">
                  <motion.span 
                    className="absolute h-full w-full rounded-full bg-purple-400"
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.5, 1] 
                    }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <span className="rounded-full h-2 w-2 bg-purple-600" />
                </span>
                Recording...
              </motion.span>
            )}
            {isTyping && !isRecording && (
              <motion.span 
                className="text-blue-600"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                Type mode active
              </motion.span>
            )}
            {isProcessing && (
              <motion.span 
                className="flex items-center gap-2 text-blue-600"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <Loader2 className="h-3 w-3 animate-spin" />
                Processing...
              </motion.span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <motion.div 
        className="grid grid-cols-2 gap-3 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {!isTyping ? (
          <>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant={isRecording ? "destructive" : "outline"}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessing}
                className="w-full flex items-center gap-2 transition-all duration-300"
              >
                <Mic className="w-4 h-4" />
                {isRecording ? "Stop" : "Record"}
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                onClick={startTyping}
                disabled={isProcessing || isRecording}
                className="w-full flex items-center gap-2 transition-all duration-300"
              >
                <MessageSquare className="w-4 h-4" />
                Type
              </Button>
            </motion.div>
          </>
        ) : (
          <>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                onClick={() => setIsTyping(false)}
                disabled={isProcessing}
                className="w-full flex items-center gap-2 transition-all duration-300"
              >
                <Mic className="w-4 h-4" />
                Switch to Record
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="default"
                onClick={handleSubmit}
                disabled={isProcessing || !answer.trim()}
                className="w-full flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Submit
              </Button>
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Feedback Section */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="border-t pt-4"
          >
            <motion.div 
              className="flex items-center justify-between mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="font-semibold text-gray-900">Feedback</h3>
              <motion.div 
                className="flex items-center gap-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                <span className="text-sm text-gray-600">Score:</span>
                <span className={`text-lg font-bold ${
                  feedback.score >= 60 ? 'text-green-600' : 
                  feedback.score >= 40 ? 'text-amber-600' : 
                  'text-red-600'
                }`}>
                  {feedback.score}/100
                </span>
              </motion.div>
            </motion.div>

            <motion.p 
              className="text-gray-700 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {feedback.feedback}
            </motion.p>

            <motion.div 
              className={`${feedback.strengths?.length > 0 ? 'grid grid-cols-2' : ''} gap-4`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {feedback.strengths?.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Strengths</h4>
                  <ul className="space-y-2">
                    {feedback.strengths.map((strength: string, index: number) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="flex items-start gap-2 text-sm text-gray-700"
                      >
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                        {strength}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className={`${!feedback.strengths?.length ? 'w-full' : ''}`}>
                <h4 className="font-medium text-gray-900 mb-2">Areas to Improve</h4>
                <ul className="space-y-2">
                  {feedback.improvements.map((improvement: string, index: number) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      {improvement}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 