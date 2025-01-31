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

const services = [
  {
    title: "AI Mock Interviews",
    description: "Practice with our advanced AI interviewer that adapts to your responses in real-time",
    icon: <Brain className="w-16 h-16" />,
    features: [
      "Dynamic question adaptation",
      "Emotion & sentiment analysis",
      "Voice tone feedback",
      "Body language insights"
    ],
  },
  {
    title: "Technical Assessments",
    description: "Smart technical evaluation powered by AI code analysis",
    icon: <Code2 className="w-16 h-16" />,
    features: [
      "Real-time code analysis",
      "Architecture feedback",
      "Performance optimization tips",
      "Security vulnerability checks"
    ],
  },
  {
    title: "Behavioral Interviews",
    description: "Master behavioral interviews with advanced AI coaching",
    icon: <Users className="w-16 h-16" />,
    features: [
      "Response structure analysis",
      "Cultural fit assessment",
      "Leadership potential scoring",
      "Communication style insights"
    ],
  },
];

const features = [
  {
    icon: <Brain />,
    title: "Adaptive Learning System",
    description: "AI that learns from your responses and adjusts difficulty in real-time",
  },
  {
    icon: <FileVideo />,
    title: "Video Analysis",
    description: "Advanced facial expression and body language analysis during interviews",
  },
  {
    icon: <LineChart />,
    title: "Predictive Analytics",
    description: "AI-powered insights into your interview performance trends and improvement areas",
  },
  {
    icon: <MessageSquare />,
    title: "Natural Language Processing",
    description: "Deep analysis of response clarity, relevance, and professional tone",
  },
  {
    icon: <GraduationCap />,
    title: "Personalized Learning Path",
    description: "AI-generated custom learning plans based on your performance patterns",
  },
  {
    icon: <Cpu />,
    title: "Multi-Modal Analysis",
    description: "Combined analysis of voice, video, and text responses for comprehensive feedback",
  },
  {
    icon: <GitBranch />,
    title: "Industry Adaptation",
    description: "Interview scenarios tailored to specific industries and roles",
  },
  {
    icon: <Settings2 />,
    title: "Skill Gap Analysis",
    description: "AI-powered identification of skills to develop for target positions",
  },
  {
    icon: <Gauge />,
    title: "Real-time Coaching",
    description: "Live AI suggestions for improving responses during practice sessions",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export const Services = () => {
  return (
    <Container>
      <div className="py-12 space-y-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <Headings
            title="Our Services"
            description="Next-generation interview preparation powered by advanced AI"
          />
        </motion.div>

        {/* Main Services */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <motion.div key={service.title} variants={item}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex flex-col items-center text-center flex-grow space-y-4">
                    <div className="text-primary p-4">{service.icon}</div>
                    <h3 className="text-2xl font-semibold">{service.title}</h3>
                    <p className="text-muted-foreground">{service.description}</p>
                    <ul className="space-y-3 w-full">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center text-sm">
                          <Settings2 className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-6 pt-6 border-t">
                    <Button asChild variant="default" className="w-full" size="lg">
                      <Link to="/generate">Try Now</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <section className="py-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Advanced AI Features</h2>
            <p className="text-muted-foreground">
              Cutting-edge technology to transform your interview preparation
            </p>
          </motion.div>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid md:grid-cols-3 gap-8"
          >
            {features.map((feature) => (
              <motion.div key={feature.title} variants={item}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="text-primary mb-4">
                      {React.cloneElement(feature.icon, { className: "w-8 h-8 mx-auto" })}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center py-12 bg-primary/5 rounded-2xl"
        >
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-bold">Experience the Future of Interviews</h2>
            <p className="text-muted-foreground mb-6">
              Start your journey with AI-powered interview preparation today
            </p>
            <Button asChild size="lg" className="px-8">
              <Link to="/generate">Begin Your Preparation</Link>
            </Button>
          </div>
        </motion.section>
      </div>
    </Container>
  );
};

export default Services; 