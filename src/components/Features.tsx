import { Card } from "@/components/ui/card";
import { Globe, Mic, Eye, Sparkles, TrendingUp, Shield } from "lucide-react";
import arImage from "@/assets/ar-showcase.jpg";
import { useTranslation } from "react-i18next";

const features = [
  {
    icon: Eye,
    title: "AR/VR Marketplace",
    description: "Immersive 3D product previews, virtual craft villages, and try-before-you-buy experiences.",
  },
  {
    icon: Mic,
    title: "Voice-First Commerce",
    description: "Multilingual voice search, conversational shopping, and hands-free browsing in 100+ languages.",
  },
  {
    icon: Globe,
    title: "Global Distribution",
    description: "One-click publishing to social platforms, WhatsApp, and international marketplaces.",
  },
  {
    icon: Sparkles,
    title: "Automated Storytelling",
    description: "AI-generated product narratives, promotional content, and brand stories that sell.",
  },
  {
    icon: TrendingUp,
    title: "Trend Intelligence",
    description: "Real-time market analysis, demand forecasting, and pricing optimization.",
  },
  {
    icon: Shield,
    title: "Blockchain Provenance",
    description: "Authenticity certificates, transparent sourcing, and verified artisan credentials.",
  },
];

const Features = () => {
  const { t } = useTranslation();
  
  return (
    <section id="features" className="py-24 bg-gradient-warm relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{t('nav.features')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t('features.title')}
          </h2>
          <p className="text-xl text-muted-foreground">
            {t('features.subtitle')}
          </p>
        </div>

        {/* Features Grid */}
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

        {/* AR/VR Showcase */}
        <div className="max-w-5xl mx-auto">
          <Card className="overflow-hidden glass-effect border-2 border-primary/20">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h3 className="text-3xl font-bold mb-4">
                  {t('features.arTitle')}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {t('features.arDescription')}
                </p>
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

export default Features;
