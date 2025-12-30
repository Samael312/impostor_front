import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Users, ChevronLeft, ChevronRight, Dices, Smartphone } from 'lucide-react';
import { Layout, Avatar } from '../components/ui/Layout';

// TU LISTA PERSONALIZADA
const AVATAR_OPTIONS = [
  { id: 1, style: 'bottts-neutral',    seed: 'Ginger',  name: 'Robo-Zen' },
  { id: 2, style: 'dylan',             seed: 'Milo',    name: 'El Colega' },
  { id: 3, style: 'lorelei-neutral',   seed: 'Avery',   name: 'Minimal' },
  { id: 4, style: 'pixel-art-neutral', seed: 'Zelda',   name: 'Retro' },
  { id: 5, style: 'thumbs',            seed: 'Buddy',   name: 'El Like' },
  { id: 6, style: 'dylan',             seed: 'Lucky',   name: 'Tranqui' },
];

export default function Home() {
  const [nickname, setNickname] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const nextAvatar = () => setCurrentIndex((prev) => (prev + 1) % AVATAR_OPTIONS.length);
  const prevAvatar = () => setCurrentIndex((prev) => (prev - 1 + AVATAR_OPTIONS.length) % AVATAR_OPTIONS.length);
  
  const randomize = () => {
    setCurrentIndex(Math.floor(Math.random() * AVATAR_OPTIONS.length));
    if (!nickname) {
        const randomNames = ["Capitán", "Sombra", "Ninja", "Alien"];
        setNickname(randomNames[Math.floor(Math.random() * randomNames.length)]);
    }
  };

  const handleCreate = () => {
    if (!nickname) return;
    navigate(`/lobby/ABCD`, { state: { nickname, isHost: true, avatarConfig: AVATAR_OPTIONS[currentIndex] } });
  };

  const handleJoin = () => {
    if (!nickname || !roomCode) return;
    navigate(`/lobby/${roomCode}`, { state: { nickname, isHost: false, avatarConfig: AVATAR_OPTIONS[currentIndex] } });
  };

  return (
    <Layout>
      <div className="flex flex-col items-center space-y-5 py-2">
        
        {/* Título */}
        <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-center">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-500 drop-shadow-sm">
            IMPOSTOR
          </h1>
        </motion.div>

        {/* Selector de Avatar */}
        <div className="relative w-full flex flex-col items-center justify-center space-y-3">
            <div className="relative flex items-center justify-center w-full">
                <button onClick={prevAvatar} className="absolute left-0 z-20 p-2 bg-white/10 rounded-full hover:bg-white/20 text-white/70"><ChevronLeft size={24} /></button>
                <AnimatePresence mode='wait'>
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.5, rotate: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative z-10 py-4"
                >
                    <div className="w-32 h-32"> 
                      <Avatar 
                        style={AVATAR_OPTIONS[currentIndex].style} 
                        seed={AVATAR_OPTIONS[currentIndex].seed} 
                        className="w-full h-full border-4 border-white shadow-2xl" 
                        bgColor="bg-gradient-to-br from-pink-500/30 to-purple-600/30 border-2 border-white/20"
                      />
                    </div>
                </motion.div>
                </AnimatePresence>
                <button onClick={nextAvatar} className="absolute right-0 z-20 p-2 bg-white/10 rounded-full hover:bg-white/20 text-white/70"><ChevronRight size={24} /></button>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-white/50">{AVATAR_OPTIONS[currentIndex].name}</span>
                <button onClick={randomize} className="p-1 bg-white/5 rounded-full hover:bg-yellow-400 hover:text-black transition-colors"><Dices size={14} /></button>
            </div>
        </div>

        {/* Inputs Online */}
        <div className="w-full space-y-2">
            <input type="text" placeholder="Tu Apodo" value={nickname} className="w-full p-4 rounded-2xl bg-black/20 border-2 border-transparent focus:border-pink-400 text-white text-center font-bold text-xl outline-none placeholder:text-white/20" onChange={e => setNickname(e.target.value)} />
        </div>

        {/* Botones Online */}
        <div className="w-full grid grid-cols-2 gap-2">
           <motion.button whileTap={{ scale: 0.95 }} onClick={handleCreate} className="bg-pink-600 p-4 rounded-xl font-bold flex flex-col items-center justify-center text-xs gap-1 shadow-lg shadow-pink-600/20">
             <Play size={24} /> ONLINE
           </motion.button>
           <div className="flex flex-col gap-2">
              <input type="text" placeholder="CÓDIGO" className="w-full p-2 rounded-xl bg-black/20 text-center font-bold text-xs outline-none text-white" onChange={e => setRoomCode(e.target.value)} />
              <motion.button whileTap={{ scale: 0.95 }} onClick={handleJoin} className="bg-white/10 hover:bg-white/20 p-2 rounded-xl font-bold text-xs text-white">UNIRSE</motion.button>
           </div>
        </div>

        <div className="w-full h-px bg-white/10 my-2"></div>

        {/* --- NUEVO BOTÓN MODO LOCAL --- */}
        <motion.button 
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/local/setup')}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 p-4 rounded-2xl font-black text-lg shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-3 relative overflow-hidden group text-white"
        >   
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <Smartphone className="fill-white/20" />
            MODO LOCAL
        </motion.button>

      </div>
    </Layout>
  );
}