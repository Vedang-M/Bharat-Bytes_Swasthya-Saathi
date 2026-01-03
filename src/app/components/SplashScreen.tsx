import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-[#F7F9FB] flex items-center justify-center relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3A9CA6]/5 via-transparent to-[#6B5B95]/5" />
      
      {/* Abstract wave decoration */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.path
            d="M0,300 Q360,250 720,300 T1440,300 L1440,800 L0,800 Z"
            fill="url(#gradient1)"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.15, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <motion.path
            d="M0,400 Q360,350 720,400 T1440,400 L1440,800 L0,800 Z"
            fill="url(#gradient2)"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 0.1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3A9CA6" />
              <stop offset="100%" stopColor="#2F4A68" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6B5B95" />
              <stop offset="100%" stopColor="#3A9CA6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex justify-center mb-8"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-[#3A9CA6] to-[#6B5B95] rounded-2xl flex items-center justify-center shadow-2xl">
            <Activity className="w-12 h-12 text-white" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl text-[#1F2933] mb-4"
        >
          Swasthya Saathi
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg text-[#5E6C7A] mb-12"
        >
          Health Intelligence Platform
        </motion.p>

        {/* Loading indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="flex justify-center mb-20"
        >
          <div className="flex gap-2">
            <motion.div
              className="w-2 h-2 bg-[#3A9CA6] rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="w-2 h-2 bg-[#2F4A68] rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="w-2 h-2 bg-[#6B5B95] rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8"
        >
          <p className="text-xs text-[#5E6C7A]">
            Informational only • Not a medical diagnosis
          </p>
        </motion.div>
      </div>
    </div>
  );
}