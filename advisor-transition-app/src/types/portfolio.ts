export type AccountType = 'taxable' | 'trad_ira' | 'roth_ira' | 'annuity' | 'cash';

export type ActionType = 
  | 'retain'
  | 'liquidate_and_switch'
  | 'convert_roth'
  | 'staged_roth'
  | 'surrender_annuity'
  | 'tax_loss_harvest_swap';

export interface Holding {
  name: string;
  assetClass: string;
  value: number;
  costBasis: number;
  accountType: AccountType;
  expenseRatio: number; // e.g. 0.0075 = 0.75%
  advisoryFee?: number; // e.g. 0.010 = 1.00%
  exitFeePct?: number;  // e.g. 0.015 = 1.5%
  actionInPi?: ActionType;
  actionInOpt?: ActionType;
  notes?: string;
}

export interface ClientPersona {
  id: string;
  name: string;
  subtitle: string;
  portfolioType: 'balanced' | 'growth' | 'preservation' | 'hnw_tax' | 'decumulation' | 'starter' | 'illiquid_alts' | 'dividend_trap';
  age: number;
  retireAge: number;
  annualIncome: number;
  state: string;
  filingStatus: 'MFJ' | 'Single';
  withdrawalNeed: number;
  inflationRate: number;
  riskTolerance: 'Low' | 'Moderate' | 'Aggressive' | 'Speculative';
  ciHoldings: Holding[];
  piHoldings: Holding[];
  optHoldings: Holding[];
  advisoryNotes: string;
}

export interface TransitionFrictionDetails {
  capGainsTax: number;
  exitSurrenderFees: number;
  rothConversionTax: number;
  transactionCosts: number;
  totalFriction: number;
  frictionPct: number;
  netStartingCapital: number;
}

export interface PortfolioRiskMetrics {
  grossCagr10y: number;
  grossCagr5y: number;
  grossCagr3y: number;
  grossCagr1y: number;
  volatility: number;
  expenseRatio: number;
  advisoryFee: number;
  totalFeeDrag: number;
  netCagr: number;
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdown: number;
  beta: number;
  var95: number;
  cvar95: number;
}

export interface LongevityMilestones {
  age60: number;
  age70: number;
  age80: number;
  age90: number;
  isExhausted: boolean;
  exhaustionAge?: number;
  trajectory: { age: number; wealth: number; isRetired: boolean; annualWithdrawal: number }[];
}

export interface StressImpact {
  name: string;
  ciLossPct: number;
  ciPostVal: number;
  piLossPct: number;
  piPostVal: number;
  optLossPct: number;
  optPostVal: number;
}

export interface MonteCarloResult {
  successRatePct: number;
  p10EndingWealth: number;
  medianEndingWealth: number;
  p90EndingWealth: number;
  paths: { age: number; p10: number; p50: number; p90: number }[];
}

export interface TransitionEvaluationResult {
  personaId: string;
  clientName: string;
  initialValue: number;
  frictionPi: TransitionFrictionDetails;
  frictionOpt: TransitionFrictionDetails;
  metricsCi: PortfolioRiskMetrics;
  metricsPi: PortfolioRiskMetrics;
  metricsOpt: PortfolioRiskMetrics;
  breakEvenYearsPi: number | string;
  breakEvenYearsOpt: number;
  longevityCi: LongevityMilestones;
  longevityPi: LongevityMilestones;
  longevityOpt: LongevityMilestones;
  stressTests: StressImpact[];
  monteCarloCi: MonteCarloResult;
  monteCarloPi: MonteCarloResult;
  monteCarloOpt: MonteCarloResult;
  verdictBadge: 'REJECT_PI' | 'APPROVE_PI' | 'APPROVE_STAGED_OPT';
  verdictHeadline: string;
  keyInsights: string[];
}
