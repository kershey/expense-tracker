'use client';

import React, { useEffect, useState, useCallback } from 'react';
import CreateBudget from './CreateBudget'; // ✅ Import should be correct
import { Budgets, Expenses } from '@/db/schema';
import { db } from '@/db';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { useUser } from '@clerk/nextjs';
import BudgetItem from './BudgetItem';
import Link from 'next/link';

const BudgetList: React.FC = () => {
  const [budgetList, setBudgetList] = useState<
    (typeof Budgets.$inferSelect & {
      totalSpend: number;
      totalItem: number;
    })[]
  >([]);

  const { user } = useUser();

  const getBudgetList = useCallback(async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    try {
      const result = await db
        .select({
          ...getTableColumns(Budgets),
          totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
          totalItem: sql`count(${Expenses.id})`.mapWith(Number),
        })
        .from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, user.primaryEmailAddress.emailAddress))
        .groupBy(Budgets.id)
        .orderBy(desc(Budgets.id));

      setBudgetList(result);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      getBudgetList();
    }
  }, [user, getBudgetList]);

  return (
    <div className="mt-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* ✅ Ensure CreateBudget is used correctly */}
        <CreateBudget refreshData={getBudgetList} />

        {budgetList.length > 0
          ? budgetList.map((budget) => (
              <Link key={budget.id} href={`/dashboard/expenses/${budget.id}`}>
                <div>
                  <BudgetItem budget={budget} />
                </div>
              </Link>
            ))
          : Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="w-full bg-slate-200 rounded-lg h-[150px] animate-pulse"
              ></div>
            ))}
      </div>
    </div>
  );
};

export default BudgetList;
