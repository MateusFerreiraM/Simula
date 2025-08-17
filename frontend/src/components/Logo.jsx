// src/components/Logo.jsx

import React from 'react';
import { Box } from '@mui/material';
import logoImage from '../assets/logo-simula.png';

function Logo() {
  return (
    <Box 
      component="img"
      sx={{
        height: 100,
        width: 'auto',
      }}
      alt="Logo do Simula"
      src={logoImage}
    />
  );
}

export default Logo;