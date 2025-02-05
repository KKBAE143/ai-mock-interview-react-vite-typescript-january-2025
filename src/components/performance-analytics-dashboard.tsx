import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  Brain,
  MessageSquare,
  Mic,
  Shield,
  Star,
  Eye,
  Timer,
  Volume2
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { MetricDetailDialog } from './metric-detail-dialog';

// Add metric history interface
interface MetricHistory {
  timestamp: number;
  value: number;
}

// Update MetricCardProps to include history and click handler
interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description?: string;
  tooltip?: string;
  trend?: number;
  color?: string;
  history: MetricHistory[];
  thresholds?: {
    min: number;
    max: number;
    optimal: number;
  };
  onClick?: () => void;
}

const MetricCard = ({ 
  title, 
  value, 
  icon, 
  description, 
  tooltip, 
  trend, 
  color = "blue",
  onClick 
}: MetricCardProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Card 
          className={cn(
            "flex-1 transition-all duration-200 hover:shadow-md cursor-pointer",
            `hover:border-${color}-500/50`
          )}
          onClick={onClick}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <div className={`text-${color}-600`}>{icon}</div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress 
                value={value} 
                className={cn(
                  "h-2",
                  `bg-${color}-100`,
                  `[&>div]:bg-${color}-600`
                )} 
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{value}%</span>
                  {trend && (
                    <span className={cn(
                      "text-xs font-medium",
                      trend > 0 ? "text-green-600" : "text-red-600"
                    )}>
                      {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
                    </span>
                  )}
                </div>
                {description && (
                  <span className="text-xs text-muted-foreground">{description}</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </TooltipTrigger>
      {tooltip && (
        <TooltipContent>
          <p className="max-w-xs text-sm">{tooltip}</p>
        </TooltipContent>
      )}
    </Tooltip>
  </TooltipProvider>
);

// Update props interface to include metric history and isActive
interface PerformanceAnalyticsDashboardProps {
  metrics: {
    confidence: number;
    professionalism: number;
    engagement: number;
    speechClarity: number;
    speechPace: number;
    overallScore: number;
    eyeContact?: number;
    volume?: number;
    responseTime?: number;
    previousMetrics?: {
      confidence?: number;
      professionalism?: number;
      engagement?: number;
      speechClarity?: number;
      speechPace?: number;
      overallScore?: number;
    };
  };
  metricHistory: {
    [key: string]: MetricHistory[];
  };
  thresholds: {
    [key: string]: {
      min: number;
      max: number;
      optimal: number;
    };
  };
  onThresholdChange: (metric: string, type: 'min' | 'max' | 'optimal', value: number) => void;
  isActive: boolean;
}

export function PerformanceAnalyticsDashboard({ 
  metrics, 
  metricHistory,
  thresholds,
  onThresholdChange,
  isActive
}: PerformanceAnalyticsDashboardProps) {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  // Calculate trends only when active
  const calculateTrend = (current: number, previous?: number) => {
    if (!isActive || !previous) return undefined;
    return Math.round(((current - previous) / previous) * 100);
  };

  const handleMetricClick = (metricTitle: string) => {
    setSelectedMetric(metricTitle);
  };

  const getMetricData = (title: string) => ({
    title,
    value: isActive ? metrics[title.toLowerCase().replace(' ', '') as keyof typeof metrics] as number : 0,
    description: getMetricDescription(title),
    tooltip: getMetricTooltip(title),
    color: getMetricColor(title),
    history: metricHistory[title] || [],
    thresholds: thresholds[title]
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Performance Analytics</h2>
        <div className="flex items-center gap-2">
          <span className={cn(
            "inline-block w-2 h-2 rounded-full",
            isActive ? "bg-green-500" : "bg-red-500"
          )} />
          <span className="text-sm text-muted-foreground">
            {isActive ? "Analyzing" : "Waiting for face detection"}
          </span>
        </div>
      </div>
      
      {/* Main Score */}
      <Card 
        className={cn(
          "cursor-pointer hover:shadow-md transition-all duration-200",
          isActive 
            ? "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20"
            : "bg-red-50 border-red-100"
        )}
        onClick={() => handleMetricClick('Overall Performance')}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className={cn(
              "h-5 w-5",
              isActive ? "text-primary" : "text-red-500"
            )} />
            Overall Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold">
                {isActive ? metrics.overallScore : 0}%
              </span>
              {isActive && metrics.previousMetrics?.overallScore && (
                <span className={cn(
                  "text-sm font-medium",
                  calculateTrend(metrics.overallScore, metrics.previousMetrics.overallScore)! > 0 
                    ? "text-green-600" 
                    : "text-red-600"
                )}>
                  {calculateTrend(metrics.overallScore, metrics.previousMetrics.overallScore)! > 0 ? "↑" : "↓"}
                  {Math.abs(calculateTrend(metrics.overallScore, metrics.previousMetrics.overallScore)!)}%
                </span>
              )}
            </div>
            <Progress 
              value={isActive ? metrics.overallScore : 0} 
              className={cn(
                "h-3",
                !isActive && "opacity-50"
              )} 
            />
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        !isActive && "opacity-50"
      )}>
        <MetricCard
          {...getMetricData('Confidence')}
          icon={<Shield className="h-4 w-4" />}
          trend={calculateTrend(metrics.confidence, metrics.previousMetrics?.confidence)}
          onClick={() => handleMetricClick('Confidence')}
        />
        <MetricCard
          title="Professionalism"
          value={metrics.professionalism}
          icon={<Brain className="h-4 w-4" />}
          description="Communication and behavior"
          tooltip="Evaluates your professional demeanor and communication style"
          trend={calculateTrend(metrics.professionalism, metrics.previousMetrics?.professionalism)}
          color="purple"
          onClick={() => handleMetricClick('Professionalism')}
        />
        <MetricCard
          title="Engagement"
          value={metrics.engagement}
          icon={<Activity className="h-4 w-4" />}
          description="Interaction and enthusiasm"
          tooltip="Measures how engaged and interactive you are during the interview"
          trend={calculateTrend(metrics.engagement, metrics.previousMetrics?.engagement)}
          color="green"
          onClick={() => handleMetricClick('Engagement')}
        />
        <MetricCard
          title="Speech Clarity"
          value={metrics.speechClarity}
          icon={<MessageSquare className="h-4 w-4" />}
          description="Pronunciation and articulation"
          tooltip="Analyzes how clearly you speak and articulate your words"
          trend={calculateTrend(metrics.speechClarity, metrics.previousMetrics?.speechClarity)}
          color="yellow"
          onClick={() => handleMetricClick('Speech Clarity')}
        />
        <MetricCard
          title="Speech Pace"
          value={metrics.speechPace}
          icon={<Mic className="h-4 w-4" />}
          description="Words per minute normalized"
          tooltip="Monitors your speaking speed - ideal range is 120-150 words per minute"
          trend={calculateTrend(metrics.speechPace, metrics.previousMetrics?.speechPace)}
          color="red"
          onClick={() => handleMetricClick('Speech Pace')}
        />
        {metrics.eyeContact && (
          <MetricCard
            title="Eye Contact"
            value={metrics.eyeContact}
            icon={<Eye className="h-4 w-4" />}
            description="Camera focus and attention"
            tooltip="Measures how well you maintain eye contact with the camera"
            color="indigo"
            onClick={() => handleMetricClick('Eye Contact')}
          />
        )}
        {metrics.volume && (
          <MetricCard
            title="Voice Volume"
            value={metrics.volume}
            icon={<Volume2 className="h-4 w-4" />}
            description="Speaking volume level"
            tooltip="Monitors your speaking volume - ensure it's clear and consistent"
            color="emerald"
            onClick={() => handleMetricClick('Voice Volume')}
          />
        )}
        {metrics.responseTime && (
          <MetricCard
            title="Response Time"
            value={metrics.responseTime}
            icon={<Timer className="h-4 w-4" />}
            description="Answer timing efficiency"
            tooltip="Measures how quickly and efficiently you respond to questions"
            color="orange"
            onClick={() => handleMetricClick('Response Time')}
          />
        )}
      </div>

      {/* Metric Detail Dialog */}
      {selectedMetric && (
        <MetricDetailDialog
          open={!!selectedMetric}
          onOpenChange={() => setSelectedMetric(null)}
          metric={getMetricData(selectedMetric)}
          onThresholdChange={
            (type, value) => onThresholdChange(selectedMetric, type, value)
          }
          isActive={isActive}
        />
      )}
    </div>
  );
}

// Helper functions for metric metadata
function getMetricDescription(metric: string): string {
  const descriptions: Record<string, string> = {
    'Confidence': 'Based on posture and delivery',
    'Professionalism': 'Communication and behavior',
    'Engagement': 'Interaction and enthusiasm',
    'Speech Clarity': 'Pronunciation and articulation',
    'Speech Pace': 'Words per minute normalized',
    'Eye Contact': 'Camera focus and attention',
    'Voice Volume': 'Speaking volume level',
    'Response Time': 'Answer timing efficiency',
    'Overall Performance': 'Combined interview performance'
  };
  return descriptions[metric] || '';
}

function getMetricTooltip(metric: string): string {
  const tooltips: Record<string, string> = {
    'Confidence': 'Measures your overall confidence level based on posture, voice, and delivery style',
    'Professionalism': 'Evaluates your professional demeanor and communication style',
    'Engagement': 'Measures how engaged and interactive you are during the interview',
    'Speech Clarity': 'Analyzes how clearly you speak and articulate your words',
    'Speech Pace': 'Monitors your speaking speed - ideal range is 120-150 words per minute',
    'Eye Contact': 'Measures how well you maintain eye contact with the camera',
    'Voice Volume': 'Monitors your speaking volume - ensure it\'s clear and consistent',
    'Response Time': 'Measures how quickly and efficiently you respond to questions',
    'Overall Performance': 'Combined score based on all metrics weighted by importance'
  };
  return tooltips[metric] || '';
}

function getMetricColor(metric: string): string {
  const colors: Record<string, string> = {
    'Confidence': 'blue',
    'Professionalism': 'purple',
    'Engagement': 'green',
    'Speech Clarity': 'yellow',
    'Speech Pace': 'red',
    'Eye Contact': 'indigo',
    'Voice Volume': 'emerald',
    'Response Time': 'orange',
    'Overall Performance': 'primary'
  };
  return colors[metric] || 'gray';
} 