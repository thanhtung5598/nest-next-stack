import { Box } from '@mui/material';
import { useEffect, useState } from 'react';

export function Hint() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 2,
        right: 2,
        background:
          'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(9,9,121,1) 94%)',
        color: '#fff',
        padding: '8px 16px',
        borderRadius: '0 0 8px 0',
        zIndex: 1000,
        fontSize: '0.875rem',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        fontWeight: 'bold',
        display: isVisible ? 'block' : 'none',
      }}
    >
      <div>Cú pháp</div>
      <div>[số][b,xc,dd,dau,duoi][...n][...dai][vị trí đài]</div>
      <div>[số][b...n][xc...n][dd...n][dau...n][duoi...n][...dai][vị trí đài]</div>
    </Box>
  );
}
