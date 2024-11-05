'use client';

import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { PageContainer } from '@toolpad/core';
import { Box, Button, Chip, IconButton, InputAdornment, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { IDevice, useFetchDevices } from '@/data/device';
import dayjs from 'dayjs';
import EmptyTable from '@/components/Common/EmptyTable';
import { Pagination } from '@/components/Common/Pagination';
import { ROUTE } from '@/libs/enum';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';
import { formatDate, formatVND } from '@/libs/functions';
import SearchIcon from '@mui/icons-material/Search';

interface Column {
  id: keyof IDevice | 'actions';
  label: string;
  minWidth?: number;
  align?: 'center';
}

interface TableCellContentProps {
  column: Column;
  device: IDevice;
  handleEdit?: () => void;
}

const columns: Column[] = [
  { id: 'sku', label: 'Sku', minWidth: 100 },
  { id: 'name', label: 'Name', minWidth: 100 },
  { id: 'category', label: 'Category', minWidth: 100 },
  { id: 'buyAt', label: 'Buy At', minWidth: 120 },
  { id: 'price', label: 'Price', minWidth: 100 },
  { id: 'priceVat', label: 'Price Vat', minWidth: 100 },
  { id: 'status', label: 'Device Status', minWidth: 130 },
  { id: 'actions', label: 'Actions', minWidth: 50, align: 'center' },
];

export function Devices() {
  const router = useRouter();
  const { data: listDevice, pagination, setPage, onSetExtraQuery } = useFetchDevices();

  const TableCellContent = ({ column, device, handleEdit }: TableCellContentProps) => {
    switch (column.id) {
      case 'sku':
        return <div>{device.sku || ''}</div>;

      case 'name':
        return <div>{device.name || ''}</div>;

      case 'category':
        return <div>{device.category?.name || ''}</div>;

      case 'buyAt':
        return <div>{formatDate(device.buyAt)}</div>;

      case 'price':
        return <div>{formatVND(device.price) || ''}</div>;

      case 'priceVat':
        return <div>{formatVND(device.priceVat) || ''}</div>;

      case 'status':
        return (
          <div>
            <Chip label="In Stock" style={{ fontWeight: 'bold' }} color="success" />
          </div>
        );

      case 'actions':
        return (
          <IconButton aria-label="edit" onClick={handleEdit}>
            <EditIcon />
          </IconButton>
        );

      default:
        return <div>{device[column.id]}</div>;
    }
  };

  return (
    <PageContainer
      style={{ maxWidth: 'unset' }}
      breadcrumbs={[{ title: 'Manage Devices', path: ROUTE.DEVICES }]}
      slots={{
        toolbar: () => (
          <Box display="flex" alignItems="center" justifyContent="flex-end">
            <TextField
              placeholder="Searching..."
              id="search-device"
              size="small"
              variant="outlined"
              className="mr-4"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                },
              }}
              onChange={(e) => {
                onSetExtraQuery({
                  keyword: e.target.value,
                });
              }}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => router.replace(ROUTE.CREATE_DEVICE)}
            >
              Add Device
            </Button>
          </Box>
        ),
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
              {listDevice?.length ? (
                listDevice?.map((device) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={`list-${device.id}`}>
                      {columns.map((column) => {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {TableCellContent({ column, device })}
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
