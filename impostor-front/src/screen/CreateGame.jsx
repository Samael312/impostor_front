import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, UserX, Check, ArrowRight, ArrowLeft } from 'lucide-react'; // <--- Agregado UserX
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
  const [impostorCount, setImpostorCount] = useState(1); // <--- Nuevo Estado

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
            impostorCount: impostorCount // <--- Enviamos esto al backend
        }
    });
  };

  return (
    <Layout>
      <div className="flex flex-col h-full w-full overflow-hidden">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 py-2 shrink-0">
            <button onClick={() => navigate(-1)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <ArrowLeft className="text-white" size={20} />
            </button>
            <h2 className="text-xl md:text-2xl font-black text-white truncate">Configurar Sala</h2>
        </div>

        {/* ÁREA DE SCROLL */}
        <div className="flex-1 overflow-y-auto min-h-0 py-4 space-y-6 pr-2 custom-scrollbar">
            
            {/* Contenedor de Sliders (Jugadores e Impostores) */}
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-6">
                
                {/* 1. Selector de Jugadores */}
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-white font-bold flex items-center gap-2 text-sm">
                            <Users size={18} className="text-emerald-400"/> Jugadores
                        </span>
                        <span className="text-emerald-400 font-black text-xl">{maxPlayers}</span>
                    </div>
                    <input 
                        type="range" min="4" max="20" step="1" 
                        value={maxPlayers}
                        onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
                        className="w-full accent-emerald-500 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    />
                </div>

                {/* 2. Selector de Impostores (NUEVO) */}
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-white font-bold flex items-center gap-2 text-sm">
                            <UserX size={18} className="text-red-400"/> Impostores
                        </span>
                        <span className="text-red-400 font-black text-xl">{impostorCount}</span>
                    </div>
                    <input 
                        type="range" 
                        min="1" 
                        max={maxImpostorsAllowed} // Límite dinámico
                        step="1" 
                        value={impostorCount}
                        onChange={(e) => setImpostorCount(parseInt(e.target.value))}
                        className="w-full accent-red-500 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    />
                    <p className="text-xs text-white/30 mt-2 text-right">
                        Máx. permitido: {maxImpostorsAllowed}
                    </p>
                </div>

            </div>

            {/* Selector de Categorías */}
            <div className="space-y-3">
                <p className="text-white/50 text-xs font-bold uppercase tracking-wider">Temáticas</p>
                <div className="grid grid-cols-2 gap-3 pb-2">
                    {AVAILABLE_CATEGORIES.map(cat => {
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
                                <span className="font-bold text-xs md:text-sm flex items-center gap-2">
                                    {cat.icon} {cat.name}
                                </span>
                                {isSelected && <Check size={16} />}
                            </motion.button>
                        )
                    })}
                </div>
            </div>
        </div>

        {/* FOOTER */}
        <div className="pt-4 pb-2 shrink-0">
            <button 
                onClick={handleCreateRoom}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 p-4 rounded-xl font-black text-white text-lg shadow-xl shadow-emerald-900/50 flex items-center justify-center gap-3 transform transition-transform active:scale-95 hover:brightness-110"
            >
                CREAR SALA <ArrowRight />
            </button>
        </div>

      </div>
    </Layout>
  );
}