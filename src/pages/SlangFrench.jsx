import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, BookOpen, ArrowLeftRight, CheckCircle, XCircle } from 'lucide-react'
import { slangExpressions, verlanExamples, formalVsInformal, slangQuiz } from '../data/slangData'
import { addXP } from '../utils/progress'
import SEO from '../components/SEO'

const REGISTER_COLORS = {
  'Verlan': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'Youth slang': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  'Informal': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
}

const SlangCard = ({ item }) => {
  const [showNote, setShowNote] = useState(false)
  return (
    <motion.div
      className="bg-white dark:bg-dark-warm-100 rounded-2xl border border-cream-200 dark:border-dark-warm-50 p-4 shadow-sm cursor-pointer"
      whileHover={{ y: -2 }}
      onClick={() => setShowNote(s => !s)}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="text-base font-bold text-burgundy-700 dark:text-cream-100 italic">"{item.fr}"</div>
        <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${REGISTER_COLORS[item.register] || 'bg-gray-100 dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300'}`}>
          {item.register}
        </span>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">{item.en}</div>
      <AnimatePresence>
        {showNote && item.note && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3 py-2 border border-amber-100 dark:border-amber-700 mt-2 overflow-hidden">
            💡 {item.note}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="text-xs text-gray-400 mt-1">{showNote ? 'Tap to hide note' : 'Tap for note'}</div>
    </motion.div>
  )
}

const QuizSection = () => {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const score = Object.entries(answers).filter(([i, a]) => slangQuiz[+i].answer === a).length

  const handleSubmit = () => {
    setSubmitted(true)
    addXP(score * 8, 'slang_quiz')
  }

  return (
    <div>
      <div className="space-y-4 mb-6">
        {slangQuiz.map((q, i) => (
          <div key={i} className="bg-white dark:bg-dark-warm-100 rounded-2xl border border-cream-200 dark:border-dark-warm-50 p-5 shadow-sm">
            <p className="font-medium text-gray-800 dark:text-cream-50 mb-3 text-sm">{i + 1}. {q.q}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {q.options.map((opt, j) => {
                let cls = 'text-left px-4 py-2 rounded-xl text-sm border transition-all '
                if (!submitted) {
                  cls += answers[i] === j ? 'bg-burgundy-100 dark:bg-burgundy-900/40 border-burgundy-400 text-burgundy-800 dark:text-cream-50 font-medium' : 'bg-gray-50 dark:bg-dark-warm-200 border-cream-200 dark:border-dark-warm-50 text-gray-700 dark:text-gray-300 hover:border-burgundy-300'
                } else {
                  if (q.answer === j) cls += 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-400 text-emerald-800 dark:text-emerald-300 font-medium'
                  else if (answers[i] === j) cls += 'bg-red-50 dark:bg-red-900/20 border-red-300 text-red-700 dark:text-red-400'
                  else cls += 'bg-gray-50 dark:bg-dark-warm-200 border-gray-200 dark:border-dark-warm-50 text-gray-400'
                }
                return (
                  <button key={j} onClick={() => !submitted && setAnswers(a => ({ ...a, [i]: j }))} className={cls}>
                    <span className="font-bold mr-2">{String.fromCharCode(65 + j)}.</span>{opt}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      {!submitted ? (
        <button onClick={handleSubmit} disabled={Object.keys(answers).length < slangQuiz.length}
          className="w-full py-3 bg-burgundy-600 text-cream-50 rounded-xl font-medium hover:bg-burgundy-700 disabled:opacity-50 transition-colors">
          Submit Quiz
        </button>
      ) : (
        <div className={`p-5 rounded-2xl text-center border ${score >= 6 ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200' : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200'}`}>
          <div className="text-3xl mb-2">{score >= 7 ? '🔥' : score >= 5 ? '⭐' : '📚'}</div>
          <div className="font-bold text-gray-800 dark:text-cream-50 text-lg">{score}/{slangQuiz.length} correct</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">+{score * 8} XP earned</div>
          <button onClick={() => { setAnswers({}); setSubmitted(false) }}
            className="mt-3 px-5 py-2 bg-burgundy-600 text-cream-50 rounded-xl text-sm font-medium hover:bg-burgundy-700 transition-colors">
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}

export default function SlangFrench() {
  const [tab, setTab] = useState('expressions')
  const [regFilter, setRegFilter] = useState('All')

  const filtered = regFilter === 'All' ? slangExpressions : slangExpressions.filter(e => e.register === regFilter)

  const tabs = [
    { id: 'expressions', label: 'Slang' },
    { id: 'verlan', label: 'Verlan' },
    { id: 'formal', label: 'Formal vs Informal' },
    { id: 'quiz', label: 'Quiz' },
  ]

  return (
    <>
      <SEO title="French Slang | SayBonjour" url="/slang-french" />
      <div className="min-h-screen bg-gray-50 dark:bg-dark-warm-300">
        <div className="bg-gradient-to-r from-burgundy-800 to-burgundy-600 text-cream-50 py-10 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center bg-cream-50/20 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                <Zap className="w-4 h-4 mr-2" /> Street French
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                Slang & Informal French
              </h1>
              <p className="text-cream-100 max-w-lg mx-auto">
                Sound like a real Parisian. Learn verlan, youth slang, informal expressions and when to use them.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex gap-1 bg-white dark:bg-dark-warm-100 border border-cream-200 dark:border-dark-warm-50 rounded-2xl p-1 mb-6 overflow-x-auto">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex-1 min-w-[80px] py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${tab === t.id ? 'bg-burgundy-600 text-cream-50 shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-cream-50 dark:hover:bg-dark-warm-200'}`}>
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'expressions' && (
            <>
              <div className="flex gap-2 flex-wrap mb-4">
                {['All', 'Verlan', 'Youth slang', 'Informal'].map(r => (
                  <button key={r} onClick={() => setRegFilter(r)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${regFilter === r ? 'bg-burgundy-600 text-cream-50' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-cream-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
                    {r}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filtered.map((item, i) => <SlangCard key={i} item={item} />)}
              </div>
            </>
          )}

          {tab === 'verlan' && (
            <div>
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-2xl p-5 mb-5">
                <h3 className="font-bold text-purple-800 dark:text-purple-300 mb-2">What is Verlan?</h3>
                <p className="text-sm text-purple-700 dark:text-purple-200">
                  Verlan (itself a verlan of "l'envers" = the reverse) is a French argot where syllables of words are reversed.
                  It originated in the suburbs of Paris and is widely used by French youth. Knowing verlan helps you understand
                  music, films and everyday conversation among young French speakers.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-warm-100 rounded-2xl border border-cream-200 dark:border-dark-warm-50 overflow-hidden shadow-sm">
                <div className="grid grid-cols-3 bg-gray-50 dark:bg-dark-warm-200 px-5 py-2.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  <div>Standard</div>
                  <div className="text-purple-600 dark:text-purple-400">Verlan</div>
                  <div>Meaning</div>
                </div>
                {verlanExamples.map((v, i) => (
                  <div key={i} className="grid grid-cols-3 px-5 py-3 border-t border-cream-100 dark:border-dark-warm-200 text-sm">
                    <div className="text-gray-600 dark:text-gray-300 italic">{v.standard}</div>
                    <div className="font-bold text-purple-700 dark:text-purple-400">{v.verlan}</div>
                    <div className="text-gray-500 dark:text-gray-400">{v.meaning}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'formal' && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-5 bg-blue-50 dark:bg-blue-900/20 rounded-xl px-4 py-3 border border-blue-100 dark:border-blue-700">
                📌 One key skill in French is knowing <strong>when to use formal vs informal language</strong>. 
                With friends and family, informal is natural. In professional or formal settings, always use formal French.
              </p>
              <div className="bg-white dark:bg-dark-warm-100 rounded-2xl border border-cream-200 dark:border-dark-warm-50 overflow-hidden shadow-sm">
                <div className="grid grid-cols-3 bg-gray-50 dark:bg-dark-warm-200 px-5 py-2.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  <div>Formal</div>
                  <div className="text-pink-600 dark:text-pink-400">Informal</div>
                  <div>Meaning</div>
                </div>
                {formalVsInformal.map((row, i) => (
                  <div key={i} className="grid grid-cols-3 px-5 py-3 border-t border-cream-100 dark:border-dark-warm-200 text-sm">
                    <div className="text-blue-700 dark:text-blue-300 italic text-xs sm:text-sm">{row.formal}</div>
                    <div className="font-medium text-pink-700 dark:text-pink-400 italic text-xs sm:text-sm">{row.informal}</div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">{row.meaning}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'quiz' && <QuizSection />}
        </div>
      </div>
    </>
  )
}
