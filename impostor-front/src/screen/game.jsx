import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Fingerprint, X } from 'lucide-react';
import { Layout, Avatar } from '../components/ui/Layout';

export default function Game() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showVoteModal, setShowVoteModal] = useState(false);

  // MOCK DATA
  const AM_I_IMPOSTOR = false; 
  const SECRET_LOCATION = "La Playa";
  const players = [
    { id: 2, name: "Maria" }, { id: 3, name: "Lucas" }, { id: 4, name: "Martin" }
  ];

  return (
    <Layout>
      <div className="h-full flex flex-col items-center justify-between min-h-[500px]">
        
        {/* Header */}
        <div className="w-full flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"/>
            <span className="text-xs font-bold text-white/60">EN CURSO</span>
          </div>
          <div className="text-xs font-bold text-white/40 uppercase tracking-widest">Ronda 1/3</div>
        </div>

        {/* CARTA 3D FLIP */}
        <div className="perspective-1000 w-full max-w-[280px] h-[380px] relative cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
          <motion.div
            className="w-full h-full relative transform-style-3d transition-all duration-700"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            {/* FRENTE DE LA CARTA (Incógnita) */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl shadow-2xl backface-hidden flex flex-col items-center justify-center border-4 border-white/10">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <Fingerprint size={80} className="text-white/20 mb-4" />
              <p className="font-black text-2xl text-white tracking-widest">TU ROL</p>
              <p className="text-sm text-white/50 mt-2 font-bold animate-pulse">TOCA PARA REVELAR</p>
            </div>

            {/* DORSO DE LA CARTA (Revelación) */}
            <div className={`
              absolute inset-0 w-full h-full rounded-3xl shadow-2xl backface-hidden rotate-y-180 overflow-hidden border-4
              ${AM_I_IMPOSTOR ? 'bg-red-600 border-red-400' : 'bg-blue-500 border-blue-300'}
            `}>
              <div className="flex flex-col items-center justify-center h-full p-6 text-center relative z-10">
                {AM_I_IMPOSTOR ? <AlertTriangle size={64} className="text-white mb-4"/> : <CheckCircle size={64} className="text-white mb-4"/>}
                
                <h2 className="text-3xl font-black text-white mb-1">
                  {AM_I_IMPOSTOR ? "IMPOSTOR" : "CIVIL"}
                </h2>
                
                <div className="w-full h-px bg-white/30 my-4"/>
                
                <p className="text-white/80 text-sm uppercase font-bold mb-1">Tu ubicación:</p>
                <p className="text-2xl font-black text-white leading-tight">
                  {AM_I_IMPOSTOR ? "???" : SECRET_LOCATION}
                </p>
              </div>
              
              {/* Decoración fondo */}
              <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-white/10 rotate-45 pointer-events-none"/>
            </div>
          </motion.div>
        </div>

        {/* Botón de Votar */}
        <div className="w-full mt-8">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowVoteModal(true)}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-red-500/30 flex items-center justify-center gap-2"
          >
            <AlertTriangle size={20} />
            REPORTAR IMPOSTOR
          </motion.button>
        </div>

        {/* MODAL DE VOTACIÓN */}
        <AnimatePresence>
          {showVoteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => setShowVoteModal(false)}
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#1e1e2e] w-full max-w-sm rounded-3xl border border-white/10 shadow-2xl relative z-10 overflow-hidden"
              >
                <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/5">
                  <h3 className="font-bold text-white">Votación de Emergencia</h3>
                  <button onClick={() => setShowVoteModal(false)} className="p-1 hover:bg-white/10 rounded-full"><X size={20}/></button>
                </div>
                
                <div className="p-4 space-y-2">
                  {players.map(player => (
                    <motion.button
                      key={player.id}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center p-3 rounded-xl bg-white/5 hover:bg-red-500/20 hover:border-red-500/50 border border-transparent transition-all group"
                      onClick={() => { setShowVoteModal(false); alert("Votado!"); }}
                    >
                      <Avatar name={player.name} className="w-10 h-10" />
                      <span className="ml-3 font-bold text-white group-hover:text-red-300">{player.name}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}