import { getHappyHourMultiplierBonus } from './happyHour'
import { addFreeze } from './streakFreeze'

const PROGRESS_KEY = 'saybonjour_progress'

const defaultProgress = {
  xp: 0,
  level: 1,
  streak: 0,
  lastStudyDate: null,
  totalWordsLearned: 0,
  totalQuizzesTaken: 0,
  totalLessonsRead: 0,
  badges: [],
  cefrLevel: 'A1',
  weeklyXP: [],
  dailyXP: [],
  skillXP: {
    reading: 0,
    grammar: 0,
    vocabulary: 0,
    games: 0,
    challenges: 0,
    stories: 0,
  },
}

export const getProgress = () => {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY)
    if (!stored) return { ...defaultProgress }
    const parsed = JSON.parse(stored)
    return {
      ...defaultProgress,
      ...parsed,
      skillXP: { ...defaultProgress.skillXP, ...(parsed.skillXP || {}) },
    }
  } catch {
    return { ...defaultProgress }
  }
}

export const saveProgress = (progress) => {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
    window.dispatchEvent(new Event('progressUpdated'))
  } catch {}
}

const SKILL_MAP = {
  lesson_read: 'reading',
  reading_comprehension: 'reading',
  quiz_completed: 'grammar',
  grammar_quiz: 'grammar',
  business_quiz: 'grammar',
  slang_quiz: 'grammar',
  word_learned: 'vocabulary',
  vocabulary_review: 'vocabulary',
  word_match: 'games',
  typing_race: 'games',
  sentence_builder: 'games',
  daily_login: 'challenges',
  daily_challenge: 'challenges',
  interactive_story: 'stories',
  story_complete: 'stories',
}

export const getXPMultiplier = (streak) => {
  if (streak >= 7) return 3
  if (streak >= 3) return 2
  return 1
}

export const addXP = (amount, reason = '') => {
  const progress = getProgress()

  const streakMult = getXPMultiplier(progress.streak)
  const skipMultiplier = ['daily_login'].includes(reason)
  const happyBonus = skipMultiplier ? 0 : getHappyHourMultiplierBonus()
  const multiplier = skipMultiplier ? 1 : Math.min(4, streakMult + happyBonus)
  const finalAmount = skipMultiplier ? amount : amount * multiplier

  progress.xp += finalAmount

  const today = new Date().toISOString().split('T')[0]
  const weeklyEntry = progress.weeklyXP.find(e => e.date === today)
  if (weeklyEntry) {
    weeklyEntry.xp += finalAmount
  } else {
    progress.weeklyXP = [...(progress.weeklyXP || []).slice(-13), { date: today, xp: finalAmount }]
  }

  const dailyEntry = (progress.dailyXP || []).find(e => e.date === today)
  if (dailyEntry) {
    dailyEntry.xp += finalAmount
  } else {
    progress.dailyXP = [...(progress.dailyXP || []).slice(-27), { date: today, xp: finalAmount }]
  }

  const skill = SKILL_MAP[reason]
  if (skill) {
    if (!progress.skillXP) progress.skillXP = { ...defaultProgress.skillXP }
    progress.skillXP[skill] = (progress.skillXP[skill] || 0) + finalAmount
  }

  progress.level = Math.floor(progress.xp / 500) + 1
  updateStreak(progress)
  const newBadges = checkBadges(progress)
  saveProgress(progress)
  window.dispatchEvent(new CustomEvent('xpGained', { detail: { amount: finalAmount } }))
  newBadges.forEach(badge => {
    window.dispatchEvent(new CustomEvent('badgeEarned', { detail: { badge } }))
  })
  return { progress, multiplier: skipMultiplier ? 1 : multiplier, earned: finalAmount }
}

const updateStreak = (progress) => {
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  if (progress.lastStudyDate === today) return
  if (progress.lastStudyDate === yesterday) {
    progress.streak += 1
  } else if (progress.lastStudyDate !== today) {
    progress.streak = 1
  }
  progress.lastStudyDate = today
  progress.longestStreak = Math.max(progress.longestStreak || 0, progress.streak)

  if (progress.streak > 0 && progress.streak % 7 === 0) {
    addFreeze()
  }
}

const BADGES = [
  { id: 'first_word', name: 'First Word', description: 'Learned your first word', icon: '🌱', xpRequired: 0, wordsRequired: 1 },
  { id: 'vocab_10', name: 'Vocabulary Builder', description: 'Learned 10 words', icon: '📚', wordsRequired: 10 },
  { id: 'vocab_50', name: 'Word Collector', description: 'Learned 50 words', icon: '📖', wordsRequired: 50 },
  { id: 'vocab_100', name: 'Century Scholar', description: 'Learned 100 words', icon: '🎓', wordsRequired: 100 },
  { id: 'streak_3', name: '3-Day Streak', description: '3 consecutive days', icon: '🔥', streakRequired: 3 },
  { id: 'streak_7', name: 'Week Warrior', description: '7-day streak', icon: '⚡', streakRequired: 7 },
  { id: 'streak_30', name: 'Monthly Master', description: '30-day streak', icon: '💎', streakRequired: 30 },
  { id: 'quiz_1', name: 'Quiz Taker', description: 'Completed first quiz', icon: '🧠', quizzesRequired: 1 },
  { id: 'quiz_10', name: 'Quiz Champion', description: 'Completed 10 quizzes', icon: '🏆', quizzesRequired: 10 },
  { id: 'xp_100', name: 'XP Earner', description: 'Earned 100 XP', icon: '⭐', xpRequired: 100 },
  { id: 'xp_1000', name: 'XP Master', description: 'Earned 1000 XP', icon: '🌟', xpRequired: 1000 },
  { id: 'xp_5000', name: 'XP Legend', description: 'Earned 5000 XP', icon: '🚀', xpRequired: 5000 },
]

const checkBadges = (progress) => {
  const newBadges = []
  BADGES.forEach(badge => {
    if (progress.badges.includes(badge.id)) return
    let earned = false
    if (badge.wordsRequired && progress.totalWordsLearned >= badge.wordsRequired) earned = true
    if (badge.streakRequired && progress.streak >= badge.streakRequired) earned = true
    if (badge.quizzesRequired && progress.totalQuizzesTaken >= badge.quizzesRequired) earned = true
    if (badge.xpRequired && badge.xpRequired > 0 && progress.xp >= badge.xpRequired) earned = true
    if (earned) { progress.badges.push(badge.id); newBadges.push(badge) }
  })
  return newBadges
}

export const recordQuiz = () => {
  const progress = getProgress()
  progress.totalQuizzesTaken += 1
  saveProgress(progress)
  addXP(25, 'quiz_completed')
}

export const recordWordLearned = () => {
  const progress = getProgress()
  progress.totalWordsLearned += 1
  saveProgress(progress)
  addXP(5, 'word_learned')
}

export const recordLessonRead = () => {
  addXP(15, 'lesson_read')
}

export const getAllBadges = () => BADGES

export const getXPForNextLevel = (level) => level * 500

export const RANKS = [
  { name: 'Bronze', min: 0, max: 499, color: 'text-amber-700', bg: 'bg-amber-100', icon: '🥉' },
  { name: 'Silver', min: 500, max: 1499, color: 'text-gray-600', bg: 'bg-gray-100', icon: '🥈' },
  { name: 'Gold', min: 1500, max: 2999, color: 'text-yellow-600', bg: 'bg-yellow-100', icon: '🥇' },
  { name: 'Platinum', min: 3000, max: 5999, color: 'text-cyan-700', bg: 'bg-cyan-100', icon: '💎' },
  { name: 'Diamond', min: 6000, max: Infinity, color: 'text-blue-700', bg: 'bg-blue-100', icon: '💠' },
]

export const getRank = (xp) => RANKS.find(r => xp >= r.min && xp <= r.max) || RANKS[0]

export const claimDailyLoginReward = () => {
  const today = new Date().toISOString().split('T')[0]
  const key = 'saybonjour_daily_login'
  const last = localStorage.getItem(key)
  if (last === today) return null
  localStorage.setItem(key, today)
  addXP(10, 'daily_login')
  return 10
}
