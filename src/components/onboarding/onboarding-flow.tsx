import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';
import { useNavigate, useLocation } from 'react-router-dom';
import { Checkbox } from '../ui/checkbox';
import { useToast } from '../ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useOnboardingStore } from '@/store/onboarding-store';

// Define the schema for user preferences
const userPreferencesSchema = z.object({
  jobRole: z.string().min(1, 'Please select your job role'),
  experienceLevel: z.string().min(1, 'Please select your experience level'),
  interestAreas: z.array(z.string()).min(1, 'Please select at least one area of interest'),
  learningStyle: z.string().min(1, 'Please select your preferred learning style'),
  practiceFrequency: z.string().min(1, 'Please select your preferred practice frequency'),
  specificSkills: z.array(z.string()).optional(),
  targetCompanies: z.array(z.string()).optional(),
  notificationPreferences: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
  }),
});

type UserPreferences = z.infer<typeof userPreferencesSchema>;

type StepField = keyof UserPreferences;

interface Step {
  title: string;
  description: string;
  field: StepField;
  options: string[];
  isMultiSelect?: boolean;
}

const steps: Step[] = [
  {
    title: 'Job Role',
    description: 'What best describes your current or desired role?',
    field: 'jobRole',
    options: ['Software Engineer', 'Data Scientist', 'Product Manager', 'Designer', 'Other'],
  },
  {
    title: 'Experience Level',
    description: 'What is your level of experience?',
    field: 'experienceLevel',
    options: ['Entry Level', 'Mid Level', 'Senior Level', 'Lead/Manager'],
  },
  {
    title: 'Areas of Interest',
    description: 'What areas are you most interested in improving?',
    field: 'interestAreas',
    options: ['Technical Skills', 'Behavioral Skills', 'System Design', 'Problem Solving', 'Leadership'],
    isMultiSelect: true,
  },
  {
    title: 'Specific Skills',
    description: 'Select specific skills you want to focus on',
    field: 'specificSkills',
    options: ['Algorithms', 'System Design', 'Frontend', 'Backend', 'DevOps', 'Machine Learning', 'Cloud'],
    isMultiSelect: true,
  },
  {
    title: 'Target Companies',
    description: 'Select companies you are interested in',
    field: 'targetCompanies',
    options: ['Google', 'Amazon', 'Microsoft', 'Meta', 'Apple', 'Netflix', 'Other'],
    isMultiSelect: true,
  },
  {
    title: 'Learning Style',
    description: 'How do you prefer to learn?',
    field: 'learningStyle',
    options: ['Visual Learning', 'Practice Questions', 'Real-world Scenarios', 'Interactive Exercises'],
  },
  {
    title: 'Practice Frequency',
    description: 'How often would you like to practice?',
    field: 'practiceFrequency',
    options: ['Daily', 'Few times a week', 'Weekly', 'Monthly'],
  },
];

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { setOnboardingComplete, setHasStartedOnboarding } = useOnboardingStore();
  const progress = ((currentStep + 1) / steps.length) * 100;

  // Get the return path from location state
  const returnPath = (location.state as { returnPath?: string })?.returnPath || '/generate';

  const { handleSubmit, setValue, watch, formState: { errors } } = useForm<UserPreferences>({
    resolver: zodResolver(userPreferencesSchema),
    defaultValues: {
      jobRole: '',
      experienceLevel: '',
      interestAreas: [],
      specificSkills: [],
      targetCompanies: [],
      learningStyle: '',
      practiceFrequency: '',
      notificationPreferences: {
        email: true,
        push: false,
      },
    },
  });

  useEffect(() => {
    setHasStartedOnboarding(true);
  }, [setHasStartedOnboarding]);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "You're back online!",
        description: "Your progress will now be saved automatically.",
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "You're offline",
        description: "Don't worry, your progress will be saved locally.",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  // Save progress to localStorage
  useEffect(() => {
    const subscription = watch((value) => {
      localStorage.setItem('onboarding-progress', JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Load saved progress
  useEffect(() => {
    const savedProgress = localStorage.getItem('onboarding-progress');
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      Object.entries(parsed).forEach(([key, value]) => {
        setValue(key as keyof UserPreferences, value as z.infer<typeof userPreferencesSchema>[keyof UserPreferences]);
      });
    }
  }, [setValue]);

  const onSubmit = async (data: UserPreferences) => {
    try {
      setIsSubmitting(true);
      // TODO: Store the preferences in your backend/database
      console.log('Submitted preferences:', data);

      if (!isOnline) {
        localStorage.setItem('pending-preferences', JSON.stringify(data));
        toast({
          title: "Saved offline",
          description: "Your preferences will be synced when you're back online.",
        });
      } else {
        // Clear any pending preferences
        localStorage.removeItem('pending-preferences');
      }

      // Mark onboarding as complete
      setOnboardingComplete(true);

      // Navigate to the return path or dashboard
      navigate(returnPath);
      
      toast({
        title: "Onboarding complete!",
        description: "Your preferences have been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error saving preferences",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];
  const currentValue = watch(currentStepData.field);

  const isArrayField = (field: StepField): field is keyof Pick<UserPreferences, 'interestAreas' | 'specificSkills' | 'targetCompanies'> => {
    return ['interestAreas', 'specificSkills', 'targetCompanies'].includes(field);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-[600px] p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {currentStepData.title}
          </CardTitle>
          <CardDescription>
            Step {currentStep + 1} of {steps.length}
          </CardDescription>
          <Progress value={progress} className="w-full mt-2" />
        </CardHeader>
        <CardContent>
          <form id="onboarding-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                {currentStepData.description}
              </p>
              {currentStepData.isMultiSelect ? (
                <div className="space-y-2">
                  {currentStepData.options.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={option}
                        checked={isArrayField(currentStepData.field) && 
                          Array.isArray(currentValue) && 
                          currentValue.includes(option)}
                        onCheckedChange={(checked: boolean) => {
                          if (!isArrayField(currentStepData.field)) return;
                          const current = (currentValue as string[]) || [];
                          const updated = checked
                            ? [...current, option]
                            : current.filter((item) => item !== option);
                          setValue(currentStepData.field, updated);
                        }}
                      />
                      <label htmlFor={option} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <Select
                  value={currentValue as string}
                  onValueChange={(value: string) => {
                    setValue(currentStepData.field, value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentStepData.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {errors[currentStepData.field] && (
                <p className="text-sm text-red-500">
                  {errors[currentStepData.field]?.message}
                </p>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0 || isSubmitting}
          >
            Previous
          </Button>
          {currentStep === steps.length - 1 ? (
            <Button 
              type="submit" 
              form="onboarding-form"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Complete'
              )}
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={isSubmitting}>
              Next
            </Button>
          )}
        </CardFooter>
        {!isOnline && (
          <div className="mt-2 text-sm text-yellow-600 text-center">
            You're currently offline. Your progress will be saved locally.
          </div>
        )}
      </Card>
    </div>
  );
} 