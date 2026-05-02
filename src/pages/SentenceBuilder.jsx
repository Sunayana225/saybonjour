import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, RotateCcw, ArrowRight, Lightbulb } from 'lucide-react'
import { sentenceExercises, fillInBlanks } from '../data/sentenceData'
import { addXP } from '../utils/progress'
import SEO from '../components/SEO'

const LEVEL_COLORS = {
  A1: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  A2: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  B1: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
}

const SentenceArrangeExercise = ({ exercise, onComplete }) => {
  const [pool, setPool] = useState([])
  const [built, setBuilt] = useState([])
  const [checked, setChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    const shuffled = [...exercise.words].sort(() => Math.random() - 0.5)
    setPool(shuffled)
    setBuilt([])
    setChecked(false)
    setIsCorrect(false)
    setShowHint(false)
  }, [exercise])

  const addWord = (word, idx) => {
    if (checked) return
    setBuilt(b => [...b, word])
    setPool(p => { const n = [...p]; n.splice(idx, 1); return n })
  }

  const removeWord = (word, idx) => {
    if (checked) return
    setPool(p => [...p, word])
    setBuilt(b => { const n = [...b]; n.splice(idx, 1); return n })
  }

  const handleCheck = () => {
    const correct = JSON.stringify(built) === JSON.stringify(exercise.correct)
    setIsCorrect(correct)
    setChecked(true)
    onComplete(correct ? 15 : 5)
  }

  const handleReset = () => {
    const shuffled = [...exercise.words].sort(() => Math.random() - 0.5)
    setPool(shuffled)
    setBuilt([])
    setChecked(false)
    setIsCorrect(false)
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${LEVEL_COLORS[exercise.level]}`}>{exercise.level}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">{exercise.hint}</span>
      </div>

      {/* Built sentence */}
      <div className="min-h-14 bg-cream-50 dark:bg-dark-warm-200 border-2 border-dashed border-cream-300 dark:border-dark-warm-50 rounded-xl p-3 flex flex-wrap gap-2 mb-4 items-center">
        {built.length === 0 && <span className="text-sm text-gray-400 italic">Click words below to build the sentence…</span>}
        <AnimatePresence>
          {built.map((w, i) => (
            <motion.button
              key={`built-${i}-${w}`}
              onClick={() => removeWord(w, i)}
              disabled={checked}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                checked
                  ? isCorrect ? 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 text-emerald-800 dark:text-emerald-300'
                    : 'bg-red-100 dark:bg-red-900/30 border-red-300 text-red-700 dark:text-red-400'
                  : 'bg-burgundy-100 dark:bg-burgundy-900/40 border-burgundy-300 text-burgundy-800 dark:text-cream-50 hover:bg-burgundy-200 cursor-pointer'
              }`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              {w}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Word pool */}
      <div className="flex flex-wrap gap-2 mb-5">
        {pool.map((w, i) => (
          <motion.button
            key={`pool-${i}-${w}`}
            onClick={() => addWord(w, i)}
            disabled={checked}
            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white dark:bg-dark-warm-100 border border-cream-300 dark:border-dark-warm-50 text-gray-700 dark:text-gray-300 hover:border-burgundy-400 hover:bg-burgundy-50 dark:hover:bg-burgundy-900/20 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {w}
          </motion.button>
        ))}
        {pool.length === 0 && !checked && <span className="text-xs text-gray-400 italic">All words placed</span>}
      </div>

      {/* Result */}
      {checked && (
        <motion.div
          className={`p-4 rounded-xl mb-4 text-sm ${isCorrect ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200' : 'bg-red-50 dark:bg-red-900/20 border border-red-200'}`}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={`font-bold mb-1 flex items-center gap-2 ${isCorrect ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
            {isCorrect ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            {isCorrect ? 'Perfect!' : `Correct: ${exercise.correct.join(' ')}`}
          </div>
          <div className="text-gray-600 dark:text-gray-300 italic mb-1">"{exercise.translation}"</div>
          {exercise.explanation && <div className="text-xs text-gray-500 dark:text-gray-400">💡 {exercise.explanation}</div>}
        </motion.div>
      )}

      <div className="flex gap-3">
        {!checked ? (
          <>
            <button onClick={handleCheck} disabled={built.length === 0}
              className="px-5 py-2.5 bg-burgundy-600 text-cream-50 rounded-xl text-sm font-medium hover:bg-burgundy-700 disabled:opacity-50 transition-colors">
              Check Answer
            </button>
            <button onClick={handleReset} className="px-4 py-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 text-sm flex items-center gap-1">
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
            <button onClick={() => setShowHint(h => !h)} className="px-4 py-2.5 text-amber-600 text-sm flex items-center gap-1">
              <Lightbulb className="w-4 h-4" /> {showHint ? 'Hide' : 'Hint'}
            </button>
          </>
        ) : null}
      </div>
      {showHint && !checked && (
        <div className="mt-2 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3 py-2">
          First word: <strong>{exercise.correct[0]}</strong>
        </div>
      )}
    </div>
  )
}

const FillBlankExercise = ({ exercise, onComplete }) => {
  const [selected, setSelected] = useState(null)
  const [checked, setChecked] = useState(false)

  const handleCheck = () => {
    if (selected === null) return
    setChecked(true)
    onComplete(selected === exercise.answer ? 10 : 3)
  }

  const parts = exercise.sentence.split('___')

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${LEVEL_COLORS[exercise.level]}`}>{exercise.level}</span>
      </div>

      <div className="bg-cream-50 dark:bg-dark-warm-200 rounded-xl p-4 mb-4 text-center text-base font-medium text-gray-800 dark:text-cream-50">
        {parts[0]}
        <span className={`inline-block min-w-[80px] px-2 py-0.5 mx-1 rounded-lg border-b-2 border-dashed text-center font-bold ${
          !checked ? 'border-burgundy-400 text-burgundy-600 dark:text-burgundy-400' :
          selected === exercise.answer ? 'border-emerald-400 text-emerald-700 dark:text-emerald-400' : 'border-red-400 text-red-600 dark:text-red-400'
        }`}>
          {selected !== null ? exercise.options[selected] : '___'}
        </span>
        {parts[1]}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {exercise.options.map((opt, i) => {
          let cls = 'text-left px-4 py-2.5 rounded-xl text-sm border-2 transition-all font-medium '
          if (!checked) {
            cls += selected === i ? 'bg-burgundy-100 dark:bg-burgundy-900/40 border-burgundy-400 text-burgundy-800 dark:text-cream-50' : 'bg-white dark:bg-dark-warm-200 border-cream-200 dark:border-dark-warm-50 text-gray-700 dark:text-gray-300 hover:border-burgundy-300'
          } else {
            if (exercise.answer === i) cls += 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-400 text-emerald-800 dark:text-emerald-300'
            else if (selected === i) cls += 'bg-red-50 dark:bg-red-900/20 border-red-400 text-red-700 dark:text-red-400'
            else cls += 'bg-gray-50 dark:bg-dark-warm-200 border-gray-200 dark:border-dark-warm-50 text-gray-400'
          }
          return (
            <button key={i} onClick={() => !checked && setSelected(i)} className={cls}>
              <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
            </button>
          )
        })}
      </div>

      {checked && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-sm text-gray-600 dark:text-gray-300 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 border border-amber-200 dark:border-amber-700">
          <div className="italic mb-1">"{exercise.translation}"</div>
          {exercise.explanation && <div className="text-xs text-gray-500 dark:text-gray-400">💡 {exercise.explanation}</div>}
        </motion.div>
      )}

      {!checked && (
        <button onClick={handleCheck} disabled={selected === null}
          className="mt-3 px-5 py-2.5 bg-burgundy-600 text-cream-50 rounded-xl text-sm font-medium hover:bg-burgundy-700 disabled:opacity-50 transition-colors">
          Check
        </button>
      )}
    </div>
  )
}

export default function SentenceBuilder() {
  const [mode, setMode] = useState('arrange')
  const [levelFilter, setLevelFilter] = useState('All')
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(0)
  const [key, setKey] = useState(0)

  const exercises = mode === 'arrange' ? sentenceExercises : fillInBlanks
  const filtered = levelFilter === 'All' ? exercises : exercises.filter(e => e.level === levelFilter)
  const current = filtered[idx % filtered.length]

  const handleComplete = (xp) => {
    setScore(s => s + xp)
    setCompleted(c => c + 1)
    addXP(xp, 'sentence_builder')
  }

  const handleNext = () => {
    setIdx(i => i + 1)
    setKey(k => k + 1)
  }

  return (
    <>
      <SEO title="Sentence Builder | SayBonjour" url="/sentence-builder" />
      <div className="min-h-screen bg-gray-50 dark:bg-dark-warm-300">
        <div className="bg-gradient-to-r from-burgundy-800 to-burgundy-600 text-cream-50 py-10 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center bg-cream-50/20 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                <ArrowRight className="w-4 h-4 mr-2" /> Language Practice
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Sentence Builder
              </h1>
              <p className="text-cream-100">Arrange words into correct French sentences, or complete the blanks.</p>
              <div className="flex items-center justify-center gap-4 mt-4 text-sm">
                <div><span className="font-bold text-amber-300">{score}</span> XP this session</div>
                <div><span className="font-bold">{completed}</span> exercises done</div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="flex gap-2 mb-5 flex-wrap">
            <div className="flex bg-white dark:bg-dark-warm-100 border border-cream-200 dark:border-dark-warm-50 rounded-xl p-1 mr-2">
              {['arrange', 'fill'].map(m => (
                <button key={m} onClick={() => { setMode(m); setIdx(0); setKey(k => k + 1) }}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${mode === m ? 'bg-burgundy-600 text-cream-50' : 'text-gray-600 dark:text-gray-300 hover:bg-burgundy-50 dark:hover:bg-burgundy-900/20'}`}>
                  {m === 'arrange' ? '🔀 Arrange' : '📝 Fill Blank'}
                </button>
              ))}
            </div>
            {['All', 'A1', 'A2', 'B1'].map(l => (
              <button key={l} onClick={() => { setLevelFilter(l); setIdx(0); setKey(k => k + 1) }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${levelFilter === l ? 'bg-burgundy-600 text-cream-50' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-cream-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
                {l}
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-dark-warm-100 rounded-2xl border border-cream-200 dark:border-dark-warm-50 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Exercise {(idx % filtered.length) + 1} of {filtered.length}
              </span>
              <button onClick={handleNext} className="text-xs text-gray-400 hover:text-burgundy-600 flex items-center gap-1">
                Skip <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={key} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                {mode === 'arrange'
                  ? <SentenceArrangeExercise exercise={current} onComplete={handleComplete} />
                  : <FillBlankExercise exercise={current} onComplete={handleComplete} />
                }
              </motion.div>
            </AnimatePresence>

            <button onClick={handleNext}
              className="mt-5 w-full py-2.5 border border-cream-300 dark:border-dark-warm-50 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-cream-50 dark:hover:bg-dark-warm-200 transition-colors flex items-center justify-center gap-2">
              Next exercise <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
