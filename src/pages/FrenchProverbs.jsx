import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Heart, Share2, Shuffle, ChevronDown, ChevronUp } from 'lucide-react'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const PROVERBS = [
  {
    fr: 'Mieux vaut tard que jamais.',
    en: 'Better late than never.',
    literal: 'Better is late than never.',
    category: 'Time & Patience',
    context: 'Used when someone does something delayed but still does it.',
    level: 'A2',
  },
  {
    fr: 'L\'habit ne fait pas le moine.',
    en: 'Don\'t judge a book by its cover.',
    literal: 'The habit does not make the monk.',
    category: 'Wisdom',
    context: 'Appearance can be deceptive — a person\'s clothes don\'t reveal their character.',
    level: 'B1',
  },
  {
    fr: 'Il ne faut pas vendre la peau de l\'ours avant de l\'avoir tué.',
    en: 'Don\'t count your chickens before they hatch.',
    literal: 'Don\'t sell the bear\'s skin before killing it.',
    category: 'Caution',
    context: 'Don\'t celebrate or rely on something before it actually happens.',
    level: 'B2',
  },
  {
    fr: 'Qui vivra verra.',
    en: 'Time will tell. / Only time will tell.',
    literal: 'Who will live will see.',
    category: 'Time & Patience',
    context: 'Used to express that the future is uncertain.',
    level: 'A2',
  },
  {
    fr: 'Les chiens aboient, la caravane passe.',
    en: 'Let the world say what it will.',
    literal: 'The dogs bark, the caravan passes.',
    category: 'Resilience',
    context: 'Critics make noise but don\'t stop progress.',
    level: 'B2',
  },
  {
    fr: 'Il n\'y a pas de fumée sans feu.',
    en: 'There\'s no smoke without fire.',
    literal: 'There is no smoke without fire.',
    category: 'Truth',
    context: 'Rumours usually have some basis in truth.',
    level: 'A2',
  },
  {
    fr: 'Vouloir, c\'est pouvoir.',
    en: 'Where there\'s a will, there\'s a way.',
    literal: 'To want is to be able to.',
    category: 'Determination',
    context: 'If you really want something, you can achieve it.',
    level: 'A1',
  },
  {
    fr: 'Pierre qui roule n\'amasse pas mousse.',
    en: 'A rolling stone gathers no moss.',
    literal: 'A rolling stone does not gather moss.',
    category: 'Wisdom',
    context: 'A person who never settles doesn\'t build lasting relationships or wealth.',
    level: 'B1',
  },
  {
    fr: 'Chat échaudé craint l\'eau froide.',
    en: 'Once bitten, twice shy.',
    literal: 'A scalded cat fears cold water.',
    category: 'Experience',
    context: 'Someone who has been hurt once is very cautious afterwards.',
    level: 'B1',
  },
  {
    fr: 'La nuit, tous les chats sont gris.',
    en: 'In the dark, all cats are grey.',
    literal: 'At night, all cats are grey.',
    category: 'Perspective',
    context: 'In certain situations, differences don\'t matter.',
    level: 'B1',
  },
  {
    fr: 'Petit à petit, l\'oiseau fait son nid.',
    en: 'Little by little, the bird builds its nest.',
    literal: 'Little by little, the bird makes its nest.',
    category: 'Perseverance',
    context: 'Steady, consistent effort leads to great results.',
    level: 'A2',
  },
  {
    fr: 'Dis-moi qui tu fréquentes, je te dirai qui tu es.',
    en: 'Tell me who your friends are and I\'ll tell you who you are.',
    literal: 'Tell me who you associate with, I will tell you who you are.',
    category: 'Character',
    context: 'People reflect their social circle.',
    level: 'B1',
  },
  {
    fr: 'Après la pluie, le beau temps.',
    en: 'Every cloud has a silver lining.',
    literal: 'After the rain, good weather.',
    category: 'Hope',
    context: 'Things get better after difficult times.',
    level: 'A2',
  },
  {
    fr: 'On n\'attrape pas les mouches avec du vinaigre.',
    en: 'You catch more flies with honey than with vinegar.',
    literal: 'One doesn\'t catch flies with vinegar.',
    category: 'Diplomacy',
    context: 'Kindness is more effective than harshness.',
    level: 'B2',
  },
  {
    fr: 'Les absents ont toujours tort.',
    en: 'The absent are always wrong.',
    literal: 'The absent are always wrong.',
    category: 'Society',
    context: 'Those who aren\'t present can\'t defend themselves.',
    level: 'B1',
  },
  {
    fr: 'Un tiens vaut mieux que deux tu l\'auras.',
    en: 'A bird in the hand is worth two in the bush.',
    literal: 'One "I have" is worth more than two "you will have".',
    category: 'Caution',
    context: 'Something certain is better than something uncertain.',
    level: 'B2',
  },
  {
    fr: 'Tel père, tel fils.',
    en: 'Like father, like son.',
    literal: 'Such father, such son.',
    category: 'Family',
    context: 'Children often resemble or imitate their parents.',
    level: 'A2',
  },
  {
    fr: 'On ne fait pas d\'omelette sans casser des œufs.',
    en: 'You can\'t make an omelette without breaking eggs.',
    literal: 'One doesn\'t make an omelette without breaking eggs.',
    category: 'Determination',
    context: 'Achieving a goal requires some sacrifice or effort.',
    level: 'B1',
  },
  {
    fr: 'Loin des yeux, loin du cœur.',
    en: 'Out of sight, out of mind.',
    literal: 'Far from the eyes, far from the heart.',
    category: 'Relationships',
    context: 'People tend to forget those who are absent.',
    level: 'A2',
  },
  {
    fr: 'Aide-toi et le ciel t\'aidera.',
    en: 'God helps those who help themselves.',
    literal: 'Help yourself and the sky will help you.',
    category: 'Self-reliance',
    context: 'Make your own effort before expecting help.',
    level: 'B1',
  },
]

const CATEGORIES = ['All', ...Array.from(new Set(PROVERBS.map(p => p.category)))]
const LEVELS = ['All', 'A1', 'A2', 'B1', 'B2']
const LEVEL_COLORS = { A1: 'bg-emerald-100 text-emerald-700', A2: 'bg-blue-100 text-blue-700', B1: 'bg-yellow-100 text-yellow-700', B2: 'bg-orange-100 text-orange-700' }

export default function FrenchProverbs() {
  const [cat, setCat] = useState('All')
  const [level, setLevel] = useState('All')
  const [expanded, setExpanded] = useState(null)
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('saybonjour_proverb_favs') || '[]') } catch { return [] }
  })
  const [showFavs, setShowFavs] = useState(false)
  const [daily, setDaily] = useState(() => PROVERBS[new Date().getDate() % PROVERBS.length])

  const filtered = PROVERBS.filter(p =>
    (cat === 'All' || p.category === cat) &&
    (level === 'All' || p.level === level) &&
    (!showFavs || favorites.includes(p.fr))
  )

  const toggleFav = (fr) => {
    setFavorites(prev => {
      const next = prev.includes(fr) ? prev.filter(f => f !== fr) : [...prev, fr]
      localStorage.setItem('saybonjour_proverb_favs', JSON.stringify(next))
      if (!prev.includes(fr)) addXP(2, 'vocabulary')
      return next
    })
  }

  const randomize = () => {
    const candidates = PROVERBS.filter(p => (cat === 'All' || p.category === cat) && (level === 'All' || p.level === level))
    if (candidates.length) { setDaily(candidates[Math.floor(Math.random() * candidates.length)]); addXP(2, 'vocabulary') }
  }

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French Proverbs | SayBonjour!" description="Learn French proverbs and idioms with English translations, literal meanings and cultural context." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">French Proverbs</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Proverbes français — wisdom through the ages</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-burgundy-600 to-burgundy-800 text-white rounded-2xl p-6 mb-8 relative overflow-hidden">
          <div className="absolute right-4 top-4 opacity-20 text-8xl font-serif">"</div>
          <div className="text-xs font-medium text-burgundy-200 mb-2 uppercase tracking-wide">Proverbe du jour</div>
          <p className="text-xl font-bold font-playfair mb-2">{daily.fr}</p>
          <p className="text-burgundy-100 text-sm italic mb-1">{daily.en}</p>
          <p className="text-burgundy-300 text-xs mb-4">Literal: {daily.literal}</p>
          <div className="flex items-center gap-3">
            <SpeakButton text={daily.fr} size="sm" variant="ghost" className="text-white opacity-80 hover:opacity-100" />
            <button onClick={randomize}
              className="flex items-center gap-1.5 text-xs text-burgundy-200 hover:text-white transition-colors">
              <Shuffle size={13} /> Another proverb
            </button>
          </div>
        </motion.div>

        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex flex-wrap gap-1">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${cat === c ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1">
            {LEVELS.map(l => (
              <button key={l} onClick={() => setLevel(l)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${level === l ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
                {l}
              </button>
            ))}
          </div>
          <button onClick={() => setShowFavs(f => !f)}
            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition-colors ${showFavs ? 'bg-rose-500 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50'}`}>
            <Heart size={11} fill={showFavs ? 'white' : 'none'} /> Favourites ({favorites.length})
          </button>
        </div>

        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">No proverbs match your filters.</div>
          )}
          {filtered.map((p, i) => {
            const isOpen = expanded === p.fr
            return (
              <motion.div key={p.fr} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="bg-white dark:bg-dark-warm-100 rounded-xl shadow border border-gray-100 dark:border-dark-warm-50 overflow-hidden">
                <button onClick={() => { setExpanded(isOpen ? null : p.fr); if (!isOpen) addXP(2, 'vocabulary') }}
                  className="w-full text-left px-5 py-4 flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${LEVEL_COLORS[p.level]}`}>{p.level}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">{p.category}</span>
                    </div>
                    <p className="font-semibold font-playfair text-gray-900 dark:text-cream-50">{p.fr}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-0.5">{p.en}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 mt-1">
                    <SpeakButton text={p.fr} size="sm" />
                    <button onClick={e => { e.stopPropagation(); toggleFav(p.fr) }}
                      className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${favorites.includes(p.fr) ? 'text-rose-500' : 'text-gray-300 dark:text-gray-600 hover:text-rose-400'}`}>
                      <Heart size={15} fill={favorites.includes(p.fr) ? 'currentColor' : 'none'} />
                    </button>
                    {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                      className="overflow-hidden">
                      <div className="px-5 pb-4 space-y-2 border-t border-gray-50 dark:border-dark-warm-200 pt-3">
                        <div>
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Literal: </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400 italic">{p.literal}</span>
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">When to use: </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{p.context}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
