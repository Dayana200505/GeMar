import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

import VerInformacion from './pages/VerInformacion';
import GenerarReportes from './pages/GenerarReportes';
import Home from './pages/Home';
import ElegirGestion from './pages/ElegirGestion';

function App() {
  return (
    
    <BrowserRouter>
   <Navbar />
      <Routes >
        <Route path="/" element={<Home/>} />
        <Route path="/generar-reportes" element={<GenerarReportes />} />
        <Route path="/ver-informacion" element={<VerInformacion />} />
        <Route path="/elegir-gestion" element={<ElegirGestion />} />
      </Routes>
    
    </BrowserRouter>
 
  );
}

export default App;
