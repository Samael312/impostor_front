// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './screen/home';
import Online from './screen/online';
import Lobby from './screen/lobby';
import Game from './screen/game';
import LocalSetup from './screen/LocalSetup';
import LocalGame from './screen/LocalGame';
import CreateGame from './screen/CreateGame';
//import Voting from './screen/voting';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex items-center justify-center p-4">
        {/* Contenedor principal estilo móvil */}
        <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/online" element={<Online />} />
            <Route path="/create" element={<CreateGame />} />
            <Route path="/lobby/:roomId" element={<Lobby />} />
            <Route path="/game/:roomId" element={<Game />} />
            <Route path="/local/setup" element={<LocalSetup />} /> 
            <Route path="/local/game" element={<LocalGame />} />  
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;