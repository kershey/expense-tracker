'use client';

import React, { useEffect, useCallback } from 'react';
import SideNav from './_components/SideNav';
import DashboardHeader from './_components/DashboardHeader';
import { db } from '@/db';
import { Budgets } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();

  const router = useRouter();

  const checkUserBudgets = useCallback(async () => {
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) return;

    const result = await db
      .select()
      .from(Budgets)
      .where(eq(Budgets.createdBy, email));

    console.log(result);

    if (result.length === 0) {
      router.replace('/dashboard/budgets');
    }
  }, [user, router]);

  useEffect(() => {
    if (user) {
      checkUserBudgets();
    }
  }, [user, checkUserBudgets]);

  return (
    <div>
      <div className="fixed md:w-64 hidden md:block ">
        <SideNav />
      </div>
      <div className="md:ml-64 ">
        <DashboardHeader />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
