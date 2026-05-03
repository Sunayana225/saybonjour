import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Accessibility, Shield, Database, Settings, Moon, Globe, Eye, Type, Zap, Trash2, Download, Key, Clock, Check, AlertTriangle, RefreshCw, Mail } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useAccessibility } from '../context/AccessibilityContext'
import { useI18n } from '../context/i18nContext'
import { useUser } from '../context/UserContext'
import SEO from '../components/SEO'

const TAB_ICONS = {
  preferences: Settings,
  notifications: Bell,
  accessibility: Accessibility,
  security: Shield,
  data: Database,
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function AccountSettings() {
  const { isDark, toggleTheme } = useTheme()
  const { fontSize, setFontSize, dyslexiaFont, setDyslexiaFont, highContrast, setHighContrast, reduceMotion, setReduceMotion } = useAccessibility()
  const { lang, toggleLang, t } = useI18n()
  const { user, updateProfile, changePassword, changeEmail, deleteAccount, exportData } = useUser()

  const [activeTab, setActiveTab] = useState('preferences')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  const [reminderEnabled, setReminderEnabled] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sb_reminders') || '{}').enabled || false } catch { return false }
  })
  const [reminderTime, setReminderTime] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sb_reminders') || '{}').time || '09:00' } catch { return '09:00' }
  })
  const [reminderDays, setReminderDays] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sb_reminders') || '{}').days || ['Mon', 'Wed', 'Fri'] } catch { return ['Mon', 'Wed', 'Fri'] }
  })
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [weeklyReport, setWeeklyReport] = useState(true)

  const [pwCurrent, setPwCurrent] = useState('')
  const [pwNew, setPwNew] = useState('')
  const [pwConfirm, setPwConfirm] = useState('')
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState('')
  const [pwLoading, setPwLoading] = useState(false)

  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [exporting, setExporting] = useState(false)

  const [emailNew, setEmailNew] = useState('')
  const [emailPassword, setEmailPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [emailSuccess, setEmailSuccess] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)

  const [weeklyGoal, setWeeklyGoal] = useState(user?.weekly_goal_xp || 500)

  const showSave = (msg = 'Saved!') => {
    setSaveMsg(msg)
    setTimeout(() => setSaveMsg(''), 2500)
  }

  const saveReminders = () => {
    const prefs = { enabled: reminderEnabled, time: reminderTime, days: reminderDays }
    localStorage.setItem('sb_reminders', JSON.stringify(prefs))
    if (reminderEnabled && 'Notification' in window) {
      Notification.requestPermission().then(p => {
        if (p === 'granted') scheduleReminders(prefs)
      })
    }
    showSave('Reminder preferences saved!')
  }

  const scheduleReminders = (prefs) => {
    if (!prefs.enabled) return
    const [h, m] = prefs.time.split(':').map(Number)
    const now = new Date()
    const dayMap = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 0 }
    prefs.days.forEach(day => {
      const target = new Date()
      const diff = (dayMap[day] - now.getDay() + 7) % 7
      target.setDate(now.getDate() + (diff === 0 ? 7 : diff))
      target.setHours(h, m, 0, 0)
      const ms = target - now
      if (ms > 0) {
        setTimeout(() => {
          new Notification('SayBonjour — Study time!', {
            body: `Time for your ${user?.daily_goal_mins || 10} minute French session 🇫🇷`,
            icon: '/favicon.svg'
          })
        }, ms)
      }
    })
  }

  const handleEmailChange = async (e) => {
    e.preventDefault()
    setEmailError('')
    setEmailSuccess('')
    if (!emailNew.trim()) { setEmailError('Please enter a new email address.'); return }
    setEmailLoading(true)
    try {
      const result = await changeEmail(emailNew.trim(), emailPassword)
      setEmailSuccess(result.message || 'Email updated! Check your new inbox to verify.')
      setEmailNew('')
      setEmailPassword('')
    } catch (err) {
      setEmailError(err.response?.data?.message || 'Failed to update email.')
    } finally {
      setEmailLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPwError('')
    setPwSuccess('')
    if (pwNew.length < 6) { setPwError('New password must be at least 6 characters.'); return }
    if (pwNew !== pwConfirm) { setPwError('Passwords do not match.'); return }
    setPwLoading(true)
    try {
      await changePassword(pwCurrent, pwNew)
      setPwSuccess('Password changed successfully!')
      setPwCurrent(''); setPwNew(''); setPwConfirm('')
    } catch (err) {
      setPwError(err.response?.data?.message || 'Failed to change password.')
    } finally {
      setPwLoading(false)
    }
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const data = await exportData()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = `saybonjour_data_${new Date().toISOString().slice(0,10)}.json`
      a.click(); URL.revokeObjectURL(url)
    } catch {
    } finally {
      setExporting(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') return
    setDeleting(true)
    try {
      await deleteAccount()
    } catch {
      setDeleting(false)
    }
  }

  const toggleReminderDay = (day) => {
    setReminderDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])
  }

  const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-warm-50 bg-gray-50 dark:bg-dark-warm-200 text-gray-800 dark:text-cream-50 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-400 transition-all'
  const toggleCls = (on) => `relative w-11 h-6 rounded-full transition-colors cursor-pointer ${on ? 'bg-burgundy-600' : 'bg-gray-300 dark:bg-gray-600'}`

  const Toggle = ({ on, onChange, label, desc }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-dark-warm-50 last:border-0">
      <div>
        <div className="text-sm font-medium text-gray-800 dark:text-cream-50">{label}</div>
        {desc && <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{desc}</div>}
      </div>
      <button onClick={() => onChange(!on)} className={toggleCls(on)} aria-checked={on} role="switch">
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  )

  const TABS = [
    { id: 'preferences', label: t('preferences'), Icon: Settings },
    { id: 'notifications', label: t('notifications'), Icon: Bell },
    { id: 'accessibility', label: t('accessibility'), Icon: Eye },
    { id: 'security', label: t('security'), Icon: Shield },
    { id: 'data', label: t('data'), Icon: Database },
  ]

  return (
    <>
      <SEO title={`${t('accountSettings')} | SayBonjour`} url="/settings" noindex />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-cream-50" style={{ fontFamily: 'Playfair Display, serif' }}>
            {t('accountSettings')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your preferences, notifications, and account data</p>
        </div>

        <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-dark-warm-200 rounded-xl p-1 overflow-x-auto">
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === id ? 'bg-white dark:bg-dark-warm-100 text-burgundy-700 dark:text-burgundy-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'preferences' && (
            <motion.div key="prefs" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="bg-white dark:bg-dark-warm-100 rounded-2xl p-6 shadow-sm space-y-1">
              <h2 className="text-base font-semibold text-gray-800 dark:text-cream-50 mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4 text-burgundy-600" /> Display & Interface
              </h2>
              <Toggle on={isDark} onChange={toggleTheme} label={t('darkMode')} desc="Switch between light and dark interface" />
              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-dark-warm-50">
                <div>
                  <div className="text-sm font-medium text-gray-800 dark:text-cream-50">{t('language')}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Interface language (English / Français)</div>
                </div>
                <button onClick={toggleLang}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gray-100 dark:bg-dark-warm-200 text-sm font-medium text-gray-700 dark:text-cream-50 hover:bg-gray-200 dark:hover:bg-dark-warm-50 transition-colors">
                  <Globe className="w-3.5 h-3.5" />
                  {lang === 'en' ? '🇬🇧 EN' : '🇫🇷 FR'}
                </button>
              </div>
              <div className="py-3">
                <div className="text-sm font-medium text-gray-800 dark:text-cream-50 mb-3">Daily Study Goal</div>
                <div className="grid grid-cols-3 gap-2">
                  {[5, 10, 15, 20, 30, 45].map(m => (
                    <button key={m}
                      onClick={() => { updateProfile({ daily_goal_mins: m }); showSave() }}
                      className={`py-2 rounded-xl text-sm font-medium transition-all ${user?.daily_goal_mins === m ? 'bg-burgundy-600 text-white' : 'bg-gray-100 dark:bg-dark-warm-200 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-warm-50'}`}>
                      {m} min
                    </button>
                  ))}
                </div>
              </div>
              <div className="py-3">
                <div className="text-sm font-medium text-gray-800 dark:text-cream-50 mb-2">Weekly XP Goal</div>
                <div className="flex items-center gap-3">
                  <input type="range" min="100" max="2000" step="100" value={weeklyGoal}
                    onChange={e => setWeeklyGoal(Number(e.target.value))}
                    className="flex-1 accent-burgundy-600" />
                  <span className="text-sm font-bold text-burgundy-600 dark:text-burgundy-400 w-16 text-right">{weeklyGoal} XP</span>
                </div>
                <button onClick={() => { updateProfile({ weekly_goal_xp: weeklyGoal }); showSave() }}
                  className="mt-2 px-4 py-1.5 bg-burgundy-600 text-white text-sm rounded-lg hover:bg-burgundy-700 transition-colors">
                  Save goal
                </button>
              </div>
              {saveMsg && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-green-700 dark:text-green-400 text-sm bg-green-50 dark:bg-green-900/20 rounded-lg px-3 py-2">
                  <Check className="w-4 h-4" /> {saveMsg}
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div key="notifs" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="bg-white dark:bg-dark-warm-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-semibold text-gray-800 dark:text-cream-50 mb-4 flex items-center gap-2">
                <Bell className="w-4 h-4 text-burgundy-600" /> {t('notifications')}
              </h2>
              <div className="space-y-1 mb-6">
                <Toggle on={emailNotifs} onChange={setEmailNotifs} label="Email notifications" desc="Receive tips, updates, and achievement emails" />
                <Toggle on={weeklyReport} onChange={setWeeklyReport} label="Weekly progress report" desc="Summary of your learning activity every Monday" />
              </div>

              <div className="border-t border-gray-100 dark:border-dark-warm-50 pt-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm font-semibold text-gray-800 dark:text-cream-50">{t('studyReminders')}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Browser push notifications at your chosen time</div>
                  </div>
                  <button onClick={() => setReminderEnabled(p => !p)} className={toggleCls(reminderEnabled)}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${reminderEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                {reminderEnabled && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 block uppercase tracking-wide">Time</label>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <input type="time" value={reminderTime} onChange={e => setReminderTime(e.target.value)}
                          className={inputCls + ' w-36'} />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 block uppercase tracking-wide">Days</label>
                      <div className="flex gap-2 flex-wrap">
                        {DAYS.map(day => (
                          <button key={day} onClick={() => toggleReminderDay(day)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${reminderDays.includes(day) ? 'bg-burgundy-600 text-white' : 'bg-gray-100 dark:bg-dark-warm-200 text-gray-600 dark:text-gray-300 hover:bg-gray-200'}`}>
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                <button onClick={saveReminders}
                  className="mt-4 px-5 py-2 bg-burgundy-600 text-white text-sm rounded-xl font-medium hover:bg-burgundy-700 transition-colors">
                  Save reminder settings
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'accessibility' && (
            <motion.div key="a11y" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="bg-white dark:bg-dark-warm-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-semibold text-gray-800 dark:text-cream-50 mb-4 flex items-center gap-2">
                <Eye className="w-4 h-4 text-burgundy-600" /> {t('accessibility')}
              </h2>
              <div className="mb-5">
                <div className="text-sm font-medium text-gray-800 dark:text-cream-50 mb-3 flex items-center gap-2">
                  <Type className="w-4 h-4 text-gray-400" /> {t('fontSize')}
                </div>
                <div className="flex gap-2">
                  {[
                    { key: 'normal', label: 'Normal', size: 'text-sm' },
                    { key: 'large', label: 'Large', size: 'text-base' },
                    { key: 'xlarge', label: 'X-Large', size: 'text-lg' },
                  ].map(({ key, label, size }) => (
                    <button key={key} onClick={() => setFontSize(key)}
                      className={`flex-1 py-2.5 rounded-xl transition-all ${size} font-medium ${fontSize === key ? 'bg-burgundy-600 text-white' : 'bg-gray-100 dark:bg-dark-warm-200 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-warm-50'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <Toggle on={dyslexiaFont} onChange={setDyslexiaFont} label={t('dyslexiaFont')} desc="OpenDyslexic font makes reading easier" />
                <Toggle on={highContrast} onChange={setHighContrast} label={t('highContrast')} desc="Increase contrast for better readability" />
                <Toggle on={reduceMotion} onChange={setReduceMotion} label={t('reduceMotion')} desc="Disable decorative animations and transitions" />
              </div>
              <div className="mt-4 p-3 bg-gray-50 dark:bg-dark-warm-200 rounded-xl text-xs text-gray-500 dark:text-gray-400">
                Preview text: <span className="text-gray-800 dark:text-cream-50 font-medium">La langue française est très belle. French is a beautiful language.</span>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div key="sec" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="bg-white dark:bg-dark-warm-100 rounded-2xl p-6 shadow-sm space-y-8">
              <div>
                <h2 className="text-base font-semibold text-gray-800 dark:text-cream-50 mb-1 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-burgundy-600" /> Change Email Address
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Current address: <span className="font-medium text-gray-700 dark:text-gray-300">{user?.email}</span>
                  {user?.email_verified
                    ? <span className="ml-2 inline-flex items-center gap-1 text-green-600 dark:text-green-400"><Check className="w-3 h-3" /> Verified</span>
                    : <span className="ml-2 text-amber-600 dark:text-amber-400">· Unverified</span>}
                </p>
                <form onSubmit={handleEmailChange} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">New Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="email" value={emailNew} onChange={e => setEmailNew(e.target.value)} required
                        className={inputCls + ' pl-10'} placeholder="you@example.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Confirm with Current Password</label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="password" value={emailPassword} onChange={e => setEmailPassword(e.target.value)} required
                        className={inputCls + ' pl-10'} placeholder="Your current password" />
                    </div>
                  </div>
                  {emailError && <p className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{emailError}</p>}
                  {emailSuccess && <p className="text-green-600 dark:text-green-400 text-sm bg-green-50 dark:bg-green-900/20 rounded-lg px-3 py-2">{emailSuccess}</p>}
                  <button type="submit" disabled={emailLoading}
                    className="px-6 py-2.5 bg-burgundy-600 text-white rounded-xl font-medium hover:bg-burgundy-700 disabled:opacity-50 transition-colors text-sm">
                    {emailLoading ? 'Updating…' : 'Update email'}
                  </button>
                </form>
              </div>

              <div className="border-t border-gray-100 dark:border-dark-warm-50 pt-6">
                <h2 className="text-base font-semibold text-gray-800 dark:text-cream-50 mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-burgundy-600" /> {t('security')}
                </h2>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">{t('currentPassword')}</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="password" value={pwCurrent} onChange={e => setPwCurrent(e.target.value)} required
                      className={inputCls + ' pl-10'} placeholder="Your current password" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">{t('newPassword')}</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="password" value={pwNew} onChange={e => setPwNew(e.target.value)} required minLength={6}
                      className={inputCls + ' pl-10'} placeholder="Min. 6 characters" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">{t('confirmPassword')}</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="password" value={pwConfirm} onChange={e => setPwConfirm(e.target.value)} required
                      className={inputCls + ' pl-10'} placeholder="Repeat new password" />
                  </div>
                </div>
                {pwError && <p className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{pwError}</p>}
                {pwSuccess && <p className="text-green-600 dark:text-green-400 text-sm bg-green-50 dark:bg-green-900/20 rounded-lg px-3 py-2">{pwSuccess}</p>}
                <button type="submit" disabled={pwLoading}
                  className="px-6 py-2.5 bg-burgundy-600 text-white rounded-xl font-medium hover:bg-burgundy-700 disabled:opacity-50 transition-colors text-sm">
                  {pwLoading ? 'Updating...' : t('changePassword')}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-gray-100 dark:border-dark-warm-50">
                <div className="text-sm font-medium text-gray-800 dark:text-cream-50 mb-1">Account security tips</div>
                <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1 list-disc list-inside">
                  <li>Use a unique password not used on other sites</li>
                  <li>Your session lasts 30 days before requiring re-login</li>
                  <li>We never store your password in plain text</li>
                </ul>
              </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'data' && (
            <motion.div key="data" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="bg-white dark:bg-dark-warm-100 rounded-2xl p-6 shadow-sm space-y-6">
              <h2 className="text-base font-semibold text-gray-800 dark:text-cream-50 flex items-center gap-2">
                <Database className="w-4 h-4 text-burgundy-600" /> {t('data')}
              </h2>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1 flex items-center gap-2">
                  <Download className="w-4 h-4" /> {t('exportData')}
                </div>
                <p className="text-xs text-blue-700 dark:text-blue-400 mb-3">Download a JSON file with all your profile data, study history, progress, and preferences.</p>
                <button onClick={handleExport} disabled={exporting}
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  {exporting ? 'Preparing...' : 'Download my data'}
                </button>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                <div className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" /> Sync Progress to Cloud
                </div>
                <p className="text-xs text-amber-700 dark:text-amber-400 mb-3">Save your local progress data to the server so you can access it on other devices.</p>
                <button onClick={() => {
                  try {
                    const prog = JSON.parse(localStorage.getItem('saybonjour_progress') || '{}')
                    fetch('/api/users/progress-sync', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json', 'X-User-Token': localStorage.getItem('userToken') || '' },
                      body: JSON.stringify({ progress: prog })
                    }).then(() => showSave('Progress synced to cloud!'))
                  } catch {}
                }} className="px-5 py-2 bg-amber-600 text-white rounded-xl text-sm font-medium hover:bg-amber-700 transition-colors flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" /> Sync now
                </button>
              </div>

              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/40">
                <div className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1 flex items-center gap-2">
                  <Trash2 className="w-4 h-4" /> {t('deleteAccount')}
                </div>
                <p className="text-xs text-red-600 dark:text-red-400 mb-3">Permanently delete your account and all associated data. This cannot be undone.</p>
                <button onClick={() => setDeleteModal(true)}
                  className="px-5 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors">
                  Delete my account
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {deleteModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-dark-warm-100 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-cream-50">Delete Account</div>
                  <div className="text-xs text-gray-500">This action is irreversible</div>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Type <strong>DELETE</strong> to confirm you want to permanently delete your account and all data.</p>
              <input type="text" value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)}
                placeholder="Type DELETE to confirm"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-warm-50 bg-gray-50 dark:bg-dark-warm-200 text-gray-800 dark:text-cream-50 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 mb-4" />
              <div className="flex gap-3">
                <button onClick={() => { setDeleteModal(false); setDeleteConfirm('') }}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-dark-warm-50 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button onClick={handleDeleteAccount} disabled={deleteConfirm !== 'DELETE' || deleting}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-40 transition-colors">
                  {deleting ? 'Deleting...' : 'Delete Forever'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  )
}
