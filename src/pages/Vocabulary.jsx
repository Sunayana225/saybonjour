import React, { useState, useEffect, useCallback } from 'react'
import { Brain, Plus, RotateCcw, Check, X, Clock, Star, Trash2, BookOpen, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getSRSDeck, getDueCards, addWordToSRS, updateCardAfterReview, removeFromSRS } from '../utils/srs'
import { addXP, recordWordLearned } from '../utils/progress'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'

const WORD_LISTS = {
  'Top 50 Essentials': [
    { id: 'w1', french: 'le', english: 'the (m.)', category: 'Article' },
    { id: 'w2', french: 'la', english: 'the (f.)', category: 'Article' },
    { id: 'w3', french: 'un', english: 'a / an (m.)', category: 'Article' },
    { id: 'w4', french: 'une', english: 'a / an (f.)', category: 'Article' },
    { id: 'w5', french: 'de', english: 'of / from', category: 'Preposition' },
    { id: 'w6', french: 'et', english: 'and', category: 'Conjunction' },
    { id: 'w7', french: 'en', english: 'in / to (country)', category: 'Preposition' },
    { id: 'w8', french: 'que', english: 'that / which', category: 'Conjunction' },
    { id: 'w9', french: 'qui', english: 'who / which', category: 'Pronoun' },
    { id: 'w10', french: 'dans', english: 'in / inside', category: 'Preposition' },
    { id: 'w11', french: 'il', english: 'he / it', category: 'Pronoun' },
    { id: 'w12', french: 'ne', english: 'not (negation)', category: 'Adverb' },
    { id: 'w13', french: 'pas', english: 'not / step', category: 'Adverb' },
    { id: 'w14', french: 'plus', english: 'more / no longer', category: 'Adverb' },
    { id: 'w15', french: 'par', english: 'by / per', category: 'Preposition' },
    { id: 'w16', french: 'sur', english: 'on / above', category: 'Preposition' },
    { id: 'w17', french: 'avec', english: 'with', category: 'Preposition' },
    { id: 'w18', french: 'mais', english: 'but', category: 'Conjunction' },
    { id: 'w19', french: 'ou', english: 'or', category: 'Conjunction' },
    { id: 'w20', french: 'si', english: 'if / so / yes', category: 'Conjunction' },
    { id: 'w21', french: 'car', english: 'because / for', category: 'Conjunction' },
    { id: 'w22', french: 'pour', english: 'for / in order to', category: 'Preposition' },
    { id: 'w23', french: 'comme', english: 'like / as / since', category: 'Conjunction' },
    { id: 'w24', french: 'très', english: 'very', category: 'Adverb' },
    { id: 'w25', french: 'bien', english: 'well / good', category: 'Adverb' },
    { id: 'w26', french: 'aussi', english: 'also / as (comparison)', category: 'Adverb' },
    { id: 'w27', french: 'tout', english: 'all / every / quite', category: 'Adjective' },
    { id: 'w28', french: 'même', english: 'same / even / itself', category: 'Adjective' },
    { id: 'w29', french: 'autre', english: 'other / another', category: 'Adjective' },
    { id: 'w30', french: 'déjà', english: 'already', category: 'Adverb' },
  ],
  'Common Nouns': [
    { id: 'n1', french: 'le temps', english: 'time / weather', category: 'Noun' },
    { id: 'n2', french: 'la vie', english: 'life', category: 'Noun' },
    { id: 'n3', french: 'le monde', english: 'world / people', category: 'Noun' },
    { id: 'n4', french: 'la chose', english: 'thing', category: 'Noun' },
    { id: 'n5', french: 'l\'homme', english: 'man / mankind', category: 'Noun' },
    { id: 'n6', french: 'la femme', english: 'woman / wife', category: 'Noun' },
    { id: 'n7', french: 'le jour', english: 'day', category: 'Noun' },
    { id: 'n8', french: 'la maison', english: 'house / home', category: 'Noun' },
    { id: 'n9', french: 'le travail', english: 'work / job', category: 'Noun' },
    { id: 'n10', french: 'l\'enfant', english: 'child', category: 'Noun' },
    { id: 'n11', french: 'l\'ami', english: 'friend (m.)', category: 'Noun' },
    { id: 'n12', french: 'l\'eau', english: 'water', category: 'Noun' },
    { id: 'n13', french: 'le pain', english: 'bread', category: 'Noun' },
    { id: 'n14', french: 'la ville', english: 'city / town', category: 'Noun' },
    { id: 'n15', french: 'le pays', english: 'country', category: 'Noun' },
    { id: 'n16', french: 'la rue', english: 'street', category: 'Noun' },
    { id: 'n17', french: 'le livre', english: 'book', category: 'Noun' },
    { id: 'n18', french: 'la langue', english: 'language / tongue', category: 'Noun' },
    { id: 'n19', french: 'le problème', english: 'problem', category: 'Noun' },
    { id: 'n20', french: 'la question', english: 'question', category: 'Noun' },
  ],
  'Essential Adjectives': [
    { id: 'adj1', french: 'grand / grande', english: 'big / tall / great', category: 'Adjective' },
    { id: 'adj2', french: 'petit / petite', english: 'small / little', category: 'Adjective' },
    { id: 'adj3', french: 'bon / bonne', english: 'good', category: 'Adjective' },
    { id: 'adj4', french: 'mauvais / mauvaise', english: 'bad', category: 'Adjective' },
    { id: 'adj5', french: 'nouveau / nouvelle', english: 'new', category: 'Adjective' },
    { id: 'adj6', french: 'vieux / vieille', english: 'old', category: 'Adjective' },
    { id: 'adj7', french: 'beau / belle', english: 'beautiful / handsome', category: 'Adjective' },
    { id: 'adj8', french: 'long / longue', english: 'long', category: 'Adjective' },
    { id: 'adj9', french: 'fort / forte', english: 'strong / loud', category: 'Adjective' },
    { id: 'adj10', french: 'dernier / dernière', english: 'last / latest', category: 'Adjective' },
    { id: 'adj11', french: 'premier / première', english: 'first', category: 'Adjective' },
    { id: 'adj12', french: 'seul / seule', english: 'alone / only', category: 'Adjective' },
    { id: 'adj13', french: 'haut / haute', english: 'high / tall', category: 'Adjective' },
    { id: 'adj14', french: 'jeune', english: 'young', category: 'Adjective' },
    { id: 'adj15', french: 'propre', english: 'own / clean', category: 'Adjective' },
  ],
  'Travel Phrases': [
    { id: 't1', french: 'Où est...?', english: 'Where is...?', category: 'Phrase' },
    { id: 't2', french: 'C\'est combien?', english: 'How much is it?', category: 'Phrase' },
    { id: 't3', french: 'Je voudrais...', english: 'I would like...', category: 'Phrase' },
    { id: 't4', french: 'Avez-vous...?', english: 'Do you have...?', category: 'Phrase' },
    { id: 't5', french: 'L\'addition, s\'il vous plaît.', english: 'The bill, please.', category: 'Phrase' },
    { id: 't6', french: 'Je ne comprends pas.', english: 'I don\'t understand.', category: 'Phrase' },
    { id: 't7', french: 'Parlez-vous anglais?', english: 'Do you speak English?', category: 'Phrase' },
    { id: 't8', french: 'Pouvez-vous répéter?', english: 'Can you repeat?', category: 'Phrase' },
    { id: 't9', french: 'la gare', english: 'train station', category: 'Noun' },
    { id: 't10', french: 'l\'aéroport', english: 'airport', category: 'Noun' },
    { id: 't11', french: 'l\'hôtel', english: 'hotel', category: 'Noun' },
    { id: 't12', french: 'le billet', english: 'ticket', category: 'Noun' },
    { id: 't13', french: 'l\'entrée', english: 'entrance / starter', category: 'Noun' },
    { id: 't14', french: 'le plat', english: 'dish / main course', category: 'Noun' },
    { id: 't15', french: 'la sortie', english: 'exit / way out', category: 'Noun' },
  ],
}

const qualityLabels = [
  { q: 0, label: 'Again', color: 'bg-red-500 hover:bg-red-600', icon: X },
  { q: 1, label: 'Hard', color: 'bg-orange-400 hover:bg-orange-500', icon: Clock },
  { q: 2, label: 'Good', color: 'bg-blue-500 hover:bg-blue-600', icon: Check },
  { q: 3, label: 'Easy', color: 'bg-emerald-500 hover:bg-emerald-600', icon: Star },
]

const ReviewCard = ({ card, onRate }) => {
  const [revealed, setRevealed] = useState(false)

  return (
    <div className="max-w-lg mx-auto">
      <motion.div
        className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow-lg border border-cream-200 dark:border-dark-warm-50 overflow-hidden"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="bg-burgundy-600 px-4 py-2 flex items-center justify-between">
          <span className="text-xs text-cream-200 font-medium">{card.category || 'Vocabulary'}</span>
          <span className="text-xs text-cream-200">Interval: {card.interval || 1}d</span>
        </div>
        <div className="p-8 text-center min-h-40 flex flex-col items-center justify-center">
          <p className="text-3xl font-bold text-burgundy-800 dark:text-cream-50 mb-2">{card.french}</p>
          {revealed ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-xl text-gray-700 dark:text-gray-300 font-medium">{card.english}</p>
              {card.pronunciation && (
                <p className="text-sm text-burgundy-500 dark:text-burgundy-400 italic mt-1">/{card.pronunciation}/</p>
              )}
            </motion.div>
          ) : (
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Tap to reveal</p>
          )}
        </div>

        {!revealed ? (
          <div className="px-6 pb-6">
            <button
              onClick={() => setRevealed(true)}
              className="w-full py-3 bg-burgundy-600 text-cream-50 rounded-xl font-semibold text-sm hover:bg-burgundy-700 transition-colors"
            >
              Show Answer
            </button>
          </div>
        ) : (
          <div className="px-6 pb-6">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-3">How well did you know this?</p>
            <div className="grid grid-cols-4 gap-2">
              {qualityLabels.map(({ q, label, color, icon: Icon }) => (
                <button
                  key={q}
                  onClick={() => { onRate(card.id, q); setRevealed(false) }}
                  className={`${color} text-white py-2 rounded-lg text-xs font-medium flex flex-col items-center gap-1 transition-colors`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

const Vocabulary = () => {
  const [deck, setDeck] = useState([])
  const [dueCards, setDueCards] = useState([])
  const [activeTab, setActiveTab] = useState('browse')
  const [activeList, setActiveList] = useState('Top 50 Essentials')
  const [reviewIndex, setReviewIndex] = useState(0)
  const [sessionComplete, setSessionComplete] = useState(false)
  const [sessionStats, setSessionStats] = useState({ reviewed: 0, xpEarned: 0 })

  useEffect(() => {
    const d = getSRSDeck()
    setDeck(d)
    setDueCards(getDueCards())
  }, [])

  const handleAddWord = (word) => {
    const updated = addWordToSRS(word)
    setDeck(updated)
    recordWordLearned()
  }

  const handleRemove = (id) => {
    const updated = removeFromSRS(id)
    setDeck(updated)
    setDueCards(getDueCards())
  }

  const handleRate = useCallback((cardId, quality) => {
    updateCardAfterReview(cardId, quality)
    const xp = quality === 3 ? 10 : quality === 2 ? 7 : quality === 1 ? 3 : 1
    addXP(xp)
    setSessionStats(prev => ({ reviewed: prev.reviewed + 1, xpEarned: prev.xpEarned + xp }))

    if (reviewIndex + 1 >= dueCards.length) {
      setSessionComplete(true)
    } else {
      setReviewIndex(prev => prev + 1)
    }
    setDueCards(getDueCards())
  }, [reviewIndex, dueCards.length])

  const startReview = () => {
    const due = getDueCards()
    setDueCards(due)
    setReviewIndex(0)
    setSessionComplete(false)
    setSessionStats({ reviewed: 0, xpEarned: 0 })
    setActiveTab('review')
  }

  const wordList = WORD_LISTS[activeList] || []
  const inDeck = (id) => deck.some(c => c.id === id)

  return (
    <>
      <SEO
        title="French Vocabulary SRS | Learn French Words | SayBonjour"
        description="Master French vocabulary with spaced repetition. Add words to your personal deck and review them at the optimal time for maximum retention."
        url="/vocabulary"
      />
      <div className="min-h-screen bg-gray-50 dark:bg-dark-warm-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-burgundy-800 to-burgundy-600 text-cream-50 py-10 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center bg-cream-50/20 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                <Brain className="w-4 h-4 mr-2" />
                Vocabulary SRS
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                Vocabulary Builder
              </h1>
              <p className="text-cream-100 text-lg max-w-xl mx-auto mb-6">
                Build your French vocabulary with spaced repetition — each word reviewed at the perfect moment.
              </p>

              {/* Stats bar */}
              <div className="flex justify-center gap-6 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold">{deck.length}</div>
                  <div className="text-cream-200 text-xs">In deck</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-300">{dueCards.length}</div>
                  <div className="text-cream-200 text-xs">Due today</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-300">
                    {deck.filter(c => (c.repetitions || 0) >= 3).length}
                  </div>
                  <div className="text-cream-200 text-xs">Mastered</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-dark-warm-100 border-b border-cream-200 dark:border-dark-warm-50 sticky top-16 z-30">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex gap-1 py-2">
              {['browse', 'my deck', 'review'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                    activeTab === tab
                      ? 'bg-burgundy-600 text-cream-50'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-cream-100 dark:hover:bg-dark-warm-200 hover:text-burgundy-700 dark:hover:text-burgundy-400'
                  }`}
                >
                  {tab}
                  {tab === 'review' && dueCards.length > 0 && (
                    <span className="ml-1.5 bg-amber-400 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                      {dueCards.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            {/* BROWSE TAB */}
            {activeTab === 'browse' && (
              <motion.div key="browse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* List selector */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {Object.keys(WORD_LISTS).map(list => (
                    <button
                      key={list}
                      onClick={() => setActiveList(list)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        activeList === list
                          ? 'bg-burgundy-600 text-cream-50'
                          : 'bg-white dark:bg-dark-warm-100 text-gray-700 dark:text-gray-300 border border-cream-200 dark:border-dark-warm-50 hover:border-burgundy-300 dark:hover:border-burgundy-500'
                      }`}
                    >
                      {list}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {wordList.map(word => (
                    <motion.div
                      key={word.id}
                      className="bg-white dark:bg-dark-warm-100 rounded-xl border border-cream-200 dark:border-dark-warm-50 p-4 flex items-center justify-between shadow-sm"
                      whileHover={{ y: -2 }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <SpeakButton text={word.french} size="sm" variant="ghost" />
                          <span className="font-bold text-burgundy-800 dark:text-cream-50 text-sm">{word.french}</span>
                          <span className="text-xs bg-cream-100 dark:bg-dark-warm-200 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded">{word.category}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{word.english}</p>
                      </div>
                      <button
                        onClick={() => inDeck(word.id) ? handleRemove(word.id) : handleAddWord(word)}
                        className={`ml-3 p-2 rounded-lg transition-colors flex-shrink-0 ${
                          inDeck(word.id)
                            ? 'bg-burgundy-100 dark:bg-burgundy-900/40 text-burgundy-600 dark:text-burgundy-400 hover:bg-burgundy-200 dark:hover:bg-burgundy-900/60'
                            : 'bg-cream-100 dark:bg-dark-warm-200 text-gray-500 dark:text-gray-400 hover:bg-burgundy-100 dark:hover:bg-burgundy-900/30 hover:text-burgundy-600 dark:hover:text-burgundy-400'
                        }`}
                        title={inDeck(word.id) ? 'Remove from deck' : 'Add to deck'}
                      >
                        {inDeck(word.id) ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* MY DECK TAB */}
            {activeTab === 'my deck' && (
              <motion.div key="deck" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {deck.length === 0 ? (
                  <div className="text-center py-16">
                    <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">Your deck is empty</h3>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">Browse word lists and add words to start reviewing.</p>
                    <button
                      onClick={() => setActiveTab('browse')}
                      className="px-5 py-2 bg-burgundy-600 text-cream-50 rounded-lg text-sm font-medium hover:bg-burgundy-700"
                    >
                      Browse Words
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-burgundy-800 dark:text-cream-50">{deck.length} words in your deck</h2>
                      {dueCards.length > 0 && (
                        <button
                          onClick={startReview}
                          className="flex items-center gap-2 px-4 py-2 bg-burgundy-600 text-cream-50 rounded-lg text-sm font-medium hover:bg-burgundy-700"
                        >
                          <Zap className="w-4 h-4" />
                          Review {dueCards.length} due
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {deck.map(card => (
                        <div key={card.id} className="bg-white dark:bg-dark-warm-100 rounded-xl border border-cream-200 dark:border-dark-warm-50 p-4 flex items-center justify-between shadow-sm">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <SpeakButton text={card.french} size="sm" variant="ghost" />
                              <span className="font-bold text-burgundy-800 dark:text-cream-50 text-sm">{card.french}</span>
                              <span className="text-xs bg-cream-100 dark:bg-dark-warm-200 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded">{card.category}</span>
                              {(card.repetitions || 0) >= 3 && (
                                <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded">Mastered</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{card.english}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              {card.nextReview ? `Next: ${new Date(card.nextReview).toLocaleDateString()}` : 'Due now'} · {card.repetitions || 0} reviews
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemove(card.id)}
                            className="ml-3 p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* REVIEW TAB */}
            {activeTab === 'review' && (
              <motion.div key="review" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {dueCards.length === 0 && !sessionComplete ? (
                  <div className="text-center py-16">
                    <Check className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">All caught up!</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No cards are due right now. Come back later or add more words.</p>
                    <button
                      onClick={() => setActiveTab('browse')}
                      className="px-5 py-2 bg-burgundy-600 text-cream-50 rounded-lg text-sm font-medium hover:bg-burgundy-700"
                    >
                      Add More Words
                    </button>
                  </div>
                ) : sessionComplete ? (
                  <motion.div
                    className="text-center py-16"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-2xl font-bold text-burgundy-800 dark:text-cream-50 mb-2">Session Complete!</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-1">{sessionStats.reviewed} cards reviewed</p>
                    <p className="text-emerald-600 font-bold text-lg mb-6">+{sessionStats.xpEarned} XP earned</p>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={startReview}
                        className="px-5 py-2 bg-burgundy-600 text-cream-50 rounded-lg text-sm font-medium hover:bg-burgundy-700 flex items-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" /> Review Again
                      </button>
                      <button
                        onClick={() => setActiveTab('browse')}
                        className="px-5 py-2 border border-burgundy-300 text-burgundy-600 rounded-lg text-sm font-medium hover:bg-burgundy-50"
                      >
                        Add Words
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <p className="text-sm text-gray-500 dark:text-gray-400">{reviewIndex + 1} / {dueCards.length} cards</p>
                      <div className="w-48 bg-gray-200 dark:bg-dark-warm-50 rounded-full h-2">
                        <div
                          className="bg-burgundy-600 h-2 rounded-full transition-all"
                          style={{ width: `${((reviewIndex) / dueCards.length) * 100}%` }}
                        />
                      </div>
                    </div>
                    {dueCards[reviewIndex] && (
                      <ReviewCard
                        key={dueCards[reviewIndex].id + reviewIndex}
                        card={dueCards[reviewIndex]}
                        onRate={handleRate}
                      />
                    )}
                    <p className="text-center text-xs text-gray-400 mt-6">
                      Again = tomorrow · Hard = +1d · Good = scheduled · Easy = longer
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}

export default Vocabulary
