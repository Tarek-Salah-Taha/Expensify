import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { FiMoon, FiSun, FiGlobe } from "react-icons/fi";

type AuthPageProps = {
  onContinueAsGuest: () => void;
};

export const AuthPage = ({ onContinueAsGuest }: AuthPageProps) => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-lg p-6">
        {/* Header Controls */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-primary">
            Expensify
          </h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="shrink-0"
            >
              {theme === "light" ? (
                <FiMoon className="h-4 w-4" />
              ) : (
                <FiSun className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className="shrink-0"
            >
              <FiGlobe className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Auth Form */}
        {isLogin ? (
          <LoginForm onToggleMode={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onToggleMode={() => setIsLogin(true)} />
        )}

        {/* Guest Mode Button */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            {t("continueAsGuestLocally")}
          </p>
          <Button
            variant="outline"
            className="w-full bg-background/80 backdrop-blur-sm"
            onClick={onContinueAsGuest}
          >
            {t("continueAsGuest")}
          </Button>
        </div>
      </div>
    </div>
  );
};
