'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Expenses } from '@/db/schema';
import { Trash } from 'lucide-react';
import { useExpenseStore } from '@/store/expenseStore';

type ExpenseListTableProps = {
  expensesList: (typeof Expenses.$inferSelect)[];
  refreshData: () => void;
};

const ExpenseListTable = ({
  expensesList,
  refreshData,
}: ExpenseListTableProps) => {
  const { deleteExpense } = useExpenseStore();

  const handleDelete = async (expense: typeof Expenses.$inferSelect) => {
    if (
      typeof expense.id === 'number' &&
      typeof expense.budgetId === 'number'
    ) {
      await deleteExpense(expense.id, expense.budgetId);
      refreshData();
    }
  };

  return (
    <div className="mt-5">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expensesList.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>{expense.name}</TableCell>
              <TableCell>₱{expense.amount}</TableCell>
              <TableCell>{expense.createdAt}</TableCell>
              <TableCell>
                <Trash
                  className="w-4 h-4 text-red-500 cursor-pointer"
                  onClick={() => handleDelete(expense)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExpenseListTable;
