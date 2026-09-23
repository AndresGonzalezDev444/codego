import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, Lock, ArrowRight, Play } from 'lucide-react';
import { Byte } from '@/components/byte/Byte';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { worldService } from '@/services/worldService';
import type { World } from '@/types';
import { cn } from '@/lib/utils';

export default function MapPage() {
  const navigate = useNavigate();
  const [worlds, setWorlds] = useState<World[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    worldService.getWorlds()
      .then(setWorlds)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-[60vh]">
        <Byte mood="thinking" size="lg" animate />
        <p className="text-[--text-muted] mt-4 animate-pulse">Cargando el mapa estelar...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-bold mb-3">
            <Map className="w-4 h-4" /> Mapa del Multiverso
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-3">
            Elige tu <span className="gradient-text">Destino</span>
          </h1>
          <p className="text-[--text-secondary] max-w-lg">
            Viaja a través de diferentes planetas de programación. Cada mundo alberga un lenguaje, desafíos únicos y conocimientos por descubrir.
          </p>
        </div>
        
        <div className="hidden md:block">
          <Byte mood="excited" size="md" animate />
        </div>
      </div>

      {/* Grid de Mundos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {worlds.map((world, index) => (
          <motion.div
            key={world.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              variant="elevated" 
              className={cn(
                "relative h-full overflow-hidden flex flex-col transition-all duration-300",
                !world.is_locked ? "hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl cursor-pointer" : "opacity-80"
              )}
              style={{
                borderColor: !world.is_locked ? `${world.color_primary}50` : undefined,
                boxShadow: !world.is_locked ? `0 10px 40px -10px ${world.color_primary}30` : undefined,
              }}
              onClick={() => !world.is_locked && navigate(`/app/worlds?id=${world.id}`)}
            >
              {/* Fondo del planeta */}
              <div 
                className="absolute inset-0 opacity-10"
                style={{ background: `linear-gradient(135deg, ${world.color_primary}, ${world.color_secondary})` }}
              />
              
              {/* Imagen/Cover (Opcional, pero usaremos gradiente por ahora) */}
              <div 
                className="h-32 w-full relative flex items-center justify-center"
                style={{ background: `linear-gradient(to bottom, ${world.color_primary}30, transparent)` }}
              >
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-xl border-4"
                  style={{ 
                    borderColor: `${world.color_secondary}50`,
                    background: `linear-gradient(135deg, ${world.color_primary}, ${world.color_secondary})`
                  }}
                >
                  {world.language?.icon_url ?? '🌍'}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col relative z-10">
                <div className="flex items-start justify-between mb-2">
                  <h2 className="text-2xl font-black text-white">{world.name}</h2>
                  {world.is_locked ? (
                    <div className="p-2 rounded-lg bg-[--bg-base] border border-[--border-default]">
                      <Lock className="w-4 h-4 text-[--text-muted]" />
                    </div>
                  ) : null}
                </div>
                
                <p className="text-sm font-bold text-white/70 mb-3 uppercase tracking-wider" style={{ color: world.color_primary }}>
                  {world.tagline}
                </p>
                <p className="text-sm text-[--text-secondary] mb-6 flex-1">
                  {world.description}
                </p>

                {world.is_locked ? (
                  <Button variant="outline" className="w-full pointer-events-none opacity-50" leftIcon={<Lock className="w-4 h-4" />}>
                    Mundo Bloqueado
                  </Button>
                ) : (
                  <Button variant="primary" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />} style={{ 
                    background: `linear-gradient(135deg, ${world.color_primary}, ${world.color_secondary})`,
                    border: 'none'
                  }}>
                    Entrar al Mundo
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
