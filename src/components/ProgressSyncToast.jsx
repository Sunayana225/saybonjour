import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, CheckCircle, X, Trophy, Zap } from 'lucide-react'
import { getProgress } from '../utils/progress'
import { useUser } from '../context/UserContext'

const LAST_SYNCED_XP_KEY = 'sb_last_synced_xp'
const LAST_PROMPT_KEY = 'sb_last_sync_prompt_ts'
const MIN_PROMPT_INTERVAL_MS = 5 * 60 * 1000
const DEBOUNCE_MS = 2500
const AUTO_DISMISS_MS = 10000

export default function ProgressSyncToast() {
  const { user, syncProgress } = useUser()
  const [visible, setVisible] = useState(false)
  const [phase, setPhase] = useState('idle')
  const debounceRef = useRef(null)
  const dismissRef = useRef(null)

  const clearTimers = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (dismissRef.current) clearTimeout(dismissRef.current)
  }

  const dismiss = useCallback(() => {
    setVisible(false)
    setTimeout(() => setPhase('idle'), 400)
    clearTimers()
  }, [])

  const handleSync = useCallback(async () => {
    setPhase('syncing')
    try {
      const progress = getProgress()
      await syncProgress(progress)
      localStorage.setItem(LAST_SYNCED_XP_KEY, String(progress.xp))
      localStorage.setItem(LAST_PROMPT_KEY, String(Date.now()))
      setPhase('done')
      if (dismissRef.current) clearTimeout(dismissRef.current)
      dismissRef.current = setTimeout(dismiss, 3000)
    } catch {
      setPhase('ready')
    }
  }, [syncProgress, dismiss])

  useEffect(() => {
    if (!user) return

    const handleProgressUpdated = () => {
      clearTimers()
      debounceRef.current = setTimeout(() => {
        const now = Date.now()
        const lastPromptTs = Number(localStorage.getItem(LAST_PROMPT_KEY) || 0)
        if (now - lastPromptTs < MIN_PROMPT_INTERVAL_MS) return

        const progress = getProgress()
        const lastSyncedXP = Number(localStorage.getItem(LAST_SYNCED_XP_KEY) || -1)
        if (progress.xp <= lastSyncedXP) return
        if (progress.xp === 0) return

        setPhase('ready')
        setVisible(true)
        localStorage.setItem(LAST_PROMPT_KEY, String(now))

        dismissRef.current = setTimeout(dismiss, AUTO_DISMISS_MS)
      }, DEBOUNCE_MS)
    }

    window.addEventListener('progressUpdated', handleProgressUpdated)
    return () => {
      window.removeEventListener('progressUpdated', handleProgressUpdated)
      clearTimers()
    }
  }, [user, dismiss])

  if (!user) return null

  const xp = getProgress().xp

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 340, damping: 30 }}
          className="fixed bottom-5 right-5 z-[9998] w-72 bg-white dark:bg-dark-warm-100 rounded-2xl shadow-2xl border border-gray-100 dark:border-dark-warm-50 overflow-hidden"
        >
          {phase !== 'done' && (
            <div className="h-1 w-full bg-gray-100 dark:bg-dark-warm-50">
              <motion.div
                className="h-full bg-gradient-to-r from-burgundy-500 to-burgundy-600"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: AUTO_DISMISS_MS / 1000, ease: 'linear' }}
              />
            </div>
          )}

          <div className="p-4">
            {phase === 'done' ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-cream-50">Progress synced!</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                    <Trophy className="w-3 h-3 text-amber-500" /> You're on the leaderboard
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-burgundy-50 dark:bg-burgundy-900/30 flex items-center justify-center shrink-0 mt-0.5">
                  <UploadCloud className="w-5 h-5 text-burgundy-600 dark:text-burgundy-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-cream-50 leading-tight">
                    Sync to the leaderboard
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500" />
                    {xp.toLocaleString()} XP earned — share your rank
                  </p>
                  <button
                    onClick={handleSync}
                    disabled={phase === 'syncing'}
                    className="mt-2.5 w-full py-1.5 rounded-lg text-xs font-semibold text-white bg-burgundy-600 hover:bg-burgundy-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-1.5"
                  >
                    {phase === 'syncing'
                      ? <><UploadCloud className="w-3.5 h-3.5 animate-bounce" /> Syncing…</>
                      : <><UploadCloud className="w-3.5 h-3.5" /> Sync now</>}
                  </button>
                </div>
                <button onClick={dismiss}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-warm-200 transition-colors shrink-0">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
