import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Laugh, BookOpen, ChevronDown, Shuffle, Info, ChevronRight } from 'lucide-react'
import { jokeCategories, jokeFacts } from '../data/jokesData'
import { getContent } from '../utils/contentStore'
const frenchJokes = getContent('jokes')
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const CATEGORY_COLORS = {
  Puns:      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  Wordplay:  'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  Classic:   'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
}

const CATEGORY_ICONS = {
  All:      '🃏',
  Puns:     '😄',
  Wordplay: '🔤',
  Classic:  '🎭',
}

export default function FrenchJokes() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [revealed, setRevealed] = useState({})
  const [expandedVocab, setExpandedVocab] = useState({})
  const [shuffled, setShuffled] = useState(false)
  const [jokes, setJokes] = useState(frenchJokes)

  const filtered = selectedCategory === 'All' ? jokes : jokes.filter(j => j.category === selectedCategory)

  const toggleReveal  = (id) => { setRevealed(p => ({ ...p, [id]: !p[id] })); addXP(3, 'vocabulary') }
  const toggleVocab   = (id) => { setExpandedVocab(p => ({ ...p, [id]: !p[id] })); addXP(2, 'vocabulary') }

  const handleShuffle = () => {
    setJokes(prev => [...prev].sort(() => Math.random() - 0.5))
    setRevealed({})
    setExpandedVocab({})
    setShuffled(true)
    addXP(2, 'vocabulary')
    setTimeout(() => setShuffled(false), 800)
  }

  const revealAll = () => {
    const all = {}
    filtered.forEach(j => { all[j.id] = true })
    setRevealed(p => ({ ...p, ...all }))
  }

  return (
    <>
      <SEO
        title="French Jokes — Puns, Wordplay & Blagues | SayBonjour!"
        description="Discover French humour through puns, wordplay, and classic blagues. Each joke comes with French text, English translation, and vocabulary notes to help you laugh — and learn."
        keywords="french jokes, blagues françaises, french puns, french wordplay, funny french, learn french with humour, french comedy"
        url="/jokes"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-dark-warm-300 flex">

        {/* ── Left sidebar (desktop) ── */}
        <aside className="hidden md:flex flex-col w-52 shrink-0 sticky top-[60px] h-[calc(100vh-60px)] overflow-y-auto bg-white dark:bg-dark-warm-100 border-r border-cream-200 dark:border-dark-warm-50 pt-5 pb-8">
          <div className="px-4 mb-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Categories</div>

          {jokeCategories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-left w-full transition-all border-r-2 ${selectedCategory === cat ? 'bg-burgundy-50 dark:bg-burgundy-900/20 text-burgundy-700 dark:text-burgundy-300 border-burgundy-600' : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-warm-200 hover:text-gray-900 dark:hover:text-cream-50'}`}>
              <span className="text-base leading-none">{CATEGORY_ICONS[cat]}</span>
              {cat}
              {selectedCategory === cat && <ChevronRight className="w-3.5 h-3.5 ml-auto text-burgundy-500" />}
            </button>
          ))}

          <div className="mt-auto px-3 space-y-2 pt-6">
            <button onClick={handleShuffle}
              className={`flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-xl text-xs font-medium bg-gray-100 dark:bg-dark-warm-200 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-warm-50 transition-all ${shuffled ? 'scale-95' : ''}`}>
              <Shuffle size={13} /> Shuffle
            </button>
            <button onClick={revealAll}
              className="flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-xl text-xs font-medium bg-gray-100 dark:bg-dark-warm-200 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-warm-50 transition-all">
              <Laugh size={13} /> Reveal All
            </button>
          </div>
        </aside>

        {/* ── Right content area ── */}
        <div className="flex-1 min-w-0">

          {/* Mobile category bar */}
          <div className="md:hidden sticky top-[60px] z-20 bg-white/95 dark:bg-dark-warm-100/95 backdrop-blur border-b border-cream-200 dark:border-dark-warm-50 px-4 py-2 flex gap-1.5 overflow-x-auto">
            {jokeCategories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className={`flex-none flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-burgundy-600 text-cream-50 shadow-sm' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-warm-200'}`}>
                <span>{CATEGORY_ICONS[cat]}</span>
                {cat}
              </button>
            ))}
            <button onClick={handleShuffle}
              className="flex-none flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-warm-200 transition-all ml-auto">
              <Shuffle size={12} /> Shuffle
            </button>
            <button onClick={revealAll}
              className="flex-none flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-warm-200 transition-all">
              <Laugh size={12} /> Reveal All
            </button>
          </div>

          <div className="max-w-3xl mx-auto px-4 py-6">

            {/* Cultural facts */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {jokeFacts.map((fact, i) => (
                <div key={i} className="bg-white dark:bg-dark-warm-100 border border-gray-200 dark:border-gray-600 rounded-xl p-4">
                  <div className="text-2xl mb-2">{fact.emoji}</div>
                  <p className="text-xs font-semibold text-burgundy-600 mb-1">{fact.title}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{fact.text}</p>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{filtered.length} jokes in this category</p>

            {/* Jokes */}
            <div className="space-y-5">
              {filtered.map((joke, idx) => (
                <motion.div key={joke.id}
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="bg-white dark:bg-dark-warm-100 border border-gray-200 dark:border-gray-600 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">

                  <div className="px-6 py-5">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${CATEGORY_COLORS[joke.category]}`}>
                        {joke.category}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">#{idx + 1}</span>
                    </div>

                    <div className="mb-2">
                      <div className="flex items-start gap-2">
                        <div onClick={e => e.stopPropagation()}>
                          <SpeakButton text={joke.setup} size="sm" variant="ghost" />
                        </div>
                        <p className="text-base font-semibold text-gray-900 dark:text-white leading-relaxed">
                          🇫🇷 {joke.setup}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-0.5">
                        🇬🇧 {joke.setupEn}
                      </p>
                    </div>

                    <button onClick={() => toggleReveal(joke.id)}
                      className={`mt-4 w-full py-2.5 rounded-xl font-medium text-sm transition-all ${revealed[joke.id] ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700/40 text-yellow-800 dark:text-yellow-300' : 'bg-burgundy-600 hover:bg-burgundy-700 text-white'}`}>
                      {revealed[joke.id] ? '🎯 Punchline revealed!' : '😂 Reveal punchline'}
                    </button>

                    <AnimatePresence>
                      {revealed[joke.id] && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex items-start gap-2 mb-0.5">
                              <div onClick={e => e.stopPropagation()}>
                                <SpeakButton text={joke.punchline} size="sm" variant="ghost" />
                              </div>
                              <p className="text-lg font-bold text-gray-900 dark:text-white">🇫🇷 {joke.punchline}</p>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-0.5">🇬🇧 {joke.punchlineEn}</p>
                            {joke.note && (
                              <div className="mt-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/40 rounded-xl p-3 flex gap-2">
                                <Info size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">{joke.note}</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="border-t border-gray-100 dark:border-gray-700">
                    <button onClick={() => toggleVocab(joke.id)}
                      className="w-full px-6 py-3 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-warm-200 transition-colors">
                      <span className="flex items-center gap-2"><BookOpen size={13} /> Vocabulary notes</span>
                      <ChevronDown size={14} className={`transition-transform ${expandedVocab[joke.id] ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {expandedVocab[joke.id] && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="px-6 pb-4 pt-1">
                            <div className="flex flex-wrap gap-2">
                              {joke.vocab.split(' | ').map((v, vi) => (
                                <span key={vi} className="text-xs bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 text-amber-800 dark:text-amber-300 px-3 py-1.5 rounded-lg">{v}</span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 bg-white dark:bg-dark-warm-100 border border-gray-200 dark:border-gray-600 rounded-2xl p-6 text-center">
              <p className="text-2xl mb-2">🥐</p>
              <p className="font-semibold text-gray-900 dark:text-white mb-1">Quelle est la morale ?</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                French wordplay is deeply tied to the language's phonetics and double meanings.<br />
                The more French you learn, the funnier the jokes become!
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
