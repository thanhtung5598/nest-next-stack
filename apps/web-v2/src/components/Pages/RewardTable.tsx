'use client';

import { Table } from '@mui/joy';
import { TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { header } from './BitContainer';
import { formatVND } from '@/libs/functions';

type TotalRewardProps = {
  data: Partial<{
    amount?: number;
    daiIndex?: 0;
    reward?: 300000;
    type?: 'Bao' | 'DD' | 'XC' | 'DA';
    lo?: string;
    winLo?: string[];
    pairsOfWinLo?: { [key: string]: string }[];
  }>[];
};

export function RewardTable({ data }: TotalRewardProps) {
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
            const { amount, daiIndex, lo = '', reward, type = '', winLo, pairsOfWinLo } = item;
            const dai = daiIndex !== undefined && header[daiIndex + 1];
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
