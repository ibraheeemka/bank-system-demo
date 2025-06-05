import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'transfer';
  amount: number;
  description: string;
  timestamp: Date;
  fromAccount?: string;
  toAccount?: string;
  category?: string;
}

export interface Account {
  id: string;
  ownerName: string;
  email: string;
  password: string; // Account password
  balance: number;
  transactions: Transaction[];
  createdAt: Date;
  accountType: 'checking' | 'savings';
  isLocked?: boolean;
  failedLoginAttempts?: number;
  lastLoginAttempt?: Date;
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
  createAccount: (ownerName: string, email: string, password: string, accountType: 'checking' | 'savings') => Promise<string>;
  login: (accountId: string, password: string) => boolean;
  logout: () => void;
  deposit: (amount: number, description: string, category?: string) => void;
  withdraw: (amount: number, description: string, category?: string) => boolean;
  transfer: (toAccountId: string, amount: number, description: string, category?: string) => boolean;
  getAccount: (accountId: string) => Account | undefined;
  searchAccountsByName: (name: string) => Account[];
  formatCurrency: (amount: number) => string;
  unlockAccount: (accountId: string) => void;
  sendAccountIdEmail: (email: string, accountId: string) => Promise<boolean>;
}

const generateAccountId = (): string => {
  return 'ACC' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

const generateTransactionId = (): string => {
  return 'TXN' + Math.random().toString(36).substr(2, 12);
};

// Simulate email sending (in real app, this would call a backend API)
const simulateEmailSending = async (email: string, accountId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`📧 Email sent to ${email}: Your ModernBank Account ID is ${accountId}`);
      // In a real app, you would integrate with an email service like SendGrid, Mailgun, etc.
      resolve(true);
    }, 1000);
  });
};

export const useBankingStore = create<BankingState>()(
  persist(
    (set, get) => ({
      accounts: [],
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

      sendAccountIdEmail: async (email: string, accountId: string) => {
        try {
          const success = await simulateEmailSending(email, accountId);
          return success;
        } catch (error) {
          console.error('Failed to send email:', error);
          return false;
        }
      },

      createAccount: async (ownerName: string, email: string, password: string, accountType: 'checking' | 'savings') => {
        const accountId = generateAccountId();
        const newAccount: Account = {
          id: accountId,
          ownerName,
          email,
          password,
          balance: accountType === 'savings' ? 100 : 0,
          transactions: [],
          createdAt: new Date(),
          accountType,
          failedLoginAttempts: 0,
        };

        set((state) => ({
          accounts: [...state.accounts, newAccount],
        }));

        // Send account ID to email
        await get().sendAccountIdEmail(email, accountId);

        return accountId;
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
          timestamp: new Date(),
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
          type: 'withdraw',
          amount,
          description,
          timestamp: new Date(),
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
          timestamp: new Date(),
          toAccount: toAccountId,
          category,
        };

        const transferInTransaction: Transaction = {
          id: generateTransactionId(),
          type: 'transfer',
          amount: amount,
          description: `Transfer from ${currentUser.ownerName} (${currentUser.id})`,
          timestamp: new Date(),
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
          acc.ownerName.toLowerCase().includes(name.toLowerCase()) && 
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
    }),
    {
      name: 'banking-storage',
    }
  )
);
