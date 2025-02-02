import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";
import { Badge } from "@/components/ui/badge";

interface SalaryInsightsProps {
  industry: string;
  companyType: string;
  role: string;
  level: string;
  location: string;
  experience: number;
  skills: string[];
  currentSalary: number;
  targetSalary: number;
  achievements: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function SalaryInsights({
  industry,
  companyType,
  role,
  level,
  location,
  experience,
  skills,
  currentSalary,
  targetSalary,
  achievements,
}: SalaryInsightsProps) {
  const marketData = {
    salaryRange: {
      min: Math.round(currentSalary * 0.8),
      max: Math.round(currentSalary * 1.4),
      median: Math.round(currentSalary * 1.1),
    },
    compensationMix: [
      { name: "Base Salary", value: 70 },
      { name: "Bonus", value: 15 },
      { name: "Equity", value: 10 },
      { name: "Benefits", value: 5 },
    ],
    marketTrends: [
      { month: "Jan", industry: 100, role: 95, overall: 98 },
      { month: "Feb", industry: 102, role: 98, overall: 99 },
      { month: "Mar", industry: 105, role: 103, overall: 101 },
      { month: "Apr", industry: 108, role: 106, overall: 103 },
      { month: "May", industry: 110, role: 108, overall: 105 },
      { month: "Jun", industry: 112, role: 110, overall: 107 },
    ],
    skillsAnalysis: [
      { skill: "Technical", value: 80 },
      { skill: "Leadership", value: 65 },
      { skill: "Domain", value: 75 },
      { skill: "Soft Skills", value: 70 },
      { skill: "Innovation", value: 60 },
    ],
  };

  return (
    <Card className="w-full max-w-4xl p-6">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="market">Market Analysis</TabsTrigger>
          <TabsTrigger value="skills">Skills Impact</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="strategy">Strategy</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4">
            <h3 className="text-xl font-semibold">Compensation Overview</h3>
            <div className="grid gap-2">
              <p className="text-sm text-muted-foreground">
                Based on your profile ({role} with {experience} years of experience in {industry}):
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                <Card className="p-4">
                  <h4 className="text-sm font-medium">Market Minimum</h4>
                  <p className="text-2xl font-bold">{marketData.salaryRange.min.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">25th percentile</p>
                </Card>
                <Card className="p-4">
                  <h4 className="text-sm font-medium">Target Range</h4>
                  <p className="text-2xl font-bold">{marketData.salaryRange.median.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">50th percentile</p>
                </Card>
                <Card className="p-4">
                  <h4 className="text-sm font-medium">Market Maximum</h4>
                  <p className="text-2xl font-bold">{marketData.salaryRange.max.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">75th percentile</p>
                </Card>
              </div>
              
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-4">Compensation Mix</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={marketData.compensationMix}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {marketData.compensationMix.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="market" className="space-y-6">
          <div className="grid gap-4">
            <h3 className="text-xl font-semibold">Market Analysis</h3>
            <div className="grid gap-4">
              <Card className="p-4">
                <h4 className="font-medium mb-4">Industry Comparison</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={marketData.marketTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="industry" stroke="#8884d8" name="Industry" />
                    <Line type="monotone" dataKey="role" stroke="#82ca9d" name="Role" />
                    <Line type="monotone" dataKey="overall" stroke="#ffc658" name="Overall Market" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <div className="grid gap-4">
            <h3 className="text-xl font-semibold">Skills Impact Analysis</h3>
            <div className="grid gap-4">
              <Card className="p-4">
                <h4 className="font-medium mb-4">Skills Evaluation</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={marketData.skillsAnalysis}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="skill" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Skills" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid gap-4">
            <h3 className="text-xl font-semibold">Market Trends</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="p-4">
                <h4 className="font-medium">Industry Growth</h4>
                <p className="text-2xl font-bold text-green-600">+12%</p>
                <p className="text-sm text-muted-foreground">Year over Year</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-medium">Role Demand</h4>
                <p className="text-2xl font-bold text-blue-600">High</p>
                <p className="text-sm text-muted-foreground">Based on market data</p>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="strategy" className="space-y-6">
          <div className="grid gap-4">
            <h3 className="text-xl font-semibold">Negotiation Strategy</h3>
            <div className="space-y-4">
              <Card className="p-4">
                <h4 className="font-medium">Leverage Points</h4>
                <div className="mt-2 space-y-2">
                  {skills.map((skill, index) => (
                    <Badge key={index} className="mr-2">{skill}</Badge>
                  ))}
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Your expertise in these areas positions you well for negotiation.
                </p>
              </Card>
              
              <Card className="p-4">
                <h4 className="font-medium">Market Position</h4>
                <p className="text-sm text-muted-foreground mt-2">
                  Your target salary is {
                    targetSalary > marketData.salaryRange.median ? 'above' : 'below'
                  } the market median for your role and experience level.
                </p>
              </Card>

              <Card className="p-4">
                <h4 className="font-medium">Negotiation Tips</h4>
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                  <li>• Emphasize your {experience} years of experience in {industry}</li>
                  <li>• Highlight your achievements and quantifiable impact</li>
                  <li>• Discuss your proficiency in high-demand skills</li>
                  <li>• Consider the total compensation package, not just base salary</li>
                  <li>• Research company-specific benefits and growth opportunities</li>
                </ul>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
} 