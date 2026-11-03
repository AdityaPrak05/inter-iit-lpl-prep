import React from 'react';
import { LongevityMilestones, ClientPersona } from '../types/portfolio';
import { ShieldCheck, AlertCircle, ArrowUpRight, TrendingUp } from 'lucide-react';

interface LongevitySimulatorProps {
  persona: ClientPersona;
  longevityCi: LongevityMilestones;
  longevityPi: LongevityMilestones;
  longevityOpt: LongevityMilestones;
}

export const LongevitySimulator: React.FC<LongevitySimulatorProps> = ({
  persona,
  longevityCi,
  longevityPi,
  longevityOpt,
}) => {
  const milestones = [
    {
      age: 60,
      label: 'Retirement Inception (Age 60)',
      ci: longevityCi.age60,
      pi: longevityPi.age60,
      opt: longevityOpt.age60,
      desc: 'Accumulation phase conclusion; commencement of active retirement withdrawals.',
    },
    {
      age: 70,
      label: 'Early Decumulation (Age 70)',
      ci: longevityCi.age70,
      pi: longevityPi.age70,
      opt: longevityOpt.age70,
      desc: '10 years of inflation-adjusted draws; prior to mandatory RMD trigger.',
    },
    {
      age: 80,
      label: 'Late Decumulation & RMDs (Age 80)',
      ci: longevityCi.age80,
      pi: longevityPi.age80,
      opt: longevityOpt.age80,
      desc: 'Active SECURE 2.0 RMD forced distributions from tax-deferred Traditional IRAs.',
    },
    {
      age: 90,
      label: 'Terminal Longevity & Legacy (Age 90)',
      ci: longevityCi.age90,
      pi: longevityPi.age90,
      opt: longevityOpt.age90,
      desc: '30-year cumulative sustainability baseline & legacy wealth transfer to heirs.',
    },
  ];

  return (
    <div className="bg-[#0A0F1D] border-b border-zinc-800 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-zinc-400">
              RETIREMENT SUSTAINABILITY HORIZON (AGES 60 → 90) //
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Portfolio Longevity, Decumulation Cash Flows & RMD Depletion
            </h2>
          </div>
          <div className="text-xs font-mono text-zinc-400">
            Base Annual Draw: <strong className="text-white">${persona.withdrawalNeed.toLocaleString()}</strong> (Indexed at {(persona.inflationRate * 100).toFixed(1)}% inflation)
          </div>
        </div>

        {/* 4 Milestones Table */}
        <div className="bg-[#0E1528] border border-zinc-800 p-4 font-mono">
          <div className="grid grid-cols-12 gap-2 pb-2.5 border-b border-zinc-800 text-[11px] text-zinc-400 font-bold uppercase">
            <div className="col-span-12 sm:col-span-5">RETIREMENT MILESTONE</div>
            <div className="col-span-4 sm:col-span-2 text-right text-zinc-300">CURRENT (CI)</div>
            <div className="col-span-4 sm:col-span-2 text-right text-cyan-300">PROPOSED (PI)</div>
            <div className="col-span-4 sm:col-span-3 text-right text-emerald-300">AI-OPTIMIZED (OPT)</div>
          </div>

          <div className="divide-y divide-zinc-800/60">
            {milestones.map((m) => {
              const optDelta = m.opt - m.ci;
              return (
                <div key={m.age} className="grid grid-cols-12 gap-2 py-3 items-center text-xs">
                  <div className="col-span-12 sm:col-span-5">
                    <div className="font-bold text-white text-sm sm:text-xs">{m.label}</div>
                    <div className="text-[10px] text-zinc-500 font-sans">{m.desc}</div>
                  </div>
                  <div className="col-span-4 sm:col-span-2 text-right font-mono text-zinc-300">
                    {m.ci > 0 ? `$${m.ci.toLocaleString()}` : <span className="text-rose-400 font-bold">DEPLETED</span>}
                  </div>
                  <div className="col-span-4 sm:col-span-2 text-right font-mono font-bold text-cyan-300">
                    {m.pi > 0 ? `$${m.pi.toLocaleString()}` : <span className="text-rose-400 font-bold">DEPLETED</span>}
                  </div>
                  <div className="col-span-4 sm:col-span-3 text-right font-mono font-bold text-emerald-300">
                    {m.opt > 0 ? (
                      <div>
                        <span>${m.opt.toLocaleString()}</span>
                        <div className="text-[10px] text-emerald-400 font-sans">
                          {optDelta >= 0 ? `+${(optDelta / 1000).toFixed(0)}k vs CI` : `${(optDelta / 1000).toFixed(0)}k vs CI`}
                        </div>
                      </div>
                    ) : (
                      <span className="text-rose-400 font-bold">DEPLETED</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fiduciary Retirement Takeaway */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 space-y-1">
            <div className="text-[11px] text-zinc-400 font-bold uppercase flex items-center space-x-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>CI TAX DRAG & RMD CONSTRAINTS:</span>
            </div>
            <p className="text-zinc-400 font-sans leading-relaxed text-[11px]">
              Remaining in Current Investment avoids Day-1 friction, but subjects the Traditional IRA to mandatory SECURE 2.0 
              RMDs starting at age 75. These forced ordinary income withdrawals create taxable drag in the 80s and 90s.
            </p>
          </div>

          <div className="bg-emerald-950/30 border border-emerald-800/80 p-3.5 space-y-1">
            <div className="text-[11px] text-emerald-300 font-bold uppercase flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>AI-OPTIMIZED STAGED ROTH ADVANTAGE:</span>
            </div>
            <p className="text-zinc-300 font-sans leading-relaxed text-[11px]">
              By converting the Traditional IRA over 5 years during lower earning brackets, the AI-Optimized model eliminates 
              100% of future RMD taxes while avoiding the Day-1 bracket explosion of PI, maximizing ending wealth at Age 90.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
