import { create } from 'zustand';
import { db } from '@/db';
import { Budgets, Expenses } from '@/db/schema';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';

type Budget = typeof Budgets.$inferSelect & {
  totalSpend: number;
  totalItem: number;
};

interface BudgetStore {
  budgets: Budget[];
  loading: boolean;
  getBudgets: (email: string) => Promise<void>;
  createBudget: (budget: {
    name: string;
    amount: string;
    createdBy: string;
    icon: string;
  }) => Promise<void>;
  updateBudget: (
    id: number,
    budget: { name: string; amount: string; icon: string }
  ) => Promise<void>;
  deleteBudget: (id: number) => Promise<void>;
}

export const useBudgetStore = create<BudgetStore>((set) => ({
  budgets: [],
  loading: false,
  // used to get all budgets for a user
  getBudgets: async (email: string) => {
    set({ loading: true });
    try {
      const result = await db
        .select({
          ...getTableColumns(Budgets),
          totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
          totalItem: sql`count(${Expenses.id})`.mapWith(Number),
        })
        .from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, email))
        .groupBy(Budgets.id)
        .orderBy(desc(Budgets.id));

      set({ budgets: result });
    } finally {
      set({ loading: false });
    }
  },
  // used to create a new budget
  createBudget: async (budget: {
    name: string;
    amount: string;
    createdBy: string;
    icon: string;
  }) => {
    set({ loading: true });
    try {
      await db.insert(Budgets).values(budget);
      const email = budget.createdBy;
      await useBudgetStore.getState().getBudgets(email);
    } finally {
      set({ loading: false });
    }
  },
  // used to update a budget
  updateBudget: async (
    id: number,
    budget: { name: string; amount: string; icon: string }
  ) => {
    set({ loading: true });
    try {
      await db.update(Budgets).set(budget).where(eq(Budgets.id, id));
      const state = useBudgetStore.getState();
      const email = state.budgets.find((b: Budget) => b.id === id)?.createdBy;
      if (email) {
        await state.getBudgets(email);
      }
    } finally {
      set({ loading: false });
    }
  },
  // used to delete a budget
  deleteBudget: async (id: number) => {
    set({ loading: true });
    try {
      const state = useBudgetStore.getState();
      const email = state.budgets.find((b: Budget) => b.id === id)?.createdBy;
      await db.delete(Budgets).where(eq(Budgets.id, id));
      if (email) {
        await state.getBudgets(email);
      }
    } finally {
      set({ loading: false });
    }
  },
}));
