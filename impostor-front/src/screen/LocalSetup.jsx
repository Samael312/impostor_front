import { useState, useEffect } from 'react'; // IMPORTANTE: Agrega useEffect
import { useNavigate, useLocation } from 'react-router-dom'; // IMPORTANTE: Agrega useLocation
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Play, RefreshCcw } from 'lucide-react'; // Agregamos icono RefreshCcw
import { Layout, Avatar } from '../components/ui/Layout';

export default function LocalSetup() {
  const navigate = useNavigate();
  const location = useLocation(); // Hook para leer los datos

  // Empezamos con 3 huecos vacíos por defecto
  const [players, setPlayers] = useState([
    { id: 1, name: '' }, { id: 2, name: '' }, { id: 3, name: '' }
  ]);

  // EFECTO: Si venimos de la pantalla "Modificar", cargamos los jugadores existentes
  useEffect(() => {
    if (location.state?.players) {
        setPlayers(location.state.players);
    }
  }, [location.state]);

  const addPlayer = () => {
    const newId = players.length > 0 ? Math.max(...players.map(p => p.id)) + 1 : 1;
    setPlayers([...players, { id: newId, name: '' }]);
  };

  const removePlayer = (id) => {
    if (players.length <= 3) return;
    setPlayers(players.filter(p => p.id !== id));
  };

  // Función para resetear completamente (Nuevo Juego)
  const resetPlayers = () => {
    if(confirm("¿Borrar todos los nombres y empezar de cero?")) {
        setPlayers([{ id: 1, name: '' }, { id: 2, name: '' }, { id: 3, name: '' }]);
    }
  };

  const updateName = (id, newName) => {
    setPlayers(players.map(p => p.id === id ? { ...p, name: newName } : p));
  };

  const startGame = () => {
    const validPlayers = players.filter(p => p.name.trim() !== '');
    if (validPlayers.length < 3) return alert("Necesitas mínimo 3 jugadores con nombre.");
    
    navigate('/local/game', { 
      state: { players: validPlayers } 
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="text-center relative">
            {/* Botón opcional para limpiar todo si vienen de modificar */}
            {location.state?.players && (
                <button 
                    onClick={resetPlayers}
                    className="absolute left-0 top-0 p-2 text-white/30 hover:text-red-400 transition"
                    title="Empezar de cero"
                >
                    <RefreshCcw size={16} />
                </button>
            )}
            <h2 className="text-2xl font-black text-white">¿Quiénes juegan?</h2>
            <p className="text-white/50 text-sm">Configura los nombres.</p>
        </div>

        {/* ... (Aquí va tu lista de jugadores, igual que antes) ... */}
        <div className="space-y-3 max-h-[50vh] overflow-y-auto overflow-x-hidden pr-2">
          <AnimatePresence>
            {players.map((p, index) => (
              <motion.div 
                key={p.id}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2"
              >
                <div className="w-12 h-12 shrink-0">
                  <Avatar style="bottts-neutral" seed={`local-player-${p.id}`} className="w-full h-full" />
                </div>
                <input 
                  type="text" 
                  placeholder={`Jugador ${index + 1}`}
                  value={p.name}
                  onChange={(e) => updateName(p.id, e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white font-bold outline-none focus:border-emerald-500 transition-colors"
                />
                {players.length > 3 && (
                  <button onClick={() => removePlayer(p.id)} className="p-3 text-red-400 hover:bg-red-500/20 rounded-xl transition">
                    <Trash2 size={20} />
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* BOTONES DE ACCIÓN EN SETUP */}
        <div className="flex gap-3">
             {/* Botón Añadir Jugador (Existente) */}
            <button 
                onClick={addPlayer}
                className="flex-1 py-3 border-2 border-dashed border-white/20 rounded-xl text-white/50 font-bold flex items-center justify-center gap-2 hover:bg-white/5 hover:border-white/40 transition"
            >
                <Plus size={20} /> Añadir
            </button>
        </div>

        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={startGame}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-black text-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 mt-4"
        >
          <Play className="fill-white" /> {location.state?.players ? 'GUARDAR CAMBIOS' : 'EMPEZAR'}
        </motion.button>
      </div>
    </Layout>
  );
}