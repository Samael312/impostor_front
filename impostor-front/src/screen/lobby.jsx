import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Copy, Crown, Play, ArrowLeft } from 'lucide-react';
import { Layout, Avatar } from '../components/ui/Layout';
import socket from '../socket';

export default function Lobby() {
  const params = useParams();
  const roomId = params.roomId || window.location.pathname.split('/').pop();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [players, setPlayers] = useState(state?.players || []);

  useEffect(() => {
    if (!state?.nickname) navigate('/');

    socket.on('update_players', (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    socket.on('game_started', (gameData) => {
      navigate(`/game/${roomId}`, { state: { ...gameData } });
    });

    socket.on('error_message', (msg) => alert(msg));

    return () => {
      socket.off('update_players');
      socket.off('game_started');
      socket.off('error_message');
    };
  }, [roomId, navigate, state]);

  const copyCode = () => {
    navigator.clipboard.writeText(roomId);
    alert("Código copiado: " + roomId);
  };

  const handleStartGame = () => {
    // Ya no enviamos categoryId porque el server ya sabe cuáles elegimos al crear la sala
    socket.emit('start_game', { roomCode: roomId });
  };

  const amIHost = players.find(p => p.id === socket.id)?.isHost;

  return (
    <Layout>
      <div className="flex flex-col h-full space-y-6">
        
        {/* Header Código */}
        <div className="relative pt-4 text-center">
            <button onClick={() => navigate('/')} className="absolute left-0 top-6 text-white/50 hover:text-white">
                <ArrowLeft />
            </button>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">CÓDIGO DE SALA</p>
            <button onClick={copyCode} className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 px-8 py-4 rounded-2xl mx-auto transition-all group border border-white/10">
                <span className="text-5xl font-black text-white tracking-widest font-mono">{roomId}</span>
                <Copy size={24} className="text-white/50 group-hover:text-white" />
            </button>
        </div>

        {/* Lista de Jugadores */}
        <div className="flex-1 bg-black/20 rounded-2xl p-4 overflow-y-auto border border-white/5 relative">
            <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-white font-bold flex items-center gap-2">
                    <Users size={18} className="text-emerald-400"/> Jugadores ({players.length})
                </h3>
                {players.length < 3 && <span className="text-xs text-red-400 font-bold bg-red-500/10 px-2 py-1 rounded">Faltan {3 - players.length}</span>}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
                <AnimatePresence>
                {players.map((p) => (
                    <motion.div 
                        key={p.id}
                        initial={{ opacity: 0, scale: 0.8 }} 
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="bg-white/5 p-3 rounded-xl flex items-center gap-3 border border-white/5 relative overflow-hidden"
                    >
                        {p.isHost && <Crown size={14} className="absolute top-1 right-1 text-yellow-400 rotate-12" />}
                        <div className="w-10 h-10">
                             <Avatar style={p.avatar.style} seed={p.avatar.seed} className="w-full h-full" />
                        </div>
                        <span className={`font-bold text-sm truncate ${p.id === socket.id ? 'text-emerald-400' : 'text-white'}`}>
                            {p.name}
                        </span>
                    </motion.div>
                ))}
                </AnimatePresence>
            </div>
        </div>

        {/* Footer Host */}
        {amIHost ? (
            <div className="bg-black/40 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                <p className="text-center text-white/50 text-xs mb-3">
                    Configuración guardada: 
                    <span className="text-white ml-1">Aleatoria entre categorías elegidas</span>
                </p>
                <button 
                    onClick={handleStartGame}
                    disabled={players.length < 3}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 p-4 rounded-xl font-black text-white shadow-lg shadow-emerald-900/50 flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale transition-all"
                >
                   <Play className="fill-white" size={20}/> INICIAR JUEGO
                </button>
            </div>
        ) : (
            <div className="text-center py-4">
                <p className="text-white/50 text-sm animate-pulse">El anfitrión iniciará la partida...</p>
            </div>
        )}
      </div>
    </Layout>
  );
}