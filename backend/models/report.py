"""
Report Data Models
"""
from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum

from models.parameter import Parameter, ParameterTrendData


class SeverityLevel(str, Enum):
    """Severity classification for health clarity"""
    LOW = "Low Attention"
    MODERATE = "Moderate Attention"
    HIGH = "High Attention"


class UploadResponse(BaseModel):
    """Response after file upload"""
    upload_id: str
    filename: str
    status: str = "processing"
    message: str = "Report uploaded successfully"


class OCRResult(BaseModel):
    """OCR processing result"""
    text: str
    confidence: float
    page_count: int
    success: bool
    error: Optional[str] = None


class HealthClarityScore(BaseModel):
    """Health clarity score with severity"""
    score: int = Field(..., ge=0, le=100, description="Score from 0-100")
    severity_level: SeverityLevel
    severity_color: str
    parameters_in_range: int
    parameters_needing_attention: int
    total_parameters: int


class ReportSummary(BaseModel):
    """Summary of a report for list views"""
    report_id: str
    report_date: str
    health_clarity_score: int
    severity_level: SeverityLevel
    abnormal_count: int
    total_parameters: int


class ReportDetail(BaseModel):
    """Full report details"""
    report_id: str
    patient_id: str
    report_date: str
    upload_date: str
    filename: str
    parameters: list[Parameter]
    health_clarity_score: HealthClarityScore
    abnormal_parameters: list[Parameter]
    normal_parameters: list[Parameter]
    ocr_confidence: float


class ReportHistory(BaseModel):
    """Report history response"""
    patient_id: str
    total_reports: int
    reports: list[ReportSummary]


class TrendResponse(BaseModel):
    """Trend data response"""
    patient_id: str
    health_score_trend: list[dict]
    parameter_trends: dict[str, ParameterTrendData]
    available_parameters: list[str]


class ExplainRequest(BaseModel):
    """Request for parameter explanation"""
    parameter_name: str
    status: str
    trend: Optional[str] = None


class ExplainResponse(BaseModel):
    """LLM explanation response"""
    parameter_name: str
    explanation: str
    educational_context: str
    disclaimer: str = "This information is for educational purposes only and does not constitute medical advice."


class ActionTimelineItem(BaseModel):
    """Single action item in timeline"""
    title: str
    description: str
    priority: str


class ActionTimelinePhase(BaseModel):
    """Timeline phase with actions"""
    timeframe: str
    color: str
    actions: list[ActionTimelineItem]


class ActionTimelineResponse(BaseModel):
    """Complete action timeline"""
    severity_level: SeverityLevel
    phases: list[ActionTimelinePhase]
    disclaimer: str = "These suggestions are for general guidance only. Always follow the advice of qualified healthcare professionals."
