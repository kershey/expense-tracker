'use client';

import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Budgets } from '@/db/schema';
import Link from 'next/link';

type Budget = typeof Budgets.$inferSelect & {
  totalSpend: number;
  totalItem: number;
};

type BudgetItemProps = {
  budget: Budget;
};

const BudgetItem = ({ budget }: BudgetItemProps) => {
  const percentage = (budget.totalSpend / Number(budget.amount)) * 100;

  return (
    <Link href={`/dashboard/expenses/${budget.id}`}>
      <div className="p-5 border rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-sm text-black font-medium">{budget.name}</h2>
            <h2 className="text-sm text-black">₱{budget.amount}</h2>
          </div>
          <div className="text-2xl">{budget.icon}</div>
        </div>
        <div className="mt-3">
          <Progress value={percentage} />
        </div>
        <div className="flex justify-between items-center mt-3">
          <h2 className="text-sm text-black">
            ₱{budget.totalSpend || 0} spent
          </h2>
          <h2 className="text-sm text-black">{budget.totalItem || 0} items</h2>
        </div>
      </div>
    </Link>
  );
};

export default BudgetItem;
