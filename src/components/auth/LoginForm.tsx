
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBankingStore } from "@/stores/bankingStore";
import { useToast } from "@/hooks/use-toast";
import { LogIn, Plus } from "lucide-react";

interface LoginFormProps {
  onCreateAccount: () => void;
}

export const LoginForm = ({ onCreateAccount }: LoginFormProps) => {
  const [accountId, setAccountId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const login = useBankingStore((state) => state.login);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accountId.trim()) {
      toast({
        title: "Error",
        description: "Please enter your account ID",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const success = login(accountId.toUpperCase());
    
    if (success) {
      toast({
        title: "Welcome back!",
        description: "Login successful",
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Account ID not found. Please check your ID or create a new account.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <LogIn className="h-5 w-5" />
          Login to Your Account
        </CardTitle>
        <CardDescription>
          Enter your account ID to access your banking dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="accountId">Account ID</Label>
            <Input
              id="accountId"
              type="text"
              placeholder="Enter your account ID"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="mt-1"
              disabled={isLoading}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Signing In...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </>
            )}
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Don't have an account?</p>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCreateAccount}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Account
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
