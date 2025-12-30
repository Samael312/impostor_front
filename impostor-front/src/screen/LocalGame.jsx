import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, CheckCircle, AlertTriangle, Fingerprint, ArrowRight, Loader2 } from 'lucide-react';
import { Layout, Avatar } from '../components/ui/Layout';

const LOCATIONS = ["La Playa", "Submarino", "Estación Espacial", "El Circo", "Hospital", "Banco", "Casino", "Avión", "Hotel", "Pirámides"];

export default function LocalGame() {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  // ESTADOS
  const [gamePhase, setGamePhase] = useState('distributing'); 
  const [turnIndex, setTurnIndex] = useState(0); 
  const [isRevealed, setIsRevealed] = useState(false); 
  const [cardFlipped, setCardFlipped] = useState(false); 
  
  // DATOS
  const [gameData, setGameData] = useState(null); // Empezamos en null para mostrar carga

  useEffect(() => {
    // PROTECCIÓN: Si no hay jugadores (por recargar página), volver al inicio
    if (!state?.players || state.players.length === 0) {
      navigate('/');
      return;
    }
    
    const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    const impostorIndex = Math.floor(Math.random() * state.players.length);
    
    const playersWithRoles = state.players.map((p, i) => ({
      ...p,
      isImpostor: i === impostorIndex
    }));

    setGameData({ players: playersWithRoles, location, impostorId: playersWithRoles[impostorIndex].id });
  }, [state, navigate]);

  // PANTALLA DE CARGA (Para evitar pantalla azul/vacía)
  if (!gameData) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-full text-white">
          <Loader2 className="animate-spin mb-4" size={48} />
          <p>Preparando partida...</p>
        </div>
      </Layout>
    );
  }

  // Variables útiles
  const currentPlayer = gameData.players[turnIndex];
  const isLastPlayer = turnIndex === gameData.players.length - 1;

  const handleNextTurn = () => {
    setCardFlipped(false);
    // Pequeño timeout para que la animación de cierre se vea antes de cambiar de jugador
    setTimeout(() => {
      setIsRevealed(false);
      if (isLastPlayer) {
        setGamePhase('playing');
      } else {
        setTurnIndex(prev => prev + 1);
      }
    }, 300);
  };

  // --- FASE FINAL: DEBATE ---
  if (gamePhase === 'playing') {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-full space-y-8 text-center pt-10">
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse"
          >
            <AlertTriangle size={48} className="text-white" />
          </motion.div>
          
          <div>
            <h2 className="text-4xl font-black text-white mb-2">¡A DEBATIR!</h2>
            <p className="text-white/60">El impostor está entre nosotros.</p>
          </div>

          <div className="bg-white/5 p-6 rounded-2xl w-full border border-white/10">
            <p className="text-sm font-bold text-white/40 uppercase mb-4">Jugadores</p>
            <div className="flex flex-wrap gap-4 justify-center">
              {gameData.players.map(p => (
                <div key={p.id} className="flex flex-col items-center">
                    <Avatar style="bottts-neutral" seed={`local-player-${p.id}`} className="w-12 h-12 mb-1" />
                    <span className="text-xs text-white/70 font-bold">{p.name}</span>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => navigate('/')} 
            className="w-full bg-white/10 hover:bg-white/20 py-4 rounded-xl font-bold mt-auto text-white transition-colors"
          >
            Terminar Partida
          </button>
        </div>
      </Layout>
    );
  }

  // --- FASE DE REPARTO ---
  return (
    <Layout>
      <div className="h-full flex flex-col items-center justify-between py-4">
        
        <div className="w-full text-center">
          <span className="text-xs font-bold text-white/40 uppercase tracking-widest">
            JUGADOR {turnIndex + 1} de {gameData.players.length}
          </span>
        </div>

        {/* CONTENIDO CENTRAL */}
        {!isRevealed ? (
          // PANTALLA: PASAR AL SIGUIENTE
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center space-y-6 flex-1 justify-center"
          >
            <div className="w-40 h-40">
                <Avatar style="bottts-neutral" seed={`local-player-${currentPlayer.id}`} className="w-full h-full shadow-2xl" />
            </div>
            <div className="text-center">
              <p className="text-white/50 text-sm font-bold uppercase mb-2">Pasa el móvil a</p>
              <h2 className="text-4xl font-black text-emerald-400">{currentPlayer.name}</h2>
            </div>
            <button 
              onClick={() => setIsRevealed(true)}
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 transition-all border border-white/20 mt-8 shadow-lg"
            >
              <Fingerprint /> Soy {currentPlayer.name}, ver mi rol
            </button>
          </motion.div>
        ) : (
          // PANTALLA: CARTA 3D (Con estilos forzados para asegurar que funcione)
          <div 
             className="w-full max-w-[280px] h-[380px] relative cursor-pointer group mt-4" 
             style={{ perspective: "1000px" }} // Forzamos la perspectiva aquí
             onClick={() => setCardFlipped(!cardFlipped)}
          >
            <motion.div
              className="w-full h-full relative"
              initial={false}
              animate={{ rotateY: cardFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
              style={{ transformStyle: "preserve-3d" }} // Forzamos estilo 3D
            >
              {/* FRENTE (Interrogación) */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl shadow-2xl flex flex-col items-center justify-center border-4 border-white/10"
                style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }} // Ocultamos la espalda
              >
                <Eye size={60} className="text-white/30 mb-4 animate-bounce" />
                <p className="font-black text-xl text-white tracking-widest text-center px-4">HOLA {currentPlayer.name.toUpperCase()}</p>
                <p className="text-sm text-white/50 mt-2 font-bold">TOCA PARA GIRAR</p>
              </div>

              {/* DORSO (RESULTADO) */}
              <div 
                 className={`absolute inset-0 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-6 text-center border-4 ${currentPlayer.isImpostor ? 'bg-red-600 border-red-400' : 'bg-blue-500 border-blue-300'}`}
                 style={{ 
                   backfaceVisibility: "hidden", 
                   WebkitBackfaceVisibility: "hidden", 
                   transform: "rotateY(180deg)" 
                 }}
              >
                 {currentPlayer.isImpostor ? 
                    <AlertTriangle size={64} className="text-white mb-4 drop-shadow-lg"/> : 
                    <CheckCircle size={64} className="text-white mb-4 drop-shadow-lg"/>
                 }
                 
                 <h2 className="text-3xl font-black text-white mb-2 filter drop-shadow-md">
                   {currentPlayer.isImpostor ? "IMPOSTOR" : "CIVIL"}
                 </h2>
                 
                 <div className="w-full h-px bg-white/30 my-4"/>
                 
                 <p className="text-white/80 text-sm uppercase font-bold mb-1">Tu ubicación:</p>
                 <p className="text-2xl font-black text-white leading-tight break-words filter drop-shadow-md">
                   {currentPlayer.isImpostor ? "???" : gameData.location}
                 </p>
              </div>
            </motion.div>
          </div>
        )}

        {/* BOTÓN SIGUIENTE (Solo sale si ya giraste la carta) */}
        <div className="w-full h-20 flex items-end">
          {isRevealed && cardFlipped && (
             <motion.button 
               initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
               onClick={handleNextTurn}
               className="w-full bg-white text-black py-4 rounded-xl font-black text-lg shadow-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors z-50"
             >
               {isLastPlayer ? "¡EMPEZAR JUEGO!" : "OCULTAR Y PASAR"} <ArrowRight size={20} />
             </motion.button>
          )}
        </div>

      </div>
    </Layout>
  );
}