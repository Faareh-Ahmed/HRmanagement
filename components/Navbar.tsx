'use client';

import { useState } from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';

interface NavbarProps {
  onMobileMenuClick?: () => void;
}

export default function Navbar({ onMobileMenuClick }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount] = useState(3); // This would come from your state management

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search functionality here
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6">
      <div className="flex items-center justify-between h-12">
        {/* Left section - Mobile menu button and search */}
        <div className="flex items-center flex-1">
          {/* Mobile menu button */}
          <button
            onClick={onMobileMenuClick}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 mr-2"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search bar */}
          <div className="flex-1 max-w-lg">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search here"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Right section - Notifications and User Profile */}
        <div className="flex items-center space-x-4">
          {/* Notification Bell */}
          <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>

          {/* User Profile - Clerk UserButton */}
          <div className="flex items-center">
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                  userButtonPopoverCard: "shadow-lg border border-gray-200",
                  userButtonPopoverActionButton: "text-sm hover:bg-gray-50"
                }
              }}
              userProfileMode="navigation"
              userProfileUrl="/account"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
