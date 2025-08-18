import React from 'react';
import { Box } from '@mui/material';
import logoImage from '../assets/logo-simula.png';

/**
 * Componente que renderiza o logo da aplicação.
 */
function Logo() {
  return (
    <Box 
      component="img"
      sx={{
        height: 60, // Altura ajustável do logo
        width: 'auto',
      }}
      alt="Logo do Simula"
      src={logoImage}
    />
  );
}

export default Logo;