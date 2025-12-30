import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Globe, Smartphone, ChevronRight } from 'lucide-react';
import { Layout } from '../components/ui/Layout';

export default function Home() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="flex flex-col h-full justify-between pt-10 pb-6">
        
        {/* --- SECCIÓN DEL TÍTULO E ILUSTRACIÓN --- */}
        <div className="text-center space-y-6">
          {/* Título */}
          <h1 className="text-5xl mr-serif font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 via-teal-300 to-cyan-500 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]">
            IMPOSTOR
          </h1>

          {/* NUEVA ILUSTRACIÓN DE IMPOSTOR (SVG Inline) */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-40 h-40 mx-auto relative drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]"
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

          {/* Subtítulo */}
          <p className="text-white/60 text-lg max-w-xs mx-auto leading-relaxed font-bold">
            Descubre quién miente antes de que sea demasiado tarde.
          </p>
        </div>

        {/* --- SECCIÓN DE BOTONES --- */}
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          
          {/* BOTÓN LOCAL */}
          <motion.button
            whileTap={{ scale: 0.97 }} // Animación de pulsación
            onClick={() => navigate('/local/setup')}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 p-6 rounded-3xl shadow-lg shadow-emerald-500/20 flex items-center justify-between group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/0 transition-colors group-hover:bg-white/10"/>
            <div className="flex items-center gap-5">
              <div className="bg-black/20 p-4 rounded-2xl backdrop-blur-sm">
                <Smartphone size={32} className="text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-black text-white mb-1 tracking-wide">LOCAL</h3>
                <p className="text-emerald-100 text-sm font-bold opacity-80 flex items-center gap-2">
                  <Users size={14} /> Un solo dispositivo
                </p>
              </div>
            </div>
            <ChevronRight size={28} className="text-white/50 group-hover:text-white transition-colors group-hover:translate-x-1" />
          </motion.button>

          {/* BOTÓN ONLINE (Actualizado con la misma animación) */}
          <motion.button
            whileTap={{ scale: 0.97 }} 
            onClick={() => navigate('/online')}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-700 p-6 rounded-3xl shadow-lg shadow-indigo-500/20 flex items-center justify-between group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/0 transition-colors group-hover:bg-white/5"/>
            

            <div className="flex items-center gap-5 opacity-90">
              <div className="bg-black/20 p-4 rounded-2xl backdrop-blur-sm">
                <Globe size={32} className="text-indigo-100" />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-black text-indigo-100 mb-1 tracking-wide">ONLINE</h3>
                <p className="text-indigo-200 text-sm font-bold opacity-70 flex items-center gap-2">
                  <Users size={14} /> Multijugador remoto
                </p>
              </div>
            </div>
             <ChevronRight size={28} className="text-white/50 group-hover:text-white transition-colors group-hover:translate-x-1" />
          </motion.button>
        </div>

        {/* Footer sutil */}
        <div className="text-center text-white/30 text-xs font-bold tracking-widest uppercase py-2">
          Versión 1.0
        </div>
      </div>
    </Layout>
  );
}