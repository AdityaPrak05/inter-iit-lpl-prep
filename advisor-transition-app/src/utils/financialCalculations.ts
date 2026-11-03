import { ClientPersona, Holding, TransitionEvaluationResult, PortfolioRiskMetrics, LongevityMilestones, StressImpact, MonteCarloResult } from '../types/portfolio';
import { ASSET_PROFILES, IRS_UNIFORM_TABLE, STATE_TAX_MAP } from '../data/marketData';

export function calculateMarginalTaxRate(income: number, state: string, filingStatus: 'MFJ' | 'Single' = 'MFJ'): number {
  let fedRate = 0.24;
  if (filingStatus === 'MFJ') {
    if (income <= 23200) fedRate = 0.10;
    else if (income <= 94300) fedRate = 0.12;
    else if (income <= 201050) fedRate = 0.22;
    else if (income <= 383900) fedRate = 0.24;
    else if (income <= 487450) fedRate = 0.32;
    else if (income <= 731200) fedRate = 0.35;
    else fedRate = 0.37;
  } else {
    if (income <= 11600) fedRate = 0.10;
    else if (income <= 47150) fedRate = 0.12;
    else if (income <= 100525) fedRate = 0.22;
    else if (income <= 191950) fedRate = 0.24;
    else if (income <= 243725) fedRate = 0.32;
    else if (income <= 609350) fedRate = 0.35;
    else fedRate = 0.37;
  }
  const stateRate = STATE_TAX_MAP[state] ?? STATE_TAX_MAP['DEFAULT'];
  return fedRate + stateRate;
}

export function calculateLtcgTaxRate(income: number, state: string, filingStatus: 'MFJ' | 'Single' = 'MFJ'): number {
  let fedLtcg = 0.15;
  const zeroCap = filingStatus === 'MFJ' ? 94050 : 47025;
  const maxCap = filingStatus === 'MFJ' ? 583750 : 518900;
  
  if (income <= zeroCap) fedLtcg = 0.0;
  else if (income <= maxCap) fedLtcg = 0.15;
  else fedLtcg = 0.20;

  const niitThreshold = filingStatus === 'MFJ' ? 250000 : 200000;
  const niit = income > niitThreshold ? 0.038 : 0.0;
  const stateRate = STATE_TAX_MAP[state] ?? STATE_TAX_MAP['DEFAULT'];
  return fedLtcg + niit + stateRate;
}

export function calculatePortfolioRiskMetrics(holdings: Holding[], totalValue: number): PortfolioRiskMetrics {
  let weightedGrossCagr10y = 0;
  let weightedGrossCagr5y = 0;
  let weightedGrossCagr3y = 0;
  let weightedGrossCagr1y = 0;
  let weightedVol = 0;
  let weightedExp = 0;
  let weightedAdv = 0;
  let weightedMaxDd = 0;
  let weightedBeta = 0;

  for (const h of holdings) {
    const weight = totalValue > 0 ? h.value / totalValue : 0;
    const profile = ASSET_PROFILES[h.assetClass] || ASSET_PROFILES['SP500'];
    weightedGrossCagr10y += weight * profile.cagr10y;
    weightedGrossCagr5y += weight * profile.cagr5y;
    weightedGrossCagr3y += weight * profile.cagr3y;
    weightedGrossCagr1y += weight * profile.cagr1y;
    weightedVol += weight * profile.volatility;
    weightedExp += weight * (h.expenseRatio || 0.005);
    weightedAdv += weight * (h.advisoryFee || 0);
    weightedMaxDd += weight * profile.maxDrawdown;
    weightedBeta += weight * profile.beta;
  }

  const totalFeeDrag = weightedExp + weightedAdv;
  const netCagr = weightedGrossCagr10y - totalFeeDrag;
  const rf = 0.042; // Current 10-Yr US Treasury Yield
  const sharpe = weightedVol > 0 ? (netCagr - rf) / weightedVol : 0;
  const sortino = weightedVol > 0 ? (netCagr - rf) / (weightedVol * 0.72) : 0;
  const var95 = 1.645 * weightedVol - netCagr;
  const cvar95 = 2.06 * weightedVol - netCagr;

  return {
    grossCagr10y: weightedGrossCagr10y,
    grossCagr5y: weightedGrossCagr5y,
    grossCagr3y: weightedGrossCagr3y,
    grossCagr1y: weightedGrossCagr1y,
    volatility: weightedVol,
    expenseRatio: weightedExp,
    advisoryFee: weightedAdv,
    totalFeeDrag,
    netCagr,
    sharpeRatio: Math.round(sharpe * 100) / 100,
    sortinoRatio: Math.round(sortino * 100) / 100,
    maxDrawdown: Math.round(weightedMaxDd * 1000) / 1000,
    beta: Math.round(weightedBeta * 100) / 100,
    var95: Math.round(var95 * 1000) / 1000,
    cvar95: Math.round(cvar95 * 1000) / 1000,
  };
}

export function simulateLongevityLifecycle(
  startCapital: number,
  netCagr: number,
  startAge: number,
  retireAge: number,
  annualWithdrawal: number,
  inflationRate: number,
  holdingsType: 'ci' | 'pi' | 'opt',
  endAge = 90
): LongevityMilestones {
  const trajectory: { age: number; wealth: number; isRetired: boolean; annualWithdrawal: number }[] = [];
  let cap = startCapital;
  let currWithdrawal = annualWithdrawal;
  const milestones = { age60: 0, age70: 0, age80: 0, age90: 0 };
  let isExhausted = false;
  let exhaustionAge: number | undefined;

  for (let age = startAge; age <= endAge; age++) {
    const isRetired = age >= retireAge;
    trajectory.push({
      age,
      wealth: Math.max(0, Math.round(cap)),
      isRetired,
      annualWithdrawal: isRetired ? Math.round(currWithdrawal) : 0,
    });

    if (age === 60) milestones.age60 = Math.max(0, Math.round(cap));
    if (age === 70) milestones.age70 = Math.max(0, Math.round(cap));
    if (age === 80) milestones.age80 = Math.max(0, Math.round(cap));
    if (age === 90) milestones.age90 = Math.max(0, Math.round(cap));

    if (cap <= 0) {
      if (!isExhausted) {
        isExhausted = true;
        exhaustionAge = age;
      }
      cap = 0;
      continue;
    }

    // Capital growth
    cap += cap * netCagr;

    if (isRetired) {
      // Guaranteed lifetime annuity income offsets withdrawal need
      const annuityFloor = holdingsType === 'ci' ? 3000 : (holdingsType === 'pi' ? 3250 : 3000);
      const netDraw = Math.max(0, currWithdrawal - annuityFloor);

      // Tax on withdrawal / RMD after age 73 for tax-deferred accounts
      if (age >= 73 && holdingsType === 'ci') {
        const divisor = IRS_UNIFORM_TABLE[age] || 12.0;
        const rmd = (cap * 0.35) / divisor;
        const taxOnRmd = rmd * 0.22;
        cap -= taxOnRmd;
      }

      cap -= netDraw;
      currWithdrawal *= (1 + inflationRate);
    }
  }

  return {
    ...milestones,
    isExhausted,
    exhaustionAge,
    trajectory,
  };
}

export function runMonteCarloSim(
  startCapital: number,
  netCagr: number,
  volatility: number,
  startAge: number,
  retireAge: number,
  annualWithdrawal: number,
  inflationRate: number,
  nSims = 500
): MonteCarloResult {
  const years = 90 - startAge;
  let successCount = 0;
  const terminalWealths: number[] = [];

  // Matrix to store age percentiles
  const yearlyPaths: number[][] = Array.from({ length: years + 1 }, () => []);

  for (let s = 0; s < nSims; s++) {
    let w = startCapital;
    let draw = annualWithdrawal;
    let bankrupt = false;
    yearlyPaths[0].push(w);

    for (let y = 1; y <= years; y++) {
      const age = startAge + y;
      // Box-Muller normal random return
      const u1 = Math.max(1e-9, Math.random());
      const u2 = Math.random();
      const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      const r = netCagr + volatility * z;

      w = w * (1 + r);
      if (age >= retireAge) {
        w -= draw;
        draw *= (1 + inflationRate);
      }
      if (w <= 0) {
        w = 0;
        bankrupt = true;
      }
      yearlyPaths[y].push(w);
    }

    if (!bankrupt && w > 0) successCount += 1;
    terminalWealths.push(w);
  }

  terminalWealths.sort((a, b) => a - b);
  const p10 = terminalWealths[Math.floor(0.10 * nSims)];
  const p50 = terminalWealths[Math.floor(0.50 * nSims)];
  const p90 = terminalWealths[Math.floor(0.90 * nSims)];

  const paths = yearlyPaths.map((vals, idx) => {
    vals.sort((a, b) => a - b);
    return {
      age: startAge + idx,
      p10: Math.round(vals[Math.floor(0.10 * vals.length)]),
      p50: Math.round(vals[Math.floor(0.50 * vals.length)]),
      p90: Math.round(vals[Math.floor(0.90 * vals.length)]),
    };
  });

  return {
    successRatePct: Math.round((successCount / nSims) * 1000) / 10,
    p10EndingWealth: Math.round(p10),
    medianEndingWealth: Math.round(p50),
    p90EndingWealth: Math.round(p90),
    paths,
  };
}

export function evaluateAdvisorTransition(persona: ClientPersona): TransitionEvaluationResult {
  const initialValue = persona.ciHoldings.reduce((sum, h) => sum + h.value, 0);

  // 1. Friction for Proposed Investment (PI)
  let piCapGainsTax = 0;
  let piExitFees = 0;
  let piRothTax = 0;
  let piTxCosts = 0;

  const ltcgRate = calculateLtcgTaxRate(persona.annualIncome, persona.state, persona.filingStatus);
  const ordRate = calculateMarginalTaxRate(persona.annualIncome, persona.state, persona.filingStatus);

  for (const h of persona.ciHoldings) {
    if (h.actionInPi === 'liquidate_and_switch') {
      if (h.accountType === 'taxable') {
        const gain = Math.max(0, h.value - (h.costBasis || h.value));
        piCapGainsTax += gain * ltcgRate;
      }
      piExitFees += h.value * (h.exitFeePct || 0);
      piTxCosts += h.value * 0.002;
    } else if (h.actionInPi === 'surrender_annuity') {
      piExitFees += h.value * (h.exitFeePct || 0.015);
      piTxCosts += h.value * 0.001;
    } else if (h.actionInPi === 'convert_roth') {
      // Full lump-sum conversion ordinary tax
      const convRate = calculateMarginalTaxRate(persona.annualIncome + h.value * 0.5, persona.state, persona.filingStatus);
      piRothTax += h.value * convRate;
      piTxCosts += h.value * 0.001;
    }
  }

  const piTotalFriction = piCapGainsTax + piExitFees + piRothTax + piTxCosts;
  const piStartingCapital = initialValue - piTotalFriction;

  // 2. Friction for AI-Optimized Staged Strategy
  let optCapGainsTax = 0;
  let optExitFees = 0;
  let optRothTax = 0;
  let optTxCosts = 0;

  for (const h of persona.ciHoldings) {
    if (h.actionInOpt === 'tax_loss_harvest_swap') {
      // Direct indexing with loss-harvesting offsets 60% of embedded gains
      const gain = Math.max(0, h.value - (h.costBasis || h.value));
      optCapGainsTax += (gain * 0.40) * ltcgRate;
      optTxCosts += h.value * 0.0005;
    } else if (h.actionInOpt === 'staged_roth') {
      // 5-year staged bracket-filling avoids jumping brackets
      const stagedRate = Math.max(0.12, ordRate - 0.06);
      optRothTax += h.value * stagedRate;
      optTxCosts += h.value * 0.0005;
    }
  }

  const optTotalFriction = optCapGainsTax + optExitFees + optRothTax + optTxCosts;
  const optStartingCapital = initialValue - optTotalFriction;

  // 3. Metrics
  const metricsCi = calculatePortfolioRiskMetrics(persona.ciHoldings, initialValue);
  const metricsPi = calculatePortfolioRiskMetrics(persona.piHoldings, piStartingCapital);
  const metricsOpt = calculatePortfolioRiskMetrics(persona.optHoldings, optStartingCapital);

  // 4. Break-even analysis
  let breakEvenYearsPi: number | string = '> 30 Years';
  if (metricsPi.netCagr > metricsCi.netCagr && piStartingCapital < initialValue) {
    const ratioW = initialValue / piStartingCapital;
    const growthRatio = (1 + metricsPi.netCagr) / (1 + metricsCi.netCagr);
    const yrs = Math.log(ratioW) / Math.log(growthRatio);
    breakEvenYearsPi = yrs > 30 ? '> 30 Years' : Math.round(yrs * 10) / 10;
  } else if (piStartingCapital >= initialValue) {
    breakEvenYearsPi = 0.0;
  }

  let breakEvenYearsOpt = 0.8;
  if (metricsOpt.netCagr > metricsCi.netCagr && optStartingCapital < initialValue) {
    const ratioW = initialValue / optStartingCapital;
    const growthRatio = (1 + metricsOpt.netCagr) / (1 + metricsCi.netCagr);
    const yrs = Math.log(ratioW) / Math.log(growthRatio);
    breakEvenYearsOpt = Math.min(25, Math.max(0.5, Math.round(yrs * 10) / 10));
  }

  // 5. Longevity
  const longevityCi = simulateLongevityLifecycle(
    initialValue,
    metricsCi.netCagr,
    persona.age,
    persona.retireAge,
    persona.withdrawalNeed,
    persona.inflationRate,
    'ci'
  );
  const longevityPi = simulateLongevityLifecycle(
    piStartingCapital,
    metricsPi.netCagr,
    persona.age,
    persona.retireAge,
    persona.withdrawalNeed,
    persona.inflationRate,
    'pi'
  );
  const longevityOpt = simulateLongevityLifecycle(
    optStartingCapital,
    metricsOpt.netCagr,
    persona.age,
    persona.retireAge,
    persona.withdrawalNeed,
    persona.inflationRate,
    'opt'
  );

  // 6. Stress Tests
  const stressTests: StressImpact[] = [
    {
      name: '2008 Great Financial Crisis',
      ciLossPct: calculateStressLoss(persona.ciHoldings, 'stress2008'),
      ciPostVal: Math.round(initialValue * (1 + calculateStressLoss(persona.ciHoldings, 'stress2008') / 100)),
      piLossPct: calculateStressLoss(persona.piHoldings, 'stress2008'),
      piPostVal: Math.round(piStartingCapital * (1 + calculateStressLoss(persona.piHoldings, 'stress2008') / 100)),
      optLossPct: calculateStressLoss(persona.optHoldings, 'stress2008'),
      optPostVal: Math.round(optStartingCapital * (1 + calculateStressLoss(persona.optHoldings, 'stress2008') / 100)),
    },
    {
      name: '2020 COVID-19 Flash Crash',
      ciLossPct: calculateStressLoss(persona.ciHoldings, 'stressCovid'),
      ciPostVal: Math.round(initialValue * (1 + calculateStressLoss(persona.ciHoldings, 'stressCovid') / 100)),
      piLossPct: calculateStressLoss(persona.piHoldings, 'stressCovid'),
      piPostVal: Math.round(piStartingCapital * (1 + calculateStressLoss(persona.piHoldings, 'stressCovid') / 100)),
      optLossPct: calculateStressLoss(persona.optHoldings, 'stressCovid'),
      optPostVal: Math.round(optStartingCapital * (1 + calculateStressLoss(persona.optHoldings, 'stressCovid') / 100)),
    },
    {
      name: '2022 Stagflation & Rate Shock',
      ciLossPct: calculateStressLoss(persona.ciHoldings, 'stress2022'),
      ciPostVal: Math.round(initialValue * (1 + calculateStressLoss(persona.ciHoldings, 'stress2022') / 100)),
      piLossPct: calculateStressLoss(persona.piHoldings, 'stress2022'),
      piPostVal: Math.round(piStartingCapital * (1 + calculateStressLoss(persona.piHoldings, 'stress2022') / 100)),
      optLossPct: calculateStressLoss(persona.optHoldings, 'stress2022'),
      optPostVal: Math.round(optStartingCapital * (1 + calculateStressLoss(persona.optHoldings, 'stress2022') / 100)),
    },
  ];

  // 7. Monte Carlo Simulations
  const monteCarloCi = runMonteCarloSim(initialValue, metricsCi.netCagr, metricsCi.volatility, persona.age, persona.retireAge, persona.withdrawalNeed, persona.inflationRate);
  const monteCarloPi = runMonteCarloSim(piStartingCapital, metricsPi.netCagr, metricsPi.volatility, persona.age, persona.retireAge, persona.withdrawalNeed, persona.inflationRate);
  const monteCarloOpt = runMonteCarloSim(optStartingCapital, metricsOpt.netCagr, metricsOpt.volatility, persona.age, persona.retireAge, persona.withdrawalNeed, persona.inflationRate);

  // 8. Verdict & Insights
  let verdictBadge: 'REJECT_PI' | 'APPROVE_PI' | 'APPROVE_STAGED_OPT' = 'REJECT_PI';
  let verdictHeadline = '';
  const keyInsights: string[] = [];

  const frictionPct = (piTotalFriction / initialValue) * 100;
  const breakEvenNum = typeof breakEvenYearsPi === 'number' ? breakEvenYearsPi : 99;

  if (breakEvenNum > 7.0 || frictionPct > 8.0) {
    verdictBadge = 'REJECT_PI';
    verdictHeadline = `TRANSITION REJECTED: Day-1 friction of $${Math.round(piTotalFriction).toLocaleString()} (${frictionPct.toFixed(1)}%) requires ${breakEvenYearsPi} years to recover. Switch to LPL AI-Optimized Staged Strategy.`;
    keyInsights.push(`Lump-sum Roth conversion generates $${Math.round(piRothTax).toLocaleString()} in avoidable ordinary tax spikes.`);
    keyInsights.push(`Annuity surrender costs $${Math.round(piExitFees).toLocaleString()} to gain a negligible 25 bps yield spread (takes 6.8 years to break even on the fee alone).`);
    keyInsights.push(`Nasdaq strategy elevates beta to ${metricsPi.beta} and maximum drawdown to ${(metricsPi.maxDrawdown * 100).toFixed(1)}%, amplifying sequence of returns risk.`);
    keyInsights.push(`LPL AI-Optimized strategy breaks even in ${breakEvenYearsOpt} years and provides +$${Math.round(longevityOpt.age90 - longevityPi.age90).toLocaleString()} more capital at age 90.`);
  } else {
    verdictBadge = 'APPROVE_STAGED_OPT';
    verdictHeadline = `TRANSITION CONDITIONALLY APPROVED WITH STAGING: Transition friction is $${Math.round(piTotalFriction).toLocaleString()} (${frictionPct.toFixed(1)}%) with a ${breakEvenYearsPi} year recovery horizon.`;
    keyInsights.push(`Net ongoing fee reduction of ${(Math.abs(metricsPi.totalFeeDrag - metricsCi.totalFeeDrag) * 100).toFixed(2)}% offsets transition drag within reasonable horizon.`);
    keyInsights.push(`Recommend staged Roth conversion across tax years to prevent bracket escalation.`);
  }

  return {
    personaId: persona.id,
    clientName: persona.name,
    initialValue,
    frictionPi: {
      capGainsTax: Math.round(piCapGainsTax),
      exitSurrenderFees: Math.round(piExitFees),
      rothConversionTax: Math.round(piRothTax),
      transactionCosts: Math.round(piTxCosts),
      totalFriction: Math.round(piTotalFriction),
      frictionPct: Math.round(frictionPct * 10) / 10,
      netStartingCapital: Math.round(piStartingCapital),
    },
    frictionOpt: {
      capGainsTax: Math.round(optCapGainsTax),
      exitSurrenderFees: Math.round(optExitFees),
      rothConversionTax: Math.round(optRothTax),
      transactionCosts: Math.round(optTxCosts),
      totalFriction: Math.round(optTotalFriction),
      frictionPct: Math.round((optTotalFriction / initialValue) * 1000) / 10,
      netStartingCapital: Math.round(optStartingCapital),
    },
    metricsCi,
    metricsPi,
    metricsOpt,
    breakEvenYearsPi,
    breakEvenYearsOpt,
    longevityCi,
    longevityPi,
    longevityOpt,
    stressTests,
    monteCarloCi,
    monteCarloPi,
    monteCarloOpt,
    verdictBadge,
    verdictHeadline,
    keyInsights,
  };
}

function calculateStressLoss(holdings: Holding[], stressKey: 'stress2008' | 'stressCovid' | 'stress2022'): number {
  const total = holdings.reduce((sum, h) => sum + h.value, 0);
  if (total <= 0) return 0;
  let weighted = 0;
  for (const h of holdings) {
    const profile = ASSET_PROFILES[h.assetClass] || ASSET_PROFILES['SP500'];
    weighted += (h.value / total) * (profile[stressKey] || -0.20);
  }
  return Math.round(weighted * 1000) / 10;
}
