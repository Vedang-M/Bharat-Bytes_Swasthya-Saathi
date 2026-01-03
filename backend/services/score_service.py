"""
Health Clarity Score Engine
Computes weighted health clarity score from 0-100
"""
import logging
from typing import Optional

from models.parameter import Parameter, ParameterStatus
from models.report import HealthClarityScore, SeverityLevel
from services.analysis_service import (
    analyze_all_parameters,
    determine_severity_level,
    get_severity_color
)

logger = logging.getLogger(__name__)


def calculate_health_clarity_score(parameters: list[Parameter]) -> HealthClarityScore:
    """
    Calculate the Health Clarity Score (0-100)
    
    Algorithm:
    - Start with base score of 100
    - Subtract weighted penalties for abnormal parameters
    - Apply category-based weighting
    - Ensure score stays in 0-100 range
    """
    if not parameters:
        return HealthClarityScore(
            score=100,
            severity_level=SeverityLevel.LOW,
            severity_color="#2E7D5B",
            parameters_in_range=0,
            parameters_needing_attention=0,
            total_parameters=0
        )
    
    # Analyze all parameters
    analysis_results = analyze_all_parameters(parameters)
    
    # Count normal vs abnormal
    normal_count = sum(
        1 for r in analysis_results 
        if r.parameter.status == ParameterStatus.NORMAL
    )
    abnormal_count = len(analysis_results) - normal_count
    
    # Calculate base score from ratio of normal parameters
    base_ratio = normal_count / len(parameters)
    base_score = base_ratio * 100
    
    # Calculate penalty from severity weights
    total_penalty = 0
    max_possible_penalty = 50  # Maximum penalty points
    
    for result in analysis_results:
        if result.parameter.status != ParameterStatus.NORMAL:
            # Weight penalty by severity
            penalty = result.severity_weight * 5
            
            # Extra penalty for critical values
            if result.is_critical:
                penalty *= 1.5
            
            total_penalty += penalty
    
    # Cap penalty
    total_penalty = min(total_penalty, max_possible_penalty)
    
    # Calculate final score
    final_score = max(0, min(100, base_score - total_penalty))
    
    # Round to integer
    score = round(final_score)
    
    # Determine severity
    severity = determine_severity_level(analysis_results)
    severity_color = get_severity_color(severity)
    
    return HealthClarityScore(
        score=score,
        severity_level=severity,
        severity_color=severity_color,
        parameters_in_range=normal_count,
        parameters_needing_attention=abnormal_count,
        total_parameters=len(parameters)
    )


def calculate_score_trend(
    current_score: int,
    previous_score: Optional[int]
) -> str:
    """
    Determine score trend direction
    """
    if previous_score is None:
        return "stable"
    
    diff = current_score - previous_score
    
    if diff > 3:
        return "improving"
    elif diff < -3:
        return "declining"
    else:
        return "stable"


def get_score_interpretation(score: int) -> str:
    """
    Get plain-language interpretation of the score
    """
    if score >= 85:
        return "Most of your test values are within typical reference ranges."
    elif score >= 70:
        return "The majority of your test values are within reference ranges, with some requiring attention."
    elif score >= 50:
        return "Several test values are outside typical reference ranges. Consider consulting a healthcare provider."
    else:
        return "Multiple test values require attention. Please consult with a healthcare professional."


def generate_score_summary(health_score: HealthClarityScore) -> dict:
    """
    Generate a summary object for the health clarity score
    """
    return {
        "score": health_score.score,
        "severity_level": health_score.severity_level.value,
        "severity_color": health_score.severity_color,
        "parameters_in_range": health_score.parameters_in_range,
        "parameters_needing_attention": health_score.parameters_needing_attention,
        "total_parameters": health_score.total_parameters,
        "interpretation": get_score_interpretation(health_score.score)
    }
