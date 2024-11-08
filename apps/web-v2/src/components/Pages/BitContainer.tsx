'use client';

import { useState } from 'react';
import { calculateTotalAmountReward, calculateTotalStake } from '@/libs/bit';
import { Box, Button, Chip, FormLabel, Radio, RadioGroup, Table } from '@mui/joy';
import { TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Form from '../Common/Form';
import { useForm } from 'react-hook-form';
import { RewardTable } from './RewardTable';
import { cn, formatVND } from '@/libs/functions';
import lotteryResult from '@/libs/lotteryResults.json';
import { Hint } from './Hint';

export type TotalRewardProps = {
  amount?: number;
  daiIndex?: number;
  reward?: number;
  type?: 'Bao' | 'DD' | 'Dau' | 'Duoi' | 'XC' | 'DA';
  lo?: string;
  winLo?: string[];
  pairsOfWinLo?: { [key: string]: string }[];
};

export function BitContainer() {
  const [totalAmountToPayFor, setTotalAmountToPayFor] = useState<any>();
  const [totalAmountToSpend, setTotalAmountToSpend] = useState<any>();
  const [totalAmountReward, setTotalAmountReward] = useState<TotalRewardProps[]>([]);
  const [value, setValue] = useState(0);

  const formattedData = lotteryResult?.[value]?.provinces.map((provinceData) => {
    const prizes = Object.values(provinceData.results).flat();
    return prizes;
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value as any);
  };

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
    const totalAmountRewardRes = calculateTotalAmountReward(splitMergedBaoLo, formattedData);

    setTotalAmountToPayFor(totalAmountToPayFor);
    setTotalAmountReward(totalAmountRewardRes);
    let totalSpend = 0;

    totalAmountRewardRes.forEach((rewardItem: any) => {
      totalSpend += rewardItem.reward;
    });

    setTotalAmountToSpend(totalSpend);
  };

  return (
    <Box sx={{ display: 'grid', justifyItems: 'center' }}>
      {/* <Hint /> */}
      <Box sx={{ m: 6, width: '60%' }}>
        <Box>
          <Form onSubmit={handleSubmit(onHandleSubmit)}>
            <FormLabel sx={{ my: 2, fontSize: 26, color: 'maroon' }}>Nhập thông tin</FormLabel>
            <RadioGroup
              orientation="horizontal"
              name="mien"
              value={value}
              onChange={handleChange}
              defaultValue="0"
              className="my-6"
            >
              <Radio value="0" label="Miền Nam" />
              <Radio value="1" label="Miền Bắc" />
              <Radio value="2" label="Miền Trung" />
            </RadioGroup>
            <Form.TextArea
              sx={{ p: 2 }}
              control={control}
              name="bit"
              label="bit"
              placeholder="..."
              minRows={10}
            />
            <Button type="submit" fullWidth sx={{ mt: 2, mb: 4 }}>
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
                  <TableCell key={`province-${index}`} className="text-[1rem]">
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
                          {(province?.results as any)?.[level]?.map((item: any) => (
                            <span
                              key={`province-result-${item}`}
                              className="py-1 pr-4 mr-1 inline-block"
                            >
                              {item}
                            </span>
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
                        {(province?.results as any)?.[level]?.join('\n')}
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
