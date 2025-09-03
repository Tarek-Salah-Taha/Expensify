import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FiMoon, FiSun, FiGlobe, FiUser, FiLogOut } from "react-icons/fi";

import toast from "react-hot-toast";

export const Header = () => {
  const { t } = useTranslation();
  const { user, signOut, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success(t("logoutSuccess"));
    } catch (error) {
      toast.error(t("error"));
    }
  };

  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-primary">Expensify</h1>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? (
              <FiMoon className="h-4 w-4" />
            ) : (
              <FiSun className="h-4 w-4" />
            )}
          </Button>

          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
          >
            <FiGlobe className="h-4 w-4" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {isAuthenticated ? (
                      user?.email?.charAt(0).toUpperCase() || "U"
                    ) : (
                      <FiUser className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              {isAuthenticated ? (
                <>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">
                      {user?.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {t("profile")}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <FiLogOut className="mr-2 h-4 w-4" />
                    <span>{t("logout")}</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">Guest Mode</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Data saved locally
                  </p>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
