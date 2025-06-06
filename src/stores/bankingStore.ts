import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  description: string;
  category?: string;
  date: string;
  fromAccount?: string;  // For transfer transactions
  toAccount?: string;    // For transfer transactions
}

export interface Account {
  id: string;
  ownerName: string;
  email: string;
  password: string; // Account password
  balance: number;
  transactions: Transaction[];
  createdAt: string;    // Add createdAt field
  accountType: 'checking' | 'savings';
  isLocked?: boolean;
  failedLoginAttempts?: number;
  lastLoginAttempt?: Date;
  hasAppPassword?: boolean;
}

interface BankingState {
  accounts: Account[];
  currentUser: Account | null;
  isLoading: boolean;
  appPassword: string | null; // App-level password
  isAppUnlocked: boolean;
  setAppPassword: (password: string) => void;
  verifyAppPassword: (password: string) => boolean;
  lockApp: () => void;
  createAccount: (ownerName: string, email: string, password: string, accountType: 'checking' | 'savings') => Promise<{ accountId: string; password: string }>;
  login: (accountId: string, password: string) => boolean;
  logout: () => void;
  deposit: (amount: number, description: string, category?: string) => void;
  withdraw: (amount: number, description: string, category?: string) => boolean;
  transfer: (toAccountId: string, amount: number, description: string, category?: string) => boolean;
  getAccount: (accountId: string) => Account | undefined;
  searchAccountsByName: (name: string) => Account[];
  formatCurrency: (amount: number) => string;
  unlockAccount: (accountId: string) => void;
  sendAccountIdEmail: (email: string, accountId: string, password: string) => Promise<boolean>;
}

// Helper function to generate account ID
const generateAccountId = (ownerName: string) => {
  const initials = ownerName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `${initials}-${randomNum}`;
};

// Helper function to generate transaction ID
const generateTransactionId = () => {
  return Math.random().toString(36).substring(2, 15);
};

// API URL configuration
const API_URL = ''; // Empty string for same-origin requests

// Real email sending function
const sendEmailWithAccountId = async (email: string, accountId: string, password: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/api/send-account-id`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, accountId, password }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};

// Initial demo account
const demoAccount: Account = {
  id: 'DEMO123456',
  ownerName: 'Demo User',
  email: 'demo@example.com',
  password: 'demo123',
  balance: 1000,
  accountType: 'checking',
  transactions: [
    {
      id: 'demo1',
      type: 'deposit',
      amount: 1000,
      description: 'Initial deposit',
      date: new Date().toISOString(),
      category: 'deposit'
    }
  ],
  isLocked: false,
  createdAt: new Date().toISOString()
};

export const useBankingStore = create<BankingState>()(
  persist(
    (set, get) => ({
      accounts: [demoAccount], // Initialize with demo account
      currentUser: null,
      isLoading: false,
      appPassword: null,
      isAppUnlocked: false,

      setAppPassword: (password: string) => {
        set({ appPassword: password, isAppUnlocked: true });
      },

      verifyAppPassword: (password: string) => {
        const { appPassword } = get();
        if (appPassword === password) {
          set({ isAppUnlocked: true });
          return true;
        }
        return false;
      },

      lockApp: () => {
        set({ isAppUnlocked: false, currentUser: null });
      },

      createAccount: async (ownerName: string, email: string, password: string, accountType: 'checking' | 'savings') => {
        const accountId = generateAccountId(ownerName);
        const newAccount: Account = {
          id: accountId,
          ownerName,
          email,
          password,
          balance: accountType === 'savings' ? 100 : 0,
          transactions: [],
          createdAt: new Date().toISOString(),
          accountType,
          failedLoginAttempts: 0,
        };

        set((state) => ({
          accounts: [...state.accounts, newAccount],
        }));

        // Return both accountId and password for display
        return { accountId, password };
      },

      login: (accountId: string, password: string) => {
        const account = get().accounts.find(acc => acc.id === accountId);
        
        if (!account) return false;
        
        // Check if account is locked
        if (account.isLocked) {
          const lockTime = account.lastLoginAttempt ? new Date(account.lastLoginAttempt) : new Date();
          const timeDiff = Date.now() - lockTime.getTime();
          if (timeDiff < 15 * 60 * 1000) { // 15 minutes lockout
            return false;
          } else {
            get().unlockAccount(accountId);
          }
        }
        
        if (account.password === password) {
          set((state) => ({
            accounts: state.accounts.map(acc =>
              acc.id === accountId
                ? { ...acc, failedLoginAttempts: 0, isLocked: false }
                : acc
            ),
            currentUser: { ...account, failedLoginAttempts: 0, isLocked: false },
          }));
          return true;
        } else {
          const failedAttempts = (account.failedLoginAttempts || 0) + 1;
          const shouldLock = failedAttempts >= 3;
          
          set((state) => ({
            accounts: state.accounts.map(acc =>
              acc.id === accountId
                ? {
                    ...acc,
                    failedLoginAttempts: failedAttempts,
                    isLocked: shouldLock,
                    lastLoginAttempt: new Date(),
                  }
                : acc
            ),
          }));
          return false;
        }
      },

      logout: () => {
        set({ currentUser: null });
      },

      deposit: (amount: number, description: string, category = 'deposit') => {
        const { currentUser } = get();
        if (!currentUser) return;

        const transaction: Transaction = {
          id: generateTransactionId(),
          type: 'deposit',
          amount,
          description,
          date: new Date().toISOString(),
          category,
        };

        set((state) => ({
          accounts: state.accounts.map(acc =>
            acc.id === currentUser.id
              ? {
                  ...acc,
                  balance: acc.balance + amount,
                  transactions: [transaction, ...acc.transactions],
                }
              : acc
          ),
          currentUser: {
            ...currentUser,
            balance: currentUser.balance + amount,
            transactions: [transaction, ...currentUser.transactions],
          },
        }));
      },

      withdraw: (amount: number, description: string, category = 'withdrawal') => {
        const { currentUser } = get();
        if (!currentUser || currentUser.balance < amount) return false;

        const transaction: Transaction = {
          id: generateTransactionId(),
          type: 'withdrawal',
          amount: -amount,
          description,
          date: new Date().toISOString(),
          category,
        };

        set((state) => ({
          accounts: state.accounts.map(acc =>
            acc.id === currentUser.id
              ? {
                  ...acc,
                  balance: acc.balance - amount,
                  transactions: [transaction, ...acc.transactions],
                }
              : acc
          ),
          currentUser: {
            ...currentUser,
            balance: currentUser.balance - amount,
            transactions: [transaction, ...currentUser.transactions],
          },
        }));

        return true;
      },

      transfer: (toAccountId: string, amount: number, description: string, category = 'transfer') => {
        const { currentUser, accounts } = get();
        if (!currentUser || currentUser.balance < amount) return false;

        const toAccount = accounts.find(acc => acc.id === toAccountId);
        if (!toAccount) return false;

        const transferOutTransaction: Transaction = {
          id: generateTransactionId(),
          type: 'transfer',
          amount: -amount,
          description: `Transfer to ${toAccount.ownerName} (${toAccountId})`,
          date: new Date().toISOString(),
          toAccount: toAccountId,
          category,
        };

        const transferInTransaction: Transaction = {
          id: generateTransactionId(),
          type: 'transfer',
          amount: amount,
          description: `Transfer from ${currentUser.ownerName} (${currentUser.id})`,
          date: new Date().toISOString(),
          fromAccount: currentUser.id,
          category,
        };

        set((state) => ({
          accounts: state.accounts.map(acc => {
            if (acc.id === currentUser.id) {
              return {
                ...acc,
                balance: acc.balance - amount,
                transactions: [transferOutTransaction, ...acc.transactions],
              };
            }
            if (acc.id === toAccountId) {
              return {
                ...acc,
                balance: acc.balance + amount,
                transactions: [transferInTransaction, ...acc.transactions],
              };
            }
            return acc;
          }),
          currentUser: {
            ...currentUser,
            balance: currentUser.balance - amount,
            transactions: [transferOutTransaction, ...currentUser.transactions],
          },
        }));

        return true;
      },

      getAccount: (accountId: string) => {
        return get().accounts.find(acc => acc.id === accountId);
      },

      searchAccountsByName: (name: string) => {
        const { accounts, currentUser } = get();
        return accounts.filter(acc => 
          (acc.ownerName.toLowerCase().includes(name.toLowerCase()) ||
           acc.id.toLowerCase().includes(name.toLowerCase())) && 
          acc.id !== currentUser?.id
        );
      },

      formatCurrency: (amount: number) => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(amount);
      },

      unlockAccount: (accountId: string) => {
        set((state) => ({
          accounts: state.accounts.map(acc =>
            acc.id === accountId
              ? { ...acc, isLocked: false, failedLoginAttempts: 0 }
              : acc
          ),
        }));
      },

      sendAccountIdEmail: async (email: string, accountId: string, password: string) => {
        try {
          const success = await sendEmailWithAccountId(email, accountId, password);
          return success;
        } catch (error) {
          console.error('Failed to send email:', error);
          return false;
        }
      },
    }),
    {
      name: 'banking-storage',
      partialize: (state) => ({
        accounts: state.accounts,
        appPassword: state.appPassword,
        isAppUnlocked: false, // Always start locked for security
      }),
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const data = JSON.parse(str);
          // Convert string dates back to Date objects
          if (data.state && data.state.accounts) {
            data.state.accounts = data.state.accounts.map((acc: any) => ({
              ...acc,
              createdAt: new Date(acc.createdAt),
              transactions: acc.transactions.map((t: any) => ({
                ...t,
                date: new Date(t.date)
              }))
            }));
          }
          return data;
        },
        setItem: (name, value) => localStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => localStorage.removeItem(name)
      }
    }
  )
);
