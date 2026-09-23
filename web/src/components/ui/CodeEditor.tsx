import { useRef, useEffect } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, lineNumbers, keymap, highlightActiveLineGutter } from '@codemirror/view';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { bracketMatching } from '@codemirror/language';

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: 'python' | 'javascript';
  readOnly?: boolean;
  height?: string;
}

export function CodeEditor({ 
  value, 
  onChange, 
  language = 'python', 
  readOnly = false,
  height = '300px'
}: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    // Obtener la extensión de lenguaje adecuada
    const langExtension = language === 'python' ? python() : javascript();

    const startState = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        bracketMatching(),
        keymap.of([indentWithTab, ...defaultKeymap]),
        oneDark,
        langExtension,
        EditorView.updateListener.of((update) => {
          if (update.docChanged && onChange) {
            onChange(update.state.doc.toString());
          }
        }),
        EditorView.editable.of(!readOnly),
        // Estilos base de CodeMirror
        EditorView.theme({
          "&": {
            height: height,
            fontSize: "14px",
            fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
          },
          ".cm-scroller": {
            overflow: "auto",
            borderRadius: "0.75rem",
          },
          "&.cm-focused": {
            outline: "none"
          }
        })
      ]
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current
    });
    
    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo al montar, para evitar recreaciones completas (en producción se necesitaría manejar sync de props)

  return (
    <div 
      ref={editorRef} 
      className="w-full rounded-xl overflow-hidden border border-[--border-default] bg-[#282c34]" 
    />
  );
}
