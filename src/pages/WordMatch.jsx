import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Shuffle, Star, Clock, RotateCcw, Zap, Trophy, ChevronLeft } from 'lucide-react'
import { addXP } from '../utils/progress'
import SEO from '../components/SEO'

const WORD_SETS = {
  'Basics': [
    { fr: 'bonjour', en: 'hello' }, { fr: 'merci', en: 'thank you' },
    { fr: 'oui', en: 'yes' }, { fr: 'non', en: 'no' },
    { fr: 'maison', en: 'house' }, { fr: 'chat', en: 'cat' },
    { fr: 'chien', en: 'dog' }, { fr: 'livre', en: 'book' },
  ],
  'Numbers': [
    { fr: 'un', en: 'one' }, { fr: 'deux', en: 'two' },
    { fr: 'trois', en: 'three' }, { fr: 'quatre', en: 'four' },
    { fr: 'cinq', en: 'five' }, { fr: 'six', en: 'six' },
    { fr: 'sept', en: 'seven' }, { fr: 'huit', en: 'eight' },
  ],
  'Colors': [
    { fr: 'rouge', en: 'red' }, { fr: 'bleu', en: 'blue' },
    { fr: 'vert', en: 'green' }, { fr: 'jaune', en: 'yellow' },
    { fr: 'noir', en: 'black' }, { fr: 'blanc', en: 'white' },
    { fr: 'rose', en: 'pink' }, { fr: 'orange', en: 'orange' },
  ],
  'Body Parts': [
    { fr: 'la tête', en: 'head' }, { fr: 'les yeux', en: 'eyes' },
    { fr: 'le nez', en: 'nose' }, { fr: 'la bouche', en: 'mouth' },
    { fr: 'les mains', en: 'hands' }, { fr: 'les pieds', en: 'feet' },
    { fr: 'le cœur', en: 'heart' }, { fr: 'le bras', en: 'arm' },
  ],
  'Food': [
    { fr: 'pomme', en: 'apple' }, { fr: 'pain', en: 'bread' },
    { fr: 'eau', en: 'water' }, { fr: 'lait', en: 'milk' },
    { fr: 'fromage', en: 'cheese' }, { fr: 'viande', en: 'meat' },
    { fr: 'légumes', en: 'vegetables' }, { fr: 'poisson', en: 'fish' },
  ],
  'Advanced': [
    { fr: 'quoique', en: 'although' }, { fr: 'pourtant', en: 'however' },
    { fr: 'dorénavant', en: 'henceforth' }, { fr: 'vraisemblable', en: 'plausible' },
    { fr: 'bouleversé', en: 'shattered / upset' }, { fr: 'épanouissement', en: 'blossoming' },
    { fr: 'éblouissant', en: 'dazzling' }, { fr: 'débrouillard', en: 'resourceful' },
  ],
}

const GAME_SIZE = 6
const TIME_LIMIT = 60

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5)

const WordMatch = () => {
  const [category, setCategory] = useState('Basics')
  const [gameState, setGameState] = useState('idle')
  const [pairs, setPairs] = useState([])
  const [frWords, setFrWords] = useState([])
  const [enWords, setEnWords] = useState([])
  const [selectedFr, setSelectedFr] = useState(null)
  const [selectedEn, setSelectedEn] = useState(null)
  const [matched, setMatched] = useState([])
  const [wrong, setWrong] = useState([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [highScores, setHighScores] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wm_scores')) || {} } catch { return {} }
  })
  const timerRef = useRef(null)

  const startGame = useCallback(() => {
    const words = WORD_SETS[category]
    const selected = shuffle(words).slice(0, GAME_SIZE)
    setPairs(selected)
    setFrWords(shuffle(selected.map(p => p.fr)))
    setEnWords(shuffle(selected.map(p => p.en)))
    setSelectedFr(null)
    setSelectedEn(null)
    setMatched([])
    setWrong([])
    setScore(0)
    setTimeLeft(TIME_LIMIT)
    setGameState('playing')
  }, [category])

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { clearInterval(timerRef.current); setGameState('timeout'); return 0 }
          return t - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [gameState])

  useEffect(() => {
    if (matched.length === GAME_SIZE && gameState === 'playing') {
      clearInterval(timerRef.current)
      const finalScore = score + Math.max(0, timeLeft * 2)
      setScore(finalScore)
      const hs = { ...highScores, [category]: Math.max(highScores[category] || 0, finalScore) }
      setHighScores(hs)
      localStorage.setItem('wm_scores', JSON.stringify(hs))
      addXP(Math.min(50, Math.floor(finalScore / 5)), 'word_match')
      setGameState('won')
    }
  }, [matched, gameState])

  const handleFr = (word) => {
    if (matched.includes(word) || gameState !== 'playing') return
    setSelectedFr(word)
    setWrong([])
  }

  const handleEn = (word) => {
    if (!selectedFr || gameState !== 'playing') return
    setSelectedEn(word)
    const pair = pairs.find(p => p.fr === selectedFr)
    if (pair && pair.en === word) {
      setMatched(m => [...m, pair.fr])
      setScore(s => s + 10 + Math.floor(timeLeft / 5))
      setSelectedFr(null)
      setSelectedEn(null)
    } else {
      setWrong([selectedFr, word])
      setTimeout(() => {
        setWrong([])
        setSelectedFr(null)
        setSelectedEn(null)
      }, 700)
    }
  }

  const timerPct = (timeLeft / TIME_LIMIT) * 100
  const timerColor = timeLeft > 20 ? 'bg-emerald-500' : timeLeft > 10 ? 'bg-amber-400' : 'bg-red-500'

  return (
    <>
      <SEO
        title="French Word Match Game — Vocabulary Recognition | SayBonjour!"
        description="Match French words to their English meanings in this fast-paced card-flipping game. A great way to build vocabulary recognition, recall, and response speed."
        keywords="french word match, french vocabulary game, match french words, french memory game, learn french vocabulary, french word recognition game"
        url="/word-match"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-dark-warm-300">
        <div className="max-w-2xl mx-auto px-4 pt-5">
          <Link to="/games" className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-burgundy-600 dark:hover:text-burgundy-400 transition-colors group">
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" /> Games Hub
          </Link>
        </div>
        <div className="bg-gradient-to-r from-burgundy-800 to-burgundy-600 text-cream-50 py-10 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center bg-cream-50/20 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                <Zap className="w-4 h-4 mr-2" /> Mini Game
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Word Match
              </h1>
              <p className="text-cream-100">Match French words to their English translations before time runs out!</p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Category selector */}
          {gameState === 'idle' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Choose a category</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {Object.keys(WORD_SETS).map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)}
                    className={`py-3 rounded-xl text-sm font-medium border-2 transition-all ${category === cat ? 'bg-burgundy-600 text-cream-50 border-burgundy-600 shadow-md' : 'bg-white dark:bg-dark-warm-100 text-gray-700 dark:text-gray-300 border-cream-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
                    {cat}
                    {highScores[cat] && <div className="text-xs opacity-70 mt-0.5">Best: {highScores[cat]}</div>}
                  </button>
                ))}
              </div>

              <button onClick={startGame}
                className="w-full py-4 bg-burgundy-600 text-cream-50 rounded-2xl font-bold text-lg hover:bg-burgundy-700 transition-colors shadow-lg flex items-center justify-center gap-3">
                <Shuffle className="w-5 h-5" /> Start Game
              </button>

              <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs text-gray-500 dark:text-gray-400">
                <div className="bg-white dark:bg-dark-warm-100 rounded-xl p-3 border border-cream-200 dark:border-dark-warm-50">
                  <div className="font-bold text-gray-700 dark:text-gray-300 text-base">{GAME_SIZE}</div>
                  <div>word pairs</div>
                </div>
                <div className="bg-white dark:bg-dark-warm-100 rounded-xl p-3 border border-cream-200 dark:border-dark-warm-50">
                  <div className="font-bold text-gray-700 dark:text-gray-300 text-base">{TIME_LIMIT}s</div>
                  <div>time limit</div>
                </div>
                <div className="bg-white dark:bg-dark-warm-100 rounded-xl p-3 border border-cream-200 dark:border-dark-warm-50">
                  <div className="font-bold text-gray-700 dark:text-gray-300 text-base">+50</div>
                  <div>max XP</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Playing */}
          {gameState === 'playing' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                  <Clock className="w-4 h-4" /> {timeLeft}s
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-amber-600">
                  <Star className="w-4 h-4" /> {score} pts
                </div>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-dark-warm-50 rounded-full mb-6 overflow-hidden">
                <motion.div className={`h-full rounded-full ${timerColor} transition-colors`}
                  style={{ width: `${timerPct}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-center mb-3">🇫🇷 French</div>
                  {frWords.map(word => {
                    const isMatched = matched.includes(word)
                    const isSelected = selectedFr === word
                    const isWrong = wrong.includes(word)
                    return (
                      <motion.button
                        key={word}
                        onClick={() => handleFr(word)}
                        disabled={isMatched}
                        className={`w-full py-3 px-4 rounded-xl text-sm font-medium transition-all border-2 ${
                          isMatched ? 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 text-emerald-700 dark:text-emerald-300 line-through opacity-60' :
                          isWrong ? 'bg-red-100 dark:bg-red-900/30 border-red-400 text-red-700 dark:text-red-400' :
                          isSelected ? 'bg-burgundy-600 text-cream-50 border-burgundy-600 shadow-md' :
                          'bg-white dark:bg-dark-warm-100 text-gray-700 dark:text-gray-300 border-cream-200 dark:border-dark-warm-50 hover:border-burgundy-400 hover:shadow-sm'
                        }`}
                        animate={isWrong ? { x: [-4, 4, -4, 4, 0] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        {word}
                      </motion.button>
                    )
                  })}
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-center mb-3">🇬🇧 English</div>
                  {enWords.map(word => {
                    const matchedFr = pairs.find(p => p.en === word)?.fr
                    const isMatched = matched.includes(matchedFr)
                    const isWrong = wrong.includes(word)
                    return (
                      <motion.button
                        key={word}
                        onClick={() => handleEn(word)}
                        disabled={isMatched || !selectedFr}
                        className={`w-full py-3 px-4 rounded-xl text-sm font-medium transition-all border-2 ${
                          isMatched ? 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 text-emerald-700 dark:text-emerald-300 line-through opacity-60' :
                          isWrong ? 'bg-red-100 dark:bg-red-900/30 border-red-400 text-red-700 dark:text-red-400' :
                          !selectedFr ? 'bg-gray-50 dark:bg-dark-warm-200 text-gray-400 border-gray-200 dark:border-dark-warm-50 cursor-not-allowed' :
                          'bg-white dark:bg-dark-warm-100 text-gray-700 dark:text-gray-300 border-cream-200 dark:border-dark-warm-50 hover:border-blue-400 hover:shadow-sm cursor-pointer'
                        }`}
                        animate={isWrong ? { x: [-4, 4, -4, 4, 0] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        {word}
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Won / Timeout */}
          {(gameState === 'won' || gameState === 'timeout') && (
            <motion.div
              className="text-center py-10"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="text-6xl mb-4">{gameState === 'won' ? '🎉' : '⏰'}</div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-cream-50 mb-2">
                {gameState === 'won' ? 'All matched!' : 'Time\'s up!'}
              </h2>
              <div className="bg-white dark:bg-dark-warm-100 rounded-2xl border border-cream-200 dark:border-dark-warm-50 p-6 max-w-sm mx-auto mb-6 shadow-sm">
                <div className="text-4xl font-black text-burgundy-700 dark:text-burgundy-400 mb-1">{score}</div>
                <div className="text-gray-500 dark:text-gray-400 text-sm mb-3">Points scored</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {matched.length}/{GAME_SIZE} pairs matched · {timeLeft}s left
                </div>
                {highScores[category] && (
                  <div className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1">
                    <Trophy className="w-3.5 h-3.5" /> Best: {highScores[category]} pts
                  </div>
                )}
              </div>
              <div className="flex gap-3 justify-center">
                <button onClick={startGame}
                  className="px-6 py-3 bg-burgundy-600 text-cream-50 rounded-xl font-semibold hover:bg-burgundy-700 transition-colors flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" /> Play Again
                </button>
                <button onClick={() => setGameState('idle')}
                  className="px-6 py-3 bg-gray-100 dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-dark-warm-200 transition-colors">
                  Change Category
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  )
}

export default WordMatch
