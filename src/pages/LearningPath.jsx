import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronRight, CheckCircle, Circle, Lock, BookOpen, MessageSquare, Mic, Pen, Brain, Star, Zap, Target, Map } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { getProgress } from '../utils/progress'
import SEO from '../components/SEO'

const CEFR_COLORS = { A1: '#22c55e', A2: '#84cc16', B1: '#eab308', B2: '#f97316', C1: '#ef4444', C2: '#a855f7' }
const CEFR_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

const PATH_DATA = {
  A1: {
    title: 'Absolute Beginner', emoji: '🌱',
    description: 'Build your French foundation — greetings, numbers, colors, basic phrases',
    modules: [
      { id: 'greetings', title: 'Greetings & Introductions', icon: MessageSquare, link: '/vocabulary', duration: '2 weeks', xp: 200, topics: ['Bonjour, salut, au revoir', 'Je m\'appelle...', 'Formal vs informal', 'Numbers 1–20'] },
      { id: 'articles', title: 'Articles & Gender', icon: BookOpen, link: '/grammar', duration: '1 week', xp: 150, topics: ['le, la, les, un, une', 'Noun gender rules', 'Plural formation', 'Basic adjectives'] },
      { id: 'present1', title: 'Présent Tense — Basics', icon: Pen, link: '/conjugate', duration: '2 weeks', xp: 300, topics: ['-er verbs: parler, manger', 'être & avoir', 'Subject pronouns', 'Question formation'] },
      { id: 'daily', title: 'Daily Life Vocabulary', icon: Star, link: '/vocabulary', duration: '2 weeks', xp: 250, topics: ['Family, food, colors', 'Days & months', 'Weather expressions', 'Classroom vocabulary'] },
      { id: 'a1quiz', title: 'A1 Level Assessment', icon: Brain, link: '/quizzes', duration: '1 day', xp: 100, isAssessment: true, topics: ['All A1 topics', 'Mixed practice', 'CEFR standard questions'] },
    ]
  },
  A2: {
    title: 'Elementary', emoji: '🌿',
    description: 'Handle familiar situations — shopping, travel, simple conversations',
    modules: [
      { id: 'past1', title: 'Passé Composé', icon: BookOpen, link: '/conjugate', duration: '2 weeks', xp: 300, topics: ['avoir + past participle', 'être verbs (DR MRS VAN DER TRAMP)', 'Agreement rules', 'Irregular past participles'] },
      { id: 'imparfait', title: 'Imparfait', icon: BookOpen, link: '/conjugate', duration: '1 week', xp: 200, topics: ['Formation', 'Descriptions vs actions', 'Contrast with passé composé'] },
      { id: 'travel', title: 'Travel French', icon: Map, link: '/travel-french', duration: '1 week', xp: 150, topics: ['Airport, hotel, restaurant', 'Asking for directions', 'Transport vocabulary'] },
      { id: 'pronouns', title: 'Direct & Indirect Pronouns', icon: Pen, link: '/grammar', duration: '2 weeks', xp: 250, topics: ['me, te, le, la, les', 'lui, leur', 'Placement rules', 'Double pronouns'] },
      { id: 'a2quiz', title: 'A2 Level Assessment', icon: Brain, link: '/quizzes', duration: '1 day', xp: 100, isAssessment: true, topics: ['A2 comprehensive test'] },
    ]
  },
  B1: {
    title: 'Intermediate', emoji: '🌳',
    description: 'Navigate most situations — express opinions, understand main ideas',
    modules: [
      { id: 'subjonctif', title: 'Subjonctif', icon: BookOpen, link: '/conjugate', duration: '3 weeks', xp: 400, topics: ['Formation', 'Triggers: il faut que, vouloir que', 'Common irregular forms', 'Practice in context'] },
      { id: 'conditional', title: 'Conditionnel', icon: BookOpen, link: '/conjugate', duration: '2 weeks', xp: 300, topics: ['Present conditional', 'Past conditional', 'If-clauses (si)', 'Politeness'] },
      { id: 'reading', title: 'Intermediate Reading', icon: BookOpen, link: '/reading', duration: '2 weeks', xp: 200, topics: ['Newspaper articles', 'Short stories', 'Comprehension strategies'] },
      { id: 'business', title: 'Introduction to Business French', icon: Pen, link: '/business-french', duration: '2 weeks', xp: 250, topics: ['Email writing', 'Meeting vocabulary', 'Professional register'] },
      { id: 'b1quiz', title: 'DELF B1 Preparation', icon: Brain, link: '/quizzes', duration: '1 week', xp: 300, isAssessment: true, topics: ['DELF B1 format', 'All four skills', 'Timed practice'] },
    ]
  },
  B2: {
    title: 'Upper Intermediate', emoji: '🏔️',
    description: 'Fluent on complex topics — academic, professional, cultural French',
    modules: [
      { id: 'discourse', title: 'Advanced Grammar & Discourse', icon: BookOpen, link: '/grammar', duration: '3 weeks', xp: 400, topics: ['Gérondif, participe présent', 'Causative (faire + inf)', 'Stylistic inversions', 'Relative clauses (dont, lequel)'] },
      { id: 'slang', title: 'French Slang & Informal Register', icon: MessageSquare, link: '/slang-french', duration: '2 weeks', xp: 250, topics: ['Verlan', 'Everyday expressions', 'Formal vs informal switching'] },
      { id: 'culture', title: 'Culture & Civilisation', icon: Star, link: '/culture', duration: '2 weeks', xp: 200, topics: ['French history highlights', 'Cultural references', 'Cinema & literature'] },
      { id: 'b2quiz', title: 'DELF B2 Preparation', icon: Brain, link: '/quizzes', duration: '2 weeks', xp: 400, isAssessment: true, topics: ['Oral presentation', 'Essay writing', 'Listening comprehension'] },
    ]
  },
  C1: {
    title: 'Advanced', emoji: '🦅',
    description: 'Near-native fluency — nuance, precision, complex reasoning',
    modules: [
      { id: 'lit', title: 'Literature & Advanced Texts', icon: BookOpen, link: '/resources', duration: '4 weeks', xp: 500, topics: ['Literary analysis', 'Classical texts', 'Contemporary authors'] },
      { id: 'writing', title: 'Academic & Creative Writing', icon: Pen, link: '/writing', duration: '3 weeks', xp: 400, topics: ['Essay structure', 'Argumentation', 'Style refinement', 'Nuanced vocabulary'] },
      { id: 'c1quiz', title: 'DALF C1 Preparation', icon: Brain, link: '/quizzes', duration: '3 weeks', xp: 500, isAssessment: true, topics: ['Full DALF C1 format', 'Complex comprehension', 'Extended writing tasks'] },
    ]
  },
  C2: {
    title: 'Mastery', emoji: '👑',
    description: 'Complete command — effortless expression at the highest level',
    modules: [
      { id: 'rhetoric', title: 'Rhetoric & Stylistics', icon: Mic, link: '/grammar', duration: '4 weeks', xp: 600, topics: ['Figures of speech', 'Register mastery', 'Oratorical French', 'Persuasion techniques'] },
      { id: 'c2quiz', title: 'DALF C2 Mastery Test', icon: Brain, link: '/quizzes', duration: '4 weeks', xp: 600, isAssessment: true, topics: ['DALF C2 format', 'Native-level comprehension', 'Complex synthesis tasks'] },
    ]
  }
}

const GOAL_FOCUS = {
  travel: ['greetings', 'daily', 'travel', 'slang'],
  conversation: ['greetings', 'present1', 'past1', 'slang'],
  exam: ['a1quiz', 'a2quiz', 'b1quiz', 'b2quiz', 'c1quiz'],
  business: ['articles', 'conditional', 'business', 'writing'],
  culture: ['daily', 'culture', 'lit', 'rhetoric'],
  fun: [],
}

export default function LearningPath() {
  const { user } = useUser()
  const progress = useMemo(() => getProgress(), [])
  const currentLevel = user?.cefr_level || progress?.cefrLevel || 'A1'
  const currentGoal = user?.goal || progress?.goal || 'fun'
  const totalXp = progress?.xp || 0
  const focusIds = GOAL_FOCUS[currentGoal] || []

  const [selectedLevel, setSelectedLevel] = useState(currentLevel)
  const [expandedModule, setExpandedModule] = useState(null)

  const currentLevelIdx = CEFR_ORDER.indexOf(currentLevel)
  const selectedLevelIdx = CEFR_ORDER.indexOf(selectedLevel)

  const levelStatus = (lvl) => {
    const idx = CEFR_ORDER.indexOf(lvl)
    if (idx < currentLevelIdx) return 'completed'
    if (idx === currentLevelIdx) return 'active'
    return 'locked'
  }

  return (
    <>
      <SEO
        title="My French Learning Path | SayBonjour!"
        description="Your personalised French learning roadmap. Track completed lessons, see what's next, and advance through A1 to C2 with a structured progression tailored to your level."
        url="/learning-path"
        noindex
      />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-burgundy-100 dark:bg-burgundy-900/30 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-burgundy-600 dark:text-burgundy-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-cream-50" style={{ fontFamily: 'Playfair Display, serif' }}>
                Your Learning Path
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Personalised for your level and goal</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-dark-warm-100 rounded-2xl p-4 shadow-sm text-center">
            <div className="text-3xl font-black mb-1" style={{ color: CEFR_COLORS[currentLevel] }}>{currentLevel}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Current Level</div>
          </div>
          <div className="bg-white dark:bg-dark-warm-100 rounded-2xl p-4 shadow-sm text-center">
            <div className="text-2xl font-bold text-burgundy-600 dark:text-burgundy-400 mb-1">{totalXp.toLocaleString()}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total XP Earned</div>
          </div>
          <div className="bg-white dark:bg-dark-warm-100 rounded-2xl p-4 shadow-sm text-center">
            <div className="text-2xl font-bold text-gray-800 dark:text-cream-50 mb-1 capitalize">
              {currentGoal.replace('_', ' ')}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Learning Goal</div>
          </div>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {CEFR_ORDER.map((lvl) => {
            const status = levelStatus(lvl)
            return (
              <button key={lvl} onClick={() => setSelectedLevel(lvl)}
                className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl min-w-16 transition-all border-2 ${
                  selectedLevel === lvl ? 'border-burgundy-500 bg-burgundy-50 dark:bg-burgundy-900/20' : 'border-transparent bg-white dark:bg-dark-warm-100 hover:border-gray-200'
                }`}>
                <span className="text-lg">{PATH_DATA[lvl].emoji}</span>
                <span className={`text-sm font-bold ${status === 'active' ? 'text-burgundy-700 dark:text-burgundy-400' : status === 'completed' ? 'text-green-600' : 'text-gray-400'}`}>{lvl}</span>
                {status === 'completed' && <CheckCircle className="w-3 h-3 text-green-500" />}
                {status === 'active' && <div className="w-1.5 h-1.5 rounded-full bg-burgundy-500 animate-pulse" />}
                {status === 'locked' && <Lock className="w-3 h-3 text-gray-400" />}
              </button>
            )
          })}
        </div>

        <div className="bg-white dark:bg-dark-warm-100 rounded-2xl p-5 shadow-sm mb-6">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">{PATH_DATA[selectedLevel].emoji}</span>
            <div>
              <div className="font-bold text-gray-900 dark:text-cream-50 flex items-center gap-2">
                {selectedLevel} — {PATH_DATA[selectedLevel].title}
                {levelStatus(selectedLevel) === 'active' && (
                  <span className="text-xs bg-burgundy-100 dark:bg-burgundy-900/30 text-burgundy-700 dark:text-burgundy-400 px-2 py-0.5 rounded-full font-medium">Your level</span>
                )}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{PATH_DATA[selectedLevel].description}</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {PATH_DATA[selectedLevel].modules.map((mod, idx) => {
            const isRecommended = focusIds.includes(mod.id)
            const Icon = mod.icon
            return (
              <motion.div key={mod.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}>
                <div className={`bg-white dark:bg-dark-warm-100 rounded-xl shadow-sm overflow-hidden border-l-4 ${
                  mod.isAssessment ? 'border-amber-400' : isRecommended ? 'border-burgundy-500' : 'border-transparent'
                }`}>
                  <button className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 dark:hover:bg-dark-warm-200 transition-colors"
                    onClick={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      mod.isAssessment ? 'bg-amber-100 dark:bg-amber-900/20' : 'bg-burgundy-100 dark:bg-burgundy-900/20'
                    }`}>
                      <Icon className={`w-5 h-5 ${mod.isAssessment ? 'text-amber-600' : 'text-burgundy-600 dark:text-burgundy-400'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-800 dark:text-cream-50 text-sm">{mod.title}</span>
                        {mod.isAssessment && <span className="text-xs bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full">Assessment</span>}
                        {isRecommended && <span className="text-xs bg-burgundy-100 dark:bg-burgundy-900/20 text-burgundy-700 dark:text-burgundy-400 px-2 py-0.5 rounded-full">⭐ Recommended</span>}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                        <span>~{mod.duration}</span>
                        <span>+{mod.xp} XP</span>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${expandedModule === mod.id ? 'rotate-90' : ''}`} />
                  </button>

                  {expandedModule === mod.id && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }}
                      className="border-t border-gray-100 dark:border-dark-warm-50 px-4 py-3">
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {mod.topics.map(topic => (
                          <span key={topic} className="text-xs bg-gray-100 dark:bg-dark-warm-200 text-gray-600 dark:text-gray-400 px-2.5 py-1 rounded-lg">{topic}</span>
                        ))}
                      </div>
                      <Link to={mod.link}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-burgundy-600 text-white text-sm rounded-xl font-medium hover:bg-burgundy-700 transition-colors">
                        Start module <ChevronRight className="w-4 h-4" />
                      </Link>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-8 p-4 bg-gradient-to-r from-burgundy-50 to-amber-50 dark:from-burgundy-900/20 dark:to-amber-900/20 rounded-2xl">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-amber-500 flex-shrink-0" />
            <div>
              <div className="font-semibold text-gray-800 dark:text-cream-50 text-sm">Ready to advance?</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Complete the {selectedLevel} assessment to unlock {CEFR_ORDER[selectedLevelIdx + 1] || 'mastery'} content.</div>
            </div>
            <Link to="/quizzes" className="ml-auto px-4 py-2 bg-burgundy-600 text-white text-sm rounded-xl font-medium hover:bg-burgundy-700 transition-colors whitespace-nowrap">
              Take quiz
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
