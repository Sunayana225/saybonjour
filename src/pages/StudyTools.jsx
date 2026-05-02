import React, { useState, useEffect } from 'react'
import { Bookmark, RotateCcw, Star, BookOpen, Brain, ChevronLeft, Play } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import SEO from '../components/SEO'
import FlashCard from '../components/FlashCard'
import { getAllFavorites, removeFromFavorites } from '../utils/favorites'

const StudyTools = () => {
  const [activeTab, setActiveTab] = useState('flashcards')
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [flashcardTopics, setFlashcardTopics] = useState([])
  const [bookmarks, setBookmarks] = useState([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [studyMode, setStudyMode] = useState('browse') // 'browse' or 'study'

  useEffect(() => {
    // Load bookmarks from favorites
    const favorites = getAllFavorites('articles') // or whatever type you want to load
    setBookmarks(favorites)

    // Load demo data - organized by topics
    setFlashcardTopics([
      {
        id: 1,
        title: 'Basic Greetings',
        description: 'Essential French greetings for daily conversations',
        cardCount: 8,
        color: 'bg-burgundy-500',
        cards: [
          { id: 1, french: 'Bonjour', english: 'Hello/Good morning', pronunciation: 'bon-ZHOOR', example: 'Bonjour, comment allez-vous?', mastered: false },
          { id: 2, french: 'Bonsoir', english: 'Good evening', pronunciation: 'bon-SWAHR', example: 'Bonsoir, madame.', mastered: false },
          { id: 3, french: 'Au revoir', english: 'Goodbye', pronunciation: 'oh ruh-VWAHR', example: 'Au revoir, à demain!', mastered: true },
          { id: 4, french: 'À bientôt', english: 'See you soon', pronunciation: 'ah bee-ahn-TOH', example: 'À bientôt, mes amis!', mastered: false },
          { id: 5, french: 'Salut', english: 'Hi/Bye (informal)', pronunciation: 'sah-LUU', example: 'Salut! Ça va?', mastered: false },
          { id: 6, french: 'Bonne nuit', english: 'Good night', pronunciation: 'bun NWEE', example: 'Bonne nuit, dormez bien.', mastered: false },
          { id: 7, french: 'À plus tard', english: 'See you later', pronunciation: 'ah pluu TAHR', example: 'À plus tard!', mastered: false },
          { id: 8, french: 'Enchanté(e)', english: 'Nice to meet you', pronunciation: 'ahn-shahn-TAY', example: 'Enchanté de vous rencontrer.', mastered: false }
        ]
      },
      {
        id: 2,
        title: 'Politeness & Courtesy',
        description: 'Polite expressions and courtesy phrases',
        cardCount: 6,
        color: 'bg-burgundy-600',
        cards: [
          { id: 9, french: 'Merci', english: 'Thank you', pronunciation: 'mer-SEE', example: 'Merci beaucoup!', mastered: false },
          { id: 10, french: 'De rien', english: 'You\'re welcome', pronunciation: 'duh ree-AHN', example: 'De rien, c\'est normal.', mastered: false },
          { id: 11, french: 'S\'il vous plaît', english: 'Please (formal)', pronunciation: 'seel voo PLEH', example: 'Un café, s\'il vous plaît.', mastered: false },
          { id: 12, french: 'Excusez-moi', english: 'Excuse me', pronunciation: 'ek-skuu-zay MWAH', example: 'Excusez-moi, où est la gare?', mastered: false },
          { id: 13, french: 'Je suis désolé(e)', english: 'I am sorry', pronunciation: 'zhuh swee day-zo-LAY', example: 'Je suis désolé du retard.', mastered: true },
          { id: 14, french: 'Pardon', english: 'Sorry/Pardon me', pronunciation: 'par-DOHN', example: 'Pardon, je n\'ai pas compris.', mastered: false }
        ]
      },
      {
        id: 3,
        title: 'Common Questions',
        description: 'Frequently used questions in French',
        cardCount: 7,
        color: 'bg-burgundy-700',
        cards: [
          { id: 15, front: 'Comment allez-vous?', back: 'How are you? (formal)', mastered: false },
          { id: 16, front: 'Comment ça va?', back: 'How are you? (informal)', mastered: false },
          { id: 17, front: 'Quel âge avez-vous?', back: 'How old are you?', mastered: false },
          { id: 18, front: 'D\'où venez-vous?', back: 'Where are you from?', mastered: false },
          { id: 19, front: 'Que faites-vous?', back: 'What do you do?', mastered: false },
          { id: 20, front: 'Parlez-vous anglais?', back: 'Do you speak English?', mastered: false },
          { id: 21, front: 'Où habitez-vous?', back: 'Where do you live?', mastered: false }
        ]
      },
      {
        id: 4,
        title: 'Numbers 1-20',
        description: 'Basic French numbers from one to twenty',
        cardCount: 10,
        color: 'bg-burgundy-800',
        cards: [
          { id: 22, front: 'un', back: 'one', mastered: false },
          { id: 23, front: 'deux', back: 'two', mastered: false },
          { id: 24, front: 'trois', back: 'three', mastered: false },
          { id: 25, front: 'quatre', back: 'four', mastered: false },
          { id: 26, front: 'cinq', back: 'five', mastered: false },
          { id: 27, front: 'dix', back: 'ten', mastered: false },
          { id: 28, front: 'quinze', back: 'fifteen', mastered: false },
          { id: 29, front: 'vingt', back: 'twenty', mastered: false },
          { id: 30, front: 'onze', back: 'eleven', mastered: false },
          { id: 31, front: 'douze', back: 'twelve', mastered: false }
        ]
      }
    ])

    setBookmarks([
      { id: 1, title: 'French Alphabet and Pronunciation', type: 'article', section: 'French Basics' },
      { id: 2, title: 'Basic French Vocabulary Quiz', type: 'quiz', section: 'French Basics' },
      { id: 3, title: 'French Grammar Fundamentals', type: 'article', section: 'Grammar' }
    ])
  }, [])

  const [flippedCards, setFlippedCards] = useState({})

  const toggleCard = (cardId) => {
    setFlippedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }))
  }

  const toggleMastery = (cardId) => {
    setFlashcardTopics(prev => prev.map(topic => ({
      ...topic,
      cards: topic.cards.map(card =>
        card.id === cardId ? { ...card, mastered: !card.mastered } : card
      )
    })))
  }

  const selectTopic = (topic) => {
    setSelectedTopic(topic)
    setFlippedCards({}) // Reset flipped cards when switching topics
  }

  const goBackToTopics = () => {
    setSelectedTopic(null)
    setFlippedCards({})
    setStudyMode('browse')
    setCurrentCardIndex(0)
  }

  const startStudyMode = () => {
    setStudyMode('study')
    setCurrentCardIndex(0)
  }

  const nextCard = () => {
    if (currentCardIndex < selectedTopic.cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1)
    }
  }

  const previousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1)
    }
  }

  const removeBookmark = (id) => {
    removeFromFavorites('articles', id)
    setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-warm-300">
      <SEO
        title="French Study Tools — Flashcards, Phrases & Saved Content | SayBonjour!"
        description="Access all your SayBonjour study tools in one place — flashcard topics, saved phrases, vocabulary notes, and bookmarked lessons. Review what matters most."
        keywords="french study tools, french flashcards, french learning tools, study french online, french revision, french bookmarks"
        url="/study-tools"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <motion.div
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-cream-50 px-2">Study Tools</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 px-2">Enhance your French learning with personalized study aids</p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="border-b border-gray-200 dark:border-dark-warm-50 mb-4 sm:mb-6 px-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <nav className="-mb-px flex space-x-4 sm:space-x-8">
            <motion.button
              onClick={() => setActiveTab('flashcards')}
              className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm relative ${
                activeTab === 'flashcards'
                  ? 'border-burgundy-500 text-burgundy-600 dark:text-burgundy-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300'
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw className="inline-block w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Flashcards</span>
              <span className="xs:hidden">Cards</span>
            </motion.button>
            <motion.button
              onClick={() => setActiveTab('bookmarks')}
              className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm relative ${
                activeTab === 'bookmarks'
                  ? 'border-burgundy-500 text-burgundy-600 dark:text-burgundy-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300'
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bookmark className="inline-block w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Bookmarks
            </motion.button>
          </nav>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'flashcards' && (
            <motion.div
              key="flashcards"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {!selectedTopic ? (
                // Topic Selection View
                <div>
                  <motion.h2
                    className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-cream-50 mb-4 sm:mb-6 px-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    Choose a Topic
                  </motion.h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {flashcardTopics.map((topic, index) => (
                      <motion.div
                        key={topic.id}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{
                          y: -8,
                          transition: { duration: 0.2 }
                        }}
                        className="card p-4 sm:p-6 cursor-pointer hover:shadow-xl transition-shadow duration-300 group"
                        onClick={() => selectTopic(topic)}
                      >
                        <motion.div
                          className={`w-10 h-10 sm:w-12 sm:h-12 ${topic.color} rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}
                          whileHover={{ rotate: 10 }}
                        >
                          <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-amber-50" />
                        </motion.div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-cream-50 mb-2 group-hover:text-burgundy-700 dark:group-hover:text-burgundy-400 transition-colors duration-300">
                          {topic.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">{topic.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            {topic.cardCount} cards
                          </span>
                          <motion.div
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            whileHover={{ scale: 1.1 }}
                          >
                            <Play className="w-3 h-3 sm:w-4 sm:h-4 text-burgundy-600" />
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
            ) : (
              // Individual Cards View
              <div>
                <motion.div
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6 px-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 min-w-0">
                    <motion.button
                      onClick={goBackToTopics}
                      className="text-burgundy-600 hover:text-burgundy-700 flex items-center text-sm sm:text-base self-start"
                      whileHover={{ x: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Back to Topics
                    </motion.button>
                    <div className="min-w-0">
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-cream-50 leading-tight">{selectedTopic.title}</h2>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-tight">{selectedTopic.description}</p>
                    </div>
                  </div>

                  {studyMode === 'browse' && (
                    <motion.button
                      onClick={startStudyMode}
                      className="bg-burgundy-600 text-amber-50 px-3 sm:px-4 py-2 rounded-lg hover:bg-burgundy-700 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base w-full sm:w-auto"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Study Mode</span>
                    </motion.button>
                  )}
                </motion.div>

                <AnimatePresence mode="wait">
                  {studyMode === 'study' ? (
                    <motion.div
                      key="study-mode"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center"
                    >
                      <div className="mb-4 sm:mb-6 px-2">
                        <motion.button
                          onClick={() => setStudyMode('browse')}
                          className="text-burgundy-600 hover:text-burgundy-700 flex items-center text-sm sm:text-base"
                          whileHover={{ x: -5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          Back to Browse
                        </motion.button>
                      </div>

                      <FlashCard
                        card={selectedTopic.cards[currentCardIndex]}
                        onNext={nextCard}
                        onPrevious={previousCard}
                        currentIndex={currentCardIndex}
                        totalCards={selectedTopic.cards.length}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="browse-mode"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                    >
                      {selectedTopic.cards.map((card, index) => (
                        <motion.div
                          key={card.id}
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          whileHover={{ y: -5 }}
                          className="card p-4 sm:p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300"
                          onClick={() => toggleCard(card.id)}
                        >
                          <div className="text-center">
                            <motion.div
                              className="text-base sm:text-lg font-semibold text-gray-900 dark:text-cream-50 mb-2"
                              animate={{
                                scale: flippedCards[card.id] ? [1, 1.05, 1] : 1
                              }}
                              transition={{ duration: 0.3 }}
                            >
                              {flippedCards[card.id] ? card.english : card.french}
                            </motion.div>
                            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                              {flippedCards[card.id] ? 'English' : 'Français'}
                            </div>
                            {flippedCards[card.id] && card.pronunciation && (
                              <motion.div
                                className="text-xs sm:text-sm text-burgundy-600 italic mt-1"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                              >
                                /{card.pronunciation}/
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            </motion.div>
          )}
        </AnimatePresence>

        {activeTab === 'bookmarks' && (
          <div className="px-2">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-cream-50 mb-3 sm:mb-4">Saved Content</h2>
            <div className="space-y-3 sm:space-y-4">
              {bookmarks.map((bookmark) => (
                <div key={bookmark.id} className="card p-3 sm:p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      bookmark.type === 'article' ? 'bg-burgundy-100' : 'bg-burgundy-200'
                    }`}>
                      {bookmark.type === 'article' ? (
                        <BookOpen className={`w-4 h-4 sm:w-5 sm:h-5 ${bookmark.type === 'article' ? 'text-burgundy-600' : 'text-burgundy-700'}`} />
                      ) : (
                        <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-burgundy-700" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-cream-50 text-sm sm:text-base truncate">{bookmark.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{bookmark.section} • {bookmark.type}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeBookmark(bookmark.id)}
                    className="text-red-600 hover:text-red-700 flex-shrink-0 p-1"
                  >
                    <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}


      </div>
    </div>
  )
}

export default StudyTools
