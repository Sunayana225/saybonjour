import React, { useState, useRef, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Edit3, LogOut, CheckCircle, User, Target, Star, Flame, BookOpen, Brain, Map, Settings, Clock, History, Upload, Eye, Mic, MailWarning, RefreshCw } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { getProgress, getAllBadges } from '../utils/progress'
import SEO from '../components/SEO'

const GOALS = [
  { value: 'travel', label: '✈️ Travel to France' },
  { value: 'conversation', label: '💬 Hold a conversation' },
  { value: 'exam', label: '📝 Pass DELF exam' },
  { value: 'business', label: '💼 Business French' },
  { value: 'culture', label: '🎨 French culture' },
  { value: 'fun', label: '😊 Just for fun' },
]
const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const LEVEL_COLORS = { A1: 'text-green-600', A2: 'text-lime-600', B1: 'text-yellow-600', B2: 'text-orange-500', C1: 'text-red-500', C2: 'text-purple-600' }

const TABS = [
  { id: 'overview', label: 'Overview', Icon: User },
  { id: 'edit', label: 'Edit Profile', Icon: Edit3 },
  { id: 'preferences', label: 'Learning Style', Icon: Eye },
]

function AvatarDisplay({ user, size = 'lg' }) {
  const dim = size === 'lg' ? 'w-24 h-24 text-3xl' : 'w-10 h-10 text-sm'
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '?'
  const gradients = ['from-burgundy-400 to-burgundy-600', 'from-blue-400 to-blue-600', 'from-green-400 to-green-600', 'from-purple-400 to-purple-600', 'from-amber-400 to-amber-600']
  const gi = user?.id ? user.id % gradients.length : 0
  if (user?.avatar_url) {
    return <img src={user.avatar_url} alt={user.name} className={`${dim} rounded-full object-cover border-4 border-white dark:border-dark-warm-100 shadow-lg`} />
  }
  return (
    <div className={`${dim} rounded-full bg-gradient-to-br ${gradients[gi]} flex items-center justify-center text-white font-bold shadow-lg border-4 border-white dark:border-dark-warm-100`}>
      {initials}
    </div>
  )
}

export default function Profile() {
  const { user, logout, updateProfile, uploadAvatar } = useUser()
  const navigate = useNavigate()
  const progress = useMemo(() => getProgress(), [])
  const badges = useMemo(() => getAllBadges(progress).filter(b => b.earned), [progress])

  const [activeTab, setActiveTab] = useState('overview')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [avatarLoading, setAvatarLoading] = useState(false)
  const fileRef = useRef(null)

  const [editName, setEditName] = useState(user?.name || '')
  const [editGoal, setEditGoal] = useState(user?.goal || '')
  const [editLevel, setEditLevel] = useState(user?.cefr_level || 'A1')
  const [editBio, setEditBio] = useState(user?.bio || '')

  const [visualPref, setVisualPref] = useState(user?.learning_prefs?.visual ?? 50)
  const [audioPref, setAudioPref] = useState(user?.learning_prefs?.audio ?? 30)
  const [readingPref, setReadingPref] = useState(user?.learning_prefs?.reading ?? 20)

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateProfile({ name: editName, goal: editGoal, cefr_level: editLevel, bio: editBio })
      setSaveMsg('Profile saved!')
      setTimeout(() => setSaveMsg(''), 2500)
    } catch {
      setSaveMsg('Failed to save.')
    } finally {
      setSaving(false)
    }
  }

  const handleSavePrefs = async () => {
    setSaving(true)
    try {
      await updateProfile({ learning_prefs: { visual: visualPref, audio: audioPref, reading: readingPref } })
      setSaveMsg('Preferences saved!')
      setTimeout(() => setSaveMsg(''), 2500)
    } catch {
      setSaveMsg('Failed to save.')
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarLoading(true)
    try { await uploadAvatar(file) } catch {}
    setAvatarLoading(false)
  }

  const handleLogout = () => { logout(); navigate('/') }

  const xp = progress?.xp || 0
  const streak = progress?.loginStreak || progress?.streak || 0
  const longestStreak = progress?.longestStreak || streak
  const wordsLearned = progress?.wordsLearned || progress?.totalWordsLearned || 0
  const quizzesTaken = progress?.quizzesTaken || progress?.totalQuizzesTaken || 0

  const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-warm-50 bg-gray-50 dark:bg-dark-warm-200 text-gray-800 dark:text-cream-50 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-400 transition-all'

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-cream-50 mb-2">Sign in to view your profile</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Track your progress and personalise your learning</p>
        <div className="flex gap-3 justify-center">
          <Link to="/login" className="px-6 py-3 bg-burgundy-600 text-white rounded-xl font-semibold hover:bg-burgundy-700 transition-colors">Sign In</Link>
          <Link to="/signup" className="px-6 py-3 border border-gray-200 dark:border-dark-warm-50 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-warm-200 transition-colors">Create Account</Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO title={`${user.name} | SayBonjour`} url="/profile" noindex />
      <div className="max-w-3xl mx-auto px-4 py-8">

        <div className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="h-20 bg-gradient-to-r from-burgundy-600 to-burgundy-800" />
          <div className="px-6 pb-5">
            <div className="flex items-end justify-between -mt-12 mb-4">
              <div className="relative">
                <AvatarDisplay user={user} size="lg" />
                <button onClick={() => fileRef.current?.click()} disabled={avatarLoading}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-white dark:bg-dark-warm-100 border-2 border-gray-200 dark:border-dark-warm-50 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
                  title="Change photo">
                  {avatarLoading ? <span className="text-xs animate-spin">⏳</span> : <Camera className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </div>
              <div className="flex gap-2 pb-1">
                <Link to="/settings" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-warm-200 transition-colors border border-gray-200 dark:border-dark-warm-50">
                  <Settings className="w-3.5 h-3.5" /> Settings
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border border-red-100 dark:border-red-900/40">
                  <LogOut className="w-3.5 h-3.5" /> Sign out
                </button>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-cream-50">{user.name}</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{user.email}</p>
              {user.bio && <p className="text-gray-600 dark:text-gray-300 text-sm mt-1.5">{user.bio}</p>}
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span className={`text-sm font-bold ${LEVEL_COLORS[user.cefr_level] || 'text-gray-600'}`}>{user.cefr_level}</span>
                <span className="text-gray-300 dark:text-gray-600">·</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{GOALS.find(g => g.value === user.goal)?.label || 'Learning French'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-1 bg-gray-100 dark:bg-dark-warm-200 rounded-xl p-1 mb-6">
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium flex-1 justify-center transition-all ${activeTab === id ? 'bg-white dark:bg-dark-warm-100 text-burgundy-700 dark:text-burgundy-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
              <Icon className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-5">

              {!user.email_verified && (
                <ProfileVerifyNotice email={user.email} />
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total XP', value: xp.toLocaleString(), icon: Star, color: 'text-amber-500' },
                  { label: 'Best Streak', value: `${longestStreak}d`, icon: Flame, color: 'text-orange-500' },
                  { label: 'Words Learned', value: wordsLearned, icon: BookOpen, color: 'text-blue-500' },
                  { label: 'Quizzes Taken', value: quizzesTaken, icon: Brain, color: 'text-purple-500' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="bg-white dark:bg-dark-warm-100 rounded-2xl p-4 shadow-sm text-center">
                    <Icon className={`w-5 h-5 mx-auto mb-1.5 ${color}`} />
                    <div className={`text-xl font-bold ${color}`}>{value}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>

              {badges.length > 0 && (
                <div className="bg-white dark:bg-dark-warm-100 rounded-2xl p-5 shadow-sm">
                  <h3 className="font-semibold text-gray-800 dark:text-cream-50 mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500" /> Earned Badges
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {badges.map(b => (
                      <div key={b.id} className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/40 rounded-xl px-3 py-2">
                        <span className="text-lg">{b.icon}</span>
                        <div>
                          <div className="text-xs font-semibold text-amber-800 dark:text-amber-300">{b.name}</div>
                          <div className="text-xs text-amber-600 dark:text-amber-400">{b.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { icon: Map, label: 'Learning Path', to: '/learning-path', color: 'text-burgundy-600' },
                  { icon: History, label: 'Study History', to: '/history', color: 'text-blue-600' },
                  { icon: Brain, label: 'Quizzes', to: '/quizzes', color: 'text-purple-600' },
                  { icon: Target, label: 'Daily Challenges', to: '/daily-challenges', color: 'text-orange-500' },
                  { icon: BookOpen, label: 'Vocabulary', to: '/vocabulary', color: 'text-green-600' },
                  { icon: Clock, label: 'Progress', to: '/progress', color: 'text-amber-600' },
                ].map(({ icon: Icon, label, to, color }) => (
                  <Link key={to} to={to} className="bg-white dark:bg-dark-warm-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${color} group-hover:scale-110 transition-transform`} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'edit' && (
            <motion.div key="edit" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <div className="bg-white dark:bg-dark-warm-100 rounded-2xl p-6 shadow-sm">
                <h2 className="font-semibold text-gray-800 dark:text-cream-50 mb-5 flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-burgundy-600" /> Edit Profile
                </h2>
                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="flex flex-col items-center gap-3 p-4 bg-gray-50 dark:bg-dark-warm-200 rounded-xl">
                    <AvatarDisplay user={user} size="lg" />
                    <button type="button" onClick={() => fileRef.current?.click()}
                      className="flex items-center gap-2 text-sm text-burgundy-600 dark:text-burgundy-400 hover:underline">
                      <Upload className="w-3.5 h-3.5" /> Change profile photo
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Display Name</label>
                    <input value={editName} onChange={e => setEditName(e.target.value)} required className={inputCls} placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Bio</label>
                    <textarea value={editBio} onChange={e => setEditBio(e.target.value)} rows={3} maxLength={200} className={inputCls + ' resize-none'} placeholder="Tell us about your French learning journey..." />
                    <div className="text-xs text-gray-400 text-right mt-1">{editBio.length}/200</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Learning Goal</label>
                    <select value={editGoal} onChange={e => setEditGoal(e.target.value)} className={inputCls}>
                      <option value="">Select a goal...</option>
                      {GOALS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">CEFR Level</label>
                    <div className="flex gap-2 flex-wrap">
                      {LEVELS.map(l => (
                        <button type="button" key={l} onClick={() => setEditLevel(l)}
                          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${editLevel === l ? 'bg-burgundy-600 text-white' : 'bg-gray-100 dark:bg-dark-warm-200 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-warm-50'}`}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  {saveMsg && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className={`text-sm px-3 py-2 rounded-lg ${saveMsg.includes('Failed') ? 'text-red-600 bg-red-50 dark:bg-red-900/20' : 'text-green-700 bg-green-50 dark:bg-green-900/20'}`}>
                      {saveMsg}
                    </motion.p>
                  )}
                  <button type="submit" disabled={saving}
                    className="w-full py-3 bg-burgundy-600 text-white rounded-xl font-semibold hover:bg-burgundy-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                    {saving ? '⏳ Saving...' : <><CheckCircle className="w-4 h-4" /> Save Changes</>}
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {activeTab === 'preferences' && (
            <motion.div key="prefs" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <div className="bg-white dark:bg-dark-warm-100 rounded-2xl p-6 shadow-sm">
                <h2 className="font-semibold text-gray-800 dark:text-cream-50 mb-2 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-burgundy-600" /> Learning Style Preferences
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Adjust these to tell us how you prefer to learn — we'll tailor content recommendations accordingly.</p>
                {[
                  { label: 'Visual', desc: 'Images, diagrams, color-coded examples', icon: Eye, value: visualPref, set: setVisualPref, color: 'accent-blue-500' },
                  { label: 'Audio & Speaking', desc: 'Listening exercises, pronunciation, speaking', icon: Mic, value: audioPref, set: setAudioPref, color: 'accent-purple-500' },
                  { label: 'Reading & Writing', desc: 'Texts, grammar rules, written exercises', icon: BookOpen, value: readingPref, set: setReadingPref, color: 'accent-green-500' },
                ].map(({ label, desc, icon: Icon, value, set, color }) => (
                  <div key={label} className="mb-5 pb-5 border-b border-gray-100 dark:border-dark-warm-50 last:border-0 last:mb-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-sm font-medium text-gray-800 dark:text-cream-50">{label}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{desc}</div>
                      </div>
                      <span className="text-lg font-bold text-burgundy-600 dark:text-burgundy-400">{value}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={value} onChange={e => set(Number(e.target.value))}
                      className={`w-full ${color}`} />
                  </div>
                ))}
                {saveMsg && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-lg px-3 py-2 mb-3">
                    {saveMsg}
                  </motion.p>
                )}
                <button onClick={handleSavePrefs} disabled={saving}
                  className="w-full py-3 bg-burgundy-600 text-white rounded-xl font-semibold hover:bg-burgundy-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                  {saving ? '⏳ Saving...' : <><CheckCircle className="w-4 h-4" /> Save Preferences</>}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

function ProfileVerifyNotice({ email }) {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleResend = async () => {
    setError('')
    setSending(true)
    try {
      await import('axios').then(m => m.default.post('/api/users/resend-verification', { email }))
      setSent(true)
    } catch (err) {
      setError('Failed to send. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4 flex gap-4 items-start"
    >
      <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0 mt-0.5">
        <MailWarning className="w-5 h-5 text-amber-600 dark:text-amber-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-0.5">Email not yet verified</p>
        <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed mb-3">
          Confirm your address <span className="font-medium">{email}</span> to fully secure your account.
          Check your inbox or request a new link.
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          {sent ? (
            <span className="flex items-center gap-1.5 text-xs font-medium text-green-700 dark:text-green-400">
              <CheckCircle className="w-3.5 h-3.5" /> New link sent — check your inbox!
            </span>
          ) : (
            <button onClick={handleResend} disabled={sending}
              className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-200 bg-amber-100 dark:bg-amber-900/40 hover:bg-amber-200 dark:hover:bg-amber-800/60 disabled:opacity-50 px-3 py-1.5 rounded-lg transition-colors">
              <RefreshCw className={`w-3 h-3 ${sending ? 'animate-spin' : ''}`} />
              {sending ? 'Sending…' : 'Resend confirmation email'}
            </button>
          )}
          {error && <span className="text-xs text-red-500 dark:text-red-400">{error}</span>}
        </div>
      </div>
    </motion.div>
  )
}
