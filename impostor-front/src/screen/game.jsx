import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EyeOff, Skull, LogOut, ShieldCheck, HelpCircle } from 'lucide-react';
import { Layout } from '../components/ui/Layout';
import socket from '../socket';

export default function Game() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [cardFlipped, setCardFlipped] = useState(false);

  // Validación: Si no hay rol (por recarga de página), volver al inicio
  useEffect(() => {
    if (!state?.role) {
      navigate('/');
    }
  }, [state, navigate]);

  if (!state) return null;

  // Extraemos los datos. Ignoramos 'category' para no mostrarla.
  // 'location' viene del backend conteniendo la palabra secreta.
  const { role, location: secretWord } = state;
  const isImpostor = role === 'impostor';

  const handleExit = () => {
     if (window.confirm("¿Seguro que quieres salir? La partida continuará sin ti.")) {
        socket.emit('disconnect_game'); 
        navigate('/');
     }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-2xl mx-auto gap-8 py-6">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col items-center space-y-3 animate-in fade-in slide-in-from-top-4 duration-700">
            <h1 className="text-3xl md:text-4xl font-black text-white text-center leading-tight drop-shadow-xl">
                TU IDENTIDAD
            </h1>
            <p className="text-slate-400 text-sm max-w-xs text-center font-medium">
                Toca la tarjeta para ver tu rol y tu palabra.
            </p>
        </div>

        {/* --- CARTA 3D INTERACTIVA --- */}
        <div className="perspective-1000 w-full flex justify-center py-4">
            <motion.div
                className="relative w-72 h-[420px] sm:w-80 sm:h-[480px] cursor-pointer group"
                onClick={() => setCardFlipped(!cardFlipped)}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <motion.div
                    className="w-full h-full relative preserve-3d transition-all duration-500"
                    animate={{ rotateY: cardFlipped ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                    {/* --- LADO FRONTAL (OCULTO) --- */}
                    <div className="absolute inset-0 backface-hidden rounded-3xl overflow-hidden border-4 border-indigo-500/30 shadow-2xl shadow-indigo-900/50 bg-slate-900">
                        {/* Patrón de fondo */}
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]" />
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-slate-900 to-indigo-900/80" />
                        
                        <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 text-center gap-6">
                            <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center animate-pulse">
                                <HelpCircle size={48} className="text-indigo-400" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-white tracking-widest mb-2">TOP SECRET</h2>
                                <p className="text-indigo-200 text-sm font-medium">Toca para revelar</p>
                            </div>
                            <div className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-2">
                                <EyeOff size={14} /> Solo para tus ojos
                            </div>
                        </div>
                    </div>

                    {/* --- LADO TRASERO (REVELADO) --- */}
                    <div 
                        className={`absolute inset-0 backface-hidden rotate-y-180 rounded-3xl overflow-hidden border-4 shadow-2xl flex flex-col ${
                            isImpostor 
                            ? 'bg-gradient-to-br from-red-600 to-rose-900 border-red-400 shadow-red-900/50' 
                            : 'bg-gradient-to-br from-emerald-500 to-teal-800 border-emerald-300 shadow-emerald-900/50'
                        }`}
                    >
                        {/* Overlay sutil */}
                        <div className="absolute inset-0 bg-black/10" />

                        <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 text-center text-white">
                            
                            {/* Icono Principal */}
                            <div className="mb-4">
                                {isImpostor ? (
                                    <div className="bg-black/20 p-5 rounded-full ring-4 ring-white/10 animate-bounce-slow">
                                        <Skull size={56} strokeWidth={1.5} />
                                    </div>
                                ) : (
                                    <div className="bg-black/20 p-5 rounded-full ring-4 ring-white/10">
                                        <ShieldCheck size={56} strokeWidth={1.5} />
                                    </div>
                                )}
                            </div>

                            {/* Título de Rol */}
                            <h2 className="text-3xl font-black uppercase tracking-tight drop-shadow-md mb-2">
                                {isImpostor ? "IMPOSTOR" : "JUGADOR"}
                            </h2>

                            <div className="w-16 h-1 bg-white/30 rounded-full mb-6" />

                            {/* Información Específica: PALABRA O INCOGNITA */}
                            <div className="bg-black/20 rounded-2xl p-4 w-full backdrop-blur-sm border border-white/10 shadow-inner">
                                <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest mb-1">
                                    {isImpostor ? "TU OBJETIVO" : "PALABRA CLAVE"}
                                </p>
                                <p className="text-2xl sm:text-3xl font-black leading-tight break-words py-1">
                                    {isImpostor ? "¿Cuál es la palabra?" : secretWord}
                                </p>
                            </div>

                            {/* Instrucción secundaria contextualizada */}
                            <div className="mt-6 bg-black/10 rounded-lg p-3 border border-white/5">
                                <p className="text-xs font-bold text-white/90 leading-relaxed">
                                    {isImpostor 
                                        ? "Escucha, deduce y finge. ¡Que no sepan que no sabes la palabra!" 
                                        : "Da una pista sutil sobre la palabra, pero no seas obvio o el Impostor lo sabrá."
                                    }
                                </p>
                            </div>

                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>

        {/* --- FOOTER / SALIR --- */}
        <div className="mt-auto">
             <button 
                onClick={handleExit}
                className="flex items-center gap-2 text-slate-500 hover:text-red-400 transition-colors px-4 py-2 rounded-lg hover:bg-white/5 text-sm font-bold"
             >
                <LogOut size={16} /> Salir de la partida
             </button>
        </div>

      </div>

      {/* Estilos globales para 3D */}
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </Layout>
  );
}