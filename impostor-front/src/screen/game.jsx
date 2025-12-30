import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, CheckCircle, AlertTriangle, LogOut } from 'lucide-react';
import { Layout } from '../components/ui/Layout';
import socket from '../socket';

export default function Game() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [cardFlipped, setCardFlipped] = useState(false);

  // Si no hay datos (recarga de página), volver al inicio
  useEffect(() => {
    if (!state?.role) {
      navigate('/');
    }
  }, [state, navigate]);

  if (!state) return null;

  const { role, location, category } = state;
  const isImpostor = role === 'impostor';

  return (
    <Layout>
      <div className="h-full flex flex-col items-center justify-center py-4 space-y-6">
        
        {/* INFO SUPERIOR */}
        <div className="text-center space-y-1">
            <span className="text-xs font-bold text-white/40 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">
                Categoría: {category.toUpperCase()}
            </span>
            <p className="text-white/60 text-sm">Tu misión secreta</p>
        </div>

        {/* CARTA 3D INTERACTIVA */}
        <div 
             className="w-full max-w-[280px] h-[400px] relative cursor-pointer group perspective-1000" 
             onClick={() => setCardFlipped(!cardFlipped)}
        >
            <motion.div
              className="w-full h-full relative transform-style-3d"
              initial={false}
              animate={{ rotateY: cardFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
            >
              {/* FRENTE DE LA CARTA */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-violet-600 to-indigo-900 rounded-3xl shadow-2xl flex flex-col items-center justify-center border-4 border-white/10 backface-hidden"
              >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <Eye size={60} className="text-white/40 mb-6 animate-pulse" />
                <h2 className="text-2xl font-black text-white tracking-widest mb-2">TOP SECRET</h2>
                <p className="text-xs text-white/50 font-bold bg-black/20 px-4 py-2 rounded-lg">TOCA PARA REVELAR</p>
              </div>

              {/* DORSO DE LA CARTA (EL ROL) */}
              <div 
                 className={`absolute inset-0 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-6 text-center border-4 backface-hidden rotate-y-180 ${isImpostor ? 'bg-red-600 border-red-400' : 'bg-emerald-500 border-emerald-300'}`}
              >
                 {isImpostor ? 
                    <AlertTriangle size={80} className="text-white mb-6 drop-shadow-lg"/> : 
                    <CheckCircle size={80} className="text-white mb-6 drop-shadow-lg"/>
                 }
                 
                 <h2 className="text-4xl font-black text-white mb-2 drop-shadow-md">
                   {isImpostor ? "IMPOSTOR" : "CIVIL"}
                 </h2>
                 
                 <div className="w-full h-px bg-white/30 my-6"/>
                 
                 <p className="text-white/80 text-xs uppercase font-bold mb-2">Ubicación:</p>
                 <p className="text-3xl font-black text-white leading-tight break-words drop-shadow-md">
                   {location}
                 </p>

                 {isImpostor && (
                    <p className="mt-4 text-xs font-bold text-white/60 bg-black/20 p-2 rounded">
                        Intenta descubrir dónde están.
                    </p>
                 )}
              </div>
            </motion.div>
        </div>

        {/* INSTRUCCIONES */}
        <div className="text-center max-w-xs">
            {cardFlipped ? (
                <p className="text-white font-bold animate-in fade-in duration-700">
                    ¡Mantén tu cara de póker! <br/>
                    <span className="text-white/50 text-xs font-normal">Debatid entre todos para encontrar al impostor.</span>
                </p>
            ) : (
                <p className="text-white/30 text-sm">Nadie más puede ver tu pantalla.</p>
            )}
        </div>

        {/* SALIR */}
        <button 
            onClick={() => {
                socket.emit('disconnect_game'); // Opcional: Avisar al server
                navigate('/');
            }}
            className="mt-auto flex items-center gap-2 text-white/30 hover:text-white transition-colors text-sm font-bold"
        >
            <LogOut size={16} /> Salir al Menú
        </button>

      </div>
    </Layout>
  );
}