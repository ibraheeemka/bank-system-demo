import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBankingStore } from "@/stores/bankingStore";
import { TrendingUp, TrendingDown, ArrowUpDown, Wallet, PiggyBank, CreditCard } from "lucide-react";

export const AccountOverview = () => {
  const { currentUser, formatCurrency } = useBankingStore();

  if (!currentUser) return null;

  const recentTransactions = currentUser.transactions.slice(0, 5);
  
  const totalDeposits = currentUser.transactions
    .filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalWithdrawals = currentUser.transactions
    .filter(t => t.type === 'withdraw')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalTransfers = currentUser.transactions
    .filter(t => t.type === 'transfer')
    .length;

  const getAccountTypeIcon = () => {
    return currentUser.accountType === 'savings' ? PiggyBank : CreditCard;
  };

  // Dynamic text size based on balance amount
  const getBalanceTextSize = (balance: number) => {
    const balanceStr = Math.abs(balance).toString();
    if (balanceStr.length <= 6) return "text-3xl"; // Up to $999,999
    if (balanceStr.length <= 9) return "text-2xl"; // Up to $999,999,999
    if (balanceStr.length <= 12) return "text-xl"; // Up to $999,999,999,999
    return "text-lg"; // Larger amounts
  };

  // Compact currency format for very large numbers
  const formatCompactCurrency = (amount: number) => {
    const absAmount = Math.abs(amount);
    if (absAmount >= 1e12) {
      return `$${(amount / 1e12).toFixed(1)}T`;
    } else if (absAmount >= 1e9) {
      return `$${(amount / 1e9).toFixed(1)}B`;
    } else if (absAmount >= 1e6) {
      return `$${(amount / 1e6).toFixed(1)}M`;
    } else if (absAmount >= 1e3) {
      return `$${(amount / 1e3).toFixed(1)}K`;
    }
    return formatCurrency(amount);
  };

  const AccountIcon = getAccountTypeIcon();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Account Type Banner */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <AccountIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold capitalize">
                  {currentUser.accountType} Account
                </h3>
                <p className="text-white/80">Account ID: {currentUser.id}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm">Current Balance</p>
              <div className="flex flex-col items-end">
                <p className={`font-bold ${getBalanceTextSize(currentUser.balance)}`}>
                  {formatCurrency(currentUser.balance)}
                </p>
                {currentUser.balance >= 1000 && (
                  <p className="text-white/70 text-xs">
                    ({formatCompactCurrency(currentUser.balance)})
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-600 truncate">Available Balance</p>
                <div className="space-y-1">
                  <p className={`font-bold text-gray-900 ${getBalanceTextSize(currentUser.balance)}`}>
                    {currentUser.balance >= 1000000 ? formatCompactCurrency(currentUser.balance) : formatCurrency(currentUser.balance)}
                  </p>
                  {currentUser.balance >= 1000000 && (
                    <p className="text-xs text-gray-500">
                      {formatCurrency(currentUser.balance)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-600 truncate">Total Deposits</p>
                <div className="space-y-1">
                  <p className={`font-bold text-gray-900 ${getBalanceTextSize(totalDeposits)}`}>
                    {totalDeposits >= 1000000 ? formatCompactCurrency(totalDeposits) : formatCurrency(totalDeposits)}
                  </p>
                  {totalDeposits >= 1000000 && (
                    <p className="text-xs text-gray-500">
                      {formatCurrency(totalDeposits)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-600 truncate">Total Withdrawals</p>
                <div className="space-y-1">
                  <p className={`font-bold text-gray-900 ${getBalanceTextSize(totalWithdrawals)}`}>
                    {totalWithdrawals >= 1000000 ? formatCompactCurrency(totalWithdrawals) : formatCurrency(totalWithdrawals)}
                  </p>
                  {totalWithdrawals >= 1000000 && (
                    <p className="text-xs text-gray-500">
                      {formatCurrency(totalWithdrawals)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <ArrowUpDown className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Transfers</p>
                <p className="text-2xl font-bold text-gray-900">{totalTransfers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            Recent Activity
          </CardTitle>
          <CardDescription>Your latest transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {recentTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">No transactions yet</p>
              <p className="text-gray-400 text-sm">Start by making a deposit or transfer</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction, index) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-150 transition-all duration-300 transform hover:scale-102"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${
                      transaction.type === 'deposit' ? 'bg-green-100' :
                      transaction.type === 'withdraw' ? 'bg-red-100' : 'bg-purple-100'
                    }`}>
                      {transaction.type === 'deposit' && <TrendingUp className="h-5 w-5 text-green-600" />}
                      {transaction.type === 'withdraw' && <TrendingDown className="h-5 w-5 text-red-600" />}
                      {transaction.type === 'transfer' && <ArrowUpDown className="h-5 w-5 text-purple-600" />}
                    </div>
                    <div>
                      <p className="font-semibold capitalize text-gray-900">{transaction.type}</p>
                      <p className="text-sm text-gray-600 truncate max-w-48">{transaction.description}</p>
                      {transaction.category && (
                        <p className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full inline-block mt-1">
                          {transaction.category}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="space-y-1">
                      <p className={`font-bold ${
                        transaction.type === 'deposit' || 
                        (transaction.type === 'transfer' && transaction.fromAccount !== currentUser.id)
                          ? 'text-green-600'  // Deposits and received transfers in green
                          : 'text-red-600'    // Withdrawals and sent transfers in red
                      } ${getBalanceTextSize(Math.abs(transaction.amount))}`}>
                        {transaction.amount > 0 ? '+' : '-'}${Math.abs(transaction.amount) >= 1000000 ? 
                          formatCompactCurrency(Math.abs(transaction.amount)) : 
                          formatCurrency(Math.abs(transaction.amount))
                        }
                      </p>
                      {Math.abs(transaction.amount) >= 1000000 && (
                        <p className="text-xs text-gray-500">
                          {formatCurrency(Math.abs(transaction.amount))}
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
