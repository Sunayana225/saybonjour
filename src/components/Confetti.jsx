import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const COLORS = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#06b6d4']

export default function Confetti({ trigger }) {
  const [pieces, setPieces] = useState([])

  useEffect(() => {
    if (!trigger) return
    setPieces(Array.from({ length: 48 }, (_, i) => ({
      id: i,
      color: COLORS[i % COLORS.length],
      x: (Math.random() - 0.5) * (window.innerWidth * 0.8),
      y: -(Math.random() * 280 + 80),
      rotate: Math.random() * 720 - 360,
      size: 6 + Math.random() * 8,
      delay: Math.random() * 0.3,
    })))
    const t = setTimeout(() => setPieces([]), 2200)
    return () => clearTimeout(t)
  }, [trigger])

  return (
    <AnimatePresence>
      {pieces.length > 0 && (
        <div className="pointer-events-none fixed inset-0 z-[9996] overflow-hidden flex items-center justify-center">
          {pieces.map(p => (
            <motion.div
              key={p.id}
              className="absolute rounded-sm"
              style={{ backgroundColor: p.color, width: p.size, height: p.size / 2 }}
              initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
              animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.rotate }}
              transition={{ duration: 1.4 + Math.random() * 0.6, ease: 'easeOut', delay: p.delay }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  )
}
