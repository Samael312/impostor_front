import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Crown, Play, Copy, Check } from 'lucide-react'; 
import { Layout, Avatar } from '../components/ui/Layout';
import socket from '../socket';

export default function Lobby() {
  const params = useParams();
  const roomId = params.roomId || window.location.pathname.split('/').pop();
  
  const { state } = useLocation();
  const navigate = useNavigate();

  const [players, setPlayers] = useState(state?.players || []);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Guardamos si ya nos unimos para evitar doble emit
  const [joined, setJoined] = useState(false);

  // 1. OBTENER NICKNAME
  const myNickname = state?.nickname || localStorage.getItem('lastNickname');

  // 2. CALCULAR SI SOY HOST BASADO EN LA LISTA DE JUGADORES (NO EN EL STATE)
  // Buscamos nuestro usuario en la lista y miramos su propiedad isHost
  const amIHost = players.find(p => p.name === myNickname)?.isHost || false;

  useEffect(() => {
    if (!roomId || !myNickname) {
        navigate('/');
        return;
    }

    // Unirse a la sala
    if (!joined) {
        // Solo emitimos join si no venimos de crear la sala (state.players estaría vacío o undefined al entrar por link)
        if (!state?.players) {
            socket.emit('join_room', { 
                roomCode: roomId, 
                nickname: myNickname,
                avatarConfig: state?.avatarConfig || {} 
            });
        }
        setJoined(true);
    }

    const handleUpdatePlayers = (updatedPlayers) => {
        setPlayers(updatedPlayers);
    };

    // 3. AL INICIAR JUEGO, PASAMOS EL ESTADO DE HOST RECALCULADO
    const handleGameStarted = (gameData) => {
        navigate('/game', { 
            state: { 
                ...gameData, 
                roomId,
                nickname: myNickname,
                isHost: amIHost, // Pasamos el valor calculado en tiempo real
                players: players 
            } 
        });
    };

    const handleError = (msg) => {
        setErrorMsg(msg);
        setTimeout(() => navigate('/'), 3000);
    };

    socket.on('update_players', handleUpdatePlayers);
    socket.on('game_started', handleGameStarted);
    socket.on('error_message', handleError);

    return () => {
        socket.off('update_players', handleUpdatePlayers);
        socket.off('game_started', handleGameStarted);
        socket.off('error_message', handleError);
    };
  }, [roomId, myNickname, navigate, state, joined, amIHost, players]); // Añadido amIHost y players a dependencias

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
      <div className="flex flex-col h-full w-full max-w-4xl mx-auto gap-8">
        
        {/* --- HEADER: CÓDIGO DE SALA --- */}
        <div className="text-center space-y-4">
            <h2 className="text-slate-400 text-sm font-bold uppercase tracking-widest">
                SALA DE ESPERA
            </h2>
            
            <div className="relative group inline-block">
                <button 
                    onClick={copyCode}
                    className="bg-slate-800/50 hover:bg-slate-800 border-2 border-slate-700 hover:border-indigo-500/50 rounded-2xl px-8 py-5 flex items-center gap-6 mx-auto transition-all duration-300 shadow-xl"
                >
                    <div className="text-left">
                        <p className="text-xs text-slate-500 font-bold mb-1">CÓDIGO DE ACCESO</p>
                        <span className="text-5xl sm:text-6xl font-black text-white tracking-widest font-mono">
                            {roomId}
                        </span>
                    </div>
                    <div className="h-12 w-px bg-white/10 mx-2" />
                    <div className="flex flex-col items-center justify-center gap-1 min-w-[3rem]">
                        {copied ? (
                            <Check className="text-emerald-400 w-8 h-8" />
                        ) : (
                            <Copy className="text-slate-400 group-hover:text-white w-8 h-8 transition-colors" />
                        )}
                        <span className="text-[10px] font-bold text-slate-500 group-hover:text-white/80">
                            {copied ? '¡LISTO!' : 'COPIAR'}
                        </span>
                    </div>
                </button>
            </div>

            {errorMsg && (
                <div className="bg-red-500/10 text-red-400 font-bold p-3 rounded-lg inline-block animate-pulse border border-red-500/20">
                    ⚠️ {errorMsg}
                </div>
            )}
        </div>

        {/* --- LISTA DE JUGADORES --- */}
        <div className="flex-1 bg-slate-800/30 border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col min-h-[300px]">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Users className="text-indigo-400" size={20} />
                    <h3 className="text-white font-bold text-lg">Jugadores Conectados</h3>
                </div>
                <span className="bg-white/10 px-3 py-1 rounded-full text-sm font-mono text-white/80">
                    {players.length} / 10
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto custom-scrollbar content-start flex-1">
                <AnimatePresence>
                    {players.map((p) => (
                        <motion.div 
                            key={p.id || p.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-slate-800 hover:bg-slate-700 border border-white/5 p-3 rounded-xl flex items-center gap-4 transition-colors group relative overflow-hidden"
                        >
                            <Avatar 
                                style={p.avatar?.style || 'bottts-neutral'} 
                                seed={p.avatar?.seed || p.name} 
                                className="w-12 h-12 border-2 border-indigo-500/30 group-hover:border-indigo-400 transition-colors bg-slate-900" 
                                bgColor="bg-slate-900"
                            />
                            
                            <div className="flex flex-col">
                                <span className="text-white font-bold text-lg leading-tight truncate max-w-[120px] sm:max-w-[150px]">
                                    {p.name} {p.name === myNickname && "(Tú)"}
                                </span>
                                {p.isHost && (
                                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                                        <Crown size={12} fill="currentColor" /> ANFITRIÓN
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                
                {Array.from({ length: Math.max(0, 3 - players.length) }).map((_, i) => (
                    <div key={`empty-${i}`} className="border-2 border-dashed border-white/5 rounded-xl p-4 flex items-center justify-center gap-2 text-white/20 h-[74px]">
                        <div className="w-2 h-2 rounded-full bg-white/10 animate-pulse" />
                        <span className="text-sm font-bold">Esperando...</span>
                    </div>
                ))}
            </div>
        </div>

        {/* --- FOOTER: ACCIONES --- */}
        <div className="pt-2">
             {amIHost ? (
                 <div className="flex flex-col items-center gap-3">
                    <button 
                        onClick={handleStartGame}
                        disabled={players.length < 3}
                        className={`w-full sm:w-auto sm:min-w-[300px] p-4 rounded-xl font-black text-white text-lg shadow-xl flex items-center justify-center gap-3 transition-all transform ${
                            players.length < 3 
                            ? 'bg-slate-700 opacity-50 cursor-not-allowed'
                            : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:scale-105 hover:shadow-emerald-500/30'
                        }`}
                    >
                        {players.length < 3 ? (
                            <>Esperando jugadores ({players.length}/3)</>
                        ) : (
                            <>INICIAR PARTIDA <Play size={24} fill="white" /></>
                        )}
                    </button>
                    {players.length < 3 && (
                        <p className="text-slate-500 text-sm animate-pulse">
                            Necesitas al menos 3 jugadores para empezar.
                        </p>
                    )}
                 </div>
             ) : (
                 <div className="w-full bg-indigo-900/20 border border-indigo-500/20 p-6 rounded-2xl text-center">
                    <div className="animate-spin w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full mx-auto mb-3"/>
                    <h3 className="text-white font-bold text-lg">Esperando al anfitrión</h3>
                    <p className="text-indigo-200/60 text-sm">La partida comenzará pronto...</p>
                 </div>
             )}
        </div>

      </div>
    </Layout>
  );
}