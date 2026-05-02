import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, BookOpen, MessageSquare, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { businessVocab, businessPhrases, businessDialogues, businessQuiz } from '../data/businessData'
import { addXP } from '../utils/progress'
import SEO from '../components/SEO'

const CATEGORIES = ['All', 'Roles', 'Meetings', 'Finance', 'Legal', 'Strategy']

const VocabCard = ({ item }) => {
  const [flipped, setFlipped] = useState(false)
  return (
    <motion.div className="cursor-pointer h-24" onClick={() => setFlipped(f => !f)} whileHover={{ y: -2 }}>
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait">
          {!flipped ? (
            <motion.div key="front" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white dark:bg-dark-warm-100 rounded-xl border border-cream-200 dark:border-dark-warm-50 flex flex-col items-center justify-center p-3 shadow-sm">
              <div className="text-xs text-gray-400 mb-1">French</div>
              <div className="text-sm font-bold text-center text-gray-800 dark:text-cream-50">{item.fr}</div>
            </motion.div>
          ) : (
            <motion.div key="back" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-burgundy-50 dark:bg-burgundy-900/30 rounded-xl border border-burgundy-200 dark:border-burgundy-700 flex flex-col items-center justify-center p-3">
              <div className="text-xs text-burgundy-400 mb-1">English</div>
              <div className="text-sm font-bold text-center text-burgundy-800 dark:text-cream-50">{item.en}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

const PhraseSection = ({ section }) => {
  const [open, setOpen] = useState(true)
  return (
    <div className="bg-white dark:bg-dark-warm-100 rounded-2xl border border-cream-200 dark:border-dark-warm-50 overflow-hidden shadow-sm mb-4">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-cream-50 dark:hover:bg-dark-warm-200 transition-colors">
        <h3 className="font-bold text-gray-800 dark:text-cream-50">{section.category}</h3>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="px-5 pb-4 space-y-3">
              {section.phrases.map((p, i) => (
                <div key={i} className="flex gap-4 items-start py-2 border-b border-cream-100 dark:border-dark-warm-200 last:border-0">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-burgundy-800 dark:text-cream-100 italic">"{p.fr}"</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{p.en}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const DialogueView = ({ dialogue }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-white dark:bg-dark-warm-100 rounded-2xl border border-cream-200 dark:border-dark-warm-50 overflow-hidden shadow-sm mb-4">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-cream-50 dark:hover:bg-dark-warm-200 transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full">{dialogue.level}</span>
            <h3 className="font-bold text-gray-800 dark:text-cream-50">{dialogue.title}</h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">{dialogue.englishTitle}</p>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="px-5 pb-4">
              <div className="space-y-2 mb-4">
                {dialogue.lines.map((line, i) => (
                  <div key={i} className={`flex gap-3 ${i % 2 === 0 ? '' : 'flex-row-reverse'}`}>
                    <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${i % 2 === 0 ? 'bg-burgundy-50 dark:bg-burgundy-900/30 text-gray-800 dark:text-cream-100 rounded-tl-sm' : 'bg-gray-100 dark:bg-dark-warm-200 text-gray-700 dark:text-cream-200 rounded-tr-sm'}`}>
                      <div className="text-xs font-bold mb-0.5 text-gray-500 dark:text-gray-400">{line.speaker}</div>
                      {line.text}
                    </div>
                  </div>
                ))}
              </div>
              {dialogue.notes?.length > 0 && (
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 border border-amber-100 dark:border-amber-700">
                  <div className="text-xs font-bold text-amber-700 dark:text-amber-300 mb-1.5">📝 Notes</div>
                  {dialogue.notes.map((n, i) => (
                    <div key={i} className="text-xs text-amber-800 dark:text-amber-200 mb-0.5">• {n}</div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const QuizSection = () => {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const score = Object.entries(answers).filter(([i, a]) => businessQuiz[i].answer === a).length

  const handleSubmit = () => {
    setSubmitted(true)
    addXP(score * 10, 'business_quiz')
  }

  return (
    <div>
      <div className="space-y-5 mb-6">
        {businessQuiz.map((q, i) => (
          <div key={i} className="bg-white dark:bg-dark-warm-100 rounded-2xl border border-cream-200 dark:border-dark-warm-50 p-5 shadow-sm">
            <p className="font-medium text-gray-800 dark:text-cream-50 mb-3 text-sm">{i + 1}. {q.q}</p>
            <div className="grid grid-cols-1 gap-2">
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
        <button onClick={handleSubmit} disabled={Object.keys(answers).length < businessQuiz.length}
          className="w-full py-3 bg-burgundy-600 text-cream-50 rounded-xl font-medium hover:bg-burgundy-700 disabled:opacity-50 transition-colors">
          Submit Quiz
        </button>
      ) : (
        <div className={`p-5 rounded-2xl text-center border ${score >= 4 ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200' : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200'}`}>
          <div className="text-3xl mb-2">{score >= 5 ? '🏆' : score >= 4 ? '⭐' : '📚'}</div>
          <div className="font-bold text-gray-800 dark:text-cream-50 text-lg">{score}/{businessQuiz.length} correct</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">+{score * 10} XP earned</div>
          <button onClick={() => { setAnswers({}); setSubmitted(false) }}
            className="mt-3 px-5 py-2 bg-burgundy-600 text-cream-50 rounded-xl text-sm font-medium hover:bg-burgundy-700 transition-colors">
            Retry
          </button>
        </div>
      )}
    </div>
  )
}

export default function BusinessFrench() {
  const [tab, setTab] = useState('vocabulary')
  const [catFilter, setCatFilter] = useState('All')

  const filteredVocab = catFilter === 'All' ? businessVocab : businessVocab.filter(v => v.category === catFilter)

  const tabs = [
    { id: 'vocabulary', label: 'Vocabulary', icon: BookOpen },
    { id: 'phrases', label: 'Phrases', icon: MessageSquare },
    { id: 'dialogues', label: 'Dialogues', icon: MessageSquare },
    { id: 'quiz', label: 'Quiz', icon: CheckCircle },
  ]

  return (
    <>
      <SEO title="Business French | SayBonjour" url="/business-french" />
      <div className="min-h-screen bg-gray-50 dark:bg-dark-warm-300">
        <div className="bg-gradient-to-r from-burgundy-800 to-burgundy-600 text-cream-50 py-10 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center bg-cream-50/20 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                <Briefcase className="w-4 h-4 mr-2" /> Professional French
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                Business French
              </h1>
              <p className="text-cream-100 max-w-lg mx-auto">
                Master professional French for the workplace — vocabulary, formal phrases, business dialogues and a quiz.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex gap-1 bg-white dark:bg-dark-warm-100 border border-cream-200 dark:border-dark-warm-50 rounded-2xl p-1 mb-6 flex-wrap">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === t.id ? 'bg-burgundy-600 text-cream-50 shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-cream-50 dark:hover:bg-dark-warm-200'}`}>
                <t.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>

          {tab === 'vocabulary' && (
            <>
              <div className="flex gap-2 flex-wrap mb-4">
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => setCatFilter(c)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${catFilter === c ? 'bg-burgundy-600 text-cream-50' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-cream-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
                    {c}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredVocab.map((item, i) => <VocabCard key={i} item={item} />)}
              </div>
              <p className="text-xs text-gray-400 text-center mt-4">Click a card to flip it</p>
            </>
          )}

          {tab === 'phrases' && businessPhrases.map((section, i) => <PhraseSection key={i} section={section} />)}
          {tab === 'dialogues' && businessDialogues.map(d => <DialogueView key={d.id} dialogue={d} />)}
          {tab === 'quiz' && <QuizSection />}
        </div>
      </div>
    </>
  )
}
