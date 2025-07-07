'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { navigationItems } from '../utils/navigation';
import { useActivePath } from '../hooks/Activepath';
import { cn } from '../lib/utils';

// Define props
interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isActivePath, isParentActive } = useActivePath();

  const SidebarContent = () => (
    <nav className="flex flex-col gap-2 px-4 py-6">
      {navigationItems.map((item) => {
        if (item.children) {
          const parentActive = isParentActive(item.href, item.children);
          
          return (
            <div key={item.name} className="flex flex-col">
              {/* Parent link */}
              <Link
                href={item.href!}
                className={cn(
                  'flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors',
                  parentActive
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                )}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onClose?.();
                }}
              >
                <item.icon className={cn('w-5 h-5', parentActive ? 'text-white' : 'text-blue-600')} />
                <span className="flex-1">{item.name}</span>
              </Link>
              
              {/* Children links */}
              <div className="ml-8 flex flex-col mt-1">
                {item.children.map((child) => {
                  const childActive = isActivePath(child.href);
                  
                  return (
                    <Link
                      key={child.href}
                      href={child.href!}
                      className={cn(
                        'flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-sm',
                        childActive
                          ? 'bg-blue-100 text-blue-700 border-l-2 border-blue-600'
                          : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                      )}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onClose?.();
                      }}
                    >
                      {child.icon && (
                        <child.icon className={cn('w-4 h-4', childActive ? 'text-blue-600' : 'text-gray-500')} />
                      )}
                      <span className="flex-1">{child.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        }
        
        // Non-dropdown items
        const itemActive = isActivePath(item.href);
        
        return (
          <Link
            key={item.href}
            href={item.href!}
            className={cn(
              'flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors',
              itemActive
                ? 'bg-blue-600 text-white shadow'
                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
            )}
            onClick={() => {
              setIsMobileMenuOpen(false);
              onClose?.();
            }}
          >
            <item.icon className={cn('w-5 h-5', itemActive ? 'text-white' : 'text-blue-600')} />
            <span className="flex-1">{item.name}</span>
            {item.badge && (
              <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          {/* Sidebar panel */}
          <div className="relative flex flex-col w-64 bg-white h-full shadow-xl z-50">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-label="Close sidebar"
              >
                <X className="h-6 w-6 text-gray-700" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <SidebarContent />
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-white border-r shadow-sm">
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Optional: Add logo or header here */}
          <div className="h-16 flex items-center px-6 font-bold text-blue-700 text-lg tracking-wide">
            HR System
          </div>
          <SidebarContent />
        </div>
      </aside>
      {/* For layout spacing on desktop */}
      <div className="hidden md:block md:w-64 md:flex-shrink-0" aria-hidden="true" />
    </>
  );
}
