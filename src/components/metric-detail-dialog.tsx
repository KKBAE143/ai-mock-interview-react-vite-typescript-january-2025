import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts';
import { cn } from "@/lib/utils";

interface MetricDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  metric: {
    title: string;
    value: number;
    description: string;
    tooltip: string;
    color: string;
    history: Array<{
      timestamp: number;
      value: number;
    }>;
    thresholds?: {
      min: number;
      max: number;
      optimal: number;
    };
  };
  onThresholdChange?: (type: 'min' | 'max' | 'optimal', value: number) => void;
  isActive?: boolean;
}

export function MetricDetailDialog({
  open,
  onOpenChange,
  metric,
  onThresholdChange,
  isActive = true
}: MetricDetailDialogProps) {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getValueDescription = (value: number) => {
    if (!metric.thresholds) return "No threshold data available";
    
    if (value >= metric.thresholds.optimal) {
      return "Excellent - Keep it up!";
    } else if (value >= metric.thresholds.min && value <= metric.thresholds.max) {
      return "Good - Within acceptable range";
    } else if (value < metric.thresholds.min) {
      return "Below target - Try to improve";
    } else {
      return "Above target - Consider adjusting";
    }
  };

  const chartData = metric.history.map(point => ({
    time: formatTime(point.timestamp),
    value: point.value,
    min: metric.thresholds?.min || 0,
    optimal: metric.thresholds?.optimal || 0,
    max: metric.thresholds?.max || 100
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{metric.title} Analysis</DialogTitle>
          <DialogDescription>{metric.tooltip}</DialogDescription>
        </DialogHeader>

        {/* Current Value Card */}
        <Card className={cn(
          "p-4",
          isActive ? "bg-muted/50" : "bg-red-50"
        )}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Current Value</span>
            <div className="flex items-center gap-2">
              {!isActive && (
                <span className="text-sm text-red-600">Inactive - No face detected</span>
              )}
              <span className="text-2xl font-bold">{isActive ? metric.value : 0}%</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {isActive ? getValueDescription(metric.value) : "Please position your face in the camera view"}
          </p>
        </Card>

        {/* History Graph */}
        <div className="h-[300px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey="time" 
                stroke="#888888"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                domain={[0, 100]} 
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  border: "none",
                  borderRadius: "4px",
                  color: "white",
                }}
                labelStyle={{ color: "white" }}
              />
              
              {/* Threshold Areas */}
              {metric.thresholds && (
                <>
                  <Area
                    dataKey="optimal"
                    stroke="none"
                    fill="rgba(34, 197, 94, 0.1)"
                    fillOpacity={0.1}
                  />
                  <Area
                    dataKey="max"
                    stroke="none"
                    fill="rgba(239, 68, 68, 0.1)"
                    fillOpacity={0.1}
                  />
                </>
              )}

              {/* Main Value Line */}
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={`var(--${metric.color})`}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />

              {/* Threshold Lines */}
              {metric.thresholds && (
                <>
                  <Line
                    type="monotone"
                    dataKey={() => metric.thresholds!.optimal}
                    stroke="#22c55e"
                    strokeDasharray="5 5"
                    strokeWidth={1}
                  />
                  <Line
                    type="monotone"
                    dataKey={() => metric.thresholds!.min}
                    stroke="#f97316"
                    strokeDasharray="3 3"
                    strokeWidth={1}
                  />
                  <Line
                    type="monotone"
                    dataKey={() => metric.thresholds!.max}
                    stroke="#ef4444"
                    strokeDasharray="3 3"
                    strokeWidth={1}
                  />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Threshold Controls */}
        {metric.thresholds && onThresholdChange && isActive && (
          <div className="space-y-4 mt-4">
            <div>
              <Label>Minimum Acceptable Value</Label>
              <Slider
                defaultValue={[metric.thresholds.min]}
                max={100}
                step={1}
                onValueChange={([value]) => onThresholdChange('min', value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Optimal Value</Label>
              <Slider
                defaultValue={[metric.thresholds.optimal]}
                max={100}
                step={1}
                onValueChange={([value]) => onThresholdChange('optimal', value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Maximum Acceptable Value</Label>
              <Slider
                defaultValue={[metric.thresholds.max]}
                max={100}
                step={1}
                onValueChange={([value]) => onThresholdChange('max', value)}
                className="mt-2"
              />
            </div>
          </div>
        )}

        {/* Detailed Feedback */}
        <div className="mt-4 space-y-2">
          <h4 className="font-medium">Improvement Tips</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {isActive ? 
              getMetricTips(metric.title, metric.value) :
              ['Please ensure your face is visible in the camera to receive feedback']
            }
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function getMetricTips(metricTitle: string, value: number): string[] {
  const tips: Record<string, string[]> = {
    'Confidence': [
      'Maintain good posture throughout the interview',
      'Practice power poses before the interview',
      'Focus on steady breathing to stay calm',
      'Prepare and practice your responses beforehand'
    ],
    'Professionalism': [
      'Use industry-appropriate terminology',
      'Maintain a balanced tone of voice',
      'Stay focused and attentive',
      'Address questions directly and concisely'
    ],
    'Engagement': [
      'Show active listening through nodding and facial expressions',
      'Use hand gestures appropriately to emphasize points',
      'Maintain consistent eye contact',
      'Respond with enthusiasm and energy'
    ],
    'Speech Clarity': [
      'Speak at a measured pace',
      'Enunciate words clearly',
      'Take brief pauses between sentences',
      'Practice tongue twisters for better articulation'
    ],
    'Speech Pace': [
      'Aim for 120-150 words per minute',
      'Use pauses effectively',
      'Practice with a metronome',
      'Record and review your speaking pace'
    ],
    'Eye Contact': [
      'Look directly at the camera to simulate eye contact',
      'Position your camera at eye level',
      'Take natural breaks in eye contact',
      'Practice with video recordings'
    ],
    'Voice Volume': [
      'Speak from your diaphragm',
      'Project your voice clearly',
      'Maintain consistent volume',
      'Practice voice exercises'
    ],
    'Response Time': [
      'Use the STAR method to structure responses',
      'Keep answers concise and focused',
      'Practice timing your responses',
      'Use brief pauses to gather thoughts'
    ]
  };

  return tips[metricTitle] || [
    'Focus on maintaining consistent performance',
    'Review feedback and adjust accordingly',
    'Practice regularly to improve',
    'Set specific goals for improvement'
  ];
} 