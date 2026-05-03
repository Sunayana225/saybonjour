import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Zap, Flame, Star, Crown, Users, RefreshCw, Wifi, WifiOff, Share2, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { getProgress, getRank, RANKS } from '../utils/progress'
import { useUser } from '../context/UserContext'

const TABS = [
  { id: 'allTime', label: 'All Time', icon: Crown },
  { id: 'weekly', label: 'This Week', icon: Zap },
  { id: 'streaks', label: 'Streaks', icon: Flame },
]

const MEDAL = ['🥇', '🥈', '🥉']

function Avatar({ entry, size = 9 }) {
  const initials = (entry.name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const colors = ['bg-burgundy-100 text-burgundy-700', 'bg-blue-100 text-blue-700', 'bg-emerald-100 text-emerald-700',
    'bg-amber-100 text-amber-700', 'bg-purple-100 text-purple-700', 'bg-rose-100 text-rose-700']
  const color = colors[(entry.id || 0) % colors.length]
  return entry.avatar_url
    ? <img src={entry.avatar_url} alt={entry.name}
        className={`w-${size} h-${size} rounded-full object-cover shrink-0 border-2 border-white dark:border-dark-warm-100`} />
    : <div className={`w-${size} h-${size} rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${color}`}>
        {initials}
      </div>
}

function RankBadge({ xp }) {
  const rank = getRank(xp)
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${rank.bg} ${rank.color}`}>
      {rank.icon} {rank.name}
    </span>
  )
}

function XPBar({ value, max }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return (
    <div className="w-16 h-1.5 rounded-full bg-gray-100 dark:bg-dark-warm-50 overflow-hidden">
      <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400" style={{ width: `${pct}%` }} />
    </div>
  )
}

export default function Leaderboard() {
  const [tab, setTab] = useState('allTime')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [copied, setCopied] = useState(false)
  const [localProgress] = useState(() => getProgress())
  const { user } = useUser()

  useEffect(() => {
    setLoading(true)
    setError(false)
    fetch('/api/leaderboard')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  const myName = user?.name || 'You'
  const myId = user?.id || null
  const myXP = localProgress.xp
  const myStreak = localProgress.streak
  const myLevel = localProgress.level
  const myRank = getRank(myXP)

  const today = new Date()
  const dayOfWeek = today.getDay()
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const monday = new Date(today)
  monday.setDate(today.getDate() + diffToMonday)
  monday.setHours(0, 0, 0, 0)
  const mondayStr = monday.toISOString().split('T')[0]
  const myWeeklyXP = (localProgress.weeklyXP || [])
    .filter(e => e.date >= mondayStr)
    .reduce((s, e) => s + (e.xp || 0), 0)

  const mergeMe = (list, valueKey) => {
    const alreadyIn = list.some(e => e.id === myId)
    const merged = alreadyIn
      ? list.map(e => e.id === myId ? { ...e, isMe: true } : e)
      : [...list, { id: myId, name: myName, avatar_url: user?.avatar_url || null, xp: myXP, weeklyXp: myWeeklyXP, streak: myStreak, level: myLevel, isMe: true }]
    return merged.sort((a, b) => b[valueKey] - a[valueKey])
  }

  const lists = data ? {
    allTime: mergeMe(data.allTime, 'xp'),
    weekly: mergeMe(data.weekly.length > 0 ? data.weekly : [], 'weeklyXp'),
    streaks: mergeMe(data.streaks, 'streak'),
  } : null

  const myPosition = (key, valueKey) => {
    if (!lists) return null
    const idx = lists[key].findIndex(e => e.isMe)
    return idx >= 0 ? idx + 1 : null
  }

  const topVal = (key, valueKey) => {
    if (!lists || lists[key].length === 0) return 1
    return lists[key][0][valueKey]
  }

  const displayList = lists ? lists[tab] : []
  const valueKey = tab === 'allTime' ? 'xp' : tab === 'weekly' ? 'weeklyXp' : 'streak'
  const valueLabel = tab === 'streaks' ? 'days' : 'XP'

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="Leaderboard | SayBonjour!" description="See how you rank against French learners worldwide on SayBonjour!" url="/leaderboard" />
      <div className="max-w-2xl mx-auto px-4 py-10">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 mb-4 shadow-lg">
            <Trophy className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-cream-50" style={{ fontFamily: 'Playfair Display, serif' }}>Leaderboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Classement des apprenants · Real learner rankings</p>
        </div>

        <div className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-warm-50 p-5 mb-6">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-semibold uppercase tracking-wide">Your Stats</p>
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center">
              <p className="text-xl font-bold text-burgundy-600">#{myPosition('allTime', 'xp') ?? '—'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">All Time</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-blue-600">#{myPosition('weekly', 'weeklyXp') ?? '—'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">This Week</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-amber-500">{myXP.toLocaleString()}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Total XP</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-orange-500">{myStreak}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Streak</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
            <RankBadge xp={myXP} />
            <div className="flex items-center gap-2">
              {myWeeklyXP > 0 && (
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <Zap className="w-3 h-3" /> +{myWeeklyXP.toLocaleString()} XP this week
                </span>
              )}
              <button
                onClick={() => {
                  const pos = myPosition('allTime', 'xp')
                  const text = `I'm ranked #${pos ?? '?'} on SayBonjour! 🇫🇷 with ${myXP.toLocaleString()} XP and a ${myStreak}-day streak. Come learn French with me! ${window.location.origin}/leaderboard`
                  navigator.clipboard.writeText(text).then(() => {
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2500)
                  })
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-dark-warm-200 text-gray-600 dark:text-gray-300 hover:bg-burgundy-50 dark:hover:bg-burgundy-900/20 hover:text-burgundy-600 transition-all"
              >
                {copied
                  ? <><Check className="w-3 h-3 text-emerald-500" /><span className="text-emerald-600">Copied!</span></>
                  : <><Share2 className="w-3 h-3" />Share</>
                }
              </button>
            </div>
          </div>
          {!user && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 text-center">
              <Link to="/login" className="text-burgundy-600 dark:text-burgundy-400 font-medium hover:underline">Sign in</Link> to sync your stats and appear on the global board
            </p>
          )}
        </div>

        <div className="flex gap-2 mb-5">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${tab === id ? 'bg-burgundy-600 text-white shadow-sm' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300 dark:hover:border-burgundy-600'}`}>
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <RefreshCw className="w-6 h-6 text-gray-400 animate-spin" />
            <p className="text-sm text-gray-400">Loading rankings…</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <WifiOff className="w-8 h-8 text-gray-300" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Couldn't load leaderboard. Please try again.</p>
            <button onClick={() => { setError(false); setLoading(true); fetch('/api/leaderboard').then(r => r.json()).then(d => { setData(d); setLoading(false) }).catch(() => { setError(true); setLoading(false) }) }}
              className="px-4 py-2 text-sm font-medium bg-burgundy-600 text-white rounded-xl hover:bg-burgundy-700 transition-colors">
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2">
              {displayList.length === 0 ? (
                <div className="text-center py-16">
                  <Users className="w-10 h-10 text-gray-200 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">No rankings yet for this period.</p>
                  <p className="text-xs text-gray-400 mt-1">Start learning to appear here!</p>
                </div>
              ) : (
                displayList.map((entry, i) => {
                  const val = entry[valueKey] || 0
                  const maxVal = topVal(tab, valueKey)
                  return (
                    <motion.div key={`${entry.id ?? entry.name}-${i}`}
                      initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.025 }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${
                        entry.isMe
                          ? 'bg-burgundy-50 dark:bg-burgundy-900/20 border-burgundy-200 dark:border-burgundy-700 shadow-sm'
                          : 'bg-white dark:bg-dark-warm-100 border-gray-100 dark:border-dark-warm-50 hover:border-gray-200 dark:hover:border-dark-warm-50'
                      }`}>
                      <div className="w-7 text-center shrink-0">
                        {i < 3
                          ? <span className="text-lg leading-none">{MEDAL[i]}</span>
                          : <span className="text-xs font-bold text-gray-400 dark:text-gray-500">#{i + 1}</span>}
                      </div>

                      <Avatar entry={entry} size={9} />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-sm font-semibold truncate ${entry.isMe ? 'text-burgundy-700 dark:text-burgundy-300' : 'text-gray-900 dark:text-cream-50'}`}>
                            {entry.name}{entry.isMe && <span className="ml-1 text-xs font-normal text-burgundy-500 dark:text-burgundy-400">(You)</span>}
                          </span>
                          {i === 0 && <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400 dark:text-gray-500">Lv.{entry.level}</span>
                          <XPBar value={val} max={maxVal} />
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className={`text-sm font-bold ${tab === 'streaks' ? 'text-orange-500' : 'text-amber-500'}`}>
                          {val.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">{valueLabel}</p>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {!loading && !error && (
          <div className="mt-8 bg-amber-50 dark:bg-dark-warm-100 border border-amber-100 dark:border-dark-warm-50 rounded-2xl p-5">
            <h3 className="font-semibold text-gray-800 dark:text-cream-50 mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" /> How to Earn More XP
            </h3>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
              {[['Daily Login', '+10 XP'], ['Word Learned', '+5 XP'], ['Lesson Read', '+15 XP'], ['Quiz Completed', '+25 XP'], ['3-Day Streak', '2× multiplier'], ['7-Day Streak', '3× multiplier']].map(([act, xp]) => (
                <div key={act} className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{act}</span>
                  <span className="font-semibold text-burgundy-600 dark:text-burgundy-400">{xp}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4 text-center">
              Rankings update in real time · Sync your progress to appear on the board
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
