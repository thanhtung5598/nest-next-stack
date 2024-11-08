'use client';

import { useState } from 'react';
import { calculateTotalAmountReward, calculateTotalStake } from '@/libs/bit';
import { Box, Button, Chip, FormLabel, Table } from '@mui/joy';
import { TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Form from '../Common/Form';
import { useForm } from 'react-hook-form';
import { RewardTable } from './RewardTable';
import { cn, formatVND } from '@/libs/functions';
import lotteryResult from '@/libs/lotteryResults.json';

export type TotalRewardProps = {
  amount?: number;
  daiIndex?: number;
  reward?: number;
  type?: 'Bao' | 'DD' | 'XC' | 'DA';
  lo?: string;
  winLo?: string[];
  pairsOfWinLo?: { [key: string]: string }[];
};

export function BitContainer() {
  const [totalAmountToPayFor, setTotalAmountToPayFor] = useState<any>();
  const [totalAmountToSpend, setTotalAmountToSpend] = useState<any>();
  const [totalAmountReward, setTotalAmountReward] = useState<TotalRewardProps[]>([]);

  const prizeLevels = {
    giai8: 'Giải tám',
    giai7: 'Giải bảy',
    giai6: 'Giải sáu',
    giai5: 'Giải năm',
    giai4: 'Giải tư',
    giai3: 'Giải ba',
    giai2: 'Giải nhì',
    giai1: 'Giải nhất',
    giaidb: 'Giải đặc biệt',
  };

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
    <Box sx={{ display: 'grid', justifyItems: 'center' }}>
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
              onClick={() => {
                setTotalAmountToPayFor(0);
                setTotalAmountReward([]);
                setTotalAmountToSpend(0);
              }}
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
            <Chip color="success">Thu: {formatVND(totalAmountToPayFor)}</Chip>
            <Chip color="warning">Chi: {formatVND(totalAmountToSpend)}</Chip>
          </Box>
          <div className="my-3" />
          <RewardTable data={totalAmountReward} />
        </Box>
      </Box>

      {lotteryResult.map((itemResult) => (
        <TableContainer
          key={`lottery-result-${itemResult.date}`}
          sx={{
            width: '80%',
            marginLeft: 'auto',
            marginRight: 'auto',
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
                <TableCell
                  colSpan={itemResult.provinces.length + 1}
                  className="text-[2rem] !text-center !py-4"
                >
                  {itemResult.date}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-[1rem]"></TableCell>
                {itemResult.provinces.map((province, index) => (
                  <TableCell key={index} className="text-[1rem]">
                    {province.province}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            {itemResult.provinces[0]?.province === 'Miền Bắc' ? (
              <TableBody>
                {Object.keys(prizeLevels)
                  .reverse()
                  .slice(0, 8)
                  .map((level: any, levelIndex) => (
                    <TableRow key={`levelIndex-${levelIndex}`}>
                      <TableCell className="text-[1rem]">{(prizeLevels as any)[level]}</TableCell>
                      {itemResult.provinces.map((province, provinceIndex) => (
                        <TableCell
                          key={`${provinceIndex}-${levelIndex}`}
                          className={cn('text-[1.5rem] font-bold whitespace-pre-wrap', {
                            'text-[maroon] text-[2rem]':
                              levelIndex === 0 ||
                              levelIndex === Object.keys(prizeLevels).length - 1,
                          })}
                        >
                          {province?.results?.[level]?.map((item) => (
                            <span className="py-1 pr-4 mr-1 inline-block">{item}</span>
                          ))}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
              </TableBody>
            ) : (
              <TableBody>
                {Object.keys(prizeLevels).map((level: any, levelIndex) => (
                  <TableRow key={`levelIndex-${levelIndex}`}>
                    <TableCell className="text-[1rem]">{(prizeLevels as any)[level]}</TableCell>
                    {itemResult.provinces.map((province, provinceIndex) => (
                      <TableCell
                        key={`${provinceIndex}-${levelIndex}`}
                        className={cn('text-[1.5rem] whitespace-pre-line font-bold', {
                          'text-[maroon] text-[2rem]':
                            levelIndex === 0 || levelIndex === Object.keys(prizeLevels).length - 1,
                        })}
                      >
                        {province?.results?.[level]?.join('\n')}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      ))}
    </Box>
  );
}
