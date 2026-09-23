/**
 * Python Web Worker
 * Carga Pyodide desde CDN y ejecuta código en un hilo separado
 * para evitar bloquear la interfaz de usuario.
 */

// ImportScripts es síncrono, se usará dentro de la inicialización
let pyodide: any = null;

// Capturar el output estándar (print)
let stdOut = '';

self.onmessage = async (event) => {
  const { id, type, code } = event.data;

  try {
    if (type === 'init') {
      if (!pyodide) {
        // Cargar script de Pyodide desde CDN
        importScripts('https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js');
        
        // @ts-ignore - loadPyodide está en el scope global gracias a importScripts
        pyodide = await loadPyodide({
          stdout: (text: string) => {
            stdOut += text + '\n';
          },
          stderr: (text: string) => {
            stdOut += text + '\n'; // Los errores también a la consola virtual
          }
        });
      }
      self.postMessage({ id, status: 'ready' });
    } 
    else if (type === 'run') {
      if (!pyodide) throw new Error('Pyodide no está inicializado');
      
      stdOut = ''; // Limpiar buffer de salida anterior
      
      // Ejecutar código Python
      await pyodide.runPythonAsync(code);
      
      self.postMessage({ 
        id, 
        status: 'success', 
        output: stdOut 
      });
    }
  } catch (err: any) {
    self.postMessage({ 
      id, 
      status: 'error', 
      error: err.message || err.toString()
    });
  }
};
