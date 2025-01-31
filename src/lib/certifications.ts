// Add type for provider names
type ProviderName = 
  // Learning Platforms
  "Coursera" | "Udemy" | "edX" | "Pluralsight" | "LinkedIn Learning" | 
  // Cloud Providers
  "AWS" | "Google" | "Microsoft" | "Oracle" | "IBM" | 
  // Professional Certifications
  "Cisco" | "CompTIA" | "PMI" | "Salesforce" | "SAP" | "ISACA" | "Red Hat" |
  // Coding Platforms
  "FreeCodeCamp" | "DataCamp" | "Codecademy" | "Cloud Academy" | "A Cloud Guru" |
  "Udacity" | "Treehouse" | "Egghead" | "Frontend Masters" | "LeetCode" | "HackerRank" |
  // Video Platforms
  "YouTube" | "PluralSight" | "LinkedIn Learning" | "O'Reilly";

interface Certification {
  title: string;
  provider: ProviderName;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  rating: number;
  enrolled: string;
  link: string;
  description: string;
  skills: string[];
  instructors?: string[];
  price?: string;
  badge?: string;
  featured?: boolean;
}

interface CertificationCategory {
  title: string;
  description: string;
  certifications: Certification[];
}

const CERTIFICATION_DATA: Record<string, CertificationCategory[]> = {
  "Software Engineer": [
    {
      title: "Core Development",
      description: "Essential certifications for software engineering fundamentals",
      certifications: [
        {
          title: "Meta Back-End Developer Professional Certificate",
          provider: "Coursera",
          level: "Intermediate",
          duration: "8 months",
          rating: 4.8,
          enrolled: "150K+",
          link: "https://www.coursera.org/professional-certificates/meta-back-end-developer",
          description: "Launch your career as a back-end developer. Build job-ready skills and gain credentials from Meta.",
          skills: ["Python", "Databases", "APIs", "Django", "Version Control"],
          instructors: ["Meta Staff"],
          price: "₹3,500/month",
          badge: "Meta Certificate",
          featured: true
        },
        {
          title: "AWS Certified Solutions Architect",
          provider: "AWS",
          level: "Advanced",
          duration: "6 months",
          rating: 4.9,
          enrolled: "500K+",
          link: "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
          description: "Learn to design distributed systems and architectures on AWS.",
          skills: ["AWS", "Cloud Architecture", "Security", "Networking"],
          price: "₹12,000",
          badge: "AWS Certified",
          featured: true
        },
        {
          title: "Frontend Masters Complete Path",
          provider: "Frontend Masters",
          level: "Intermediate",
          duration: "12 months",
          rating: 4.9,
          enrolled: "50K+",
          link: "https://frontendmasters.com/learn/",
          description: "Master modern frontend development from industry experts.",
          skills: ["JavaScript", "React", "TypeScript", "Node.js"],
          instructors: ["Kyle Simpson", "Kent C. Dodds"],
          price: "₹2,999/month",
          featured: true
        }
      ]
    },
    {
      title: "Cloud & DevOps",
      description: "Cloud computing and deployment certifications",
      certifications: [
        {
          title: "Google Cloud Architect",
          provider: "Google",
          level: "Advanced",
          duration: "4 months",
          rating: 4.7,
          enrolled: "100K+",
          link: "https://cloud.google.com/certification/cloud-architect",
          description: "Design, develop, and manage robust, secure, scalable cloud solutions.",
          skills: ["GCP", "Cloud Architecture", "Security", "Networking"],
          price: "₹15,000",
          badge: "Google Certified"
        },
        {
          title: "DevOps Engineering on AWS",
          provider: "A Cloud Guru",
          level: "Intermediate",
          duration: "40 hours",
          rating: 4.8,
          enrolled: "75K+",
          link: "https://acloudguru.com/course/aws-certified-devops-engineer-professional",
          description: "Master DevOps practices on AWS platform.",
          skills: ["AWS", "DevOps", "CI/CD", "Infrastructure as Code"],
          price: "₹1,999/month"
        }
      ]
    }
  ],
  "Frontend Developer": [
    {
      title: "UI Development",
      description: "Modern frontend development certifications",
      certifications: [
        {
          title: "Advanced React and Next.js",
          provider: "Udemy",
          level: "Advanced",
          duration: "35 hours",
          rating: 4.8,
          enrolled: "120K+",
          link: "https://www.udemy.com/course/nextjs-react-the-complete-guide/",
          description: "Master React 18, Next.js 13+, and build full-stack apps",
          skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
          instructors: ["Maximilian Schwarzmüller"],
          price: "₹3,499"
        },
        {
          title: "UI/UX Design Specialization",
          provider: "Coursera",
          level: "Intermediate",
          duration: "6 months",
          rating: 4.7,
          enrolled: "250K+",
          link: "https://www.coursera.org/specializations/ui-ux-design",
          description: "Design user-centric interfaces and experiences",
          skills: ["UI Design", "UX Research", "Figma", "Prototyping"],
          price: "₹2,999/month"
        }
      ]
    }
  ]
};

const getProviderLogo = (provider: ProviderName): string | null => {
  const logos: Record<ProviderName, string> = {
    // Learning Platforms
    "Coursera": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NCA0NCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTIyLjAyMiAwQzkuODY4IDAgMCA5Ljg2NyAwIDIyLjAyMiAwIDM0LjE3NiA5Ljg2NyA0NCAyMi4wMjIgNDRjMTIuMTU0IDAgMjIuMDIyLTkuODI0IDIyLjAyMi0yMS45NzhDNDQuMDQ0IDkuODY3IDM0LjE3NiAwIDIyLjAyMiAwem0wIDQxLjcwM2MtMTAuOTM0IDAtMTkuODItOC44ODYtMTkuODItMTkuODJzOC44ODYtMTkuODIgMTkuODItMTkuODIgMTkuODIgOC44ODYgMTkuODIgMTkuODItOC44ODYgMTkuODItMTkuODIgMTkuODJ6Ii8+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTIyLjAyMiAxMC4xNzRjLTYuNTM5IDAtMTEuODQ4IDUuMzEtMTEuODQ4IDExLjg0OCAwIDYuNTM5IDUuMzEgMTEuODQ4IDExLjg0OCAxMS44NDggNi41MzkgMCAxMS44NDgtNS4zMSAxMS44NDgtMTEuODQ4IDAtNi41MzktNS4zMS0xMS44NDgtMTEuODQ4LTExLjg0OHptMCAyMS4zNzNjLTUuMjY3IDAtOS41MjUtNC4yNTgtOS41MjUtOS41MjVzNC4yNTgtOS41MjUgOS41MjUtOS41MjUgOS41MjUgNC4yNTggOS41MjUgOS41MjUtNC4yNTggOS41MjUtOS41MjUgOS41MjV6Ii8+PC9zdmc+",
    "Udemy": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NCA0NCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTIyIDJDMTEgMiAyIDExIDIgMjJzOSAyMCAyMCAyMCAyMC05IDIwLTIwUzMzIDIgMjIgMnptMCAzNmMtOC44IDAtMTYtNy4yLTE2LTE2UzEzLjIgNiAyMiA2czE2IDcuMiAxNiAxNi03LjIgMTYtMTYgMTZ6Ii8+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTIwLjIgMTQuMXY1LjVsOC44IDUuMXYtNS41bC04LjgtNS4xeiIvPjwvc3ZnPg==",
    "edX": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NCA0NCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTM4LjQgMjJjMCA5LjEtNy4zIDE2LjQtMTYuNCAxNi40UzUuNiAzMS4xIDUuNiAyMiAxMyA1LjYgMjIgNS42czE2LjQgNy4zIDE2LjQgMTYuNHptLTI0LjcgMGw1LjUtNS41LTUuNS01LjUgMi43LTIuNyA1LjUgNS41IDUuNS01LjUgMi43IDIuNy01LjUgNS41IDUuNSA1LjUtMi43IDIuNy01LjUtNS41LTUuNSA1LjUtMi43LTIuN3oiLz48L3N2Zz4=",
    "Pluralsight": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NCA0NCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTIyIDJDMTEgMiAyIDExIDIgMjJzOSAyMCAyMCAyMCAyMC05IDIwLTIwUzMzIDIgMjIgMnptMTAuOSAyMi45TDIyIDMyLjhsLTEwLjktNy45di03LjhMMjIgOS4yIDMyLjkgMTd2Ny45eiIvPjwvc3ZnPg==",
    "LinkedIn Learning": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NCA0NCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTIyIDJDMTEgMiAyIDExIDIgMjJzOSAyMCAyMCAyMCAyMC05IDIwLTIwUzMzIDIgMjIgMnptLTYuOSAzMS4yaC00LjJ2LTEzaDQuMnYxM3ptLTIuMS0xNC44Yy0xLjQgMC0yLjUtMS4xLTIuNS0yLjRzMS4xLTIuNCAyLjUtMi40IDIuNSAxLjEgMi41IDIuNC0xLjEgMi40LTIuNSAyLjR6bTE3LjQgMTQuOGgtNC4ydi02LjNjMC0xLjYgMC0zLjYtMi4yLTMuNnMtMi41IDEuNy0yLjUgMy41djYuNGgtNC4ydi0xM2g0djEuOGMuNi0xLjEgMi0yLjIgNC4xLTIuMiA0LjQgMCA1LjIgMi45IDUuMiA2LjZ2Ni44eiIvPjwvc3ZnPg==",
    
    // Cloud Providers
    "AWS": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NCA0NCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTIyIDJDMTEgMiAyIDExIDIgMjJzOSAyMCAyMCAyMCAyMC05IDIwLTIwUzMzIDIgMjIgMnptMTAuOSAyOC45aC0yMS44di0xNy44aDIxLjh2MTcuOHptLTE4LjctMTQuN3Y1LjZsNC43IDIuN3YtNS42bC00LjctMi43em0xMS42IDB2NS42bDQuNyAyLjd2LTUuNmwtNC43LTIuN3oiLz48L3N2Zz4=",
    "Google": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NCA0NCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTIyIDJDMTEgMiAyIDExIDIgMjJzOSAyMCAyMCAyMCAyMC05IDIwLTIwUzMzIDIgMjIgMnptMCAzMmMtNi42IDAtMTItNS40LTEyLTEyczUuNC0xMiAxMi0xMmMzLjIgMCA1LjkgMS4yIDggMy4xbC0zLjIgMy4xYy0xLjMtMS4yLTMtMS45LTQuOC0xLjktNC40IDAtOCAzLjYtOCA4czMuNiA4IDggOGMzLjggMCA2LjctMi4yIDcuMy01LjJoLTcuM3YtNC4xaDE0LjF2Mi45YzAgOC42LTYuMiAxMi4xLTE0LjEgMTIuMXoiLz48L3N2Zz4=",
    "Microsoft": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NCA0NCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTIxIDIxSDJWMmgxOXYxOXptMCAyMUgyVjIzaDE5djE5em0yMS0yMUgyM1YyaDE5djE5em0wIDIxSDIzVjIzaDE5djE5eiIvPjwvc3ZnPg==",
    "Oracle": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NCA0NCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTIyIDJDMTEgMiAyIDExIDIgMjJzOSAyMCAyMCAyMCAyMC05IDIwLTIwUzMzIDIgMjIgMnptMCAzNmMtOC44IDAtMTYtNy4yLTE2LTE2UzEzLjIgNiAyMiA2czE2IDcuMiAxNiAxNi03LjIgMTYtMTYgMTZ6Ii8+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTIyIDEyYy01LjUgMC0xMCA0LjUtMTAgMTBzNC41IDEwIDEwIDEwIDEwLTQuNSAxMC0xMC00LjUtMTAtMTAtMTB6Ii8+PC9zdmc+",
    "IBM": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NCA0NCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTQgMTBoMzZ2NGgtMzZ6TTQgMjBoMzZ2NGgtMzZ6TTQgMzBoMzZ2NGgtMzZ6Ii8+PC9zdmc+",
    
    // Professional Certifications
    "Cisco": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NCA0NCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTIyIDJDMTEgMiAyIDExIDIgMjJzOSAyMCAyMCAyMCAyMC05IDIwLTIwUzMzIDIgMjIgMnptMCAzMmMtNi42IDAtMTItNS40LTEyLTEyczUuNC0xMiAxMi0xMiAxMiA1LjQgMTIgMTItNS40IDEyLTEyIDEyeiIvPjwvc3ZnPg==",
    "CompTIA": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NCA0NCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTIyIDJDMTEgMiAyIDExIDIgMjJzOSAyMCAyMCAyMCAyMC05IDIwLTIwUzMzIDIgMjIgMnptMCAzNmMtOC44IDAtMTYtNy4yLTE2LTE2UzEzLjIgNiAyMiA2czE2IDcuMiAxNiAxNi03LjIgMTYtMTYgMTZ6Ii8+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTIyIDEyYy01LjUgMC0xMCA0LjUtMTAgMTBzNC41IDEwIDEwIDEwIDEwLTQuNSAxMC0xMC00LjUtMTAtMTAtMTB6Ii8+PC9zdmc+",
    
    // Coding Platforms
    "FreeCodeCamp": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NCA0NCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTIyIDJDMTEgMiAyIDExIDIgMjJzOSAyMCAyMCAyMCAyMC05IDIwLTIwUzMzIDIgMjIgMnptLTUuOCAyOS4zYy0uOC0uOS0xLjUtMS45LTIuMS0zLS42LTEuMS0uOS0yLjItLjktMy40IDAtMS4yLjMtMi40LjktMy40LjYtMS4xIDEuMy0yLjEgMi4xLTMgLjItLjIuNC0uMy43LS4zLjMgMCAuNS4xLjcuMy4yLjIuMy40LjMuNyAwIC4zLS4xLjUtLjMuNy0uNy44LTEuMyAxLjYtMS43IDIuNS0uNS45LS43IDEuOC0uNyAyLjggMCAxIC4yIDEuOS43IDIuOC40LjkgMSAxLjcgMS43IDIuNS4yLjIuMy40LjMuNyAwIC4zLS4xLjUtLjMuNy0uMi4yLS40LjMtLjcuMy0uMyAwLS41LS4xLS43LS4zem0xNy42IDBjLS44LjktMS41IDEuOS0yLjEgMy0uNiAxLjEtLjkgMi4yLS45IDMuNCAwIDEuMi4zIDIuNC45IDMuNC42IDEuMSAxLjMgMi4xIDIuMSAzIC4yLjIuNC4zLjcuMy4zIDAgLjUtLjEuNy0uMy4yLS4yLjMtLjQuMy0uNyAwLS4zLS4xLS41LS4zLS43LS43LS44LTEuMy0xLjYtMS43LTIuNS0uNS0uOS0uNy0xLjgtLjctMi44IDAtMS0uMi0xLjktLjctMi44LS40LS45LTEtMS43LTEuNy0yLjUtLjItLjItLjMtLjQtLjMtLjcgMC0uMy4xLS41LjMtLjcuMi0uMi40LS4zLjctLjMuMyAwIC41LjEuNy4zeiIvPjwvc3ZnPg==",
    "DataCamp": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NCA0NCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTIyIDJDMTEgMiAyIDExIDIgMjJzOSAyMCAyMCAyMCAyMC05IDIwLTIwUzMzIDIgMjIgMnptMCAzNmMtOC44IDAtMTYtNy4yLTE2LTE2UzEzLjIgNiAyMiA2czE2IDcuMiAxNiAxNi03LjIgMTYtMTYgMTZ6Ii8+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTMwIDIyTDIyIDE0bC04IDh2OGw4LTggOCA4eiIvPjwvc3ZnPg==",
    "Codecademy": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NCA0NCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTIyIDJDMTEgMiAyIDExIDIgMjJzOSAyMCAyMCAyMCAyMC05IDIwLTIwUzMzIDIgMjIgMnptMCAzNmMtOC44IDAtMTYtNy4yLTE2LTE2UzEzLjIgNiAyMiA2czE2IDcuMiAxNiAxNi03LjIgMTYtMTYgMTZ6Ii8+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTI4IDE2aC0xMnY0aDh2NGgtOHY0aDEyeiIvPjwvc3ZnPg==",
    "A Cloud Guru": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NCA0NCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTIyIDJDMTEgMiAyIDExIDIgMjJzOSAyMCAyMCAyMCAyMC05IDIwLTIwUzMzIDIgMjIgMnptMCAzNmMtOC44IDAtMTYtNy4yLTE2LTE2UzEzLjIgNiAyMiA2czE2IDcuMiAxNiAxNi03LjIgMTYtMTYgMTZ6Ii8+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTIyIDEyYy01LjUgMC0xMCA0LjUtMTAgMTBzNC41IDEwIDEwIDEwIDEwLTQuNSAxMC0xMC00LjUtMTAtMTAtMTB6bTAgMTZjLTMuMyAwLTYtMi43LTYtNnMyLjctNiA2LTYgNiAyLjcgNiA2LTIuNyA2LTYgNnoiLz48L3N2Zz4=",
    "Frontend Masters": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NCA0NCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTIyIDJDMTEgMiAyIDExIDIgMjJzOSAyMCAyMCAyMCAyMC05IDIwLTIwUzMzIDIgMjIgMnptMCAzNmMtOC44IDAtMTYtNy4yLTE2LTE2UzEzLjIgNiAyMiA2czE2IDcuMiAxNiAxNi03LjIgMTYtMTYgMTZ6Ii8+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTI4IDE2aC04djRoNnY0aC02djRoOHoiLz48L3N2Zz4=",
    "LeetCode": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NCA0NCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTIyIDJDMTEgMiAyIDExIDIgMjJzOSAyMCAyMCAyMCAyMC05IDIwLTIwUzMzIDIgMjIgMnptMCAzNmMtOC44IDAtMTYtNy4yLTE2LTE2UzEzLjIgNiAyMiA2czE2IDcuMiAxNiAxNi03LjIgMTYtMTYgMTZ6Ii8+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTI4IDE2aC04djRoNnY0aC02djRoOHoiLz48L3N2Zz4=",
    "HackerRank": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NCA0NCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTIyIDJDMTEgMiAyIDExIDIgMjJzOSAyMCAyMCAyMCAyMC05IDIwLTIwUzMzIDIgMjIgMnptMCAzNmMtOC44IDAtMTYtNy4yLTE2LTE2UzEzLjIgNiAyMiA2czE2IDcuMiAxNiAxNi03LjIgMTYtMTYgMTZ6Ii8+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTIyIDEyYy01LjUgMC0xMCA0LjUtMTAgMTBzNC41IDEwIDEwIDEwIDEwLTQuNSAxMC0xMC00LjUtMTAtMTAtMTB6bTAgMTZjLTMuMyAwLTYtMi43LTYtNnMyLjctNiA2LTYgNiAyLjcgNiA2LTIuNyA2LTYgNnoiLz48L3N2Zz4="
  };
  
  return logos[provider] || null;
};

// Update the provider colors to match the new branding
const getProviderColor = (provider: ProviderName): string => {
  const colors: Record<ProviderName, string> = {
    // Learning Platforms
    "Coursera": "#0056D2",
    "Udemy": "#A435F0",
    "edX": "#02262B",
    "Pluralsight": "#F15B2A",
    "LinkedIn Learning": "#0A66C2",
    
    // Cloud Providers
    "AWS": "#232F3E", // Updated to AWS brand color
    "Google": "#4285F4",
    "Microsoft": "#00A4EF",
    "Oracle": "#C74634",
    "IBM": "#052FAD",
    
    // Professional Certifications
    "Cisco": "#049FD9", // Updated Cisco blue
    "CompTIA": "#FF0000",
    "PMI": "#1C1F2A",
    "Salesforce": "#00A1E0",
    "SAP": "#0FAAFF",
    "ISACA": "#0077B5",
    "Red Hat": "#EE0000",
    
    // Coding Platforms
    "FreeCodeCamp": "#0A0A23",
    "DataCamp": "#03EF62",
    "Codecademy": "#1F4056",
    "Cloud Academy": "#08B5E5",
    "A Cloud Guru": "#F0543C",
    "Udacity": "#02B3E4",
    "Treehouse": "#5FCF80",
    "Egghead": "#FCFBFA",
    "Frontend Masters": "#000000", // Updated to black for better contrast
    "LeetCode": "#FFA116",
    "HackerRank": "#00EA64",
    
    // Video Platforms
    "YouTube": "#FF0000",
    "O'Reilly": "#D3002D"
  };
  
  return colors[provider] || "#6B7280";
};

export { getProviderLogo, getProviderColor };

export async function fetchCertifications(role: string): Promise<CertificationCategory[]> {
  try {
    // Return role-specific certifications or default to Software Engineer
    return CERTIFICATION_DATA[role] || CERTIFICATION_DATA["Software Engineer"];
  } catch (error) {
    console.error('Error fetching certifications:', error);
    return [];
  }
} 