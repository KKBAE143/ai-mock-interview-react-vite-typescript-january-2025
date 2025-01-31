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
} from "lucide-react";
import { chatSession } from "@/scripts";
import { toast } from "sonner";
import { fetchCertifications, getProviderLogo, getProviderColor } from "@/lib/certifications";

interface TechnologyDetails {
  name: string;
  version?: string;
  category: "Frontend" | "Backend" | "DevOps" | "Database" | "Cloud" | "Tools";
  proficiency: number;
  importance: "High" | "Medium" | "Low";
  resources: {
    title: string;
    url: string;
    type: "Documentation" | "Tutorial" | "Course" | "Article";
  }[];
  description: string;
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
    codeExamples: string[];
    bestPractices: string[];
  };
  githubExample?: string;
  resources: {
    title: string;
    url: string;
    type: "Tutorial" | "Documentation" | "Video" | "Article";
  }[];
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
      const techData = JSON.parse(techResult.response.text().match(/\{[\s\S]*\}/)[0]);
      setTechStack(techData.technologies);
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
      const skillsData = JSON.parse(skillsResult.response.text().match(/\{[\s\S]*\}/)[0]);
      setSkillAssessments(skillsData.skills);
      setLoading(prev => ({ ...prev, skills: false }));

      // Fetch detailed project suggestions
      const projectsPrompt = `
        Generate detailed project suggestions for ${role} at ${companyName} in this JSON format:
        {
          "projects": [
            {
              "title": "Project title",
              "description": "Project description",
              "skills": ["Required skills"],
              "difficulty": "Beginner/Intermediate/Advanced",
              "timeEstimate": "Time estimate",
              "objectives": ["Learning objectives"],
              "implementation": {
                "steps": ["Implementation steps"],
                "codeExamples": ["Code examples"],
                "bestPractices": ["Best practices"]
              },
              "githubExample": "GitHub repository URL",
              "resources": [
                {
                  "title": "Resource title",
                  "url": "Resource URL",
                  "type": "Tutorial/Documentation/Video/Article"
                }
              ]
            }
          ]
        }
      `;

      const projectsResult = await chatSession.sendMessage(projectsPrompt);
      const projectsData = JSON.parse(projectsResult.response.text().match(/\{[\s\S]*\}/)[0]);
      setProjects(projectsData.projects);
      setLoading(prev => ({ ...prev, projects: false }));

    } catch (error) {
      console.error("Error fetching role data:", error);
      toast.error("Failed to fetch role preparation data");
      setLoading({
        tech: false,
        skills: false,
        projects: false,
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Frontend":
        return <Layout className="w-4 h-4" />;
      case "Backend":
        return <Terminal className="w-4 h-4" />;
      case "Database":
        return <Database className="w-4 h-4" />;
      case "DevOps":
        return <Settings className="w-4 h-4" />;
      case "Cloud":
        return <Cloud className="w-4 h-4" />;
      case "Tools":
        return <Layers className="w-4 h-4" />;
      default:
        return <Code2 className="w-4 h-4" />;
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Advanced":
        return "bg-red-100 text-red-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Beginner":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Technical Stack Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="w-5 h-5" />
            Technical Stack
          </CardTitle>
          <CardDescription>
            Required technologies and proficiency levels for the role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="Frontend" className="w-full">
            <TabsList className="grid grid-cols-6 mb-4">
              {["Frontend", "Backend", "Database", "DevOps", "Cloud", "Tools"].map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="flex items-center gap-2"
                  onClick={() => setActiveCategory(category)}
                >
                  {getCategoryIcon(category)}
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            {["Frontend", "Backend", "Database", "DevOps", "Cloud", "Tools"].map((category) => (
              <TabsContent key={category} value={category} className="space-y-6">
                {loading.tech ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-2 bg-gray-200 rounded w-full"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  techStack
                    .filter((tech) => tech.category === category)
                    .map((tech, index) => (
                      <div key={index} className="space-y-4 p-4 border rounded-lg hover:border-primary transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{tech.name}</h4>
                              {tech.version && (
                                <Badge variant="secondary" className="text-xs">
                                  v{tech.version}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{tech.description}</p>
                          </div>
                          <Badge className={getImportanceColor(tech.importance)}>
                            {tech.importance}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Proficiency Required</span>
                            <span>{tech.proficiency}%</span>
                          </div>
                          <Progress value={tech.proficiency} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium">Learning Resources</h5>
                          <div className="grid gap-2">
                            {tech.resources.map((resource, i) => (
                              <a
                                key={i}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-2 text-sm border rounded hover:bg-primary/5 transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  {resource.type === "Documentation" && <FileText className="w-4 h-4" />}
                                  {resource.type === "Tutorial" && <PlayCircle className="w-4 h-4" />}
                                  {resource.type === "Course" && <BookOpen className="w-4 h-4" />}
                                  {resource.type === "Article" && <BookMarked className="w-4 h-4" />}
                                  <span>{resource.title}</span>
                                </div>
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Skill Requirements Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Skill Requirements
          </CardTitle>
          <CardDescription>
            Core competencies and learning paths for the role
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
              <div key={index} className="space-y-4 p-4 border rounded-lg hover:border-primary transition-colors">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">{skill.name}</h4>
                    <p className="text-sm text-muted-foreground">Category: {skill.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getImportanceColor(skill.importance)}>
                      {skill.importance}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {skill.timeToAcquire}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Required Level</span>
                    <span>{skill.level}%</span>
                  </div>
                  <Progress value={skill.level} className="h-2" />
                </div>
                {skill.dependencies.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Prerequisites</h5>
                    <div className="flex flex-wrap gap-2">
                      {skill.dependencies.map((dep, i) => (
                        <Badge key={i} variant="secondary">
                          {dep}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Learning Path</h5>
                  <div className="space-y-3">
                    {skill.learningPath.map((stage, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 font-medium text-sm">
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h6 className="font-medium text-sm">{stage.stage}</h6>
                            <span className="text-xs text-muted-foreground">{stage.duration}</span>
                          </div>
                          <ul className="mt-1 space-y-1">
                            {stage.resources.map((resource, j) => (
                              <li key={j} className="text-sm text-muted-foreground flex items-center gap-2">
                                <CheckCircle2 className="w-3 h-3" />
                                {resource}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Project Suggestions Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            Project Portfolio Suggestions
          </CardTitle>
          <CardDescription>
            Recommended projects to demonstrate your skills
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading.projects ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-24 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : (
            projects.map((project, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg hover:border-primary transition-colors">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{project.title}</h4>
                  <Badge className={getDifficultyColor(project.difficulty)}>
                    {project.difficulty}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{project.description}</p>
                <div className="grid gap-4">
                  <div>
                    <h5 className="text-sm font-medium mb-2">Learning Objectives</h5>
                    <ul className="space-y-1">
                      {project.objectives.map((objective, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3" />
                          {objective}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium mb-2">Required Skills</h5>
                    <div className="flex flex-wrap gap-2">
                      {project.skills.map((skill, i) => (
                        <Badge key={i} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium mb-2">Implementation Guide</h5>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        {project.implementation.steps.map((step, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 font-medium text-sm">
                              {i + 1}
                            </div>
                            <p className="text-sm text-muted-foreground flex-1">{step}</p>
                          </div>
                        ))}
                      </div>
                      {project.implementation.codeExamples.length > 0 && (
                        <div className="space-y-2">
                          <h6 className="text-sm font-medium">Code Examples</h6>
                          <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                            <pre className="text-sm">
                              {project.implementation.codeExamples.join("\n\n")}
                            </pre>
                          </ScrollArea>
                        </div>
                      )}
                      {project.implementation.bestPractices.length > 0 && (
                        <div className="space-y-2">
                          <h6 className="text-sm font-medium">Best Practices</h6>
                          <ul className="space-y-1">
                            {project.implementation.bestPractices.map((practice, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                                <Star className="w-3 h-3" />
                                {practice}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  {project.githubExample && (
                    <a
                      href={project.githubExample}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2 text-sm border rounded hover:bg-primary/5 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <GitBranch className="w-4 h-4" />
                        <span>View Example Repository</span>
                      </div>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <div>
                    <h5 className="text-sm font-medium mb-2">Additional Resources</h5>
                    <div className="grid gap-2">
                      {project.resources.map((resource, i) => (
                        <a
                          key={i}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-2 text-sm border rounded hover:bg-primary/5 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            {resource.type === "Documentation" && <FileText className="w-4 h-4" />}
                            {resource.type === "Tutorial" && <PlayCircle className="w-4 h-4" />}
                            {resource.type === "Video" && <PlayCircle className="w-4 h-4" />}
                            {resource.type === "Article" && <BookMarked className="w-4 h-4" />}
                            <span>{resource.title}</span>
                          </div>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Estimated completion time: {project.timeEstimate}
                  </p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
} 