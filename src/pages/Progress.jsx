import React, { useState, useEffect } from 'react'
import { Flame, Star, Award, TrendingUp, BookOpen, Brain, Zap, Target, BarChart2, Trophy, PieChart, Calendar, Snowflake, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getProgress, getAllBadges, getXPForNextLevel, getRank, RANKS, getXPMultiplier } from '../utils/progress'
import { getHappyHourStatus, formatMins } from '../utils/happyHour'
import { getFreezesCount, activateFreeze } from '../utils/streakFreeze'
import Confetti from '../components/Confetti'
import SEO from '../components/SEO'

const GOAL_OPTIONS = [50, 100, 150, 200]
const GOAL_KEY = 'saybonjour_daily_xp_goal'

const DailyGoalRing = ({ todayXP, goal, onGoalChange }) => {
  const pct = Math.min(100, (todayXP / goal) * 100)
  const r = 26
  const circ = 2 * Math.PI * r
  const dash = circ * (1 - pct / 100)
  const reached = pct >= 100
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="relative w-16 h-16 shrink-0">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={r} fill="none" stroke="currentColor" strokeWidth="6" className="text-gray-100 dark:text-dark-warm-200" />
          <circle cx="32" cy="32" r={r} fill="none" strokeWidth="6" strokeLinecap="round"
            stroke={reached ? '#10b981' : '#f59e0b'}
            strokeDasharray={circ}
            strokeDashoffset={dash}
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xs font-black ${reached ? 'text-emerald-600' : 'text-amber-600'}`}>{Math.round(pct)}%</span>
        </div>
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-gray-800 dark:text-cream-50">Daily XP Goal</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{todayXP} / {goal} XP today</p>
        {reached
          ? <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">🎉 Goal reached! Amazing!</p>
          : <p className="text-xs text-gray-400 mt-0.5">{goal - todayXP} XP to go</p>
        }
        <div className="flex gap-1 mt-1.5">
          {GOAL_OPTIONS.map(g => (
            <button key={g} onClick={() => onGoalChange(g)}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${goal === g ? 'bg-amber-400 text-white' : 'bg-gray-100 dark:bg-dark-warm-200 text-gray-500 hover:bg-amber-100 dark:hover:bg-amber-900/20'}`}>
              {g}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

const cefrColors = {
  A1: 'text-emerald-600 bg-emerald-100',
  A2: 'text-blue-600 bg-blue-100',
  B1: 'text-yellow-700 bg-yellow-100',
  B2: 'text-orange-600 bg-orange-100',
  C1: 'text-purple-600 bg-purple-100',
  C2: 'text-red-700 bg-red-100',
}

const StatCard = ({ icon: Icon, label, value, sub, color = 'text-burgundy-600', bg = 'bg-burgundy-50' }) => (
  <motion.div
    className="bg-white dark:bg-dark-warm-100 rounded-2xl border border-cream-200 dark:border-dark-warm-50 p-5 shadow-sm"
    whileHover={{ y: -3 }}
    transition={{ duration: 0.2 }}
  >
    <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
      <Icon className={`w-5 h-5 ${color}`} />
    </div>
    <div className="text-2xl font-bold text-gray-800 dark:text-cream-50">{value}</div>
    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-0.5">{label}</div>
    {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
  </motion.div>
)

const XPBar = ({ xp, level }) => {
  const nextLevelXP = getXPForNextLevel(level)
  const prevLevelXP = getXPForNextLevel(level - 1)
  const progress = Math.min(((xp - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100, 100)

  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
        <span>Level {level}</span>
        <span>{xp} / {nextLevelXP} XP</span>
      </div>
      <div className="h-3 bg-gray-100 dark:bg-dark-warm-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-burgundy-500 to-burgundy-700 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
      <div className="text-xs text-gray-400 mt-1">{nextLevelXP - xp} XP to Level {level + 1}</div>
    </div>
  )
}

const StreakDisplay = ({ streak }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const filled = Math.min(streak, 7)

  return (
    <div className="flex gap-1.5">
      {days.map((day, i) => {
        const isActive = i < filled
        return (
          <div key={day} className="flex flex-col items-center gap-1">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all ${
              isActive ? 'bg-amber-400 text-white shadow-sm' : 'bg-gray-100 dark:bg-dark-warm-200 text-gray-300 dark:text-gray-600'
            }`}>
              {isActive ? '🔥' : '·'}
            </div>
            <span className="text-xs text-gray-400">{day[0]}</span>
          </div>
        )
      })}
    </div>
  )
}

const WeeklyChart = ({ weeklyXP }) => {
  const last7 = (() => {
    const result = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().split('T')[0]
      const entry = weeklyXP?.find(e => e.date === d)
      result.push({ date: d, xp: entry?.xp || 0, label: new Date(Date.now() - i * 86400000).toLocaleDateString('en', { weekday: 'short' }) })
    }
    return result
  })()

  const maxXP = Math.max(...last7.map(d => d.xp), 1)

  return (
    <div className="flex items-end gap-2 h-20">
      {last7.map((day, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <motion.div
            className="w-full bg-burgundy-500 rounded-t-sm"
            style={{ height: `${(day.xp / maxXP) * 100}%` }}
            initial={{ height: 0 }}
            animate={{ height: `${(day.xp / maxXP) * 100}%` }}
            transition={{ duration: 0.6, delay: i * 0.05 }}
          />
          <span className="text-xs text-gray-400">{day.label[0]}</span>
        </div>
      ))}
    </div>
  )
}

const BadgeGrid = ({ earned, allBadges }) => (
  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
    {allBadges.map(badge => {
      const isEarned = earned.includes(badge.id)
      return (
        <motion.div
          key={badge.id}
          className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all ${
            isEarned
              ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700 shadow-sm'
              : 'bg-gray-50 dark:bg-dark-warm-200 border-gray-200 dark:border-dark-warm-50 opacity-50'
          }`}
          whileHover={{ scale: 1.05 }}
          title={`${badge.name}: ${badge.description}`}
        >
          <span className="text-2xl mb-1">{badge.icon}</span>
          <span className={`text-xs font-medium ${isEarned ? 'text-amber-800 dark:text-amber-300' : 'text-gray-400'}`}>
            {badge.name}
          </span>
        </motion.div>
      )
    })}
  </div>
)

const ActivityHeatmap = ({ dailyXP }) => {
  const cells = []
  for (let i = 27; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000)
    const dateStr = d.toISOString().split('T')[0]
    const entry = (dailyXP || []).find(e => e.date === dateStr)
    const xp = entry?.xp || 0
    const intensity = xp === 0 ? 0 : xp < 20 ? 1 : xp < 50 ? 2 : xp < 100 ? 3 : 4
    cells.push({ date: dateStr, xp, intensity, label: d.toLocaleDateString('en', { month: 'short', day: 'numeric' }) })
  }

  const intensityClasses = [
    'bg-gray-100 dark:bg-dark-warm-200',
    'bg-burgundy-200 dark:bg-burgundy-900',
    'bg-burgundy-400 dark:bg-burgundy-700',
    'bg-burgundy-600 dark:bg-burgundy-500',
    'bg-burgundy-800 dark:bg-burgundy-400',
  ]

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {cells.map((cell, i) => (
          <motion.div
            key={cell.date}
            className={`w-7 h-7 rounded-md cursor-default ${intensityClasses[cell.intensity]}`}
            title={`${cell.label}: ${cell.xp} XP`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.01 }}
          />
        ))}
      </div>
      <div className="flex items-center gap-1.5 mt-2">
        <span className="text-xs text-gray-400">Less</span>
        {intensityClasses.map((cls, i) => (
          <div key={i} className={`w-3 h-3 rounded-sm ${cls}`} />
        ))}
        <span className="text-xs text-gray-400">More</span>
      </div>
    </div>
  )
}

const SkillBreakdown = ({ skillXP }) => {
  const skills = [
    { key: 'reading', label: 'Reading', icon: '📖', color: 'bg-blue-500' },
    { key: 'grammar', label: 'Grammar', icon: '📝', color: 'bg-purple-500' },
    { key: 'vocabulary', label: 'Vocabulary', icon: '💬', color: 'bg-emerald-500' },
    { key: 'games', label: 'Games', icon: '🎮', color: 'bg-amber-500' },
    { key: 'challenges', label: 'Challenges', icon: '⚡', color: 'bg-red-500' },
    { key: 'stories', label: 'Stories', icon: '📚', color: 'bg-pink-500' },
  ]

  const total = Object.values(skillXP || {}).reduce((s, v) => s + v, 0) || 1

  return (
    <div className="space-y-3">
      {skills.map(skill => {
        const xp = skillXP?.[skill.key] || 0
        const pct = Math.round((xp / total) * 100)
        return (
          <div key={skill.key}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 font-medium">
                {skill.icon} {skill.label}
              </span>
              <span className="text-xs text-gray-400">{xp} XP ({pct}%)</span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-dark-warm-200 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${skill.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>
        )
      })}
      {total <= 1 && (
        <p className="text-xs text-gray-400 text-center py-2">Complete activities to see your skill breakdown</p>
      )}
    </div>
  )
}

const RankDisplay = ({ xp }) => {
  const rank = getRank(xp)
  const nextRank = RANKS.find(r => r.min > xp)
  const pctToNext = nextRank ? Math.round(((xp - rank.min) / (nextRank.min - rank.min)) * 100) : 100

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-16 h-16 rounded-2xl ${rank.bg} flex items-center justify-center text-3xl shadow-sm`}>
          {rank.icon}
        </div>
        <div>
          <div className={`text-xl font-black ${rank.color}`}>{rank.name}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{xp} XP total</div>
          {nextRank && <div className="text-xs text-gray-400">{nextRank.min - xp} XP to {nextRank.name}</div>}
        </div>
      </div>
      {nextRank && (
        <div>
          <div className="h-2.5 bg-gray-100 dark:bg-dark-warm-200 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${rank.name === 'Bronze' ? 'from-amber-600 to-amber-400' : rank.name === 'Silver' ? 'from-gray-500 to-gray-300' : rank.name === 'Gold' ? 'from-yellow-600 to-yellow-400' : rank.name === 'Platinum' ? 'from-cyan-700 to-cyan-400' : 'from-blue-700 to-blue-400'}`}
              initial={{ width: 0 }}
              animate={{ width: `${pctToNext}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{rank.name} ({rank.min})</span>
            <span>{nextRank.name} ({nextRank.min})</span>
          </div>
        </div>
      )}
      <div className="flex gap-2 mt-4 flex-wrap">
        {RANKS.map((r, i) => {
          const unlocked = xp >= r.min
          return (
            <div key={r.name} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${unlocked ? r.bg + ' ' + r.color : 'bg-gray-100 dark:bg-dark-warm-200 text-gray-400'}`}>
              {r.icon} {r.name}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const XPMultiplierBadge = ({ streak }) => {
  const multiplier = getXPMultiplier(streak)
  if (multiplier === 1) return null
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold shadow-sm ${multiplier >= 3 ? 'bg-red-500 text-white' : 'bg-amber-400 text-white'}`}
    >
      <Zap className="w-3.5 h-3.5" />
      {multiplier}x XP Active!
    </motion.div>
  )
}

const Progress = () => {
  const [progress, setProgress] = useState(null)
  const [happyHour, setHappyHour] = useState(() => getHappyHourStatus())
  const [freezes, setFreezes] = useState(() => getFreezesCount())
  const [freezeMsg, setFreezeMsg] = useState(null)
  const [dailyGoal, setDailyGoal] = useState(() => Number(localStorage.getItem(GOAL_KEY)) || 50)
  const [goalConfetti, setGoalConfetti] = useState(false)
  const allBadges = getAllBadges()

  const todayStr = new Date().toISOString().split('T')[0]

  const getTodayXP = (p) => {
    if (!p) return 0
    const entry = (p.weeklyXP || []).find(e => e.date === todayStr)
    return entry?.xp || 0
  }

  useEffect(() => {
    setProgress(getProgress())
    const handler = () => { setProgress(getProgress()); setFreezes(getFreezesCount()) }
    window.addEventListener('progressUpdated', handler)
    const xpHandler = () => {
      const p = getProgress()
      const todayXP = getTodayXP(p)
      const goal = Number(localStorage.getItem(GOAL_KEY)) || 50
      if (todayXP >= goal) { setGoalConfetti(true); setTimeout(() => setGoalConfetti(false), 100) }
      setProgress(p)
      setFreezes(getFreezesCount())
    }
    window.addEventListener('xpGained', xpHandler)
    return () => {
      window.removeEventListener('progressUpdated', handler)
      window.removeEventListener('xpGained', xpHandler)
    }
  }, [])

  useEffect(() => {
    const tick = () => setHappyHour(getHappyHourStatus())
    const id = setInterval(tick, 30000)
    return () => clearInterval(id)
  }, [])

  const handleGoalChange = (g) => {
    setDailyGoal(g)
    localStorage.setItem(GOAL_KEY, g)
  }

  const handleActivateFreeze = () => {
    const ok = activateFreeze()
    if (ok) {
      setFreezes(getFreezesCount())
      setFreezeMsg('Freeze activated! Your streak is protected for today.')
    } else if (getFreezesCount() <= 0) {
      setFreezeMsg('No freezes available. Earn one by hitting a 7-day streak!')
    } else {
      setFreezeMsg("You've already studied today — your streak is safe!")
    }
    setTimeout(() => setFreezeMsg(null), 4000)
  }

  if (!progress) return null

  const earnedCount = (progress.badges || []).length
  const multiplier = getXPMultiplier(progress.streak)

  return (
    <>
      <SEO
        title="My Progress | SayBonjour French Learning"
        description="Track your French learning progress — XP, daily streaks, badges, rank, and skill breakdown."
        url="/progress"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-dark-warm-300">
        <div className="bg-gradient-to-r from-burgundy-800 to-burgundy-600 text-cream-50 py-10 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            >
              <div>
                <div className="inline-flex items-center bg-cream-50/20 px-4 py-1.5 rounded-full text-sm font-medium mb-3">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  My Progress
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Learning Dashboard
                </h1>
                <p className="text-cream-200 text-base">Track your journey from A1 to C2</p>
                {multiplier > 1 && (
                  <div className="mt-3">
                    <XPMultiplierBadge streak={progress.streak} />
                    <p className="text-xs text-cream-300 mt-1">
                      {multiplier === 2 ? '3-day streak bonus active!' : '7-day streak bonus — triple XP!'}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-cream-50/20 backdrop-blur-sm rounded-2xl p-5 text-center border border-cream-50/30">
                <div className={`inline-block text-3xl font-black px-4 py-2 rounded-xl mb-1 ${cefrColors[progress.cefrLevel] || 'text-cream-50 bg-cream-50/20'}`}>
                  {progress.cefrLevel}
                </div>
                <div className="text-xs text-cream-200 mt-1">Current Level</div>
                <div className="text-xs text-cream-200 font-medium">
                  {progress.cefrLevel === 'A1' ? 'Beginner' : progress.cefrLevel === 'A2' ? 'Elementary' : progress.cefrLevel === 'B1' ? 'Intermediate' : progress.cefrLevel === 'B2' ? 'Upper-Int.' : progress.cefrLevel === 'C1' ? 'Advanced' : 'Mastery'}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

          {/* XP & Level */}
          <motion.div
            className="bg-white dark:bg-dark-warm-100 rounded-2xl border border-cream-200 dark:border-dark-warm-50 shadow-sm p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-800 dark:text-cream-50">Level {progress.level}</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{progress.xp} total XP earned</p>
                </div>
              </div>
              {multiplier > 1 && (
                <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${multiplier >= 3 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                  🔥 {multiplier}x XP
                </div>
              )}
            </div>
            <XPBar xp={progress.xp} level={progress.level} />
          </motion.div>

          {/* Daily XP Goal */}
          <motion.div
            className="bg-white dark:bg-dark-warm-100 rounded-2xl border border-cream-200 dark:border-dark-warm-50 shadow-sm p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <Confetti trigger={goalConfetti} />
            <DailyGoalRing todayXP={getTodayXP(progress)} goal={dailyGoal} onGoalChange={handleGoalChange} />
          </motion.div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard icon={Flame} label="Day Streak" value={progress.streak} sub={progress.streak >= 7 ? '🔥 On fire!' : 'Keep going!'} color="text-amber-600" bg="bg-amber-50" />
            <StatCard icon={BookOpen} label="Words Learned" value={progress.totalWordsLearned} sub="Added to SRS" color="text-burgundy-600" bg="bg-burgundy-50" />
            <StatCard icon={Brain} label="Quizzes Done" value={progress.totalQuizzesTaken} sub="+25 XP each" color="text-blue-600" bg="bg-blue-50" />
            <StatCard icon={Trophy} label="Badges" value={`${earnedCount}/${allBadges.length}`} sub="Achievements" color="text-purple-600" bg="bg-purple-50" />
          </div>

          {/* Rank */}
          <motion.div
            className="bg-white dark:bg-dark-warm-100 rounded-2xl border border-cream-200 dark:border-dark-warm-50 shadow-sm p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <h2 className="font-bold text-gray-800 dark:text-cream-50 mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Rank
            </h2>
            <RankDisplay xp={progress.xp} />
          </motion.div>

          {/* Skill Breakdown */}
          <motion.div
            className="bg-white dark:bg-dark-warm-100 rounded-2xl border border-cream-200 dark:border-dark-warm-50 shadow-sm p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="font-bold text-gray-800 dark:text-cream-50 mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-burgundy-500" />
              Skill Breakdown
            </h2>
            <SkillBreakdown skillXP={progress.skillXP} />
          </motion.div>

          {/* Activity Heatmap */}
          <motion.div
            className="bg-white dark:bg-dark-warm-100 rounded-2xl border border-cream-200 dark:border-dark-warm-50 shadow-sm p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
          >
            <h2 className="font-bold text-gray-800 dark:text-cream-50 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-burgundy-500" />
              Activity — Last 28 Days
            </h2>
            <ActivityHeatmap dailyXP={progress.dailyXP} />
          </motion.div>

          {/* Happy Hour card */}
          <motion.div
            className={`rounded-2xl border shadow-sm p-5 ${happyHour.active
              ? 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-700'
              : 'bg-white dark:bg-dark-warm-100 border-cream-200 dark:border-dark-warm-50'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.13 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${happyHour.active ? 'bg-amber-400' : 'bg-gray-100 dark:bg-dark-warm-200'}`}>
                  <Zap className={`w-5 h-5 ${happyHour.active ? 'text-white' : 'text-gray-400'}`} />
                </div>
                <div>
                  <h2 className="font-bold text-gray-800 dark:text-cream-50 text-sm">
                    {happyHour.active ? `⚡ Happy Hour: ${happyHour.label}` : 'Happy Hour 2× XP'}
                  </h2>
                  {happyHour.active ? (
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-0.5">
                      Active now — all XP doubled! Ends in {formatMins(happyHour.endsInMins)}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400 mt-0.5">
                      Next: {happyHour.label} in {formatMins(happyHour.minsUntilNext)}
                    </p>
                  )}
                </div>
              </div>
              {happyHour.active && (
                <span className="text-xs font-black px-2.5 py-1 rounded-full bg-amber-400 text-white shadow">2× XP</span>
              )}
              {!happyHour.active && (
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatMins(happyHour.minsUntilNext)}</span>
                </div>
              )}
            </div>
            <div className="mt-3 flex gap-2 text-[11px] text-gray-400 dark:text-gray-500">
              <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 font-medium">6–9 AM Morning Boost</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 font-medium">12–2 PM Lunch Rush</span>
            </div>
          </motion.div>

          {/* Streak calendar */}
          <motion.div
            className="bg-white dark:bg-dark-warm-100 rounded-2xl border border-cream-200 dark:border-dark-warm-50 shadow-sm p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h2 className="font-bold text-gray-800 dark:text-cream-50 mb-4 flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" />
              Daily Streak — {progress.streak} days
              {multiplier > 1 && <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${multiplier >= 3 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{multiplier}x XP</span>}
            </h2>
            <StreakDisplay streak={progress.streak} />
            {progress.streak === 0 && (
              <p className="text-sm text-gray-400 mt-3">Complete any lesson, quiz, or game to start your streak!</p>
            )}
            {progress.streak >= 3 && progress.streak < 7 && (
              <p className="text-sm text-amber-600 mt-3 font-medium">🔥 2x XP active! Reach a 7-day streak for 3x XP.</p>
            )}
            {progress.streak >= 7 && (
              <p className="text-sm text-red-600 mt-3 font-bold">🔥🔥 3x XP active! Amazing streak — keep it up!</p>
            )}

            {/* Streak Freeze */}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-dark-warm-50">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Snowflake className="w-4 h-4 text-blue-400 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      Streak Freezes
                      <span className={`ml-2 text-xs font-bold px-1.5 py-0.5 rounded-full ${freezes > 0 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-100 text-gray-400'}`}>
                        {freezes}
                      </span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">Earn 1 freeze per 7-day streak milestone</p>
                  </div>
                </div>
                <button
                  onClick={handleActivateFreeze}
                  disabled={freezes <= 0}
                  className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    freezes > 0
                      ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm'
                      : 'bg-gray-100 dark:bg-dark-warm-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Activate
                </button>
              </div>
              <AnimatePresence>
                {freezeMsg && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-medium"
                  >
                    {freezeMsg}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Weekly XP chart */}
          <motion.div
            className="bg-white dark:bg-dark-warm-100 rounded-2xl border border-cream-200 dark:border-dark-warm-50 shadow-sm p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-bold text-gray-800 dark:text-cream-50 mb-4 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-burgundy-500" />
              XP This Week
            </h2>
            <WeeklyChart weeklyXP={progress.weeklyXP} />
          </motion.div>

          {/* CEFR level map */}
          <motion.div
            className="bg-white dark:bg-dark-warm-100 rounded-2xl border border-cream-200 dark:border-dark-warm-50 shadow-sm p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
          >
            <h2 className="font-bold text-gray-800 dark:text-cream-50 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-burgundy-500" />
              CEFR Level Progress
            </h2>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((level, i) => {
                const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
                const current = levels.indexOf(progress.cefrLevel)
                const isCurrent = level === progress.cefrLevel
                const isPast = i < current

                return (
                  <div key={level} className="flex items-center gap-2">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center border-2 transition-all ${
                      isCurrent ? 'border-burgundy-600 bg-burgundy-600 text-cream-50 shadow-lg scale-110' :
                      isPast ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' :
                      'border-gray-200 dark:border-dark-warm-50 bg-gray-50 dark:bg-dark-warm-200 text-gray-400'
                    }`}>
                      <span className="text-xs font-black">{level}</span>
                      {isPast && <span className="text-xs">✓</span>}
                    </div>
                    {i < 5 && <div className={`w-6 h-0.5 rounded ${isPast ? 'bg-emerald-400' : 'bg-gray-200 dark:bg-dark-warm-50'}`} />}
                  </div>
                )
              })}
            </div>
            <p className="text-xs text-gray-400 mt-3">Your current level is set to {progress.cefrLevel}. Complete grammar lessons and quizzes to advance.</p>
          </motion.div>

          {/* Badges */}
          <motion.div
            className="bg-white dark:bg-dark-warm-100 rounded-2xl border border-cream-200 dark:border-dark-warm-50 shadow-sm p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <h2 className="font-bold text-gray-800 dark:text-cream-50 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Badges — {earnedCount} earned
            </h2>
            <BadgeGrid earned={progress.badges || []} allBadges={allBadges} />
          </motion.div>

        </div>
      </div>
    </>
  )
}

export default Progress
