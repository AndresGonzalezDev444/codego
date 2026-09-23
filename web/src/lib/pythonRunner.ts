/**
 * Wrapper para gestionar la comunicación con pythonWorker
 */
export class PythonRunner {
  private worker: Worker | null = null;
  private messageId = 0;
  private resolvers: Map<number, { resolve: (val: any) => void, reject: (err: any) => void }> = new Map();

  constructor() {
    this.initWorker();
  }

  private initWorker() {
    // Inicializar el Web Worker (classic worker para soportar importScripts)
    this.worker = new Worker(new URL('./pythonWorker.ts', import.meta.url));
    
    this.worker.onmessage = (event) => {
      const { id, status, output, error } = event.data;
      const resolver = this.resolvers.get(id);
      
      if (resolver) {
        if (status === 'error') {
          resolver.reject(new Error(error));
        } else {
          resolver.resolve(output);
        }
        this.resolvers.delete(id);
      }
    };
  }

  /**
   * Carga Pyodide en el worker (puede tardar unos segundos la primera vez)
   */
  async init(): Promise<void> {
    return this.postMessageAsync({ type: 'init' });
  }

  /**
   * Ejecuta código Python y devuelve su salida estándar (stdout)
   */
  async runCode(code: string): Promise<string> {
    return this.postMessageAsync({ type: 'run', code });
  }

  private postMessageAsync(data: any): Promise<any> {
    if (!this.worker) throw new Error('Worker not initialized');
    
    return new Promise((resolve, reject) => {
      const id = ++this.messageId;
      this.resolvers.set(id, { resolve, reject });
      this.worker!.postMessage({ id, ...data });
    });
  }

  terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}
