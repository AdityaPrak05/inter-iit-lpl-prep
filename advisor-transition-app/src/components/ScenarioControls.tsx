import React from 'react';
import { ClientPersona } from '../types/portfolio';
import { X, RotateCcw, Sliders, DollarSign, Percent, Calendar } from 'lucide-react';

interface ScenarioControlsProps {
  isOpen: boolean;
  onClose: () => void;
  persona: ClientPersona;
  onUpdatePersona: (updated: Partial<ClientPersona>) => void;
  onResetPersona: () => void;
}

export const ScenarioControls: React.FC<ScenarioControlsProps> = ({
  isOpen,
  onClose,
  persona,
  onUpdatePersona,
  onResetPersona,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0D1322] border-2 border-zinc-700 w-full max-w-xl text-zinc-100 font-mono shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-[#090D16]">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span className="text-xs uppercase tracking-wider text-white font-bold">
              SCENARIO PARAMETER ENGINE // REAL-TIME CALIBRATION
            </span>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* State of Residence */}
          <div className="space-y-1.5">
            <label className="text-zinc-400 uppercase text-[11px] block">
              STATE OF RESIDENCE & TAX PROFILE:
            </label>
            <select
              value={persona.state}
              onChange={(e) => onUpdatePersona({ state: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-700 p-2 text-zinc-200 font-mono focus:border-cyan-400 outline-none"
            >
              <option value="DEFAULT">Default US Composite State Tax (5.0%)</option>
              <option value="CA">California (9.3% State Income Tax)</option>
              <option value="NY">New York (6.85% State + 3.87% NYC Tax)</option>
              <option value="FL">Florida (0.0% State Income Tax)</option>
              <option value="TX">Texas (0.0% State Income Tax)</option>
              <option value="WA">Washington (0.0% Income / 7% High LTCG)</option>
              <option value="PA">Pennsylvania (3.07% Flat Income Tax)</option>
            </select>
          </div>

          {/* Annual Household Income */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-zinc-400 uppercase text-[11px]">
              <span>ANNUAL HOUSEHOLD INCOME:</span>
              <span className="text-cyan-400 font-bold">${persona.annualIncome.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="50000"
              max="600000"
              step="10000"
              value={persona.annualIncome}
              onChange={(e) => onUpdatePersona({ annualIncome: parseInt(e.target.value) })}
              className="w-full accent-cyan-400 bg-zinc-800 h-2"
            />
          </div>

          {/* Retirement Age */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-zinc-400 uppercase text-[11px]">
              <span>TARGET RETIREMENT AGE:</span>
              <span className="text-amber-400 font-bold">AGE {persona.retireAge}</span>
            </div>
            <input
              type="range"
              min={Math.max(50, persona.age)}
              max="72"
              value={persona.retireAge}
              onChange={(e) => onUpdatePersona({ retireAge: parseInt(e.target.value) })}
              className="w-full accent-amber-400 bg-zinc-800 h-2"
            />
          </div>

          {/* Annual Retirement Withdrawal */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-zinc-400 uppercase text-[11px]">
              <span>ANNUAL RETIREMENT CASH NEED:</span>
              <span className="text-emerald-400 font-bold">${persona.withdrawalNeed.toLocaleString()} / YEAR</span>
            </div>
            <input
              type="range"
              min="20000"
              max="180000"
              step="5000"
              value={persona.withdrawalNeed}
              onChange={(e) => onUpdatePersona({ withdrawalNeed: parseInt(e.target.value) })}
              className="w-full accent-emerald-400 bg-zinc-800 h-2"
            />
          </div>

          {/* Inflation Rate */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-zinc-400 uppercase text-[11px]">
              <span>EXPECTED ANNUAL INFLATION RATE:</span>
              <span className="text-zinc-200 font-bold">{(persona.inflationRate * 100).toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0.015"
              max="0.060"
              step="0.001"
              value={persona.inflationRate}
              onChange={(e) => onUpdatePersona({ inflationRate: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400 bg-zinc-800 h-2"
            />
          </div>

          {/* Action buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
            <button
              onClick={onResetPersona}
              className="flex items-center space-x-1.5 text-zinc-400 hover:text-zinc-200 text-xs py-1.5 px-3 bg-zinc-900 border border-zinc-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET DEFAULTS</span>
            </button>
            <button
              onClick={onClose}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-4 py-2 text-xs uppercase tracking-wider"
            >
              APPLY & RECALCULATE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
