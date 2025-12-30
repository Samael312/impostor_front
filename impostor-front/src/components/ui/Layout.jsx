import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, LogOut, AlertTriangle, Ghost } from 'lucide-react';

// --- COMPONENTE AVATAR (Se mantiene igual) ---
export const Avatar = ({ 
  style = 'bottts', 
  seed = 'Felix', 
  className = "w-10 h-10", // Un poco más pequeño por defecto para la navbar
  bgColor = "bg-white/10" 
}) => {
  const src = `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}&backgroundColor=4ABCE8,c0aede,d1d4f9,ffdfbf,ffd5dc`;
  return (
    <div className={`relative overflow-hidden rounded-full border-2 border-white/20 shadow-sm ${bgColor} ${className}`}>
      <img src={src} alt="Avatar" className="w-full h-full object-cover" />
    </div>
  );
};

// --- LAYOUT WEB ---
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
    <div className="min-h-screen w-full bg-[#243764] text-white font-sans selection:bg-purple-500/30">
      
      {/* 1. FONDO (Fixed para que no se mueva al hacer scroll) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black opacity-80" />
        <motion.div 
          animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[-10%] left-[20%] w-[40vw] h-[40vw] bg-purple-600/10 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
          className="absolute bottom-[-10%] right-[10%] w-[30vw] h-[30vw] bg-blue-600/10 rounded-full blur-[100px]"
        />
      </div>

      {/* 2. NAVBAR (Barra de navegación superior tipo web) */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/5 bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-8">
        
        {/* Lado Izquierdo: Logo o Botón Atrás */}
        <div className="flex items-center gap-4">
          {!isHome && (
            <button 
              onClick={handleBack}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-300 hover:text-white"
            >
              {isInGame ? <LogOut size={20} /> : <ArrowLeft size={20} />}
            </button>
          )}
          
          <div className="flex items-center gap-2 cursor-default select-none">
            <div className="bg-gradient-to-tr from-purple-500 to-blue-500 p-1.5 rounded-lg">
              <Ghost size={20} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight hidden sm:block">IMPOSTOR</span>
          </div>
        </div>

        {/* Lado Derecho: Estado o Perfil (Placeholder visual) */}
        <div className="flex items-center gap-3">
             {/* Aquí podrías poner el nombre del usuario si lo tienes guardado en un estado global */}
             {isInGame && <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">En partida</span>}
        </div>
      </nav>

      {/* 3. CONTENEDOR PRINCIPAL (Main Content)
          - pt-24: Padding top para que la navbar no tape el contenido.
          - max-w-5xl: Ancho máximo estilo web (más ancho que antes).
          - mx-auto: Centrado horizontal.
      */}
      <main className="relative z-10 w-full max-w-5xl mx-auto pt-24 pb-12 px-4 sm:px-6 flex flex-col items-center min-h-screen">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          {children}
        </motion.div>
      </main>

      {/* MODAL DE CONFIRMACIÓN (Estilo flotante limpio) */}
      <AnimatePresence>
        {showExitModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-800 border border-slate-700 w-full max-w-sm rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="p-3 bg-red-500/10 rounded-full text-red-500">
                  <AlertTriangle size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">¿Abandonar partida?</h3>
                  <p className="text-slate-400 text-sm mt-1">Si sales ahora perderás la conexión.</p>
                </div>
                <div className="flex gap-3 w-full mt-2">
                  <button 
                    onClick={() => setShowExitModal(false)}
                    className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-xl text-sm font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={confirmExit}
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 rounded-xl text-sm font-medium transition-colors"
                  >
                    Salir
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};