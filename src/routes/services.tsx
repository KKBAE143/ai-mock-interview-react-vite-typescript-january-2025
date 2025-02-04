import { motion } from "framer-motion";
import { Container } from "@/components/container";
import { Headings } from "@/components/headings";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Code2, 
  Cpu, 
  FileVideo, 
  Gauge, 
  GitBranch, 
  GraduationCap, 
  LineChart, 
  MessageSquare, 
  Microscope, 
  Settings2, 
  Users 
} from "lucide-react";
import { Link } from "react-router-dom";
import React from "react";
import { Check } from "lucide-react";
import { Briefcase, Star, Volume2 } from "lucide-react";

const services = [
  {
    title: "AI Mock Interviews",
    description: "Experience realistic interview scenarios with our advanced AI interviewer",
    icon: <Brain className="w-16 h-16" />,
    features: [
      "Dynamic question generation",
      "Real-time emotion analysis",
      "Voice-enabled interactions",
      "Instant feedback system"
    ],
  },
  {
    title: "Performance Analytics",
    description: "Comprehensive analysis of your interview performance",
    icon: <LineChart className="w-16 h-16" />,
    features: [
      "Emotion tracking metrics",
      "Speech pace analysis",
      "Body language feedback",
      "Confidence scoring"
    ],
  },
  {
    title: "Interview Preparation",
    description: "Structured preparation tools to enhance your interview skills",
    icon: <GraduationCap className="w-16 h-16" />,
    features: [
      "Company-specific questions",
      "Industry-focused scenarios",
      "Practice mode available",
      "Customizable sessions"
    ],
  },
];

const features = [
  {
    icon: <Brain />,
    title: "AI-Powered Questions",
    description: "Dynamic question generation tailored to your experience and industry",
  },
  {
    icon: <MessageSquare />,
    title: "Voice Interaction",
    description: "Natural voice-based conversation with our AI interviewer",
  },
  {
    icon: <Gauge />,
    title: "Real-time Analysis",
    description: "Instant feedback on emotions, speech, and body language",
  },
  {
    icon: <FileVideo />,
    title: "Webcam Integration",
    description: "Visual analysis for better body language and expression feedback",
  },
  {
    icon: <LineChart />,
    title: "Performance Metrics",
    description: "Detailed analytics on confidence, professionalism, and communication",
  },
  {
    icon: <Briefcase />,
    title: "Company Simulation",
    description: "Practice interviews tailored to specific companies and roles",
  },
  {
    icon: <Volume2 />,
    title: "Speech Analysis",
    description: "Feedback on pace, volume, and clarity of speech",
  },
  {
    icon: <Star />,
    title: "Scoring System",
    description: "Comprehensive scoring based on multiple performance factors",
  },
];

const sectionClass = "py-24 relative overflow-hidden";
const gradientBgLight = "bg-gradient-to-b from-white to-gray-50";
const gradientBgDark = "bg-gradient-to-b from-gray-50 to-white";
const cardClass = "bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center text-center space-y-4 h-full";
const iconContainerClass = "w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300";

const Services = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className={`${sectionClass} ${gradientBgLight}`}>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 mb-6">
              Our Premium Interview Services
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Elevate your interview preparation with our cutting-edge AI-powered services
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Main Services Section */}
      <section className={`${sectionClass} ${gradientBgDark}`}>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Card className={cardClass}>
                  <div className={iconContainerClass}>
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
                    asChild
                  >
                    <Link to="/signup">Get Started</Link>
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Features Grid Section */}
      <section className={`${sectionClass} ${gradientBgLight}`}>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 mb-6">
              Advanced Features
            </h2>
            <p className="text-xl text-gray-600">
              Powered by cutting-edge AI technology to provide comprehensive interview preparation
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow h-full">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Services;