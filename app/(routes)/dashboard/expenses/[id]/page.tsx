'use client';

import { db } from '@/db';
import { desc } from 'drizzle-orm';
import { Budgets, Expenses } from '@/db/schema';
import { getTableColumns, sql } from 'drizzle-orm';
import { eq, and } from 'drizzle-orm';
import * as React from 'react';
import { useUser } from '@clerk/nextjs';
import BudgetItem from '../../budgets/_components/BudgetItem';
import AddExpense from '../_components/AddExpense';
import ExpenseListTable from '../_components/ExpenseListTable';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import EditBudget from '../_components/EditBudget';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const ExpensesPage = ({ params }: Props) => {
  const [budgetInfo, setBudgetInfo] = React.useState<
    | (typeof Budgets.$inferSelect & { totalSpend: number; totalItem: number })
    | undefined
  >();

  const [expensesList, setExpensesList] = React.useState<
    (typeof Expenses.$inferSelect)[]
  >([]);

  const route = useRouter();

  const { id } = React.use(params);

  const { user } = useUser();

  /*
   * Get Expenses List
   */
  const getExpensesList = React.useCallback(async () => {
    const result = await db
      .select()
      .from(Expenses)
      .where(eq(Expenses.budgetId, Number(id)))
      .orderBy(desc(Expenses.id));

    setExpensesList(result);
    console.log(result);
  }, [id]);

  /*
   * Get Budget Info
   */
  const getBudgetInfo = React.useCallback(async () => {
    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(
        and(
          eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress ?? ''),
          eq(Budgets.id, Number(id))
        )
      )
      .groupBy(Budgets.id);

    setBudgetInfo(result[0]);
    getExpensesList();
    console.log(result);
  }, [id, user?.primaryEmailAddress?.emailAddress, getExpensesList]);

  /*
   * Delete Budget
   */

  const deleteBudget = async () => {
    const deleteExpenseResult = await db
      .delete(Expenses)
      .where(eq(Expenses.budgetId, Number(id)))
      .returning();

    if (deleteExpenseResult) {
      await db.delete(Budgets).where(eq(Budgets.id, Number(id)));
    }

    toast('Budget Deleted');
    route.replace('/dashboard/budgets');
  };

  React.useEffect(() => {
    if (user) {
      getBudgetInfo();
    }
  }, [user, getBudgetInfo]);

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold flex justify-between items-center">
        My Expenses
        <div className="flex gap-2">
          <EditBudget
            budgetInfo={budgetInfo}
            refreshData={() => getBudgetInfo()}
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="flex gap-2" variant="destructive">
                <Trash />
                Delete Budget
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your current budget along with all expenses and remove your
                  data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteBudget()}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-5">
        {budgetInfo ? (
          <BudgetItem budget={budgetInfo} />
        ) : (
          <div className="h-[150px] w-full bg-slate-300 rounded-lg animate-pulse"></div>
        )}
        <AddExpense
          budgetId={id}
          user={user}
          refreshData={() => getBudgetInfo()}
        />
      </div>
      <div>
        <ExpenseListTable
          expensesList={expensesList}
          refreshData={() => getBudgetInfo()}
        />
      </div>
    </div>
  );
};

export default ExpensesPage;
