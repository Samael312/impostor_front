import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, UserX, Check, ArrowRight, ArrowLeft, Settings, Grid } from 'lucide-react';
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

export default function CreateGame() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [selectedCats, setSelectedCats] = useState(['venezolano']); 
  const [maxPlayers, setMaxPlayers] = useState(10);
  const [impostorCount, setImpostorCount] = useState(1);

  // Calcular el máximo de impostores permitidos (siempre menos de la mitad)
  const maxImpostorsAllowed = Math.max(1, Math.floor((maxPlayers - 1) / 2));

  // Efecto para corregir impostores si bajamos mucho los jugadores
  useEffect(() => {
    if (impostorCount > maxImpostorsAllowed) {
        setImpostorCount(maxImpostorsAllowed);
    }
  }, [maxPlayers, maxImpostorsAllowed, impostorCount]);

  useEffect(() => {
    if (!state?.nickname) navigate('/');

    const handleRoomCreated = (data) => {
        console.log("📦 Datos recibidos del servidor:", data);

        if (!data || !data.roomCode) {
            alert("Error: El servidor no envió el código de sala.");
            return;
        }

        navigate(`/lobby/${data.roomCode}`, { 
            state: { 
                nickname: state.nickname,
                avatarConfig: state.avatarConfig,
                isHost: true, 
                players: data.players 
            } 
        });
    };

    socket.on('room_created', handleRoomCreated);
    return () => socket.off('room_created', handleRoomCreated);
  }, [state, navigate]);

  const toggleCategory = (id) => {
    if (selectedCats.includes(id)) {
        if (selectedCats.length > 1) {
            setSelectedCats(selectedCats.filter(c => c !== id));
        }
    } else {
        setSelectedCats([...selectedCats, id]);
    }
  };

  const handleCreateRoom = () => {
    if(!socket.connected) {
        alert("No hay conexión con el servidor");
        return;
    }

    console.log("📤 Solicitando crear sala...");
    socket.emit('create_room', {
        nickname: state.nickname,
        avatarConfig: state.avatarConfig,
        settings: {
            categories: selectedCats,
            maxPlayers: maxPlayers,
            impostorCount: impostorCount 
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
                <h2 className="text-2xl font-black text-white">Configurar Sala</h2>
                <p className="text-slate-400 text-sm">Personaliza las reglas de la partida</p>
            </div>
        </div>

        {/* --- GRID PRINCIPAL (2 Columnas en PC, 1 en Móvil) --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* COLUMNA IZQUIERDA: REGLAS (Sliders) - Ocupa 5 columnas */}
            <div className="md:col-span-5 space-y-4">
                <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                        <Settings className="text-indigo-400" size={20}/> Ajustes de Juego
                    </h3>

                    {/* 1. Selector de Jugadores */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-slate-300 font-bold text-sm flex items-center gap-2">
                                <Users size={16} className="text-emerald-400"/> Máx. Jugadores
                            </span>
                            <span className="text-white bg-white/10 px-3 py-1 rounded-lg font-mono font-bold">{maxPlayers}</span>
                        </div>
                        <input 
                            type="range" min="4" max="20" step="1" 
                            value={maxPlayers}
                            onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
                            className="w-full accent-emerald-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer hover:bg-slate-600 transition-colors"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
                            <span>4</span>
                            <span>20</span>
                        </div>
                    </div>

                    {/* 2. Selector de Impostores */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-slate-300 font-bold text-sm flex items-center gap-2">
                                <UserX size={16} className="text-red-400"/> Impostores
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
                            <span className="text-xs text-red-400/70 font-bold">Máximo: {maxImpostorsAllowed}</span>
                        </div>
                    </div>
                </div>

                {/* Botón de Crear (En PC se ve mejor aquí abajo en la columna de configuración) */}
                <button 
                    onClick={handleCreateRoom}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 p-4 rounded-xl font-black text-white text-lg shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-3 transform transition-all hover:scale-[1.02] hover:shadow-emerald-500/30 active:scale-95"
                >
                    CREAR SALA <ArrowRight size={20} />
                </button>
            </div>

            {/* COLUMNA DERECHA: CATEGORÍAS - Ocupa 7 columnas */}
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