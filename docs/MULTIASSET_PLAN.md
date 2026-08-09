# Multi-asset trend — pre-registration (committed BEFORE any run)

## Universe (fixed, 18 instruments, OANDA M1 archive 2006-2020)
Equities: SPX500_USD NAS100_USD JP225_USD UK100_GBP FR40_EUR AU200_AUD
Bonds: USB10Y_USD USB02Y_USD DE10YB_EUR UK10YB_GBP
Commodities: XAU_USD WTICO_USD NATGAS_USD WHEAT_USD
FX: EUR_USD GBP_USD AUD_USD USD_CAD

## Configurations (exactly two; no others will ever be run)
Donchian(100,50) primary; Donchian(55,20) secondary. Daily bars (NY 17:00
close), close-confirmed entries, trail-only exits, no partials, 1% risk.

## Costs (retail CFD, conservative)
Per-instrument spread table in scripts/run_multiasset.py; slippage = one
spread on every market fill; commission $3.5/side where applicable;
FINANCING: 3%/yr of price per day held (1% bonds, 0.4 pips/day FX) — the
honest tax CFD trend-followers pay that futures traders don't.

## Splits — each later stage runs ONCE, only if the prior stage passes
IS 2006-2016 | VAL 2017-2018 | VERDICT 2019-2020
Final stage regardless: demo on MT5 broker data 2021+ before any funding.

## Pass rules (registered now)
IS: exp>0, PF>=1.3, >=150 trades, every rolling 3-year window >=0, maxDD<=15%
VAL: exp>0 and PF>=1.15 (two-year sample)
VERDICT: net positive, PF>=1.3, maxDD<=12%
Any failure at any stage closes the project's search permanently — no
third family, no rule amendments, no re-rolls.
