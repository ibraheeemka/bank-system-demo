
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
}

export interface Account {
  id: string;
  ownerName: string;
  balance: number;
  transactions: Transaction[];
  createdAt: Date;
}

interface BankingState {
  accounts: Account[];
  currentUser: Account | null;
  isLoading: boolean;
  createAccount: (ownerName: string) => string;
  login: (accountId: string) => boolean;
  logout: () => void;
  deposit: (amount: number, description: string) => void;
  withdraw: (amount: number, description: string) => boolean;
  transfer: (toAccountId: string, amount: number, description: string) => boolean;
  getAccount: (accountId: string) => Account | undefined;
}

const generateAccountId = (): string => {
  return Math.random().toString(36).substr(2, 9).toUpperCase();
};

const generateTransactionId = (): string => {
  return Math.random().toString(36).substr(2, 12);
};

export const useBankingStore = create<BankingState>()(
  persist(
    (set, get) => ({
      accounts: [],
      currentUser: null,
      isLoading: false,

      createAccount: (ownerName: string) => {
        const accountId = generateAccountId();
        const newAccount: Account = {
          id: accountId,
          ownerName,
          balance: 0,
          transactions: [],
          createdAt: new Date(),
        };

        set((state) => ({
          accounts: [...state.accounts, newAccount],
        }));

        return accountId;
      },

      login: (accountId: string) => {
        const account = get().accounts.find(acc => acc.id === accountId);
        if (account) {
          set({ currentUser: account });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ currentUser: null });
      },

      deposit: (amount: number, description: string) => {
        const { currentUser } = get();
        if (!currentUser) return;

        const transaction: Transaction = {
          id: generateTransactionId(),
          type: 'deposit',
          amount,
          description,
          timestamp: new Date(),
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

      withdraw: (amount: number, description: string) => {
        const { currentUser } = get();
        if (!currentUser || currentUser.balance < amount) return false;

        const transaction: Transaction = {
          id: generateTransactionId(),
          type: 'withdraw',
          amount,
          description,
          timestamp: new Date(),
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

      transfer: (toAccountId: string, amount: number, description: string) => {
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
        };

        const transferInTransaction: Transaction = {
          id: generateTransactionId(),
          type: 'transfer',
          amount: amount,
          description: `Transfer from ${currentUser.ownerName} (${currentUser.id})`,
          timestamp: new Date(),
          fromAccount: currentUser.id,
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
    }),
    {
      name: 'banking-storage',
    }
  )
);
