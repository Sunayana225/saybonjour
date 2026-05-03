import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, X, CheckCircle, XCircle, Zap, ChevronRight, Trophy } from 'lucide-react'
import { getProgress, addXP } from '../utils/progress'

const QUESTIONS = [
  { q: "How do you say 'Good morning' in French?", options: ['Bonsoir', 'Bonjour', 'Bonne nuit', 'Salut'], correct: 1 },
  { q: "What does 'Je m'appelle' mean?", options: ['I am from', 'I like', 'My name is', 'I have'], correct: 2 },
  { q: "Which is the correct translation of 'Thank you'?", options: ['S\'il vous plaît', 'Excusez-moi', 'Merci', 'De rien'], correct: 2 },
  { q: "How do you say 'I love French' in French?", options: ["J'aime le français", "Je parle français", "Je suis français", "Je mange français"], correct: 0 },
  { q: "What does 'Au revoir' mean?", options: ['Hello', 'Please', 'Goodbye', 'Sorry'], correct: 2 },
  { q: "Which word means 'beautiful' in French?", options: ['Petit', 'Grand', 'Beau', 'Vieux'], correct: 2 },
  { q: "How do you say 'I don't understand' in French?", options: ['Je comprends', 'Je ne comprends pas', 'Je parle', 'Je sais'], correct: 1 },
  { q: "What does 'C'est la vie' mean?", options: ["It's the night", "It's the city", "It's the life", "It's the day"], correct: 2 },
]

function getTodayDate() {
  return new Date().toISOString().split('T')[0]
}
function getYesterdayDate() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

function pickQuestions(n = 5) {
  const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}

export default function StreakSaver() {
  const [visible, setVisible] = useState(false)
  const [streak, setStreak] = useState(0)
  const [phase, setPhase] = useState('alert')
  const [questions] = useState(() => pickQuestions(5))
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [correct, setCorrect] = useState(0)
  const [answers, setAnswers] = useState([])
  const [done, setDone] = useState(false)

  useEffect(() => {
    const today = getTodayDate()
    const yesterday = getYesterdayDate()
    const dismissKey = `sb_streak_saver_${today}`
    if (localStorage.getItem(dismissKey)) return

    const progress = getProgress()
    if (progress.streak >= 2 && progress.lastStudyDate === yesterday) {
      setStreak(progress.streak)
      const timer = setTimeout(() => setVisible(true), 3500)
      return () => clearTimeout(timer)
    }
  }, [])

  const dismiss = useCallback(() => {
    localStorage.setItem(`sb_streak_saver_${getTodayDate()}`, '1')
    setVisible(false)
  }, [])

  const startLesson = () => setPhase('lesson')

  const handleAnswer = (idx) => {
    if (selected !== null) return
    setSelected(idx)
    const isCorrect = idx === questions[current].correct
    if (isCorrect) setCorrect(c => c + 1)
    setAnswers(prev => [...prev, isCorrect])

    setTimeout(() => {
      if (current + 1 >= questions.length) {
        addXP(25, 'streak_saver')
        localStorage.setItem(`sb_streak_saver_${getTodayDate()}`, '1')
        setDone(true)
        setPhase('done')
      } else {
        setCurrent(c => c + 1)
        setSelected(null)
      }
    }, 900)
  }

  if (!visible) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          className="bg-white dark:bg-dark-warm-100 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          {phase === 'alert' && (
            <AlertPhase streak={streak} onStart={startLesson} onDismiss={dismiss} />
          )}
          {phase === 'lesson' && !done && (
            <LessonPhase
              questions={questions}
              current={current}
              selected={selected}
              answers={answers}
              onAnswer={handleAnswer}
            />
          )}
          {phase === 'done' && (
            <DonePhase streak={streak} correct={correct} total={questions.length} onClose={dismiss} />
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

function AlertPhase({ streak, onStart, onDismiss }) {
  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
            <Flame className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide">Streak at risk!</p>
            <h2 className="text-lg font-bold text-gray-900 dark:text-cream-50" style={{ fontFamily: 'Playfair Display, serif' }}>
              {streak}-day streak ending soon
            </h2>
          </div>
        </div>
        <button onClick={onDismiss} className="w-7 h-7 rounded-full bg-gray-100 dark:bg-dark-warm-200 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl p-4 mb-5">
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          You haven't studied today! Take a quick <span className="font-semibold text-orange-600 dark:text-orange-400">2-minute emergency lesson</span> to keep your {streak}-day streak alive. Just 5 questions — you've got this!
        </p>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-orange-700 dark:text-orange-400">
            <Zap className="w-3.5 h-3.5" /> 5 quick questions
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-orange-700 dark:text-orange-400">
            <Flame className="w-3.5 h-3.5" /> +25 XP earned
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onDismiss}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-dark-warm-200 hover:bg-gray-200 dark:hover:bg-dark-warm-50 transition-colors">
          Skip for now
        </button>
        <button onClick={onStart}
          className="flex-[2] py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 transition-all shadow-sm flex items-center justify-center gap-2">
          Save my streak <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function LessonPhase({ questions, current, selected, answers, onAnswer }) {
  const q = questions[current]
  const progress = ((current) / questions.length) * 100

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 bg-gray-100 dark:bg-dark-warm-200 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-2 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full"
            initial={{ width: `${progress}%` }}
            animate={{ width: `${((current) / questions.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 shrink-0">{current + 1}/{questions.length}</span>
      </div>

      <div className="mb-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wide mb-3">
          <Flame className="w-3.5 h-3.5" /> Streak Saver
        </span>
        <h3 className="text-base font-semibold text-gray-800 dark:text-cream-50 leading-snug">{q.q}</h3>
      </div>

      <div className="space-y-2.5 mt-5">
        {q.options.map((opt, idx) => {
          let cls = 'w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all '
          if (selected === null) {
            cls += 'border-gray-200 dark:border-dark-warm-50 bg-white dark:bg-dark-warm-200 text-gray-700 dark:text-cream-50 hover:border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20'
          } else if (idx === q.correct) {
            cls += 'border-green-400 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
          } else if (idx === selected) {
            cls += 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
          } else {
            cls += 'border-gray-100 dark:border-dark-warm-50 bg-white dark:bg-dark-warm-200 text-gray-400 dark:text-gray-500 opacity-60'
          }

          return (
            <button key={idx} onClick={() => onAnswer(idx)} disabled={selected !== null} className={cls}>
              <span className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-gray-100 dark:bg-dark-warm-100 text-xs font-bold text-gray-500 flex items-center justify-center shrink-0">
                  {String.fromCharCode(65 + idx)}
                </span>
                {opt}
                {selected !== null && idx === q.correct && <CheckCircle className="w-4 h-4 ml-auto text-green-500 shrink-0" />}
                {selected !== null && idx === selected && idx !== q.correct && <XCircle className="w-4 h-4 ml-auto text-red-500 shrink-0" />}
              </span>
            </button>
          )
        })}
      </div>

      <div className="flex justify-center gap-1.5 mt-5">
        {questions.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all ${
            i < answers.length
              ? answers[i] ? 'w-5 bg-green-400' : 'w-5 bg-red-400'
              : i === current ? 'w-5 bg-orange-400' : 'w-3 bg-gray-200 dark:bg-dark-warm-50'
          }`} />
        ))}
      </div>
    </div>
  )
}

function DonePhase({ streak, correct, total, onClose }) {
  const allCorrect = correct === total
  return (
    <div className="p-6 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center mx-auto mb-4 shadow-lg"
      >
        {allCorrect ? <Trophy className="w-8 h-8 text-white" /> : <Flame className="w-8 h-8 text-white" />}
      </motion.div>

      <h2 className="text-xl font-bold text-gray-900 dark:text-cream-50 mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
        🔥 Streak saved!
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
        You got <span className="font-semibold text-gray-700 dark:text-gray-200">{correct}/{total}</span> correct
      </p>
      <p className="text-sm font-medium text-orange-600 dark:text-orange-400 mb-5">
        Your {streak}-day streak lives on — great work!
      </p>

      <div className="flex justify-center gap-2 mb-5">
        {Array.from({ length: total }).map((_, i) => (
          i < correct
            ? <CheckCircle key={i} className="w-5 h-5 text-green-500" />
            : <XCircle key={i} className="w-5 h-5 text-red-400" />
        ))}
      </div>

      <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl px-4 py-3 mb-5 inline-flex items-center gap-2 text-sm font-semibold text-orange-700 dark:text-orange-400">
        <Zap className="w-4 h-4" /> +25 XP earned
      </div>

      <button onClick={onClose}
        className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl transition-all shadow-sm">
        Continue learning
      </button>
    </div>
  )
}
