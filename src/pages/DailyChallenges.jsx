import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, CheckCircle, Clock, Star, Lock, RotateCcw, Send } from 'lucide-react'
import { addXP, getProgress } from '../utils/progress'
import { addWordToSRS } from '../utils/srs'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'

const today = () => new Date().toISOString().split('T')[0]
const STORE_KEY = 'saybonjour_daily'

const getDailyStore = () => {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {} } catch { return {} }
}
const saveDailyStore = (d) => localStorage.setItem(STORE_KEY, JSON.stringify(d))

const DAILY_VOCAB = [
  [
    { id: 'dv1', french: 'le soleil', english: 'the sun', category: 'Nature' },
    { id: 'dv2', french: 'la pluie', english: 'the rain', category: 'Nature' },
    { id: 'dv3', french: 'le vent', english: 'the wind', category: 'Nature' },
    { id: 'dv4', french: 'la neige', english: 'the snow', category: 'Nature' },
    { id: 'dv5', french: 'l\'arc-en-ciel', english: 'the rainbow', category: 'Nature' },
  ],
  [
    { id: 'dv6', french: 'le café', english: 'coffee / café', category: 'Food' },
    { id: 'dv7', french: 'le croissant', english: 'croissant', category: 'Food' },
    { id: 'dv8', french: 'le fromage', english: 'cheese', category: 'Food' },
    { id: 'dv9', french: 'la baguette', english: 'baguette', category: 'Food' },
    { id: 'dv10', french: 'le vin', english: 'wine', category: 'Food' },
  ],
  [
    { id: 'dv11', french: 'le train', english: 'train', category: 'Travel' },
    { id: 'dv12', french: 'l\'avion', english: 'plane', category: 'Travel' },
    { id: 'dv13', french: 'la voiture', english: 'car', category: 'Travel' },
    { id: 'dv14', french: 'le métro', english: 'subway', category: 'Travel' },
    { id: 'dv15', french: 'le taxi', english: 'taxi', category: 'Travel' },
  ],
  [
    { id: 'dv16', french: 'heureux/heureuse', english: 'happy', category: 'Feelings' },
    { id: 'dv17', french: 'triste', english: 'sad', category: 'Feelings' },
    { id: 'dv18', french: 'fatigué(e)', english: 'tired', category: 'Feelings' },
    { id: 'dv19', french: 'surpris(e)', english: 'surprised', category: 'Feelings' },
    { id: 'dv20', french: 'calme', english: 'calm', category: 'Feelings' },
  ],
  [
    { id: 'dv21', french: 'lire', english: 'to read', category: 'Verbs' },
    { id: 'dv22', french: 'écrire', english: 'to write', category: 'Verbs' },
    { id: 'dv23', french: 'chanter', english: 'to sing', category: 'Verbs' },
    { id: 'dv24', french: 'danser', english: 'to dance', category: 'Verbs' },
    { id: 'dv25', french: 'cuisiner', english: 'to cook', category: 'Verbs' },
  ],
  [
    { id: 'dv26', french: 'le travail', english: 'work', category: 'Business' },
    { id: 'dv27', french: 'la réunion', english: 'meeting', category: 'Business' },
    { id: 'dv28', french: 'le collègue', english: 'colleague', category: 'Business' },
    { id: 'dv29', french: 'le bureau', english: 'office / desk', category: 'Business' },
    { id: 'dv30', french: 'la présentation', english: 'presentation', category: 'Business' },
  ],
  [
    { id: 'dv31', french: 'la santé', english: 'health', category: 'Health' },
    { id: 'dv32', french: 'le médecin', english: 'doctor', category: 'Health' },
    { id: 'dv33', french: 'l\'hôpital', english: 'hospital', category: 'Health' },
    { id: 'dv34', french: 'le médicament', english: 'medicine', category: 'Health' },
    { id: 'dv35', french: 'se sentir bien', english: 'to feel well', category: 'Health' },
  ],
]

const DAILY_QUIZZES = [
  {
    title: 'Greetings & Basics',
    questions: [
      { q: '"How are you?" (informal)', options: ['Comment allez-vous?', 'Comment ça va?', 'Qui êtes-vous?', 'Où allez-vous?'], answer: 1 },
      { q: '"Thank you very much"', options: ['Merci beaucoup', 'S\'il vous plaît', 'De rien', 'Bonjour'], answer: 0 },
      { q: '"Goodbye" (formal)', options: ['Salut', 'À bientôt', 'Au revoir', 'Bonsoir'], answer: 2 },
    ]
  },
  {
    title: 'Numbers & Time',
    questions: [
      { q: 'How do you say "twenty"?', options: ['dix', 'quinze', 'vingt', 'trente'], answer: 2 },
      { q: '"Half past two" = deux heures ___', options: ['et quart', 'et demie', 'moins le quart', 'du matin'], answer: 1 },
      { q: '"Yesterday" in French:', options: ['aujourd\'hui', 'demain', 'hier', 'maintenant'], answer: 2 },
    ]
  },
  {
    title: 'Colours & Descriptions',
    questions: [
      { q: '"Red" in French:', options: ['bleu', 'vert', 'rouge', 'jaune'], answer: 2 },
      { q: 'Feminine form of "blanc":', options: ['blanche', 'blanque', 'blanc', 'blanci'], answer: 0 },
      { q: '"The black cat" (le chat ___)', options: ['noir', 'noire', 'noirs', 'noiru'], answer: 0 },
    ]
  },
  {
    title: 'Food & Dining',
    questions: [
      { q: '"I am hungry" = J\'ai ___', options: ['soif', 'faim', 'chaud', 'froid'], answer: 1 },
      { q: '"The bill, please"', options: ['Le menu, s\'il vous plaît', 'L\'addition, s\'il vous plaît', 'Une table, s\'il vous plaît', 'Du pain, s\'il vous plaît'], answer: 1 },
      { q: '"Without" in French:', options: ['avec', 'sans', 'pour', 'sur'], answer: 1 },
    ]
  },
  {
    title: 'Present Tense',
    questions: [
      { q: '"We speak" (parler):', options: ['parlons', 'parlez', 'parlent', 'parle'], answer: 0 },
      { q: '"She goes" (aller):', options: ['va', 'vais', 'allons', 'allez'], answer: 0 },
      { q: '"They have" (avoir):', options: ['avons', 'avez', 'ont', 'as'], answer: 2 },
    ]
  },
  {
    title: 'Prepositions & Place',
    questions: [
      { q: '"In front of" = ___', options: ['derrière', 'devant', 'entre', 'sous'], answer: 1 },
      { q: '"Next to" in French:', options: ['loin de', 'à côté de', 'au milieu de', 'en face de'], answer: 1 },
      { q: '"I live IN France" = J\'habite ___ France', options: ['à', 'en', 'au', 'aux'], answer: 1 },
    ]
  },
  [
    {
      title: 'Negation Practice',
      questions: [
        { q: '"I never eat meat":', options: ['Je ne mange pas de viande', 'Je ne mange jamais de viande', 'Je mange jamais viande', 'Je pas mange viande'], answer: 1 },
        { q: '"He no longer smokes":', options: ['Il ne fume plus', 'Il ne fume jamais', 'Il fume plus', 'Il ne fume rien'], answer: 0 },
        { q: '"She sees nobody":', options: ['Elle ne voit pas', 'Elle ne voit rien', 'Elle ne voit personne', 'Elle voit personne'], answer: 2 },
      ]
    }
  ],
]

const getDayIndex = () => {
  const start = new Date('2024-01-01')
  const now = new Date()
  return Math.floor((now - start) / (1000 * 60 * 60 * 24)) % DAILY_VOCAB.length
}

const VocabChallenge = ({ words, onComplete, completed }) => {
  const [inputs, setInputs] = useState({})      // wordId -> typed string
  const [results, setResults] = useState({})    // wordId -> { isCorrect, submitted }
  const [added, setAdded] = useState([])
  const inputRefs = useRef({})

  const normalize = (s) => s.toLowerCase().trim().replace(/[.,!?'"]/g, '').replace(/\s+/g, ' ')

  const handleSubmit = (word) => {
    const typed = (inputs[word.id] || '').trim()
    if (!typed) return
    const correct = normalize(typed) === normalize(word.english)
    setResults(r => ({ ...r, [word.id]: { submitted: true, isCorrect: correct } }))
  }

  const handleKeyDown = (e, word) => {
    if (e.key === 'Enter') handleSubmit(word)
  }

  const handleAdd = (word) => {
    addWordToSRS(word)
    setAdded(a => [...a, word.id])
  }

  const allSubmitted = words.every(w => results[w.id]?.submitted)
  const correctCount = words.filter(w => results[w.id]?.isCorrect).length

  return (
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
        Type the English meaning for each French word, then press Enter or hit Submit.
      </p>
      <div className="space-y-3 mb-4">
        {words.map((word, i) => {
          const res = results[word.id]
          const isSubmitted = !!res?.submitted

          return (
            <motion.div
              key={word.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`rounded-xl border p-3.5 transition-all ${
                !isSubmitted
                  ? 'bg-white dark:bg-dark-warm-200 border-gray-200 dark:border-dark-warm-50'
                  : res.isCorrect
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                  : 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700'
              }`}
            >
              {/* French word row */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <SpeakButton text={word.french} size="sm" variant="ghost" />
                  <span className="font-bold text-burgundy-800 dark:text-cream-50 text-sm">
                    {word.french}
                  </span>
                </div>
                {isSubmitted && (
                  <div className="flex items-center gap-1.5">
                    {res.isCorrect ? (
                      <span className="text-xs font-semibold text-green-700 dark:text-green-400 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Correct!
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                        Close — <span className="text-gray-700 dark:text-gray-300">{word.english}</span>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Input row */}
              {!isSubmitted ? (
                <div className="flex gap-2">
                  <input
                    ref={el => inputRefs.current[word.id] = el}
                    type="text"
                    value={inputs[word.id] || ''}
                    onChange={e => setInputs(inp => ({ ...inp, [word.id]: e.target.value }))}
                    onKeyDown={e => handleKeyDown(e, word)}
                    disabled={completed}
                    placeholder="Type English meaning…"
                    className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-dark-warm-50 bg-gray-50 dark:bg-dark-warm-100 text-gray-800 dark:text-cream-50 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-burgundy-400 transition-all"
                  />
                  <motion.button
                    onClick={() => handleSubmit(word)}
                    disabled={!(inputs[word.id] || '').trim() || completed}
                    className="px-3 py-2 bg-burgundy-600 text-cream-50 rounded-lg text-xs font-semibold hover:bg-burgundy-700 disabled:opacity-40 transition-colors flex items-center gap-1.5"
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send className="w-3 h-3" /> Submit
                  </motion.button>
                </div>
              ) : (
                /* Revealed answer row */
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Your answer: </span>
                    <span className={`font-medium ${res.isCorrect ? 'text-green-700 dark:text-green-400' : 'text-amber-700 dark:text-amber-400'}`}>
                      {inputs[word.id] || '—'}
                    </span>
                    {!res.isCorrect && (
                      <span className="text-gray-400 dark:text-gray-500 ml-2 text-xs">
                        (correct: <span className="font-semibold text-gray-600 dark:text-gray-300">{word.english}</span>)
                      </span>
                    )}
                  </div>
                  {!added.includes(word.id) ? (
                    <button
                      onClick={() => handleAdd(word)}
                      className="text-xs px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-800/40 transition-colors whitespace-nowrap"
                    >
                      + Add to deck
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Added
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Score summary + complete button */}
      <AnimatePresence>
        {allSubmitted && !completed && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-3 text-sm">
              <span className="text-gray-600 dark:text-gray-300">
                Score: <span className="font-bold text-gray-800 dark:text-cream-50">{correctCount}/{words.length}</span> correct
              </span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">+30 XP</span>
            </div>
            <button
              onClick={onComplete}
              className="w-full py-2.5 bg-burgundy-600 text-cream-50 rounded-xl text-sm font-semibold hover:bg-burgundy-700 transition-colors"
            >
              Complete Challenge (+30 XP)
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {completed && (
        <div className="text-center text-emerald-600 dark:text-emerald-400 font-semibold text-sm flex items-center justify-center gap-2">
          <CheckCircle className="w-4 h-4" /> Completed! +30 XP earned
        </div>
      )}
    </div>
  )
}

const QuizChallenge = ({ quiz, onComplete, completed }) => {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const score = submitted ? quiz.questions.filter((q, i) => answers[i] === q.answer).length : 0

  const handleSubmit = () => {
    setSubmitted(true)
    onComplete(score * 15)
  }

  return (
    <div>
      <div className="space-y-4 mb-4">
        {quiz.questions.map((q, qi) => (
          <div key={qi}>
            <p className="text-sm font-medium text-gray-800 dark:text-cream-50 mb-2">{qi + 1}. {q.q}</p>
            <div className="grid grid-cols-1 gap-1.5">
              {q.options.map((opt, ai) => {
                let cls = 'text-left px-3 py-2 rounded-lg text-sm border transition-all '
                if (!submitted) {
                  cls += answers[qi] === ai ? 'bg-burgundy-100 dark:bg-burgundy-900/40 border-burgundy-400 text-burgundy-800 dark:text-cream-50 font-medium' : 'bg-white dark:bg-dark-warm-200 border-cream-200 dark:border-dark-warm-50 text-gray-700 dark:text-gray-300 hover:border-burgundy-300'
                } else {
                  if (q.answer === ai) cls += 'bg-green-100 dark:bg-green-900/30 border-green-400 text-green-800 dark:text-green-300 font-medium'
                  else if (answers[qi] === ai) cls += 'bg-red-100 dark:bg-red-900/30 border-red-400 text-red-700 dark:text-red-400'
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
      {!submitted && !completed ? (
        <button onClick={handleSubmit} disabled={Object.keys(answers).length < quiz.questions.length}
          className="w-full py-2.5 bg-burgundy-600 text-cream-50 rounded-xl text-sm font-medium hover:bg-burgundy-700 disabled:opacity-50 transition-colors">
          Submit Answers
        </button>
      ) : (
        <div className="text-center text-emerald-600 dark:text-emerald-400 font-semibold text-sm flex items-center justify-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {completed ? 'Already completed today!' : `${score}/${quiz.questions.length} correct — +${score * 15} XP`}
        </div>
      )}
    </div>
  )
}

const TranslationChallenge = ({ onComplete, completed }) => {
  const SENTENCES = [
    { french: 'Je voudrais un café, s\'il vous plaît.', english: 'I would like a coffee, please.' },
    { french: 'Où est la gare?', english: 'Where is the train station?' },
    { french: 'Il fait beau aujourd\'hui.', english: 'The weather is nice today.' },
    { french: 'Je ne comprends pas.', english: 'I don\'t understand.' },
    { french: 'Combien ça coûte?', english: 'How much does it cost?' },
  ]
  const idx = getDayIndex() % SENTENCES.length
  const sentence = SENTENCES[idx]
  const [input, setInput] = useState('')
  const [checked, setChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const normalize = (s) => s.toLowerCase().trim().replace(/[.,!?']/g, '').replace(/\s+/g, ' ')

  const handleCheck = () => {
    const correct = normalize(input) === normalize(sentence.english)
    setIsCorrect(correct)
    setChecked(true)
    if (correct) onComplete(25)
    else onComplete(10)
  }

  return (
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Translate this sentence to English:</p>
      <div className="bg-burgundy-50 dark:bg-burgundy-900/20 rounded-xl p-4 border border-burgundy-200 dark:border-burgundy-700 mb-4">
        <p className="text-lg font-bold text-burgundy-800 dark:text-cream-50">{sentence.french}</p>
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        disabled={checked || completed}
        placeholder="Type your English translation..."
        className="w-full px-4 py-3 border border-cream-300 dark:border-dark-warm-50 rounded-xl text-sm bg-white dark:bg-dark-warm-200 text-gray-800 dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-burgundy-400 resize-none mb-3"
        rows={2}
      />
      {checked && (
        <div className={`p-3 rounded-xl mb-3 text-sm ${isCorrect ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200'}`}>
          {isCorrect ? '✅ Perfect!' : `💡 Suggested: "${sentence.english}"`}
        </div>
      )}
      {!checked && !completed ? (
        <button onClick={handleCheck} disabled={!input.trim()}
          className="w-full py-2.5 bg-burgundy-600 text-cream-50 rounded-xl text-sm font-medium hover:bg-burgundy-700 disabled:opacity-50 transition-colors">
          Check Answer
        </button>
      ) : (
        <div className="text-center text-emerald-600 dark:text-emerald-400 font-semibold text-sm flex items-center justify-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {completed ? 'Already completed today!' : `+${isCorrect ? 25 : 10} XP earned`}
        </div>
      )}
    </div>
  )
}

const DailyChallenges = () => {
  const [store, setStore] = useState(getDailyStore())
  const dayIdx = getDayIndex()
  const todayKey = today()
  const todayStore = store[todayKey] || {}
  const vocabWords = DAILY_VOCAB[dayIdx]
  const quiz = Array.isArray(DAILY_QUIZZES[dayIdx]) ? DAILY_QUIZZES[dayIdx][0] : DAILY_QUIZZES[dayIdx]
  const totalXP = [todayStore.vocab ? 30 : 0, todayStore.quiz || 0, todayStore.translation || 0].reduce((a, b) => a + b, 0)

  const markComplete = (key, xp) => {
    const newStore = { ...store, [todayKey]: { ...todayStore, [key]: xp } }
    setStore(newStore)
    saveDailyStore(newStore)
    addXP(xp, `daily_${key}`)
    window.dispatchEvent(new Event('progressUpdated'))
  }

  const [activeChallenge, setActiveChallenge] = useState(null)

  const challenges = [
    {
      id: 'vocab',
      title: 'Vocabulary Sprint',
      desc: `Learn ${vocabWords.length} new words about "${vocabWords[0]?.category}"`,
      xp: 30,
      icon: '📚',
      color: 'from-emerald-500 to-emerald-600',
      completed: !!todayStore.vocab,
    },
    {
      id: 'quiz',
      title: 'Grammar Quiz',
      desc: quiz?.title || 'Quick grammar check',
      xp: 45,
      icon: '🧠',
      color: 'from-blue-500 to-blue-600',
      completed: !!todayStore.quiz,
    },
    {
      id: 'translation',
      title: 'Translation Challenge',
      desc: 'Translate a French sentence to English',
      xp: 25,
      icon: '✍️',
      color: 'from-purple-500 to-purple-600',
      completed: !!todayStore.translation,
    },
  ]

  const allDone = challenges.every(c => c.completed)

  return (
    <>
      <SEO
        title="Daily French Challenges — Build a Streak & Earn XP | SayBonjour!"
        description="Complete a new French challenge every day to maintain your streak and earn experience points. Daily vocabulary, grammar, translation, and listening exercises for all levels."
        keywords="daily french challenges, french daily practice, french streak, learn french daily, french exercises, french XP, french vocabulary challenge"
        url="/daily-challenges"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-dark-warm-300">
        <div className="bg-gradient-to-r from-burgundy-800 to-burgundy-600 text-cream-50 py-10 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center bg-cream-50/20 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                <Zap className="w-4 h-4 mr-2" /> Daily Challenges
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                Today's Challenges
              </h1>
              <p className="text-cream-100 mb-4">Complete all 3 daily challenges to earn bonus XP. Resets at midnight.</p>
              <div className="flex justify-center gap-6 text-sm">
                <div><div className="text-2xl font-bold text-amber-300">{totalXP}</div><div className="text-cream-200 text-xs">XP earned today</div></div>
                <div><div className="text-2xl font-bold">{challenges.filter(c => c.completed).length}/3</div><div className="text-cream-200 text-xs">Completed</div></div>
                <div><div className="text-2xl font-bold text-emerald-300">{allDone ? '🎉' : '100'}</div><div className="text-cream-200 text-xs">Bonus XP if all done</div></div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8">
          {allDone && (
            <motion.div
              className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-2xl p-5 text-white text-center mb-6 shadow-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="text-3xl mb-2">🎉</div>
              <div className="font-bold text-lg">All challenges complete!</div>
              <div className="text-sm opacity-90">Come back tomorrow for new challenges</div>
            </motion.div>
          )}

          <div className="space-y-4">
            {challenges.map((ch, i) => (
              <motion.div
                key={ch.id}
                className="bg-white dark:bg-dark-warm-100 rounded-2xl border border-cream-200 dark:border-dark-warm-50 overflow-hidden shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <button
                  onClick={() => setActiveChallenge(activeChallenge === ch.id ? null : ch.id)}
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-cream-50 dark:hover:bg-dark-warm-200 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${ch.color} flex items-center justify-center text-2xl flex-shrink-0 shadow-sm ${ch.completed ? 'opacity-70' : ''}`}>
                    {ch.completed ? '✅' : ch.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-800 dark:text-cream-50">{ch.title}</h3>
                      {ch.completed && <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">Done</span>}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{ch.desc}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold text-amber-500">+{ch.xp} XP</div>
                  </div>
                </button>

                <AnimatePresence>
                  {activeChallenge === ch.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-cream-100 dark:border-dark-warm-50"
                    >
                      <div className="p-5">
                        {ch.id === 'vocab' && (
                          <VocabChallenge
                            words={vocabWords}
                            completed={ch.completed}
                            onComplete={() => markComplete('vocab', 30)}
                          />
                        )}
                        {ch.id === 'quiz' && (
                          <QuizChallenge
                            quiz={quiz}
                            completed={ch.completed}
                            onComplete={(xp) => markComplete('quiz', xp)}
                          />
                        )}
                        {ch.id === 'translation' && (
                          <TranslationChallenge
                            completed={ch.completed}
                            onComplete={(xp) => markComplete('translation', xp)}
                          />
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            Challenges reset daily at midnight
          </div>
        </div>
      </div>
    </>
  )
}

export default DailyChallenges
