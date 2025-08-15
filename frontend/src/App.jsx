// src/App.jsx

import { Routes, Route } from 'react-router-dom';
import { CssBaseline, Container } from '@mui/material';
import HomePage from './pages/HomePage';
import CustomTestPage from './pages/CustomTestPage';
import SimuladoPage from './pages/SimuladoPage';
import ResultadoPage from './pages/ResultadoPage';

function App() {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/personalizado" element={<CustomTestPage />} />
          <Route path="/simulado/:simuladoId" element={<SimuladoPage />} />
          <Route path="/resultado/:simuladoId" element={<ResultadoPage />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;