import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, CheckCircle, XCircle, RotateCcw, Play, ChevronLeft } from 'lucide-react'
import SEO from '../components/SEO'
import { addXP } from '../utils/progress'

const WORDS = [
  { word: 'bonjour', hint: 'Hello / Good day', level: 'A1' },
  { word: 'merci', hint: 'Thank you', level: 'A1' },
  { word: 'maison', hint: 'House', level: 'A1' },
  { word: 'famille', hint: 'Family', level: 'A1' },
  { word: 'chien', hint: 'Dog', level: 'A1' },
  { word: 'soleil', hint: 'Sun', level: 'A2' },
  { word: 'jardin', hint: 'Garden', level: 'A2' },
  { word: 'voyage', hint: 'Journey / Travel', level: 'A2' },
  { word: 'musique', hint: 'Music', level: 'A2' },
  { word: 'voiture', hint: 'Car', level: 'A2' },
  { word: 'grenouille', hint: 'Frog', level: 'B1' },
  { word: 'papillon', hint: 'Butterfly', level: 'B1' },
  { word: 'champignon', hint: 'Mushroom', level: 'B1' },
  { word: 'boulangerie', hint: 'Bakery', level: 'B1' },
  { word: 'bibliothèque', hint: 'Library', level: 'B1' },
  { word: 'extraordinaire', hint: 'Extraordinary', level: 'B2' },
  { word: 'gouvernement', hint: 'Government', level: 'B2' },
  { word: 'environnement', hint: 'Environment', level: 'B2' },
  { word: 'appartement', hint: 'Apartment / Flat', level: 'B2' },
  { word: 'communication', hint: 'Communication', level: 'B2' },
]

function speak(text) {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utt = new SpeechSynthesisUtterance(text)
  utt.lang = 'fr-FR'
  utt.rate = 0.8
  window.speechSynthesis.speak(utt)
}

function speakSlow(text) {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utt = new SpeechSynthesisUtterance(text)
  utt.lang = 'fr-FR'
  utt.rate = 0.5
  window.speechSynthesis.speak(utt)
}

export default function SpellingBee() {
  const [levelFilter, setLevelFilter] = useState('All')
  const [queue, setQueue] = useState(() => {
    const pool = [...WORDS].sort(() => Math.random() - 0.5)
    return pool
  })
  const [index, setIndex] = useState(0)
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [score, setScore] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const inputRef = useRef(null)

  const pool = levelFilter === 'All' ? WORDS : WORDS.filter(w => w.level === levelFilter)
  const current = queue.filter(w => pool.includes(w))[index % pool.length] || pool[0]

  const playWord = () => speak(current.word)
  const playWordSlow = () => speakSlow(current.word)

  const check = () => {
    const ans = input.trim().toLowerCase().replace(/[éèêë]/g, c => c).normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    const correct = current.word.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    const isCorrect = ans === correct || input.trim().toLowerCase() === current.word.toLowerCase()
    setResult(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) { setScore(s => s + 1); addXP(10, 'word_match') }
  }

  const next = () => {
    setIndex(i => i + 1)
    setInput('')
    setResult(null)
    setShowHint(false)
    setRevealed(false)
    setTimeout(() => inputRef.current?.focus(), 100)
    setTimeout(() => speak(queue[(index + 1) % pool.length]?.word || pool[0].word), 300)
  }

  const restart = () => {
    setQueue([...pool].sort(() => Math.random() - 0.5))
    setIndex(0)
    setInput('')
    setResult(null)
    setScore(0)
    setShowHint(false)
    setRevealed(false)
    setTimeout(() => speak(pool[0].word), 300)
  }

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French Spelling Bee | SayBonjour!" description="Listen to French words and practise spelling them correctly." />
      <div className="max-w-xl mx-auto px-4 py-8">
        <Link to="/games" className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-burgundy-600 dark:hover:text-burgundy-400 mb-5 transition-colors group">
          <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" /> Games Hub
        </Link>
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">Spelling Bee</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Listen and spell French words correctly</p>
          <p className="text-sm text-gray-500 mt-2">Score: <strong className="text-burgundy-600">{score}</strong></p>
        </div>

        <div className="flex gap-2 justify-center flex-wrap mb-6">
          {['All', 'A1', 'A2', 'B1', 'B2'].map(l => (
            <button key={l} onClick={() => { setLevelFilter(l); restart() }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${levelFilter === l ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50'}`}>
              {l}
            </button>
          ))}
        </div>

        {current && (
          <div className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-8">
            <div className="text-center mb-6">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium mb-3 inline-block ${current.level === 'A1' ? 'bg-emerald-100 text-emerald-700' : current.level === 'A2' ? 'bg-blue-100 text-blue-700' : current.level === 'B1' ? 'bg-yellow-100 text-yellow-700' : 'bg-orange-100 text-orange-700'}`}>{current.level}</span>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Listen carefully and type what you hear</p>

              <div className="flex justify-center gap-3 mb-2">
                <button onClick={playWord}
                  className="flex items-center gap-2 px-6 py-3 bg-burgundy-600 text-white rounded-xl font-medium hover:bg-burgundy-700 transition-colors text-lg">
                  <Volume2 size={22} /> Play
                </button>
                <button onClick={playWordSlow}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-dark-warm-200 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 transition-colors text-sm">
                  <Volume2 size={16} /> Slow
                </button>
              </div>
              {showHint && <p className="text-sm text-amber-600 mt-2">💡 {current.hint}</p>}
              {!showHint && !result && (
                <button onClick={() => setShowHint(true)} className="text-xs text-gray-400 hover:text-amber-500 mt-2">Show hint</button>
              )}
            </div>

            <div className="mb-4">
              <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !result) check() }}
                placeholder="Type the French word…"
                disabled={!!result}
                className="w-full px-4 py-3 text-center text-lg border-2 border-gray-200 dark:border-dark-warm-50 rounded-xl bg-white dark:bg-dark-warm-100 text-gray-900 dark:text-cream-50 focus:outline-none focus:border-burgundy-400"
                autoFocus
              />
            </div>

            <AnimatePresence>
              {result && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className={`rounded-xl p-4 mb-4 text-center ${result === 'correct' ? 'bg-green-50 dark:bg-green-900/20 border border-green-200' : 'bg-red-50 dark:bg-red-900/20 border border-red-200'}`}>
                  {result === 'correct' ? (
                    <p className="font-bold text-green-700 dark:text-green-400 flex items-center justify-center gap-2"><CheckCircle size={18} /> Parfait ! +10 XP</p>
                  ) : (
                    <div>
                      <p className="font-bold text-red-600 flex items-center justify-center gap-2 mb-1"><XCircle size={18} /> Not quite!</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Correct spelling: <strong className="text-gray-900 dark:text-cream-50">{current.word}</strong></p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-3 justify-center">
              {!result ? (
                <button onClick={check} disabled={!input.trim()} className="btn-primary flex-1 disabled:opacity-50">Check Spelling</button>
              ) : (
                <button onClick={next} className="btn-primary flex items-center gap-2 flex-1 justify-center"><Play size={16} /> Next Word</button>
              )}
              <button onClick={restart} className="btn-secondary flex items-center gap-2"><RotateCcw size={14} /></button>
            </div>
          </div>
        )}

        <div className="mt-4 bg-amber-50 dark:bg-dark-warm-100 border border-amber-200 dark:border-dark-warm-50 rounded-xl p-4 text-sm text-gray-600 dark:text-gray-400">
          <strong>Tips:</strong> Accents are optional — we accept both accented and plain versions. Press Enter to check your answer. Use "Slow" if you missed the word!
        </div>
      </div>
    </div>
  )
}
