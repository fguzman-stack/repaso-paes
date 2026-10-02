import React, { useMemo } from 'react';
import katex from 'katex';

interface MathRendererProps {
  content: string;
  className?: string;
}

/**
 * Parses a string and renders LaTeX mathematical expressions enclosed in $...$ (inline) or $$...$$ (block)
 * using KaTeX. Non-math segments are rendered as regular text.
 */
export const MathRenderer: React.FC<MathRendererProps> = ({ content, className = '' }) => {
  const renderedElements = useMemo(() => {
    if (!content) return null;

    // Pattern matching $$...$$ for display math, or $...$ for inline math
    const regex = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g;
    const parts = content.split(regex);

    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const math = part.slice(2, -2);
        try {
          const html = katex.renderToString(math, {
            displayMode: true,
            throwOnError: false,
          });
          return (
            <span
              key={index}
              className="block my-2 overflow-x-auto text-center"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return <span key={index} className="font-mono text-sm">{part}</span>;
        }
      } else if (part.startsWith('$') && part.endsWith('$')) {
        const math = part.slice(1, -1);
        try {
          const html = katex.renderToString(math, {
            displayMode: false,
            throwOnError: false,
          });
          return (
            <span
              key={index}
              className="inline-block align-baseline px-0.5"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return <span key={index} className="font-mono text-sm">{part}</span>;
        }
      }

      // Regular text with possible line breaks
      return <span key={index}>{part}</span>;
    });
  }, [content]);

  return <div className={`leading-relaxed ${className}`}>{renderedElements}</div>;
};
