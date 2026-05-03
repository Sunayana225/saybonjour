import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, CheckCircle, XCircle, RotateCcw, Search } from 'lucide-react'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const FALSE_FRIENDS = [
  { fr: 'actuellement', looks: 'actually', real: 'currently / at the moment', correct: 'en fait / en réalité', example: 'Il travaille actuellement à Paris. (He is currently working in Paris.)', level: 'A2' },
  { fr: 'agenda', looks: 'agenda', real: 'diary / planner (not meeting agenda)', correct: 'ordre du jour', example: 'Mon agenda est plein cette semaine. (My diary is full this week.)', level: 'A2' },
  { fr: 'avertissement', looks: 'advertisement', real: 'warning', correct: 'publicité / annonce', example: 'Un avertissement de tempête. (A storm warning.)', level: 'B1' },
  { fr: 'blesser', looks: 'bless', real: 'to injure / to hurt', correct: 'bénir', example: 'Je me suis blessé au genou. (I hurt my knee.)', level: 'A2' },
  { fr: 'cave', looks: 'cave', real: 'cellar / basement', correct: 'grotte', example: 'Le vin est dans la cave. (The wine is in the cellar.)', level: 'A2' },
  { fr: 'chance', looks: 'chance', real: 'luck (not an opportunity)', correct: 'occasion / possibilité', example: 'Bonne chance ! (Good luck!)', level: 'A1' },
  { fr: 'chair', looks: 'chair', real: 'flesh / meat', correct: 'chaise', example: 'La chair de poulet. (The chicken flesh.)', level: 'A2' },
  { fr: 'chef', looks: 'chef', real: 'head / boss (also a chef)', correct: 'chef cuisinier (for kitchen chef)', example: 'Le chef de l\'entreprise. (The head of the company.)', level: 'A1' },
  { fr: 'coin', looks: 'coin', real: 'corner / spot', correct: 'pièce de monnaie', example: 'Au coin de la rue. (At the corner of the street.)', level: 'A2' },
  { fr: 'conducteur', looks: 'conductor', real: 'driver', correct: 'chef d\'orchestre', example: 'Le conducteur du bus. (The bus driver.)', level: 'B1' },
  { fr: 'décevoir', looks: 'deceive', real: 'to disappoint', correct: 'tromper / induire en erreur', example: 'Tu m\'as déçu. (You disappointed me.)', level: 'B1' },
  { fr: 'démander', looks: 'demand', real: 'to ask (politely)', correct: 'exiger', example: 'Je vous demande de patienter. (I ask you to wait.)', level: 'A2' },
  { fr: 'éventuellement', looks: 'eventually', real: 'possibly / if necessary', correct: 'finalement / à la fin', example: 'Éventuellement, on pourrait changer de date. (We could possibly change the date.)', level: 'B1' },
  { fr: 'formidable', looks: 'formidable', real: 'wonderful / fantastic', correct: 'redoutable / impressionnant', example: 'C\'est formidable ! (That\'s wonderful!)', level: 'A2' },
  { fr: 'gentle', looks: 'gentle', real: '(not a French word — closely confused with "gentil")', correct: '—', example: 'Il est très gentil. (He is very kind.)', level: 'A1' },
  { fr: 'grossier', looks: 'grossly / gross', real: 'rude / vulgar', correct: 'énorme / dégoûtant', example: 'C\'est grossier de parler la bouche pleine. (It\'s rude to talk with your mouth full.)', level: 'B1' },
  { fr: 'inhabitable', looks: 'inhabitable', real: 'uninhabitable', correct: 'habitable', example: 'Cet appartement est inhabitable. (This apartment is uninhabitable.)', level: 'B2' },
  { fr: 'large', looks: 'large', real: 'wide / broad', correct: 'grand', example: 'Une large avenue. (A wide avenue.)', level: 'A2' },
  { fr: 'lecture', looks: 'lecture', real: 'reading', correct: 'conférence / cours magistral', example: 'J\'aime la lecture. (I love reading.)', level: 'A2' },
  { fr: 'librairie', looks: 'library', real: 'bookshop / bookstore', correct: 'bibliothèque', example: 'J\'ai acheté ce livre à la librairie. (I bought this book at the bookshop.)', level: 'A1' },
  { fr: 'location', looks: 'location', real: 'rental / hire', correct: 'emplacement / lieu', example: 'Location de voitures. (Car hire / rental.)', level: 'A2' },
  { fr: 'monnaie', looks: 'money', real: 'change / currency', correct: 'argent', example: 'Avez-vous de la monnaie ? (Do you have change?)', level: 'A2' },
  { fr: 'passer un examen', looks: 'pass an exam', real: 'to take an exam (not necessarily pass)', correct: 'réussir un examen', example: 'J\'ai passé l\'examen hier. (I took the exam yesterday.)', level: 'A2' },
  { fr: 'prétendre', looks: 'pretend', real: 'to claim / to maintain', correct: 'faire semblant', example: 'Il prétend être médecin. (He claims to be a doctor.)', level: 'B1' },
  { fr: 'raisin', looks: 'raisin', real: 'grape (fresh)', correct: 'raisin sec', example: 'Une grappe de raisin. (A bunch of grapes.)', level: 'A1' },
  { fr: 'sensible', looks: 'sensible', real: 'sensitive / emotional', correct: 'raisonnable / sensé', example: 'Elle est très sensible. (She is very sensitive.)', level: 'B1' },
  { fr: 'sympathique', looks: 'sympathetic', real: 'nice / friendly', correct: 'compatissant', example: 'Il est très sympathique. (He is very nice.)', level: 'A2' },
  { fr: 'veste', looks: 'vest', real: 'jacket', correct: 'maillot de corps / gilet', example: 'Une veste en cuir. (A leather jacket.)', level: 'A2' },
]

const LEVELS = ['All', 'A1', 'A2', 'B1', 'B2']

function getQuiz() {
  const pool = [...FALSE_FRIENDS].sort(() => Math.random() - 0.5).slice(0, 8)
  return pool.map(item => {
    const wrongs = FALSE_FRIENDS.filter(f => f.fr !== item.fr).sort(() => Math.random() - 0.5).slice(0, 3)
    const options = [...wrongs.map(w => w.real), item.real].sort(() => Math.random() - 0.5)
    return { ...item, options }
  })
}

export default function FalseFriends() {
  const [tab, setTab] = useState('guide')
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState('All')
  const [expanded, setExpanded] = useState(null)
  const [questions, setQuestions] = useState(getQuiz)
  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const filtered = FALSE_FRIENDS.filter(f => {
    const matchLevel = level === 'All' || f.level === level
    const matchSearch = !search || f.fr.toLowerCase().includes(search.toLowerCase()) || f.looks.toLowerCase().includes(search.toLowerCase())
    return matchLevel && matchSearch
  })

  const q = questions[qIndex]

  const handleAnswer = (opt) => {
    if (selected !== null) return
    setSelected(opt)
    if (opt === q.real) setScore(s => s + 1)
  }

  const nextQ = () => {
    if (qIndex + 1 >= questions.length) { setDone(true); addXP(score * 5, 'quiz_completed') }
    else { setQIndex(i => i + 1); setSelected(null) }
  }

  const restart = () => { setQuestions(getQuiz()); setQIndex(0); setSelected(null); setScore(0); setDone(false) }

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French False Friends | SayBonjour!" description="Master French faux amis — words that look like English but mean something completely different." />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">False Friends</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Les Faux Amis — Words that look English but aren't!</p>
        </div>

        <div className="bg-amber-50 dark:bg-dark-warm-100 border border-amber-200 dark:border-dark-warm-50 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
          <p className="text-sm text-gray-700 dark:text-gray-300">Faux amis (false friends) are French words that resemble English words but have different meanings. These are among the most common mistakes learners make!</p>
        </div>

        <div className="flex gap-3 mb-6">
          {['guide', 'quiz'].map(t => (
            <button key={t} onClick={() => { setTab(t); if (t === 'quiz') restart() }}
              className={`px-5 py-2 rounded-full font-medium text-sm transition-colors capitalize ${tab === t ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
              {t === 'guide' ? `📖 Guide (${FALSE_FRIENDS.length})` : '🧠 Quiz'}
            </button>
          ))}
        </div>

        {tab === 'guide' && (
          <>
            <div className="flex gap-3 flex-wrap mb-4">
              <div className="relative flex-1 min-w-48">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search words…"
                  className="pl-9 w-full px-3 py-2 text-sm border border-gray-200 dark:border-dark-warm-50 rounded-lg bg-white dark:bg-dark-warm-100 text-gray-900 dark:text-cream-50 focus:outline-none focus:border-burgundy-400" />
              </div>
              {LEVELS.map(l => (
                <button key={l} onClick={() => setLevel(l)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${level === l ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50'}`}>
                  {l}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{filtered.length} false friends</p>
            <div className="space-y-3">
              {filtered.map((f, i) => (
                <div key={f.fr} className="bg-white dark:bg-dark-warm-100 rounded-xl border border-gray-100 dark:border-dark-warm-50 shadow-sm overflow-hidden">
                  <button className="w-full text-left px-5 py-4 flex items-center justify-between gap-4" onClick={() => setExpanded(expanded === i ? null : i)}>
                    <div className="flex items-center gap-4 flex-1 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-burgundy-600 text-lg">{f.fr}</span>
                        <SpeakButton text={f.fr} lang="fr-FR" size="sm" />
                      </div>
                      <span className="text-gray-400">≠</span>
                      <div>
                        <span className="text-sm text-red-500 line-through mr-2">{f.looks}</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{f.real}</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${f.level === 'A1' ? 'bg-emerald-100 text-emerald-700' : f.level === 'A2' ? 'bg-blue-100 text-blue-700' : f.level === 'B1' ? 'bg-yellow-100 text-yellow-700' : 'bg-orange-100 text-orange-700'}`}>{f.level}</span>
                    </div>
                  </button>
                  {expanded === i && (
                    <div className="px-5 pb-4 border-t border-gray-100 dark:border-dark-warm-50 pt-3 space-y-2">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div><span className="text-gray-500 dark:text-gray-400">Looks like:</span> <span className="font-medium text-red-500">{f.looks}</span></div>
                        <div><span className="text-gray-500 dark:text-gray-400">Actually means:</span> <span className="font-medium text-green-600">{f.real}</span></div>
                        {f.correct !== '—' && <div className="col-span-2"><span className="text-gray-500 dark:text-gray-400">To say "{f.looks}", use:</span> <span className="font-medium text-blue-600">{f.correct}</span></div>}
                      </div>
                      <div className="bg-gray-50 dark:bg-dark-warm-200 rounded-lg p-3 text-sm text-gray-700 dark:text-gray-300 italic">
                        {f.example}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'quiz' && (
          <div className="max-w-xl mx-auto">
            {done ? (
              <div className="bg-white dark:bg-dark-warm-100 rounded-2xl p-8 text-center shadow border border-gray-100 dark:border-dark-warm-50">
                <div className="text-5xl mb-4">{score >= 6 ? '🎉' : '📚'}</div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-cream-50 mb-2">Quiz Complete!</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">{score}/{questions.length} correct</p>
                <p className="text-sm text-green-600 mb-6">+{score * 5} XP earned</p>
                <button onClick={restart} className="btn-primary flex items-center gap-2 mx-auto"><RotateCcw className="w-4 h-4" /> Try Again</button>
              </div>
            ) : (
              <div className="bg-white dark:bg-dark-warm-100 rounded-2xl p-6 shadow border border-gray-100 dark:border-dark-warm-50">
                <div className="flex justify-between text-sm text-gray-500 mb-4">
                  <span>Question {qIndex + 1} / {questions.length}</span>
                  <span>{score} correct</span>
                </div>
                <div className="text-center mb-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">What does this French word actually mean?</p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-3xl font-bold text-burgundy-600">{q.fr}</span>
                    <SpeakButton text={q.fr} lang="fr-FR" size="md" />
                  </div>
                  <p className="text-sm text-red-400 mt-1">⚠️ It looks like "{q.looks}" but it's NOT!</p>
                </div>
                <div className="space-y-2 mt-4">
                  {q.options.map((opt, i) => {
                    let cls = 'w-full text-left px-4 py-3 rounded-xl border-2 transition-colors text-sm font-medium '
                    if (selected === null) cls += 'border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300 bg-white dark:bg-dark-warm-200 text-gray-800 dark:text-cream-50'
                    else if (opt === q.real) cls += 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                    else if (selected === opt) cls += 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-600'
                    else cls += 'border-gray-200 dark:border-dark-warm-50 opacity-50 bg-white dark:bg-dark-warm-200 text-gray-600 dark:text-gray-400'
                    return <button key={i} className={cls} onClick={() => handleAnswer(opt)}>{opt}</button>
                  })}
                </div>
                {selected !== null && (
                  <div className="mt-4 space-y-2">
                    <div className={`flex items-center gap-2 font-medium text-sm ${selected === q.real ? 'text-green-600' : 'text-red-500'}`}>
                      {selected === q.real ? <><CheckCircle className="w-4 h-4" /> Correct!</> : <><XCircle className="w-4 h-4" /> Correct answer: {q.real}</>}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-dark-warm-200 rounded-lg p-2">{q.example}</div>
                    <div className="flex justify-end"><button onClick={nextQ} className="btn-primary text-sm">Next →</button></div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
