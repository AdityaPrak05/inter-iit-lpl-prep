export interface AssetClassProfile {
  code: string;
  name: string;
  category: 'equity' | 'fixed_income' | 'alternative' | 'cash' | 'annuity';
  cagr10y: number;
  cagr5y: number;
  cagr3y: number;
  cagr1y: number;
  volatility: number;
  dividendYield: number;
  beta: number;
  maxDrawdown: number;
  stress2008: number;
  stressCovid: number;
  stress2022: number;
  color: string;
}

export const ASSET_PROFILES: Record<string, AssetClassProfile> = {
  SP500: {
    code: 'SP500',
    name: 'S&P 500 Index (Large Cap US Core)',
    category: 'equity',
    cagr10y: 0.128,
    cagr5y: 0.145,
    cagr3y: 0.098,
    cagr1y: 0.245,
    volatility: 0.152,
    dividendYield: 0.015,
    beta: 1.0,
    maxDrawdown: -0.239,
    stress2008: -0.370,
    stressCovid: -0.196,
    stress2022: -0.181,
    color: '#3B82F6' // Electric Blue
  },
  NASDAQ100: {
    code: 'NASDAQ100',
    name: 'Nasdaq-100 (High-Beta Growth Tech)',
    category: 'equity',
    cagr10y: 0.182,
    cagr5y: 0.198,
    cagr3y: 0.112,
    cagr1y: 0.382,
    volatility: 0.208,
    dividendYield: 0.007,
    beta: 1.25,
    maxDrawdown: -0.326,
    stress2008: -0.419,
    stressCovid: -0.120,
    stress2022: -0.326,
    color: '#06B6D4' // Cyan
  },
  DIVIDEND_VALUE: {
    code: 'DIVIDEND_VALUE',
    name: 'Dividend Aristocrats / Quality Value',
    category: 'equity',
    cagr10y: 0.108,
    cagr5y: 0.118,
    cagr3y: 0.082,
    cagr1y: 0.185,
    volatility: 0.135,
    dividendYield: 0.035,
    beta: 0.82,
    maxDrawdown: -0.185,
    stress2008: -0.260,
    stressCovid: -0.165,
    stress2022: -0.065,
    color: '#10B981' // Emerald
  },
  US_AGG_BOND: {
    code: 'US_AGG_BOND',
    name: 'US Aggregate Bond Index (BND/AGG)',
    category: 'fixed_income',
    cagr10y: 0.014,
    cagr5y: -0.002,
    cagr3y: -0.038,
    cagr1y: 0.055,
    volatility: 0.058,
    dividendYield: 0.042,
    beta: 0.05,
    maxDrawdown: -0.130,
    stress2008: 0.052,
    stressCovid: 0.075,
    stress2022: -0.130,
    color: '#6366F1' // Indigo
  },
  VANGUARD_ANNUITY: {
    code: 'VANGUARD_ANNUITY',
    name: 'Vanguard 3.0% Fixed Lifetime Annuity',
    category: 'annuity',
    cagr10y: 0.030,
    cagr5y: 0.030,
    cagr3y: 0.030,
    cagr1y: 0.030,
    volatility: 0.005,
    dividendYield: 0.030,
    beta: 0.0,
    maxDrawdown: 0.0,
    stress2008: 0.030,
    stressCovid: 0.030,
    stress2022: 0.030,
    color: '#F59E0B' // Amber
  },
  FIDELITY_ANNUITY: {
    code: 'FIDELITY_ANNUITY',
    name: 'Fidelity 3.25% Fixed Annuity',
    category: 'annuity',
    cagr10y: 0.0325,
    cagr5y: 0.0325,
    cagr3y: 0.0325,
    cagr1y: 0.0325,
    volatility: 0.005,
    dividendYield: 0.0325,
    beta: 0.0,
    maxDrawdown: 0.0,
    stress2008: 0.0325,
    stressCovid: 0.0325,
    stress2022: 0.0325,
    color: '#EAB308' // Yellow
  },
  REAL_ESTATE: {
    code: 'REAL_ESTATE',
    name: 'Private Real Estate / Fund of Funds',
    category: 'alternative',
    cagr10y: 0.078,
    cagr5y: 0.065,
    cagr3y: 0.042,
    cagr1y: 0.062,
    volatility: 0.095,
    dividendYield: 0.045,
    beta: 0.35,
    maxDrawdown: -0.142,
    stress2008: -0.280,
    stressCovid: -0.085,
    stress2022: -0.065,
    color: '#EC4899' // Pink
  },
  CRYPTO_BTC: {
    code: 'CRYPTO_BTC',
    name: 'Crypto Assets (BTC/ETH Multi-Coin)',
    category: 'alternative',
    cagr10y: 0.485,
    cagr5y: 0.362,
    cagr3y: 0.155,
    cagr1y: 1.250,
    volatility: 0.650,
    dividendYield: 0.0,
    beta: 2.10,
    maxDrawdown: -0.730,
    stress2008: -0.650,
    stressCovid: -0.380,
    stress2022: -0.640,
    color: '#F97316' // Orange
  },
  GOLD: {
    code: 'GOLD',
    name: 'Physical Gold / Precious Metals',
    category: 'alternative',
    cagr10y: 0.082,
    cagr5y: 0.115,
    cagr3y: 0.092,
    cagr1y: 0.165,
    volatility: 0.138,
    dividendYield: 0.0,
    beta: 0.05,
    maxDrawdown: -0.152,
    stress2008: 0.058,
    stressCovid: 0.244,
    stress2022: -0.008,
    color: '#D97706' // Warm Gold
  },
  CASH_TREASURY: {
    code: 'CASH_TREASURY',
    name: 'Short-Term T-Bills / Cash Sweep (5.2% Fed Rate)',
    category: 'cash',
    cagr10y: 0.021,
    cagr5y: 0.025,
    cagr3y: 0.042,
    cagr1y: 0.052,
    volatility: 0.006,
    dividendYield: 0.052,
    beta: 0.0,
    maxDrawdown: 0.0,
    stress2008: 0.018,
    stressCovid: 0.008,
    stress2022: 0.015,
    color: '#14B8A6' // Teal
  }
};

export const IRS_UNIFORM_TABLE: Record<number, number> = {
  72: 27.4, 73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9, 78: 22.0,
  79: 21.1, 80: 20.2, 81: 19.4, 82: 18.5, 83: 17.7, 84: 16.8, 85: 16.0,
  86: 15.2, 87: 14.4, 88: 13.7, 89: 12.9, 90: 12.2, 91: 11.5, 92: 10.8
};

export const STATE_TAX_MAP: Record<string, number> = {
  DEFAULT: 0.05,
  CA: 0.093,
  NY: 0.1072, // NY State + NYC
  TX: 0.0,
  FL: 0.0,
  PA: 0.0307,
  IL: 0.0495,
  WA: 0.0
};
