import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Clock, CheckCircle2, Calendar, Loader2 } from 'lucide-react';
import { api, TimelineData } from '../services/api';

interface ActionTimelineProps {
  onBack: () => void;
}

export function ActionTimeline({ onBack }: ActionTimelineProps) {
  const [timelineData, setTimelineData] = useState<TimelineData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTimeline();
  }, []);

  const loadTimeline = async () => {
    try {
      setIsLoading(true);
      const data = await api.getTimeline();
      setTimelineData(data);
    } catch (err) {
      console.error('Failed to load timeline:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#3A9CA6] animate-spin" />
      </div>
    );
  }

  const phases = timelineData?.phases || [];
  const disclaimer = timelineData?.disclaimer || '';

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'immediate':
        return 'border-l-[#3A9CA6] bg-[#3A9CA6]/5';
      case 'high':
        return 'border-l-[#C89B3C] bg-[#C89B3C]/5';
      case 'moderate':
        return 'border-l-[#6B5B95] bg-[#6B5B95]/5';
      default:
        return 'border-l-[#E5E9ED] bg-[#F7F9FB]';
    }
  };

  const getIcon = (timeframe: string) => {
    if (timeframe === 'Now') return Clock;
    return Calendar;
  };

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="text-[#3A9CA6] hover:text-[#2F4A68] transition-colors mb-4"
          >
            ← Back to Overview
          </button>
          <h1 className="text-3xl text-[#1F2933] mb-2">Action Timeline</h1>
          <p className="text-[#5E6C7A]">Suggested steps for health management and follow-up</p>
        </div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 bg-[#6B5B95]/5 rounded-xl border border-[#6B5B95]/20"
        >
          <p className="text-sm text-[#5E6C7A] leading-relaxed">
            The following timeline provides general guidance for health management. These are not medical
            recommendations. Always follow the specific advice of qualified healthcare professionals.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#3A9CA6] via-[#6B5B95] to-[#2F4A68]" />

          <div className="space-y-12">
            {phases.map((phase, index) => {
              const PhaseIcon = getIcon(phase.timeframe);

              return (
                <motion.div
                  key={phase.timeframe}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="relative"
                >
                  {/* Timeline Icon */}
                  <div
                    className="absolute left-0 w-12 h-12 rounded-full flex items-center justify-center z-10"
                    style={{ backgroundColor: `${phase.color}20` }}
                  >
                    <PhaseIcon className="w-6 h-6" style={{ color: phase.color }} />
                  </div>

                  {/* Content */}
                  <div className="ml-20">
                    <div
                      className="inline-block px-4 py-1.5 rounded-full mb-4"
                      style={{
                        backgroundColor: `${phase.color}15`,
                        color: phase.color
                      }}
                    >
                      <span>{phase.timeframe}</span>
                    </div>

                    <div className="space-y-4">
                      {phase.actions.map((action, actionIndex) => (
                        <motion.div
                          key={actionIndex}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.2 + actionIndex * 0.1 }}
                          className={`p-5 bg-white rounded-xl border-l-4 shadow-sm hover:shadow-md transition-shadow ${getPriorityStyles(action.priority)}`}
                        >
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-[#2E7D5B] flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <h4 className="text-[#1F2933] mb-1">{action.title}</h4>
                              <p className="text-sm text-[#5E6C7A] leading-relaxed">
                                {action.description}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Educational Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 p-6 bg-white rounded-2xl shadow-lg border border-[#E5E9ED]"
        >
          <h3 className="text-lg text-[#2F4A68] mb-3">Important Reminder</h3>
          <p className="text-sm text-[#5E6C7A] leading-relaxed mb-3">
            {disclaimer || 'This timeline is designed to help organize health-related tasks and does not replace professional medical guidance.'}
          </p>
          <p className="text-sm text-[#5E6C7A] leading-relaxed">
            If you experience any concerning symptoms or have questions about your health,
            contact your healthcare provider immediately.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
