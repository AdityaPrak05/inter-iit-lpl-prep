import React from 'react';
import { ClientPersona } from '../types/portfolio';
import { Users, AlertTriangle, TrendingUp, Shield, DollarSign, Clock, Layers, Flame } from 'lucide-react';

interface PersonaSelectorProps {
  personas: ClientPersona[];
  activePersonaId: string;
  onSelectPersona: (id: string) => void;
}

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  personas,
  activePersonaId,
  onSelectPersona,
}) => {
  const getBadgeIcon = (type: string) => {
    switch (type) {
      case 'balanced':
        return <Users className="w-3.5 h-3.5 text-cyan-400" />;
      case 'growth':
        return <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />;
      case 'preservation':
        return <Shield className="w-3.5 h-3.5 text-blue-400" />;
      case 'hnw_tax':
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />;
      case 'decumulation':
        return <Clock className="w-3.5 h-3.5 text-amber-400" />;
      case 'starter':
        return <DollarSign className="w-3.5 h-3.5 text-teal-400" />;
      case 'illiquid_alts':
        return <Layers className="w-3.5 h-3.5 text-purple-400" />;
      case 'dividend_trap':
        return <Flame className="w-3.5 h-3.5 text-orange-400" />;
      default:
        return <Users className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  const getBadgeLabel = (type: string) => {
    switch (type) {
      case 'balanced': return 'CASE 2.3 BENCHMARK';
      case 'growth': return 'TECH ACCUMULATOR';
      case 'preservation': return 'PRESERVATION';
      case 'hnw_tax': return 'EMBEDDED GAINS TRAP';
      case 'decumulation': return 'RMD DECUMULATION';
      case 'starter': return 'CAREER STARTER';
      case 'illiquid_alts': return 'ILLIQUID ALTS';
      case 'dividend_trap': return 'DIVIDEND TRAP';
      default: return 'CLIENT PORTFOLIO';
    }
  };

  return (
    <div className="bg-[#0B101D] border-b border-zinc-800 py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
              Select Client Scenario & Edge Case ({personas.length} Loaded):
            </span>
          </div>
          <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
            Scroll horizontally to view all archetypes →
          </span>
        </div>

        {/* Horizontal scroll container with sharp border cards */}
        <div className="flex space-x-2.5 overflow-x-auto pb-2 scrollbar-thin">
          {personas.map((p) => {
            const isActive = p.id === activePersonaId;
            const totalVal = p.ciHoldings.reduce((sum, h) => sum + h.value, 0);

            return (
              <button
                key={p.id}
                onClick={() => onSelectPersona(p.id)}
                className={`flex-shrink-0 text-left px-3 py-2 border transition-all text-xs font-mono min-w-[210px] ${
                  isActive
                    ? 'bg-zinc-900 border-cyan-400 ring-1 ring-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : 'bg-[#0E1526] border-zinc-800 hover:border-zinc-700 text-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="flex items-center space-x-1 text-[10px] tracking-wider uppercase text-zinc-400 font-bold">
                    {getBadgeIcon(p.portfolioType)}
                    <span>{getBadgeLabel(p.portfolioType)}</span>
                  </span>
                  <span className={`text-[10px] font-bold ${isActive ? 'text-cyan-400' : 'text-zinc-500'}`}>
                    AGE {p.age}
                  </span>
                </div>
                <div className="font-semibold text-zinc-100 truncate text-[13px] tracking-tight">
                  {p.name}
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-1">
                  <span className="font-mono text-zinc-200">${(totalVal / 1000).toFixed(0)}k AUM</span>
                  <span className="text-[10px] text-zinc-500">{p.state === 'DEFAULT' ? 'Fed+5%' : p.state}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
