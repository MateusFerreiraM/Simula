import React from 'react';
import { Box } from '@mui/material';
import logoImage from '../assets/logo-simula.png';

function Logo({ height = 60 }) {
  return (
    <Box 
      component="img"
      sx={{
        height: height,
        width: 'auto',
      }}
      alt="Logo do Simula"
      src={logoImage}
    />
  );
}

export default Logo;