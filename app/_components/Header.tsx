'use client';

import Image from 'next/image';
import React from 'react';
import logo from '@/public/logo.svg';
import { UserButton } from '@clerk/nextjs';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Header = () => {
  const { isSignedIn } = useAuth();

  return (
    <div className="flex p-5 justify-between items-center border shadow-sm">
      <Image src={logo} alt="logo" width={160} height={100} />
      {isSignedIn ? (
        <UserButton />
      ) : (
        <Button>
          <Link href="/sign-in">Get Started</Link>
        </Button>
      )}
    </div>
  );
};

export default Header;
