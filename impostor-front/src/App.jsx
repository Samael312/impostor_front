import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Verifica que la ruta de la carpeta sea correcta (pages o screen)
// y que los nombres de archivo empiecen con Mayúscula si así los creaste.
import Home from './screen/home';
import Online from './screen/online';
import Lobby from './screen/lobby';
import Game from './screen/game';
import CreateGame from './screen/CreateGame';
import SetupGame from './screen/SetupGame'; // El archivo nuevo
import LocalSetup from './screen/LocalSetup';
import LocalGame from './screen/LocalGame';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Principales */}
        <Route path="/" element={<Home />} />
        <Route path="/online" element={<Online />} />
        
        {/* Crear partida desde cero */}
        <Route path="/create" element={<CreateGame />} />

        {/* --- CORRECCIÓN CRÍTICA AQUÍ --- */}
        {/* Debe ser /game/setup para coincidir con el botón de "Repetir Partida" en Game.jsx */}
        <Route path="/game/setup" element={<SetupGame />} />
        
        {/* Sala de espera (Lobby) */}
        <Route path="/lobby/:roomId" element={<Lobby />} />
        
        {/* Pantalla de Juego */}
        <Route path="/game" element={<Game />} />

        {/* Rutas locales */}
        <Route path="/local/setup" element={<LocalSetup />} /> 
        <Route path="/local/game" element={<LocalGame />} />  
        
        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;