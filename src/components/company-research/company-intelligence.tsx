import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  LineChart,
  BarChart,
  Building2,
  TrendingUp,
  Users,
  Briefcase,
  GraduationCap,
  NewspaperIcon,
  LineChart as LineChartIcon,
  MessageSquare,
  ExternalLink,
  Calendar,
  Globe,
  IndianRupee,
  MapPin,
  TrendingDown,
  Star,
  Clock,
  DollarSign,
  Award,
  BookOpen,
  CheckCircle2,
  Code2,
  GitBranch,
  Settings,
  InfoIcon,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { chatSession } from "@/scripts";
import { toast } from "sonner";
import { fetchCompanyNews } from "@/lib/news";
import { fetchIndianSalaryData } from "@/lib/salary";
import { fetchInterviewExperiences } from "@/lib/interviews";
import { fetchCertifications } from "@/lib/certifications";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { predictSalaryTrends, analyzeSalaryFactors } from '@/lib/gemini-service';
import type { SalaryInsights } from '../salary-insights/types';
import { NegotiationHelper } from '@/components/salary-insights/negotiation-helper';
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface CompanyNews {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  description: string;
}

interface SalaryData {
  role: string;
  minSalary: number;
  maxSalary: number;
  average: number;
  currency: string;
  trend: "up" | "down" | "stable";
  lastUpdated: string;
  experience: {
    entry: { min: number; max: number };
    mid: { min: number; max: number };
    senior: { min: number; max: number };
  };
  location: {
    city: string;
    adjustment: number;
  }[];
  benefits: string[];
  marketDemand: "High" | "Medium" | "Low";
  skills: {
    name: string;
    impact: number;
  }[];
}

interface InterviewExperience {
  role: string;
  date: string;
  difficulty: "Easy" | "Medium" | "Hard";
  outcome: "Accepted" | "Rejected" | "Pending";
  rounds: string[];
  tips: string[];
  questions: string[];
  rating?: number;
  location?: string;
  experience?: string;
  interviewProcess: {
    stage: string;
    description: string;
    duration: string;
    focus: string[];
    tips: string[];
  }[];
  technicalQuestions: {
    category: string;
    question: string;
    purpose: string;
    exampleAnswer?: string;
  }[];
  behavioralQuestions: {
    category: string;
    question: string;
    purpose: string;
    exampleResponse?: string;
  }[];
  successTips: {
    category: string;
    tips: string[];
    examples: string[];
  }[];
  companyInsights: {
    culture: string[];
    values: string[];
    recentAchievements: string[];
    techStack: string[];
    workStyle: string[];
  };
}

interface CertificationCategory {
  title: string;
  description: string;
  certifications: Certification[];
}

interface Certification {
  title: string;
  provider: string;
  level: string;
  duration: string;
  rating: number;
  enrolled: string;
  link: string;
  description: string;
  skills: string[];
  instructors?: string[];
  price?: string;
  badge?: string;
}

interface CompanyIntelligenceProps {
  companyName: string;
  industry: string;
  jobRole: string;
}

export function CompanyIntelligence({ companyName, industry, jobRole }: CompanyIntelligenceProps) {
  const [news, setNews] = useState<CompanyNews[]>([]);
  const [salaryData, setSalaryData] = useState<SalaryData[]>([]);
  const [experiences, setExperiences] = useState<InterviewExperience[]>([]);
  const [certifications, setCertifications] = useState<CertificationCategory[]>([]);
  const [loading, setLoading] = useState({
    news: false,
    salary: false,
    experiences: false,
    certifications: false,
  });
  const [salaryInsights, setSalaryInsights] = useState<SalaryInsights | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [location, setLocation] = useState<string | null>(null);

  useEffect(() => {
    fetchCompanyData();
  }, [companyName]);

  const fetchCompanyData = async () => {
    setLoading({ news: true, salary: true, experiences: true, certifications: true });

    try {
      // Fetch real-time news
      const newsData = await fetchCompanyNews(companyName);
      setNews(newsData);
      setLoading(prev => ({ ...prev, news: false }));
    } catch (error) {
      console.error("Error fetching news:", error);
      setNews([]);
      setLoading(prev => ({ ...prev, news: false }));
      toast.error("Failed to fetch company news");
    }

    try {
      // Fetch salary data for the entered job role
      const salaryData = await fetchIndianSalaryData(companyName, jobRole, industry);
      setSalaryData(salaryData);
      setLoading(prev => ({ ...prev, salary: false }));
    } catch (error) {
      console.error("Error fetching salary data:", error);
      setSalaryData([]);
      setLoading(prev => ({ ...prev, salary: false }));
      toast.error("Failed to fetch salary data");
    }

    try {
      // Fetch interview experiences for the specific job role
      const experiences = await fetchInterviewExperiences(companyName, jobRole);
      setExperiences(experiences);
      setLoading(prev => ({ ...prev, experiences: false }));
    } catch (error) {
      console.error("Error fetching experiences:", error);
      setExperiences([]);
      setLoading(prev => ({ ...prev, experiences: false }));
      toast.error("Failed to fetch interview experiences");
    }

    try {
      // Fetch certifications
      const certificationData = await fetchCertifications(companyName);
      setCertifications(certificationData);
      setLoading(prev => ({ ...prev, certifications: false }));
    } catch (error) {
      console.error("Error fetching certifications:", error);
      setCertifications([]);
      setLoading(prev => ({ ...prev, certifications: false }));
      toast.error("Failed to fetch certifications");
    }
  };

  const formatSalary = (amount: number): string => {
    if (amount >= 10000000) { // 1 crore or more
      return `${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) { // 1 lakh or more
      return `${(amount / 100000).toFixed(2)} L`;
    } else {
      return `${amount.toLocaleString('en-IN')}`;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <LineChartIcon className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case "High":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case "Accepted":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case "Coursera":
        return "https://www.coursera.org/favicon.ico";
      case "Udemy":
        return "https://www.udemy.com/favicon.ico";
      case "YouTube":
        return "https://www.youtube.com/favicon.ico";
      case "LinkedIn Learning":
        return "https://www.linkedin.com/favicon.ico";
      case "edX":
        return "https://www.edx.org/favicon.ico";
      case "Pluralsight":
        return "https://www.pluralsight.com/favicon.ico";
      default:
        return null;
    }
  };

  const handleSalaryPrediction = async () => {
    try {
      setIsAnalyzing(true);
      console.log('Starting salary prediction for:', { role: jobRole, location });
      
      const prediction = await predictSalaryTrends({
        role: jobRole,
        experience: 0,
        location: location || 'bangalore',
        skills: [], // We can enhance this later with actual skills
      });
      
      console.log('Received prediction:', prediction);
      setSalaryInsights(prediction);
      
      toast.success('Successfully fetched salary insights');
    } catch (error) {
      console.error('Detailed error in salary prediction:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to fetch salary insights');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="news" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="news" className="flex items-center gap-2">
            <NewspaperIcon className="w-4 h-4" />
            Company News
          </TabsTrigger>
          <TabsTrigger value="salary" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Salary Trends
          </TabsTrigger>
          <TabsTrigger value="experiences" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Interview Experiences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="news" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Latest Company Updates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading.news ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                news.map((item, index) => (
                  <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <h3 className="font-medium mb-2 group-hover:text-primary flex items-center gap-2">
                        {item.title}
                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>
                    </a>
                    <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {item.source}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.pubDate).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                ))
              )}
              
              {!loading.news && news.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  No recent news found for {companyName}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="salary" className="mt-6">
          <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChartIcon className="w-5 h-5" />
                Indian Salary Insights
              </CardTitle>
                <CardDescription>
                  AI-powered salary insights for {jobRole} at {companyName}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading.salary ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-[125px] w-full" />
                  ))}
                </div>
                ) : (
                  <div className="space-y-8">
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Select 
                            value={location || ''} 
                            onValueChange={(value) => setLocation(value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                              <ScrollArea className="h-[400px]">
                                {/* Major Tech Hubs */}
                                <div className="px-2 py-1.5 text-sm font-semibold">Major Tech Hubs</div>
                                <SelectItem value="bangalore">Bangalore</SelectItem>
                                <SelectItem value="hyderabad">Hyderabad</SelectItem>
                                <SelectItem value="mumbai">Mumbai</SelectItem>
                                <SelectItem value="delhi-ncr">Delhi NCR</SelectItem>
                                <SelectItem value="pune">Pune</SelectItem>
                                <SelectItem value="chennai">Chennai</SelectItem>
                                <SelectItem value="kolkata">Kolkata</SelectItem>
                                <SelectItem value="noida">Noida</SelectItem>
                                <SelectItem value="gurgaon">Gurgaon</SelectItem>

                                <Separator className="my-2" />
                                
                                {/* States */}
                                <div className="px-2 py-1.5 text-sm font-semibold">States</div>
                                <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                                <SelectItem value="karnataka">Karnataka</SelectItem>
                                <SelectItem value="kerala">Kerala</SelectItem>
                                <SelectItem value="maharashtra">Maharashtra</SelectItem>
                                <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                                <SelectItem value="telangana">Telangana</SelectItem>
                                <SelectItem value="gujarat">Gujarat</SelectItem>
                                <SelectItem value="rajasthan">Rajasthan</SelectItem>
                                {/* Add other states as needed */}
                              </ScrollArea>
                            </SelectContent>
                          </Select>
                        </div>
                    </div>

                      <div className="flex justify-end">
                        <Button 
                          onClick={handleSalaryPrediction}
                          disabled={isAnalyzing || !location}
                          className="w-full md:w-auto relative overflow-hidden group"
                        >
                          {isAnalyzing ? (
                            <>
                              <span className="animate-spin mr-2">⭮</span>
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <span className="relative z-10">Get AI Insights</span>
                              <motion.div
                                className="absolute inset-0 bg-primary/10"
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                              />
                            </>
                          )}
                        </Button>
                          </div>
                        </div>

                    {salaryInsights && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <motion.div 
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            className="space-y-4"
                          >
                            <h4 className="font-medium flex items-center gap-2">
                            <IndianRupee className="w-4 h-4" />
                              Salary Range
                            </h4>
                            <div className="grid grid-cols-3 gap-4">
                              <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                <div className="text-sm text-muted-foreground">Minimum</div>
                                <div className="text-2xl font-bold">
                                  ₹{(salaryInsights.baseData.minimum / 100000).toFixed(2)}L
                          </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  Per Month: ₹{Math.round(salaryInsights.baseData.minimum / 12).toLocaleString('en-IN')}
                        </div>
                              </motion.div>
                              <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="p-4 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
                              >
                                <div className="text-sm text-muted-foreground">Average</div>
                                <div className="text-2xl font-bold text-primary">
                                  ₹{(salaryInsights.baseData.average / 100000).toFixed(2)}L
                          </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  Per Month: ₹{Math.round(salaryInsights.baseData.average / 12).toLocaleString('en-IN')}
                        </div>
                              </motion.div>
                              <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                <div className="text-sm text-muted-foreground">Maximum</div>
                                <div className="text-2xl font-bold">
                                  ₹{(salaryInsights.baseData.maximum / 100000).toFixed(2)}L
                      </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  Per Month: ₹{Math.round(salaryInsights.baseData.maximum / 12).toLocaleString('en-IN')}
                    </div>
                              </motion.div>
                            </div>
                          </motion.div>

                          <motion.div 
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            className="space-y-4"
                          >
                            <h4 className="font-medium flex items-center gap-2">
                              <TrendingUp className="w-4 h-4" />
                              Market Demand
                            </h4>
                            <motion.div 
                              initial={{ x: 20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <div className="text-2xl font-bold mb-2 flex items-center gap-2">
                                {salaryInsights.marketDemand}
                                {salaryInsights.marketDemand === 'High' && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.5 }}
                                  >
                                    <Badge className="bg-green-100 text-green-800">Hot</Badge>
                                  </motion.div>
                                )}
                          </div>
                              <Progress 
                                value={
                                  salaryInsights.marketDemand === 'High' 
                                    ? 100 
                                    : salaryInsights.marketDemand === 'Medium' 
                                    ? 50 
                                    : 25
                                }
                                className="h-2"
                              />
                            </motion.div>
                          </motion.div>
                      </div>

                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="col-span-2"
                        >
                          <Tabs defaultValue="experience" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="experience">Experience Levels</TabsTrigger>
                              <TabsTrigger value="cities">City Comparison</TabsTrigger>
                            </TabsList>
                            <TabsContent value="experience" className="mt-4">
                              <Card>
                                <CardContent className="pt-6">
                                  <div className="space-y-4">
                                    <motion.div 
                                      initial={{ x: -20, opacity: 0 }}
                                      animate={{ x: 0, opacity: 1 }}
                                      transition={{ delay: 0.1 }}
                                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                      <div>
                                        <div className="font-medium">Entry Level</div>
                                        <div className="text-sm text-muted-foreground">0-3 years</div>
                    </div>
                                      <div className="text-right">
                                        <div className="font-bold">
                                          ₹{(salaryInsights.experienceLevels.entry.min / 100000).toFixed(1)}L - 
                                          {(salaryInsights.experienceLevels.entry.max / 100000).toFixed(1)}L
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                          ₹{Math.round(salaryInsights.experienceLevels.entry.min / 12).toLocaleString('en-IN')} - 
                                          {Math.round(salaryInsights.experienceLevels.entry.max / 12).toLocaleString('en-IN')}/month
                                        </div>
                                      </div>
                                    </motion.div>
                                    
                                    <motion.div 
                                      initial={{ x: -20, opacity: 0 }}
                                      animate={{ x: 0, opacity: 1 }}
                                      transition={{ delay: 0.2 }}
                                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                      <div>
                                        <div className="font-medium">Mid Level</div>
                                        <div className="text-sm text-muted-foreground">3-6 years</div>
                          </div>
                                      <div className="text-right">
                                        <div className="font-bold">
                                          ₹{(salaryInsights.experienceLevels.mid.min / 100000).toFixed(1)}L - 
                                          {(salaryInsights.experienceLevels.mid.max / 100000).toFixed(1)}L
                      </div>
                                        <div className="text-sm text-muted-foreground">
                                          ₹{Math.round(salaryInsights.experienceLevels.mid.min / 12).toLocaleString('en-IN')} - 
                                          {Math.round(salaryInsights.experienceLevels.mid.max / 12).toLocaleString('en-IN')}/month
                    </div>
                                      </div>
                                    </motion.div>
                                    
                                    <motion.div 
                                      initial={{ x: -20, opacity: 0 }}
                                      animate={{ x: 0, opacity: 1 }}
                                      transition={{ delay: 0.3 }}
                                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                      <div>
                                        <div className="font-medium">Senior Level</div>
                                        <div className="text-sm text-muted-foreground">6+ years</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="font-bold">
                                          ₹{(salaryInsights.experienceLevels.senior.min / 100000).toFixed(1)}L - 
                                          {(salaryInsights.experienceLevels.senior.max / 100000).toFixed(1)}L
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                          ₹{Math.round(salaryInsights.experienceLevels.senior.min / 12).toLocaleString('en-IN')} - 
                                          {Math.round(salaryInsights.experienceLevels.senior.max / 12).toLocaleString('en-IN')}/month
                                        </div>
                                      </div>
                                    </motion.div>
                                  </div>
                                </CardContent>
                              </Card>
                            </TabsContent>
                            <TabsContent value="cities" className="mt-4">
                              <Card>
                                <CardContent className="pt-6">
                                  <div className="space-y-6">
                                    {/* Tier 1 Cities */}
                                    <div>
                                      <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                                        <Star className="w-4 h-4 text-yellow-500" />
                                        Tier 1 Cities
                                      </h4>
                                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {salaryInsights.cityAdjustments
                                          .filter(city => city.tier === "1")
                                          .map((city, index) => (
                                            <motion.div
                                              key={city.city}
                                              initial={{ scale: 0.9, opacity: 0 }}
                                              animate={{ scale: 1, opacity: 1 }}
                                              transition={{ delay: index * 0.1 }}
                                              className="relative p-4 border rounded-lg hover:bg-gray-50 transition-colors group"
                                            >
                                              <div className="flex items-center gap-2 mb-2">
                                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                                <div className="font-medium">{city.city}</div>
                                              </div>
                                              <div className="text-2xl font-bold text-primary">
                                                {city.percentage}%
                                              </div>
                                              <div className="text-sm text-muted-foreground">
                                                of base salary
                                              </div>
                                              <Progress 
                                                value={city.percentage} 
                                                className="h-1 mt-2 bg-gray-100"
                                              />
                                              <HoverCard>
                                                <HoverCardTrigger>
                                                  <InfoIcon className="w-4 h-4 absolute top-2 right-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </HoverCardTrigger>
                                                <HoverCardContent>
                      <div className="space-y-2">
                                                    <p className="text-sm">Salary Range in {city.city}:</p>
                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                      <div>
                                                        <div className="text-muted-foreground">Annual</div>
                                                        <div className="font-medium">
                                                          ₹{((salaryInsights.baseData.average * city.percentage / 100) / 100000).toFixed(1)}L
                          </div>
                                                      </div>
                                                      <div>
                                                        <div className="text-muted-foreground">Monthly</div>
                                                        <div className="font-medium">
                                                          ₹{Math.round((salaryInsights.baseData.average * city.percentage / 100) / 12).toLocaleString('en-IN')}
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </HoverCardContent>
                                              </HoverCard>
                                            </motion.div>
                        ))}
                      </div>
                    </div>

                                    {/* Tier 2 Cities */}
                                    <div>
                                      <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                                        <Building2 className="w-4 h-4 text-blue-500" />
                                        Tier 2 Cities
                                      </h4>
                                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {salaryInsights.cityAdjustments
                                          .filter(city => city.tier === "2")
                                          .map((city, index) => (
                                            <motion.div
                                              key={city.city}
                                              initial={{ scale: 0.9, opacity: 0 }}
                                              animate={{ scale: 1, opacity: 1 }}
                                              transition={{ delay: 0.3 + (index * 0.1) }}
                                              className="relative p-4 border rounded-lg hover:bg-gray-50 transition-colors group"
                                            >
                                              <div className="flex items-center gap-2 mb-2">
                                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                                <div className="font-medium">{city.city}</div>
                                              </div>
                                              <div className="text-2xl font-bold text-blue-600">
                                                {city.percentage}%
                                              </div>
                                              <div className="text-sm text-muted-foreground">
                                                of base salary
                                              </div>
                                              <Progress 
                                                value={city.percentage} 
                                                className="h-1 mt-2 bg-gray-100"
                                              />
                                              <HoverCard>
                                                <HoverCardTrigger>
                                                  <InfoIcon className="w-4 h-4 absolute top-2 right-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </HoverCardTrigger>
                                                <HoverCardContent>
                                                  <div className="space-y-2">
                                                    <p className="text-sm">Salary Range in {city.city}:</p>
                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                      <div>
                                                        <div className="text-muted-foreground">Annual</div>
                                                        <div className="font-medium">
                                                          ₹{((salaryInsights.baseData.average * city.percentage / 100) / 100000).toFixed(1)}L
                                                        </div>
                                                      </div>
                                                      <div>
                                                        <div className="text-muted-foreground">Monthly</div>
                                                        <div className="font-medium">
                                                          ₹{Math.round((salaryInsights.baseData.average * city.percentage / 100) / 12).toLocaleString('en-IN')}
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </HoverCardContent>
                                              </HoverCard>
                                            </motion.div>
                        ))}
                      </div>
                    </div>

                                    <div className="text-xs text-muted-foreground mt-4">
                                      * Percentages are relative to base salary in Bangalore
                    </div>
                  </div>
                                </CardContent>
                              </Card>
                            </TabsContent>
                          </Tabs>
                        </motion.div>

                        {salaryInsights.skillPremiums.length > 0 && (
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="col-span-2"
                          >
                            <h4 className="font-medium mb-4 flex items-center gap-2">
                              <Code2 className="w-4 h-4" />
                              Skill Premiums
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {salaryInsights.skillPremiums.map((skill, index) => (
                                <motion.div 
                                  key={skill.skill}
                                  initial={{ scale: 0.9, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ delay: 0.6 + (index * 0.1) }}
                                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <div className="font-medium">{skill.skill}</div>
                                  <div className="text-2xl font-bold text-primary">
                                    +{skill.percentage}%
                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    salary premium
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                </div>
              )}
            </CardContent>
          </Card>

            <NegotiationHelper
              role={jobRole}
              experience={0}
              location={location || ''}
              skills={salaryData?.[0]?.skills?.map(s => s.name) || []}
              companyName={companyName}
              industry={industry}
            />
          </div>
        </TabsContent>

        <TabsContent value="experiences" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Recent Interview Experiences
              </CardTitle>
              <CardDescription>
                Real interview experiences shared by candidates who recently interviewed at {companyName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading.experiences ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-20 bg-gray-200 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              ) : experiences.length > 0 ? (
                <div className="space-y-8">
                  {experiences.map((exp, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-xl font-semibold flex items-center gap-2">
                            {jobRole}
                            {exp.rating && (
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={cn(
                                      "w-4 h-4",
                                      i < exp.rating!
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300"
                                    )}
                                  />
                                ))}
                              </div>
                            )}
                          </h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            {exp.location && (
                              <HoverCard>
                                <HoverCardTrigger>
                                  <span className="flex items-center gap-1 hover:text-primary">
                                    <MapPin className="w-3 h-3" />
                                    {exp.location}
                                  </span>
                                </HoverCardTrigger>
                                <HoverCardContent>
                                  View more interviews from {exp.location}
                                </HoverCardContent>
                              </HoverCard>
                            )}
                            {exp.experience && (
                              <span className="flex items-center gap-1">
                                <Briefcase className="w-3 h-3" />
                                {exp.experience} Experience
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(exp.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge
                            className={cn(
                              "text-sm font-medium transition-colors",
                              getDifficultyColor(exp.difficulty)
                            )}
                          >
                            {exp.difficulty}
                          </Badge>
                          <Badge
                            className={cn(
                              "text-sm font-medium transition-colors",
                              getOutcomeColor(exp.outcome)
                            )}
                          >
                            {exp.outcome}
                          </Badge>
                        </div>
                      </div>

                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="interview-process">
                          <AccordionTrigger className="text-lg font-semibold">
                            Interview Process
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4 mt-4">
                              {exp.interviewProcess.map((stage, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.1 }}
                                  className="relative pl-8 pb-8 last:pb-0"
                                >
                                  <div className="absolute left-0 top-0 bottom-0 w-px bg-border">
                                    <div className="absolute top-0 left-[-4px] w-2 h-2 rounded-full bg-primary" />
                                  </div>
                                  <div className="border rounded-lg p-4 bg-card">
                                    <div className="flex items-center justify-between mb-3">
                                      <h4 className="font-medium text-primary">{stage.stage}</h4>
                                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {stage.duration}
                                      </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-4">
                                      {stage.description}
                                    </p>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h5 className="text-xs font-medium mb-2 text-primary">Focus Areas</h5>
                                        <ul className="space-y-1">
                                          {stage.focus.map((item, j) => (
                                            <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                                              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                                              {item}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                      <div>
                                        <h5 className="text-xs font-medium mb-2 text-primary">Tips</h5>
                                        <ul className="space-y-1">
                                          {stage.tips.map((tip, j) => (
                                            <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                                              <BookOpen className="w-4 h-4 text-blue-500 mt-0.5" />
                                              {tip}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="technical-questions">
                          <AccordionTrigger className="text-lg font-semibold">
                            Technical Questions
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid gap-4 mt-4">
                              {exp.technicalQuestions.map((q, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: i * 0.1 }}
                                  className="border rounded-lg p-4 bg-card"
                                >
                                  <div className="flex items-start gap-4">
                                    <div className="p-2 rounded-full bg-primary/10">
                                      {q.category === "Coding" ? (
                                        <Code2 className="w-4 h-4 text-primary" />
                                      ) : q.category === "System Design" ? (
                                        <GitBranch className="w-4 h-4 text-primary" />
                                      ) : (
                                        <Settings className="w-4 h-4 text-primary" />
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <Badge className="mb-2">{q.category}</Badge>
                                      <h5 className="font-medium mb-2">{q.question}</h5>
                                      <p className="text-sm text-muted-foreground mb-4">{q.purpose}</p>
                                      {q.exampleAnswer && (
                                        <div className="bg-muted/50 rounded-lg p-4">
                                          <h6 className="text-xs font-medium mb-2 text-primary">Example Approach</h6>
                                          <p className="text-sm text-muted-foreground">{q.exampleAnswer}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="behavioral-questions">
                          <AccordionTrigger className="text-lg font-semibold">
                            Behavioral Questions
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid gap-4 mt-4">
                              {exp.behavioralQuestions.map((q, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: i * 0.1 }}
                                  className="border rounded-lg p-4 bg-card"
                                >
                                  <div className="flex items-start gap-4">
                                    <div className="p-2 rounded-full bg-primary/10">
                                      {q.category === "Leadership" ? (
                                        <Users className="w-4 h-4 text-primary" />
                                      ) : q.category === "Problem Solving" ? (
                                        <GitBranch className="w-4 h-4 text-primary" />
                                      ) : (
                                        <MessageSquare className="w-4 h-4 text-primary" />
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <Badge className="mb-2">{q.category}</Badge>
                                      <h5 className="font-medium mb-2">{q.question}</h5>
                                      <p className="text-sm text-muted-foreground mb-4">{q.purpose}</p>
                                      {q.exampleResponse && (
                                        <div className="bg-muted/50 rounded-lg p-4">
                                          <h6 className="text-xs font-medium mb-2 text-primary">Example Response</h6>
                                          <p className="text-sm text-muted-foreground">{q.exampleResponse}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="success-tips">
                          <AccordionTrigger className="text-lg font-semibold">
                            Success Tips
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid gap-6 mt-4">
                              {exp.successTips.map((tip, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: i * 0.1 }}
                                  className="border rounded-lg p-4 bg-card"
                                >
                                  <h5 className="font-medium text-primary mb-4">{tip.category}</h5>
                                  <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                      <h6 className="text-xs font-medium mb-2">Tips</h6>
                                      <ul className="space-y-2">
                                        {tip.tips.map((t, j) => (
                                          <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                                            {t}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div>
                                      <h6 className="text-xs font-medium mb-2">Examples</h6>
                                      <ul className="space-y-2">
                                        {tip.examples.map((e, j) => (
                                          <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                                            <BookOpen className="w-4 h-4 text-blue-500 mt-0.5" />
                                            {e}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="company-insights">
                          <AccordionTrigger className="text-lg font-semibold">
                            Company Insights
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid gap-6 mt-4">
                              <div className="grid grid-cols-2 gap-4">
                                <motion.div
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="border rounded-lg p-4 bg-card"
                                >
                                  <h5 className="font-medium text-primary mb-3">Culture & Values</h5>
                                  <ul className="space-y-2">
                                    {[...exp.companyInsights.culture, ...exp.companyInsights.values].map((item, i) => (
                                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                        <Users className="w-4 h-4 text-purple-500 mt-0.5" />
                                        {item}
                                      </li>
                                    ))}
                                  </ul>
                                </motion.div>
                                <motion.div
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="border rounded-lg p-4 bg-card"
                                >
                                  <h5 className="font-medium text-primary mb-3">Recent Achievements</h5>
                                  <ul className="space-y-2">
                                    {exp.companyInsights.recentAchievements.map((item, i) => (
                                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                        <Award className="w-4 h-4 text-yellow-500 mt-0.5" />
                                        {item}
                                      </li>
                                    ))}
                                  </ul>
                                </motion.div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <motion.div
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.2 }}
                                  className="border rounded-lg p-4 bg-card"
                                >
                                  <h5 className="font-medium text-primary mb-3">Tech Stack</h5>
                                  <div className="flex flex-wrap gap-2">
                                    {exp.companyInsights.techStack.map((tech, i) => (
                                      <Badge
                                        key={i}
                                        variant="secondary"
                                        className="bg-primary/10 hover:bg-primary/20 transition-colors"
                                      >
                                        {tech}
                                      </Badge>
                                    ))}
                                  </div>
                                </motion.div>
                                <motion.div
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.2 }}
                                  className="border rounded-lg p-4 bg-card"
                                >
                                  <h5 className="font-medium text-primary mb-3">Work Style</h5>
                                  <ul className="space-y-2">
                                    {exp.companyInsights.workStyle.map((item, i) => (
                                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                        <Settings className="w-4 h-4 text-blue-500 mt-0.5" />
                                        {item}
                                      </li>
                                    ))}
                                  </ul>
                                </motion.div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mb-4">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Interview Experiences Yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    We couldn't find any interview experiences for {companyName} at the moment.
                    Check back later or be the first to share your experience!
                  </p>
                  <Button onClick={fetchCompanyData} variant="outline" className="gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Retry Loading Data
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 