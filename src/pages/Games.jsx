import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Gamepad2, Zap, Trophy, ChevronRight } from 'lucide-react'
import SEO from '../components/SEO'

const GAMES = [
  {
    id: 'hangman',
    title: 'Hangman',
    emoji: '🪝',
    desc: 'Guess French words letter by letter before the figure is complete.',
    href: '/hangman',
    xp: 15,
    levels: 'A1–B2',
    category: 'Vocabulary',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-100 dark:border-purple-800/30',
    badge: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  },
  {
    id: 'word-match',
    title: 'Word Match',
    emoji: '🔗',
    desc: 'Flip cards and match French words to their English translations.',
    href: '/word-match',
    xp: 10,
    levels: 'A1–B2',
    category: 'Vocabulary',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-100 dark:border-blue-800/30',
    badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  },
  {
    id: 'spelling-bee',
    title: 'Spelling Bee',
    emoji: '🐝',
    desc: 'Listen to a French word spoken aloud, then spell it correctly.',
    href: '/spelling-bee',
    xp: 10,
    levels: 'A1–B2',
    category: 'Listening',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-100 dark:border-amber-800/30',
    badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  },
  {
    id: 'word-scramble',
    title: 'Word Scramble',
    emoji: '🔀',
    desc: 'Unscramble the letters to reveal the hidden French word.',
    href: '/word-scramble',
    xp: 10,
    levels: 'A1–B2',
    category: 'Vocabulary',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-100 dark:border-emerald-800/30',
    badge: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
  },
  {
    id: 'typing-race',
    title: 'Typing Race',
    emoji: '⌨️',
    desc: 'Race against the clock typing French word translations as fast as you can.',
    href: '/typing-race',
    xp: 20,
    levels: 'A1–C1',
    category: 'Speed',
    bg: 'bg-rose-50 dark:bg-rose-900/20',
    border: 'border-rose-100 dark:border-rose-800/30',
    badge: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300',
  },
  {
    id: 'crossword',
    title: 'Crossword',
    emoji: '✏️',
    desc: 'Solve French vocabulary crossword puzzles with English clues.',
    href: '/crossword',
    xp: 20,
    levels: 'A2–B2',
    category: 'Vocabulary',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    border: 'border-indigo-100 dark:border-indigo-800/30',
    badge: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
  },
  {
    id: 'picture-vocabulary',
    title: 'Picture Vocabulary',
    emoji: '🖼️',
    desc: 'Match emoji pictures to the correct French words.',
    href: '/picture-vocabulary',
    xp: 5,
    levels: 'A1–A2',
    category: 'Vocabulary',
    bg: 'bg-pink-50 dark:bg-pink-900/20',
    border: 'border-pink-100 dark:border-pink-800/30',
    badge: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
  },
  {
    id: 'gender-practice',
    title: 'Gender Practice',
    emoji: '🔵',
    desc: 'Le ou la? Rapid-fire practice to master French noun genders.',
    href: '/gender-practice',
    xp: 5,
    levels: 'A1–B2',
    category: 'Grammar',
    bg: 'bg-sky-50 dark:bg-sky-900/20',
    border: 'border-sky-100 dark:border-sky-800/30',
    badge: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300',
  },
  {
    id: 'dictation',
    title: 'Dictation',
    emoji: '🎧',
    desc: 'Listen to French sentences and write exactly what you hear.',
    href: '/dictation',
    xp: 20,
    levels: 'A2–B2',
    category: 'Listening',
    bg: 'bg-teal-50 dark:bg-teal-900/20',
    border: 'border-teal-100 dark:border-teal-800/30',
    badge: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300',
  },
  {
    id: 'sentence-builder',
    title: 'Sentence Builder',
    emoji: '🧩',
    desc: 'Arrange French words into grammatically correct sentences.',
    href: '/sentence-builder',
    xp: 15,
    levels: 'A1–B2',
    category: 'Grammar',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    border: 'border-orange-100 dark:border-orange-800/30',
    badge: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  },
  {
    id: 'numbers',
    title: 'French Numbers',
    emoji: '🔢',
    desc: 'Learn numbers, ordinals, and how to tell the time in French.',
    href: '/numbers',
    xp: 10,
    levels: 'A1–A2',
    category: 'Vocabulary',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
    border: 'border-violet-100 dark:border-violet-800/30',
    badge: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300',
  },
  {
    id: 'conjugation-quiz',
    title: 'Conjugation Quiz',
    emoji: '📝',
    desc: 'Test every French verb tense with instant feedback on each answer.',
    href: '/conjugation-quiz',
    xp: 25,
    levels: 'A2–C1',
    category: 'Grammar',
    bg: 'bg-burgundy-100 dark:bg-burgundy-900/20',
    border: 'border-burgundy-100 dark:border-burgundy-800/30',
    badge: 'bg-burgundy-100 dark:bg-burgundy-900/30 text-burgundy-700 dark:text-burgundy-300',
  },
  {
    id: 'verb-drills',
    title: 'Verb Drills',
    emoji: '⚡',
    desc: 'Timed conjugation drills to build speed and accuracy.',
    href: '/verb-drills',
    xp: 15,
    levels: 'A2–C1',
    category: 'Grammar',
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-100 dark:border-yellow-800/30',
    badge: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  },
  {
    id: 'mini-flashcards',
    title: 'Mini Flashcards',
    emoji: '🃏',
    desc: 'Quick-fire vocabulary flashcard decks organised by theme.',
    href: '/mini-flashcards',
    xp: 5,
    levels: 'A1–C1',
    category: 'Vocabulary',
    bg: 'bg-lime-50 dark:bg-lime-900/20',
    border: 'border-lime-100 dark:border-lime-800/30',
    badge: 'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-300',
  },
]

const CATEGORIES = ['All', 'Vocabulary', 'Grammar', 'Listening', 'Speed']

const CAT_COLORS = {
  Vocabulary: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  Grammar: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
  Listening: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  Speed: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300',
}

export default function Games() {
  const [filter, setFilter] = useState('All')
  const filtered = filter === 'All' ? GAMES : GAMES.filter(g => g.category === filter)
  const maxXP = Math.max(...GAMES.map(g => g.xp))

  return (
    <>
      <SEO
        title="French Games Hub | SayBonjour!"
        description="Play fun French language games, earn XP, and level up your learning. 14 games covering vocabulary, grammar, listening, and speed."
        url="/games"
      />
      <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">

        <div className="bg-gradient-to-br from-burgundy-900 via-burgundy-700 to-burgundy-500 text-white py-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-5xl mb-3 select-none">🎮</div>
              <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Games Hub
              </h1>
              <p className="text-white/75 text-lg mb-6">Play, earn XP, and level up your French</p>
              <div className="flex items-center justify-center flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-1.5">
                  <Gamepad2 className="w-4 h-4 text-white/60" />
                  <span><strong>{GAMES.length}</strong> games available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Up to <strong>+{maxXP} XP</strong> per game</span>
                </div>
                <Link
                  to="/high-scores"
                  className="flex items-center gap-1.5 hover:text-amber-300 transition-colors"
                >
                  <Trophy className="w-4 h-4 text-amber-300" />
                  <span>High Scores <ChevronRight className="w-3.5 h-3.5 inline" /></span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">

          <div className="flex gap-2 flex-wrap mb-6">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  filter === cat
                    ? 'bg-burgundy-600 text-white shadow-sm'
                    : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300 dark:hover:border-burgundy-600'
                }`}
              >
                {cat}
                {cat !== 'All' && (
                  <span className="ml-1.5 opacity-50 text-xs">
                    {GAMES.filter(g => g.category === cat).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((game, i) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <Link
                  to={game.href}
                  className={`group flex flex-col h-full bg-white dark:bg-dark-warm-100 rounded-2xl border ${game.border} shadow-sm hover:shadow-md transition-all duration-200 p-5 hover:-translate-y-0.5`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-12 h-12 rounded-xl ${game.bg} flex items-center justify-center text-2xl select-none`}>
                      {game.emoji}
                    </div>
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full">
                      <Zap className="w-3 h-3" />
                      +{game.xp} XP
                    </span>
                  </div>

                  <h2 className="font-bold text-gray-900 dark:text-cream-50 text-base mb-1 leading-tight">
                    {game.title}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-snug flex-1">
                    {game.desc}
                  </p>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50 dark:border-dark-warm-50">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CAT_COLORS[game.category]}`}>
                        {game.category}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">{game.levels}</span>
                    </div>
                    <span className="flex items-center gap-0.5 text-xs font-semibold text-burgundy-600 dark:text-burgundy-400 group-hover:gap-1 transition-all">
                      Play <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/high-scores"
              className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-burgundy-600 dark:hover:text-burgundy-400 transition-colors"
            >
              <Trophy className="w-4 h-4" />
              View your High Scores
            </Link>
          </div>

        </div>
      </div>
    </>
  )
}
