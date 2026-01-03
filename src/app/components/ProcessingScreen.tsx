import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, FileText, BarChart3, Brain } from 'lucide-react';

interface ProcessingScreenProps {
  onComplete: () => void;
}

const PROCESSING_STEPS = [
  { icon: FileText, label: 'Reading document...', duration: 800 },
  { icon: Brain, label: 'Extracting parameters...', duration: 1000 },
  { icon: BarChart3, label: 'Analyzing health data...', duration: 800 },
  { icon: CheckCircle, label: 'Generating insights...', duration: 600 },
];

export function ProcessingScreen({ onComplete }: ProcessingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let totalTime = 0;
    const durations = PROCESSING_STEPS.map(s => s.duration);
    const totalDuration = durations.reduce((a, b) => a + b, 0);

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, totalDuration / 50);

    // Step transitions
    PROCESSING_STEPS.forEach((step, index) => {
      setTimeout(() => {
        setCurrentStep(index);
      }, totalTime);
      totalTime += step.duration;
    });

    // Complete callback
    const timeout = setTimeout(() => {
      onComplete();
    }, totalDuration + 500);

    return () => {
      clearTimeout(timeout);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        {/* Animated Logo */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 mx-auto mb-8 relative"
        >
          <div className="absolute inset-0 rounded-full border-4 border-[#E5E9ED]" />
          <div
            className="absolute inset-0 rounded-full border-4 border-[#3A9CA6] border-t-transparent"
          />
        </motion.div>

        <h2 className="text-2xl text-[#1F2933] mb-4">Analyzing Your Report</h2>
        <p className="text-[#5E6C7A] mb-8">
          Our AI is processing your medical report to extract key health insights
        </p>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-[#E5E9ED] rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#3A9CA6] to-[#6B5B95] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Processing Steps */}
        <div className="space-y-4">
          {PROCESSING_STEPS.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStep;
            const isComplete = index < currentStep;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0.5 }}
                animate={{
                  opacity: isComplete || isActive ? 1 : 0.5,
                  x: isActive ? [0, 5, 0] : 0
                }}
                transition={{ duration: 0.3 }}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-[#3A9CA6]/10' : isComplete ? 'bg-[#2E7D5B]/10' : ''
                  }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isComplete
                    ? 'bg-[#2E7D5B] text-white'
                    : isActive
                      ? 'bg-[#3A9CA6] text-white'
                      : 'bg-[#E5E9ED] text-[#5E6C7A]'
                  }`}>
                  {isComplete ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <StepIcon className="w-4 h-4" />
                  )}
                </div>
                <span className={`text-sm ${isComplete || isActive ? 'text-[#1F2933]' : 'text-[#5E6C7A]'
                  }`}>
                  {step.label}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Security Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-xs text-[#5E6C7A]"
        >
          Your data is processed securely and never shared
        </motion.p>
      </motion.div>
    </div>
  );
}
