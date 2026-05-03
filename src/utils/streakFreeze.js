const KEY = 'saybonjour_streak_freezes'
const PROGRESS_KEY = 'saybonjour_progress'

export const getFreezesCount = () => {
  try {
    return Math.max(0, parseInt(localStorage.getItem(KEY) || '0', 10))
  } catch {
    return 0
  }
}

export const addFreeze = () => {
  try {
    const current = getFreezesCount()
    localStorage.setItem(KEY, String(current + 1))
  } catch {}
}

export const activateFreeze = () => {
  const count = getFreezesCount()
  if (count <= 0) return false
  try {
    const stored = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}')
    const today = new Date().toISOString().split('T')[0]
    if (stored.lastStudyDate === today) return false
    stored.lastStudyDate = today
    if (!stored.streak || stored.streak < 1) stored.streak = 1
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(stored))
    localStorage.setItem(KEY, String(count - 1))
    window.dispatchEvent(new Event('progressUpdated'))
    return true
  } catch {
    return false
  }
}
