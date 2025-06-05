import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBankingStore } from "@/stores/bankingStore";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const AppPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { setAppPassword } = useBankingStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 4) {
      toast({
        title: "Password Too Short",
        description: "Please enter at least 4 characters",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure both passwords match",
        variant: "destructive",
      });
      return;
    }

    setAppPassword(password);
    toast({
      title: "App Password Set! 🔐",
      description: "Your UNI Bank app is now secure",
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            UNI Bank
          </h1>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome to UNI Bank
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            First, let's secure your banking app
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Set Up App Password</CardTitle>
            <CardDescription>
              This password will be required each time you open the app
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Create Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={4}
                />
              </div>
              <Button type="submit" className="w-full">
                Secure My App
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
