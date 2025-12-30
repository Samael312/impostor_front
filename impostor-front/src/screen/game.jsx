import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EyeOff, Skull, LogOut, ShieldCheck, HelpCircle, MessageSquare, Users, Home, Settings } from 'lucide-react';
import { Layout, Avatar } from '../components/ui/Layout'; 
import socket from '../socket';

export default function Game() {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  
  const [cardFlipped, setCardFlipped] = useState(false);
  const [gamePhase, setGamePhase] = useState('reveal'); // 'reveal', 'debate', 'results'
  
  // Estados de votación
  const [myVote, setMyVote] = useState(null);
  const [votingResults, setVotingResults] = useState(null);

  // --- PROTECCIÓN ---
  useEffect(() => {
    if (!state?.role) navigate('/');
  }, [state, navigate]);

  // --- LÓGICA DE SOCKETS ---
  useEffect(() => {
    const handleDebateStarted = () => {
        setGamePhase('debate');
        setMyVote(null);
        setVotingResults(null);
    };
    
    // REINICIO DE PARTIDA
    const handleNewGame = (newGameData) => {
        console.log("🔄 Nueva ronda:", newGameData);
        setGamePhase('reveal');
        setCardFlipped(false);
        setMyVote(null);
        setVotingResults(null);
        
        navigate('/game', { 
            state: { 
                ...newGameData, 
                roomId: state.roomId, 
                nickname: state.nickname,
                isHost: state.isHost,
                players: newGameData.players || state.players 
            },
            replace: true 
        });
    };

    // RESULTADOS DE VOTACIÓN
    const handleResults = (results) => {
        setVotingResults(results);
        setGamePhase('results');
    };

    const handleBackToLobby = () => {
        navigate(`/lobby/${state.roomId}`, { 
            state: { nickname: state.nickname, isHost: state.isHost, players: state.players } 
        });
    };

    socket.on('debate_started', handleDebateStarted);
    socket.on('game_started', handleNewGame); 
    socket.on('voting_results', handleResults);
    socket.on('return_to_lobby', handleBackToLobby);

    return () => {
        socket.off('debate_started', handleDebateStarted);
        socket.off('game_started', handleNewGame);
        socket.off('voting_results', handleResults);
        socket.off('return_to_lobby', handleBackToLobby);
    };
  }, [navigate, state]);

  if (!state) return null;

  const { role, location: secretWord, roomId, isHost, roundId, players } = state;
  const isImpostor = role === 'impostor';

  // --- ACCIONES ---
  const handleStartDebate = () => {
      socket.emit('start_debate', { roomCode: roomId });
  };

  const handleVote = (playerId) => {
      if (myVote) return; 
      setMyVote(playerId);
      socket.emit('vote_player', { roomCode: roomId, votedId: playerId });
  };

  const handleConfigureNewRound = () => {
      navigate('/game/setup', { 
          state: { roomId, nickname: state.nickname, isHost: true, players } 
      });
  };

  const handleExit = () => {
     if (window.confirm("¿Seguro que quieres salir de la partida?")) {
        socket.emit('disconnect_game'); 
        navigate('/');
     }
  };

  // --- RENDER ---
  return (
    <Layout key={roundId || 'init'}> 
      
      {/* === FASE 3: RESULTADOS === */}
      {gamePhase === 'results' && votingResults ? (
         <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in duration-500">
            
            <div className="space-y-2">
                {votingResults.impostorCaught ? (
                    <div className="bg-emerald-500/20 p-6 rounded-full inline-block border-4 border-emerald-500">
                        <ShieldCheck size={64} className="text-emerald-400" />
                    </div>
                ) : (
                    <div className="bg-red-500/20 p-6 rounded-full inline-block border-4 border-red-500">
                        <Skull size={64} className="text-red-400" />
                    </div>
                )}
                
                <h2 className={`text-4xl font-black uppercase ${votingResults.impostorCaught ? 'text-emerald-400' : 'text-red-400'}`}>
                    {votingResults.impostorCaught ? '¡VICTORIA!' : '¡DERROTA!'}
                </h2>
                
                <p className="text-white/80 text-lg">
                    {votingResults.isTie 
                        ? "Empate. Nadie fue expulsado." 
                        : <>Expulsado: <span className="font-bold text-white">{votingResults.mostVotedPlayer?.name}</span></>
                    }
                </p>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/10 w-full max-w-sm">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">LOS IMPOSTORES ERAN</p>
                <div className="flex flex-wrap justify-center gap-4">
                    {votingResults.impostors.map(imp => (
                        <div key={imp.id} className="flex flex-col items-center">
                            <Avatar style={imp.avatar?.style} seed={imp.avatar?.seed} className="w-16 h-16 border-2 border-red-500 rounded-full bg-slate-900"/>
                            <span className="text-white font-bold mt-2">{imp.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full max-w-sm space-y-3 pt-4">
                {isHost && (
                    <button onClick={handleConfigureNewRound} className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-black py-4 rounded-xl shadow-lg flex items-center justify-center gap-2">
                        <Settings size={24} /> NUEVA RONDA
                    </button>
                )}
                <button onClick={handleExit} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-4 rounded-xl flex items-center justify-center gap-2">
                    <Home size={20}/> SALIR
                </button>
            </div>
         </div>

      ) : gamePhase === 'debate' ? (

      /* === FASE 2: VOTACIÓN === */
        <div className="h-full flex flex-col w-full max-w-4xl mx-auto">
            <div className="text-center py-4">
                <h2 className="text-3xl font-black text-white uppercase drop-shadow-lg flex items-center justify-center gap-3">
                    <Users className="text-orange-400" /> VOTACIÓN
                </h2>
                <p className="text-orange-100/80 text-sm font-medium">
                    {myVote ? "Esperando resultados..." : "Toca para expulsar"}
                </p>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-20">
                    {players.map(p => {
                        const isSelected = myVote === p.id;
                        return (
                            <motion.button
                                key={p.id}
                                disabled={!!myVote}
                                onClick={() => handleVote(p.id)}
                                whileTap={{ scale: 0.95 }}
                                className={`relative p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${
                                    isSelected 
                                    ? 'bg-red-500/20 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
                                    : 'bg-slate-800 border-slate-700 hover:border-slate-500'
                                } ${!!myVote && !isSelected ? 'opacity-50 grayscale' : 'opacity-100'}`}
                            >
                                <Avatar style={p.avatar?.style} seed={p.avatar?.seed || p.name} className="w-16 h-16 bg-slate-900 rounded-full" />
                                <div className="text-center">
                                    <span className="text-white font-bold block truncate max-w-[100px]">{p.name}</span>
                                    {isSelected && <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest">VOTADO</span>}
                                </div>
                                {isSelected && (
                                    <div className="absolute top-2 right-2 bg-red-500 rounded-full p-1">
                                        <Skull size={12} className="text-white" />
                                    </div>
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </div>
            
            {myVote && (
                <div className="absolute bottom-20 left-0 right-0 flex justify-center">
                    <div className="bg-slate-900/90 border border-white/10 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-3 shadow-xl animate-pulse">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping" />
                        <span className="text-white text-sm font-bold">Esperando votos...</span>
                    </div>
                </div>
            )}
        </div>

      ) : (

      /* === FASE 1: REVELACIÓN === */
      <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-2xl mx-auto gap-8 py-6">
        
        <div className="flex flex-col items-center space-y-3 animate-in fade-in slide-in-from-top-4 duration-700">
            <h1 className="text-3xl md:text-4xl font-black text-white text-center leading-tight drop-shadow-xl">
                TU IDENTIDAD
            </h1>
            <p className="text-slate-400 text-sm max-w-xs text-center font-medium">
                Toca la tarjeta para ver tu rol y tu palabra.
            </p>
        </div>

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
                    {/* LADO FRONTAL */}
                    <div className="absolute inset-0 backface-hidden rounded-3xl overflow-hidden border-4 border-indigo-500/30 shadow-2xl shadow-indigo-900/50 bg-slate-900">
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

                    {/* LADO TRASERO */}
                    <div 
                        className={`absolute inset-0 backface-hidden rotate-y-180 rounded-3xl overflow-hidden border-4 shadow-2xl flex flex-col ${
                            isImpostor 
                            ? 'bg-gradient-to-br from-red-600 to-rose-900 border-red-400 shadow-red-900/50' 
                            : 'bg-gradient-to-br from-emerald-500 to-teal-800 border-emerald-300 shadow-emerald-900/50'
                        }`}
                    >
                        <div className="absolute inset-0 bg-black/10" />
                        <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 text-center text-white">
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
                            <h2 className="text-3xl font-black uppercase tracking-tight drop-shadow-md mb-2">
                                {isImpostor ? "IMPOSTOR" : "JUGADOR"}
                            </h2>
                            <div className="w-16 h-1 bg-white/30 rounded-full mb-6" />
                            <div className="bg-black/20 rounded-2xl p-4 w-full backdrop-blur-sm border border-white/10 shadow-inner">
                                <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest mb-1">
                                    {isImpostor ? "TU OBJETIVO" : "PALABRA CLAVE"}
                                </p>
                                <p className="text-2xl sm:text-3xl font-black leading-tight break-words py-1">
                                    {isImpostor ? "¿Cuál es la palabra?" : secretWord}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>

        {/* --- FOOTER --- */}
        <div className="mt-auto flex flex-col items-center gap-4 w-full max-w-sm">
             {isHost && (
                <button 
                    onClick={handleStartDebate}
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:scale-105 transition-all text-white font-black py-4 rounded-xl shadow-lg shadow-orange-900/20 flex items-center justify-center gap-3 animate-in slide-in-from-bottom-5 duration-1000"
                >
                    <MessageSquare size={20} fill="currentColor" className="text-white/90" />
                    INICIAR DEBATE
                </button>
             )}
             <button 
                onClick={handleExit}
                className="flex items-center gap-2 text-slate-500 hover:text-red-400 transition-colors px-4 py-2 rounded-lg hover:bg-white/5 text-sm font-bold"
             >
                <LogOut size={16} /> Salir de la partida
             </button>
        </div>
      </div>
      )}

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </Layout>
  );
}