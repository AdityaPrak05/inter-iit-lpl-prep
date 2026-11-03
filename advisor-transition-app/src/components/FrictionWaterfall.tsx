import React from 'react';
import { TransitionFrictionDetails } from '../types/portfolio';
import { DollarSign, ShieldAlert, ArrowDownRight, CheckCircle2 } from 'lucide-react';

interface FrictionWaterfallProps {
  initialValue: number;
  frictionPi: TransitionFrictionDetails;
  frictionOpt: TransitionFrictionDetails;
}

export const FrictionWaterfall: React.FC<FrictionWaterfallProps> = ({
  initialValue,
  frictionPi,
  frictionOpt,
}) => {
  const frictionItems = [
    {
      label: 'Capital Gains Tax (Taxable Liquidation)',
      piAmount: frictionPi.capGainsTax,
      optAmount: frictionOpt.capGainsTax,
      desc: 'Realized LTCG + NIIT (3.8%) + State taxes on appreciated non-retirement assets.',
    },
    {
      label: 'Exit & Surrender Penalties',
      piAmount: frictionPi.exitSurrenderFees,
      optAmount: frictionOpt.exitSurrenderFees,
      desc: 'Early redemption fees on mutual funds and annuity early surrender charges.',
    },
    {
      label: 'Roth Conversion Ordinary Income Tax',
      piAmount: frictionPi.rothConversionTax,
      optAmount: frictionOpt.rothConversionTax,
      desc: 'Lump-sum conversion in PI triggers top bracket spike; Opt stages across 5 years.',
    },
    {
      label: 'Brokerage Slippage & Transaction Costs',
      piAmount: frictionPi.transactionCosts,
      optAmount: frictionOpt.transactionCosts,
      desc: 'Bid-ask spread, rebalancing commission, and administrative execution costs.',
    },
  ];

  const totalSaved = frictionPi.totalFriction - frictionOpt.totalFriction;

  return (
    <div className="bg-[#0A0F1D] border-b border-zinc-800 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-zinc-400">
              SECTION 2.2 TRANSITION FRICTION WATERFALL //
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Quantification of Realized Transition Drag & Friction Leakage
            </h2>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="text-zinc-400">LPL AI STAGING PRESERVES:</span>
            <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-600 text-emerald-300 font-bold">
              +${totalSaved.toLocaleString()} DAY-1 CAPITAL
            </span>
          </div>
        </div>

        {/* Detailed Comparison Table / Waterfall Cards */}
        <div className="bg-[#0E1528] border border-zinc-800 p-4 font-mono">
          <div className="grid grid-cols-12 gap-2 pb-2 border-b border-zinc-800 text-[11px] text-zinc-400 font-bold uppercase">
            <div className="col-span-12 sm:col-span-6">FRICTION COMPONENT</div>
            <div className="col-span-6 sm:col-span-3 text-right text-rose-400">PROPOSED (PI) DRAG</div>
            <div className="col-span-6 sm:col-span-3 text-right text-emerald-400">AI-OPTIMIZED DRAG</div>
          </div>

          <div className="divide-y divide-zinc-800/60">
            {frictionItems.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 py-2.5 items-center text-xs">
                <div className="col-span-12 sm:col-span-6">
                  <div className="font-semibold text-zinc-200">{item.label}</div>
                  <div className="text-[10px] text-zinc-500 font-sans">{item.desc}</div>
                </div>
                <div className="col-span-6 sm:col-span-3 text-right font-bold text-rose-300">
                  {item.piAmount > 0 ? `-$${item.piAmount.toLocaleString()}` : '$0'}
                </div>
                <div className="col-span-6 sm:col-span-3 text-right font-bold text-emerald-300">
                  {item.optAmount > 0 ? `-$${item.optAmount.toLocaleString()}` : '$0'}
                </div>
              </div>
            ))}

            {/* Total Row */}
            <div className="grid grid-cols-12 gap-2 pt-3 border-t-2 border-zinc-700 items-center text-xs font-bold">
              <div className="col-span-12 sm:col-span-6 text-zinc-300 uppercase tracking-wider">
                TOTAL IMMEDIATE DAY-1 TRANSITION DRAG:
              </div>
              <div className="col-span-6 sm:col-span-3 text-right text-rose-400 text-sm">
                -${frictionPi.totalFriction.toLocaleString()} ({frictionPi.frictionPct}%)
              </div>
              <div className="col-span-6 sm:col-span-3 text-right text-emerald-400 text-sm">
                -${frictionOpt.totalFriction.toLocaleString()} ({frictionOpt.frictionPct}%)
              </div>
            </div>

            {/* Post Friction Capital */}
            <div className="grid grid-cols-12 gap-2 pt-2 items-center text-xs font-bold bg-zinc-900/60 p-2 border border-zinc-800 mt-2">
              <div className="col-span-12 sm:col-span-6 text-zinc-100 uppercase tracking-wider">
                NET STARTING CAPITAL FOR COMPOUNDING:
              </div>
              <div className="col-span-6 sm:col-span-3 text-right text-cyan-300 text-sm">
                ${frictionPi.netStartingCapital.toLocaleString()}
              </div>
              <div className="col-span-6 sm:col-span-3 text-right text-emerald-300 text-sm">
                ${frictionOpt.netStartingCapital.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Visual Bar Comparison */}
        <div className="space-y-1.5 font-mono text-xs">
          <div className="text-[11px] text-zinc-400 uppercase">Capital Preservation Ratio:</div>
          <div className="w-full bg-zinc-900 h-6 border border-zinc-800 flex overflow-hidden">
            <div
              className="bg-cyan-600 h-full flex items-center justify-center text-[10px] text-black font-bold"
              style={{ width: `${(frictionPi.netStartingCapital / initialValue) * 100}%` }}
              title={`PI Net: $${frictionPi.netStartingCapital.toLocaleString()}`}
            >
              PI NET: {((frictionPi.netStartingCapital / initialValue) * 100).toFixed(1)}%
            </div>
            <div
              className="bg-rose-600 h-full flex items-center justify-center text-[10px] text-white font-bold"
              style={{ width: `${(frictionPi.totalFriction / initialValue) * 100}%` }}
              title={`PI Friction Drag: $${frictionPi.totalFriction.toLocaleString()}`}
            >
              DRAG: {frictionPi.frictionPct}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
