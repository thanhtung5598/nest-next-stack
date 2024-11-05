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
import { brandsService, IBrand, useFetchBrands } from '@/data/brand';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { CreateBrandModal } from './Components/CreateBrandModal';
import DeleteIcon from '@mui/icons-material/Delete';
import { EditBrandModal } from './Components/EditBrandModal';

interface Column {
  id: keyof IBrand | 'actions';
  label: string;
  minWidth?: number;
  align?: 'center';
}

interface TableCellContentProps {
  column: Column;
  brand: IBrand;
  handleEdit?: () => void;
}

const columns: Column[] = [
  { id: 'code', label: 'Code', minWidth: 100 },
  { id: 'name', label: 'Name', minWidth: 100 },
  { id: 'createdAt', label: 'Create At', minWidth: 100 },
  { id: 'updatedAt', label: 'Update At', minWidth: 100 },
  { id: 'actions', label: 'Actions', minWidth: 100 },
];

export function Brands() {
  const [brandEdit, setBrandEdit] = useState<IBrand>();
  const dialogs = useDialogs();
  const notifications = useNotifications();

  const { data: listBrand, pagination, setPage, refresh } = useFetchBrands();

  const onDeleteThisBrand = async (brandId: number) => {
    try {
      const confirmed = await dialogs.confirm('Are you sure you want to delete this brand?', {
        okText: 'Confirm',
        cancelText: 'Cancel',
      });

      if (!confirmed) return;

      await brandsService.deleteBrand(brandId);

      notifications.show('Brand deleted successfully.', { severity: 'success' });
      refresh();
    } catch (error) {
      notifications.show('Failed to delete brand.', { severity: 'error' });
    }
  };

  const TableCellContent = ({ column, brand }: TableCellContentProps) => {
    switch (column.id) {
      case 'actions':
        return (
          <>
            <IconButton aria-label="edit" onClick={() => setBrandEdit(brand)}>
              <EditIcon />
            </IconButton>
            {/* <IconButton aria-label="delete" onClick={() => onDeleteThisBrand(brand.id)}>
              <DeleteIcon />
            </IconButton> */}
          </>
        );
      default:
        return <div>{brand[column.id]}</div>;
    }
  };

  return (
    <PageContainer
      style={{ maxWidth: 'unset' }}
      breadcrumbs={[{ title: 'Manage Brands', path: ROUTE.BRANDS }]}
      slots={{
        toolbar: () => <CreateBrandModal onComplete={refresh} />,
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
              {listBrand?.length ? (
                listBrand?.map((brand) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={`list-${brand.id}`}>
                      {columns.map((column) => {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {TableCellContent({ column, brand })}
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
      <EditBrandModal
        brand={brandEdit}
        onComplete={refresh}
        onClose={() => setBrandEdit(undefined)}
      />
    </PageContainer>
  );
}
