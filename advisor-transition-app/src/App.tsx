import React, { useState, useMemo } from 'react';
import { SAMPLE_PERSONAS } from './data/samplePortfolios';
import { evaluateAdvisorTransition } from './utils/financialCalculations';
import { Navbar } from './components/Navbar';
import { PersonaSelector } from './components/PersonaSelector';
import { ExecutiveBanner } from './components/ExecutiveBanner';
import { HoldingsMatrix } from './components/HoldingsMatrix';
import { FrictionWaterfall } from './components/FrictionWaterfall';
import { BreakEvenChart } from './components/BreakEvenChart';
import { LongevitySimulator } from './components/LongevitySimulator';
import { MarketRiskAnalytics } from './components/MarketRiskAnalytics';
import { StressTestGrid } from './components/StressTestGrid';
import { MonteCarloGauge } from './components/MonteCarloGauge';
import { InvestorProposalModal } from './components/InvestorProposalModal';
import { ScenarioControls } from './components/ScenarioControls';
import { ClientPersona } from './types/portfolio';
import { Layers, BarChart2, ShieldAlert, Clock, TrendingUp, Sparkles } from 'lucide-react';

export function App() {
  const [activePersonaId, setActivePersonaId] = useState<string>('persona_1_reference_case');
  const [personaOverrides, setPersonaOverrides] = useState<Record<string, Partial<ClientPersona>>>({});
  const [isProposalOpen, setIsProposalOpen] = useState<boolean>(false);
  const [isControlsOpen, setIsControlsOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'all' | 'holdings' | 'friction' | 'breakeven' | 'longevity' | 'risk' | 'montecarlo'>('all');

  // Find active persona with any live user overrides applied
  const basePersona = useMemo(() => {
    return SAMPLE_PERSONAS.find((p) => p.id === activePersonaId) || SAMPLE_PERSONAS[0];
  }, [activePersonaId]);

  const currentPersona = useMemo(() => {
    const overrides = personaOverrides[activePersonaId] || {};
    return { ...basePersona, ...overrides };
  }, [basePersona, personaOverrides, activePersonaId]);

  // Compute live mathematical evaluation
  const evaluation = useMemo(() => {
    return evaluateAdvisorTransition(currentPersona);
  }, [currentPersona]);

  const handleUpdatePersona = (updated: Partial<ClientPersona>) => {
    setPersonaOverrides((prev) => ({
      ...prev,
      [activePersonaId]: { ...(prev[activePersonaId] || {}), ...updated },
    }));
  };

  const handleResetPersona = () => {
    setPersonaOverrides((prev) => {
      const copy = { ...prev };
      delete copy[activePersonaId];
      return copy;
    });
  };

  const handleExportData = () => {
    // Generate JSON and trigger browser download
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(evaluation, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `lpl_transition_results_${currentPersona.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-[#080C15] text-zinc-100 selection:bg-cyan-500 selection:text-black">
      {/* Top Navbar */}
      <Navbar
        onOpenProposal={() => setIsProposalOpen(true)}
        onOpenControls={() => setIsControlsOpen(true)}
        onExportData={handleExportData}
      />

      {/* Edge Case Persona Selector */}
      <PersonaSelector
        personas={SAMPLE_PERSONAS}
        activePersonaId={activePersonaId}
        onSelectPersona={(id) => setActivePersonaId(id)}
      />

      {/* Main Executive Verdict & Overview Banner */}
      <ExecutiveBanner evaluation={evaluation} persona={currentPersona} />

      {/* View Filter Tabs */}
      <div className="border-b border-zinc-800 bg-[#090D18] sticky top-16 z-30 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 py-1.5 font-mono text-xs">
          {[
            { id: 'all', label: 'FULL COGNITIVE SUITE' },
            { id: 'holdings', label: '1. HOLDINGS ARCHITECTURE' },
            { id: 'friction', label: '2. FRICTION WATERFALL' },
            { id: 'breakeven', label: '3. BREAK-EVEN CROSSOVER' },
            { id: 'longevity', label: '4. RETIREMENT LONGEVITY' },
            { id: 'risk', label: '5. MARKET RISK BACKTEST' },
            { id: 'montecarlo', label: '6. STRESS TESTS & MONTE CARLO' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 font-bold uppercase transition-all whitespace-nowrap border ${
                activeTab === tab.id
                  ? 'bg-zinc-800 text-cyan-400 border-cyan-500/80'
                  : 'text-zinc-400 hover:text-zinc-200 border-transparent hover:bg-zinc-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Analysis Body */}
      <main className="pb-16 space-y-0">
        {(activeTab === 'all' || activeTab === 'holdings') && (
          <HoldingsMatrix
            persona={currentPersona}
            metricsCi={evaluation.metricsCi}
            metricsPi={evaluation.metricsPi}
            metricsOpt={evaluation.metricsOpt}
            piStartingCapital={evaluation.frictionPi.netStartingCapital}
            optStartingCapital={evaluation.frictionOpt.netStartingCapital}
          />
        )}

        {(activeTab === 'all' || activeTab === 'friction') && (
          <FrictionWaterfall
            initialValue={evaluation.initialValue}
            frictionPi={evaluation.frictionPi}
            frictionOpt={evaluation.frictionOpt}
          />
        )}

        {(activeTab === 'all' || activeTab === 'breakeven') && (
          <BreakEvenChart
            initialValue={evaluation.initialValue}
            piStartingCapital={evaluation.frictionPi.netStartingCapital}
            optStartingCapital={evaluation.frictionOpt.netStartingCapital}
            metricsCi={evaluation.metricsCi}
            metricsPi={evaluation.metricsPi}
            metricsOpt={evaluation.metricsOpt}
            breakEvenYearsPi={evaluation.breakEvenYearsPi}
            breakEvenYearsOpt={evaluation.breakEvenYearsOpt}
            clientAge={currentPersona.age}
            retireAge={currentPersona.retireAge}
          />
        )}

        {(activeTab === 'all' || activeTab === 'longevity') && (
          <LongevitySimulator
            persona={currentPersona}
            longevityCi={evaluation.longevityCi}
            longevityPi={evaluation.longevityPi}
            longevityOpt={evaluation.longevityOpt}
          />
        )}

        {(activeTab === 'all' || activeTab === 'risk') && (
          <MarketRiskAnalytics
            metricsCi={evaluation.metricsCi}
            metricsPi={evaluation.metricsPi}
            metricsOpt={evaluation.metricsOpt}
          />
        )}

        {(activeTab === 'all' || activeTab === 'montecarlo') && (
          <>
            <StressTestGrid stressTests={evaluation.stressTests} />
            <MonteCarloGauge
              monteCarloCi={evaluation.monteCarloCi}
              monteCarloPi={evaluation.monteCarloPi}
              monteCarloOpt={evaluation.monteCarloOpt}
            />
          </>
        )}
      </main>

      {/* Footer Fiduciary Statement */}
      <footer className="border-t border-zinc-800 bg-[#060911] py-8 text-xs font-mono text-zinc-500 text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="text-zinc-400 font-bold uppercase tracking-widest">
            LPL FINANCIAL // ADVISOR TRANSITION INTELLIGENCE SUITE
          </div>
          <p className="max-w-3xl mx-auto text-[11px] text-zinc-600">
            Engineered for Inter IIT Tech Meet 15.0. Implements full US Federal Tax Code (TCJA & SECURE 2.0),
            IRS Uniform Lifetime Table RMDs, multi-regime covariance stress testing, and explainable fiduciary AI optimization.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <InvestorProposalModal
        isOpen={isProposalOpen}
        onClose={() => setIsProposalOpen(false)}
        persona={currentPersona}
        evaluation={evaluation}
      />

      <ScenarioControls
        isOpen={isControlsOpen}
        onClose={() => setIsControlsOpen(false)}
        persona={currentPersona}
        onUpdatePersona={handleUpdatePersona}
        onResetPersona={handleResetPersona}
      />
    </div>
  );
}

export default App;
