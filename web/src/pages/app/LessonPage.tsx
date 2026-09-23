import { useEffect, useState, useRef, Suspense, lazy } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Check, ArrowRight, ArrowLeft, RefreshCw, RefreshCcw } from 'lucide-react';
import { Byte } from '@/components/byte/Byte';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/Progress';
import ReactMarkdown from 'react-markdown';
import { exerciseService, type LessonData } from '@/services/exerciseService';
import { progressService } from '@/services/progressService';
import { PythonRunner } from '@/lib/pythonRunner';
import { useAuthStore } from '@/stores/authStore';
import { useProgressStore } from '@/stores/progressStore';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';

const CodeEditor = lazy(() => import('@/components/ui/CodeEditor').then(module => ({ default: module.CodeEditor })));

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
  
  // Estado para Ejercicios
  const [code, setCode] = useState('');
  const [consoleOutput, setConsoleOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [predictInput, setPredictInput] = useState('');
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const pythonRunner = useRef<PythonRunner | null>(null);

  // Cargar datos de la lección
  useEffect(() => {
    if (!id) return;
    
    exerciseService.getLessonData(id)
      .then(data => {
        setLesson(data);
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

  const currentExercise = lesson?.exercises[currentExerciseIndex];

  // Limpiar inputs al cambiar de ejercicio
  useEffect(() => {
    if (currentExercise) {
      if (currentExercise.type === 'code_lab') {
        setCode(currentExercise.starter_code || '');
      }
      setPredictInput('');
      setSelectedOptionId(null);
      setConsoleOutput('');
    }
  }, [currentExerciseIndex, currentExercise]);

  const handleStartExercises = () => {
    if (!profile?.is_plus && (profile?.hearts ?? 5) <= 0) {
      setCurrentStep('no_hearts');
      setByte('sad');
    } else {
      setCurrentStep('exercise');
    }
  };

  const handleSubmitExercise = async (isCorrect: boolean, answer: any) => {
    if (!currentExercise || !profile) return;
    
    if (isCorrect) {
      setByte('excited');
      addToast({ title: '¡Excelente!', message: 'Respuesta correcta.', type: 'success' });
      
      await exerciseService.recordAttempt({
        user_id: profile.id,
        exercise_id: currentExercise.id,
        code_submitted: typeof answer === 'string' ? answer : JSON.stringify(answer),
        is_correct: true,
        xp_earned: currentExercise.xp_reward,
        bytes_earned: currentExercise.bytes_reward,
        time_spent_seconds: 0
      });
      
      setTimeout(() => {
        if (currentExerciseIndex < lesson!.exercises.length - 1) {
          setCurrentExerciseIndex(prev => prev + 1);
        } else {
          handleCompleteLesson();
        }
      }, 1500);
    } else {
      setByte('sad');
      addToast({ title: 'Casi...', message: 'No es correcto. Intenta de nuevo.', type: 'warning' });
      
      if (!profile.is_plus) {
        const currentHearts = profile.hearts ?? 5;
        if (currentHearts > 0) {
          const newHearts = currentHearts - 1;
          const isStartingRegen = currentHearts === 5;
          const newRegenTime = isStartingRegen ? new Date().toISOString() : undefined;
          
          updateHearts(-1, newRegenTime);
          progressService.updateHearts(profile.id, newHearts).catch(console.error);
          
          if (newHearts === 0) {
            setTimeout(() => setCurrentStep('no_hearts'), 2000);
          }
        }
      }

      await exerciseService.recordAttempt({
        user_id: profile.id,
        exercise_id: currentExercise.id,
        code_submitted: typeof answer === 'string' ? answer : JSON.stringify(answer),
        is_correct: false,
        xp_earned: 0,
        bytes_earned: 0,
        time_spent_seconds: 0
      });
    }
  };

  const handleRunCode = async () => {
    if (!pythonRunner.current || !currentExercise) return;
    
    setIsExecuting(true);
    setConsoleOutput('Ejecutando...\n');
    
    try {
      const output = await pythonRunner.current.runCode(code);
      setConsoleOutput(output);
      
      const tests = currentExercise.tests || [];
      let allPassed = true;
      
      for (const test of tests) {
        if (!output.trim().includes(test.expected_output.trim())) {
          allPassed = false;
          break;
        }
      }
      
      await handleSubmitExercise(allPassed, code);
    } catch (err: any) {
      setConsoleOutput(`Error:\n${err.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleVerifyMultipleChoice = () => {
    if (!selectedOptionId || !currentExercise) return;
    const option = currentExercise.options?.find(o => o.id === selectedOptionId);
    handleSubmitExercise(!!option?.is_correct, option?.content);
  };

  const handleVerifyPredictOutput = () => {
    if (!currentExercise || !currentExercise.tests?.[0]) return;
    const expected = currentExercise.tests[0].expected_output.trim();
    const isCorrect = predictInput.trim() === expected;
    handleSubmitExercise(isCorrect, predictInput);
  };

  const handleCompleteLesson = async () => {
    setCurrentStep('completed');
    setByte('celebrating');
    if (profile && lesson && id) {
      await progressService.completeLesson(profile.id, id, lesson.xp_reward, lesson.bytes_reward);
      
      const progressStore = useProgressStore.getState();
      progressStore.addXP(lesson.xp_reward);
      progressStore.addBytes(lesson.bytes_reward);
      
      const newAchievements = await progressService.getUserAchievements(profile.id);
      useProgressStore.setState({ achievements: newAchievements });
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
    <div className="max-w-4xl mx-auto pb-24 h-full flex flex-col">
      {/* Barra Superior */}
      <div className="sticky top-0 z-20 bg-[--bg-base] py-4 px-6 border-b border-[--border-default] flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-[--text-muted] hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="flex-1">
          <ProgressBar 
            value={currentStep === 'theory' ? 0 : currentStep === 'completed' ? 100 : ((currentExerciseIndex) / lesson.exercises.length) * 100} 
            size="sm" 
            variant="success" 
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
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

          {/* PASO 2: EJERCICIOS */}
          {currentStep === 'exercise' && currentExercise && (
            <motion.div
              key={`exercise-${currentExercise.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="px-4 md:px-6 py-6 h-full flex flex-col"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">{currentExercise.instructions}</h2>
                <span className="text-xs font-medium bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-md shrink-0 ml-4">
                  XP: {currentExercise.xp_reward}
                </span>
              </div>

              {/* TIPO: CODE LAB */}
              {currentExercise.type === 'code_lab' && (
                <div className="flex-1 flex flex-col md:flex-row gap-4 h-full min-h-[500px]">
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
                    <div className="flex-1 overflow-auto relative">
                      <Suspense fallback={
                        <div className="absolute inset-0 flex items-center justify-center text-[--text-muted]">
                          <RefreshCcw className="w-5 h-5 animate-spin mb-2" />
                          <span className="text-sm">Cargando CodeLab...</span>
                        </div>
                      }>
                        <CodeEditor 
                          value={code}
                          onChange={setCode}
                          language={currentExercise.language as 'python' | 'javascript' || 'python'}
                          height="100%"
                        />
                      </Suspense>
                    </div>
                  </Card>

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
              )}

              {/* TIPO: MULTIPLE CHOICE */}
              {currentExercise.type === 'multiple_choice' && (
                <div className="flex flex-col items-center justify-center flex-1 max-w-2xl mx-auto w-full">
                  <div className="grid gap-3 w-full mb-8">
                    {currentExercise.options?.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSelectedOptionId(option.id)}
                        className={cn(
                          "w-full text-left px-6 py-4 rounded-xl border-2 transition-all font-medium text-lg",
                          selectedOptionId === option.id 
                            ? "border-cyan-400 bg-cyan-500/10 text-cyan-400"
                            : "border-[--border-default] bg-[--bg-surface] hover:border-gray-500 text-white"
                        )}
                      >
                        {option.content}
                      </button>
                    ))}
                  </div>
                  <Button 
                    size="xl" 
                    fullWidth 
                    onClick={handleVerifyMultipleChoice}
                    disabled={!selectedOptionId}
                  >
                    Verificar Respuesta
                  </Button>
                </div>
              )}

              {/* TIPO: PREDICT OUTPUT */}
              {currentExercise.type === 'predict_output' && (
                <div className="flex flex-col items-center justify-center flex-1 max-w-2xl mx-auto w-full">
                  <Card className="w-full bg-[#282c34] mb-8" padding="none">
                    <div className="bg-[#1e2227] px-4 py-2 border-b border-[#3b4048]">
                      <span className="text-xs text-white/50 font-mono">Código</span>
                    </div>
                    <pre className="p-6 text-gray-300 font-mono text-sm overflow-x-auto">
                      <code>{currentExercise.code_snippet}</code>
                    </pre>
                  </Card>
                  
                  <div className="w-full mb-8">
                    <label className="block text-[--text-secondary] font-semibold mb-2 text-center">
                      ¿Qué imprimirá en la consola?
                    </label>
                    <input
                      type="text"
                      autoFocus
                      value={predictInput}
                      onChange={(e) => setPredictInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleVerifyPredictOutput()}
                      className="w-full bg-[--bg-surface] border-2 border-[--border-default] rounded-xl px-6 py-4 text-center text-xl font-mono text-white focus:outline-none focus:border-cyan-500"
                      placeholder="Escribe la salida exacta"
                    />
                  </div>

                  <Button 
                    size="xl" 
                    fullWidth 
                    onClick={handleVerifyPredictOutput}
                    disabled={!predictInput.trim()}
                  >
                    Verificar Salida
                  </Button>
                </div>
              )}

              {/* OTROS TIPOS NO SOPORTADOS AÚN */}
              {!['code_lab', 'multiple_choice', 'predict_output'].includes(currentExercise.type) && (
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
    </div>
  );
}
