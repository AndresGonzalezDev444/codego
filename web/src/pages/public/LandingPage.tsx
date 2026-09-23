import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, ChevronRight, Terminal, Globe, Code2 } from 'lucide-react';
import { Byte } from '@/components/byte/Byte';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[--bg-base] overflow-x-hidden">
      {/* NAV */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-1.5">
          <span className="text-cyan-400 font-bold text-xl">&lt;/&gt;</span>
          <span className="text-white font-black text-2xl tracking-tight">
            Code<span className="text-violet-400">Go</span><span className="text-cyan-400">!</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-[--text-secondary]">
          <a href="#features" className="hover:text-white transition-colors">Características</a>
          <a href="#worlds" className="hover:text-white transition-colors">Mundos</a>
          <a href="#how" className="hover:text-white transition-colors">¿Cómo funciona?</a>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-[--text-secondary] hover:text-white transition-colors hidden sm:block">
            Iniciar sesión
          </Link>
          <Link to="/register">
            <Button variant="primary" size="sm">Empezar gratis</Button>
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative max-w-6xl mx-auto px-6 pt-16 pb-24 lg:pt-24 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #7c3aed 0%, transparent 70%)' }}
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-sm font-medium text-cyan-300"
          style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}
        >
          <Zap className="w-4 h-4" />
          ¡El código también es una aventura!
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl lg:text-7xl font-black text-white mb-6 leading-tight tracking-tight"
        >
          Aprende a programar<br />
          <span className="gradient-text">jugando</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-[--text-secondary] mb-8 max-w-xl mx-auto"
        >
          CodeGo! es una plataforma gamificada donde cada reto te acerca a tu mejor versión
          como desarrollador. Explora mundos, completa misiones y haz crecer tu talento.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/register">
            <Button variant="primary" size="xl" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Empieza tu aventura
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="xl">
              Explorar CodeGo!
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
          className="mt-16 flex justify-center"
        >
          <Byte mood="welcome" size="xl" animate />
        </motion.div>
      </section>

      {/* FEATURES */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl lg:text-4xl font-black text-white text-center mb-4">
          Todo lo que necesitas para aprender
        </h2>
        <p className="text-[--text-secondary] text-center mb-12">
          Una experiencia educativa única diseñada como un videojuego
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-5 rounded-2xl"
              style={{ background: '#0e1525', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-xl"
                style={{ background: f.bg }}
              >
                {f.icon}
              </div>
              <h3 className="font-bold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-[--text-secondary]">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-black text-white text-center mb-12">¿Cómo funciona?</h2>
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          {STEPS.map((step, i) => (
            <div key={i} className="flex lg:flex-col items-center gap-4 flex-1">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 font-black text-white"
                style={{ background: `linear-gradient(135deg, ${step.color1}, ${step.color2})` }}
              >
                {i + 1}
              </div>
              <div className="lg:text-center">
                <p className="font-bold text-white">{step.title}</p>
                <p className="text-sm text-[--text-secondary] mt-1">{step.desc}</p>
              </div>
              {i < STEPS.length - 1 && (
                <ChevronRight className="shrink-0 w-5 h-5 text-[--text-muted] hidden lg:block" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT / CREATOR */}
      <section id="about" className="max-w-6xl mx-auto px-6 py-20">
        <div className="bg-[#0a0e1a] border border-cyan-500/20 rounded-3xl p-8 lg:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-bold">
                <Code2 className="w-4 h-4" /> Acerca del Creador
              </div>
              <h2 className="text-3xl lg:text-4xl font-black text-white">
                Creado por <span className="text-cyan-400">AndresGonzalezDev</span>
              </h2>
              <p className="text-[--text-secondary] text-lg leading-relaxed">
                CodeGo! es una plataforma construida con las tecnologías web más modernas: React, TypeScript, Tailwind CSS, Zustand, y Supabase (PostgreSQL). Todo ejecutando Python real directamente en el navegador con Pyodide (Web Workers).
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <a href="https://github.com/AndresGonzalezDev444/codego" target="_blank" rel="noreferrer">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto" leftIcon={<Terminal className="w-5 h-5" />}>
                    Ver en GitHub
                  </Button>
                </a>
                <a href="https://andresgonzalezdev.me" target="_blank" rel="noreferrer">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto" leftIcon={<Globe className="w-5 h-5" />}>
                    Mi Portafolio Web
                  </Button>
                </a>
              </div>
            </div>
            
            <div className="w-48 h-48 lg:w-64 lg:h-64 rounded-full border-4 border-cyan-500/30 overflow-hidden shrink-0 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
              {/* Puedes cambiar esta imagen por la tuya real */}
              <img src="https://github.com/AndresGonzalezDev444.png" alt="Andres Gonzalez" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div
          className="relative p-12 rounded-3xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0e1525, #1a1040)', border: '1px solid rgba(124,58,237,0.3)' }}
        >
          <div className="absolute inset-0 opacity-20 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at top, #7c3aed, transparent 70%)' }}
          />
          <Byte mood="excited" size="lg" className="mx-auto mb-6" animate />
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">¿Listo para empezar?</h2>
          <p className="text-[--text-secondary] mb-8">Únete a miles de desarrolladores que ya aprenden con CodeGo!</p>
          <Link to="/register">
            <Button variant="primary" size="xl">Comenzar gratis ahora</Button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[--border-default] py-8 px-6 text-center text-sm text-[--text-muted]">
        <div className="flex items-center justify-center gap-1.5 mb-3">
          <span className="text-cyan-400 font-bold">&lt;/&gt;</span>
          <span className="text-white font-black">
            Code<span className="text-violet-400">Go</span><span className="text-cyan-400">!</span>
          </span>
        </div>
        <p>Aprende. Crea. Evoluciona.</p>
        <p className="mt-2">© 2026 CodeGo! · Plataforma educativa gamificada</p>
      </footer>
    </div>
  );
}

const FEATURES = [
  { icon: '🗺️', title: 'Code World', desc: 'Explora mundos temáticos de programación con misiones y desafíos.', bg: 'rgba(0,212,255,0.15)' },
  { icon: '🤖', title: 'Byte', desc: 'Tu compañero de aventuras que te guía y celebra cada logro.', bg: 'rgba(124,58,237,0.15)' },
  { icon: '💻', title: 'Code Lab', desc: 'Ejecuta código real directamente en el navegador con Python y JS.', bg: 'rgba(34,197,94,0.15)' },
  { icon: '🏆', title: 'Gamificación', desc: 'XP, rachas, logros y ranking para mantenerte motivado.', bg: 'rgba(249,115,22,0.15)' },
  { icon: '🧩', title: '9 tipos de ejercicios', desc: 'Opción múltiple, código, drag & drop, depuración y más.', bg: 'rgba(59,130,246,0.15)' },
  { icon: '🔥', title: 'Racha diaria', desc: 'Mantén tu constancia con sistema de rachas y recompensas.', bg: 'rgba(239,68,68,0.15)' },
  { icon: '📊', title: 'Progreso real', desc: 'Estadísticas detalladas de tu evolución como programador.', bg: 'rgba(250,204,21,0.15)' },
  { icon: '🔐', title: '100% seguro', desc: 'Código ejecutado en sandbox seguro, auth robusta.', bg: 'rgba(16,185,129,0.15)' },
];

const STEPS = [
  { title: 'Regístrate', desc: 'Crea tu cuenta gratis en segundos', color1: '#00d4ff', color2: '#0070cc' },
  { title: 'Conoce a Byte', desc: 'Tu mascota te da la bienvenida', color1: '#7c3aed', color2: '#4f46e5' },
  { title: 'Explora mundos', desc: 'Entra a Pythonia y comienza', color1: '#22c55e', color2: '#16a34a' },
  { title: 'Gana XP', desc: 'Completa misiones y sube de nivel', color1: '#f97316', color2: '#ea580c' },
];
