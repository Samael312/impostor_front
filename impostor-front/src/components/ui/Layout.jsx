import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, LogOut, AlertTriangle } from 'lucide-react';

// --- COMPONENTE AVATAR (Igual) ---
export const Avatar = ({ 
  style = 'bottts', 
  seed = 'Felix', 
  className = "w-16 h-16",
  bgColor = "bg-white/10" // Agregué prop para flexibilidad
}) => {
  const src = `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}&backgroundColor=4ABCE8,c0aede,d1d4f9,ffdfbf,ffd5dc`;
  return (
    <div className={`relative overflow-hidden rounded-full border-4 border-white/20 shadow-lg ${bgColor} ${className}`}>
      <img src={src} alt="Avatar" className="w-full h-full object-cover" />
    </div>
  );
};

// --- LAYOUT PRINCIPAL ---
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
    // CAMBIO 1: h-[100dvh] asegura que se ajuste a la pantalla real del móvil (sin que la barra de url tape nada)
    <div className="h-[100dvh] w-full flex items-center justify-center p-4 relative overflow-hidden bg-slate-900">
      
      {/* Fondo Animado (Sin cambios, funciona bien) */}
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

      {/* CAMBIO 2: CONTENEDOR DE TARJETA
         - h-full: Ocupa todo el alto disponible dentro del padding.
         - max-h-[900px]: En monitores grandes, no se estira infinitamente hacia arriba.
         - flex flex-col: Vital para que el scroll interno funcione.
      */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md h-full max-h-[850px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl z-10 relative flex flex-col overflow-hidden"
      >
        
        {/* HEADER FLOTANTE */}
        {!isHome && (
          <div className="absolute top-4 right-4 z-20"> {/* Cambié a Right para consistencia con UI móvil estándar */}
            <button 
              onClick={handleBack}
              className="p-2 bg-black/20 hover:bg-black/40 rounded-full text-white/70 hover:text-white transition-all backdrop-blur-md border border-white/5"
            >
              {isInGame ? <LogOut size={20} /> : <ArrowLeft size={20} />}
            </button>
          </div>
        )}

        {/* CAMBIO 3: ÁREA DE SCROLL
           - flex-1: Ocupa todo el espacio restante.
           - overflow-y-auto: El scroll ocurre AQUÍ dentro, no en toda la página.
           - p-6: Padding interno.
        */}
        <div className="flex-1 w-full overflow-y-auto overflow-x-hidden custom-scrollbar p-6">
          {children}
        </div>

      </motion.div>

      {/* --- MODAL (Responsive tweaks) --- */}
      <AnimatePresence>
        {showExitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowExitModal(false)}
            />
            {/* max-w-[90%] asegura que en móviles muy estrechos no toque los bordes */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1e1e2e] w-full max-w-xs max-w-[90%] rounded-3xl border border-white/10 shadow-2xl relative z-50 p-6 text-center"
            >
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                <AlertTriangle size={32} />
              </div>
              
              <h3 className="text-xl font-black text-white mb-2">¿Abandonar?</h3>
              <p className="text-white/50 text-sm mb-6 leading-relaxed">
                Si sales ahora, perderás tu progreso y desconectarás de la sala.
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setShowExitModal(false)}
                  className="p-3 rounded-xl bg-white/5 font-bold hover:bg-white/10 transition text-sm"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmExit}
                  className="p-3 rounded-xl bg-red-500 font-bold hover:bg-red-600 transition shadow-lg shadow-red-500/20 text-sm"
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