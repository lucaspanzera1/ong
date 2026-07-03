import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import { getAnalyticsSummary, type AnalyticsSummary } from '../lib/analytics';

const RANGES = [7, 30, 90] as const;
type Range = (typeof RANGES)[number];

const DEVICE_LABELS: Record<string, string> = {
  mobile: 'Celular',
  tablet: 'Tablet',
  desktop: 'Computador',
};

function formatCompact(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  return String(value);
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-6 bg-white/40 dark:bg-black/20 border border-neutral-200/60 dark:border-neutral-800/60 rounded-2xl">
      <div className="font-mono text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-2">
        {label}
      </div>
      <div className="text-3xl font-semibold text-neutral-900 dark:text-white">
        {formatCompact(value)}
      </div>
    </div>
  );
}

function BarList({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; visits: number }[];
}) {
  const max = Math.max(1, ...rows.map(r => r.visits));
  return (
    <div className="p-6 bg-white/40 dark:bg-black/20 border border-neutral-200/60 dark:border-neutral-800/60 rounded-2xl">
      <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-4">
        {title}
      </h3>
      {rows.length === 0 ? (
        <p className="text-sm text-neutral-400 dark:text-neutral-600">Sem dados no período.</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {rows.map(row => (
            <div key={row.label} className="relative">
              <div
                className="absolute inset-y-0 left-0 bg-[#2a78d6]/10 dark:bg-[#3987e5]/15 rounded"
                style={{ width: `${Math.max(4, (row.visits / max) * 100)}%` }}
              />
              <div className="relative flex items-center justify-between gap-4 px-2.5 py-1.5 text-sm">
                <span className="text-neutral-700 dark:text-neutral-300 truncate">{row.label}</span>
                <span className="text-neutral-500 dark:text-neutral-400 font-mono shrink-0">{row.visits}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-xs shadow-lg">
      <div className="text-neutral-500 dark:text-neutral-400 mb-1 font-mono">{label}</div>
      {payload.map(entry => (
        <div key={entry.name} className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
          {entry.name}: <span className="font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export function AnalyticsDashboard() {
  const [range, setRange] = useState<Range>(7);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    getAnalyticsSummary(range)
      .then(setSummary)
      .catch(() => setError('Falha ao carregar analytics'));
  }, [range]);

  const avgPerDay = summary ? Math.round(summary.totals.visits / range) : 0;

  return (
    <div
      className="flex flex-col gap-6 [--chart-blue:#2a78d6] dark:[--chart-blue:#3987e5] [--chart-aqua:#1baf7a] dark:[--chart-aqua:#199e70] [--chart-grid:#e1e0d9] dark:[--chart-grid:#2c2c2a] [--chart-muted:#898781]"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Uso do site</h2>
        </div>
        <div className="flex items-center gap-2">
          {RANGES.map(r => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 border font-mono text-xs transition-colors ${
                range === r
                  ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900'
                  : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-600'
              }`}
            >
              {r}d
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {summary && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatTile label="Visitas" value={summary.totals.visits} />
            <StatTile label="Visitantes únicos" value={summary.totals.uniqueVisitors} />
            <StatTile label="Média por dia" value={avgPerDay} />
          </div>

          <div className="p-6 bg-white/40 dark:bg-black/20 border border-neutral-200/60 dark:border-neutral-800/60 rounded-2xl">
            <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-4">
              Visitas ao longo do tempo
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={summary.daily} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: 'var(--chart-muted)' }}
                  axisLine={{ stroke: 'var(--chart-grid)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'var(--chart-muted)' }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="visits"
                  name="Visitas"
                  stroke="var(--chart-blue)"
                  strokeWidth={2}
                  fill="var(--chart-blue)"
                  fillOpacity={0.1}
                />
                <Area
                  type="monotone"
                  dataKey="uniqueVisitors"
                  name="Visitantes únicos"
                  stroke="var(--chart-aqua)"
                  strokeWidth={2}
                  fill="var(--chart-aqua)"
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-6 mt-2 pl-2">
              <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2a78d6] dark:bg-[#3987e5]" />
                Visitas
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1baf7a] dark:bg-[#199e70]" />
                Visitantes únicos
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BarList
              title="Páginas mais acessadas"
              rows={summary.topPages.map(p => ({ label: p.path, visits: p.visits }))}
            />
            <BarList
              title="Origem do tráfego"
              rows={summary.referrers.map(r => ({ label: r.referrerHost, visits: r.visits }))}
            />
            <BarList
              title="Dispositivo"
              rows={summary.devices.map(d => ({
                label: DEVICE_LABELS[d.device] ?? d.device,
                visits: d.visits,
              }))}
            />
            <BarList
              title="Navegador"
              rows={summary.browsers.map(b => ({ label: b.browser, visits: b.visits }))}
            />
            <BarList
              title="País"
              rows={summary.countries.map(c => ({ label: c.country, visits: c.visits }))}
            />
          </div>
        </>
      )}
    </div>
  );
}
