import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

      // Fetch salary data for the entered job role
      const salaryData = await fetchIndianSalaryData(companyName, jobRole, industry);
      console.log('Fetched salary data:', salaryData);
      setSalaryData(salaryData);
      setLoading(prev => ({ ...prev, salary: false }));

      // Fetch interview experiences for the specific job role
      const allExperiences = await fetchInterviewExperiences(companyName, jobRole);
      const roleSpecificExperiences = allExperiences.filter(exp => 
        exp.role.toLowerCase() === jobRole.toLowerCase()
      );
      setExperiences(roleSpecificExperiences);
      setLoading(prev => ({ ...prev, experiences: false }));

      // Fetch certifications
      const certificationData = await fetchCertifications(companyName);
      setCertifications(certificationData);
      setLoading(prev => ({ ...prev, certifications: false }));

    } catch (error) {
      console.error("Error fetching company data:", error);
      toast.error("Failed to fetch company data");
      setLoading({ news: false, salary: false, experiences: false, certifications: false });
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChartIcon className="w-5 h-5" />
                Indian Salary Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading.salary ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-8 bg-gray-200 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              ) : salaryData.length > 0 ? (
                salaryData.map((item, index) => (
                  <div key={index} className="border-b last:border-0 pb-6 last:pb-0">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-lg">{item.role}</h3>
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getTrendIcon(item.trend)}
                        Market Trend
                      </Badge>
                    </div>

                    {/* Overall Salary Range */}
                    <div className="space-y-4 mb-6">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">Minimum</div>
                          <div className="font-semibold flex items-center gap-1">
                            <IndianRupee className="w-4 h-4" />
                            {formatSalary(item.minSalary)}
                          </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">Average</div>
                          <div className="font-semibold flex items-center gap-1">
                            <IndianRupee className="w-4 h-4" />
                            {formatSalary(item.average)}
                          </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">Maximum</div>
                          <div className="font-semibold flex items-center gap-1">
                            <IndianRupee className="w-4 h-4" />
                            {formatSalary(item.maxSalary)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Experience-wise Breakdown */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium mb-3">Experience-wise Breakdown</h4>
                      <div className="space-y-3">
                        {Object.entries(item.experience).map(([level, range]) => (
                          <div key={level} className="flex items-center justify-between text-sm">
                            <span className="capitalize">{level} Level</span>
                            <span className="flex items-center gap-1">
                              <IndianRupee className="w-3 h-3" />
                              {formatSalary(range.min)} - {formatSalary(range.max)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Location Adjustments */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium mb-3">City-wise Adjustments</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {item.location.map((loc) => (
                          <div key={loc.city} className="flex items-center gap-2 text-sm">
                            <MapPin className="w-3 h-3" />
                            <span>{loc.city}:</span>
                            <span className="text-muted-foreground">{loc.adjustment}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Skills Impact */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium mb-3">Skills Premium</h4>
                      <div className="space-y-2">
                        {item.skills.map((skill) => (
                          <div key={skill.name} className="flex items-center justify-between text-sm">
                            <span>{skill.name}</span>
                            <Badge variant="outline">+{skill.impact}%</Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Benefits */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-3">Benefits & Perks</h4>
                      <div className="flex flex-wrap gap-2">
                        {item.benefits.map((benefit, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
                      <Badge className={getDemandColor(item.marketDemand)}>
                        {item.marketDemand} Market Demand
                      </Badge>
                      <span>Last Updated: {new Date(item.lastUpdated).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="mb-4">
                    <LineChartIcon className="w-12 h-12 text-muted-foreground mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Salary Data Available</h3>
                  <p className="text-muted-foreground mb-4">
                    We couldn't find salary data for {companyName} at the moment.
                  </p>
                  <Button onClick={fetchCompanyData} variant="outline" className="gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Retry Loading Data
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experiences" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Recent Interview Experiences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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
                experiences.map((exp, index) => (
                  <div key={index} className="border-b last:border-0 pb-6 last:pb-0">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          {jobRole}
                          {exp.rating && (
                            <span className="flex items-center gap-1 text-yellow-500">
                              <Star className="w-4 h-4 fill-current" />
                              {exp.rating}
                            </span>
                          )}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2">
                          {exp.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {exp.location}
                            </span>
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
                        <Badge className={getDifficultyColor(exp.difficulty)}>
                          {exp.difficulty}
                        </Badge>
                        <Badge className={getOutcomeColor(exp.outcome)}>
                          {exp.outcome}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium mb-4">Interview Process</h4>
                        <div className="space-y-4">
                          {exp.interviewProcess.map((stage, i) => (
                            <div key={i} className="border rounded-lg p-4">
                              <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  {i + 1}
                                </div>
                                <div className="space-y-2 flex-1">
                                  <h5 className="font-medium">{stage.stage}</h5>
                                  <p className="text-sm text-muted-foreground">{stage.description}</p>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    {stage.duration}
                                  </div>
                                  <div className="mt-3">
                                    <h6 className="text-xs font-medium mb-2">Focus Areas:</h6>
                                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                      {stage.focus.map((item, j) => (
                                        <li key={j} className="pl-2">
                                          <span className="ml-[-1.5rem]">•</span> {item}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div className="mt-3">
                                    <h6 className="text-xs font-medium mb-2">Tips:</h6>
                                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                      {stage.tips.map((tip, j) => (
                                        <li key={j} className="pl-2">
                                          <span className="ml-[-1.5rem]">•</span> {tip}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-4">Technical Questions</h4>
                        <div className="space-y-4">
                          {exp.technicalQuestions.map((q, i) => (
                            <div key={i} className="border rounded-lg p-4">
                              <Badge className="mb-2">{q.category}</Badge>
                              <h5 className="font-medium mb-2">{q.question}</h5>
                              <p className="text-sm text-muted-foreground mb-3">{q.purpose}</p>
                              {q.exampleAnswer && (
                                <div className="bg-muted p-3 rounded-md">
                                  <h6 className="text-xs font-medium mb-1">Example Approach:</h6>
                                  <p className="text-sm text-muted-foreground">{q.exampleAnswer}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-4">Behavioral Questions</h4>
                        <div className="space-y-4">
                          {exp.behavioralQuestions.map((q, i) => (
                            <div key={i} className="border rounded-lg p-4">
                              <Badge className="mb-2">{q.category}</Badge>
                              <h5 className="font-medium mb-2">{q.question}</h5>
                              <p className="text-sm text-muted-foreground mb-3">{q.purpose}</p>
                              {q.exampleResponse && (
                                <div className="bg-muted p-3 rounded-md">
                                  <h6 className="text-xs font-medium mb-1">Example Response:</h6>
                                  <p className="text-sm text-muted-foreground">{q.exampleResponse}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-4">Success Tips</h4>
                        <div className="space-y-4">
                          {exp.successTips.map((tip, i) => (
                            <div key={i} className="border rounded-lg p-4">
                              <h5 className="font-medium mb-3">{tip.category}</h5>
                              <div className="space-y-3">
                                <div>
                                  <h6 className="text-xs font-medium mb-2">Tips:</h6>
                                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                    {tip.tips.map((t, j) => (
                                      <li key={j} className="pl-2">
                                        <span className="ml-[-1.5rem]">•</span> {t}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <h6 className="text-xs font-medium mb-2">Examples:</h6>
                                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                    {tip.examples.map((e, j) => (
                                      <li key={j} className="pl-2">
                                        <span className="ml-[-1.5rem]">•</span> {e}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-4">Company Insights</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="border rounded-lg p-4">
                            <h5 className="font-medium mb-3">Culture & Values</h5>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                              {exp.companyInsights.culture.map((item, i) => (
                                <li key={i} className="pl-2">
                                  <span className="ml-[-1.5rem]">•</span> {item}
                                </li>
                              ))}
                              {exp.companyInsights.values.map((item, i) => (
                                <li key={i} className="pl-2">
                                  <span className="ml-[-1.5rem]">•</span> {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="border rounded-lg p-4">
                            <h5 className="font-medium mb-3">Recent Achievements</h5>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                              {exp.companyInsights.recentAchievements.map((item, i) => (
                                <li key={i} className="pl-2">
                                  <span className="ml-[-1.5rem]">•</span> {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="border rounded-lg p-4">
                            <h5 className="font-medium mb-3">Tech Stack</h5>
                            <div className="flex flex-wrap gap-2">
                              {exp.companyInsights.techStack.map((tech, i) => (
                                <Badge key={i} variant="secondary">{tech}</Badge>
                              ))}
                            </div>
                          </div>
                          <div className="border rounded-lg p-4">
                            <h5 className="font-medium mb-3">Work Style</h5>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                              {exp.companyInsights.workStyle.map((item, i) => (
                                <li key={i} className="pl-2">
                                  <span className="ml-[-1.5rem]">•</span> {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="mb-4">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Interview Experiences Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    We couldn't find any interview experiences for {companyName} at the moment.
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