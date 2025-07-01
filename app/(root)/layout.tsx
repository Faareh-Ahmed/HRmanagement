
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import React from 'react';
import '../globals.css';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <header className="flex justify-end items-center p-4 gap-4 h-16 border-b">
        <SignedOut>
          <SignInButton />
          <SignUpButton>
            <button className=" text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <main>{children}</main>
    </>
  );
};

export default MainLayout;