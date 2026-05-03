const STREAK_KEY = 'saybonjour_streak'

function getTodayDate() {
  return new Date().toISOString().split('T')[0]
}

function getYesterdayDate() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

function loadStreak() {
  try {
    const raw = localStorage.getItem(STREAK_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function saveStreak(data) {
  try {
    localStorage.setItem(STREAK_KEY, JSON.stringify(data))
  } catch {}
}

export function updateAndGetStreak() {
  const today = getTodayDate()
  const yesterday = getYesterdayDate()
  const stored = loadStreak()

  if (!stored) {
    const fresh = { currentStreak: 1, longestStreak: 1, lastVisitDate: today }
    saveStreak(fresh)
    return fresh
  }

  if (stored.lastVisitDate === today) {
    return stored
  }

  let currentStreak
  if (stored.lastVisitDate === yesterday) {
    currentStreak = (stored.currentStreak || 0) + 1
  } else {
    currentStreak = 1
  }

  const longestStreak = Math.max(stored.longestStreak || 0, currentStreak)
  const updated = { currentStreak, longestStreak, lastVisitDate: today }
  saveStreak(updated)
  return updated
}

export function getStreakMotivation(streak) {
  if (streak >= 365) return 'A full year of dedication!'
  if (streak >= 100) return 'Legendary! 100+ days strong!'
  if (streak >= 30) return 'Incredible dedication!'
  if (streak >= 14) return 'Two weeks and counting!'
  if (streak >= 7) return 'One week on fire!'
  if (streak >= 3) return 'Building momentum!'
  if (streak === 2) return 'Two in a row — nice!'
  return 'Start your journey today!'
}

export function getStreakEmoji(streak) {
  if (streak >= 30) return '🏆'
  if (streak >= 7) return '🔥'
  if (streak >= 3) return '⚡'
  return '✨'
}
