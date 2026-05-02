import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Edit3, Save, LogOut, TrendingUp, BookOpen, Brain, Flame, Award, Target } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { getProgress, getAllBadges } from '../utils/progress'
import SEO from '../components/SEO'

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const GOALS = ['Conversational French', 'Travel to France', 'DELF Exam Prep', 'Business French', 'Academic French', 'Just for fun']

const avatarColors = [
  'bg-burgundy-600', 'bg-blue-600', 'bg-emerald-600', 'bg-purple-600', 'bg-amber-600', 'bg-rose-600'
]

const Profile = () => {
  const { user, logout, updateProfile } = useUser()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [goal, setGoal] = useState('')
  const [cefrLevel, setCefrLevel] = useState('A1')
  const [saving, setSaving] = useState(false)
  const [progress, setProgress] = useState(null)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    setName(user.name || '')
    setGoal(user.goal || '')
    setCefrLevel(user.cefr_level || 'A1')
    setProgress(getProgress())
  }, [user])

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateProfile({ name, goal, cefr_level: cefrLevel })
      setEditing(false)
    } catch {}
    setSaving(false)
  }

  const handleLogout = () => { logout(); navigate('/') }

  if (!user) return null

  const initials = (user.name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  const colorIdx = user.id ? user.id % avatarColors.length : 0
  const allBadges = getAllBadges()
  const earnedBadges = allBadges.filter(b => (progress?.badges || []).includes(b.id))

  return (
    <>
      <SEO title="My Profile | SayBonjour" url="/profile" />
      <div className="min-h-screen bg-gray-50 dark:bg-dark-warm-300">
        <div className="bg-gradient-to-r from-burgundy-800 to-burgundy-600 text-cream-50 py-10 px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              className="flex flex-col sm:flex-row items-center sm:items-start gap-6"
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            >
              <div className={`w-20 h-20 rounded-2xl ${avatarColors[colorIdx]} flex items-center justify-center text-2xl font-bold text-white shadow-lg flex-shrink-0`}>
                {initials}
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-3xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {user.name}
                </h1>
                <p className="text-cream-200 mt-1">{user.email}</p>
                <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                  <span className="bg-cream-50/20 px-3 py-1 rounded-full text-sm font-medium">
                    {user.cefr_level || 'A1'} · {user.cefr_level === 'A1' ? 'Beginner' : user.cefr_level === 'A2' ? 'Elementary' : user.cefr_level === 'B1' ? 'Intermediate' : user.cefr_level === 'B2' ? 'Upper-Int.' : user.cefr_level === 'C1' ? 'Advanced' : 'Mastery'}
                  </span>
                  {progress && <span className="bg-amber-400/30 px-3 py-1 rounded-full text-sm font-medium">🔥 {progress.streak} day streak</span>}
                </div>
              </div>
              <div className="sm:ml-auto flex gap-2">
                <button onClick={() => setEditing(e => !e)} className="px-4 py-2 bg-cream-50/20 hover:bg-cream-50/30 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
                  <Edit3 className="w-4 h-4" /> Edit
                </button>
                <button onClick={handleLogout} className="px-4 py-2 bg-cream-50/10 hover:bg-red-500/30 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
          {/* Edit form */}
          {editing && (
            <motion.div
              className="bg-white dark:bg-dark-warm-100 rounded-2xl border border-cream-200 dark:border-dark-warm-50 p-6 shadow-sm"
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="font-bold text-burgundy-800 dark:text-cream-50 mb-4">Edit Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                  <input value={name} onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-cream-300 dark:border-dark-warm-50 rounded-xl text-sm bg-cream-50 dark:bg-dark-warm-200 text-gray-800 dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-burgundy-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Learning Goal</label>
                  <select value={goal} onChange={e => setGoal(e.target.value)}
                    className="w-full px-4 py-2.5 border border-cream-300 dark:border-dark-warm-50 rounded-xl text-sm bg-cream-50 dark:bg-dark-warm-200 text-gray-800 dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-burgundy-400">
                    <option value="">Choose a goal...</option>
                    {GOALS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current CEFR Level</label>
                  <div className="flex gap-2 flex-wrap">
                    {CEFR_LEVELS.map(lvl => (
                      <button key={lvl} onClick={() => setCefrLevel(lvl)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${cefrLevel === lvl ? 'bg-burgundy-600 text-cream-50 border-burgundy-600' : 'bg-white dark:bg-dark-warm-200 text-gray-600 dark:text-gray-300 border-cream-200 dark:border-dark-warm-50 hover:border-burgundy-400'}`}>
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleSave} disabled={saving}
                    className="px-5 py-2 bg-burgundy-600 text-cream-50 rounded-xl text-sm font-medium hover:bg-burgundy-700 disabled:opacity-50 flex items-center gap-2">
                    <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button onClick={() => setEditing(false)} className="px-5 py-2 bg-gray-100 dark:bg-dark-warm-200 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200">
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stats */}
          {progress && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: TrendingUp, label: 'Total XP', value: progress.xp, color: 'text-burgundy-600', bg: 'bg-burgundy-50 dark:bg-burgundy-900/20' },
                { icon: Flame, label: 'Day Streak', value: progress.streak, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                { icon: BookOpen, label: 'Words', value: progress.totalWordsLearned, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                { icon: Brain, label: 'Quizzes', value: progress.totalQuizzesTaken, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
              ].map(({ icon: Icon, label, value, color, bg }) => (
                <motion.div key={label} whileHover={{ y: -2 }}
                  className="bg-white dark:bg-dark-warm-100 rounded-2xl border border-cream-200 dark:border-dark-warm-50 p-4 shadow-sm">
                  <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-2`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <div className="text-xl font-bold text-gray-800 dark:text-cream-50">{value}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Goal */}
          {user.goal && (
            <div className="bg-white dark:bg-dark-warm-100 rounded-2xl border border-cream-200 dark:border-dark-warm-50 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-burgundy-500" />
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Learning Goal</div>
                  <div className="font-semibold text-gray-800 dark:text-cream-50">{user.goal}</div>
                </div>
              </div>
            </div>
          )}

          {/* Earned badges */}
          {earnedBadges.length > 0 && (
            <div className="bg-white dark:bg-dark-warm-100 rounded-2xl border border-cream-200 dark:border-dark-warm-50 p-6 shadow-sm">
              <h2 className="font-bold text-gray-800 dark:text-cream-50 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Badges Earned ({earnedBadges.length})
              </h2>
              <div className="flex flex-wrap gap-3">
                {earnedBadges.map(badge => (
                  <div key={badge.id} className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 px-3 py-2 rounded-xl">
                    <span className="text-xl">{badge.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-amber-800 dark:text-amber-300">{badge.name}</div>
                      <div className="text-xs text-amber-600 dark:text-amber-400">{badge.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { to: '/progress', label: 'Full Dashboard', emoji: '📊' },
              { to: '/vocabulary', label: 'My Vocab Deck', emoji: '🧠' },
              { to: '/grammar', label: 'Grammar Hub', emoji: '📖' },
              { to: '/daily-challenges', label: 'Daily Challenges', emoji: '⚡' },
            ].map(({ to, label, emoji }) => (
              <Link key={to} to={to} className="bg-white dark:bg-dark-warm-100 rounded-xl border border-cream-200 dark:border-dark-warm-50 p-4 text-center hover:border-burgundy-300 hover:shadow-sm transition-all">
                <div className="text-2xl mb-1">{emoji}</div>
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile
