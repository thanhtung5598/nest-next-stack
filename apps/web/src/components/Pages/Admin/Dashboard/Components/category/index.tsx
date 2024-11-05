import React from 'react';
import Link from 'next/link';
import ListCategory from './list-category';
import { Box, Typography, useTheme } from '@mui/material';

const Category = () => {
  const theme = useTheme();

  return (
    <Box width="30%">
      <Box display="flex" alignItems="center" gap={2} justifyContent="space-between">
        <Typography variant="h6" sx={{ color: theme.palette.grey[600], fontWeight: 'bold' }}>
          Device by category
        </Typography>
        <Link className="text-xs" href="/" style={{ color: theme.palette.grey[600] }}>
          View All
        </Link>
      </Box>
      <ListCategory />
    </Box>
  );
};

export default Category;
