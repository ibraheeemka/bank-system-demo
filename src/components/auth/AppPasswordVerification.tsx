import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBankingStore } from "@/stores/bankingStore";
import { useToast } from "@/hooks/use-toast";

export const AppPasswordVerification = () => {
  const [password, setPassword] = useState("");
  const { verifyAppPassword } = useBankingStore();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (verifyAppPassword(password)) {
      toast({
        title: "Welcome Back! 🔓",
        description: "App unlocked successfully",
      });
    } else {
      toast({
        title: "Incorrect Password",
        description: "Please try again",
        variant: "destructive",
      });
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            UNI Bank
          </h1>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please enter your app password to continue
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Enter App Password</CardTitle>
            <CardDescription>
              This password protects access to your banking app
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">App Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your app password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Unlock App
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 