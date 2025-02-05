import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
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
  Video,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PerformanceAnalyticsDashboard } from './performance-analytics-dashboard';
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AdvancedAnalytics } from './advanced-analytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

// Add interfaces for metric history and thresholds
interface MetricHistory {
  timestamp: number;
  value: number;
}

interface MetricThresholds {
  min: number;
  max: number;
  optimal: number;
}

// Add new interface for feedback categories
interface FeedbackCategory {
  title: string;
  icon: React.ReactNode;
  metrics: string[];
  suggestions: string[];
  priority: number;
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

  // Add state for historical metrics
  const [historicalMetrics, setHistoricalMetrics] = useState<{
    confidence: number;
    professionalism: number;
    engagement: number;
    speechClarity: number;
    speechPace: number;
    overallScore: number;
  } | undefined>();

  // Add state for response time tracking
  const [responseStartTime, setResponseStartTime] = useState<number | null>(null);
  const [responseTime, setResponseTime] = useState<number>(0);

  // Add normalized speech pace calculation
  const normalizedSpeechPace = useMemo(() => {
    // Convert raw pace to a percentage (assuming ideal pace is 120-150 WPM)
    const pace = speechMetrics.pace;
    if (pace < 100) return Math.round((pace / 100) * 100);
    if (pace > 160) return Math.round((160 / pace) * 100);
    return 100; // Perfect pace
  }, [speechMetrics.pace]);

  // Add state for metric history
  const [metricHistory, setMetricHistory] = useState<{
    [key: string]: MetricHistory[];
  }>({
    'Confidence': [],
    'Professionalism': [],
    'Engagement': [],
    'Speech Clarity': [],
    'Speech Pace': [],
    'Eye Contact': [],
    'Voice Volume': [],
    'Response Time': [],
    'Overall Performance': []
  });

  // Add state for thresholds
  const [thresholds, setThresholds] = useState<{
    [key: string]: MetricThresholds;
  }>({
    'Confidence': { min: 60, max: 100, optimal: 80 },
    'Professionalism': { min: 70, max: 100, optimal: 85 },
    'Engagement': { min: 60, max: 100, optimal: 80 },
    'Speech Clarity': { min: 65, max: 100, optimal: 85 },
    'Speech Pace': { min: 70, max: 90, optimal: 80 },
    'Eye Contact': { min: 60, max: 100, optimal: 80 },
    'Voice Volume': { min: 60, max: 90, optimal: 75 },
    'Response Time': { min: 60, max: 90, optimal: 80 },
    'Overall Performance': { min: 65, max: 100, optimal: 85 }
  });

  // Add new state for human detection
  const [isHumanDetected, setIsHumanDetected] = useState(false);
  const [lastHumanDetectionTime, setLastHumanDetectionTime] = useState<number | null>(null);
  
  // Adjust detection parameters for better accuracy
  const HUMAN_DETECTION_TIMEOUT = 500; // Reduce to 0.5 seconds for faster response
  const MIN_FACE_SIZE = 40; // Reduce minimum face size for better detection
  const MIN_DETECTION_CONFIDENCE = 0.5; // Lower confidence threshold
  const DETECTION_STABILITY_COUNT = 2; // Reduce required consecutive detections
  const MAX_FACE_SIZE_RATIO = 0.8; // Maximum face size relative to frame
  
  // Add state for detection stability
  const [consecutiveDetections, setConsecutiveDetections] = useState(0);
  const [consecutiveNonDetections, setConsecutiveNonDetections] = useState(0);

  // Add state for benchmark data
  const [benchmarkData, setBenchmarkData] = useState<{
    confidence: number;
    professionalism: number;
    engagement: number;
    speechClarity: number;
    speechPace: number;
    eyeContact: number;
    volume: number;
    responseTime: number;
    overallScore: number;
  }>({
    confidence: 85,
    professionalism: 90,
    engagement: 80,
    speechClarity: 85,
    speechPace: 75,
    eyeContact: 80,
    volume: 70,
    responseTime: 75,
    overallScore: 85
  });

  // Enhanced feedback categories
  const feedbackCategories: FeedbackCategory[] = [
    {
      title: 'Professional Presence',
      icon: <Briefcase className="w-5 h-5" />,
      metrics: ['professionalism', 'confidence'],
      suggestions: [
        '👔 Maintain professional posture and attire',
        '💼 Use industry-appropriate terminology',
        '🎯 Keep responses focused and structured',
        '✨ Project confidence through body language'
      ],
      priority: 1
    },
    {
      title: 'Communication Skills',
      icon: <MessageSquare className="w-5 h-5" />,
      metrics: ['speechClarity', 'speechPace', 'volume'],
      suggestions: [
        '🗣️ Speak clearly and at a moderate pace',
        '🎤 Maintain consistent volume',
        '⏸️ Use appropriate pauses for emphasis',
        '📢 Articulate key points carefully'
      ],
      priority: 2
    },
    {
      title: 'Engagement & Presence',
      icon: <Eye className="w-5 h-5" />,
      metrics: ['engagement', 'eyeContact'],
      suggestions: [
        '👀 Maintain steady eye contact',
        '🤝 Show active listening',
        '💫 Use appropriate facial expressions',
        '✋ Incorporate natural gestures'
      ],
      priority: 3
    }
  ];

  // Add new state for stable feedback
  const [stableFeedback, setStableFeedback] = useState<{[key: string]: string[]}>({
    'Professional Presence': [],
    'Communication Skills': [],
    'Engagement & Presence': []
  });

  // Add debounce timer ref
  const feedbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Function to check if face is properly visible
  const isFaceProperlyVisible = useCallback((detection: any) => {
    if (!detection || !videoRef.current) return false;

    const { width, height, x, y } = detection.detection.box;
    const videoWidth = videoRef.current.videoWidth || 640;
    const videoHeight = videoRef.current.videoHeight || 480;

    // Calculate face position relative to frame
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    const frameCenterX = videoWidth / 2;
    const frameCenterY = videoHeight / 2;

    // Check if face is centered (with more lenient bounds)
    const isCentered = 
      Math.abs(centerX - frameCenterX) < videoWidth * 0.3 && // Allow 30% deviation from center
      Math.abs(centerY - frameCenterY) < videoHeight * 0.3;

    // Check face size (more lenient bounds)
    const faceArea = (width * height) / (videoWidth * videoHeight);
    const isGoodSize = faceArea > 0.05 && faceArea < MAX_FACE_SIZE_RATIO;

    // Check if face is clear enough
    const isClear = detection.detection.score > MIN_DETECTION_CONFIDENCE;

    return isCentered && isGoodSize && isClear;
  }, []);

  // Add function to update metric history
  const updateMetricHistory = useCallback((metricName: string, value: number) => {
    setMetricHistory(prev => {
      const history = [...(prev[metricName] || [])];
      history.push({ timestamp: Date.now(), value });
      
      // Keep last 30 data points (5 minutes of data with 10-second intervals)
      if (history.length > 30) {
        history.shift();
      }
      
      return {
        ...prev,
        [metricName]: history
      };
    });
  }, []);

  // Add threshold update handler
  const handleThresholdChange = useCallback((
    metric: string,
    type: 'min' | 'max' | 'optimal',
    value: number
  ) => {
    setThresholds(prev => ({
      ...prev,
      [metric]: {
        ...prev[metric],
        [type]: value
      }
    }));
  }, []);

  // Update the dashboard metrics
  const dashboardMetrics = useMemo(() => ({
    confidence: Math.round(interviewMetrics.confidence),
    professionalism: Math.round(interviewMetrics.professionalism),
    engagement: Math.round(bodyLanguage.engagement),
    speechClarity: Math.round(speechMetrics.clarity),
    speechPace: normalizedSpeechPace,
    overallScore: Math.round(interviewMetrics.overallScore),
    eyeContact: Math.round(bodyLanguage.eyeContact),
    volume: Math.round(speechMetrics.volume),
    responseTime: Math.round(responseTime),
    previousMetrics: historicalMetrics
  }), [
    interviewMetrics,
    bodyLanguage,
    speechMetrics,
    normalizedSpeechPace,
    responseTime,
    historicalMetrics
  ]);

  // Add effect to update historical metrics
  useEffect(() => {
    const updateInterval = setInterval(() => {
      setHistoricalMetrics({
        confidence: Math.round(interviewMetrics.confidence),
        professionalism: Math.round(interviewMetrics.professionalism),
        engagement: Math.round(bodyLanguage.engagement),
        speechClarity: Math.round(speechMetrics.clarity),
        speechPace: normalizedSpeechPace,
        overallScore: Math.round(interviewMetrics.overallScore)
      });
    }, 5000); // Update historical metrics every 5 seconds

    return () => clearInterval(updateInterval);
  }, [
    interviewMetrics,
    bodyLanguage.engagement,
    speechMetrics.clarity,
    normalizedSpeechPace
  ]);

  // Add response time tracking
  useEffect(() => {
    if (speechMetrics.volume > 20 && !responseStartTime) {
      setResponseStartTime(Date.now());
    } else if (speechMetrics.volume < 10 && responseStartTime) {
      const duration = Date.now() - responseStartTime;
      // Convert to a 0-100 scale where 100 is optimal (30 seconds) and 0 is too long (2 minutes)
      const normalizedTime = Math.max(0, Math.min(100, 100 - ((duration - 30000) / 90000) * 100));
      setResponseTime(normalizedTime);
      setResponseStartTime(null);
    }
  }, [speechMetrics.volume, responseStartTime]);

  // Add effect to update metric history
  useEffect(() => {
    const updateInterval = setInterval(() => {
      // Update history for all metrics
      updateMetricHistory('Confidence', dashboardMetrics.confidence);
      updateMetricHistory('Professionalism', dashboardMetrics.professionalism);
      updateMetricHistory('Engagement', dashboardMetrics.engagement);
      updateMetricHistory('Speech Clarity', dashboardMetrics.speechClarity);
      updateMetricHistory('Speech Pace', dashboardMetrics.speechPace);
      updateMetricHistory('Overall Performance', dashboardMetrics.overallScore);
      
      if (dashboardMetrics.eyeContact) {
        updateMetricHistory('Eye Contact', dashboardMetrics.eyeContact);
      }
      if (dashboardMetrics.volume) {
        updateMetricHistory('Voice Volume', dashboardMetrics.volume);
      }
      if (dashboardMetrics.responseTime) {
        updateMetricHistory('Response Time', dashboardMetrics.responseTime);
      }
    }, 10000); // Update every 10 seconds

    return () => clearInterval(updateInterval);
  }, [dashboardMetrics, updateMetricHistory]);

  // Add effect to generate feedback based on thresholds
  useEffect(() => {
    const checkThresholds = () => {
      const newFeedback: string[] = [];

      Object.entries(thresholds).forEach(([metric, threshold]) => {
        const value = dashboardMetrics[metric.toLowerCase().replace(' ', '') as keyof typeof dashboardMetrics];
        if (typeof value === 'number') {
          if (value < threshold.min) {
            newFeedback.push(`📊 Your ${metric} is below target. Try to improve it.`);
          } else if (value > threshold.max) {
            newFeedback.push(`📈 Your ${metric} is above the optimal range. Consider adjusting.`);
          }
        }
      });

      if (newFeedback.length > 0) {
        setFeedback(prev => {
          const combined = [...prev, ...newFeedback];
          return combined.slice(-2); // Keep only the two most recent feedback items
        });
      }
    };

    checkThresholds();
  }, [dashboardMetrics, thresholds]);

  // Update the generateEnhancedFeedback function
  const generateEnhancedFeedback = useCallback(() => {
    if (!isHumanDetected) return;

    // Clear existing timer if any
    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current);
    }

    // Debounce feedback updates with 3 second delay
    feedbackTimerRef.current = setTimeout(() => {
      const newFeedback: {[key: string]: string[]} = {};

      feedbackCategories.forEach(category => {
        const categoryMetrics = category.metrics.map(metric => ({
          name: metric,
          value: dashboardMetrics[metric as keyof typeof dashboardMetrics] as number
        }));

        const avgScore = categoryMetrics.reduce((sum, m) => sum + m.value, 0) / categoryMetrics.length;

        // Only update feedback if there's a significant change in metrics
        const currentFeedback = stableFeedback[category.title] || [];
        const shouldUpdate = Math.abs(avgScore - (currentFeedback.length ? 75 : 0)) > 10;

        if (shouldUpdate) {
          const suggestions = category.suggestions
            .sort(() => Math.random() - 0.5)
            .slice(0, avgScore < 70 ? 2 : 1);

          if (avgScore < 70) {
            newFeedback[category.title] = suggestions;
          } else if (avgScore > 90) {
            newFeedback[category.title] = [`⭐ Excellent ${category.title.toLowerCase()}! Keep it up!`];
          } else {
            newFeedback[category.title] = [suggestions[0]];
          }
        } else {
          newFeedback[category.title] = currentFeedback;
        }
      });

      setStableFeedback(newFeedback);
      setFeedback(Object.values(newFeedback).flat());
    }, 3000); // 3 second debounce
  }, [isHumanDetected, dashboardMetrics, feedbackCategories, stableFeedback]);

  // Update feedback generation
  useEffect(() => {
    generateEnhancedFeedback();
  }, [generateEnhancedFeedback]);

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

        const options = new faceapi.TinyFaceDetectorOptions({ 
          inputSize: 320,
          scoreThreshold: MIN_DETECTION_CONFIDENCE
        });

        const detections = await faceapi
          .detectAllFaces(videoRef.current, options)
          .withFaceLandmarks()
          .withFaceExpressions();

        // Draw detection feedback
        const canvas = canvasRef.current;
        const displaySize = {
          width: videoRef.current.videoWidth,
          height: videoRef.current.videoHeight
        };
        
        canvas.width = displaySize.width;
        canvas.height = displaySize.height;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Draw frame guide
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.lineWidth = 1;
          
          // Draw center crosshair
          const centerX = displaySize.width / 2;
          const centerY = displaySize.height / 2;
          const guideSize = 20;
          
          ctx.beginPath();
          ctx.moveTo(centerX - guideSize, centerY);
          ctx.lineTo(centerX + guideSize, centerY);
          ctx.moveTo(centerX, centerY - guideSize);
          ctx.lineTo(centerX, centerY + guideSize);
          ctx.stroke();
          
          // Draw optimal face area guide
          const optimalWidth = displaySize.width * 0.4;
          const optimalHeight = displaySize.height * 0.4;
          ctx.strokeRect(
            centerX - optimalWidth / 2,
            centerY - optimalHeight / 2,
            optimalWidth,
            optimalHeight
          );

          if (detections.length > 0) {
            const detection = detections[0];
            const isValid = isFaceProperlyVisible(detection);

            if (isValid) {
              setConsecutiveDetections(prev => prev + 1);
              setConsecutiveNonDetections(0);
              
              if (consecutiveDetections >= DETECTION_STABILITY_COUNT) {
                setIsHumanDetected(true);
                setLastHumanDetectionTime(Date.now());

                // Process emotions and metrics
                const expressions = detection.expressions;
                const landmarks = detection.landmarks;
                const eyePoints = landmarks.getLeftEye().concat(landmarks.getRightEye());
                
                // Update body language metrics
                const newBodyLanguage = {
                  posture: analyzePosture(landmarks),
                  eyeContact: calculateEyeContact(eyePoints),
                  movement: analyzeMovement(landmarks),
                  engagement: calculateEngagement(expressions),
                  confidence: calculateConfidence(landmarks),
                  clarity: calculateClarity(expressions),
                };

                // Update metrics only if there's significant change
                setBodyLanguage(prev => {
                  const hasSignificantChange = 
                    Math.abs(prev.engagement - newBodyLanguage.engagement) > 5 ||
                    Math.abs(prev.clarity - newBodyLanguage.clarity) > 5 ||
                    Math.abs(prev.eyeContact - newBodyLanguage.eyeContact) > 5;
                  
                  if (hasSignificantChange) {
                    return newBodyLanguage;
                  }
                  return prev;
                });

                // Update interview metrics
                const confidence = Math.round(
                  newBodyLanguage.eyeContact * 0.3 +
                  newBodyLanguage.confidence * 0.4 +
                  speechMetrics.clarity * 0.3
                );

                const professionalism = Math.round(
                  (newBodyLanguage.posture === "Excellent" ? 100 : 70) * 0.3 +
                  speechMetrics.clarity * 0.3 +
                  newBodyLanguage.engagement * 0.4
                );

                const overallScore = Math.round(
                  confidence * 0.35 +
                  professionalism * 0.35 +
                  newBodyLanguage.engagement * 0.15 +
                  speechMetrics.clarity * 0.15
                );

                setInterviewMetrics({
                  confidence: Math.min(100, confidence),
                  professionalism: Math.min(100, professionalism),
                  overallScore: Math.min(100, overallScore)
                });

                // Update historical metrics
                const timestamp = Date.now();
                updateMetricHistory('Confidence', confidence);
                updateMetricHistory('Professionalism', professionalism);
                updateMetricHistory('Engagement', newBodyLanguage.engagement);
                updateMetricHistory('Speech Clarity', speechMetrics.clarity);
                updateMetricHistory('Speech Pace', normalizedSpeechPace);
                updateMetricHistory('Eye Contact', newBodyLanguage.eyeContact);
                updateMetricHistory('Voice Volume', speechMetrics.volume);
                updateMetricHistory('Response Time', responseTime);
                updateMetricHistory('Overall Performance', overallScore);
              }
            } else {
              handleInvalidDetection(detection);
            }
          } else {
            handleNoDetection();
          }
        }

        isAnalyzing = false;
        animationFrameId = requestAnimationFrame(analyzeEmotions);
      } catch (error) {
        console.error('Analysis error:', error);
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
  }, [isLoading, error, consecutiveDetections, isFaceProperlyVisible, speechMetrics, normalizedSpeechPace, responseTime]);

  // Add helper function for invalid detection
  const handleInvalidDetection = (detection: any) => {
    const { width, height, x, y } = detection.detection.box;
    const videoWidth = videoRef.current?.videoWidth || 640;
    const videoHeight = videoRef.current?.videoHeight || 480;
    
    // Calculate position relative to center
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    const frameCenterX = videoWidth / 2;
    const frameCenterY = videoHeight / 2;
    
    // Determine what's wrong
    const faceArea = (width * height) / (videoWidth * videoHeight);
    
    let message = "";
    if (faceArea > MAX_FACE_SIZE_RATIO) {
      message = "Move back from the camera";
    } else if (faceArea < 0.05) {
      message = "Move closer to the camera";
    } else if (Math.abs(centerX - frameCenterX) > videoWidth * 0.3) {
      message = centerX < frameCenterX ? "Move right" : "Move left";
    } else if (Math.abs(centerY - frameCenterY) > videoHeight * 0.3) {
      message = centerY < frameCenterY ? "Move down" : "Move up";
    }
    
    if (message && !isHumanDetected) {
      toast.warning("Adjust Position", {
        description: message,
        duration: 2000,
      });
    }
    
    setConsecutiveDetections(0);
    setConsecutiveNonDetections(prev => prev + 1);
  };

  // Add helper function for no detection
  const handleNoDetection = () => {
    setConsecutiveDetections(0);
    setConsecutiveNonDetections(prev => prev + 1);
    
    if (consecutiveNonDetections >= DETECTION_STABILITY_COUNT) {
      setIsHumanDetected(false);
      resetMetrics();
      
      if (lastHumanDetectionTime && Date.now() - lastHumanDetectionTime > HUMAN_DETECTION_TIMEOUT) {
        toast.error("No Face Detected", {
          description: "Please ensure your face is visible and well-lit",
          duration: 3000,
        });
      }
    }
  };

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

  // Add function to reset metrics when no human is detected
  const resetMetrics = () => {
    setEmotions([]);
    setBodyLanguage({
      posture: "Unknown",
      eyeContact: 0,
      movement: "Unknown",
      engagement: 0,
      confidence: 0,
      clarity: 0,
    });
    setSpeechMetrics({
      pace: 0,
      volume: 0,
      clarity: 0,
    });
    setInterviewMetrics({
      confidence: 0,
      professionalism: 0,
      overallScore: 0,
    });
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
    <div className="space-y-6">
      <Tabs defaultValue="live" className="w-full">
        <TabsList>
          <TabsTrigger value="live">Live Analysis</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="live">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Video Feed and Controls */}
            <div>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Live Video Feed</h3>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "inline-block w-2 h-2 rounded-full",
                      isHumanDetected ? "bg-green-500" : "bg-red-500"
                    )} />
                    <span className="text-sm text-muted-foreground">
                      {isHumanDetected ? "Face Detected" : "No Face Detected"}
                    </span>
                    <Video className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    playsInline
                    muted
                  />
                  <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full"
                  />
                  {!isHumanDetected && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 space-y-2">
                      <p className="text-white text-center px-4">
                        Please ensure:
                      </p>
                      <ul className="text-white text-sm text-center list-disc list-inside">
                        <li>Your face is clearly visible</li>
                        <li>You are well-lit</li>
                        <li>You are centered in the frame</li>
                        <li>You are not too close or far from the camera</li>
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Right Column - Analytics Dashboard and Feedback */}
            <div className="space-y-6">
              <PerformanceAnalyticsDashboard 
                metrics={dashboardMetrics}
                metricHistory={metricHistory}
                thresholds={thresholds}
                onThresholdChange={handleThresholdChange}
                isActive={isHumanDetected}
              />
              
              {/* Enhanced Feedback Section */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Live Feedback</h3>
                  <MessageSquare className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="space-y-4">
                  {feedbackCategories.map((category, index) => {
                    const categoryFeedback = stableFeedback[category.title] || [];
                    
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          {category.icon}
                          {category.title}
                        </div>
                        {isHumanDetected ? (
                          categoryFeedback.length > 0 ? (
                            categoryFeedback.map((message, msgIndex) => (
                              <Alert 
                                key={msgIndex}
                                className="bg-muted/50 border-l-4 border-l-blue-500 transition-all duration-300 ease-in-out"
                              >
                                <AlertDescription className="text-base py-2 leading-relaxed">
                                  {message}
                                </AlertDescription>
                              </Alert>
                            ))
                          ) : (
                            <Alert className="bg-muted/30 border-l-4 border-l-gray-300">
                              <AlertDescription className="text-base py-2 leading-relaxed text-muted-foreground">
                                Analyzing {category.title.toLowerCase()}...
                              </AlertDescription>
                            </Alert>
                          )
                        ) : (
                          <Alert className="bg-muted/30 border-l-4 border-l-gray-300">
                            <AlertDescription className="text-base py-2 leading-relaxed text-muted-foreground">
                              Waiting for face detection...
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="advanced">
          <AdvancedAnalytics
            currentMetrics={dashboardMetrics}
            historicalMetrics={metricHistory}
            benchmarkData={benchmarkData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
} 