import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Crown, Play, Copy, Check, Settings, Minus, Plus, Grid } from 'lucide-react'; 
import { Layout, Avatar } from '../components/ui/Layout';
import socket from '../socket';

// Opciones de configuración
const CATEGORIES = [
    { id: 'all', name: 'Aleatorio', icon: '🎲' },
    { id: 'lugares', name: 'Lugares', icon: '🌍' },
    { id: 'comida', name: 'Comida', icon: '🍕' },
    { id: 'animales', name: 'Animales', icon: '🦁' },
];

export default function Lobby() {
  const params = useParams();
  const roomId = params.roomId || window.location.pathname.split('/').pop();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [players, setPlayers] = useState(state?.players || []);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // --- ESTADOS DE CONFIGURACIÓN (Solo para Host) ---
  const [impostorCount, setImpostorCount] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const isHost = state?.isHost || false; 
  const myNickname = state?.nickname || localStorage.getItem('lastNickname');
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    if (!roomId || !myNickname) {
        navigate('/');
        return;
    }

    if (!joined) {
        // Solo emitimos join si no venimos de un reset (si players está vacío o null)
        // Ojo: Si vienes de Game.jsx con state.players, quizás no necesites emitir join_room, 
        // pero para asegurar la reconexión de socket es mejor emitirlo o tener un evento 'rejoin'.
        // Para simplificar, asumimos que el backend maneja re-joins idempotentes.
        socket.emit('join_room', { 
            roomCode: roomId, 
            nickname: myNickname,
            avatarConfig: state?.avatarConfig || {} 
        });
        setJoined(true);
    }

    const handleUpdatePlayers = (updatedPlayers) => setPlayers(updatedPlayers);
    const handleGameStarted = (gameData) => navigate('/game', { state: { ...gameData, roomId, isHost } }); // Pasamos isHost
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
  }, [roomId, myNickname, navigate, state, joined, isHost]);

  const copyCode = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartGame = () => {
    // ENVIAMOS LA NUEVA CONFIGURACIÓN AL INICIAR
    socket.emit('start_game', { 
        roomCode: roomId,
        config: {
            impostors: impostorCount,
            category: selectedCategory
        }
    });
  };

  return (
    <Layout>
      <div className="flex flex-col h-full w-full max-w-4xl mx-auto gap-6 sm:gap-8">
        
        {/* HEADER CÓDIGO (Igual que antes) */}
        <div className="text-center space-y-4">
            <h2 className="text-slate-400 text-sm font-bold uppercase tracking-widest">SALA DE ESPERA</h2>
            <div className="relative group inline-block">
                <button onClick={copyCode} className="bg-slate-800/50 hover:bg-slate-800 border-2 border-slate-700 hover:border-indigo-500/50 rounded-2xl px-6 py-4 sm:px-8 sm:py-5 flex items-center gap-4 sm:gap-6 mx-auto transition-all shadow-xl">
                    <div className="text-left">
                        <p className="text-[10px] sm:text-xs text-slate-500 font-bold mb-1">CÓDIGO</p>
                        <span className="text-4xl sm:text-6xl font-black text-white tracking-widest font-mono">{roomId}</span>
                    </div>
                    <div className="h-10 w-px bg-white/10" />
                    <div className="flex flex-col items-center justify-center gap-1 min-w-[2rem]">
                        {copied ? <Check className="text-emerald-400" size={24}/> : <Copy className="text-slate-400 group-hover:text-white transition-colors" size={24}/>}
                    </div>
                </button>
            </div>
            {errorMsg && <div className="bg-red-500/10 text-red-400 text-sm font-bold p-2 rounded-lg inline-block">{errorMsg}</div>}
        </div>

        {/* LISTA DE JUGADORES (Igual que antes) */}
        <div className="flex-1 bg-slate-800/30 border border-white/5 rounded-3xl p-6 flex flex-col min-h-[200px]">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Users className="text-indigo-400" size={20} />
                    <h3 className="text-white font-bold">Jugadores</h3>
                </div>
                <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-mono text-white/80">{players.length} / 10</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto custom-scrollbar content-start flex-1">
                <AnimatePresence>
                    {players.map((p) => (
                        <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-slate-800 border border-white/5 p-3 rounded-xl flex items-center gap-4 relative overflow-hidden">
                             <Avatar style={p.avatar?.style || 'bottts-neutral'} seed={p.avatar?.seed || p.name} className="w-10 h-10 bg-slate-900 rounded-full border border-white/10" />
                            <div className="flex flex-col">
                                <span className="text-white font-bold truncate max-w-[120px]">{p.name}</span>
                                {p.isHost && <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1"><Crown size={10} /> HOST</span>}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>

        {/* --- PANEL DE CONFIGURACIÓN & INICIO --- */}
        <div className="pt-2">
             {isHost ? (
                 <div className="flex flex-col gap-4 bg-slate-900/50 p-4 rounded-2xl border border-indigo-500/20">
                    
                    {/* CONFIGURACIÓN: Solo visible para el host */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        
                        {/* Selector de Impostores */}
                        <div className="flex-1 bg-slate-800 p-3 rounded-xl flex items-center justify-between border border-white/5">
                            <div className="flex items-center gap-2">
                                <div className="bg-red-500/20 p-2 rounded-lg"><Users size={18} className="text-red-400"/></div>
                                <span className="text-sm font-bold text-slate-300">Impostores</span>
                            </div>
                            <div className="flex items-center gap-3 bg-slate-900 rounded-lg p-1">
                                <button onClick={() => setImpostorCount(Math.max(1, impostorCount - 1))} className="p-1 hover:bg-white/10 rounded text-white"><Minus size={16}/></button>
                                <span className="font-mono font-bold text-white w-4 text-center">{impostorCount}</span>
                                <button onClick={() => setImpostorCount(Math.min(3, impostorCount + 1))} className="p-1 hover:bg-white/10 rounded text-white"><Plus size={16}/></button>
                            </div>
                        </div>

                        {/* Selector de Categoría */}
                        <div className="flex-1 bg-slate-800 p-3 rounded-xl flex items-center justify-between border border-white/5">
                            <div className="flex items-center gap-2">
                                <div className="bg-blue-500/20 p-2 rounded-lg"><Grid size={18} className="text-blue-400"/></div>
                                <span className="text-sm font-bold text-slate-300">Tema</span>
                            </div>
                            <select 
                                value={selectedCategory} 
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="bg-slate-900 text-white text-sm font-bold py-1.5 px-3 rounded-lg border-none focus:ring-1 focus:ring-indigo-500 outline-none cursor-pointer"
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Botón de Inicio */}
                    <button 
                        onClick={handleStartGame}
                        disabled={players.length < 3}
                        className={`w-full p-4 rounded-xl font-black text-white text-lg shadow-xl flex items-center justify-center gap-3 transition-all ${
                            players.length < 3 
                            ? 'bg-slate-700 opacity-50 cursor-not-allowed'
                            : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-[1.02] hover:shadow-indigo-500/30'
                        }`}
                    >
                        {players.length < 3 ? `Esperando jugadores (${players.length}/3)` : <>INICIAR PARTIDA <Play size={24} fill="white" /></>}
                    </button>
                 </div>
             ) : (
                 // VISTA PARA JUGADORES NO HOST
                 <div className="w-full bg-indigo-900/20 border border-indigo-500/20 p-6 rounded-2xl text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Settings className="text-indigo-400 animate-spin-slow" size={20}/>
                        <h3 className="text-white font-bold">El anfitrión está configurando</h3>
                    </div>
                    <p className="text-indigo-200/60 text-xs">Preparando la siguiente ronda...</p>
                 </div>
             )}
        </div>
      </div>
    </Layout>
  );
}