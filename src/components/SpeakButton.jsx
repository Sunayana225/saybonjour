import React, { useState, useEffect } from 'react'
import { Volume2, VolumeX, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { speakFrench, stopSpeech, isTTSAvailable, hasFrenchVoices } from '../utils/textToSpeech'

const SpeakButton = ({ 
  text, 
  className = '', 
  size = 'md',
  variant = 'default',
  showText = false,
  disabled = false,
  onSpeakStart,
  onSpeakEnd,
  onError
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isAvailable, setIsAvailable] = useState(false)
  const [hasFrench, setHasFrench] = useState(false)

  useEffect(() => {
    // Check TTS availability after a short delay to allow voices to load
    const checkAvailability = () => {
      setIsAvailable(isTTSAvailable())
      setHasFrench(hasFrenchVoices())
    }

    checkAvailability()

    // Recheck after a delay for browsers that load voices asynchronously
    const timer = setTimeout(checkAvailability, 1000)

    // Also recheck after a longer delay for slower systems
    const timer2 = setTimeout(checkAvailability, 3000)
    
    return () => {
      clearTimeout(timer)
      clearTimeout(timer2)
    }
  }, [])

  const handleSpeak = () => {
    if (!text || disabled || !isAvailable) return

    if (isPlaying) {
      // Stop current speech
      stopSpeech()
      setIsPlaying(false)
      return
    }

    // Start speaking
    setIsPlaying(true)
    
    const success = speakFrench(text, {
      onStart: () => {
        setIsPlaying(true)
        if (onSpeakStart) onSpeakStart()
      },
      onEnd: () => {
        setIsPlaying(false)
        if (onSpeakEnd) onSpeakEnd()
      },
      onError: (error) => {
        setIsPlaying(false)
        console.error('Speech error:', error)
        if (onError) onError(error)
      }
    })

    if (!success) {
      setIsPlaying(false)
    }
  }

  // Size configurations
  const sizeConfig = {
    sm: {
      button: 'w-8 h-8',
      icon: 14,
      text: 'text-xs'
    },
    md: {
      button: 'w-10 h-10',
      icon: 16,
      text: 'text-sm'
    },
    lg: {
      button: 'w-12 h-12',
      icon: 20,
      text: 'text-base'
    }
  }

  // Variant configurations
  const variantConfig = {
    default: hasFrench
      ? 'bg-burgundy-100 dark:bg-burgundy-vibrant-600/20 text-burgundy-600 dark:text-burgundy-vibrant-400 hover:bg-burgundy-200 dark:hover:bg-burgundy-vibrant-600/30'
      : 'bg-amber-100 dark:bg-amber-600/20 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-600/30',
    primary: hasFrench
      ? 'bg-burgundy-600 text-cream-50 hover:bg-burgundy-700'
      : 'bg-amber-600 text-cream-50 hover:bg-amber-700',
    ghost: hasFrench
      ? 'bg-transparent text-burgundy-600 dark:text-burgundy-vibrant-400 hover:bg-burgundy-50 dark:hover:bg-burgundy-vibrant-600/20'
      : 'bg-transparent text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-600/20',
    minimal: hasFrench
      ? 'bg-transparent text-burgundy-500 dark:text-burgundy-vibrant-300 hover:text-burgundy-600 dark:hover:text-burgundy-vibrant-400'
      : 'bg-transparent text-amber-500 dark:text-amber-300 hover:text-amber-600 dark:hover:text-amber-400'
  }

  const config = sizeConfig[size]
  const variantClass = variantConfig[variant]

  // Show a disabled button with explanation if TTS is not supported
  if (!isAvailable) {
    return (
      <div className={`${className} flex items-center space-x-2`}>
        <div
          className={`
            ${sizeConfig[size].button}
            bg-gray-100 dark:bg-dark-warm-100 text-gray-400
            rounded-lg flex items-center justify-center
            cursor-not-allowed opacity-50
          `}
          title="Text-to-speech not supported in this browser"
        >
          <VolumeX size={sizeConfig[size].icon} />
        </div>
        {showText && (
          <span className={`${sizeConfig[size].text} text-gray-400`}>
            Audio not available
          </span>
        )}
      </div>
    )
  }

  // Determine button title based on voice availability
  const getButtonTitle = () => {
    if (isPlaying) return 'Stop pronunciation'
    if (!hasFrench) return 'Listen to pronunciation (using system voice - French voice not available)'
    return 'Listen to pronunciation'
  }

  const buttonContent = (
    <>
      {isPlaying ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 size={config.icon} />
        </motion.div>
      ) : (
        <Volume2 size={config.icon} />
      )}
      {showText && (
        <span className={`ml-2 ${config.text}`}>
          {isPlaying ? 'Stop' : 'Listen'}
        </span>
      )}
    </>
  )

  return (
    <motion.button
      onClick={handleSpeak}
      disabled={disabled || !text}
      className={`
        ${config.button} 
        ${variantClass}
        ${showText ? 'px-3 w-auto' : ''}
        ${className}
        rounded-lg transition-all duration-200 
        flex items-center justify-center
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:ring-offset-2
        ${isPlaying ? 'ring-2 ring-burgundy-400' : ''}
      `}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      title={getButtonTitle()}
    >
      {buttonContent}
    </motion.button>
  )
}

export default SpeakButton
