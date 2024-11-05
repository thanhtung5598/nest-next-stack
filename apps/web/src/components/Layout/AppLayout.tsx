'use client';

import { PropsWithChildren } from 'react';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { AppProvider, type Navigation } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Notification } from './Notification';
import PeopleIcon from '@mui/icons-material/People';
import DevicesIcon from '@mui/icons-material/Devices';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { usePathname, useRouter } from 'next/navigation';
import { ROUTE } from '@/libs/enum';
import GroupIcon from '@mui/icons-material/Group';
import CategoryIcon from '@mui/icons-material/Category';
import StoreIcon from '@mui/icons-material/Store';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useMe } from '@/data/user';

const ADMIN_NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Overview',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Users & Devices',
  },
  {
    segment: 'users',
    title: 'Manage Users',
    icon: <PeopleIcon />,
  },
  {
    segment: 'devices',
    title: 'Manage Devices',
    icon: <DevicesIcon />,
  },
  {
    kind: 'header',
    title: 'Resource Management',
  },
  {
    segment: 'brand',
    title: 'Brand',
    icon: <StoreIcon />,
  },
  {
    segment: 'category',
    title: 'Category',
    icon: <CategoryIcon />,
  },
  {
    segment: 'department',
    title: 'Department',
    icon: <GroupIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Borrowing Management',
  },
  {
    segment: 'borrow-request',
    title: 'Borrow Requests',
    icon: <AddShoppingCartIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Notifications',
  },
  {
    segment: 'notifications',
    title: 'Notifications',
    icon: <NotificationsIcon />,
  },
];

const USER_NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Profile',
  },
  {
    segment: 'profile',
    title: 'Profile',
    icon: <AccountCircleIcon />,
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

type AppLayoutProps = {
  pathname: string;
} & PropsWithChildren;

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useRouter();
  const pathname = usePathname();
  const { data: profile } = useMe();
  const { role } = profile || {};

  const prefix = pathname.split('/')[1];
  const isAdmin = role === 'admin';

  const authentication = () => {
    return {
      signIn: () => {},
      signOut: async () => {
        navigate.replace(ROUTE.LOGOUT);
        navigate.refresh();
      },
    };
  };

  const router = {
    pathname: `/${prefix}`,
    searchParams: new URLSearchParams(),
    navigate: (path: string | URL) => {
      navigate.replace(path as string);
    },
  };

  return (
    <AppProvider
      branding={{
        logo: (
          <picture>
            <img src="/static/bitA_logo.svg" alt="bitA Vietnam" />
          </picture>
        ),
        title: 'bitA Vietnam',
      }}
      navigation={isAdmin ? ADMIN_NAVIGATION : USER_NAVIGATION}
      router={router}
      theme={demoTheme}
      session={{
        user: {
          id: profile?.id.toString(),
          email: profile?.email,
          name: profile?.name,
          image: profile?.avatarUrl,
        },
      }}
      authentication={authentication()}
    >
      <DashboardLayout slots={{ toolbarActions: Notification }}>{children}</DashboardLayout>
    </AppProvider>
  );
}
