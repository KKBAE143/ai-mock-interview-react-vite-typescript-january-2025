import { Sparkles } from "lucide-react";
import Marquee from "react-fast-marquee";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { MarqueImg } from "@/components/marquee-img";
import { Card } from "@/components/ui/card";

interface StatisticProps {
  value: string;
  label: string;
}

const Statistic = ({ value, label }: StatisticProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col items-center space-y-2"
  >
    <span className="text-4xl font-bold text-primary">{value}</span>
    <span className="text-lg text-muted-foreground text-center">{label}</span>
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

const HomePage = () => {
  return (
    <div className="flex-col w-full pb-24">
      <Container>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="my-12 md:my-24"
        >
          <h1 className="text-4xl md:text-7xl font-extrabold text-center md:text-left">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              AI Superpower
            </span>
            <span className="text-gray-500">
              - A better way to
            </span>
            <br />
            <span className="text-3xl md:text-5xl">
              improve your interview chances and skills
            </span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
            Boost your interview skills and increase your success rate with
            AI-driven insights. Discover a smarter way to prepare, practice, and
            stand out.
          </p>

          <div className="mt-8 flex gap-4">
            <Link to="/generate">
              <Button size="lg" className="group">
                Get Started
                <Sparkles className="ml-2 group-hover:rotate-12 transition-transform" />
              </Button>
            </Link>
            <Link to="/about-us">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 my-16">
          <div className="flex flex-col items-center space-y-2">
            <span className="text-4xl font-bold text-primary">250k+</span>
            <span className="text-lg text-muted-foreground text-center">Offers Received</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <span className="text-4xl font-bold text-primary">1.2M+</span>
            <span className="text-lg text-muted-foreground text-center">Interviews Aced</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <span className="text-4xl font-bold text-primary">98%</span>
            <span className="text-lg text-muted-foreground text-center">Success Rate</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <span className="text-4xl font-bold text-primary">24/7</span>
            <span className="text-lg text-muted-foreground text-center">AI Support</span>
          </div>
        </div>

        {/* Hero Image Section */}
        <div className="relative rounded-xl overflow-hidden h-[500px] shadow-2xl">
          <img
            src="/assets/img/hero.jpg"
            alt="AI Interview Platform"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
          <div className="absolute top-4 left-4 px-6 py-3 rounded-lg bg-white/10 backdrop-blur-md text-white font-medium">
            Interviews Copilot©
          </div>

          <div className="absolute bottom-4 right-4 w-80 p-6 rounded-lg bg-white/90 backdrop-blur-md hidden md:block">
            <h2 className="text-xl font-semibold text-gray-900">AI-Powered Practice</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Get real-time feedback and personalized coaching from our advanced AI system.
            </p>
            <Button className="mt-4 w-full">
              Try Now <Sparkles className="ml-2" />
            </Button>
          </div>
        </div>
      </Container>

      {/* Partners Section */}
      <div className="bg-gray-50 py-12 mt-24">
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

      <Container className="py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Unleash Your Interview Potential
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform the way you prepare, gain confidence, and boost your
            chances of landing your dream job with AI-powered interview practice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">AI-Powered Feedback</h3>
              <p className="text-muted-foreground">
                Get instant, personalized feedback on your responses from our advanced AI system.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Real-world Scenarios</h3>
              <p className="text-muted-foreground">
                Practice with industry-specific questions and scenarios tailored to your field.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">24/7 Availability</h3>
              <p className="text-muted-foreground">
                Practice whenever you want, as much as you need, with our always-available AI interviewer.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link to="/generate">
            <Button size="lg" className="px-8">
              Start Practicing Now <Sparkles className="ml-2" />
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default HomePage;
