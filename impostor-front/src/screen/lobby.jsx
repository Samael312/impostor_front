import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Crown, Play, Copy, Check, ArrowLeft } from 'lucide-react'; 
import { Layout } from '../components/ui/Layout';
import socket from '../socket';

export default function Lobby() {
  // --- CORRECCIÓN AQUÍ ---
  // 1. Obtenemos los parámetros de la URL
  const params = useParams();
  
  // 2. Definimos roomId de forma segura. 
  // Si falla el router, lo forzamos leyendo la URL del navegador.
  const roomId = params.roomId || window.location.pathname.split('/').pop();
  
  // -----------------------

  const { state } = useLocation();
  const navigate = useNavigate();

  const [players, setPlayers] = useState(state?.players || []);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isHost = state?.isHost || false; 
  // Si no hay state (ej. recarga de página), intentamos recuperar el nickname de localStorage o pedimos reingreso
  const myNickname = state?.nickname || localStorage.getItem('lastNickname');

  useEffect(() => {
    // Si no tenemos ID de sala o Nickname, mandar al inicio
    if (!roomId || !myNickname) {
        navigate('/');
        return;
    }

    // Unirse a la sala (por si recargó la página)
    if (!state?.players) {
        socket.emit('join_room', { 
            roomCode: roomId, 
            nickname: myNickname,
            avatarConfig: state?.avatarConfig || {} 
        });
    }

    // Listeners
    socket.on('update_players', (updatedPlayers) => {
        setPlayers(updatedPlayers);
    });

    socket.on('game_started', (gameData) => {
        navigate('/game', { state: { ...gameData, roomId } });
    });

    socket.on('error_message', (msg) => {
        setErrorMsg(msg);
        setTimeout(() => navigate('/'), 3000);
    });

    return () => {
        socket.off('update_players');
        socket.off('game_started');
        socket.off('error_message');
    };
  }, [roomId, myNickname, navigate, state]);

  const copyCode = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartGame = () => {
    socket.emit('start_game', { roomCode: roomId });
  };

  return (
    <Layout>
      <div className="flex flex-col h-full">
        {/* Header con Código de Sala */}
        <div className="text-center py-4 space-y-2">
            <h2 className="text-white/60 text-sm font-bold uppercase tracking-widest">CÓDIGO DE SALA</h2>
            <button 
                onClick={copyCode}
                className="bg-white/10 border-2 border-white/20 rounded-xl px-8 py-4 flex items-center gap-4 mx-auto active:scale-95 transition-all hover:bg-white/20 group"
            >
                <span className="text-4xl font-black text-white tracking-widest font-mono">
                    {roomId} {/* <--- Aquí es donde fallaba antes */}
                </span>
                {copied ? <Check className="text-emerald-400" /> : <Copy className="text-white/50 group-hover:text-white" />}
            </button>
            {errorMsg && <p className="text-red-400 font-bold animate-pulse">{errorMsg}</p>}
        </div>

        {/* Lista de Jugadores */}
        <div className="flex-1 overflow-y-auto px-2 custom-scrollbar">
            <div className="grid grid-cols-1 gap-3">
                <AnimatePresence>
                    {players.map((p) => (
                        <motion.div 
                            key={p.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold border-2 border-white/20">
                                    {p.avatar?.emoji || p.name[0].toUpperCase()}
                                </div>
                                <span className="text-white font-bold text-lg">{p.name}</span>
                            </div>
                            {p.isHost && <Crown size={20} className="text-yellow-400 drop-shadow-lg" />}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>

        {/* Footer: Botón Iniciar */}
        <div className="pt-4 pb-2">
             <div className="text-center mb-2">
                <p className="text-white/40 text-xs font-bold">
                    {players.length} JUGADORES CONECTADOS
                </p>
             </div>

             {isHost ? (
                 <button 
                    onClick={handleStartGame}
                    disabled={players.length < 3} // <--- Deshabilitado si hay pocos
                    className={`w-full p-4 rounded-xl font-black text-white text-lg shadow-xl flex items-center justify-center gap-3 transition-all ${
                        players.length < 3 
                        ? 'bg-gray-600 opacity-50 cursor-not-allowed'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 active:scale-95 shadow-emerald-900/50'
                    }`}
                 >
                    {players.length < 3 ? 'ESPERANDO JUGADORES...' : 'INICIAR PARTIDA'}
                    {players.length >= 3 && <Play size={24} fill="white" />}
                 </button>
             ) : (
                 <div className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-center">
                    <p className="text-white font-bold animate-pulse">Esperando al anfitrión...</p>
                 </div>
             )}
        </div>
      </div>
    </Layout>
  );
}