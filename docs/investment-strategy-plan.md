---
title: plan
description: Document from d:\Documents\rust-projects\old\invest\plan.md
date: 2025-10-05
---

# Investment Strategy Plan

## Overview
Create a Rust program to identify solid investments on the NYSE using value investing principles.

## Strategy Details
- **Value Investing**: Screen NYSE stocks for low P/E, P/B ratios, and high dividend yields using financial APIs like Finnhub (free tier: 60 req/min, 1,500/day).
- **Focus**: Blue-chip companies with strong fundamentals and long-term growth potential.
- **Risk Mitigation**: Implement dollar-cost averaging.

## Implementation Steps
1. Set up Rust project with dependencies for API calls (e.g., reqwest) and data parsing (e.g., serde).
2. Research Finnhub API endpoints for stock fundamentals (P/E, P/B, dividend yield).
3. Update Cargo.toml if additional dependencies needed for Finnhub.
4. Modify main.rs to use Finnhub API instead of Alpha Vantage, update URL and response parsing.
5. Test the updated program with Finnhub API key.
6. Calculate key metrics (P/E, P/B, dividend yield).
7. Filter stocks based on thresholds for undervaluation.
8. Output a list of recommended investments.
