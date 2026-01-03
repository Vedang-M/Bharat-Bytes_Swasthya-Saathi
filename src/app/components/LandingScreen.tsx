import { Upload, Shield, Lock, FileText } from 'lucide-react';
import { motion } from 'motion/react';

interface LandingScreenProps {
  onUpload: () => void;
}

export function LandingScreen({ onUpload }: LandingScreenProps) {
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
          <div
            onClick={onUpload}
            className="border-2 border-dashed border-[#3A9CA6]/30 rounded-xl p-12 text-center cursor-pointer transition-all duration-300 hover:border-[#3A9CA6] hover:bg-[#3A9CA6]/5 group"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-[#3A9CA6]/10 rounded-full flex items-center justify-center group-hover:bg-[#3A9CA6]/20 transition-colors">
                <Upload className="w-8 h-8 text-[#3A9CA6]" />
              </div>
              <div>
                <p className="text-lg text-[#1F2933] mb-2">
                  Upload Medical Report
                </p>
                <p className="text-sm text-[#5E6C7A]">
                  Drag and drop or click to select PDF, JPG, or PNG
                </p>
              </div>
            </div>
          </div>

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
