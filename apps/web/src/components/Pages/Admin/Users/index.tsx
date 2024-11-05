'use client';

import { useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { PageContainer } from '@toolpad/core';
import { IUserProfile, useFetchUsers } from '@/data/user';
import { Chip, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from 'next/navigation';
import { ROUTE } from '@/libs/enum';
import { pathParser } from '@/libs/functions';
import Avatar from '@mui/material/Avatar';
import { Pagination } from '@/components/Common/Pagination';
import EmptyTable from '@/components/Common/EmptyTable';
import { CreateUserModal } from './Components/CreateUserModal';
import { EditUserModal } from './Components/EditUserModal';

interface Column {
  id: keyof IUserProfile | 'actions';
  label: string;
  minWidth?: number;
  align?: 'center';
}

const columns: Column[] = [
  { id: 'avatarUrl', label: 'Avatar', minWidth: 100 },
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'department', label: 'Department', minWidth: 100 },
  { id: 'email', label: 'Email', minWidth: 100 },
  { id: 'isActive', label: 'Active', minWidth: 100 },
  { id: 'role', label: 'Role', minWidth: 100 },
  { id: 'actions', label: 'Actions', minWidth: 50, align: 'center' },
];

export function Users() {
  const navigate = useRouter();
  const [userEdit, setUserEdit] = useState<IUserProfile>();
  const { data: listUser, pagination, setPage, refresh } = useFetchUsers();

  const TableCellContent = ({ column, user }: { column: Column; user: IUserProfile }) => {
    const value = user[column.id as keyof IUserProfile];

    switch (column.id) {
      case 'avatarUrl':
        return (
          <Avatar
            src={value as string}
            alt={`${user.name}'s avatar`}
            className="w-16 h-16 rounded-sm cursor-pointer"
            onClick={() => navigate.replace(pathParser(ROUTE.USER_DETAIL, user.id))}
          />
        );

      case 'department':
        return <div>{user.department?.name || ''}</div>;

      case 'isActive':
        return (
          <div>
            <Chip label="Active" style={{ fontWeight: 'bold' }} color="info" />
          </div>
        );

      case 'actions':
        return (
          <IconButton aria-label="edit" onClick={() => setUserEdit(user)}>
            <EditIcon />
          </IconButton>
        );
      default:
        return <div>{user[column.id]}</div>;
    }
  };

  return (
    <PageContainer
      style={{ maxWidth: 'unset' }}
      breadcrumbs={[{ title: 'Manage Users', path: ROUTE.USERS }]}
      slots={{
        toolbar: () => <CreateUserModal onComplete={refresh} />,
      }}
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
              {listUser?.length ? (
                listUser?.map((user) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={`list-${user.id}`}>
                      {columns.map((column) => {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {TableCellContent({ column, user })}
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

      <EditUserModal user={userEdit} onComplete={refresh} onClose={() => setUserEdit(undefined)} />
    </PageContainer>
  );
}
