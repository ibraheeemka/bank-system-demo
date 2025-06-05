
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBankingStore } from "@/stores/bankingStore";
import { useToast } from "@/hooks/use-toast";
import { ArrowUpDown, Search } from "lucide-react";

export const TransferForm = () => {
  const [toAccountId, setToAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recipientInfo, setRecipientInfo] = useState<{ ownerName: string } | null>(null);
  
  const { currentUser, transfer, getAccount } = useBankingStore();
  const { toast } = useToast();

  const handleAccountLookup = () => {
    if (!toAccountId.trim()) return;
    
    const account = getAccount(toAccountId.toUpperCase());
    if (account && account.id !== currentUser?.id) {
      setRecipientInfo({ ownerName: account.ownerName });
    } else if (account?.id === currentUser?.id) {
      toast({
        title: "Invalid Transfer",
        description: "You cannot transfer money to your own account",
        variant: "destructive",
      });
      setRecipientInfo(null);
    } else {
      toast({
        title: "Account Not Found",
        description: "The recipient account ID does not exist",
        variant: "destructive",
      });
      setRecipientInfo(null);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive",
      });
      return;
    }

    if (!currentUser || transferAmount > currentUser.balance) {
      toast({
        title: "Insufficient Funds",
        description: "You don't have enough balance for this transfer",
        variant: "destructive",
      });
      return;
    }

    if (!recipientInfo) {
      toast({
        title: "Recipient Required",
        description: "Please verify the recipient account first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const success = transfer(
      toAccountId.toUpperCase(), 
      transferAmount, 
      description || `Transfer to ${recipientInfo.ownerName}`
    );
    
    if (success) {
      toast({
        title: "Transfer Successful",
        description: `$${transferAmount.toFixed(2)} transferred to ${recipientInfo.ownerName}`,
      });
      setToAccountId("");
      setAmount("");
      setDescription("");
      setRecipientInfo(null);
    }
    
    setIsLoading(false);
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowUpDown className="h-5 w-5" />
          Transfer Money
        </CardTitle>
        <CardDescription>Send money to another ModernBank account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleTransfer} className="space-y-4">
          <div>
            <Label htmlFor="toAccountId">Recipient Account ID</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="toAccountId"
                type="text"
                placeholder="Enter recipient's account ID"
                value={toAccountId}
                onChange={(e) => {
                  setToAccountId(e.target.value);
                  setRecipientInfo(null);
                }}
                disabled={isLoading}
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAccountLookup}
                disabled={!toAccountId.trim()}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            {recipientInfo && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Recipient:</strong> {recipientInfo.ownerName}
                </p>
              </div>
            )}
          </div>
          
          <div>
            <Label htmlFor="transferAmount">Amount</Label>
            <Input
              id="transferAmount"
              type="number"
              step="0.01"
              min="0.01"
              max={currentUser?.balance || 0}
              placeholder="Enter amount to transfer"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-sm text-gray-600 mt-1">
              Available balance: ${currentUser?.balance.toFixed(2) || "0.00"}
            </p>
          </div>
          
          <div>
            <Label htmlFor="transferDescription">Description (Optional)</Label>
            <Input
              id="transferDescription"
              type="text"
              placeholder="e.g., Payment for dinner, Loan repayment"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={isLoading || !amount || !recipientInfo}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing Transfer...
              </>
            ) : (
              <>
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Transfer ${amount || "0.00"}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
