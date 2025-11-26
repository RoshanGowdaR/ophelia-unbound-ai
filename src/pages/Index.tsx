import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sparkles,
  ArrowRight,
  Globe,
  Mic,
  Eye,
  TrendingUp,
  Shield,
  Brain,
  Palette,
  Users,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import heroImage from "@/assets/hero-artisans.jpg";
import arImage from "@/assets/ar-showcase.jpg";
import aiAgentsImage from "@/assets/ai-agents-visual.jpg";
import { useTranslation } from "react-i18next";

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate("/upload-product");
    } else {
      navigate("/auth");
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Artisans crafting beautiful products"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/90 to-background/70" />
      </div>

      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 z-10 relative">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{t("hero.badge")}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in-up">
            {t("hero.title")}
            <br />
            <span className="text-gradient">{t("hero.titleHighlight")}</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl animate-fade-in-up delay-200">
            {t("hero.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
            <Button variant="hero" size="xl" className="group" onClick={handleGetStarted}>
              {t("hero.startSelling")}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-smooth" />
            </Button>
            <Button variant="glass" size="xl" onClick={() => navigate("/marketplace")}>
              {t("hero.exploreCrafts")}
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-16 animate-fade-in-up delay-500">
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient mb-2">50K+</div>
              <div className="text-sm text-muted-foreground">{t("hero.statsArtisans")}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient mb-2">100+</div>
              <div className="text-sm text-muted-foreground">{t("hero.statsCountries")}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient mb-2">1M+</div>
              <div className="text-sm text-muted-foreground">{t("hero.statsProducts")}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

const features = [
  {
    icon: Eye,
    title: "AR/VR Marketplace",
    description:
      "Immersive 3D product previews, virtual craft villages, and try-before-you-buy experiences.",
  },
  {
    icon: Mic,
    title: "Voice-First Commerce",
    description:
      "Multilingual voice search, conversational shopping, and hands-free browsing in 100+ languages.",
  },
  {
    icon: Globe,
    title: "Global Distribution",
    description: "One-click publishing to social platforms, WhatsApp, and international marketplaces.",
  },
  {
    icon: Sparkles,
    title: "Automated Storytelling",
    description:
      "AI-generated product narratives, promotional content, and brand stories that sell.",
  },
  {
    icon: TrendingUp,
    title: "Trend Intelligence",
    description: "Real-time market analysis, demand forecasting, and pricing optimization.",
  },
  {
    icon: Shield,
    title: "Blockchain Provenance",
    description:
      "Authenticity certificates, transparent sourcing, and verified artisan credentials.",
  },
];

const FeaturesSection = () => {
  const { t } = useTranslation();

  return (
    <section id="features" className="py-24 bg-gradient-warm relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{t("nav.features")}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">{t("features.title")}</h2>
          <p className="text-xl text-muted-foreground">{t("features.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 bg-card/50 backdrop-blur-sm border-2 hover:border-primary transition-smooth hover:shadow-warm group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-bounce shadow-soft">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-smooth">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        <div className="max-w-5xl mx-auto">
          <Card className="overflow-hidden glass-effect border-2 border-primary/20">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h3 className="text-3xl font-bold mb-4">{t("features.arTitle")}</h3>
                <p className="text-muted-foreground mb-6">{t("features.arDescription")}</p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>360° product rotation and zoom</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Virtual try-on for jewelry and accessories</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Scale visualization in real environments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Virtual craft village tours</span>
                  </li>
                </ul>
              </div>
              <div className="relative h-96 md:h-auto">
                <img
                  src={arImage}
                  alt="AR product visualization"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-card/80 md:from-card/0 to-transparent" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

const agents = [
  {
    icon: Brain,
    title: "Analytics Agent",
    description:
      "Real-time market insights, trend detection, and data-driven recommendations for optimal pricing and positioning.",
  },
  {
    icon: TrendingUp,
    title: "Marketing Agent",
    description:
      "Automated campaign generation, social media management, and multi-channel distribution with AI-powered content.",
  },
  {
    icon: Palette,
    title: "Creative Agent",
    description:
      "Auto-generate product stories, promotional materials, images, and videos that showcase your craft's uniqueness.",
  },
  {
    icon: Users,
    title: "Mentoring Agent",
    description:
      "Personalized guidance for artisans, skill development suggestions, and business growth strategies.",
  },
  {
    icon: MessageSquare,
    title: "Customer Engagement",
    description:
      "Multilingual chatbot support, voice commerce, and emotion-aware interactions for seamless customer experience.",
  },
  {
    icon: Shield,
    title: "Provenance Agent",
    description:
      "Blockchain-powered authenticity tracking, transparency badges, and trust-building visual storytelling.",
  },
];

const AIAgentsSection = () => {
  return (
    <section id="agents" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10">
        <img src={aiAgentsImage} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
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
            Our AI agents work 24/7 to market your products, analyze trends, engage customers, and
            grow your artisan business globally.
          </p>
        </div>

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
              <p className="text-muted-foreground leading-relaxed">{agent.description}</p>
            </Card>
          ))}
        </div>

        <div className="mt-16 p-8 rounded-2xl glass-effect border-2 border-primary/20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Autonomous & Collaborative</h3>
              <p className="text-muted-foreground mb-4">
                Our agents don't just work independently—they collaborate with each other, sharing
                insights and coordinating actions to maximize your success.
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

const CallToActionSection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero opacity-10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/30 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="glass-effect p-12 md:p-16 rounded-3xl border-2 border-primary/20 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{t("cta.badge")}</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">{t("cta.title")}</h2>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t("cta.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" className="group">
                {t("cta.startTrial")}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-smooth" />
              </Button>
              <Button variant="glass" size="xl">
                {t("cta.scheduleDemo")}
              </Button>
            </div>

            <div className="mt-12 pt-8 border-t border-border/50">
              <p className="text-sm text-muted-foreground mb-4">{t("cta.trustedBy")}</p>
              <div className="flex flex-wrap justify-center gap-8 text-2xl font-bold text-muted-foreground/50">
                <span>India</span>
                <span>•</span>
                <span>Africa</span>
                <span>•</span>
                <span>Latin America</span>
                <span>•</span>
                <span>Southeast Asia</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <AIAgentsSection />
      <CallToActionSection />
      <Footer />
    </div>
  );
};

export default Index;
