import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const industryTypes = [
  "Technology", "Finance", "Healthcare", "Retail", "Manufacturing",
  "Consulting", "Education", "Energy", "Media", "Telecommunications"
];

const companyTypes = [
  "Startup", "Small Business", "Mid-size Company", "Large Enterprise",
  "Fortune 500", "Multinational", "Public Sector", "Non-profit"
];

const commonSkills = {
  "Technical": [
    "Programming", "System Design", "Cloud Computing", "Data Analysis",
    "Machine Learning", "DevOps", "Security", "Architecture"
  ],
  "Business": [
    "Project Management", "Team Leadership", "Strategy", "Client Relations",
    "Business Analysis", "Agile", "Product Management"
  ],
  "Soft Skills": [
    "Communication", "Problem Solving", "Leadership", "Collaboration",
    "Time Management", "Critical Thinking", "Adaptability"
  ]
};

interface SalaryNegotiationFormProps {
  onSubmit: (data: any) => void;
}

export function SalaryNegotiationForm({ onSubmit }: SalaryNegotiationFormProps) {
  const [formData, setFormData] = useState({
    industry: "",
    companyType: "",
    role: "",
    level: "",
    location: "",
    experience: "",
    currentSalary: "",
    targetSalary: "",
    achievements: "",
    includeEquity: false,
    includeBonus: false,
    includeBenefits: false,
    includeRelocation: false,
  });
  
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [interviewPrep, setInterviewPrep] = useState(0);
  const [activeSkillCategory, setActiveSkillCategory] = useState("Technical");

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    onSubmit({
      ...formData,
      experience: Number(formData.experience),
      currentSalary: Number(formData.currentSalary),
      targetSalary: Number(formData.targetSalary),
      skills: selectedSkills,
      interviewPrep,
    });
  };
  
  return (
    <Card className="w-full max-w-4xl p-6 space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Universal Salary Negotiation Helper</h2>
        <p className="text-muted-foreground">
          Get personalized recommendations for your next salary negotiation
        </p>
      </div>

      <div className="grid gap-6">
        {/* Industry & Company Type */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Select onValueChange={(value) => handleInputChange("industry", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {industryTypes.map((industry) => (
                  <SelectItem key={industry} value={industry.toLowerCase()}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyType">Company Type</Label>
            <Select onValueChange={(value) => handleInputChange("companyType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select company type" />
              </SelectTrigger>
              <SelectContent>
                {companyTypes.map((type) => (
                  <SelectItem key={type} value={type.toLowerCase()}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Role & Level */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="role">Job Role</Label>
            <Input
              id="role"
              placeholder="e.g. Senior Software Engineer"
              className="w-full"
              value={formData.role}
              onChange={(e) => handleInputChange("role", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="level">Career Level</Label>
            <Select onValueChange={(value) => handleInputChange("level", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select career level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entry">Entry Level</SelectItem>
                <SelectItem value="mid">Mid Level</SelectItem>
                <SelectItem value="senior">Senior Level</SelectItem>
                <SelectItem value="lead">Team Lead/Manager</SelectItem>
                <SelectItem value="director">Director</SelectItem>
                <SelectItem value="executive">Executive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Experience & Location */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="experience">Years of Experience</Label>
            <Input
              id="experience"
              type="number"
              placeholder="e.g. 5"
              className="w-full"
              value={formData.experience}
              onChange={(e) => handleInputChange("experience", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="City, Country"
              className="w-full"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
            />
          </div>
        </div>

        {/* Current & Target Salary */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="currentSalary">Current Annual Package</Label>
            <Input
              id="currentSalary"
              type="number"
              placeholder="Total compensation"
              className="w-full"
              value={formData.currentSalary}
              onChange={(e) => handleInputChange("currentSalary", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetSalary">Expected Package</Label>
            <Input
              id="targetSalary"
              type="number"
              placeholder="Target compensation"
              className="w-full"
              value={formData.targetSalary}
              onChange={(e) => handleInputChange("targetSalary", e.target.value)}
            />
          </div>
        </div>

        {/* Skills Selection */}
        <div className="space-y-4">
          <Label>Key Skills</Label>
          <div className="flex gap-2 mb-2">
            {Object.keys(commonSkills).map((category) => (
              <Button
                key={category}
                variant={activeSkillCategory === category ? "default" : "outline"}
                onClick={() => setActiveSkillCategory(category)}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {commonSkills[activeSkillCategory].map((skill) => (
              <Badge
                key={skill}
                variant={selectedSkills.includes(skill) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => {
                  setSelectedSkills((prev) =>
                    prev.includes(skill)
                      ? prev.filter((s) => s !== skill)
                      : [...prev, skill]
                  );
                }}
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-2">
          <Label htmlFor="achievements">Key Achievements</Label>
          <Textarea
            id="achievements"
            placeholder="List your major achievements, projects, or impact in current/previous roles"
            className="min-h-[100px]"
            value={formData.achievements}
            onChange={(e) => handleInputChange("achievements", e.target.value)}
          />
        </div>

        {/* Interview Preparation Status */}
        <div className="space-y-4">
          <Label>Interview Preparation Progress</Label>
          <Slider
            value={[interviewPrep]}
            onValueChange={([value]) => setInterviewPrep(value)}
            max={100}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Not Started</span>
            <span>{interviewPrep}% Ready</span>
            <span>Fully Prepared</span>
          </div>
        </div>

        {/* Compensation Components */}
        <div className="space-y-4">
          <Label>Compensation Components</Label>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="equity">Include Equity/Stock Options</Label>
              <Switch
                id="equity"
                checked={formData.includeEquity}
                onCheckedChange={(checked) => handleInputChange("includeEquity", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="bonus">Include Variable Pay/Bonus</Label>
              <Switch
                id="bonus"
                checked={formData.includeBonus}
                onCheckedChange={(checked) => handleInputChange("includeBonus", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="benefits">Include Benefits Valuation</Label>
              <Switch
                id="benefits"
                checked={formData.includeBenefits}
                onCheckedChange={(checked) => handleInputChange("includeBenefits", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="relocation">Include Relocation Package</Label>
              <Switch
                id="relocation"
                checked={formData.includeRelocation}
                onCheckedChange={(checked) => handleInputChange("includeRelocation", checked)}
              />
            </div>
          </div>
        </div>

        <Button className="w-full" size="lg" onClick={handleSubmit}>
          Generate Negotiation Strategy
        </Button>
      </div>
    </Card>
  );
} 