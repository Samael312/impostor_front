import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Globe, Smartphone, ChevronRight, Gamepad2 } from 'lucide-react';
import { Layout } from '../components/ui/Layout';

export default function Home() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center w-full gap-8 sm:gap-12">
        
        {/* --- HERO SECTION: TÍTULO E ILUSTRACIÓN --- */}
        <div className="text-center space-y-6 w-full">
          {/* Título con efecto Glow */}
          <div className="relative inline-block">
            <h1 className="text-5xl sm:text-7xl mr-serif font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 via-teal-300 to-cyan-500 drop-shadow-[0_0_25px_rgba(52,211,153,0.4)] tracking-tight">
              IMPOSTOR
            </h1>
          </div>

          {/* ILUSTRACIÓN SVG ANIMADA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-48 h-48 sm:w-56 sm:h-56 mx-auto relative drop-shadow-2xl"
          >
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              {/* Capucha/Sombra base */}
              <path d="M100 20C60 20 30 50 30 90V160C30 175 45 185 60 185H140C155 185 170 175 170 160V90C170 50 140 20 100 20Z" fill="#0f172a"/>
              {/* Sombra interior rostro */}
              <path d="M100 30C70 30 50 60 50 100C50 130 70 150 100 150C130 150 150 130 150 100C150 60 130 30 100 30Z" fill="#1e293b"/>
              {/* Ojos brillantes animados */}
              <circle cx="75" cy="95" r="8" fill="#34d399" className="animate-pulse">
                 <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="125" cy="95" r="8" fill="#34d399" className="animate-pulse">
                 <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" begin="0.3s"/>
              </circle>
              {/* Brillo sutil sobre la cabeza */}
              <path d="M70 25C80 20 120 20 130 25" stroke="url(#head-glow)" strokeWidth="3" strokeLinecap="round"/>
              <defs>
                <linearGradient id="head-glow" x1="70" y1="25" x2="130" y2="25" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#34d399" stopOpacity="0"/>
                  <stop offset="0.5" stopColor="#34d399"/>
                  <stop offset="1" stopColor="#34d399" stopOpacity="0"/>
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          <p className="text-slate-400 text-lg sm:text-xl max-w-md mx-auto leading-relaxed font-medium px-4">
            Descubre quién miente antes de que sea demasiado tarde.
          </p>
        </div>

        {/* --- GRID DE BOTONES (1 Columna móvil, 2 Columnas PC) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full max-w-3xl px-2 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          
          {/* BOTÓN LOCAL */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/local/setup')}
            className="group relative overflow-hidden bg-slate-800 hover:bg-slate-700 border border-emerald-500/30 hover:border-emerald-500/60 p-6 sm:p-8 rounded-3xl transition-all shadow-lg hover:shadow-emerald-500/10 text-left"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <Smartphone size={80} />
            </div>
            
            <div className="relative z-10 flex flex-col h-full justify-between gap-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 mb-2">
                <Users size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">Local</h3>
                <p className="text-slate-400 text-sm">Un dispositivo, varios jugadores.</p>
              </div>
              <div className="flex items-center text-emerald-400 text-sm font-bold mt-2">
                Jugar ahora <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform"/>
              </div>
            </div>
          </motion.button>

          {/* BOTÓN ONLINE */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/online')}
            className="group relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-700 p-6 sm:p-8 rounded-3xl transition-all shadow-xl shadow-indigo-500/20 text-left"
          >
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity">
               <Globe size={80} className="text-white" />
            </div>

            <div className="relative z-10 flex flex-col h-full justify-between gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white mb-2 backdrop-blur-sm">
                <Gamepad2 size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">Online</h3>
                <p className="text-indigo-100 text-sm opacity-90">Crea o únete a una sala remota.</p>
              </div>
              <div className="flex items-center text-white text-sm font-bold mt-2">
                Conectar <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform"/>
              </div>
            </div>
          </motion.button>

        </div>

        {/* Footer */}
        <div className="text-slate-500 text-xs font-bold tracking-widest uppercase mt-4">
          Versión 1.0
        </div>

      </div>
    </Layout>
  );
}