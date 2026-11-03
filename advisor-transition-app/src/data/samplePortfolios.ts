import { ClientPersona } from '../types/portfolio';

export const SAMPLE_PERSONAS: ClientPersona[] = [
  {
    id: 'persona_1_reference_case',
    name: 'David & Sarah Miller',
    subtitle: 'Section 2.3 Official Case Study: Rollover, Annuity Swap & Roth Conversion',
    portfolioType: 'balanced',
    age: 50,
    retireAge: 60,
    annualIncome: 175000,
    state: 'DEFAULT',
    filingStatus: 'MFJ',
    withdrawalNeed: 48000,
    inflationRate: 0.028,
    riskTolerance: 'Moderate',
    advisoryNotes: 'Client holds $700k across taxable equity, fixed annuity, Trad IRA, RE FoF, and alternatives. Evaluating aggressive Nasdaq strategy, annuity swap, and immediate full Roth conversion.',
    ciHoldings: [
      {
        name: 'S&P 500 Index Mutual Fund',
        assetClass: 'SP500',
        value: 50000,
        costBasis: 10000,
        accountType: 'taxable',
        expenseRatio: 0.0075,
        exitFeePct: 0.01, // 1% exit clause = $500
        actionInPi: 'liquidate_and_switch',
        actionInOpt: 'tax_loss_harvest_swap',
        notes: 'Unrealized gain of $40,000; 1% exit clause applies if liquidated.'
      },
      {
        name: 'Vanguard Fixed Lifetime Annuity',
        assetClass: 'VANGUARD_ANNUITY',
        value: 100000,
        costBasis: 100000,
        accountType: 'annuity',
        expenseRatio: 0.0040,
        exitFeePct: 0.015, // 1.5% exit cost = $1,500
        actionInPi: 'surrender_annuity',
        actionInOpt: 'retain',
        notes: 'Provides 3.0% guaranteed lifetime income ($3,000/yr). 1.5% surrender charge.'
      },
      {
        name: 'Traditional IRA',
        assetClass: 'SP500',
        value: 200000,
        costBasis: 200000,
        accountType: 'trad_ira',
        expenseRatio: 0.0050,
        exitFeePct: 0.0,
        actionInPi: 'convert_roth',
        actionInOpt: 'staged_roth',
        notes: 'Pre-tax retirement asset. Full conversion triggers immediate 24% Fed + 5% State income tax.'
      },
      {
        name: 'Real Estate Fund of Funds',
        assetClass: 'REAL_ESTATE',
        value: 250000,
        costBasis: 250000,
        accountType: 'taxable',
        expenseRatio: 0.0120,
        exitFeePct: 0.0,
        actionInPi: 'retain',
        actionInOpt: 'retain',
        notes: 'Illiquid private real estate fund yielding 4.5% distributions. Retained as-is.'
      },
      {
        name: 'Alternative Investments (Crypto, Bonds, Gold)',
        assetClass: 'GOLD',
        value: 100000,
        costBasis: 90000,
        accountType: 'taxable',
        expenseRatio: 0.0060,
        exitFeePct: 0.0,
        actionInPi: 'retain',
        actionInOpt: 'retain',
        notes: 'Diversified sleeve: $30k crypto, $50k core bonds, $20k gold.'
      }
    ],
    piHoldings: [
      {
        name: 'Nasdaq-Oriented Mutual Fund Strategy',
        assetClass: 'NASDAQ100',
        value: 50000,
        costBasis: 50000,
        accountType: 'taxable',
        expenseRatio: 0.010,
        advisoryFee: 0.005,
        notes: 'Higher expense (1.00%) + 50 bps advisory overlay. High beta (1.25).'
      },
      {
        name: 'Fidelity Annuity (3.25% Fixed)',
        assetClass: 'FIDELITY_ANNUITY',
        value: 100000,
        costBasis: 100000,
        accountType: 'annuity',
        expenseRatio: 0.0045,
        advisoryFee: 0.0,
        notes: 'Marginal yield increase of 25 bps ($250/yr), but costs $1,500 surrender fee upfront.'
      },
      {
        name: 'Roth IRA (Lump-Sum Converted Nasdaq Tilt)',
        assetClass: 'NASDAQ100',
        value: 200000,
        costBasis: 200000,
        accountType: 'roth_ira',
        expenseRatio: 0.010,
        advisoryFee: 0.005,
        notes: 'Tax-free growth, but cost $58,000 in immediate Year 1 tax drag.'
      },
      {
        name: 'Real Estate Fund of Funds (Retained)',
        assetClass: 'REAL_ESTATE',
        value: 250000,
        costBasis: 250000,
        accountType: 'taxable',
        expenseRatio: 0.0120,
        advisoryFee: 0.0
      },
      {
        name: 'Alternative Investments (Retained)',
        assetClass: 'GOLD',
        value: 100000,
        costBasis: 90000,
        accountType: 'taxable',
        expenseRatio: 0.0060,
        advisoryFee: 0.0
      }
    ],
    optHoldings: [
      {
        name: 'Core-Satellite Equity (VOO 70% / QQQM 30%)',
        assetClass: 'SP500',
        value: 50000,
        costBasis: 50000,
        accountType: 'taxable',
        expenseRatio: 0.0006, // 6 bps!
        advisoryFee: 0.002,
        notes: 'Tax-loss harvested swap. Blended fee dropped from 1.00% to 0.06%!'
      },
      {
        name: 'Vanguard Lifetime Annuity (Retained)',
        assetClass: 'VANGUARD_ANNUITY',
        value: 100000,
        costBasis: 100000,
        accountType: 'annuity',
        expenseRatio: 0.0040,
        advisoryFee: 0.0,
        notes: 'Saved $1,500 exit penalty. Eliminates 6.8 year break-even hurdle.'
      },
      {
        name: 'Roth IRA (5-Yr Staged Bracket-Filling Conversion)',
        assetClass: 'SP500',
        value: 200000,
        costBasis: 200000,
        accountType: 'roth_ira',
        expenseRatio: 0.0008,
        advisoryFee: 0.002,
        notes: 'Converts $40k/yr over 5 yrs to stay within 22%/24% brackets, saving $14,000 in taxes.'
      },
      {
        name: 'Real Estate Fund of Funds (Retained)',
        assetClass: 'REAL_ESTATE',
        value: 250000,
        costBasis: 250000,
        accountType: 'taxable',
        expenseRatio: 0.0120,
        advisoryFee: 0.0
      },
      {
        name: 'Alternatives (Enhanced with Short Treasury buffer)',
        assetClass: 'GOLD',
        value: 100000,
        costBasis: 90000,
        accountType: 'taxable',
        expenseRatio: 0.0020,
        advisoryFee: 0.001
      }
    ]
  },
  {
    id: 'persona_2_aggressive_growth',
    name: 'Marcus Vance',
    subtitle: 'Silicon Valley Tech VP: $450k Concentrated Equity & Crypto in California',
    portfolioType: 'growth',
    age: 32,
    retireAge: 55,
    annualIncome: 260000,
    state: 'CA',
    filingStatus: 'Single',
    withdrawalNeed: 65000,
    inflationRate: 0.025,
    riskTolerance: 'Speculative',
    advisoryNotes: 'High earner in California (9.3% state tax). Heavily concentrated in single tech names and crypto. Liquidation triggers massive federal LTCG + NIIT + CA tax.',
    ciHoldings: [
      {
        name: 'Concentrated Tech Equities (NVDA / AAPL)',
        assetClass: 'NASDAQ100',
        value: 280000,
        costBasis: 90000, // $190k gain!
        accountType: 'taxable',
        expenseRatio: 0.0,
        exitFeePct: 0.0,
        actionInPi: 'liquidate_and_switch',
        actionInOpt: 'tax_loss_harvest_swap',
        notes: 'Huge embedded gain of $190,000 subject to 33.1% combined tax rate.'
      },
      {
        name: 'Crypto Holdings (BTC / ETH)',
        assetClass: 'CRYPTO_BTC',
        value: 120000,
        costBasis: 40000, // $80k gain
        accountType: 'taxable',
        expenseRatio: 0.0,
        exitFeePct: 0.0,
        actionInPi: 'liquidate_and_switch',
        actionInOpt: 'retain',
        notes: 'High volatility but zero expense ratio. Selling triggers $26k tax.'
      },
      {
        name: 'Cash / High Yield Brokerage Sweep',
        assetClass: 'CASH_TREASURY',
        value: 50000,
        costBasis: 50000,
        accountType: 'cash',
        expenseRatio: 0.0,
        exitFeePct: 0.0,
        actionInPi: 'retain',
        actionInOpt: 'retain'
      }
    ],
    piHoldings: [
      {
        name: 'Advisory Wrap Managed Thematic Tech Fund',
        assetClass: 'NASDAQ100',
        value: 450000,
        costBasis: 450000,
        accountType: 'taxable',
        expenseRatio: 0.0125,
        advisoryFee: 0.010, // 2.25% total fee drag!
        notes: 'High friction: wiped out $76k on Day 1 in taxes and adds 225 bps in annual fee drag.'
      }
    ],
    optHoldings: [
      {
        name: 'Direct Indexing with Active Tax-Loss Harvesting',
        assetClass: 'SP500',
        value: 280000,
        costBasis: 200000,
        accountType: 'taxable',
        expenseRatio: 0.0020,
        advisoryFee: 0.0025,
        notes: 'Retains single stocks while systematically pairing losses to trim concentration tax-neutrally.'
      },
      {
        name: 'Crypto Core Sleeve (Retained for Long-Term Hold)',
        assetClass: 'CRYPTO_BTC',
        value: 120000,
        costBasis: 40000,
        accountType: 'taxable',
        expenseRatio: 0.0,
        advisoryFee: 0.0
      },
      {
        name: 'Treasury Yield Liquidity Buffer',
        assetClass: 'CASH_TREASURY',
        value: 50000,
        costBasis: 50000,
        accountType: 'cash',
        expenseRatio: 0.0005,
        advisoryFee: 0.0
      }
    ]
  },
  {
    id: 'persona_3_wealth_preservation',
    name: 'Robert & Elena Castillo',
    subtitle: 'Wealth Preservation: $1.8M Near-Retiree in FL with 7% Annuity Surrender Penalty',
    portfolioType: 'preservation',
    age: 59,
    retireAge: 62,
    annualIncome: 130000,
    state: 'FL',
    filingStatus: 'MFJ',
    withdrawalNeed: 75000,
    inflationRate: 0.024,
    riskTolerance: 'Low',
    advisoryNotes: 'Client retiring in 3 years in Florida (0% state tax). Holds variable annuity with 5% Guaranteed Minimum Living Benefit (GMLB) but facing a 7% surrender charge ($42k) if exited today.',
    ciHoldings: [
      {
        name: 'Florida Municipal Bond Ladder',
        assetClass: 'US_AGG_BOND',
        value: 800000,
        costBasis: 800000,
        accountType: 'taxable',
        expenseRatio: 0.0015,
        exitFeePct: 0.0,
        actionInPi: 'retain',
        actionInOpt: 'retain',
        notes: 'Federally tax-exempt municipal yield of 3.8%.'
      },
      {
        name: 'Variable Annuity with Guaranteed Living Benefit (GMLB)',
        assetClass: 'DIVIDEND_VALUE',
        value: 600000,
        costBasis: 500000,
        accountType: 'annuity',
        expenseRatio: 0.0160,
        exitFeePct: 0.07, // 7% surrender charge = $42,000!
        actionInPi: 'surrender_annuity',
        actionInOpt: 'retain',
        notes: 'Irreplaceable 5% lifetime income floor ($30,000/yr). Surrender penalty expires at age 62.'
      },
      {
        name: 'Dividend Aristocrats Blue-Chip Sleeve',
        assetClass: 'DIVIDEND_VALUE',
        value: 300000,
        costBasis: 220000,
        accountType: 'taxable',
        expenseRatio: 0.0035,
        exitFeePct: 0.0,
        actionInPi: 'liquidate_and_switch',
        actionInOpt: 'retain'
      },
      {
        name: 'Short-Term Bank CDs & Cash',
        assetClass: 'CASH_TREASURY',
        value: 100000,
        costBasis: 100000,
        accountType: 'cash',
        expenseRatio: 0.0,
        exitFeePct: 0.0,
        actionInPi: 'retain',
        actionInOpt: 'retain'
      }
    ],
    piHoldings: [
      {
        name: 'Advisory High-Yield Multi-Asset Growth Model',
        assetClass: 'SP500',
        value: 900000,
        costBasis: 900000,
        accountType: 'taxable',
        expenseRatio: 0.0095,
        advisoryFee: 0.010,
        notes: 'Surrendered annuity paying $42k penalty; substituted guaranteed income for equity risk.'
      },
      {
        name: 'Municipal Bond Portfolio (Retained)',
        assetClass: 'US_AGG_BOND',
        value: 800000,
        costBasis: 800000,
        accountType: 'taxable',
        expenseRatio: 0.0015,
        advisoryFee: 0.005
      },
      {
        name: 'Cash Sweep',
        assetClass: 'CASH_TREASURY',
        value: 100000,
        costBasis: 100000,
        accountType: 'cash',
        expenseRatio: 0.0,
        advisoryFee: 0.0
      }
    ],
    optHoldings: [
      {
        name: 'Municipal Bond Ladder (Zero Tax Friction)',
        assetClass: 'US_AGG_BOND',
        value: 800000,
        costBasis: 800000,
        accountType: 'taxable',
        expenseRatio: 0.0015,
        advisoryFee: 0.0
      },
      {
        name: 'Retain Annuity Until Age 62 (Zero Surrender Cost)',
        assetClass: 'DIVIDEND_VALUE',
        value: 600000,
        costBasis: 500000,
        accountType: 'annuity',
        expenseRatio: 0.0160,
        advisoryFee: 0.0,
        notes: 'Protects $42,000 cash; guarantees $30k/yr lifetime cash flow from retirement date.'
      },
      {
        name: 'Low-Cost Dividend Growth ETF (SCHD/VIG)',
        assetClass: 'DIVIDEND_VALUE',
        value: 300000,
        costBasis: 220000,
        accountType: 'taxable',
        expenseRatio: 0.0006,
        advisoryFee: 0.002
      },
      {
        name: '3-Year Living Expense Cash Buffer (Eliminates SRR)',
        assetClass: 'CASH_TREASURY',
        value: 100000,
        costBasis: 100000,
        accountType: 'cash',
        expenseRatio: 0.0005,
        advisoryFee: 0.0
      }
    ]
  },
  {
    id: 'persona_4_tax_gain_trap',
    name: 'Jonathan & Claire Hastings',
    subtitle: 'Ultra-HNW Tax Trap: $3.5M Portfolio with $1.7M Embedded Unrealized Capital Gains in NY',
    portfolioType: 'hnw_tax',
    age: 48,
    retireAge: 60,
    annualIncome: 480000,
    state: 'NY',
    filingStatus: 'MFJ',
    withdrawalNeed: 140000,
    inflationRate: 0.028,
    riskTolerance: 'Moderate',
    advisoryNotes: 'Subject to 34.5% combined tax rate (Fed 20% + NIIT 3.8% + NY State 6.85% + NYC 3.87%). Liquidating legacy mutual funds triggers a staggering $586k tax wipeout.',
    ciHoldings: [
      {
        name: 'Legacy Mutual Funds & Concentrated Tech',
        assetClass: 'SP500',
        value: 2500000,
        costBasis: 800000, // $1,700,000 unrealized gain!
        accountType: 'taxable',
        expenseRatio: 0.0085,
        exitFeePct: 0.0,
        actionInPi: 'liquidate_and_switch',
        actionInOpt: 'tax_loss_harvest_swap',
        notes: 'Embedded gain of $1,700,000. Liquidating triggers $586,840 in taxes.'
      },
      {
        name: 'Traditional IRA',
        assetClass: 'SP500',
        value: 600000,
        costBasis: 600000,
        accountType: 'trad_ira',
        expenseRatio: 0.0040,
        exitFeePct: 0.0,
        actionInPi: 'convert_roth',
        actionInOpt: 'retain',
        notes: 'Converting pushes income over $1M into top 37% Federal + 10.7% NY tax brackets.'
      },
      {
        name: 'New York Municipal Bond Portfolio',
        assetClass: 'US_AGG_BOND',
        value: 400000,
        costBasis: 400000,
        accountType: 'taxable',
        expenseRatio: 0.0020,
        exitFeePct: 0.0,
        actionInPi: 'retain',
        actionInOpt: 'retain'
      }
    ],
    piHoldings: [
      {
        name: 'Unified Managed Account (UMA) Growth Model',
        assetClass: 'NASDAQ100',
        value: 3100000,
        costBasis: 3100000,
        accountType: 'taxable',
        expenseRatio: 0.0110,
        advisoryFee: 0.0125,
        notes: 'Incurs catastrophic Day-1 tax drag of $793,760! Requires 8.7 years just to recover.'
      },
      {
        name: 'Municipal Bond Sleeve',
        assetClass: 'US_AGG_BOND',
        value: 400000,
        costBasis: 400000,
        accountType: 'taxable',
        expenseRatio: 0.0020,
        advisoryFee: 0.005
      }
    ],
    optHoldings: [
      {
        name: 'Custom Direct Indexing (Multi-Year Organic Transition)',
        assetClass: 'SP500',
        value: 2500000,
        costBasis: 1800000,
        accountType: 'taxable',
        expenseRatio: 0.0025,
        advisoryFee: 0.0035,
        notes: 'ACAT transfer in-kind without selling; uses organic dividend redirection & loss harvesting.'
      },
      {
        name: 'Traditional IRA (Preserve Tax Deferral)',
        assetClass: 'SP500',
        value: 600000,
        costBasis: 600000,
        accountType: 'trad_ira',
        expenseRatio: 0.0004,
        advisoryFee: 0.002,
        notes: 'Avoids $280,000 tax spike on conversion at current peak earning bracket.'
      },
      {
        name: 'NY Triple-Tax-Free Municipal Bonds',
        assetClass: 'US_AGG_BOND',
        value: 400000,
        costBasis: 400000,
        accountType: 'taxable',
        expenseRatio: 0.0010,
        advisoryFee: 0.0
      }
    ]
  },
  {
    id: 'persona_5_active_decumulation',
    name: 'Eleanor Vance',
    subtitle: 'Retirement Decumulation: Age 68 Widow with $1.2M Portfolio Facing Imminent RMDs',
    portfolioType: 'decumulation',
    age: 68,
    retireAge: 68,
    annualIncome: 42000,
    state: 'DEFAULT',
    filingStatus: 'Single',
    withdrawalNeed: 65000,
    inflationRate: 0.026,
    riskTolerance: 'Low',
    advisoryNotes: 'Currently taking 5.4% annual withdrawals. Traditional IRA ($850k) will trigger mandatory IRS RMDs at age 75. Sequence of returns risk is paramount.',
    ciHoldings: [
      {
        name: 'Traditional IRA (Pre-Tax Retirement)',
        assetClass: 'SP500',
        value: 850000,
        costBasis: 850000,
        accountType: 'trad_ira',
        expenseRatio: 0.0060,
        exitFeePct: 0.0,
        actionInPi: 'convert_roth',
        actionInOpt: 'staged_roth',
        notes: 'Converting all $850k triggers massive ordinary income tax in single year.'
      },
      {
        name: 'Taxable Dividend Stock Brokerage',
        assetClass: 'DIVIDEND_VALUE',
        value: 250000,
        costBasis: 180000,
        accountType: 'taxable',
        expenseRatio: 0.0050,
        exitFeePct: 0.0,
        actionInPi: 'liquidate_and_switch',
        actionInOpt: 'retain'
      },
      {
        name: 'Cash Reserves',
        assetClass: 'CASH_TREASURY',
        value: 100000,
        costBasis: 100000,
        accountType: 'cash',
        expenseRatio: 0.0,
        exitFeePct: 0.0,
        actionInPi: 'retain',
        actionInOpt: 'retain'
      }
    ],
    piHoldings: [
      {
        name: 'Aggressive High-Yield Equity Advisory Strategy',
        assetClass: 'NASDAQ100',
        value: 1100000,
        costBasis: 1100000,
        accountType: 'taxable',
        expenseRatio: 0.0090,
        advisoryFee: 0.010,
        notes: 'Incurs $319k tax friction on Roth conversion; high equity volatility triggers ruin risk in down years.'
      },
      {
        name: 'Cash Buffer',
        assetClass: 'CASH_TREASURY',
        value: 100000,
        costBasis: 100000,
        accountType: 'cash',
        expenseRatio: 0.0,
        advisoryFee: 0.0
      }
    ],
    optHoldings: [
      {
        name: 'Bucket 3: Global Core Longevity Growth',
        assetClass: 'SP500',
        value: 600000,
        costBasis: 600000,
        accountType: 'trad_ira',
        expenseRatio: 0.0006,
        advisoryFee: 0.002,
        notes: 'Invested for 10-20 year growth; shielded from early drawdowns.'
      },
      {
        name: 'Bucket 2: 5-Year High Quality Bond Ladder',
        assetClass: 'US_AGG_BOND',
        value: 450000,
        costBasis: 450000,
        accountType: 'taxable',
        expenseRatio: 0.0005,
        advisoryFee: 0.001,
        notes: 'Provides predictable interest to replenish Bucket 1 without selling equities in downturns.'
      },
      {
        name: 'Bucket 1: 2.5-Year Cash Liquidity Buffer',
        assetClass: 'CASH_TREASURY',
        value: 150000,
        costBasis: 150000,
        accountType: 'cash',
        expenseRatio: 0.0003,
        advisoryFee: 0.0,
        notes: 'Guarantees immediate retirement income needs; completely eliminates sequence of returns risk.'
      }
    ]
  },
  {
    id: 'persona_6_young_accumulator',
    name: 'Tyler Brooks',
    subtitle: 'Career Starter: Age 26 with $85k Rollover & High Sensitivity to Ongoing Fee Drag',
    portfolioType: 'starter',
    age: 26,
    retireAge: 65,
    annualIncome: 78000,
    state: 'TX',
    filingStatus: 'Single',
    withdrawalNeed: 35000,
    inflationRate: 0.025,
    riskTolerance: 'Aggressive',
    advisoryNotes: 'Young investor in Texas (0% income tax). Holds old 401(k) and meme stocks. Transition to full 1.25% AUM advisory wrap will erode 32% of his final wealth over 39 years!',
    ciHoldings: [
      {
        name: 'Old Employer 401(k) (High-Fee Target Date Fund)',
        assetClass: 'SP500',
        value: 45000,
        costBasis: 45000,
        accountType: 'trad_ira',
        expenseRatio: 0.0085, // 85 bps
        exitFeePct: 0.0,
        actionInPi: 'convert_roth',
        actionInOpt: 'staged_roth'
      },
      {
        name: 'Roth IRA (Tech / Speculative Equities)',
        assetClass: 'NASDAQ100',
        value: 25000,
        costBasis: 22000,
        accountType: 'roth_ira',
        expenseRatio: 0.0,
        exitFeePct: 0.0,
        actionInPi: 'retain',
        actionInOpt: 'retain'
      },
      {
        name: 'Taxable Micro-Brokerage Cash & ETFs',
        assetClass: 'SP500',
        value: 15000,
        costBasis: 13000,
        accountType: 'taxable',
        expenseRatio: 0.0005,
        exitFeePct: 0.0,
        actionInPi: 'liquidate_and_switch',
        actionInOpt: 'retain'
      }
    ],
    piHoldings: [
      {
        name: 'Advisor Wrap Active Growth Program',
        assetClass: 'NASDAQ100',
        value: 85000,
        costBasis: 85000,
        accountType: 'roth_ira',
        expenseRatio: 0.010,
        advisoryFee: 0.0125, // 2.25% drag!
        notes: 'Excessive fee drag for an $85k balance; will cost $1.2M in lost compounding by age 65.'
      }
    ],
    optHoldings: [
      {
        name: 'Direct Low-Cost Index Rollover (VTI / VXUS / BND)',
        assetClass: 'SP500',
        value: 70000,
        costBasis: 70000,
        accountType: 'roth_ira',
        expenseRatio: 0.0004, // 4 bps
        advisoryFee: 0.0,
        notes: 'Rolls over 401(k) to low-cost IRA; converts to Roth at Tyler’s low 12% marginal tax bracket.'
      },
      {
        name: 'Taxable High-Yield Emergency Reserve',
        assetClass: 'CASH_TREASURY',
        value: 15000,
        costBasis: 15000,
        accountType: 'cash',
        expenseRatio: 0.0002,
        advisoryFee: 0.0
      }
    ]
  },
  {
    id: 'persona_7_illiquid_alts',
    name: 'Harrison & Victoria Sterling',
    subtitle: 'Illiquid Assets Heavy: $2.2M with 60% in Private REITs & Interval Funds',
    portfolioType: 'illiquid_alts',
    age: 55,
    retireAge: 65,
    annualIncome: 310000,
    state: 'WA',
    filingStatus: 'MFJ',
    withdrawalNeed: 95000,
    inflationRate: 0.027,
    riskTolerance: 'Moderate',
    advisoryNotes: 'Client locked in non-traded REITs and interval credit funds with 5% quarterly redemption limits and 3% early redemption haircuts. Immediate liquidation triggers severe penalties.',
    ciHoldings: [
      {
        name: 'Non-Traded Private Real Estate REIT',
        assetClass: 'REAL_ESTATE',
        value: 700000,
        costBasis: 700000,
        accountType: 'taxable',
        expenseRatio: 0.0140,
        exitFeePct: 0.03, // 3% early exit haircut = $21,000!
        actionInPi: 'liquidate_and_switch',
        actionInOpt: 'retain',
        notes: 'Quarterly redemption limits (5% gate). Early exit incurs $21,000 penalty.'
      },
      {
        name: 'Private Credit Interval Fund',
        assetClass: 'US_AGG_BOND',
        value: 600000,
        costBasis: 600000,
        accountType: 'taxable',
        expenseRatio: 0.0125,
        exitFeePct: 0.02, // 2% redemption penalty = $12,000
        actionInPi: 'liquidate_and_switch',
        actionInOpt: 'retain',
        notes: '1-year lockup remaining.'
      },
      {
        name: 'S&P 500 Index Brokerage',
        assetClass: 'SP500',
        value: 500000,
        costBasis: 350000,
        accountType: 'taxable',
        expenseRatio: 0.0004,
        exitFeePct: 0.0,
        actionInPi: 'liquidate_and_switch',
        actionInOpt: 'tax_loss_harvest_swap'
      },
      {
        name: 'Traditional IRA',
        assetClass: 'SP500',
        value: 400000,
        costBasis: 400000,
        accountType: 'trad_ira',
        expenseRatio: 0.0040,
        exitFeePct: 0.0,
        actionInPi: 'convert_roth',
        actionInOpt: 'staged_roth'
      }
    ],
    piHoldings: [
      {
        name: 'Global Macro Liquid Advisory Strategy',
        assetClass: 'SP500',
        value: 2200000,
        costBasis: 2200000,
        accountType: 'taxable',
        expenseRatio: 0.010,
        advisoryFee: 0.010,
        notes: 'Incurs $33k in redemption haircuts plus $116k in taxes on forced liquidation.'
      }
    ],
    optHoldings: [
      {
        name: 'Private Asset Dividend Harvesting (Exit at Par)',
        assetClass: 'REAL_ESTATE',
        value: 1300000,
        costBasis: 1300000,
        accountType: 'taxable',
        expenseRatio: 0.0130,
        advisoryFee: 0.0,
        notes: 'Receives quarterly income and transitions sequentially at par without penalty.'
      },
      {
        name: 'Liquid Core Factor Optimization (S&P + Tech)',
        assetClass: 'SP500',
        value: 500000,
        costBasis: 450000,
        accountType: 'taxable',
        expenseRatio: 0.0008,
        advisoryFee: 0.0025
      },
      {
        name: 'Traditional IRA (Preserve Low Fee Accumulation)',
        assetClass: 'SP500',
        value: 400000,
        costBasis: 400000,
        accountType: 'trad_ira',
        expenseRatio: 0.0004,
        advisoryFee: 0.002
      }
    ]
  },
  {
    id: 'persona_8_dividend_trap',
    name: 'Arthur Pendelton',
    subtitle: 'High-Yield Trap: $900k Concentrated Legacy Utilities & Telecoms',
    portfolioType: 'dividend_trap',
    age: 64,
    retireAge: 65,
    annualIncome: 95000,
    state: 'PA',
    filingStatus: 'MFJ',
    withdrawalNeed: 52000,
    inflationRate: 0.026,
    riskTolerance: 'Low',
    advisoryNotes: 'Client locked in high-yielding telecoms and utilities (T, VZ, SO) yielding 6.2% but with negative 10-yr real capital growth. Sells nothing, but purchasing power is getting crushed by inflation.',
    ciHoldings: [
      {
        name: 'Legacy Telecoms & Utilities Basket (T / VZ / SO)',
        assetClass: 'DIVIDEND_VALUE',
        value: 500000,
        costBasis: 450000,
        accountType: 'taxable',
        expenseRatio: 0.0,
        exitFeePct: 0.0,
        actionInPi: 'liquidate_and_switch',
        actionInOpt: 'tax_loss_harvest_swap',
        notes: 'High dividend yield of 6.2%, but 0% real capital appreciation over past decade.'
      },
      {
        name: 'High Yield Junk Bond Fund',
        assetClass: 'US_AGG_BOND',
        value: 250000,
        costBasis: 250000,
        accountType: 'taxable',
        expenseRatio: 0.0095, // 95 bps
        exitFeePct: 0.0,
        actionInPi: 'liquidate_and_switch',
        actionInOpt: 'retain'
      },
      {
        name: 'Traditional IRA',
        assetClass: 'SP500',
        value: 150000,
        costBasis: 150000,
        accountType: 'trad_ira',
        expenseRatio: 0.0050,
        exitFeePct: 0.0,
        actionInPi: 'convert_roth',
        actionInOpt: 'staged_roth'
      }
    ],
    piHoldings: [
      {
        name: 'Aggressive Nasdaq Tech Growth (Zero Dividend Yield)',
        assetClass: 'NASDAQ100',
        value: 900000,
        costBasis: 900000,
        accountType: 'taxable',
        expenseRatio: 0.010,
        advisoryFee: 0.008,
        notes: 'Destroys Arthur’s cash flow; forces him to sell shares into down markets to live.'
      }
    ],
    optHoldings: [
      {
        name: 'Dividend Growth + Covered Call Strategy (SCHD + JEPI)',
        assetClass: 'DIVIDEND_VALUE',
        value: 500000,
        costBasis: 480000,
        accountType: 'taxable',
        expenseRatio: 0.0018,
        advisoryFee: 0.0025,
        notes: 'Delivers 5.4% resilient cash flow, 40% lower volatility, and real inflation growth.'
      },
      {
        name: 'Investment Grade Intermediate Bond Ladder',
        assetClass: 'US_AGG_BOND',
        value: 250000,
        costBasis: 250000,
        accountType: 'taxable',
        expenseRatio: 0.0005,
        advisoryFee: 0.001
      },
      {
        name: 'Traditional IRA Rollover Core',
        assetClass: 'SP500',
        value: 150000,
        costBasis: 150000,
        accountType: 'trad_ira',
        expenseRatio: 0.0004,
        advisoryFee: 0.002
      }
    ]
  }
];
