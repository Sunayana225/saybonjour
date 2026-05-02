import React, { useState } from 'react'
import { FileText, Download, Star, Clock, Users, BookOpen, Headphones, PenTool, Filter, Search } from 'lucide-react'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'

const Worksheets = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [downloadingId, setDownloadingId] = useState(null)

  // Download function
  const handleDownload = async (worksheet) => {
    setDownloadingId(worksheet.id)

    try {
      // Generate PDF content for the worksheet
      const pdfContent = generateWorksheetPDF(worksheet)

      // Create blob and download
      const blob = new Blob([pdfContent], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${worksheet.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      // Update download count (in a real app, this would be sent to the server)
      console.log(`Downloaded: ${worksheet.title}`)

    } catch (error) {
      console.error('Download failed:', error)
      alert('Download failed. Please try again.')
    } finally {
      setDownloadingId(null)
    }
  }

  // Generate PDF content (simplified version - in a real app, use a proper PDF library)
  const generateWorksheetPDF = (worksheet) => {
    // This is a simplified version. In a real application, you would use a library like jsPDF or PDFKit
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 200
>>
stream
BT
/F1 24 Tf
50 750 Td
(${worksheet.title}) Tj
0 -50 Td
/F1 12 Tf
(${worksheet.description}) Tj
0 -30 Td
(Level: ${worksheet.level}) Tj
0 -20 Td
(Category: ${worksheet.category}) Tj
0 -20 Td
(Pages: ${worksheet.pages}) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f
0000000010 00000 n
0000000053 00000 n
0000000125 00000 n
0000000348 00000 n
0000000565 00000 n
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
625
%%EOF`

    return pdfContent
  }

  const worksheets = [
    {
      id: 1,
      title: "Essential Verb Conjugations",
      description: "Complete conjugation charts for the most common French verbs in all tenses",
      category: "grammar",
      level: "beginner",
      type: "Verb Charts",
      pages: 8,
      downloads: 1250,
      rating: 4.9,
      preview: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=400&fit=crop",
      features: ["Present tense", "Past tense", "Future tense", "Conditional", "Subjunctive"],
      estimatedTime: "45 min"
    },
    {
      id: 2,
      title: "French Pronunciation Guide",
      description: "Audio exercises and phonetic charts to master French sounds",
      category: "listening",
      level: "beginner",
      type: "Listening Practice",
      pages: 12,
      downloads: 980,
      rating: 4.8,
      preview: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
      features: ["IPA symbols", "Audio links", "Minimal pairs", "Tongue twisters"],
      estimatedTime: "60 min"
    },
    {
      id: 3,
      title: "Travel Vocabulary Essentials",
      description: "Must-know words and phrases for traveling in French-speaking countries",
      category: "vocabulary",
      level: "intermediate",
      type: "Vocabulary Lists",
      pages: 6,
      downloads: 1450,
      rating: 4.7,
      preview: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=400&fit=crop",
      features: ["Airport terms", "Hotel phrases", "Restaurant vocabulary", "Emergency expressions"],
      estimatedTime: "30 min"
    },
    {
      id: 4,
      title: "Advanced Grammar Exercises",
      description: "Complex grammar structures with detailed explanations and practice",
      category: "grammar",
      level: "advanced",
      type: "Grammar Exercises",
      pages: 15,
      downloads: 720,
      rating: 4.9,
      preview: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
      features: ["Subjunctive mood", "Complex tenses", "Literary structures", "Answer key"],
      estimatedTime: "90 min"
    },
    {
      id: 5,
      title: "French Listening Comprehension",
      description: "Audio stories with comprehension questions and transcripts",
      category: "listening",
      level: "intermediate",
      type: "Listening Practice",
      pages: 10,
      downloads: 890,
      rating: 4.6,
      preview: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=400&fit=crop",
      features: ["Audio files", "Transcripts", "Questions", "Cultural notes"],
      estimatedTime: "75 min"
    },
    {
      id: 6,
      title: "Food & Cooking Vocabulary",
      description: "Comprehensive guide to French culinary terms and cooking methods",
      category: "vocabulary",
      level: "beginner",
      type: "Vocabulary Lists",
      pages: 8,
      downloads: 1100,
      rating: 4.8,
      preview: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=300&h=400&fit=crop",
      features: ["Ingredients", "Cooking verbs", "Kitchen tools", "Recipe vocabulary"],
      estimatedTime: "40 min"
    },
    {
      id: 7,
      title: "Weather & Seasons Expressions",
      description: "Learn to talk about weather, climate, and seasonal activities",
      category: "vocabulary",
      level: "beginner",
      type: "Vocabulary Lists",
      pages: 5,
      downloads: 950,
      rating: 4.5,
      preview: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=400&fit=crop",
      features: ["Weather terms", "Seasonal vocabulary", "Climate expressions", "Activities"],
      estimatedTime: "25 min"
    },
    {
      id: 8,
      title: "Business French Essentials",
      description: "Professional vocabulary and formal expressions for business contexts",
      category: "vocabulary",
      level: "advanced",
      type: "Vocabulary Lists",
      pages: 12,
      downloads: 650,
      rating: 4.7,
      preview: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&h=400&fit=crop",
      features: ["Meeting vocabulary", "Email phrases", "Presentation terms", "Negotiation language"],
      estimatedTime: "60 min"
    },
    {
      id: 9,
      title: "French Dictation Exercises",
      description: "Improve spelling and listening skills with graduated dictation practice",
      category: "listening",
      level: "intermediate",
      type: "Listening Practice",
      pages: 7,
      downloads: 780,
      rating: 4.6,
      preview: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&h=400&fit=crop",
      features: ["Audio dictations", "Progressive difficulty", "Answer sheets", "Tips"],
      estimatedTime: "50 min"
    }
  ]

  const categories = [
    { id: 'all', name: 'All Categories', icon: FileText },
    { id: 'grammar', name: 'Grammar', icon: BookOpen },
    { id: 'vocabulary', name: 'Vocabulary', icon: PenTool },
    { id: 'listening', name: 'Listening', icon: Headphones }
  ]

  const levels = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' }
  ]

  const filteredWorksheets = worksheets.filter(worksheet => {
    const matchesCategory = selectedCategory === 'all' || worksheet.category === selectedCategory
    const matchesLevel = selectedLevel === 'all' || worksheet.level === selectedLevel
    const matchesSearch = worksheet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         worksheet.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesLevel && matchesSearch
  })

  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner': return 'bg-burgundy-100 dark:bg-burgundy-900/40 text-burgundy-800 dark:text-burgundy-300'
      case 'intermediate': return 'bg-burgundy-200 dark:bg-burgundy-900/50 text-burgundy-800 dark:text-burgundy-300'
      case 'advanced': return 'bg-burgundy-300 dark:bg-burgundy-900/60 text-burgundy-900 dark:text-burgundy-200'
      default: return 'bg-cream-200 dark:bg-dark-warm-200 text-burgundy-800 dark:text-gray-300'
    }
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'grammar': return BookOpen
      case 'vocabulary': return PenTool
      case 'listening': return Headphones
      default: return FileText
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={i < Math.floor(rating) ? 'text-burgundy-500 fill-current' : 'text-cream-400'}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-warm-300">
      <SEO
        title="Free French Worksheets — Grammar, Vocabulary & Pronunciation | SayBonjour!"
        description="Download free printable French worksheets covering verb conjugations, pronunciation, travel vocabulary, grammar exercises, and more. Perfect for self-study at any level."
        keywords="french worksheets, free french worksheets, printable french exercises, french grammar worksheets, french vocabulary worksheets, learn french pdf"
        url="/worksheets"
      />
      {/* Hero */}
      <div className="bg-gradient-to-r from-burgundy-800 to-burgundy-600 text-cream-50 py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center bg-cream-50/20 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <FileText className="w-4 h-4 mr-2" />
              Ressources Imprimables • Printable Resources
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
              Printable Worksheets
            </h1>
            <p className="text-cream-100 text-lg max-w-xl mx-auto">
              Download high-quality PDF worksheets for offline practice. Perfect for students, teachers, and self-learners who prefer traditional study methods.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Improved Filters */}
        <motion.div
          className="bg-cream-50 dark:bg-dark-warm-100 rounded-2xl shadow-lg p-6 mb-8 border border-burgundy-100 dark:border-dark-warm-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col space-y-6">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-burgundy-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search lessons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-burgundy-300 dark:border-dark-warm-50 rounded-full focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition-all duration-200 bg-cream-100 dark:bg-dark-warm-200 dark:text-cream-50 dark:placeholder-gray-500 focus:bg-cream-50 dark:focus:bg-dark-warm-200"
                />
              </div>
            </div>

            {/* Filter Pills Container */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Categories Section */}
              <div className="flex flex-wrap items-center gap-2">
                {categories.map((category) => {
                  const Icon = category.icon
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-300 border ${
                        selectedCategory === category.id
                          ? 'bg-burgundy-600 text-white border-burgundy-600 shadow-md'
                          : 'bg-cream-50 dark:bg-dark-warm-200 text-burgundy-600 dark:text-gray-300 border-burgundy-200 dark:border-dark-warm-50 hover:border-burgundy-300 dark:hover:border-burgundy-500 hover:bg-burgundy-50 dark:hover:bg-burgundy-900/20 hover:text-burgundy-700 dark:hover:text-burgundy-400'
                      }`}
                    >
                      <Icon size={16} />
                      <span className="text-sm">{category.name}</span>
                    </button>
                  )
                })}
              </div>

              {/* Visual Divider */}
              <div className="hidden md:block border-l border-gray-300 dark:border-dark-warm-50 h-8 mx-2"></div>

              {/* Levels Section */}
              <div className="flex flex-wrap items-center gap-2">
                {levels.map((level) => {
                  const getLevelIcon = (levelId) => {
                    switch (levelId) {
                      case 'beginner': return '🐣'
                      case 'intermediate': return '✏️'
                      case 'advanced': return '🎓'
                      default: return '🌐'
                    }
                  }

                  return (
                    <button
                      key={level.id}
                      onClick={() => setSelectedLevel(level.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-300 border ${
                        selectedLevel === level.id
                          ? 'bg-burgundy-500 text-white border-burgundy-500 shadow-md'
                          : 'bg-cream-50 dark:bg-dark-warm-200 text-burgundy-600 dark:text-gray-300 border-burgundy-200 dark:border-dark-warm-50 hover:border-burgundy-300 dark:hover:border-burgundy-500 hover:bg-burgundy-50 dark:hover:bg-burgundy-900/20 hover:text-burgundy-700 dark:hover:text-burgundy-400'
                      }`}
                    >
                      <span className="text-sm">{getLevelIcon(level.id)}</span>
                      <span className="text-sm">{level.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Active Filters Summary */}
            {(selectedCategory !== 'all' || selectedLevel !== 'all' || searchTerm) && (
              <div className="flex items-center space-x-2 pt-2 border-t border-cream-200 dark:border-dark-warm-50">
                <span className="text-sm text-burgundy-600 dark:text-gray-400">Active filters:</span>
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-burgundy-100 dark:bg-burgundy-900/40 text-burgundy-800 dark:text-burgundy-300">
                    {categories.find(c => c.id === selectedCategory)?.name}
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className="ml-1 text-burgundy-600 dark:text-burgundy-400 hover:text-burgundy-800 dark:hover:text-burgundy-200"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedLevel !== 'all' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-burgundy-100 dark:bg-burgundy-900/40 text-burgundy-800 dark:text-burgundy-300">
                    {levels.find(l => l.id === selectedLevel)?.name}
                    <button
                      onClick={() => setSelectedLevel('all')}
                      className="ml-1 text-burgundy-600 dark:text-burgundy-400 hover:text-burgundy-800 dark:hover:text-burgundy-200"
                    >
                      ×
                    </button>
                  </span>
                )}
                {searchTerm && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-cream-200 dark:bg-dark-warm-200 text-burgundy-800 dark:text-gray-300">
                    "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm('')}
                      className="ml-1 text-burgundy-600 dark:text-gray-400 hover:text-burgundy-800 dark:hover:text-gray-200"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSelectedCategory('all')
                    setSelectedLevel('all')
                    setSearchTerm('')
                  }}
                  className="text-xs text-burgundy-600 dark:text-gray-400 hover:text-burgundy-800 dark:hover:text-gray-200 underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <p className="text-burgundy-600 dark:text-gray-400">
            Showing {filteredWorksheets.length} worksheet{filteredWorksheets.length !== 1 ? 's' : ''}
            {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
            {selectedLevel !== 'all' && ` for ${levels.find(l => l.id === selectedLevel)?.name} level`}
          </p>
        </motion.div>

        {/* Worksheets Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {filteredWorksheets.map((worksheet, index) => {
            const CategoryIcon = getCategoryIcon(worksheet.category)
            return (
              <motion.div
                key={worksheet.id}
                className="bg-cream-50 dark:bg-dark-warm-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-burgundy-100 dark:border-dark-warm-50"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                {/* Preview Image */}
                <div className="relative overflow-hidden h-48">
                  <img
                    src={worksheet.preview}
                    alt={worksheet.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-4 left-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${getLevelColor(worksheet.level)}`}>
                      {worksheet.level.charAt(0).toUpperCase() + worksheet.level.slice(1)}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-cream-50/90 backdrop-blur-sm rounded-full p-2">
                      <CategoryIcon className="w-4 h-4 text-burgundy-600" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleDownload(worksheet)
                      }}
                      disabled={downloadingId === worksheet.id}
                      className="bg-burgundy-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-burgundy-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {downloadingId === worksheet.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Downloading...</span>
                        </>
                      ) : (
                        <>
                          <Download size={16} />
                          <span>Download</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-burgundy-900 dark:text-cream-50 mb-2 group-hover:text-burgundy-600 dark:group-hover:text-burgundy-400 transition-colors duration-300">
                        {worksheet.title}
                      </h3>
                      <p className="text-sm text-burgundy-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {worksheet.description}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-burgundy-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <FileText size={12} className="mr-1" />
                        {worksheet.pages} pages
                      </span>
                      <span className="flex items-center">
                        <Clock size={12} className="mr-1" />
                        {worksheet.estimatedTime}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {renderStars(worksheet.rating)}
                      <span className="ml-1">{worksheet.rating}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-burgundy-700 dark:text-gray-400 mb-2">Includes:</h4>
                    <div className="flex flex-wrap gap-1">
                      {worksheet.features.slice(0, 3).map((feature, idx) => (
                        <span key={idx} className="text-xs bg-burgundy-100 dark:bg-burgundy-900/40 text-burgundy-800 dark:text-burgundy-300 px-2 py-1 rounded-full">
                          {feature}
                        </span>
                      ))}
                      {worksheet.features.length > 3 && (
                        <span className="text-xs bg-cream-200 dark:bg-dark-warm-200 text-burgundy-600 dark:text-gray-400 px-2 py-1 rounded-full">
                          +{worksheet.features.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Download Stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-cream-200 dark:border-dark-warm-50">
                    <div className="flex items-center text-xs text-burgundy-500 dark:text-gray-400">
                      <Users size={12} className="mr-1" />
                      {worksheet.downloads.toLocaleString()} downloads
                    </div>
                    <span className="text-xs bg-burgundy-100 dark:bg-burgundy-900/40 text-burgundy-800 dark:text-burgundy-300 px-2 py-1 rounded-full font-medium">
                      {worksheet.type}
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* No Results */}
        {filteredWorksheets.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <FileText className="w-16 h-16 text-cream-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-burgundy-900 dark:text-cream-50 mb-2">No worksheets found</h3>
            <p className="text-burgundy-600 dark:text-gray-400">
              Try adjusting your filters or search terms to find what you're looking for.
            </p>
          </motion.div>
        )}

        {/* Usage Tips */}
        <motion.div
          className="mt-16 bg-gradient-to-r from-burgundy-50 to-amber-50 dark:from-dark-warm-100 dark:to-dark-warm-100 rounded-2xl p-8 border border-burgundy-100 dark:border-dark-warm-50"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="text-center mb-8">
            <BookOpen className="w-12 h-12 text-burgundy-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-burgundy-900 dark:text-cream-50 mb-4">How to Use These Worksheets</h2>
            <p className="text-burgundy-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get the most out of your printable resources with these helpful tips.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-burgundy-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🖨️</span>
              </div>
              <h3 className="font-semibold text-burgundy-900 dark:text-cream-50 mb-2">Print Quality</h3>
              <p className="text-sm text-burgundy-600 dark:text-gray-400">
                Use high-quality paper and print settings for the best experience. All PDFs are optimized for standard printers.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-burgundy-100 dark:bg-dark-warm-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="font-semibold text-burgundy-900 dark:text-cream-50 mb-2">Study Schedule</h3>
              <p className="text-sm text-burgundy-600 dark:text-gray-400">
                Work through worksheets at your own pace. Estimated times are guidelines - take as long as you need.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-burgundy-100 dark:bg-dark-warm-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="font-semibold text-burgundy-900 dark:text-cream-50 mb-2">Answer Keys</h3>
              <p className="text-sm text-burgundy-600 dark:text-gray-400">
                Most worksheets include answer keys. Check your work and learn from mistakes to improve faster.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Worksheets
