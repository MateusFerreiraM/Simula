// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import { CssBaseline, Container } from '@mui/material';
import HomePage from './pages/HomePage';
import CustomTestPage from './pages/CustomTestPage';
import SimuladoPage from './pages/SimuladoPage';
import ResultadoPage from './pages/ResultadoPage';
import Header from './components/Header';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <>
      <CssBaseline />
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/personalizado" element={<CustomTestPage />} />
          <Route path="/simulado/:simuladoId" element={<SimuladoPage />} />
          <Route path="/resultado/:simuladoId" element={<ResultadoPage />} />
          <Route path="/cadastro" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </Container>
    </>
  );
}
export default App;