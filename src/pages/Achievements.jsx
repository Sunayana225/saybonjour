import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Lock, CheckCircle, Star, Zap, Flame } from 'lucide-react'
import SEO from '../components/SEO'
import { getProgress, getAllBadges, getRank, RANKS } from '../utils/progress'
import { Link } from 'react-router-dom'

const EXTRA_ACHIEVEMENTS = [
  { id: 'hangman_5', name: 'Word Detective', description: 'Win 5 games of Hangman', icon: '🕵️', category: 'Games', hint: 'Play Hangman' },
  { id: 'spelling_10', name: 'Spelling Champion', description: 'Spell 10 words correctly in Spelling Bee', icon: '🐝', category: 'Games', hint: 'Play Spelling Bee' },
  { id: 'scramble_10', name: 'Unscrambler', description: 'Solve 10 Word Scramble puzzles', icon: '🔀', category: 'Games', hint: 'Play Word Scramble' },
  { id: 'dictation_5', name: 'La Dictée', description: 'Complete 5 Dictation exercises with 80%+ accuracy', icon: '🎙️', category: 'Listening', hint: 'Practice Dictation' },
  { id: 'verb_50', name: 'Conjugation King', description: 'Answer 50 verb drill questions correctly', icon: '👑', category: 'Grammar', hint: 'Do Verb Drills' },
  { id: 'false_friends', name: 'Faux Ami Fighter', description: 'Complete the False Friends quiz', icon: '🎭', category: 'Vocabulary', hint: 'Study False Friends' },
  { id: 'tongue_5', name: 'Tongue Twister Master', description: 'Master 5 tongue twisters', icon: '🌀', category: 'Pronunciation', hint: 'Practice Tongue Twisters' },
  { id: 'themes_all', name: 'Thematic Scholar', description: 'Explore all 12 vocabulary themes', icon: '📖', category: 'Vocabulary', hint: 'Browse Vocabulary Themes' },
  { id: 'numbers_quiz', name: 'Numerologist', description: 'Score 8/8 on the French Numbers quiz', icon: '🔢', category: 'Numbers', hint: 'Play Numbers Quiz' },
  { id: 'daily_7', name: 'Week of Learning', description: 'Complete 7 daily challenges', icon: '📅', category: 'Challenges', hint: 'Do Daily Challenges' },
  { id: 'story_3', name: 'Storyteller', description: 'Complete 3 interactive stories', icon: '📚', category: 'Reading', hint: 'Read Interactive Stories' },
  { id: 'top_3', name: 'Podium', description: 'Reach the top 3 on the leaderboard', icon: '🏅', category: 'Community', hint: 'Earn more XP' },
]

const CATEGORY_COLORS = {
  Games: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  Listening: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  Grammar: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  Vocabulary: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  Pronunciation: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  Numbers: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  Challenges: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  Reading: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  Community: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  Progress: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
}

export default function Achievements() {
  const progress = getProgress()
  const coreBadges = getAllBadges()
  const rank = getRank(progress.xp)

  const earned = progress.badges || []
  const totalBadges = coreBadges.length + EXTRA_ACHIEVEMENTS.length
  const earnedCount = earned.length

  const FILTER_CATS = ['All', 'Games', 'Grammar', 'Vocabulary', 'Listening', 'Pronunciation', 'Challenges', 'Reading', 'Community']
  const [filter, setFilter] = useState('All')

  const allAchievements = [
    ...coreBadges.map(b => ({
      ...b, category: b.streakRequired ? 'Challenges' : b.quizzesRequired ? 'Grammar' : b.wordsRequired ? 'Vocabulary' : 'Progress',
      earned: earned.includes(b.id),
    })),
    ...EXTRA_ACHIEVEMENTS.map(a => ({ ...a, earned: false })),
  ]

  const filtered = filter === 'All' ? allAchievements : allAchievements.filter(a => a.category === filter)

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="Achievements | SayBonjour!" description="View all your French learning achievements, badges, and milestones." />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">Achievements</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Vos Accomplissements</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-dark-warm-100 rounded-xl p-4 text-center shadow-sm border border-gray-100 dark:border-dark-warm-50">
            <Trophy className="text-amber-400 mx-auto mb-2" size={28} />
            <p className="text-2xl font-bold text-gray-900 dark:text-cream-50">{earnedCount}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Badges Earned</p>
          </div>
          <div className="bg-white dark:bg-dark-warm-100 rounded-xl p-4 text-center shadow-sm border border-gray-100 dark:border-dark-warm-50">
            <Star className="text-purple-400 mx-auto mb-2" size={28} />
            <p className="text-2xl font-bold text-gray-900 dark:text-cream-50">{totalBadges}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Available</p>
          </div>
          <div className="bg-white dark:bg-dark-warm-100 rounded-xl p-4 text-center shadow-sm border border-gray-100 dark:border-dark-warm-50">
            <Zap className="text-blue-400 mx-auto mb-2" size={28} />
            <p className="text-2xl font-bold text-gray-900 dark:text-cream-50">{Math.round(earnedCount / totalBadges * 100)}%</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Completion</p>
          </div>
          <div className="bg-white dark:bg-dark-warm-100 rounded-xl p-4 text-center shadow-sm border border-gray-100 dark:border-dark-warm-50">
            <Flame className="text-orange-400 mx-auto mb-2" size={28} />
            <p className="text-2xl font-bold text-gray-900 dark:text-cream-50">{progress.streak}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Day Streak</p>
          </div>
        </div>

        <div className={`rounded-2xl p-5 mb-8 ${rank.bg} border border-current/10`}>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{rank.icon}</span>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Current Rank</p>
              <p className={`text-2xl font-bold ${rank.color}`}>{rank.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{progress.xp.toLocaleString()} XP total</p>
            </div>
            {RANKS.indexOf(rank) < RANKS.length - 1 && (
              <div className="ml-auto text-right">
                <p className="text-xs text-gray-500">Next rank at</p>
                <p className={`font-bold ${rank.color}`}>{(rank.max + 1).toLocaleString()} XP</p>
                <p className="text-xs text-gray-400">{((rank.max + 1) - progress.xp).toLocaleString()} XP to go</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mb-6">
          {FILTER_CATS.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === cat ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50'}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((badge, i) => (
            <motion.div key={badge.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className={`relative rounded-xl border p-4 transition-all ${badge.earned ? 'bg-white dark:bg-dark-warm-100 border-amber-200 dark:border-amber-700 shadow-sm' : 'bg-gray-50/80 dark:bg-dark-warm-200/50 border-gray-100 dark:border-dark-warm-50 opacity-70'}`}>
              {(() => {
                let pct = 0
                let progressLabel = ''
                if (!badge.earned) {
                  if (badge.wordsRequired) { pct = Math.min(100, (progress.totalWordsLearned / badge.wordsRequired) * 100); progressLabel = `${Math.min(progress.totalWordsLearned, badge.wordsRequired)} / ${badge.wordsRequired} words` }
                  else if (badge.streakRequired) { pct = Math.min(100, (progress.streak / badge.streakRequired) * 100); progressLabel = `${Math.min(progress.streak, badge.streakRequired)} / ${badge.streakRequired} days` }
                  else if (badge.quizzesRequired) { pct = Math.min(100, (progress.totalQuizzesTaken / badge.quizzesRequired) * 100); progressLabel = `${Math.min(progress.totalQuizzesTaken, badge.quizzesRequired)} / ${badge.quizzesRequired} quizzes` }
                  else if (badge.xpRequired && badge.xpRequired > 0) { pct = Math.min(100, (progress.xp / badge.xpRequired) * 100); progressLabel = `${Math.min(progress.xp, badge.xpRequired).toLocaleString()} / ${badge.xpRequired.toLocaleString()} XP` }
                }
                return (
                  <div className="flex items-start gap-3">
                    <span className={`text-3xl ${badge.earned ? '' : 'grayscale opacity-50'}`}>{badge.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className={`font-semibold text-sm ${badge.earned ? 'text-gray-900 dark:text-cream-50' : 'text-gray-400 dark:text-gray-500'}`}>{badge.name}</h3>
                        {badge.earned && <CheckCircle size={13} className="text-green-500 flex-shrink-0" />}
                        {!badge.earned && <Lock size={11} className="text-gray-400 flex-shrink-0" />}
                      </div>
                      <p className={`text-xs ${badge.earned ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400'}`}>{badge.description}</p>
                      {badge.category && (
                        <span className={`mt-2 inline-block text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[badge.category] || 'bg-gray-100 text-gray-600'}`}>{badge.category}</span>
                      )}
                      {!badge.earned && progressLabel && (
                        <div className="mt-2">
                          <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                            <span>{progressLabel}</span>
                            <span>{Math.round(pct)}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 dark:bg-dark-warm-50 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-500" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      )}
                      {!badge.earned && badge.hint && !progressLabel && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">💡 {badge.hint}</p>
                      )}
                    </div>
                  </div>
                )
              })()}
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Keep studying to unlock more achievements!</p>
          <Link to="/progress" className="btn-primary inline-flex items-center gap-2"><Zap size={14} /> View Full Progress</Link>
        </div>
      </div>
    </div>
  )
}
