/**
 * Report Context - Global state management for report data
 */
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { api, ReportData, TrendData, TimelineData, UploadResponse } from '../services/api';

interface ReportContextType {
    // State
    currentReport: ReportData | null;
    trendData: TrendData | null;
    timelineData: TimelineData | null;
    isLoading: boolean;
    error: string | null;
    uploadProgress: number;

    // Actions
    uploadReport: (file: File) => Promise<UploadResponse>;
    loadLatestReport: () => Promise<void>;
    loadTrends: (parameter?: string) => Promise<void>;
    loadTimeline: () => Promise<void>;
    clearError: () => void;
    hasReports: boolean;
}

const ReportContext = createContext<ReportContextType | null>(null);

export function ReportProvider({ children }: { children: ReactNode }) {
    const [currentReport, setCurrentReport] = useState<ReportData | null>(null);
    const [trendData, setTrendData] = useState<TrendData | null>(null);
    const [timelineData, setTimelineData] = useState<TimelineData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [hasReports, setHasReports] = useState(true); // assume true initially

    const clearError = useCallback(() => setError(null), []);

    const uploadReport = useCallback(async (file: File): Promise<UploadResponse> => {
        setIsLoading(true);
        setError(null);
        setUploadProgress(0);

        try {
            // Simulate progress stages
            setUploadProgress(10);
            await new Promise(r => setTimeout(r, 200));

            setUploadProgress(30);
            const response = await api.uploadReport(file);

            setUploadProgress(70);
            await new Promise(r => setTimeout(r, 300));

            if (response.success) {
                // Load the full report
                setUploadProgress(90);
                const fullReport = await api.getLatestReport();
                setCurrentReport(fullReport);
                setHasReports(true);
                setUploadProgress(100);
            } else {
                throw new Error(response.message || 'Upload failed');
            }

            return response;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to upload report';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const loadLatestReport = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const report = await api.getLatestReport();
            setCurrentReport(report);
            setHasReports(true);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load report';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const loadTrends = useCallback(async (parameter?: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const trends = await api.getTrends(parameter);
            setTrendData(trends);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load trends';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const loadTimeline = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const timeline = await api.getTimeline();
            setTimelineData(timeline);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load timeline';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <ReportContext.Provider
            value={{
                currentReport,
                trendData,
                timelineData,
                isLoading,
                error,
                uploadProgress,
                uploadReport,
                loadLatestReport,
                loadTrends,
                loadTimeline,
                clearError,
                hasReports,
            }}
        >
            {children}
        </ReportContext.Provider>
    );
}

export function useReport() {
    const context = useContext(ReportContext);
    if (!context) {
        throw new Error('useReport must be used within a ReportProvider');
    }
    return context;
}
