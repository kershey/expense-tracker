'use client';

import { Button } from '@/components/ui/button';
import { PenBox } from 'lucide-react';
import React, { useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import EmojiPicker from 'emoji-picker-react';
import { Budgets } from '@/db/schema';
import { useBudgetStore } from '@/store/budgetStore';

type Budget = typeof Budgets.$inferSelect & {
  totalSpend: number;
  totalItem: number;
};

type EditBudgetProps = {
  budgetInfo: Budget | undefined;
  refreshData: () => Promise<void>;
};

const EditBudget = ({ budgetInfo, refreshData }: EditBudgetProps) => {
  const [emojiIcon, setEmojiIcon] = useState(budgetInfo?.icon ?? '😊');
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [name, setName] = useState(budgetInfo?.name ?? '');
  const [amount, setAmount] = useState(budgetInfo?.amount ?? 0);

  const { updateBudget } = useBudgetStore();

  const handleUpdateBudget = async () => {
    if (budgetInfo?.id) {
      await updateBudget(budgetInfo.id, {
        name,
        amount: amount.toString(),
        icon: emojiIcon,
      });
      await refreshData();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <PenBox className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Budget</DialogTitle>
        </DialogHeader>
        <div className="mt-5">
          <div>
            <h2 className="text-md text-black font-medium my-1">Icon</h2>
            <div
              onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
              className="text-3xl p-3 bg-slate-100 w-fit rounded-md cursor-pointer"
            >
              {emojiIcon}
            </div>
            {openEmojiPicker && (
              <div className="absolute">
                <EmojiPicker
                  onEmojiClick={(emoji) => {
                    setEmojiIcon(emoji.emoji);
                    setOpenEmojiPicker(false);
                  }}
                />
              </div>
            )}
          </div>
          <div className="mt-3">
            <h2 className="text-md text-black font-medium my-1">Budget Name</h2>
            <Input
              placeholder="e.g. Food & Drinks"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mt-3">
            <h2 className="text-md text-black font-medium my-1">
              Budget Amount
            </h2>
            <Input
              type="number"
              placeholder="e.g. ₱1000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              className="mt-5 w-full"
              disabled={!name || !amount}
              onClick={handleUpdateBudget}
            >
              Update Budget
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditBudget;
