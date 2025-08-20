import { Outlet } from 'react-router-dom';
import { CssBaseline } from '@mui/material';

function App() {
  return (
    <>
      <CssBaseline />
      {/* O <Outlet/> aqui irá renderizar ou as rotas públicas ou o MainLayout com as rotas privadas */}
      <Outlet /> 
    </>
  );
}

export default App;