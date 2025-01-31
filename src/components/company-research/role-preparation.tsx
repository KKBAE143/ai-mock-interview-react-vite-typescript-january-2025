import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { chatSession } from "@/scripts";
import { toast } from "sonner";
import { fetchCertifications, getProviderLogo, getProviderColor } from "@/lib/certifications";

interface TechStack {
  technology: string;
  proficiency: number;
  importance: "High" | "Medium" | "Low";
  resources: string[];
}

interface SkillAssessment {
  category: string;
  skills: {
    name: string;
    level: number;
    importance: "High" | "Medium" | "Low";
  }[];
}

interface ProjectSuggestion {
  title: string;
  description: string;
  skills: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  timeEstimate: string;
}

interface RolePreparationProps {
  companyName: string;
  role: string;
  industry: string;
}

export function RolePreparation({ companyName, role, industry }: RolePreparationProps) {
  const [techStack, setTechStack] = useState<TechStack[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [skillAssessments, setSkillAssessments] = useState<SkillAssessment[]>([]);
  const [projects, setProjects] = useState<ProjectSuggestion[]>([]);
  const [loading, setLoading] = useState({
    tech: false,
    certs: false,
    skills: false,
    projects: false,
  });

  useEffect(() => {
    fetchRoleData();
  }, [companyName, role]);

  const fetchRoleData = async () => {
    setLoading({
      tech: true,
      certs: true,
      skills: true,
      projects: true,
    });

    try {
      // Fetch technical stack requirements
      const techPrompt = `
        Generate technical stack requirements for ${role} at ${companyName} in this JSON format:
        {
          "techStack": [
            {
              "technology": "Technology name",
              "proficiency": 85,
              "importance": "High",
              "resources": ["Learning resource URL or description"]
            }
          ]
        }
      `;

      const techResult = await chatSession.sendMessage(techPrompt);
      const techData = JSON.parse(techResult.response.text().match(/\{[\s\S]*\}/)[0]);
      setTechStack(techData.techStack);
      setLoading(prev => ({ ...prev, tech: false }));

      // Fetch certifications using the enhanced system
      const certificationData = await fetchCertifications(role);
      setCertifications(certificationData);
      setLoading(prev => ({ ...prev, certs: false }));

      // Fetch skill assessments
      const skillsPrompt = `
        Generate skill requirements for ${role} at ${companyName} in this JSON format:
        {
          "skillAssessments": [
            {
              "category": "Category name",
              "skills": [
                {
                  "name": "Skill name",
                  "level": 80,
                  "importance": "High"
                }
              ]
            }
          ]
        }
      `;

      const skillsResult = await chatSession.sendMessage(skillsPrompt);
      const skillsData = JSON.parse(skillsResult.response.text().match(/\{[\s\S]*\}/)[0]);
      setSkillAssessments(skillsData.skillAssessments);
      setLoading(prev => ({ ...prev, skills: false }));

      // Fetch project suggestions
      const projectsPrompt = `
        Generate project suggestions for ${role} at ${companyName} in this JSON format:
        {
          "projects": [
            {
              "title": "Project title",
              "description": "Project description",
              "skills": ["Required skills"],
              "difficulty": "Intermediate",
              "timeEstimate": "2-3 weeks"
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
        certs: false,
        skills: false,
        projects: false,
      });
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

  const getLevelColor = (level: string) => {
    switch (level) {
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
    <div className="grid md:grid-cols-2 gap-6">
      {/* Technical Stack */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="w-5 h-5" />
            Technical Stack
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading.tech ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : techStack.length > 0 ? (
            techStack.map((tech, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{tech.technology}</div>
                  <Badge className={getImportanceColor(tech.importance)}>
                    {tech.importance}
                  </Badge>
                </div>
                <Progress value={tech.proficiency} className="h-2" />
                <div className="text-sm text-muted-foreground">
                  Resources:
                  <ul className="list-disc list-inside mt-1">
                    {tech.resources.map((resource, i) => (
                      <li key={i}>{resource}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No technical stack data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Recommended Certifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {loading.certs ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-32 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : certifications.length > 0 ? (
            certifications.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-4">
                <div className="border-b pb-2">
                  <h3 className="font-medium text-lg">{category.title}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
                <div className="grid gap-6">
                  {category.certifications.map((cert, certIndex) => (
                    <div
                      key={certIndex}
                      className={`relative group rounded-lg border p-6 hover:border-primary transition-all duration-300 hover:shadow-lg ${
                        cert.featured ? 'border-primary/50 bg-primary/5' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-medium group-hover:text-primary transition-colors flex items-center gap-2">
                            {cert.title}
                            {cert.featured && (
                              <Badge variant="secondary" className="text-xs">
                                Featured
                              </Badge>
                            )}
                          </h4>
                          <div className="flex items-center gap-2 mt-2">
                            <div 
                              className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-300 shadow-sm relative"
                              style={{ 
                                backgroundColor: getProviderColor(cert.provider),
                                transform: 'translateZ(0)'
                              }}
                            >
                              {getProviderLogo(cert.provider) ? (
                                <img
                                  src={getProviderLogo(cert.provider)}
                                  alt={cert.provider}
                                  className="w-5 h-5 object-contain transition-transform duration-300 group-hover:scale-110"
                                  style={{ 
                                    filter: [
                                      "Oracle", 
                                      "FreeCodeCamp", 
                                      "Frontend Masters", 
                                      "DataCamp"
                                    ].includes(cert.provider) ? "invert(1)" : "none",
                                    objectFit: "contain",
                                    maxWidth: "100%",
                                    maxHeight: "100%"
                                  }}
                                />
                              ) : (
                                <span className="text-sm font-bold text-white">
                                  {cert.provider.charAt(0)}
                                </span>
                              )}
                              <div 
                                className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                                aria-hidden="true"
                              />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium group-hover:text-primary transition-colors">
                                {cert.provider}
                              </span>
                              {cert.badge && (
                                <span className="text-xs text-muted-foreground">
                                  {cert.badge}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Badge 
                          className={`${getLevelColor(cert.level)} transition-transform duration-300 group-hover:scale-105`}
                        >
                          {cert.level}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 group-hover:text-muted-foreground/80 transition-colors">
                        {cert.description}
                      </p>
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-2 group-hover:text-primary transition-colors">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{cert.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>{cert.enrolled}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span>{cert.rating.toFixed(1)}</span>
                        </div>
                        {cert.price && (
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-muted-foreground" />
                            <span>{cert.price}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {cert.skills.map((skill, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs group-hover:bg-primary/10 transition-colors"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      {cert.instructors && (
                        <div className="flex items-center gap-2 mb-4 text-sm">
                          <BookOpen className="w-4 h-4 text-muted-foreground" />
                          <span>{cert.instructors.join(", ")}</span>
                        </div>
                      )}
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 rounded-lg ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        <span className="sr-only">View certification</span>
                      </a>
                      {cert.badge && (
                        <div className="absolute top-4 right-4 transform group-hover:scale-110 transition-transform">
                          <Award className="w-5 h-5 text-primary" />
                        </div>
                      )}
                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="mb-4">
                <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Certifications Found</h3>
              <p className="text-muted-foreground mb-4">
                We couldn't find any recommended certifications at the moment.
              </p>
              <Button onClick={fetchRoleData} variant="outline" className="gap-2">
                <GraduationCap className="w-4 h-4" />
                Retry Loading Data
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Skill Assessments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Skill Requirements
          </CardTitle>
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
            skillAssessments.map((category, index) => (
              <div key={index} className="space-y-4">
                <h3 className="font-medium">{category.category}</h3>
                <div className="space-y-3">
                  {category.skills.map((skill, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{skill.name}</span>
                        <Badge className={getImportanceColor(skill.importance)}>
                          {skill.importance}
                        </Badge>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Project Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            Project Portfolio Suggestions
          </CardTitle>
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
              <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{project.title}</h3>
                  <Badge className={getDifficultyColor(project.difficulty)}>
                    {project.difficulty}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {project.description}
                </p>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill, i) => (
                      <Badge key={i} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Estimated time: {project.timeEstimate}
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