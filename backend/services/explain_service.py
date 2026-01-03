"""
Explainability Service
Uses local LLM (Ollama) for plain-language explanations
AI used ONLY for explanation, never for diagnosis
"""
import logging
import httpx
from typing import Optional

from config import get_settings
from models.report import ExplainRequest, ExplainResponse

logger = logging.getLogger(__name__)
settings = get_settings()


# Static fallback explanations when LLM is unavailable
STATIC_EXPLANATIONS = {
    "hemoglobin": {
        "description": "Hemoglobin is a protein in red blood cells that carries oxygen from the lungs to all parts of the body.",
        "low": "Lower hemoglobin levels may mean less oxygen is being delivered to tissues. This can be influenced by iron intake, hydration, or other factors.",
        "high": "Higher hemoglobin levels mean more oxygen-carrying capacity. This can occur with dehydration or living at high altitudes.",
        "context": "Iron-rich foods include red meat, spinach, and beans. Vitamin C helps iron absorption."
    },
    "total_cholesterol": {
        "description": "Cholesterol is a waxy substance found in blood. It's used to build healthy cells but elevated levels may affect cardiovascular health.",
        "high": "Elevated cholesterol levels are influenced by diet, exercise, and genetics. Regular monitoring is recommended.",
        "low": "Very low cholesterol is uncommon and may have various causes.",
        "context": "Heart-healthy diets emphasize fruits, vegetables, whole grains, and lean proteins."
    },
    "ldl_cholesterol": {
        "description": "LDL cholesterol carries cholesterol to cells. It's often discussed in cardiovascular health contexts.",
        "high": "Elevated LDL levels are a commonly monitored cardiovascular marker.",
        "context": "Lifestyle factors like diet and exercise can influence LDL levels."
    },
    "hdl_cholesterol": {
        "description": "HDL cholesterol helps transport cholesterol away from arteries to the liver.",
        "low": "Lower HDL levels are a marker sometimes discussed in cardiovascular health.",
        "high": "Higher HDL levels are generally considered favorable for cardiovascular health.",
        "context": "Regular physical activity may help maintain HDL levels."
    },
    "vitamin_d": {
        "description": "Vitamin D supports bone health, immune function, and various body processes.",
        "low": "Lower vitamin D levels are common, especially in regions with limited sunlight.",
        "context": "Sources include sunlight exposure, fatty fish, fortified foods, and supplements as recommended by healthcare providers."
    },
    "fasting_glucose": {
        "description": "Fasting glucose measures blood sugar levels after not eating for at least 8 hours.",
        "high": "Elevated fasting glucose is a marker monitored in metabolic health assessments.",
        "context": "Blood sugar is influenced by diet, physical activity, and overall metabolic health."
    },
    "hba1c": {
        "description": "HbA1c reflects average blood sugar levels over the past 2-3 months.",
        "high": "Elevated HbA1c indicates higher average blood sugar over time.",
        "context": "This marker provides a longer-term view compared to single glucose measurements."
    },
    "default": {
        "description": "This parameter is measured to assess specific aspects of health.",
        "context": "Healthcare providers use reference ranges to evaluate whether values fall within typical limits. Individual factors may affect interpretation."
    }
}


async def get_llm_explanation(request: ExplainRequest) -> Optional[str]:
    """
    Get explanation from LLM (OpenRouter or Ollama)
    Only sends abstracted data (parameter name, status) - never raw values
    """
    # Try OpenRouter first if configured
    if settings.openrouter_api_key and settings.openrouter_enabled:
        try:
            from services.openrouter_service import get_ai_explanation
            explanation = await get_ai_explanation(
                request.parameter_name,
                request.status
            )
            if explanation:
                return explanation
        except Exception as e:
            logger.warning(f"OpenRouter explanation failed: {e}")
    
    # Fall back to Ollama if enabled
    if not settings.ollama_enabled:
        return None
    
    # Construct safe prompt - no diagnosis, no treatment advice
    prompt = f"""You are a health education assistant. Provide a brief, plain-language explanation about the medical parameter "{request.parameter_name}".

Current status: {request.status}
Trend: {request.trend or "not specified"}

Important rules:
1. Do NOT provide any diagnosis
2. Do NOT give treatment or medication advice
3. Only provide educational, factual information
4. Use simple, non-medical language
5. Keep the response under 100 words
6. Add a gentle reminder to consult healthcare professionals

Explain what this parameter generally indicates and what the current status might mean in everyday terms."""

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{settings.ollama_base_url}/api/generate",
                json={
                    "model": settings.ollama_model,
                    "prompt": prompt,
                    "stream": False
                }
            )
            
            if response.status_code == 200:
                result = response.json()
                return result.get("response", "")
            
    except Exception as e:
        logger.warning(f"Ollama request failed: {e}")
    
    return None


def get_static_explanation(parameter_name: str, status: str) -> dict:
    """
    Get static fallback explanation for a parameter
    """
    # Normalize parameter name
    normalized = parameter_name.lower().replace(" ", "_")
    
    # Get explanation or default
    exp_data = STATIC_EXPLANATIONS.get(normalized, STATIC_EXPLANATIONS["default"])
    
    description = exp_data.get("description", STATIC_EXPLANATIONS["default"]["description"])
    context = exp_data.get("context", STATIC_EXPLANATIONS["default"]["context"])
    
    # Get status-specific explanation
    status_exp = exp_data.get(status.lower(), "")
    
    return {
        "description": description,
        "status_explanation": status_exp,
        "context": context
    }


async def generate_explanation(request: ExplainRequest) -> ExplainResponse:
    """
    Generate explanation for a parameter
    Tries LLM first, falls back to static explanations
    """
    # Try LLM if enabled
    llm_response = await get_llm_explanation(request)
    
    if llm_response:
        return ExplainResponse(
            parameter_name=request.parameter_name,
            explanation=llm_response,
            educational_context="Generated with AI assistance for educational purposes.",
            disclaimer="This information is for educational purposes only. It is not a diagnosis or medical advice. Please consult healthcare professionals for personalized guidance."
        )
    
    # Fallback to static
    static = get_static_explanation(request.parameter_name, request.status)
    
    explanation = static["description"]
    if static["status_explanation"]:
        explanation += f" {static['status_explanation']}"
    
    return ExplainResponse(
        parameter_name=request.parameter_name,
        explanation=explanation,
        educational_context=static["context"],
        disclaimer="This information is for educational purposes only. It is not a diagnosis or medical advice. Please consult healthcare professionals for personalized guidance."
    )


def get_category_explanation(category: str) -> str:
    """Get explanation for a parameter category"""
    category_explanations = {
        "Blood Count": "Blood count tests measure different components of blood including red cells, white cells, and platelets. These help assess overall health and detect various conditions.",
        "Lipid Profile": "Lipid tests measure fats in the blood, including cholesterol and triglycerides. These are commonly used to assess cardiovascular health factors.",
        "Metabolic": "Metabolic tests evaluate how the body processes nutrients and energy, including blood sugar levels and organ function.",
        "Liver Function": "Liver function tests measure enzymes and proteins to assess liver health and function.",
        "Thyroid": "Thyroid tests measure hormones that regulate metabolism, energy, and many body functions.",
        "Vitamins": "Vitamin tests measure nutrient levels that are essential for various body functions and overall health.",
        "Electrolytes": "Electrolyte tests measure minerals in the blood that help regulate nerve and muscle function, hydration, and pH balance."
    }
    
    return category_explanations.get(category, "These tests measure specific health markers to provide insights into body function.")
