import { motion } from 'motion/react';
import { BookOpen, AlertTriangle, Info } from 'lucide-react';

interface ExplanationPanelProps {
  onBack: () => void;
}

export function ExplanationPanel({ onBack }: ExplanationPanelProps) {
  const explanations = [
    {
      category: "Blood Count Parameters",
      icon: "🩸",
      items: [
        {
          name: "Hemoglobin",
          description: "A protein in red blood cells that carries oxygen throughout the body. Hemoglobin levels can indicate various conditions related to oxygen transport and red blood cell production.",
          normalRange: "13.0 - 17.0 g/dL for adults",
          factors: [
            "Iron availability in the diet",
            "Vitamin B12 and folate levels",
            "Bone marrow function",
            "Chronic health conditions"
          ]
        },
        {
          name: "White Blood Cell Count",
          description: "Cells that help fight infections and support immune function. WBC count provides insights into immune system activity and overall health status.",
          normalRange: "4.0 - 11.0 ×10³/μL",
          factors: [
            "Immune system activity",
            "Presence of infection or inflammation",
            "Stress levels",
            "Certain medications"
          ]
        }
      ]
    },
    {
      category: "Lipid Profile",
      icon: "💊",
      items: [
        {
          name: "Total Cholesterol",
          description: "The combined amount of cholesterol carried in the blood, including HDL, LDL, and other lipoproteins. This metric provides an overview of lipid metabolism.",
          normalRange: "< 200 mg/dL",
          factors: [
            "Dietary fat and cholesterol intake",
            "Physical activity levels",
            "Genetic factors",
            "Age and gender"
          ]
        },
        {
          name: "LDL Cholesterol",
          description: "Often referred to in general health discussions, LDL carries cholesterol to cells. Elevated levels are associated with cardiovascular considerations.",
          normalRange: "< 100 mg/dL optimal",
          factors: [
            "Saturated fat consumption",
            "Body weight",
            "Exercise habits",
            "Family history"
          ]
        },
        {
          name: "HDL Cholesterol",
          description: "Carries cholesterol away from cells to the liver for processing. Higher levels are generally associated with better cardiovascular health markers.",
          normalRange: "> 40 mg/dL for men, > 50 mg/dL for women",
          factors: [
            "Physical activity",
            "Not smoking",
            "Healthy body weight",
            "Dietary choices"
          ]
        }
      ]
    },
    {
      category: "Metabolic Parameters",
      icon: "⚡",
      items: [
        {
          name: "Fasting Glucose",
          description: "Measures blood sugar levels after an overnight fast. This test provides information about glucose metabolism and insulin function.",
          normalRange: "70 - 100 mg/dL",
          factors: [
            "Carbohydrate intake",
            "Physical activity",
            "Stress levels",
            "Sleep quality"
          ]
        },
        {
          name: "HbA1c",
          description: "Reflects average blood glucose levels over approximately 2-3 months. This provides a longer-term view of glucose control compared to single measurements.",
          normalRange: "< 5.7%",
          factors: [
            "Overall blood sugar management",
            "Diet patterns",
            "Exercise consistency",
            "Metabolic health"
          ]
        }
      ]
    },
    {
      category: "Vitamins & Minerals",
      icon: "🌟",
      items: [
        {
          name: "Vitamin D",
          description: "Supports bone health, immune function, and various physiological processes. Vitamin D is synthesized through sun exposure and obtained through diet.",
          normalRange: "30 - 100 ng/mL",
          factors: [
            "Sun exposure",
            "Dietary sources (fatty fish, fortified foods)",
            "Geographic location",
            "Skin tone"
          ]
        },
        {
          name: "Vitamin B12",
          description: "Essential for nerve function, DNA synthesis, and red blood cell formation. B12 is found primarily in animal-based foods.",
          normalRange: "200 - 900 pg/mL",
          factors: [
            "Dietary sources (meat, fish, dairy)",
            "Digestive system absorption",
            "Age-related changes",
            "Certain medications"
          ]
        }
      ]
    }
  ];

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
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-[#6B5B95]" />
            <h1 className="text-3xl text-[#1F2933]">Educational Explanations</h1>
          </div>
          <p className="text-[#5E6C7A]">Plain-language information about health parameters</p>
        </div>

        {/* Educational Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-5 bg-[#6B5B95]/10 rounded-xl border border-[#6B5B95]/30"
        >
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-[#6B5B95] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm text-[#2F4A68] mb-2">Educational Content Only</h3>
              <p className="text-sm text-[#5E6C7A] leading-relaxed">
                The information below is provided for educational purposes to help understand common 
                health parameters. This content does not constitute medical advice, diagnosis, or 
                treatment recommendations. Always consult healthcare professionals for personalized 
                medical guidance.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Explanations by Category */}
        <div className="space-y-6">
          {explanations.map((category, catIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-[#E5E9ED] overflow-hidden"
            >
              {/* Category Header */}
              <div className="p-6 bg-gradient-to-r from-[#F7F9FB] to-white border-b border-[#E5E9ED]">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{category.icon}</span>
                  <h2 className="text-xl text-[#2F4A68]">{category.category}</h2>
                </div>
              </div>

              {/* Items */}
              <div className="p-6 space-y-6">
                {category.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: catIndex * 0.1 + itemIndex * 0.05 }}
                    className="pb-6 last:pb-0 border-b last:border-b-0 border-[#E5E9ED]"
                  >
                    <h3 className="text-lg text-[#1F2933] mb-3">{item.name}</h3>
                    
                    <p className="text-sm text-[#5E6C7A] leading-relaxed mb-4">
                      {item.description}
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Normal Range */}
                      <div className="p-4 bg-[#2E7D5B]/5 rounded-xl border border-[#2E7D5B]/20">
                        <p className="text-xs text-[#2E7D5B] mb-1">Reference Range</p>
                        <p className="text-sm text-[#1F2933]">{item.normalRange}</p>
                      </div>

                      {/* Influencing Factors */}
                      <div className="p-4 bg-[#3A9CA6]/5 rounded-xl border border-[#3A9CA6]/20">
                        <p className="text-xs text-[#3A9CA6] mb-2">Influencing Factors</p>
                        <ul className="space-y-1">
                          {item.factors.map((factor, idx) => (
                            <li key={idx} className="text-xs text-[#5E6C7A] flex items-start gap-2">
                              <span className="text-[#3A9CA6] mt-0.5">•</span>
                              <span>{factor}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 p-5 bg-white rounded-xl shadow-lg border border-[#E5E9ED]"
        >
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-[#C89B3C] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm text-[#2F4A68] mb-2">When to Seek Professional Guidance</h4>
              <p className="text-sm text-[#5E6C7A] leading-relaxed">
                If any test results fall outside reference ranges or if you have questions about 
                your health parameters, schedule a consultation with a qualified healthcare provider. 
                They can provide personalized interpretation based on your complete health history, 
                symptoms, and individual circumstances.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
