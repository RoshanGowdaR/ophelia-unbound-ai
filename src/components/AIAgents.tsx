import { Card } from "@/components/ui/card";
import { Brain, TrendingUp, Palette, Users, MessageSquare, Shield } from "lucide-react";
import aiAgentsImage from "@/assets/ai-agents-visual.jpg";

const agents = [
  {
    icon: Brain,
    title: "Analytics Agent",
    description: "Real-time market insights, trend detection, and data-driven recommendations for optimal pricing and positioning.",
  },
  {
    icon: TrendingUp,
    title: "Marketing Agent",
    description: "Automated campaign generation, social media management, and multi-channel distribution with AI-powered content.",
  },
  {
    icon: Palette,
    title: "Creative Agent",
    description: "Auto-generate product stories, promotional materials, images, and videos that showcase your craft's uniqueness.",
  },
  {
    icon: Users,
    title: "Mentoring Agent",
    description: "Personalized guidance for artisans, skill development suggestions, and business growth strategies.",
  },
  {
    icon: MessageSquare,
    title: "Customer Engagement",
    description: "Multilingual chatbot support, voice commerce, and emotion-aware interactions for seamless customer experience.",
  },
  {
    icon: Shield,
    title: "Provenance Agent",
    description: "Blockchain-powered authenticity tracking, transparency badges, and trust-building visual storytelling.",
  },
];

const AIAgents = () => {
  return (
    <section id="agents" className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 opacity-10">
        <img src={aiAgentsImage} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect mb-6">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Multi-Agent AI System</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Six Intelligent Agents
            <br />
            <span className="text-gradient">Working for Your Success</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Our AI agents work 24/7 to market your products, analyze trends, 
            engage customers, and grow your artisan business globally.
          </p>
        </div>

        {/* Agent Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent, index) => (
            <Card
              key={index}
              className="p-6 glass-effect border-2 hover:border-primary transition-smooth hover:shadow-warm group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-bounce shadow-warm">
                <agent.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-smooth">
                {agent.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {agent.description}
              </p>
            </Card>
          ))}
        </div>

        {/* Feature highlight */}
        <div className="mt-16 p-8 rounded-2xl glass-effect border-2 border-primary/20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                Autonomous & Collaborative
              </h3>
              <p className="text-muted-foreground mb-4">
                Our agents don't just work independently—they collaborate with each other, 
                sharing insights and coordinating actions to maximize your success.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Real-time data synchronization across all agents</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Continuous learning from market feedback</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Automated optimization without manual intervention</span>
                </li>
              </ul>
            </div>
            <div className="relative h-64 rounded-xl overflow-hidden shadow-warm">
              <img 
                src={aiAgentsImage} 
                alt="AI technology visualization" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIAgents;
