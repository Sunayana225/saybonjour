import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const SEASONS = {
  'Printemps': {
    en: 'Spring',
    emoji: '🌸',
    gradient: 'from-pink-100 to-green-100 dark:from-pink-900/20 dark:to-green-900/20',
    months: 'Mars · Avril · Mai',
    phrase: { fr: 'Le printemps est ma saison préférée.', en: 'Spring is my favourite season.' },
    vocab: [
      { fr: 'les fleurs', en: 'flowers' },
      { fr: 'le bourgeon', en: 'bud / sprout' },
      { fr: 'la pluie printanière', en: 'spring rain' },
      { fr: 'les allergies', en: 'allergies' },
      { fr: 'le jardin', en: 'garden' },
      { fr: 'les oiseaux chantent', en: 'the birds sing' },
      { fr: 'se réchauffer', en: 'to warm up' },
      { fr: 'les jonquilles', en: 'daffodils' },
      { fr: 'le muguet', en: 'lily of the valley (May 1st symbol)' },
      { fr: 'printanier / -ière', en: 'spring-like (adjective)' },
    ],
    culture: 'On the 1st of May (La Fête du Travail), French people traditionally offer sprigs of muguet (lily of the valley) to loved ones for luck. It\'s also when spring sales (les soldes de printemps) begin.',
    phrases: [
      { fr: 'Il fait beau aujourd\'hui.', en: 'The weather is lovely today.' },
      { fr: 'Les jours allongent.', en: 'The days are getting longer.' },
      { fr: 'Quelle belle journée !', en: 'What a beautiful day!' },
    ],
  },
  'Été': {
    en: 'Summer',
    emoji: '☀️',
    gradient: 'from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20',
    months: 'Juin · Juillet · Août',
    phrase: { fr: 'En été, je vais toujours à la plage.', en: 'In summer, I always go to the beach.' },
    vocab: [
      { fr: 'la chaleur', en: 'heat' },
      { fr: 'la plage', en: 'beach' },
      { fr: 'le soleil', en: 'sun' },
      { fr: 'les vacances', en: 'holidays' },
      { fr: 'la canicule', en: 'heatwave' },
      { fr: 'la crème solaire', en: 'sun cream' },
      { fr: 'la glace', en: 'ice cream / ice' },
      { fr: 'le bain de soleil', en: 'sunbathing' },
      { fr: 'le barbeq (le barbecue)', en: 'barbecue' },
      { fr: 'estival(e)', en: 'summer-like (adjective)' },
    ],
    culture: 'August is when France practically shuts down — most Parisians leave the capital for les grandes vacances. The Fête Nationale (Bastille Day) on July 14th is the biggest summer celebration.',
    phrases: [
      { fr: 'Il fait une chaleur étouffante !', en: 'It\'s stifling hot!' },
      { fr: 'On va piquer une tête ?', en: 'Shall we take a dip?' },
      { fr: 'Je prends quinze jours en août.', en: 'I\'m taking two weeks off in August.' },
    ],
  },
  'Automne': {
    en: 'Autumn',
    emoji: '🍂',
    gradient: 'from-orange-100 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20',
    months: 'Septembre · Octobre · Novembre',
    phrase: { fr: 'J\'adore les couleurs de l\'automne.', en: 'I love the colours of autumn.' },
    vocab: [
      { fr: 'les feuilles mortes', en: 'dead leaves' },
      { fr: 'les châtaignes', en: 'chestnuts' },
      { fr: 'la vendange', en: 'grape harvest' },
      { fr: 'la rentrée', en: 'back to school / back to work (September)' },
      { fr: 'le brouillard', en: 'fog / mist' },
      { fr: 'les champignons', en: 'mushrooms' },
      { fr: 'la saison des pluies', en: 'rainy season' },
      { fr: 'automnal(e)', en: 'autumnal (adjective)' },
      { fr: 'rougir', en: 'to redden (of leaves)' },
      { fr: 'tomber', en: 'to fall (leaves)' },
    ],
    culture: 'La rentrée in September is one of France\'s most culturally important moments — schools, parliament, theatres, and the media all "return" simultaneously. It\'s also the season for la chasse (hunting) and mushroom picking.',
    phrases: [
      { fr: 'Les feuilles commencent à tomber.', en: 'The leaves are starting to fall.' },
      { fr: 'C\'est la rentrée — on est de retour !', en: 'It\'s back-to-school — we\'re back!' },
      { fr: 'On ramasse des champignons ce week-end ?', en: 'Shall we go mushroom picking this weekend?' },
    ],
  },
  'Hiver': {
    en: 'Winter',
    emoji: '❄️',
    gradient: 'from-blue-100 to-slate-100 dark:from-blue-900/20 dark:to-slate-900/20',
    months: 'Décembre · Janvier · Février',
    phrase: { fr: 'En hiver, je préfère rester au chaud.', en: 'In winter, I prefer to stay warm.' },
    vocab: [
      { fr: 'la neige', en: 'snow' },
      { fr: 'le verglas', en: 'black ice' },
      { fr: 'le gel', en: 'frost / freeze' },
      { fr: 'les gants', en: 'gloves' },
      { fr: 'l\'écharpe', en: 'scarf' },
      { fr: 'la bûche de Noël', en: 'Christmas Yule log (cake)' },
      { fr: 'le réveillon', en: 'Christmas Eve / New Year\'s Eve dinner' },
      { fr: 'hivernal(e)', en: 'wintry / winter (adjective)' },
      { fr: 'geler', en: 'to freeze' },
      { fr: 'les sports d\'hiver', en: 'winter sports / skiing' },
    ],
    culture: 'French Christmas traditions include the réveillon (a lavish midnight feast on Christmas Eve) and the bûche de Noël (a log-shaped cake). In February, La Chandeleur (Candlemas) celebrates with crêpes — there\'s a tradition of flipping the first one with a coin in your hand!',
    phrases: [
      { fr: 'Il gèle à pierre fendre !', en: 'It\'s freezing cold! (lit. it freezes hard enough to split stone)' },
      { fr: 'On part au ski en février.', en: 'We\'re going skiing in February.' },
      { fr: 'Joyeux Noël et bonne année !', en: 'Merry Christmas and Happy New Year!' },
    ],
  },
}

const LEVEL_COLORS = {
  'Printemps': 'border-pink-300 bg-pink-50 dark:bg-pink-900/20',
  'Été': 'border-amber-300 bg-amber-50 dark:bg-amber-900/20',
  'Automne': 'border-orange-300 bg-orange-50 dark:bg-orange-900/20',
  'Hiver': 'border-blue-300 bg-blue-50 dark:bg-blue-900/20',
}

export default function SeasonalVocabulary() {
  const [active, setActive] = useState('Printemps')
  const season = SEASONS[active]

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="Seasonal Vocabulary | SayBonjour!" description="Learn French vocabulary for all four seasons — with phrases, cultural notes, and pronunciation." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">Seasonal Vocabulary</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Les saisons — vocabulary for all four seasons of the year</p>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-8">
          {Object.keys(SEASONS).map(s => (
            <button key={s} onClick={() => { setActive(s); addXP(3, 'vocabulary') }}
              className={`py-4 rounded-2xl text-center border-2 transition-colors ${active === s ? LEVEL_COLORS[s] : 'bg-white dark:bg-dark-warm-100 border-gray-200 dark:border-dark-warm-50 hover:border-gray-300'}`}>
              <div className="text-3xl mb-1">{SEASONS[s].emoji}</div>
              <div className="font-bold text-sm text-gray-800 dark:text-cream-50">{s}</div>
              <div className="text-xs text-gray-400">{SEASONS[s].en}</div>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className={`rounded-2xl p-6 mb-6 bg-gradient-to-br ${season.gradient}`}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{season.emoji}</span>
                <div>
                  <h2 className="text-2xl font-bold font-playfair text-gray-900 dark:text-cream-50">{active} <span className="text-gray-500 text-lg font-normal">/ {season.en}</span></h2>
                  <p className="text-sm text-gray-500">{season.months}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <SpeakButton text={season.phrase.fr} size="sm" />
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-cream-50 italic">"{season.phrase.fr}"</p>
                  <p className="text-xs text-gray-500">{season.phrase.en}</p>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-5">
                <h3 className="font-semibold text-gray-800 dark:text-cream-50 mb-3 text-sm">Vocabulary</h3>
                <div className="space-y-2">
                  {season.vocab.map(v => (
                    <div key={v.fr} className="flex items-center gap-2">
                      <SpeakButton text={v.fr} size="sm" />
                      <span className="text-sm font-medium text-burgundy-700 dark:text-burgundy-vibrant-300">{v.fr}</span>
                      <span className="text-xs text-gray-400">— {v.en}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-5">
                  <h3 className="font-semibold text-gray-800 dark:text-cream-50 mb-3 text-sm">Useful phrases</h3>
                  <div className="space-y-3">
                    {season.phrases.map(p => (
                      <div key={p.fr} className="flex items-start gap-2">
                        <SpeakButton text={p.fr} size="sm" />
                        <div>
                          <p className="text-sm italic text-gray-700 dark:text-gray-300">{p.fr}</p>
                          <p className="text-xs text-gray-400">{p.en}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-2xl p-5">
                  <h3 className="font-semibold text-amber-700 dark:text-amber-400 mb-2 text-sm">Cultural note</h3>
                  <p className="text-sm text-amber-800 dark:text-amber-300">{season.culture}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
