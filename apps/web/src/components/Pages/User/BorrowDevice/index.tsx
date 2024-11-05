'use client';

import { PageContainer } from '@toolpad/core';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Chip, IconButton } from '@mui/material';
import { ROUTE } from '@/libs/enum';
import { Pagination } from '@/components/Common/Pagination';
import { IUserBorrowDevice, useFetchUserBorrowDevices, useMe } from '@/data/user';
import EmptyTable from '@/components/Common/EmptyTable';
import { formatDate } from '@/libs/functions';
import ReplayIcon from '@mui/icons-material/Replay';
import { borrowService } from '@/data/borrow';

interface Column {
  id: keyof IUserBorrowDevice | 'deviceName' | 'categoryName' | 'actions';
  label: string;
  minWidth?: number;
  align?: 'center';
}

interface TableCellContentProps {
  column: Column;
  userBorrowDevice: IUserBorrowDevice;
  handleEdit?: () => void;
}

const columns: Column[] = [
  { id: 'device', label: 'Sku', minWidth: 100 },
  { id: 'deviceName', label: 'Device Name', minWidth: 100 },
  { id: 'categoryName', label: 'Category Name', minWidth: 100 },
  { id: 'borrowedAt', label: 'Borrow At', minWidth: 100 },
  { id: 'status', label: 'Status', minWidth: 100 },
  { id: 'actions', label: 'Actions', minWidth: 50, align: 'center' },
];

type StatusInfo = {
  color: 'primary' | 'success';
  label: string;
};

const statusMap: Record<'using' | 'returning', StatusInfo> = {
  using: { color: 'success', label: 'Using' },
  returning: { color: 'primary', label: 'Return Confirm' },
};

export function UserBorrowDevices() {
  const { data: userInfo } = useMe();
  const { data: userBorrowDeviceList, pagination, setPage, refresh } = useFetchUserBorrowDevices();

  const handleReturn = (borrowRequestId: number) => {
    borrowService.borrowAction(borrowRequestId, 'requestReturn').then(() => {
      refresh();
    });
  };

  const TableCellContent = ({ column, userBorrowDevice, handleEdit }: TableCellContentProps) => {
    switch (column.id) {
      case 'device':
        return <div>{userBorrowDevice.device.sku || ''}</div>;
      case 'deviceName':
        return <div>{userBorrowDevice.device.name || ''}</div>;
      case 'categoryName':
        return <div>{userBorrowDevice.device?.category.name || ''}</div>;
      case 'borrowedAt':
        return <div>{formatDate(userBorrowDevice.borrowedAt) || ''}</div>;
      case 'status':
        const statusInfo = statusMap[userBorrowDevice.status];
        return (
          <div>
            <Chip
              color={statusInfo.color}
              style={{ fontWeight: 'bold' }}
              label={statusInfo.label}
            />
          </div>
        );
      case 'actions':
        return (
          <div style={{ display: 'flex', gap: '8px' }}>
            {userBorrowDevice.status === 'using' && (
              <>
                <IconButton aria-label="return" onClick={() => handleReturn(userBorrowDevice.id)}>
                  <ReplayIcon color="secondary" />
                </IconButton>
              </>
            )}
          </div>
        );
      default:
        return <div></div>;
    }
  };

  return (
    <PageContainer
      title="Issued device"
      style={{ maxWidth: 'unset' }}
      breadcrumbs={[
        {
          title: userInfo?.name || userInfo?.email || '',
          path: ROUTE.PROFILE,
        },
        {
          title: 'My Devices',
          path: ROUTE.PROFILE_USER_BORROW_DEVICES,
        },
      ]}
    >
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 'unset' }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    style={{
                      minWidth: column.minWidth,
                      background: '#D0D0D0',
                      color: 'black',
                      fontWeight: 'bold',
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {userBorrowDeviceList && userBorrowDeviceList?.length > 0 ? (
                userBorrowDeviceList?.map((userBorrowDevice) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={`list-${userBorrowDevice.id}`}
                    >
                      {columns.map((column) => {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {TableCellContent({ column, userBorrowDevice })}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
              ) : (
                <EmptyTable colSpan={columns.length} />
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          count={pagination.totalPage}
          page={pagination.currentPage}
          onChange={(e: any, newPage: number) => setPage(newPage)}
        />
      </Paper>
    </PageContainer>
  );
}
