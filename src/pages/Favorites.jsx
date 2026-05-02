import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, BookOpen, Film, Music, Tv, MessageSquare, Trash2, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import { getAllFavorites, removeFromFavorites } from '../utils/favorites'

const Favorites = () => {
  const [favorites, setFavorites] = useState({
    phrases: [],
    media: [],
    articles: [],
    quizzes: [],
    flashcards: []
  })
  const [activeTab, setActiveTab] = useState('phrases')

  useEffect(() => {
    loadAllFavorites()
  }, [])

  const loadAllFavorites = () => {
    const allFavorites = {
      phrases: getAllFavorites('phrases'),
      media: getAllFavorites('media'),
      articles: getAllFavorites('articles'),
      quizzes: getAllFavorites('quizzes'),
      flashcards: getAllFavorites('flashcards')
    }
    setFavorites(allFavorites)
  }

  const removeFavorite = (type, itemId) => {
    removeFromFavorites(type, itemId)
    loadAllFavorites() // Refresh the list
  }

  const getTotalCount = () => {
    return Object.values(favorites).reduce((total, arr) => total + arr.length, 0)
  }

  const getTabIcon = (tab) => {
    switch (tab) {
      case 'phrases': return MessageSquare
      case 'media': return Film
      case 'articles': return BookOpen
      case 'quizzes': return Calendar
      case 'flashcards': return BookOpen
      default: return Heart
    }
  }

  const tabs = [
    { id: 'phrases', name: 'Phrases', count: favorites.phrases.length },
    { id: 'media', name: 'Media', count: favorites.media.length },
    { id: 'articles', name: 'Articles', count: favorites.articles.length },
    { id: 'quizzes', name: 'Quizzes', count: favorites.quizzes.length },
    { id: 'flashcards', name: 'Flashcards', count: favorites.flashcards.length }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white dark:from-dark-warm-300 dark:to-dark-warm-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center bg-burgundy-50 text-burgundy-700 px-6 py-3 rounded-full text-sm font-medium mb-6 border border-burgundy-100"
            whileHover={{ scale: 1.05 }}
          >
            <Heart className="w-4 h-4 mr-2 fill-current" />
            Mes Favoris • My Favorites
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-cream-50 mb-6">
            ❤️ Your Learning Collection
          </h1>
          <div className="bg-white dark:bg-dark-warm-100 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-dark-warm-50 max-w-4xl mx-auto">
            {getTotalCount() > 0 ? (
              <div className="text-center">
                <p className="text-2xl font-semibold text-gray-900 dark:text-cream-50 mb-2">
                  Welcome back! You have {getTotalCount()} {getTotalCount() === 1 ? 'item' : 'items'} saved.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Keep exploring and building your personalized French learning collection! 🌟
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  Start favoriting content to build your personalized learning collection!
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {getTotalCount() === 0 ? (
          /* Empty State */
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Heart size={64} className="text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-cream-50 mb-4">No favorites yet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Start exploring our content and click the heart icon to save your favorite phrases, 
              media, articles, and more!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/phrase-of-the-day" className="bg-burgundy-600 text-white px-6 py-3 rounded-lg hover:bg-burgundy-700 transition-colors">
                Browse Phrases
              </Link>
              <Link to="/media" className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors">
                Explore Media
              </Link>
              <Link to="/resources" className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors">
                Read Articles
              </Link>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Horizontal Tab Bar */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow-lg border border-gray-100 dark:border-dark-warm-50 p-2">
                <div className="flex flex-wrap justify-center gap-2">
                  {tabs.map((tab) => {
                    const Icon = getTabIcon(tab.id)
                    return (
                      <motion.button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 relative ${
                          activeTab === tab.id
                            ? 'bg-burgundy-600 text-white shadow-md'
                            : 'text-gray-600 dark:text-gray-400 hover:text-burgundy-600 hover:bg-gray-50 dark:hover:bg-dark-warm-200'
                        }`}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon size={18} />
                        <span className="font-semibold">{tab.name}</span>
                        {tab.count > 0 && (
                          <motion.span
                            className={`text-xs px-2 py-1 rounded-full font-bold ${
                              activeTab === tab.id
                                ? 'bg-white/20 text-white'
                                : 'bg-burgundy-100 text-burgundy-700'
                            }`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            {tab.count}
                          </motion.span>
                        )}
                        {activeTab === tab.id && (
                          <motion.div
                            className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-full"
                            layoutId="activeTabIndicator"
                            initial={false}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {favorites[activeTab].length === 0 ? (
                <div className="text-center py-16 px-8">
                  <div className="text-gray-300 mb-6">
                    {React.createElement(getTabIcon(activeTab), { size: 64 })}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-cream-50 mb-3">
                    No {activeTab} saved yet
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    Start exploring and save your favorite {activeTab} to see them here.
                    Click the ❤️ icon when you find something you love!
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Link
                      to={activeTab === 'phrases' ? '/phrase-of-the-day' :
                          activeTab === 'media' ? '/media' :
                          activeTab === 'articles' ? '/resources' :
                          activeTab === 'quizzes' ? '/quizzes' : '/study-tools'}
                      className="bg-burgundy-600 text-white px-6 py-2 rounded-lg hover:bg-burgundy-700 transition-colors"
                    >
                      Explore {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="bg-gradient-to-r from-burgundy-50 to-cream-100 dark:from-dark-warm-200 dark:to-dark-warm-200 px-8 py-6 border-b border-gray-100 dark:border-dark-warm-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-cream-50 capitalize flex items-center">
                          {React.createElement(getTabIcon(activeTab), {
                            size: 28,
                            className: "text-burgundy-600 mr-3"
                          })}
                          Your Saved {activeTab}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          {favorites[activeTab].length} {favorites[activeTab].length === 1 ? 'item' : 'items'} in your collection
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-burgundy-600">
                          {favorites[activeTab].length}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">saved</div>
                      </div>
                    </div>
                  </div>

                  {/* Items Grid */}
                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favorites[activeTab].map((itemId, index) => (
                        <motion.div
                          key={itemId}
                          className="bg-gradient-to-br from-cream-50 to-cream-200 dark:from-dark-warm-200 dark:to-dark-warm-200 rounded-xl p-6 hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-dark-warm-50"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          whileHover={{ y: -2 }}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              {React.createElement(getTabIcon(activeTab), {
                                size: 24,
                                className: "text-burgundy-600"
                              })}
                              <div>
                                <h3 className="font-bold text-gray-900 dark:text-cream-50 text-lg">
                                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} #{itemId}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Added to favorites
                                </p>
                              </div>
                            </div>
                            <motion.button
                              onClick={() => removeFavorite(activeTab, itemId)}
                              className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                              title="Remove from favorites"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Trash2 size={18} />
                            </motion.button>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              Tap to view details
                            </span>
                            <Heart size={16} className="text-red-500 fill-current" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}

export default Favorites
