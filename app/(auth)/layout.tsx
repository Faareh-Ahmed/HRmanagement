
import React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex items-center justify-center min-h-screen bg-background">
      {children}
    </main>
  );
};

export default AuthLayout;