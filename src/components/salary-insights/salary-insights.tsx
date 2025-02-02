'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Skeleton } from '../ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Slider } from '@/components/ui/slider';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart, Bar } from 'recharts';
import { Briefcase, Building2, MapPin, TrendingUp, GraduationCap, Clock, Award, Search, Filter, ChevronRight, Sparkles, Users, Target, Laptop, BookOpen, Zap } from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useDebounce } from '@/hooks/use-debounce';
import { useToast } from '@/components/ui/use-toast';
import { predictSalaryTrends, analyzeSalaryFactors } from '@/lib/gemini-service';
import type { SalaryInsights } from './types';
import { Progress } from '@/components/ui/progress';

interface RoleInsight {
  role: string;
  category: string;
  minSalary: number;
  maxSalary: number;
  avgSalary: number;
  demand: 'High' | 'Medium' | 'Low';
  yoe: string;
  skills: string[];
  companies: string[];
  growth: number;
}

interface RoleSkillLevel {
  skill: string;
  level: number;
  importance: number;
}

interface RoleInsightExtended extends RoleInsight {
  skillLevels: RoleSkillLevel[];
  learningPath: string[];
  certifications: string[];
  jobDescription: string;
  responsibilities: string[];
  futureProspects: {
    roles: string[];
    skills: string[];
    salaryIncrease: number;
  };
}

const roles: RoleInsight[] = [
  {
    role: 'Frontend Developer',
    category: 'Web Development',
    minSalary: 900000,
    maxSalary: 3700000,
    avgSalary: 1800000,
    demand: 'High',
    yoe: '0-5 years',
    skills: ['React', 'TypeScript', 'Next.js', 'TailwindCSS'],
    companies: ['Microsoft', 'Amazon', 'Flipkart', 'Swiggy'],
    growth: 20
  },
  {
    role: 'Backend Developer',
    category: 'Web Development',
    minSalary: 1000000,
    maxSalary: 4000000,
    avgSalary: 2000000,
    demand: 'High',
    yoe: '0-5 years',
    skills: ['Node.js', 'Python', 'Java', 'AWS'],
    companies: ['Google', 'Amazon', 'Razorpay', 'Zerodha'],
    growth: 18
  },
  {
    role: 'Full Stack Developer',
    category: 'Web Development',
    minSalary: 1200000,
    maxSalary: 4500000,
    avgSalary: 2400000,
    demand: 'High',
    yoe: '2-6 years',
    skills: ['MERN', 'DevOps', 'Cloud', 'System Design'],
    companies: ['Microsoft', 'Google', 'Flipkart', 'Meesho'],
    growth: 25
  },
  {
    role: 'UI/UX Designer',
    category: 'Design',
    minSalary: 800000,
    maxSalary: 3500000,
    avgSalary: 1600000,
    demand: 'Medium',
    yoe: '0-4 years',
    skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
    companies: ['Swiggy', 'Razorpay', 'PhonePe', 'CRED'],
    growth: 15
  },
  {
    role: 'DevOps Engineer',
    category: 'Infrastructure',
    minSalary: 1400000,
    maxSalary: 4800000,
    avgSalary: 2600000,
    demand: 'High',
    yoe: '2-6 years',
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
    companies: ['Amazon', 'Microsoft', 'Atlassian', 'Freshworks'],
    growth: 30
  },
  {
    role: 'Data Scientist',
    category: 'Data',
    minSalary: 1200000,
    maxSalary: 4200000,
    avgSalary: 2200000,
    demand: 'High',
    yoe: '1-5 years',
    skills: ['Python', 'ML', 'Deep Learning', 'SQL'],
    companies: ['Google', 'Amazon', 'Flipkart', 'Walmart'],
    growth: 22
  }
];

const categories = Array.from(new Set(roles.map(role => role.category)));

interface TrendDataPoint {
  month: string;
  [key: string]: string | number;
}

interface CompanyDetail {
  name: string;
  openPositions: number;
  benefits: string[];
  rating: number;
  reviews: number;
  interviewProcess: string[];
}

const companyDetails: { [key: string]: CompanyDetail } = {
  'Microsoft': {
    name: 'Microsoft',
    openPositions: 150,
    benefits: ['Health Insurance', 'RSU', 'Flexible Work', 'Learning Allowance'],
    rating: 4.5,
    reviews: 2500,
    interviewProcess: ['Online Assessment', 'Technical Round', 'System Design', 'HR Discussion']
  },
  'Google': {
    name: 'Google',
    openPositions: 120,
    benefits: ['Health Insurance', 'GSU', 'Remote Work', 'Wellness Programs'],
    rating: 4.7,
    reviews: 3000,
    interviewProcess: ['Coding Rounds', 'Technical Discussion', 'System Design', 'Team Matching']
  },
  // Add more company details...
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function SalaryInsightsComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentSalary, setCurrentSalary] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [insights, setInsights] = useState<SalaryInsights | null>(null);
  const { toast } = useToast();

  async function handlePrediction() {
    try {
      setIsLoading(true);
      const prediction = await predictSalaryTrends({
        role,
        experience: Number(experience),
        location,
        skills,
      });
      setInsights(prediction);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch salary predictions',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Advanced Salary Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="predict">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="predict">Predict Salary</TabsTrigger>
              <TabsTrigger value="analyze">Analyze Current</TabsTrigger>
            </TabsList>

            <TabsContent value="predict" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Software Engineer"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g. 5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select onValueChange={setLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bangalore">Bangalore</SelectItem>
                      <SelectItem value="mumbai">Mumbai</SelectItem>
                      <SelectItem value="delhi">Delhi NCR</SelectItem>
                      <SelectItem value="hyderabad">Hyderabad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handlePrediction}
                disabled={isLoading}
                className="w-full mt-4"
              >
                {isLoading ? 'Analyzing...' : 'Get Salary Insights'}
              </Button>
            </TabsContent>

            <TabsContent value="analyze" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentSalary">Current Salary (Annual)</Label>
                <Input
                  id="currentSalary"
                  type="number"
                  value={currentSalary}
                  onChange={(e) => setCurrentSalary(e.target.value)}
                  placeholder="e.g. 1200000"
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {insights && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Salary Range</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Minimum</Label>
                  <div className="text-2xl font-bold">
                    ₹{insights.baseData.minimum.toLocaleString()}
                  </div>
                </div>
                <div>
                  <Label>Average</Label>
                  <div className="text-2xl font-bold text-primary">
                    ₹{insights.baseData.average.toLocaleString()}
                  </div>
                </div>
                <div>
                  <Label>Maximum</Label>
                  <div className="text-2xl font-bold">
                    ₹{insights.baseData.maximum.toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Market Demand</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-2xl font-bold">{insights.marketDemand}</div>
                <Progress 
                  value={
                    insights.marketDemand === 'High' 
                      ? 100 
                      : insights.marketDemand === 'Medium' 
                      ? 50 
                      : 25
                  } 
                />
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Skill Premiums</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {insights.skillPremiums.map((skill) => (
                  <div 
                    key={skill.skill}
                    className="p-4 border rounded-lg"
                  >
                    <div className="font-medium">{skill.skill}</div>
                    <div className="text-2xl font-bold text-primary">
                      +{skill.percentage}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 