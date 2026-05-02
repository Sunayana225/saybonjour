import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, ChevronRight, CheckCircle, XCircle, ArrowLeft } from 'lucide-react'
import { readingPassages } from '../data/readingData'
import { addXP } from '../utils/progress'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'

const levelColors = {
  A1: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  A2: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  B1: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  B2: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
}

const PassageQuiz = ({ passage, onBack }) => {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [showVocab, setShowVocab] = useState(false)

  const score = submitted
    ? passage.questions.filter((q, i) => answers[i] === q.answer).length
    : 0

  const handleSubmit = () => {
    if (Object.keys(answers).length < passage.questions.length) return
    const computedScore = passage.questions.filter((q, i) => answers[i] === q.answer).length
    setSubmitted(true)
    addXP(computedScore * 10, 'reading_comprehension')
  }

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
      <button onClick={onBack} className="flex items-center gap-2 text-burgundy-600 dark:text-burgundy-400 text-sm font-medium mb-5 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to passages
      </button>

      <div className="bg-white dark:bg-dark-warm-100 rounded-2xl border border-cream-200 dark:border-dark-warm-50 overflow-hidden shadow-sm mb-5">
        <div className="bg-burgundy-600 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-cream-50">{passage.title}</h2>
            <p className="text-cream-200 text-sm">{passage.englishTitle}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${levelColors[passage.level]}`}>
            {passage.level}
          </span>
        </div>
        <div className="p-6">
          <div className="flex items-start gap-2 mb-3">
            <SpeakButton text={passage.text} size="sm" variant="ghost" />
            <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">Listen to passage</span>
          </div>
          <div className="prose max-w-none text-gray-800 dark:text-cream-50 text-sm leading-relaxed whitespace-pre-line font-serif">
            {passage.text}
          </div>
        </div>
      </div>

      {/* Vocabulary */}
      {passage.vocab?.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-700 p-4 mb-5">
          <button onClick={() => setShowVocab(v => !v)} className="flex items-center gap-2 text-sm font-bold text-amber-800 dark:text-amber-300 w-full text-left">
            📚 Key Vocabulary {showVocab ? '▲' : '▼'}
          </button>
          {showVocab && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {passage.vocab.map((v, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <SpeakButton text={v.word} size="sm" variant="ghost" />
                  <span className="font-bold text-amber-800 dark:text-amber-300 min-w-fit">{v.word}</span>
                  <span className="text-amber-700 dark:text-amber-400">— {v.def}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Questions */}
      <div className="bg-white dark:bg-dark-warm-100 rounded-2xl border border-cream-200 dark:border-dark-warm-50 p-6 shadow-sm">
        <h3 className="font-bold text-burgundy-800 dark:text-cream-50 mb-5">Comprehension Questions</h3>
        <div className="space-y-5">
          {passage.questions.map((q, qi) => (
            <div key={qi}>
              <p className="text-sm font-medium text-gray-800 dark:text-cream-50 mb-2">
                {qi + 1}. {q.q}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.options.map((opt, ai) => {
                  const isSelected = answers[qi] === ai
                  const isCorrect = q.answer === ai
                  let cls = 'text-left px-3 py-2 rounded-lg text-sm border transition-all '
                  if (!submitted) {
                    cls += isSelected
                      ? 'bg-burgundy-100 dark:bg-burgundy-900/40 border-burgundy-400 text-burgundy-800 dark:text-cream-50 font-medium'
                      : 'bg-cream-50 dark:bg-dark-warm-200 border-cream-200 dark:border-dark-warm-50 text-gray-700 dark:text-gray-300 hover:border-burgundy-300'
                  } else {
                    if (isCorrect) cls += 'bg-green-100 dark:bg-green-900/30 border-green-400 text-green-800 dark:text-green-300 font-medium'
                    else if (isSelected) cls += 'bg-red-100 dark:bg-red-900/30 border-red-400 text-red-700 dark:text-red-400'
                    else cls += 'bg-gray-50 dark:bg-dark-warm-200 border-gray-200 dark:border-dark-warm-50 text-gray-400'
                  }
                  return (
                    <button key={ai} onClick={() => !submitted && setAnswers(a => ({ ...a, [qi]: ai }))} className={cls}>
                      <span className="font-semibold mr-1">{String.fromCharCode(65 + ai)}.</span> {opt}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {!submitted ? (
          <button onClick={handleSubmit} disabled={Object.keys(answers).length < passage.questions.length}
            className="mt-6 px-6 py-2.5 bg-burgundy-600 text-cream-50 rounded-xl text-sm font-medium hover:bg-burgundy-700 disabled:opacity-50 transition-colors">
            Submit Answers
          </button>
        ) : (
          <div className="mt-6 flex items-center gap-4">
            <div className={`flex items-center gap-2 text-sm font-bold ${score === passage.questions.length ? 'text-green-600 dark:text-green-400' : 'text-burgundy-600 dark:text-burgundy-400'}`}>
              {score === passage.questions.length
                ? <CheckCircle className="w-5 h-5" />
                : <XCircle className="w-5 h-5" />}
              {score}/{passage.questions.length} correct — +{score * 10} XP
            </div>
            <button onClick={() => { setAnswers({}); setSubmitted(false) }}
              className="text-sm text-gray-500 hover:underline">Try again</button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

const ReadingComprehension = () => {
  const [selected, setSelected] = useState(null)
  const [levelFilter, setLevelFilter] = useState('All')

  const levels = ['All', 'A1', 'A2', 'B1', 'B2']
  const filtered = levelFilter === 'All' ? readingPassages : readingPassages.filter(p => p.level === levelFilter)

  return (
    <>
      <SEO
        title="French Reading Comprehension — Graded Passages A1 to B2 | SayBonjour!"
        description="Improve your French reading with graded texts from A1 beginner to B2 upper-intermediate. Each passage includes comprehension questions, vocabulary highlights, and audio support."
        keywords="french reading comprehension, french passages, graded french texts, french A1 A2 B1 B2, learn to read french, DELF reading practice, french reading exercises"
        url="/reading"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-dark-warm-300">
        <div className="bg-gradient-to-r from-burgundy-800 to-burgundy-600 text-cream-50 py-10 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center bg-cream-50/20 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                <BookOpen className="w-4 h-4 mr-2" /> Reading Practice
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                Reading Comprehension
              </h1>
              <p className="text-cream-100 max-w-lg mx-auto">
                Read authentic French passages from A1 to B2, build vocabulary, and test your understanding.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            {selected ? (
              <PassageQuiz key="quiz" passage={selected} onBack={() => setSelected(null)} />
            ) : (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex gap-2 mb-6 flex-wrap">
                  {levels.map(l => (
                    <button key={l} onClick={() => setLevelFilter(l)}
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${levelFilter === l ? 'bg-burgundy-600 text-cream-50' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-cream-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
                      {l}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filtered.map(p => (
                    <motion.button
                      key={p.id}
                      onClick={() => setSelected(p)}
                      className="bg-white dark:bg-dark-warm-100 rounded-2xl border border-cream-200 dark:border-dark-warm-50 p-5 text-left hover:border-burgundy-300 hover:shadow-md transition-all group"
                      whileHover={{ y: -3 }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${levelColors[p.level]}`}>{p.level}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-burgundy-500 transition-colors" />
                      </div>
                      <h3 className="font-bold text-burgundy-800 dark:text-cream-50 mb-1">{p.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-3">{p.englishTitle}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {p.questions.length} questions · +{p.questions.length * 10} XP possible
                      </p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}

export default ReadingComprehension
