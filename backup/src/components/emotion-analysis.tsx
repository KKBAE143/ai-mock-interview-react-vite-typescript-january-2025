import React, { useEffect, useRef, useState, useCallback } from "react";
import * as faceapi from "face-api.js";
import { Card } from "@/components/ui/card";
import {
  AlertCircle,
  Smile,
  Frown,
  Meh,
  ThumbsUp,
  Eye,
  Activity,
  Brain,
  MessageSquare,
  Volume2,
  Mic,
  PauseCircle,
  AlertTriangle,
  Gauge,
  Briefcase,
  Star,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EmotionData {
  emotion: string;
  confidence: number;
  timestamp: number;
}

interface BodyLanguageData {
  posture: string;
  eyeContact: number;
  movement: string;
  engagement: number;
  confidence: number;
  clarity: number;
}

interface SpeechMetrics {
  pace: number;        // Words per minute
  volume: number;      // Volume level (0-100)
  clarity: number;     // Speech clarity score
}

interface InterviewMetrics {
  confidence: number;
  professionalism: number;
  overallScore: number;
}

interface FaceExpressions {
  neutral: number;
  happy: number;
  sad: number;
  angry: number;
  fearful: number;
  disgusted: number;
  surprised: number;
}

const ANALYSIS_INTERVAL = 1000; // Update every second for more stable readings
const CONFIDENCE_THRESHOLD = 0.2; // Higher threshold for more stable emotions

export function EmotionAnalysis() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [emotions, setEmotions] = useState<EmotionData[]>([]);
  const [bodyLanguage, setBodyLanguage] = useState<BodyLanguageData>({
    posture: "Excellent",
    eyeContact: 0,
    movement: "Steady",
    engagement: 0,
    confidence: 0,
    clarity: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [speechMetrics, setSpeechMetrics] = useState<SpeechMetrics>({
    pace: 0,
    volume: 0,
    clarity: 0,
  });
  const [interviewMetrics, setInterviewMetrics] = useState<InterviewMetrics>({
    confidence: 0,
    professionalism: 0,
    overallScore: 0,
  });
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadModels = async () => {
      try {
        if (!isMounted) return;
        setIsLoading(true);
        setError(null);

        // Use jsdelivr CDN with specific version for stability
        const modelPath = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.12/model';
        console.log('Loading models from:', modelPath);
        
        // Load models with proper error handling
        try {
          await faceapi.nets.tinyFaceDetector.loadFromUri(modelPath);
          console.log('✓ Loaded face detector model');
        } catch (e) {
          throw new Error('Failed to load face detector model');
        }

        try {
          await faceapi.nets.faceLandmark68Net.loadFromUri(modelPath);
          console.log('✓ Loaded face landmark model');
        } catch (e) {
          throw new Error('Failed to load face landmark model');
        }

        try {
          await faceapi.nets.faceExpressionNet.loadFromUri(modelPath);
          console.log('✓ Loaded face expression model');
        } catch (e) {
          throw new Error('Failed to load face expression model');
        }

        if (!isMounted) return;
        await initializeCamera();
        
        // Initialize audio after camera is ready
        await initializeAudioAnalysis();
        
      } catch (err) {
        console.error('Initialization error:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to initialize emotion analysis');
          setIsLoading(false);
        }
      }
    };

    const initializeCamera = async () => {
      try {
        if (!videoRef.current) {
          throw new Error('Video element not initialized');
        }

        // Request camera with lower resolution first for better compatibility
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user',
          }
        });

        if (!isMounted) return;

        // Set up video element
        const videoElement = videoRef.current;
        videoElement.srcObject = stream;
        videoElement.setAttribute('playsinline', 'true');
        
        // Wait for video to be ready
        await new Promise<void>((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            reject(new Error('Video initialization timeout'));
          }, 10000);

          videoElement.onloadedmetadata = () => {
            clearTimeout(timeoutId);
            videoElement.play()
              .then(resolve)
              .catch(reject);
          };
        });

        if (!isMounted) return;

        // Initialize canvas
        if (canvasRef.current && videoElement.videoWidth && videoElement.videoHeight) {
          const displaySize = {
            width: videoElement.videoWidth,
            height: videoElement.videoHeight
          };
          faceapi.matchDimensions(canvasRef.current, displaySize);
          console.log('✓ Canvas initialized:', displaySize);
        }

        setIsLoading(false);
        console.log('✓ Camera initialized successfully');
      } catch (error) {
        console.error('Camera initialization error:', error);
        let errorMessage = 'Failed to initialize camera';
        
        if (error instanceof Error) {
          if (error.name === 'NotAllowedError') {
            errorMessage = 'Camera access denied - please enable camera permissions and refresh';
          } else if (error.name === 'NotFoundError') {
            errorMessage = 'No camera found - please connect a camera and refresh';
          } else if (error.name === 'NotReadableError') {
            errorMessage = 'Camera is in use by another application - please close other apps using the camera';
          }
        }
        
        throw new Error(errorMessage);
      }
    };

    loadModels();

    return () => {
      isMounted = false;
      // Cleanup
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => {
          track.stop();
          console.log('Camera track stopped');
        });
      }
      if (audioContext) {
        audioContext.close();
        console.log('Audio context closed');
      }
    };
  }, []);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current || isLoading || error) {
      return;
    }

    let animationFrameId: number;
    let isAnalyzing = false;

    const analyzeEmotions = async () => {
      if (!videoRef.current || !canvasRef.current || isAnalyzing) {
        animationFrameId = requestAnimationFrame(analyzeEmotions);
        return;
      }

      try {
        isAnalyzing = true;

        // Only analyze every ANALYSIS_INTERVAL ms
        await new Promise(resolve => setTimeout(resolve, ANALYSIS_INTERVAL));

        const options = new faceapi.TinyFaceDetectorOptions({ 
          inputSize: 224,
          scoreThreshold: 0.5
        });

        const detections = await faceapi
          .detectAllFaces(videoRef.current, options)
          .withFaceLandmarks()
          .withFaceExpressions();

        if (detections.length > 0) {
          const expressions = detections[0].expressions;
          const timestamp = Date.now();

          // Stabilize emotion detection by checking for significant changes
          const emotionsData: EmotionData[] = Object.entries(expressions)
            .map(([emotion, confidence]) => ({
              emotion,
              confidence: Number((confidence * 100).toFixed(1)),
              timestamp,
            }))
            .filter(emotion => emotion.confidence > CONFIDENCE_THRESHOLD * 100)
            .sort((a, b) => b.confidence - a.confidence)
            .slice(0, 3);

          // Only update if there's a significant change
          setEmotions(prev => {
            const hasSignificantChange = emotionsData.some((emotion, index) => {
              const prevEmotion = prev[index];
              return !prevEmotion || 
                     prevEmotion.emotion !== emotion.emotion || 
                     Math.abs(prevEmotion.confidence - emotion.confidence) > 5;
            });
            return hasSignificantChange ? emotionsData : prev;
          });

          const landmarks = detections[0].landmarks;
          const eyePoints = landmarks.getLeftEye().concat(landmarks.getRightEye());
          
          const newBodyLanguage = {
            posture: analyzePosture(landmarks),
            eyeContact: calculateEyeContact(eyePoints),
            movement: analyzeMovement(landmarks),
            engagement: calculateEngagement(expressions),
            confidence: calculateConfidence(landmarks),
            clarity: calculateClarity(expressions),
          };
          
          // Only update body language if there's a significant change
          setBodyLanguage(prev => {
            const hasSignificantChange = 
              Math.abs(prev.engagement - newBodyLanguage.engagement) > 5 ||
              Math.abs(prev.clarity - newBodyLanguage.clarity) > 5 ||
              Math.abs(prev.eyeContact - newBodyLanguage.eyeContact) > 5;
            
            if (hasSignificantChange) {
              // Generate feedback when body language changes significantly
              generateFeedback(newBodyLanguage, emotionsData);
              return newBodyLanguage;
            }
            return prev;
          });
        }

        isAnalyzing = false;
        animationFrameId = requestAnimationFrame(analyzeEmotions);
      } catch (analysisError) {
        console.error('Analysis error:', analysisError);
        isAnalyzing = false;
        animationFrameId = requestAnimationFrame(analyzeEmotions);
      }
    };

    analyzeEmotions();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isLoading, error]);

  const calculateEngagement = (expressions: FaceExpressions): number => {
    const neutral = expressions.neutral || 0;
    const happy = expressions.happy || 0;
    const attentive = 1 - (expressions.sad || 0) - (expressions.angry || 0) - (expressions.fearful || 0);
    return Math.round((neutral * 0.4 + happy * 0.3 + attentive * 0.3) * 100);
  };

  const calculateConfidence = (landmarks: faceapi.FaceLandmarks68): number => {
    const jawline = landmarks.getJawOutline();
    const headTilt = Math.abs(jawline[0].y - jawline[16].y);
    const headStraightness = 100 - (headTilt / jawline[8].y) * 100;
    return Math.min(100, Math.round(headStraightness));
  };

  const calculateClarity = (expressions: FaceExpressions): number => {
    const neutral = expressions.neutral || 0;
    const positive = (expressions.happy || 0);
    const negative = (expressions.angry || 0) + (expressions.fearful || 0) + (expressions.disgusted || 0);
    return Math.round(Math.max(0, Math.min(100, (neutral * 0.6 + positive * 0.4 - negative * 0.3) * 100)));
  };

  const calculateEyeContact = (eyePoints: faceapi.Point[]): number => {
    const leftEyeCenter = eyePoints.slice(0, 6).reduce((acc, point) => ({
      x: acc.x + point.x / 6,
      y: acc.y + point.y / 6
    }), { x: 0, y: 0 });
    
    const rightEyeCenter = eyePoints.slice(6).reduce((acc, point) => ({
      x: acc.x + point.x / 6,
      y: acc.y + point.y / 6
    }), { x: 0, y: 0 });

    // Calculate eye level and center alignment
    const eyeLevel = Math.abs(leftEyeCenter.y - rightEyeCenter.y);
    const centerAlignment = Math.abs(
      (leftEyeCenter.x + rightEyeCenter.x) / 2 - (videoRef.current?.videoWidth || 0) / 2
    );

    const levelScore = 100 - (eyeLevel / 10);
    const alignmentScore = 100 - (centerAlignment / (videoRef.current?.videoWidth || 1) * 100);

    return Math.round(Math.max(0, Math.min(100, (levelScore * 0.5 + alignmentScore * 0.5))));
  };

  const analyzePosture = (landmarks: faceapi.FaceLandmarks68): string => {
    const jawline = landmarks.getJawOutline();
    const headTilt = Math.abs(jawline[0].y - jawline[16].y);
    const headStraightness = 100 - (headTilt / jawline[8].y) * 100;
    return headStraightness > 80 ? "Excellent" : "Needs Improvement";
  };

  const analyzeMovement = (landmarks: faceapi.FaceLandmarks68): string => {
    const jawline = landmarks.getJawOutline();
    const movement = Math.abs(jawline[8].x - jawline[0].x);
    if (movement > 50) return "Excessive";
    if (movement < 10) return "Minimal";
    return "Steady";
  };

  const generateFeedback = (bodyLanguage: BodyLanguageData, emotions: EmotionData[]) => {
    const allFeedback: string[] = [];
    const dominantEmotion = emotions[0];

    // Simple Eye Contact Feedback
    if (bodyLanguage.eyeContact < 50) {
      allFeedback.push("👀 Look at the camera more often to seem more confident");
    } else if (bodyLanguage.eyeContact >= 80) {
      allFeedback.push("👍 Great job maintaining eye contact!");
    }

    // Expression Feedback
    if (dominantEmotion) {
      switch (dominantEmotion.emotion.toLowerCase()) {
        case 'neutral':
          if (dominantEmotion.confidence > 70) {
            allFeedback.push("😊 Your professional expression is perfect");
          } else {
            allFeedback.push("🎯 Try to keep a relaxed, natural expression");
          }
          break;
        case 'happy':
          if (dominantEmotion.confidence > 50) {
            allFeedback.push("✨ Your friendly smile creates a positive impression");
          }
          break;
        case 'sad':
          allFeedback.push("💡 Try to appear more enthusiastic");
          break;
        case 'angry':
          allFeedback.push("💭 Take a deep breath and relax your expression");
          break;
        case 'surprised':
          allFeedback.push("🎯 Keep a more neutral expression");
          break;
      }
    }

    // Engagement Feedback
    if (bodyLanguage.engagement < 50) {
      allFeedback.push("💪 Show more interest by nodding occasionally");
    } else if (bodyLanguage.engagement >= 80) {
      allFeedback.push("⭐ You're showing great engagement!");
    }

    // Posture Feedback
    if (bodyLanguage.posture !== "Excellent") {
      allFeedback.push("🪑 Sit up straight and face the camera directly");
    }

    // Speech Volume Feedback
    if (speechMetrics.volume < 30) {
      allFeedback.push("🔊 Speak a bit louder to be heard clearly");
    } else if (speechMetrics.volume > 80) {
      allFeedback.push("🎤 Lower your voice slightly");
    }

    // Speaking Pace Feedback
    if (speechMetrics.pace < 100) {
      allFeedback.push("🗣️ Try speaking a bit faster to maintain interest");
    } else if (speechMetrics.pace > 160) {
      allFeedback.push("⏸️ Slow down a little for better clarity");
    }

    // Clarity Feedback
    if (speechMetrics.clarity < 60) {
      allFeedback.push("🎯 Speak more clearly and avoid mumbling");
    }

    // Movement Feedback
    if (bodyLanguage.movement === "Excessive") {
      allFeedback.push("✋ Try to minimize excessive movement");
    } else if (bodyLanguage.movement === "Minimal") {
      allFeedback.push("👋 Use some hand gestures while speaking");
    }

    // Professional Tips
    if (interviewMetrics.professionalism < 70) {
      allFeedback.push(...[
        "👔 Maintain a professional yet friendly demeanor",
        "🎯 Listen carefully and respond thoughtfully",
        "💡 Use professional language and clear examples"
      ]);
    }

    // Confidence Boosters
    if (interviewMetrics.confidence < 70) {
      allFeedback.push(...[
        "💪 Remember to breathe and stay calm",
        "⭐ Speak with conviction about your experiences",
        "✨ Use confident body language"
      ]);
    }

    // Randomly select 2 different feedback messages
    const shuffledFeedback = allFeedback
      .sort(() => Math.random() - 0.5)
      .filter((item, index, self) => self.indexOf(item) === index);

    setFeedback(shuffledFeedback.slice(0, 2));
  };

  const getEmotionIcon = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case "happy":
        return <Smile className="w-5 h-5" />;
      case "sad":
        return <Frown className="w-5 h-5" />;
      case "neutral":
        return <Meh className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Add this function to format the chart timestamp
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  // Add this function to initialize audio analysis
  const initializeAudioAnalysis = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const context = new AudioContext();
      const source = context.createMediaStreamSource(stream);
      const analyzer = context.createAnalyser();
      
      source.connect(analyzer);
      analyzer.fftSize = 2048;
      
      setAudioContext(context);
      
      // Start audio analysis loop
      analyzeAudio(analyzer);
    } catch (error) {
      console.error('Failed to initialize audio analysis:', error);
    }
  };

  // Update the audio analysis
  const analyzeAudio = (analyzer: AnalyserNode) => {
    const dataArray = new Uint8Array(analyzer.frequencyBinCount);
    
    const analyze = () => {
      analyzer.getByteFrequencyData(dataArray);
      
      // Calculate volume level (0-100)
      const volume = Math.round((dataArray.reduce((a, b) => a + b) / dataArray.length) * 100 / 255);
      
      // Update speech metrics
      setSpeechMetrics({
        volume,
        clarity: calculateSpeechClarity(dataArray),
        pace: calculateSpeakingPace(dataArray)
      });
      
      requestAnimationFrame(analyze);
    };
    
    analyze();
  };

  // Add helper functions for speech analysis
  const calculateSpeechClarity = (frequencyData: Uint8Array): number => {
    // Enhanced clarity calculation based on frequency distribution
    // Focus on speech frequency range (100-4000 Hz)
    const speechFrequencies = frequencyData.slice(10, 400);
    const totalEnergy = speechFrequencies.reduce((a, b) => a + b, 0);
    const averageEnergy = totalEnergy / speechFrequencies.length;
    
    // Calculate signal-to-noise ratio
    const noiseFloor = Math.min(...speechFrequencies);
    const snr = averageEnergy / (noiseFloor + 1); // Add 1 to avoid division by zero
    
    // Convert to percentage (0-100)
    return Math.min(100, Math.round((snr / 10) * 100));
  };

  const calculateSpeakingPace = (frequencyData: Uint8Array): number => {
    // Enhanced pace calculation based on energy variations
    const energyVariations = [];
    for (let i = 1; i < frequencyData.length; i++) {
      energyVariations.push(Math.abs(frequencyData[i] - frequencyData[i - 1]));
    }
    
    // Calculate average energy variation
    const avgVariation = energyVariations.reduce((a, b) => a + b, 0) / energyVariations.length;
    
    // Map to WPM (words per minute)
    // Normal speech is typically between 120-150 WPM
    // Low variation = slower speech, high variation = faster speech
    const baseWPM = 130;
    const variationFactor = (avgVariation / 128) * 50; // Scale factor
    return Math.max(60, Math.min(200, Math.round(baseWPM + variationFactor)));
  };

  // Add this function to calculate overall interview metrics
  const updateInterviewMetrics = useCallback(() => {
    // Enhanced confidence calculation
    const confidence = Math.round(
      bodyLanguage.eyeContact * 0.25 +          // Eye contact importance
      bodyLanguage.engagement * 0.25 +          // Engagement level
      speechMetrics.clarity * 0.25 +            // Speech clarity
      (bodyLanguage.posture === "Excellent" ? 100 : 70) * 0.25  // Posture
    );

    // Enhanced professionalism calculation
    const emotionScore = (() => {
      const neutralEmotion = emotions.find(e => e.emotion.toLowerCase() === 'neutral');
      const happyEmotion = emotions.find(e => e.emotion.toLowerCase() === 'happy');
      
      if (neutralEmotion) {
        return neutralEmotion.confidence * 0.8 + (happyEmotion?.confidence || 0) * 0.2;
      }
      return happyEmotion ? happyEmotion.confidence : 70;
    })();

    const professionalism = Math.round(
      (bodyLanguage.posture === "Excellent" ? 100 : 70) * 0.2 +  // Posture
      speechMetrics.clarity * 0.3 +                              // Speech clarity
      emotionScore * 0.3 +                                       // Appropriate emotions
      (speechMetrics.pace >= 120 && speechMetrics.pace <= 150 ? 100 : 70) * 0.2  // Appropriate pace
    );

    // Enhanced overall score calculation
    const overallScore = Math.round(
      confidence * 0.35 +                 // Confidence weight
      professionalism * 0.35 +           // Professionalism weight
      bodyLanguage.engagement * 0.15 +    // Engagement weight
      speechMetrics.clarity * 0.15        // Clarity weight
    );

    setInterviewMetrics({
      confidence: Math.min(100, confidence),
      professionalism: Math.min(100, professionalism),
      overallScore: Math.min(100, overallScore)
    });
  }, [bodyLanguage, emotions, speechMetrics]);

  // Add this effect to update interview metrics
  useEffect(() => {
    updateInterviewMetrics();
  }, [bodyLanguage, emotions, speechMetrics, updateInterviewMetrics]);

  const getProgressColor = (value: number): string => {
    return value > 70 ? "bg-green-500" : "bg-blue-500";
  };

  if (error) {
    return (
      <Card className="p-4 bg-red-50">
        <div className="flex items-center text-red-600">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Hidden video element */}
      <div className="hidden">
        <video ref={videoRef} autoPlay playsInline muted />
        <canvas ref={canvasRef} />
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Real-time Metrics Card */}
          <Card className="p-6 h-[320px]">
            <h3 className="text-lg font-semibold mb-6">Real-time Analysis</h3>
            <div className="space-y-8">
              {/* Emotion Analysis */}
              <div>
                <h4 className="text-sm font-medium mb-4">Current Emotional State</h4>
                <div className="space-y-4">
                  {emotions.slice(0, 3).map((emotion) => (
                    <div key={emotion.emotion} className="flex items-center gap-3">
                      <div className="w-28 flex items-center">
                        {getEmotionIcon(emotion.emotion)}
                        <span className="ml-2 capitalize text-sm font-medium">
                          {emotion.emotion}
                        </span>
                      </div>
                      <div className="flex-grow">
                        <div className={`h-2 rounded-full bg-muted overflow-hidden`}>
                          <div 
                            className={`h-full transition-all ${getProgressColor(emotion.confidence)}`}
                            style={{ width: `${emotion.confidence}%` }}
                          />
                        </div>
                      </div>
                      <span className="w-16 text-right text-sm font-medium">
                        {emotion.confidence.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Metrics */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center mb-2">
                    <Brain className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Engagement</span>
                  </div>
                  <div className={`h-2 rounded-full bg-muted overflow-hidden`}>
                    <div 
                      className={`h-full transition-all ${getProgressColor(bodyLanguage.engagement)}`}
                      style={{ width: `${bodyLanguage.engagement}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round(bodyLanguage.engagement)}%
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center mb-2">
                    <Volume2 className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Clarity</span>
                  </div>
                  <div className={`h-2 rounded-full bg-muted overflow-hidden`}>
                    <div 
                      className={`h-full transition-all ${getProgressColor(bodyLanguage.clarity)}`}
                      style={{ width: `${bodyLanguage.clarity}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round(bodyLanguage.clarity)}%
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Body Language Analysis Card */}
          <Card className="p-6 h-[160px]">
            <h3 className="text-lg font-semibold mb-4">Body Language</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="overflow-hidden">
                <div className="flex items-center mb-2">
                  <ThumbsUp className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-sm font-medium truncate">Posture</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {bodyLanguage.posture}
                </p>
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center mb-2">
                  <Eye className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-sm font-medium truncate">Eye Contact</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {Math.round(bodyLanguage.eyeContact)}%
                </p>
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center mb-2">
                  <Activity className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-sm font-medium truncate">Movement</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {bodyLanguage.movement}
                </p>
              </div>
            </div>
          </Card>

          {/* Speech Analysis Card */}
          <Card className="p-6 h-[160px]">
            <h3 className="text-lg font-semibold mb-4">Speech Analysis</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="overflow-hidden">
                <div className="flex items-center mb-2">
                  <Gauge className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-sm font-medium truncate">Pace</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {speechMetrics.pace} WPM
                </p>
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center mb-2">
                  <Volume2 className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-sm font-medium truncate">Volume</span>
                </div>
                <div className={`h-2 rounded-full bg-muted overflow-hidden`}>
                  <div 
                    className={`h-full transition-all ${
                      speechMetrics.volume > 70 ? "bg-yellow-500" : 
                      speechMetrics.volume > 30 ? "bg-green-500" : "bg-blue-500"
                    }`}
                    style={{ width: `${speechMetrics.volume}%` }}
                  />
                </div>
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center mb-2">
                  <Mic className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-sm font-medium truncate">Clarity</span>
                </div>
                <div className={`h-2 rounded-full bg-muted overflow-hidden`}>
                  <div 
                    className={`h-full transition-all ${getProgressColor(speechMetrics.clarity)}`}
                    style={{ width: `${speechMetrics.clarity}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Live Feedback */}
        <div>
          <Card className="p-6 h-[500px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Live Feedback</h3>
              <MessageSquare className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              {feedback.map((message, index) => (
                <Alert 
                  key={index} 
                  className="bg-muted/50 border-l-4 border-l-blue-500 transition-all duration-300 ease-in-out"
                >
                  <AlertDescription className="text-base py-2 leading-relaxed">
                    {message}
                  </AlertDescription>
                </Alert>
              ))}
              {feedback.length === 0 && (
                <div className="flex items-center justify-center h-[400px]">
                  <p className="text-base text-muted-foreground">
                    Analyzing your expressions and engagement...
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Interview Performance Card */}
          <Card className="p-6 h-[160px] mt-6">
            <h3 className="text-lg font-semibold mb-4">Interview Performance</h3>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="flex items-center mb-2">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Confidence</span>
                </div>
                <div className={`h-2 rounded-full bg-muted overflow-hidden mb-1`}>
                  <div 
                    className={`h-full transition-all ${getProgressColor(interviewMetrics.confidence)}`}
                    style={{ width: `${interviewMetrics.confidence}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground">
                  {interviewMetrics.confidence}%
                </span>
              </div>
              <div>
                <div className="flex items-center mb-2">
                  <Briefcase className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Professionalism</span>
                </div>
                <div className={`h-2 rounded-full bg-muted overflow-hidden mb-1`}>
                  <div 
                    className={`h-full transition-all ${getProgressColor(interviewMetrics.professionalism)}`}
                    style={{ width: `${interviewMetrics.professionalism}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground">
                  {interviewMetrics.professionalism}%
                </span>
              </div>
              <div>
                <div className="flex items-center mb-2">
                  <Star className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Overall Score</span>
                </div>
                <div className={`h-2 rounded-full bg-muted overflow-hidden mb-1`}>
                  <div 
                    className={`h-full transition-all ${getProgressColor(interviewMetrics.overallScore)}`}
                    style={{ width: `${interviewMetrics.overallScore}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground">
                  {interviewMetrics.overallScore}%
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
          <div className="text-center text-white">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm">Initializing camera...</p>
          </div>
        </div>
      )}
    </div>
  );
} 