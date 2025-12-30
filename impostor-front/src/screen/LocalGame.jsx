import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserX, Play, ArrowLeft, Eye, CheckCircle, AlertTriangle, RefreshCw, ArrowRight, Check } from 'lucide-react';
import { Layout } from '../components/ui/Layout';
import { DICTIONARIES, CATEGORIES_UI } from '../data/localDictionaries';

export default function LocalGame() {
  const navigate = useNavigate();

  // --- ESTADOS DEL JUEGO ---
  const [phase, setPhase] = useState('setup'); // setup | pass | reveal | playing
  
  // Configuración
  const [playerCount, setPlayerCount] = useState(4);
  const [impostorCount, setImpostorCount] = useState(1);
  const [selectedCat, setSelectedCat] = useState('venezolano');

  // Datos de la partida actual
  const [gameData, setGameData] = useState({
    word: '',
    category: '',
    roles: [], // Array de 'civil' o 'impostor'
    currentPlayerIndex: 0
  });

  const [cardFlipped, setCardFlipped] = useState(false);

  // --- LÓGICA ---

  const startGame = () => {
    // 1. Elegir palabra
    const wordList = DICTIONARIES[selectedCat];
    const secretWord = wordList[Math.floor(Math.random() * wordList.length)];

    // 2. Asignar roles
    let roles = Array(playerCount).fill('civil');
    // Insertar impostores al azar
    let impostorsAdded = 0;
    while (impostorsAdded < impostorCount) {
        const randomIndex = Math.floor(Math.random() * playerCount);
        if (roles[randomIndex] === 'civil') {
            roles[randomIndex] = 'impostor';
            impostorsAdded++;
        }
    }

    setGameData({
        word: secretWord,
        category: selectedCat,
        roles: roles,
        currentPlayerIndex: 0
    });

    setPhase('pass');
  };

  const nextPlayer = () => {
    setCardFlipped(false); // Resetear carta
    if (gameData.currentPlayerIndex + 1 < playerCount) {
        setGameData(prev => ({ ...prev, currentPlayerIndex: prev.currentPlayerIndex + 1 }));
        setPhase('pass');
    } else {
        setPhase('playing');
    }
  };

  // --- RENDERIZADO POR FASES ---

  // 1. PANTALLA DE CONFIGURACIÓN
  if (phase === 'setup') {
    return (
      <Layout>
        <div className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-4 py-2 shrink-0">
                <button onClick={() => navigate('/')} className="p-2 bg-white/10 rounded-full hover:bg-white/20">
                    <ArrowLeft className="text-white" size={20} />
                </button>
                <h2 className="text-xl font-black text-white">Partida Local</h2>
            </div>

            {/* Scroll Area */}
            <div className="flex-1 overflow-y-auto min-h-0 py-4 space-y-6 pr-2 custom-scrollbar">
                
                {/* Sliders */}
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-6">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-white font-bold flex items-center gap-2"><Users size={18}/> Jugadores</span>
                            <span className="text-emerald-400 font-black text-xl">{playerCount}</span>
                        </div>
                        <input 
                            type="range" min="3" max="20" 
                            value={playerCount} onChange={(e) => setPlayerCount(parseInt(e.target.value))}
                            className="w-full accent-emerald-500 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-white font-bold flex items-center gap-2"><UserX size={18} className="text-red-400"/> Impostores</span>
                            <span className="text-red-400 font-black text-xl">{impostorCount}</span>
                        </div>
                        <input 
                            type="range" min="1" max={Math.floor((playerCount - 1) / 2)} 
                            value={impostorCount} onChange={(e) => setImpostorCount(parseInt(e.target.value))}
                            className="w-full accent-red-500 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </div>

                {/* Categorías */}
                <div>
                    <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-3">Temática</p>
                    <div className="grid grid-cols-2 gap-3">
                        {CATEGORIES_UI.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCat(cat.id)}
                                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                                    selectedCat === cat.id 
                                    ? 'bg-pink-600 border-pink-500 text-white shadow-lg' 
                                    : 'bg-white/5 border-white/10 text-white/50'
                                }`}
                            >
                                <span className="font-bold text-xs flex items-center gap-2">{cat.icon} {cat.name}</span>
                                {selectedCat === cat.id && <Check size={16} />}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Botón Start */}
            <div className="pt-4 shrink-0">
                <button 
                    onClick={startGame}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 p-4 rounded-xl font-black text-white text-lg shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-transform"
                >
                    COMENZAR <Play size={20} className="fill-white"/>
                </button>
            </div>
        </div>
      </Layout>
    );
  }

  // 2. PANTALLA DE "PASAR AL SIGUIENTE"
  if (phase === 'pass') {
    return (
        <Layout>
            <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in fade-in zoom-in">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center border-4 border-white/20">
                    <span className="text-4xl font-black text-white">{gameData.currentPlayerIndex + 1}</span>
                </div>
                
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-white">Turno del Jugador {gameData.currentPlayerIndex + 1}</h2>
                    <p className="text-white/50 text-sm max-w-[200px] mx-auto">
                        Pásale el dispositivo a esta persona y asegúrate de que nadie más mire.
                    </p>
                </div>

                <button 
                    onClick={() => setPhase('reveal')}
                    className="bg-white text-black font-black px-8 py-4 rounded-2xl shadow-xl hover:scale-105 transition-transform flex items-center gap-2"
                >
                    SOY EL JUGADOR {gameData.currentPlayerIndex + 1} <ArrowRight size={20}/>
                </button>
            </div>
        </Layout>
    );
  }

  // 3. PANTALLA DE REVELAR ROL (CARTA 3D)
  if (phase === 'reveal') {
    const isImpostor = gameData.roles[gameData.currentPlayerIndex] === 'impostor';

    return (
        <Layout>
            <div className="h-full flex flex-col items-center justify-center py-4 space-y-6">
                <p className="text-white/60 text-sm uppercase tracking-widest font-bold">Tu Misión Secreta</p>
                
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
                        {/* FRENTE */}
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-indigo-900 rounded-3xl shadow-2xl flex flex-col items-center justify-center border-4 border-white/10 backface-hidden">
                            <Eye size={60} className="text-white/40 mb-6 animate-pulse" />
                            <h2 className="text-2xl font-black text-white tracking-widest mb-2">TOP SECRET</h2>
                            <p className="text-xs text-white/50 font-bold bg-black/20 px-4 py-2 rounded-lg">TOCA PARA REVELAR</p>
                        </div>

                        {/* DORSO */}
                        <div className={`absolute inset-0 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-6 text-center border-4 backface-hidden rotate-y-180 ${isImpostor ? 'bg-red-600 border-red-400' : 'bg-emerald-500 border-emerald-300'}`}>
                            {isImpostor ? 
                                <AlertTriangle size={80} className="text-white mb-6 drop-shadow-lg"/> : 
                                <CheckCircle size={80} className="text-white mb-6 drop-shadow-lg"/>
                            }
                            
                            <h2 className="text-4xl font-black text-white mb-2 drop-shadow-md">
                                {isImpostor ? "IMPOSTOR" : "CIVIL"}
                            </h2>
                            
                            <div className="w-full h-px bg-white/30 my-6"/>
                            
                            <p className="text-white/80 text-xs uppercase font-bold mb-2">Palabra Clave:</p>
                            <p className="text-3xl font-black text-white leading-tight break-words drop-shadow-md">
                                {isImpostor ? "???" : gameData.word}
                            </p>
                            
                            {isImpostor && <p className="mt-4 text-xs font-bold text-white/60">Disimula y descubre la palabra.</p>}
                        </div>
                    </motion.div>
                </div>

                {cardFlipped && (
                    <button 
                        onClick={nextPlayer}
                        className="mt-6 bg-white/10 border border-white/20 text-white font-bold px-8 py-3 rounded-xl hover:bg-white/20 transition-all animate-in fade-in slide-in-from-bottom-4"
                    >
                        {gameData.currentPlayerIndex + 1 === playerCount ? 'EMPEZAR JUEGO' : 'SIGUIENTE JUGADOR'}
                    </button>
                )}
            </div>
        </Layout>
    );
  }

  // 4. PANTALLA DE JUEGO (CRONÓMETRO/VOTACIÓN)
  if (phase === 'playing') {
    return (
        <Layout>
            <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
                <div className="bg-emerald-500/20 p-6 rounded-full border-2 border-emerald-500/50 animate-pulse">
                     <Users size={64} className="text-emerald-400" />
                </div>
                
                <div>
                    <h2 className="text-4xl font-black text-white mb-2">¡A DEBATIR!</h2>
                    <p className="text-white/60">¿Quién es el impostor?</p>
                </div>

                <div className="bg-white/5 p-6 rounded-2xl w-full max-w-xs border border-white/10">
                    <p className="text-xs text-white/40 uppercase font-bold mb-2">Categoría</p>
                    <p className="text-xl font-bold text-white mb-4">{CATEGORIES_UI.find(c => c.id === gameData.category)?.name}</p>
                    
                    <div className="h-px bg-white/10 my-4"/>
                    
                    <p className="text-xs text-white/40 uppercase font-bold mb-2">Palabra (Solo para verificar)</p>
                    <button 
                        onClick={() => alert(`La palabra era: ${gameData.word}`)}
                        className="text-xs bg-white/10 px-3 py-1 rounded text-white/50 hover:text-white"
                    >
                        Ver Palabra
                    </button>
                </div>

                <button 
                    onClick={() => setPhase('setup')}
                    className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-colors mt-8"
                >
                    <RefreshCw size={20}/> JUGAR OTRA VEZ
                </button>
            </div>
        </Layout>
    );
  }

  return null;
}