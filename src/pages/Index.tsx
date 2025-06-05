
import { useState, useEffect } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { BankingDashboard } from "@/components/banking/BankingDashboard";
import { CreateAccountForm } from "@/components/auth/CreateAccountForm";
import { useBankingStore } from "@/stores/bankingStore";

const Index = () => {
  const { currentUser, accounts, isLoading } = useBankingStore();
  const [showCreateAccount, setShowCreateAccount] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading banking system...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">🏦 ModernBank</h1>
            <p className="text-gray-600">Your Digital Banking Experience</p>
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
