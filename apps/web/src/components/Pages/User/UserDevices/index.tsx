'use client';

import { PageContainer } from '@toolpad/core';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { ROUTE } from '@/libs/enum';
import { Pagination } from '@/components/Common/Pagination';
import { IUserDevice, useFetchUserDevices, useMe } from '@/data/user';
import EmptyTable from '@/components/Common/EmptyTable';

interface Column {
  id: keyof IUserDevice | 'actions';
  label: string;
  minWidth?: number;
  align?: 'center';
}

interface TableCellContentProps {
  column: Column;
  userDevice: IUserDevice;
  handleEdit?: () => void;
}

const columns: Column[] = [
  { id: 'sku', label: 'Sku', minWidth: 100 },
  { id: 'name', label: 'Name', minWidth: 100 },
  { id: 'category', label: 'Category Name', minWidth: 100 },
  { id: 'note', label: 'Note', minWidth: 100 },
  { id: 'actions', label: 'Actions', minWidth: 50, align: 'center' },
];

export function UserDevices() {
  const { data: userInfo } = useMe();
  const { data: userDeviceList, pagination, setPage } = useFetchUserDevices();

  const TableCellContent = ({ column, userDevice, handleEdit }: TableCellContentProps) => {
    switch (column.id) {
      case 'sku':
        return <div>{userDevice.sku || ''}</div>;
      case 'name':
        return <div>{userDevice.name || ''}</div>;
      case 'category':
        return <div>{userDevice.category?.name || ''}</div>;
      case 'note':
        return <div>{userDevice.note || ''}</div>;
      case 'actions':
        return (
          <IconButton aria-label="edit" onClick={handleEdit}>
            <EditIcon />
          </IconButton>
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
          path: ROUTE.PROFILE_USER_DEVICES,
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
              {userDeviceList && userDeviceList?.length > 0 ? (
                userDeviceList?.map((userDevice) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={`list-${userDevice.id}`}>
                      {columns.map((column) => {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {TableCellContent({ column, userDevice })}
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
