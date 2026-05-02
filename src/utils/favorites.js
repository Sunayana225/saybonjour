// Utility functions for managing favorites across the application
// Uses localStorage for persistent storage

const STORAGE_KEYS = {
  phrases: 'phraseFavorites',
  phrase: 'phraseFavorites',
  media: 'mediaFavorites',
  articles: 'articleFavorites',
  article: 'articleFavorites',
  quizzes: 'quizFavorites',
  quiz: 'quizFavorites',
  flashcards: 'flashcardFavorites',
  'memory-booster': 'memoryBoosterFavorites',
  region: 'regionFavorites'
}

/**
 * Load favorites from localStorage
 * @param {string} type - Type of favorites (phrases, media, articles, etc.)
 * @returns {Array} Array of favorite IDs
 */
export const loadFavorites = (type) => {
  try {
    const key = STORAGE_KEYS[type]
    if (!key) {
      console.warn(`Unknown favorites type: ${type}`)
      return []
    }
    
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : []
  } catch (error) {
    console.error(`Error loading ${type} favorites:`, error)
    return []
  }
}

/**
 * Save favorites to localStorage
 * @param {string} type - Type of favorites
 * @param {Array} favorites - Array of favorite IDs
 */
export const saveFavorites = (type, favorites) => {
  try {
    const key = STORAGE_KEYS[type]
    if (!key) {
      console.warn(`Unknown favorites type: ${type}`)
      return
    }

    localStorage.setItem(key, JSON.stringify(favorites))

    // Dispatch custom event to notify components of favorites update
    window.dispatchEvent(new CustomEvent('favoritesUpdated', {
      detail: { type, favorites }
    }))
  } catch (error) {
    console.error(`Error saving ${type} favorites:`, error)
  }
}

/**
 * Add item to favorites
 * @param {string} type - Type of favorites
 * @param {number|string} itemId - ID of item to add
 * @returns {Array} Updated favorites array
 */
export const addToFavorites = (type, itemId) => {
  const currentFavorites = loadFavorites(type)
  if (!currentFavorites.includes(itemId)) {
    const newFavorites = [...currentFavorites, itemId]
    saveFavorites(type, newFavorites)
    return newFavorites
  }
  return currentFavorites
}

/**
 * Remove item from favorites
 * @param {string} type - Type of favorites
 * @param {number|string} itemId - ID of item to remove
 * @returns {Array} Updated favorites array
 */
export const removeFromFavorites = (type, itemId) => {
  const currentFavorites = loadFavorites(type)
  const newFavorites = currentFavorites.filter(id => id !== itemId)
  saveFavorites(type, newFavorites)
  return newFavorites
}

/**
 * Toggle item in favorites
 * @param {string} type - Type of favorites
 * @param {number|string} itemId - ID of item to toggle
 * @returns {Array} Updated favorites array
 */
export const toggleFavorite = (type, itemId) => {
  const currentFavorites = loadFavorites(type)
  if (currentFavorites.includes(itemId)) {
    return removeFromFavorites(type, itemId)
  } else {
    return addToFavorites(type, itemId)
  }
}

/**
 * Check if item is in favorites
 * @param {string} type - Type of favorites
 * @param {number|string} itemId - ID of item to check
 * @returns {boolean} True if item is favorited
 */
export const isFavorite = (type, itemId) => {
  const currentFavorites = loadFavorites(type)
  return currentFavorites.includes(itemId)
}

/**
 * Get all favorites of a specific type
 * @param {string} type - Type of favorites
 * @returns {Array} Array of favorite IDs
 */
export const getAllFavorites = (type) => {
  return loadFavorites(type)
}

/**
 * Clear all favorites of a specific type
 * @param {string} type - Type of favorites
 */
export const clearFavorites = (type) => {
  saveFavorites(type, [])
}

/**
 * Get total count of favorites across all types
 * @returns {Object} Object with counts for each type
 */
export const getFavoritesCounts = () => {
  const counts = {}
  Object.keys(STORAGE_KEYS).forEach(type => {
    counts[type] = loadFavorites(type).length
  })
  return counts
}

/**
 * Export all favorites data (for backup/sync)
 * @returns {Object} All favorites data
 */
export const exportFavorites = () => {
  const allFavorites = {}
  Object.keys(STORAGE_KEYS).forEach(type => {
    allFavorites[type] = loadFavorites(type)
  })
  return allFavorites
}

/**
 * Import favorites data (for restore/sync)
 * @param {Object} favoritesData - Favorites data to import
 */
export const importFavorites = (favoritesData) => {
  Object.keys(favoritesData).forEach(type => {
    if (STORAGE_KEYS[type]) {
      saveFavorites(type, favoritesData[type])
    }
  })
}
