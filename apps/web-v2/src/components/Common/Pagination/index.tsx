import { Pagination as MUIPagination, Box } from '@mui/material';

type PaginationProps = {
  count: number; // Total pages
  page: number; // Current page
  onChange: (event: React.ChangeEvent<unknown>, value: number) => void;
};

export function Pagination(props: PaginationProps) {
  const { count, page, onChange } = props;

  return (
    <Box display="flex" justifyContent="right" alignItems="center" p={4}>
      <MUIPagination
        count={count}
        page={page}
        onChange={onChange}
        variant="outlined"
        shape="rounded"
      />
    </Box>
  );
}
