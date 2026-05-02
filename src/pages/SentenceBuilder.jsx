import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, RotateCcw, ArrowRight, Lightbulb, Shuffle, PenLine, Zap } from 'lucide-react'
import { sentenceExercises, fillInBlanks } from '../data/sentenceData'
import { addXP } from '../utils/progress'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'

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
    setPool([...exercise.words].sort(() => Math.random() - 0.5))
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
    setPool([...exercise.words].sort(() => Math.random() - 0.5))
    setBuilt([])
    setChecked(false)
    setIsCorrect(false)
    setShowHint(false)
  }

  return (
    <div className="space-y-4">
      {/* Instruction */}
      <div className="flex items-center gap-2">
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0 ${LEVEL_COLORS[exercise.level]}`}>
          {exercise.level}
        </span>
        <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">{exercise.hint}</span>
      </div>

      {/* Build zone */}
      <div className={`min-h-[56px] rounded-xl p-3 flex flex-wrap gap-2 items-center border-2 border-dashed transition-colors ${
        checked
          ? isCorrect
            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700'
            : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
          : 'bg-gray-50 dark:bg-dark-warm-200 border-gray-300 dark:border-dark-warm-50'
      }`}>
        {built.length === 0 && (
          <span className="text-sm text-gray-400 dark:text-gray-500 italic">Click words below to build the sentence…</span>
        )}
        <AnimatePresence>
          {built.map((w, i) => (
            <motion.button
              key={`built-${i}-${w}`}
              onClick={() => removeWord(w, i)}
              disabled={checked}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                checked
                  ? isCorrect
                    ? 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 text-emerald-800 dark:text-emerald-300 cursor-default'
                    : 'bg-red-100 dark:bg-red-900/40 border-red-300 text-red-700 dark:text-red-400 cursor-default'
                  : 'bg-burgundy-100 dark:bg-burgundy-900/40 border-burgundy-300 text-burgundy-800 dark:text-cream-50 hover:bg-burgundy-200 cursor-pointer'
              }`}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              whileTap={!checked ? { scale: 0.95 } : {}}
            >
              {w}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Word pool */}
      <div className="flex flex-wrap gap-2">
        {pool.map((w, i) => (
          <motion.button
            key={`pool-${i}-${w}`}
            onClick={() => addWord(w, i)}
            disabled={checked}
            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white dark:bg-dark-warm-100 border border-gray-200 dark:border-dark-warm-50 text-gray-700 dark:text-gray-300 hover:border-burgundy-400 hover:bg-burgundy-50 dark:hover:bg-burgundy-900/20 transition-all disabled:opacity-50"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            {w}
          </motion.button>
        ))}
        {pool.length === 0 && !checked && (
          <span className="text-xs text-gray-400 italic">All words placed</span>
        )}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {checked && (
          <motion.div
            className={`rounded-xl p-4 text-sm border ${isCorrect ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          >
            <div className={`font-bold mb-1 flex items-center justify-between gap-2 ${isCorrect ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
              <span className="flex items-center gap-2">
                {isCorrect ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                {isCorrect ? 'Perfect!' : `Correct: ${exercise.correct.join(' ')}`}
              </span>
              <SpeakButton text={exercise.correct.join(' ')} size="sm" variant="ghost" />
            </div>
            <div className="text-gray-600 dark:text-gray-300 italic mb-1">"{exercise.translation}"</div>
            {exercise.explanation && <div className="text-xs text-gray-500 dark:text-gray-400">💡 {exercise.explanation}</div>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint */}
      <AnimatePresence>
        {showHint && !checked && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3 py-2 border border-amber-200 dark:border-amber-800"
          >
            First word: <strong>{exercise.correct[0]}</strong>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      {!checked && (
        <div className="flex items-center gap-3">
          <button
            onClick={handleCheck}
            disabled={built.length === 0}
            className="px-5 py-2.5 bg-burgundy-600 text-cream-50 rounded-xl text-sm font-semibold hover:bg-burgundy-700 disabled:opacity-40 transition-colors"
          >
            Check Answer
          </button>
          <button onClick={handleReset} className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors rounded-xl hover:bg-gray-100 dark:hover:bg-dark-warm-200">
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
          <button onClick={() => setShowHint(h => !h)} className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 transition-colors rounded-xl hover:bg-amber-50 dark:hover:bg-amber-900/20">
            <Lightbulb className="w-3.5 h-3.5" /> {showHint ? 'Hide hint' : 'Hint'}
          </button>
        </div>
      )}
    </div>
  )
}

const FillBlankExercise = ({ exercise, onComplete }) => {
  const [selected, setSelected] = useState(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    setSelected(null)
    setChecked(false)
  }, [exercise])

  const handleCheck = () => {
    if (selected === null) return
    setChecked(true)
    onComplete(selected === exercise.answer ? 10 : 3)
  }

  const parts = exercise.sentence.split('___')

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0 ${LEVEL_COLORS[exercise.level]}`}>
          {exercise.level}
        </span>
        <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">Fill in the blank.</span>
      </div>

      {/* Sentence display */}
      <div className="bg-gray-50 dark:bg-dark-warm-200 rounded-xl p-4 text-base font-medium text-gray-800 dark:text-cream-50 border border-gray-200 dark:border-dark-warm-50 flex items-center justify-between gap-3">
        <div className="text-center flex-1">
          {parts[0]}
          <span className={`inline-block min-w-[80px] px-2 py-0.5 mx-1 rounded-lg border-b-2 border-dashed text-center font-bold transition-colors ${
            !checked ? 'border-burgundy-400 text-burgundy-600 dark:text-burgundy-400'
            : selected === exercise.answer ? 'border-emerald-400 text-emerald-700 dark:text-emerald-400'
            : 'border-red-400 text-red-600 dark:text-red-400'
          }`}>
            {selected !== null ? exercise.options[selected] : '___'}
          </span>
          {parts[1]}
        </div>
        {checked && (
          <div className="flex-shrink-0">
            <SpeakButton
              text={exercise.sentence.replace('___', exercise.options[exercise.answer])}
              size="sm"
              variant="ghost"
            />
          </div>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-2">
        {exercise.options.map((opt, i) => {
          let cls = 'text-left px-4 py-2.5 rounded-xl text-sm border-2 transition-all font-medium '
          if (!checked) {
            cls += selected === i
              ? 'bg-burgundy-100 dark:bg-burgundy-900/40 border-burgundy-400 text-burgundy-800 dark:text-cream-50'
              : 'bg-white dark:bg-dark-warm-200 border-gray-200 dark:border-dark-warm-50 text-gray-700 dark:text-gray-300 hover:border-burgundy-300'
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

      {/* Feedback */}
      <AnimatePresence>
        {checked && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            className="text-sm text-gray-600 dark:text-gray-300 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 border border-amber-200 dark:border-amber-700">
            <div className="italic mb-1">"{exercise.translation}"</div>
            {exercise.explanation && <div className="text-xs text-gray-500 dark:text-gray-400">💡 {exercise.explanation}</div>}
          </motion.div>
        )}
      </AnimatePresence>

      {!checked && (
        <button onClick={handleCheck} disabled={selected === null}
          className="px-5 py-2.5 bg-burgundy-600 text-cream-50 rounded-xl text-sm font-semibold hover:bg-burgundy-700 disabled:opacity-40 transition-colors">
          Check Answer
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
  const [checked, setChecked] = useState(false)

  const exercises = mode === 'arrange' ? sentenceExercises : fillInBlanks
  const filtered = levelFilter === 'All' ? exercises : exercises.filter(e => e.level === levelFilter)
  const currentIdx = idx % filtered.length
  const current = filtered[currentIdx]

  const handleComplete = (xp) => {
    setScore(s => s + xp)
    setCompleted(c => c + 1)
    setChecked(true)
    addXP(xp, 'sentence_builder')
    window.dispatchEvent(new Event('progressUpdated'))
  }

  const handleNext = () => {
    setIdx(i => i + 1)
    setKey(k => k + 1)
    setChecked(false)
  }

  const switchMode = (m) => { setMode(m); setIdx(0); setKey(k => k + 1); setChecked(false) }
  const switchLevel = (l) => { setLevelFilter(l); setIdx(0); setKey(k => k + 1); setChecked(false) }

  return (
    <>
      <SEO
        title="French Sentence Builder — Construct Phrases Step by Step | SayBonjour!"
        description="Build grammatically correct French sentences interactively. Drag, drop, and arrange words to form phrases across different tenses, then get instant feedback on your answers."
        keywords="french sentence builder, build french sentences, french grammar practice, french word order, french sentence structure, learn french sentences"
        url="/sentence-builder"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-dark-warm-300">

        {/* ── Slim top bar ── */}
        <div className="bg-white dark:bg-dark-warm-100 border-b border-gray-100 dark:border-dark-warm-50 px-4 py-3 sticky top-[60px] z-10">
          <div className="max-w-2xl mx-auto flex items-center gap-3 flex-wrap">

            {/* Mode tabs */}
            <div className="flex bg-gray-100 dark:bg-dark-warm-200 rounded-xl p-1 gap-1">
              <button
                onClick={() => switchMode('arrange')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${mode === 'arrange' ? 'bg-burgundy-600 text-cream-50 shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-warm-100'}`}
              >
                <Shuffle className="w-3.5 h-3.5" /> Arrange
              </button>
              <button
                onClick={() => switchMode('fill')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${mode === 'fill' ? 'bg-burgundy-600 text-cream-50 shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-warm-100'}`}
              >
                <PenLine className="w-3.5 h-3.5" /> Fill Blank
              </button>
            </div>

            {/* Level pills */}
            <div className="flex gap-1.5">
              {['All', 'A1', 'A2', 'B1'].map(l => (
                <button key={l} onClick={() => switchLevel(l)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${levelFilter === l ? 'bg-burgundy-600 text-cream-50 border-burgundy-600' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
                  {l}
                </button>
              ))}
            </div>

            {/* Session stats */}
            <div className="ml-auto flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-amber-500" /><span className="font-bold text-amber-600 dark:text-amber-400">{score}</span> XP</span>
              <span><span className="font-bold text-gray-700 dark:text-gray-200">{completed}</span> done</span>
            </div>
          </div>
        </div>

        {/* ── Exercise card ── */}
        <div className="max-w-2xl mx-auto px-4 py-8">
          <motion.div
            className="bg-white dark:bg-dark-warm-100 rounded-2xl border border-gray-200 dark:border-dark-warm-50 shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Card header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-dark-warm-50">
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                Exercise {currentIdx + 1} of {filtered.length}
              </span>
              <button onClick={handleNext} className="flex items-center gap-1 text-xs text-gray-400 hover:text-burgundy-600 dark:hover:text-burgundy-400 transition-colors group">
                Skip <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Progress bar */}
            <div className="h-0.5 bg-gray-100 dark:bg-dark-warm-200">
              <motion.div
                className="h-full bg-burgundy-500"
                initial={{ width: 0 }}
                animate={{ width: `${((currentIdx + 1) / filtered.length) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>

            {/* Exercise body */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.2 }}
                >
                  {mode === 'arrange'
                    ? <SentenceArrangeExercise exercise={current} onComplete={handleComplete} />
                    : <FillBlankExercise exercise={current} onComplete={handleComplete} />
                  }
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Next exercise footer */}
            <div className="px-6 pb-6">
              <button
                onClick={handleNext}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  checked
                    ? 'bg-burgundy-600 text-cream-50 hover:bg-burgundy-700'
                    : 'border border-gray-200 dark:border-dark-warm-50 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-warm-200'
                }`}
              >
                Next exercise <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Subtle help text */}
          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">
            {mode === 'arrange' ? 'Click words to add them · Click again to remove' : 'Select the correct option to fill the blank'}
          </p>
        </div>
      </div>
    </>
  )
}
