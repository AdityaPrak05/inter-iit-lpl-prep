import React from 'react';
import { ClientPersona, Holding, PortfolioRiskMetrics } from '../types/portfolio';
import { ASSET_PROFILES } from '../data/marketData';
import { Shield, Sparkles, Layers, ArrowUpRight, DollarSign, Percent } from 'lucide-react';

interface HoldingsMatrixProps {
  persona: ClientPersona;
  metricsCi: PortfolioRiskMetrics;
  metricsPi: PortfolioRiskMetrics;
  metricsOpt: PortfolioRiskMetrics;
  piStartingCapital: number;
  optStartingCapital: number;
}

export const HoldingsMatrix: React.FC<HoldingsMatrixProps> = ({
  persona,
  metricsCi,
  metricsPi,
  metricsOpt,
  piStartingCapital,
  optStartingCapital,
}) => {
  const totalCi = persona.ciHoldings.reduce((sum, h) => sum + h.value, 0);

  const renderHoldingCard = (h: Holding, totalColVal: number, colType: 'ci' | 'pi' | 'opt') => {
    const profile = ASSET_PROFILES[h.assetClass] || ASSET_PROFILES['SP500'];
    const pct = totalColVal > 0 ? ((h.value / totalColVal) * 100).toFixed(1) : '0.0';
    const embeddedGain = h.costBasis ? Math.max(0, h.value - h.costBasis) : 0;

    let actionLabel = '';
    let actionColor = 'bg-zinc-800 text-zinc-300';
    if (colType === 'ci') {
      if (h.actionInPi === 'liquidate_and_switch') {
        actionLabel = 'LIQUIDATE IN PI';
        actionColor = 'bg-rose-950 text-rose-300 border border-rose-800';
      } else if (h.actionInPi === 'convert_roth') {
        actionLabel = 'ROTH CONVERT';
        actionColor = 'bg-amber-950 text-amber-300 border border-amber-800';
      } else if (h.actionInPi === 'surrender_annuity') {
        actionLabel = 'SURRENDER ANNUITY';
        actionColor = 'bg-rose-950 text-rose-300 border border-rose-800';
      } else {
        actionLabel = 'RETAIN AS-IS';
        actionColor = 'bg-zinc-800 text-zinc-400 border border-zinc-700';
      }
    } else if (colType === 'pi') {
      actionLabel = 'PROPOSED HOLDING';
      actionColor = 'bg-cyan-950 text-cyan-300 border border-cyan-800';
    } else {
      actionLabel = 'AI-OPTIMIZED STAGED';
      actionColor = 'bg-emerald-950 text-emerald-300 border border-emerald-800';
    }

    return (
      <div key={h.name} className="bg-[#0C1220] border border-zinc-800/80 p-3 relative group hover:border-zinc-700 transition-all">
        {/* Top Asset tag & allocation */}
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center space-x-1.5">
            <div className="w-2.5 h-2.5" style={{ backgroundColor: profile.color }} />
            <span className="text-[11px] font-mono text-zinc-400 truncate max-w-[170px]" title={profile.name}>
              {profile.code}
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-zinc-300">
            {pct}%
          </span>
        </div>

        {/* Holding Title */}
        <div className="font-semibold text-zinc-100 text-xs sm:text-[13px] leading-tight mb-2">
          {h.name}
        </div>

        {/* Value and Cost Basis */}
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono py-1.5 border-t border-zinc-800/70 mb-2">
          <div>
            <span className="text-zinc-500 block text-[10px]">VALUE</span>
            <span className="text-zinc-200 font-bold">${h.value.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[10px]">
              {colType === 'ci' && h.accountType === 'taxable' ? 'EMBEDDED GAIN' : 'ACCOUNT TYPE'}
            </span>
            <span className={embeddedGain > 0 && colType === 'ci' ? 'text-amber-400 font-bold' : 'text-zinc-400 uppercase text-[10px]'}>
              {colType === 'ci' && h.accountType === 'taxable' 
                ? `+$${embeddedGain.toLocaleString()}` 
                : h.accountType.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Fees & Exit Clauses */}
        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 border-t border-zinc-800/60 pt-1.5">
          <div>
            <span>FEE: </span>
            <span className="text-zinc-200 font-bold">
              {((h.expenseRatio + (h.advisoryFee || 0)) * 100).toFixed(2)}%
            </span>
          </div>
          {h.exitFeePct ? (
            <div className="text-rose-400">
              EXIT CLAUSE: {(h.exitFeePct * 100).toFixed(1)}% (${(h.value * h.exitFeePct).toLocaleString()})
            </div>
          ) : (
            <div className="text-zinc-600">NO EXIT PENALTY</div>
          )}
        </div>

        {/* Action badge */}
        <div className="mt-2 pt-1 border-t border-zinc-800/50 flex items-center justify-between">
          <span className={`px-1.5 py-0.5 text-[9px] font-mono tracking-wider uppercase font-bold ${actionColor}`}>
            {actionLabel}
          </span>
          {h.notes && (
            <span className="text-[10px] font-mono text-zinc-500 truncate max-w-[130px]" title={h.notes}>
              {h.notes}
            </span>
          )}
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
              HOLDINGS ARCHITECTURE // SIDE-BY-SIDE STRUCTURAL COMPARISON
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Current Investment (CI) vs Proposed Investment (PI) vs LPL AI-Optimized (Opt)
            </h2>
          </div>
          <div className="text-xs font-mono text-zinc-500">
            Gross Returns vs Net Cost Structures
          </div>
        </div>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Column 1: Current Investment (CI) */}
          <div className="bg-[#0B101D] border-2 border-zinc-700/80 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-zinc-500" />
                  <span className="font-mono font-bold text-white text-sm tracking-wider">
                    CURRENT INVESTMENT (CI)
                  </span>
                </div>
                <span className="px-2 py-0.5 text-xs font-mono bg-zinc-800 text-zinc-300">
                  EXISTING ASSETS
                </span>
              </div>

              {/* Column Total Bar */}
              <div className="bg-zinc-900/90 border border-zinc-800 p-3 mb-3 font-mono">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-zinc-400">STARTING CAPITAL:</span>
                  <span className="text-lg font-bold text-white">${totalCi.toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-zinc-800 text-[11px]">
                  <div>
                    <span className="text-zinc-500 block text-[10px]">NET CAGR</span>
                    <span className="text-zinc-200 font-bold">{(metricsCi.netCagr * 100).toFixed(2)}%</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">FEE DRAG</span>
                    <span className="text-amber-400 font-bold">{(metricsCi.totalFeeDrag * 100).toFixed(2)}%</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">SHARPE</span>
                    <span className="text-zinc-200 font-bold">{metricsCi.sharpeRatio}</span>
                  </div>
                </div>
              </div>

              {/* Holdings List */}
              <div className="space-y-2.5">
                {persona.ciHoldings.map((h) => renderHoldingCard(h, totalCi, 'ci'))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800 text-[11px] font-mono text-zinc-500">
              Holdings baseline without transition action.
            </div>
          </div>

          {/* Column 2: Proposed Investment (PI) */}
          <div className="bg-[#0B101D] border-2 border-cyan-800/80 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-cyan-500" />
                  <span className="font-mono font-bold text-cyan-300 text-sm tracking-wider">
                    PROPOSED INVESTMENT (PI)
                  </span>
                </div>
                <span className="px-2 py-0.5 text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                  NAIVE TRANSITION
                </span>
              </div>

              {/* Column Total Bar */}
              <div className="bg-cyan-950/30 border border-cyan-800/80 p-3 mb-3 font-mono">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-zinc-400">NET POST-FRICTION:</span>
                  <span className="text-lg font-bold text-cyan-300">${piStartingCapital.toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-cyan-900/50 text-[11px]">
                  <div>
                    <span className="text-zinc-500 block text-[10px]">NET CAGR</span>
                    <span className="text-cyan-200 font-bold">{(metricsPi.netCagr * 100).toFixed(2)}%</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">FEE DRAG</span>
                    <span className="text-rose-400 font-bold">{(metricsPi.totalFeeDrag * 100).toFixed(2)}%</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">BETA</span>
                    <span className="text-amber-400 font-bold">{metricsPi.beta}</span>
                  </div>
                </div>
              </div>

              {/* Holdings List */}
              <div className="space-y-2.5">
                {persona.piHoldings.map((h) => renderHoldingCard(h, piStartingCapital, 'pi'))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800 text-[11px] font-mono text-zinc-400">
              ⚠️ Incurs immediate tax on lump-sum Roth and annuity exit fee.
            </div>
          </div>

          {/* Column 3: LPL AI-Optimized (Opt) */}
          <div className="bg-[#0B101D] border-2 border-emerald-600 p-4 flex flex-col justify-between shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono font-bold text-emerald-300 text-sm tracking-wider">
                    LPL AI-OPTIMIZED (OPT)
                  </span>
                </div>
                <span className="px-2 py-0.5 text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-600 font-bold">
                  RECOMMENDED MODEL
                </span>
              </div>

              {/* Column Total Bar */}
              <div className="bg-emerald-950/40 border border-emerald-700/80 p-3 mb-3 font-mono">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-zinc-400">NET POST-FRICTION:</span>
                  <span className="text-lg font-bold text-emerald-300">${optStartingCapital.toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-emerald-900/50 text-[11px]">
                  <div>
                    <span className="text-zinc-500 block text-[10px]">NET CAGR</span>
                    <span className="text-emerald-200 font-bold">{(metricsOpt.netCagr * 100).toFixed(2)}%</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">FEE DRAG</span>
                    <span className="text-emerald-400 font-bold">{(metricsOpt.totalFeeDrag * 100).toFixed(2)}%</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">SHARPE</span>
                    <span className="text-emerald-300 font-bold">{metricsOpt.sharpeRatio}</span>
                  </div>
                </div>
              </div>

              {/* Holdings List */}
              <div className="space-y-2.5">
                {persona.optHoldings.map((h) => renderHoldingCard(h, optStartingCapital, 'opt'))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800 text-[11px] font-mono text-emerald-400 font-semibold">
              ✓ Staged Roth conversion over 5 years + low-cost core factor architecture.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
