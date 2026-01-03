/**
 * Swasthya Saathi API Service
 * Connects frontend to backend APIs
 */

const API_BASE_URL = 'http://localhost:8000';

// Types matching backend models
export interface Parameter {
    name: string;
    value: string;
    unit: string;
    referenceRange: string;
    status: 'normal' | 'high' | 'low';
    category: string;
    trend?: 'up' | 'down' | 'stable' | null;
    explanation?: string | null;
}

export interface HealthClarityScore {
    score: number;
    severity_level: string;
    severity_color: string;
    parameters_in_range: number;
    parameters_needing_attention: number;
    total_parameters: number;
    interpretation?: string;
}

export interface ReportData {
    report_id: string;
    patient_id: string;
    report_date: string;
    upload_date: string;
    filename: string;
    ocr_confidence: number;
    parameters: Parameter[];
    health_clarity_score: HealthClarityScore;
    abnormal_parameters: Parameter[];
    normal_parameters: Parameter[];
    severity_level: string;
}

export interface TrendDataPoint {
    date: string;
    value: number;
    refLow: number;
    refHigh: number;
}

export interface ParameterTrend {
    parameter_id: string;
    parameter_name: string;
    unit: string;
    trend_direction: string;
    data_points: TrendDataPoint[];
}

export interface TrendData {
    patient_id: string;
    health_score_trend: { date: string; score: number }[];
    parameter_trends: Record<string, ParameterTrend>;
    available_parameters: string[];
}

export interface TimelineAction {
    title: string;
    description: string;
    priority: string;
}

export interface TimelinePhase {
    timeframe: string;
    color: string;
    actions: TimelineAction[];
}

export interface TimelineData {
    severity_level: string;
    phases: TimelinePhase[];
    disclaimer: string;
}

export interface ExplanationData {
    parameter_name: string;
    explanation: string;
    educational_context: string;
    disclaimer: string;
}

export interface UploadResponse {
    success: boolean;
    message: string;
    report_id: string;
    upload_id: string;
    patient_id: string;
    report_date: string;
    ocr_confidence: number;
    health_clarity_score: HealthClarityScore;
    total_parameters: number;
    parameters_in_range: number;
    parameters_needing_attention: number;
    abnormal_parameters: Parameter[];
    severity_level: string;
    error?: string;
    suggestion?: string;
}

export interface ReportHistoryItem {
    report_id: string;
    report_date: string;
    health_clarity_score: number;
    severity_level: string;
    abnormal_count: number;
}

export interface ReportHistory {
    patient_id: string;
    total_reports: number;
    reports: ReportHistoryItem[];
}

// API Functions
class APIService {
    private baseUrl: string;

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            credentials: 'include',
            ...options,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Request failed' }));
            throw new Error(error.detail || error.message || 'Request failed');
        }

        return response.json();
    }

    // Health check
    async healthCheck(): Promise<{ status: string; service: string }> {
        return this.request('/health');
    }

    // Upload medical report
    async uploadReport(file: File): Promise<UploadResponse> {
        const formData = new FormData();
        formData.append('file', file);

        return this.request('/reports/upload', {
            method: 'POST',
            body: formData,
        });
    }

    // Get latest report
    async getLatestReport(): Promise<ReportData> {
        return this.request('/reports/latest');
    }

    // Get report history
    async getReportHistory(): Promise<ReportHistory> {
        return this.request('/reports/history');
    }

    // Get specific report
    async getReport(reportId: string): Promise<ReportData> {
        return this.request(`/reports/${reportId}`);
    }

    // Get trend data
    async getTrends(parameter?: string): Promise<TrendData> {
        const query = parameter ? `?parameter=${encodeURIComponent(parameter)}` : '';
        return this.request(`/reports/trends/data${query}`);
    }

    // Get health clarity score
    async getHealthScore(): Promise<HealthClarityScore> {
        return this.request('/reports/health/clarity-score');
    }

    // Get action timeline
    async getTimeline(): Promise<TimelineData> {
        return this.request('/reports/action-timeline');
    }

    // Get parameter explanation
    async getExplanation(
        parameterName: string,
        status: string,
        trend?: string
    ): Promise<ExplanationData> {
        return this.request('/reports/explain', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                parameter_name: parameterName,
                status: status,
                trend: trend || null,
            }),
        });
    }
}

// Export singleton instance
export const api = new APIService();

// Export class for custom instances
export { APIService };
