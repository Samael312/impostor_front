import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, LogOut, AlertTriangle } from 'lucide-react';

// --- COMPONENTE AVATAR (Sin cambios, es útil) ---
export const Avatar = ({ 
  style = 'bottts', 
  seed = 'Felix', 
  className = "w-16 h-16",
  bgColor = "bg-white/10" 
}) => {
  const src = `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}&backgroundColor=4ABCE8,c0aede,d1d4f9,ffdfbf,ffd5dc`;
  return (
    <div className={`relative overflow-hidden rounded-full border-4 border-white/20 shadow-lg ${bgColor} ${className}`}>
      <img src={src} alt="Avatar" className="w-full h-full object-cover" />
    </div>
  );
};

// --- LAYOUT FULL SCREEN ---
export const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showExitModal, setShowExitModal] = useState(false);

  const isHome = location.pathname === '/';
  const isInGame = location.pathname.includes('/lobby') || location.pathname.includes('/game');

  const handleBack = () => {
    if (isInGame) {
      setShowExitModal(true);
    } else {
      navigate(-1);
    }
  };

  const confirmExit = () => {
    setShowExitModal(false);
    navigate('/');
  };

  return (
    // CAMBIO 1: El contenedor principal es AHORA el cuerpo de la web.
    // min-h-[100dvh] asegura que ocupe toda la pantalla vertical real del móvil.
    <div className="min-h-[100dvh] w-full bg-slate-900 text-white relative overflow-x-hidden flex flex-col">
      
      {/* FONDO ANIMADO (Ahora ocupa toda la pantalla de fondo) */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-20%] left-[-20%] w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] bg-purple-600/20 rounded-full blur-[120px]"
          />
          <motion.div 
            animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-20%] right-[-20%] w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] bg-blue-600/20 rounded-full blur-[120px]"
          />
      </div>

      {/* BOTÓN DE ATRÁS/SALIR (Flotante fijo en la esquina) */}
      {!isHome && (
        <div className="fixed top-4 right-4 z-50">
          <button 
            onClick={handleBack}
            className="p-3 bg-slate-800/50 hover:bg-slate-700/80 rounded-full text-white/90 shadow-lg backdrop-blur-md border border-white/10 transition-all active:scale-95"
          >
            {isInGame ? <LogOut size={24} /> : <ArrowLeft size={24} />}
          </button>
        </div>
      )}

      {/* CAMBIO 2: CONTENEDOR DE CONTENIDO
          - z-10: Para estar encima del fondo.
          - w-full max-w-2xl: En móvil ocupa todo, en PC se centra y no se desparrama.
          - mx-auto: Centrado horizontalmente.
          - flex-1 flex flex-col: Permite centrar verticalmente si el contenido es poco (login).
      */}
      <main className="relative z-10 w-full max-w-3xl mx-auto flex-1 flex flex-col p-4 sm:p-8">
        {/* Este div interno ayuda a centrar verticalmente el contenido como el Login */}
        <div className="flex-1 flex flex-col justify-center w-full">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
            >
                {children}
            </motion.div>
        </div>
      </main>

      {/* MODAL DE SALIDA (Ajustado para verse bien en pantalla completa) */}
      <AnimatePresence>
        {showExitModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowExitModal(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-800 w-full max-w-sm rounded-2xl border border-white/10 shadow-2xl relative z-50 p-6 text-center"
            >
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">¿Abandonar la partida?</h3>
              <p className="text-slate-400 text-sm mb-6">
                Si sales ahora te desconectarás de la sala actual.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setShowExitModal(false)}
                  className="p-3 rounded-xl bg-slate-700 font-semibold hover:bg-slate-600 transition text-white"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmExit}
                  className="p-3 rounded-xl bg-red-600 font-semibold hover:bg-red-500 transition shadow-lg shadow-red-500/20 text-white"
                >
                  Salir
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};