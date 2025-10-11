---
title: Finance Data Record
description: Financial data record with stock quotes and analysis
date: {{DATE}}
---

# Finance Data Record

**Generated on:** {{GENERATED_DATE}}  
**ID:** {{RECORD_ID}}  
**Created at:** {{CREATED_AT}}

---

## 📊 Analyst Recommendation

**Recommended Symbols:** {{SYMBOLS_LIST}}

### Analysis Summary
{{ANALYSIS_SUMMARY}}

---

## 📈 Current Stock Quotes

| Symbol | Current Price | Change | % Change | Day High | Day Low | Open | Previous Close |
|--------|---------------|--------|----------|----------|---------|------|----------------|
{{STOCK_QUOTES_TABLE_ROWS}}

---

## 🔧 Raw Data

### Recommendation JSON
```json
{{RECOMMENDATION_JSON}}
```

### Quotes JSON
```json
{{QUOTES_JSON}}
```
- **`{{RECOMMENDATION_JSON}}`** → The raw JSON object (formatted properly)
- **`{{QUOTES_JSON}}`** → The raw JSON array (formatted properly)



## Template Usage Instructions

To use this template, replace the placeholders with your actual data:

### Placeholders to Replace:

- **`{{DATE}}`** → Date in YYYY-MM-DD format (e.g., `2025-10-11`)
- **`{{GENERATED_DATE}}`** → Human-readable generation timestamp (e.g., `2025-10-11 12:19:56`)
- **`{{RECORD_ID}}`** → The record ID (e.g., `68e98dd5200413ad9c0dd1cb`)
- **`{{CREATED_AT}}`** → ISO timestamp (e.g., `2025-10-10T22:51:01.281941Z`)
- **`{{SYMBOLS_LIST}}`** → Comma-separated list of symbols (e.g., `MSFT, URBN, AMZN, GOOGL`)
- **`{{ANALYSIS_SUMMARY}}`** → Clean, readable analysis text (remove any `<think>` tags and internal reasoning)
- **`{{STOCK_QUOTES_TABLE_ROWS}}`** → Table rows in format like:
  

## Python Helper Function

If you want to automate this process, here's a Python function you can add to your `script.py`:

```python
import json
from datetime import datetime

def format_finance_record(record_data):
    """
    Format finance data record into styled markdown
    
    Args:
        record_data (dict): Dictionary containing:
            - id: Record ID
            - created_at: ISO timestamp
            - recommendation: JSON string or dict
            - quotes: JSON string or list
            - generated_date: Human readable date (optional)
    """
    
    # Parse data
    rec = json.loads(record_data['recommendation']) if isinstance(record_data['recommendation'], str) else record_data['recommendation']
    quotes = json.loads(record_data['quotes']) if isinstance(record_data['quotes'], str) else record_data['quotes']
    
    # Format date
    created_dt = datetime.fromisoformat(record_data['created_at'].replace('Z', '+00:00'))
    date_str = created_dt.strftime('%Y-%m-%d')
    generated_str = record_data.get('generated_date', created_dt.strftime('%Y-%m-%d %H:%M:%S'))
    
    # Build symbols list
    symbols_list = ", ".join(rec['symbols'])
    
    # Build stock quotes table
    table_rows = []
    for quote in quotes:
        change_prefix = "+" if quote['change'] >= 0 else ""
        percent_prefix = "+" if quote['percent_change'] >= 0 else ""
        
        row = f"| {quote['symbol']}   | ${quote['current_price']:.2f}      | {change_prefix}${quote['change']:.2f} | {percent_prefix}{quote['percent_change']:.2f}%  | ${quote['high']:.2f} | ${quote['low']:.2f} | ${quote['open']:.2f} | ${quote['previous_close']:.2f} |"
        table_rows.append(row)
    
    table_content = "\n".join(table_rows)
    
    # Clean analysis text (remove <think> tags if present)
    analysis = rec['analysis']
    if '<think>' in analysis:
        # Extract only the final output part
        parts = analysis.split('<think>')[-1].split('output:')[-1].strip()
        analysis = parts
    
    # Build template
    template = f"""---
title: Finance Data Record
description: Financial data record with stock quotes and analysis
date: {date_str}
---

# Finance Data Record

**Generated on:** {generated_str}  
**ID:** {record_data['id']}  
**Created at:** {record_data['created_at']}

---

## 📊 Analyst Recommendation

**Recommended Symbols:** {symbols_list}

### Analysis Summary
{analysis}

---

## 📈 Current Stock Quotes

| Symbol | Current Price | Change | % Change | Day High | Day Low | Open | Previous Close |
|--------|---------------|--------|----------|----------|---------|------|----------------|
{table_rows}

---

## 🔧 Raw Data

### Recommendation JSON
```json
{json.dumps(rec, indent=2)}
```

### Quotes JSON
```json
{json.dumps(quotes, indent=2)}
```"""
    
    return template
```

This template and helper function will ensure consistent formatting for all your finance data records, making them much more readable and professional-looking. You can easily copy the template and fill in the placeholders manually, or use the Python function to automate the process.