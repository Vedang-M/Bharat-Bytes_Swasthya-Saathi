import { useState } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { HomeDecision } from './components/HomeDecision';
import { LandingScreen } from './components/LandingScreen';
import { ProcessingScreen } from './components/ProcessingScreen';
import { ReportOverview } from './components/ReportOverview';
import { ParameterDetails } from './components/ParameterDetails';
import { TrendsView } from './components/TrendsView';
import { ActionTimeline } from './components/ActionTimeline';
import { ExplanationPanel } from './components/ExplanationPanel';
import { Activity, TrendingUp, FileText, Clock, BookOpen, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as Tooltip from '@radix-ui/react-tooltip';

type Screen = 'splash' | 'home' | 'landing' | 'processing' | 'overview' | 'parameters' | 'trends' | 'timeline' | 'explanations';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const showNavigation = currentScreen !== 'splash' && currentScreen !== 'home' && currentScreen !== 'landing' && currentScreen !== 'processing';

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'parameters', label: 'Parameters', icon: FileText },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'explanations', label: 'Learn', icon: BookOpen },
  ];

  return (
    <Tooltip.Provider delayDuration={300}>
      <div className="min-h-screen bg-[#F7F9FB] relative">
        {/* Subtle gradient background */}
        <div className="fixed inset-0 bg-gradient-to-br from-[#3A9CA6]/5 via-transparent to-[#6B5B95]/5 pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10">
          {/* Header with Navigation */}
          {showNavigation && (
            <header className="sticky top-0 z-50 bg-white border-b border-[#E5E9ED] shadow-sm">
              <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                  {/* Logo */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#3A9CA6] to-[#6B5B95] rounded-xl flex items-center justify-center">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg text-[#1F2933]">Swasthya Saathi</h2>
                      <p className="text-xs text-[#5E6C7A]">Health Intelligence Platform</p>
                    </div>
                  </div>

                  {/* Desktop Navigation */}
                  <nav className="hidden md:flex items-center gap-2">
                    {navigationItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setCurrentScreen(item.id as Screen)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                          currentScreen === item.id
                            ? 'bg-[#3A9CA6] text-white shadow-md'
                            : 'text-[#5E6C7A] hover:bg-[#F7F9FB] hover:text-[#2F4A68]'
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span className="text-sm">{item.label}</span>
                      </button>
                    ))}
                    <div className="w-px h-6 bg-[#E5E9ED] mx-1" />
                    <button
                      onClick={() => setCurrentScreen('landing')}
                      className="px-4 py-2 bg-[#6B5B95] text-white rounded-lg hover:bg-[#2F4A68] transition-colors text-sm"
                    >
                      + New Report
                    </button>
                  </nav>

                  {/* Mobile Menu Button */}
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 text-[#5E6C7A] hover:text-[#2F4A68]"
                  >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </button>
                </div>

                {/* Mobile Navigation */}
                <AnimatePresence>
                  {mobileMenuOpen && (
                    <motion.nav
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="md:hidden mt-4 pb-2 space-y-2 overflow-hidden"
                    >
                      {navigationItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setCurrentScreen(item.id as Screen);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                            currentScreen === item.id
                              ? 'bg-[#3A9CA6] text-white shadow-md'
                              : 'text-[#5E6C7A] hover:bg-[#F7F9FB] hover:text-[#2F4A68]'
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </motion.nav>
                  )}
                </AnimatePresence>
              </div>
            </header>
          )}

          {/* Main Content */}
          <main>
            <AnimatePresence mode="wait">
              {currentScreen === 'splash' && (
                <motion.div
                  key="splash"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <SplashScreen onComplete={() => setCurrentScreen('home')} />
                </motion.div>
              )}

              {currentScreen === 'home' && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <HomeDecision 
                    onUploadNew={() => setCurrentScreen('landing')}
                    onViewHistory={() => setCurrentScreen('overview')}
                  />
                </motion.div>
              )}

              {currentScreen === 'landing' && (
                <motion.div
                  key="landing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <LandingScreen onUpload={() => setCurrentScreen('processing')} />
                </motion.div>
              )}

              {currentScreen === 'processing' && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ProcessingScreen onComplete={() => setCurrentScreen('overview')} />
                </motion.div>
              )}

              {currentScreen === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ReportOverview onNavigate={(view) => setCurrentScreen(view as Screen)} />
                </motion.div>
              )}

              {currentScreen === 'parameters' && (
                <motion.div
                  key="parameters"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ParameterDetails onBack={() => setCurrentScreen('overview')} />
                </motion.div>
              )}

              {currentScreen === 'trends' && (
                <motion.div
                  key="trends"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <TrendsView onBack={() => setCurrentScreen('overview')} />
                </motion.div>
              )}

              {currentScreen === 'timeline' && (
                <motion.div
                  key="timeline"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ActionTimeline onBack={() => setCurrentScreen('overview')} />
                </motion.div>
              )}

              {currentScreen === 'explanations' && (
                <motion.div
                  key="explanations"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ExplanationPanel onBack={() => setCurrentScreen('overview')} />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Footer */}
          {showNavigation && (
            <footer className="border-t border-[#E5E9ED] bg-white mt-12">
              <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-sm text-[#2F4A68] mb-3">About Swasthya Saathi</h3>
                    <p className="text-xs text-[#5E6C7A] leading-relaxed">
                      A health intelligence platform designed to help individuals understand their 
                      medical test reports and track health changes over time.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm text-[#2F4A68] mb-3">Important Notice</h3>
                    <p className="text-xs text-[#5E6C7A] leading-relaxed">
                      This platform provides educational insights and does not constitute medical 
                      diagnosis or advice. Always consult qualified healthcare professionals.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm text-[#2F4A68] mb-3">Privacy & Security</h3>
                    <p className="text-xs text-[#5E6C7A] leading-relaxed">
                      Your health data is processed securely and privately. We are committed to 
                      maintaining the highest standards of data protection.
                    </p>
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t border-[#E5E9ED] text-center">
                  <p className="text-xs text-[#5E6C7A]">
                    © 2026 Swasthya Saathi. For informational purposes only.
                  </p>
                </div>
              </div>
            </footer>
          )}
        </div>
      </div>
    </Tooltip.Provider>
  );
}