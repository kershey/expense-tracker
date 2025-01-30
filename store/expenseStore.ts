import { create } from 'zustand';
import { db } from '@/db';
import { Budgets, Expenses } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import moment from 'moment';

type Expense = typeof Expenses.$inferSelect;

interface ExpenseStore {
  expenses: Expense[];
  loading: boolean;
  getExpenses: (email: string) => Promise<void>;
  getExpensesByBudget: (budgetId: number) => Promise<void>;
  createExpense: (expense: {
    name: string;
    amount: string;
    budgetId: number;
  }) => Promise<void>;
  deleteExpense: (id: number, budgetId: number) => Promise<void>;
}

export const useExpenseStore = create<ExpenseStore>((set) => ({
  expenses: [],
  loading: false,
  // used to get all expenses for a user
  getExpenses: async (email: string) => {
    set({ loading: true });
    try {
      const result = await db
        .select()
        .from(Expenses)
        .innerJoin(Budgets, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, email))
        .orderBy(desc(Expenses.id));

      set({ expenses: result.map((r) => r.expenses) });
    } finally {
      set({ loading: false });
    }
  },
  // used to get all expenses for a budget
  getExpensesByBudget: async (budgetId: number) => {
    set({ loading: true });
    try {
      const result = await db
        .select()
        .from(Expenses)
        .where(eq(Expenses.budgetId, budgetId))
        .orderBy(desc(Expenses.id));

      set({ expenses: result });
    } finally {
      set({ loading: false });
    }
  },
  // used to create a new expense
  createExpense: async (expense: {
    name: string;
    amount: string;
    budgetId: number;
  }) => {
    set({ loading: true });
    try {
      await db.insert(Expenses).values({
        ...expense,
        createdAt: moment().format('DD/MM/YYYY'),
      });
      await useExpenseStore.getState().getExpensesByBudget(expense.budgetId);
    } finally {
      set({ loading: false });
    }
  },
  // used to delete an expense
  deleteExpense: async (id: number, budgetId: number) => {
    set({ loading: true });
    try {
      await db.delete(Expenses).where(eq(Expenses.id, id));
      await useExpenseStore.getState().getExpensesByBudget(budgetId);
    } finally {
      set({ loading: false });
    }
  },
}));
