import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Play } from 'lucide-react';

export default function Home() {
  const [nickname, setNickname] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();

  const handleCreate = () => {
    if (!nickname) return alert("¡Ponte un nombre!");
    // Aquí luego emitiremos socket.emit('create_room')
    const newCode = "ABCD"; // Simulado
    navigate(`/lobby/${newCode}`, { state: { nickname, isHost: true } });
  };

  const handleJoin = () => {
    if (!nickname || !roomCode) return alert("Faltan datos");
    navigate(`/lobby/${roomCode}`, { state: { nickname, isHost: false } });
  };

  return (
    <div className="text-center space-y-6">
      <h1 className="text-4xl font-black text-brand-yellow drop-shadow-md">
        IMPOSTOR
      </h1>
      
      {/* Avatar Placeholder */}
      <div className="mx-auto w-24 h-24 bg-white rounded-full flex items-center justify-center text-black">
        <User size={48} />
      </div>

      <div className="space-y-3">
        <input 
          type="text" 
          placeholder="Tu Apodo" 
          className="w-full p-4 rounded-xl bg-black/30 text-white text-center font-bold text-lg outline-none focus:ring-2 ring-brand-yellow"
          onChange={e => setNickname(e.target.value)}
        />
        
        <div className="grid grid-cols-2 gap-2">
           <button 
             onClick={handleCreate}
             className="bg-brand-purple p-4 rounded-xl font-bold hover:opacity-90 transition"
           >
             Crear Sala
           </button>
           <button 
             onClick={handleJoin}
             className="bg-brand-blue p-4 rounded-xl font-bold hover:opacity-90 transition"
           >
             Unirse
           </button>
        </div>
        
        <input 
          type="text" 
          placeholder="Código de Sala" 
          className="w-full p-3 rounded-xl bg-black/30 text-center uppercase tracking-widest"
          onChange={e => setRoomCode(e.target.value)}
        />
      </div>
    </div>
  );
}