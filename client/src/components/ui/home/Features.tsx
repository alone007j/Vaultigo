import { motion } from "framer-motion";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard = ({ icon, title, description, delay }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="card-lift bg-primary-900/60 backdrop-blur-sm rounded-2xl p-6 border border-muted/30"
    >
      <div className="bg-accent-blue/20 w-12 h-12 flex items-center justify-center rounded-lg mb-5">
        <i className={`ri-${icon} text-2xl text-accent-cyan`}></i>
      </div>
      <h3 className="font-poppins font-semibold text-xl text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
};

export default function Features() {
  const features = [
    {
      icon: "shield-keyhole-line",
      title: "Advanced Security",
      description: "End-to-end encryption, two-factor authentication, and secure device management keep your data protected.",
    },
    {
      icon: "ai-generate",
      title: "AI Assistant",
      description: "Smart organization, file searching, and document summarization powered by leading AI models.",
    },
    {
      icon: "link",
      title: "External Integration",
      description: "Link Dropbox, Terabox, and other cloud storage accounts for centralized management.",
    },
    {
      icon: "speed-up-line",
      title: "Lightning Speed",
      description: "Accelerated upload and download speeds with global CDN integration for instant access.",
    },
    {
      icon: "history-line",
      title: "Version History",
      description: "Track file changes with comprehensive version history and easy rollback options.",
    },
    {
      icon: "device-line",
      title: "Cross-Device Sync",
      description: "Seamlessly access your files across all your devices with real-time synchronization.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-primary-800/50">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="font-poppins font-bold text-3xl md:text-4xl text-foreground mb-4">
            Advanced features for the <span className="text-accent-cyan">modern cloud</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Experience next-generation cloud storage with cutting-edge security, AI integration, and seamless organization.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={0.1 + index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
