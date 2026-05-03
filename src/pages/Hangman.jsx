import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, Trophy, BookOpen, Lightbulb, ChevronLeft } from 'lucide-react'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const WORDS = [
  { word: 'BONJOUR', hint: 'A greeting', translation: 'Hello / Good day', level: 'A1' },
  { word: 'MAISON', hint: 'Where you live', translation: 'House', level: 'A1' },
  { word: 'CHIEN', hint: 'Man\'s best friend', translation: 'Dog', level: 'A1' },
  { word: 'CHAT', hint: 'A purring pet', translation: 'Cat', level: 'A1' },
  { word: 'MERCI', hint: 'Polite response', translation: 'Thank you', level: 'A1' },
  { word: 'ÉCOLE', hint: 'Where children learn', translation: 'School', level: 'A1' },
  { word: 'LIVRE', hint: 'You read it', translation: 'Book', level: 'A1' },
  { word: 'EAU', hint: 'Essential liquid', translation: 'Water', level: 'A1' },
  { word: 'PAIN', hint: 'French staple food', translation: 'Bread', level: 'A1' },
  { word: 'VIN', hint: 'French beverage', translation: 'Wine', level: 'A1' },
  { word: 'VOYAGE', hint: 'Going somewhere', translation: 'Journey / Travel', level: 'A2' },
  { word: 'FAMILLE', hint: 'Your relatives', translation: 'Family', level: 'A2' },
  { word: 'CUISINE', hint: 'Room for cooking', translation: 'Kitchen / Cooking', level: 'A2' },
  { word: 'JARDIN', hint: 'Outdoor green space', translation: 'Garden', level: 'A2' },
  { word: 'VOITURE', hint: 'You drive it', translation: 'Car', level: 'A2' },
  { word: 'SOLEIL', hint: 'Shines during the day', translation: 'Sun', level: 'A2' },
  { word: 'FLEUR', hint: 'Colourful and fragrant', translation: 'Flower', level: 'A2' },
  { word: 'AMOUR', hint: 'The French specialty', translation: 'Love', level: 'A2' },
  { word: 'GRENOUILLE', hint: 'A green hopping animal', translation: 'Frog', level: 'B1' },
  { word: 'BIBLIOTHEQUE', hint: 'You borrow books here', translation: 'Library', level: 'B1' },
  { word: 'PAPILLON', hint: 'Flying insect, colourful wings', translation: 'Butterfly', level: 'B1' },
  { word: 'CHAMPIGNON', hint: 'A fungus you eat', translation: 'Mushroom', level: 'B1' },
  { word: 'PARAPLUIE', hint: 'Protection from rain', translation: 'Umbrella', level: 'B1' },
  { word: 'CROISSANT', hint: 'A French pastry', translation: 'Croissant', level: 'B1' },
  { word: 'BOULANGERIE', hint: 'Where you buy bread', translation: 'Bakery', level: 'B1' },
  { word: 'ORDINATEUR', hint: 'You use this to work', translation: 'Computer', level: 'B2' },
  { word: 'GOUVERNEMENT', hint: 'Ruling body of a country', translation: 'Government', level: 'B2' },
  { word: 'ENVIRONNEMENT', hint: 'Nature around us', translation: 'Environment', level: 'B2' },
]

const MAX_WRONG = 6

const KEYBOARD_ROWS = [
  ['A','B','C','D','E','F','G','H','I','J'],
  ['K','L','M','N','O','P','Q','R','S','T'],
  ['U','V','W','X','Y','Z'],
]

function HangmanSVG({ wrong }) {
  return (
    <svg viewBox="0 0 200 220" className="w-48 h-48 mx-auto">
      <line x1="20" y1="210" x2="180" y2="210" stroke="currentColor" strokeWidth="3" className="text-gray-700 dark:text-gray-300" />
      <line x1="60" y1="210" x2="60" y2="20" stroke="currentColor" strokeWidth="3" className="text-gray-700 dark:text-gray-300" />
      <line x1="60" y1="20" x2="140" y2="20" stroke="currentColor" strokeWidth="3" className="text-gray-700 dark:text-gray-300" />
      <line x1="140" y1="20" x2="140" y2="50" stroke="currentColor" strokeWidth="3" className="text-gray-700 dark:text-gray-300" />
      {wrong >= 1 && <circle cx="140" cy="70" r="20" stroke="currentColor" strokeWidth="3" fill="none" className="text-burgundy-600" />}
      {wrong >= 2 && <line x1="140" y1="90" x2="140" y2="150" stroke="currentColor" strokeWidth="3" className="text-burgundy-600" />}
      {wrong >= 3 && <line x1="140" y1="110" x2="110" y2="135" stroke="currentColor" strokeWidth="3" className="text-burgundy-600" />}
      {wrong >= 4 && <line x1="140" y1="110" x2="170" y2="135" stroke="currentColor" strokeWidth="3" className="text-burgundy-600" />}
      {wrong >= 5 && <line x1="140" y1="150" x2="110" y2="185" stroke="currentColor" strokeWidth="3" className="text-burgundy-600" />}
      {wrong >= 6 && <line x1="140" y1="150" x2="170" y2="185" stroke="currentColor" strokeWidth="3" className="text-burgundy-600" />}
    </svg>
  )
}

export default function Hangman() {
  const [levelFilter, setLevelFilter] = useState('All')
  const [wordObj, setWordObj] = useState(null)
  const [guessed, setGuessed] = useState(new Set())
  const [showHint, setShowHint] = useState(false)
  const [score, setScore] = useState(0)
  const [gamesPlayed, setGamesPlayed] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const pickWord = useCallback(() => {
    const pool = levelFilter === 'All' ? WORDS : WORDS.filter(w => w.level === levelFilter)
    const w = pool[Math.floor(Math.random() * pool.length)]
    setWordObj(w)
    setGuessed(new Set())
    setShowHint(false)
    setRevealed(false)
  }, [levelFilter])

  useEffect(() => { pickWord() }, [pickWord])

  const word = wordObj?.word || ''
  const wrongGuesses = [...guessed].filter(l => !word.includes(l))
  const isWon = word.length > 0 && word.split('').every(l => guessed.has(l))
  const isLost = wrongGuesses.length >= MAX_WRONG

  const handleGuess = (letter) => {
    if (!wordObj || guessed.has(letter) || isWon || isLost) return
    const newGuessed = new Set([...guessed, letter])
    setGuessed(newGuessed)
    const newWrong = [...newGuessed].filter(l => !word.includes(l))
    const nowWon = word.split('').every(l => newGuessed.has(l))
    if (nowWon) {
      setScore(s => s + 1)
      setGamesPlayed(g => g + 1)
      addXP(15, 'word_match')
    } else if (newWrong.length >= MAX_WRONG) {
      setGamesPlayed(g => g + 1)
    }
  }

  useEffect(() => {
    const handler = (e) => {
      const key = e.key.toUpperCase()
      if (/^[A-Z]$/.test(key)) handleGuess(key)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [guessed, isWon, isLost, wordObj])

  if (!wordObj) return null

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French Hangman | SayBonjour!" description="Play French hangman and learn vocabulary while guessing words." />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link to="/games" className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-burgundy-600 dark:hover:text-burgundy-400 mb-5 transition-colors group">
          <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" /> Games Hub
        </Link>
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">French Hangman</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Le Pendu — Devinez le mot !</p>
          <div className="flex items-center justify-center gap-4 mt-3">
            <span className="text-sm text-gray-500">Score: <strong className="text-burgundy-600">{score}</strong></span>
            <span className="text-sm text-gray-500">Played: <strong>{gamesPlayed}</strong></span>
          </div>
        </div>

        <div className="flex gap-2 justify-center flex-wrap mb-4">
          {['All', 'A1', 'A2', 'B1', 'B2'].map(l => (
            <button key={l} onClick={() => setLevelFilter(l)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${levelFilter === l ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50'}`}>
              {l}
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${wordObj.level === 'A1' ? 'bg-emerald-100 text-emerald-700' : wordObj.level === 'A2' ? 'bg-blue-100 text-blue-700' : wordObj.level === 'B1' ? 'bg-yellow-100 text-yellow-700' : 'bg-orange-100 text-orange-700'}`}>{wordObj.level}</span>
            <span className="text-sm text-red-500 font-medium">{MAX_WRONG - wrongGuesses.length} lives left</span>
          </div>

          <HangmanSVG wrong={wrongGuesses.length} />

          <div className="flex justify-center gap-2 flex-wrap my-6">
            {word.split('').map((letter, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className={`text-2xl font-bold min-w-8 text-center transition-all ${guessed.has(letter) || revealed ? 'text-gray-900 dark:text-cream-50' : 'text-transparent'}`}>
                  {guessed.has(letter) || revealed ? letter : '_'}
                </span>
                <span className="text-lg text-gray-400 leading-none">_</span>
              </div>
            ))}
          </div>

          {!isWon && !isLost && (
            <div className="flex justify-center gap-2 mb-4">
              <button onClick={() => setShowHint(true)} className="flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-700">
                <Lightbulb className="w-4 h-4" /> {showHint ? wordObj.hint : 'Show hint'}
              </button>
            </div>
          )}

          <AnimatePresence>
            {(isWon || isLost) && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`text-center rounded-xl p-4 mb-4 ${isWon ? 'bg-green-50 dark:bg-green-900/20 border border-green-200' : 'bg-red-50 dark:bg-red-900/20 border border-red-200'}`}>
                <p className="text-2xl font-bold mb-1">{isWon ? '🎉 Bravo!' : '💀 Perdu!'}</p>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <p className="font-semibold text-gray-800 dark:text-cream-50">{word}</p>
                  <SpeakButton text={word.toLowerCase()} lang="fr-FR" size="md" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">= {wordObj.translation}</p>
                {isWon && <p className="text-sm text-green-600 mt-1">+15 XP earned!</p>}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            {KEYBOARD_ROWS.map((row, ri) => (
              <div key={ri} className="flex justify-center gap-1.5 flex-wrap">
                {row.map(letter => {
                  const isGuessed = guessed.has(letter)
                  const isCorrect = isGuessed && word.includes(letter)
                  const isWrong = isGuessed && !word.includes(letter)
                  return (
                    <button key={letter} onClick={() => handleGuess(letter)} disabled={isGuessed || isWon || isLost}
                      className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${isCorrect ? 'bg-green-500 text-white' : isWrong ? 'bg-gray-200 dark:bg-dark-warm-200 text-gray-400 line-through' : 'bg-amber-50 dark:bg-dark-warm-200 text-gray-800 dark:text-cream-50 hover:bg-burgundy-100 dark:hover:bg-dark-warm-50 border border-gray-200 dark:border-dark-warm-50'}`}>
                      {letter}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-4 justify-center">
            <button onClick={pickWord} className="btn-secondary flex items-center gap-2 text-sm"><RotateCcw className="w-4 h-4" /> New Word</button>
            {isLost && <button onClick={() => setRevealed(true)} className="btn-secondary flex items-center gap-2 text-sm"><BookOpen className="w-4 h-4" /> Reveal</button>}
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-3">Tip: You can also use your keyboard!</p>
      </div>
    </div>
  )
}
