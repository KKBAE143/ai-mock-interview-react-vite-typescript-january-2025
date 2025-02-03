import { Sparkles, ArrowRight, Users, Target, BookOpen, Quote, Building2, TrendingUp, Check, Zap, Clock, Mic, MessageSquare, Star, Shield, Rocket, Brain, XCircle, CheckCircle2 } from "lucide-react";
import Marquee from "react-fast-marquee";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { MarqueImg } from "@/components/marquee-img";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PreviewCard } from "@/components/mock-interview/preview-card";

interface StatisticProps {
  value: string;
  label: string;
}

const Statistic = ({ value, label }: StatisticProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="relative group"
  >
    <div className="flex flex-col items-center space-y-3 p-6 bg-white/80 backdrop-blur-sm rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
        <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
          {value}
        </span>
      </div>
      <span className="text-lg font-medium text-gray-800 text-center">{label}</span>
    </div>
  </motion.div>
);

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard = ({ title, description, icon }: FeatureCardProps) => (
  <Card className="p-6 hover:shadow-lg transition-shadow">
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="p-3 bg-primary/10 rounded-full">{icon}</div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </Card>
);

const ProcessStep = ({ number, title, description }: { number: number; title: string; description: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="relative flex flex-col items-center text-center"
  >
    <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mb-4">
      {number}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </motion.div>
);

const Testimonial = ({ quote, author, role }: { quote: string; author: string; role: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="bg-white p-6 rounded-xl shadow-md"
  >
    <Quote className="w-8 h-8 text-primary/40 mb-4" />
    <p className="text-lg text-muted-foreground mb-4">{quote}</p>
    <div>
      <p className="font-semibold">{author}</p>
      <p className="text-sm text-muted-foreground">{role}</p>
    </div>
  </motion.div>
);

// Consistent section spacing and background classes
const sectionClass = "py-24 relative overflow-hidden";
const gradientBgLight = "bg-gradient-to-b from-white to-gray-50";
const gradientBgDark = "bg-gradient-to-b from-gray-50 to-white";

// Consistent heading component
const SectionHeading = ({ badge, title, description }: { badge: string; title: string; description: string }) => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    className="text-center mb-16"
  >
    <Badge className="px-6 py-2.5 text-sm bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 hover:from-purple-200 hover:to-purple-300 transition-all duration-300 shadow-sm mb-4">
      {badge}
    </Badge>
    <h2 className="text-3xl md:text-4xl font-bold mb-4">
      {title}
    </h2>
    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
      {description}
    </p>
  </motion.div>
);

// Consistent background decoration component
const BackgroundDecoration = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-purple-200/30 to-transparent rounded-full filter blur-3xl animate-pulse" />
    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-t from-blue-200/30 to-transparent rounded-full filter blur-3xl animate-pulse" />
  </div>
);

// Consistent card styles
const cardClass = "bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center text-center space-y-4 h-full";
const iconContainerClass = "w-16 h-16 bg-gradient-to-br rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300";

const HomePage = () => {
  return (
    <div className="flex-col w-full">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-purple-50 via-white to-blue-50">
        <Container>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="my-16 md:my-28 relative z-10 flex flex-col md:flex-row items-center gap-16"
          >
            {/* Left Content */}
            <div className="flex-1 space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Badge className="mb-4 px-6 py-2.5 text-sm bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 hover:from-purple-200 hover:to-purple-300 transition-all duration-300 shadow-sm">
                  ✨ Next-Gen Interview Platform
                </Badge>
              </motion.div>
              
              <motion.h1 
                className="text-5xl md:text-7xl font-extrabold leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-primary to-indigo-600 animate-gradient">
                  Master Your
                </span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-primary to-purple-600 animate-gradient">
                  Dream Career
                </span>
              </motion.h1>

              <motion.p 
                className="text-xl md:text-2xl text-gray-600 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Ace your interviews with AI-powered excellence and real-time feedback
              </motion.p>

              <div className="mt-12 space-y-4">
                <motion.div 
                  className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="p-2.5 bg-gradient-to-br from-red-100 to-red-200 rounded-lg">
                    <Target className="w-6 h-6 text-red-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Smart feedback on your responses</span>
                </motion.div>
                
                <motion.div 
                  className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="p-2.5 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Company-specific strategies</span>
                </motion.div>
                
                <motion.div 
                  className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="p-2.5 bg-gradient-to-br from-green-100 to-green-200 rounded-lg">
                    <Brain className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-gray-700 font-medium">AI-powered interview simulations</span>
                </motion.div>
                
                <motion.div 
                  className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="p-2.5 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg">
                    <Rocket className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Personalized improvement path</span>
                </motion.div>
              </div>

              <div className="mt-12 flex flex-wrap gap-4">
                <Link to="/generate">
                  <Button size="lg" className="group bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-6 rounded-xl transform hover:scale-105">
                    Start Free Practice
                    <Sparkles className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                  </Button>
                </Link>
                <Link to="/about-us">
                  <Button size="lg" variant="outline" className="group bg-white/90 hover:bg-white border-2 hover:border-purple-300 px-8 py-6 rounded-xl transform hover:scale-105 transition-all duration-300">
                    Watch Demo
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>

              <div className="mt-12 flex flex-wrap items-center gap-4">
                <motion.div 
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  <Shield className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">No Credit Card Required</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700">Instant Access</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  <Star className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">24/7 AI Support</span>
                </motion.div>
              </div>
            </div>

            {/* Right Content - Preview Card */}
            <motion.div 
              className="flex-1 w-full md:w-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <PreviewCard 
                onSubmitAnswer={async (answer) => {
                  try {
                    const response = await fetch("/api/mock-interview/feedback", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ answer }),
                    });
                    const data = await response.json();
                    // Handle the feedback response
                    // You can use a modal or a toast to show the feedback
                  } catch (error) {
                    console.error("Failed to get feedback:", error);
                    throw error;
                  }
                }}
              />
            </motion.div>
          </motion.div>
        </Container>

        {/* Enhanced Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-purple-200/40 to-transparent rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-t from-blue-200/40 to-transparent rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-100/20 via-transparent to-blue-100/20 rounded-full filter blur-3xl animate-pulse" />
        </div>
      </div>

      {/* Statistics Section */}
      <section className={`${sectionClass} ${gradientBgLight}`}>
        <Container>
          <SectionHeading
            badge="📊 Platform Stats"
            title="Empowering Your Interview Success"
            description="Join our growing community of successful candidates"
          />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <Statistic value="50+" label="Practice Sessions" />
            <Statistic value="100+" label="Questions Answered" />
            <Statistic value="95%" label="User Satisfaction" />
            <Statistic value="24/7" label="AI Support" />
          </div>
        </Container>
        <BackgroundDecoration />
      </section>

      {/* Hero Image Section */}
      <section className="relative py-16 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
        <Container className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800"
          >
            <div className="relative">
              {/* Background Image with Overlay */}
              <div className="absolute inset-0">
                <img
                  src="/assets/img/hero.jpg"
                  alt="AI Interview Platform"
                  className="w-full h-full object-cover opacity-40"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/95 to-transparent" />
              </div>

              {/* Content Grid */}
              <div className="relative grid lg:grid-cols-2 gap-8 p-8 md:p-12">
                {/* Left Content */}
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <Badge className="inline-flex items-center gap-2 px-4 py-1.5 text-sm bg-white/10 backdrop-blur-sm text-white border-white/20">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      Pinnacle
                    </Badge>
                  </motion.div>

                  <motion.h2 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl md:text-4xl font-bold text-white"
                  >
                    Practice With Confidence
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="text-lg text-gray-300"
                  >
                    Get real-time feedback and personalized coaching from our advanced AI system.
                    Perfect your responses and boost your confidence.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap gap-4"
                  >
                    <Button 
                      size="lg"
                      className="group bg-white text-gray-900 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-xl"
                    >
                      Start Practicing Now
                      <Sparkles className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                    </Button>
                  </motion.div>

                  {/* Feature List */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="space-y-3 mt-8"
                  >
                    {[
                      { icon: <Target className="w-4 h-4" />, text: "Smart feedback on responses" },
                      { icon: <Brain className="w-4 h-4" />, text: "AI-powered interview simulations" },
                      { icon: <Building2 className="w-4 h-4" />, text: "Company-specific strategies" }
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 text-gray-300">
                        <div className="p-1.5 rounded-full bg-white/10">
                          {feature.icon}
                        </div>
                        <span className="text-sm">{feature.text}</span>
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Right Content - Feature Cards */}
                <div className="relative">
                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 }}
                      className="p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/[0.15] transition-colors duration-300"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-2 rounded-lg bg-purple-500/20">
                          <Brain className="w-5 h-5 text-purple-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">AI-Powered Practice</h3>
                      </div>
                      <p className="text-gray-300 text-sm">
                        Practice with our AI interviewer and get instant, personalized feedback on your responses.
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 }}
                      className="p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/[0.15] transition-colors duration-300"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-2 rounded-lg bg-blue-500/20">
                          <Building2 className="w-5 h-5 text-blue-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Company Research</h3>
                      </div>
                      <p className="text-gray-300 text-sm">
                        Get detailed insights into company culture, values, and interview processes.
                      </p>
                    </motion.div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute -top-8 -right-8 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />
                  <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />
                </div>
              </div>
            </div>
          </motion.div>
        </Container>

        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl" />
        </div>
      </section>

      {/* Process Section */}
      <section className={`${sectionClass} ${gradientBgDark}`}>
        <Container>
          <SectionHeading
            badge="🎯 Simple Process"
            title="Your Journey to Interview Success"
            description="Follow our proven process to transform your interview skills and boost your confidence"
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-purple-200 via-primary to-indigo-200 -z-10 hidden md:block transform -translate-y-1/2 opacity-50" />
            
            {/* Process Steps */}
            {[
              {
                number: "1",
                title: "Research Company",
                description: "Enter company details and role to get tailored interview preparation insights",
                bgColor: "bg-purple-500",
                dotColor: "bg-purple-400"
              },
              {
                number: "2",
                title: "Get Insights",
                description: "Receive AI-generated interview questions and company-specific preparation tips",
                bgColor: "bg-blue-500",
                dotColor: "bg-blue-400"
              },
              {
                number: "3",
                title: "Practice & Learn",
                description: "Practice with AI-generated mock interviews and get real-time feedback",
                bgColor: "bg-green-500",
                dotColor: "bg-green-400"
              },
              {
                number: "4",
                title: "Master Interview",
                description: "Build confidence with personalized improvement suggestions and practice projects",
                bgColor: "bg-orange-500",
                dotColor: "bg-orange-400"
              }
            ].map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group h-full"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center text-center space-y-4 h-full relative">
                  {/* Number Badge */}
                  <div className={`absolute -top-3 -left-3 w-10 h-10 rounded-lg ${step.bgColor} flex items-center justify-center text-white font-bold text-lg shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    {step.number}
                  </div>

                  {/* Content */}
                  <div className="mt-4">
                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>

                  {/* Connection Dot */}
                  {index < 3 && (
                    <motion.div 
                      className={`absolute -right-2 top-1/2 w-4 h-4 ${step.dotColor} rounded-full hidden md:block transform -translate-y-1/2`}
                      whileHover={{ scale: 1.2 }}
                      animate={{
                        scale: [1, 1.1, 1],
                        transition: { duration: 2, repeat: Infinity }
                      }}
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex justify-center mt-16"
          >
            <Link to="/generate">
              <Button size="lg" className="group bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-6 rounded-xl">
                Start Your Journey
                <Sparkles className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </Container>
        <BackgroundDecoration />
      </section>

      {/* Partners Section */}
      <div className="py-12 mt-24">
        <Container>
          <h2 className="text-center text-2xl font-semibold mb-8">Trusted by Leading Companies</h2>
          <Marquee 
            pauseOnHover 
            speed={40} 
            className="py-4"
          >
            <MarqueImg img="/assets/img/logo/firebase.png" />
            <MarqueImg img="/assets/img/logo/meet.png" />
            <MarqueImg img="/assets/img/logo/zoom.png" />
            <MarqueImg img="/assets/img/logo/firebase.png" />
            <MarqueImg img="/assets/img/logo/microsoft.png" />
            <MarqueImg img="/assets/img/logo/meet.png" />
            <MarqueImg img="/assets/img/logo/tailwindcss.png" />
            <MarqueImg img="/assets/img/logo/microsoft.png" />
          </Marquee>
        </Container>
      </div>

      {/* Features Section */}
      <section className={`${sectionClass} ${gradientBgLight}`}>
        <Container>
          <SectionHeading
            badge="✨ Powerful Features"
            title="Everything You Need to Succeed"
            description="Our platform provides all the tools and features you need to master your interview skills"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="w-7 h-7 text-purple-600" />,
                title: "AI Interview Simulation",
                description: "Practice with our advanced AI interviewer that adapts to your responses and provides real-time feedback for continuous improvement.",
                color: "purple"
              },
              {
                icon: <Building2 className="w-7 h-7 text-blue-600" />,
                title: "Company Research",
                description: "Get detailed insights into company culture, interview processes, and common questions asked by top companies.",
                color: "blue"
              },
              {
                icon: <Target className="w-7 h-7 text-green-600" />,
                title: "Personalized Feedback",
                description: "Receive detailed feedback on your responses, including suggestions for improvement and industry-specific tips.",
                color: "green"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className={`${cardClass} h-full`}>
                  <div className={`${iconContainerClass} from-${feature.color}-100 to-${feature.color}-200`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
        <BackgroundDecoration />
      </section>

      {/* Testimonials Section */}
      <section className={`${sectionClass} ${gradientBgDark}`}>
        <Container>
          <SectionHeading
            badge="💬 Success Stories"
            title="What Our Users Say"
            description="Join thousands of successful candidates who transformed their interview skills"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                initial: "S",
                name: "Sarah Chen",
                role: "Software Engineer at Google",
                quote: "This platform transformed my interview preparation. The AI feedback was incredibly helpful, and I felt much more confident during my actual interviews.",
                color: "purple"
              },
              {
                initial: "M",
                name: "Michael Park",
                role: "Product Manager at Meta",
                quote: "The company research feature gave me valuable insights that helped me stand out during interviews. Highly recommended!",
                color: "blue"
              },
              {
                initial: "A",
                name: "Alex Rodriguez",
                role: "Data Scientist at Amazon",
                quote: "The personalized feedback helped me identify and improve my weak points. I landed my dream job after just two weeks of practice!",
                color: "green"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className={cardClass}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 bg-gradient-to-br from-${testimonial.color}-100 to-${testimonial.color}-200 rounded-full flex items-center justify-center`}>
                      <span className={`text-xl font-bold text-${testimonial.color}-600`}>{testimonial.initial}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <Quote className={`w-8 h-8 text-${testimonial.color}-200 mb-4`} />
                  <p className="text-gray-600 leading-relaxed">{testimonial.quote}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
        <BackgroundDecoration />
      </section>

      {/* Problem vs Solution Section */}
      <section className={`${sectionClass} ${gradientBgLight}`}>
        <Container>
          <SectionHeading
            badge="💡 Why Pinnacle?"
            title="Traditional Methods vs. Pinnacle"
            description="See how we're revolutionizing interview preparation"
          />

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Problems Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 rounded-full">
                <XCircle className="w-5 h-5 text-red-600" />
                <span className="font-semibold text-red-900">Traditional Methods</span>
              </div>

              <div className="space-y-4">
                {[
                  {
                    icon: <Clock className="w-5 h-5 text-red-500" />,
                    title: "Time-Consuming Research",
                    description: "Hours spent searching through scattered resources and outdated information"
                  },
                  {
                    icon: <Users className="w-5 h-5 text-red-500" />,
                    title: "Limited Practice Partners",
                    description: "Difficulty finding qualified partners for mock interviews"
                  },
                  {
                    icon: <MessageSquare className="w-5 h-5 text-red-500" />,
                    title: "Generic Feedback",
                    description: "Non-specific feedback that doesn't address your unique needs"
                  },
                  {
                    icon: <Building2 className="w-5 h-5 text-red-500" />,
                    title: "Outdated Company Info",
                    description: "Relying on outdated or inaccurate company information"
                  }
                ].map((problem, index) => (
                  <motion.div
                    key={problem.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 p-4 bg-red-50/50 rounded-xl border border-red-100"
                  >
                    <div className="p-2 bg-red-100 rounded-lg h-fit">
                      {problem.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {problem.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {problem.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Solutions Column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-900">Pinnacle Solution</span>
              </div>

              <div className="space-y-4">
                {[
                  {
                    icon: <Zap className="w-5 h-5 text-green-500" />,
                    title: "AI-Powered Efficiency",
                    description: "Get instant access to curated, relevant interview materials and practice questions"
                  },
                  {
                    icon: <Brain className="w-5 h-5 text-green-500" />,
                    title: "24/7 AI Interview Partner",
                    description: "Practice anytime with our advanced AI that adapts to your skill level"
                  },
                  {
                    icon: <Target className="w-5 h-5 text-green-500" />,
                    title: "Personalized Feedback",
                    description: "Receive detailed, actionable feedback tailored to your responses and goals"
                  },
                  {
                    icon: <Building2 className="w-5 h-5 text-green-500" />,
                    title: "Real-Time Company Insights",
                    description: "Access up-to-date company information and interview processes"
                  }
                ].map((solution, index) => (
                  <motion.div
                    key={solution.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 p-4 bg-green-50/50 rounded-xl border border-green-100"
                  >
                    <div className="p-2 bg-green-100 rounded-lg h-fit">
                      {solution.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {solution.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {solution.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <Link to="/generate">
              <Button 
                size="lg"
                className="group bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-4 rounded-xl"
              >
                Try Pinnacle Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </Container>
        <BackgroundDecoration />
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 relative overflow-hidden">
        <Container className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10 text-center"
          >
            <Badge className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm bg-white/10 backdrop-blur-sm text-white border-white/20 mb-6">
              <Sparkles className="w-4 h-4" />
              Limited Time Offer
            </Badge>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Transform Your Interview Game
              <span className="block mt-2 bg-gradient-to-r from-purple-200 to-pink-200 text-transparent bg-clip-text">
                Start Today for Free!
              </span>
            </h2>
            
            <p className="text-lg text-purple-100 mb-8 max-w-xl mx-auto">
              Join thousands of successful candidates who landed their dream jobs
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Link to="/generate">
                <Button size="lg" className="group bg-white hover:bg-purple-50 text-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-xl transform hover:scale-105">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold">Start Free Practice</span>
                  </div>
                </Button>
              </Link>
              
              <Link to="/about-us">
                <Button 
                  size="lg" 
                  className="group bg-purple-500/20 backdrop-blur-sm hover:bg-purple-500/30 text-white border border-white/30 hover:border-white/50 px-6 py-3 rounded-xl transform hover:scale-105 transition-all duration-300"
                >
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-5 h-5" />
                    <span className="font-semibold">Learn More</span>
                  </div>
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-1.5 text-white/90">
                <Check className="w-4 h-4" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/90">
                <Check className="w-4 h-4" />
                <span>Instant Access</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/90">
                <Check className="w-4 h-4" />
                <span>24/7 AI Support</span>
              </div>
            </div>
          </motion.div>
        </Container>

        {/* Subtle background effects */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/10 via-transparent to-indigo-500/10 rounded-full filter blur-3xl animate-pulse" />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
