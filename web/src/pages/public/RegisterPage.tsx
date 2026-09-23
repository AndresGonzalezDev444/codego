import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, AtSign, UserPlus, Globe } from 'lucide-react';
import { Byte } from '@/components/byte/Byte';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { useUIStore } from '@/stores/uiStore';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { addToast } = useUIStore();
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [byteMood, setByteMood] = useState<'idle' | 'thinking' | 'happy' | 'sad' | 'excited'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (byteMood !== 'thinking') setByteMood('thinking');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setByteMood('thinking');

    try {
      // 1. Registrar usuario en Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            user_name: formData.username,
          }
        }
      });

      if (error) throw error;

      setByteMood('excited');
      addToast({
        title: '¡Cuenta creada!',
        message: 'Bienvenido a CodeGo!. Ya puedes iniciar sesión.',
        type: 'success'
      });
      
      // Esperar un poco para mostrar la animación de Byte
      setTimeout(() => navigate('/login'), 2000);

    } catch (err: any) {
      console.error(err);
      setByteMood('sad');
      addToast({
        title: 'Error al registrar',
        message: err.message || 'Verifica tus datos e intenta de nuevo.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/app/home`
        }
      });
      if (error) throw error;
    } catch (err: any) {
      addToast({
        title: 'Error de Google',
        message: err.message,
        type: 'error'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[--bg-base] flex flex-col md:flex-row">
      {/* Lado izquierdo - Decorativo */}
      <div className="hidden md:flex flex-1 relative items-center justify-center overflow-hidden border-r border-[--border-default]"
        style={{ background: 'linear-gradient(135deg, #0e1525, #1a1040)' }}
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle at center, #7c3aed, transparent 70%)' }}
        />
        <div className="relative z-10 text-center max-w-md px-8">
          <Byte mood="excited" size="xl" className="mx-auto mb-8" animate />
          <h2 className="text-3xl font-black text-white mb-4">
            ¡Comienza tu aventura!
          </h2>
          <p className="text-[--text-secondary]">
            Crea tu cuenta gratis para explorar mundos, escribir código y subir de nivel.
          </p>
        </div>
      </div>

      {/* Lado derecho - Formulario */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-sm mx-auto">
          
          <div className="md:hidden flex justify-center mb-8">
            <Byte mood={byteMood} size="lg" animate />
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Crear cuenta</h1>
            <p className="text-[--text-secondary]">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                Inicia sesión aquí
              </Link>
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[--text-secondary]">Nombre completo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-[--text-muted]" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-[--bg-surface] border border-[--border-default] rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-[--text-muted] focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  placeholder="Ada Lovelace"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[--text-secondary]">Nombre de usuario</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AtSign className="w-5 h-5 text-[--text-muted]" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full bg-[--bg-surface] border border-[--border-default] rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-[--text-muted] focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  placeholder="adalovelace"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[--text-secondary]">Correo electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-[--text-muted]" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-[--bg-surface] border border-[--border-default] rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-[--text-muted] focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  placeholder="tu@correo.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[--text-secondary]">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-[--text-muted]" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full bg-[--bg-surface] border border-[--border-default] rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-[--text-muted] focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              isLoading={loading}
              leftIcon={<UserPlus className="w-5 h-5" />}
              className="mt-6"
            >
              Crear cuenta gratis
            </Button>
          </form>

          {import.meta.env.VITE_ENABLE_GOOGLE_AUTH === 'true' && (
            <>
              <div className="mt-6 flex items-center justify-between">
                <hr className="w-full border-[--border-default]" />
                <span className="p-2 text-xs text-[--text-muted] bg-[--bg-base]">O</span>
                <hr className="w-full border-[--border-default]" />
              </div>

              <div className="mt-6">
                <Button
                  variant="outline"
                  fullWidth
                  size="lg"
                  onClick={handleGoogle}
                  leftIcon={<Globe className="w-4 h-4" />}
                >
                  Continuar con Google
                </Button>
              </div>
            </>
          )}

          <p className="mt-8 text-center text-xs text-[--text-muted]">
            Al registrarte, aceptas nuestros{' '}
            <a href="#" className="hover:text-white transition-colors">Términos de servicio</a> y{' '}
            <a href="#" className="hover:text-white transition-colors">Política de privacidad</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
