import { useLocation, useParams, useNavigate } from 'react-router-dom';

export default function Lobby() {
  const { roomCode } = useParams();
  const { state } = useLocation(); // Aquí viene el nickname
  const navigate = useNavigate();
  
  // DATOS DUMMY PARA PROBAR VISUALMENTE
  const players = [
    { id: 1, name: state?.nickname || "Yo", isMe: true },
    { id: 2, name: "Maria", isMe: false },
    { id: 3, name: "Juan", isMe: false },
    { id: 4, name: "Pedro", isMe: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <span className="text-gray-400">Sala:</span>
        <span className="text-3xl font-mono font-bold text-brand-yellow tracking-widest">{roomCode}</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {players.map(player => (
          <div key={player.id} className={`p-4 rounded-xl flex flex-col items-center justify-center border-2 ${player.isMe ? 'border-brand-yellow bg-white/10' : 'border-transparent bg-black/20'}`}>
            <div className="w-12 h-12 bg-gray-200 rounded-full mb-2"></div>
            <span className="font-bold truncate w-full text-center">{player.name}</span>
          </div>
        ))}
      </div>

      <div className="pt-8">
        <p className="text-center text-sm text-gray-400 mb-4">Esperando al anfitrión...</p>
        {state?.isHost && (
          <button 
            onClick={() => navigate('/game')}
            className="w-full bg-green-500 py-4 rounded-xl font-black text-xl shadow-[0_4px_0_rgb(21,128,61)] active:shadow-none active:translate-y-1 transition-all"
          >
            EMPEZAR PARTIDA
          </button>
        )}
      </div>
    </div>
  );
}