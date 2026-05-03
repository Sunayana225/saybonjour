import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Keyboard, Clock, RotateCcw, Trophy, Zap, ChevronDown, ChevronLeft, Menu, X, Volume2, Play } from 'lucide-react'
import { addXP } from '../utils/progress'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'

// ─── Data ──────────────────────────────────────────────────────────────────────
const WORD_BANKS = {
  'A1 Basics': {
    level: 'A1',
    emoji: '🌱',
    description: 'Essential everyday French words — greetings, colours, animals, and more.',
    words: [
      { fr: 'bonjour', en: 'hello' }, { fr: 'merci', en: 'thank you' },
      { fr: 'maison', en: 'house' }, { fr: 'chat', en: 'cat' },
      { fr: 'chien', en: 'dog' }, { fr: 'livre', en: 'book' },
      { fr: 'eau', en: 'water' }, { fr: 'pain', en: 'bread' },
      { fr: 'rouge', en: 'red' }, { fr: 'bleu', en: 'blue' },
      { fr: 'grand', en: 'big' }, { fr: 'petit', en: 'small' },
      { fr: 'oui', en: 'yes' }, { fr: 'non', en: 'no' },
      { fr: 'ami', en: 'friend' },
    ],
  },
  'Numbers': {
    level: 'A1',
    emoji: '🔢',
    description: 'French numbers from one to a hundred — essential for shopping, time, and more.',
    words: [
      { fr: 'un', en: 'one' }, { fr: 'deux', en: 'two' },
      { fr: 'trois', en: 'three' }, { fr: 'quatre', en: 'four' },
      { fr: 'cinq', en: 'five' }, { fr: 'six', en: 'six' },
      { fr: 'sept', en: 'seven' }, { fr: 'huit', en: 'eight' },
      { fr: 'neuf', en: 'nine' }, { fr: 'dix', en: 'ten' },
      { fr: 'vingt', en: 'twenty' }, { fr: 'cent', en: 'hundred' },
    ],
  },
  'A2 Phrases': {
    level: 'A2',
    emoji: '💬',
    description: 'Common conversational phrases for everyday situations in France.',
    words: [
      { fr: 'je comprends', en: 'i understand' }, { fr: 'il fait chaud', en: 'it is hot' },
      { fr: 'bon appétit', en: 'enjoy your meal' }, { fr: 'au revoir', en: 'goodbye' },
      { fr: 'bonne nuit', en: 'good night' }, { fr: 'avec plaisir', en: 'with pleasure' },
      { fr: 'bien sûr', en: 'of course' }, { fr: 'tout à fait', en: 'absolutely' },
      { fr: "s'il vous plaît", en: 'please' }, { fr: 'de rien', en: "you're welcome" },
      { fr: 'je suis désolé', en: 'i am sorry' }, { fr: 'à bientôt', en: 'see you soon' },
    ],
  },
  'B1 Vocabulary': {
    level: 'B1',
    emoji: '📚',
    description: 'Advanced vocabulary for upper-intermediate learners — nuanced and expressive words.',
    words: [
      { fr: 'bouleversé', en: 'devastated' }, { fr: 'épanouissement', en: 'blossoming' },
      { fr: 'néanmoins', en: 'nevertheless' }, { fr: 'désormais', en: 'from now on' },
      { fr: 'davantage', en: 'more / further' }, { fr: 'pourtant', en: 'however' },
      { fr: 'dorénavant', en: 'henceforth' }, { fr: 'vraisemblable', en: 'plausible' },
      { fr: 'se débrouiller', en: 'to manage / get by' }, { fr: 'quoique', en: 'although' },
      { fr: 'éblouissant', en: 'dazzling' }, { fr: 'bienveillant', en: 'benevolent' },
    ],
  },
}

const LEVEL_COLORS = {
  A1: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  A2: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  B1: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
}

const TIME_LIMIT = 60
const CORRECT_POINTS = 10
const SPEED_BONUS = 3

const normalize = (s) => s.toLowerCase().trim()
  .replace(/[àáâ]/g, 'a').replace(/[éèêë]/g, 'e')
  .replace(/[îï]/g, 'i').replace(/[ôö]/g, 'o')
  .replace(/[ùûü]/g, 'u').replace(/ç/g, 'c').replace(/['']/g, "'")

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5)

// ─── Typing game ───────────────────────────────────────────────────────────────
function TypingGame({ category, onExit }) {
  const bank = WORD_BANKS[category]
  const [gameState, setGameState] = useState('idle')
  const [words, setWords] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [incorrect, setIncorrect] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [streak, setStreak] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [highScores, setHighScores] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tr_scores')) || {} } catch { return {} }
  })
  const inputRef = useRef(null)
  const timerRef = useRef(null)

  const startGame = useCallback(() => {
    const shuffled = shuffle([...bank.words, ...bank.words]).slice(0, 20)
    setWords(shuffled)
    setCurrentIdx(0)
    setInput('')
    setScore(0)
    setCorrect(0)
    setIncorrect(0)
    setTimeLeft(TIME_LIMIT)
    setStreak(0)
    setFeedback(null)
    setGameState('playing')
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [category, bank])

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { clearInterval(timerRef.current); endGame(); return 0 }
          return t - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [gameState])

  const endGame = () => {
    setGameState('ended')
    addXP(Math.min(60, Math.floor(score / 5)), 'typing_race')
  }

  useEffect(() => {
    if (gameState === 'ended') {
      const hs = { ...highScores, [category]: Math.max(highScores[category] || 0, score) }
      setHighScores(hs)
      localStorage.setItem('tr_scores', JSON.stringify(hs))
    }
  }, [gameState])

  const submitAnswer = useCallback((val) => {
    const currentWord = words[currentIdx]
    if (!currentWord) return
    const isCorrect = normalize(val) === normalize(currentWord.en)
    if (isCorrect) {
      const newStreak = streak + 1
      const bonus = newStreak >= 3 ? SPEED_BONUS * newStreak : 0
      const pts = CORRECT_POINTS + bonus
      setScore(s => s + pts)
      setCorrect(c => c + 1)
      setStreak(newStreak)
      setFeedback({ type: 'correct', text: newStreak >= 3 ? `+${pts} 🔥 x${newStreak}` : `+${pts}` })
    } else {
      setIncorrect(c => c + 1)
      setStreak(0)
      setFeedback({ type: 'wrong', text: `✗ ${currentWord.en}` })
    }
    setTimeout(() => setFeedback(null), 700)
    setInput('')
    if (currentIdx + 1 >= words.length) { clearInterval(timerRef.current); endGame() }
    else setCurrentIdx(i => i + 1)
  }, [words, currentIdx, streak])

  const handleInput = (e) => {
    const val = e.target.value
    setInput(val)
    if (!words[currentIdx]) return
    if (normalize(val) === normalize(words[currentIdx].en)) submitAnswer(val)
    else if (val.endsWith(' ') || val.endsWith('\n')) submitAnswer(val.trim())
  }

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && input.trim()) {
      e.preventDefault()
      submitAnswer(input.trim())
    }
  }

  const currentWord = words[currentIdx]
  const accuracy = correct + incorrect > 0 ? Math.round((correct / (correct + incorrect)) * 100) : 0
  const timerPct = (timeLeft / TIME_LIMIT) * 100
  const timerColor = timeLeft > 20 ? 'bg-emerald-500' : timeLeft > 10 ? 'bg-amber-400' : 'bg-red-500'
  const bestScore = highScores[category] || 0

  if (gameState === 'idle') {
    return (
      <div>
        <button onClick={onExit} className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-burgundy-600 dark:hover:text-burgundy-400 mb-6 transition-colors">
          ← Back to word list
        </button>

        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${LEVEL_COLORS[bank.level]}`}>{bank.level}</span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-300">
            {bank.words.length} words · 60 s
          </span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{category}</h1>
        <p className="text-burgundy-600 dark:text-burgundy-400 font-semibold mb-5">Typing Race</p>

        {bestScore > 0 && (
          <div className="flex items-center gap-2 mb-5 text-sm font-bold text-amber-600 dark:text-amber-400">
            <Trophy className="w-4 h-4" /> Personal best: {bestScore} pts
          </div>
        )}

        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 rounded-xl p-4 mb-8">
          <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
            <strong>How to play:</strong> A French word appears — type its English translation and press{' '}
            <kbd className="bg-amber-100 dark:bg-amber-800 px-1.5 py-0.5 rounded text-xs font-mono">Space</kbd>
            {' '}or{' '}
            <kbd className="bg-amber-100 dark:bg-amber-800 px-1.5 py-0.5 rounded text-xs font-mono">Enter</kbd>
            {' '}to submit. Build a streak for bonus points!
          </p>
        </div>

        <button
          onClick={startGame}
          className="flex items-center gap-3 px-8 py-4 bg-burgundy-600 text-cream-50 rounded-2xl font-bold text-lg hover:bg-burgundy-700 transition-colors shadow-md"
        >
          <Keyboard className="w-5 h-5" /> Start Typing!
        </button>
      </div>
    )
  }

  if (gameState === 'playing' && currentWord) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
            <Clock className="w-4 h-4" /> {timeLeft}s
          </div>
          <div className="flex items-center gap-3 text-sm">
            {streak >= 3 && <span className="text-amber-600 font-bold">🔥 x{streak}</span>}
            <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> {score}
            </span>
          </div>
        </div>

        <div className="h-2 bg-gray-200 dark:bg-dark-warm-50 rounded-full mb-6 overflow-hidden">
          <motion.div className={`h-full rounded-full ${timerColor} transition-colors`} style={{ width: `${timerPct}%` }} />
        </div>

        <div className="text-center mb-6">
          <div className="text-xs text-gray-400 mb-1">{currentIdx + 1} / {words.length}</div>
          <div className="h-1.5 bg-gray-200 dark:bg-dark-warm-50 rounded-full overflow-hidden mb-6">
            <div className="h-full bg-burgundy-400 rounded-full transition-all" style={{ width: `${(currentIdx / words.length) * 100}%` }} />
          </div>
          <motion.div
            key={currentIdx}
            initial={{ scale: 0.85, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="text-5xl font-black text-burgundy-700 dark:text-burgundy-400 mb-3"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {currentWord.fr}
          </motion.div>
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ scale: 0.6, opacity: 0, y: -8 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className={`text-lg font-bold mb-2 ${feedback.type === 'correct' ? 'text-emerald-500' : 'text-red-500'}`}
              >
                {feedback.text}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <input
          ref={inputRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Type English translation…"
          autoComplete="off" autoCorrect="off" spellCheck={false}
          className="w-full px-5 py-4 text-center text-lg border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-dark-warm-100 text-gray-800 dark:text-cream-50 focus:outline-none focus:border-burgundy-400 transition-colors"
        />
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">Press Space or Enter to submit</p>

        <div className="flex justify-center gap-10 mt-6 text-sm">
          <div className="text-center"><div className="font-bold text-emerald-600 text-lg">{correct}</div><div className="text-gray-400">Correct</div></div>
          <div className="text-center"><div className="font-bold text-red-500 text-lg">{incorrect}</div><div className="text-gray-400">Wrong</div></div>
          <div className="text-center"><div className="font-bold text-amber-600 text-lg">{accuracy}%</div><div className="text-gray-400">Accuracy</div></div>
        </div>
      </motion.div>
    )
  }

  if (gameState === 'ended') {
    return (
      <motion.div className="text-center py-8" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <div className="text-5xl mb-4">{accuracy >= 80 ? '🏆' : accuracy >= 60 ? '⭐' : '💪'}</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Race Complete!</h2>
        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto mb-6">
          {[
            { label: 'Score', value: score, icon: '⚡' },
            { label: 'Accuracy', value: `${accuracy}%`, icon: '🎯' },
            { label: 'Correct', value: correct, icon: '✅' },
            { label: 'XP Earned', value: `+${Math.min(60, Math.floor(score / 5))}`, icon: '🌟' },
          ].map(s => (
            <div key={s.label} className="bg-white dark:bg-dark-warm-100 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-xl font-black text-burgundy-700 dark:text-burgundy-400">{s.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>
        {highScores[category] === score && score > 0 && (
          <div className="mb-5 text-amber-600 dark:text-amber-400 font-bold flex items-center justify-center gap-2">
            <Trophy className="w-5 h-5" /> New personal best!
          </div>
        )}
        <div className="flex gap-3 justify-center">
          <button onClick={startGame} className="px-6 py-3 bg-burgundy-600 text-cream-50 rounded-xl font-semibold hover:bg-burgundy-700 transition-colors flex items-center gap-2">
            <RotateCcw className="w-4 h-4" /> Play Again
          </button>
          <button onClick={onExit} className="px-6 py-3 bg-gray-100 dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-dark-warm-200 transition-colors">
            Word List
          </button>
        </div>
      </motion.div>
    )
  }

  return null
}

// ─── Word detail panel ─────────────────────────────────────────────────────────
function WordDetail({ word, setName, onStartRace }) {
  const bank = WORD_BANKS[setName]
  return (
    <article>
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${LEVEL_COLORS[bank.level]}`}>{bank.level}</span>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-300">{setName}</span>
      </div>

      <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1
            className="text-4xl font-black text-burgundy-700 dark:text-burgundy-400 leading-tight"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {word.fr}
          </h1>
          <SpeakButton text={word.fr} size="lg" variant="default" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider mb-1">English</p>
        <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{word.en}</p>
      </div>

      <div className="bg-gray-50 dark:bg-dark-warm-200 rounded-xl p-4 mb-8 border border-gray-100 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 font-medium">Other words in this set</p>
        <div className="flex flex-wrap gap-2">
          {bank.words
            .filter(w => w.fr !== word.fr)
            .slice(0, 8)
            .map((w, i) => (
              <span key={i} className="text-xs px-2.5 py-1 bg-white dark:bg-dark-warm-100 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300">
                {w.fr}
              </span>
            ))}
          {bank.words.length - 1 > 8 && (
            <span className="text-xs px-2.5 py-1 text-gray-400">+{bank.words.length - 9} more</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onStartRace}
          className="flex items-center gap-2.5 px-6 py-3 bg-burgundy-600 text-cream-50 rounded-xl font-semibold hover:bg-burgundy-700 transition-colors"
        >
          <Keyboard className="w-4 h-4" /> Race with "{setName}"
        </button>
      </div>
    </article>
  )
}

// ─── Welcome screen ────────────────────────────────────────────────────────────
function Welcome() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4 py-16">
      <div className="text-6xl mb-6">⌨️</div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Typing Race</h1>
      <p className="text-burgundy-600 dark:text-burgundy-400 font-semibold mb-4">Course de frappe</p>
      <p className="text-gray-600 dark:text-gray-300 max-w-md leading-relaxed">
        Browse every word set in the sidebar. Click any word to study it, or click a set name to race against the clock.
      </p>
      <p className="text-sm text-gray-400 dark:text-gray-500 mt-8 flex items-center gap-2">
        <span>←</span> Pick a word from the sidebar to begin
      </p>
    </div>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function TypingRace() {
  // view: { type: 'welcome' } | { type: 'word', setName, word } | { type: 'game', setName }
  const [view, setView] = useState({ type: 'welcome' })
  const [openSections, setOpenSections] = useState(
    Object.fromEntries(Object.keys(WORD_BANKS).map(k => [k, true]))
  )
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSection = (key) =>
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }))

  const selectWord = (setName, word) => {
    setView({ type: 'word', setName, word })
    setSidebarOpen(false)
  }

  const startRace = (setName) => {
    setView({ type: 'game', setName })
    setSidebarOpen(false)
  }

  const isActive = (setName, wordFr) =>
    view.type === 'word' && view.setName === setName && view.word.fr === wordFr

  const activeSetName = view.type === 'word' ? view.setName : view.type === 'game' ? view.setName : null

  return (
    <>
      <SEO
        title="French Typing Race — Improve Your French Typing Speed | SayBonjour!"
        description="Race the clock typing French words and sentences. Build your French typing speed, accuracy, and spelling all at once."
        keywords="french typing game, type french words, french keyboard practice, french spelling game, learn french typing"
        url="/typing-race"
      />

      <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300 flex relative">

        {/* Mobile overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-30 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* ── Sidebar ── */}
        <aside className={`fixed lg:sticky top-0 lg:top-20 left-0 h-screen lg:h-[calc(100vh-5rem)] w-60 bg-white dark:bg-dark-warm-100 border-r border-gray-200 dark:border-gray-700 overflow-y-auto z-40 lg:z-auto transition-transform duration-300 flex-shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>

          {/* Mobile close */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 dark:border-gray-700 lg:hidden">
            <span className="font-bold text-gray-900 dark:text-white text-sm">Word Sets</span>
            <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-warm-200">
              <X size={16} />
            </button>
          </div>

          <nav className="p-3 pt-4">
            {Object.entries(WORD_BANKS).map(([setName, bank]) => (
              <div key={setName} className="mb-1">

                {/* Section header — click to collapse/expand, race button on right */}
                <div className={`flex items-center rounded-lg transition-colors ${activeSetName === setName ? 'bg-burgundy-50 dark:bg-burgundy-900/20' : 'hover:bg-gray-50 dark:hover:bg-dark-warm-200'}`}>
                  <button
                    onClick={() => toggleSection(setName)}
                    className="flex-1 flex items-center gap-2 px-3 py-2.5 text-left min-w-0"
                  >
                    <span className="text-base flex-shrink-0">{bank.emoji}</span>
                    <span className={`text-[13px] font-bold truncate ${activeSetName === setName ? 'text-burgundy-700 dark:text-burgundy-300' : 'text-gray-800 dark:text-gray-200'}`}>
                      {setName}
                    </span>
                    <span className={`text-xs flex-shrink-0 px-1.5 py-0.5 rounded font-bold ml-auto ${LEVEL_COLORS[bank.level]}`}>{bank.level}</span>
                  </button>
                  <div className="flex items-center pr-2 gap-0.5">
                    <button
                      onClick={() => startRace(setName)}
                      title="Start race"
                      className="p-1.5 rounded-md text-gray-400 hover:text-burgundy-600 dark:hover:text-burgundy-400 hover:bg-burgundy-50 dark:hover:bg-burgundy-900/30 transition-colors"
                    >
                      <Play size={11} />
                    </button>
                    <button
                      onClick={() => toggleSection(setName)}
                      className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-warm-200 transition-colors"
                    >
                      <ChevronDown size={13} className={`transition-transform duration-200 ${openSections[setName] ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Word list */}
                <AnimatePresence initial={false}>
                  {openSections[setName] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-2 mt-0.5 space-y-0.5 pb-2">
                        {bank.words.map((word, i) => (
                          <button
                            key={i}
                            onClick={() => selectWord(setName, word)}
                            className={`w-full text-left px-3 py-1.5 rounded-lg text-[13px] transition-colors flex items-center justify-between gap-2 group ${
                              isActive(setName, word.fr)
                                ? 'bg-burgundy-50 dark:bg-burgundy-900/30 text-burgundy-700 dark:text-burgundy-300 font-semibold'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-warm-200 hover:text-gray-900 dark:hover:text-gray-100'
                            }`}
                          >
                            <span className="truncate">{word.fr}</span>
                            <span className={`text-[11px] flex-shrink-0 truncate max-w-[60px] ${isActive(setName, word.fr) ? 'text-burgundy-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500'}`}>
                              {word.en}
                            </span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0">
          {/* Mobile breadcrumb */}
          <div className="lg:hidden sticky top-20 z-20 bg-white dark:bg-dark-warm-100 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-burgundy-600 dark:hover:text-burgundy-400 flex-shrink-0"
            >
              <Menu size={17} />
              <span>Words</span>
            </button>
            {view.type !== 'welcome' && (
              <>
                <span className="text-gray-300 dark:text-gray-600 flex-shrink-0">/</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {view.type === 'word' ? view.word.fr : view.setName}
                </span>
              </>
            )}
          </div>

          <div className="px-6 py-10 lg:px-12 lg:py-10 max-w-2xl">
            <div className="hidden lg:block mb-2">
              <Link to="/games" className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-burgundy-600 dark:hover:text-burgundy-400 transition-colors group">
                <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" /> Games Hub
              </Link>
            </div>
            <AnimatePresence mode="wait">
              {view.type === 'welcome' && (
                <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Welcome />
                </motion.div>
              )}

              {view.type === 'word' && (
                <motion.div
                  key={`${view.setName}-${view.word.fr}`}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <WordDetail
                    word={view.word}
                    setName={view.setName}
                    onStartRace={() => startRace(view.setName)}
                  />
                </motion.div>
              )}

              {view.type === 'game' && (
                <motion.div
                  key={`game-${view.setName}`}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <TypingGame
                    category={view.setName}
                    onExit={() => setView({ type: 'welcome' })}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </>
  )
}
