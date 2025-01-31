import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { TooltipButton } from "./tooltip-button";
import { Volume2, VolumeX, CheckCircle2 } from "lucide-react";
import { RecordAnswer } from "./record-answer";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "./ui/button";

interface QuestionSectionProps {
  questions: { question: string; answer: string }[];
}

export const QuestionSection = ({ questions }: QuestionSectionProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWebCam, setIsWebCam] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const { interviewId } = useParams();

  const [currentSpeech, setCurrentSpeech] =
    useState<SpeechSynthesisUtterance | null>(null);

  const handlePlayQuestion = (qst: string) => {
    if (isPlaying && currentSpeech) {
      // stop the speech if already playing
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentSpeech(null);
    } else {
      if ("speechSynthesis" in window) {
        const speech = new SpeechSynthesisUtterance(qst);
        window.speechSynthesis.speak(speech);
        setIsPlaying(true);
        setCurrentSpeech(speech);

        // handle the speech end
        speech.onend = () => {
          setIsPlaying(false);
          setCurrentSpeech(null);
        };
      }
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
              {tab.question}
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
                onClick={() => handlePlayQuestion(tab.question)}
              />
            </div>

            <RecordAnswer
              question={tab}
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
