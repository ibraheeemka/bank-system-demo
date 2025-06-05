import { useState, useEffect } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { BankingDashboard } from "@/components/banking/BankingDashboard";
import { CreateAccountForm } from "@/components/auth/CreateAccountForm";
import { AppPasswordVerification } from "@/components/auth/AppPasswordVerification";
import { useBankingStore } from "@/stores/bankingStore";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { currentUser, accounts, isLoading, isAppUnlocked, appPassword } = useBankingStore();
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [isLoadingState, setIsLoadingState] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if app password is set
    if (!appPassword) {
      navigate('/app-password');
      return;
    }
    setIsLoadingState(false);
  }, [appPassword, navigate]);

  // Show app password verification form if app is not unlocked but has a password set
  if (!isAppUnlocked && appPassword) {
    return <AppPasswordVerification />;
  }

  if (isLoadingState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading UNI Bank</h2>
          <p className="text-gray-600">Preparing your banking experience...</p>
        </div>
      </div>
    );
  }

  if (currentUser) {
    return <BankingDashboard />;
  }

  return showCreateAccount ? (
    <CreateAccountForm onBack={() => setShowCreateAccount(false)} />
  ) : (
    <LoginForm onCreateAccount={() => setShowCreateAccount(true)} />
  );
};

export default Index;
