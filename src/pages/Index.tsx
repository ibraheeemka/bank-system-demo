
import { useState, useEffect } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { BankingDashboard } from "@/components/banking/BankingDashboard";
import { CreateAccountForm } from "@/components/auth/CreateAccountForm";
import { AppPasswordForm } from "@/components/auth/AppPasswordForm";
import { useBankingStore } from "@/stores/bankingStore";

const Index = () => {
  const { currentUser, accounts, isLoading, isAppUnlocked } = useBankingStore();
  const [showCreateAccount, setShowCreateAccount] = useState(false);

  // Show app password form if app is not unlocked
  if (!isAppUnlocked) {
    return <AppPasswordForm />;
  }

  if (isLoading) {
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading ModernBank</h2>
          <p className="text-gray-600">Preparing your banking experience...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute -bottom-8 left-40 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 right-40 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse" style={{ animationDelay: '3s' }}></div>
        </div>
        
        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg animate-scale-in">
              <span className="text-3xl">🏦</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3 animate-fade-in">
              ModernBank
            </h1>
            <p className="text-xl text-gray-700 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Your Digital Banking Experience
            </p>
            <p className="text-gray-500 mt-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              Secure • Fast • Modern
            </p>
          </div>
          
          {showCreateAccount ? (
            <CreateAccountForm onBack={() => setShowCreateAccount(false)} />
          ) : (
            <LoginForm onCreateAccount={() => setShowCreateAccount(true)} />
          )}
        </div>
      </div>
    );
  }

  return <BankingDashboard />;
};

export default Index;
