import React from 'react';
import { TableCell, Box, Typography, TableRow } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox'; // You can replace this with any other icon

type EmptyTableProps = { colSpan: number; message?: string };

const EmptyTable = (props: EmptyTableProps) => {
  const { colSpan, message = 'No data available' } = props;

  return (
    <TableRow tabIndex={-1}>
      <TableCell colSpan={colSpan} align="center">
        <Box
          className="min-h-[15rem]"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <InboxIcon color="disabled" sx={{ fontSize: 50, mb: 1 }} />
          <Typography variant="body1" color="textSecondary">
            {message}
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default EmptyTable;
