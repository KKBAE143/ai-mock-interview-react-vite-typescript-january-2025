import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Bookmark,
  BookmarkCheck,
  Play,
  AlertCircle,
  Users,
  CheckCircle,
  ArrowUpRight,
  Star,
  Lightbulb,
  LineChart,
  TrendingUp,
  Clock,
  Target,
  BarChart,
  ThumbsUp,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CompanyMockInterview } from "./company-mock-interview";
import { db } from "@/config/firebase.config";
import { useAuth } from "@clerk/clerk-react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { chatSession } from "@/scripts";
import { toast } from "sonner";
import { CompanyResearch } from "./company-research";

interface InterviewAnalytics {
  totalInterviews: number;
  averageScore: number;
  totalPracticeTime: number;
  strongestAreas: string[];
  areasToImprove: string[];
  recentScores: number[];
  questionPerformance: {
    category: string;
    correct: number;
    total: number;
  }[];
  trends: {
    date: string;
    score: number;
    duration: number;
  }[];
}

interface CompanyProfile {
  name: string;
  industry: string;
  culture: {
    values: string[];
    environment: string;
    workStyle: string;
    benefits: string[];
    challenges: string[];
    growthOpportunities: string[];
  };
  interviewStyle: string;
  commonQuestions: string[];
  technicalStack?: string[];
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
    benefits: string[];
    variables: string[];
  };
  locations: {
    mainOffices: string[];
    developmentCenters: string[];
    workMode: string;
    preferredLocations: string[];
  };
  teamSize?: string;
  companyStage?: string;
  keyProjects?: string[];
  interviewProcess: {
    stages: string[];
    duration: string;
    tips: string[];
    indianContext: string[];
  };
}

interface BookmarkedCompany extends CompanyProfile {
  id: string;
  timestamp: number;
}

export function CompanySimulator() {
  const [companyName, setCompanyName] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showMockInterview, setShowMockInterview] = useState(false);
  const [bookmarkedCompanies, setBookmarkedCompanies] = useState<BookmarkedCompany[]>([]);
  const { userId } = useAuth();
  const [analytics, setAnalytics] = useState<InterviewAnalytics>({
    totalInterviews: 0,
    averageScore: 0,
    totalPracticeTime: 0,
    strongestAreas: [],
    areasToImprove: [],
    recentScores: [],
    questionPerformance: [],
    trends: []
  });

  useEffect(() => {
    loadBookmarkedCompanies();
    loadAnalytics();
  }, [userId]);

  useEffect(() => {
    if (companyProfile) {
      setIsBookmarked(
        bookmarkedCompanies.some(
          (company) => company.name.toLowerCase() === companyProfile.name.toLowerCase()
        )
      );
    }
  }, [companyProfile, bookmarkedCompanies]);

  const loadBookmarkedCompanies = async () => {
    if (!userId) return;
    
    try {
      const bookmarksDoc = await getDoc(doc(db, "users", userId, "bookmarks", "companies"));
      if (bookmarksDoc.exists()) {
        const data = bookmarksDoc.data();
        setBookmarkedCompanies(data.companies || []);
        
        // Update bookmark status if company profile exists
        if (companyProfile) {
          setIsBookmarked(
            (data.companies || []).some(
              (company: BookmarkedCompany) => 
                company.name.toLowerCase() === companyProfile.name.toLowerCase()
            )
          );
        }
      } else {
        // Initialize bookmarks document if it doesn't exist
        await setDoc(
          doc(db, "users", userId, "bookmarks", "companies"),
          { companies: [] },
          { merge: true }
        );
        setBookmarkedCompanies([]);
      }
    } catch (error) {
      console.error("Error loading bookmarks:", error);
      toast.error("Failed to load bookmarks");
    }
  };

  const loadAnalytics = async () => {
    if (!userId) return;
    
    try {
      const analyticsDoc = await getDoc(doc(db, "users", userId, "analytics", "interviews"));
      if (analyticsDoc.exists()) {
        setAnalytics(analyticsDoc.data() as InterviewAnalytics);
      }
    } catch (error) {
      console.error("Error loading analytics:", error);
    }
  };

  const analyzeCompany = async () => {
    if (!companyName || !jobRole) {
      toast.error("Please enter both company name and job role");
      return;
    }

    setLoading(true);
    let retryCount = 0;
    const maxRetries = 3;

    // Default fallback data
    const fallbackProfile = {
      name: companyName,
      industry: "Technology",
      culture: {
        values: ["Innovation", "Excellence", "Customer Focus", "Integrity", "Teamwork"],
        environment: "Modern, collaborative workspace with a focus on innovation and growth",
        workStyle: "Flexible hybrid work model with emphasis on work-life balance",
        benefits: ["Health Insurance", "Learning Allowance", "Flexible Hours", "Remote Work Options"],
        challenges: ["Fast-paced environment", "Rapidly evolving technology landscape"],
        growthOpportunities: ["Career advancement paths", "Skill development programs", "Leadership training"]
      },
      interviewStyle: "Structured technical and behavioral rounds with focus on problem-solving",
      commonQuestions: [
        "Tell us about your most challenging project",
        "How do you handle technical disagreements?",
        "Describe your experience with our tech stack",
        "How do you stay updated with technology trends?",
        "What interests you about our company?"
      ],
      technicalStack: ["React", "TypeScript", "Node.js", "Next.js", "Cloud Technologies"],
      salaryRange: {
        min: 12,
        max: 40,
        currency: "INR",
        benefits: ["Performance Bonus", "Health Insurance", "Learning Budget"],
        variables: ["Annual Bonus", "Stock Options", "Project Incentives"]
      },
      locations: {
        mainOffices: ["Bangalore", "Mumbai", "Delhi"],
        developmentCenters: ["Bangalore", "Hyderabad", "Pune"],
        workMode: "Hybrid",
        preferredLocations: ["Bangalore", "Mumbai", "Delhi", "Hyderabad", "Pune"]
      },
      teamSize: "50-200 members",
      companyStage: "Growth",
      keyProjects: ["Digital Transformation", "Cloud Migration", "AI/ML Integration"],
      interviewProcess: {
        stages: [
          "Initial HR Screening",
          "Technical Assessment",
          "Technical Interview",
          "System Design Discussion",
          "Culture Fit & Manager Round"
        ],
        duration: "2-3 weeks",
        tips: [
          "Research our tech stack thoroughly",
          "Prepare system design concepts",
          "Review our products/services",
          "Practice coding problems"
        ],
        indianContext: [
          "Be prepared for salary negotiations",
          "Understand Indian work culture",
          "Research our Indian market presence",
          "Know about our local competitors"
        ]
      }
    };

    while (retryCount < maxRetries) {
      try {
        const prompt = `
          Analyze ${companyName} for a ${jobRole} position in India and provide detailed information in the following JSON format:
          {
            "industry": "company's industry",
            "culture": {
              "values": ["3-5 core company values"],
              "environment": "detailed description of work environment",
              "workStyle": "description of work style and expectations",
              "benefits": ["list of notable benefits and perks"],
              "challenges": ["potential challenges or areas of growth"],
              "growthOpportunities": ["career development opportunities"]
            },
            "interviewStyle": "company's typical interview approach",
            "commonQuestions": ["5-7 specific interview questions tailored to company and role"],
            "technicalStack": ["main technologies used"],
            "salaryRange": {
              "min": estimated minimum salary in lakhs per annum,
              "max": estimated maximum salary in lakhs per annum,
              "currency": "INR",
              "benefits": ["additional compensation benefits"],
              "variables": ["performance bonus", "stock options", "other variables"]
            },
            "locations": {
              "mainOffices": ["main office locations in India"],
              "developmentCenters": ["development center locations"],
              "workMode": "remote/hybrid/onsite policy",
              "preferredLocations": ["preferred locations for this role"]
            },
            "teamSize": "approximate team size range",
            "companyStage": "startup/growth/enterprise stage",
            "keyProjects": ["notable projects or achievements"],
            "interviewProcess": {
              "stages": ["list of interview stages"],
              "duration": "typical interview process duration",
              "tips": ["specific preparation tips"],
              "indianContext": ["India-specific interview preparation tips"]
            }
          }
          
          Important:
          1. Ensure the response is valid JSON
          2. All arrays should be non-empty
          3. All numeric values should be numbers, not strings
          4. Focus on accuracy for Indian market
          5. Keep responses concise but informative
        `;

        const result = await chatSession.sendMessage(prompt);
        
        // First try to extract JSON if it's wrapped in markdown or other text
        const jsonMatch = result.response.text().match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : result.response.text();
        
        let profile;
        try {
          profile = JSON.parse(jsonStr);
        } catch (parseError) {
          console.error("Error parsing AI response:", parseError);
          throw new Error("Invalid JSON format in response");
        }

        // Validate required fields
        const requiredFields = ['industry', 'culture', 'interviewStyle', 'commonQuestions', 'locations', 'salaryRange'];
        const missingFields = requiredFields.filter(field => !profile[field]);
        
        if (missingFields.length > 0) {
          throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        // Validate numeric values
        if (typeof profile.salaryRange?.min !== 'number' || typeof profile.salaryRange?.max !== 'number') {
          throw new Error("Salary range must contain numeric values");
        }

        // Validate arrays are non-empty
        const requiredArrays = [
          'culture.values',
          'culture.benefits',
          'commonQuestions',
          'locations.mainOffices',
          'interviewProcess.stages'
        ];

        for (const arrayPath of requiredArrays) {
          const value = arrayPath.split('.').reduce((obj, key) => obj?.[key], profile);
          if (!Array.isArray(value) || value.length === 0) {
            throw new Error(`${arrayPath} must be a non-empty array`);
          }
        }

        setCompanyProfile({
          name: companyName,
          ...profile
        });

        setIsBookmarked(
          bookmarkedCompanies.some(
            (company) => company.name.toLowerCase() === companyName.toLowerCase()
          )
        );

        toast.success("Company analysis completed!");
        break; // Success - exit the retry loop

      } catch (error) {
        console.error("Error analyzing company:", error);
        retryCount++;
        
        if (retryCount === maxRetries) {
          console.log("Using fallback data after all retries failed");
          setCompanyProfile(fallbackProfile);
          toast.warning("Using general company information. Some details may not be specific to the company.");
        } else {
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
        }
      }
    }

    setLoading(false);
  };

  const toggleBookmark = async () => {
    if (!userId || !companyProfile) {
      toast.error("Please sign in to bookmark companies");
      return;
    }

    try {
      const bookmarkRef = doc(db, "users", userId, "bookmarks", "companies");
      
      // Create a new bookmark object
      const newBookmark: BookmarkedCompany = {
        ...companyProfile,
        id: `${companyProfile.name.toLowerCase()}-${Date.now()}`,
        timestamp: Date.now(),
      };

      let newBookmarkedCompanies: BookmarkedCompany[];

      if (isBookmarked) {
        // Remove the bookmark
        newBookmarkedCompanies = bookmarkedCompanies.filter(
          (company) => company.name.toLowerCase() !== companyProfile.name.toLowerCase()
        );
        toast.success("Company removed from bookmarks");
      } else {
        // Add the bookmark
        newBookmarkedCompanies = [...bookmarkedCompanies, newBookmark];
        toast.success("Company added to bookmarks");
      }

      // Update Firestore
      await setDoc(
        bookmarkRef,
        { companies: newBookmarkedCompanies },
        { merge: true }
      );

      // Update local state
      setBookmarkedCompanies(newBookmarkedCompanies);
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("Failed to update bookmark");
    }
  };

  const startMockInterview = () => {
    setShowMockInterview(true);
  };

  const renderAnalytics = () => {
    if (!analytics.totalInterviews) return null;

    return (
      <Card className="p-6">
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <LineChart className="w-5 h-5" />
              Interview Analytics & Trends
            </h3>
            <span className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </span>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-primary/5 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-primary" />
                <span className="font-medium">Total Interviews</span>
              </div>
              <p className="text-2xl font-semibold">{analytics.totalInterviews}</p>
            </div>
            <div className="p-4 bg-primary/5 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ThumbsUp className="w-4 h-4 text-primary" />
                <span className="font-medium">Average Score</span>
              </div>
              <p className="text-2xl font-semibold">{analytics.averageScore}%</p>
            </div>
            <div className="p-4 bg-primary/5 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="font-medium">Practice Time</span>
              </div>
              <p className="text-2xl font-semibold">{Math.round(analytics.totalPracticeTime / 60)}h</p>
            </div>
            <div className="p-4 bg-primary/5 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="font-medium">Success Rate</span>
              </div>
              <p className="text-2xl font-semibold">
                {Math.round((analytics.recentScores.filter(score => score >= 70).length / analytics.recentScores.length) * 100)}%
              </p>
            </div>
          </div>

          {/* Performance by Question Type */}
          <div>
            <h4 className="font-medium mb-4">Performance by Question Type</h4>
            <div className="space-y-3">
              {analytics.questionPerformance.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{category.category}</span>
                    <span className="text-muted-foreground">
                      {Math.round((category.correct / category.total) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{
                        width: `${(category.correct / category.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths and Areas to Improve */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Strongest Areas</h4>
              <ul className="space-y-2">
                {analytics.strongestAreas.map((area, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Areas to Improve</h4>
              <ul className="space-y-2">
                {analytics.areasToImprove.map((area, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <ArrowUpRight className="w-4 h-4 text-primary" />
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recent Performance Trend */}
          <div>
            <h4 className="font-medium mb-4">Recent Performance Trend</h4>
            <div className="h-[200px] w-full">
              <div className="flex items-end h-full space-x-2">
                {analytics.trends.slice(-7).map((trend, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div
                      className="w-full bg-primary rounded-t"
                      style={{
                        height: `${(trend.score / 100) * 160}px`,
                      }}
                    />
                    <span className="text-xs mt-2 text-muted-foreground">
                      {new Date(trend.date).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (showMockInterview && companyProfile) {
    return (
      <CompanyMockInterview
        companyProfile={companyProfile}
        onBack={() => setShowMockInterview(false)}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Input Section */}
      <Card className="p-6">
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Building2 className="w-6 h-6" />
              Company Interview Simulator
            </h2>
            <p className="text-muted-foreground">
              Enter a company name and job role to get tailored interview preparation
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Company Name</label>
              <Input
                placeholder="e.g. Google"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Job Role</label>
              <Input
                placeholder="e.g. Senior Software Engineer"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
              />
            </div>
          </div>

          <Button
            onClick={analyzeCompany}
            className="w-full"
            size="lg"
            disabled={loading || !companyName || !jobRole}
          >
            {loading ? "Analyzing..." : "Analyze Company"}
          </Button>
        </CardContent>
      </Card>

      {/* Analytics Section */}
      {!companyProfile && renderAnalytics()}

      {/* Enhanced Company Profile */}
      {companyProfile && (
        <div className="space-y-6">
          <Card className="p-6">
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{companyProfile.name}</h3>
                  <p className="text-muted-foreground">{companyProfile.industry} • {companyProfile.companyStage}</p>
                </div>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={toggleBookmark}
                    className="flex items-center gap-2"
                  >
                    {isBookmarked ? (
                      <>
                        <BookmarkCheck className="w-4 h-4" />
                        Bookmarked
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-4 h-4" />
                        Bookmark
                      </>
                    )}
                  </Button>
                  <Button onClick={startMockInterview} className="flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Start Mock Interview
                  </Button>
                </div>
              </div>

              {/* Company Overview */}
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Team Size</h4>
                  <p className="text-muted-foreground">{companyProfile.teamSize}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Work Mode</h4>
                  <p className="text-muted-foreground">{companyProfile.locations.workMode}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Compensation</h4>
                  <p className="text-muted-foreground">
                    ₹{companyProfile.salaryRange?.min.toFixed(2)} - {companyProfile.salaryRange?.max.toFixed(2)} LPA
                  </p>
                </div>
              </div>

              {/* Locations */}
              <div className="space-y-6">
                <h4 className="font-medium">Office Locations</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium">Main Offices</h5>
                    <div className="flex flex-wrap gap-2">
                      {companyProfile.locations.mainOffices.map((location, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-primary/10 rounded-full text-sm font-medium"
                        >
                          {location}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium">Development Centers</h5>
                    <div className="flex flex-wrap gap-2">
                      {companyProfile.locations.developmentCenters.map((location, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-primary/10 rounded-full text-sm font-medium opacity-80"
                        >
                          {location}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h5 className="text-sm font-medium">Preferred Locations</h5>
                  <div className="flex flex-wrap gap-2">
                    {companyProfile.locations.preferredLocations.map((location, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-primary/10 rounded-full text-sm font-medium"
                      >
                        {location}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Compensation Details */}
              <div className="space-y-4">
                <h4 className="font-medium">Compensation & Benefits</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-sm font-medium mb-2">Additional Benefits</h5>
                    <ul className="space-y-2">
                      {companyProfile.salaryRange?.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-muted-foreground">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium mb-2">Variable Components</h5>
                    <ul className="space-y-2">
                      {companyProfile.salaryRange?.variables.map((variable, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <ArrowUpRight className="w-4 h-4 text-primary" />
                          <span className="text-muted-foreground">{variable}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Technical Stack */}
              {companyProfile.technicalStack && (
                <div className="space-y-3">
                  <h4 className="font-medium">Technical Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {companyProfile.technicalStack.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-primary/10 rounded-full text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Interview Process */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Interview Process
                </h4>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      {companyProfile.interviewProcess.stages.map((stage, index) => (
                        <div key={index} className="flex items-center mb-4 last:mb-0">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-medium">
                            {index + 1}
                          </div>
                          <div className="ml-4 flex-1">
                            <p className="text-sm">{stage}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Duration</p>
                      <p className="text-sm text-muted-foreground">{companyProfile.interviewProcess.duration}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Culture and Growth */}
          <Card className="p-6">
            <CardContent className="space-y-6">
              <h4 className="font-medium mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Company Culture & Growth
              </h4>
              
              <div className="space-y-3">
                <h5 className="text-sm font-medium">Core Values</h5>
                <div className="flex flex-wrap gap-2">
                  {companyProfile.culture.values.map((value, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-primary/10 rounded-full text-sm font-medium"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="text-sm font-medium mb-3">Benefits & Perks</h5>
                  <ul className="space-y-2">
                    {companyProfile.culture.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-medium mb-3">Growth Opportunities</h5>
                  <ul className="space-y-2">
                    {companyProfile.culture.growthOpportunities.map((opportunity, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <ArrowUpRight className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">{opportunity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium mb-2">Work Environment</h5>
                <p className="text-muted-foreground">
                  {companyProfile.culture.environment}
                </p>
              </div>

              <div>
                <h5 className="text-sm font-medium mb-2">Work Style</h5>
                <p className="text-muted-foreground">
                  {companyProfile.culture.workStyle}
                </p>
              </div>

              {companyProfile.keyProjects && (
                <div>
                  <h5 className="text-sm font-medium mb-2">Key Projects & Achievements</h5>
                  <ul className="space-y-2">
                    {companyProfile.keyProjects.map((project, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-muted-foreground">{project}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Interview Tips */}
          <Card className="p-6">
            <CardContent className="space-y-6">
              <h4 className="font-medium flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Interview Preparation Tips
              </h4>
              <ul className="space-y-4">
                {companyProfile.interviewProcess.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 font-medium text-sm">
                      {index + 1}
                    </div>
                    <p className="text-sm text-muted-foreground flex-1">{tip}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="space-y-6">
              <h4 className="font-medium flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                India-Specific Interview Tips
              </h4>
              <ul className="space-y-4">
                {companyProfile.interviewProcess.indianContext.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 font-medium text-sm">
                      {index + 1}
                    </div>
                    <p className="text-sm text-muted-foreground flex-1">{tip}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardContent className="space-y-6">
              <h4 className="font-medium flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Company Research & Role Preparation
              </h4>
              <CompanyResearch
                companyName={companyProfile.name}
                role={jobRole}
                industry={companyProfile.industry}
              />
            </CardContent>
          </Card>

          <Alert>
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              Click "Start Mock Interview" to practice with AI-generated questions
              tailored to {companyProfile.name}'s culture and interview style.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Bookmarked Companies */}
      {bookmarkedCompanies.length > 0 && !companyProfile && (
        <Card className="p-6">
          <CardContent className="space-y-6">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <BookmarkCheck className="w-5 h-5" />
              Bookmarked Companies
            </h3>
            <div className="grid gap-4">
              {bookmarkedCompanies.map((company) => (
                <div
                  key={company.id}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{company.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {company.industry}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCompanyName(company.name);
                      setCompanyProfile(company);
                      setIsBookmarked(true);
                    }}
                  >
                    Load Profile
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 