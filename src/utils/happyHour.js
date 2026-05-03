export const HAPPY_HOUR_SLOTS = [
  { label: 'Morning Boost', start: 6, end: 9 },
  { label: 'Lunch Rush', start: 12, end: 14 },
]

const totalMinsNow = () => {
  const d = new Date()
  return d.getHours() * 60 + d.getMinutes()
}

export const getHappyHourStatus = () => {
  const mins = totalMinsNow()

  for (const slot of HAPPY_HOUR_SLOTS) {
    const start = slot.start * 60
    const end = slot.end * 60
    if (mins >= start && mins < end) {
      const remaining = end - mins
      return {
        active: true,
        label: slot.label,
        endsInMins: remaining,
        multiplierBonus: 1,
      }
    }
  }

  let minsUntilNext = Infinity
  let nextLabel = ''
  for (const slot of HAPPY_HOUR_SLOTS) {
    let diff = slot.start * 60 - mins
    if (diff <= 0) diff += 24 * 60
    if (diff < minsUntilNext) {
      minsUntilNext = diff
      nextLabel = slot.label
    }
  }

  return {
    active: false,
    label: nextLabel,
    minsUntilNext,
    multiplierBonus: 0,
  }
}

export const getHappyHourMultiplierBonus = () =>
  getHappyHourStatus().multiplierBonus

export const formatMins = (mins) => {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h > 0 && m > 0) return `${h}h ${m}m`
  if (h > 0) return `${h}h`
  return `${m}m`
}
