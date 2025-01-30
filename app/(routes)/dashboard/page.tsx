'use client';

import React, { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import CardInfo from './_components/CardInfo';
import BarChartDashboard from './_components/BarChartDashboard';
import BudgetItem from './budgets/_components/BudgetItem';
import ExpenseListTable from './expenses/_components/ExpenseListTable';
import { useBudgetStore } from '@/store/budgetStore';
import { useExpenseStore } from '@/store/expenseStore';

const Dashboard = () => {
  const { user } = useUser();
  const { budgets, getBudgets } = useBudgetStore();
  const { expenses, getExpenses } = useExpenseStore();

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      const email = user.primaryEmailAddress.emailAddress;
      getBudgets(email);
      getExpenses(email);
    }
  }, [user, getBudgets, getExpenses]);

  return (
    <div className="p-7">
      <h2 className="font-bold text-2xl">Hi, {user?.firstName} 👋🏻</h2>
      <p className="text-sm text-gray-500">
        Here&apos;s what happening with your money, Let&apos;s manage your
        expenses
      </p>
      <CardInfo budgetList={budgets} />
      <div className="grid grid-cols-1 md:grid-cols-3 mt-6 gap-5">
        <div className="md:col-span-2">
          <BarChartDashboard budgetList={budgets} />
          <ExpenseListTable
            expensesList={expenses}
            refreshData={() =>
              getExpenses(user?.primaryEmailAddress?.emailAddress ?? '')
            }
          />
        </div>
        <div className="grid gap-3">
          <h2 className="text-lg font-bold">Latest Budgets</h2>
          {budgets.map((budget, index) => (
            <BudgetItem budget={budget} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
