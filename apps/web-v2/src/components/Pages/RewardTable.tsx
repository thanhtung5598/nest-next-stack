'use client';

import { Table } from '@mui/joy';
import { TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { formatVND } from '@/libs/functions';
import lotteryResult from '@/libs/lotteryResults.json';
import { TotalRewardProps } from './BitContainer';

type RewardTableProps = {
  data: Partial<TotalRewardProps>[];
};

export function RewardTable({ data }: RewardTableProps) {
  return (
    <TableContainer
      sx={{
        marginLeft: 'auto',
        marginRight: 5,
        fontWeight: 'bold',
        borderRadius: 2,
        p: 2,
        my: 4,
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976D2', color: 'white' }}>
              Đài
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976D2', color: 'white' }}>
              Lô
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#1976D2', color: 'white' }}>
              Trúng
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => {
            const { amount, daiIndex, lo = '', reward, type = '' } = item;
            const dai = daiIndex !== undefined && lotteryResult[0]?.provinces[daiIndex]?.province;
            return (
              <TableRow>
                <TableCell>{dai}</TableCell>
                <TableCell>{lo + type + `${amount}n`}</TableCell>
                <TableCell>{formatVND(reward) ?? 'Not Provided'}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
