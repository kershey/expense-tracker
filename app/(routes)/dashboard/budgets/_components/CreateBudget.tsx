'use client';

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
import EmojiPicker from 'emoji-picker-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@clerk/nextjs';
import { useBudgetStore } from '@/store/budgetStore';

interface CreateBudgetProps extends React.HTMLAttributes<HTMLDivElement> {
  refreshData: () => Promise<void>;
}

const CreateBudget: React.FC<CreateBudgetProps> = React.forwardRef<
  HTMLDivElement,
  CreateBudgetProps
>(({ refreshData, ...props }: CreateBudgetProps, ref) => {
  const [emojiIcon, setEmojiIcon] = useState('😊');
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const { user } = useUser();
  const { createBudget } = useBudgetStore();

  const handleCreateBudget = async () => {
    if (user?.primaryEmailAddress?.emailAddress) {
      await createBudget({
        name,
        amount,
        createdBy: user.primaryEmailAddress.emailAddress,
        icon: emojiIcon,
      });
      setName('');
      setAmount('');
      setEmojiIcon('😊');
      await refreshData();
    }
  };

  return (
    <div ref={ref} {...props}>
      <Dialog>
        <DialogTrigger asChild>
          <div className="bg-slate-100 p-10 rounded-md items-center flex flex-col border-2 border-dashed cursor-pointer hover:shadow-md">
            <h2 className="text-3xl">+</h2>
            <h2>Create New Budget</h2>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Budget</DialogTitle>
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
              <h2 className="text-md text-black font-medium my-1">
                Budget Name
              </h2>
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
                onClick={handleCreateBudget}
              >
                Create Budget
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
});

CreateBudget.displayName = 'CreateBudget';

export default CreateBudget;
