import React from 'react';
import { ClientPersona, TransitionEvaluationResult } from '../types/portfolio';
import { X, Printer, ShieldCheck, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

interface InvestorProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  persona: ClientPersona;
  evaluation: TransitionEvaluationResult;
}

export const InvestorProposalModal: React.FC<InvestorProposalModalProps> = ({
  isOpen,
  onClose,
  persona,
  evaluation,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const isRejected = evaluation.verdictBadge === 'REJECT_PI';
  const friction = evaluation.frictionPi;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white">
      <div className="bg-[#0B101D] border-2 border-zinc-700 w-full max-w-4xl text-zinc-100 font-sans shadow-2xl relative print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Modal Controls Bar */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-[#070B14] no-print">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span className="font-mono text-xs uppercase tracking-wider text-white font-bold">
              INVESTOR-READY TRANSITION PROPOSAL // FIDUCIARY EVALUATION REPORT
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 text-xs font-mono tracking-wider border border-zinc-600 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span>PRINT / EXPORT PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Proposal Document Body (Styled for both Screen & Print) */}
        <div className="p-6 sm:p-10 space-y-8 font-sans max-h-[85vh] overflow-y-auto print:max-h-none print:overflow-visible text-sm leading-relaxed">
          {/* Document Header */}
          <div className="border-b-2 border-zinc-700 pb-6 print:border-black">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold print:text-blue-800">
                  LPL FINANCIAL // PRIVATE WEALTH ADVISORY TRANSITION PROPOSAL
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1 print:text-black">
                  Investment Transition & Fiduciary Net Outcome Analysis
                </h1>
                <p className="text-xs font-mono text-zinc-400 mt-1 print:text-zinc-600">
                  Prepared For: <strong className="text-zinc-200 print:text-black">{persona.name}</strong> | Age: {persona.age} | State: {persona.state} | Filing: {persona.filingStatus}
                </p>
              </div>
              <div className="text-right font-mono text-xs text-zinc-400 print:text-zinc-600">
                <div>DATE: NOVEMBER 2026</div>
                <div>SECURE 2.0 / TCJA COMPLIANT</div>
              </div>
            </div>
          </div>

          {/* Section 1: Executive Summary & Recommendation */}
          <div className="space-y-3">
            <h2 className="text-base font-bold font-mono uppercase tracking-wider text-cyan-300 print:text-blue-900 border-b border-zinc-800 pb-1">
              1. Executive Transition Directive & Recommendation
            </h2>
            <div
              className={`p-4 border-2 ${
                isRejected
                  ? 'bg-rose-950/30 border-rose-600 text-rose-100 print:bg-red-50 print:text-red-900 print:border-red-600'
                  : 'bg-emerald-950/30 border-emerald-600 text-emerald-100 print:bg-green-50 print:text-green-900 print:border-green-600'
              }`}
            >
              <div className="font-bold text-base mb-1 font-mono">
                {isRejected ? 'RECOMMENDATION: DO NOT PROCEED WITH PROPOSED INVESTMENT (PI) AS CURRENTLY STRUCTURED' : 'RECOMMENDATION: CONDITIONAL TRANSITION APPROVED WITH STAGING'}
              </div>
              <p className="text-xs leading-relaxed">
                {evaluation.verdictHeadline}
              </p>
            </div>
          </div>

          {/* Section 2: Why Transition Was Considered */}
          <div className="space-y-2">
            <h2 className="text-base font-bold font-mono uppercase tracking-wider text-cyan-300 print:text-blue-900 border-b border-zinc-800 pb-1">
              2. Strategic Objectives & Alignment with Client Goals
            </h2>
            <p className="text-xs text-zinc-300 print:text-zinc-800">
              The client expressed interest in evaluating whether transitioning out of existing mutual funds, annuities, and Traditional IRA holdings 
              into high-growth Nasdaq equities, a new annuity contract, and a full Roth conversion could enhance net retirement wealth. 
              While gross projected returns for the Proposed Investment appeared superior on paper (+2.1% nominal spread), our fiduciary analysis 
              quantifies that immediate taxes, surrender charges, and fee drag materially erode client wealth before retirement.
            </p>
          </div>

          {/* Section 3: Transparent Financial & Friction Comparison Table */}
          <div className="space-y-2">
            <h2 className="text-base font-bold font-mono uppercase tracking-wider text-cyan-300 print:text-blue-900 border-b border-zinc-800 pb-1">
              3. Gross vs. Net Value Comparison & Transition Drag Audit
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border border-zinc-800 text-xs font-mono print:border-black">
                <thead>
                  <tr className="bg-zinc-900 text-zinc-300 print:bg-zinc-200 print:text-black">
                    <th className="p-2.5 border-b border-zinc-800">METRIC</th>
                    <th className="p-2.5 border-b border-zinc-800 text-right">CURRENT (CI)</th>
                    <th className="p-2.5 border-b border-zinc-800 text-right">PROPOSED (PI)</th>
                    <th className="p-2.5 border-b border-zinc-800 text-right font-bold text-emerald-400 print:text-green-800">LPL AI-OPTIMIZED (OPT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 print:divide-zinc-300">
                  <tr>
                    <td className="p-2 text-zinc-400 print:text-black">Starting Portfolio Principal</td>
                    <td className="p-2 text-right">${evaluation.initialValue.toLocaleString()}</td>
                    <td className="p-2 text-right">${evaluation.initialValue.toLocaleString()}</td>
                    <td className="p-2 text-right">${evaluation.initialValue.toLocaleString()}</td>
                  </tr>
                  <tr className="bg-rose-950/20 print:bg-red-50">
                    <td className="p-2 text-rose-300 font-bold">Immediate Transition Drag (Friction)</td>
                    <td className="p-2 text-right font-bold">$0 (0.0%)</td>
                    <td className="p-2 text-right text-rose-400 font-bold">-${friction.totalFriction.toLocaleString()} ({friction.frictionPct}%)</td>
                    <td className="p-2 text-right text-emerald-400 font-bold">-${evaluation.frictionOpt.totalFriction.toLocaleString()} ({evaluation.frictionOpt.frictionPct}%)</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-zinc-400 print:text-black">Net Day-1 Invested Principal</td>
                    <td className="p-2 text-right font-bold">${evaluation.initialValue.toLocaleString()}</td>
                    <td className="p-2 text-right font-bold text-cyan-300">${friction.netStartingCapital.toLocaleString()}</td>
                    <td className="p-2 text-right font-bold text-emerald-400">${evaluation.frictionOpt.netStartingCapital.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-zinc-400 print:text-black">Gross Annualized Expected Return</td>
                    <td className="p-2 text-right">{(evaluation.metricsCi.grossCagr10y * 100).toFixed(2)}%</td>
                    <td className="p-2 text-right">{(evaluation.metricsPi.grossCagr10y * 100).toFixed(2)}%</td>
                    <td className="p-2 text-right">{(evaluation.metricsOpt.grossCagr10y * 100).toFixed(2)}%</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-zinc-400 print:text-black">Annual Fee Drag (Expense + Advisory)</td>
                    <td className="p-2 text-right">{(evaluation.metricsCi.totalFeeDrag * 100).toFixed(2)}%</td>
                    <td className="p-2 text-right text-rose-400">{(evaluation.metricsPi.totalFeeDrag * 100).toFixed(2)}%</td>
                    <td className="p-2 text-right text-emerald-400">{(evaluation.metricsOpt.totalFeeDrag * 100).toFixed(2)}%</td>
                  </tr>
                  <tr className="font-bold bg-zinc-900/60 print:bg-zinc-100">
                    <td className="p-2 text-white print:text-black">Break-Even Horizon (Recovery Time)</td>
                    <td className="p-2 text-right">0.0 Years</td>
                    <td className="p-2 text-right text-amber-300">{evaluation.breakEvenYearsPi} Years</td>
                    <td className="p-2 text-right text-emerald-400">{evaluation.breakEvenYearsOpt} Years</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-zinc-400 print:text-black">Projected Wealth at Retirement (Age 60)</td>
                    <td className="p-2 text-right">${evaluation.longevityCi.age60.toLocaleString()}</td>
                    <td className="p-2 text-right">${evaluation.longevityPi.age60.toLocaleString()}</td>
                    <td className="p-2 text-right font-bold text-emerald-400">${evaluation.longevityOpt.age60.toLocaleString()}</td>
                  </tr>
                  <tr className="font-bold bg-emerald-950/20 print:bg-green-50">
                    <td className="p-2 text-white print:text-black">Terminal Wealth at Age 90</td>
                    <td className="p-2 text-right">${evaluation.longevityCi.age90.toLocaleString()}</td>
                    <td className="p-2 text-right text-cyan-300">${evaluation.longevityPi.age90.toLocaleString()}</td>
                    <td className="p-2 text-right text-emerald-400 font-bold">${evaluation.longevityOpt.age90.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Hidden Costs & Fiduciary Caveats */}
          <div className="space-y-2 text-xs">
            <h2 className="text-base font-bold font-mono uppercase tracking-wider text-cyan-300 print:text-blue-900 border-b border-zinc-800 pb-1">
              4. Hidden Costs, Tax Inefficiencies & Trade-Offs Disclosed
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-300 print:text-zinc-800">
              <li>
                <strong>Annuity Surrender Penalty:</strong> Surrendering the Vanguard Annuity incurs a 1.5% surrender fee ($1,500) 
                to acquire a Fidelity annuity offering only 25 bps of additional return. It requires 6.8 years just to break even on the penalty alone.
              </li>
              <li>
                <strong>Ordinary Tax Spike on Lump-Sum Roth Conversion:</strong> Converting $200,000 in a single tax year pushes the client into 
                higher marginal federal and state tax brackets, inflicting $58,000 in avoidable taxation.
              </li>
              <li>
                <strong>Elevated Sequence of Returns Risk:</strong> The proposed 100% Nasdaq equity allocation increases portfolio beta to {evaluation.metricsPi.beta} 
                and increases peak-to-trough crash risk to {(evaluation.metricsPi.maxDrawdown * 100).toFixed(1)}%.
              </li>
            </ul>
          </div>

          {/* Section 5: The Fiduciary Alternative: LPL AI-Optimized Staged Strategy */}
          <div className="space-y-2 text-xs">
            <h2 className="text-base font-bold font-mono uppercase tracking-wider text-cyan-300 print:text-blue-900 border-b border-zinc-800 pb-1">
              5. The Recommended Alternative: LPL AI-Optimized Staged Strategy
            </h2>
            <p className="text-zinc-300 print:text-zinc-800">
              Rather than a naive transition, we recommend adopting the <strong>LPL AI-Optimized Staged Strategy</strong>:
            </p>
            <ol className="list-decimal pl-5 space-y-1 text-zinc-300 print:text-zinc-800">
              <li><strong>Retain Existing Vanguard Annuity:</strong> Avoid the $1,500 surrender fee and protect guaranteed lifetime income.</li>
              <li><strong>Stage Roth Conversion Over 5 Years ($40k/yr):</strong> Utilizes lower tax brackets, saving ~$14,000 in upfront taxes.</li>
              <li><strong>Core-Satellite Equity Architecture:</strong> Replaces high-fee active funds with low-cost core factor ETFs (VOO/QQQM) at 0.06% blended fee.</li>
              <li><strong>Direct Indexing Tax Management:</strong> Systematically pairs losses to eliminate capital gains realization on taxable transfers.</li>
            </ol>
          </div>

          {/* Signatures & Disclosures */}
          <div className="pt-6 border-t border-zinc-700 text-[11px] font-mono text-zinc-500 space-y-2 print:text-zinc-600">
            <div>
              <strong>STATUTORY GUARDRAIL & REGULATORY DISCLOSURE:</strong> Historical backtests and simulated projections 
              serve as evidence of decision-making rigor and do not guarantee future performance. Securities and advisory services 
              offered through LPL Financial, a registered investment advisor, Member FINRA/SIPC.
            </div>
            <div className="flex justify-between items-center pt-4">
              <div>Advisor Signature: ___________________________</div>
              <div>Client Acceptance: ___________________________</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
