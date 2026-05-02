import React, { useState } from 'react'
import { Map, MapPin, Utensils, Globe, Volume2, Info, Star, ChevronRight, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const FranceMap = () => {
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [hoveredRegion, setHoveredRegion] = useState(null)

  // Simple pronunciation function
  const playPronunciation = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'fr-FR'
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const regions = {
    'ile-de-france': {
      id: 'ile-de-france',
      name: 'Île-de-France',
      capital: 'Paris',
      position: { x: 48, y: 35 },
      color: '#DC2626',
      dialect: 'Standard French',
      dialectInfo: 'The reference accent for French language learning',
      keyCity: 'Paris',
      cityInfo: 'The City of Light, cultural and political capital',
      specialFood: 'Croissants & Macarons',
      foodInfo: 'Home to world-famous pastries and haute cuisine',
      funFact: 'Paris has more dog owners per capita than any other French city',
      pronunciation: 'eel-duh-FRAHNSS'
    },
    'normandy': {
      id: 'normandy',
      name: 'Normandy',
      capital: 'Rouen',
      position: { x: 35, y: 25 },
      color: '#059669',
      dialect: 'Norman French',
      dialectInfo: 'Influenced by Viking settlements, softer consonants',
      keyCity: 'Caen',
      cityInfo: 'Historic city, birthplace of William the Conqueror',
      specialFood: 'Camembert & Calvados',
      foodInfo: 'Famous for creamy cheeses and apple brandy',
      funFact: 'Normandy beaches were the site of D-Day landings in WWII',
      pronunciation: 'nor-mahn-DEE'
    },
    'brittany': {
      id: 'brittany',
      name: 'Brittany',
      capital: 'Rennes',
      position: { x: 20, y: 35 },
      color: '#7C3AED',
      dialect: 'Breton Influence',
      dialectInfo: 'Celtic language influence, unique intonation patterns',
      keyCity: 'Brest',
      cityInfo: 'Major naval port with maritime heritage',
      specialFood: 'Crêpes & Cider',
      foodInfo: 'Birthplace of crêpes, both sweet and savory',
      funFact: 'Brittany has over 2,700 km of coastline',
      pronunciation: 'bruh-TAHN-yuh'
    },
    'provence': {
      id: 'provence',
      name: 'Provence',
      capital: 'Marseille',
      position: { x: 70, y: 75 },
      color: '#EA580C',
      dialect: 'Provençal Accent',
      dialectInfo: 'Melodic accent, influenced by Occitan language',
      keyCity: 'Nice',
      cityInfo: 'Glamorous Riviera city with Italian influences',
      specialFood: 'Bouillabaisse & Ratatouille',
      foodInfo: 'Mediterranean cuisine with herbs and olive oil',
      funFact: 'Provence produces 40% of French lavender',
      pronunciation: 'pro-VAHNSS'
    },
    'alsace': {
      id: 'alsace',
      name: 'Alsace',
      capital: 'Strasbourg',
      position: { x: 85, y: 40 },
      color: '#0891B2',
      dialect: 'Alsatian German',
      dialectInfo: 'Germanic influence, guttural sounds, unique vocabulary',
      keyCity: 'Colmar',
      cityInfo: 'Fairy-tale town with half-timbered houses',
      specialFood: 'Choucroute & Kugelhopf',
      foodInfo: 'German-influenced cuisine with sauerkraut and pastries',
      funFact: 'Alsace has changed nationality 4 times in 150 years',
      pronunciation: 'ahl-ZAHSS'
    },
    'lyon': {
      id: 'lyon',
      name: 'Rhône-Alpes',
      capital: 'Lyon',
      position: { x: 65, y: 55 },
      color: '#BE185D',
      dialect: 'Lyonnais',
      dialectInfo: 'Distinctive nasal sounds, rapid speech patterns',
      keyCity: 'Lyon',
      cityInfo: 'Gastronomic capital of France',
      specialFood: 'Coq au Vin & Quenelles',
      foodInfo: 'Traditional Lyonnaise cuisine, home to Paul Bocuse',
      funFact: 'Lyon has more restaurants per capita than any French city',
      pronunciation: 'ree-ohn-AHLP'
    },
    'bordeaux': {
      id: 'bordeaux',
      name: 'Nouvelle-Aquitaine',
      capital: 'Bordeaux',
      position: { x: 30, y: 65 },
      color: '#7C2D12',
      dialect: 'Southwestern French',
      dialectInfo: 'Gascon influence, distinctive vowel sounds',
      keyCity: 'Bordeaux',
      cityInfo: 'World wine capital with UNESCO heritage center',
      specialFood: 'Foie Gras & Canelés',
      foodInfo: 'Rich cuisine and world-renowned wines',
      funFact: 'Bordeaux region produces 960 million bottles of wine annually',
      pronunciation: 'noo-vel-ah-kee-TEN'
    },
    'toulouse': {
      id: 'toulouse',
      name: 'Occitanie',
      capital: 'Toulouse',
      position: { x: 45, y: 75 },
      color: '#9333EA',
      dialect: 'Occitan Influence',
      dialectInfo: 'Southern accent, Occitan language substrate',
      keyCity: 'Toulouse',
      cityInfo: 'The Pink City, aerospace industry hub',
      specialFood: 'Cassoulet & Saucisse',
      foodInfo: 'Hearty bean stews and regional sausages',
      funFact: 'Toulouse is home to Airbus headquarters',
      pronunciation: 'ok-see-tah-NEE'
    }
  }

  const RegionTooltip = ({ region, position }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="absolute z-50 bg-white dark:bg-dark-warm-100 rounded-lg shadow-xl border border-gray-200 dark:border-dark-warm-50 p-3 sm:p-4 min-w-48 sm:min-w-64 max-w-xs"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -100%)'
      }}
    >
      <div className="text-center">
        <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-cream-50 mb-2">{region.name}</h3>
        <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Capital:</span>
            <span className="font-medium dark:text-gray-200">{region.capital}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Dialect:</span>
            <span className="font-medium truncate ml-2 dark:text-gray-200">{region.dialect}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Specialty:</span>
            <span className="font-medium truncate ml-2 dark:text-gray-200">{region.specialFood}</span>
          </div>
        </div>
        <button
          onClick={() => setSelectedRegion(region)}
          className="mt-2 sm:mt-3 w-full bg-burgundy-600 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm hover:bg-burgundy-700 transition-colors duration-200"
        >
          Learn More
        </button>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white dark:from-dark-warm-300 dark:to-dark-warm-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        {/* Header */}
        <motion.div
          className="text-center mb-8 sm:mb-10 md:mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center bg-burgundy-50 text-burgundy-700 px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 border border-burgundy-100"
            whileHover={{ scale: 1.05 }}
          >
            <Map className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            <span className="hidden sm:inline">Exploration Géographique • Geographic Exploration</span>
            <span className="sm:hidden">Geographic Exploration</span>
          </motion.div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-cream-50 mb-4 sm:mb-6 px-2">
            🌍 Interactive Map of France
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-2">
            Explore the diverse regions of France, discover local dialects, traditional foods,
            and cultural treasures that make each area unique.
          </p>
        </motion.div>

        {/* Map and Notations Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
          {/* Map Container */}
          <div className="lg:col-span-2">
            <motion.div
              className="bg-white dark:bg-dark-warm-100 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-cream-50 mb-4 sm:mb-6 text-center">
                Regions of France
              </h2>

              {/* SVG Map Container - Smaller */}
              <div className="relative w-full h-64 sm:h-80 md:h-96 bg-gradient-to-b from-blue-100 to-green-100 rounded-lg sm:rounded-xl overflow-hidden"
                   style={{ minHeight: '256px' }}>
                {/* Simplified France outline */}
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full"
                  style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
                >
                  {/* France outline */}
                  <path
                    d="M15,20 L25,15 L40,18 L55,15 L70,20 L85,25 L90,40 L85,55 L80,70 L70,85 L50,90 L30,85 L20,70 L15,50 Z"
                    fill="#f3f4f6"
                    stroke="#d1d5db"
                    strokeWidth="0.5"
                  />
                </svg>

                {/* Region Markers */}
                {Object.values(regions).map((region) => (
                  <div key={region.id}>
                    <motion.button
                      className="absolute w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-all duration-200"
                      style={{
                        left: `${region.position.x}%`,
                        top: `${region.position.y}%`,
                        backgroundColor: region.color
                      }}
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.9 }}
                      onMouseEnter={() => setHoveredRegion(region)}
                      onMouseLeave={() => setHoveredRegion(null)}
                      onClick={() => setSelectedRegion(region)}
                    />

                    {/* Region Label */}
                    <div
                      className="absolute text-xs font-medium text-gray-700 dark:text-gray-300 pointer-events-none transform -translate-x-1/2 hidden sm:block"
                      style={{
                        left: `${region.position.x}%`,
                        top: `${region.position.y + 8}%`
                      }}
                    >
                      {region.name}
                    </div>
                  </div>
                ))}

                {/* Tooltip */}
                <AnimatePresence>
                  {hoveredRegion && (
                    <RegionTooltip region={hoveredRegion} position={hoveredRegion.position} />
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <p>Click on any region marker to explore its unique characteristics</p>
              </div>
            </motion.div>
          </div>

          {/* Notations/Legend - Side Panel */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-white dark:bg-dark-warm-100 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-cream-50 mb-3 sm:mb-4 text-center">Region Legend</h3>
              <div className="space-y-1 sm:space-y-2">
                {Object.values(regions).map((region) => (
                  <button
                    key={region.id}
                    onClick={() => setSelectedRegion(region)}
                    className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-warm-200 transition-colors text-left border border-gray-100 dark:border-dark-warm-50 hover:border-gray-200 w-full"
                  >
                    <div
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0 border-2 border-white shadow-md"
                      style={{ backgroundColor: region.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-cream-50 block truncate">{region.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{region.capital}</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Region Details - When Selected */}
        <AnimatePresence>
          {selectedRegion && (
            <motion.div
              className="bg-white dark:bg-dark-warm-100 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-cream-50">{selectedRegion.name}</h3>
                  <div
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white shadow-lg flex-shrink-0"
                    style={{ backgroundColor: selectedRegion.color }}
                  />
                </div>
                <button
                  onClick={() => setSelectedRegion(null)}
                  className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-warm-200 transition-colors self-end sm:self-auto"
                  aria-label="Close region details"
                >
                  <X size={20} className="sm:w-6 sm:h-6 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {/* Pronunciation */}
                <div className="bg-gradient-to-br from-burgundy-50 to-burgundy-100 dark:from-dark-warm-200 dark:to-dark-warm-100 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-semibold text-burgundy-800 dark:text-cream-50">Pronunciation</span>
                    <button
                      onClick={() => playPronunciation(selectedRegion.name)}
                      className="text-burgundy-600 dark:text-burgundy-400 hover:text-burgundy-700"
                      aria-label="Play pronunciation"
                    >
                      <Volume2 size={16} className="sm:w-5 sm:h-5" />
                    </button>
                  </div>
                  <p className="text-sm sm:text-base md:text-lg font-medium text-burgundy-900 dark:text-cream-50">{selectedRegion.pronunciation}</p>
                </div>

                {/* Dialect */}
                <div className="bg-gradient-to-br from-burgundy-100 to-burgundy-200 dark:from-dark-warm-200 dark:to-dark-warm-100 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-burgundy-600 dark:text-burgundy-400" />
                    <span className="text-xs sm:text-sm font-semibold text-burgundy-800 dark:text-cream-50">Local Dialect</span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-burgundy-900 dark:text-cream-50 mb-1">{selectedRegion.dialect}</h4>
                  <p className="text-xs sm:text-sm text-burgundy-700 dark:text-gray-300">{selectedRegion.dialectInfo}</p>
                </div>

                {/* Key City */}
                <div className="bg-gradient-to-br from-burgundy-200 to-burgundy-300 dark:from-dark-warm-200 dark:to-dark-warm-100 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-burgundy-600 dark:text-burgundy-400" />
                    <span className="text-xs sm:text-sm font-semibold text-burgundy-800 dark:text-cream-50">Key City</span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-burgundy-900 dark:text-cream-50 mb-1">{selectedRegion.keyCity}</h4>
                  <p className="text-xs sm:text-sm text-burgundy-700 dark:text-gray-300">{selectedRegion.cityInfo}</p>
                </div>

                {/* Special Food */}
                <div className="bg-gradient-to-br from-cream-100 to-cream-200 dark:from-dark-warm-200 dark:to-dark-warm-100 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Utensils className="w-4 h-4 sm:w-5 sm:h-5 text-burgundy-600 dark:text-burgundy-400" />
                    <span className="text-xs sm:text-sm font-semibold text-burgundy-800 dark:text-cream-50">Regional Specialty</span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-burgundy-900 dark:text-cream-50 mb-1">{selectedRegion.specialFood}</h4>
                  <p className="text-xs sm:text-sm text-burgundy-700 dark:text-gray-300">{selectedRegion.foodInfo}</p>
                </div>
              </div>

              {/* Fun Fact - Full Width */}
              <div className="mt-4 sm:mt-6 bg-gradient-to-r from-cream-50 to-cream-100 dark:from-dark-warm-200 dark:to-dark-warm-100 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-burgundy-200 dark:border-dark-warm-50">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 text-burgundy-600 dark:text-burgundy-400" />
                  <span className="text-base sm:text-lg md:text-xl font-bold text-burgundy-800 dark:text-cream-50">Fun Fact</span>
                </div>
                <p className="text-sm sm:text-base md:text-lg text-burgundy-700 dark:text-gray-300">{selectedRegion.funFact}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Description - Understanding French Regions */}
        <motion.div
          className="mt-8 sm:mt-12 md:mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {/* Introduction */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12 px-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-cream-50 mb-3 sm:mb-4">Understanding French Regional Diversity</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
              France's rich cultural tapestry is woven from distinct regional identities, each with unique dialects,
              culinary traditions, and historical influences that shape the French language and culture today.
            </p>
          </div>

          {/* Key Aspects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12">
            <div className="bg-gradient-to-br from-burgundy-50 to-burgundy-100 dark:from-dark-warm-200 dark:to-dark-warm-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4">🗣️</div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-burgundy-900 dark:text-cream-50 mb-2 sm:mb-3">Regional Accents</h3>
              <p className="text-sm sm:text-base text-burgundy-600 dark:text-gray-400 leading-relaxed">
                Each region has distinct pronunciation patterns and vocabulary influenced by local history,
                neighboring languages, and cultural heritage that add richness to the French language.
              </p>
            </div>

            <div className="bg-gradient-to-br from-burgundy-100 to-burgundy-200 dark:from-dark-warm-200 dark:to-dark-warm-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4">🍽️</div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-burgundy-900 dark:text-cream-50 mb-2 sm:mb-3">Culinary Traditions</h3>
              <p className="text-sm sm:text-base text-burgundy-600 dark:text-gray-400 leading-relaxed">
                French cuisine varies dramatically by region, reflecting local ingredients, climate, and cultural influences.
                From Normandy's creamy cheeses to Provence's Mediterranean herbs.
              </p>
            </div>

            <div className="bg-gradient-to-br from-cream-100 to-cream-200 dark:from-dark-warm-200 dark:to-dark-warm-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4">🏛️</div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-burgundy-900 dark:text-cream-50 mb-2 sm:mb-3">Cultural Heritage</h3>
              <p className="text-sm sm:text-base text-burgundy-600 dark:text-gray-400 leading-relaxed">
                From Celtic Brittany to Germanic Alsace, each region preserves unique traditions, architectural styles,
                and historical influences that contribute to France's diverse cultural landscape.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Learning Tips */}
        <motion.div
          className="mt-8 sm:mt-10 md:mt-12 bg-gradient-to-r from-burgundy-50 to-cream-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-burgundy-100"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="text-center mb-4 sm:mb-6">
            <Info className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-burgundy-600 mx-auto mb-3 sm:mb-4" />
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-cream-50 mb-2">Regional Learning Tips</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Understanding regional differences will help you communicate more effectively across France.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white dark:bg-dark-warm-200 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-cream-50 mb-2 sm:mb-3 flex items-center">
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-burgundy-600 mr-2" />
                For Beginners
              </h3>
              <ul className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 space-y-1 sm:space-y-2">
                <li>• Start with standard Parisian French</li>
                <li>• Learn basic regional food vocabulary</li>
                <li>• Practice with media from different regions</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-dark-warm-200 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-cream-50 mb-2 sm:mb-3 flex items-center">
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-burgundy-600 mr-2" />
                For Advanced Learners
              </h3>
              <ul className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 space-y-1 sm:space-y-2">
                <li>• Study regional literature and poetry</li>
                <li>• Watch local news from different regions</li>
                <li>• Learn about historical language influences</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default FranceMap
