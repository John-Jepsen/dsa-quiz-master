import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'neutral',
  securityLevel: 'loose',
  fontFamily: 'ui-monospace, monospace',
});

interface MermaidDiagramProps {
  source: string;
  className?: string;
}

let diagramCounter = 0;

export function MermaidDiagram({ source, className }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const idRef = useRef(`mermaid-${Date.now()}-${diagramCounter++}`);

  useEffect(() => {
    if (!containerRef.current) return;

    const render = async () => {
      try {
        setError(null);
        const { svg } = await mermaid.render(idRef.current, source);
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err) {
        setError('Failed to render diagram');
        console.error('Mermaid render error:', err);
      }
    };

    render();
  }, [source]);

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`flex justify-center overflow-x-auto ${className || ''}`}
    />
  );
}
