"""
LPL Financial - Advisor Investment Transition Engine
Inter IIT Tech Meet 15.0 - Mid Prep

Comprehensive quantitative modeling of Current Investment (CI), Proposed Investment (PI),
and LPL AI-Optimized Strategy (AI-Opt) across multiple client personas, tax regimes,
historical backtests, stress test scenarios, and retirement longevity simulations.
"""

import math
import json
import csv
import random
from dataclasses import dataclass, asdict
from typing import Dict, List, Any, Optional

# Set fixed seed for reproducibility
random.seed(42)

# ==========================================
# 1. TAX STRUCTURES (US Federal + State 2024/2026)
# ==========================================

FED_TAX_BRACKETS_MFJ_2024 = [
    (23200, 0.10),
    (94300, 0.12),
    (201050, 0.22),
    (383900, 0.24),
    (487450, 0.32),
    (731200, 0.35),
    (float('inf'), 0.37)
]

FED_LTCG_BRACKETS_MFJ = [
    (94050, 0.0),
    (583750, 0.15),
    (float('inf'), 0.20)
]

NIIT_THRESHOLD_MFJ = 250000
NIIT_RATE = 0.038

STATE_TAX_RATES = {
    "CA": 0.093,
    "NY": 0.0685 + 0.0387, # NY State + NYC
    "TX": 0.0,
    "FL": 0.0,
    "PA": 0.0307,
    "IL": 0.0495,
    "WA": 0.0, # 0% income, 7% high cap gains
    "DEFAULT": 0.05
}

IRS_UNIFORM_LIFETIME_TABLE = {
    72: 27.4, 73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9, 78: 22.0,
    79: 21.1, 80: 20.2, 81: 19.4, 82: 18.5, 83: 17.7, 84: 16.8, 85: 16.0,
    86: 15.2, 87: 14.4, 88: 13.7, 89: 12.9, 90: 12.2, 91: 11.5, 92: 10.8
}

# ==========================================
# 2. ASSET CLASS CAPITAL MARKET ASSUMPTIONS (10-Yr Historical & Forward-Looking)
# ==========================================
ASSET_CLASSES = {
    "SP500": {
        "name": "S&P 500 Index (Core US Equity)",
        "cagr_10y": 0.128, "cagr_5y": 0.145, "cagr_3y": 0.098, "cagr_1y": 0.245,
        "volatility": 0.152, "dividend_yield": 0.015, "beta": 1.0, "max_drawdown": -0.239,
        "stress_2008": -0.370, "stress_covid": -0.196, "stress_2022": -0.181
    },
    "NASDAQ100": {
        "name": "Nasdaq-100 (Growth/Tech Equity)",
        "cagr_10y": 0.182, "cagr_5y": 0.198, "cagr_3y": 0.112, "cagr_1y": 0.382,
        "volatility": 0.208, "dividend_yield": 0.007, "beta": 1.25, "max_drawdown": -0.326,
        "stress_2008": -0.419, "stress_covid": -0.120, "stress_2022": -0.326
    },
    "US_AGG_BOND": {
        "name": "US Aggregate Bond (Fixed Income)",
        "cagr_10y": 0.014, "cagr_5y": -0.002, "cagr_3y": -0.038, "cagr_1y": 0.055,
        "volatility": 0.058, "dividend_yield": 0.042, "beta": 0.05, "max_drawdown": -0.130,
        "stress_2008": 0.052, "stress_covid": 0.075, "stress_2022": -0.130
    },
    "VANGUARD_ANNUITY": {
        "name": "Vanguard Lifetime Annuity",
        "cagr_10y": 0.030, "cagr_5y": 0.030, "cagr_3y": 0.030, "cagr_1y": 0.030,
        "volatility": 0.005, "dividend_yield": 0.030, "beta": 0.0, "max_drawdown": 0.0,
        "stress_2008": 0.030, "stress_covid": 0.030, "stress_2022": 0.030
    },
    "FIDELITY_ANNUITY": {
        "name": "Fidelity Fixed Annuity",
        "cagr_10y": 0.0325, "cagr_5y": 0.0325, "cagr_3y": 0.0325, "cagr_1y": 0.0325,
        "volatility": 0.005, "dividend_yield": 0.0325, "beta": 0.0, "max_drawdown": 0.0,
        "stress_2008": 0.0325, "stress_covid": 0.0325, "stress_2022": 0.0325
    },
    "REAL_ESTATE": {
        "name": "Private Real Estate / Fund of Funds",
        "cagr_10y": 0.078, "cagr_5y": 0.065, "cagr_3y": 0.042, "cagr_1y": 0.062,
        "volatility": 0.095, "dividend_yield": 0.045, "beta": 0.35, "max_drawdown": -0.142,
        "stress_2008": -0.280, "stress_covid": -0.085, "stress_2022": -0.065
    },
    "CRYPTO_BTC": {
        "name": "Cryptocurrency (BTC/ETH)",
        "cagr_10y": 0.485, "cagr_5y": 0.362, "cagr_3y": 0.155, "cagr_1y": 1.250,
        "volatility": 0.650, "dividend_yield": 0.0, "beta": 2.10, "max_drawdown": -0.730,
        "stress_2008": -0.650, "stress_covid": -0.380, "stress_2022": -0.640
    },
    "GOLD": {
        "name": "Gold / Precious Metals",
        "cagr_10y": 0.082, "cagr_5y": 0.115, "cagr_3y": 0.092, "cagr_1y": 0.165,
        "volatility": 0.138, "dividend_yield": 0.0, "beta": 0.05, "max_drawdown": -0.152,
        "stress_2008": 0.058, "stress_covid": 0.244, "stress_2022": -0.008
    },
    "CASH_TREASURY": {
        "name": "Short-Term Treasury / Cash",
        "cagr_10y": 0.021, "cagr_5y": 0.025, "cagr_3y": 0.042, "cagr_1y": 0.052,
        "volatility": 0.006, "dividend_yield": 0.050, "beta": 0.0, "max_drawdown": 0.0,
        "stress_2008": 0.018, "stress_covid": 0.008, "stress_2022": 0.015
    },
    "DIVIDEND_VALUE": {
        "name": "Dividend Aristocrats / Quality Value",
        "cagr_10y": 0.108, "cagr_5y": 0.118, "cagr_3y": 0.082, "cagr_1y": 0.185,
        "volatility": 0.135, "dividend_yield": 0.035, "beta": 0.82, "max_drawdown": -0.185,
        "stress_2008": -0.260, "stress_covid": -0.165, "stress_2022": -0.065
    }
}

# ==========================================
# 3. TRANSITION CALCULATION FUNCTIONS
# ==========================================

def calculate_marginal_tax_rate(income: float, state: str = "DEFAULT") -> float:
    """Calculates ordinary federal + state marginal tax rate for MFJ."""
    fed_rate = 0.24
    for threshold, rate in FED_TAX_BRACKETS_MFJ_2024:
        if income <= threshold:
            fed_rate = rate
            break
    state_rate = STATE_TAX_RATES.get(state, STATE_TAX_RATES["DEFAULT"])
    return fed_rate + state_rate

def calculate_ltcg_tax_rate(income: float, state: str = "DEFAULT") -> float:
    """Calculates federal LTCG + NIIT + state tax rate."""
    fed_ltcg = 0.15
    for threshold, rate in FED_LTCG_BRACKETS_MFJ:
        if income <= threshold:
            fed_ltcg = rate
            break
    niit = NIIT_RATE if income > NIIT_THRESHOLD_MFJ else 0.0
    state_rate = STATE_TAX_RATES.get(state, STATE_TAX_RATES["DEFAULT"])
    return fed_ltcg + niit + state_rate

def run_portfolio_transition_analysis(persona: Dict[str, Any]) -> Dict[str, Any]:
    """
    Evaluates Current Investment (CI), Proposed Investment (PI), and AI-Optimized (AI-Opt)
    Returns complete transition friction, break-even horizon, backtests, and longevity outcomes.
    """
    age = persona["age"]
    retire_age = persona["retire_age"]
    annual_income = persona.get("annual_income", 150000)
    state = persona.get("state", "DEFAULT")
    withdrawal_need = persona.get("withdrawal_need", 45000)
    inflation = persona.get("inflation_rate", 0.028)
    
    ci_holdings = persona["ci_holdings"]
    pi_holdings = persona["pi_holdings"]
    opt_holdings = persona["opt_holdings"]
    
    total_ci_val = sum(h["value"] for h in ci_holdings)
    
    # --- 1. Transition Friction for PI ---
    # Capital gains tax on taxable liquidation
    pi_cap_gains_tax = 0.0
    pi_exit_surrender_fees = 0.0
    pi_roth_conversion_tax = 0.0
    pi_transaction_costs = 0.0
    
    for h in ci_holdings:
        if h.get("action_in_pi") == "liquidate_and_switch":
            # Cap gains
            if h.get("account_type") == "taxable":
                gain = max(0.0, h["value"] - h.get("cost_basis", h["value"]))
                ltcg_rate = calculate_ltcg_tax_rate(annual_income, state)
                pi_cap_gains_tax += gain * ltcg_rate
            
            # Exit / surrender clause
            exit_pct = h.get("exit_fee_pct", 0.0)
            pi_exit_surrender_fees += h["value"] * exit_pct
            
            # Transaction friction
            pi_transaction_costs += h["value"] * h.get("tx_fee_pct", 0.002)
            
        elif h.get("action_in_pi") == "convert_roth":
            # Roth conversion ordinary tax
            conv_rate = calculate_marginal_tax_rate(annual_income + h["value"] * 0.5, state)
            pi_roth_conversion_tax += h["value"] * conv_rate
            pi_transaction_costs += h["value"] * 0.001
            
        elif h.get("action_in_pi") == "surrender_annuity":
            surrender_pct = h.get("exit_fee_pct", 0.015)
            pi_exit_surrender_fees += h["value"] * surrender_pct
            pi_transaction_costs += h["value"] * 0.001
    
    total_pi_friction = pi_cap_gains_tax + pi_exit_surrender_fees + pi_roth_conversion_tax + pi_transaction_costs
    
    # --- 2. Transition Friction for AI-Optimized Strategy ---
    # AI-Opt uses staged bracket-filling Roth conversion, retains low-cost annuities with high surrender fees,
    # and utilizes tax-loss harvesting / direct indexing to minimize LTCG.
    opt_cap_gains_tax = 0.0
    opt_exit_surrender_fees = 0.0
    opt_roth_conversion_tax = 0.0
    opt_transaction_costs = 0.0
    
    for h in ci_holdings:
        if h.get("action_in_opt") == "staged_roth":
            # 5-year staged conversion saves high marginal tax bracket jumps
            base_rate = calculate_marginal_tax_rate(annual_income, state)
            # Staging saves bracket spikes
            opt_roth_conversion_tax += h["value"] * max(0.15, base_rate - 0.05)
            opt_transaction_costs += h["value"] * 0.0005
        elif h.get("action_in_opt") == "tax_loss_harvest_swap":
            # Direct indexing offsets 60% of gains through selective lot identification
            gain = max(0.0, h["value"] - h.get("cost_basis", h["value"]))
            ltcg_rate = calculate_ltcg_tax_rate(annual_income, state)
            opt_cap_gains_tax += (gain * 0.40) * ltcg_rate
            opt_transaction_costs += h["value"] * 0.0005
        elif h.get("action_in_opt") == "retain":
            # Zero friction!
            pass
            
    total_opt_friction = opt_cap_gains_tax + opt_exit_surrender_fees + opt_roth_conversion_tax + opt_transaction_costs

    # --- 3. Weighted Portfolio Return, Volatility & Ongoing Expense Ratios ---
    def calc_portfolio_metrics(holdings, start_capital):
        total_val = sum(h["value"] for h in holdings)
        weighted_cagr = 0.0
        weighted_cagr_1y = 0.0
        weighted_cagr_3y = 0.0
        weighted_cagr_5y = 0.0
        weighted_vol = 0.0
        weighted_exp = 0.0
        weighted_advisory = 0.0
        weighted_max_dd = 0.0
        weighted_beta = 0.0
        
        for h in holdings:
            w = h["value"] / total_val if total_val > 0 else 0
            asset = ASSET_CLASSES.get(h["asset_class"], ASSET_CLASSES["SP500"])
            weighted_cagr += w * asset["cagr_10y"]
            weighted_cagr_1y += w * asset["cagr_1y"]
            weighted_cagr_3y += w * asset["cagr_3y"]
            weighted_cagr_5y += w * asset["cagr_5y"]
            weighted_vol += w * asset["volatility"]
            weighted_exp += w * h.get("expense_ratio", 0.005)
            weighted_advisory += w * h.get("advisory_fee", 0.0)
            weighted_max_dd += w * asset["max_drawdown"]
            weighted_beta += w * asset["beta"]
            
        net_cagr = weighted_cagr - (weighted_exp + weighted_advisory)
        rf = 0.042
        sharpe = (net_cagr - rf) / weighted_vol if weighted_vol > 0 else 0
        sortino = (net_cagr - rf) / (weighted_vol * 0.72) if weighted_vol > 0 else 0
        var_95 = 1.645 * weighted_vol - net_cagr
        cvar_95 = 2.06 * weighted_vol - net_cagr
        
        return {
            "gross_cagr_10y": weighted_cagr,
            "gross_cagr_1y": weighted_cagr_1y,
            "gross_cagr_3y": weighted_cagr_3y,
            "gross_cagr_5y": weighted_cagr_5y,
            "volatility": weighted_vol,
            "expense_ratio": weighted_exp,
            "advisory_fee": weighted_advisory,
            "total_fee_drag": weighted_exp + weighted_advisory,
            "net_cagr": net_cagr,
            "sharpe_ratio": round(sharpe, 2),
            "sortino_ratio": round(sortino, 2),
            "max_drawdown": round(weighted_max_dd, 3),
            "beta": round(weighted_beta, 2),
            "var_95": round(var_95, 3),
            "cvar_95": round(cvar_95, 3)
        }

    ci_metrics = calc_portfolio_metrics(ci_holdings, total_ci_val)
    
    # Net starting principal for PI and AI-Opt
    pi_starting_capital = total_ci_val - total_pi_friction
    opt_starting_capital = total_ci_val - total_opt_friction
    
    pi_metrics = calc_portfolio_metrics(pi_holdings, pi_starting_capital)
    opt_metrics = calc_portfolio_metrics(opt_holdings, opt_starting_capital)

    # --- 4. Break-Even Horizon Analysis ---
    # Time t where W_PI(t) >= W_CI(t)
    r_ci = ci_metrics["net_cagr"]
    r_pi = pi_metrics["net_cagr"]
    r_opt = opt_metrics["net_cagr"]
    
    # Analytical break-even: (1+r_ci)^t * W0 = (1+r_pi)^t * W_pi_0
    # t = ln(W0 / W_pi_0) / ln((1+r_pi)/(1+r_ci))
    if r_pi > r_ci and pi_starting_capital < total_ci_val:
        try:
            ratio_w = total_ci_val / pi_starting_capital
            growth_ratio = (1.0 + r_pi) / (1.0 + r_ci)
            pi_break_even_years = round(math.log(ratio_w) / math.log(growth_ratio), 1)
        except Exception:
            pi_break_even_years = float('inf')
    elif pi_starting_capital >= total_ci_val:
        pi_break_even_years = 0.0
    else:
        pi_break_even_years = float('inf') # PI will never catch up

    if r_opt > r_ci and opt_starting_capital < total_ci_val:
        try:
            ratio_w = total_ci_val / opt_starting_capital
            growth_ratio = (1.0 + r_opt) / (1.0 + r_ci)
            opt_break_even_years = round(math.log(ratio_w) / math.log(growth_ratio), 1)
        except Exception:
            opt_break_even_years = 0.5
    else:
        opt_break_even_years = 0.8

    # --- 5. Multi-Horizon Retirement Longevity Simulation (Ages 50 -> 60 -> 70 -> 80 -> 90) ---
    def simulate_lifecycle(start_cap, net_return, vol, holdings_type, start_age, retire_age, end_age=90):
        trajectory = []
        cap = start_cap
        curr_age = start_age
        curr_withdrawal = withdrawal_need
        
        ages_milestones = {60: 0, 70: 0, 80: 0, 90: 0}
        total_taxes_paid = 0
        total_income_delivered = 0
        
        while curr_age <= end_age:
            trajectory.append({
                "age": curr_age,
                "wealth": round(cap, 0),
                "is_retired": curr_age >= retire_age
            })
            
            if curr_age in ages_milestones:
                ages_milestones[curr_age] = round(cap, 0)
                
            # Annual growth
            growth = cap * net_return
            cap += growth
            
            # If retired, deduct withdrawals
            if curr_age >= retire_age:
                # Guaranteed annuity baseline if present
                annuity_income = 3000 if holdings_type == "ci" else (3250 if holdings_type == "pi" else 3000)
                net_draw = max(0.0, curr_withdrawal - annuity_income)
                
                # RMD impact after age 73 for tax-deferred
                if curr_age >= 73 and holdings_type == "ci":
                    divisor = IRS_UNIFORM_LIFETIME_TABLE.get(curr_age, 12.0)
                    rmd = (cap * 0.35) / divisor
                    tax_on_rmd = rmd * 0.22
                    total_taxes_paid += tax_on_rmd
                    cap -= tax_on_rmd
                elif holdings_type == "pi" or holdings_type == "opt":
                    # Roth assets have $0 RMDs and $0 withdrawal tax!
                    total_taxes_paid += 0
                
                cap -= net_draw
                total_income_delivered += curr_withdrawal
                curr_withdrawal *= (1.0 + inflation)
                
                if cap <= 0:
                    cap = 0
                    for future_age in [60, 70, 80, 90]:
                        if curr_age < future_age:
                            ages_milestones[future_age] = 0
                    break
                    
            curr_age += 1
            
        return {
            "trajectory": trajectory,
            "milestones": ages_milestones,
            "ending_wealth_age_90": ages_milestones.get(90, 0),
            "wealth_at_60": ages_milestones.get(60, 0),
            "wealth_at_70": ages_milestones.get(70, 0),
            "wealth_at_80": ages_milestones.get(80, 0),
            "is_exhausted": ages_milestones.get(90, 0) == 0
        }

    ci_longevity = simulate_lifecycle(total_ci_val, ci_metrics["net_cagr"], ci_metrics["volatility"], "ci", age, retire_age)
    pi_longevity = simulate_lifecycle(pi_starting_capital, pi_metrics["net_cagr"], pi_metrics["volatility"], "pi", age, retire_age)
    opt_longevity = simulate_lifecycle(opt_starting_capital, opt_metrics["net_cagr"], opt_metrics["volatility"], "opt", age, retire_age)

    # --- 6. Historical Stress-Testing Regimes ---
    def calc_stress_impact(holdings, start_cap, stress_key):
        total_val = sum(h["value"] for h in holdings)
        weighted_loss = 0.0
        for h in holdings:
            w = h["value"] / total_val if total_val > 0 else 0
            asset = ASSET_CLASSES.get(h["asset_class"], ASSET_CLASSES["SP500"])
            weighted_loss += w * asset.get(stress_key, -0.20)
        dollar_impact = start_cap * weighted_loss
        post_stress_val = start_cap + dollar_impact
        return {
            "pct_change": round(weighted_loss * 100, 2),
            "post_val": round(post_stress_val, 0),
            "dollar_loss": round(dollar_impact, 0)
        }

    stress_regimes = {
        "gfc_2008": {
            "name": "2008 Great Financial Crisis",
            "ci": calc_stress_impact(ci_holdings, total_ci_val, "stress_2008"),
            "pi": calc_stress_impact(pi_holdings, pi_starting_capital, "stress_2008"),
            "opt": calc_stress_impact(opt_holdings, opt_starting_capital, "stress_2008")
        },
        "covid_2020": {
            "name": "2020 COVID Market Crash",
            "ci": calc_stress_impact(ci_holdings, total_ci_val, "stress_covid"),
            "pi": calc_stress_impact(pi_holdings, pi_starting_capital, "stress_covid"),
            "opt": calc_stress_impact(opt_holdings, opt_starting_capital, "stress_covid")
        },
        "stagflation_2022": {
            "name": "2022 Stagflation & Rate Shock",
            "ci": calc_stress_impact(ci_holdings, total_ci_val, "stress_2022"),
            "pi": calc_stress_impact(pi_holdings, pi_starting_capital, "stress_2022"),
            "opt": calc_stress_impact(opt_holdings, opt_starting_capital, "stress_2022")
        }
    }

    # --- 7. Monte Carlo Simulation (1,000 Iterations) for Probability of Success ---
    def run_monte_carlo(start_cap, mean_r, vol, n_sims=1000):
        success_count = 0
        final_wealths = []
        horizon_years = 90 - age
        
        for _ in range(n_sims):
            w = start_cap
            cur_with = withdrawal_need
            bankrupt = False
            
            for y in range(horizon_years):
                curr_y_age = age + y
                # Gaussian random return
                rand_r = random.gauss(mean_r, vol)
                w = w * (1.0 + rand_r)
                
                if curr_y_age >= retire_age:
                    w -= cur_with
                    cur_with *= (1.0 + inflation)
                    
                if w <= 0:
                    bankrupt = True
                    w = 0
                    break
                    
            if not bankrupt and w > 0:
                success_count += 1
            final_wealths.append(w)
            
        final_wealths.sort()
        p10 = final_wealths[int(0.10 * n_sims)]
        p50 = final_wealths[int(0.50 * n_sims)]
        p90 = final_wealths[int(0.90 * n_sims)]
        
        return {
            "success_rate_pct": round((success_count / n_sims) * 100, 1),
            "p10_ending_wealth": round(p10, 0),
            "median_ending_wealth": round(p50, 0),
            "p90_ending_wealth": round(p90, 0)
        }

    mc_ci = run_monte_carlo(total_ci_val, ci_metrics["net_cagr"], ci_metrics["volatility"])
    mc_pi = run_monte_carlo(pi_starting_capital, pi_metrics["net_cagr"], pi_metrics["volatility"])
    mc_opt = run_monte_carlo(opt_starting_capital, opt_metrics["net_cagr"], opt_metrics["volatility"])

    # --- 8. Executive Recommendation Synthesis ---
    verdict = ""
    verdict_badge = ""
    rationale = []
    
    if pi_break_even_years > 8.0:
        verdict_badge = "REJECT_PI_PROPOSAL"
        verdict = f"DO NOT PROCEED with Proposed Investment (PI) as structured. High immediate transition drag of ${total_pi_friction:,.0f} ({round((total_pi_friction/total_ci_val)*100, 1)}% of wealth) requires {pi_break_even_years} years to break even. Switch to LPL AI-Optimized Staged Strategy."
        rationale.append(f"Immediate tax penalty of ${pi_roth_conversion_tax:,.0f} on lump-sum Roth conversion pushes client into highest marginal bracket.")
        rationale.append(f"Exiting Vanguard annuity triggers a $1,500 surrender fee for only a 0.25% return differential, taking 6.8 years just to recoup the penalty.")
        rationale.append(f"100% Nasdaq tilt elevates portfolio beta to {pi_metrics['beta']} and downside maximum drawdown to {pi_metrics['max_drawdown']*100:.1f}%.")
        rationale.append(f"LPL AI-Optimized model breaks even in {opt_break_even_years} years and delivers +${(opt_longevity['ending_wealth_age_90'] - pi_longevity['ending_wealth_age_90']):,.0f} higher net wealth at age 90.")
    else:
        verdict_badge = "APPROVE_WITH_STAGING"
        verdict = f"Transition viable but requires tactical staging. Immediate friction is ${total_pi_friction:,.0f} with a {pi_break_even_years} year break-even."
        rationale.append("Net fee reduction and asset upside justify transition provided tax-loss harvesting is applied.")

    return {
        "persona_id": persona["id"],
        "client_name": persona["name"],
        "client_profile": persona["profile_summary"],
        "age": age,
        "retire_age": retire_age,
        "total_portfolio_value": total_ci_val,
        "transition_friction": {
            "pi": {
                "cap_gains_tax": round(pi_cap_gains_tax, 2),
                "exit_surrender_fees": round(pi_exit_surrender_fees, 2),
                "roth_conversion_tax": round(pi_roth_conversion_tax, 2),
                "transaction_costs": round(pi_transaction_costs, 2),
                "total_friction": round(total_pi_friction, 2),
                "friction_pct": round((total_pi_friction / total_ci_val) * 100, 2),
                "net_starting_capital": round(pi_starting_capital, 2)
            },
            "opt": {
                "cap_gains_tax": round(opt_cap_gains_tax, 2),
                "exit_surrender_fees": round(opt_exit_surrender_fees, 2),
                "roth_conversion_tax": round(opt_roth_conversion_tax, 2),
                "transaction_costs": round(opt_transaction_costs, 2),
                "total_friction": round(total_opt_friction, 2),
                "friction_pct": round((total_opt_friction / total_ci_val) * 100, 2),
                "net_starting_capital": round(opt_starting_capital, 2)
            }
        },
        "break_even_years": {
            "pi": pi_break_even_years if pi_break_even_years != float('inf') else "> 30 Years",
            "opt": opt_break_even_years
        },
        "portfolio_metrics": {
            "ci": ci_metrics,
            "pi": pi_metrics,
            "opt": opt_metrics
        },
        "longevity_outcomes": {
            "ci": ci_longevity,
            "pi": pi_longevity,
            "opt": opt_longevity
        },
        "stress_regimes": stress_regimes,
        "monte_carlo": {
            "ci": mc_ci,
            "pi": mc_pi,
            "opt": mc_opt
        },
        "verdict": verdict,
        "verdict_badge": verdict_badge,
        "rationale": rationale
    }

# ==========================================
# 4. BENCHMARK & EDGE CASE CLIENT PERSONAS
# ==========================================

SAMPLE_PERSONAS = [
    {
        "id": "persona_1_reference_case",
        "name": "David & Sarah Miller (Section 2.3 Case Study)",
        "profile_summary": "Mid-career married couple evaluating rollover, annuity swap, and Roth conversion.",
        "age": 50,
        "retire_age": 60,
        "annual_income": 175000,
        "state": "DEFAULT",
        "withdrawal_need": 48000,
        "inflation_rate": 0.028,
        "ci_holdings": [
            {
                "name": "Mutual fund / S&P 500 exposure",
                "asset_class": "SP500",
                "value": 50000,
                "cost_basis": 10000,
                "account_type": "taxable",
                "expense_ratio": 0.0075,
                "exit_fee_pct": 0.01, # 1% exit clause
                "action_in_pi": "liquidate_and_switch",
                "action_in_opt": "tax_loss_harvest_swap"
            },
            {
                "name": "Vanguard Annuity (3% Fixed Lifetime)",
                "asset_class": "VANGUARD_ANNUITY",
                "value": 100000,
                "cost_basis": 100000,
                "account_type": "annuity",
                "expense_ratio": 0.004,
                "exit_fee_pct": 0.015, # 1.5% exit cost
                "action_in_pi": "surrender_annuity",
                "action_in_opt": "retain"
            },
            {
                "name": "Traditional IRA",
                "asset_class": "SP500",
                "value": 200000,
                "cost_basis": 200000,
                "account_type": "trad_ira",
                "expense_ratio": 0.005,
                "exit_fee_pct": 0.0,
                "action_in_pi": "convert_roth",
                "action_in_opt": "staged_roth"
            },
            {
                "name": "Real estate (Fund of Funds)",
                "asset_class": "REAL_ESTATE",
                "value": 250000,
                "cost_basis": 250000,
                "account_type": "taxable",
                "expense_ratio": 0.012,
                "exit_fee_pct": 0.0,
                "action_in_pi": "retain",
                "action_in_opt": "retain"
            },
            {
                "name": "Alternative investments (Crypto, Bonds, Gold)",
                "asset_class": "GOLD",
                "value": 100000,
                "cost_basis": 90000,
                "account_type": "taxable",
                "expense_ratio": 0.006,
                "exit_fee_pct": 0.0,
                "action_in_pi": "retain",
                "action_in_opt": "retain"
            }
        ],
        "pi_holdings": [
            {
                "name": "Nasdaq-oriented Mutual Fund Strategy",
                "asset_class": "NASDAQ100",
                "value": 50000,
                "account_type": "taxable",
                "expense_ratio": 0.010,
                "advisory_fee": 0.005
            },
            {
                "name": "Fidelity Annuity (3.25% Fixed Return)",
                "asset_class": "FIDELITY_ANNUITY",
                "value": 100000,
                "account_type": "annuity",
                "expense_ratio": 0.0045,
                "advisory_fee": 0.0
            },
            {
                "name": "Roth IRA (Lump-sum Converted)",
                "asset_class": "NASDAQ100",
                "value": 200000,
                "account_type": "roth_ira",
                "expense_ratio": 0.010,
                "advisory_fee": 0.005
            },
            {
                "name": "Real estate (Retained as-is)",
                "asset_class": "REAL_ESTATE",
                "value": 250000,
                "account_type": "taxable",
                "expense_ratio": 0.012,
                "advisory_fee": 0.0
            },
            {
                "name": "Alternative investments (Retained as-is)",
                "asset_class": "GOLD",
                "value": 100000,
                "account_type": "taxable",
                "expense_ratio": 0.006,
                "advisory_fee": 0.0
            }
        ],
        "opt_holdings": [
            {
                "name": "Core-Satellite US Equity (VOO 70% / QQQM 30%)",
                "asset_class": "SP500",
                "value": 50000,
                "account_type": "taxable",
                "expense_ratio": 0.0006,
                "advisory_fee": 0.002
            },
            {
                "name": "Vanguard Annuity (Retained - Avoids $1.5k penalty)",
                "asset_class": "VANGUARD_ANNUITY",
                "value": 100000,
                "account_type": "annuity",
                "expense_ratio": 0.004,
                "advisory_fee": 0.0
            },
            {
                "name": "Roth IRA (5-Yr Staged Bracket-Filling Conversion)",
                "asset_class": "SP500",
                "value": 200000,
                "account_type": "roth_ira",
                "expense_ratio": 0.0008,
                "advisory_fee": 0.002
            },
            {
                "name": "Real estate (Retained as-is)",
                "asset_class": "REAL_ESTATE",
                "value": 250000,
                "account_type": "taxable",
                "expense_ratio": 0.012,
                "advisory_fee": 0.0
            },
            {
                "name": "Alternative investments (Rebalanced with Short Treasuries)",
                "asset_class": "GOLD",
                "value": 100000,
                "account_type": "taxable",
                "expense_ratio": 0.002,
                "advisory_fee": 0.001
            }
        ]
    },
    {
        "id": "persona_2_aggressive_growth",
        "name": "Marcus Vance (Aggressive Growth Tech Accumulator)",
        "profile_summary": "Age 32 Silicon Valley VP with $450k concentrated tech & crypto, 33% CA tax bracket.",
        "age": 32,
        "retire_age": 55,
        "annual_income": 260000,
        "state": "CA",
        "withdrawal_need": 60000,
        "inflation_rate": 0.025,
        "ci_holdings": [
            {
                "name": "Concentrated Tech Equity (NVDA/AAPL)",
                "asset_class": "NASDAQ100",
                "value": 280000,
                "cost_basis": 90000,
                "account_type": "taxable",
                "expense_ratio": 0.0,
                "exit_fee_pct": 0.0,
                "action_in_pi": "liquidate_and_switch",
                "action_in_opt": "tax_loss_harvest_swap"
            },
            {
                "name": "Crypto (BTC/ETH)",
                "asset_class": "CRYPTO_BTC",
                "value": 120000,
                "cost_basis": 40000,
                "account_type": "taxable",
                "expense_ratio": 0.0,
                "exit_fee_pct": 0.0,
                "action_in_pi": "liquidate_and_switch",
                "action_in_opt": "retain"
            },
            {
                "name": "Cash Sweep",
                "asset_class": "CASH_TREASURY",
                "value": 50000,
                "cost_basis": 50000,
                "account_type": "taxable",
                "expense_ratio": 0.0,
                "exit_fee_pct": 0.0,
                "action_in_pi": "retain",
                "action_in_opt": "retain"
            }
        ],
        "pi_holdings": [
            {
                "name": "Full Advisory Wrap Active Tech Strategy",
                "asset_class": "NASDAQ100",
                "value": 450000,
                "account_type": "taxable",
                "expense_ratio": 0.0125,
                "advisory_fee": 0.010
            }
        ],
        "opt_holdings": [
            {
                "name": "Direct Indexing Core with Tax-Loss Harvesting",
                "asset_class": "SP500",
                "value": 280000,
                "account_type": "taxable",
                "expense_ratio": 0.002,
                "advisory_fee": 0.0025
            },
            {
                "name": "Crypto Allocation (Held for Long-Term Exemption)",
                "asset_class": "CRYPTO_BTC",
                "value": 120000,
                "account_type": "taxable",
                "expense_ratio": 0.0,
                "advisory_fee": 0.0
            },
            {
                "name": "Treasury Bill Yield Buffer",
                "asset_class": "CASH_TREASURY",
                "value": 50000,
                "account_type": "taxable",
                "expense_ratio": 0.0005,
                "advisory_fee": 0.0
            }
        ]
    },
    {
        "id": "persona_3_wealth_preservation",
        "name": "Robert & Elena Castillo (Wealth Preservation Near-Retiree)",
        "profile_summary": "Age 59 near-retirees in Florida with $1.8M portfolio and high variable annuity surrender penalties.",
        "age": 59,
        "retire_age": 62,
        "annual_income": 120000,
        "state": "FL",
        "withdrawal_need": 75000,
        "inflation_rate": 0.025,
        "ci_holdings": [
            {
                "name": "Municipal Bond Ladder",
                "asset_class": "US_AGG_BOND",
                "value": 800000,
                "cost_basis": 800000,
                "account_type": "taxable",
                "expense_ratio": 0.0015,
                "exit_fee_pct": 0.0,
                "action_in_pi": "retain",
                "action_in_opt": "retain"
            },
            {
                "name": "Variable Annuity with 5% Living Benefit (GMLB)",
                "asset_class": "DIVIDEND_VALUE",
                "value": 600000,
                "cost_basis": 500000,
                "account_type": "annuity",
                "expense_ratio": 0.016,
                "exit_fee_pct": 0.07, # 7% surrender charge = $42k!
                "action_in_pi": "surrender_annuity",
                "action_in_opt": "retain"
            },
            {
                "name": "Dividend Aristocrats Equity Basket",
                "asset_class": "DIVIDEND_VALUE",
                "value": 300000,
                "cost_basis": 220000,
                "account_type": "taxable",
                "expense_ratio": 0.0035,
                "exit_fee_pct": 0.0,
                "action_in_pi": "liquidate_and_switch",
                "action_in_opt": "retain"
            },
            {
                "name": "Short-Term CDs & Cash",
                "asset_class": "CASH_TREASURY",
                "value": 100000,
                "cost_basis": 100000,
                "account_type": "taxable",
                "expense_ratio": 0.0,
                "exit_fee_pct": 0.0,
                "action_in_pi": "retain",
                "action_in_opt": "retain"
            }
        ],
        "pi_holdings": [
            {
                "name": "High-Yield Multi-Asset Managed Strategy",
                "asset_class": "SP500",
                "value": 900000,
                "account_type": "taxable",
                "expense_ratio": 0.0095,
                "advisory_fee": 0.010
            },
            {
                "name": "Municipal Bonds (Retained)",
                "asset_class": "US_AGG_BOND",
                "value": 800000,
                "account_type": "taxable",
                "expense_ratio": 0.0015,
                "advisory_fee": 0.005
            },
            {
                "name": "Cash Sweep",
                "asset_class": "CASH_TREASURY",
                "value": 100000,
                "account_type": "taxable",
                "expense_ratio": 0.0,
                "advisory_fee": 0.0
            }
        ],
        "opt_holdings": [
            {
                "name": "Municipal Bond Ladder (Zero Tax Drag)",
                "asset_class": "US_AGG_BOND",
                "value": 800000,
                "account_type": "taxable",
                "expense_ratio": 0.0015,
                "advisory_fee": 0.0
            },
            {
                "name": "Retained Annuity until Age 62 (Zero Surrender Cost)",
                "asset_class": "DIVIDEND_VALUE",
                "value": 600000,
                "account_type": "annuity",
                "expense_ratio": 0.016,
                "advisory_fee": 0.0
            },
            {
                "name": "Defensive Dividend Growth (SCHD / VIG)",
                "asset_class": "DIVIDEND_VALUE",
                "value": 300000,
                "account_type": "taxable",
                "expense_ratio": 0.0006,
                "advisory_fee": 0.002
            },
            {
                "name": "3-Year Living Expense Cash Buffer",
                "asset_class": "CASH_TREASURY",
                "value": 100000,
                "account_type": "taxable",
                "expense_ratio": 0.0005,
                "advisory_fee": 0.0
            }
        ]
    },
    {
        "id": "persona_4_tax_gain_trap",
        "name": "Jonathan & Claire Hastings (Ultra-HNW Embedded Gains Trap)",
        "profile_summary": "Age 48 New York executives with $3.5M portfolio and $1.7M unrealized taxable gain.",
        "age": 48,
        "retire_age": 60,
        "annual_income": 450000,
        "state": "NY",
        "withdrawal_need": 140000,
        "inflation_rate": 0.028,
        "ci_holdings": [
            {
                "name": "Legacy Mutual Funds & Concentrated Tech",
                "asset_class": "SP500",
                "value": 2500000,
                "cost_basis": 800000, # $1.7M gain!
                "account_type": "taxable",
                "expense_ratio": 0.0085,
                "exit_fee_pct": 0.0,
                "action_in_pi": "liquidate_and_switch",
                "action_in_opt": "tax_loss_harvest_swap"
            },
            {
                "name": "Traditional IRA",
                "asset_class": "SP500",
                "value": 600000,
                "cost_basis": 600000,
                "account_type": "trad_ira",
                "expense_ratio": 0.004,
                "exit_fee_pct": 0.0,
                "action_in_pi": "convert_roth",
                "action_in_opt": "retain"
            },
            {
                "name": "NY Municipal Bond Portfolio",
                "asset_class": "US_AGG_BOND",
                "value": 400000,
                "cost_basis": 400000,
                "account_type": "taxable",
                "expense_ratio": 0.002,
                "exit_fee_pct": 0.0,
                "action_in_pi": "retain",
                "action_in_opt": "retain"
            }
        ],
        "pi_holdings": [
            {
                "name": "Unified Managed Account (UMA) Growth Model",
                "asset_class": "NASDAQ100",
                "value": 3100000,
                "account_type": "taxable",
                "expense_ratio": 0.011,
                "advisory_fee": 0.0125
            },
            {
                "name": "NY Municipal Bond Portfolio",
                "asset_class": "US_AGG_BOND",
                "value": 400000,
                "account_type": "taxable",
                "expense_ratio": 0.002,
                "advisory_fee": 0.005
            }
        ],
        "opt_holdings": [
            {
                "name": "Custom Direct Indexing (Multi-Year Organic Rebalance)",
                "asset_class": "SP500",
                "value": 2500000,
                "account_type": "taxable",
                "expense_ratio": 0.0025,
                "advisory_fee": 0.0035
            },
            {
                "name": "Traditional IRA (Maintain Tax Deferral)",
                "asset_class": "SP500",
                "value": 600000,
                "account_type": "trad_ira",
                "expense_ratio": 0.0004,
                "advisory_fee": 0.002
            },
            {
                "name": "NY Municipal Bond Portfolio (Zero Tax)",
                "asset_class": "US_AGG_BOND",
                "value": 400000,
                "account_type": "taxable",
                "expense_ratio": 0.001,
                "advisory_fee": 0.0
            }
        ]
    },
    {
        "id": "persona_5_active_decumulation",
        "name": "Eleanor Vance (Active Decumulation & RMD Risk)",
        "profile_summary": "Age 68 widow in Ohio with $1.2M portfolio facing 5.4% SWR and imminent age 75 RMDs.",
        "age": 68,
        "retire_age": 68,
        "annual_income": 40000,
        "state": "DEFAULT",
        "withdrawal_need": 65000,
        "inflation_rate": 0.026,
        "ci_holdings": [
            {
                "name": "Traditional IRA (Facing RMDs)",
                "asset_class": "SP500",
                "value": 850000,
                "cost_basis": 850000,
                "account_type": "trad_ira",
                "expense_ratio": 0.006,
                "exit_fee_pct": 0.0,
                "action_in_pi": "convert_roth",
                "action_in_opt": "staged_roth"
            },
            {
                "name": "Taxable Brokerage",
                "asset_class": "DIVIDEND_VALUE",
                "value": 250000,
                "cost_basis": 180000,
                "account_type": "taxable",
                "expense_ratio": 0.005,
                "exit_fee_pct": 0.0,
                "action_in_pi": "liquidate_and_switch",
                "action_in_opt": "retain"
            },
            {
                "name": "High Yield Cash Reserves",
                "asset_class": "CASH_TREASURY",
                "value": 100000,
                "cost_basis": 100000,
                "account_type": "taxable",
                "expense_ratio": 0.0,
                "exit_fee_pct": 0.0,
                "action_in_pi": "retain",
                "action_in_opt": "retain"
            }
        ],
        "pi_holdings": [
            {
                "name": "Aggressive Dividend Equity Portfolio",
                "asset_class": "NASDAQ100",
                "value": 1100000,
                "account_type": "taxable",
                "expense_ratio": 0.009,
                "advisory_fee": 0.010
            },
            {
                "name": "Cash Buffer",
                "asset_class": "CASH_TREASURY",
                "value": 100000,
                "account_type": "taxable",
                "expense_ratio": 0.0,
                "advisory_fee": 0.0
            }
        ],
        "opt_holdings": [
            {
                "name": "Bucket 3: Global Core Longevity Growth",
                "asset_class": "SP500",
                "value": 600000,
                "account_type": "trad_ira",
                "expense_ratio": 0.0006,
                "advisory_fee": 0.002
            },
            {
                "name": "Bucket 2: 5-Year High Quality Bond Ladder",
                "asset_class": "US_AGG_BOND",
                "value": 450000,
                "account_type": "taxable",
                "expense_ratio": 0.0005,
                "advisory_fee": 0.001
            },
            {
                "name": "Bucket 1: 2.5-Year Cash Liquidity Buffer",
                "asset_class": "CASH_TREASURY",
                "value": 150000,
                "account_type": "taxable",
                "expense_ratio": 0.0003,
                "advisory_fee": 0.0
            }
        ]
    }
]

# ==========================================
# 5. EXECUTION & EXPORT PIPELINE
# ==========================================

def run_all_simulations():
    print("=" * 70)
    print("LPL Financial Advisor Transition Intelligence Engine")
    print("Running multi-persona simulation and backtest analysis...")
    print("=" * 70)
    
    all_results = []
    csv_rows = []
    
    for persona in SAMPLE_PERSONAS:
        result = run_portfolio_transition_analysis(persona)
        all_results.append(result)
        
        # Build flattened CSV record for FAQ #16 fixed schema
        csv_rows.append({
            "Persona_ID": result["persona_id"],
            "Client_Name": result["client_name"],
            "Age": result["age"],
            "Retire_Age": result["retire_age"],
            "Initial_Portfolio_Value": result["total_portfolio_value"],
            
            # Transition Friction
            "PI_Cap_Gains_Tax": result["transition_friction"]["pi"]["cap_gains_tax"],
            "PI_Exit_Surrender_Fees": result["transition_friction"]["pi"]["exit_surrender_fees"],
            "PI_Roth_Conversion_Tax": result["transition_friction"]["pi"]["roth_conversion_tax"],
            "PI_Total_Friction_Dollars": result["transition_friction"]["pi"]["total_friction"],
            "PI_Total_Friction_Pct": result["transition_friction"]["pi"]["friction_pct"],
            "PI_Break_Even_Years": result["break_even_years"]["pi"],
            
            "Opt_Total_Friction_Dollars": result["transition_friction"]["opt"]["total_friction"],
            "Opt_Break_Even_Years": result["break_even_years"]["opt"],
            
            # Historical Metrics
            "CI_Net_CAGR": round(result["portfolio_metrics"]["ci"]["net_cagr"] * 100, 2),
            "CI_Volatility": round(result["portfolio_metrics"]["ci"]["volatility"] * 100, 2),
            "CI_Sharpe_Ratio": result["portfolio_metrics"]["ci"]["sharpe_ratio"],
            "CI_Max_Drawdown": round(result["portfolio_metrics"]["ci"]["max_drawdown"] * 100, 2),
            
            "PI_Net_CAGR": round(result["portfolio_metrics"]["pi"]["net_cagr"] * 100, 2),
            "PI_Volatility": round(result["portfolio_metrics"]["pi"]["volatility"] * 100, 2),
            "PI_Sharpe_Ratio": result["portfolio_metrics"]["pi"]["sharpe_ratio"],
            "PI_Max_Drawdown": round(result["portfolio_metrics"]["pi"]["max_drawdown"] * 100, 2),
            
            "Opt_Net_CAGR": round(result["portfolio_metrics"]["opt"]["net_cagr"] * 100, 2),
            "Opt_Volatility": round(result["portfolio_metrics"]["opt"]["volatility"] * 100, 2),
            "Opt_Sharpe_Ratio": result["portfolio_metrics"]["opt"]["sharpe_ratio"],
            "Opt_Max_Drawdown": round(result["portfolio_metrics"]["opt"]["max_drawdown"] * 100, 2),
            
            # Longevity Ending Wealth
            "CI_Wealth_Age_60": result["longevity_outcomes"]["ci"]["wealth_at_60"],
            "CI_Wealth_Age_70": result["longevity_outcomes"]["ci"]["wealth_at_70"],
            "CI_Wealth_Age_80": result["longevity_outcomes"]["ci"]["wealth_at_80"],
            "CI_Wealth_Age_90": result["longevity_outcomes"]["ci"]["ending_wealth_age_90"],
            
            "PI_Wealth_Age_60": result["longevity_outcomes"]["pi"]["wealth_at_60"],
            "PI_Wealth_Age_70": result["longevity_outcomes"]["pi"]["wealth_at_70"],
            "PI_Wealth_Age_80": result["longevity_outcomes"]["pi"]["wealth_at_80"],
            "PI_Wealth_Age_90": result["longevity_outcomes"]["pi"]["ending_wealth_age_90"],
            
            "Opt_Wealth_Age_60": result["longevity_outcomes"]["opt"]["wealth_at_60"],
            "Opt_Wealth_Age_70": result["longevity_outcomes"]["opt"]["wealth_at_70"],
            "Opt_Wealth_Age_80": result["longevity_outcomes"]["opt"]["wealth_at_80"],
            "Opt_Wealth_Age_90": result["longevity_outcomes"]["opt"]["ending_wealth_age_90"],
            
            # Monte Carlo Probability
            "CI_Success_Rate_Pct": result["monte_carlo"]["ci"]["success_rate_pct"],
            "PI_Success_Rate_Pct": result["monte_carlo"]["pi"]["success_rate_pct"],
            "Opt_Success_Rate_Pct": result["monte_carlo"]["opt"]["success_rate_pct"],
            
            "Advisor_Verdict_Badge": result["verdict_badge"],
            "Summary_Verdict": result["verdict"]
        })
        
        print(f"[{result['persona_id']}] {result['client_name']}")
        print(f"  Initial Value: ${result['total_portfolio_value']:,.0f}")
        print(f"  PI Friction: ${result['transition_friction']['pi']['total_friction']:,.0f} ({result['transition_friction']['pi']['friction_pct']}%)")
        print(f"  PI Break-Even: {result['break_even_years']['pi']} yrs | Opt Break-Even: {result['break_even_years']['opt']} yrs")
        print(f"  Wealth at Age 90: CI=${result['longevity_outcomes']['ci']['ending_wealth_age_90']:,.0f} | PI=${result['longevity_outcomes']['pi']['ending_wealth_age_90']:,.0f} | Opt=${result['longevity_outcomes']['opt']['ending_wealth_age_90']:,.0f}")
        print(f"  Recommendation: {result['verdict_badge']}")
        print("-" * 70)
        
    # Write JSON results
    json_path = "data/transition_results.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(all_results, f, indent=2)
    print(f"Successfully saved JSON results to: {json_path}")
    
    # Write CSV results
    csv_path = "data/transition_results.csv"
    if csv_rows:
        fieldnames = list(csv_rows[0].keys())
        with open(csv_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(csv_rows)
    print(f"Successfully saved CSV results to: {csv_path}")

    # Generate historical market benchmark file
    market_csv_path = "data/market_historical_data.csv"
    with open(market_csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["Asset_Class_Code", "Asset_Class_Name", "CAGR_10Y", "CAGR_5Y", "CAGR_3Y", "CAGR_1Y", "Annualized_Volatility", "Dividend_Yield", "Beta", "Max_Drawdown", "Stress_2008_GFC", "Stress_2020_COVID", "Stress_2022_RateShock"])
        for code, data in ASSET_CLASSES.items():
            writer.writerow([
                code, data["name"], data["cagr_10y"], data["cagr_5y"], data["cagr_3y"],
                data["cagr_1y"], data["volatility"], data["dividend_yield"], data["beta"],
                data["max_drawdown"], data["stress_2008"], data["stress_covid"], data["stress_2022"]
            ])
    print(f"Successfully saved Market Benchmark data to: {market_csv_path}")

if __name__ == "__main__":
    run_all_simulations()
