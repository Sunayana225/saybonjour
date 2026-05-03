import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, CheckCircle, XCircle, Trophy, Shuffle, ChevronLeft } from 'lucide-react'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const WORDS = [
  { word: 'bonjour', en: 'hello', level: 'A1', category: 'Greetings' },
  { word: 'merci', en: 'thank you', level: 'A1', category: 'Greetings' },
  { word: 'maison', en: 'house', level: 'A1', category: 'Home' },
  { word: 'chien', en: 'dog', level: 'A1', category: 'Animals' },
  { word: 'chat', en: 'cat', level: 'A1', category: 'Animals' },
  { word: 'livre', en: 'book', level: 'A1', category: 'Objects' },
  { word: 'table', en: 'table', level: 'A1', category: 'Objects' },
  { word: 'soleil', en: 'sun', level: 'A2', category: 'Nature' },
  { word: 'fleur', en: 'flower', level: 'A2', category: 'Nature' },
  { word: 'voiture', en: 'car', level: 'A2', category: 'Transport' },
  { word: 'amour', en: 'love', level: 'A2', category: 'Feelings' },
  { word: 'musique', en: 'music', level: 'A2', category: 'Arts' },
  { word: 'cuisine', en: 'kitchen / cooking', level: 'A2', category: 'Home' },
  { word: 'jardin', en: 'garden', level: 'A2', category: 'Home' },
  { word: 'voyage', en: 'journey / travel', level: 'A2', category: 'Travel' },
  { word: 'grenouille', en: 'frog', level: 'B1', category: 'Animals' },
  { word: 'papillon', en: 'butterfly', level: 'B1', category: 'Animals' },
  { word: 'champignon', en: 'mushroom', level: 'B1', category: 'Food' },
  { word: 'parapluie', en: 'umbrella', level: 'B1', category: 'Objects' },
  { word: 'boulangerie', en: 'bakery', level: 'B1', category: 'Places' },
  { word: 'bibliotheque', en: 'library', level: 'B1', category: 'Places' },
  { word: 'gouvernement', en: 'government', level: 'B2', category: 'Society' },
  { word: 'environnement', en: 'environment', level: 'B2', category: 'Society' },
  { word: 'extraordinaire', en: 'extraordinary', level: 'B2', category: 'Adjectives' },
]

function scramble(word) {
  const arr = word.toUpperCase().split('')
  let scrambled
  do { scrambled = [...arr].sort(() => Math.random() - 0.5) } while (scrambled.join('') === arr.join(''))
  return scrambled
}

export default function WordScramble() {
  const [levelFilter, setLevelFilter] = useState('All')
  const [current, setCurrent] = useState(null)
  const [tiles, setTiles] = useState([])
  const [answer, setAnswer] = useState([])
  const [result, setResult] = useState(null)
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const inputRef = useRef(null)

  const pick = () => {
    const pool = levelFilter === 'All' ? WORDS : WORDS.filter(w => w.level === levelFilter)
    const w = pool[Math.floor(Math.random() * pool.length)]
    setCurrent(w)
    setTiles(scramble(w.word).map((l, i) => ({ id: i, letter: l, used: false })))
    setAnswer([])
    setResult(null)
  }

  useEffect(() => { pick() }, [levelFilter])

  const addToAnswer = (tile) => {
    if (tile.used || result) return
    setAnswer(a => [...a, tile])
    setTiles(t => t.map(tl => tl.id === tile.id ? { ...tl, used: true } : tl))
  }

  const removeFromAnswer = (tile, idx) => {
    if (result) return
    setAnswer(a => a.filter((_, i) => i !== idx))
    setTiles(t => t.map(tl => tl.id === tile.id ? { ...tl, used: false } : tl))
  }

  const checkAnswer = () => {
    const ans = answer.map(t => t.letter).join('').toLowerCase()
    if (ans === current.word) {
      setResult('correct')
      setScore(s => s + 1)
      addXP(10, 'word_match')
    } else {
      setResult('wrong')
    }
  }

  const reshuffleTiles = () => {
    setTiles(t => {
      const unused = t.filter(tl => !tl.used)
      const shuffled = [...unused].sort(() => Math.random() - 0.5)
      let si = 0
      return t.map(tl => tl.used ? tl : shuffled[si++])
    })
  }

  const next = () => { setRound(r => r + 1); pick() }

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French Word Scramble | SayBonjour!" description="Unscramble French words and improve your vocabulary." />
      <div className="max-w-xl mx-auto px-4 py-8">
        <Link to="/games" className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-burgundy-600 dark:hover:text-burgundy-400 mb-5 transition-colors group">
          <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" /> Games Hub
        </Link>
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">Word Scramble</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Remettez les lettres dans le bon ordre !</p>
          <div className="flex justify-center gap-4 mt-2 text-sm">
            <span className="text-gray-500">Round: <strong>{round}</strong></span>
            <span className="text-gray-500">Score: <strong className="text-burgundy-600">{score}</strong></span>
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

        {current && (
          <div className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-6">
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Unscramble this French word</p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">"{current.en}"</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-2 inline-block ${current.level === 'A1' ? 'bg-emerald-100 text-emerald-700' : current.level === 'A2' ? 'bg-blue-100 text-blue-700' : current.level === 'B1' ? 'bg-yellow-100 text-yellow-700' : 'bg-orange-100 text-orange-700'}`}>{current.level} · {current.category}</span>
            </div>

            <div className="min-h-14 border-2 border-dashed border-burgundy-200 dark:border-burgundy-800 rounded-xl p-3 flex flex-wrap gap-2 justify-center mb-4">
              {answer.length === 0 && <span className="text-gray-400 dark:text-gray-500 text-sm self-center">Click letters below to build your answer</span>}
              {answer.map((tile, i) => (
                <button key={`${tile.id}-${i}`} onClick={() => removeFromAnswer(tile, i)}
                  className="w-10 h-10 rounded-lg bg-burgundy-600 text-white font-bold text-lg hover:bg-burgundy-700 transition-colors shadow">
                  {tile.letter}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {tiles.map(tile => (
                <button key={tile.id} onClick={() => addToAnswer(tile)} disabled={tile.used}
                  className={`w-10 h-10 rounded-lg font-bold text-lg transition-all ${tile.used ? 'bg-gray-100 dark:bg-dark-warm-200 text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'bg-amber-100 dark:bg-dark-warm-200 text-gray-800 dark:text-cream-50 hover:bg-amber-200 dark:hover:bg-dark-warm-100 shadow hover:shadow-md'}`}>
                  {tile.letter}
                </button>
              ))}
            </div>

            <AnimatePresence>
              {result && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                  className={`rounded-xl p-4 mb-4 text-center ${result === 'correct' ? 'bg-green-50 dark:bg-green-900/20 border border-green-200' : 'bg-red-50 dark:bg-red-900/20 border border-red-200'}`}>
                  {result === 'correct' ? (
                    <>
                      <p className="text-green-700 dark:text-green-400 font-bold flex items-center justify-center gap-2"><CheckCircle size={18} /> Correct! +10 XP</p>
                      <div className="flex items-center justify-center gap-2 mt-1">
                        <span className="font-semibold text-gray-800 dark:text-cream-50">{current.word}</span>
                        <SpeakButton text={current.word} lang="fr-FR" size="sm" />
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-red-600 font-bold flex items-center justify-center gap-2"><XCircle size={18} /> Not quite!</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">The answer is: <strong>{current.word.toUpperCase()}</strong></p>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-3 justify-center flex-wrap">
              {!result && (
                <>
                  <button onClick={() => { setAnswer([]); setTiles(t => t.map(tl => ({ ...tl, used: false }))) }} className="btn-secondary text-sm">Clear</button>
                  <button onClick={reshuffleTiles} className="btn-secondary text-sm flex items-center gap-1"><Shuffle className="w-4 h-4" /> Shuffle</button>
                  <button onClick={checkAnswer} disabled={answer.length !== current.word.length} className="btn-primary text-sm disabled:opacity-50">Check</button>
                </>
              )}
              {result && <button onClick={next} className="btn-primary text-sm flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Next Word</button>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
