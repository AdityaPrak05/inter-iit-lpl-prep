import React, { useState } from 'react';
import { PortfolioRiskMetrics } from '../types/portfolio';
import { BarChart3, TrendingDown, Activity, Shield, Percent } from 'lucide-react';

interface MarketRiskAnalyticsProps {
  metricsCi: PortfolioRiskMetrics;
  metricsPi: PortfolioRiskMetrics;
  metricsOpt: PortfolioRiskMetrics;
}

export const MarketRiskAnalytics: React.FC<MarketRiskAnalyticsProps> = ({
  metricsCi,
  metricsPi,
  metricsOpt,
}) => {
  const [activeWindow, setActiveWindow] = useState<'10y' | '5y' | '3y' | '1y'>('10y');

  const getCagr = (metrics: PortfolioRiskMetrics) => {
    switch (activeWindow) {
      case '1y': return metrics.grossCagr1y;
      case '3y': return metrics.grossCagr3y;
      case '5y': return metrics.grossCagr5y;
      case '10y': return metrics.grossCagr10y;
    }
  };

  const getNetCagr = (metrics: PortfolioRiskMetrics) => {
    return getCagr(metrics) - metrics.totalFeeDrag;
  };

  return (
    <div className="bg-[#090D16] border-b border-zinc-800 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-zinc-400">
              SHARE MARKET BACK-TESTING & RISK ARCHITECTURE //
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Historical Performance, Volatility & Downside Capital Preservation
            </h2>
          </div>

          {/* Timeframe Selector Pills */}
          <div className="flex items-center space-x-1.5 bg-[#0E1528] p-1 border border-zinc-800 font-mono text-xs">
            <span className="text-[10px] text-zinc-500 uppercase px-1.5">WINDOW:</span>
            {(['10y', '5y', '3y', '1y'] as const).map((w) => (
              <button
                key={w}
                onClick={() => setActiveWindow(w)}
                className={`px-2.5 py-1 text-xs font-bold uppercase transition-all ${
                  activeWindow === w
                    ? 'bg-cyan-500 text-black'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {w.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Deep Metrics Table */}
        <div className="bg-[#0C1220] border border-zinc-800 font-mono text-xs overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-[11px] text-zinc-400 uppercase bg-zinc-900/60">
                <th className="p-3 pl-4">RISK / RETURN DIMENSION</th>
                <th className="p-3 text-right">BENCHMARK / CI</th>
                <th className="p-3 text-right text-cyan-400">PROPOSED (PI)</th>
                <th className="p-3 text-right text-emerald-400">AI-OPTIMIZED (OPT)</th>
                <th className="p-3 text-left pl-6 hidden md:table-cell">FINANCIAL INTERPRETATION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {/* Row 1: Gross CAGR */}
              <tr className="hover:bg-zinc-900/40">
                <td className="p-3 pl-4 font-semibold text-zinc-200">Gross Annualized Return (CAGR)</td>
                <td className="p-3 text-right font-bold text-zinc-300">{(getCagr(metricsCi) * 100).toFixed(2)}%</td>
                <td className="p-3 text-right font-bold text-cyan-300">{(getCagr(metricsPi) * 100).toFixed(2)}%</td>
                <td className="p-3 text-right font-bold text-emerald-300">{(getCagr(metricsOpt) * 100).toFixed(2)}%</td>
                <td className="p-3 pl-6 text-[11px] text-zinc-500 hidden md:table-cell">
                  Gross returns before product fees, advisory wrap, or tax drag.
                </td>
              </tr>

              {/* Row 2: Total Fee Drag */}
              <tr className="hover:bg-zinc-900/40 bg-zinc-950/30">
                <td className="p-3 pl-4 font-semibold text-rose-300">Ongoing Fee Drag (Expense + Wrap)</td>
                <td className="p-3 text-right font-bold text-amber-400">{(metricsCi.totalFeeDrag * 100).toFixed(2)}%</td>
                <td className="p-3 text-right font-bold text-rose-400">{(metricsPi.totalFeeDrag * 100).toFixed(2)}%</td>
                <td className="p-3 text-right font-bold text-emerald-400">{(metricsOpt.totalFeeDrag * 100).toFixed(2)}%</td>
                <td className="p-3 pl-6 text-[11px] text-zinc-500 hidden md:table-cell">
                  PI adds advisory wrap drag; AI-Opt uses ultra-low cost institutional ETFs.
                </td>
              </tr>

              {/* Row 3: Net CAGR */}
              <tr className="hover:bg-zinc-900/40 font-bold">
                <td className="p-3 pl-4 text-white">Net Annualized Return (After Fees)</td>
                <td className="p-3 text-right text-zinc-200">{(getNetCagr(metricsCi) * 100).toFixed(2)}%</td>
                <td className="p-3 text-right text-cyan-300">{(getNetCagr(metricsPi) * 100).toFixed(2)}%</td>
                <td className="p-3 text-right text-emerald-300">{(getNetCagr(metricsOpt) * 100).toFixed(2)}%</td>
                <td className="p-3 pl-6 text-[11px] text-zinc-400 font-normal hidden md:table-cell">
                  Effective compounding rate realized by investor.
                </td>
              </tr>

              {/* Row 4: Annualized Volatility */}
              <tr className="hover:bg-zinc-900/40">
                <td className="p-3 pl-4 text-zinc-300">Annualized Volatility (Std Dev σ)</td>
                <td className="p-3 text-right text-zinc-400">{(metricsCi.volatility * 100).toFixed(2)}%</td>
                <td className="p-3 text-right text-amber-400">{(metricsPi.volatility * 100).toFixed(2)}%</td>
                <td className="p-3 text-right text-emerald-400">{(metricsOpt.volatility * 100).toFixed(2)}%</td>
                <td className="p-3 pl-6 text-[11px] text-zinc-500 hidden md:table-cell">
                  PI experiences significantly wider variance due to tech tilt.
                </td>
              </tr>

              {/* Row 5: Sharpe Ratio */}
              <tr className="hover:bg-zinc-900/40">
                <td className="p-3 pl-4 text-zinc-300">Sharpe Ratio (Risk-Free = 4.2%)</td>
                <td className="p-3 text-right text-zinc-300">{metricsCi.sharpeRatio}</td>
                <td className="p-3 text-right text-cyan-300">{metricsPi.sharpeRatio}</td>
                <td className="p-3 text-right font-bold text-emerald-300">{metricsOpt.sharpeRatio}</td>
                <td className="p-3 pl-6 text-[11px] text-zinc-500 hidden md:table-cell">
                  Higher Sharpe denotes superior excess return per unit of total risk.
                </td>
              </tr>

              {/* Row 6: Sortino Ratio */}
              <tr className="hover:bg-zinc-900/40">
                <td className="p-3 pl-4 text-zinc-300">Sortino Ratio (Downside Semi-Variance)</td>
                <td className="p-3 text-right text-zinc-300">{metricsCi.sortinoRatio}</td>
                <td className="p-3 text-right text-cyan-300">{metricsPi.sortinoRatio}</td>
                <td className="p-3 text-right font-bold text-emerald-300">{metricsOpt.sortinoRatio}</td>
                <td className="p-3 pl-6 text-[11px] text-zinc-500 hidden md:table-cell">
                  Penalizes exclusively downside losses, protecting near-retirees.
                </td>
              </tr>

              {/* Row 7: Max Drawdown */}
              <tr className="hover:bg-zinc-900/40">
                <td className="p-3 pl-4 text-zinc-300">Historical Max Drawdown</td>
                <td className="p-3 text-right text-zinc-400">{(metricsCi.maxDrawdown * 100).toFixed(1)}%</td>
                <td className="p-3 text-right text-rose-400 font-bold">{(metricsPi.maxDrawdown * 100).toFixed(1)}%</td>
                <td className="p-3 text-right text-emerald-400">{(metricsOpt.maxDrawdown * 100).toFixed(1)}%</td>
                <td className="p-3 pl-6 text-[11px] text-zinc-500 hidden md:table-cell">
                  Worst peak-to-trough drop observed during market corrections.
                </td>
              </tr>

              {/* Row 8: Beta to S&P 500 */}
              <tr className="hover:bg-zinc-900/40">
                <td className="p-3 pl-4 text-zinc-300">Beta to S&P 500 Benchmark</td>
                <td className="p-3 text-right text-zinc-400">{metricsCi.beta}</td>
                <td className="p-3 text-right text-amber-300 font-bold">{metricsPi.beta}</td>
                <td className="p-3 text-right text-emerald-300">{metricsOpt.beta}</td>
                <td className="p-3 pl-6 text-[11px] text-zinc-500 hidden md:table-cell">
                  PI beta {metricsPi.beta} denotes aggressive systemic market sensitivity.
                </td>
              </tr>

              {/* Row 9: VaR 95% */}
              <tr className="hover:bg-zinc-900/40">
                <td className="p-3 pl-4 text-zinc-300">Value at Risk (VaR 95% 1-Year)</td>
                <td className="p-3 text-right text-zinc-400">{(metricsCi.var95 * 100).toFixed(1)}%</td>
                <td className="p-3 text-right text-rose-400">{(metricsPi.var95 * 100).toFixed(1)}%</td>
                <td className="p-3 text-right text-emerald-400">{(metricsOpt.var95 * 100).toFixed(1)}%</td>
                <td className="p-3 pl-6 text-[11px] text-zinc-500 hidden md:table-cell">
                  Maximum expected loss over 1 year at a 95% statistical confidence level.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
