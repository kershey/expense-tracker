import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Budgets } from '@/db/schema';

type Budget = typeof Budgets.$inferSelect & {
  totalSpend: number;
  totalItem: number;
};

const BarChartDashboard = ({ budgetList }: { budgetList: Budget[] }) => {
  const chartData = budgetList.map((budget) => ({
    name: budget.name,
    totalSpend: budget.totalSpend || 0,
    amount: Number(budget.amount) || 0,
  }));

  return (
    <div className="border border-lg p-5 w-full">
      <h2 className="text-lg font-bold">Activity</h2>
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalSpend" stackId="a" fill="#000000" />
            <Bar dataKey="amount" stackId="a" fill="#878282" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartDashboard;
