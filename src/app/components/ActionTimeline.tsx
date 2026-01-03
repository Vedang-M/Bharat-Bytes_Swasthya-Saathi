import { motion } from 'motion/react';
import { Clock, CheckCircle2, Calendar } from 'lucide-react';

interface ActionTimelineProps {
  onBack: () => void;
}

export function ActionTimeline({ onBack }: ActionTimelineProps) {
  const timelineItems = [
    {
      timeframe: "Now",
      icon: Clock,
      color: "#3A9CA6",
      actions: [
        {
          title: "Review Complete Report",
          description: "Examine all parameters and their reference ranges in detail",
          priority: "immediate"
        },
        {
          title: "Document Current Values",
          description: "Keep a record of today's test results for future comparison",
          priority: "immediate"
        }
      ]
    },
    {
      timeframe: "1–3 Days",
      icon: Calendar,
      color: "#6B5B95",
      actions: [
        {
          title: "Consult Healthcare Provider",
          description: "Schedule an appointment to discuss parameters requiring attention",
          priority: "high"
        },
        {
          title: "Share Report with Specialist",
          description: "Provide this analysis to your healthcare team for comprehensive evaluation",
          priority: "high"
        },
        {
          title: "Explore Related Information",
          description: "Research reliable health resources about the identified parameters",
          priority: "moderate"
        }
      ]
    },
    {
      timeframe: "1 Month",
      icon: Calendar,
      color: "#2F4A68",
      actions: [
        {
          title: "Follow-up Testing",
          description: "Consider scheduling follow-up tests as recommended by healthcare provider",
          priority: "moderate"
        },
        {
          title: "Track Lifestyle Changes",
          description: "Monitor any modifications to diet, exercise, or medication as advised",
          priority: "moderate"
        },
        {
          title: "Update Health Records",
          description: "Upload new test reports to track longitudinal health trends",
          priority: "low"
        }
      ]
    }
  ];

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
            {timelineItems.map((item, index) => (
              <motion.div
                key={item.timeframe}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                {/* Timeline Icon */}
                <div 
                  className="absolute left-0 w-12 h-12 rounded-full flex items-center justify-center z-10"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <item.icon className="w-6 h-6" style={{ color: item.color }} />
                </div>

                {/* Content */}
                <div className="ml-20">
                  <div 
                    className="inline-block px-4 py-1.5 rounded-full mb-4"
                    style={{ 
                      backgroundColor: `${item.color}15`,
                      color: item.color
                    }}
                  >
                    <span>{item.timeframe}</span>
                  </div>

                  <div className="space-y-4">
                    {item.actions.map((action, actionIndex) => (
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
            ))}
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
            This timeline is designed to help organize health-related tasks and does not replace 
            professional medical guidance. Each individual's health situation is unique and requires 
            personalized care from qualified healthcare providers.
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
