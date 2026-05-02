import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plane, Hotel, Utensils, MapPin, ShoppingBag, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronUp, Star, BookOpen, MessageCircle } from 'lucide-react'
import { addXP } from '../utils/progress'
import { travelVocab, travelPhrases, travelScenarios, travelQuiz } from '../data/travelData'

const TABS = ['Vocabulary', 'Phrases', 'Scenarios', 'Quiz']

const CATEGORY_ICONS = {
  Airport: Plane,
  Hotel: Hotel,
  Restaurant: Utensils,
  Transport: MapPin,
  Emergency: AlertTriangle,
}

const CATEGORY_COLORS = {
  Airport: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  Hotel: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  Restaurant: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  Transport: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  Emergency: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
}

const LEVEL_COLORS = {
  A1: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  A2: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
}

export default function TravelFrench() {
  const [activeTab, setActiveTab] = useState('Vocabulary')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [flipped, setFlipped] = useState({})
  const [expandedScenario, setExpandedScenario] = useState(null)
  const [quizState, setQuizState] = useState({ current: 0, selected: null, answered: false, score: 0, done: false })
  const [xpAwarded, setXpAwarded] = useState(false)

  const categories = ['All', ...new Set(travelVocab.map(v => v.category))]
  const filteredVocab = selectedCategory === 'All' ? travelVocab : travelVocab.filter(v => v.category === selectedCategory)

  const toggleFlip = (id) => setFlipped(p => ({ ...p, [id]: !p[id] }))

  const handleAnswer = (idx) => {
    if (quizState.answered) return
    const correct = idx === travelQuiz[quizState.current].answer
    setQuizState(p => ({ ...p, selected: idx, answered: true, score: correct ? p.score + 1 : p.score }))
  }

  const nextQuestion = () => {
    const next = quizState.current + 1
    if (next >= travelQuiz.length) {
      setQuizState(p => ({ ...p, done: true }))
      if (!xpAwarded) {
        const earned = quizState.score + (quizState.selected === travelQuiz[quizState.current].answer ? 1 : 0)
        const result = addXP(earned * 15, 'travel_quiz')
        setXpAwarded(true)
      }
    } else {
      setQuizState(p => ({ ...p, current: next, selected: null, answered: false }))
    }
  }

  const resetQuiz = () => setQuizState({ current: 0, selected: null, answered: false, score: 0, done: false })

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300 py-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-5xl">✈️</span>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Travel French</h1>
              <p className="text-burgundy-600 font-medium">Le français pour voyager</p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            Essential vocabulary, phrases, and real-world scenarios so you can explore France (and the French-speaking world) with confidence.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-burgundy-600 text-white shadow-md'
                  : 'bg-white dark:bg-dark-warm-100 text-gray-700 dark:text-gray-300 hover:bg-burgundy-50 dark:hover:bg-dark-warm-200 border border-gray-200 dark:border-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* VOCABULARY TAB */}
          {activeTab === 'Vocabulary' && (
            <motion.div key="vocab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map(cat => {
                  const Icon = CATEGORY_ICONS[cat]
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                        selectedCategory === cat
                          ? 'bg-burgundy-600 text-white'
                          : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-burgundy-400'
                      }`}
                    >
                      {Icon && <Icon size={13} />}
                      {cat}
                    </button>
                  )
                })}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filteredVocab.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    onClick={() => toggleFlip(item.id)}
                    className="cursor-pointer bg-white dark:bg-dark-warm-100 border border-gray-200 dark:border-gray-600 rounded-xl p-4 hover:shadow-md hover:border-burgundy-400 dark:hover:border-burgundy-500 transition-all select-none"
                  >
                    <div className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full mb-2 ${CATEGORY_COLORS[item.category]}`}>
                      {item.category}
                    </div>
                    <AnimatePresence mode="wait">
                      {flipped[item.id] ? (
                        <motion.div key="en" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{item.en}</p>
                          <p className="text-xs text-gray-400 mt-1">tap for French</p>
                        </motion.div>
                      ) : (
                        <motion.div key="fr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <p className="font-semibold text-gray-900 dark:text-white text-base leading-tight">{item.fr}</p>
                          <p className="text-xs text-gray-400 mt-1">tap for English</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">{filteredVocab.length} words — tap a card to reveal the translation</p>
            </motion.div>
          )}

          {/* PHRASES TAB */}
          {activeTab === 'Phrases' && (
            <motion.div key="phrases" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="space-y-6">
                {travelPhrases.map((section, si) => (
                  <div key={si} className="bg-white dark:bg-dark-warm-100 border border-gray-200 dark:border-gray-600 rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 bg-burgundy-50 dark:bg-burgundy-900/20 border-b border-gray-200 dark:border-gray-600 flex items-center gap-3">
                      <span className="text-2xl">{section.emoji}</span>
                      <h3 className="font-bold text-gray-900 dark:text-white">{section.category}</h3>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                      {section.phrases.map((ph, pi) => (
                        <div key={pi} className="px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                          <p className="font-medium text-gray-900 dark:text-white">{ph.fr}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-right">{ph.en}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* SCENARIOS TAB */}
          {activeTab === 'Scenarios' && (
            <motion.div key="scenarios" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Real conversations in typical travel situations. Click a scenario to read the dialogue.</p>
              <div className="space-y-4">
                {travelScenarios.map((sc) => (
                  <div key={sc.id} className="bg-white dark:bg-dark-warm-100 border border-gray-200 dark:border-gray-600 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setExpandedScenario(expandedScenario === sc.id ? null : sc.id)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-dark-warm-200 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{sc.emoji}</span>
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-900 dark:text-white">{sc.title}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${LEVEL_COLORS[sc.level]}`}>{sc.level}</span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{sc.titleFr}</p>
                        </div>
                      </div>
                      {expandedScenario === sc.id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                    </button>
                    <AnimatePresence>
                      {expandedScenario === sc.id && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="px-6 pb-6 border-t border-gray-100 dark:border-gray-700 pt-4">
                            <div className="space-y-3 mb-5">
                              {sc.dialogue.map((line, li) => (
                                <div key={li} className={`flex gap-3 ${line.speaker === 'Vous' ? 'flex-row-reverse' : ''}`}>
                                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                    line.speaker === 'Vous'
                                      ? 'bg-burgundy-600 text-white'
                                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                  }`}>
                                    {line.speaker === 'Vous' ? 'V' : line.speaker[0]}
                                  </div>
                                  <div className={`max-w-xs ${line.speaker === 'Vous' ? 'text-right' : ''}`}>
                                    <p className="text-xs text-gray-400 mb-0.5">{line.speaker}</p>
                                    <div className={`inline-block px-3 py-2 rounded-xl text-sm ${
                                      line.speaker === 'Vous'
                                        ? 'bg-burgundy-600 text-white'
                                        : 'bg-gray-100 dark:bg-dark-warm-200 text-gray-800 dark:text-gray-200'
                                    }`}>
                                      {line.text}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 rounded-xl p-4 mb-4">
                              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-2 flex items-center gap-1"><BookOpen size={12} /> Key Vocabulary</p>
                              <div className="flex flex-wrap gap-2">
                                {sc.vocab.map((v, vi) => (
                                  <span key={vi} className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-2 py-1 rounded-lg">{v}</span>
                                ))}
                              </div>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/40 rounded-xl p-4">
                              <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide mb-1 flex items-center gap-1"><Star size={12} /> Cultural Tip</p>
                              <p className="text-sm text-blue-800 dark:text-blue-300">{sc.tip}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* QUIZ TAB */}
          {activeTab === 'Quiz' && (
            <motion.div key="quiz" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="max-w-2xl mx-auto">
                {quizState.done ? (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-dark-warm-100 border border-gray-200 dark:border-gray-600 rounded-2xl p-8 text-center">
                    <div className="text-6xl mb-4">{quizState.score >= 5 ? '🎉' : quizState.score >= 3 ? '👍' : '📚'}</div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Quiz Complete!</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-1">You scored <span className="font-bold text-burgundy-600">{quizState.score} / {travelQuiz.length}</span></p>
                    <p className="text-sm text-green-600 dark:text-green-400 mb-6">+{quizState.score * 15} XP earned</p>
                    <button onClick={resetQuiz} className="bg-burgundy-600 hover:bg-burgundy-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors">Try Again</button>
                  </motion.div>
                ) : (
                  <div className="bg-white dark:bg-dark-warm-100 border border-gray-200 dark:border-gray-600 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Question {quizState.current + 1} of {travelQuiz.length}</span>
                      <span className="text-sm font-medium text-burgundy-600">Score: {quizState.score}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-6">
                      <div className="bg-burgundy-600 h-1.5 rounded-full transition-all" style={{ width: `${((quizState.current) / travelQuiz.length) * 100}%` }} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">{travelQuiz[quizState.current].q}</h3>
                    <div className="space-y-3 mb-6">
                      {travelQuiz[quizState.current].options.map((opt, idx) => {
                        const isCorrect = idx === travelQuiz[quizState.current].answer
                        const isSelected = idx === quizState.selected
                        let cls = 'border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:border-burgundy-400 hover:bg-burgundy-50 dark:hover:bg-burgundy-900/20'
                        if (quizState.answered) {
                          if (isCorrect) cls = 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                          else if (isSelected) cls = 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                        }
                        return (
                          <button
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            disabled={quizState.answered}
                            className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all font-medium ${cls} disabled:cursor-default`}
                          >
                            <span className="mr-3 text-sm opacity-60">{String.fromCharCode(65 + idx)}.</span>
                            {opt}
                            {quizState.answered && isCorrect && <CheckCircle size={16} className="inline ml-2 text-green-500" />}
                            {quizState.answered && isSelected && !isCorrect && <XCircle size={16} className="inline ml-2 text-red-500" />}
                          </button>
                        )
                      })}
                    </div>
                    {quizState.answered && (
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/40 rounded-xl p-4 mb-4">
                        <p className="text-sm text-blue-800 dark:text-blue-300">{travelQuiz[quizState.current].explanation}</p>
                      </motion.div>
                    )}
                    {quizState.answered && (
                      <button onClick={nextQuestion} className="w-full bg-burgundy-600 hover:bg-burgundy-700 text-white py-3 rounded-xl font-medium transition-colors">
                        {quizState.current + 1 < travelQuiz.length ? 'Next Question →' : 'See Results'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
