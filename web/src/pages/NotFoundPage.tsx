import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Byte } from '@/components/byte/Byte';
import { Button } from '@/components/ui/Button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[--bg-base] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <Byte mood="confused" size="xl" className="mb-6 mx-auto" animate />

        <div className="mb-2">
          <span className="text-8xl font-black gradient-text">404</span>
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">¡Esta misión no existe!</h1>
        <p className="text-[--text-secondary] mb-8">
          Parece que te has aventurado demasiado lejos. Esta página no está en el mapa de CodeGo!
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/app/home">
            <Button variant="primary" leftIcon={<Home className="w-4 h-4" />}>
              Volver al inicio
            </Button>
          </Link>
          <Button
            variant="secondary"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => window.history.back()}
          >
            Página anterior
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
