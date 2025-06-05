import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            UNI Bank
          </h1>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please sign in to your account
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your account credentials</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="accountId">Account ID</Label>
              <Input
                id="accountId"
                  placeholder="Enter your Account ID"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                  required
              />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                  Sign In
            </Button>
            </form>
          </CardContent>
          <CardFooter>
            <div className="w-full">
              <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-gray-600">Don't have an account?</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>
            <Button 
              variant="outline" 
                className="w-full"
              onClick={onCreateAccount}
            >
                Create Account
            </Button>
            </div>
          </CardFooter>
      </Card>
      </div>
    </div>
  );
};
