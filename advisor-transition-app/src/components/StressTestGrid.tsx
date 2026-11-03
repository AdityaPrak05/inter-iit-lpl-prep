import React from 'react';
import { StressImpact } from '../types/portfolio';
import { ShieldAlert, Flame, Activity } from 'lucide-react';

interface StressTestGridProps {
  stressTests: StressImpact[];
}

export const StressTestGrid: React.FC<StressTestGridProps> = ({ stressTests }) => {
  return (
    <div className="bg-[#0A0F1D] border-b border-zinc-800 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-zinc-400">
              MACRO CRISIS STRESS-TEST REGIMES //
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Extreme Event Shock Simulations & Capital Preservation Under Duress
            </h2>
          </div>
          <div className="text-xs font-mono text-zinc-500">
            Simulated Peak-to-Trough Drawdowns
          </div>
        </div>

        {/* 3 Shock Scenario Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {stressTests.map((st, idx) => (
            <div key={idx} className="bg-[#0E1528] border border-zinc-800 p-4 font-mono space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="font-bold text-white text-xs tracking-tight flex items-center space-x-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>{st.name}</span>
                </span>
                <span className="text-[10px] text-zinc-500 uppercase">HISTORICAL REPLAY</span>
              </div>

              {/* Drawdowns */}
              <div className="space-y-2 text-xs">
                {/* CI */}
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Current (CI):</span>
                  <div className="text-right">
                    <span className="text-zinc-200 font-bold">{st.ciLossPct}%</span>
                    <span className="text-[10px] text-zinc-500 block">${st.ciPostVal.toLocaleString()}</span>
                  </div>
                </div>

                {/* PI */}
                <div className="flex justify-between items-center bg-rose-950/20 p-1.5 border border-rose-900/40">
                  <span className="text-rose-300 font-bold">Proposed (PI):</span>
                  <div className="text-right">
                    <span className="text-rose-400 font-bold">{st.piLossPct}%</span>
                    <span className="text-[10px] text-rose-300/70 block">${st.piPostVal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Opt */}
                <div className="flex justify-between items-center bg-emerald-950/20 p-1.5 border border-emerald-900/40">
                  <span className="text-emerald-300 font-bold">AI-Optimized:</span>
                  <div className="text-right">
                    <span className="text-emerald-400 font-bold">{st.optLossPct}%</span>
                    <span className="text-[10px] text-emerald-300/70 block">${st.optPostVal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800/80 text-[10px] text-zinc-500 leading-tight">
                {st.piLossPct < st.ciLossPct ? (
                  <span className="text-amber-400">
                    ⚠️ PI suffers deeper crash due to high-beta tech concentration.
                  </span>
                ) : (
                  <span>Resilient bond / dividend buffer cushions shock.</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
