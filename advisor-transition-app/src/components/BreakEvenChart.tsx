import React, { useState } from 'react';
import { PortfolioRiskMetrics } from '../types/portfolio';
import { Target, Info, AlertTriangle } from 'lucide-react';

interface BreakEvenChartProps {
  initialValue: number;
  piStartingCapital: number;
  optStartingCapital: number;
  metricsCi: PortfolioRiskMetrics;
  metricsPi: PortfolioRiskMetrics;
  metricsOpt: PortfolioRiskMetrics;
  breakEvenYearsPi: number | string;
  breakEvenYearsOpt: number;
  clientAge: number;
  retireAge: number;
}

export const BreakEvenChart: React.FC<BreakEvenChartProps> = ({
  initialValue,
  piStartingCapital,
  optStartingCapital,
  metricsCi,
  metricsPi,
  metricsOpt,
  breakEvenYearsPi,
  breakEvenYearsOpt,
  clientAge,
  retireAge,
}) => {
  const [hoverYear, setHoverYear] = useState<number | null>(null);

  // Generate Year 0 to 15 trajectories
  const horizon = 15;
  const years = Array.from({ length: horizon + 1 }, (_, i) => i);

  const trajectoryCi = years.map((y) => initialValue * Math.pow(1 + metricsCi.netCagr, y));
  const trajectoryPi = years.map((y) => piStartingCapital * Math.pow(1 + metricsPi.netCagr, y));
  const trajectoryOpt = years.map((y) => optStartingCapital * Math.pow(1 + metricsOpt.netCagr, y));

  const maxVal = Math.max(...trajectoryCi, ...trajectoryPi, ...trajectoryOpt) * 1.05;
  const minVal = Math.min(piStartingCapital, optStartingCapital, initialValue) * 0.95;

  // SVG coordinate transformation
  const svgWidth = 800;
  const svgHeight = 280;
  const padding = { top: 20, right: 30, bottom: 40, left: 70 };
  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  const getX = (year: number) => padding.left + (year / horizon) * plotWidth;
  const getY = (val: number) => padding.top + plotHeight - ((val - minVal) / (maxVal - minVal)) * plotHeight;

  const makePath = (data: number[]) => {
    return data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(v).toFixed(1)}`).join(' ');
  };

  const pathCi = makePath(trajectoryCi);
  const pathPi = makePath(trajectoryPi);
  const pathOpt = makePath(trajectoryOpt);

  const retireYearOffset = Math.max(0, retireAge - clientAge);
  const retireX = getX(Math.min(horizon, retireYearOffset));

  const activeIdx = hoverYear !== null ? hoverYear : Math.min(5, horizon);

  return (
    <div className="bg-[#090D16] border-b border-zinc-800 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-zinc-400">
              BREAK-EVEN DYNAMICS & CROSSOVER ANALYSIS //
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Recovery Timeline: Time Required to Overcome Friction Drag
            </h2>
          </div>
          <div className="flex items-center space-x-3 text-xs font-mono">
            <span className="flex items-center space-x-1.5 text-zinc-400">
              <span className="w-3 h-1 bg-zinc-400" />
              <span>CI Baseline</span>
            </span>
            <span className="flex items-center space-x-1.5 text-cyan-400">
              <span className="w-3 h-1 bg-cyan-400" />
              <span>PI (Naive)</span>
            </span>
            <span className="flex items-center space-x-1.5 text-emerald-400">
              <span className="w-3 h-1 bg-emerald-400" />
              <span>LPL AI-Opt</span>
            </span>
          </div>
        </div>

        {/* Status Callout if Break-Even is dangerously long */}
        {typeof breakEvenYearsPi === 'number' && breakEvenYearsPi > (retireAge - clientAge) && (
          <div className="bg-amber-950/40 border border-amber-600/80 p-3 text-xs font-mono text-amber-200 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold uppercase tracking-wider text-amber-300">
                CRITICAL TRANSITION DEFECT DETECTED:
              </span>{' '}
              The Proposed Investment requires <strong>{breakEvenYearsPi} years</strong> to recover transition friction, 
              which exceeds the client's accumulation horizon to retirement ({retireAge - clientAge} years). 
              The client will reach retirement with <em>less net wealth</em> under PI than by remaining in CI!
            </div>
          </div>
        )}

        {/* Interactive SVG Chart */}
        <div className="bg-[#0D1322] border border-zinc-800 p-3 relative font-mono">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible select-none">
            {/* Grid horizontal lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
              const y = padding.top + plotHeight * pct;
              const val = maxVal - pct * (maxVal - minVal);
              return (
                <g key={i}>
                  <line x1={padding.left} y1={y} x2={svgWidth - padding.right} y2={y} stroke="#1E293B" strokeDasharray="3 3" />
                  <text x={padding.left - 8} y={y + 3} textAnchor="end" fill="#64748B" fontSize="9" fontFamily="monospace">
                    ${(val / 1000).toFixed(0)}k
                  </text>
                </g>
              );
            })}

            {/* X Axis years */}
            {years.filter((y) => y % 2 === 0 || y === horizon).map((y) => {
              const x = getX(y);
              return (
                <g key={y}>
                  <line x1={x} y1={padding.top} x2={x} y2={padding.top + plotHeight} stroke="#1E293B" strokeDasharray="2 2" />
                  <text x={x} y={padding.top + plotHeight + 18} textAnchor="middle" fill="#64748B" fontSize="9" fontFamily="monospace">
                    Yr {y} (Age {clientAge + y})
                  </text>
                </g>
              );
            })}

            {/* Retirement Horizon Vertical Marker */}
            {retireYearOffset <= horizon && (
              <g>
                <line x1={retireX} y1={padding.top} x2={retireX} y2={padding.top + plotHeight} stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="4 4" />
                <rect x={retireX - 35} y={padding.top - 12} width="70" height="14" fill="#78350F" rx="0" />
                <text x={retireX} y={padding.top - 2} textAnchor="middle" fill="#FDE68A" fontSize="8" fontWeight="bold">
                  RETIRE AGE {retireAge}
                </text>
              </g>
            )}

            {/* Trajectory Paths */}
            <path d={pathCi} fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 4" />
            <path d={pathPi} fill="none" stroke="#06B6D4" strokeWidth="2.5" />
            <path d={pathOpt} fill="none" stroke="#10B981" strokeWidth="2.5" />

            {/* Break-even Crossover point for PI if within horizon */}
            {typeof breakEvenYearsPi === 'number' && breakEvenYearsPi <= horizon && (
              <g>
                <circle
                  cx={getX(breakEvenYearsPi)}
                  cy={getY(initialValue * Math.pow(1 + metricsCi.netCagr, breakEvenYearsPi))}
                  r="5"
                  fill="#06B6D4"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
                <rect
                  x={getX(breakEvenYearsPi) - 45}
                  y={getY(initialValue * Math.pow(1 + metricsCi.netCagr, breakEvenYearsPi)) - 24}
                  width="90"
                  height="16"
                  fill="#083344"
                  stroke="#06B6D4"
                />
                <text
                  x={getX(breakEvenYearsPi)}
                  y={getY(initialValue * Math.pow(1 + metricsCi.netCagr, breakEvenYearsPi)) - 13}
                  textAnchor="middle"
                  fill="#E0F2FE"
                  fontSize="8"
                  fontWeight="bold"
                >
                  PI CROSSOVER: {breakEvenYearsPi}y
                </text>
              </g>
            )}

            {/* Hover marker */}
            {hoverYear !== null && (
              <g>
                <line x1={getX(hoverYear)} y1={padding.top} x2={getX(hoverYear)} y2={padding.top + plotHeight} stroke="#FFFFFF" strokeWidth="1" strokeDasharray="2 2" />
              </g>
            )}
          </svg>

          {/* Interactive Year Slider */}
          <div className="mt-3 pt-2 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
            <div className="flex items-center space-x-2">
              <span className="text-zinc-400">INSPECT YEAR:</span>
              <input
                type="range"
                min="0"
                max={horizon}
                value={activeIdx}
                onChange={(e) => setHoverYear(parseInt(e.target.value))}
                className="w-40 accent-cyan-400 bg-zinc-800"
              />
              <span className="text-white font-bold">Year {activeIdx} (Age {clientAge + activeIdx})</span>
            </div>

            {/* Live Year Values */}
            <div className="flex items-center space-x-4 font-mono text-xs">
              <span className="text-zinc-400">
                CI: <strong className="text-zinc-200">${Math.round(trajectoryCi[activeIdx]).toLocaleString()}</strong>
              </span>
              <span className="text-cyan-400">
                PI: <strong className="text-cyan-200">${Math.round(trajectoryPi[activeIdx]).toLocaleString()}</strong>
              </span>
              <span className="text-emerald-400">
                Opt: <strong className="text-emerald-200">${Math.round(trajectoryOpt[activeIdx]).toLocaleString()}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
