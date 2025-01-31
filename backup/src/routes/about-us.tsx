import { motion } from "framer-motion";
import { Container } from "@/components/container";
import { Headings } from "@/components/headings";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Linkedin, Twitter } from "lucide-react";

const teamMembers = [
  {
    name: "John Smith",
    role: "Founder & CEO",
    image: "/assets/team/team1.jpg",
    bio: "10+ years of experience in AI and Machine Learning",
    social: {
      twitter: "#",
      linkedin: "#",
      github: "#",
    },
  },
  {
    name: "Sarah Johnson",
    role: "Lead AI Engineer",
    image: "/assets/team/team2.jpg",
    bio: "PhD in Computer Science, specializing in Natural Language Processing",
    social: {
      twitter: "#",
      linkedin: "#",
      github: "#",
    },
  },
  {
    name: "Michael Chen",
    role: "Senior Developer",
    image: "/assets/team/team3.jpg",
    bio: "Full-stack developer with expertise in React and Node.js",
    social: {
      twitter: "#",
      linkedin: "#",
      github: "#",
    },
  },
];

const companyValues = [
  {
    title: "Innovation",
    description: "Pushing the boundaries of AI technology to create meaningful solutions",
    icon: "🚀",
  },
  {
    title: "Excellence",
    description: "Committed to delivering the highest quality interview preparation",
    icon: "⭐",
  },
  {
    title: "Empowerment",
    description: "Helping candidates reach their full potential",
    icon: "💪",
  },
];

export const AboutUs = () => {
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
            title="About Us"
            description="Empowering candidates with AI-driven interview preparation"
          />
        </motion.div>

        {/* Company Values */}
        <section className="py-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {companyValues.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 + 0.4 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">{value.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="py-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold mb-4">Our Team</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 + 1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="aspect-square mb-4 overflow-hidden rounded-full">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{member.role}</p>
                      <p className="text-sm mb-4">{member.bio}</p>
                      <div className="flex justify-center space-x-4">
                        <a href={member.social.twitter} className="text-muted-foreground hover:text-primary">
                          <Twitter size={20} />
                        </a>
                        <a href={member.social.linkedin} className="text-muted-foreground hover:text-primary">
                          <Linkedin size={20} />
                        </a>
                        <a href={member.social.github} className="text-muted-foreground hover:text-primary">
                          <Github size={20} />
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </Container>
  );
};

export default AboutUs; 