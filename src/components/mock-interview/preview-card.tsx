import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Mic, MessageSquare, Check, Brain, Building2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface PreviewCardProps {
  onSubmitAnswer: (answer: string) => Promise<void>;
}

export function PreviewCard({ onSubmitAnswer }: PreviewCardProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [answer, setAnswer] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

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

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
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
      await onSubmitAnswer(answer);
      setAnswer("");
      setIsTyping(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 max-w-md mx-auto border border-gray-200">
      {/* Live Demo Badge */}
      <div className="absolute -top-3 -right-3">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-lg flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          Live Demo
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Mock Interview</h3>
            <p className="text-sm text-gray-600">AI-Powered Practice Session</p>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-gray-50 rounded-xl p-5 space-y-3 border border-gray-100">
          <p className="text-sm text-gray-600 font-medium">Interview Question:</p>
          <p className="text-base text-gray-900 font-medium leading-relaxed">
            "Tell me about a challenging project you've worked on and how you overcame obstacles."
          </p>
        </div>

        {/* Answer Input Area */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="answer" className="text-sm font-medium text-gray-700">
              Your Answer
            </label>
            {isTyping && (
              <span className="text-xs text-gray-500">
                {answer ? `${answer.length} characters` : 'Start typing or recording'}
              </span>
            )}
          </div>
          
          <Textarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer or use the record button..."
            className="min-h-[120px] resize-y"
            disabled={isRecording || isProcessing}
          />

          {/* Recording Status */}
          {isRecording && (
            <div className="flex items-center gap-2 text-sm text-purple-600">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
              </span>
              Recording in progress...
            </div>
          )}

          {/* Processing Status */}
          {isProcessing && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <Loader2 className="h-3 w-3 animate-spin" />
              Processing your speech...
            </div>
          )}
        </div>

        {/* Response Options */}
        <div className="grid grid-cols-2 gap-3">
          {isRecording ? (
            <Button 
              variant="outline" 
              className="group bg-white hover:bg-red-50 border-2 border-red-200 hover:border-red-300 transition-all duration-300"
              onClick={stopRecording}
              disabled={isProcessing}
            >
              <div className="flex items-center justify-center gap-2 py-2">
                <div className="p-1.5 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                  <Mic className="w-4 h-4 text-red-600" />
                </div>
                <span className="font-medium text-red-600">Stop</span>
              </div>
            </Button>
          ) : (
            <Button 
              variant="outline" 
              className="group bg-white hover:bg-purple-50 border-2 hover:border-purple-200 transition-all duration-300"
              onClick={startRecording}
              disabled={isProcessing}
            >
              <div className="flex items-center justify-center gap-2 py-2">
                <div className="p-1.5 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <Mic className="w-4 h-4 text-purple-600" />
                </div>
                <span className="font-medium">Record</span>
              </div>
            </Button>
          )}

          <Button 
            variant="outline"
            className="group bg-white hover:bg-blue-50 border-2 hover:border-blue-200 transition-all duration-300"
            onClick={() => setIsTyping(true)}
            disabled={isProcessing || isRecording}
          >
            <div className="flex items-center justify-center gap-2 py-2">
              <div className="p-1.5 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <MessageSquare className="w-4 h-4 text-blue-600" />
              </div>
              <span className="font-medium">Type</span>
            </div>
          </Button>
        </div>

        {/* Tips */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="p-1 bg-green-100 rounded-lg">
              <Check className="w-3 h-3 text-green-600" />
            </div>
            <span>Get instant AI feedback</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="p-1 bg-blue-100 rounded-lg">
              <Check className="w-3 h-3 text-blue-600" />
            </div>
            <span>Practice with real scenarios</span>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />
    </div>
  );
} 