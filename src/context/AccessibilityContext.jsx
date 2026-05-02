import React, { createContext, useContext, useState, useEffect } from 'react'

const AccessibilityContext = createContext()

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext)
  if (!context) throw new Error('useAccessibility must be used within AccessibilityProvider')
  return context
}

const FONT_SIZE_MAP = { normal: '16px', large: '18px', xlarge: '20px' }
const STORAGE_KEY = 'saybonjour_accessibility'

export const AccessibilityProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState('normal')
  const [dyslexiaFont, setDyslexiaFont] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      if (stored.fontSize) setFontSize(stored.fontSize)
      if (stored.dyslexiaFont) setDyslexiaFont(!!stored.dyslexiaFont)
      if (stored.highContrast) setHighContrast(!!stored.highContrast)
      if (stored.reduceMotion) setReduceMotion(!!stored.reduceMotion)
    } catch {}
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.style.fontSize = FONT_SIZE_MAP[fontSize] || '16px'
    root.classList.toggle('dyslexia-font', dyslexiaFont)
    root.classList.toggle('high-contrast', highContrast)
    root.classList.toggle('reduce-motion', reduceMotion)
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ fontSize, dyslexiaFont, highContrast, reduceMotion }))
  }, [fontSize, dyslexiaFont, highContrast, reduceMotion])

  return (
    <AccessibilityContext.Provider value={{ fontSize, setFontSize, dyslexiaFont, setDyslexiaFont, highContrast, setHighContrast, reduceMotion, setReduceMotion }}>
      {children}
    </AccessibilityContext.Provider>
  )
}
