# LPL Financial: Advisor Investment Transition Intelligence Solution
### Inter IIT Tech Meet 15.0 — Mid Prep Competition Submission

[![React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20TypeScript-blue)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38bdf8)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Engine-Python%203.12%2F3.14-yellow)](https://www.python.org/)
[![Vite](https://img.shields.io/badge/Build-Vite%208-purple)](https://vite.dev/)
[![SEC Reg BI](https://img.shields.io/badge/Compliance-SEC%20Reg%20BI%20%2F%20SECURE%202.0-emerald)](https://www.sec.gov/)

An enterprise-grade, explainable quantitative advisory transition platform developed for **LPL Financial** ($2.6T+ in advisory and brokerage assets). The solution evaluates client portfolio transitions from a Current Investment (CI) strategy to a Proposed Investment (PI) strategy, accounts for Day-1 taxes and contractual exit charges, solves the exact break-even recovery horizon, simulates multi-decade retirement longevity (Ages 50 $\rightarrow$ 90) under SECURE 2.0 RMDs, and formulates the optimal **LPL AI-Optimized Staged Strategy (AI-Opt)**.

---

## 1. System Features & Core Capabilities

1. **Bold, Sharp, Minimalist Advisor UI:**
   - Designed with high-contrast, razor-sharp neo-brutalist typography, geometric borders, and monospaced tabular metrics.
   - Built with zero bloat and maximum data density for effortless advisor navigation.
2. **Comprehensive Share Market Risk Analytics:**
   - 1Y, 3Y, 5Y, and 10Y historical annualized returns (CAGR).
   - Annualized volatility ($\sigma$), Sharpe ratio ($R_f = 4.2\%$), Sortino downside ratio, Beta to S&P 500, Max Drawdown, Value at Risk (VaR 95%), and Conditional VaR (CVaR 95%).
3. **8 Real-World Client Archetypes & Edge Cases:**
   - **Case Study 2.3 Benchmark:** David & Sarah Miller (\$700k, Age 50) — Rollover, annuity swap, and Roth conversion.
   - **Hyper-Growth Tech Accumulator:** Marcus Vance (\$450k, Age 32, CA 9.3% tax) — Concentrated tech and crypto.
   - **Wealth Preservation Near-Retiree:** Robert & Elena Castillo (\$1.8M, Age 59, FL 0% tax) — 7% variable annuity surrender penalty.
   - **Ultra-HNW Embedded Gains Trap:** Jonathan Hastings (\$3.5M, Age 48, NY State + NYC 10.72% tax) — \$1.7M unrealized taxable gain.
   - **Active Decumulation & RMD Risk:** Eleanor Vance (\$1.2M, Age 68) — 5.4% SWR facing imminent SECURE 2.0 RMDs.
   - **Young Career Starter:** Tyler Brooks (\$85k, Age 26, TX) — High vulnerability to advisory wrap fee drag.
   - **Illiquid Alternatives & Private Equity:** Harrison Sterling (\$2.2M, Age 55, WA) — 3% early exit haircut and redemption gates.
   - **Stagnant Legacy Dividend Trap:** Arthur Pendelton (\$900k, Age 64, PA) — Inflation purchasing power collapse.
4. **Transition Friction & Tax Waterfall Engine:**
   - Quantifies Long-Term Capital Gains Tax (Federal + NIIT 3.8% + State), annuity surrender charges, mutual fund redemption penalties, and ordinary income tax on Roth conversions.
5. **Continuous Break-Even Crossover Solver:**
   - Solves the differential compounding equation to determine the exact year and month when net wealth under PI catches up to CI.
6. **Retirement Longevity & Decumulation (Ages 50 $\rightarrow$ 90):**
   - Simulates wealth trajectories through ages 60, 70, 80, and 90 with inflation-adjusted annual withdrawals and mandatory IRS Uniform Lifetime Table RMDs starting at age 75.
7. **Macro Crisis Stress Testing & Monte Carlo Engine:**
   - Replays 2008 Great Financial Crisis, 2020 COVID-19 crash, and 2022 Stagflation shocks.
   - 1,000-iteration fat-tailed Monte Carlo simulation computing the Probability of Portfolio Longevity through Age 90.
8. **1-Click Investor-Ready Proposal Generator:**
   - Produces a publication-ready, fiduciary proposal formatted for client presentation and print/PDF export.

---

## 2. Directory Structure

```
├── advisor-transition-app/          # Interactive Web Platform (React 19 + TypeScript + Tailwind v4)
│   ├── src/
│   │   ├── types/portfolio.ts       # Type definitions for portfolios, assets, taxes, and simulations
│   │   ├── data/samplePortfolios.ts # 8 comprehensive portfolios & edge cases
│   │   ├── data/marketData.ts       # Asset class return, volatility, correlation & risk metrics
│   │   ├── utils/financialCalculations.ts # Core financial math calculation engine
│   │   ├── components/
│   │   │   ├── Navbar.tsx           # Header, status indicators, quick actions
│   │   │   ├── PersonaSelector.tsx  # Sharp horizontal pill selector across 8 personas
│   │   │   ├── ExecutiveBanner.tsx  # Bottom-line advisor directive and metrics cards
│   │   │   ├── HoldingsMatrix.tsx   # Side-by-side asset architecture (CI vs PI vs AI-Opt)
│   │   │   ├── FrictionWaterfall.tsx # Visual breakdown of all friction costs
│   │   │   ├── BreakEvenChart.tsx   # Interactive SVG crossover timeline
│   │   │   ├── LongevitySimulator.tsx # Ages 50-90 retirement decumulation curves with RMDs
│   │   │   ├── MarketRiskAnalytics.tsx # Deep market risk table (Sharpe, Sortino, VaR, CVaR, Beta)
│   │   │   ├── StressTestGrid.tsx   # Historical crisis replay (2008, 2020, 2022)
│   │   │   ├── MonteCarloGauge.tsx  # 1,000-iteration probability of success & percentiles
│   │   │   ├── InvestorProposalModal.tsx # Investor-Ready Proposal view with Print/PDF export
│   │   │   └── ScenarioControls.tsx # Real-time interactive parameter calibration drawer
│   │   ├── App.tsx                  # Main orchestration component
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── engine/                          # Standalone Python Financial Simulation Engine
│   └── transition_engine.py         # Multi-persona simulation, tax solver, and export pipeline
├── data/                            # Generated Datasets & Benchmark Tables
│   ├── transition_results.json      # Fixed schema JSON database of backtest & transition results
│   ├── transition_results.csv       # Standardized CSV results table (FAQ #16 compliant)
│   └── market_historical_data.csv   # Historical market benchmarks and stress shocks
├── deliverables/                    # Competition Deliverables & Documentation
│   ├── PLAN_AND_SOLUTION_DESIGN.md  # Max 5 pages advisor solution design
│   ├── TECHNICAL_REPORT.md          # Max 10 pages technical report & mathematical proofs
│   ├── CLIENT_PROPOSAL.md           # Investor-ready client proposal for Section 2.3 persona
│   └── FINAL_PRESENTATION_OUTLINE.md # 12-slide final presentation deck breakdown
└── README.md                        # Master setup, execution guide, and AI disclosure
```

---

## 3. Quick Start & Execution Instructions

### Prerequisites
- **Node.js:** v18.0.0 or higher (v24 tested)
- **Python:** 3.10+ (Standard library only; zero external Python dependencies required)

### Step 1: Run the Standalone Python Engine
The Python engine runs all simulations across all 8 personas and regenerates the standardized CSV and JSON datasets:
```powershell
python engine/transition_engine.py
```
*Output files generated:*
- `data/transition_results.json`
- `data/transition_results.csv`
- `data/market_historical_data.csv`

### Step 2: Run the Interactive Web Application
Navigate to the web application directory and launch the development server:
```powershell
cd advisor-transition-app
npm install
npm run dev
```
Open your browser to: **`http://localhost:5173/`**

To create an optimized production build:
```powershell
npm run build
```

---

## 4. Key Financial Findings: Section 2.3 Reference Scenario

For the **David & Sarah Miller (\$700,000 AUM)** scenario specified in the problem statement:
- **Immediate Transition Drag:** Executing the Proposed Investment (PI) incurs **\$68,400 in Day-1 friction** ($9.77\%$ of wealth wiped out).
  - Capital Gains Tax on S&P Mutual Fund: **\$9,520**
  - Mutual Fund Exit Clause ($1.0\%$): **\$500**
  - Vanguard Annuity Surrender Penalty ($1.5\%$): **\$1,500**
  - Lump-Sum Roth Conversion Tax Spike (Ordinary Income): **\$56,000**
  - Transaction Costs: **\$880**
- **Break-Even Analysis:** Because PI starts with only \$631,600 of productive principal, it requires **6.9 years** just to recover from the initial friction. With only 10 years remaining until planned retirement at age 60, PI leaves the client vulnerable to market downturns during the pre-retirement accumulation window.
- **The LPL AI-Optimized Alternative:**
  - Converts the Traditional IRA in **5 equal annual tranches (\$40,000/yr)** to remain within the $24\%$ federal bracket, saving over **\$14,000 in upfront taxes**.
  - **Retains the Vanguard Annuity**, saving the \$1,500 surrender fee and protecting the guaranteed \$3,000/year income floor.
  - Implements a **Core-Satellite ETF architecture** (VOO 70% / QQQM 30%), reducing ongoing fee drag from $1.15\%$ to **$0.28\%$**.
  - Recovers initial friction in just **0.8 years** and delivers **+\$244,500 more wealth** at Age 90.

---

## 5. Responsible AI and Data Transparency Disclosure

In adherence to Section 3.4 (Evaluation Criteria) and Clarifications FAQ #13:
- **AI-Assisted Work Disclosure:** Anthropic Claude and Google Gemini models were utilized during the research, software engineering, and document structuring phases of this project.
- **Glass-Box Financial Models:** All quantitative equations, tax calculations (TCJA & SECURE 2.0), compound interest formulas, and Monte Carlo engines were implemented deterministically using audited mathematical principles. No black-box generative models make unsupervised financial calculations.
- **Data Licensing & Sources:** Historical returns, volatilities, and stress metrics are derived from publicly available financial data (S&P Dow Jones Indices, Kenneth French Data Library, Federal Reserve FRED, and IRS Revenue Procedures).
- **Zero PII Exposure:** All client names and demographic personas are synthetic and do not reference real individuals.
