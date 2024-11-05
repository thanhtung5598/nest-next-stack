'use client';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { PageContainer } from '@toolpad/core';
import EmptyTable from '@/components/Common/EmptyTable';
import { Pagination } from '@/components/Common/Pagination';
import { ROUTE } from '@/libs/enum';
import { Chip, IconButton } from '@mui/material';
import { borrowService, BorrowStatus, IBorrowRequest, useFetchBorrowRequest } from '@/data/borrow';
import { formatDate } from '@/libs/functions';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ReplayIcon from '@mui/icons-material/Replay';
import { useState } from 'react';
import RejectDialog from './Components/RejectDialog';
import { useMe } from '@/data/user';

interface Column {
  id: keyof IBorrowRequest | 'actions';
  label: string;
  minWidth?: number;
  align?: 'center';
}

interface TableCellContentProps {
  column: Column;
  borrowRequest: IBorrowRequest;
  handleEdit?: () => void;
}

const columns: Column[] = [
  { id: 'id', label: 'ID', minWidth: 100 },
  { id: 'user', label: 'User Name', minWidth: 150 },
  { id: 'device', label: 'Device Name', minWidth: 100 },
  { id: 'borrowedAt', label: 'Borrow At', minWidth: 120 },
  { id: 'returnedAt', label: 'Return At', minWidth: 120 },
  { id: 'note', label: 'Note', minWidth: 100 },
  { id: 'status', label: 'Status', minWidth: 100 },
  { id: 'actions', label: 'Actions', minWidth: 150 },
];

type StatusInfo = {
  color: 'primary' | 'secondary' | 'error' | 'info' | 'warning';
  label: string;
};

const statusMap: Record<BorrowStatus, StatusInfo> = {
  [BorrowStatus.requesting]: { color: 'primary', label: 'Requesting' },
  [BorrowStatus.borrowing]: { color: 'secondary', label: 'Borrowing' },
  [BorrowStatus.rejected]: { color: 'error', label: 'Rejected' },
  [BorrowStatus.returnConfirm]: { color: 'info', label: 'Return Confirm' },
  [BorrowStatus.returned]: { color: 'warning', label: 'Returned' },
};

export function BorrowRequest() {
  const { data: profileInfo } = useMe();
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [selectedBorrowRequestId, setSelectedBorrowRequestId] = useState<number | null>(null);
  const { data: listBorrowRequest, pagination, setPage, refresh } = useFetchBorrowRequest();

  const isAdmin = profileInfo?.role === 'admin';

  const handleOpenRejectDialog = (borrowRequestId: number) => {
    setSelectedBorrowRequestId(borrowRequestId);
    setOpenRejectDialog(true);
  };

  const handleCloseRejectDialog = () => {
    setOpenRejectDialog(false);
    setSelectedBorrowRequestId(null);
  };

  const handleApprove = (borrowRequestId: number) => {
    borrowService.borrowAction(borrowRequestId, 'approve').then(() => {
      refresh();
    });
  };

  const handleApproveReturn = (borrowRequestId: number) => {
    borrowService.borrowAction(borrowRequestId, 'confirmReturn').then(() => {
      refresh();
    });
  };

  const TableCellContent = ({ column, borrowRequest }: TableCellContentProps) => {
    switch (column.id) {
      case 'user':
        return <div>{borrowRequest[column.id].name}</div>;
      case 'device':
        return <div>{borrowRequest[column.id].name}</div>;
      case 'borrowedAt':
        return <div>{formatDate(borrowRequest[column.id])}</div>;
      case 'returnedAt':
        return <div>{formatDate(borrowRequest[column.id])}</div>;
      case 'status':
        const statusInfo = statusMap[borrowRequest[column.id]];
        return (
          <div>
            <Chip
              color={statusInfo.color}
              style={{ fontWeight: 'bold' }}
              label={statusInfo.label}
            />
          </div>
        );
      case 'device':
        return <div>{borrowRequest[column.id].name}</div>;

      case 'actions':
        return (
          <div style={{ display: 'flex', gap: '8px' }}>
            {borrowRequest.status === BorrowStatus.requesting && (
              <>
                <IconButton aria-label="approve" onClick={() => handleApprove(borrowRequest.id)}>
                  <CheckIcon color="primary" />
                </IconButton>
                <IconButton
                  aria-label="reject"
                  onClick={() => handleOpenRejectDialog(borrowRequest.id)}
                >
                  <CloseIcon color="error" />
                </IconButton>
              </>
            )}
            {borrowRequest.status === BorrowStatus.returnConfirm && (
              <>
                <IconButton
                  aria-label="approve"
                  onClick={() => handleApproveReturn(borrowRequest.id)}
                >
                  <CheckIcon color="primary" />
                </IconButton>
              </>
            )}
          </div>
        );
      default:
        return <div>{borrowRequest[column.id]}</div>;
    }
  };

  return (
    <PageContainer
      style={{ maxWidth: 'unset' }}
      breadcrumbs={[{ title: 'Manage Borrow Request', path: ROUTE.BORROW_REQUEST }]}
    >
      <TableContainer>
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
            {listBorrowRequest?.length ? (
              listBorrowRequest?.map((borrowRequest) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={`list-${borrowRequest.id}`}>
                    {columns.map((column) => {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {TableCellContent({ column, borrowRequest })}
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
      {selectedBorrowRequestId && (
        <RejectDialog
          open={openRejectDialog}
          onClose={handleCloseRejectDialog}
          borrowRequestId={selectedBorrowRequestId}
          onActionComplete={() => refresh()}
        />
      )}
    </PageContainer>
  );
}
