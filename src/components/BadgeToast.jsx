import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export default function BadgeToast() {
  const [queue, setQueue] = useState([])
  const [current, setCurrent] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      setQueue(q => [...q, { ...e.detail.badge, uid: Date.now() + Math.random() }])
    }
    window.addEventListener('badgeEarned', handler)
    return () => window.removeEventListener('badgeEarned', handler)
  }, [])

  useEffect(() => {
    if (!current && queue.length > 0) {
      const [next, ...rest] = queue
      setCurrent(next)
      setQueue(rest)
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setCurrent(null), 4500)
    }
  }, [queue, current])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          key={current.uid}
          initial={{ opacity: 0, x: 80, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 80, scale: 0.9 }}
          transition={{ type: 'spring', damping: 18, stiffness: 300 }}
          className="fixed bottom-20 right-5 z-[9998] flex items-center gap-3 bg-white dark:bg-dark-warm-100 border border-amber-200 dark:border-amber-700 rounded-2xl shadow-2xl px-4 py-3.5 max-w-xs"
        >
          <div className="text-3xl select-none shrink-0">{current.icon}</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-0.5">Badge Unlocked!</p>
            <p className="text-sm font-bold text-gray-900 dark:text-cream-50 leading-tight">{current.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug mt-0.5">{current.description}</p>
          </div>
          <button onClick={() => setCurrent(null)} className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={15} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
