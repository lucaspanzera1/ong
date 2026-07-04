import { useMemo, useState, useRef, useEffect } from 'react';
import iconNames from '../data/material-symbols.json';

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/\s+/g, '_');
    if (!q) return (iconNames as string[]).slice(0, 16); // Mostra alguns ícones default
    return (iconNames as string[]).filter(name => name.includes(q)).slice(0, 16);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function select(name: string) {
    setQuery(name);
    onChange(name);
    setOpen(false);
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          {value ? (
            <span className="material-symbols-outlined text-[20px] text-blue-500 transition-colors">{value}</span>
          ) : (
            <span className="material-symbols-outlined text-[20px] text-neutral-400 group-focus-within:text-blue-500 transition-colors">search</span>
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            onChange('');
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Buscar ícone (Material Symbols)..."
          className="w-full pl-11 pr-10 py-3 text-sm rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-black/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:ring-blue-400/20 dark:focus:border-blue-400 transition-all placeholder:text-neutral-400"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              onChange('');
              setOpen(true);
            }}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>

      {open && (
        <div className="absolute z-[9999] mt-2 w-[calc(100%+2rem)] -left-4 sm:w-full sm:left-0 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl shadow-2xl overflow-hidden p-3 origin-top transition-all">
          <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest mb-3 px-1 flex justify-between items-center">
            <span>Ícones Sugeridos</span>
            <span className="px-1.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-[9px]">{suggestions.length}</span>
          </div>
          {suggestions.length > 0 ? (
            <div className="grid grid-cols-4 gap-2">
              {suggestions.map(name => (
                <button
                  key={name}
                  type="button"
                  onClick={() => select(name)}
                  title={name.replace(/_/g, ' ')}
                  className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-500/10 text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all group border border-transparent hover:border-blue-100 dark:hover:border-blue-900/50"
                >
                  <span className="material-symbols-outlined text-[28px] group-hover:scale-110 transition-transform duration-300">
                    {name}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-neutral-500 flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-4xl opacity-40">search_off</span>
              <p>Nenhum ícone encontrado</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
