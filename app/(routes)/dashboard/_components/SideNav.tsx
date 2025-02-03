'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import logo from '@/public/logo.svg';
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';

const SideNav = () => {
  const menuList = [
    {
      id: 1,
      name: 'Dashboard',
      icon: LayoutGrid,
      path: '/dashboard',
    },
    {
      id: 2,
      name: 'Budgets',
      icon: PiggyBank,
      path: '/dashboard/budgets',
    },
    {
      id: 3,
      name: 'Expenses',
      icon: ReceiptText,
      path: '/dashboard/expenses',
    },
  ];

  const path = usePathname();

  useEffect(() => {
    console.log(path);
  }, [path]);

  return (
    <div className="h-screen p-5 border shadow-sm">
      <Image src={logo} alt="logo" width={100} height={100} />
      <div className="mt-10">
        {menuList.map((menu, index) => (
          <div key={index} className="gap-2">
            <Link href={menu.path}>
              <h2
                className={`flex gap-2 items-center font-medium p-3 cursor-pointer text-gray-900 hover:text-gray-500 hover:bg-gray-200 rounded-md ${
                  path === menu.path && 'text-primary bg-gray-200'
                }`}
              >
                <menu.icon />
                {menu.name}
              </h2>
            </Link>
          </div>
        ))}
        <div className="fixed bottom-10 p-5 flex gap-2 items-center">
          <UserButton />
          <p>Profile</p>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
