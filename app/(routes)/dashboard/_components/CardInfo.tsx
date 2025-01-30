import { PiggyBank, ReceiptText, Wallet } from 'lucide-react';
import React, { useEffect, useState, useCallback } from 'react';

interface BudgetItem {
  id: number;
  name: string;
  amount: string;
  icon: string | null;
  createdBy: string;
  totalSpend: number;
  totalItem: number;
}

const CardInfoSkeleton = () => {
  return (
    <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {[1, 2, 3].map((index) => (
        <div
          key={index}
          className="p-7 border rounded-lg flex gap-2 items-center justify-between animate-pulse"
        >
          <div>
            <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 w-32 bg-gray-200 rounded"></div>
          </div>
          <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
        </div>
      ))}
    </div>
  );
};

const CardInfo = ({ budgetList }: { budgetList: BudgetItem[] }) => {
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [totalSpend, setTotalSpend] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const CalculateCardInfo = useCallback(() => {
    console.log(budgetList);
    let totalBudget_ = 0;
    let totalSpend_ = 0;
    budgetList.forEach((element) => {
      totalBudget_ = totalBudget_ + Number(element.amount);
      totalSpend_ = totalSpend_ + Number(element.totalSpend);
    });
    setTotalBudget(totalBudget_);
    setTotalSpend(totalSpend_);
    console.log(totalBudget_, totalSpend_);
  }, [budgetList]);

  useEffect(() => {
    CalculateCardInfo();
  }, [budgetList, CalculateCardInfo]);

  useEffect(() => {
    if (budgetList) {
      setIsLoading(false);
    }
  }, [budgetList]);

  if (isLoading) {
    return <CardInfoSkeleton />;
  }

  return (
    <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div className="p-7 border rounded-lg flex  gap-2 items-center justify-between">
        <div>
          <h2 className="text-sm ">Total Budget</h2>
          <h2 className="font-bold text-2xl">₱{totalBudget}</h2>
        </div>
        <PiggyBank className="bg-primary text-white p-3 h-12 w-12 rounded-full" />
      </div>
      <div className="p-7 border rounded-lg flex  gap-2 items-center justify-between">
        <div>
          <h2 className="text-sm ">Total Spend</h2>
          <h2 className="font-bold text-2xl">₱{totalSpend}</h2>
        </div>
        <ReceiptText className="bg-primary text-white p-3 h-12 w-12 rounded-full" />
      </div>
      <div className="p-7 border rounded-lg flex  gap-2 items-center justify-between">
        <div>
          <h2 className="text-sm ">No. of Budget</h2>
          <h2 className="font-bold text-2xl">{budgetList?.length}</h2>
        </div>
        <Wallet className="bg-primary text-white p-3 h-12 w-12 rounded-full" />
      </div>
    </div>
  );
};

export default CardInfo;
