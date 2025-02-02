import { Sparkles, ArrowRight, Users, Target, BookOpen, Quote } from "lucide-react";
import Marquee from "react-fast-marquee";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { MarqueImg } from "@/components/marquee-img";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

const HomePage = () => {
  return (
    <div className="flex-col w-full pb-24">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gray-50">
        <Container>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="my-12 md:my-24 relative z-10"
          >
            <Badge className="mb-4" variant="secondary">
              🎯 Trusted by 10,000+ successful job seekers
            </Badge>
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

            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/generate">
                <Button size="lg" className="group">
                  Get Started
                  <Sparkles className="ml-2 group-hover:rotate-12 transition-transform" />
                </Button>
              </Link>
              <Link to="/about-us">
                <Button size="lg" variant="outline">
                  Learn More
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </Container>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/5" />
        </div>
      </div>

      <Container>
        {/* Statistics Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 my-16">
          <Statistic value="250k+" label="Offers Received" />
          <Statistic value="1.2M+" label="Interviews Aced" />
          <Statistic value="98%" label="Success Rate" />
          <Statistic value="24/7" label="AI Support" />
        </div>

        {/* Hero Image Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-xl overflow-hidden h-[500px] shadow-2xl"
        >
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
        </motion.div>
      </Container>

      {/* Process Section */}
      <div className="bg-gray-50 py-24 mt-24">
        <Container>
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">How It Works</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your Journey to Interview Success
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Follow our proven process to transform your interview skills and boost your confidence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-primary/20 -z-10 hidden md:block" />
            <ProcessStep 
              number={1}
              title="Sign Up"
              description="Create your account and tell us about your career goals"
            />
            <ProcessStep 
              number={2}
              title="Practice"
              description="Get matched with AI interviewers tailored to your industry"
            />
            <ProcessStep 
              number={3}
              title="Receive Feedback"
              description="Get detailed feedback and actionable improvements"
            />
            <ProcessStep 
              number={4}
              title="Improve"
              description="Track your progress and keep practicing until you're confident"
            />
          </div>
        </Container>
      </div>

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
      <Container className="py-24">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Features</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform the way you prepare, gain confidence, and boost your
            chances of landing your dream job with AI-powered interview practice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            title="AI-Powered Feedback"
            description="Get instant, personalized feedback on your responses from our advanced AI system."
            icon={<Target className="w-6 h-6 text-primary" />}
          />
          <FeatureCard
            title="Real-world Scenarios"
            description="Practice with industry-specific questions and scenarios tailored to your field."
            icon={<BookOpen className="w-6 h-6 text-primary" />}
          />
          <FeatureCard
            title="24/7 Availability"
            description="Practice whenever you want, as much as you need, with our always-available AI interviewer."
            icon={<Users className="w-6 h-6 text-primary" />}
          />
        </div>
      </Container>

      {/* Testimonials Section */}
      <div className="bg-gray-50 py-24">
        <Container>
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of successful job seekers who transformed their interview skills
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Testimonial
              quote="The AI feedback helped me identify and improve my weak points. I landed my dream job at a Fortune 500 company!"
              author="Sarah Chen"
              role="Marketing Manager"
            />
            <Testimonial
              quote="Practicing with this platform gave me the confidence I needed. The real-time feedback is invaluable."
              author="Michael Johnson"
              role="Product Manager"
            />
            <Testimonial
              quote="The industry-specific questions really helped me prepare. Highly recommended for any job seeker!"
              author="David Kim"
              role="Sales Director"
            />
          </div>
        </Container>
      </div>

      {/* Final CTA Section */}
      <Container className="py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden bg-primary p-8 md:p-12 text-white text-center"
        >
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Interview Skills?
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
              Join thousands of job seekers who have already improved their interview success rate
            </p>
            <Link to="/generate">
              <Button size="lg" variant="secondary" className="px-8">
                Start Practicing Now <Sparkles className="ml-2" />
              </Button>
            </Link>
          </div>
          
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-white/10" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-white/10" />
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

export default HomePage;
