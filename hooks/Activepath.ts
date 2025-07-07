'use client';

import { usePathname } from 'next/navigation';
import { useCallback } from 'react';

export function useActivePath() {
  const pathname = usePathname();

  const isActivePath = useCallback((path: string) => {
    // Handle root path
    if (path === '/') {
      return pathname === '/';
    }

    // Handle employee salary
    if (path === '/employee/salary') {
      return pathname === '/employee/salary';
    }

    // Handle employee list (child) - only for dynamic profiles, NOT base route
    if (path === '/employee') {
      // Only highlight for dynamic employee profiles like /employee/FT-1751516379356
      return pathname.startsWith('/employee/') && 
             pathname !== '/employee' && 
             pathname !== '/employee/salary' &&
             pathname.split('/').length === 3;
    }

    // For all other paths, exact match
    return pathname === path;
  }, [pathname]);

  const isParentActive = useCallback((parentPath: string, children: any[]) => {
    if (parentPath === '/employee') {
      return pathname.startsWith('/employee');
    }
    return children.some(child => isActivePath(child.href));
  }, [pathname, isActivePath]);

  return { isActivePath, isParentActive };
}
