import React, { useState, useEffect } from 'react'
import { Calendar, Volume2, BookOpen, Star, Clock, RefreshCw, Heart, Share2, Copy, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'
import ContentSidebar from '../components/ContentSidebar'
import SpeakButton from '../components/SpeakButton'
import BookmarkButton from '../components/BookmarkButton'
import FlashcardButton from '../components/FlashcardButton'
import TTSDebugInfo from '../components/TTSDebugInfo'
import { loadFavorites, toggleFavorite as toggleFavoriteUtil } from '../utils/favorites'
import { loadPhrases, getRandomPhrase } from '../utils/phraseData'

const PhraseOfTheDay = () => {
  const [sections, setSections] = useState([])
  const [selectedSection, setSelectedSection] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedPhrase, setSelectedPhrase] = useState(null)
  const [expandedSections, setExpandedSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState([])
  const [copied, setCopied] = useState(false)
  const [showPronunciation, setShowPronunciation] = useState(false)
  const [phrases, setPhrases] = useState([])

  useEffect(() => {
    setPhraseData()
    setFavorites(loadFavorites('phrases'))
    // Load phrases from admin data
    const adminPhrases = loadPhrases()
    setPhrases(adminPhrases)
  }, [])

  const setPhraseData = () => {
    const phraseSections = [
      {
        id: 1,
        title: 'Proverbs',
        items: [
          {
            id: 1,
            title: "Petit à petit, l'oiseau fait son nid",
            description: "Little by little, the bird builds its nest",
            french: "Petit à petit, l'oiseau fait son nid",
            english: "Little by little, the bird builds its nest",
            literal: "Little by little, the bird makes its nest",
            meaning: "Patience and persistence lead to success",
            pronunciation: "puh-TEE ah puh-TEE, lwa-ZOH feh sohn NEE",
            difficulty: "Intermediate",
            usage: "Used to encourage patience and steady progress",
            example: "Ne t'inquiète pas pour tes études. Petit à petit, l'oiseau fait son nid.",
            exampleTranslation: "Don't worry about your studies. Little by little, the bird builds its nest.",
            culturalNote: "This is a classic French proverb emphasizing the value of patience and gradual progress.",
            type: 'proverb'
          },
          {
            id: 2,
            title: "Qui vivra verra",
            description: "Time will tell",
            french: "Qui vivra verra",
            english: "Time will tell",
            literal: "Who will live will see",
            meaning: "We'll see what happens in the future",
            pronunciation: "kee vee-VRAH veh-RAH",
            difficulty: "Beginner",
            usage: "Used when the outcome is uncertain",
            example: "Je ne sais pas si ce projet réussira. Qui vivra verra.",
            exampleTranslation: "I don't know if this project will succeed. Time will tell.",
            culturalNote: "A common French saying about accepting uncertainty about the future.",
            type: 'proverb'
          },
          {
            id: 3,
            title: "L'habit ne fait pas le moine",
            description: "Don't judge a book by its cover",
            french: "L'habit ne fait pas le moine",
            english: "Don't judge a book by its cover",
            literal: "The habit doesn't make the monk",
            meaning: "Appearances can be deceiving",
            pronunciation: "lah-BEE nuh feh pah luh MWAN",
            difficulty: "Advanced",
            usage: "Used to warn against judging by appearances",
            example: "Il a l'air strict, mais l'habit ne fait pas le moine.",
            exampleTranslation: "He looks strict, but don't judge a book by its cover.",
            culturalNote: "This proverb dates back to medieval times when monks wore distinctive habits.",
            type: 'proverb'
          }
        ]
      },
      {
        id: 2,
        title: 'Idioms',
        items: [
          {
            id: 4,
            title: "Il pleut des cordes",
            description: "It's raining cats and dogs",
            french: "Il pleut des cordes",
            english: "It's raining cats and dogs",
            literal: "It's raining ropes",
            meaning: "It's raining very heavily",
            pronunciation: "eel PLUH day KORD",
            difficulty: "Beginner",
            usage: "Used to describe heavy rain",
            example: "Je ne peux pas sortir maintenant, il pleut des cordes !",
            exampleTranslation: "I can't go out now, it's raining cats and dogs!",
            culturalNote: "French uses 'ropes' instead of 'cats and dogs' to describe heavy rain.",
            type: 'idiom'
          },
          {
            id: 5,
            title: "Avoir le cafard",
            description: "To feel down/depressed",
            french: "Avoir le cafard",
            english: "To feel down/depressed",
            literal: "To have the cockroach",
            meaning: "To be sad or depressed",
            pronunciation: "ah-VWAR luh kah-FAHR",
            difficulty: "Intermediate",
            usage: "Used to express feeling sad or melancholy",
            example: "Depuis qu'il a perdu son travail, il a le cafard.",
            exampleTranslation: "Since he lost his job, he's been feeling down.",
            culturalNote: "This idiom compares sadness to having a cockroach, emphasizing the unpleasant feeling.",
            type: 'idiom'
          },
          {
            id: 6,
            title: "Poser un lapin",
            description: "To stand someone up",
            french: "Poser un lapin",
            english: "To stand someone up",
            literal: "To put down a rabbit",
            meaning: "To not show up for a planned meeting",
            pronunciation: "poh-ZAY uhn lah-PAHN",
            difficulty: "Advanced",
            usage: "Used when someone doesn't show up for a date or appointment",
            example: "Elle m'a posé un lapin hier soir au restaurant.",
            exampleTranslation: "She stood me up last night at the restaurant.",
            culturalNote: "The origin of this expression is debated, but it's commonly used in modern French.",
            type: 'idiom'
          }
        ]
      },
      {
        id: 3,
        title: 'Expressions',
        items: [
          {
            id: 7,
            title: "C'est la vie",
            description: "That's life",
            french: "C'est la vie",
            english: "That's life",
            literal: "It's the life",
            meaning: "Such is life; that's how things are",
            pronunciation: "say lah VEE",
            difficulty: "Beginner",
            usage: "Used to express acceptance of a situation",
            example: "J'ai raté mon train, mais c'est la vie.",
            exampleTranslation: "I missed my train, but that's life.",
            culturalNote: "One of the most famous French expressions, known worldwide.",
            type: 'expression'
          },
          {
            id: 8,
            title: "Ça va ?",
            description: "How are you?",
            french: "Ça va ?",
            english: "How are you?",
            literal: "It goes?",
            meaning: "How are things going?",
            pronunciation: "sah VAH",
            difficulty: "Beginner",
            usage: "Informal way to ask how someone is doing",
            example: "Salut Marie ! Ça va ?",
            exampleTranslation: "Hi Marie! How are you?",
            culturalNote: "This is one of the most common greetings in French, used in casual situations.",
            type: 'expression'
          },
          {
            id: 9,
            title: "Bonne chance !",
            description: "Good luck!",
            french: "Bonne chance !",
            english: "Good luck!",
            literal: "Good luck",
            meaning: "Wishing someone success",
            pronunciation: "bun SHAHNSS",
            difficulty: "Beginner",
            usage: "Used to wish someone well before an important event",
            example: "Tu as ton examen demain ? Bonne chance !",
            exampleTranslation: "You have your exam tomorrow? Good luck!",
            culturalNote: "A straightforward expression of encouragement, used in all contexts.",
            type: 'expression'
          }
        ]
      }
    ]

    setSections(phraseSections)
    setExpandedSections([1])
    setSelectedSection(1)
    setSelectedItem(1)
    setSelectedPhrase(phraseSections[0].items[0])
    setLoading(false)
  }

  const handleToggleSection = (sectionId) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const handleItemSelect = (itemId) => {
    const phrase = sections
      .flatMap(section => section.items)
      .find(item => item.id === itemId)
    setSelectedPhrase(phrase)
    setSelectedItem(itemId)
  }

  const playPronunciation = () => {
    setShowPronunciation(true)
    setTimeout(() => setShowPronunciation(false), 3000)
  }

  const toggleFavorite = () => {
    const newFavorites = toggleFavoriteUtil('phrases', selectedPhrase.id)
    setFavorites(newFavorites)
  }

  const copyPhrase = async () => {
    try {
      await navigator.clipboard.writeText(`${selectedPhrase.french} - ${selectedPhrase.english}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading phrases...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-60px)] bg-white dark:bg-dark-warm-300">
      <SEO
        title="French Phrase of the Day | Daily French Expressions | SayBonjour!"
        description="Learn a new French phrase every day. Each phrase includes pronunciation audio, English translation, usage examples, and cultural context. Build vocabulary one phrase at a time."
        keywords="french phrase of the day, daily french, french expressions, french phrases with audio, learn french phrases, french vocabulary daily"
        url="/phrase-of-the-day"
      />
      <ContentSidebar
        sections={sections}
        selectedSection={selectedSection}
        selectedItem={selectedItem}
        onSectionSelect={setSelectedSection}
        onItemSelect={handleItemSelect}
        expandedSections={expandedSections}
        onToggleSection={handleToggleSection}
      />

      <div className="flex-1 overflow-y-auto w-full md:w-auto">
        {selectedPhrase ? (
          <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
            {/* Phrase Header */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-burgundy-600" />
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-cream-50">
                  French Phrase
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
                <div className="flex items-center space-x-1">
                  <span className="font-medium">Type:</span>
                  <span className="capitalize">{selectedPhrase.type}</span>
                </div>
                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                  selectedPhrase.difficulty === 'Beginner'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                    : selectedPhrase.difficulty === 'Intermediate'
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                }`}>
                  {selectedPhrase.difficulty}
                </span>
              </div>
            </div>

            {/* Main Phrase Display */}
            <div className="bg-white dark:bg-dark-warm-100 rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden mb-6 sm:mb-8">
              {/* Header with actions */}
              <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 text-white p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                    <span className="text-sm sm:text-lg font-medium truncate">
                      {new Date().toLocaleDateString('en-US', {
                        weekday: window.innerWidth < 640 ? 'short' : 'long',
                        year: 'numeric',
                        month: window.innerWidth < 640 ? 'short' : 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                    <BookmarkButton
                      item={selectedPhrase}
                      type="phrase"
                      size="sm"
                      variant="minimal"
                    />
                    <FlashcardButton
                      item={selectedPhrase}
                      type="phrase"
                      size="sm"
                      variant="minimal"
                    />
                    <button
                      onClick={toggleFavorite}
                      className={`p-1.5 sm:p-2 rounded-full transition-colors ${
                        favorites.includes(selectedPhrase.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      <Heart size={16} className={`sm:w-5 sm:h-5 ${favorites.includes(selectedPhrase.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={copyPhrase}
                      className="p-1.5 sm:p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                    >
                      {copied ? <Check size={16} className="sm:w-5 sm:h-5" /> : <Copy size={16} className="sm:w-5 sm:h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Main content */}
              <div className="p-4 sm:p-6 md:p-8">
                {/* French phrase */}
                <div className="text-center mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-cream-50 mb-3 sm:mb-4 leading-tight px-2">
                    "{selectedPhrase.french}"
                  </h2>

                  {/* Pronunciation */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <SpeakButton
                      text={selectedPhrase.french}
                      size={window.innerWidth < 640 ? "md" : "lg"}
                      variant="default"
                      showText={true}
                      onSpeakStart={() => setShowPronunciation(true)}
                      onSpeakEnd={() => setTimeout(() => setShowPronunciation(false), 1000)}
                    />
                    {showPronunciation && (
                      <motion.div
                        className="text-gray-600 dark:text-gray-400 italic text-sm sm:text-base text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        [{selectedPhrase.pronunciation}]
                      </motion.div>
                    )}
                    {/* Debug info for troubleshooting */}
                    <div className="relative">
                      <TTSDebugInfo />
                    </div>
                  </div>

                  {/* English translation */}
                  <p className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-2 px-2">
                    "{selectedPhrase.english}"
                  </p>

                  {/* Literal translation */}
                  <p className="text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400 italic px-2">
                    Literal: "{selectedPhrase.literal}"
                  </p>
                </div>

                {/* Meaning and usage */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-cream-50 mb-2 sm:mb-3 flex items-center">
                      <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-burgundy-600" />
                      Meaning
                    </h3>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{selectedPhrase.meaning}</p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-cream-50 mb-2 sm:mb-3 flex items-center">
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-burgundy-600" />
                      Usage
                    </h3>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{selectedPhrase.usage}</p>
                  </div>
                </div>

                {/* Example */}
                <div className="bg-gray-50 dark:bg-dark-warm-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-cream-50 mb-3 sm:mb-4">Example in Context</h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                      <p className="text-sm sm:text-base md:text-lg text-gray-900 dark:text-cream-50 font-medium flex-1">
                        🇫🇷 {selectedPhrase.example}
                      </p>
                      <SpeakButton
                        text={selectedPhrase.example}
                        size="sm"
                        variant="ghost"
                      />
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                      🇺🇸 {selectedPhrase.exampleTranslation}
                    </p>
                  </div>
                </div>

                {/* Cultural note */}
                <div className="bg-gradient-to-r from-burgundy-50 to-amber-50 dark:from-dark-warm-200 dark:to-dark-warm-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-burgundy-100 dark:border-dark-warm-50">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-cream-50 mb-2 sm:mb-3">💡 Cultural Note</h3>
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{selectedPhrase.culturalNote}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Calendar size={48} className="text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-cream-50 mb-2">
                Select a Phrase
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Choose a French phrase from the sidebar to start learning
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PhraseOfTheDay
