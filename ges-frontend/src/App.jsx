import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

import VerInformacion from './pages/VerInformacion';
import GenerarReportes from './pages/GenerarReportes';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<div>Inicio</div>} />
        <Route path="/generar-reportes" element={<GenerarReportes />} />
        <Route path="/ver-informacion" element={<VerInformacion />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
