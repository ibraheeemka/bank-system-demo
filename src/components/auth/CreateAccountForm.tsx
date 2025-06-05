import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBankingStore } from "@/stores/bankingStore";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, UserPlus, Eye, EyeOff, Mail, User, CreditCard, CheckCircle } from "lucide-react";

interface CreateAccountFormProps {
  onBack: () => void;
}

export const CreateAccountForm = ({ onBack }: CreateAccountFormProps) => {
  const [formData, setFormData] = useState({
    ownerName: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "" as "checking" | "savings" | "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [accountCreated, setAccountCreated] = useState(false);
  const [credentials, setCredentials] = useState<{ accountId: string; password: string } | null>(null);
  
  const createAccount = useBankingStore((state) => state.createAccount);
  const { toast } = useToast();

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  const handlePasswordChange = (password: string) => {
    setFormData(prev => ({ ...prev, password }));
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return "bg-red-500";
    if (passwordStrength < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 50) return "Weak";
    if (passwordStrength < 75) return "Medium";
    return "Strong";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.ownerName.trim() || !formData.email.trim() || !formData.password || !formData.accountType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (passwordStrength < 50) {
      toast({
        title: "Weak Password",
        description: "Please choose a stronger password",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Create account and send email
      const result = await createAccount(
        formData.ownerName, 
        formData.email, 
        formData.password, 
        formData.accountType as "checking" | "savings"
      );
      
      setCredentials(result);
      setAccountCreated(true);
      
      toast({
        title: "Account Created Successfully! 🎉",
        description: "Your account credentials are displayed below. Please save them!",
      });
      
    } catch (error) {
      toast({
        title: "Account Creation Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  if (accountCreated && credentials) {
    return (
      <div className="relative overflow-hidden">
        <Card className="relative backdrop-blur-sm bg-white/90 border-0 shadow-2xl animate-fade-in">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center animate-scale-in">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Your UNI Bank account has been successfully created
            </CardTitle>
            <CardDescription className="text-base">
              Your UNI Bank account has been successfully created
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-4">Your Account Credentials</h3>
              <div className="space-y-4">
                <div className="bg-white p-3 rounded-md">
                  <p className="text-sm text-blue-600 mb-1">Account ID</p>
                  <p className="text-lg font-mono font-bold text-blue-900">{credentials.accountId}</p>
                </div>
                <div className="bg-white p-3 rounded-md">
                  <p className="text-sm text-blue-600 mb-1">Password</p>
                  <p className="text-lg font-mono font-bold text-blue-900">{credentials.password}</p>
                </div>
              </div>
              <p className="text-blue-600 text-sm mt-4">
                ⚠️ Please save these credentials - you'll need them to sign in!
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-800 text-sm">
                  <strong>Account Type:</strong> {formData.accountType === 'savings' ? 'Savings' : 'Checking'}
                </p>
                {formData.accountType === 'savings' && (
                  <p className="text-green-700 text-xs mt-1">
                    🎁 Welcome bonus: $100 added to your account!
                  </p>
                )}
              </div>
            </div>
            
            <Button 
              onClick={onBack}
              className="w-full h-12 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
            >
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 animate-pulse opacity-20"></div>
      
      <Card className="relative backdrop-blur-sm bg-white/90 border-0 shadow-2xl animate-fade-in">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center animate-scale-in">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Join UNI Bank and start your digital banking journey
          </CardTitle>
          <CardDescription className="text-base">
            Join UNI Bank and start your digital banking journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="ownerName" className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name *
              </Label>
              <Input
                id="ownerName"
                type="text"
                placeholder="Enter your full name"
                value={formData.ownerName}
                onChange={(e) => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
                className="h-12 transition-all duration-200 focus:ring-2 focus:ring-green-500"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email (we'll send your Account ID here)"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="h-12 transition-all duration-200 focus:ring-2 focus:ring-green-500"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500">📧 Your Account ID will be sent to this email</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountType" className="text-sm font-medium flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Account Type *
              </Label>
              <Select 
                value={formData.accountType} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, accountType: value as "checking" | "savings" }))}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Choose account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Checking Account</div>
                        <div className="text-sm text-gray-500">For everyday transactions</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="savings">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Savings Account</div>
                        <div className="text-sm text-gray-500">$100 welcome bonus!</div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password *
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className="h-12 pr-12 transition-all duration-200 focus:ring-2 focus:ring-green-500"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Password strength:</span>
                    <span className={`font-medium ${passwordStrength >= 75 ? 'text-green-600' : passwordStrength >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                      style={{ width: `${passwordStrength}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password *
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="h-12 pr-12 transition-all duration-200 focus:ring-2 focus:ring-green-500"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onBack}
                className="flex-1 h-12"
                disabled={isLoading}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button 
                type="submit" 
                className="flex-1 h-12 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create Account
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
