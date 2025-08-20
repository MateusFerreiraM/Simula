import React from 'react';
import { Box } from '@mui/material';
import logoImage from '../assets/logo-simula.png';

/**
 * Componente que renderiza o logo da aplicação.
 * Aceita uma propriedade 'height' para customizar o tamanho.
 */
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