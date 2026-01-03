"""
Deterministic Analysis Engine
Compares parameters against reference ranges and classifies health status
"""
import logging
from typing import Optional

from models.parameter import Parameter, ParameterStatus, ParameterTrend
from models.report import SeverityLevel
from utils.reference_ranges import get_reference_range, get_severity_weight

logger = logging.getLogger(__name__)


class AnalysisResult:
    """Result of parameter analysis"""
    def __init__(
        self,
        parameter: Parameter,
        deviation: float,
        severity_weight: float,
        is_critical: bool = False
    ):
        self.parameter = parameter
        self.deviation = deviation
        self.severity_weight = severity_weight
        self.is_critical = is_critical


def analyze_parameter(parameter: Parameter) -> AnalysisResult:
    """
    Analyze a single parameter against reference ranges
    Returns analysis result with deviation and severity
    """
    try:
        value = float(parameter.value)
    except ValueError:
        return AnalysisResult(
            parameter=parameter,
            deviation=0.0,
            severity_weight=0.0
        )
    
    # Get reference data
    ref_data = get_reference_range(parameter.name)
    
    if ref_data:
        ref_min = ref_data["min"]
        ref_max = ref_data["max"]
        
        # Calculate deviation percentage
        if parameter.status == ParameterStatus.LOW:
            deviation = (ref_min - value) / ref_min if ref_min > 0 else 0
        elif parameter.status == ParameterStatus.HIGH:
            deviation = (value - ref_max) / ref_max if ref_max > 0 else 0
        else:
            deviation = 0.0
        
        # Get severity weight
        severity_weight = get_severity_weight(
            parameter.name,
            parameter.status.value,
            value
        )
        
        # Check if critical (more than 50% deviation)
        is_critical = abs(deviation) > 0.5
        
    else:
        deviation = 0.0
        severity_weight = 1.0 if parameter.status != ParameterStatus.NORMAL else 0.0
        is_critical = False
    
    return AnalysisResult(
        parameter=parameter,
        deviation=deviation,
        severity_weight=severity_weight,
        is_critical=is_critical
    )


def analyze_all_parameters(parameters: list[Parameter]) -> list[AnalysisResult]:
    """Analyze all parameters and return results"""
    return [analyze_parameter(p) for p in parameters]


def determine_severity_level(analysis_results: list[AnalysisResult]) -> SeverityLevel:
    """
    Determine overall severity level based on analysis results
    """
    if not analysis_results:
        return SeverityLevel.LOW
    
    # Count critical and abnormal parameters
    critical_count = sum(1 for r in analysis_results if r.is_critical)
    abnormal_count = sum(
        1 for r in analysis_results 
        if r.parameter.status != ParameterStatus.NORMAL
    )
    
    # Calculate total severity
    total_severity = sum(r.severity_weight for r in analysis_results)
    avg_severity = total_severity / len(analysis_results)
    
    # Determine level
    if critical_count > 0 or avg_severity > 2.0:
        return SeverityLevel.HIGH
    elif abnormal_count >= 2 or avg_severity > 1.0:
        return SeverityLevel.MODERATE
    else:
        return SeverityLevel.LOW


def get_severity_color(severity: SeverityLevel) -> str:
    """Get color code for severity level"""
    colors = {
        SeverityLevel.LOW: "#2E7D5B",      # Green
        SeverityLevel.MODERATE: "#C89B3C",  # Amber
        SeverityLevel.HIGH: "#D64545"       # Red
    }
    return colors.get(severity, "#5E6C7A")


def calculate_parameter_trend(
    current_value: float,
    previous_value: Optional[float]
) -> ParameterTrend:
    """
    Calculate trend direction between two values
    """
    if previous_value is None:
        return ParameterTrend.STABLE
    
    # Calculate percentage change
    if previous_value == 0:
        return ParameterTrend.STABLE
    
    change_pct = (current_value - previous_value) / abs(previous_value)
    
    # Threshold for significant change: 5%
    if change_pct > 0.05:
        return ParameterTrend.UP
    elif change_pct < -0.05:
        return ParameterTrend.DOWN
    else:
        return ParameterTrend.STABLE


def enrich_parameters_with_trends(
    current_params: list[Parameter],
    previous_params: Optional[list[Parameter]]
) -> list[Parameter]:
    """
    Add trend information to current parameters based on previous values
    """
    if not previous_params:
        return current_params
    
    # Create lookup for previous values
    prev_lookup = {p.name: float(p.value) for p in previous_params}
    
    enriched = []
    for param in current_params:
        try:
            current_val = float(param.value)
            prev_val = prev_lookup.get(param.name)
            trend = calculate_parameter_trend(current_val, prev_val)
            
            # Create new parameter with trend
            enriched.append(Parameter(
                name=param.name,
                value=param.value,
                unit=param.unit,
                referenceRange=param.reference_range,
                status=param.status,
                category=param.category,
                trend=trend,
                explanation=param.explanation
            ))
        except (ValueError, KeyError):
            enriched.append(param)
    
    return enriched


def get_abnormal_parameters(parameters: list[Parameter]) -> list[Parameter]:
    """Filter to only abnormal parameters"""
    return [p for p in parameters if p.status != ParameterStatus.NORMAL]


def get_normal_parameters(parameters: list[Parameter]) -> list[Parameter]:
    """Filter to only normal parameters"""
    return [p for p in parameters if p.status == ParameterStatus.NORMAL]


def group_parameters_by_category(parameters: list[Parameter]) -> dict[str, list[Parameter]]:
    """Group parameters by their category"""
    grouped = {}
    for param in parameters:
        category = param.category or "Other"
        if category not in grouped:
            grouped[category] = []
        grouped[category].append(param)
    return grouped
