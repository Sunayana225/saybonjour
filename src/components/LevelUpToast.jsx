import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { getProgress } from '../utils/progress'
import Confetti from './Confetti'

export default function LevelUpToast() {
  const [show, setShow] = useState(false)
  const [level, setLevel] = useState(null)
  const lastLevel = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    lastLevel.current = getProgress().level

    const handler = () => {
      const p = getProgress()
      if (lastLevel.current !== null && p.level > lastLevel.current) {
        setLevel(p.level)
        setShow(true)
        clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => setShow(false), 5500)
      }
      lastLevel.current = p.level
    }

    window.addEventListener('progressUpdated', handler)
    return () => {
      window.removeEventListener('progressUpdated', handler)
      clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <>
      <Confetti trigger={show} />
      <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 64, scale: 0.82 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.9 }}
          transition={{ type: 'spring', damping: 15, stiffness: 280 }}
          className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-4 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-white rounded-2xl shadow-2xl px-7 py-4 min-w-[290px] max-w-xs"
        >
          <div className="text-4xl select-none animate-bounce">⭐</div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-xl leading-none">Level {level}!</p>
            <p className="text-sm opacity-90 mt-1 font-medium leading-snug">
              You levelled up — keep going!
            </p>
          </div>
          <button
            onClick={() => setShow(false)}
            className="opacity-75 hover:opacity-100 transition-opacity shrink-0"
            aria-label="Dismiss"
          >
            <X size={17} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  )
}
