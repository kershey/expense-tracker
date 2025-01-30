import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/db';
import { Expenses } from '@/db/schema';
import { UserResource } from '@clerk/types';
import React, { useState } from 'react';
import moment from 'moment';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';

type AddExpenseProps = {
  budgetId: string;
  user: UserResource | null | undefined;
  refreshData: () => void;
};

const AddExpense = ({ budgetId, refreshData }: AddExpenseProps) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const addNewExpense = async () => {
    setLoading(true);
    const result = await db
      .insert(Expenses)
      .values({
        name,
        amount: amount.toString(),
        budgetId: Number(budgetId),
        createdAt: moment().format('DD/MM/YYYY'),
      })
      .returning({ insertedId: Expenses.id });

    if (result) {
      setLoading(false);
      refreshData();
      toast('New Expense Added');
      setName('');
      setAmount('');
    }
    setLoading(false);
  };

  return (
    <div className="border p-5 rounded-lg">
      <h2 className="font-bold text-lg">Add Expense</h2>
      <div className="mt-3">
        <h2 className="text-md text-black font-medium my-1">Expense Name</h2>
        <Input
          placeholder="e.g. Home Decor"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mt-3">
        <h2 className="text-md text-black font-medium my-1">Expense Amount</h2>
        <Input
          type="number"
          placeholder="e.g. ₱1000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <Button
        onClick={(e) => {
          e.preventDefault();
          addNewExpense();
        }}
        disabled={!name || !amount || loading}
        className="mt-3 w-full"
      >
        {loading ? <Loader className="animate-spin" /> : 'Add New Expense'}
      </Button>
    </div>
  );
};

export default AddExpense;
