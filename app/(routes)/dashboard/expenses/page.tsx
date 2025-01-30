'use client';

import React from 'react';
import { useUser } from '@clerk/nextjs';
import ExpenseListTable from './_components/ExpenseListTable';
import { useExpenseStore } from '@/store/expenseStore';

const ExpensesPage = () => {
  const { user } = useUser();
  const { expenses, getExpenses } = useExpenseStore();

  React.useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      getExpenses(user.primaryEmailAddress.emailAddress);
    }
  }, [user, getExpenses]);

  return (
    <div className="p-7">
      <h2 className="font-bold text-2xl">My Expenses</h2>
      <ExpenseListTable
        expensesList={expenses}
        refreshData={() =>
          getExpenses(user?.primaryEmailAddress?.emailAddress ?? '')
        }
      />
    </div>
  );
};

export default ExpensesPage;
