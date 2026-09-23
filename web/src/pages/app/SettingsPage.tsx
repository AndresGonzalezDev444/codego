import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, User, Bell, LogOut } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { supabase } from '@/lib/supabase';

const AVATAR_SEEDS = ['Felix', 'Oliver', 'Jasper', 'Buster', 'Max', 'Sam', 'Toby', 'Milo', 'Leo', 'Simba'];
const getAvatarUrl = (seed: string) => `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${seed}&backgroundColor=0e1525`;

export default function SettingsPage() {
  const { profile, signOut } = useAuthStore();
  
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [selectedAvatar, setSelectedAvatar] = useState(
    profile?.avatar_url || getAvatarUrl(AVATAR_SEEDS[0])
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    if (!profile) return;
    setLoading(true);
    setSuccess(false);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: displayName,
          avatar_url: selectedAvatar,
        })
        .eq('id', profile.id);

      if (error) throw error;
      setSuccess(true);
      
      // Reload profile data in store
      await useAuthStore.getState().loadProfile(profile.id);
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-xl bg-gray-500/10 border border-gray-500/20">
          <Settings className="w-6 h-6 text-gray-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Configuración</h1>
          <p className="text-[--text-secondary] text-sm">Personaliza tu perfil y experiencia en CodeGo!</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Sección de Perfil */}
        <Card variant="elevated" padding="lg">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-cyan-400" /> Datos de Perfil
          </h2>

          <div className="space-y-8">
            {/* Avatares */}
            <div>
              <label className="block text-sm font-semibold text-[--text-secondary] mb-4">
                Elige tu estilo de Byte
              </label>
              <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                {AVATAR_SEEDS.map((seed) => {
                  const url = getAvatarUrl(seed);
                  const isSelected = selectedAvatar === url;
                  
                  return (
                    <motion.button
                      key={seed}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedAvatar(url)}
                      className={`relative shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                        isSelected 
                          ? 'border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] bg-cyan-900/30' 
                          : 'border-[--border-default] bg-[--bg-surface] hover:border-gray-500'
                      }`}
                    >
                      <img src={url} alt={`Avatar ${seed}`} className="w-full h-full object-cover p-2" />
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-3 h-3 bg-cyan-400 rounded-full border-2 border-[#0e1525]" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Nombre de usuario */}
            <div>
              <label className="block text-sm font-semibold text-[--text-secondary] mb-2">
                Nombre a mostrar
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-[--bg-surface] border border-[--border-default] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                placeholder="Ej. Desarrollador Maestro"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-[--text-secondary] mb-2">
                Nombre de Usuario (Único)
              </label>
              <input
                type="text"
                value={profile?.username || ''}
                disabled
                className="w-full bg-[--bg-base] border border-[--border-default] rounded-xl px-4 py-3 text-[--text-muted] cursor-not-allowed opacity-70"
              />
              <p className="text-xs text-[--text-muted] mt-1">El nombre de usuario no se puede cambiar.</p>
            </div>

            <div className="pt-4 border-t border-[--border-default] flex items-center justify-between">
              <div>
                {success && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className="text-green-400 text-sm font-bold flex items-center gap-1"
                  >
                    ¡Cambios guardados con éxito!
                  </motion.span>
                )}
              </div>
              <Button 
                variant="primary" 
                onClick={handleSave}
                loading={loading}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Guardar Cambios
              </Button>
            </div>
          </div>
        </Card>

        {/* Sección de Preferencias (UI placeholders por ahora) */}
        <Card variant="elevated" padding="lg">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5 text-violet-400" /> Preferencias
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-[--bg-surface] border border-[--border-default]">
              <div>
                <p className="font-bold text-white">Efectos de sonido</p>
                <p className="text-xs text-[--text-muted]">Reproducir sonidos al completar ejercicios</p>
              </div>
              <div className="w-12 h-6 bg-cyan-500 rounded-full relative cursor-pointer opacity-50 pointer-events-none">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm" />
              </div>
            </div>
            <p className="text-xs text-[--text-muted] italic">* Las preferencias avanzadas estarán disponibles próximamente.</p>
          </div>
        </Card>

        {/* Zona Peligrosa */}
        <Card variant="elevated" padding="lg" className="border-red-500/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-red-400">Cerrar Sesión</h2>
              <p className="text-xs text-[--text-muted]">Finaliza tu sesión actual de forma segura.</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => signOut()}
              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
              leftIcon={<LogOut className="w-4 h-4" />}
            >
              Cerrar Sesión
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
