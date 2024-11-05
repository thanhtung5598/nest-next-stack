'use client';

import * as React from 'react';
import { PageContainer } from '@toolpad/core';
// import DeviceStats from './Components/DeviceStats';
// import Category from './Components/category';
// import ChartComponent from './Components/chart';
// import { Box } from '@mui/material';
import { ROUTE } from '@/libs/enum';

export function Dashboard() {
  return (
    <PageContainer
      style={{ maxWidth: 'unset' }}
      breadcrumbs={[{ title: 'Dashboard', path: ROUTE.DASHBOARD }]}
    >
      {/* <DeviceStats />
      <Box className="mt-6 pl-6">
        <Box className="flex gap-10">
          <Category />
          <ChartComponent />
        </Box>
      </Box> */}
    </PageContainer>
  );
}
