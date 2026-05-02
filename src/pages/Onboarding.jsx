import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, CheckCircle, Eye, Mic, BookOpen } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { getProgress, saveProgress } from '../utils/progress'

const GOALS = [
  { value: 'travel', label: '✈️ Travel to France', desc: 'Survive and thrive as a tourist' },
  { value: 'conversation', label: '💬 Hold a conversation', desc: 'Chat with native speakers' },
  { value: 'exam', label: '📝 Pass DELF exam', desc: 'Formal language certification' },
  { value: 'business', label: '💼 Business French', desc: 'Workplace and professional French' },
  { value: 'culture', label: '🎨 Enjoy French culture', desc: 'Films, music, literature' },
  { value: 'fun', label: '😊 Just for fun', desc: 'Learn at your own pace' },
]

const LEARNING_STYLES = [
  { value: 'visual', label: '👀 Visual Learner', desc: 'I love diagrams, color-coding, and visual examples', icon: Eye, prefs: { visual: 70, audio: 15, reading: 15 } },
  { value: 'audio', label: '🎧 Audio Learner', desc: 'I learn best by listening and speaking', icon: Mic, prefs: { visual: 15, audio: 70, reading: 15 } },
  { value: 'reading', label: '📖 Reading/Writing Learner', desc: 'I prefer texts, grammar rules, and writing exercises', icon: BookOpen, prefs: { visual: 15, audio: 15, reading: 70 } },
  { value: 'mixed', label: '🎯 Mixed Approach', desc: 'A balanced mix of all learning styles', prefs: { visual: 34, audio: 33, reading: 33 } },
]

const LEVEL_QUESTIONS = [
  { q: 'What does "Bonjour" mean?', options: ['Good night', 'Hello', 'Thank you', 'Please'], answer: 1 },
  { q: 'Which article is used with "maison" (house)?', options: ['le', 'la', 'les', 'un'], answer: 1 },
  { q: 'Conjugate "parler" for "nous":', options: ['parlez', 'parlons', 'parlent', 'parle'], answer: 1 },
  { q: '"J\'ai mangé" is which tense?', options: ['Imparfait', 'Futur', 'Passé composé', 'Présent'], answer: 2 },
  { q: 'Which pronoun is used with "dont"?', options: ['Subject', 'Replaces de + noun', 'Time/place', 'Object'], answer: 1 },
  { q: '"Il faut que tu parles" uses which mood?', options: ['Indicatif', 'Conditionnel', 'Subjonctif', 'Impératif'], answer: 2 },
  { q: 'The passive voice uses être + ___', options: ['Present participle', 'Past participle', 'Infinitive', 'Subjonctif'], answer: 1 },
  { q: 'Which register is "T\'inquiète, c\'est bon!"?', options: ['Soutenu', 'Courant', 'Familier', 'Littéraire'], answer: 2 },
]

const calculateLevel = (answers) => {
  let score = 0
  LEVEL_QUESTIONS.forEach((q, i) => { if (answers[i] === q.answer) score++ })
  if (score <= 2) return 'A1'
  if (score <= 4) return 'A2'
  if (score <= 6) return 'B1'
  if (score <= 7) return 'B2'
  return 'C1'
}

const levelDescs = {
  A1: 'Absolute Beginner — we\'ll start from the very basics',
  A2: 'Elementary — you know the basics, let\'s build on them',
  B1: 'Intermediate — you can hold simple conversations',
  B2: 'Upper-Intermediate — complex topics are within reach',
  C1: 'Advanced — impressive! Let\'s refine your French',
}

const STEPS = ['goal', 'time', 'style', 'quiz', 'result']
const STEP_LABELS = { goal: 'Your Goal', time: 'Daily Time', style: 'Learning Style', quiz: 'Level Check', result: 'Done!' }

export default function Onboarding() {
  const [step, setStep] = useState('goal')
  const [goal, setGoal] = useState('')
  const [dailyMins, setDailyMins] = useState(10)
  const [learningStyle, setLearningStyle] = useState('')
  const [quizAnswers, setQuizAnswers] = useState({})
  const [currentQ, setCurrentQ] = useState(0)
  const [result, setResult] = useState(null)
  const { updateProfile } = useUser()
  const navigate = useNavigate()

  const stepIdx = STEPS.indexOf(step)

  const handleAnswer = (ai) => {
    const newAnswers = { ...quizAnswers, [currentQ]: ai }
    setQuizAnswers(newAnswers)
    if (currentQ < LEVEL_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQ(q => q + 1), 350)
    } else {
      const level = calculateLevel(newAnswers)
      setResult(level)
      setStep('result')
      const prog = getProgress()
      prog.cefrLevel = level
      saveProgress(prog)
      const styleDef = LEARNING_STYLES.find(s => s.value === learningStyle)
      try {
        updateProfile({
          goal,
          cefr_level: level,
          daily_goal_mins: dailyMins,
          learning_prefs: styleDef?.prefs || { visual: 34, audio: 33, reading: 33 }
        })
      } catch {}
    }
  }

  const btnCls = 'mt-5 w-full py-3 bg-gold-400 text-white rounded-xl font-bold hover:bg-gold-500 disabled:opacity-40 transition-colors flex items-center justify-center gap-2'

  return (
    <div className="min-h-screen bg-gradient-to-br from-burgundy-800 via-burgundy-700 to-burgundy-600 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🇫🇷</div>
          <h1 className="text-2xl font-bold text-cream-50">Let's personalise your learning</h1>

          <div className="flex items-center justify-center gap-1.5 mt-3">
            {STEPS.filter(s => s !== 'result').map((s, i) => (
              <div key={s} className="flex items-center gap-1.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  i < stepIdx ? 'bg-gold-400 text-white' : i === stepIdx ? 'bg-white text-burgundy-800' : 'bg-white/20 text-white/50'
                }`}>
                  {i < stepIdx ? '✓' : i + 1}
                </div>
                {i < STEPS.filter(s => s !== 'result').length - 1 && (
                  <div className={`w-8 h-0.5 ${i < stepIdx ? 'bg-gold-400' : 'bg-white/20'}`} />
                )}
              </div>
            ))}
          </div>
          <p className="text-cream-200/70 text-xs mt-2">{STEP_LABELS[step]}</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'goal' && (
            <motion.div key="goal" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h2 className="text-cream-50 font-bold text-lg mb-4">Why are you learning French?</h2>
                <div className="grid grid-cols-1 gap-2">
                  {GOALS.map(g => (
                    <button key={g.value} onClick={() => setGoal(g.value)}
                      className={`flex items-center gap-3 p-4 rounded-xl text-left transition-all ${goal === g.value ? 'bg-cream-50 text-burgundy-800 shadow-md' : 'bg-white/10 text-cream-50 hover:bg-white/20'}`}>
                      <span className="text-2xl">{g.label.split(' ')[0]}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{g.label.slice(g.label.indexOf(' ') + 1)}</div>
                        <div className={`text-xs ${goal === g.value ? 'text-burgundy-600' : 'text-cream-200'}`}>{g.desc}</div>
                      </div>
                      {goal === g.value && <CheckCircle className="w-5 h-5 text-burgundy-600 flex-shrink-0" />}
                    </button>
                  ))}
                </div>
                <button onClick={() => goal && setStep('time')} disabled={!goal} className={btnCls}>
                  Continue <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 'time' && (
            <motion.div key="time" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h2 className="text-cream-50 font-bold text-lg mb-4">How many minutes per day?</h2>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[5, 10, 15, 20, 30, 45].map(mins => (
                    <button key={mins} onClick={() => setDailyMins(mins)}
                      className={`py-4 rounded-xl font-bold text-lg transition-all ${dailyMins === mins ? 'bg-cream-50 text-burgundy-800 shadow-md' : 'bg-white/10 text-cream-50 hover:bg-white/20'}`}>
                      {mins}<span className="text-sm font-normal"> min</span>
                    </button>
                  ))}
                </div>
                <button onClick={() => setStep('style')} className={btnCls}>
                  Continue <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 'style' && (
            <motion.div key="style" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h2 className="text-cream-50 font-bold text-lg mb-1">How do you learn best?</h2>
                <p className="text-cream-200/70 text-sm mb-4">We'll personalise your content based on your learning style</p>
                <div className="grid grid-cols-1 gap-2">
                  {LEARNING_STYLES.map(s => (
                    <button key={s.value} onClick={() => setLearningStyle(s.value)}
                      className={`flex items-center gap-3 p-4 rounded-xl text-left transition-all ${learningStyle === s.value ? 'bg-cream-50 text-burgundy-800 shadow-md' : 'bg-white/10 text-cream-50 hover:bg-white/20'}`}>
                      <span className="text-2xl">{s.label.split(' ')[0]}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{s.label.slice(s.label.indexOf(' ') + 1)}</div>
                        <div className={`text-xs ${learningStyle === s.value ? 'text-burgundy-600' : 'text-cream-200'}`}>{s.desc}</div>
                      </div>
                      {learningStyle === s.value && <CheckCircle className="w-5 h-5 text-burgundy-600 flex-shrink-0" />}
                    </button>
                  ))}
                </div>
                <button onClick={() => learningStyle && setStep('quiz')} disabled={!learningStyle} className={btnCls}>
                  Take level assessment <ChevronRight className="w-5 h-5" />
                </button>
                <button onClick={() => { setLearningStyle('mixed'); setStep('quiz') }}
                  className="mt-2 w-full text-center text-cream-200/60 text-sm hover:text-cream-200 transition-colors">
                  Skip this step
                </button>
              </div>
            </motion.div>
          )}

          {step === 'quiz' && (
            <motion.div key={`q-${currentQ}`} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex gap-1 mb-5">
                  {LEVEL_QUESTIONS.map((_, i) => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i < currentQ ? 'bg-gold-400' : i === currentQ ? 'bg-cream-50' : 'bg-white/20'}`} />
                  ))}
                </div>
                <p className="text-cream-200/60 text-xs mb-1">Question {currentQ + 1} of {LEVEL_QUESTIONS.length}</p>
                <h2 className="text-cream-50 font-bold text-lg mb-5">{LEVEL_QUESTIONS[currentQ].q}</h2>
                <div className="space-y-2">
                  {LEVEL_QUESTIONS[currentQ].options.map((opt, ai) => (
                    <button key={ai} onClick={() => handleAnswer(ai)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all font-medium ${
                        quizAnswers[currentQ] === ai ? 'bg-cream-50 text-burgundy-800' : 'bg-white/10 text-cream-50 hover:bg-white/20'
                      }`}>
                      <span className="font-bold mr-2">{String.fromCharCode(65 + ai)}.</span> {opt}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 'result' && result && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
                  className="text-7xl font-black text-cream-50 mb-2">{result}
                </motion.div>
                <div className="text-gold-300 font-bold text-xl mb-2">Your starting level</div>
                <p className="text-cream-200 text-sm mb-6">{levelDescs[result]}</p>
                <div className="bg-white/10 rounded-xl p-4 mb-6 text-left text-sm text-cream-50 space-y-2">
                  <div className="flex justify-between"><span className="text-cream-200/70">Goal</span><span className="font-medium">{GOALS.find(g => g.value === goal)?.label}</span></div>
                  <div className="flex justify-between"><span className="text-cream-200/70">Daily target</span><span className="font-medium">{dailyMins} minutes</span></div>
                  <div className="flex justify-between"><span className="text-cream-200/70">Learning style</span><span className="font-medium capitalize">{LEARNING_STYLES.find(s => s.value === learningStyle)?.label?.slice(LEARNING_STYLES.find(s => s.value === learningStyle)?.label?.indexOf(' ') + 1) || 'Mixed'}</span></div>
                </div>
                <motion.button onClick={() => navigate('/profile')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gold-400 text-white rounded-xl font-bold hover:bg-gold-500 transition-colors text-lg">
                  Start learning! 🚀
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
