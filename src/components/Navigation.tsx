import { Button } from "@/components/ui/button";
import { Menu, Sparkles, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-warm">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-gradient">Ophelia AI</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/#features" className="text-foreground hover:text-primary transition-smooth font-medium">
              {t('nav.features')}
            </a>
            <a href="/#agents" className="text-foreground hover:text-primary transition-smooth font-medium">
              {t('nav.aiAgents')}
            </a>
            <a href="/marketplace" className="text-foreground hover:text-primary transition-smooth font-medium">
              {t('nav.marketplace')}
            </a>
            {user && (
              <a href="/artisan-dashboard" className="text-foreground hover:text-primary transition-smooth font-medium">
                {t('nav.dashboard')}
              </a>
            )}
          </div>

          {/* Language Selector & CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSelector />
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">
                  {user.email}
                </span>
                <Button variant="ghost" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('nav.signOut')}
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/auth")}>{t('nav.signIn')}</Button>
                <Button variant="hero" onClick={() => navigate("/auth")}>{t('nav.joinNow')}</Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-smooth"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50">
            <div className="flex flex-col gap-4">
              <LanguageSelector />
              <a href="#features" className="text-foreground hover:text-primary transition-smooth font-medium py-2">
                {t('nav.features')}
              </a>
              <a href="#agents" className="text-foreground hover:text-primary transition-smooth font-medium py-2">
                {t('nav.aiAgents')}
              </a>
              <a href="#marketplace" className="text-foreground hover:text-primary transition-smooth font-medium py-2">
                {t('nav.marketplace')}
              </a>
              <div className="flex flex-col gap-2 pt-4 border-t border-border/50">
                {user ? (
                  <>
                    <div className="text-sm text-muted-foreground py-2">{user.email}</div>
                    <Button variant="ghost" className="w-full" onClick={handleSignOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      {t('nav.signOut')}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" className="w-full" onClick={() => navigate("/auth")}>{t('nav.signIn')}</Button>
                    <Button variant="hero" className="w-full" onClick={() => navigate("/auth")}>{t('nav.joinNow')}</Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
