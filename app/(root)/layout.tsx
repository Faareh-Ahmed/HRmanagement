'use client';

import { ClerkProvider, SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs';
import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import '../globals.css';

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        {/* Mobile sidebar overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 flex z-40 md:hidden">
            <div 
              className="fixed inset-0 bg-gray-600 bg-opacity-75" 
              onClick={() => setIsMobileMenuOpen(false)} 
            />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Desktop sidebar */}
        <Sidebar />
        
        {/* Main content area */}
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          <Navbar onMobileMenuClick={() => setIsMobileMenuOpen(true)} />
          
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-gray-50">
          <SignedOut>
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
              <div className="max-w-md w-full space-y-8">
                <div>
                  <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    HR Management System
                  </h2>
                  <p className="mt-2 text-center text-sm text-gray-600">
                    Please sign in to continue
                  </p>
                </div>
                <div className="flex flex-col space-y-4">
                  <SignInButton mode="modal">
                    <button className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Sign Up
                    </button>
                  </SignUpButton>
                </div>
              </div>
            </div>
          </SignedOut>

          <SignedIn>
            <AuthenticatedLayout>{children}</AuthenticatedLayout>
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
}
