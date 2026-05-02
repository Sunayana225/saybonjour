import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Laugh, BookOpen, ChevronDown, Shuffle, Info } from 'lucide-react'
import { frenchJokes, jokeCategories, jokeFacts } from '../data/jokesData'

const CATEGORY_COLORS = {
  Puns: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  Wordplay: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  Classic: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
}

export default function FrenchJokes() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [revealed, setRevealed] = useState({})
  const [expandedVocab, setExpandedVocab] = useState({})
  const [shuffled, setShuffled] = useState(false)
  const [jokes, setJokes] = useState(frenchJokes)

  const filtered = selectedCategory === 'All' ? jokes : jokes.filter(j => j.category === selectedCategory)

  const toggleReveal = (id) => setRevealed(p => ({ ...p, [id]: !p[id] }))
  const toggleVocab = (id) => setExpandedVocab(p => ({ ...p, [id]: !p[id] }))

  const handleShuffle = () => {
    setJokes(prev => [...prev].sort(() => Math.random() - 0.5))
    setRevealed({})
    setExpandedVocab({})
    setShuffled(true)
    setTimeout(() => setShuffled(false), 800)
  }

  const revealAll = () => {
    const all = {}
    filtered.forEach(j => { all[j.id] = true })
    setRevealed(p => ({ ...p, ...all }))
  }

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300 py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="text-6xl mb-4">😄</div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">French Jokes</h1>
          <p className="text-burgundy-600 font-medium mb-3">Humour & jeux de mots</p>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            French humour is famous for its wit and wordplay. Each joke comes with the punchline in French and English, plus vocabulary notes.
          </p>
        </motion.div>

        {/* Cultural Facts */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {jokeFacts.map((fact, i) => (
            <div key={i} className="bg-white dark:bg-dark-warm-100 border border-gray-200 dark:border-gray-600 rounded-xl p-4">
              <div className="text-2xl mb-2">{fact.emoji}</div>
              <p className="text-xs font-semibold text-burgundy-600 mb-1">{fact.title}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{fact.text}</p>
            </div>
          ))}
        </motion.div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex flex-wrap gap-2">
            {jokeCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-burgundy-600 text-white'
                    : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-burgundy-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="ml-auto flex gap-2">
            <button
              onClick={handleShuffle}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-burgundy-400 transition-all ${shuffled ? 'scale-95' : ''}`}
            >
              <Shuffle size={14} />
              Shuffle
            </button>
            <button
              onClick={revealAll}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-burgundy-400 transition-all"
            >
              <Laugh size={14} />
              Reveal All
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{filtered.length} jokes in this category</p>

        {/* Jokes */}
        <div className="space-y-5">
          {filtered.map((joke, idx) => (
            <motion.div
              key={joke.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="bg-white dark:bg-dark-warm-100 border border-gray-200 dark:border-gray-600 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Joke Header */}
              <div className="px-6 py-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${CATEGORY_COLORS[joke.category]}`}>
                    {joke.category}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">#{idx + 1}</span>
                </div>

                {/* Setup — French */}
                <div className="mb-2">
                  <p className="text-base font-semibold text-gray-900 dark:text-white leading-relaxed">
                    🇫🇷 {joke.setup}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-0.5">
                    🇬🇧 {joke.setupEn}
                  </p>
                </div>

                {/* Punchline reveal button */}
                <button
                  onClick={() => toggleReveal(joke.id)}
                  className={`mt-4 w-full py-2.5 rounded-xl font-medium text-sm transition-all ${
                    revealed[joke.id]
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700/40 text-yellow-800 dark:text-yellow-300'
                      : 'bg-burgundy-600 hover:bg-burgundy-700 text-white'
                  }`}
                >
                  {revealed[joke.id] ? '🎯 Punchline revealed!' : '😂 Reveal punchline'}
                </button>

                <AnimatePresence>
                  {revealed[joke.id] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          🇫🇷 {joke.punchline}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-0.5">
                          🇬🇧 {joke.punchlineEn}
                        </p>
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

              {/* Vocab Toggle */}
              <div className="border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => toggleVocab(joke.id)}
                  className="w-full px-6 py-3 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-warm-200 transition-colors"
                >
                  <span className="flex items-center gap-2"><BookOpen size={13} /> Vocabulary notes</span>
                  <ChevronDown size={14} className={`transition-transform ${expandedVocab[joke.id] ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {expandedVocab[joke.id] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 pt-1">
                        <div className="flex flex-wrap gap-2">
                          {joke.vocab.split(' | ').map((v, vi) => (
                            <span key={vi} className="text-xs bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 text-amber-800 dark:text-amber-300 px-3 py-1.5 rounded-lg">
                              {v}
                            </span>
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
  )
}
