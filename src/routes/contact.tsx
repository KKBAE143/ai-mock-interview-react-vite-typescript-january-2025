import { motion } from "framer-motion";
import { Container } from "@/components/container";
import { Headings } from "@/components/headings";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Building2, 
  Mail, 
  MapPin, 
  MessageSquare, 
  Phone
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const contactInfo = [
  {
    icon: <Building2 className="w-5 h-5" />,
    title: "Our Office",
    content: "123 Innovation Drive, Tech Valley, CA 94043",
  },
  {
    icon: <Phone className="w-5 h-5" />,
    title: "Phone",
    content: "+1 (555) 123-4567",
  },
  {
    icon: <Mail className="w-5 h-5" />,
    title: "Email",
    content: "support@aimockup.com",
  },
  {
    icon: <MapPin className="w-5 h-5" />,
    title: "Hours",
    content: "Mon-Fri: 9AM - 6PM PST",
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

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
            title="Contact Us"
            description="Get in touch with our team for any questions or support"
          />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div variants={item}>
                    <label className="block text-sm font-medium mb-2">
                      Name
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                    />
                  </motion.div>

                  <motion.div variants={item}>
                    <label className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </motion.div>

                  <motion.div variants={item}>
                    <label className="block text-sm font-medium mb-2">
                      Subject
                    </label>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="How can we help?"
                    />
                  </motion.div>

                  <motion.div variants={item}>
                    <label className="block text-sm font-medium mb-2">
                      Message
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Your message..."
                      className="h-32"
                    />
                  </motion.div>

                  <motion.div variants={item}>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {contactInfo.map((info) => (
              <motion.div key={info.title} variants={item}>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="text-primary">{info.icon}</div>
                      <div>
                        <h3 className="font-semibold">{info.title}</h3>
                        <p className="text-muted-foreground">{info.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Map or Additional Content */}
            <motion.div variants={item}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="font-semibold">Live Chat Support</h3>
                    <p className="text-muted-foreground text-sm">
                      Available during business hours
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Container>
  );
};

export default Contact; 