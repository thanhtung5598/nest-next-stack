'use client';

import { useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { PageContainer, useDialogs, useNotifications } from '@toolpad/core';
import EmptyTable from '@/components/Common/EmptyTable';
import { Pagination } from '@/components/Common/Pagination';
import { ROUTE } from '@/libs/enum';
import { departmentService, IDepartment, useFetchDepartments } from '@/data/department';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { CreateDepartmentModal } from './Components/CreateDepartmentModal';
import { EditDepartmentModal } from './Components/EditDepartmentModal';

interface Column {
  id: keyof IDepartment | 'actions';
  label: string;
  minWidth?: number;
  align?: 'center';
}

interface TableCellContentProps {
  column: Column;
  department: IDepartment;
}

const columns: Column[] = [
  { id: 'code', label: 'Code', minWidth: 100 },
  { id: 'name', label: 'Name', minWidth: 100 },
  { id: 'createdAt', label: 'Create At', minWidth: 100 },
  { id: 'updatedAt', label: 'Update At', minWidth: 100 },
  { id: 'actions', label: 'Actions', minWidth: 50 },
];

export function Departments() {
  const dialogs = useDialogs();
  const notifications = useNotifications();
  const [departmentEdit, setDepartmentEdit] = useState<IDepartment>();
  const { data: listDepartments, pagination, setPage, refresh } = useFetchDepartments();

  const onDeleteThisDepartment = async (departmentId: number) => {
    try {
      const confirmed = await dialogs.confirm('Are you sure you want to delete this department?', {
        okText: 'Confirm',
        cancelText: 'Cancel',
      });

      if (!confirmed) return;

      await departmentService.deleteDepartment(departmentId);

      notifications.show('Department deleted successfully.', { severity: 'success' });
      refresh();
    } catch (error) {
      notifications.show('Failed to delete department.', { severity: 'error' });
    }
  };

  const TableCellContent = ({ column, department }: TableCellContentProps) => {
    switch (column.id) {
      case 'actions':
        return (
          <>
            <IconButton aria-label="edit" onClick={() => setDepartmentEdit(department)}>
              <EditIcon />
            </IconButton>
            {/* <IconButton aria-label="delete" onClick={() => onDeleteThisDepartment(department.id)}>
              <DeleteIcon />
            </IconButton> */}
          </>
        );
      default:
        return <div>{department[column.id]}</div>;
    }
  };

  return (
    <PageContainer
      style={{ maxWidth: 'unset' }}
      breadcrumbs={[{ title: 'Manage Departments', path: ROUTE.DEPARTMENTS }]}
      slots={{
        toolbar: () => {
          return <CreateDepartmentModal onComplete={refresh} />;
        },
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
              {listDepartments?.length ? (
                listDepartments?.map((department) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={`list-${department.id}`}>
                      {columns.map((column) => {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {TableCellContent({ column, department })}
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
      <EditDepartmentModal
        department={departmentEdit}
        onComplete={refresh}
        onClose={() => setDepartmentEdit(undefined)}
      />
    </PageContainer>
  );
}
