import React from 'react';
import { TransitionEvaluationResult, ClientPersona } from '../types/portfolio';
import { AlertOctagon, CheckCircle2, TrendingUp, DollarSign, Clock, ShieldAlert, ArrowRight } from 'lucide-react';

interface ExecutiveBannerProps {
  evaluation: TransitionEvaluationResult;
  persona: ClientPersona;
}

export const ExecutiveBanner: React.FC<ExecutiveBannerProps> = ({ evaluation, persona }) => {
  const isRejected = evaluation.verdictBadge === 'REJECT_PI';
  const friction = evaluation.frictionPi;
  const optFriction = evaluation.frictionOpt;

  return (
    <div className="bg-[#0A0F1D] border-b border-zinc-800 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Top Header Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                CLIENT DOSSIER //
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {persona.name}
              </h1>
              <span className="px-2 py-0.5 text-xs font-mono uppercase bg-zinc-800 text-zinc-300 border border-zinc-700">
                AGE {persona.age} → RETIRE {persona.retireAge}
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-1">
              {persona.subtitle}
            </p>
          </div>

          {/* Status Verdict Pill */}
          <div className="flex items-center">
            {isRejected ? (
              <div className="flex items-center space-x-2 bg-rose-950/80 border-2 border-rose-600 px-4 py-2 text-rose-200">
                <AlertOctagon className="w-5 h-5 text-rose-400 flex-shrink-0" />
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-rose-400 font-bold">
                    ADVISOR TRANSITION DIRECTIVE
                  </div>
                  <div className="text-sm font-bold tracking-tight text-white">
                    REJECT PROPOSED TRANSITION (PI)
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2 bg-emerald-950/80 border-2 border-emerald-600 px-4 py-2 text-emerald-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                    ADVISOR TRANSITION DIRECTIVE
                  </div>
                  <div className="text-sm font-bold tracking-tight text-white">
                    CONDITIONAL APPROVAL // STAGED TRANSITION
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4 Key Quantitative Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Card 1: Initial Wealth */}
          <div className="bg-[#0F1628] border border-zinc-800 p-3.5 relative overflow-hidden">
            <div className="text-[11px] font-mono uppercase text-zinc-400 flex items-center justify-between">
              <span>PORTFOLIO BASELINE</span>
              <DollarSign className="w-3.5 h-3.5 text-zinc-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
              ${evaluation.initialValue.toLocaleString()}
            </div>
            <div className="text-[10px] font-mono text-zinc-500 mt-1">
              Current Investment (CI) Assets
            </div>
            <div className="absolute top-0 left-0 w-1 h-full bg-zinc-600" />
          </div>

          {/* Card 2: Immediate Friction */}
          <div className="bg-[#0F1628] border border-zinc-800 p-3.5 relative overflow-hidden">
            <div className="text-[11px] font-mono uppercase text-zinc-400 flex items-center justify-between">
              <span>DAY-1 FRICTION DRAG</span>
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-rose-400 mt-1">
              -${friction.totalFriction.toLocaleString()}
            </div>
            <div className="text-[10px] font-mono text-zinc-400 mt-1 flex items-center justify-between">
              <span>Drag: {friction.frictionPct}% of principal</span>
              <span className="text-emerald-400">Opt: -${optFriction.totalFriction.toLocaleString()}</span>
            </div>
            <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
          </div>

          {/* Card 3: Break-Even Horizon */}
          <div className="bg-[#0F1628] border border-zinc-800 p-3.5 relative overflow-hidden">
            <div className="text-[11px] font-mono uppercase text-zinc-400 flex items-center justify-between">
              <span>PI BREAK-EVEN TIME</span>
              <Clock className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-amber-300 mt-1">
              {evaluation.breakEvenYearsPi} {typeof evaluation.breakEvenYearsPi === 'number' ? 'Years' : ''}
            </div>
            <div className="text-[10px] font-mono text-zinc-400 mt-1 flex items-center justify-between">
              <span>Retire Horizon: {persona.retireAge - persona.age} yrs</span>
              <span className="text-emerald-400 font-bold">Opt: {evaluation.breakEvenYearsOpt} yrs</span>
            </div>
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
          </div>

          {/* Card 4: Age 90 Longevity Outcome */}
          <div className="bg-[#0F1628] border border-zinc-800 p-3.5 relative overflow-hidden">
            <div className="text-[11px] font-mono uppercase text-zinc-400 flex items-center justify-between">
              <span>AGE 90 NET WEALTH</span>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-1">
              ${(evaluation.longevityOpt.age90 / 1000000).toFixed(2)}M
            </div>
            <div className="text-[10px] font-mono text-zinc-400 mt-1 flex items-center justify-between">
              <span>CI: ${(evaluation.longevityCi.age90 / 1000000).toFixed(2)}M</span>
              <span className="text-cyan-400">PI: ${(evaluation.longevityPi.age90 / 1000000).toFixed(2)}M</span>
            </div>
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
          </div>
        </div>

        {/* Explainable AI Rationale Box */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-3 sm:p-4 text-xs font-mono space-y-1.5">
          <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-bold flex items-center space-x-1.5">
            <span>EXECUTIVE RATIONALE & FIDUCIARY ANALYSIS:</span>
          </div>
          <div className="text-zinc-300 leading-relaxed">
            {evaluation.verdictHeadline}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 text-zinc-400">
            {evaluation.keyInsights.map((insight, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>{insight}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
