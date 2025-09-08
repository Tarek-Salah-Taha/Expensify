import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthPage } from "@/components/auth/AuthPage";
import { Header } from "@/components/layout/Header";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { useTranslation } from "react-i18next";
import { ExpenseProvider } from "@/contexts/ExpenseContext";

const Index = () => {
  const { loading, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [isGuestMode, setIsGuestMode] = useState(false);

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    );
  }

  // Auth page (if not logged in and not in guest mode)
  if (!isAuthenticated && !isGuestMode) {
    return <AuthPage onContinueAsGuest={() => setIsGuestMode(true)} />;
  }

  // Main app
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <ExpenseProvider>
          <Dashboard />
        </ExpenseProvider>
      </main>
    </div>
  );
};

export default Index;
