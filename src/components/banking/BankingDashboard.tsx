import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBankingStore } from "@/stores/bankingStore";
import { AccountOverview } from "./AccountOverview";
import { TransactionForm } from "./TransactionForm";
import { TransactionHistory } from "./TransactionHistory";
import { TransferForm } from "./TransferForm";
import { LogOut, CreditCard, ArrowUpDown, History, PlusCircle } from "lucide-react";
import { DepositForm } from "./DepositForm";
import { WithdrawForm } from "./WithdrawForm";

export const BankingDashboard = () => {
  const { currentUser, logout } = useBankingStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Calculate totals
  const totalDeposits = currentUser?.transactions
    .filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0) || 0;

  const totalWithdrawals = Math.abs(currentUser?.transactions
    .filter(t => t.type === 'withdraw')
    .reduce((sum, t) => sum + t.amount, 0) || 0);

  const totalTransfersSent = Math.abs(currentUser?.transactions
    .filter(t => t.type === 'transfer' && t.fromAccount === currentUser.id)
    .reduce((sum, t) => sum + t.amount, 0) || 0);

  const totalTransfersReceived = currentUser?.transactions
    .filter(t => t.type === 'transfer' && t.toAccount === currentUser.id)
    .reduce((sum, t) => sum + t.amount, 0) || 0;

  const totalActivity = totalDeposits + totalWithdrawals;

  const formatCurrency = (amount: number) => {
    return amount.toFixed(2);
  };

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🏦 UNI Bank</h1>
            <p className="text-sm text-gray-600">Welcome back, {currentUser.ownerName}</p>
          </div>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Main Balance Card */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle>Available Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600">
                ${formatCurrency(currentUser?.balance || 0)}
              </div>
            </CardContent>
          </Card>

          {/* Transaction Summary */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle>Transaction Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total Deposits</p>
                  <p className="text-xl font-semibold text-purple-600">${formatCurrency(totalDeposits)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Withdrawals</p>
                  <p className="text-xl font-semibold text-red-600">${formatCurrency(totalWithdrawals)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Transfers Sent</p>
                  <p className="text-xl font-semibold text-blue-600">${formatCurrency(totalTransfersSent)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Transfers Received</p>
                  <p className="text-xl font-semibold text-emerald-600">${formatCurrency(totalTransfersReceived)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowDepositForm(true)}
            >
              Deposit
            </Button>
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => setShowWithdrawForm(true)}
            >
              Withdraw
            </Button>
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => setShowTransferForm(true)}
            >
                  Transfer
            </Button>
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => setShowHistory(true)}
            >
                  History
            </Button>
          </div>

          {/* Transaction History */}
          {showHistory && (
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentUser.transactions.sort((a, b) => 
                    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                  ).map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <div className={`font-semibold ${
                        transaction.type === 'deposit' || 
                        (transaction.type === 'transfer' && transaction.toAccount === currentUser.id)
                          ? 'text-green-600'  // Deposits and received transfers in green
                          : 'text-red-600'    // Withdrawals and sent transfers in red
                      }`}>
                        {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Account Information */}
          <Card className="bg-white shadow-lg">
              <CardHeader>
              <CardTitle>Account Information</CardTitle>
              </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Account Holder</p>
                  <p className="font-medium">{currentUser.ownerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account ID</p>
                  <p className="font-medium">{currentUser.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Type</p>
                  <p className="font-medium capitalize">{currentUser.accountType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium">
                    {new Date(currentUser.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* App Password Section */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">App Password Protection</p>
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => window.location.href = '/app-password'}
                  >
                    {currentUser.hasAppPassword ? 'Change App Password' : 'Set Up App Password'}
                  </Button>
                </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      {/* Forms */}
      {showDepositForm && (
        <DepositForm onClose={() => setShowDepositForm(false)} />
      )}
      {showWithdrawForm && (
        <WithdrawForm onClose={() => setShowWithdrawForm(false)} />
      )}
      {showTransferForm && (
        <TransferForm onClose={() => setShowTransferForm(false)} />
      )}
    </div>
  );
};
