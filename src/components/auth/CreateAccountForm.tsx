
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBankingStore } from "@/stores/bankingStore";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, ArrowLeft, Copy } from "lucide-react";

interface CreateAccountFormProps {
  onBack: () => void;
}

export const CreateAccountForm = ({ onBack }: CreateAccountFormProps) => {
  const [ownerName, setOwnerName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newAccountId, setNewAccountId] = useState<string | null>(null);
  const createAccount = useBankingStore((state) => state.createAccount);
  const { toast } = useToast();

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ownerName.trim()) {
      toast({
        title: "Error",
        description: "Please enter your full name",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate account creation process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const accountId = createAccount(ownerName.trim());
    setNewAccountId(accountId);
    
    toast({
      title: "Account Created!",
      description: `Welcome to ModernBank, ${ownerName}!`,
    });
    
    setIsLoading(false);
  };

  const copyAccountId = () => {
    if (newAccountId) {
      navigator.clipboard.writeText(newAccountId);
      toast({
        title: "Copied!",
        description: "Account ID copied to clipboard",
      });
    }
  };

  if (newAccountId) {
    return (
      <Card className="animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="text-green-600">Account Created Successfully!</CardTitle>
          <CardDescription>
            Your account has been created. Please save your Account ID safely.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <Label className="text-sm font-medium text-gray-600">Your Account ID</Label>
            <div className="flex items-center justify-center gap-2 mt-2">
              <code className="text-lg font-mono font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded">
                {newAccountId}
              </code>
              <Button size="sm" variant="outline" onClick={copyAccountId}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded border border-amber-200">
            <strong>Important:</strong> Please save this Account ID. You'll need it to log in to your account.
          </div>
          
          <Button onClick={onBack} className="w-full">
            Continue to Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="w-fit mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Login
        </Button>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Create New Account
        </CardTitle>
        <CardDescription>
          Join ModernBank today and start your digital banking journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreateAccount} className="space-y-4">
          <div>
            <Label htmlFor="ownerName">Full Name</Label>
            <Input
              id="ownerName"
              type="text"
              placeholder="Enter your full name"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="mt-1"
              disabled={isLoading}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !ownerName.trim()}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Create Account
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
