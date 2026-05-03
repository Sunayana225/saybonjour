import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Clock, BookOpen, Brain, Mic, Pen, Star, Flame, Calendar, TrendingUp, Filter } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { getProgress } from '../utils/progress'
import SEO from '../components/SEO'

const EVENT_ICONS = {
  quiz: Brain,
  vocabulary: BookOpen,
  grammar: Pen,
  conjugate: BookOpen,
  speaking: Mic,
  reading: BookOpen,
  story: Star,
  login: Flame,
  default: Clock,
}
const EVENT_COLORS = {
  quiz: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  vocabulary: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  grammar: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
  conjugate: 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
  login: 'bg-burgundy-100 dark:bg-burgundy-900/20 text-burgundy-600 dark:text-burgundy-400',
  default: 'bg-gray-100 dark:bg-dark-warm-200 text-gray-600 dark:text-gray-400',
}

const fmt = (iso) => {
  const d = new Date(iso)
  const now = new Date()
  const diff = Math.floor((now - d) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

const dateLabel = (iso) => {
  const d = new Date(iso)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) return 'Today'
  const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1)
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
}

function HeatmapCell({ count, date }) {
  const intensity = count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 10 ? 3 : 4
  const colors = ['bg-gray-100 dark:bg-dark-warm-200', 'bg-burgundy-200 dark:bg-burgundy-900/40', 'bg-burgundy-400 dark:bg-burgundy-700', 'bg-burgundy-600', 'bg-burgundy-800']
  return (
    <div className={`w-3.5 h-3.5 rounded-sm ${colors[intensity]} cursor-default`} title={`${date}: ${count} session${count !== 1 ? 's' : ''}`} />
  )
}

export default function StudyHistory() {
  const { user } = useUser()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const token = localStorage.getItem('userToken')
        if (token) {
          const res = await fetch('/api/users/study-history?limit=100', { headers: { 'X-User-Token': token } })
          if (res.ok) {
            const data = await res.json()
            setHistory(data.history || [])
            setLoading(false)
            return
          }
        }
      } catch {}
      const localEvents = buildLocalHistory()
      setHistory(localEvents)
      setLoading(false)
    }
    loadHistory()
  }, [])

  const buildLocalHistory = () => {
    const prog = getProgress()
    const events = []
    if (prog.quizResults) {
      prog.quizResults.forEach((r, i) => {
        events.push({ id: `q${i}`, type: 'quiz', title: 'Quiz completed', desc: `Score: ${r.score}/${r.total}`, xp: r.xp || 10, created_at: r.date || new Date(Date.now() - i * 86400000).toISOString() })
      })
    }
    const streak = prog.loginStreak || 0
    for (let i = 0; i < Math.min(streak, 14); i++) {
      events.push({ id: `l${i}`, type: 'login', title: 'Daily study session', desc: `Day ${streak - i} streak`, xp: 5, created_at: new Date(Date.now() - i * 86400000).toISOString() })
    }
    return events.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }

  const filtered = useMemo(() => filter === 'all' ? history : history.filter(e => e.type === filter), [history, filter])

  const grouped = useMemo(() => {
    const groups = {}
    filtered.forEach(ev => {
      const label = dateLabel(ev.created_at)
      if (!groups[label]) groups[label] = []
      groups[label].push(ev)
    })
    return Object.entries(groups)
  }, [filtered])

  const heatmapData = useMemo(() => {
    const counts = {}
    history.forEach(ev => {
      const key = new Date(ev.created_at).toDateString()
      counts[key] = (counts[key] || 0) + 1
    })
    const cells = []
    for (let i = 83; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i)
      cells.push({ date: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }), count: counts[d.toDateString()] || 0 })
    }
    return cells
  }, [history])

  const totalSessions = history.length
  const totalXpEarned = history.reduce((s, e) => s + (e.xp || 0), 0)
  const activeDays = new Set(history.map(e => new Date(e.created_at).toDateString())).size
  const FILTER_TYPES = ['all', 'quiz', 'vocabulary', 'grammar', 'conjugate', 'login']

  return (
    <>
      <SEO title="Study History | SayBonjour" url="/history" noindex />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-cream-50" style={{ fontFamily: 'Playfair Display, serif' }}>
              Study History
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Your learning journey over time</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Sessions', value: totalSessions, icon: Clock, color: 'text-blue-600 dark:text-blue-400' },
            { label: 'XP from history', value: totalXpEarned > 0 ? `+${totalXpEarned}` : totalXpEarned, icon: Star, color: 'text-amber-600 dark:text-amber-400' },
            { label: 'Active Days', value: activeDays, icon: Calendar, color: 'text-green-600 dark:text-green-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white dark:bg-dark-warm-100 rounded-2xl p-4 shadow-sm text-center">
              <Icon className={`w-5 h-5 mx-auto mb-1 ${color}`} />
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-dark-warm-100 rounded-2xl p-5 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-burgundy-600" />
            <span className="font-semibold text-gray-800 dark:text-cream-50 text-sm">Activity — last 12 weeks</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {heatmapData.map((cell, i) => (
              <HeatmapCell key={i} count={cell.count} date={cell.date} />
            ))}
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
            <span>Less</span>
            {['bg-gray-100 dark:bg-dark-warm-200', 'bg-burgundy-200', 'bg-burgundy-400', 'bg-burgundy-600', 'bg-burgundy-800'].map((c, i) => (
              <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
            ))}
            <span>More</span>
          </div>
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          <Filter className="w-4 h-4 text-gray-400 self-center" />
          {FILTER_TYPES.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${filter === f ? 'bg-burgundy-600 text-white' : 'bg-gray-100 dark:bg-dark-warm-200 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-warm-50'}`}>
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-dark-warm-100 rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-dark-warm-200 rounded w-1/3 mb-2" />
                <div className="h-3 bg-gray-100 dark:bg-dark-warm-50 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : grouped.length === 0 ? (
          <div className="text-center py-16">
            <Clock className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">No study history yet</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Complete a quiz or vocabulary session to see your history here</p>
            <Link to="/quizzes" className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-burgundy-600 text-white rounded-xl text-sm font-medium hover:bg-burgundy-700 transition-colors">
              Start studying
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {grouped.map(([label, events]) => (
              <div key={label}>
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">{label}</div>
                <div className="space-y-2">
                  {events.map((ev, idx) => {
                    const Icon = EVENT_ICONS[ev.type] || EVENT_ICONS.default
                    const colorCls = EVENT_COLORS[ev.type] || EVENT_COLORS.default
                    return (
                      <motion.div key={ev.id || idx} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.04 }}
                        className="flex items-center gap-3 bg-white dark:bg-dark-warm-100 rounded-xl p-3.5 shadow-sm">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${colorCls}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-800 dark:text-cream-50">{ev.title}</div>
                          {ev.desc && <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{ev.desc}</div>}
                        </div>
                        <div className="flex flex-col items-end flex-shrink-0">
                          {ev.xp > 0 && <span className="text-xs font-bold text-amber-600 dark:text-amber-400">+{ev.xp} XP</span>}
                          <span className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{fmt(ev.created_at)}</span>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
