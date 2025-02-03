import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Code2,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  GitBranch,
  Star,
  TrendingUp,
  PlayCircle,
  FileText,
  Clock,
  Users,
  Award,
  ExternalLink,
  Terminal,
  Database,
  Cloud,
  Layout,
  Search,
  Layers,
  Settings,
  BookMarked,
  Cpu,
  Network,
  Lightbulb,
  Target,
  ListChecks,
  Info,
} from "lucide-react";
import { chatSession } from "@/scripts";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
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
import { Separator } from "@/components/ui/separator";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TechnologyDetails {
  name: string;
  version: string;
  category: string;
  proficiency: number;
  importance: "High" | "Medium" | "Low";
  resources: {
    title: string;
    url: string;
    type: "Documentation" | "Tutorial" | "Course" | "Article";
  }[];
  description: string;
  features?: string[];
  ecosystem?: string[];
}

interface SkillDetails {
  name: string;
  level: number;
  importance: "High" | "Medium" | "Low";
  category: string;
  timeToAcquire: string;
  dependencies: string[];
  learningPath: {
    stage: string;
    resources: string[];
    duration: string;
  }[];
}

interface ProjectDetails {
  title: string;
  description: string;
  skills: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  timeEstimate: string;
  objectives: string[];
  implementation: {
    steps: string[];
    bestPractices: string[];
  };
  resources: {
    title: string;
    url: string;
    type: "Tutorial" | "Documentation" | "Video" | "Article";
  }[];
  businessValue: string[];
  technicalChallenges: string[];
  advancedFeatures: string[];
  systemDesign: {
    architecture: string;
    components: string[];
    dataFlow: string;
    scalability: string;
  };
}

interface RolePreparationProps {
  companyName: string;
  role: string;
  industry: string;
}

export function RolePreparation({ companyName, role, industry }: RolePreparationProps) {
  const [techStack, setTechStack] = useState<TechnologyDetails[]>([]);
  const [skillAssessments, setSkillAssessments] = useState<SkillDetails[]>([]);
  const [projects, setProjects] = useState<ProjectDetails[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("Frontend");
  const [loading, setLoading] = useState({
    tech: false,
    skills: false,
    projects: false,
  });

  useEffect(() => {
    fetchRoleData();
  }, [companyName, role]);

  const fetchRoleData = async () => {
    setLoading({
      tech: true,
      skills: true,
      projects: true,
    });

    try {
      // Fetch technical stack requirements with enhanced details
      const techPrompt = `
        Generate detailed technical stack requirements for ${role} at ${companyName} in this JSON format:
        {
          "technologies": [
            {
              "name": "Technology name",
              "version": "Version requirement",
              "category": "Frontend/Backend/DevOps/Database/Cloud/Tools",
              "proficiency": 85,
              "importance": "High/Medium/Low",
              "features": ["Key feature 1", "Key feature 2"],
              "ecosystem": ["Related tool 1", "Related tool 2"],
              "resources": [
                {
                  "title": "Resource title",
                  "url": "Resource URL",
                  "type": "Documentation/Tutorial/Course/Article"
                }
              ],
              "description": "Detailed description of technology usage"
            }
          ]
        }
      `;

      const techResult = await chatSession.sendMessage(techPrompt);
      if (techResult.data) {
        // Add real documentation links based on technology name
        const technologies = techResult.data.technologies.map((tech: TechnologyDetails) => {
          const resources = [];
          
          switch (tech.name.toLowerCase()) {
            case "react":
              resources.push(
                {
                  title: "Official React Documentation",
                  url: "https://react.dev",
                  type: "Documentation"
                },
                {
                  title: "React Tutorial",
                  url: "https://react.dev/learn",
                  type: "Tutorial"
                },
                {
                  title: "React Course - Meta",
                  url: "https://www.coursera.org/learn/react-basics",
                  type: "Course"
                }
              );
              break;
            case "next.js":
              resources.push(
                {
                  title: "Next.js Documentation",
                  url: "https://nextjs.org/docs",
                  type: "Documentation"
                },
                {
                  title: "Learn Next.js",
                  url: "https://nextjs.org/learn",
                  type: "Tutorial"
                }
              );
              break;
            case "typescript":
              resources.push(
                {
                  title: "TypeScript Handbook",
                  url: "https://www.typescriptlang.org/docs/",
                  type: "Documentation"
                },
                {
                  title: "TypeScript Tutorial",
                  url: "https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html",
                  type: "Tutorial"
                }
              );
              break;
            // Add more cases for other technologies
          }
          
          return {
            ...tech,
            resources: [...tech.resources, ...resources]
          };
        });
        
        setTechStack(technologies);
      } else {
        throw new Error("Invalid technical stack data format");
      }
      setLoading(prev => ({ ...prev, tech: false }));

      // Fetch detailed skill requirements
      const skillsPrompt = `
        Generate detailed skill requirements for ${role} at ${companyName} in this JSON format:
        {
          "skills": [
            {
              "name": "Skill name",
              "level": 80,
              "importance": "High/Medium/Low",
              "category": "Category name",
              "timeToAcquire": "Estimated time",
              "dependencies": ["Required prerequisite skills"],
              "learningPath": [
                {
                  "stage": "Stage name",
                  "resources": ["Learning resources"],
                  "duration": "Stage duration"
                }
              ]
            }
          ]
        }
      `;

      const skillsResult = await chatSession.sendMessage(skillsPrompt);
      if (skillsResult.data) {
        setSkillAssessments(skillsResult.data.skills);
      } else {
        throw new Error("Invalid skills data format");
      }
      setLoading(prev => ({ ...prev, skills: false }));

      // Fetch detailed project suggestions with real resources
      const projectsPrompt = `
        Generate 3-4 advanced and highly specific project suggestions for a ${role} position at ${companyName} in the ${industry} industry.
        Focus on projects that would impress during interviews and demonstrate expertise in the required technologies.
        Return in this JSON format:
        {
          "projects": [
            {
              "title": "Project title",
              "description": "Project description",
              "skills": ["Required skills"],
              "difficulty": "Advanced",
              "timeEstimate": "Estimated time",
              "objectives": ["Learning objective 1", "Learning objective 2"],
              "implementation": {
                "steps": ["Step 1", "Step 2"],
                "bestPractices": ["Best practice 1", "Best practice 2"]
              },
              "businessValue": ["Business value 1", "Business value 2"],
              "technicalChallenges": ["Challenge 1", "Challenge 2"],
              "advancedFeatures": ["Feature 1", "Feature 2"],
              "systemDesign": {
                "architecture": "Architecture description",
                "components": ["Component 1", "Component 2"],
                "dataFlow": "Data flow description",
                "scalability": "Scalability approach"
              }
            }
          ]
        }
      `;

      console.log('Sending project generation prompt...');
      const projectsResult = await chatSession.sendMessage(projectsPrompt);
      console.log('Received project generation response:', projectsResult);

      if (projectsResult.data && Array.isArray(projectsResult.data.projects)) {
        console.log('Processing projects data...');
        const projectsWithResources = projectsResult.data.projects.map((project: ProjectDetails) => {
          console.log('Processing project:', project.title);
          
          // Validate project structure
          if (!project.title || !project.description || !Array.isArray(project.skills)) {
            console.error('Invalid project structure:', project);
            return null;
          }

          const resources = [];
          
          // Add real-world resources based on project type and skills
          project.skills.forEach((skill: string) => {
            console.log('Processing skill:', skill);
            // Add skill-specific resources
            switch (skill.toLowerCase()) {
              case "react":
                resources.push({
                  title: "React Documentation",
                  url: "https://react.dev",
                  type: "Documentation"
                });
                break;
              case "typescript":
                resources.push({
                  title: "TypeScript Handbook",
                  url: "https://www.typescriptlang.org/docs/",
                  type: "Documentation"
                });
                break;
              case "next.js":
                resources.push({
                  title: "Next.js Documentation",
                  url: "https://nextjs.org/docs",
                  type: "Documentation"
                });
                break;
              // Add more cases as needed
            }
          });

          // Ensure all required fields are present
          return {
            title: project.title,
            description: project.description,
            skills: project.skills,
            difficulty: project.difficulty || "Advanced",
            timeEstimate: project.timeEstimate || "2-3 months",
            objectives: project.objectives || [],
            implementation: project.implementation || {
              steps: [],
              bestPractices: []
            },
            businessValue: project.businessValue || [],
            technicalChallenges: project.technicalChallenges || [],
            advancedFeatures: project.advancedFeatures || [],
            systemDesign: project.systemDesign || {
              architecture: "",
              components: [],
              dataFlow: "",
              scalability: ""
            },
            resources: resources.slice(0, 5) // Limit to 5 most relevant resources
          };
        }).filter(Boolean); // Remove any null projects

        console.log('Setting projects state with:', projectsWithResources);
        if (projectsWithResources.length > 0) {
          setProjects(projectsWithResources);
        } else {
          throw new Error("No valid projects generated");
        }
      } else {
        console.error('Invalid projects data format:', projectsResult);
        throw new Error("Invalid projects data format");
      }
      setLoading(prev => ({ ...prev, projects: false }));

    } catch (error) {
      console.error("Error fetching role data:", error);
      toast.error("Failed to fetch role preparation data. Please try again.");
      setLoading({
        tech: false,
        skills: false,
        projects: false,
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "frontend":
        return <Layout className="w-4 h-4" />;
      case "backend":
        return <Terminal className="w-4 h-4" />;
      case "database":
        return <Database className="w-4 h-4" />;
      case "devops":
        return <Settings className="w-4 h-4" />;
      case "cloud":
        return <Cloud className="w-4 h-4" />;
      case "tools":
        return <Layers className="w-4 h-4" />;
      default:
        return <Code2 className="w-4 h-4" />;
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  function TechnologyCard({ tech }: { tech: TechnologyDetails }) {
  return (
      <Dialog>
        <DialogTrigger asChild>
          <div className="group relative flex items-center gap-4 rounded-lg border bg-card p-4 hover:shadow-lg transition-all cursor-pointer">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                {getCategoryIcon(tech.category)}
              </div>
              <div className="absolute -bottom-1 -right-1 rounded-full border-2 border-background bg-primary p-1">
                <div className={cn(
                  "h-2 w-2 rounded-full",
                  tech.importance === "High" ? "bg-red-500" :
                  tech.importance === "Medium" ? "bg-yellow-500" : "bg-green-500"
                )} />
                      </div>
                  </div>
            
            <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg truncate">
                    {tech.name}
                  </h3>
                              {tech.version && (
                    <span className="text-xs text-muted-foreground">v{tech.version}</span>
                              )}
                            </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-primary">{tech.proficiency}%</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground truncate mt-1">
                {tech.description}
              </p>
            </div>
                          </div>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                {getCategoryIcon(tech.category)}
                {tech.name}
                {tech.version && (
                  <span className="text-sm text-muted-foreground">v{tech.version}</span>
                )}
              </DialogTitle>
              <Badge className={cn(
                "px-2 py-0.5",
                getImportanceColor(tech.importance)
              )}>
                            {tech.importance}
                          </Badge>
                        </div>
            <DialogDescription>
              {tech.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-6 space-y-6">
                        <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Proficiency Level</span>
                <span className="text-sm font-medium text-primary">{tech.proficiency}%</span>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary/20">
                <div
                  className="absolute inset-y-0 left-0 bg-primary transition-all duration-500"
                  style={{ width: `${tech.proficiency}%` }}
                />
                <div className="absolute inset-0 flex">
                  {[20, 40, 60, 80].map((mark) => (
                    <div
                      key={mark}
                      className="flex-1 border-l border-background/20"
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Beginner</span>
                <span>Intermediate</span>
                <span>Advanced</span>
                <span>Expert</span>
                <span>Master</span>
              </div>
            </div>

            {tech.features && tech.features.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Key Features</h4>
                <div className="grid grid-cols-2 gap-2">
                  {tech.features.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-lg border bg-card p-3"
                    >
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tech.ecosystem && tech.ecosystem.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Related Tools & Libraries</h4>
                <div className="flex flex-wrap gap-2">
                  {tech.ecosystem.map((tool, i) => (
                    <div
                      key={i}
                      className="inline-flex items-center rounded-lg border bg-card px-3 py-1"
                    >
                      <span className="text-sm">{tool}</span>
                    </div>
                  ))}
                          </div>
                        </div>
            )}

            <div className="space-y-3">
              <h4 className="text-sm font-medium">Learning Resources</h4>
                          <div className="grid gap-2">
                            {tech.resources.map((resource, i) => (
                              <a
                                key={i}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                    className="group flex items-center justify-between rounded-lg border bg-card p-3 transition-colors hover:bg-accent"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "rounded-full p-2",
                        resource.type === "Documentation" ? "bg-blue-500/10" :
                        resource.type === "Tutorial" ? "bg-green-500/10" :
                        resource.type === "Course" ? "bg-purple-500/10" :
                        "bg-orange-500/10"
                      )}>
                        {resource.type === "Documentation" ? (
                          <FileText className="h-4 w-4 text-blue-500" />
                        ) : resource.type === "Tutorial" ? (
                          <PlayCircle className="h-4 w-4 text-green-500" />
                        ) : resource.type === "Course" ? (
                          <BookOpen className="h-4 w-4 text-purple-500" />
                        ) : (
                          <BookMarked className="h-4 w-4 text-orange-500" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {resource.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {resource.type}
                        </p>
                      </div>
                                </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="space-y-6">
      {/* Technical Requirements */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Code2 className="w-5 h-5" />
                Technical Requirements
              </CardTitle>
              <CardDescription>
                Required technologies and proficiency levels for {role} at {companyName}
              </CardDescription>
            </div>
            <ScrollArea className="w-full max-w-[600px]">
              <div className="flex items-center gap-2 p-1">
                <Button
                  variant={!activeCategory ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory("")}
                  className="whitespace-nowrap"
                >
                  All
                </Button>
                {["Frontend", "Backend", "Database", "DevOps", "Cloud", "Tools"].map((category) => (
                  <Button
                    key={category}
                    variant={activeCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory(category)}
                    className="whitespace-nowrap"
                  >
                    <span className="flex items-center gap-2">
                      {getCategoryIcon(category)}
                      {category}
                    </span>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading.tech ? (
              <div className="grid gap-4 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse flex items-center gap-4 rounded-lg border p-4">
                    <div className="h-16 w-16 rounded-full bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-1/3 rounded bg-muted" />
                      <div className="h-3 w-full rounded bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {techStack
                  .filter((tech) => !activeCategory || tech.category === activeCategory)
                  .map((tech, index) => (
                    <TechnologyCard key={index} tech={tech} />
                  ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Skill Requirements & Learning Path */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Skill Requirements & Learning Path
          </CardTitle>
          <CardDescription>
            Essential skills and structured learning path for the role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
          {loading.skills ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-20 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : (
            skillAssessments.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-4 p-4 border rounded-lg"
                >
                <div className="flex items-center justify-between">
                    <div>
                    <h4 className="font-medium">{skill.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Estimated time to acquire: {skill.timeToAcquire}
                      </p>
                  </div>
                    <Badge className={getImportanceColor(skill.importance)}>
                      {skill.importance}
                    </Badge>
                  </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                      <span>Required Proficiency</span>
                    <span>{skill.level}%</span>
                  </div>
                  <Progress value={skill.level} className="h-2" />
                </div>

                {skill.dependencies.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium mb-2">Prerequisites</h5>
                    <div className="flex flex-wrap gap-2">
                      {skill.dependencies.map((dep, i) => (
                        <Badge key={i} variant="secondary">
                          {dep}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                  <div className="space-y-3">
                    <h5 className="text-sm font-medium">Learning Path</h5>
                    <div className="space-y-4">
                    {skill.learningPath.map((stage, i) => (
                        <div
                          key={i}
                          className="relative pl-6 pb-4 last:pb-0 border-l border-border last:border-l-transparent"
                        >
                          <div className="absolute left-[-4px] top-1 w-2 h-2 rounded-full bg-primary" />
                          <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <h6 className="font-medium text-sm">{stage.stage}</h6>
                              <span className="text-xs text-muted-foreground">
                                {stage.duration}
                              </span>
                          </div>
                            <ul className="space-y-1">
                            {stage.resources.map((resource, j) => (
                                <li
                                  key={j}
                                  className="text-sm text-muted-foreground flex items-start gap-2"
                                >
                                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                                {resource}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                </motion.div>
            ))
          )}
          </div>
        </CardContent>
      </Card>

      {/* Project Portfolio Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks className="w-5 h-5" />
            Advanced Project Portfolio
          </CardTitle>
          <CardDescription>
            Role-specific advanced projects to demonstrate expertise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
          {loading.projects ? (
              <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-40 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : (
            projects.map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-xl p-6 space-y-6 bg-card hover:shadow-lg transition-all"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">{project.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {project.description}
                        </p>
                      </div>
                  <Badge className={getDifficultyColor(project.difficulty)}>
                    {project.difficulty}
                  </Badge>
                </div>

                    <div className="flex flex-wrap gap-2">
                      {project.skills.map((skill, i) => (
                        <Badge key={i} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Target className="w-4 h-4 text-primary" />
                          Project Objectives
                        </h4>
                        <ul className="space-y-2">
                          {project.objectives.map((objective, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                              <span>{objective}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-primary" />
                          Technical Challenges
                        </h4>
                        <ul className="space-y-2">
                          {project.technicalChallenges.map((challenge, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <Network className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                              <span>{challenge}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                  <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-primary" />
                          Business Value
                        </h4>
                        <ul className="space-y-2">
                          {project.businessValue.map((value, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                              <span>{value}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Settings className="w-4 h-4 text-primary" />
                          System Design
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div className="space-y-1">
                            <span className="font-medium">Architecture:</span>
                            <p className="text-muted-foreground">{project.systemDesign.architecture}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="font-medium">Components:</span>
                            <ul className="list-disc list-inside text-muted-foreground">
                              {project.systemDesign.components.map((component, i) => (
                                <li key={i}>{component}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="space-y-1">
                            <span className="font-medium">Data Flow:</span>
                            <p className="text-muted-foreground">{project.systemDesign.dataFlow}</p>
                            </div>
                          <div className="space-y-1">
                            <span className="font-medium">Scalability:</span>
                            <p className="text-muted-foreground">{project.systemDesign.scalability}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-primary" />
                          Advanced Features
                        </h4>
                        <ul className="space-y-2">
                          {project.advancedFeatures.map((feature, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <Star className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-primary" />
                        Implementation Guide
                      </h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <h5 className="text-sm font-medium mb-2">Steps</h5>
                          <ul className="space-y-2">
                            {project.implementation.steps.map((step, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                <span>{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium mb-2">Best Practices</h5>
                          <ul className="space-y-2">
                            {project.implementation.bestPractices.map((practice, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                                <span>{practice}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                  <div>
                      <h4 className="text-sm font-medium mb-2">Learning Resources</h4>
                    <div className="grid gap-2">
                      {project.resources.map((resource, i) => (
                        <a
                          key={i}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 text-sm border rounded-lg hover:bg-accent transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "rounded-full p-2",
                                resource.type === "Documentation" ? "bg-blue-500/10" :
                                resource.type === "Tutorial" ? "bg-green-500/10" :
                                resource.type === "Video" ? "bg-red-500/10" :
                                "bg-orange-500/10"
                              )}>
                                {resource.type === "Documentation" ? (
                                  <FileText className="h-4 w-4 text-blue-500" />
                                ) : resource.type === "Tutorial" ? (
                                  <PlayCircle className="h-4 w-4 text-green-500" />
                                ) : resource.type === "Video" ? (
                                  <PlayCircle className="h-4 w-4 text-red-500" />
                                ) : (
                                  <BookMarked className="h-4 w-4 text-orange-500" />
                                )}
                              </div>
                              <div className="space-y-1">
                                <p className="font-medium leading-none">{resource.title}</p>
                                <p className="text-xs text-muted-foreground">{resource.type}</p>
                              </div>
                          </div>
                            <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
                        </a>
                      ))}
                    </div>
                  </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Estimated time: {project.timeEstimate}</span>
                      </div>
                </div>
              </div>
                </motion.div>
            ))
          )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 