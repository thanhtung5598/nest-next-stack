import { Box, Typography, useTheme } from '@mui/material';

const ItemCategory = ({ data }: { data: any }) => {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      gap={2}
      p={2}
      borderBottom={`1px solid ${theme.palette.divider}`}
      alignItems="center"
    >
      {data.icon}
      <Typography variant="body1" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
        {data.name}
      </Typography>
      <Typography
        variant="body1"
        sx={{ marginLeft: 'auto', fontWeight: 'bold', color: theme.palette.text.secondary }}
      >
        {data.total}
      </Typography>
    </Box>
  );
};

export default ItemCategory;
