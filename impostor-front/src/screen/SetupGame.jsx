import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, UserX, Check, ArrowLeft, Settings, Grid, Play } from 'lucide-react';
import { Layout } from '../components/ui/Layout';
import socket from '../socket';

// IDs deben coincidir con backend/data/dictionaries.js
const AVAILABLE_CATEGORIES = [
  { id: 'venezolano', name: 'Venezolano', icon: '🇻🇪' },
  { id: 'animales',   name: 'Animales',   icon: '🦁' },
  { id: 'cultura_pop',name: 'Cultura Pop',icon: '🎬' },
  { id: 'fiestas',    name: 'Fiestas',    icon: '🎉' },
  { id: 'objetos',    name: 'Objetos',    icon: '📱' },
  { id: 'comida_internacional', name: 'Comida', icon: '🍔' },
  { id: 'ropa',       name: 'Ropa',       icon: '🧢' },
  { id: 'dificil',    name: 'Difícil',    icon: '🔥' },
];

export default function SetupGame() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Estado inicial
  const [selectedCats, setSelectedCats] = useState(['venezolano']); 
  // Nota: maxPlayers es visual aquí, ya que los jugadores ya están en la sala, 
  // pero sirve para calcular el límite de impostores.
  const [currentPlayersCount, setCurrentPlayersCount] = useState(state?.players?.length || 4);
  const [impostorCount, setImpostorCount] = useState(1);

  // Validación de seguridad
  useEffect(() => {
    if (!state?.roomId || !state?.isHost) {
        navigate('/');
    }
  }, [state, navigate]);

  // Calcular el máximo de impostores permitidos en base a los jugadores ACTUALES en la sala
  const maxImpostorsAllowed = Math.max(1, Math.floor((currentPlayersCount - 1) / 2));

  // Ajustar impostores si excede el máximo
  useEffect(() => {
    if (impostorCount > maxImpostorsAllowed) {
        setImpostorCount(maxImpostorsAllowed);
    }
  }, [currentPlayersCount, maxImpostorsAllowed, impostorCount]);

  // ESCUCHAR INICIO DE JUEGO (Para volver a la pantalla de roles)
  useEffect(() => {
    const handleGameStarted = (gameData) => {
        // Volvemos a la pantalla de juego con los nuevos roles
        navigate('/game', { 
            state: { 
                ...gameData, 
                roomId: state.roomId, 
                nickname: state.nickname,
                isHost: true 
            } 
        });
    };

    socket.on('game_started', handleGameStarted);
    return () => socket.off('game_started', handleGameStarted);
  }, [navigate, state]);

  const toggleCategory = (id) => {
    if (selectedCats.includes(id)) {
        if (selectedCats.length > 1) {
            setSelectedCats(selectedCats.filter(c => c !== id));
        }
    } else {
        setSelectedCats([...selectedCats, id]);
    }
  };

  const handleRestartGame = () => {
    if(!socket.connected) return alert("Sin conexión");

    console.log("🔄 Reiniciando partida con nueva configuración...");
    
    // EN LUGAR DE CREAR SALA, INICIAMOS EL JUEGO EN LA SALA EXISTENTE
    socket.emit('start_game', {
        roomCode: state.roomId,
        config: {
            categories: selectedCats,
            impostors: impostorCount 
        }
    });
  };

  return (
    <Layout>
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
        
        {/* --- HEADER --- */}
        <div className="flex items-center gap-4 border-b border-white/5 pb-4">
            <button 
                onClick={() => navigate(-1)} 
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white"
            >
                <ArrowLeft size={20} />
            </button>
            <div>
                <h2 className="text-2xl font-black text-white">Configurar Nueva Ronda</h2>
                <p className="text-slate-400 text-sm">Ajusta los temas y los impostores</p>
            </div>
        </div>

        {/* --- GRID PRINCIPAL --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* COLUMNA IZQUIERDA: REGLAS */}
            <div className="md:col-span-5 space-y-4">
                <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                        <Settings className="text-indigo-400" size={20}/> Ajustes de Ronda
                    </h3>

                    {/* Información de Jugadores (Solo lectura visual) */}
                    <div className="mb-8 opacity-70">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-slate-300 font-bold text-sm flex items-center gap-2">
                                <Users size={16} className="text-emerald-400"/> Jugadores en sala
                            </span>
                            <span className="text-white bg-white/10 px-3 py-1 rounded-lg font-mono font-bold">{currentPlayersCount}</span>
                        </div>
                        <p className="text-[10px] text-slate-500">No puedes cambiar esto aquí, los jugadores ya están dentro.</p>
                    </div>

                    {/* Selector de Impostores */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-slate-300 font-bold text-sm flex items-center gap-2">
                                <UserX size={16} className="text-red-400"/> Cantidad de Impostores
                            </span>
                            <span className="text-white bg-white/10 px-3 py-1 rounded-lg font-mono font-bold">{impostorCount}</span>
                        </div>
                        <input 
                            type="range" 
                            min="1" 
                            max={maxImpostorsAllowed} 
                            step="1" 
                            value={impostorCount}
                            onChange={(e) => setImpostorCount(parseInt(e.target.value))}
                            className="w-full accent-red-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer hover:bg-slate-600 transition-colors"
                        />
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-slate-500 font-mono">1</span>
                            <span className="text-xs text-red-400/70 font-bold">Máximo posible: {maxImpostorsAllowed}</span>
                        </div>
                    </div>
                </div>

                {/* BOTÓN INICIAR */}
                <button 
                    onClick={handleRestartGame}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 p-4 rounded-xl font-black text-white text-lg shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-3 transform transition-all hover:scale-[1.02] hover:shadow-emerald-500/30 active:scale-95"
                >
                    INICIAR RONDA <Play size={20} fill="currentColor"/>
                </button>
            </div>

            {/* COLUMNA DERECHA: CATEGORÍAS */}
            <div className="md:col-span-7 bg-slate-800/30 border border-white/5 rounded-2xl p-6">
                 <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Grid className="text-pink-400" size={20}/> Temáticas
                    <span className="text-xs bg-white/10 text-slate-300 px-2 py-0.5 rounded ml-auto">
                        {selectedCats.length} seleccionadas
                    </span>
                 </h3>
                 
                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {AVAILABLE_CATEGORIES.map(cat => {
                        const isSelected = selectedCats.includes(cat.id);
                        return (
                            <motion.button
                                key={cat.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => toggleCategory(cat.id)}
                                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 text-center transition-all h-24 ${
                                    isSelected 
                                    ? 'bg-gradient-to-br from-pink-600 to-rose-600 border-pink-500/50 text-white shadow-lg shadow-pink-900/30' 
                                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white hover:border-slate-600'
                                }`}
                            >
                                <span className="text-2xl">{cat.icon}</span>
                                <span className="font-bold text-xs sm:text-sm leading-tight">
                                    {cat.name}
                                </span>
                                {isSelected && (
                                    <div className="absolute top-2 right-2">
                                        <Check size={14} className="text-white drop-shadow-md" />
                                    </div>
                                )}
                            </motion.button>
                        )
                    })}
                </div>
                <p className="text-slate-500 text-xs mt-4 text-center italic">
                    Se elegirá una palabra al azar de las categorías seleccionadas.
                </p>
            </div>

        </div>
      </div>
    </Layout>
  );
}