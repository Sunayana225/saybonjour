import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Keyboard, Clock, RotateCcw, Trophy, Zap, Target } from 'lucide-react'
import { addXP } from '../utils/progress'
import SEO from '../components/SEO'

const WORD_BANKS = {
  'A1 Basics': [
    { fr: 'bonjour', en: 'hello' }, { fr: 'merci', en: 'thank you' }, { fr: 'maison', en: 'house' },
    { fr: 'chat', en: 'cat' }, { fr: 'chien', en: 'dog' }, { fr: 'livre', en: 'book' },
    { fr: 'eau', en: 'water' }, { fr: 'pain', en: 'bread' }, { fr: 'rouge', en: 'red' },
    { fr: 'bleu', en: 'blue' }, { fr: 'grand', en: 'big' }, { fr: 'petit', en: 'small' },
    { fr: 'oui', en: 'yes' }, { fr: 'non', en: 'no' }, { fr: 'ami', en: 'friend' },
  ],
  'A2 Phrases': [
    { fr: 'je comprends', en: 'i understand' }, { fr: 'il fait chaud', en: 'it is hot' },
    { fr: 'bon appétit', en: 'enjoy your meal' }, { fr: 'au revoir', en: 'goodbye' },
    { fr: 'bonne nuit', en: 'good night' }, { fr: 'avec plaisir', en: 'with pleasure' },
    { fr: 'bien sûr', en: 'of course' }, { fr: 'tout à fait', en: 'absolutely' },
    { fr: 's\'il vous plaît', en: 'please' }, { fr: 'de rien', en: 'you\'re welcome' },
    { fr: 'je suis désolé', en: 'i am sorry' }, { fr: 'à bientôt', en: 'see you soon' },
  ],
  'B1 Vocabulary': [
    { fr: 'bouleversé', en: 'devastated' }, { fr: 'épanouissement', en: 'blossoming' },
    { fr: 'néanmoins', en: 'nevertheless' }, { fr: 'désormais', en: 'from now on' },
    { fr: 'davantage', en: 'more / further' }, { fr: 'pourtant', en: 'however' },
    { fr: 'dorénavant', en: 'henceforth' }, { fr: 'vraisemblable', en: 'plausible' },
    { fr: 'se débrouiller', en: 'to manage / get by' }, { fr: 'quoique', en: 'although' },
    { fr: 'éblouissant', en: 'dazzling' }, { fr: 'bienveillant', en: 'benevolent' },
  ],
  'Numbers': [
    { fr: 'un', en: 'one' }, { fr: 'deux', en: 'two' }, { fr: 'trois', en: 'three' },
    { fr: 'quatre', en: 'four' }, { fr: 'cinq', en: 'five' }, { fr: 'six', en: 'six' },
    { fr: 'sept', en: 'seven' }, { fr: 'huit', en: 'eight' }, { fr: 'neuf', en: 'nine' },
    { fr: 'dix', en: 'ten' }, { fr: 'vingt', en: 'twenty' }, { fr: 'cent', en: 'hundred' },
  ],
}

const TIME_LIMIT = 60
const CORRECT_POINTS = 10
const SPEED_BONUS = 3

const normalize = (s) => s.toLowerCase().trim().replace(/[àáâ]/g, 'a').replace(/[éèêë]/g, 'e').replace(/[îï]/g, 'i').replace(/[ôö]/g, 'o').replace(/[ùûü]/g, 'u').replace(/ç/g, 'c').replace(/['']/g, "'")

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5)

export default function TypingRace() {
  const [category, setCategory] = useState('A1 Basics')
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
  const [highScores, setHighScores] = useState(() => { try { return JSON.parse(localStorage.getItem('tr_scores')) || {} } catch { return {} } })
  const inputRef = useRef(null)
  const timerRef = useRef(null)

  const startGame = useCallback(() => {
    const bank = WORD_BANKS[category]
    const shuffled = shuffle([...bank, ...bank]).slice(0, 20)
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
  }, [category])

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
    const xpEarned = Math.min(60, Math.floor(score / 5))
    addXP(xpEarned, 'typing_race')
  }

  const currentWord = words[currentIdx]

  const handleInput = (e) => {
    const val = e.target.value
    setInput(val)

    if (!currentWord) return

    if (normalize(val) === normalize(currentWord.en)) {
      const newStreak = streak + 1
      const bonus = newStreak >= 3 ? SPEED_BONUS * newStreak : 0
      const points = CORRECT_POINTS + bonus
      setScore(s => s + points)
      setCorrect(c => c + 1)
      setStreak(newStreak)
      setFeedback({ type: 'correct', text: newStreak >= 3 ? `+${points} 🔥 x${newStreak}` : `+${points}` })
      setTimeout(() => setFeedback(null), 600)
      setInput('')
      if (currentIdx + 1 >= words.length) {
        clearInterval(timerRef.current)
        endGame()
      } else {
        setCurrentIdx(i => i + 1)
      }
    } else if (val.endsWith(' ') || val.endsWith('\n')) {
      setIncorrect(c => c + 1)
      setStreak(0)
      setFeedback({ type: 'wrong', text: `✗ ${currentWord.en}` })
      setTimeout(() => setFeedback(null), 800)
      setInput('')
      if (currentIdx + 1 >= words.length) { clearInterval(timerRef.current); endGame() }
      else setCurrentIdx(i => i + 1)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (!currentWord) return
      if (normalize(input) === normalize(currentWord.en)) {
        const newStreak = streak + 1
        const bonus = newStreak >= 3 ? SPEED_BONUS * newStreak : 0
        const points = CORRECT_POINTS + bonus
        setScore(s => s + points)
        setCorrect(c => c + 1)
        setStreak(newStreak)
        setFeedback({ type: 'correct', text: newStreak >= 3 ? `+${points} 🔥` : `+${points}` })
        setTimeout(() => setFeedback(null), 600)
      } else {
        setIncorrect(c => c + 1)
        setStreak(0)
        setFeedback({ type: 'wrong', text: `✗ ${currentWord.en}` })
        setTimeout(() => setFeedback(null), 800)
      }
      setInput('')
      if (currentIdx + 1 >= words.length) { clearInterval(timerRef.current); endGame() }
      else setCurrentIdx(i => i + 1)
    }
  }

  useEffect(() => {
    if (gameState === 'ended') {
      const hs = { ...highScores, [category]: Math.max(highScores[category] || 0, score) }
      setHighScores(hs)
      localStorage.setItem('tr_scores', JSON.stringify(hs))
    }
  }, [gameState])

  const accuracy = correct + incorrect > 0 ? Math.round((correct / (correct + incorrect)) * 100) : 0
  const timerPct = (timeLeft / TIME_LIMIT) * 100
  const timerColor = timeLeft > 20 ? 'bg-emerald-500' : timeLeft > 10 ? 'bg-amber-400' : 'bg-red-500'

  return (
    <>
      <SEO
        title="French Typing Race — Improve Your French Typing Speed | SayBonjour!"
        description="Race the clock typing French words and sentences. Build your French typing speed, accuracy, and spelling all at once. A fun way to reinforce vocabulary through repetition."
        keywords="french typing game, type french words, french keyboard practice, french spelling game, learn french typing, french typing speed test"
        url="/typing-race"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-dark-warm-300">
        <div className="bg-gradient-to-r from-burgundy-800 to-burgundy-600 text-cream-50 py-10 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center bg-cream-50/20 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                <Keyboard className="w-4 h-4 mr-2" /> Mini Game
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Typing Race
              </h1>
              <p className="text-cream-100">See a French word — type its English translation as fast as you can!</p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-8">
          {gameState === 'idle' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Choose a word set</h2>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {Object.keys(WORD_BANKS).map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)}
                    className={`py-3 px-4 rounded-xl text-sm font-medium border-2 transition-all text-left ${category === cat ? 'bg-burgundy-600 text-cream-50 border-burgundy-600 shadow-md' : 'bg-white dark:bg-dark-warm-100 text-gray-700 dark:text-gray-300 border-cream-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
                    {cat}
                    {highScores[cat] && <div className="text-xs opacity-70 mt-0.5">Best: {highScores[cat]} pts</div>}
                  </button>
                ))}
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4 mb-5 text-sm text-amber-800 dark:text-amber-300">
                <strong>How to play:</strong> A French word appears — type its English translation and press <kbd className="bg-amber-100 dark:bg-amber-800 px-1.5 py-0.5 rounded text-xs font-mono">Space</kbd> or <kbd className="bg-amber-100 dark:bg-amber-800 px-1.5 py-0.5 rounded text-xs font-mono">Enter</kbd> to submit. Build a streak for bonus points!
              </div>
              <button onClick={startGame}
                className="w-full py-4 bg-burgundy-600 text-cream-50 rounded-2xl font-bold text-lg hover:bg-burgundy-700 transition-colors shadow-lg flex items-center justify-center gap-3">
                <Keyboard className="w-5 h-5" /> Start Typing!
              </button>
            </motion.div>
          )}

          {gameState === 'playing' && currentWord && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                  <Clock className="w-4 h-4" /> {timeLeft}s
                </div>
                <div className="flex items-center gap-3 text-sm">
                  {streak >= 3 && <span className="text-amber-600 font-bold">🔥 x{streak}</span>}
                  <span className="font-bold text-amber-600"><Zap className="w-3.5 h-3.5 inline" /> {score}</span>
                </div>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-dark-warm-50 rounded-full mb-6 overflow-hidden">
                <motion.div className={`h-full rounded-full ${timerColor} transition-colors`} style={{ width: `${timerPct}%` }} />
              </div>

              <div className="text-center mb-6">
                <div className="text-xs text-gray-400 mb-1">{currentIdx + 1} / {words.length}</div>
                <div className="h-1.5 bg-gray-200 dark:bg-dark-warm-50 rounded-full overflow-hidden mb-6">
                  <div className="h-full bg-burgundy-400 rounded-full transition-all" style={{ width: `${((currentIdx) / words.length) * 100}%` }} />
                </div>
                <motion.div
                  key={currentIdx}
                  initial={{ scale: 0.8, opacity: 0, y: -10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  className="text-5xl font-black text-burgundy-700 dark:text-burgundy-400 mb-2"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {currentWord.fr}
                </motion.div>

                <AnimatePresence>
                  {feedback && (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0, y: -10 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`text-lg font-bold mb-2 ${feedback.type === 'correct' ? 'text-emerald-600' : 'text-red-500'}`}
                    >
                      {feedback.text}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  placeholder="Type English translation…"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  className="w-full px-5 py-4 text-center text-lg border-2 border-cream-300 dark:border-dark-warm-50 rounded-2xl bg-white dark:bg-dark-warm-100 text-gray-800 dark:text-cream-50 focus:outline-none focus:border-burgundy-400 dark:focus:border-burgundy-500 transition-colors"
                />
                <div className="text-center text-xs text-gray-400 mt-2">Press Space or Enter to submit</div>
              </div>

              <div className="flex justify-center gap-8 mt-6 text-sm">
                <div className="text-center"><div className="font-bold text-emerald-600 text-lg">{correct}</div><div className="text-gray-400">Correct</div></div>
                <div className="text-center"><div className="font-bold text-red-500 text-lg">{incorrect}</div><div className="text-gray-400">Wrong</div></div>
                <div className="text-center"><div className="font-bold text-amber-600 text-lg">{accuracy}%</div><div className="text-gray-400">Accuracy</div></div>
              </div>
            </motion.div>
          )}

          {gameState === 'ended' && (
            <motion.div className="text-center py-8" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div className="text-5xl mb-4">{accuracy >= 80 ? '🏆' : accuracy >= 60 ? '⭐' : '💪'}</div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-cream-50 mb-5">Race Complete!</h2>
              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto mb-6">
                {[
                  { label: 'Score', value: score, icon: '⚡' },
                  { label: 'Accuracy', value: `${accuracy}%`, icon: '🎯' },
                  { label: 'Correct', value: correct, icon: '✅' },
                  { label: 'XP Earned', value: `+${Math.min(60, Math.floor(score / 5))}`, icon: '🌟' },
                ].map(s => (
                  <div key={s.label} className="bg-white dark:bg-dark-warm-100 rounded-2xl border border-cream-200 dark:border-dark-warm-50 p-4 shadow-sm">
                    <div className="text-2xl mb-1">{s.icon}</div>
                    <div className="text-xl font-black text-burgundy-700 dark:text-burgundy-400">{s.value}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{s.label}</div>
                  </div>
                ))}
              </div>
              {highScores[category] === score && score > 0 && (
                <div className="mb-4 text-amber-600 font-bold flex items-center justify-center gap-2">
                  <Trophy className="w-5 h-5" /> New personal best!
                </div>
              )}
              <div className="flex gap-3 justify-center">
                <button onClick={startGame} className="px-6 py-3 bg-burgundy-600 text-cream-50 rounded-xl font-semibold hover:bg-burgundy-700 transition-colors flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" /> Play Again
                </button>
                <button onClick={() => setGameState('idle')} className="px-6 py-3 bg-gray-100 dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-dark-warm-200 transition-colors">
                  Change Set
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  )
}
