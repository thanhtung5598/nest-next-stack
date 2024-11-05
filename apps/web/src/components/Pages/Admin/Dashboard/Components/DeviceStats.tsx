import React from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import ComputerIcon from '@mui/icons-material/Computer';
import BookIcon from '@mui/icons-material/Book';

const DeviceStats = () => {
  const theme = useTheme();

  return (
    <Box display="flex" justifyContent="space-around">
      <Paper
        sx={{
          border: `1px solid ${theme.palette.grey}`,
          borderRadius: '16px',
          width: 256,
          height: 144,
          p: 3,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.text.secondary }}>
          Total devices
        </Typography>
        <Box display="flex" mt={2} alignItems="center">
          <ComputerIcon sx={{ fontSize: 32, mr: 2, color: theme.palette.text.primary }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
            320
          </Typography>
        </Box>
      </Paper>
      <Paper
        elevation={1}
        sx={{
          border: `1px solid ${theme.palette.grey}`,
          borderRadius: '16px',
          width: 256,
          height: 144,
          p: 3,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.text.secondary }}>
          Borrowing device
        </Typography>
        <Box display="flex" mt={2} alignItems="center">
          <BookIcon sx={{ fontSize: 32, mr: 2, color: theme.palette.text.primary }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
            320
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default DeviceStats;
