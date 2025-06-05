import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBankingStore } from "@/stores/bankingStore";
import { useToast } from "@/hooks/use-toast";
import { ArrowUpDown, Search, User, DollarSign, Tag, CheckCircle, AlertCircle } from "lucide-react";

interface TransferFormProps {
  onClose: () => void;
}

export const TransferForm = ({ onClose }: TransferFormProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState<{ id: string; name: string } | null>(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { currentUser, transfer, searchAccountsByName, formatCurrency } = useBankingStore();
  const { toast } = useToast();

  const searchResults = searchTerm.length >= 2 ? searchAccountsByName(searchTerm) : [];

  const categories = [
    "food", "bills", "entertainment", "shopping", "transport", 
    "healthcare", "education", "gift", "loan", "other"
  ];

  const handleRecipientSelect = (account: { id: string; ownerName: string }) => {
    setSelectedRecipient({ id: account.id, name: account.ownerName });
    setSearchTerm("");
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
        description: `You need ${formatCurrency(transferAmount - (currentUser?.balance || 0))} more to complete this transfer`,
        variant: "destructive",
      });
      return;
    }

    if (!selectedRecipient) {
      toast({
        title: "Select Recipient",
        description: "Please search and select a recipient for the transfer",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const success = transfer(
      selectedRecipient.id, 
      transferAmount, 
      description || `Transfer to ${selectedRecipient.name}`,
      category || 'transfer'
    );
    
    if (success) {
      toast({
        title: "Transfer Successful! 🎉",
        description: `${formatCurrency(transferAmount)} sent to ${selectedRecipient.name}`,
      });
      
      // Reset form and close
      setSelectedRecipient(null);
      setAmount("");
      setDescription("");
      setCategory("");
      onClose();
    }
    
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card className="hover:shadow-lg transition-all duration-300 animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <ArrowUpDown className="h-5 w-5 text-white" />
            </div>
            Transfer Money
          </CardTitle>
          <CardDescription>Send money to other UNI Bank users instantly</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTransfer} className="space-y-6">
            {/* Recipient Search */}
            <div className="space-y-3">
              <Label htmlFor="recipient" className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Select Recipient
              </Label>
              
              {selectedRecipient ? (
                <div className="flex items-center justify-between p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-green-800">{selectedRecipient.name}</p>
                      <p className="text-sm text-green-600">ID: {selectedRecipient.id}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedRecipient(null)}
                    className="text-green-700 border-green-300 hover:bg-green-100"
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="recipient"
                    type="text"
                    placeholder="Search by name (min 2 characters)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12"
                    disabled={isLoading}
                  />
                  
                  {searchTerm.length >= 2 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {searchResults.length > 0 ? (
                        searchResults.map((account) => (
                          <div
                            key={account.id}
                            onClick={() => handleRecipientSelect(account)}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-colors"
                          >
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">{account.ownerName}</p>
                              <p className="text-sm text-gray-500">{account.id}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center gap-3 p-3 text-gray-500">
                          <AlertCircle className="h-4 w-4" />
                          <span>No accounts found</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="transferAmount" className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Transfer Amount
              </Label>
              <Input
                id="transferAmount"
                type="number"
                step="0.01"
                min="0.01"
                max={currentUser?.balance || 0}
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-12 text-lg font-medium"
                disabled={isLoading}
              />
              <div className="flex justify-between text-sm">
                <p className="text-gray-600">
                  Available: {formatCurrency(currentUser?.balance || 0)}
                </p>
                {amount && (
                  <p className="font-medium text-blue-600">
                    Sending: {formatCurrency(parseFloat(amount) || 0)}
                  </p>
                )}
              </div>
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Category (Optional)
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      <span className="capitalize">{cat}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="transferDescription" className="text-sm font-medium">
                Description (Optional)
              </Label>
              <Input
                id="transferDescription"
                type="text"
                placeholder="e.g., Dinner payment, Loan repayment"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-12"
                disabled={isLoading}
              />
            </div>
            
            {/* Transfer Button */}
            <Button 
              type="submit" 
              className="w-full h-14 text-lg bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
              disabled={isLoading || !amount || !selectedRecipient}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Processing Transfer...
                </>
              ) : (
                <>
                  <ArrowUpDown className="h-5 w-5 mr-2" />
                  Transfer {amount ? formatCurrency(parseFloat(amount)) : formatCurrency(0)}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
