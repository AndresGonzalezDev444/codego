import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Globe } from 'lucide-react';
import { Byte } from '@/components/byte/Byte';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/app/home');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/app/home` },
    });
  };

  return (
    <div className="min-h-screen bg-[--bg-base] flex">
      {/* Panel izquierdo — decorativo */}
      <div
        className="hidden lg:flex flex-col items-center justify-center flex-1 p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0e1525, #1a1040)' }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ background: 'radial-gradient(ellipse at center, #7c3aed, transparent 70%)' }}
        />
        <Byte mood="happy" size="xl" animate className="mb-8" />
        <h2 className="text-3xl font-black text-white text-center mb-3">
          ¡Bienvenido de vuelta!
        </h2>
        <p className="text-[--text-secondary] text-center max-w-xs">
          Tu aventura te espera. Byte estaba esperándote.
        </p>

        {/* Estadísticas ficticias */}
        <div className="flex gap-8 mt-10">
          {[
            { value: '10K+', label: 'Estudiantes' },
            { value: '500+', label: 'Lecciones' },
            { value: '9', label: 'Tipos de ejercicios' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-black gradient-text">{s.value}</div>
              <div className="text-xs text-[--text-muted]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 mb-8">
            <span className="text-cyan-400 font-bold text-xl">&lt;/&gt;</span>
            <span className="text-white font-black text-2xl">
              Code<span className="text-violet-400">Go</span><span className="text-cyan-400">!</span>
            </span>
          </Link>

          <h1 className="text-2xl font-black text-white mb-1">Iniciar sesión</h1>
          <p className="text-[--text-secondary] text-sm mb-6">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-cyan-400 hover:text-cyan-300">Regístrate gratis</Link>
          </p>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400 mb-4">
              {error}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[--text-secondary] mb-1.5">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-muted]" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className={cn(
                    'w-full pl-10 pr-4 py-3 rounded-xl text-sm',
                    'bg-[--bg-elevated] border border-[--border-default]',
                    'text-white placeholder:text-[--text-muted]',
                    'focus:outline-none focus:border-cyan-500/60',
                    'transition-colors'
                  )}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-[--text-secondary]">
                  Contraseña
                </label>
                <Link to="/forgot-password" className="text-xs text-cyan-400 hover:text-cyan-300">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-muted]" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña"
                  className={cn(
                    'w-full pl-10 pr-4 py-3 rounded-xl text-sm',
                    'bg-[--bg-elevated] border border-[--border-default]',
                    'text-white placeholder:text-[--text-muted]',
                    'focus:outline-none focus:border-cyan-500/60',
                    'transition-colors'
                  )}
                />
              </div>
            </div>

            <Button type="submit" variant="primary" fullWidth size="lg" isLoading={loading}
              leftIcon={<LogIn className="w-4 h-4" />}>
              Iniciar sesión
            </Button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center my-5">
            <div className="flex-1 border-t border-[--border-default]" />
            <span className="mx-3 text-xs text-[--text-muted]">O continúa con</span>
            <div className="flex-1 border-t border-[--border-default]" />
          </div>

          {/* Google */}
          <Button
            variant="secondary"
            fullWidth
            size="lg"
            onClick={handleGoogle}
            leftIcon={<Globe className="w-4 h-4" />}
          >
            Google
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
