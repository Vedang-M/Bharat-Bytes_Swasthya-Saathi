"""
Medical Reference Ranges
Standard laboratory reference ranges for deterministic classification
Source: Common laboratory guidelines (for educational/demo purposes only)
"""

# Reference ranges database
# Format: {parameter_name: {"min": value, "max": value, "unit": string, "category": string}}
REFERENCE_RANGES = {
    # Blood Count
    "hemoglobin": {
        "min": 13.0,
        "max": 17.0,
        "unit": "g/dL",
        "category": "Blood Count",
        "display_name": "Hemoglobin"
    },
    "hematocrit": {
        "min": 38.0,
        "max": 50.0,
        "unit": "%",
        "category": "Blood Count",
        "display_name": "Hematocrit"
    },
    "rbc": {
        "min": 4.5,
        "max": 5.5,
        "unit": "×10⁶/μL",
        "category": "Blood Count",
        "display_name": "Red Blood Cell Count"
    },
    "wbc": {
        "min": 4.0,
        "max": 11.0,
        "unit": "×10³/μL",
        "category": "Blood Count",
        "display_name": "White Blood Cell Count"
    },
    "platelets": {
        "min": 150.0,
        "max": 400.0,
        "unit": "×10³/μL",
        "category": "Blood Count",
        "display_name": "Platelet Count"
    },
    "mcv": {
        "min": 80.0,
        "max": 100.0,
        "unit": "fL",
        "category": "Blood Count",
        "display_name": "Mean Corpuscular Volume"
    },
    "mch": {
        "min": 27.0,
        "max": 33.0,
        "unit": "pg",
        "category": "Blood Count",
        "display_name": "Mean Corpuscular Hemoglobin"
    },
    "mchc": {
        "min": 32.0,
        "max": 36.0,
        "unit": "g/dL",
        "category": "Blood Count",
        "display_name": "MCHC"
    },
    
    # Lipid Profile
    "total_cholesterol": {
        "min": 0,
        "max": 200.0,
        "unit": "mg/dL",
        "category": "Lipid Profile",
        "display_name": "Total Cholesterol"
    },
    "hdl_cholesterol": {
        "min": 40.0,
        "max": 999.0,  # Higher is better
        "unit": "mg/dL",
        "category": "Lipid Profile",
        "display_name": "HDL Cholesterol"
    },
    "ldl_cholesterol": {
        "min": 0,
        "max": 100.0,
        "unit": "mg/dL",
        "category": "Lipid Profile",
        "display_name": "LDL Cholesterol"
    },
    "triglycerides": {
        "min": 0,
        "max": 150.0,
        "unit": "mg/dL",
        "category": "Lipid Profile",
        "display_name": "Triglycerides"
    },
    "vldl": {
        "min": 0,
        "max": 30.0,
        "unit": "mg/dL",
        "category": "Lipid Profile",
        "display_name": "VLDL"
    },
    
    # Metabolic Panel
    "fasting_glucose": {
        "min": 70.0,
        "max": 100.0,
        "unit": "mg/dL",
        "category": "Metabolic",
        "display_name": "Fasting Glucose"
    },
    "random_glucose": {
        "min": 70.0,
        "max": 140.0,
        "unit": "mg/dL",
        "category": "Metabolic",
        "display_name": "Random Glucose"
    },
    "hba1c": {
        "min": 0,
        "max": 5.7,
        "unit": "%",
        "category": "Metabolic",
        "display_name": "HbA1c"
    },
    "creatinine": {
        "min": 0.7,
        "max": 1.3,
        "unit": "mg/dL",
        "category": "Metabolic",
        "display_name": "Creatinine"
    },
    "blood_urea_nitrogen": {
        "min": 7.0,
        "max": 20.0,
        "unit": "mg/dL",
        "category": "Metabolic",
        "display_name": "Blood Urea Nitrogen"
    },
    "uric_acid": {
        "min": 3.5,
        "max": 7.2,
        "unit": "mg/dL",
        "category": "Metabolic",
        "display_name": "Uric Acid"
    },
    
    # Liver Function
    "sgpt_alt": {
        "min": 0,
        "max": 40.0,
        "unit": "U/L",
        "category": "Liver Function",
        "display_name": "SGPT (ALT)"
    },
    "sgot_ast": {
        "min": 0,
        "max": 40.0,
        "unit": "U/L",
        "category": "Liver Function",
        "display_name": "SGOT (AST)"
    },
    "alkaline_phosphatase": {
        "min": 44.0,
        "max": 147.0,
        "unit": "U/L",
        "category": "Liver Function",
        "display_name": "Alkaline Phosphatase"
    },
    "total_bilirubin": {
        "min": 0.1,
        "max": 1.2,
        "unit": "mg/dL",
        "category": "Liver Function",
        "display_name": "Total Bilirubin"
    },
    "direct_bilirubin": {
        "min": 0,
        "max": 0.3,
        "unit": "mg/dL",
        "category": "Liver Function",
        "display_name": "Direct Bilirubin"
    },
    "total_protein": {
        "min": 6.0,
        "max": 8.3,
        "unit": "g/dL",
        "category": "Liver Function",
        "display_name": "Total Protein"
    },
    "albumin": {
        "min": 3.5,
        "max": 5.0,
        "unit": "g/dL",
        "category": "Liver Function",
        "display_name": "Albumin"
    },
    
    # Thyroid
    "tsh": {
        "min": 0.4,
        "max": 4.0,
        "unit": "mIU/L",
        "category": "Thyroid",
        "display_name": "TSH"
    },
    "t3": {
        "min": 80.0,
        "max": 200.0,
        "unit": "ng/dL",
        "category": "Thyroid",
        "display_name": "T3"
    },
    "t4": {
        "min": 5.0,
        "max": 12.0,
        "unit": "μg/dL",
        "category": "Thyroid",
        "display_name": "T4"
    },
    "free_t3": {
        "min": 2.3,
        "max": 4.2,
        "unit": "pg/mL",
        "category": "Thyroid",
        "display_name": "Free T3"
    },
    "free_t4": {
        "min": 0.8,
        "max": 1.8,
        "unit": "ng/dL",
        "category": "Thyroid",
        "display_name": "Free T4"
    },
    
    # Vitamins & Minerals
    "vitamin_d": {
        "min": 30.0,
        "max": 100.0,
        "unit": "ng/mL",
        "category": "Vitamins",
        "display_name": "Vitamin D"
    },
    "vitamin_b12": {
        "min": 200.0,
        "max": 900.0,
        "unit": "pg/mL",
        "category": "Vitamins",
        "display_name": "Vitamin B12"
    },
    "folate": {
        "min": 3.0,
        "max": 17.0,
        "unit": "ng/mL",
        "category": "Vitamins",
        "display_name": "Folate"
    },
    "iron": {
        "min": 60.0,
        "max": 170.0,
        "unit": "μg/dL",
        "category": "Vitamins",
        "display_name": "Serum Iron"
    },
    "ferritin": {
        "min": 12.0,
        "max": 300.0,
        "unit": "ng/mL",
        "category": "Vitamins",
        "display_name": "Ferritin"
    },
    "calcium": {
        "min": 8.5,
        "max": 10.5,
        "unit": "mg/dL",
        "category": "Vitamins",
        "display_name": "Calcium"
    },
    
    # Electrolytes
    "sodium": {
        "min": 136.0,
        "max": 145.0,
        "unit": "mEq/L",
        "category": "Electrolytes",
        "display_name": "Sodium"
    },
    "potassium": {
        "min": 3.5,
        "max": 5.0,
        "unit": "mEq/L",
        "category": "Electrolytes",
        "display_name": "Potassium"
    },
    "chloride": {
        "min": 98.0,
        "max": 106.0,
        "unit": "mEq/L",
        "category": "Electrolytes",
        "display_name": "Chloride"
    },
}

# Parameter name aliases for flexible matching
PARAMETER_ALIASES = {
    # Blood Count aliases
    "hb": "hemoglobin",
    "haemoglobin": "hemoglobin",
    "hgb": "hemoglobin",
    "wbc count": "wbc",
    "white blood cells": "wbc",
    "white blood cell count": "wbc",
    "leucocytes": "wbc",
    "leukocytes": "wbc",
    "total wbc": "wbc",
    "rbc count": "rbc",
    "red blood cells": "rbc",
    "red blood cell count": "rbc",
    "erythrocytes": "rbc",
    "total rbc": "rbc",
    "plt": "platelets",
    "platelet count": "platelets",
    "thrombocytes": "platelets",
    "platelet": "platelets",
    "hct": "hematocrit",
    "pcv": "hematocrit",
    "packed cell volume": "hematocrit",
    
    # Lipid aliases
    "cholesterol": "total_cholesterol",
    "chol": "total_cholesterol",
    "tc": "total_cholesterol",
    "hdl": "hdl_cholesterol",
    "hdl-c": "hdl_cholesterol",
    "good cholesterol": "hdl_cholesterol",
    "ldl": "ldl_cholesterol",
    "ldl-c": "ldl_cholesterol",
    "bad cholesterol": "ldl_cholesterol",
    "tg": "triglycerides",
    "trigs": "triglycerides",
    "triglyceride": "triglycerides",
    
    # Glucose aliases
    "glucose fasting": "fasting_glucose",
    "fbs": "fasting_glucose",
    "fasting blood sugar": "fasting_glucose",
    "glucose": "fasting_glucose",
    "blood glucose": "fasting_glucose",
    "rbs": "random_glucose",
    "random blood sugar": "random_glucose",
    "pp glucose": "random_glucose",
    "postprandial glucose": "random_glucose",
    "glycated hemoglobin": "hba1c",
    "a1c": "hba1c",
    "glycosylated hemoglobin": "hba1c",
    
    # Kidney aliases
    "creat": "creatinine",
    "serum creatinine": "creatinine",
    "bun": "blood_urea_nitrogen",
    "urea": "blood_urea_nitrogen",
    "blood urea": "blood_urea_nitrogen",
    "urea nitrogen": "blood_urea_nitrogen",
    
    # Liver aliases
    "alt": "sgpt_alt",
    "sgpt": "sgpt_alt",
    "alanine transaminase": "sgpt_alt",
    "alanine aminotransferase": "sgpt_alt",
    "ast": "sgot_ast",
    "sgot": "sgot_ast",
    "aspartate transaminase": "sgot_ast",
    "aspartate aminotransferase": "sgot_ast",
    "alp": "alkaline_phosphatase",
    "alk phos": "alkaline_phosphatase",
    "bilirubin": "total_bilirubin",
    "t. bilirubin": "total_bilirubin",
    "total bil": "total_bilirubin",
    "d. bilirubin": "direct_bilirubin",
    "conjugated bilirubin": "direct_bilirubin",
    
    # Thyroid aliases
    "thyroid stimulating hormone": "tsh",
    "thyrotropin": "tsh",
    "triiodothyronine": "t3",
    "thyroxine": "t4",
    "ft3": "free_t3",
    "ft4": "free_t4",
    
    # Vitamin aliases
    "vit d": "vitamin_d",
    "25-oh vitamin d": "vitamin_d",
    "25 hydroxy vitamin d": "vitamin_d",
    "vit b12": "vitamin_b12",
    "b12": "vitamin_b12",
    "cobalamin": "vitamin_b12",
    "folic acid": "folate",
    "serum iron": "iron",
    "serum ferritin": "ferritin",
    
    # Electrolyte aliases
    "na": "sodium",
    "na+": "sodium",
    "serum sodium": "sodium",
    "k": "potassium",
    "k+": "potassium",
    "serum potassium": "potassium",
    "cl": "chloride",
    "serum chloride": "chloride",
    "ca": "calcium",
    "serum calcium": "calcium",
    "fe": "iron",
}


def normalize_parameter_name(name: str) -> str:
    """Normalize parameter name to standard key"""
    normalized = name.lower().strip()
    
    # Check direct match first
    if normalized in REFERENCE_RANGES:
        return normalized
    
    # Check aliases
    if normalized in PARAMETER_ALIASES:
        return PARAMETER_ALIASES[normalized]
    
    # Try partial matching
    for alias, standard in PARAMETER_ALIASES.items():
        if alias in normalized or normalized in alias:
            return standard
    
    return normalized


def get_reference_range(parameter_name: str) -> dict | None:
    """Get reference range for a parameter"""
    normalized = normalize_parameter_name(parameter_name)
    return REFERENCE_RANGES.get(normalized)


def classify_value(parameter_name: str, value: float) -> str:
    """
    Classify a parameter value as normal, high, or low
    Returns: 'normal', 'high', 'low', or 'unknown'
    """
    ref_range = get_reference_range(parameter_name)
    
    if not ref_range:
        return "unknown"
    
    if value < ref_range["min"]:
        return "low"
    elif value > ref_range["max"]:
        return "high"
    else:
        return "normal"


def get_severity_weight(parameter_name: str, status: str, value: float = None) -> float:
    """
    Get severity weight for score calculation
    Higher weight = more impact on health clarity score
    """
    ref_range = get_reference_range(parameter_name)
    
    if not ref_range or status == "normal":
        return 0.0
    
    # Base weights by category
    category_weights = {
        "Blood Count": 1.5,
        "Lipid Profile": 1.2,
        "Metabolic": 1.3,
        "Liver Function": 1.4,
        "Thyroid": 1.3,
        "Vitamins": 1.0,
        "Electrolytes": 1.5,
    }
    
    base_weight = category_weights.get(ref_range.get("category", "General"), 1.0)
    
    # Calculate deviation factor if value provided
    if value is not None:
        min_val = ref_range["min"]
        max_val = ref_range["max"]
        range_size = max_val - min_val if max_val > min_val else 1
        
        if status == "low":
            deviation = (min_val - value) / range_size
        else:  # high
            deviation = (value - max_val) / range_size
        
        # Cap deviation factor
        deviation_factor = min(abs(deviation), 2.0) + 1.0
        return base_weight * deviation_factor
    
    return base_weight
