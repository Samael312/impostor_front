import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, LogOut, AlertTriangle } from 'lucide-react';

// --- COMPONENTE AVATAR (Sin cambios) ---
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
    // CAMBIO 1: Reduje el padding externo (p-2 en vez de p-4).
    // En móviles (pantalla pequeña) el borde azul será muy fino para dar más espacio al juego.
    <div className="h-[100dvh] w-full flex items-center justify-center p-2 sm:p-4 relative overflow-hidden bg-slate-900">
      
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

      {/* CAMBIO 2: Tarjeta Principal
          - w-full: Ocupa todo el ancho posible.
          - max-w-lg: Aumenté un poco el ancho máximo en PC (de md a lg) por si quieres más aire.
          - rounded-xl: Bordes un poco menos redondos en móvil para ganar esquinas útiles.
      */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg h-full max-h-[900px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-[2rem] shadow-2xl z-10 relative flex flex-col overflow-hidden"
      >
        
        {/* HEADER FLOTANTE */}
        {!isHome && (
          <div className="absolute top-3 right-3 z-20"> 
            <button 
              onClick={handleBack}
              className="p-2 bg-black/20 hover:bg-black/40 rounded-full text-white/70 hover:text-white transition-all backdrop-blur-md border border-white/5"
            >
              {isInGame ? <LogOut size={20} /> : <ArrowLeft size={20} />}
            </button>
          </div>
        )}

        {/* CAMBIO 3: Padding Interno
            - p-4: En móvil, el relleno interno es menor.
            - sm:p-6: En PC, vuelve a ser espacioso.
            Esto regala unos 16px extra de ancho a los botones e inputs.
        */}
        <div className="flex-1 w-full overflow-y-auto overflow-x-hidden custom-scrollbar p-4 sm:p-6">
          {children}
        </div>

      </motion.div>

      {/* --- MODAL (Sin cambios funcionales, solo ajustes visuales menores) --- */}
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
              className="bg-[#1e1e2e] w-full max-w-[90%] sm:max-w-xs rounded-2xl border border-white/10 shadow-2xl relative z-50 p-6 text-center"
            >
              <div className="w-14 h-14 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                <AlertTriangle size={28} />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">¿Abandonar?</h3>
              <p className="text-white/50 text-sm mb-6 leading-relaxed">
                Perderás tu progreso actual.
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setShowExitModal(false)}
                  className="p-3 rounded-xl bg-white/5 font-semibold hover:bg-white/10 transition text-sm text-white"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmExit}
                  className="p-3 rounded-xl bg-red-500 font-semibold hover:bg-red-600 transition shadow-lg shadow-red-500/20 text-sm text-white"
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