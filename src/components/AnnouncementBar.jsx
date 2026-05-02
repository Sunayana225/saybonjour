import { useState, useEffect } from 'react'
import axios from 'axios'
import { X } from 'lucide-react'

const DISMISS_KEY = 'announcement_dismissed'

export default function AnnouncementBar({ onVisibilityChange }) {
  const [text, setText] = useState('')
  const [dismissed, setDismissed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const isVisible = loaded && !!text && !dismissed

  useEffect(() => {
    axios.get('/api/site-settings')
      .then(res => {
        const msg = (res.data.announcement_bar || '').trim()
        const savedDismiss = sessionStorage.getItem(DISMISS_KEY)
        setText(msg)
        if (savedDismiss === msg) setDismissed(true)
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [])

  useEffect(() => {
    if (onVisibilityChange) onVisibilityChange(isVisible)
  }, [isVisible, onVisibilityChange])

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, text)
    setDismissed(true)
  }

  if (!isVisible) return null

  return (
    <div
      className="fixed top-[60px] left-0 right-0 z-40 flex items-center justify-center gap-3 px-4 py-2 text-sm font-medium text-white"
      style={{ background: '#800020' }}
    >
      <span className="text-center leading-snug">{text}</span>
      <button
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="ml-2 flex-shrink-0 opacity-80 hover:opacity-100 transition-opacity"
      >
        <X size={15} />
      </button>
    </div>
  )
}
