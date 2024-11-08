'use client';

import { Fragment, useState } from 'react';
import { calculateTotalAmountReward, calculateTotalStake, DAI_1, DAI_2, DAI_3 } from '@/libs/bit';
import { Box, Button, Chip, FormLabel, Table } from '@mui/joy';
import { TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Form from '../Common/Form';
import { useForm } from 'react-hook-form';
import { RewardTable } from './RewardTable';
import { formatVND } from '@/libs/functions';

export const header = ['Thứ 3', 'Bến Tre', 'Vũng Tàu', 'Bạc Liêu'];

type TotalRewardProps = {
  amount?: number;
  daiIndex?: 0;
  reward?: 300000;
  type?: 'Bao' | 'DD' | 'XC' | 'DA';
  winLo?: string[];
  pairsOfWinLo?: { [key: string]: string }[];
};

export function BitContainer() {
  const [totalAmountToPayFor, setTotalAmountToPayFor] = useState<any>();
  const [totalAmountToSpend, setTotalAmountToSpend] = useState<any>();
  const [totalAmountReward, setTotalAmountReward] = useState<TotalRewardProps[]>([]);

  const prizeLevels = [
    { name: 'Giải tám', rows: 1, indexes: [0] },
    { name: 'Giải bảy', rows: 1, indexes: [1] },
    { name: 'Giải sáu', rows: 3, indexes: [2, 3, 4] },
    { name: 'Giải năm', rows: 1, indexes: [5] },
    { name: 'Giải tư', rows: 7, indexes: [6, 7, 8, 9, 10, 11, 12] },
    { name: 'Giải ba', rows: 2, indexes: [13, 14] },
    { name: 'Giải nhì', rows: 1, indexes: [15] },
    { name: 'Giải nhất', rows: 1, indexes: [16] },
    { name: 'Giải đặc biệt', rows: 1, indexes: [17] },
  ];

  const { control, handleSubmit } = useForm<any>();

  const onHandleSubmit = (data: any) => {
    if (!data.bit) return;
    const splitMergedBaoLo = data.bit.split(',').map((de: any) => de.trim());

    const totalAmountToPayFor = calculateTotalStake(splitMergedBaoLo);
    const totalAmountRewardRes = calculateTotalAmountReward(splitMergedBaoLo);

    setTotalAmountToPayFor(totalAmountToPayFor);
    setTotalAmountReward(totalAmountRewardRes);
    let totalSpend = 0;

    totalAmountRewardRes.forEach((rewardItem) => {
      totalSpend += rewardItem.reward;
    });

    setTotalAmountToSpend(totalSpend);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ m: 6, width: '60%' }}>
        <Box>
          <Form onSubmit={handleSubmit(onHandleSubmit)}>
            <FormLabel sx={{ my: 2, fontSize: 26, color: 'maroon' }}>Nhập thông tin</FormLabel>
            <Form.TextArea
              sx={{ p: 2 }}
              control={control}
              name="bit"
              label="bit"
              placeholder="..."
              minRows={10}
            />
            <Button type="submit" fullWidth sx={{ my: 2 }}>
              Kết quả
            </Button>
            <br />
            <Button
              onClick={() => setTotalAmountReward([])}
              type="button"
              color="danger"
              fullWidth
              sx={{ mt: 2 }}
            >
              Xoá Kết quả
            </Button>
          </Form>
        </Box>
        <Box sx={{ my: 3 }}>
          <Box sx={{ display: 'grid', rowGap: 2 }}>
            <Box>
              <Chip color="success">Thu: {formatVND(totalAmountToPayFor)}</Chip>
            </Box>
            <Box>
              <Chip color="neutral">Chi: {formatVND(totalAmountToSpend)}</Chip>
            </Box>
          </Box>
          <div className="my-3" />
          <RewardTable data={totalAmountReward} />
        </Box>
      </Box>

      <TableContainer
        sx={{
          width: '40%',
          marginLeft: 'auto',
          marginRight: 5,
          fontWeight: 'bold',
          borderRadius: 2,
          p: 2,
          my: 4,
        }}
        className="myShadow"
      >
        <Table>
          <TableHead>
            <TableRow>
              {header.map((item) => (
                <TableCell className="text-[1rem]" key={item}>
                  {item}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {prizeLevels.map((prize, prizeIndex) => (
              <Fragment key={prizeIndex}>
                <TableRow>
                  <TableCell rowSpan={prize.rows} className="text-[1rem]">
                    {prize.name} {/* Left */}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      color:
                        prizeIndex === 0 || prizeIndex === prizeLevels.length - 1 ? 'maroon' : '',
                    }}
                    className="text-[1rem]"
                  >
                    {prize?.indexes?.[0] !== undefined && DAI_1[prize?.indexes[0]]}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      color:
                        prizeIndex === 0 || prizeIndex === prizeLevels.length - 1 ? 'maroon' : '',
                    }}
                    className="text-[1rem]"
                  >
                    {prize?.indexes?.[0] !== undefined && DAI_2[prize?.indexes[0]]}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      color:
                        prizeIndex === 0 || prizeIndex === prizeLevels.length - 1 ? 'maroon' : '',
                    }}
                    className="text-[1rem]"
                  >
                    {prize?.indexes?.[0] !== undefined && DAI_3[prize?.indexes[0]]}
                  </TableCell>
                </TableRow>

                {prize.indexes.slice(1).map((index, i) => (
                  <TableRow key={i}>
                    <TableCell sx={{ fontWeight: 'bold', color: '' }} className="text-[1rem]">
                      {DAI_1[index]}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '' }} className="text-[1rem]">
                      {DAI_2[index]}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '' }} className="text-[1rem]">
                      {DAI_3[index]}
                    </TableCell>
                  </TableRow>
                ))}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
