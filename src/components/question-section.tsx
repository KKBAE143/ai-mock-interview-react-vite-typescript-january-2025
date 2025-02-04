import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { TooltipButton } from "./tooltip-button";
import { Volume2, VolumeX, CheckCircle2, Globe } from "lucide-react";
import { RecordAnswer } from "./record-answer";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "./ui/button";
import { Question } from "@/types";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";
import { toast } from "sonner";
import { textToSpeech } from "@/services/elevenlabs";

interface QuestionSectionProps {
  questions: Question[];
  language?: string;
}

export const QuestionSection = ({ questions, language = 'en' }: QuestionSectionProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWebCam, setIsWebCam] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const navigate = useNavigate();
  const { interviewId } = useParams();

  const handlePlayQuestion = async (qst: string) => {
    try {
      if (isPlaying && audioRef) {
        audioRef.pause();
        audioRef.currentTime = 0;
        setIsPlaying(false);
        return;
      }

      setIsPlaying(true);
      const audioBlob = await textToSpeech(qst, showTranslation ? language : 'en');
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      setAudioRef(audio);
      
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
        toast.error("Failed to play audio. Please try again.");
      };

      await audio.play();
    } catch (error) {
      console.error('Speech playback error:', error);
      setIsPlaying(false);
      toast.error("Failed to generate speech. Please try again.");
    }
  };

  const handleQuestionAnswered = (question: string) => {
    setAnsweredQuestions(prev => new Set([...prev, question]));
  };

  const allQuestionsAnswered = questions.every(q => answeredQuestions.has(q.question));

  const handleFinish = () => {
    navigate(`/generate/feedback/${interviewId}`, { replace: true });
  };

  return (
    <div className="w-full min-h-96 border rounded-md p-4">
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowTranslation(!showTranslation)}
          className="flex items-center gap-2"
        >
          <Globe className="w-4 h-4" />
          {showTranslation ? "Show Original" : "Show Translation"}
        </Button>
      </div>

      <Tabs
        defaultValue={questions[0]?.question}
        className="w-full space-y-12"
        orientation="vertical"
      >
        <TabsList className="bg-transparent w-full flex flex-wrap items-center justify-start gap-4">
          {questions?.map((tab, i) => (
            <TabsTrigger
              className={cn(
                "data-[state=active]:bg-emerald-200 data-[state=active]:shadow-md text-xs px-2 flex items-center gap-2"
              )}
              key={tab.question}
              value={tab.question}
            >
              {`Question #${i + 1}`}
              {answeredQuestions.has(tab.question) && (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {questions?.map((tab, i) => (
          <TabsContent key={i} value={tab.question}>
            <p className="text-base text-left tracking-wide text-neutral-500">
              {showTranslation ? tab.questionTranslated : tab.question}
            </p>

            <div className="w-full flex items-center justify-end">
              <TooltipButton
                content={isPlaying ? "Stop" : "Start"}
                icon={
                  isPlaying ? (
                    <VolumeX className="min-w-5 min-h-5 text-muted-foreground" />
                  ) : (
                    <Volume2 className="min-w-5 min-h-5 text-muted-foreground" />
                  )
                }
                onClick={() => handlePlayQuestion(showTranslation ? tab.questionTranslated : tab.question)}
              />
            </div>

            <RecordAnswer
              question={{
                question: showTranslation ? tab.questionTranslated : tab.question,
                answer: showTranslation ? tab.answerTranslated : tab.answer
              }}
              isWebCam={isWebCam}
              setIsWebCam={setIsWebCam}
              onAnswerSaved={() => handleQuestionAnswered(tab.question)}
            />
          </TabsContent>
        ))}
      </Tabs>

      {allQuestionsAnswered && (
        <div className="mt-8 flex justify-center">
          <Button 
            onClick={handleFinish}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-lg flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            View Feedback
          </Button>
        </div>
      )}
    </div>
  );
};
