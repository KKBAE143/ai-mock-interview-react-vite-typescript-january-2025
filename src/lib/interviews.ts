import { chatSession } from "@/scripts";

interface InterviewExperience {
  role: string;
  date: string;
  difficulty: "Easy" | "Medium" | "Hard";
  outcome: "Accepted" | "Rejected" | "Pending";
  location?: string;
  experience?: string;
  rating?: number;
  interviewProcess: {
    stage: string;
    description: string;
    duration: string;
    focus: string[];
    tips: string[];
  }[];
  technicalQuestions: {
    question: string;
    purpose: string;
    exampleAnswer?: string;
    category: "Coding" | "System Design" | "Architecture" | "Domain Knowledge" | "Tools & Technologies";
  }[];
  behavioralQuestions: {
    question: string;
    purpose: string;
    exampleResponse?: string;
    category: "Leadership" | "Problem Solving" | "Teamwork" | "Communication" | "Culture Fit";
  }[];
  successTips: {
    category: "Technical Preparation" | "Behavioral Preparation" | "Company Research" | "Interview Strategy";
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

// Base interview data for common roles
const baseInterviewData: Record<string, InterviewExperience[]> = {
  "Frontend Developer": [
    {
      role: "Frontend Developer",
      date: new Date().toISOString(),
      difficulty: "Medium",
      outcome: "Accepted",
      location: "Bangalore",
      experience: "2-3 years",
      rating: 4,
      interviewProcess: [
        {
          stage: "Initial Screening",
          description: "30-minute call with HR to discuss your background and role expectations",
          duration: "30 minutes",
          focus: [
            "Resume walkthrough",
            "Basic qualification verification",
            "Initial salary expectations",
            "Notice period discussion"
          ],
          tips: [
            "Prepare a 2-minute pitch about your frontend experience",
            "Have your portfolio/GitHub ready to share",
            "Research current frontend salary trends in India"
          ]
        },
        {
          stage: "Technical Assessment",
          description: "Online coding assessment focusing on React, JavaScript, and frontend concepts",
          duration: "2 hours",
          focus: [
            "React components and hooks",
            "JavaScript fundamentals",
            "CSS and responsive design",
            "Performance optimization"
          ],
          tips: [
            "Practice React coding challenges",
            "Review CSS Grid and Flexbox",
            "Understand React performance optimization techniques"
          ]
        },
        {
          stage: "Technical Discussion",
          description: "Deep dive into your technical skills and problem-solving approach",
          duration: "1 hour",
          focus: [
            "Code review discussion",
            "System design for frontend",
            "Technical decision making",
            "Best practices and patterns"
          ],
          tips: [
            "Prepare to explain your coding decisions",
            "Review modern frontend architecture patterns",
            "Be ready to discuss trade-offs in your solutions"
          ]
        },
        {
          stage: "Hiring Manager Round",
          description: "Discussion about team fit and long-term goals",
          duration: "45 minutes",
          focus: [
            "Past projects and impact",
            "Team collaboration",
            "Career growth plans",
            "Leadership potential"
          ],
          tips: [
            "Prepare examples of team contributions",
            "Research the company's frontend roadmap",
            "Have questions about team structure and processes"
          ]
        }
      ],
      technicalQuestions: [
        {
          question: "Implement a custom hook for infinite scrolling with TypeScript",
          purpose: "Assess React hooks knowledge and handling of complex UI patterns",
          exampleAnswer: "Create a useInfiniteScroll hook using IntersectionObserver, manage loading states, and handle error cases. Consider debouncing scroll events for performance.",
          category: "Coding"
        },
        {
          question: "Design a scalable design system for a large enterprise application",
          purpose: "Evaluate component architecture and design system knowledge",
          exampleAnswer: "Use atomic design principles, implement theme tokens, create reusable base components, and ensure proper TypeScript types. Consider accessibility and performance.",
          category: "System Design"
        },
        {
          question: "Explain your approach to managing global state in a large Next.js application",
          purpose: "Assess architectural decision-making for frontend state",
          exampleAnswer: "Compare solutions like Redux, Zustand, Jotai, and Context API. Discuss server state with React Query/SWR. Consider trade-offs between complexity and performance.",
          category: "Architecture"
        }
      ],
      behavioralQuestions: [
        {
          question: "Describe a challenging frontend project you completed recently",
          purpose: "Assess problem-solving and project management skills",
          exampleResponse: "Discuss a complex UI implementation, challenges faced, and solutions",
          category: "Problem Solving"
        },
        {
          question: "How do you handle feedback on your code during reviews?",
          purpose: "Evaluate teamwork and communication skills",
          exampleResponse: "Explain your approach to receiving and implementing feedback constructively",
          category: "Communication"
        }
      ],
      successTips: [
        {
          category: "Technical Preparation",
          tips: [
            "Master React hooks and TypeScript",
            "Practice component optimization",
            "Study modern CSS techniques"
          ],
          examples: [
            "Build a sample project using Next.js and TypeScript",
            "Contribute to open-source React projects",
            "Create a performance-optimized demo"
          ]
        },
        {
          category: "Interview Strategy",
          tips: [
            "Use the STAR method for behavioral questions",
            "Prepare code examples beforehand",
            "Research company's tech stack"
          ],
          examples: [
            "Document your past project achievements",
            "Create a technical presentation template",
            "Study company's engineering blog posts"
          ]
        }
      ],
      companyInsights: {
        culture: [
          "Strong emphasis on code quality",
          "Regular knowledge sharing sessions",
          "Collaborative team environment"
        ],
        values: [
          "Innovation in frontend development",
          "User-centric design approach",
          "Continuous learning"
        ],
        recentAchievements: [
          "Launched new design system",
          "Improved application performance by 40%",
          "Successfully migrated to Next.js"
        ],
        techStack: [
          "React 18+",
          "TypeScript",
          "Next.js",
          "Tailwind CSS",
          "Testing Library"
        ],
        workStyle: [
          "Agile development",
          "Regular code reviews",
          "CI/CD practices"
        ]
      }
    }
  ],
  "Backend Developer": [
    {
      role: "Backend Developer",
      date: new Date().toISOString(),
      difficulty: "Medium",
      outcome: "Accepted",
      location: "Hyderabad",
      experience: "3-5 years",
      rating: 4,
      rounds: [
        "Online Assessment - DSA & System Design",
        "Technical Round 1 - Backend Architecture",
        "Technical Round 2 - Microservices Design",
        "Hiring Manager Discussion",
        "HR Discussion"
      ],
      tips: [
        "Strong knowledge of Node.js, Express, and database optimization",
        "Experience with microservices architecture and API design",
        "Understanding of caching strategies and message queues",
        "Familiarity with AWS/Azure cloud services",
        "Practice system design for scalable backend systems"
      ],
      questions: [
        "Design a scalable notification system",
        "Implement rate limiting middleware",
        "How would you handle database sharding?",
        "Explain your approach to API security",
        "Design a real-time chat system architecture"
      ],
      interviewProcess: [
        {
          stage: "Initial Screening",
          description: "HR discussion about your background and role expectations",
          duration: "30 minutes",
          focus: [
            "Resume walkthrough",
            "Backend experience verification",
            "Salary expectations",
            "Notice period"
          ],
          tips: [
            "Prepare examples of backend projects",
            "Research current backend tech trends",
            "Have your GitHub profile ready"
          ]
        },
        {
          stage: "Technical Assessment",
          description: "DSA and backend coding assessment",
          duration: "2 hours",
          focus: [
            "Data Structures & Algorithms",
            "Database design",
            "API design",
            "System architecture"
          ],
          tips: [
            "Practice LeetCode medium/hard problems",
            "Review database optimization",
            "Study API security best practices"
          ]
        }
      ],
      technicalQuestions: [
        {
          question: "Design and implement a rate limiting middleware for a Node.js API",
          purpose: "Evaluate system design and coding skills for API protection",
          exampleAnswer: "Implement token bucket algorithm with Redis for distributed rate limiting. Consider rate limit by IP, user, and API endpoint. Handle edge cases and error responses.",
          category: "Coding"
        },
        {
          question: "Design a scalable notification system handling millions of users",
          purpose: "Assess system design for high-scale distributed systems",
          exampleAnswer: "Use message queues (Kafka/RabbitMQ), implement pub/sub pattern, handle different notification types (email, push, SMS), consider failure scenarios and retry mechanisms.",
          category: "System Design"
        },
        {
          question: "Explain your approach to handling database sharding in a high-traffic application",
          purpose: "Evaluate database architecture knowledge",
          exampleAnswer: "Discuss sharding strategies (range-based vs hash-based), handle cross-shard queries, manage data consistency, and explain rebalancing approaches.",
          category: "Architecture"
        }
      ],
      behavioralQuestions: [
        {
          question: "Describe a time when you had to optimize a poorly performing API",
          purpose: "Assess problem-solving and performance optimization skills",
          exampleResponse: "Explain the performance issue, your analysis process, optimization steps taken, and the resulting improvements with metrics.",
          category: "Problem Solving"
        },
        {
          question: "How do you ensure code quality in your team?",
          purpose: "Evaluate leadership and code quality practices",
          exampleResponse: "Discuss implementing code reviews, automated testing, CI/CD pipelines, and coding standards.",
          category: "Leadership"
        }
      ]
    }
  ],
  "Full Stack Developer": [
    {
      role: "Full Stack Developer",
      date: new Date().toISOString(),
      difficulty: "Medium",
      outcome: "Accepted",
      location: "Pune",
      experience: "4-6 years",
      rating: 4,
      rounds: [
        "Online Assessment - Full Stack Problem Solving",
        "Technical Round 1 - Frontend Deep Dive",
        "Technical Round 2 - Backend Architecture",
        "System Design Discussion",
        "Hiring Manager Round"
      ],
      tips: [
        "Strong proficiency in both frontend (React) and backend (Node.js) development",
        "Experience with full-stack TypeScript applications",
        "Knowledge of database design and optimization",
        "Understanding of DevOps practices and cloud deployment",
        "Practice end-to-end system design"
      ],
      questions: [
        "Design and implement a full-stack authentication system",
        "How would you optimize database queries in a MERN stack?",
        "Implement real-time features using WebSocket",
        "Design a scalable architecture for an e-commerce platform",
        "Explain your approach to handling file uploads in a full-stack app"
      ],
      interviewProcess: [
        {
          stage: "Initial Screening",
          description: "Discussion about full stack experience",
          duration: "30 minutes",
          focus: [
            "Full stack project experience",
            "Technical stack knowledge",
            "Role expectations",
            "Notice period"
          ],
          tips: [
            "Prepare end-to-end project examples",
            "Review both frontend and backend concepts",
            "Research company's tech stack"
          ]
        }
      ],
      technicalQuestions: [
        {
          question: "Build a real-time collaborative todo application with offline support",
          purpose: "Evaluate full-stack development and real-time sync capabilities",
          exampleAnswer: "Use Next.js with WebSocket for real-time, implement offline-first with Service Workers, handle conflict resolution, and ensure data consistency.",
          category: "Coding"
        },
        {
          question: "Design a scalable microservices architecture for an e-commerce platform",
          purpose: "Assess end-to-end system design knowledge",
          exampleAnswer: "Design services (auth, product, order, payment), implement API Gateway, handle service discovery, ensure data consistency, and explain deployment strategy.",
          category: "System Design"
        },
        {
          question: "Explain your approach to implementing authentication in a full-stack application",
          purpose: "Evaluate security and architecture knowledge",
          exampleAnswer: "Discuss JWT vs sessions, implement refresh tokens, handle OAuth2.0, secure API endpoints, and manage client-side auth state.",
          category: "Architecture"
        }
      ]
    }
  ]
};

// Function to determine interview difficulty based on rounds and questions
function determineInterviewDifficulty(rounds: number, technicalQuestions: number): "Easy" | "Medium" | "Hard" {
  const totalScore = rounds * 2 + technicalQuestions;
  if (totalScore > 15) return "Hard";
  if (totalScore > 10) return "Medium";
  return "Easy";
}

// Function to generate realistic interview rounds based on role and company
function generateInterviewRounds(role: string, companyTier: string): string[] {
  const commonRounds = [
    "Online Assessment",
    "Technical Round 1",
    "Technical Round 2",
    "Hiring Manager Round",
    "HR Discussion"
  ];

  const additionalRounds = {
    "FAANG": [
      "System Design Discussion",
      "Behavioral Assessment",
      "Bar Raiser Round",
      "Team Matching"
    ],
    "Unicorn": [
      "System Design Discussion",
      "Culture Fit Round",
      "Team Introduction"
    ],
    "Enterprise": [
      "Group Discussion",
      "Technical Presentation",
      "Team Round"
    ]
  };

  const rounds = [...commonRounds];
  if (companyTier in additionalRounds) {
    rounds.push(...additionalRounds[companyTier].slice(0, 2));
  }

  return rounds;
}

export async function fetchInterviewExperiences(companyName: string, jobRole: string): Promise<InterviewExperience[]> {
  try {
    const companyTier = determineCompanyTier(companyName);
    const roleSpecificData = baseInterviewData[jobRole] || [];
    
    // Generate multiple experiences with different difficulties and outcomes
    const defaultExperiences: InterviewExperience[] = [
      {
        role: jobRole,
        date: new Date().toISOString(),
        difficulty: "Medium",
        outcome: "Accepted",
        location: "Bangalore",
        experience: "3-5 years",
        rating: 4,
        interviewProcess: [
          {
            stage: "Initial Screening",
            description: "HR discussion about your background and role expectations",
            duration: "30 minutes",
            focus: [
              "Resume walkthrough",
              "Basic qualification verification",
              "Initial salary expectations",
              "Notice period discussion"
            ],
            tips: [
              `Prepare a 2-minute pitch about your ${jobRole} experience`,
              "Have your portfolio/GitHub ready to share",
              "Research current salary trends",
              "Be ready to discuss your notice period"
            ]
          },
          {
            stage: "Technical Assessment",
            description: `Online coding assessment focusing on ${jobRole} skills`,
            duration: "2 hours",
            focus: [
              "Data Structures & Algorithms",
              "Problem-solving skills",
              "Technical knowledge",
              "Code quality and optimization"
            ],
            tips: [
              "Practice coding challenges",
              "Focus on time complexity",
              "Write clean, documented code",
              "Test edge cases"
            ]
          },
          {
            stage: "Technical Discussion",
            description: "Deep dive into technical skills and experience",
            duration: "1 hour",
            focus: [
              "Previous project discussions",
              "System design concepts",
              "Technical decision making",
              "Best practices and patterns"
            ],
            tips: [
              "Prepare to explain your past projects",
              "Review system design fundamentals",
              "Be ready to discuss trade-offs",
              "Have examples of technical challenges you've solved"
            ]
          },
          {
            stage: "Hiring Manager Round",
            description: "Discussion about team fit and goals",
            duration: "45 minutes",
            focus: [
              "Team collaboration",
              "Problem-solving approach",
              "Career aspirations",
              "Cultural fit"
            ],
            tips: [
              "Research the company's culture",
              "Prepare questions about team structure",
              "Have examples of teamwork ready",
              "Show enthusiasm for learning"
            ]
          }
        ],
        technicalQuestions: generateTechnicalQuestions(jobRole, "Medium"),
        behavioralQuestions: [
          {
            category: "Problem Solving",
            question: "Describe a challenging project you completed recently",
            purpose: "Assess problem-solving abilities",
            exampleResponse: "Use STAR method to explain a relevant project focusing on technical challenges and solutions"
          },
          {
            category: "Leadership",
            question: "Tell me about a time you led a technical initiative",
            purpose: "Evaluate leadership potential",
            exampleResponse: "Discuss project leadership, team coordination, and successful delivery"
          },
          {
            category: "Communication",
            question: "How do you explain complex technical concepts to non-technical stakeholders?",
            purpose: "Assess communication skills",
            exampleResponse: "Share examples of successful technical communication and documentation"
          }
        ],
        successTips: [
          {
            category: "Technical Preparation",
            tips: [
              `Study ${jobRole} specific technologies`,
              "Practice coding problems",
              "Review system design patterns",
              "Understand company's tech stack"
            ],
            examples: [
              "Complete relevant certifications",
              "Build portfolio projects",
              "Contribute to open source",
              "Create technical blog posts"
            ]
          },
          {
            category: "Interview Strategy",
            tips: [
              "Use STAR method for behavioral questions",
              "Prepare code examples beforehand",
              "Research company thoroughly",
              "Practice mock interviews"
            ],
            examples: [
              "Document past achievements",
              "Create technical presentations",
              "Study company blog posts",
              "Network with employees"
            ]
          }
        ],
        companyInsights: {
          culture: [
            "Focus on innovation",
            "Collaborative environment",
            "Learning and growth opportunities",
            "Work-life balance"
          ],
          values: [
            "Technical excellence",
            "Customer focus",
            "Continuous improvement",
            "Diversity and inclusion"
          ],
          recentAchievements: [
            "Successful product launches",
            "Technology modernization",
            "Market expansion",
            "Industry recognition"
          ],
          techStack: [
            "Modern tools",
            "Latest frameworks",
            "Cloud technologies"
          ],
          workStyle: [
            "Agile methodology",
            "Regular code reviews",
            "DevOps practices"
          ]
        }
      },
      // Add another experience with different difficulty and outcome
      {
        ...generateAlternativeExperience(jobRole, "Hard", "Rejected", "Mumbai"),
      },
      // Add a third experience with different parameters
      {
        ...generateAlternativeExperience(jobRole, "Easy", "Accepted", "Hyderabad"),
      }
    ];

    // Try to get AI-generated experiences
    const prompt = `Generate detailed interview experiences for ${jobRole} position at ${companyName}. Include specific technical questions, behavioral questions, and success tips relevant to ${jobRole} role.`;
    
    try {
      const result = await chatSession.sendMessage(prompt);
      const responseText = result.response.text();
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedData = JSON.parse(jsonMatch[0]);
        const aiExperiences = Array.isArray(parsedData) ? parsedData : [parsedData];
        return [...defaultExperiences, ...aiExperiences].map(exp => ({
          ...exp,
          role: jobRole
        }));
      }
    } catch (error) {
      console.error("Failed to parse AI response:", error);
    }

    // Return default experiences if AI generation fails
    return defaultExperiences;
    
  } catch (error) {
    console.error("Error fetching interview experiences:", error);
    return baseInterviewData[jobRole] || [];
  }
}

function generateTechnicalQuestions(role: string, difficulty: string) {
  const questions = [
    {
      category: "Coding",
      question: `Implement a complex feature relevant to ${role}`,
      purpose: "Assess coding skills and problem-solving",
      exampleAnswer: "Discuss approach, optimization, and testing strategy"
    },
    {
      category: "System Design",
      question: `Design a scalable system for ${role}-related functionality`,
      purpose: "Evaluate system design knowledge",
      exampleAnswer: "Explain architecture, scalability considerations, and trade-offs"
    },
    {
      category: "Architecture",
      question: `Describe your approach to architecting ${role}-specific solutions`,
      purpose: "Assess architectural decision-making",
      exampleAnswer: "Compare different approaches and explain implementation details"
    },
    {
      category: "Domain Knowledge",
      question: `What are the latest trends and best practices in ${role}?`,
      purpose: "Evaluate industry awareness",
      exampleAnswer: "Discuss current technologies, methodologies, and their applications"
    }
  ];
  
  return questions;
}

function generateAlternativeExperience(
  role: string,
  difficulty: "Easy" | "Medium" | "Hard",
  outcome: "Accepted" | "Rejected" | "Pending",
  location: string
): InterviewExperience {
  return {
    role: role,
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    difficulty,
    outcome,
    location,
    experience: `${Math.floor(Math.random() * 5 + 2)}-${Math.floor(Math.random() * 5 + 5)} years`,
    rating: Math.floor(Math.random() * 2 + 3),
    interviewProcess: generateInterviewProcess(role, difficulty),
    technicalQuestions: generateTechnicalQuestions(role, difficulty),
    behavioralQuestions: generateBehavioralQuestions(),
    successTips: generateSuccessTips(role),
    companyInsights: generateCompanyInsights(role)
  };
}

function generateInterviewProcess(role: string, difficulty: string) {
  // Implementation of interview process generation
  return [
    {
      stage: "Initial Screening",
      description: `HR discussion focusing on ${role} background`,
      duration: "30 minutes",
      focus: ["Experience verification", "Role expectations", "Technical background"],
      tips: ["Prepare role-specific examples", "Research company thoroughly"]
    },
    {
      stage: "Technical Assessment",
      description: `In-depth ${role} skills evaluation`,
      duration: "2 hours",
      focus: ["Technical skills", "Problem-solving", "Code quality"],
      tips: ["Practice coding challenges", "Review fundamentals"]
    }
  ];
}

function generateBehavioralQuestions() {
  return [
    {
      category: "Problem Solving",
      question: "Describe a technical challenge you overcame",
      purpose: "Assess problem-solving approach",
      exampleResponse: "Use STAR method with technical details"
    },
    {
      category: "Teamwork",
      question: "How do you handle disagreements in your team?",
      purpose: "Evaluate collaboration skills",
      exampleResponse: "Discuss conflict resolution and team dynamics"
    }
  ];
}

function generateSuccessTips(role: string) {
  return [
    {
      category: "Technical Preparation",
      tips: [`Master ${role} fundamentals`, "Practice coding challenges"],
      examples: ["Build sample projects", "Contribute to open source"]
    },
    {
      category: "Interview Strategy",
      tips: ["Research company thoroughly", "Prepare relevant examples"],
      examples: ["Create project portfolio", "Practice mock interviews"]
    }
  ];
}

function generateCompanyInsights(role: string) {
  return {
    culture: ["Innovation-focused", "Learning-oriented", "Collaborative"],
    values: ["Technical excellence", "Customer focus", "Continuous improvement"],
    recentAchievements: ["Product launches", "Technical innovations", "Market growth"],
    techStack: ["Modern tools", "Latest frameworks", "Cloud technologies"],
    workStyle: ["Agile methodology", "Regular code reviews", "DevOps practices"]
  };
}

function determineCompanyTier(companyName: string): string {
  const lowerName = companyName.toLowerCase();
  
  const companies = {
    "FAANG": ["google", "amazon", "meta", "apple", "microsoft", "netflix"],
    "Unicorn": ["swiggy", "zomato", "byju", "razorpay", "zerodha", "phonepe", "ola", "paytm"],
    "Enterprise": ["ibm", "accenture", "tcs", "infosys", "wipro", "hcl", "cognizant"]
  };

  for (const [tier, companyList] of Object.entries(companies)) {
    if (companyList.some(company => lowerName.includes(company))) {
      return tier;
    }
  }
  
  return "Enterprise";
} 