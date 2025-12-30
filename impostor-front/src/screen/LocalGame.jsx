import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, UserX, Play, ArrowLeft, Eye, CheckCircle, AlertTriangle, RefreshCw, ArrowRight, Check } from 'lucide-react';
import { Layout, Avatar } from '../components/ui/Layout';
import { DICTIONARIES, CATEGORIES_UI } from '../data/localDictionaries';

export default function LocalGame() {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Recuperamos los jugadores (si vienen del Setup)
  const setupPlayers = location.state?.players; 

  // 2. Estado para el slider (solo se usa si no hay nombres definidos)
  const [sliderCount, setSliderCount] = useState(4); 

  // 3. VARIABLE MAESTRA: Calculamos el total real dinámicamente
  // Si hay nombres, usamos la longitud del array. Si no, el slider.
  const totalPlayers = setupPlayers ? setupPlayers.length : sliderCount;

  // --- ESTADOS DEL JUEGO ---
  const [phase, setPhase] = useState('setup'); // setup, pass, reveal, playing
  const [impostorCount, setImpostorCount] = useState(1);
  const [selectedCats, setSelectedCats] = useState(['venezolano']); 
  const [cardFlipped, setCardFlipped] = useState(false);

  const [gameData, setGameData] = useState({
    word: '',
    category: '',
    roles: [],
    currentPlayerIndex: 0
  });

  const toggleCategory = (id) => {
    setSelectedCats(prev => 
      prev.includes(id) 
        ? (prev.length > 1 ? prev.filter(c => c !== id) : prev) 
        : [...prev, id]
    );
  };

  const startGame = () => {
    if (selectedCats.length === 0) return;

    // 1. Elegir palabra
    const randomCatId = selectedCats[Math.floor(Math.random() * selectedCats.length)];
    const wordList = DICTIONARIES[randomCatId];
    const secretWord = wordList[Math.floor(Math.random() * wordList.length)];

    // 2. Generar Roles usando totalPlayers
    let roles = Array(totalPlayers).fill('jugador');
    let impostorsAdded = 0;


    const safeImpostorCount = Math.max(1, Math.floor((totalPlayers - 1) / 2));

    while (impostorsAdded < safeImpostorCount) {
        const randomIndex = Math.floor(Math.random() * totalPlayers);
        if (roles[randomIndex] === 'jugador') {
            roles[randomIndex] = 'impostor';
            impostorsAdded++;
        }
    }

    setGameData({
        word: secretWord,
        category: randomCatId,
        roles: roles,
        currentPlayerIndex: 0
    });

    setPhase('pass');
  };

  const nextPlayer = () => {
    setCardFlipped(false);
    // Si quedan jugadores, avanzamos
    if (gameData.currentPlayerIndex + 1 < totalPlayers) {
        setGameData(prev => ({ ...prev, currentPlayerIndex: prev.currentPlayerIndex + 1 }));
        setPhase('pass');
    } else {
        // Si era el último, vamos al debate
        setPhase('playing');
    }
  };

  // --- RENDER: SETUP ---
  if (phase === 'setup') {
    return (
      <Layout>
        <div className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-4 py-2 shrink-0">
                <button onClick={() => navigate('/local/setup')} className="p-2 bg-white/10 rounded-full hover:bg-white/20">
                    <ArrowLeft className="text-white" size={20} />
                </button>
                <h2 className="text-xl font-black text-white">Partida Local</h2>
            </div>

            {/* Scroll Area */}
            <div className="flex-1 overflow-y-auto min-h-0 py-4 space-y-6 pr-2 custom-scrollbar">
                
                {/* Sliders / Info Jugadores */}
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-6">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-white font-bold flex items-center gap-2"><Users size={18}/> Jugadores</span>
                            <span className="text-emerald-400 font-black text-xl">{totalPlayers}</span>
                        </div>
                        {setupPlayers ? (
                            <div className="text-xs text-white/40 font-bold bg-white/5 p-3 rounded-xl border border-white/10 leading-relaxed">
                                <span className="text-emerald-500 uppercase tracking-wider block mb-1">Nombres registrados:</span>
                                {setupPlayers.map(p => p.name).join(', ')}
                            </div>
                        ) : (
                            <input 
                                type="range" min="3" max="20" 
                                value={sliderCount} onChange={(e) => setSliderCount(parseInt(e.target.value))}
                                className="w-full accent-emerald-500 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                            />
                        )}
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-white font-bold flex items-center gap-2"><UserX size={18} className="text-red-400"/> Impostores</span>
                            <span className="text-red-400 font-black text-xl">{impostorCount}</span>
                        </div>
                        <input 
                            type="range" min="1" max={Math.max(1, Math.floor((totalPlayers - 1) / 2))}
                            value={impostorCount} onChange={(e) => setImpostorCount(parseInt(e.target.value))}
                            className="w-full accent-red-500 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </div>

                {/* Categorías */}
                <div>
                    <div className="flex justify-between items-end mb-3">
                        <p className="text-white/50 text-xs font-bold uppercase tracking-wider">Temáticas</p>
                        <p className="text-white/30 text-[10px] uppercase font-bold">Selecciona varias</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        {CATEGORIES_UI.map(cat => {
                            const isSelected = selectedCats.includes(cat.id);
                            return (
                                <motion.button
                                    key={cat.id}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => toggleCategory(cat.id)}
                                    className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                                        isSelected 
                                        ? 'bg-pink-600 border-pink-500 text-white shadow-lg shadow-pink-600/20' 
                                        : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                                    }`}
                                >
                                    <span className="font-bold text-xs flex items-center gap-2">
                                        {cat.icon} {cat.name}
                                    </span>
                                    {isSelected && <Check size={16} />}
                                </motion.button>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Start Button */}
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

  // --- RENDER: PASAR DISPOSITIVO ---
  if (phase === 'pass') {
    // Lógica segura para obtener nombre
    const currentPlayerObj = setupPlayers ? setupPlayers[gameData.currentPlayerIndex] : null;
    const currentPlayerName = currentPlayerObj ? currentPlayerObj.name : `Jugador ${gameData.currentPlayerIndex + 1}`;
    
    // Seed consistente para el avatar
    const avatarSeed = currentPlayerObj ? `local-player-${currentPlayerObj.id}` : `local-anon-${gameData.currentPlayerIndex}`;

    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in fade-in zoom-in overflow-hidden">
          
          <div className="w-32 h-32 relative">
             <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping blur-xl"></div>
             <Avatar style="bottts-neutral" seed={avatarSeed} className="w-full h-full relative z-10 drop-shadow-2xl" />
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-white/50 text-lg font-bold uppercase tracking-widest">Pásale el móvil a</h3>
            <h1 className="text-4xl font-black text-white drop-shadow-lg">{currentPlayerName}</h1>
          </div>

          <button 
            onClick={() => setPhase('reveal')}
            className="bg-white text-black font-black px-8 py-4 rounded-2xl shadow-xl active:scale-95 transition-transform flex items-center gap-2"
          >
            SOY {currentPlayerName.toUpperCase()} <ArrowRight size={20}/>
          </button>
        </div>
      </Layout>
    );
  }

  // --- RENDER: REVELAR ROL ---
  if (phase === 'reveal') {
    const isImpostor = gameData.roles[gameData.currentPlayerIndex] === 'impostor';
    const isLastPlayer = gameData.currentPlayerIndex + 1 === totalPlayers;

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
                                {isImpostor ? "IMPOSTOR" : "JUGADOR"}
                            </h2>
                            <div className="w-full h-px bg-white/30 my-6"/>
                            <p className="text-white/80 text-xs uppercase font-bold mb-2">Palabra Clave:</p>
                            <p className="text-3xl font-black text-white leading-tight break-words drop-shadow-md">
                                {isImpostor ? "???" : gameData.word}
                            </p>
                        </div>
                    </motion.div>
                </div>

                {cardFlipped && (
                    <button 
                        onClick={nextPlayer}
                        className={`mt-6 font-black px-8 py-4 rounded-xl shadow-xl active:scale-95 transition-all animate-in fade-in slide-in-from-bottom-4 flex items-center gap-2 ${
                            isLastPlayer 
                            ? 'bg-red-500 text-white hover:bg-red-600' 
                            : 'bg-white text-black'
                        }`}
                    >
                        {isLastPlayer ? (
                            <>FIN <ArrowRight size={20}/></>
                        ) : (
                            'SIGUIENTE JUGADOR'
                        )}
                    </button>
                )}
            </div>
        </Layout>
    );
  }

  // --- RENDER: DEBATE (FIN DEL JUEGO) ---
  if (phase === 'playing') {
    return (
        <Layout>
            <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in duration-300">
                
                <div className="space-y-2">
                    <div className="bg-orange-500/20 p-6 rounded-full border-2 border-orange-500/50 inline-block mb-4 animate-bounce">
                         <Users size={48} className="text-orange-400" />
                    </div>
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
                        Hora de Debatir
                    </h2>
                    <p className="text-white/60 max-w-[250px] mx-auto">
                        Discutan entre ustedes. ¿Quién miente?
                    </p>
                </div>


                <div className="w-full space-y-3 pt-8">
                    {/* Botón Reiniciar (Mismos ajustes) */}
                    <button 
                        onClick={startGame}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
                    >
                        <RefreshCw size={20}/> REINICIAR JUEGO
                    </button>

                    {/* Botón Modificar (Volver al Setup con jugadores) */}
                    <button 
                        onClick={() => navigate('/local/setup', { state: { players: setupPlayers } })}
                        className="w-full bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold py-4 rounded-xl border border-white/20 flex items-center justify-center gap-2 transition-all"
                    >
                        <UserX size={20}/> MODIFICAR JUGADORES
                    </button>
                </div>
            </div>
        </Layout>
    );
  }
}