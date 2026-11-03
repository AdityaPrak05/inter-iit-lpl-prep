import React from 'react';
import { MonteCarloResult } from '../types/portfolio';
import { Sparkles, ShieldCheck, AlertCircle, BarChart2 } from 'lucide-react';

interface MonteCarloGaugeProps {
  monteCarloCi: MonteCarloResult;
  monteCarloPi: MonteCarloResult;
  monteCarloOpt: MonteCarloResult;
}

export const MonteCarloGauge: React.FC<MonteCarloGaugeProps> = ({
  monteCarloCi,
  monteCarloPi,
  monteCarloOpt,
}) => {
  const renderProbabilityBar = (label: string, result: MonteCarloResult, themeColor: string) => {
    const isSafe = result.successRatePct >= 85;
    const isWarning = result.successRatePct < 75;

    return (
      <div className="bg-[#0E1528] border border-zinc-800 p-4 font-mono space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <span className="font-bold text-white text-xs tracking-wider uppercase">
            {label}
          </span>
          <span
            className={`px-2 py-0.5 text-xs font-bold ${
              isSafe
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                : isWarning
                ? 'bg-rose-950 text-rose-300 border border-rose-700'
                : 'bg-amber-950 text-amber-300 border border-amber-700'
            }`}
          >
            {result.successRatePct}% PROBABILITY
          </span>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-zinc-400">
            <span>Portfolio Survival to Age 90:</span>
            <span className="text-white font-bold">{result.successRatePct}%</span>
          </div>
          <div className="w-full bg-zinc-900 h-3 border border-zinc-700 overflow-hidden">
            <div
              className={`h-full ${
                result.successRatePct >= 85
                  ? 'bg-emerald-500'
                  : result.successRatePct < 75
                  ? 'bg-rose-500'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(100, result.successRatePct)}%` }}
            />
          </div>
        </div>

        {/* Percentiles */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-800/80 text-[11px]">
          <div>
            <span className="text-zinc-500 block text-[10px]">P10 (BEAR)</span>
            <span className="text-rose-400 font-bold">${(result.p10EndingWealth / 1000).toFixed(0)}k</span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[10px]">P50 (MEDIAN)</span>
            <span className="text-zinc-200 font-bold">${(result.medianEndingWealth / 1000).toFixed(0)}k</span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[10px]">P90 (BULL)</span>
            <span className="text-emerald-400 font-bold">${(result.p90EndingWealth / 1000).toFixed(0)}k</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#090D16] border-b border-zinc-800 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-zinc-400">
              MONTE CARLO LONGEVITY ENGINE (1,000 SIMULATIONS) //
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Statistical Probability of Complete Portfolio Survival Through Age 90
            </h2>
          </div>
          <div className="text-xs font-mono text-zinc-500">
            Fat-Tailed Sequence of Returns Modeling
          </div>
        </div>

        {/* 3 Simulation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {renderProbabilityBar('Current Investment (CI)', monteCarloCi, 'zinc')}
          {renderProbabilityBar('Proposed Investment (PI)', monteCarloPi, 'cyan')}
          {renderProbabilityBar('LPL AI-Optimized (Opt)', monteCarloOpt, 'emerald')}
        </div>
      </div>
    </div>
  );
};
