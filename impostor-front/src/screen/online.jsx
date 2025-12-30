import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronLeft, ChevronRight, Dices, ArrowLeft, Plus, Users } from 'lucide-react';
import { Layout, Avatar } from '../components/ui/Layout';

// TU LISTA PERSONALIZADA
const AVATAR_OPTIONS = [
  { id: 1, style: 'bottts-neutral',     seed: 'Ginger',  name: 'Robo-Zen' },
  { id: 2, style: 'dylan',              seed: 'Milo',    name: 'El Colega' },
  { id: 3, style: 'lorelei-neutral',    seed: 'Avery',   name: 'Minimal' },
  { id: 4, style: 'pixel-art-neutral',  seed: 'Zelda',   name: 'Retro' },
  { id: 5, style: 'thumbs',             seed: 'Buddy',   name: 'El Like' },
  { id: 6, style: 'dylan',              seed: 'Lucky',   name: 'Tranqui' },
];

export default function Online() {
  const [nickname, setNickname] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const nextAvatar = () => setCurrentIndex((prev) => (prev + 1) % AVATAR_OPTIONS.length);
  const prevAvatar = () => setCurrentIndex((prev) => (prev - 1 + AVATAR_OPTIONS.length) % AVATAR_OPTIONS.length);
  
  const randomize = () => {
    // Random avatar
    setCurrentIndex(Math.floor(Math.random() * AVATAR_OPTIONS.length));
    
    // Random name generator
    const prefixes = ["Capitán", "Agente", "Doctor", "Mister", "Sombra", "Ninja"];
    const suffixes = ["X", "Zero", "Loco", "Pro", "Veloz", "Rojo"];
    const randomName = `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
    setNickname(randomName);
  };

  const handleCreate = () => {
    if (!nickname.trim()) return alert("¡Necesitas un nombre para jugar!");
    
    navigate('/create', { 
        state: { 
            nickname, 
            avatarConfig: AVATAR_OPTIONS[currentIndex] 
        } 
    });
  };

  const handleJoin = () => {
    if (!nickname.trim()) return alert("¡Necesitas un nombre para jugar!");
    if (!roomCode.trim()) return alert("Introduce el código de la sala.");
    
    navigate(`/lobby/${roomCode.toUpperCase()}`, { 
        state: { 
            nickname, 
            isHost: false, 
            avatarConfig: AVATAR_OPTIONS[currentIndex] 
        } 
    });
  };

  return (
    <Layout>
      <div className="w-full max-w-md mx-auto flex flex-col gap-6">
        
        {/* HEADER SIMPLE */}
        <div className="flex items-center gap-4">
             <button onClick={() => navigate('/')} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors">
                <ArrowLeft size={20} />
             </button>
             <h2 className="text-xl font-bold text-white">Perfil de Jugador</h2>
        </div>

        {/* --- TARJETA DE PERFIL --- */}
        <div className="bg-slate-800/50 border border-white/5 p-6 rounded-3xl shadow-xl space-y-6">
            
            {/* 1. SELECTOR DE AVATAR */}
            <div className="relative flex flex-col items-center">
                <div className="flex items-center justify-between w-full mb-2">
                    <button onClick={prevAvatar} className="p-3 bg-slate-700 rounded-full hover:bg-slate-600 text-white transition-colors">
                        <ChevronLeft size={20} />
                    </button>

                    <div className="relative w-32 h-32 mx-4">
                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.8, x: -20 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className="w-full h-full"
                            >
                                <Avatar 
                                    style={AVATAR_OPTIONS[currentIndex].style} 
                                    seed={AVATAR_OPTIONS[currentIndex].seed} 
                                    className="w-full h-full drop-shadow-2xl" 
                                    bgColor="bg-gradient-to-br from-indigo-500 to-purple-600 border-4 border-slate-800 shadow-xl"
                                />
                            </motion.div>
                        </AnimatePresence>
                        {/* Botón Random flotante */}
                        <motion.button 
                            whileTap={{ rotate: 360 }}
                            onClick={randomize} 
                            className="absolute -bottom-2 -right-2 bg-yellow-400 text-black p-2 rounded-full shadow-lg border-2 border-slate-800 z-20 hover:bg-yellow-300"
                        >
                            <Dices size={18} />
                        </motion.button>
                    </div>

                    <button onClick={nextAvatar} className="p-3 bg-slate-700 rounded-full hover:bg-slate-600 text-white transition-colors">
                        <ChevronRight size={20} />
                    </button>
                </div>
                <span className="text-slate-400 text-xs font-bold tracking-widest uppercase mt-2">
                    {AVATAR_OPTIONS[currentIndex].name}
                </span>
            </div>

            {/* 2. INPUT DE NOMBRE */}
            <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase ml-1">Tu Nombre</label>
                <input 
                    type="text" 
                    placeholder="Escribe tu apodo..." 
                    value={nickname} 
                    maxLength={12}
                    onChange={e => setNickname(e.target.value)} 
                    className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded-xl p-4 text-white font-bold text-lg text-center outline-none transition-all placeholder:text-slate-600" 
                />
            </div>
        </div>

        {/* --- SECCIÓN DE ACCIONES --- */}
        <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500 delay-150">
            
            {/* OPCIÓN A: CREAR NUEVA */}
            <motion.button 
                whileTap={{ scale: 0.98 }} 
                onClick={handleCreate} 
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 p-4 rounded-xl flex items-center justify-between group shadow-lg shadow-emerald-900/20"
            >
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                        <Plus size={20} className="text-white" />
                    </div>
                    <div className="text-left">
                        <h3 className="text-white font-black text-lg">CREAR SALA</h3>
                        <p className="text-emerald-100 text-xs">Sé el anfitrión</p>
                    </div>
                </div>
                <ChevronRight className="text-white/50 group-hover:text-white transition-colors" />
            </motion.button>

            {/* OPCIÓN B: UNIRSE (Input + Botón) */}
            <div className="bg-indigo-600 p-1.5 rounded-xl shadow-lg shadow-indigo-900/20 flex items-center gap-2">
                 <input 
                    type="text" 
                    placeholder="CÓDIGO SALA" 
                    value={roomCode}
                    onChange={e => setRoomCode(e.target.value.toUpperCase())}
                    className="flex-1 bg-indigo-800/50 border-none rounded-lg p-3 text-white font-mono font-bold placeholder:text-indigo-300/50 focus:ring-0 text-center uppercase tracking-widest"
                 />
                 <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={handleJoin}
                    className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-black text-sm hover:bg-indigo-50 transition-colors flex items-center gap-2"
                 >
                    UNIRSE <Play size={16} fill="currentColor" />
                 </motion.button>
            </div>

        </div>

      </div>
    </Layout>
  );
}