import React, { useState } from 'react'
import { Lightbulb, Brain, Globe, BookOpen, ArrowRight, Zap, Heart, Star, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import SpeakButton from '../components/SpeakButton'

const MemoryBoosters = () => {
  const [activeCategory, setActiveCategory] = useState('cognates')
  const [expandedItems, setExpandedItems] = useState({})

  const toggleExpanded = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const memoryData = {
    cognates: [
      {
        id: 1,
        title: "Perfect Cognates",
        subtitle: "Words that are identical in both languages",
        icon: "🎯",
        examples: [
          { french: "animal", english: "animal", pronunciation: "ah-nee-MAHL" },
          { french: "restaurant", english: "restaurant", pronunciation: "res-toh-RAHN" },
          { french: "garage", english: "garage", pronunciation: "gah-RAHZH" },
          { french: "nature", english: "nature", pronunciation: "nah-TOOR" },
          { french: "culture", english: "culture", pronunciation: "kool-TOOR" }
        ],
        tip: "These words look the same but often have different pronunciations. Focus on the French accent patterns!"
      },
      {
        id: 2,
        title: "Near Cognates",
        subtitle: "Words with slight spelling differences",
        icon: "🔍",
        examples: [
          { french: "musique", english: "music", pronunciation: "moo-ZEEK" },
          { french: "théâtre", english: "theater", pronunciation: "tay-AH-truh" },
          { french: "hôpital", english: "hospital", pronunciation: "oh-pee-TAHL" },
          { french: "université", english: "university", pronunciation: "oo-nee-ver-see-TAY" },
          { french: "liberté", english: "liberty", pronunciation: "lee-ber-TAY" }
        ],
        tip: "Look for patterns: -té often equals -ty, -que often equals -c, and accents usually indicate missing letters."
      },
      {
        id: 3,
        title: "False Friends (Faux Amis)",
        subtitle: "Words that look similar but mean different things",
        icon: "⚠️",
        examples: [
          { french: "actuellement", english: "currently", falseEnglish: "actually", pronunciation: "ak-too-el-MAHN" },
          { french: "librairie", english: "bookstore", falseEnglish: "library", pronunciation: "lee-breh-REE" },
          { french: "préservatif", english: "condom", falseEnglish: "preservative", pronunciation: "pray-zer-vah-TEEF" },
          { french: "rester", english: "to stay", falseEnglish: "to rest", pronunciation: "res-TAY" },
          { french: "sensible", english: "sensitive", falseEnglish: "sensible", pronunciation: "sahn-SEE-bluh" }
        ],
        tip: "Always double-check meanings! These tricky words can lead to embarrassing misunderstandings."
      }
    ],
    idioms: [
      {
        id: 1,
        title: "Animal Idioms",
        subtitle: "French expressions featuring our furry friends",
        icon: "🐾",
        examples: [
          { 
            french: "Avoir un chat dans la gorge", 
            literal: "To have a cat in the throat", 
            meaning: "To have a frog in one's throat",
            origin: "Cats were thought to cause throat irritation in medieval times"
          },
          { 
            french: "Poser un lapin", 
            literal: "To put down a rabbit", 
            meaning: "To stand someone up",
            origin: "From 19th century when 'lapin' meant a refusal to pay"
          },
          { 
            french: "Avoir d'autres chats à fouetter", 
            literal: "To have other cats to whip", 
            meaning: "To have other fish to fry",
            origin: "Medieval punishment reference, now means having more important things to do"
          }
        ],
        tip: "French loves animal metaphors! Learning these makes you sound more natural."
      },
      {
        id: 2,
        title: "Food Idioms",
        subtitle: "Expressions that are good enough to eat",
        icon: "🍽️",
        examples: [
          { 
            french: "Avoir la pêche", 
            literal: "To have the peach", 
            meaning: "To be in great shape/energetic",
            origin: "Peaches symbolize health and vitality in French culture"
          },
          { 
            french: "Raconter des salades", 
            literal: "To tell salads", 
            meaning: "To tell lies/nonsense",
            origin: "Salads are mixed up, like confused stories"
          },
          { 
            french: "C'est du gâteau", 
            literal: "It's cake", 
            meaning: "It's a piece of cake",
            origin: "Cake is easy and pleasant to eat"
          }
        ],
        tip: "Food idioms often relate to the cultural significance of ingredients in French cuisine."
      },
      {
        id: 3,
        title: "Body Part Idioms",
        subtitle: "Expressions using parts of the human body",
        icon: "👤",
        examples: [
          { 
            french: "Coûter les yeux de la tête", 
            literal: "To cost the eyes of the head", 
            meaning: "To cost an arm and a leg",
            origin: "Eyes are precious, representing something very valuable"
          },
          { 
            french: "Avoir le bras long", 
            literal: "To have a long arm", 
            meaning: "To have influence/connections",
            origin: "Long arms can reach further, metaphor for extended influence"
          },
          { 
            french: "Se mettre le doigt dans l'œil", 
            literal: "To put one's finger in the eye", 
            meaning: "To be completely wrong",
            origin: "Poking your eye would be a painful mistake"
          }
        ],
        tip: "Body part idioms are universal but each language has unique interpretations!"
      }
    ],
    regional: [
      {
        id: 1,
        title: "Quebec vs. France: Technology",
        subtitle: "Different words for modern inventions",
        icon: "💻",
        examples: [
          { quebec: "courriel", france: "e-mail", english: "email", note: "Quebec preserves French purity" },
          { quebec: "magasiner", france: "faire du shopping", english: "to shop", note: "Quebec adapted English 'magazine'" },
          { quebec: "fin de semaine", france: "week-end", english: "weekend", note: "Quebec translates literally" },
          { quebec: "stationnement", france: "parking", english: "parking", note: "Quebec avoids English borrowings" },
          { quebec: "dépanneur", france: "épicerie de nuit", english: "convenience store", note: "Quebec's unique term" }
        ],
        tip: "Quebec French often creates new French words while France borrows from English."
      },
      {
        id: 2,
        title: "Belgian French Specialties",
        subtitle: "Unique expressions from our Belgian neighbors",
        icon: "🇧🇪",
        examples: [
          { belgian: "septante", standard: "soixante-dix", english: "seventy", note: "Logical counting system" },
          { belgian: "nonante", standard: "quatre-vingt-dix", english: "ninety", note: "Continues the logical pattern" },
          { belgian: "dracher", standard: "pleuvoir fort", english: "to rain heavily", note: "From Dutch influence" },
          { belgian: "une fois", standard: "donc", english: "so/then", note: "Germanic influence on sentence structure" },
          { belgian: "savoir", standard: "pouvoir", english: "can/to be able", note: "Different usage of 'to know'" }
        ],
        tip: "Belgian French shows Germanic influences and more logical number systems."
      },
      {
        id: 3,
        title: "Swiss French Particularities",
        subtitle: "Alpine variations of the French language",
        icon: "🏔️",
        examples: [
          { swiss: "huitante", standard: "quatre-vingts", english: "eighty", note: "Unique to Swiss French" },
          { swiss: "déjeuner", standard: "petit-déjeuner", english: "breakfast", note: "Meal names shifted" },
          { swiss: "dîner", standard: "déjeuner", english: "lunch", note: "Traditional French usage preserved" },
          { swiss: "souper", standard: "dîner", english: "dinner", note: "Old French term maintained" },
          { swiss: "panosse", standard: "serpillière", english: "mop", note: "Regional vocabulary" }
        ],
        tip: "Swiss French preserves older French terms and has unique number words."
      }
    ]
  }

  const categories = [
    { id: 'cognates', name: 'Cognates & False Friends', icon: Globe, color: 'bg-burgundy-500' },
    { id: 'idioms', name: 'Idiom Origins', icon: Lightbulb, color: 'bg-burgundy-600' },
    { id: 'regional', name: 'Regional Differences', icon: Brain, color: 'bg-burgundy-700' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-warm-300">
      {/* Hero */}
      <div className="bg-gradient-to-r from-burgundy-800 to-burgundy-600 text-cream-50 py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center bg-cream-50/20 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <Brain className="w-4 h-4 mr-2" />
              Curiosités Linguistiques • Linguistic Curiosities
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
              Memory Boosters
            </h1>
            <p className="text-cream-100 text-lg max-w-xl mx-auto">
              Discover fascinating linguistic patterns, surprising word origins, and regional variations that will help you remember French more effectively.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        {/* Category Tabs */}
        <motion.div
          className="flex justify-center mb-8 sm:mb-10 md:mb-12 px-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white dark:bg-dark-warm-100 rounded-xl sm:rounded-2xl p-1 sm:p-2 shadow-lg border border-gray-100 dark:border-dark-warm-50 w-full max-w-4xl">
            <div className="flex flex-col sm:flex-row gap-1 sm:gap-0">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center justify-center sm:justify-start space-x-2 px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium transition-all duration-300 flex-1 ${
                      activeCategory === category.id
                        ? 'bg-burgundy-600 text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-400 hover:text-burgundy-600 hover:bg-cream-100 dark:hover:bg-dark-warm-200'
                    }`}
                  >
                    <Icon size={16} className="sm:w-5 sm:h-5" />
                    <span className="hidden xs:inline">{category.name}</span>
                    <span className="xs:hidden">{category.name.split(' ')[0]}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Content Cards */}
        <motion.div
          className="space-y-4 sm:space-y-6 md:space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {memoryData[activeCategory].map((item, index) => (
            <motion.div
              key={item.id}
              className="bg-white dark:bg-dark-warm-100 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-burgundy-50 to-cream-100 dark:from-dark-warm-200 dark:to-dark-warm-200 p-4 sm:p-6 border-b border-gray-100 dark:border-dark-warm-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    <div className="text-2xl sm:text-3xl md:text-4xl flex-shrink-0">{item.icon}</div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-cream-50 leading-tight">{item.title}</h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-tight">{item.subtitle}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleExpanded(item.id)}
                    className="p-1.5 sm:p-2 rounded-full hover:bg-white/50 transition-colors duration-200 flex-shrink-0"
                  >
                    {expandedItems[item.id] ? (
                      <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Content */}
              <AnimatePresence>
                {expandedItems[item.id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 sm:p-6">
                      {/* Examples Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                        {item.examples.map((example, idx) => (
                          <div key={idx} className="bg-gray-50 dark:bg-dark-warm-200 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:bg-gray-100 dark:hover:bg-dark-warm-300 transition-colors duration-200">
                            {activeCategory === 'cognates' && (
                              <>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-semibold text-burgundy-600 text-sm sm:text-base">{example.french}</span>
                                    <SpeakButton
                                      text={example.french}
                                      size="sm"
                                      variant="minimal"
                                    />
                                  </div>
                                  <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{example.english}</span>
                                </div>
                                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">
                                  Pronunciation: {example.pronunciation}
                                </div>
                                {example.falseEnglish && (
                                  <div className="text-xs sm:text-sm text-red-600">
                                    ❌ Not: {example.falseEnglish}
                                  </div>
                                )}
                              </>
                            )}

                            {activeCategory === 'idioms' && (
                              <>
                                <div className="flex flex-col xs:flex-row xs:items-center gap-2 mb-2">
                                  <span className="font-semibold text-burgundy-600 text-sm sm:text-base">{example.french}</span>
                                  <SpeakButton
                                    text={example.french}
                                    size="sm"
                                    variant="minimal"
                                  />
                                </div>
                                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                                  Literal: {example.literal}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 mb-2">
                                  Meaning: {example.meaning}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                                  Origin: {example.origin}
                                </div>
                              </>
                            )}

                            {activeCategory === 'regional' && (
                              <>
                                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 mb-2">
                                  {example.quebec && (
                                    <div>
                                      <span className="text-xs text-burgundy-600 font-medium">Quebec:</span>
                                      <div className="flex items-center space-x-1">
                                        <span className="font-semibold text-sm">{example.quebec}</span>
                                        <SpeakButton
                                          text={example.quebec}
                                          size="sm"
                                          variant="minimal"
                                        />
                                      </div>
                                    </div>
                                  )}
                                  {example.belgian && (
                                    <div>
                                      <span className="text-xs text-yellow-600 font-medium">Belgian:</span>
                                      <div className="flex items-center space-x-1">
                                        <span className="font-semibold text-sm">{example.belgian}</span>
                                        <SpeakButton
                                          text={example.belgian}
                                          size="sm"
                                          variant="minimal"
                                        />
                                      </div>
                                    </div>
                                  )}
                                  {example.swiss && (
                                    <div>
                                      <span className="text-xs text-red-600 font-medium">Swiss:</span>
                                      <div className="flex items-center space-x-1">
                                        <span className="font-semibold text-sm">{example.swiss}</span>
                                        <SpeakButton
                                          text={example.swiss}
                                          size="sm"
                                          variant="minimal"
                                        />
                                      </div>
                                    </div>
                                  )}
                                  <div>
                                    <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                                      {example.france ? 'France:' : 'Standard:'}
                                    </span>
                                    <div className="flex items-center space-x-1">
                                      <span className="font-semibold text-sm">{example.france || example.standard}</span>
                                      <SpeakButton
                                        text={example.france || example.standard}
                                        size="sm"
                                        variant="minimal"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                                  English: {example.english}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                                  {example.note}
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Tip */}
                      <div className="bg-gradient-to-r from-cream-100 to-cream-200 dark:from-dark-warm-200 dark:to-dark-warm-200 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-burgundy-200 dark:border-dark-warm-50">
                        <div className="flex items-start space-x-2 sm:space-x-3">
                          <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-burgundy-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-burgundy-800 dark:text-cream-50 mb-1 text-sm sm:text-base">Memory Tip</h4>
                            <p className="text-burgundy-700 dark:text-gray-300 text-xs sm:text-sm">{item.tip}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Preview when collapsed */}
              {!expandedItems[item.id] && (
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
                      {item.examples.slice(0, window.innerWidth < 640 ? 2 : 3).map((example, idx) => (
                        <span key={idx} className="text-xs sm:text-sm bg-gray-100 dark:bg-dark-warm-200 text-gray-700 dark:text-gray-300 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
                          {example.french || example.quebec || example.belgian || example.swiss}
                        </span>
                      ))}
                      {item.examples.length > (window.innerWidth < 640 ? 2 : 3) && (
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">+{item.examples.length - (window.innerWidth < 640 ? 2 : 3)} more</span>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 ml-2" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Fun Fact Section */}
        <motion.div
          className="mt-8 sm:mt-12 md:mt-16 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-purple-100"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="text-center">
            <Star className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-burgundy-600 mx-auto mb-3 sm:mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-cream-50 mb-4 sm:mb-6">Did You Know?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-left">
              <div className="bg-white dark:bg-dark-warm-200 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm">
                <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">🌍</div>
                <h3 className="font-semibold text-gray-900 dark:text-cream-50 mb-2 text-sm sm:text-base">Global Reach</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  French is spoken by over 280 million people across 5 continents, making regional variations inevitable and fascinating!
                </p>
              </div>
              <div className="bg-white dark:bg-dark-warm-200 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm">
                <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">📚</div>
                <h3 className="font-semibold text-gray-900 dark:text-cream-50 mb-2 text-sm sm:text-base">Cognate Power</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  English and French share over 30% of their vocabulary due to Norman conquest and Latin roots - instant vocabulary boost!
                </p>
              </div>
              <div className="bg-white dark:bg-dark-warm-200 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm">
                <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">🧠</div>
                <h3 className="font-semibold text-gray-900 dark:text-cream-50 mb-2 text-sm sm:text-base">Memory Magic</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Learning word origins and patterns can increase vocabulary retention by up to 60% compared to rote memorization.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default MemoryBoosters
