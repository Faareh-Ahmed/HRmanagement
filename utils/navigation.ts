import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  FolderOpen,
  Ticket,
  Users,
  Clock,
  Bell,
  UserCheck,
  Building,
  User,
  Settings,
} from 'lucide-react';

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: number;
  children?: NavigationItem[];
}

export const navigationItems: NavigationItem[] = [
  {
    name: 'Overview',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Meeting',
    href: '/meeting',
    icon: Calendar,
  },
  {
    name: 'Message',
    href: '/message',
    icon: MessageSquare,
    badge: 3,
  },
  {
    name: 'Project',
    href: '/project',
    icon: FolderOpen,
  },
  {
    name: 'Ticket',
    href: '/ticket',
    icon: Ticket,
  },
  {
    name: 'Employee',
    icon: Users,
    href: '/employee',
    children: [
      { name: 'Profile', href: '/employee', icon: Users },
      { name: 'Salary', href: '/employee/salary', icon: Users },
    ],
  },
  {
    name: 'Attendance',
    href: '/attendance',
    icon: Clock,
  },
  {
    name: 'Notice',
    href: '/notice',
    icon: Bell,
  },
  {
    name: 'HR Tab',
    href: '/hr-tab',
    icon: UserCheck,
  },
  {
    name: 'Organization',
    href: '/organization',
    icon: Building,
  },
  {
    name: 'Account',
    href: '/account',
    icon: User,
  },
  {
    name: 'Setting',
    href: '/setting',
    icon: Settings,
  },
];
