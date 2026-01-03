"""
Parameter Data Models
"""
from enum import Enum
from pydantic import BaseModel, Field
from typing import Optional


class ParameterStatus(str, Enum):
    """Status of a medical parameter"""
    NORMAL = "normal"
    HIGH = "high"
    LOW = "low"
    BORDERLINE = "borderline"


class ParameterTrend(str, Enum):
    """Trend direction for a parameter"""
    UP = "up"
    DOWN = "down"
    STABLE = "stable"


class Parameter(BaseModel):
    """Medical parameter model matching frontend structure"""
    name: str = Field(..., description="Parameter name (e.g., Hemoglobin)")
    value: str = Field(..., description="Measured value")
    unit: str = Field(..., description="Measurement unit")
    reference_range: str = Field(..., description="Normal reference range", alias="referenceRange")
    status: ParameterStatus = Field(..., description="Status classification")
    category: str = Field(default="General", description="Parameter category")
    trend: Optional[ParameterTrend] = Field(default=None, description="Trend direction")
    explanation: Optional[str] = Field(default=None, description="Educational explanation")
    
    class Config:
        populate_by_name = True


class ParameterInput(BaseModel):
    """Input for parameter parsing"""
    raw_text: str
    confidence: float


class TrendDataPoint(BaseModel):
    """Single data point for trend visualization"""
    date: str
    value: float
    ref_low: float = Field(..., alias="refLow")
    ref_high: float = Field(..., alias="refHigh")
    
    class Config:
        populate_by_name = True


class ParameterTrendData(BaseModel):
    """Trend data for a single parameter"""
    parameter_id: str
    parameter_name: str
    unit: str
    trend_direction: ParameterTrend
    data_points: list[TrendDataPoint]
