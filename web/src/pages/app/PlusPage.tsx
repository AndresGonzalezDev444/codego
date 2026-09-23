import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Infinity, CheckCircle2, Star, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Byte } from '@/components/byte/Byte';

export default function PlusPage() {
  const navigate = useNavigate();
  const { profile, upgradeToPlus } = useAuthStore();
  const { addToast, setByte } = useUIStore();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!profile) return;
    setLoading(true);
    setByte('thinking');

    try {
      // Simulamos un proceso de pago
      await new Promise(resolve => setTimeout(resolve, 2000));

      const { error } = await supabase
        .from('profiles')
        .update({ is_plus: true, hearts: 5 })
        .eq('id', profile.id);

      if (error) throw error;

      upgradeToPlus();
      setByte('celebrating');
      addToast({
        title: '¡Bienvenido a CodeGo! Plus!',
        message: 'Ahora tienes acceso a vidas infinitas y beneficios exclusivos.',
        type: 'success',
        duration: 5000
      });
      
    } catch (error) {
      console.error(error);
      setByte('sad');
      addToast({
        title: 'Error al procesar el pago',
        message: 'No pudimos procesar tu suscripción. Intenta de nuevo.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const isAlreadyPlus = profile?.is_plus;

  return (
    <div className="max-w-4xl mx-auto pb-24 px-4">
      {/* HEADER HERO */}
      <div className="relative overflow-hidden rounded-3xl mt-8 mb-12 p-1 border border-yellow-500/30">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-orange-500/10 to-red-500/20 opacity-50" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
        
        <div className="relative bg-[#0a0e1a] rounded-[1.4rem] px-6 py-12 md:py-20 flex flex-col items-center text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50" />
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative mb-6"
          >
            <div className="absolute inset-0 bg-yellow-500 blur-3xl opacity-20 rounded-full" />
            <Byte mood={isAlreadyPlus ? 'celebrating' : 'excited'} size="xl" animate />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight flex items-center gap-3">
            Code<span className="text-violet-400">Go</span>
            <span className="text-yellow-400 flex items-center">
              Plus <Sparkles className="w-8 h-8 ml-2" />
            </span>
          </h1>
          
          <p className="text-lg text-[--text-secondary] max-w-xl mx-auto">
            Desata tu verdadero potencial. Sin límites, sin interrupciones. La experiencia definitiva para dominar el código.
          </p>
        </div>
      </div>

      {isAlreadyPlus ? (
        <Card variant="elevated" padding="xl" className="text-center border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.15)]">
          <Star className="w-16 h-16 text-yellow-400 mx-auto mb-6 drop-shadow-md" />
          <h2 className="text-3xl font-black text-white mb-4">¡Ya eres miembro Plus!</h2>
          <p className="text-[--text-secondary] mb-8 text-lg">
            Disfruta de tus corazones infinitos y tu insignia dorada en el Leaderboard.
          </p>
          <Button size="xl" onClick={() => navigate('/app/home')}>
            Volver a aprender
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* FEATURES */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white mb-8">¿Por qué CodeGo! Plus?</h2>
            
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                <Infinity className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Corazones Infinitos</h3>
                <p className="text-[--text-secondary] text-sm">Equivócate todo lo que quieras. Aprende sin la presión de perder vidas ni tener que esperar.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Marco Dorado VIP</h3>
                <p className="text-[--text-secondary] text-sm">Destaca en la Liga de Programadores con una insignia y colores exclusivos para miembros Plus.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Apoya el Proyecto</h3>
                <p className="text-[--text-secondary] text-sm">CodeGo! es gratis. Tu suscripción nos ayuda a crear más mundos, lecciones y funciones increíbles.</p>
              </div>
            </div>
          </div>

          {/* PRICING CARD */}
          <Card variant="glass" padding="xl" className="border-yellow-500/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative text-center">
              <span className="inline-block px-3 py-1 bg-yellow-500/20 text-yellow-400 font-bold text-xs uppercase tracking-widest rounded-full mb-6 border border-yellow-500/30">
                Oferta de Lanzamiento
              </span>
              
              <div className="flex justify-center items-start gap-1 mb-2">
                <span className="text-2xl font-bold text-[--text-muted] mt-1">$</span>
                <span className="text-6xl font-black text-white">4.99</span>
              </div>
              <p className="text-[--text-secondary] mb-8">facturado mensualmente</p>
              
              <div className="space-y-3 mb-8 text-sm font-medium text-left">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-yellow-400 shrink-0" />
                  <span className="text-white">Corazones Ilimitados</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-yellow-400 shrink-0" />
                  <span className="text-white">Status VIP en Leaderboard</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-yellow-400 shrink-0" />
                  <span className="text-white">Cancela cuando quieras</span>
                </div>
              </div>

              <Button 
                size="xl" 
                fullWidth 
                onClick={handleSubscribe} 
                isLoading={loading}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black border-none shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:shadow-[0_0_30px_rgba(234,179,8,0.6)] transition-all"
              >
                Suscribirme ahora
              </Button>
              <p className="text-xs text-[--text-muted] mt-4">
                Transacción segura. (Simulación para esta demo).
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
