import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useProgressStore } from '@/stores/progressStore';
import { Card } from '@/components/ui/Card';
import { Byte } from '@/components/byte/Byte';
import { cn } from '@/lib/utils';
import type { Achievement } from '@/types';

export default function AchievementsPage() {
  const { achievements: userAchievements } = useProgressStore();
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('xp_reward', { ascending: true });
        
      if (!error && data) {
        setAllAchievements(data);
      }
      setLoading(false);
    };

    fetchAchievements();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center h-[60vh]">
        <Byte mood="thinking" size="lg" animate />
      </div>
    );
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-orange-500 border-orange-500 bg-orange-500/10 shadow-[0_0_15px_rgba(249,115,22,0.3)]';
      case 'epic': return 'text-purple-500 border-purple-500 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.3)]';
      case 'rare': return 'text-cyan-500 border-cyan-500 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.3)]';
      default: return 'text-gray-300 border-gray-600 bg-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="px-6 py-8 text-center border-b border-[--border-default] mb-8 relative overflow-hidden rounded-2xl"
        style={{ background: 'linear-gradient(135deg, #4c1d9510, #7c3aed20)' }}
      >
        <Shield className="w-16 h-16 text-violet-500 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]" />
        <h1 className="text-3xl font-black text-white mb-2">Medallas y Logros</h1>
        <p className="text-[--text-secondary]">Completa retos para desbloquear recompensas exclusivas.</p>
        
        <div className="mt-6 flex justify-center gap-4">
          <div className="bg-[--bg-surface] px-4 py-2 rounded-xl border border-[--border-default]">
            <p className="text-xs text-[--text-muted] uppercase font-bold tracking-widest mb-1">Desbloqueados</p>
            <p className="text-xl font-black text-white">{userAchievements.length} / {allAchievements.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
        {allAchievements.map((achievement, index) => {
          const isUnlocked = userAchievements.some(ua => ua.id === achievement.id);
          const rarityClasses = isUnlocked ? getRarityColor(achievement.rarity) : 'text-[--text-muted] border-[--border-default] bg-[--bg-surface] opacity-60 grayscale';
          
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                padding="md" 
                variant="elevated"
                className="flex items-start gap-4 h-full"
              >
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 border-2", rarityClasses)}>
                  {isUnlocked ? achievement.icon : <Lock className="w-6 h-6" />}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className={cn("font-bold", isUnlocked ? "text-white" : "text-[--text-secondary]")}>
                      {achievement.name}
                    </h3>
                    <span className={cn(
                      "text-[10px] font-black uppercase px-2 py-0.5 rounded-full border",
                      isUnlocked ? "border-current" : "border-[--border-default] text-[--text-muted]"
                    )} style={{ color: isUnlocked ? 'inherit' : undefined }}>
                      {achievement.rarity}
                    </span>
                  </div>
                  
                  <p className="text-sm text-[--text-muted] mb-3 leading-relaxed">
                    {achievement.description}
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-md">
                      +{achievement.xp_reward} XP
                    </span>
                    <span className="text-xs font-bold text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded-md">
                      +{achievement.bytes_reward} Bytes
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
