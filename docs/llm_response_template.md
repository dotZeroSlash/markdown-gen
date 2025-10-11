---
title: LLM Response Record
description: LLM response record with query, response, and model information
date: {{DATE}}
---

# LLM Response Record

**Generated on:** {{GENERATED_DATE}}  
**ID:** {{RECORD_ID}}  
**Created at:** {{CREATED_AT}}

---

## 🤖 Query

{{QUERY}}

---

## 💬 Response

{{RESPONSE}}

---

## 🔧 Model Information

**Provider:** {{PROVIDER}}  
**Model:** {{MODEL}}

---

## 📄 Raw Data

### Response JSON
```json
{{RESPONSE_JSON}}
```

---

## Template Usage Instructions

To use this template, replace the placeholders with your actual data:

### Placeholders to Replace:

- **`{{DATE}}`** → Date in YYYY-MM-DD format (e.g., `2025-10-11`)
- **`{{GENERATED_DATE}}`** → Human-readable generation timestamp (e.g., `2025-10-11 12:19:56`)
- **`{{RECORD_ID}}`** → The record ID (e.g., `68dd1f52292b8087b556615a`)
- **`{{CREATED_AT}}`** → ISO timestamp (e.g., `2025-10-01T12:32:18.118141300Z`)
- **`{{QUERY}}`** → The query or prompt sent to the LLM
- **`{{RESPONSE}}`** → The LLM's response text
- **`{{PROVIDER}}`** → The LLM provider (e.g., `Perplexity`, `OpenAI`)
- **`{{MODEL}}`** → The specific model used (e.g., `sonar`, `gpt-4`)
- **`{{RESPONSE_JSON}}`** → The raw JSON response from the API (formatted properly)

## Python Helper Function

If you want to automate this process, here's a Python function you can add to your `script.py`:

```python
import json
from datetime import datetime

def format_llm_response_record(record_data):
    """
    Format LLM response record into styled markdown
    
    Args:
        record_data (dict): Dictionary containing:
            - id: Record ID
            - created_at: ISO timestamp
            - query: The query/prompt
            - response: The LLM response text
            - provider: LLM provider name
            - model: Model name
            - response_json: Raw JSON response (optional)
            - generated_date: Human readable date (optional)
    """
    
    # Format date
    created_dt = datetime.fromisoformat(record_data['created_at'].replace('Z', '+00:00'))
    date_str = created_dt.strftime('%Y-%m-%d')
    generated_str = record_data.get('generated_date', created_dt.strftime('%Y-%m-%d %H:%M:%S'))
    
    # Handle response_json
    response_json = record_data.get('response_json', {})
    if isinstance(response_json, str):
        response_json = json.loads(response_json)
    
    # Build template
    template = f"""---
title: LLM Response Record
description: LLM response record with query, response, and model information
date: {date_str}
---

# LLM Response Record

**Generated on:** {generated_str}  
**ID:** {record_data['id']}  
**Created at:** {record_data['created_at']}

---

## 🤖 Query

{record_data['query']}

---

## 💬 Response

{record_data['response']}

---

## 🔧 Model Information

**Provider:** {record_data['provider']}  
**Model:** {record_data['model']}

---

## 📄 Raw Data

### Response JSON
```json
{json.dumps(response_json, indent=2)}
```"""
    
    return template
```

This template and helper function will ensure consistent formatting for all your LLM response records, making them much more readable and professional-looking. You can easily copy the template and fill in the placeholders manually, or use the Python function to automate the process.