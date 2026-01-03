"""
OpenRouter AI Service
Uses OpenRouter API for AI-powered content extraction and explanations
PURE SYNCHRONOUS VERSION - No async issues
"""
import logging
import base64
import json
from typing import Optional
import requests  # Using requests instead of httpx for simplicity

from config import get_settings

logger = logging.getLogger(__name__)


def encode_image_to_base64(image_bytes: bytes) -> str:
    """Encode image bytes to base64 string"""
    return base64.b64encode(image_bytes).decode("utf-8")


def extract_medical_data_with_ai_sync(
    image_base64: str,
    file_type: str = "image/jpeg"
) -> Optional[dict]:
    """
    SYNCHRONOUS version - Use OpenRouter AI to extract medical data from report image
    Returns structured medical parameter data
    """
    # Get fresh settings (bypass cache)
    from pydantic_settings import BaseSettings
    import os
    
    # Use standard settings mechanism which correctly loads .env
    settings = get_settings()
    
    api_key = settings.openrouter_api_key
    model = settings.openrouter_model
    enabled = settings.openrouter_enabled
    base_url = settings.openrouter_base_url
    
    if not api_key or not enabled:
        logger.info(f"OpenRouter not configured (key: {bool(api_key)}, enabled: {enabled})")
        return None
    
    logger.info(f"=== OPENROUTER API CALL ===")
    logger.info(f"Model: {model}")
    logger.info(f"API Key: {api_key[:20]}...")
    
    prompt = """Analyze this medical test report image and extract all test parameters.

For each parameter, provide:
- name: The parameter name (e.g., "Hemoglobin", "Total Cholesterol")
- value: The numeric value
- unit: The measurement unit
- reference_range: The reference/normal range shown

Return the data as a JSON object with this structure:
{
  "parameters": [
    {
      "name": "Parameter Name",
      "value": "12.5",
      "unit": "g/dL",
      "reference_range": "13.0 - 17.0"
    }
  ],
  "report_date": "extracted date if visible",
  "lab_name": "lab name if visible"
}

Only extract parameters that are clearly visible. Be precise with values and units.
If you cannot extract data reliably, return {"parameters": [], "error": "Could not extract data"}"""

    url = f"{base_url}/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://swasthya-saathi.app",
        "X-Title": "Swasthya Saathi Medical Report Analyzer"
    }
    payload = {
        "model": model,
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": prompt
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:{file_type};base64,{image_base64}"
                        }
                    }
                ]
            }
        ],
        "max_tokens": 2000,
        "temperature": 0.1
    }

    try:
        logger.info(f"Sending request to: {url}")
        response = requests.post(url, headers=headers, json=payload, timeout=60)
        
        logger.info(f"Response status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            content = result.get("choices", [{}])[0].get("message", {}).get("content", "")
            logger.info(f"AI response content length: {len(content)}")
            
            # Parse JSON from response
            try:
                # Extract JSON from response (may be wrapped in markdown)
                if "```json" in content:
                    json_str = content.split("```json")[1].split("```")[0]
                elif "```" in content:
                    json_str = content.split("```")[1].split("```")[0]
                else:
                    json_str = content
                
                parsed = json.loads(json_str.strip())
                logger.info(f"Successfully parsed {len(parsed.get('parameters', []))} parameters from AI")
                return parsed
            except json.JSONDecodeError as e:
                logger.warning(f"Could not parse AI response as JSON: {e}")
                logger.warning(f"Raw content: {content[:500]}")
                return None
        else:
            logger.error(f"OpenRouter API error: {response.status_code} - {response.text[:300]}")
            return None
            
    except Exception as e:
        logger.error(f"OpenRouter request failed: {e}")
        import traceback
        logger.error(traceback.format_exc())
        return None


def get_ai_explanation_sync(
    parameter_name: str,
    status: str
) -> Optional[str]:
    """
    SYNCHRONOUS version - Get AI-powered plain-language explanation for a parameter
    """
    import os
    
    settings = get_settings()
    
    api_key = settings.openrouter_api_key
    model = settings.openrouter_model
    enabled = settings.openrouter_enabled
    base_url = settings.openrouter_base_url
    
    if not api_key or not enabled:
        return None
    
    prompt = f"""Provide a brief, plain-language explanation about the medical parameter "{parameter_name}".

Current status: {status}

Rules:
1. Use simple language anyone can understand
2. Do NOT provide medical diagnosis
3. Do NOT give treatment advice
4. Keep the explanation under 80 words
5. Mention common factors that can influence this parameter
6. End with: "Consult a healthcare provider for personalized guidance."

Provide ONLY the explanation, no formatting or labels."""

    url = f"{base_url}/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://swasthya-saathi.app",
        "X-Title": "Swasthya Saathi"
    }
    payload = {
        "model": model,
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 200,
        "temperature": 0.3
    }

    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            return result.get("choices", [{}])[0].get("message", {}).get("content", "")
        
    except Exception as e:
        logger.error(f"OpenRouter explanation failed: {e}")
    
    return None


# Async wrappers for compatibility (but they just call sync versions)
async def extract_medical_data_with_ai(
    image_base64: str,
    file_type: str = "image/jpeg"
) -> Optional[dict]:
    """Async wrapper that calls sync function"""
    return extract_medical_data_with_ai_sync(image_base64, file_type)


async def get_ai_explanation(
    parameter_name: str,
    status: str
) -> Optional[str]:
    """Async wrapper that calls sync function"""
    return get_ai_explanation_sync(parameter_name, status)
