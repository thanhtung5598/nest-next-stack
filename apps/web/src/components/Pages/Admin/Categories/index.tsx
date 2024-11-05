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
import { categoryService, ICategory, useFetchCategories } from '@/data/category';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { EditCategoryModal } from './Components/EditCategoryModal';
import DeleteIcon from '@mui/icons-material/Delete';
import { CreateCategoryModal } from './Components/CreateCategoryModal';

interface Column {
  id: keyof ICategory | 'actions';
  label: string;
  minWidth?: number;
  align?: 'center';
}

interface TableCellContentProps {
  column: Column;
  category: ICategory;
  handleEdit?: () => void;
}

const columns: Column[] = [
  { id: 'code', label: 'Code', minWidth: 100 },
  { id: 'name', label: 'Name', minWidth: 100 },
  { id: 'createdAt', label: 'Create At', minWidth: 100 },
  { id: 'updatedAt', label: 'Update At', minWidth: 100 },
  { id: 'actions', label: 'Actions', minWidth: 50, align: 'center' },
];

export function Categories() {
  const dialogs = useDialogs();
  const notifications = useNotifications();
  const { data: listCategory, pagination, setPage, refresh } = useFetchCategories();
  const [categoryEdit, setCategoryEdit] = useState<ICategory>();

  const onDeleteThisCategory = async (categoryId: number) => {
    try {
      const confirmed = await dialogs.confirm('Are you sure you want to delete this category?', {
        okText: 'Confirm',
        cancelText: 'Cancel',
      });

      if (!confirmed) return;

      await categoryService.deleteCategory(categoryId);

      notifications.show('Category deleted successfully.', { severity: 'success' });
      refresh();
    } catch (error) {
      notifications.show('Failed to delete category.', { severity: 'error' });
    }
  };

  const TableCellContent = ({ column, category }: TableCellContentProps) => {
    switch (column.id) {
      case 'actions':
        return (
          <>
            <IconButton aria-label="edit" onClick={() => setCategoryEdit(category)}>
              <EditIcon />
            </IconButton>
            {/* <IconButton aria-label="delete" onClick={() => onDeleteThisCategory(category.id)}>
              <DeleteIcon />
            </IconButton> */}
          </>
        );
      default:
        return <div>{category[column.id]}</div>;
    }
  };

  return (
    <PageContainer
      style={{ maxWidth: 'unset' }}
      breadcrumbs={[{ title: 'Manage Categories', path: ROUTE.CATEGORIES }]}
      slots={{
        toolbar: () => <CreateCategoryModal onComplete={refresh} />,
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
              {listCategory?.length ? (
                listCategory?.map((category) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={`list-${category.id}`}>
                      {columns.map((column) => {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {TableCellContent({ column, category })}
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
      <EditCategoryModal
        category={categoryEdit}
        onComplete={refresh}
        onClose={() => setCategoryEdit(undefined)}
      />
    </PageContainer>
  );
}
