import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mic, Volume2, Star, ChevronRight, Timer } from 'lucide-react'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const TWISTERS = [
  {
    text: 'Si six scies scient six cyprès, six cents scies scient six cents cyprès.',
    trans: 'If six saws saw six cypresses, six hundred saws saw six hundred cypresses.',
    level: 'Hard', focus: 'si / six / scies', tip: 'Focus on the "si" vs "six" distinction — "s" sounds dominate. Say slowly then speed up!',
  },
  {
    text: 'Un chasseur sachant chasser sait chasser sans son chien.',
    trans: 'A hunter who knows how to hunt can hunt without his dog.',
    level: 'Medium', focus: 'ch / s sounds', tip: 'Alternate between "ch" (chasseur) and "s" (sachant, sans). A classic French tongue twister.',
  },
  {
    text: 'Je suis ce que je suis, et si je suis ce que je suis, qu\'est-ce que je suis ?',
    trans: 'I am what I am, and if I am what I am, what am I?',
    level: 'Medium', focus: 'suis / si / ce', tip: 'The key is distinguishing "suis" (am) from "si" (if). A philosophical twist!',
  },
  {
    text: 'Les chaussettes de l\'archiduchesse sont-elles sèches, archi-sèches ?',
    trans: 'Are the archduchess\'s socks dry, completely dry?',
    level: 'Hard', focus: 'ch / ss sounds', tip: 'One of the most famous French virelangues. The "chaussettes" and "sèches" vowel contrast is the challenge.',
  },
  {
    text: 'Ton thé t\'a-t-il ôté ta toux ? Oui, mon thé m\'a ôté ma toux.',
    trans: 'Did your tea take away your cough? Yes, my tea took away my cough.',
    level: 'Medium', focus: 't sounds', tip: 'The "t" sound repeats throughout — keep it crisp and clear without puffing air.',
  },
  {
    text: 'Didon dîna, dit-on, du dos d\'un dodu dindon.',
    trans: 'Didon dined, they say, on the back of a plump turkey.',
    level: 'Easy', focus: 'd sounds', tip: 'All about the "d" sound. Great for practising liaison and nasal vowels.',
  },
  {
    text: 'Trois tortues trottaient sur un trottoir très étroit.',
    trans: 'Three turtles trotted on a very narrow pavement.',
    level: 'Medium', focus: 'tr / t sounds', tip: 'The "tr" clusters with "trois, tortues, trottaient, trottoir, très, étroit" are the challenge.',
  },
  {
    text: 'Pauvre petit pêcheur, prend patience pour pouvoir prendre quelques petits poissons.',
    trans: 'Poor little fisherman, be patient to be able to catch a few small fish.',
    level: 'Medium', focus: 'p sounds', tip: 'Explosive "p" sounds throughout. Make sure not to add a vowel before each "p".',
  },
  {
    text: 'Seize chaises sèchent.',
    trans: 'Sixteen chairs are drying.',
    level: 'Easy', focus: 'seize / sèchent', tip: 'Simple but effective — the "sei" vs "sè" contrast is surprisingly tricky at speed!',
  },
  {
    text: 'Natacha n\'attacha pas son chat Pacha qui s\'échappa. Cela fâcha Natacha.',
    trans: 'Natacha didn\'t tie her cat Pacha who escaped. This annoyed Natacha.',
    level: 'Hard', focus: 'ch / â sounds', tip: 'A narrative tongue twister! The nasal and open "â" sounds alongside "ch" make this tricky.',
  },
]

const LEVELS = { Easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300', Hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' }

export default function TongueTwisters() {
  const [expanded, setExpanded] = useState(0)
  const [practiceMode, setPracticeMode] = useState(false)
  const [practiceIdx, setPracticeIdx] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [mastered, setMastered] = useState([])

  const toggleMastered = (i) => {
    setMastered(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])
    if (!mastered.includes(practiceIdx)) addXP(10, 'lesson_read')
  }

  if (practiceMode) {
    const t = TWISTERS[practiceIdx]
    return (
      <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300 flex flex-col items-center justify-center p-4">
        <SEO title="Tongue Twisters | SayBonjour!" />
        <div className="max-w-xl w-full">
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => setPracticeMode(false)} className="text-sm text-gray-500 hover:text-burgundy-600">← Back to list</button>
            <span className="text-sm text-gray-500">{practiceIdx + 1} / {TWISTERS.length}</span>
          </div>
          <motion.div key={practiceIdx} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow p-8 text-center border border-gray-100 dark:border-dark-warm-50">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${LEVELS[t.level]}`}>{t.level}</span>
            <p className="text-xl font-bold text-gray-900 dark:text-cream-50 mt-6 mb-3 leading-relaxed">{t.text}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-6">{t.trans}</p>
            <div className="flex items-center justify-center gap-3 mb-4">
              <SpeakButton text={t.text} lang="fr-FR" size="lg" />
              <span className="text-sm text-gray-500">Listen first, then try yourself</span>
            </div>
            <div className="bg-amber-50 dark:bg-dark-warm-200 rounded-xl p-4 text-left mb-6">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Focus: {t.focus}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{t.tip}</p>
            </div>
            <div className="flex gap-3 justify-center flex-wrap">
              {practiceIdx > 0 && <button onClick={() => { setPracticeIdx(i => i - 1) }} className="btn-secondary text-sm">← Previous</button>}
              <button onClick={() => toggleMastered(practiceIdx)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mastered.includes(practiceIdx) ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-dark-warm-200 text-gray-700 dark:text-gray-300'}`}>
                {mastered.includes(practiceIdx) ? '✓ Mastered!' : 'Mark Mastered'}
              </button>
              {practiceIdx < TWISTERS.length - 1 && <button onClick={() => { setPracticeIdx(i => i + 1) }} className="btn-primary text-sm">Next →</button>}
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French Tongue Twisters | SayBonjour!" description="Practice French pronunciation with virelangues — French tongue twisters from easy to very hard." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">Tongue Twisters</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Les Virelangues — Train your French pronunciation</p>
          {mastered.length > 0 && <p className="text-sm text-green-600 mt-2">{mastered.length} mastered so far!</p>}
        </div>

        <div className="bg-amber-50 dark:bg-dark-warm-100 border border-amber-200 dark:border-dark-warm-50 rounded-xl p-4 mb-6 flex items-start gap-3">
          <Mic className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <strong>How to practise:</strong> Listen to the audio first, then say it slowly, then increase speed. Tongue twisters are the best workout for French phonemes!
          </div>
        </div>

        <button onClick={() => { setPracticeMode(true); setPracticeIdx(0) }}
          className="btn-primary w-full mb-6 flex items-center justify-center gap-2">
          <Timer className="w-4 h-4" /> Practice Mode — one by one
        </button>

        <div className="space-y-3">
          {TWISTERS.map((t, i) => (
            <div key={i} className={`bg-white dark:bg-dark-warm-100 rounded-xl border shadow-sm overflow-hidden ${mastered.includes(i) ? 'border-green-300 dark:border-green-700' : 'border-gray-100 dark:border-dark-warm-50'}`}>
              <button className="w-full text-left px-5 py-4 flex items-center justify-between gap-4" onClick={() => setExpanded(expanded === i ? null : i)}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${LEVELS[t.level]}`}>{t.level}</span>
                    {mastered.includes(i) && <span className="text-xs text-green-600 font-medium">✓ Mastered</span>}
                  </div>
                  <p className="font-medium text-gray-800 dark:text-cream-50 text-sm leading-snug">{t.text.length > 60 ? t.text.slice(0, 60) + '…' : t.text}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <SpeakButton text={t.text} lang="fr-FR" size="sm" />
                  <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${expanded === i ? 'rotate-90' : ''}`} />
                </div>
              </button>
              {expanded === i && (
                <div className="px-5 pb-4 border-t border-gray-100 dark:border-dark-warm-50 pt-3 space-y-3">
                  <p className="text-base font-semibold text-gray-900 dark:text-cream-50 leading-relaxed">{t.text}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">{t.trans}</p>
                  <div className="bg-gray-50 dark:bg-dark-warm-200 rounded-lg p-3 text-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Pronunciation focus: {t.focus}</p>
                    <p className="text-gray-700 dark:text-gray-300">{t.tip}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setPracticeMode(true); setPracticeIdx(i) }} className="btn-secondary text-sm flex items-center gap-1"><Timer className="w-4 h-4" /> Practice this</button>
                    <button onClick={() => toggleMastered(i)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${mastered.includes(i) ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-dark-warm-200 text-gray-700 dark:text-gray-300 hover:bg-gray-200'}`}>
                      {mastered.includes(i) ? '✓ Mastered' : 'Mark mastered'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
