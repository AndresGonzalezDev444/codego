import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Check, ArrowRight, ArrowLeft, RefreshCw } from 'lucide-react';
import { Byte } from '@/components/byte/Byte';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/Progress';
import { CodeEditor } from '@/components/ui/CodeEditor';
import ReactMarkdown from 'react-markdown';
import { exerciseService, type LessonData } from '@/services/exerciseService';
import { progressService } from '@/services/progressService';
import { PythonRunner } from '@/lib/pythonRunner';
import { useAuthStore } from '@/stores/authStore';
import { useProgressStore } from '@/stores/progressStore';
import { useUIStore } from '@/stores/uiStore';

type Step = 'theory' | 'exercise' | 'completed' | 'no_hearts';

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile, updateHearts } = useAuthStore();
  const { xp, addXP } = useProgressStore();
  const { addToast, setByte } = useUIStore();

  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Flujo de la lección
  const [currentStep, setCurrentStep] = useState<Step>('theory');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  
  // Estado para Code Lab
  const [code, setCode] = useState('');
  const [consoleOutput, setConsoleOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const pythonRunner = useRef<PythonRunner | null>(null);

  // Cargar datos de la lección
  useEffect(() => {
    if (!id) return;
    
    exerciseService.getLessonData(id)
      .then(data => {
        setLesson(data);
        if (data.exercises.length > 0 && data.exercises[0].type === 'code_lab') {
          setCode(data.exercises[0].starter_code || '');
        }
      })
      .catch(err => {
        console.error(err);
        addToast({ title: 'Error', message: 'No se pudo cargar la lección.', type: 'error' });
        navigate('/app/home');
      })
      .finally(() => setLoading(false));
      
    // Inicializar Python Web Worker en segundo plano
    pythonRunner.current = new PythonRunner();
    pythonRunner.current.init().catch(console.error);

    return () => {
      pythonRunner.current?.terminate();
    };
  }, [id, navigate, addToast]);

  const handleStartExercises = () => {
    if (!profile?.is_plus && (profile?.hearts ?? 5) <= 0) {
      setCurrentStep('no_hearts');
      setByte('sad');
    } else {
      setCurrentStep('exercise');
    }
  };

  const currentExercise = lesson?.exercises[currentExerciseIndex];

  const handleRunCode = async () => {
    if (!pythonRunner.current || !currentExercise) return;
    
    setIsExecuting(true);
    setConsoleOutput('Ejecutando...\n');
    
    try {
      const output = await pythonRunner.current.runCode(code);
      setConsoleOutput(output);
      
      // Validar con los tests
      const tests = currentExercise.tests || [];
      let allPassed = true;
      
      for (const test of tests) {
        // Validación básica: comprobar si el output contiene lo esperado (ignorando espacios finales)
        if (!output.trim().includes(test.expected_output.trim())) {
          allPassed = false;
          break;
        }
      }

      if (allPassed) {
        // Otorga XP temporal en estado
        addXP(currentExercise.xp_reward);
        setByte('excited');
        
        // Guardar intento correcto en BD
        if (profile) {
          await exerciseService.recordAttempt(
            profile.id, currentExercise.id, true, { code }, currentExercise.xp_reward, currentExercise.bytes_reward
          );
        }
        
        addToast({ title: '¡Excelente!', message: 'Código correcto. Has ganado ' + currentExercise.xp_reward + ' XP.', type: 'success' });
        
        // Avanzar al siguiente o terminar
        setTimeout(() => {
          if (currentExerciseIndex < lesson.exercises.length - 1) {
            const nextIndex = currentExerciseIndex + 1;
            setCurrentExerciseIndex(nextIndex);
            if (lesson.exercises[nextIndex].type === 'code_lab') {
              setCode(lesson.exercises[nextIndex].starter_code || '');
            }
            setConsoleOutput('');
          } else {
            handleCompleteLesson();
          }
        }, 1500);
      } else {
        setByte('sad');
        addToast({ title: 'Casi...', message: 'El resultado no es el esperado. Sigue intentando.', type: 'warning' });
        
        if (profile) {
          if (!profile.is_plus) {
            // Restar un corazón
            const currentHearts = profile.hearts ?? 5;
            if (currentHearts > 0) {
              const newHearts = currentHearts - 1;
              const isStartingRegen = currentHearts === 5;
              const newRegenTime = isStartingRegen ? new Date().toISOString() : undefined;
              
              updateHearts(-1, newRegenTime);
              await progressService.updateHearts(profile.id, newHearts);
              
              if (newHearts === 0) {
                setTimeout(() => {
                  setCurrentStep('no_hearts');
                }, 2000);
              }
            }
          }

          await exerciseService.recordAttempt(
            profile.id, currentExercise.id, false, { code }, 0, 0
          );
        }
      }
      
    } catch (err: any) {
      setConsoleOutput(`Error:\n${err.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCompleteLesson = async () => {
    setCurrentStep('completed');
    setByte('celebrating');
    if (profile && lesson) {
      // Sumar recompensa de la lección
      addXP(lesson.xp_reward);
      await exerciseService.completeLesson(profile.id, lesson.id, 100);
    }
  };

  if (loading || !lesson) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <Byte mood="thinking" size="xl" animate />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-24">
      {/* Barra Superior */}
      <div className="sticky top-0 z-20 bg-[--bg-base] py-4 px-6 border-b border-[--border-default] flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-[--text-muted] hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        {/* Progress bar de la lección */}
        <div className="flex-1">
          <ProgressBar 
            value={currentStep === 'theory' ? 0 : currentStep === 'completed' ? 100 : ((currentExerciseIndex) / lesson.exercises.length) * 100} 
            size="sm" 
            variant="success" 
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* PASO 1: TEORÍA */}
        {currentStep === 'theory' && (
          <motion.div
            key="theory"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-6 py-8 flex flex-col items-center"
          >
            <div className="w-full max-w-2xl">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 text-center md:text-left">
                <Byte mood="welcome" size="lg" animate className="shrink-0" />
                <div className="bg-[--bg-surface] border border-[--border-default] rounded-2xl p-6 md:p-8 shadow-xl relative w-full">
                  <div className="hidden md:block absolute top-6 -left-3 w-4 h-4 bg-[--bg-surface] border-b border-l border-[--border-default] rotate-45" />
                  <div className="md:hidden absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-[--bg-surface] border-t border-l border-[--border-default] rotate-45" />
                  <h1 className="text-3xl font-black text-white mb-3">{lesson.title}</h1>
                  <p className="text-[--text-secondary] mb-6 border-b border-[--border-default] pb-5 text-lg">{lesson.description}</p>
                  <div className="prose prose-invert prose-cyan max-w-none text-base md:text-lg">
                    <ReactMarkdown>{lesson.theory_content || ''}</ReactMarkdown>
                  </div>
                </div>
              </div>

              <div className="flex justify-center md:justify-end">
                <Button size="xl" rightIcon={<ArrowRight />} onClick={handleStartExercises}>
                  Continuar a los retos
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* PASO 2: EJERCICIO (Code Lab) */}
        {currentStep === 'exercise' && currentExercise && (
          <motion.div
            key={`exercise-${currentExercise.id}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-4 md:px-6 py-6 h-[calc(100vh-140px)] flex flex-col"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">{currentExercise.instructions}</h2>
              <span className="text-xs font-medium bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-md">
                XP: {currentExercise.xp_reward}
              </span>
            </div>

            {currentExercise.type === 'code_lab' ? (
              <div className="flex-1 flex flex-col md:flex-row gap-4 h-full">
                {/* Panel del Editor */}
                <Card className="flex-1 flex flex-col overflow-hidden bg-[#282c34]" padding="none" variant="elevated">
                  <div className="bg-[#1e2227] px-4 py-2 border-b border-[#3b4048] flex items-center justify-between">
                    <span className="text-xs text-white/50 font-mono">main.py</span>
                    <button 
                      onClick={() => setCode(currentExercise.starter_code || '')}
                      className="text-xs text-white/50 hover:text-white transition-colors flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Reset
                    </button>
                  </div>
                  <div className="flex-1 overflow-auto">
                    <CodeEditor 
                      value={code}
                      onChange={setCode}
                      language={currentExercise.language as 'python' | 'javascript' || 'python'}
                      height="100%"
                    />
                  </div>
                </Card>

                {/* Panel de Consola y Controles */}
                <div className="md:w-80 flex flex-col gap-4">
                  <Card className="flex-1 flex flex-col overflow-hidden bg-black/50" padding="none">
                    <div className="bg-[#1e2227] px-4 py-2 border-b border-[#3b4048]">
                      <span className="text-xs text-white/50 font-mono">Terminal Output</span>
                    </div>
                    <div className="p-4 flex-1 overflow-auto font-mono text-sm">
                      {consoleOutput ? (
                        <pre className="text-gray-300 whitespace-pre-wrap">{consoleOutput}</pre>
                      ) : (
                        <span className="text-white/20 italic">Presiona Ejecutar para ver el resultado...</span>
                      )}
                    </div>
                  </Card>

                  <Button 
                    variant="primary" 
                    size="xl" 
                    fullWidth 
                    leftIcon={<Play className="w-5 h-5" fill="currentColor" />}
                    onClick={handleRunCode}
                    isLoading={isExecuting}
                  >
                    Ejecutar Código
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-white/50">Tipo de ejercicio '{currentExercise.type}' en desarrollo.</p>
              </div>
            )}
          </motion.div>
        )}

        {/* PASO 3: COMPLETADO */}
        {currentStep === 'completed' && (
          <motion.div
            key="completed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-6 py-20 flex flex-col items-center text-center"
          >
            <Byte mood="celebrating" size="xl" className="mb-8" animate />
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-4">
              ¡Lección Completada!
            </h1>
            <p className="text-[--text-secondary] mb-12 max-w-md">
              Has superado todos los retos. ¡Sigue así, estás a un paso más cerca de dominar Pythonia!
            </p>

            <div className="flex gap-4 mb-12">
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 min-w-[140px]">
                <p className="text-3xl font-black text-yellow-400 mb-1">+{lesson.xp_reward}</p>
                <p className="text-xs font-bold text-yellow-400/50 uppercase tracking-widest">XP Ganado</p>
              </div>
              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-6 min-w-[140px]">
                <p className="text-3xl font-black text-cyan-400 mb-1">+{lesson.bytes_reward}</p>
                <p className="text-xs font-bold text-cyan-400/50 uppercase tracking-widest">Bytes Ganados</p>
              </div>
            </div>

            <Button size="xl" onClick={() => navigate('/app/home')}>
              Volver al Mapa
            </Button>
          </motion.div>
        )}

        {/* PASO 4: SIN CORAZONES */}
        {currentStep === 'no_hearts' && (
          <motion.div
            key="no_hearts"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-6 py-20 flex flex-col items-center text-center"
          >
            <Byte mood="sad" size="xl" className="mb-8" animate />
            <h1 className="text-4xl font-black text-red-500 mb-4">
              Te has quedado sin corazones
            </h1>
            <p className="text-[--text-secondary] mb-12 max-w-md">
              No te preocupes, los errores son parte del aprendizaje. Espera a que tus corazones se recarguen para seguir intentándolo.
            </p>

            <Button size="xl" onClick={() => navigate('/app/home')}>
              Volver al Mapa
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
