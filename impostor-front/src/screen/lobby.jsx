import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Copy, Crown } from 'lucide-react';
import { Layout, Avatar } from '../components/ui/Layout';

export default function Lobby() {
  const { roomCode } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  
  const players = [
    { id: 1, name: state?.nickname || "Yo", isHost: true },
    { id: 2, name: "Maria", isHost: false },
    { id: 3, name: "Lucas", isHost: false },
    { id: 4, name: "Martin", isHost: false },
  ];

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
    // Podrías añadir un toast aquí
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header Sala */}
        <div className="text-center space-y-2">
          <p className="text-white/50 text-sm font-bold uppercase">Código de Sala</p>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={copyCode}
            className="text-4xl font-black font-mono tracking-widest text-yellow-400 bg-yellow-400/10 px-6 py-2 rounded-2xl border border-yellow-400/20 flex items-center justify-center gap-3 mx-auto hover:bg-yellow-400/20 transition-colors"
          >
            {roomCode}
            <Copy size={20} className="text-yellow-400/50" />
          </motion.button>
        </div>

        {/* Lista Jugadores */}
        <div className="space-y-3">
          <div className="flex justify-between items-end px-2">
            <span className="text-sm font-bold text-white/70">Jugadores ({players.length})</span>
            <div className="flex space-x-1">
               <span className="block w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
               <span className="text-xs text-green-500 font-bold">Esperando</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
            {players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center bg-white/5 p-3 rounded-2xl border border-white/5"
              >
                <Avatar
                style={player.isMe ? state?.avatarConfig?.style : 'bottts'} 
                seed={player.isMe ? state?.avatarConfig?.seed : player.name} 
                className="w-12 h-12"   
                />
                <div className="ml-4 flex-1">
                  <p className="font-bold text-lg leading-none">{player.name}</p>
                  {player.name === (state?.nickname || "Yo") && <span className="text-xs text-white/40"> (Tú)</span>}
                </div>
                {player.isHost && <Crown size={20} className="text-yellow-500" />}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Botón Empezar */}
        {state?.isHost && (
          <motion.button 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/game')}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 py-4 rounded-2xl font-black text-xl shadow-lg shadow-green-500/20 mt-4"
          >
            EMPEZAR
          </motion.button>
        )}
      </div>
    </Layout>
  );
}