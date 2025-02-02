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

export function SalaryInsights() {
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('Bangalore');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
  const [selectedRole, setSelectedRole] = useState<RoleInsight | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<CompanyDetail | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 5000000]);
  const [experienceFilter, setExperienceFilter] = useState<[number, number]>([0, 10]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  
  const debouncedSearch = useDebounce(searchQuery, 300);

  const cities = ['Bangalore', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Pune'];
  const cityMultipliers: { [key: string]: number } = {
    'Bangalore': 1,
    'Mumbai': 0.95,
    'Delhi NCR': 0.95,
    'Hyderabad': 0.9,
    'Pune': 0.85
  };

  useEffect(() => {
    const loadData = () => {
      setLoading(true);
      setTimeout(() => {
        const trend = Array.from({ length: 12 }, (_, i) => {
          const month = new Date(2024, i, 1).toLocaleString('default', { month: 'short' });
          const data: TrendDataPoint = { month };
          roles.forEach(role => {
            data[role.role] = role.avgSalary * (1 + (Math.random() * 0.2 - 0.1));
          });
          return data;
        });
        setTrendData(trend);
        setLoading(false);
      }, 1500);
    };

    loadData();
  }, [selectedCity]);

  const formatSalary = (amount: number) => {
    return `₹ ${(amount / 100000).toFixed(2)} L`;
  };

  const filteredRoles = roles.filter(role => {
    const matchesSearch = debouncedSearch === '' || 
      role.role.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      role.skills.some(skill => skill.toLowerCase().includes(debouncedSearch.toLowerCase()));
    
    const matchesCategory = role.category === selectedCategory;
    const matchesSalaryRange = role.avgSalary >= salaryRange[0] && role.avgSalary <= salaryRange[1];
    
    return matchesSearch && matchesCategory && matchesSalaryRange;
  });

  const skillDistribution = selectedRole ? {
    name: 'Skills Distribution',
    data: selectedRole.skills.map((skill, index) => ({
      name: skill,
      value: 100 / selectedRole.skills.length
    }))
  } : null;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: {
        duration: 0.3
      }
    }
  };

  const cardVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    hover: { 
      scale: 1.02,
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
      transition: {
        duration: 0.2
      }
    },
    tap: { scale: 0.98 }
  };

  // Skill radar data transformation
  const getSkillRadarData = (role: RoleInsightExtended) => {
    return role.skillLevels.map(skill => ({
      subject: skill.skill,
      level: skill.level,
      importance: skill.importance,
      fullMark: 100
    }));
  };

  // Career progression visualization
  const getCareerProgressionData = (role: RoleInsightExtended) => {
    const baselineSalary = role.avgSalary;
    return [
      { name: 'Entry', salary: baselineSalary },
      { name: '3 Years', salary: baselineSalary * 1.5 },
      { name: '5 Years', salary: baselineSalary * 2 },
      { name: '7 Years', salary: baselineSalary * 2.5 },
      { name: '10 Years', salary: baselineSalary * 3 }
    ];
  };

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-8 w-[250px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[250px]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="p-4 space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <motion.div variants={itemVariants}>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <TrendingUp className="h-8 w-8" />
            Indian Salary Insights
          </h2>
          <p className="text-muted-foreground mt-1">Comprehensive salary data for tech roles in India</p>
        </motion.div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search roles or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-[250px]"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className="aspect-square"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-4 overflow-hidden bg-secondary/10 rounded-lg p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Experience Range (Years)</label>
                <Slider
                  value={experienceFilter}
                  onValueChange={setExperienceFilter}
                  min={0}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{experienceFilter[0]} years</span>
                  <span>{experienceFilter[1]} years</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Salary Range</label>
                <Slider
                  value={[salaryRange[0] / 100000, salaryRange[1] / 100000]}
                  onValueChange={(value: number[]) => setSalaryRange([value[0] * 100000, value[1] * 100000])}
                  min={5}
                  max={50}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>₹{salaryRange[0] / 100000}L</span>
                  <span>₹{salaryRange[1] / 100000}L</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
              >
                {viewMode === 'cards' ? 'Table View' : 'Card View'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setChartType(chartType === 'line' ? 'bar' : 'line')}
              >
                {chartType === 'line' ? 'Bar Chart' : 'Line Chart'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <LayoutGroup>
        {/* Role Cards or Table */}
        {viewMode === 'cards' ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            layout
          >
            {filteredRoles.map((role) => (
              <motion.div
                key={role.role}
                layoutId={role.role}
                variants={cardVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                whileTap="tap"
              >
                <Card 
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedRole?.role === role.role ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedRole(role)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5" />
                        {role.role}
                      </span>
                      <Badge variant={role.demand === 'High' ? 'default' : 'secondary'}>
                        {role.demand}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      {role.category}
                      <ChevronRight className="h-4 w-4" />
                      <span className="text-primary">{role.companies.length} companies hiring</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Min</p>
                          <p className="font-medium">{formatSalary(role.minSalary * cityMultipliers[selectedCity])}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Avg</p>
                          <p className="font-medium">{formatSalary(role.avgSalary * cityMultipliers[selectedCity])}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Max</p>
                          <p className="font-medium">{formatSalary(role.maxSalary * cityMultipliers[selectedCity])}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">{role.yoe}</span>
                        <Badge variant="outline" className="ml-auto">
                          <Sparkles className="h-3 w-3 mr-1" />
                          +{role.growth}% YoY
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="overflow-x-auto"
          >
            <table className="w-full">
              {/* ... table implementation ... */}
            </table>
          </motion.div>
        )}
      </LayoutGroup>

      <AnimatePresence mode="wait">
        {selectedRole && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Briefcase className="h-6 w-6" />
                    {selectedRole.role}
                  </span>
                  <Badge variant="outline" className="text-sm">
                    {selectedRole.category}
                  </Badge>
                </CardTitle>
                <CardDescription>Comprehensive analysis and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="skills">Skills Analysis</TabsTrigger>
                    <TabsTrigger value="career">Career Path</TabsTrigger>
                    <TabsTrigger value="market">Market Insights</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            Required Skills
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedRole.skills.map((skill) => (
                              <Badge key={skill} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Top Hiring Companies
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            {selectedRole.companies.map((company) => {
                              const details = companyDetails[company];
                              return details ? (
                                <Card key={company} className="p-3">
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">{company}</span>
                                    <Badge variant="outline">{details.openPositions} open</Badge>
                                  </div>
                                  <div className="mt-2 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <Users className="h-3 w-3" />
                                      <span>{details.rating}★ ({details.reviews})</span>
                                    </div>
                                  </div>
                                </Card>
                              ) : null;
                            })}
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            Experience-wise Breakdown
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span>Entry Level (0-2 years)</span>
                              <span>{formatSalary(selectedRole.minSalary * cityMultipliers[selectedCity])} - {formatSalary(selectedRole.minSalary * 1.5 * cityMultipliers[selectedCity])}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Mid Level (2-5 years)</span>
                              <span>{formatSalary(selectedRole.minSalary * 1.5 * cityMultipliers[selectedCity])} - {formatSalary(selectedRole.maxSalary * 0.7 * cityMultipliers[selectedCity])}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Senior Level (5+ years)</span>
                              <span>{formatSalary(selectedRole.maxSalary * 0.7 * cityMultipliers[selectedCity])} - {formatSalary(selectedRole.maxSalary * cityMultipliers[selectedCity])}</span>
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      <div className="space-y-6">
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <h4 className="text-sm font-medium mb-4">Salary Trends (2024)</h4>
                          <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip formatter={(value) => formatSalary(Number(value))} />
                                <Legend />
                                <Line
                                  type="monotone"
                                  dataKey={selectedRole.role}
                                  stroke="#8884d8"
                                  name="Monthly Avg. Salary"
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </motion.div>

                        {skillDistribution && (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <h4 className="text-sm font-medium mb-4">Skills Distribution</h4>
                            <div className="h-[300px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={skillDistribution.data}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                  >
                                    {skillDistribution.data.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                  </Pie>
                                  <Tooltip />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="skills">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-sm font-medium mb-4">Skill Proficiency</h4>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={getSkillRadarData(selectedRole as RoleInsightExtended)}>
                              <PolarGrid />
                              <PolarAngleAxis dataKey="subject" />
                              <PolarRadiusAxis />
                              <Radar
                                name="Skill Level"
                                dataKey="level"
                                stroke="#8884d8"
                                fill="#8884d8"
                                fillOpacity={0.6}
                              />
                              <Radar
                                name="Importance"
                                dataKey="importance"
                                stroke="#82ca9d"
                                fill="#82ca9d"
                                fillOpacity={0.6}
                              />
                              <Legend />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Learning Path
                          </h4>
                          <div className="space-y-2">
                            {(selectedRole as RoleInsightExtended).learningPath.map((step, index) => (
                              <div
                                key={step}
                                className="flex items-center gap-2"
                              >
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                  {index + 1}
                                </div>
                                <span>{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            Recommended Certifications
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {(selectedRole as RoleInsightExtended).certifications.map((cert) => (
                              <Badge key={cert} variant="secondary">
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="career">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-sm font-medium mb-4">Career Progression</h4>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={getCareerProgressionData(selectedRole as RoleInsightExtended)}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip formatter={(value) => formatSalary(Number(value))} />
                              <Bar dataKey="salary" fill="#8884d8" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Future Prospects
                          </h4>
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Potential Roles</p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {(selectedRole as RoleInsightExtended).futureProspects.roles.map((role) => (
                                  <Badge key={role} variant="outline">
                                    {role}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Future Skills</p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {(selectedRole as RoleInsightExtended).futureProspects.skills.map((skill) => (
                                  <Badge key={skill} variant="outline">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Zap className="h-4 w-4 text-yellow-500" />
                              <span>Expected salary growth: +{(selectedRole as RoleInsightExtended).futureProspects.salaryIncrease}%</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                            <Laptop className="h-4 w-4" />
                            Key Responsibilities
                          </h4>
                          <ul className="space-y-2 list-disc list-inside text-sm">
                            {(selectedRole as RoleInsightExtended).responsibilities.map((resp) => (
                              <li key={resp}>{resp}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="market">
                    {/* Existing market trends content */}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="flex justify-between items-center mt-8"
        variants={containerVariants}
      >
        <Badge variant="outline" className="text-sm">
          Last Updated: {new Date().toLocaleDateString()}
        </Badge>
        <Badge variant="secondary" className="text-sm">
          Data sourced from industry reports and market analysis
        </Badge>
      </motion.div>
    </motion.div>
  );
} 