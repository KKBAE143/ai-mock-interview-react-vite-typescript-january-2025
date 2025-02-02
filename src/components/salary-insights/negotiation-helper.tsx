'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  TrendingUp,
  MessageSquare,
  Target,
  Building2,
  Briefcase,
  DollarSign,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  Gift,
  IndianRupee,
  InfoIcon,
} from 'lucide-react';
import { generateNegotiationRecommendations } from '@/lib/gemini-service';
import type { NegotiationRecommendation } from '@/lib/gemini-service';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface NegotiationHelperProps {
  role?: string;
  experience?: number;
  location?: string;
  skills?: string[];
  companyName?: string;
  industry?: string;
}

export function NegotiationHelper({
  role: initialRole,
  experience: initialExperience,
  location: initialLocation,
  skills: initialSkills = [],
  companyName,
  industry: initialIndustry,
}: NegotiationHelperProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<NegotiationRecommendation | null>(null);
  
  // Form state
  const [role, setRole] = useState(initialRole || '');
  const [experience, setExperience] = useState(initialExperience?.toString() || '');
  const [location, setLocation] = useState(initialLocation || '');
  const [currentSalary, setCurrentSalary] = useState('');
  const [targetSalary, setTargetSalary] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [industry, setIndustry] = useState(initialIndustry || '');

  // Reset error when inputs change
  useEffect(() => {
    setError(null);
  }, [role, experience, location, currentSalary, targetSalary, companySize, industry]);

  // Update form when props change
  useEffect(() => {
    setRole(initialRole || '');
    setExperience(initialExperience?.toString() || '');
    setLocation(initialLocation || '');
    setIndustry(initialIndustry || '');
  }, [initialRole, initialExperience, initialLocation, initialIndustry]);

  const validateInputs = () => {
    if (!role) {
      setError('Role is required');
      return false;
    }
    if (!experience) {
      setError('Experience is required');
      return false;
    }
    if (!location) {
      setError('Location is required');
      return false;
    }
    return true;
  };

  const handleGenerateRecommendations = async () => {
    setError(null);
    
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);
    try {
      console.log('Generating recommendations with:', {
        role,
        experience: parseInt(experience),
        location,
        skills: initialSkills,
        currentSalary: currentSalary ? parseInt(currentSalary) : undefined,
        targetSalary: targetSalary ? parseInt(targetSalary) : undefined,
        companySize,
        industry,
      });

      const result = await generateNegotiationRecommendations({
        role,
        experience: parseInt(experience),
        location,
        skills: initialSkills,
        currentSalary: currentSalary ? parseInt(currentSalary) : undefined,
        targetSalary: targetSalary ? parseInt(targetSalary) : undefined,
        companySize,
        industry,
      });
      
      if (!result) {
        throw new Error('No recommendations received');
      }
      
      console.log('Received recommendations:', result);
      setRecommendations(result);
      toast.success('Generated negotiation recommendations');
    } catch (error) {
      console.error('Error generating recommendations:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate recommendations';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getNegotiabilityIcon = (negotiability: string) => {
    switch (negotiability) {
      case 'highly negotiable':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'moderately negotiable':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'rarely negotiable':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Salary Negotiation Helper
          {companyName && <span>- {companyName}</span>}
        </CardTitle>
        <CardDescription>
          Get personalized recommendations for your salary negotiation
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Input
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Senior Software Engineer"
              className="bg-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="experience">Experience (years) *</Label>
            <Input
              id="experience"
              type="number"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="e.g. 5"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                <SelectItem value="arunachal-pradesh">Arunachal Pradesh</SelectItem>
                <SelectItem value="assam">Assam</SelectItem>
                <SelectItem value="bihar">Bihar</SelectItem>
                <SelectItem value="chhattisgarh">Chhattisgarh</SelectItem>
                <SelectItem value="goa">Goa</SelectItem>
                <SelectItem value="gujarat">Gujarat</SelectItem>
                <SelectItem value="haryana">Haryana</SelectItem>
                <SelectItem value="himachal-pradesh">Himachal Pradesh</SelectItem>
                <SelectItem value="jharkhand">Jharkhand</SelectItem>
                <SelectItem value="karnataka">Karnataka</SelectItem>
                <SelectItem value="kerala">Kerala</SelectItem>
                <SelectItem value="madhya-pradesh">Madhya Pradesh</SelectItem>
                <SelectItem value="maharashtra">Maharashtra</SelectItem>
                <SelectItem value="manipur">Manipur</SelectItem>
                <SelectItem value="meghalaya">Meghalaya</SelectItem>
                <SelectItem value="mizoram">Mizoram</SelectItem>
                <SelectItem value="nagaland">Nagaland</SelectItem>
                <SelectItem value="odisha">Odisha</SelectItem>
                <SelectItem value="punjab">Punjab</SelectItem>
                <SelectItem value="rajasthan">Rajasthan</SelectItem>
                <SelectItem value="sikkim">Sikkim</SelectItem>
                <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                <SelectItem value="telangana">Telangana</SelectItem>
                <SelectItem value="tripura">Tripura</SelectItem>
                <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                <SelectItem value="uttarakhand">Uttarakhand</SelectItem>
                <SelectItem value="west-bengal">West Bengal</SelectItem>

                {/* Union Territories */}
                <SelectItem value="andaman-and-nicobar">Andaman and Nicobar Islands</SelectItem>
                <SelectItem value="chandigarh">Chandigarh</SelectItem>
                <SelectItem value="dadra-and-nagar-haveli">Dadra and Nagar Haveli</SelectItem>
                <SelectItem value="daman-and-diu">Daman and Diu</SelectItem>
                <SelectItem value="delhi">Delhi</SelectItem>
                <SelectItem value="jammu-and-kashmir">Jammu and Kashmir</SelectItem>
                <SelectItem value="ladakh">Ladakh</SelectItem>
                <SelectItem value="lakshadweep">Lakshadweep</SelectItem>
                <SelectItem value="puducherry">Puducherry</SelectItem>

                {/* Major Cities */}
                <SelectItem value="bangalore">Bangalore</SelectItem>
                <SelectItem value="mumbai">Mumbai</SelectItem>
                <SelectItem value="delhi-ncr">Delhi NCR</SelectItem>
                <SelectItem value="hyderabad">Hyderabad</SelectItem>
                <SelectItem value="chennai">Chennai</SelectItem>
                <SelectItem value="pune">Pune</SelectItem>
                <SelectItem value="kolkata">Kolkata</SelectItem>
                <SelectItem value="ahmedabad">Ahmedabad</SelectItem>
                <SelectItem value="noida">Noida</SelectItem>
                <SelectItem value="gurgaon">Gurgaon</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="currentSalary">Current Annual Salary (INR/Year) *</Label>
            <div className="relative">
              <Input
                id="currentSalary"
                type="number"
                value={currentSalary}
                onChange={(e) => setCurrentSalary(e.target.value)}
                placeholder="e.g. 1500000"
                className="pl-8"
              />
              <IndianRupee className="w-4 h-4 absolute left-2.5 top-2.5 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              Monthly: ₹{currentSalary ? (parseInt(currentSalary) / 12).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : 0}/month
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="targetSalary">Target Annual Salary (INR/Year) *</Label>
            <div className="relative">
              <Input
                id="targetSalary"
                type="number"
                value={targetSalary}
                onChange={(e) => setTargetSalary(e.target.value)}
                placeholder="e.g. 2000000"
                className="pl-8"
              />
              <IndianRupee className="w-4 h-4 absolute left-2.5 top-2.5 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              Monthly: ₹{targetSalary ? (parseInt(targetSalary) / 12).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : 0}/month
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="companySize">Company Size</Label>
            <Select value={companySize} onValueChange={setCompanySize}>
              <SelectTrigger>
                <SelectValue placeholder="Select company size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="startup">Startup (&lt;50 employees)</SelectItem>
                <SelectItem value="small">Small (50-200 employees)</SelectItem>
                <SelectItem value="medium">Medium (201-1000 employees)</SelectItem>
                <SelectItem value="large">Large (1000+ employees)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="consulting">Consulting</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleGenerateRecommendations}
            disabled={isLoading}
            className="w-full md:w-auto"
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⭮</span>
                Generating...
              </>
            ) : (
              'Generate Recommendations'
            )}
          </Button>
        </div>

        {recommendations && (
          <div className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Position Strength</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge
                    className={cn(
                      recommendations.marketContext.positionStrength === 'strong'
                        ? 'bg-green-100 text-green-800'
                        : recommendations.marketContext.positionStrength === 'moderate'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    )}
                  >
                    {recommendations.marketContext.positionStrength}
                  </Badge>
                </CardContent>
              </Card>

              <Card className="col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Competitive Salary Range</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Minimum</div>
                    <div className="text-xl font-bold">
                      ₹{(recommendations.marketContext.competitiveSalaryRange.min / 100000).toFixed(1)}L
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Target</div>
                    <div className="text-xl font-bold text-primary">
                      ₹{(recommendations.marketContext.competitiveSalaryRange.target / 100000).toFixed(1)}L
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Maximum</div>
                    <div className="text-xl font-bold">
                      ₹{(recommendations.marketContext.competitiveSalaryRange.max / 100000).toFixed(1)}L
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="market-factors">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Market Factors
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {recommendations.marketContext.keyMarketFactors.map((factor, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        {factor}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="negotiation-points">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Negotiation Points
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {recommendations.negotiationPoints.map((point, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{point.category}</h4>
                          <Badge className={getImportanceColor(point.importance)}>
                            {point.importance}
                          </Badge>
                        </div>
                        <ul className="space-y-1">
                          {point.points.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="talking-points">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Talking Points
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6">
                    {recommendations.talkingPoints.map((point, index) => (
                      <div key={index} className="space-y-2">
                        <h4 className="font-medium">{point.situation}</h4>
                        <div className="bg-muted p-4 rounded-lg">
                          <p className="italic">{point.script}</p>
                        </div>
                        <div className="space-y-1">
                          {point.tips.map((tip, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <ChevronRight className="w-4 h-4" />
                              {tip}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="additional-benefits">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4" />
                    Additional Benefits
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {recommendations.additionalBenefits.map((benefit, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{benefit.benefit}</h4>
                          <p className="text-sm text-muted-foreground">{benefit.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getNegotiabilityIcon(benefit.negotiability)}
                          <span className="text-sm">{benefit.negotiability}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 