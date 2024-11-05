import React from 'react';
import { Paper, useTheme } from '@mui/material';
import ItemCategory from './item-category';
import ComputerIcon from '@mui/icons-material/Computer';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import MouseIcon from '@mui/icons-material/Mouse';
import SpeakerIcon from '@mui/icons-material/Speaker';
import MonitorIcon from '@mui/icons-material/Monitor';
const ListCategory = () => {
  const theme = useTheme();

  const listCategory = [
    {
      icon: <LaptopMacIcon />,
      name: 'MacBook',
      total: 30,
    },
    {
      icon: <ComputerIcon />,
      name: 'Windows',
      total: 30,
    },
    {
      icon: <MouseIcon />,
      name: 'Mouse',
      total: 30,
    },
    {
      icon: <SpeakerIcon />,
      name: 'Speaker',
      total: 30,
    },
    {
      icon: <MonitorIcon />,
      name: 'Monitor',
      total: 30,
    },
  ];

  return (
    <Paper
      sx={{
        border: `1px solid ${theme.palette.grey}`,
        borderRadius: '16px',
        p: 3,
      }}
    >
      {listCategory.map((data) => (
        <ItemCategory key={data.name} data={data} />
      ))}
    </Paper>
  );
};

export default ListCategory;
