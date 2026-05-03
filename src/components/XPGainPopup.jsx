import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

let _id = 0

export default function XPGainPopup() {
  const [pops, setPops] = useState([])

  useEffect(() => {
    const handler = (e) => {
      const { amount } = e.detail || {}
      if (!amount || amount <= 0) return
      const id = ++_id
      setPops(p => [...p.slice(-5), { id, amount }])
      setTimeout(() => setPops(p => p.filter(x => x.id !== id)), 1600)
    }
    window.addEventListener('xpGained', handler)
    return () => window.removeEventListener('xpGained', handler)
  }, [])

  return (
    <div className="fixed bottom-36 right-5 z-[9997] flex flex-col-reverse gap-1 pointer-events-none">
      <AnimatePresence>
        {pops.map(pop => (
          <motion.div
            key={pop.id}
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -40, scale: 1.1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            className="text-sm font-black text-amber-500 drop-shadow-md select-none text-right"
          >
            +{pop.amount} XP ⚡
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
