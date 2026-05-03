import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Sun, Cloud, CloudRain, Wind } from 'lucide-react'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const WEATHER_VOCAB = [
  { fr: 'Il fait beau.', en: 'The weather is nice.', emoji: '☀️' },
  { fr: 'Il fait mauvais.', en: 'The weather is bad.', emoji: '🌧️' },
  { fr: 'Il fait chaud.', en: 'It\'s hot.', emoji: '🌡️' },
  { fr: 'Il fait froid.', en: 'It\'s cold.', emoji: '🥶' },
  { fr: 'Il fait doux.', en: 'It\'s mild.', emoji: '😌' },
  { fr: 'Il pleut.', en: 'It\'s raining.', emoji: '🌧️' },
  { fr: 'Il neige.', en: 'It\'s snowing.', emoji: '❄️' },
  { fr: 'Il y a du vent.', en: 'It\'s windy.', emoji: '💨' },
  { fr: 'Il y a du soleil.', en: 'It\'s sunny.', emoji: '🌤️' },
  { fr: 'Il y a des nuages.', en: 'It\'s cloudy.', emoji: '☁️' },
  { fr: 'Il y a du brouillard.', en: 'It\'s foggy.', emoji: '🌫️' },
  { fr: 'Il y a de l\'orage.', en: 'There\'s a storm.', emoji: '⛈️' },
  { fr: 'Il gèle.', en: 'It\'s freezing.', emoji: '🧊' },
  { fr: 'Il grêle.', en: 'It\'s hailing.', emoji: '🌨️' },
  { fr: 'Le temps est couvert.', en: 'It\'s overcast.', emoji: '🌥️' },
  { fr: 'Il y a une éclaircie.', en: 'There\'s a sunny spell.', emoji: '⛅' },
]

const WEATHER_PHRASES = [
  { fr: 'Quel temps fait-il aujourd\'hui ?', en: 'What\'s the weather like today?' },
  { fr: 'Quel temps fera-t-il demain ?', en: 'What will the weather be like tomorrow?' },
  { fr: 'La météo annonce de la pluie.', en: 'The forecast says rain.' },
  { fr: 'Il va pleuvoir cet après-midi.', en: 'It\'s going to rain this afternoon.' },
  { fr: 'Prends un parapluie, juste au cas.', en: 'Take an umbrella, just in case.' },
  { fr: 'On n\'a pas de chance avec la météo.', en: 'We\'re unlucky with the weather.' },
  { fr: 'C\'est un temps de saison.', en: 'The weather is typical for the season.' },
  { fr: 'Comme disent les Bretons : il n\'y a pas de mauvais temps, juste de mauvais vêtements.', en: 'As the Bretons say: there\'s no bad weather, just bad clothing.' },
]

const TEMPERATURE = [
  { celsius: '-10°C', desc: 'Il gèle (it\'s freezing)', style: 'text-blue-600' },
  { celsius: '0°C', desc: 'Le point de congélation (freezing point)', style: 'text-blue-500' },
  { celsius: '10°C', desc: 'Il fait frais (it\'s cool)', style: 'text-teal-600' },
  { celsius: '15°C', desc: 'Il fait doux (it\'s mild)', style: 'text-green-600' },
  { celsius: '25°C', desc: 'Il fait chaud (it\'s warm/hot)', style: 'text-orange-500' },
  { celsius: '35°C+', desc: 'Il fait une chaleur écrasante (it\'s sweltering)', style: 'text-red-600' },
]

const SEASONS_WEATHER = [
  { season: 'Le printemps', emoji: '🌸', typical: 'Mild, showery, increasingly warm. April and May are beautiful. "En avril, ne te découvre pas d\'un fil" (in April, don\'t take off a thread of clothing).' },
  { season: 'L\'été', emoji: '☀️', typical: 'Hot and sunny, especially south. Northern France can be cool. August heat waves (canicules) are becoming more common. Avoid driving on August 1st — "le grand chassé-croisé".' },
  { season: 'L\'automne', emoji: '🍂', typical: 'Cool, rainy, often beautiful. La Toussaint (Nov 1) and la rentrée (Sept) define the season culturally.' },
  { season: 'L\'hiver', emoji: '❄️', typical: 'Cold and grey in the north. Snowy in the Alps, Pyrenees, Vosges, and Massif Central. Paris rarely sees heavy snow. Southern France can be mild.' },
]

export default function FrenchWeather2() {
  const [tab, setTab] = useState('vocab')

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French Weather Vocabulary | SayBonjour!" description="Complete French weather vocabulary — conditions, phrases, temperature, and seasonal weather in France." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">Weather in French</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">La météo — weather vocabulary, phrases, temperatures, and seasons</p>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          {[{ id: 'vocab', label: 'Weather Conditions' }, { id: 'phrases', label: 'Weather Phrases' }, { id: 'temp', label: 'Temperature' }, { id: 'seasons', label: 'Seasons' }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${tab === t.id ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'vocab' && (
          <div className="grid sm:grid-cols-2 gap-3">
            {WEATHER_VOCAB.map((item, i) => (
              <motion.div key={item.fr} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="bg-white dark:bg-dark-warm-100 rounded-xl shadow border border-gray-100 dark:border-dark-warm-50 p-3 flex items-center gap-2 cursor-pointer"
                onClick={() => addXP(2, 'vocabulary')}>
                <span className="text-xl shrink-0">{item.emoji}</span>
                <SpeakButton text={item.fr} size="sm" />
                <div>
                  <p className="font-medium text-sm text-burgundy-700 dark:text-burgundy-vibrant-300">{item.fr}</p>
                  <p className="text-xs text-gray-400">{item.en}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'phrases' && (
          <div className="space-y-3">
            {WEATHER_PHRASES.map((p, i) => (
              <motion.div key={p.fr} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="bg-white dark:bg-dark-warm-100 rounded-xl shadow border border-gray-100 dark:border-dark-warm-50 p-4 flex items-start gap-3">
                <SpeakButton text={p.fr} size="sm" />
                <div>
                  <p className="font-medium text-sm italic text-gray-800 dark:text-cream-50">"{p.fr}"</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{p.en}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'temp' && (
          <div className="space-y-3">
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 text-sm text-amber-800 dark:text-amber-300 mb-2">
              💡 France uses Celsius. To convert: °C × 9/5 + 32 = °F. 20°C = 68°F = a pleasant day.
            </div>
            {TEMPERATURE.map((t, i) => (
              <motion.div key={t.celsius} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white dark:bg-dark-warm-100 rounded-xl shadow border border-gray-100 dark:border-dark-warm-50 px-4 py-3 flex items-center gap-4">
                <span className={`font-mono font-bold text-lg w-14 ${t.style}`}>{t.celsius}</span>
                <div className="flex items-center gap-2">
                  <SpeakButton text={t.desc.split('(')[0].trim()} size="sm" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'seasons' && (
          <div className="space-y-4">
            {SEASONS_WEATHER.map((s, i) => (
              <motion.div key={s.season} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-5 flex items-start gap-4">
                <span className="text-3xl shrink-0">{s.emoji}</span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <SpeakButton text={s.season} size="sm" />
                    <h3 className="font-bold text-gray-900 dark:text-cream-50 font-playfair">{s.season}</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{s.typical}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
