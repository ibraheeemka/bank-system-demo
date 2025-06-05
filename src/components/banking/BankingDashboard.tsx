
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

export const BankingDashboard = () => {
  const { currentUser, logout } = useBankingStore();
  const [activeTab, setActiveTab] = useState("overview");

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🏦 ModernBank</h1>
            <p className="text-sm text-gray-600">Welcome back, {currentUser.ownerName}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="transaction" className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Transaction
                </TabsTrigger>
                <TabsTrigger value="transfer" className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  Transfer
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <AccountOverview />
              </TabsContent>

              <TabsContent value="transaction">
                <TransactionForm />
              </TabsContent>

              <TabsContent value="transfer">
                <TransferForm />
              </TabsContent>

              <TabsContent value="history">
                <TransactionHistory />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  ${currentUser.balance.toFixed(2)}
                </div>
                <p className="text-sm text-gray-600 mt-1">Available Balance</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Account ID</p>
                  <p className="font-mono font-semibold">{currentUser.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Account Holder</p>
                  <p className="font-semibold">{currentUser.ownerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="font-semibold">
                    {new Date(currentUser.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};
