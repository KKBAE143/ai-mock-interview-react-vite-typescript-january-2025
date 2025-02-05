import React, { useState } from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  AreaChart
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Share2, TrendingUp, Award, Target, Clock } from "lucide-react";
import { MetricHistory } from './emotion-analysis';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface AdvancedAnalyticsProps {
  currentMetrics: {
    confidence: number;
    professionalism: number;
    engagement: number;
    speechClarity: number;
    speechPace: number;
    eyeContact: number;
    volume: number;
    responseTime: number;
    overallScore: number;
  };
  historicalMetrics: {
    [key: string]: MetricHistory[];
  };
  benchmarkData?: {
    confidence: number;
    professionalism: number;
    engagement: number;
    speechClarity: number;
    speechPace: number;
    eyeContact: number;
    volume: number;
    responseTime: number;
    overallScore: number;
  };
}

const COLORS = {
  primary: '#22c55e',
  secondary: '#3b82f6',
  accent: '#f97316',
  warning: '#eab308',
  error: '#ef4444',
  success: '#10b981',
  info: '#06b6d4',
  purple: '#8b5cf6'
};

export function AdvancedAnalytics({ 
  currentMetrics, 
  historicalMetrics,
  benchmarkData 
}: AdvancedAnalyticsProps) {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate performance insights
  const insights = React.useMemo(() => {
    const results = [];
    
    // Overall Performance
    const overallDiff = currentMetrics.overallScore - (benchmarkData?.overallScore || 0);
    results.push({
      title: 'Overall Performance',
      value: currentMetrics.overallScore,
      change: overallDiff,
      description: overallDiff > 0 
        ? 'Performing above benchmark'
        : 'Room for improvement',
      color: overallDiff > 0 ? COLORS.success : COLORS.warning
    });

    // Top Strength
    const metrics = Object.entries(currentMetrics).filter(([key]) => key !== 'overallScore');
    const topStrength = metrics.reduce((prev, curr) => 
      curr[1] > prev[1] ? curr : prev
    );
    results.push({
      title: 'Top Strength',
      value: topStrength[1],
      metric: topStrength[0],
      description: `Excellent ${topStrength[0]} performance`,
      color: COLORS.primary
    });

    // Area for Improvement
    const lowestMetric = metrics.reduce((prev, curr) => 
      curr[1] < prev[1] ? curr : prev
    );
    results.push({
      title: 'Focus Area',
      value: lowestMetric[1],
      metric: lowestMetric[0],
      description: `Consider improving ${lowestMetric[0]}`,
      color: COLORS.accent
    });

    return results;
  }, [currentMetrics, benchmarkData]);

  // Prepare trend data
  const trendData = React.useMemo(() => {
    return Object.entries(historicalMetrics).map(([metric, history]) => ({
      metric,
      trend: history.length > 1 
        ? ((history[history.length - 1].value - history[0].value) / history[0].value) * 100
        : 0,
      currentValue: history[history.length - 1]?.value || 0
    })).sort((a, b) => Math.abs(b.trend) - Math.abs(a.trend));
  }, [historicalMetrics]);

  // Prepare radar chart data
  const radarData = [
    {
      metric: 'Confidence',
      current: currentMetrics.confidence,
      benchmark: benchmarkData?.confidence || 0,
    },
    {
      metric: 'Professionalism',
      current: currentMetrics.professionalism,
      benchmark: benchmarkData?.professionalism || 0,
    },
    {
      metric: 'Engagement',
      current: currentMetrics.engagement,
      benchmark: benchmarkData?.engagement || 0,
    },
    {
      metric: 'Speech Clarity',
      current: currentMetrics.speechClarity,
      benchmark: benchmarkData?.speechClarity || 0,
    },
    {
      metric: 'Speech Pace',
      current: currentMetrics.speechPace,
      benchmark: benchmarkData?.speechPace || 0,
    },
    {
      metric: 'Eye Contact',
      current: currentMetrics.eyeContact,
      benchmark: benchmarkData?.eyeContact || 0,
    },
  ];

  // Function to export metrics as CSV
  const exportMetrics = () => {
    const headers = ['Timestamp', ...Object.keys(currentMetrics)];
    const rows = [headers];

    const timestamps = new Set<number>();
    Object.values(historicalMetrics).forEach(metricData => {
      metricData.forEach(point => timestamps.add(point.timestamp));
    });

    const sortedTimestamps = Array.from(timestamps).sort();

    sortedTimestamps.forEach(timestamp => {
      const row = [new Date(timestamp).toISOString()];
      Object.keys(currentMetrics).forEach(metric => {
        const metricData = historicalMetrics[metric]?.find(
          point => point.timestamp === timestamp
        );
        row.push(metricData?.value.toString() || '');
      });
      rows.push(row);
    });

    const csvContent = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `interview_metrics_${new Date().toISOString()}.csv`;
    link.click();
  };

  // Function to share metrics summary
  const shareMetrics = async () => {
    const summary = {
      overallScore: currentMetrics.overallScore,
      timestamp: new Date().toISOString(),
      insights,
      trends: trendData
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(summary, null, 2));
      toast.success('Metrics copied to clipboard');
    } catch (error) {
      console.error('Failed to copy metrics:', error);
      toast.error('Failed to copy metrics');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Advanced Analytics</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportMetrics}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={shareMetrics}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value="overview" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {insights.map((insight, index) => (
                  <motion.div
                    key={insight.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          {insight.title}
                          {insight.change !== undefined && (
                            <span className={insight.change >= 0 ? 'text-green-500' : 'text-orange-500'}>
                              {insight.change >= 0 ? '↑' : '↓'}{Math.abs(insight.change).toFixed(1)}%
                            </span>
                          )}
                        </CardTitle>
                        <CardDescription>{insight.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="text-2xl font-bold">{insight.value}%</div>
                          <Progress 
                            value={insight.value} 
                            className="h-2"
                            indicatorClassName={cn(
                              "transition-all",
                              insight.color
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={Object.entries(currentMetrics)
                              .filter(([key]) => key !== 'overallScore')
                              .map(([name, value]) => ({ name, value }))}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                          >
                            {Object.values(COLORS).map((color, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={color}
                                className="transition-all duration-300 hover:opacity-80"
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Historical Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={historicalMetrics['Overall Performance']?.map(point => ({
                            time: new Date(point.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            }),
                            value: point.value
                          }))}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
                              <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="time" />
                          <YAxis domain={[0, 100]} />
                          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke={COLORS.primary}
                            fillOpacity={1}
                            fill="url(#colorScore)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="trends" className="mt-0">
              <div className="grid grid-cols-1 gap-4">
                {trendData.map((item, index) => (
                  <motion.div
                    key={item.metric}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{item.metric}</div>
                            <div className="text-sm text-muted-foreground">
                              Current: {item.currentValue}%
                            </div>
                          </div>
                          <div className={cn(
                            "text-sm font-medium",
                            item.trend > 0 ? "text-green-500" : "text-orange-500"
                          )}>
                            {item.trend > 0 ? '↑' : '↓'} {Math.abs(item.trend).toFixed(1)}%
                          </div>
                        </div>
                        <Progress 
                          value={item.currentValue}
                          className="h-2 mt-2"
                        />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="comparison" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Benchmark Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid strokeOpacity={0.2} />
                        <PolarAngleAxis
                          dataKey="metric"
                          tick={{ fill: '#888888', fontSize: 12 }}
                        />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar
                          name="Current"
                          dataKey="current"
                          stroke={COLORS.primary}
                          fill={COLORS.primary}
                          fillOpacity={0.5}
                        />
                        {benchmarkData && (
                          <Radar
                            name="Benchmark"
                            dataKey="benchmark"
                            stroke={COLORS.secondary}
                            fill={COLORS.secondary}
                            fillOpacity={0.3}
                          />
                        )}
                        <Legend />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
} 