import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, LogOut, X, AlertTriangle } from 'lucide-react';

// --- COMPONENTE AVATAR (Mantenemos el que tenías) ---
export const Avatar = ({ 
  style = 'bottts', 
  seed = 'Felix', 
  className = "w-16 h-16" 
}) => {
  const src = `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}&backgroundColor=4ABCE8,c0aede,d1d4f9,ffdfbf,ffd5dc`;
  return (
    <div className={`relative overflow-hidden rounded-full border-4 border-white/20 shadow-lg bg-white/10 ${className}`}>
      <img src={src} alt="Avatar" className="w-full h-full object-cover" />
    </div>
  );
};

// --- LAYOUT PRINCIPAL CON NAVEGACIÓN ---
export const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showExitModal, setShowExitModal] = useState(false);

  // Detectamos si estamos en la Home
  const isHome = location.pathname === '/';
  
  // Detectamos si estamos "jugando" (Lobby o Game)
  const isInGame = location.pathname.includes('/lobby') || location.pathname.includes('/game');

  const handleBack = () => {
    if (isInGame) {
      // Si está jugando, pedimos confirmación antes de "Romper" la conexión
      setShowExitModal(true);
    } else {
      // Navegación normal hacia atrás (por si agregas pantallas de Info/Créditos)
      navigate(-1);
    }
  };

  const confirmExit = () => {
    // AQUÍ MÁS ADELANTE: socket.emit('leave_room')
    setShowExitModal(false);
    navigate('/');
  };

  return (
    <div className="h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-slate-900">
      
      {/* Fondo Animado */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[100px]"
      />
      <motion.div 
        animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-20%] right-[-20%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[100px]"
      />

      {/* Contenedor Principal */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl z-10 p-6 relative flex flex-col max-h-[120vh]"
      >
        
        {/* HEADER DE NAVEGACIÓN (Solo si no es Home) */}
        {!isHome && (
          <div className="absolute top-4 right-4 z-20">
            <button 
              onClick={handleBack}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white/70 hover:text-white transition-all backdrop-blur-md"
            >
              {isInGame ? <LogOut size={20} /> : <ArrowLeft size={20} />}
            </button>
          </div>
        )}

        {/* Contenido de la página (Scrollable si es muy largo) */}
        <div className="w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar pt-6">
          {children}
        </div>
      </motion.div>

      {/* --- MODAL DE CONFIRMACIÓN DE SALIDA --- */}
      <AnimatePresence>
        {showExitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowExitModal(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1e1e2e] w-full max-w-xs rounded-3xl border border-white/10 shadow-2xl relative z-50 p-6 text-center"
            >
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                <AlertTriangle size={32} />
              </div>
              
              <h3 className="text-xl font-black text-white mb-2">¿Salir de la partida?</h3>
              <p className="text-white/50 text-sm mb-6">
                Si sales ahora, perderás tu progreso y desconectarás de la sala.
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setShowExitModal(false)}
                  className="p-3 rounded-xl bg-white/5 font-bold hover:bg-white/10 transition"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmExit}
                  className="p-3 rounded-xl bg-red-500 font-bold hover:bg-red-600 transition shadow-lg shadow-red-500/20"
                >
                  Sí, Salir
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};