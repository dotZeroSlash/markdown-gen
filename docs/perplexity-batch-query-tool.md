---
title: README
description: Document from d:\Documents\python-projects\perplexity-output\README.md
date: 2025-10-05
---

# Perplexity Batch Query Tool

Automates batch queries to Perplexity.ai using Playwright and Brave browser.

## Features

- Batch process multiple queries from a text file
- Save results to JSONL and MongoDB
- Model selection support
- Incremental output files
- Tab-per-query isolation

## Configuration

Set environment variables to customize behavior:

### Browser Settings
- **`AUTOMATION_PROFILE`**: Name of separate profile for automation (default: `AutomationProfile`)
- `BRAVE_EXE`: Path to Brave executable (default: `C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe`)
- `BRAVE_USER_DATA`: Path to Brave user data directory
- `BRAVE_PROFILE`: Profile directory name to use instead of automation profile (e.g., `Default`)
- `BRAVE_PROFILE_PATH`: Full path to specific profile directory
- `HEADLESS`: Run in headless mode - not recommended (`0` or `1`, default: `0`)

### Query Settings
- `INPUT_FILE`: Input file with queries (default: `queries.txt`)
- `OUTPUT_FILE`: Output JSONL file (default: `results.jsonl`)
- `DELAY_SEC`: Delay between queries in seconds (default: `2.0`)
- `TIMEOUT_MS`: Timeout for page operations in milliseconds (default: `120000`)
- **`MODEL`**: Specify which model to use (e.g., `"GPT-4"`, `"Claude"`, `"Pro"`)

### MongoDB Settings
- `MONGO_URI`: MongoDB connection URI (default: `mongodb://localhost:27017/`)
- `MONGO_DB`: Database name (default: `perplexity_`)
- `MONGO_COLLECTION`: Collection name (default: `queries`)

## Model Selection

You can specify which Perplexity model to use for queries:

```bash
# Windows PowerShell
$env:MODEL="GPT-4"
python run_perplexity_batch.py

# Windows CMD
set MODEL=Claude
python run_perplexity_batch.py
```

Common model names:
- `"GPT-4"` or `"gpt-4"`
- `"Claude"` or `"claude-3.5-sonnet"`
- `"Pro"` or `"sonar-pro"`

The script will attempt to select the specified model in the Perplexity UI. If model selection fails, it will fall back to the default model and continue processing.

## Input File Format

The `queries.txt` file supports two formats:

1. **Simple format** (one query per line):
```
What is the capital of France?
Explain quantum computing
```

2. **CSV format** (id,query):
```
q1,What is the capital of France?
q2,Explain quantum computing
```

## Output

Results are saved to:
1. **JSONL file**: Incremental files like `results_001.jsonl`, `results_002.jsonl`, etc.
2. **MongoDB**: If configured and available

Each result includes:
- `id`: Query identifier
- `timestamp`: ISO timestamp
- `query`: The original query
- `answer`: Perplexity's response
- `url`: URL of the result page
- `model`: The model used (if specified)

## Usage

### Quick Start

```powershell
# Simple - just run it!
.\run.ps1

# Or run directly
python run_perplexity_batch.py
```

**How it works:**
- ✅ Uses a separate profile called `AutomationProfile` (not your Default profile)
- ✅ Your main Brave browser can stay open
- ✅ Browser window opens minimized in the background
- ✅ First run will create the profile and require Perplexity login
- ✅ Subsequent runs reuse the logged-in session

### First-Time Setup

**Option 1: Manual login (Recommended)**
1. Run the script once: `.\run.ps1`
2. Log into Perplexity in the browser window that opens
3. Close the automation browser
4. Future runs will use the saved session

**Option 2: Clone your existing profile**
```powershell
# Close all Brave windows first!
.\clone_profile.ps1
```
This copies your Default profile (with all logins) to AutomationProfile.

### Customization

```powershell
# With custom model
$env:MODEL="Grok 4"
.\run.ps1

# With custom input/output files
$env:INPUT_FILE="my_queries.txt"
$env:OUTPUT_FILE="my_results.jsonl"
.\run.ps1
```

### Alternative: Use Your Main Profile

If you want to use your main profile's cookies/session:

```powershell
$env:BRAVE_PROFILE="Default"
python run_perplexity_batch.py
```

⚠️ **Note:** This requires closing all Brave windows first.

## Requirements

Install dependencies:
```bash
pip install -r requirements.txt
```

## Important Notes

- **Default mode:** Uses separate automation profile - your main browser can stay open!
- **Using your main profile:** Requires closing all Brave windows and disabling "Continue running background apps"
- Ensure you're logged into Perplexity.ai in the profile being used
- Model selection requires appropriate Perplexity subscription for premium models
- First run with automation profile will require logging into Perplexity
