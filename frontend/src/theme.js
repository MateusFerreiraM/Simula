// src/theme.js

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4CAF50', // Um verde capim vibrante e agradável
    },
    secondary: {
      main: '#616161', // Um cinza escuro para textos e elementos secundários
    },
    background: {
      default: '#f5f5f5', // Um cinza muito claro para o fundo geral
      paper: '#ffffff',   // Branco para o fundo de cards, etc.
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h3: {
        fontWeight: 700,
    },
    h4: {
        fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: 8,
                textTransform: 'none', // Impede que os botões fiquem em MAIÚSCULAS
                fontWeight: 600,
            }
        }
    }
  }
});

export default theme;