import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthPage } from '@/components/auth/AuthPage';
import { Header } from '@/components/layout/Header';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

const Index = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [isGuestMode, setIsGuestMode] = useState(false);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    );
  }

  // Show auth page if not authenticated and not in guest mode
  if (!isAuthenticated && !isGuestMode) {
    return (
      <div>
        <AuthPage />
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
          <Button 
            variant="outline" 
            onClick={() => setIsGuestMode(true)}
            className="bg-background/80 backdrop-blur-sm"
          >
            Continue as Guest
          </Button>
        </div>
      </div>
    );
  }

  // Show main app
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <Dashboard />
      </main>
    </div>
  );
};

export default Index;
