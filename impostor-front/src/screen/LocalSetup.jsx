import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Play } from 'lucide-react';
import { Layout, Avatar } from '../components/ui/Layout';

export default function LocalSetup() {
  const navigate = useNavigate();
  // Empezamos con 3 huecos vacíos
  const [players, setPlayers] = useState([
    { id: 1, name: '' }, { id: 2, name: '' }, { id: 3, name: '' }
  ]);

  const addPlayer = () => {
    const newId = players.length > 0 ? Math.max(...players.map(p => p.id)) + 1 : 1;
    setPlayers([...players, { id: newId, name: '' }]);
  };

  const removePlayer = (id) => {
    if (players.length <= 3) return; // Mínimo 3
    setPlayers(players.filter(p => p.id !== id));
  };

  const updateName = (id, newName) => {
    setPlayers(players.map(p => p.id === id ? { ...p, name: newName } : p));
  };

  const startGame = () => {
    // Validar que no haya nombres vacíos
    const validPlayers = players.filter(p => p.name.trim() !== '');
    if (validPlayers.length < 3) return alert("Necesitas mínimo 3 jugadores con nombre.");
    
    // Enviamos los jugadores a la pantalla de juego
    navigate('/local/game', { state: { players: validPlayers } });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-black text-white">¿Quiénes juegan?</h2>
          <p className="text-white/50 text-sm">Pasad el móvil en círculo.</p>
        </div>

        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
          <AnimatePresence>
            {players.map((p, index) => (
              <motion.div 
                key={p.id}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2"
              >
                <div className="w-12 h-12 shrink-0">
                  {/* Avatar aleatorio basado en el ID para mantener consistencia visual */}
                  <Avatar style="bottts-neutral" seed={`local-player-${p.id}`} className="w-full h-full" />
                </div>
                <input 
                  type="text" 
                  placeholder={`Jugador ${index + 1}`}
                  value={p.name}
                  onChange={(e) => updateName(p.id, e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white font-bold outline-none focus:border-emerald-500 transition-colors"
                  autoFocus={index === players.length - 1} 
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

        <button 
          onClick={addPlayer}
          className="w-full py-3 border-2 border-dashed border-white/20 rounded-xl text-white/50 font-bold flex items-center justify-center gap-2 hover:bg-white/5 hover:border-white/40 transition"
        >
          <Plus size={20} /> Añadir Jugador
        </button>

        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={startGame}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-black text-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 mt-4"
        >
          <Play className="fill-white" /> EMPEZAR
        </motion.button>
      </div>
    </Layout>
  );
}