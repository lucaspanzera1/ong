import React, { useEffect, useState, Children, isValidElement } from 'react';

const CHARS = 'abcdefghijklmnopqrstuvwxyz';

interface ScrambleTextProps {
  text: string;
  trigger?: any;
}

export function ScrambleText({ text, trigger }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const isFirstRender = React.useRef(true);
  const previousText = React.useRef(text);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (typeof text !== 'string') {
      setDisplayText(text);
      return;
    }
    
    let frame = 0;
    const queue: { from: string; to: string; start: number; end: number; char?: string }[] = [];
    const oldText = previousText.current || '';
    const maxLength = Math.max(oldText.length, text.length);
    
    for (let i = 0; i < maxLength; i++) {
      const from = oldText[i] || '';
      const to = text[i] || '';
      const start = Math.floor(i * 0.5); // Fast cascade
      const end = start + Math.floor(Math.random() * 10) + 5;
      queue.push({ from, to, start, end });
    }

    previousText.current = text;
    let interval: NodeJS.Timeout | null = null;
    
    clearInterval(interval!);
    
    interval = setInterval(() => {
      let output = '';
      let complete = 0;
      
      for (let i = 0; i < queue.length; i++) {
        const { from, to, start, end } = queue[i];
        let { char } = queue[i];
        
        if (frame >= end) {
          complete++;
          output += to;
        } else if (frame >= start) {
          if (!char || Math.random() < 0.2) {
            char = to === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)];
            queue[i].char = char;
          }
          output += char;
        } else {
          output += from;
        }
      }
      
      setDisplayText(output);
      
      if (complete === queue.length) {
        clearInterval(interval!);
      }
      
      frame++;
    }, 16); // 60fps
    
    return () => clearInterval(interval!);
  }, [text, trigger]);

  if (typeof text !== 'string') return <>{text}</>;
  return <>{displayText}</>;
}

export function ScrambleChildren({ children, trigger }: { children: React.ReactNode, trigger?: any }) {
  return Children.map(children, (child) => {
    if (typeof child === 'string') {
      return <ScrambleText text={child} trigger={trigger} />;
    }
    return child;
  });
}
