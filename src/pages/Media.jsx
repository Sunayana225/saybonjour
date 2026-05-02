import React, { useState, useEffect } from 'react'
import { Film, Music, Tv, Star, Clock, Calendar, Play, ExternalLink, Heart, BookOpen, X, Volume2, Headphones } from 'lucide-react'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'
import ContentSidebar from '../components/ContentSidebar'
import BookmarkButton from '../components/BookmarkButton'

const Media = () => {
  const [sections, setSections] = useState([])
  const [selectedSection, setSelectedSection] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedMedia, setSelectedMedia] = useState(null)
  const [expandedSections, setExpandedSections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMediaData()
  }, [])

  const setMediaData = () => {
    const mediaSections = [
      {
        id: 1,
        title: 'Movies',
        items: [
          {
            id: 1,
            title: "Amélie",
            originalTitle: "Le Fabuleux Destin d'Amélie Poulain",
            year: 2001,
            director: "Jean-Pierre Jeunet",
            genre: "Romance, Comedy",
            difficulty: "Intermediate",
            duration: "122 min",
            rating: 4.8,
            poster: "https://images.unsplash.com/photo-1489599735734-79b4169c2a78?w=300&h=450&fit=crop",
            description: "A whimsical tale of a young Parisian woman who decides to help those around her find happiness.",
            learningPoints: ["Parisian accent", "Everyday vocabulary", "Romantic expressions"],
            whereToWatch: ["Netflix", "Amazon Prime", "Apple TV"],
            type: 'movie'
          },
          {
            id: 2,
            title: "The Intouchables",
            originalTitle: "Intouchables",
            year: 2011,
            director: "Jean-Pierre Jeunet",
            genre: "Comedy, Drama",
            difficulty: "Advanced",
            duration: "112 min",
            rating: 4.9,
            poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop",
            description: "An unlikely friendship between a wealthy quadriplegic and his caregiver from the projects.",
            learningPoints: ["Slang and colloquialisms", "Social commentary", "Emotional vocabulary"],
            whereToWatch: ["Hulu", "Amazon Prime"],
            type: 'movie'
          },
          {
            id: 3,
            title: "Blue Is the Warmest Color",
            originalTitle: "La Vie d'Adèle",
            year: 2013,
            director: "Abdellatif Kechiche",
            genre: "Romance, Drama",
            difficulty: "Advanced",
            duration: "180 min",
            rating: 4.6,
            poster: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=450&fit=crop",
            description: "A coming-of-age story about a young woman discovering her sexuality and identity.",
            learningPoints: ["Emotional expressions", "Youth vocabulary", "Relationship terminology"],
            whereToWatch: ["Criterion Channel", "Amazon Prime"],
            type: 'movie'
          }
        ]
      },
      {
        id: 2,
        title: 'Music',
        items: [
          {
            id: 4,
            title: "La Vie en Rose",
            artist: "Édith Piaf",
            album: "Various",
            year: 1947,
            genre: "Chanson",
            difficulty: "Beginner",
            duration: "3:05",
            rating: 4.9,
            cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
            description: "The most iconic French song about seeing life through rose-colored glasses.",
            learningPoints: ["Classic pronunciation", "Romantic vocabulary", "Cultural significance"],
            whereToListen: ["Spotify", "Apple Music", "YouTube"],
            type: 'music'
          },
          {
            id: 5,
            title: "Alors on Danse",
            artist: "Stromae",
            album: "Cheese",
            year: 2009,
            genre: "Electronic/Pop",
            difficulty: "Intermediate",
            duration: "3:28",
            rating: 4.7,
            cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
            description: "A modern Belgian-French hit that became a global phenomenon.",
            learningPoints: ["Modern slang", "Belgian French", "Social themes"],
            whereToListen: ["Spotify", "Apple Music", "Deezer"],
            type: 'music'
          },
          {
            id: 6,
            title: "Je Veux",
            artist: "Zaz",
            album: "Zaz",
            year: 2010,
            genre: "Jazz/Pop",
            difficulty: "Intermediate",
            duration: "3:30",
            rating: 4.8,
            cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
            description: "An upbeat song about wanting simple pleasures in life.",
            learningPoints: ["Conversational French", "Desires and wants", "Jazz vocabulary"],
            whereToListen: ["Spotify", "Apple Music", "YouTube"],
            type: 'music'
          }
        ]
      },
      {
        id: 3,
        title: 'TV Shows',
        items: [
          {
            id: 7,
            title: "Call My Agent!",
            originalTitle: "Dix Pour Cent",
            year: "2015-2020",
            creator: "Fanny Herrero",
            genre: "Comedy, Drama",
            difficulty: "Advanced",
            seasons: 4,
            rating: 4.8,
            poster: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=300&h=450&fit=crop",
            description: "Behind-the-scenes look at a Parisian talent agency representing France's biggest stars.",
            learningPoints: ["Business French", "Entertainment industry", "Parisian culture"],
            whereToWatch: ["Netflix", "France TV"],
            type: 'tv'
          },
          {
            id: 8,
            title: "Lupin",
            originalTitle: "Lupin",
            year: "2021-present",
            creator: "George Kay, François Uzan",
            genre: "Crime, Drama",
            difficulty: "Intermediate",
            seasons: 3,
            rating: 4.7,
            poster: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop",
            description: "A modern retelling of the classic gentleman thief stories set in contemporary Paris.",
            learningPoints: ["Crime vocabulary", "Modern Parisian French", "Cultural references"],
            whereToWatch: ["Netflix"],
            type: 'tv'
          },
          {
            id: 9,
            title: "A French Village",
            originalTitle: "Un Village Français",
            year: "2009-2017",
            creator: "Frédéric Krivine, Philippe Triboit",
            genre: "Historical Drama",
            difficulty: "Advanced",
            seasons: 7,
            rating: 4.9,
            poster: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=450&fit=crop",
            description: "Life in a small French town during World War II occupation.",
            learningPoints: ["Historical French", "Formal language", "War terminology"],
            whereToWatch: ["MHz Choice", "Amazon Prime"],
            type: 'tv'
          }
        ]
      }
    ]

    setSections(mediaSections)
    setExpandedSections([1])
    setSelectedSection(1)
    setSelectedItem(1)
    setSelectedMedia(mediaSections[0].items[0])
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
    const media = sections
      .flatMap(section => section.items)
      .find(item => item.id === itemId)
    setSelectedMedia(media)
    setSelectedItem(itemId)
  }

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'bg-burgundy-100 dark:bg-burgundy-900/40 text-burgundy-800 dark:text-burgundy-300'
      case 'Intermediate': return 'bg-burgundy-200 dark:bg-burgundy-900/50 text-burgundy-800 dark:text-burgundy-300'
      case 'Advanced': return 'bg-burgundy-300 dark:bg-burgundy-900/60 text-burgundy-900 dark:text-burgundy-200'
      default: return 'bg-cream-200 dark:bg-dark-warm-200 text-burgundy-800 dark:text-gray-300'
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < Math.floor(rating) ? 'text-burgundy-500 fill-current' : 'text-cream-400'}
      />
    ))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading media...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-60px)] bg-white dark:bg-dark-warm-300">
      <SEO
        title="French Films, Music & TV Shows | Media Guide | SayBonjour!"
        description="Discover the best French films, music, and TV series to improve your French naturally. Curated by difficulty level — perfect for beginner to advanced learners."
        keywords="french films, french movies, french music, french tv shows, learn french with movies, french series netflix, amélie film, lupin"
        url="/media"
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
        {selectedMedia ? (
          <div className="max-w-4xl mx-auto p-8">
            {/* Media Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {selectedMedia.type === 'movie' && <Film className="w-8 h-8 text-burgundy-600 dark:text-burgundy-vibrant-400" />}
                  {selectedMedia.type === 'music' && <Music className="w-8 h-8 text-burgundy-600 dark:text-burgundy-vibrant-400" />}
                  {selectedMedia.type === 'tv' && <Tv className="w-8 h-8 text-burgundy-600 dark:text-burgundy-vibrant-400" />}
                  <h1 className="text-3xl font-bold text-burgundy-900 dark:text-cream-50">
                    {selectedMedia.title}
                  </h1>
                </div>
                <BookmarkButton
                  item={selectedMedia}
                  type="media"
                  variant="floating"
                  size="lg"
                />
              </div>

              {selectedMedia.originalTitle && selectedMedia.originalTitle !== selectedMedia.title && (
                <p className="text-xl text-burgundy-700 dark:text-cream-200 italic mb-4">{selectedMedia.originalTitle}</p>
              )}

              <div className="flex items-center space-x-6 text-sm text-burgundy-700 dark:text-cream-200 mb-6">
                {selectedMedia.artist && (
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">Artist:</span>
                    <span>{selectedMedia.artist}</span>
                  </div>
                )}
                {selectedMedia.director && (
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">Director:</span>
                    <span>{selectedMedia.director}</span>
                  </div>
                )}
                {selectedMedia.creator && (
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">Creator:</span>
                    <span>{selectedMedia.creator}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Calendar size={16} />
                  <span>{selectedMedia.year}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(selectedMedia.difficulty)}`}>
                  {selectedMedia.difficulty}
                </span>
              </div>
            </div>

            {/* Media Image and Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Image */}
              <div className="lg:col-span-1">
                <img
                  src={selectedMedia.type === 'music' ? selectedMedia.cover : selectedMedia.poster}
                  alt={selectedMedia.title}
                  className="w-full rounded-2xl shadow-lg"
                />

                {/* Rating and Duration */}
                <div className="mt-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {renderStars(selectedMedia.rating)}
                    </div>
                    <span className="text-burgundy-700 dark:text-cream-200">{selectedMedia.rating}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-burgundy-700 dark:text-cream-200">
                    <Clock size={16} />
                    <span>{selectedMedia.duration || `${selectedMedia.seasons} seasons`}</span>
                  </div>

                  <div className="text-burgundy-700 dark:text-cream-200">
                    <span className="font-medium">Genre:</span> {selectedMedia.genre}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="lg:col-span-2">
                <div className="prose prose-lg max-w-none">
                  <p className="text-burgundy-800 dark:text-cream-100 text-lg leading-relaxed mb-6">
                    {selectedMedia.description}
                  </p>

                  {/* Learning Points */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-burgundy-900 dark:text-cream-50 mb-4 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-burgundy-600 dark:text-burgundy-vibrant-400" />
                      What You'll Learn
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedMedia.learningPoints.map((point, idx) => (
                        <div key={idx} className="flex items-center space-x-3 p-3 bg-gray-800 dark:bg-gray-800 rounded-lg">
                          <div className="w-2 h-2 bg-burgundy-400 dark:bg-burgundy-400 rounded-full" />
                          <span className="text-cream-50 dark:text-cream-50">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>


                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Film size={48} className="text-burgundy-400 dark:text-burgundy-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-burgundy-900 dark:text-cream-50 mb-2">
                Select Media
              </h2>
              <p className="text-burgundy-700 dark:text-gray-400">
                Choose a movie, song, or TV show from the sidebar to start learning
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Media
