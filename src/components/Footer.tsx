import { Sparkles, Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-gradient-warm border-t border-border/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-warm">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-gradient">Ophelia AI</span>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              {t('footer.description')}
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-secondary hover:bg-primary transition-smooth flex items-center justify-center group">
                <Facebook className="w-4 h-4 text-foreground group-hover:text-primary-foreground" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-secondary hover:bg-primary transition-smooth flex items-center justify-center group">
                <Twitter className="w-4 h-4 text-foreground group-hover:text-primary-foreground" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-secondary hover:bg-primary transition-smooth flex items-center justify-center group">
                <Instagram className="w-4 h-4 text-foreground group-hover:text-primary-foreground" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-secondary hover:bg-primary transition-smooth flex items-center justify-center group">
                <Linkedin className="w-4 h-4 text-foreground group-hover:text-primary-foreground" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-bold mb-4">{t('footer.platform')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-smooth">{t('nav.features')}</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">{t('nav.aiAgents')}</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">{t('footer.marketplace')}</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">{t('footer.verification')}</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold mb-4">{t('footer.resources')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-smooth">{t('footer.documentation')}</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">{t('footer.aiGuide')}</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">{t('footer.support')}</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">{t('footer.blog')}</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold mb-4">{t('footer.company')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-smooth">{t('footer.about')}</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">{t('footer.careers')}</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">{t('footer.contact')}</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">{t('footer.partners')}</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Ophelia AI. {t('footer.rights')}
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-smooth">{t('footer.privacy')}</a>
            <a href="#" className="hover:text-primary transition-smooth">{t('footer.terms')}</a>
            <a href="#" className="hover:text-primary transition-smooth">{t('footer.cookies')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
