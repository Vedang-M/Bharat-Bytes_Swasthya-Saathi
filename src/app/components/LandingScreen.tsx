import { useState, useRef, useCallback } from 'react';
import { Upload, Shield, Lock, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../services/api';

interface LandingScreenProps {
  onUpload: (reportData?: any) => void;
}

export function LandingScreen({ onUpload }: LandingScreenProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateAndSetFile(files[0]);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  }, []);

  const validateAndSetFile = (file: File) => {
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload PDF, PNG, or JPG files.');
      return;
    }

    if (file.size > maxSize) {
      setError('File too large. Maximum size is 10MB.');
      return;
    }

    setSelectedFile(file);
    // Auto-upload after selection
    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 80));
      }, 200);

      const response = await api.uploadReport(file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.success) {
        // Small delay to show 100% completion
        setTimeout(() => {
          onUpload(response);
        }, 500);
      } else {
        throw new Error(response.message || response.suggestion || 'Upload failed');
      }
    } catch (err) {
      let message = 'Failed to upload report. Please try again.';

      if (err instanceof TypeError && err.message.includes('fetch')) {
        message = 'Cannot connect to server. Please make sure the backend is running on port 8000.';
      } else if (err instanceof Error) {
        message = err.message;
      }

      setError(message);
      setSelectedFile(null);
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#3A9CA6]/10 rounded-full mb-6"
          >
            <div className="w-2 h-2 bg-[#3A9CA6] rounded-full animate-pulse"></div>
            <span className="text-sm text-[#2F4A68]">Health Intelligence Platform</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl mb-4 text-[#1F2933] tracking-tight">
            Swasthya Saathi
          </h1>
          <p className="text-xl text-[#5E6C7A] max-w-2xl mx-auto leading-relaxed">
            Understand your health reports clearly and track changes over time
          </p>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-6 mb-12"
        >
          <div className="flex items-center gap-2 text-[#5E6C7A]">
            <Shield className="w-5 h-5 text-[#3A9CA6]" />
            <span className="text-sm">Safe</span>
          </div>
          <div className="flex items-center gap-2 text-[#5E6C7A]">
            <Lock className="w-5 h-5 text-[#3A9CA6]" />
            <span className="text-sm">Private</span>
          </div>
          <div className="flex items-center gap-2 text-[#5E6C7A]">
            <FileText className="w-5 h-5 text-[#3A9CA6]" />
            <span className="text-sm">Non-Diagnostic</span>
          </div>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg border border-[#E5E9ED] p-8 md:p-12"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${isDragging
              ? 'border-[#3A9CA6] bg-[#3A9CA6]/10'
              : isUploading
                ? 'border-[#3A9CA6]/50 bg-[#3A9CA6]/5'
                : 'border-[#3A9CA6]/30 hover:border-[#3A9CA6] hover:bg-[#3A9CA6]/5'
              } group`}
          >
            <AnimatePresence mode="wait">
              {isUploading ? (
                <motion.div
                  key="uploading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="w-16 h-16 relative">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="#E5E9ED"
                        strokeWidth="4"
                        fill="none"
                      />
                      <motion.circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="#3A9CA6"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={176}
                        initial={{ strokeDashoffset: 176 }}
                        animate={{ strokeDashoffset: 176 - (176 * uploadProgress) / 100 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm text-[#3A9CA6] font-medium">{uploadProgress}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-lg text-[#1F2933] mb-1">Analyzing Report...</p>
                    <p className="text-sm text-[#5E6C7A]">{selectedFile?.name}</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${isDragging ? 'bg-[#3A9CA6]/20' : 'bg-[#3A9CA6]/10 group-hover:bg-[#3A9CA6]/20'
                    }`}>
                    <Upload className="w-8 h-8 text-[#3A9CA6]" />
                  </div>
                  <div>
                    <p className="text-lg text-[#1F2933] mb-2">
                      {isDragging ? 'Drop your file here' : 'Upload Medical Report'}
                    </p>
                    <p className="text-sm text-[#5E6C7A]">
                      Drag and drop or click to select JPG or PNG
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-red-700">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="text-sm text-red-600 underline mt-1"
                  >
                    Try again
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 pt-8 border-t border-[#E5E9ED]">
            <p className="text-xs text-[#5E6C7A] text-center leading-relaxed">
              For informational purposes only. This platform provides educational insights
              and does not constitute medical advice or diagnosis. Always consult qualified
              healthcare professionals for medical decisions.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
