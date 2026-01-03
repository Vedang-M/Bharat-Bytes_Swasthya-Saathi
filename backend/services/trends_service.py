"""
Trend Analysis Service
Computes longitudinal trends across multiple reports
"""
import logging
from datetime import datetime
from typing import Optional

from models.parameter import Parameter, ParameterTrend, TrendDataPoint, ParameterTrendData
from models.report import SeverityLevel

logger = logging.getLogger(__name__)


def calculate_trend_direction(values: list[float]) -> ParameterTrend:
    """
    Determine overall trend direction from a series of values
    Uses simple linear regression slope
    """
    if len(values) < 2:
        return ParameterTrend.STABLE
    
    # Calculate simple trend (compare first half average to second half)
    mid = len(values) // 2
    first_half_avg = sum(values[:mid]) / mid if mid > 0 else values[0]
    second_half_avg = sum(values[mid:]) / (len(values) - mid)
    
    change_pct = (second_half_avg - first_half_avg) / abs(first_half_avg) if first_half_avg != 0 else 0
    
    if change_pct > 0.05:
        return ParameterTrend.UP
    elif change_pct < -0.05:
        return ParameterTrend.DOWN
    else:
        return ParameterTrend.STABLE


def generate_trend_data_for_parameter(
    parameter_name: str,
    reports: list[dict]
) -> Optional[ParameterTrendData]:
    """
    Generate trend data for a specific parameter across multiple reports
    """
    data_points = []
    values = []
    unit = ""
    
    for report in reports:
        params = report.get("parameters", [])
        for param in params:
            if param.get("name") == parameter_name:
                try:
                    value = float(param.get("value", 0))
                    date = report.get("report_date", "")
                    unit = param.get("unit", "")
                    
                    # Get reference range for visualization
                    ref_range = param.get("referenceRange", param.get("reference_range", ""))
                    ref_low, ref_high = parse_reference_for_trend(ref_range)
                    
                    data_points.append(TrendDataPoint(
                        date=date,
                        value=value,
                        refLow=ref_low,
                        refHigh=ref_high
                    ))
                    values.append(value)
                except (ValueError, TypeError):
                    continue
    
    if not data_points:
        return None
    
    # Sort by date
    data_points.sort(key=lambda x: x.date)
    
    # Calculate trend direction
    trend_direction = calculate_trend_direction(values)
    
    return ParameterTrendData(
        parameter_id=parameter_name.lower().replace(" ", "_"),
        parameter_name=parameter_name,
        unit=unit,
        trend_direction=trend_direction,
        data_points=data_points
    )


def parse_reference_for_trend(ref_range: str) -> tuple[float, float]:
    """Parse reference range string for trend visualization"""
    import re
    
    if not ref_range:
        return 0.0, 100.0
    
    # Format: "min - max"
    range_match = re.match(r"([\d\.]+)\s*[-–]\s*([\d\.]+)", ref_range)
    if range_match:
        return float(range_match.group(1)), float(range_match.group(2))
    
    # Format: "< max"
    less_match = re.match(r"<\s*([\d\.]+)", ref_range)
    if less_match:
        return 0.0, float(less_match.group(1))
    
    # Format: "> min"
    greater_match = re.match(r">\s*([\d\.]+)", ref_range)
    if greater_match:
        return float(greater_match.group(1)), 999.0
    
    return 0.0, 100.0


def generate_health_score_trend(reports: list[dict]) -> list[dict]:
    """
    Generate health clarity score trend over time
    """
    trend_data = []
    
    for report in reports:
        date = report.get("report_date", "")
        score = report.get("health_clarity_score", {})
        
        if isinstance(score, dict):
            score_value = score.get("score", 0)
        else:
            score_value = score
        
        trend_data.append({
            "date": date,
            "score": score_value
        })
    
    # Sort by date
    trend_data.sort(key=lambda x: x["date"])
    
    return trend_data


def get_available_parameters_for_trends(reports: list[dict]) -> list[str]:
    """
    Get list of parameter names that appear in multiple reports
    """
    param_counts = {}
    
    for report in reports:
        params = report.get("parameters", [])
        seen_in_report = set()
        for param in params:
            name = param.get("name", "")
            if name and name not in seen_in_report:
                param_counts[name] = param_counts.get(name, 0) + 1
                seen_in_report.add(name)
    
    # Return parameters that appear in at least 2 reports
    return [name for name, count in param_counts.items() if count >= 2]


def generate_demo_trend_data() -> dict:
    """
    Generate demo trend data matching frontend expectations
    """
    return {
        "health_score_trend": [
            {"date": "Jun 2025", "score": 78},
            {"date": "Aug 2025", "score": 75},
            {"date": "Oct 2025", "score": 72},
            {"date": "Dec 2025", "score": 70},
            {"date": "Jan 2026", "score": 68},
        ],
        "parameter_trends": {
            "hemoglobin": ParameterTrendData(
                parameter_id="hemoglobin",
                parameter_name="Hemoglobin",
                unit="g/dL",
                trend_direction=ParameterTrend.DOWN,
                data_points=[
                    TrendDataPoint(date="Jun 2025", value=13.2, refLow=13.0, refHigh=17.0),
                    TrendDataPoint(date="Aug 2025", value=12.8, refLow=13.0, refHigh=17.0),
                    TrendDataPoint(date="Oct 2025", value=12.1, refLow=13.0, refHigh=17.0),
                    TrendDataPoint(date="Dec 2025", value=11.6, refLow=13.0, refHigh=17.0),
                    TrendDataPoint(date="Jan 2026", value=11.2, refLow=13.0, refHigh=17.0),
                ]
            ),
            "cholesterol": ParameterTrendData(
                parameter_id="cholesterol",
                parameter_name="Total Cholesterol",
                unit="mg/dL",
                trend_direction=ParameterTrend.UP,
                data_points=[
                    TrendDataPoint(date="Jun 2025", value=210, refLow=0, refHigh=200),
                    TrendDataPoint(date="Aug 2025", value=218, refLow=0, refHigh=200),
                    TrendDataPoint(date="Oct 2025", value=232, refLow=0, refHigh=200),
                    TrendDataPoint(date="Dec 2025", value=238, refLow=0, refHigh=200),
                    TrendDataPoint(date="Jan 2026", value=245, refLow=0, refHigh=200),
                ]
            ),
            "vitaminD": ParameterTrendData(
                parameter_id="vitaminD",
                parameter_name="Vitamin D",
                unit="ng/mL",
                trend_direction=ParameterTrend.DOWN,
                data_points=[
                    TrendDataPoint(date="Jun 2025", value=28, refLow=30, refHigh=100),
                    TrendDataPoint(date="Aug 2025", value=25, refLow=30, refHigh=100),
                    TrendDataPoint(date="Oct 2025", value=22, refLow=30, refHigh=100),
                    TrendDataPoint(date="Dec 2025", value=20, refLow=30, refHigh=100),
                    TrendDataPoint(date="Jan 2026", value=18, refLow=30, refHigh=100),
                ]
            ),
        },
        "available_parameters": ["hemoglobin", "cholesterol", "vitaminD"]
    }
