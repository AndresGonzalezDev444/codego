import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Flame, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { Card } from '@/components/ui/Card';
import { Byte } from '@/components/byte/Byte';
import { cn } from '@/lib/utils';
import type { Profile } from '@/types';

export default function LeaderboardPage() {
  const { profile } = useAuthStore();
  const [leaders, setLeaders] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('xp', { ascending: false })
        .limit(50);
        
      if (!error && data) {
        setLeaders(data);
      }
      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center h-[60vh]">
        <Byte mood="thinking" size="lg" animate />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-24">
      <div className="px-6 py-8 text-center border-b border-[--border-default] mb-8 relative overflow-hidden rounded-2xl"
        style={{ background: 'linear-gradient(135deg, #f59e0b10, #d9770620)' }}
      >
        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
        <h1 className="text-3xl font-black text-white mb-2">Liga de Programadores</h1>
        <p className="text-[--text-secondary]">Compite por XP y alcanza la cima del ranking.</p>
      </div>

      <div className="px-4 space-y-3">
        {leaders.map((leader, index) => {
          const isCurrentUser = profile?.id === leader.id;
          
          return (
            <motion.div
              key={leader.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                padding="sm" 
                variant={isCurrentUser ? 'elevated' : 'glass'}
                className={cn(
                  "flex items-center gap-4 transition-transform hover:scale-[1.01] relative overflow-hidden",
                  isCurrentUser && !leader.is_plus && "border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]",
                  leader.is_plus && "border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.15)] bg-gradient-to-r from-yellow-500/5 to-transparent"
                )}
              >
                {leader.is_plus && (
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-yellow-500/20 to-transparent flex items-start justify-end p-2 pointer-events-none">
                    <Sparkles className="w-4 h-4 text-yellow-400 opacity-75" />
                  </div>
                )}
                <div className="w-12 h-12 flex items-center justify-center font-black text-xl shrink-0">
                  {index === 0 ? <Medal className="w-8 h-8 text-yellow-400 drop-shadow-md" /> :
                   index === 1 ? <Medal className="w-8 h-8 text-gray-400 drop-shadow-md" /> :
                   index === 2 ? <Medal className="w-8 h-8 text-amber-700 drop-shadow-md" /> :
                   <span className="text-[--text-muted]">#{index + 1}</span>}
                </div>

                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center font-bold shrink-0 border overflow-hidden",
                  leader.is_plus ? "bg-yellow-900/30 text-yellow-400 border-yellow-500" : "bg-cyan-900 text-cyan-400 border-cyan-700"
                )}>
                  {leader.avatar_url ? (
                    <img src={leader.avatar_url} alt={leader.username} className="w-full h-full object-cover" />
                  ) : (
                    leader.username.substring(0, 2).toUpperCase()
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <p className="font-bold text-white truncate">{leader.display_name}</p>
                    {isCurrentUser && (
                      <span className="text-[10px] font-black uppercase text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-full">
                        Tú
                      </span>
                    )}
                    {leader.is_plus && (
                      <span className="text-[10px] font-black uppercase text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full border border-yellow-500/20 flex items-center gap-1">
                        Plus
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[--text-muted] truncate">@{leader.username}</p>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-black text-white text-lg">{leader.xp.toLocaleString()} XP</p>
                  <p className="text-xs font-medium text-violet-400 flex items-center justify-end gap-1">
                    <Flame className="w-3 h-3" /> Nivel {leader.level}
                  </p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
