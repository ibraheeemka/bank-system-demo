
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBankingStore } from "@/stores/bankingStore";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, MinusCircle } from "lucide-react";

export const TransactionForm = () => {
  const [depositAmount, setDepositAmount] = useState("");
  const [depositDescription, setDepositDescription] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawDescription, setWithdrawDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { currentUser, deposit, withdraw } = useBankingStore();
  const { toast } = useToast();

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    deposit(amount, depositDescription || "Cash deposit");
    
    toast({
      title: "Deposit Successful",
      description: `$${amount.toFixed(2)} has been deposited to your account`,
    });
    
    setDepositAmount("");
    setDepositDescription("");
    setIsLoading(false);
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive",
      });
      return;
    }

    if (!currentUser || amount > currentUser.balance) {
      toast({
        title: "Insufficient Funds",
        description: "You don't have enough balance for this withdrawal",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const success = withdraw(amount, withdrawDescription || "Cash withdrawal");
    
    if (success) {
      toast({
        title: "Withdrawal Successful",
        description: `$${amount.toFixed(2)} has been withdrawn from your account`,
      });
      setWithdrawAmount("");
      setWithdrawDescription("");
    }
    
    setIsLoading(false);
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Make a Transaction</CardTitle>
        <CardDescription>Deposit or withdraw money from your account</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="deposit" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          </TabsList>
          
          <TabsContent value="deposit">
            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <Label htmlFor="depositAmount">Amount</Label>
                <Input
                  id="depositAmount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="Enter amount to deposit"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <Label htmlFor="depositDescription">Description (Optional)</Label>
                <Input
                  id="depositDescription"
                  type="text"
                  placeholder="e.g., Salary, Gift money"
                  value={depositDescription}
                  onChange={(e) => setDepositDescription(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading || !depositAmount}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Deposit ${depositAmount || "0.00"}
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="withdraw">
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <Label htmlFor="withdrawAmount">Amount</Label>
                <Input
                  id="withdrawAmount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={currentUser?.balance || 0}
                  placeholder="Enter amount to withdraw"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  disabled={isLoading}
                />
                <p className="text-sm text-gray-600 mt-1">
                  Available balance: ${currentUser?.balance.toFixed(2) || "0.00"}
                </p>
              </div>
              
              <div>
                <Label htmlFor="withdrawDescription">Description (Optional)</Label>
                <Input
                  id="withdrawDescription"
                  type="text"
                  placeholder="e.g., ATM withdrawal, Shopping"
                  value={withdrawDescription}
                  onChange={(e) => setWithdrawDescription(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={isLoading || !withdrawAmount}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <MinusCircle className="h-4 w-4 mr-2" />
                    Withdraw ${withdrawAmount || "0.00"}
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
