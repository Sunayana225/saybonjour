import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, RotateCcw, ChevronRight, ArrowLeft, Star } from 'lucide-react'
import { stories } from '../data/storyData'
import { addXP } from '../utils/progress'
import SEO from '../components/SEO'

const LEVEL_COLORS = {
  A1: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  A2: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  B1: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
}

const StoryPlayer = ({ story, onBack }) => {
  const [nodeId, setNodeId] = useState('start')
  const [history, setHistory] = useState([])
  const [totalXP, setTotalXP] = useState(0)
  const [finished, setFinished] = useState(false)

  const node = story.nodes[nodeId]

  const handleChoice = (choice) => {
    setHistory(h => [...h, nodeId])
    const xp = choice.xp || 0
    setTotalXP(x => x + xp)
    addXP(xp, 'interactive_story')
    if (story.nodes[choice.next]?.isEnd) {
      setNodeId(choice.next)
      setFinished(true)
      addXP(20, 'story_complete')
      setTotalXP(x => x + 20)
    } else {
      setNodeId(choice.next)
    }
  }

  const handleBack = () => {
    if (history.length === 0) return
    const prev = history[history.length - 1]
    setHistory(h => h.slice(0, -1))
    setNodeId(prev)
    setFinished(false)
  }

  const handleRestart = () => {
    setNodeId('start')
    setHistory([])
    setTotalXP(0)
    setFinished(false)
  }

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}>
      <div className="flex items-center justify-between mb-5">
        <button onClick={onBack} className="flex items-center gap-2 text-burgundy-600 dark:text-burgundy-400 text-sm font-medium hover:underline">
          <ArrowLeft className="w-4 h-4" /> All stories
        </button>
        <div className="text-sm text-amber-600 font-bold">⚡ {totalXP} XP</div>
      </div>

      <div className="bg-white dark:bg-dark-warm-100 rounded-2xl border border-cream-200 dark:border-dark-warm-50 overflow-hidden shadow-sm">
        <div className="bg-burgundy-600 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-cream-50">{story.title}</h2>
            <p className="text-cream-200 text-sm">{story.englishTitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${LEVEL_COLORS[story.level]}`}>{story.level}</span>
            <span className="text-cream-200 text-xs">{history.length + 1} steps</span>
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={nodeId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <p className="text-gray-700 dark:text-cream-100 mb-4 text-sm leading-relaxed">{node.text}</p>

              {node.agent && (
                <div className="bg-cream-50 dark:bg-dark-warm-200 rounded-xl px-4 py-3 mb-4 border-l-4 border-burgundy-400">
                  <p className="text-gray-800 dark:text-cream-50 text-sm font-medium italic">{node.agent}</p>
                </div>
              )}

              {node.tip && (
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl px-4 py-2 mb-4 border border-amber-200 text-xs text-amber-700 dark:text-amber-300">
                  {node.tip}
                </div>
              )}

              {finished && node.endMessage && (
                <motion.div
                  className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-5 mb-4 border border-emerald-200 text-center"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <div className="text-3xl mb-2">🎉</div>
                  <p className="text-emerald-800 dark:text-emerald-300 font-medium text-sm">{node.endMessage}</p>
                  <p className="text-emerald-600 dark:text-emerald-400 text-xs mt-2 font-bold">+{totalXP} XP total earned!</p>
                </motion.div>
              )}

              {!finished && node.choices.length > 0 && (
                <div className="space-y-2 mt-5">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Your response:</p>
                  {node.choices.map((choice, i) => (
                    <motion.button
                      key={i}
                      onClick={() => handleChoice(choice)}
                      className="w-full text-left px-4 py-3 rounded-xl text-sm bg-cream-50 dark:bg-dark-warm-200 border border-cream-200 dark:border-dark-warm-50 text-gray-800 dark:text-cream-50 hover:border-burgundy-400 hover:bg-burgundy-50 dark:hover:bg-burgundy-900/20 transition-all group"
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-center justify-between">
                        <span>{choice.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-amber-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">+{choice.xp} XP</span>
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-burgundy-500 transition-colors" />
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {finished && (
                <button onClick={handleRestart}
                  className="w-full mt-4 py-3 bg-burgundy-600 text-cream-50 rounded-xl text-sm font-bold hover:bg-burgundy-700 transition-colors flex items-center justify-center gap-2">
                  <RotateCcw className="w-4 h-4" /> Play Again
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {history.length > 0 && !finished && (
        <button onClick={handleBack} className="mt-3 text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Go back
        </button>
      )}
    </motion.div>
  )
}

export default function InteractiveStory() {
  const [selected, setSelected] = useState(null)

  return (
    <>
      <SEO title="Interactive French Stories | SayBonjour" url="/stories" />
      <div className="min-h-screen bg-gray-50 dark:bg-dark-warm-300">
        <div className="bg-gradient-to-r from-burgundy-800 to-burgundy-600 text-cream-50 py-10 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center bg-cream-50/20 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                <BookOpen className="w-4 h-4 mr-2" /> Interactive Stories
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                Choose Your Path
              </h1>
              <p className="text-cream-100 max-w-lg mx-auto">
                Live immersive French scenarios. Every choice you make earns XP and teaches real conversational French.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            {selected ? (
              <StoryPlayer key="player" story={selected} onBack={() => setSelected(null)} />
            ) : (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {stories.map(story => (
                    <motion.button
                      key={story.id}
                      onClick={() => setSelected(story)}
                      className="bg-white dark:bg-dark-warm-100 rounded-2xl border border-cream-200 dark:border-dark-warm-50 p-6 text-left hover:border-burgundy-300 hover:shadow-md transition-all group"
                      whileHover={{ y: -4 }}
                    >
                      <div className="text-5xl mb-4">{story.coverEmoji}</div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${LEVEL_COLORS[story.level]}`}>{story.level}</span>
                      </div>
                      <h3 className="font-bold text-burgundy-800 dark:text-cream-50 mb-1">{story.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-3">{story.englishTitle}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{story.intro}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-amber-600 text-xs font-medium">
                          <Star className="w-3.5 h-3.5" /> XP for every choice
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-burgundy-500 transition-colors" />
                      </div>
                    </motion.button>
                  ))}

                  <div className="bg-cream-50 dark:bg-dark-warm-200 rounded-2xl border-2 border-dashed border-cream-300 dark:border-dark-warm-50 p-6 flex flex-col items-center justify-center text-center">
                    <div className="text-3xl mb-3">🛒</div>
                    <h3 className="font-bold text-gray-500 dark:text-gray-400 mb-1">Shopping in France</h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Coming soon…</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}
