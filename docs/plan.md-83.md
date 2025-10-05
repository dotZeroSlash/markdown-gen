---
title: plan
description: Document from d:\Documents\python-projects\perplexity-hook\plan.md
date: 2025-10-05
---

# Comprehensive Plan for Headless Perplexity.ai Automation in Python

## Overview
Create a Python script using a headless browser to automate interactions with https://www.perplexity.ai/, including authentication via cookies/credentials, changing model options (e.g., GPT-4, Claude), sources (e.g., web, academic, news), and performing searches, research, or lab usage. This will involve web scraping automation, handling dynamic content, and ensuring session persistence.

## Prerequisites
- Python 3.8+
- Chrome browser installed (for Selenium) or use Playwright for cross-browser support
- Account on Perplexity.ai (if required for advanced features)
- Basic understanding of HTML/CSS selectors for element interaction

## Step 1: Choose and Install Libraries
- **Selenium (recommended for simplicity)**: `pip install selenium webdriver-manager`
  - webdriver-manager for automatic ChromeDriver handling
- **Alternative: Playwright**: `pip install playwright; playwright install chromium`
  - More modern, better async support, but steeper learning curve
- Additional: `pip install requests` (for potential API checks), `pickle` (built-in for cookie serialization)

## Step 2: Set Up Headless Browser Configuration
- Initialize WebDriver with headless options:
  - Disable images/GPU for speed: `--headless --disable-gpu --no-sandbox --disable-dev-shm-usage`
  - Set window size: `--window-size=1920,1080`
  - User-agent to mimic real browser
  - For Playwright: Use `headless=True` in launch options
- Handle cookies: Create a persistent profile directory or load/save cookies manually

## Step 3: Authentication and Session Management
- **Cookie-based Login**:
  - Manually log in via browser, export cookies (using browser dev tools or extensions like "EditThisCookie")
  - Save cookies to file using pickle: `pickle.dump(cookies, open('cookies.pkl', 'wb'))`
  - Load in script: `driver.get('https://www.perplexity.ai/'); for cookie in pickle.load(open('cookies.pkl', 'rb')): driver.add_cookie(cookie)`
- **Credential-based Login** (if no cookies):
  - Navigate to login page, locate email/password fields by ID/class (e.g., via inspect element)
  - Use `send_keys()` to input credentials, click login button
  - Wait for redirect to main page; save cookies post-login
- Handle 2FA or CAPTCHA: May require manual intervention or services like 2Captcha (ethical considerations apply)
- Session persistence: Re-use cookies across runs to avoid re-login

## Step 4: Navigate to Perplexity.ai and Handle Initial Load
- `driver.get('https://www.perplexity.ai/')`
- Wait for page load: Use `WebDriverWait` with expected conditions (e.g., presence of search bar)
- Check for login prompts: If redirected to login, trigger auth flow
- Handle popups/modals: Dismiss any welcome screens or cookie consent banners

## Step 5: Change Model Options
- Inspect site for model selector (likely a dropdown or radio buttons)
- Possible selectors: CSS like `.model-selector select` or XPath `//select[@id='model-select']`
- Options: 'GPT-4', 'Claude-3', 'Sonnet', etc.
- Code: `select = Select(driver.find_element(By.ID, 'model-select')); select.select_by_visible_text('GPT-4')`
- Wait for UI update after change

## Step 6: Change Sources
- Locate source toggles (checkboxes or multi-select)
- Examples: Web, Academic, News, Reddit, etc.
- Selectors: e.g., `input[type='checkbox'][value='academic']`
- Code: `driver.find_element(By.CSS_SELECTOR, "input[value='academic']").click()`
- Handle dynamic loading: Wait for source filters to apply

## Step 7: Perform Actions (Search, Research, Lab)
- **Search**: Locate input field (e.g., `#search-input`), send query, click submit button
- **Research**: Similar to search, but select "Research" mode if available
- **Lab Usage**: If labs are a feature, navigate to lab section, select lab type, input parameters
- Wait for results: Use `WebDriverWait` for result container (e.g., `.results` or `#answer-section`)
- Handle pagination or "load more" buttons for full results

## Step 8: Extract and Process Results
- Scrape text: `results = driver.find_element(By.CLASS_NAME, 'answer').text`
- Screenshots: `driver.save_screenshot('result.png')` for visual capture
- Structured data: Parse HTML for citations, sources, or metadata
- Export: Save to JSON/CSV or database

## Step 9: Error Handling and Robustness
- Timeouts: Set implicit/explicit waits (e.g., 10-30 seconds)
- Exceptions: Catch `NoSuchElementException`, `TimeoutException`; retry or log
- Rate limiting: Add delays between actions (`time.sleep(2)`)
- Anti-detection: Rotate user-agents, avoid rapid requests
- Logging: Use `logging` module for debug info

## Step 10: Security and Ethical Considerations
- Respect terms of service; avoid excessive scraping
- Do not share credentials or cookies
- Handle sensitive data securely (no hardcoding)
- Monitor for site changes: Selectors may break; update script accordingly

## Step 11: Testing and Deployment
- Test in non-headless mode first for debugging
- Unit tests: Mock browser interactions with unittest
- Run script: `python perplexity_automation.py`
- Schedule with cron or integrate into larger app

## Potential Challenges
- Site updates: Perplexity may change UI; monitor and update selectors
- CAPTCHAs: May block automation; consider alternatives like API if available (check for unofficial APIs)
- Performance: Headless browsers are resource-intensive; optimize with minimal waits
- Alternatives: If web scraping fails, explore Perplexity's API (if exists) via requests library

This plan provides a complete framework; implement incrementally, testing each step. If Perplexity has an API, prioritize that over scraping for reliability.