import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, BookOpen, ArrowRight, Zap, Gem, Flame, Star, AlertCircle } from 'lucide-react';
import { Byte } from '@/components/byte/Byte';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/Progress';
import { useProgressStore, levelToXP } from '@/stores/progressStore';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { worldService } from '@/services/worldService';
import type { World } from '@/types';
import { cn } from '@/lib/utils';

// ============================================
// DASHBOARD — Pantalla principal del estudiante
// ============================================

export default function HomePage() {
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const { xp, level, bytes, streak, achievements } = useProgressStore();
  const { byteMood, byteMessage } = useUIStore();
  const [worlds, setWorlds] = useState<World[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    worldService.getWorlds()
      .then(setWorlds)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const currentLevelXP = levelToXP(level);
  const nextLevelXP = levelToXP(level + 1);
  const xpInLevel = xp - currentLevelXP;
  const xpForNextLevel = nextLevelXP - currentLevelXP;

  const displayName = profile?.display_name ?? profile?.username ?? 'Explorador';

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 lg:px-8 space-y-6">

      {/* Hero section — Tu aventura en el mundo del código */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden min-h-52"
        style={{
          background: 'linear-gradient(135deg, #0e1525 0%, #141830 50%, #1a1040 100%)',
          border: '1px solid rgba(124, 58, 237, 0.2)',
        }}
      >
        {/* Fondo decorativo */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }}
          />
          <div
            className="absolute -bottom-10 left-20 w-60 h-60 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #00d4ff 0%, transparent 70%)' }}
          />
        </div>

        <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-6 p-6 lg:p-8">
          {/* Texto */}
          <div className="flex-1 z-10">
            <p className="text-[--text-secondary] text-sm mb-2">¡Hola, {displayName}! 👋</p>
            <h1 className="text-2xl lg:text-3xl font-black text-white leading-tight mb-3">
              Tu aventura<br />
              <span className="gradient-text">en el mundo del código</span><br />
              comienza aquí
            </h1>
            <p className="text-[--text-secondary] text-sm mb-5">
              Completa lecciones, gana experiencia<br className="hidden lg:block" />
              y desbloquea nuevos mundos.
            </p>
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => navigate('/app/map')}
            >
              Explorar el mapa
            </Button>
          </div>

          {/* Ilustración — isla flotante estilizada */}
          <div className="hidden lg:flex items-center justify-center w-64 h-44 relative">
            {/* Isla flotante CSS */}
            <div
              className="absolute w-48 h-28 rounded-full opacity-80"
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #2563eb 100%)',
                bottom: '10px',
                filter: 'blur(1px)',
              }}
            />
            <div
              className="absolute w-40 h-20 rounded-full"
              style={{
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                bottom: '18px',
              }}
            />
            {/* Torres */}
            {[
              { left: '25%', height: 56, color: '#f97316' },
              { left: '45%', height: 72, color: '#00d4ff' },
              { left: '65%', height: 48, color: '#7c3aed' },
            ].map((t, i) => (
              <div
                key={i}
                className="absolute w-8 rounded-t-xl"
                style={{
                  left: t.left,
                  bottom: '28px',
                  height: t.height,
                  background: `linear-gradient(180deg, ${t.color}80, ${t.color}40)`,
                  border: `1px solid ${t.color}60`,
                }}
              />
            ))}
            {/* Símbolo CodeGo en el centro */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-3xl font-black text-white/30">
              &lt;/&gt;
            </div>
            {/* Partículas flotantes */}
            {[
              { top: '15%', left: '15%', color: '#facc15', size: 8, delay: 0 },
              { top: '20%', right: '10%', color: '#00d4ff', size: 6, delay: 0.5 },
              { top: '60%', left: '5%', color: '#7c3aed', size: 5, delay: 1 },
            ].map((p, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{ width: p.size, height: p.size, background: p.color, top: p.top, left: p.left }}
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: p.delay }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            icon: <Flame className="w-5 h-5" />,
            value: streak.current_streak,
            label: 'días racha',
            suffix: '',
            color: 'text-orange-400',
            bg: 'bg-orange-500/10',
            border: 'border-orange-500/20',
          },
          {
            icon: <Zap className="w-5 h-5" />,
            value: xp,
            label: 'XP total',
            suffix: '',
            color: 'text-cyan-400',
            bg: 'bg-cyan-500/10',
            border: 'border-cyan-500/20',
          },
          {
            icon: <Gem className="w-5 h-5" />,
            value: bytes,
            label: 'Bytes',
            suffix: '',
            color: 'text-violet-400',
            bg: 'bg-violet-500/10',
            border: 'border-violet-500/20',
          },
          {
            icon: <Star className="w-5 h-5" />,
            value: achievements.length,
            label: 'logros',
            suffix: '',
            color: 'text-yellow-400',
            bg: 'bg-yellow-500/10',
            border: 'border-yellow-500/20',
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card variant="elevated" padding="md" className={cn('border', stat.border)}>
              <div className={cn('flex items-center gap-2 mb-2', stat.color)}>
                <div className={cn('p-1.5 rounded-lg', stat.bg)}>
                  {stat.icon}
                </div>
              </div>
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-xs text-[--text-muted]">{stat.label}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Nivel y XP */}
        <Card variant="elevated" padding="md" className="lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">Nivel {level}</h2>
              <p className="text-xs text-[--text-muted]">
                {xpInLevel} / {xpForNextLevel} XP para nivel {level + 1}
              </p>
            </div>
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-lg font-black text-white"
              style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)' }}
            >
              {level}
            </div>
          </div>
          <ProgressBar
            value={xpInLevel}
            max={xpForNextLevel}
            variant="gradient"
            size="md"
          />
        </Card>

        {/* Byte companion */}
        <Card variant="elevated" padding="md" className="lg:col-span-1 flex flex-col items-center justify-center gap-3">
          <Byte mood={byteMood} size="lg" message={byteMessage} showMessage={!!byteMessage} animate />
          <div className="text-center">
            <p className="text-sm font-semibold text-white">Byte</p>
            <p className="text-xs text-[--text-secondary]">Tu guía, tu aliado, tu compañero de código.</p>
          </div>
        </Card>

        {/* Continuar aprendizaje */}
        <Card variant="elevated" padding="md" className="lg:col-span-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-xl bg-cyan-500/15">
                <BookOpen className="w-4 h-4 text-cyan-400" />
              </div>
              <h2 className="text-sm font-bold text-white">Continuar aprendizaje</h2>
            </div>

            {/* Última lección */}
            <div className="p-3 rounded-xl bg-[--bg-hover] mb-3">
              <div className="flex items-center gap-2 text-sm">
                <span>🐍</span>
                <div>
                  <p className="font-medium text-white text-xs">Pythonia</p>
                  <p className="text-[--text-muted] text-xs">Variables y tipos de datos</p>
                </div>
              </div>
              <ProgressBar value={35} max={100} size="xs" variant="cyan" className="mt-2" />
            </div>
          </div>
          <Button
            variant="secondary"
            fullWidth
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => navigate('/app/map')}
          >
            Ver mis cursos
          </Button>
        </Card>
      </div>

      {/* Mundos disponibles */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Mundos</h2>
          </div>
          <button
            onClick={() => navigate('/app/map')}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            Ver mapa <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {loading ? (
            <p className="text-[--text-secondary] text-sm">Cargando mundos...</p>
          ) : worlds.map((world, i) => (
            <motion.div
              key={world.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.08 }}
            >
              <Card
                variant="elevated"
                padding="md"
                hover={!world.is_locked}
                onClick={!world.is_locked ? () => navigate(`/app/worlds?id=${world.id}`) : undefined}
                className={cn('relative overflow-hidden', world.is_locked && 'opacity-60')}
              >
                {/* Color de fondo del mundo */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{ background: `linear-gradient(135deg, ${world.color_primary}, ${world.color_secondary})` }}
                />
                <div className="relative">
                  <div className="text-3xl mb-2">{world.language?.icon_url ?? '🌍'}</div>
                  <p className="text-sm font-bold text-white truncate">{world.name}</p>
                  {world.is_locked ? (
                    <span className="text-xs text-[--text-muted] flex items-center gap-1 mt-1">
                      🔒 Bloqueado
                    </span>
                  ) : (
                    <div className="mt-2">
                      <ProgressBar value={0} size="xs" variant="gradient" />
                      <p className="text-xs text-[--text-muted] mt-1">0%</p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
