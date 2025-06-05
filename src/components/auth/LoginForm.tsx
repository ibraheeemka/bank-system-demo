
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBankingStore } from "@/stores/bankingStore";
import { useToast } from "@/hooks/use-toast";
import { LogIn, Plus, Eye, EyeOff, Lock, User } from "lucide-react";

interface LoginFormProps {
  onCreateAccount: () => void;
}

export const LoginForm = ({ onCreateAccount }: LoginFormProps) => {
  const [accountId, setAccountId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const login = useBankingStore((state) => state.login);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accountId.trim() || !password.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both account ID and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const success = login(accountId.toUpperCase(), password);
    
    if (success) {
      toast({
        title: "Welcome back! 🎉",
        description: "Login successful",
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid account ID or password. Account may be locked after 3 failed attempts.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 animate-pulse opacity-20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent"></div>
      
      <Card className="relative backdrop-blur-sm bg-white/90 border-0 shadow-2xl animate-fade-in">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-scale-in">
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-base">
            Sign in to access your banking dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="accountId" className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Account ID
              </Label>
              <Input
                id="accountId"
                type="text"
                placeholder="e.g., ACC123456789"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="h-12 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pr-12 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign In
                </>
              )}
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">New to ModernBank?</span>
              </div>
            </div>
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCreateAccount}
              className="w-full h-12 border-2 border-gray-300 hover:border-blue-500 transition-all duration-300 hover:shadow-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create New Account
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
