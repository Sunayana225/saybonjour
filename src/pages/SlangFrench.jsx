import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, ArrowLeftRight, Users, Trophy, ChevronRight } from 'lucide-react'
import { slangExpressions, verlanExamples, formalVsInformal, slangQuiz } from '../data/slangData'
import { addXP } from '../utils/progress'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'

const REGISTER_COLORS = {
  'Verlan':      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'Youth slang': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  'Informal':    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
}

const TABS = [
  { id: 'expressions', label: 'Slang',              icon: Zap },
  { id: 'verlan',      label: 'Verlan',             icon: ArrowLeftRight },
  { id: 'formal',      label: 'Tu vs Vous',         icon: Users },
  { id: 'quiz',        label: 'Quiz',               icon: Trophy },
]

const SlangCard = ({ item }) => {
  const [showNote, setShowNote] = useState(false)
  return (
    <motion.div
      className="bg-white dark:bg-dark-warm-100 rounded-2xl border border-cream-200 dark:border-dark-warm-50 p-4 shadow-sm cursor-pointer"
      whileHover={{ y: -2 }}
      onClick={() => setShowNote(s => !s)}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <div onClick={e => e.stopPropagation()}>
            <SpeakButton text={item.fr} size="sm" variant="ghost" />
          </div>
          <div className="text-base font-bold text-burgundy-700 dark:text-cream-100 italic truncate">"{item.fr}"</div>
        </div>
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

  return (
    <>
      <SEO
        title="French Slang & Verlan — Informal French Expressions | SayBonjour!"
        description="Learn the French slang, verlan, and informal expressions that native speakers actually use. Master colloquial French they don't teach in textbooks — from argot to street talk."
        keywords="french slang, verlan, informal french, colloquial french, french argot, everyday french expressions, learn french slang, french street talk"
        url="/slang-french"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-dark-warm-300 flex">

        {/* ── Left sidebar (desktop) ── */}
        <aside className="hidden md:flex flex-col w-52 shrink-0 sticky top-[60px] h-[calc(100vh-60px)] overflow-y-auto bg-white dark:bg-dark-warm-100 border-r border-cream-200 dark:border-dark-warm-50 pt-5 pb-8">
          <div className="px-4 mb-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Sections</div>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-left w-full transition-all border-r-2 ${tab === t.id ? 'bg-burgundy-50 dark:bg-burgundy-900/20 text-burgundy-700 dark:text-burgundy-300 border-burgundy-600' : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-warm-200 hover:text-gray-900 dark:hover:text-cream-50'}`}>
              <t.icon className="w-4 h-4 shrink-0" />
              {t.label}
              {tab === t.id && <ChevronRight className="w-3.5 h-3.5 ml-auto text-burgundy-500" />}
            </button>
          ))}
        </aside>

        {/* ── Right content area ── */}
        <div className="flex-1 min-w-0">

          {/* Mobile tab bar */}
          <div className="md:hidden sticky top-[60px] z-20 bg-white/95 dark:bg-dark-warm-100/95 backdrop-blur border-b border-cream-200 dark:border-dark-warm-50 px-4 py-2 flex gap-1.5 overflow-x-auto">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex-none flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${tab === t.id ? 'bg-burgundy-600 text-cream-50 shadow-sm' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-warm-200'}`}>
                <t.icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            ))}
          </div>

          <div className="max-w-3xl mx-auto px-4 py-6">

            {/* ── Slang expressions ── */}
            {tab === 'expressions' && (
              <>
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-gray-800 dark:text-cream-50 mb-1">Slang Expressions</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Common slang, verlan, and informal phrases used by French speakers today.</p>
                </div>
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

            {/* ── Verlan ── */}
            {tab === 'verlan' && (
              <div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-cream-50 mb-1">Verlan</h2>
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
                    <div key={i} className="grid grid-cols-3 px-5 py-3 border-t border-cream-100 dark:border-dark-warm-200 text-sm items-center">
                      <div className="text-gray-600 dark:text-gray-300 italic">{v.standard}</div>
                      <div className="flex items-center gap-1.5">
                        <SpeakButton text={v.verlan} size="sm" variant="minimal" />
                        <span className="font-bold text-purple-700 dark:text-purple-400">{v.verlan}</span>
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">{v.meaning}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Tu vs Vous ── */}
            {tab === 'formal' && (
              <div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-cream-50 mb-1">Tu vs Vous</h2>

                {/* Explainer cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                  <div className="bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-700 rounded-2xl p-4">
                    <div className="text-xl font-black text-pink-700 dark:text-pink-300 mb-1 flex items-center gap-2">
                      Tu
                      <span className="text-xs font-semibold bg-pink-200 dark:bg-pink-800 text-pink-800 dark:text-pink-200 px-2 py-0.5 rounded-full">Informal</span>
                    </div>
                    <p className="text-sm text-pink-700 dark:text-pink-200">Used with <strong>friends, family, children</strong> and people your own age. It signals closeness and familiarity.</p>
                    <div className="mt-2 text-xs text-pink-500 dark:text-pink-400 italic">e.g. "Tu viens ce soir?" — Are you coming tonight?</div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-2xl p-4">
                    <div className="text-xl font-black text-blue-700 dark:text-blue-300 mb-1 flex items-center gap-2">
                      Vous
                      <span className="text-xs font-semibold bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full">Formal</span>
                    </div>
                    <p className="text-sm text-blue-700 dark:text-blue-200">Used with <strong>strangers, elders, bosses</strong> and in professional settings. Also used as the plural "you".</p>
                    <div className="mt-2 text-xs text-blue-500 dark:text-blue-400 italic">e.g. "Vous venez ce soir?" — Are you (sir/ma'am) coming tonight?</div>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 mb-5 text-sm text-amber-800 dark:text-amber-200">
                  📌 <strong>Tip:</strong> When in doubt in France, start with <em>vous</em>. The other person will usually invite you to use <em>tu</em> — "On peut se tutoyer!" (We can use tu with each other!)
                </div>

                {/* Comparison table */}
                <div className="bg-white dark:bg-dark-warm-100 rounded-2xl border border-cream-200 dark:border-dark-warm-50 overflow-hidden shadow-sm">
                  <div className="grid grid-cols-3 bg-gray-50 dark:bg-dark-warm-200 px-5 py-3 text-xs font-bold uppercase tracking-wide">
                    <div className="text-blue-600 dark:text-blue-400 flex items-center gap-1">Vous <span className="font-normal normal-case text-gray-400">(formal)</span></div>
                    <div className="text-pink-600 dark:text-pink-400 flex items-center gap-1">Tu <span className="font-normal normal-case text-gray-400">(informal)</span></div>
                    <div className="text-gray-500 dark:text-gray-400">Meaning</div>
                  </div>
                  {formalVsInformal.map((row, i) => (
                    <div key={i} className="grid grid-cols-3 px-5 py-3 border-t border-cream-100 dark:border-dark-warm-200 text-sm items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <SpeakButton text={row.formal} size="sm" variant="minimal" />
                        <span className="text-blue-700 dark:text-blue-300 italic text-xs sm:text-sm leading-snug">{row.formal}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <SpeakButton text={row.informal.split(' / ')[0]} size="sm" variant="minimal" />
                        <span className="font-medium text-pink-700 dark:text-pink-400 italic text-xs sm:text-sm leading-snug">{row.informal}</span>
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">{row.meaning}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'quiz' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 dark:text-cream-50 mb-4">Test Yourself</h2>
                <QuizSection />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
