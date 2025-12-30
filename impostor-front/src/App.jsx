import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Asegúrate de que las rutas coinciden con tus carpetas (screen o screens)
import Home from './screen/home';
import Online from './screen/online';
import Lobby from './screen/lobby';
import Game from './screen/game';
import CreateGame from './screen/CreateGame';
import LocalSetup from './screen/LocalSetup';
import LocalGame from './screen/LocalGame';

function App() {
  return (
    <BrowserRouter>
      {/* HE ELIMINADO EL WRAPPER GLOBAL (div max-w-md).
        Ahora el control del diseño lo tiene cada página individualmente
        mediante el componente <Layout>. Esto permite diseños responsivos.
      */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/online" element={<Online />} />
        <Route path="/create" element={<CreateGame />} />
        
        {/* La sala requiere un ID en la URL para poder compartir el link */}
        <Route path="/lobby/:roomId" element={<Lobby />} />
        
        {/* El juego recibe los datos por 'state', no es obligatorio el ID en la URL */}
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