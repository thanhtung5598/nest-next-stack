'use client';

import * as React from 'react';
import Paper from '@mui/material/Paper';

import { PageContainer } from '@toolpad/core';

import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import dayjs from 'dayjs';
import DevicesIcon from '@mui/icons-material/Devices';
import HistoryIcon from '@mui/icons-material/History';
import { useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import { pathParser } from '@/libs/functions';
import { ROUTE } from '@/libs/enum';
import { useFetchUserById } from '@/data/user';

type UserDetailProps = {
  userId: string;
};

export function UserDetail({ userId }: UserDetailProps) {
  const theme = useTheme();
  const router = useRouter();
  const { data: userInfo } = useFetchUserById({ userId });

  return (
    <PageContainer
      style={{ maxWidth: 'unset' }}
      breadcrumbs={[
        { title: 'Manage Users', path: ROUTE.USERS },
        {
          title: userInfo?.name || userInfo?.email || '',
          path: pathParser(ROUTE.USERS, userInfo?.id),
        },
      ]}
    >
      <Paper sx={{ width: '100%', overflow: 'hidden', p: 4 }}>
        <Stack direction="row" spacing={3} alignItems="center">
          <Avatar src={userInfo?.avatarUrl} alt={userInfo?.name} sx={{ width: 100, height: 100 }} />
          <Box>
            <Typography variant="h5">{userInfo?.name}</Typography>
            <Typography variant="body1" color="textSecondary">
              Email: {userInfo?.email}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Role: {userInfo?.role}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Department: {userInfo?.department?.name}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="h6">User Status</Typography>
          <Stack direction="row" spacing={4} mt={3}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                padding: theme.spacing(2),
                borderRadius: theme.shape.borderRadius,
                boxShadow: theme.shadows[2],
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
                width: 'fit-content',
                cursor: 'pointer',
              }}
              onClick={() => router.replace(pathParser(ROUTE.USER_DEVICES, userId))}
            >
              <DevicesIcon sx={{ fontSize: 40, marginRight: '16px', color: '#1976d2' }} />
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Issued device
                </Typography>
                <Typography textAlign="center" variant="h6">
                  {userInfo?.devicesCount}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                padding: theme.spacing(2),
                borderRadius: theme.shape.borderRadius,
                boxShadow: theme.shadows[2],
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
                width: 'fit-content',
                cursor: 'pointer',
              }}
            >
              <HistoryIcon sx={{ fontSize: 40, marginRight: '16px', color: '#1976d2' }} />
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Borrowing History
                </Typography>
                <Typography variant="h6" textAlign="center">
                  {userInfo?.borrowHistoryCount}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="body2" color="textSecondary">
            Account created on: {dayjs(userInfo?.createdAt).format('YYYY-MM-DD')}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Last updated on: {dayjs(userInfo?.updatedAt).format('YYYY-MM-DD')}
          </Typography>
        </Box>
      </Paper>
    </PageContainer>
  );
}
