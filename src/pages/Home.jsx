import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Brain, Bookmark, MapPin, ArrowRight, Award, Play, TrendingUp, Globe, Zap, Heart, Users, Film, Lightbulb, Map, FileText, PenTool, MessageCircle, Ear, Building, Theater, Wine, Music, Tv, Flame, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { updateAndGetStreak, getWeekDots, getStreakMotivation, getStreakEmoji } from '../utils/streak'
import { getProgress } from '../utils/progress'

const WOTD_LIST = [
  { fr: 'épanouissement', en: 'fulfilment / blossoming', pos: 'noun', level: 'B2' },
  { fr: 'flâner', en: 'to stroll aimlessly', pos: 'verb', level: 'B1' },
  { fr: 'dépaysement', en: 'change of scenery', pos: 'noun', level: 'B2' },
  { fr: 'nonchalant', en: 'laid-back / casual', pos: 'adjective', level: 'B2' },
  { fr: 'chuchoter', en: 'to whisper', pos: 'verb', level: 'A2' },
  { fr: 'brume', en: 'mist / haze', pos: 'noun', level: 'B1' },
  { fr: 'insouciant', en: 'carefree / nonchalant', pos: 'adjective', level: 'B1' },
  { fr: 'mélancolie', en: 'melancholy', pos: 'noun', level: 'B2' },
  { fr: 'espiègle', en: 'mischievous / playful', pos: 'adjective', level: 'B2' },
  { fr: 'savoir-faire', en: 'know-how / expertise', pos: 'noun', level: 'B1' },
  { fr: 'crépuscule', en: 'twilight / dusk', pos: 'noun', level: 'B1' },
  { fr: 'bienveillant', en: 'benevolent / kind', pos: 'adjective', level: 'B1' },
  { fr: 'lumineux', en: 'luminous / radiant', pos: 'adjective', level: 'A2' },
  { fr: 'sérénité', en: 'serenity / peacefulness', pos: 'noun', level: 'B1' },
  { fr: 'tendresse', en: 'tenderness / fondness', pos: 'noun', level: 'A2' },
]
const LEVEL_PILL = { A1: 'bg-emerald-100 text-emerald-700', A2: 'bg-blue-100 text-blue-700', B1: 'bg-yellow-100 text-yellow-700', B2: 'bg-orange-100 text-orange-700', C1: 'bg-purple-100 text-purple-700' }

const TypewriterText = ({ text, delay = 0 }) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }
    }, delay + currentIndex * 60) // Reduced from 100ms to 60ms for faster typing

    return () => clearTimeout(timer)
  }, [currentIndex, text, delay])

  return (
    <span>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block w-1 h-8 bg-gold-300 ml-1"
      />
    </span>
  )
}



const Home = () => {
  const [streak, setStreak] = useState({ currentStreak: 0, longestStreak: 0 })
  const [reminderDismissed, setReminderDismissed] = useState(false)

  useEffect(() => {
    setStreak(updateAndGetStreak())
  }, [])

  const today = new Date()
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000)
  const todayWord = WOTD_LIST[dayOfYear % WOTD_LIST.length]
  const progress = getProgress()
  const studiedToday = progress.lastStudyDate === today.toISOString().split('T')[0]
  const isAfterNoon = today.getHours() >= 12
  const showReminder = !studiedToday && isAfterNoon && !reminderDismissed

  const particles = useMemo(() => Array.from({ length: 15 }, () => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    xMid: Math.random() * 20 - 10,
    duration: 4 + Math.random() * 3,
    delay: Math.random() * 3,
  })), [])

  const waves = useMemo(() => Array.from({ length: 3 }, () => ({
    width: 60 + Math.random() * 40,
    left: Math.random() * 50,
  })), [])

  const shapes = useMemo(() => Array.from({ length: 5 }, () => ({
    width: 20 + Math.random() * 30,
    height: 20 + Math.random() * 30,
    left: Math.random() * 100,
    top: Math.random() * 100,
    borderRadius: Math.random() > 0.5 ? '50%' : '0%',
    duration: 10 + Math.random() * 5,
    delay: Math.random() * 5,
  })), [])

  return (
    <>
      <SEO
        title="SayBonjour! — Learn French Online | Interactive French Learning Platform"
        description="Master French with SayBonjour! — interactive lessons, grammar guides, vocabulary SRS, quizzes, cultural insights, and daily challenges. Free French learning for every level."
        keywords="learn french, french lessons, french language, online french course, french grammar, french vocabulary, french culture, french learning platform, interactive french, french quizzes, french media, french pronunciation"
        url="/"
        type="website"
      />
      <div className="min-h-screen">
      {/* Hero Section - Enhanced with Dynamic Elements */}
      <section className="hero-section hero-gradient relative overflow-hidden" style={{ minHeight: 'calc(100vh - 5rem)', paddingBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, marginTop: '-5rem', paddingTop: '6rem' }}>
        {/* Enhanced Animated Background Particles */}
        <div className="absolute inset-0">
          {/* Floating Particles */}
          {particles.map((p, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1 h-1 bg-cream-50 rounded-full"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
              }}
              animate={{
                y: [0, -40, 0],
                x: [0, p.xMid, 0],
                opacity: [0.1, 0.6, 0.1],
                scale: [0.5, 1.5, 0.5],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: "easeInOut"
              }}
            />
          ))}

          {/* Animated Wave Lines */}
          {waves.map((w, i) => (
            <motion.div
              key={`wave-${i}`}
              className="absolute h-px bg-gradient-to-r from-transparent via-cream-50 to-transparent opacity-20"
              style={{
                width: `${w.width}%`,
                left: `${w.left}%`,
                top: `${20 + i * 25}%`,
              }}
              animate={{
                x: ["-100%", "100%"],
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                delay: i * 2,
                ease: "linear"
              }}
            />
          ))}

          {/* Subtle Geometric Shapes */}
          {shapes.map((s, i) => (
            <motion.div
              key={`shape-${i}`}
              className="absolute border border-cream-50 opacity-10"
              style={{
                width: `${s.width}px`,
                height: `${s.height}px`,
                left: `${s.left}%`,
                top: `${s.top}%`,
                borderRadius: s.borderRadius,
              }}
              animate={{
                rotate: [0, 360],
                scale: [0.8, 1.2, 0.8],
                opacity: [0.05, 0.15, 0.05],
              }}
              transition={{
                duration: s.duration,
                repeat: Infinity,
                delay: s.delay,
                ease: "linear"
              }}
            />
          ))}
        </div>

        {/* Eiffel Tower Background Image with Enhanced Overlay and Parallax */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <motion.img
            src="https://images.unsplash.com/photo-1549144511-f099e773c147?w=1920&h=1080&fit=crop&crop=center"
            alt="Eiffel Tower full view"
            className="w-full h-full object-cover object-center opacity-70"
            animate={{
              scale: [1, 1.02, 1],
              y: [0, -5, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-burgundy-900/80 via-burgundy-800/60 to-burgundy-900/90"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-burgundy-900/50 via-transparent to-burgundy-800/30"></div>
        </motion.div>

        {/* Enhanced Typography Overlay */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {/* Floating decorative elements with frosted glass effect */}
          <motion.div
            className="absolute -top-20 -left-20 w-40 h-40 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 70%, transparent 100%)',
              backdropFilter: 'blur(1px)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute -bottom-20 -right-20 w-32 h-32 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 70%, transparent 100%)',
              backdropFilter: 'blur(1px)',
            }}
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            {/* Animated Badge */}
            <motion.div
              className="inline-flex items-center bg-cream-50/20 backdrop-blur-sm border border-cream-50/30 text-cream-50 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium mb-8 sm:mb-12 md:mb-20"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(245, 242, 232, 0.3)' }}
            >
              <motion.span
                className="w-2 h-2 bg-cream-50 rounded-full mr-2 sm:mr-3"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="hidden sm:inline">✨ Discover the Beauty of French Language</span>
              <span className="sm:hidden">✨ Learn French</span>
            </motion.div>

            <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[10rem] 2xl:text-[12rem] font-black leading-none tracking-tighter select-none mb-4 sm:mb-6" style={{ color: '#F5F2E8' }}>
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 100, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 1.2,
                  delay: 0.8,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
              >
                FRENCH
              </motion.span>
            </h1>
          </motion.div>

          {/* Enhanced Subtitle with Improved Hierarchy */}
          <motion.div
            className="mt-4 sm:mt-6 md:mt-8 mb-8 sm:mb-10 md:mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <motion.p
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl max-w-4xl mx-auto leading-relaxed font-medium mb-3 sm:mb-4 px-2"
              style={{ color: '#F5F2E8' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              Immerse yourself in the elegance of French language and culture.
            </motion.p>
            <motion.p
              className="text-sm sm:text-base md:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed font-light opacity-90 mb-4 sm:mb-6 px-2"
              style={{ color: '#C8BFA5' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.9, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              <motion.span
                className="inline-block"
                animate={{ scale: [1, 1.01, 1] }}
                transition={{ duration: 4, repeat: Infinity, delay: 2 }}
              >
                From Parisian streets to Provence vineyards, begin your journey today.
              </motion.span>
            </motion.p>

            {/* Enhanced Stats Row with Better Hierarchy */}
            <motion.div
              className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-12 text-cream-50/90 text-sm px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
            >
              {[
                { number: "200+", label: "Lessons", delay: 0 },
                { number: "50+", label: "Quizzes", delay: 0.1 },
                { number: "10K+", label: "Learners", delay: 0.2 }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center group cursor-pointer min-w-[80px]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.8 + stat.delay }}
                  whileHover={{
                    scale: 1.15,
                    y: -5
                  }}
                >
                  <motion.div
                    className="font-bold text-xl sm:text-2xl md:text-3xl mb-1"
                    style={{ color: '#F5F2E8' }}
                    animate={{
                      textShadow: [
                        "0 0 0px rgba(245, 242, 232, 0)",
                        "0 0 10px rgba(245, 242, 232, 0.3)",
                        "0 0 0px rgba(245, 242, 232, 0)"
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 2 + index * 0.5
                    }}
                  >
                    {stat.number}
                  </motion.div>
                  <div
                    className="text-xs sm:text-sm font-medium tracking-wide uppercase opacity-80 group-hover:opacity-100 transition-opacity"
                    style={{ color: '#C8BFA5' }}
                  >
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Enhanced Action Buttons */}
          <motion.div
            className="grid grid-cols-2 sm:flex sm:flex-row gap-3 sm:gap-6 justify-center items-center mb-8 sm:mb-12 md:mb-16 px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative group w-full sm:w-auto"
            >
              <Link
                to="/resources"
                className="relative px-4 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-full font-bold transition-all duration-300 flex items-center justify-center space-x-2 sm:space-x-3 shadow-lg text-sm sm:text-lg w-full sm:w-auto"
                style={{
                  backgroundColor: '#F5F2E8',
                  color: '#800020',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#EBE8DB';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#F5F2E8';
                  e.target.style.transform = 'translateY(0px)';
                }}
              >
                <BookOpen size={20} className="sm:w-6 sm:h-6" />
                <span>Start Learning</span>
                <div className="w-2 h-2 bg-burgundy-600 rounded-full" />
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative group w-full sm:w-auto"
            >
              <Link
                to="/quizzes"
                className="relative px-4 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-full font-bold transition-all duration-300 flex items-center justify-center space-x-2 sm:space-x-3 text-sm sm:text-lg w-full sm:w-auto"
                style={{
                  border: `2px solid #F5F2E8`,
                  color: '#F5F2E8',
                  backgroundColor: 'rgba(245, 242, 232, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#F5F2E8';
                  e.target.style.color = '#800020';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(245, 242, 232, 0.1)';
                  e.target.style.color = '#F5F2E8';
                  e.target.style.transform = 'translateY(0px)';
                }}
              >
                <Brain size={20} className="sm:w-6 sm:h-6" />
                <span>Take a Quiz</span>
                <div className="w-2 h-2 bg-cream-50 rounded-full" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced Bottom Navigation Links */}
        <motion.div
          className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 right-4 sm:left-6 sm:right-6 md:left-8 md:right-8 flex flex-row justify-between items-end gap-2 sm:gap-0 z-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          <motion.div
            whileHover={{ x: 10, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="group"
          >
            <Link
              to="/culture"
              className="transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base md:text-lg font-medium bg-cream-50/10 backdrop-blur-sm px-3 sm:px-5 md:px-6 py-2 sm:py-3 rounded-full border border-cream-50/20 group-hover:bg-cream-50/20 whitespace-nowrap"
              style={{ color: '#F5F2E8' }}
            >
              <motion.span
                className="text-lg sm:text-xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                🏛️
              </motion.span>
              <span className="hidden xs:inline">Explore Culture</span>
              <span className="xs:hidden">Culture</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight size={16} className="sm:w-5 sm:h-5" />
              </motion.div>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ x: -10, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="group"
          >
            <Link
              to="/study-tools"
              className="transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base md:text-lg font-medium bg-cream-50/10 backdrop-blur-sm px-3 sm:px-5 md:px-6 py-2 sm:py-3 rounded-full border border-cream-50/20 group-hover:bg-cream-50/20 whitespace-nowrap"
              style={{ color: '#F5F2E8' }}
            >
              <motion.span
                className="text-lg sm:text-xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                🛠️
              </motion.span>
              <span className="hidden xs:inline">Study Tools</span>
              <span className="xs:hidden">Tools</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
              >
                <ArrowRight size={16} className="sm:w-5 sm:h-5" />
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>

        {/* Enhanced Decorative Elements */}
        <motion.div
          className="absolute top-20 right-20 w-4 h-4 rounded-full border-2 border-cream-50 z-5"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-3 h-3 rounded-full z-5"
          style={{ backgroundColor: '#F5F2E8' }}
          animate={{
            scale: [1, 2, 1],
            opacity: [0.2, 0.6, 0.2],
            y: [0, -10, 0]
          }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute top-1/3 left-10 w-1 h-8 bg-cream-50 rounded-full opacity-20 z-5"
          animate={{
            scaleY: [1, 1.5, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 2 }}
        />
        <motion.div
          className="absolute top-2/3 right-16 w-6 h-1 bg-cream-50 rounded-full opacity-30 z-5"
          animate={{
            scaleX: [1, 1.8, 1],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 1.5 }}
        />
      </section>

      {/* WOTD + Study Reminder strip */}
      <div className="bg-white dark:bg-dark-warm-100 border-b border-gray-100 dark:border-dark-warm-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

          {/* Word of the Day */}
          <Link to="/word-of-the-day" className="flex items-center gap-3 flex-1 group min-w-0">
            <div className="w-9 h-9 bg-burgundy-50 dark:bg-burgundy-900/30 rounded-xl flex items-center justify-center shrink-0">
              <span className="text-lg">📖</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-burgundy-600 dark:text-burgundy-400 uppercase tracking-wide">Mot du Jour</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${LEVEL_PILL[todayWord.level] || 'bg-gray-100 text-gray-600'}`}>{todayWord.level}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 dark:text-cream-50 text-sm group-hover:text-burgundy-600 transition-colors truncate">{todayWord.fr}</span>
                <span className="text-gray-400 text-xs">—</span>
                <span className="text-gray-500 dark:text-gray-400 text-xs truncate">{todayWord.en}</span>
              </div>
            </div>
          </Link>

          <div className="hidden sm:block w-px h-8 bg-gray-200 dark:bg-dark-warm-50 shrink-0" />

          {/* Study reminder (afternoon only, dismissible) */}
          <AnimatePresence>
            {showReminder && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 shrink-0"
              >
                <Flame className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                  Haven't studied yet today — <Link to="/daily-challenges" className="text-burgundy-600 dark:text-burgundy-400 font-bold hover:underline">keep your streak alive!</Link>
                </span>
                <button onClick={() => setReminderDismissed(true)} className="text-gray-300 hover:text-gray-500 transition-colors shrink-0">
                  <X size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* "All good" state after studying */}
          {studiedToday && (
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium shrink-0">
              <span>✓</span>
              <span>Studied today</span>
              {progress.streak > 0 && <span className="font-bold">🔥 {progress.streak}-day streak</span>}
            </div>
          )}

        </div>
      </div>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 section-gradient transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-10 sm:mb-12 md:mb-16"
            initial={{ opacity: 1, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center bg-burgundy-50 dark:bg-dark-warm-100 text-burgundy-900 dark:text-cream-200 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <Award className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Comprehensive Learning Platform
            </motion.div>
            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-burgundy-600 dark:text-cream-50 mb-3 sm:mb-4 transition-colors duration-300 px-2"
              initial={{ opacity: 1, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              Everything You Need to Master French
            </motion.h2>
            <motion.p
              className="text-base sm:text-lg md:text-xl text-gray-800 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300 px-2"
              initial={{ opacity: 1, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              From interactive content to cultural insights, our platform provides all the tools you need for your French learning journey.
            </motion.p>
          </motion.div>

          {/* Modern Bento Grid Layout - Clean 3-Column System */}
          <div className="space-y-12">

            {/* Core Learning Section */}
            <div>
              <h3 className="category-header">Core Learning</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">

                {/* Content & Resources */}
                <Link to="/resources" className="block sm:col-span-2 lg:col-span-2">
                  <motion.div
                    className="bento-card-primary"
                    initial={{ opacity: 1, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="bento-icon-primary group-hover:scale-110">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="bento-title-large">Content & Resources</h3>
                    <p className="bento-description mb-4 sm:mb-6">
                      Access comprehensive articles, lessons, and materials organized by topics and skill levels to enhance your French learning experience.
                    </p>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6 mb-6 sm:mb-8">
                      <div className="text-center">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-burgundy-100 dark:bg-burgundy-vibrant-600 rounded-lg flex items-center justify-center mb-2 sm:mb-3">
                          <span className="text-base sm:text-lg">📖</span>
                        </div>
                        <p className="bento-label sm:text-sm font-medium">200+ Articles</p>
                      </div>
                      <div className="text-center">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-burgundy-100 dark:bg-burgundy-vibrant-600 rounded-lg flex items-center justify-center mb-2 sm:mb-3">
                          <span className="text-base sm:text-lg">🎓</span>
                        </div>
                        <p className="bento-label sm:text-sm font-medium">All Levels</p>
                      </div>
                      <div className="text-center">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-burgundy-100 dark:bg-burgundy-vibrant-600 rounded-lg flex items-center justify-center mb-2 sm:mb-3">
                          <span className="text-base sm:text-lg">📋</span>
                        </div>
                        <p className="bento-label sm:text-sm font-medium">Study Guides</p>
                      </div>
                    </div>
                    <div className="bento-cta">
                      <span>Explore Resources</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </motion.div>
                </Link>

                {/* Interactive Quizzes */}
                <Link to="/quizzes" className="block">
                  <motion.div
                    className="bento-card-secondary"
                    initial={{ opacity: 1, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="bento-icon-secondary">
                      <Brain className="w-6 h-6" />
                    </div>
                    <h3 className="bento-title">Interactive Quizzes</h3>
                    <p className="bento-description">
                      Test your knowledge with engaging quizzes designed to reinforce learning and track progress.
                    </p>
                    <div className="flex space-x-3 mb-4">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-burgundy-100 dark:bg-burgundy-vibrant-600 rounded-lg flex items-center justify-center mb-1">
                          <PenTool className="w-4 h-4 text-burgundy-700 dark:text-cream-50" />
                        </div>
                        <p className="bento-label">Grammar</p>
                      </div>
                      <div className="text-center">
                        <div className="w-8 h-8 bg-burgundy-100 dark:bg-burgundy-vibrant-600 rounded-lg flex items-center justify-center mb-1">
                          <MessageCircle className="w-4 h-4 text-burgundy-700 dark:text-cream-50" />
                        </div>
                        <p className="bento-label">Speaking</p>
                      </div>
                      <div className="text-center">
                        <div className="w-8 h-8 bg-burgundy-100 dark:bg-burgundy-vibrant-600 rounded-lg flex items-center justify-center mb-1">
                          <Ear className="w-4 h-4 text-burgundy-700 dark:text-cream-50" />
                        </div>
                        <p className="bento-label">Listening</p>
                      </div>
                    </div>
                    <div className="bento-cta">
                      <span>Start Quiz</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </motion.div>
                </Link>
              </div>
            </div>

            {/* Quick Access Tools Section */}
            <div>
              <h3 className="category-header">Quick Access</h3>
              <div className="grid grid-cols-2 gap-3 sm:gap-6">

                {/* Daily Streak */}
                <Link to="/quizzes" className="block">
                  <motion.div
                    className="bento-card-tools h-full"
                    initial={{ opacity: 1, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="bento-icon-tools">
                      <Flame className="w-6 h-6 text-cream-50" />
                    </div>
                    <h3 className="bento-title">Daily Streak</h3>
                    <div className="flex items-end gap-3 mb-3">
                      <span className="text-5xl font-extrabold leading-none bento-streak-number">
                        {streak.currentStreak}
                      </span>
                      <div className="pb-1">
                        <p className="bento-label font-semibold leading-tight">day{streak.currentStreak !== 1 ? 's' : ''}</p>
                        <p className="bento-label leading-tight">in a row {getStreakEmoji(streak.currentStreak)}</p>
                      </div>
                    </div>
                    <p className="bento-description mb-3">{getStreakMotivation(streak.currentStreak)}</p>

                    {/* Weekly progress dots */}
                    <div className="mb-4">
                      <p className="bento-label mb-2 font-semibold">This week</p>
                      <div className="flex items-center justify-between gap-1">
                        {['M','T','W','T','F','S','S'].map((label, i) => {
                          const dots = getWeekDots(streak)
                          const dot = dots[i]
                          let dotClass = 'streak-dot-future'
                          if (dot.isVisited) dotClass = 'streak-dot-visited'
                          else if (dot.isToday) dotClass = 'streak-dot-today'
                          return (
                            <div key={i} className="flex flex-col items-center gap-1">
                              <div className={dotClass}>
                                {dot.isVisited ? '✓' : dot.isToday ? '·' : ''}
                              </div>
                              <span style={{ fontSize: '10px' }} className="bento-label">{label}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {streak.longestStreak > 0 && (
                      <p className="bento-label mb-4">Best: <span className="font-semibold">{streak.longestStreak} day{streak.longestStreak !== 1 ? 's' : ''}</span></p>
                    )}
                    <div className="bento-cta">
                      <span>Keep Learning</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </motion.div>
                </Link>

                {/* Phrase of the Day */}
                <Link to="/phrase-of-the-day" className="block">
                  <motion.div
                    className="bento-card-accent"
                    initial={{ opacity: 1, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="bento-icon-accent">
                      <span className="text-xl">💭</span>
                    </div>
                    <h3 className="bento-title">Phrase of the Day</h3>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="bento-quote">"Petit à petit, l'oiseau fait son nid"</p>
                        <SpeakButton
                          text="Petit à petit, l'oiseau fait son nid"
                          size="sm"
                          variant="ghost"
                        />
                      </div>
                      <p className="bento-label italic">Little by little, the bird builds its nest</p>
                    </div>
                    <div className="bento-cta">
                      <span>Daily Wisdom</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </motion.div>
                </Link>

                {/* Memory Boosters */}
                <Link to="/memory-boosters" className="block">
                  <motion.div
                    className="bento-card-secondary"
                    initial={{ opacity: 1, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="bento-icon-secondary">
                      <Lightbulb className="w-6 h-6 text-cream-50" />
                    </div>
                    <h3 className="bento-title">Memory Boosters</h3>
                    <p className="bento-description">
                      Patterns, cognates, and tricks to remember French faster and more effectively.
                    </p>
                    <div className="bento-cta">
                      <span>Boost Memory</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </motion.div>
                </Link>

                {/* Worksheets */}
                <Link to="/worksheets" className="block">
                  <motion.div
                    className="bento-card-neutral"
                    initial={{ opacity: 1, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="bento-icon-neutral">
                      <FileText className="w-6 h-6 text-cream-50" />
                    </div>
                    <h3 className="bento-title">Worksheets</h3>
                    <p className="bento-description">
                      Download PDFs for offline practice and structured learning exercises.
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="bento-badge">50+ PDFs</span>
                    </div>
                    <div className="bento-cta">
                      <span>Get Worksheets</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </motion.div>
                </Link>
              </div>
            </div>

            {/* Culture & Media Section */}
            <div>
              <h3 className="category-header">Culture & Media</h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">

                {/* Cultural Insights */}
                <Link to="/culture" className="block">
                  <motion.div
                    className="bento-card-culture"
                    initial={{ opacity: 1, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="bento-icon-culture">
                      <Globe className="w-6 h-6 text-cream-50" />
                    </div>
                    <h3 className="bento-title">Cultural Insights</h3>
                    <p className="bento-description">
                      Discover French culture, traditions, and regional differences to deepen your understanding.
                    </p>
                    <div className="flex space-x-3 mb-4">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-burgundy-100 dark:bg-burgundy-vibrant-600 rounded-lg flex items-center justify-center mb-1">
                          <Building className="w-4 h-4 text-burgundy-700 dark:text-cream-50" />
                        </div>
                        <p className="bento-label">Traditions</p>
                      </div>
                      <div className="text-center">
                        <div className="w-8 h-8 bg-burgundy-100 dark:bg-burgundy-vibrant-600 rounded-lg flex items-center justify-center mb-1">
                          <MessageCircle className="w-4 h-4 text-burgundy-700 dark:text-cream-50" />
                        </div>
                        <p className="bento-label">Dialects</p>
                      </div>
                      <div className="text-center">
                        <div className="w-8 h-8 bg-burgundy-100 dark:bg-burgundy-vibrant-600 rounded-lg flex items-center justify-center mb-1">
                          <Theater className="w-4 h-4 text-burgundy-700 dark:text-cream-50" />
                        </div>
                        <p className="bento-label">Etiquette</p>
                      </div>
                    </div>
                    <div className="bento-cta">
                      <span>Discover Culture</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </motion.div>
                </Link>

                {/* France Map */}
                <Link to="/france-map" className="block">
                  <motion.div
                    className="bento-card-tools"
                    initial={{ opacity: 1, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="bento-icon-tools">
                      <Map className="w-6 h-6 text-cream-50" />
                    </div>
                    <h3 className="bento-title">Interactive France Map</h3>
                    <p className="bento-description">
                      Explore French regions, discovering local dialects, specialties, and cultural treasures.
                    </p>
                    <div className="flex space-x-3 mb-4">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-burgundy-100 dark:bg-burgundy-vibrant-600 rounded-lg flex items-center justify-center mb-1">
                          <MapPin className="w-4 h-4 text-burgundy-700 dark:text-cream-50" />
                        </div>
                        <p className="bento-label">Regions</p>
                      </div>
                      <div className="text-center">
                        <div className="w-8 h-8 bg-burgundy-100 dark:bg-burgundy-vibrant-600 rounded-lg flex items-center justify-center mb-1">
                          <Wine className="w-4 h-4 text-burgundy-700 dark:text-cream-50" />
                        </div>
                        <p className="bento-label">Specialties</p>
                      </div>
                      <div className="text-center">
                        <div className="w-8 h-8 bg-burgundy-100 dark:bg-burgundy-vibrant-600 rounded-lg flex items-center justify-center mb-1">
                          <MessageCircle className="w-4 h-4 text-burgundy-700 dark:text-cream-50" />
                        </div>
                        <p className="bento-label">Dialects</p>
                      </div>
                    </div>
                    <div className="bento-cta">
                      <span>Explore Map</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </motion.div>
                </Link>

                {/* French in Media */}
                <Link to="/media" className="block">
                  <motion.div
                    className="bento-card-media"
                    initial={{ opacity: 1, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="bento-icon-media">
                      <Film className="w-6 h-6 text-cream-50" />
                    </div>
                    <h3 className="bento-title">French in Media</h3>
                    <p className="bento-description">
                      Discover authentic French through movies, music, and TV shows with curated recommendations.
                    </p>
                    <div className="flex space-x-3 mb-4">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-burgundy-100 dark:bg-burgundy-vibrant-600 rounded-lg flex items-center justify-center mb-1">
                          <Film className="w-4 h-4 text-burgundy-700 dark:text-cream-50" />
                        </div>
                        <p className="bento-label">Movies</p>
                      </div>
                      <div className="text-center">
                        <div className="w-8 h-8 bg-burgundy-100 dark:bg-burgundy-vibrant-600 rounded-lg flex items-center justify-center mb-1">
                          <Music className="w-4 h-4 text-burgundy-700 dark:text-cream-50" />
                        </div>
                        <p className="bento-label">Music</p>
                      </div>
                      <div className="text-center">
                        <div className="w-8 h-8 bg-burgundy-100 dark:bg-burgundy-vibrant-600 rounded-lg flex items-center justify-center mb-1">
                          <Tv className="w-4 h-4 text-burgundy-700 dark:text-cream-50" />
                        </div>
                        <p className="bento-label">TV Shows</p>
                      </div>
                    </div>
                    <div className="bento-cta">
                      <span>Explore Media</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </motion.div>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>







      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 section-gradient-alt dark:bg-dark-warm-200 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 1, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-cream-50 mb-3 sm:mb-4 transition-colors duration-300 px-2">
              Ready to Start Your French Journey?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 transition-colors duration-300 px-2">
              Join thousands of learners who have improved their French with SayBonjour.
            </p>
            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4"
              initial={{ opacity: 1, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Link
                  to="/resources"
                  className="btn-primary flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-shadow duration-300 w-full sm:w-auto px-6 py-3"
                >
                  <motion.div
                    whileHover={{ rotate: 15 }}
                    transition={{ duration: 0.2 }}
                  >
                    <BookOpen size={18} className="sm:w-5 sm:h-5" />
                  </motion.div>
                  <span>Browse Resources</span>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Link
                  to="/study-tools"
                  className="btn-primary flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-shadow duration-300 w-full sm:w-auto px-6 py-3"
                >
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Bookmark size={18} className="sm:w-5 sm:h-5" />
                  </motion.div>
                  <span>Study Tools</span>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Comprehensive Footer */}
      <footer className="bg-burgundy-900 text-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">

            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-burgundy-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-cream-50 font-bold text-lg">B</span>
                </div>
                <span className="brand-font text-xl text-cream-50">SayBonjour!</span>
              </div>
              <p className="text-cream-200 text-sm mb-6 max-w-sm">
                Your comprehensive platform for mastering French language and culture. From beginner basics to advanced fluency.
              </p>

              {/* Learning Info */}
              <div className="space-y-2 text-sm text-cream-200">
                <div className="flex items-start space-x-2">
                  <span className="font-medium">Learning Platform:</span>
                </div>
                <p>Comprehensive French learning resources available 24/7</p>
                <p>Self-paced learning with interactive content</p>
              </div>

              {/* Social Media */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-cream-50 mb-3">Follow Us</h4>
                <a
                  href="https://instagram.com/saybonjour"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 bg-burgundy-700 hover:bg-burgundy-600 rounded-lg transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Learning Resources */}
            <div>
              <h3 className="text-burgundy-300 font-semibold text-sm uppercase tracking-wider mb-4">Learning</h3>
              <ul className="space-y-3 text-sm">
                <li><Link to="/resources" className="text-cream-200 hover:text-cream-50 transition-colors duration-200">Content & Resources</Link></li>
                <li><Link to="/phrase-of-the-day" className="text-cream-200 hover:text-cream-50 transition-colors duration-200">Phrase of the Day</Link></li>
                <li><Link to="/memory-boosters" className="text-cream-200 hover:text-cream-50 transition-colors duration-200">Memory Boosters</Link></li>
                <li><Link to="/worksheets" className="text-cream-200 hover:text-cream-50 transition-colors duration-200">Worksheets</Link></li>
                <li><Link to="/quizzes" className="text-cream-200 hover:text-cream-50 transition-colors duration-200">Interactive Quizzes</Link></li>
                <li><Link to="/study-tools" className="text-cream-200 hover:text-cream-50 transition-colors duration-200">Study Tools</Link></li>
              </ul>
            </div>

            {/* Culture & Media */}
            <div>
              <h3 className="text-burgundy-300 font-semibold text-sm uppercase tracking-wider mb-4">Culture</h3>
              <ul className="space-y-3 text-sm">
                <li><Link to="/culture" className="text-cream-200 hover:text-cream-50 transition-colors duration-200">Cultural Insights</Link></li>
                <li><Link to="/france-map" className="text-cream-200 hover:text-cream-50 transition-colors duration-200">Interactive France Map</Link></li>
                <li><Link to="/media" className="text-cream-200 hover:text-cream-50 transition-colors duration-200">French in Media</Link></li>
                <li><Link to="/media" className="text-cream-200 hover:text-cream-50 transition-colors duration-200">French Movies</Link></li>
                <li><Link to="/media" className="text-cream-200 hover:text-cream-50 transition-colors duration-200">French Music</Link></li>
                <li><Link to="/media" className="text-cream-200 hover:text-cream-50 transition-colors duration-200">French TV Shows</Link></li>
              </ul>
            </div>

            {/* Learning Levels */}
            <div>
              <h3 className="text-burgundy-300 font-semibold text-sm uppercase tracking-wider mb-4">Levels</h3>
              <ul className="space-y-3 text-sm">
                <li><Link to="/levels" className="text-cream-200 hover:text-cream-50 transition-colors duration-200">Beginner (A1-A2)</Link></li>
                <li><Link to="/levels" className="text-cream-200 hover:text-cream-50 transition-colors duration-200">Intermediate (B1-B2)</Link></li>
                <li><Link to="/levels" className="text-cream-200 hover:text-cream-50 transition-colors duration-200">Advanced (C1-C2)</Link></li>
                <li><Link to="/grammar" className="text-cream-200 hover:text-cream-50 transition-colors duration-200">Grammar Basics</Link></li>
                <li><Link to="/vocabulary" className="text-cream-200 hover:text-cream-50 transition-colors duration-200">Vocabulary Building</Link></li>
                <li><Link to="/pronunciation" className="text-cream-200 hover:text-cream-50 transition-colors duration-200">Pronunciation Guide</Link></li>
                <li><Link to="/conversation" className="text-cream-200 hover:text-cream-50 transition-colors duration-200">Conversation Practice</Link></li>
              </ul>
            </div>


          </div>

          {/* Bottom Section */}
          <div className="border-t border-burgundy-700 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-cream-200">
                <p>© 2024 SayBonjour! All rights reserved.</p>
                <p className="mt-1">Made with <span className="text-red-400 animate-pulse">❤️</span> for French language enthusiasts worldwide.</p>
              </div>
              <div className="flex items-center space-x-6 text-sm text-cream-300">
                <span>Terms of Service</span>
                <span>Privacy Policy</span>
                <span>Learning Resources</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </>
  )
}

export default Home
