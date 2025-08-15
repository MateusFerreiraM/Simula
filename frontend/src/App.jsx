// src/App.jsx

import { Routes, Route } from 'react-router-dom';
import { CssBaseline, Container } from '@mui/material';
import HomePage from './pages/HomePage';
import CustomTestPage from './pages/CustomTestPage';
import SimuladoPage from './pages/SimuladoPage';

function App() {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/personalizado" element={<CustomTestPage />} />
          {/* 2. Adicione a rota dinâmica para a página do simulado */}
          <Route path="/simulado/:simuladoId" element={<SimuladoPage />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;