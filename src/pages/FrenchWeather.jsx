import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Cloud, Sun, Thermometer, Wind } from 'lucide-react'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const WEATHER_VOCAB = [
  {
    category: 'General Weather — Le temps',
    emoji: '🌦️',
    items: [
      { fr: 'la météo', en: 'weather forecast', emoji: '📺', note: '"La météo" = both "the weather forecast" and colloquially the weather itself. "La météo dit qu\'il va pleuvoir" = the forecast says it will rain.' },
      { fr: 'le temps', en: 'the weather', emoji: '☁️', note: '"Quel temps fait-il ?" = What is the weather like? "Le temps" = weather as a concept. Also = time (duration).' },
      { fr: 'il fait beau', en: 'the weather is lovely', emoji: '😊', note: '"Il fait beau" = the weather is nice/lovely. "Il fait grand beau" = the weather is glorious. "Par beau temps" = in fine weather.' },
      { fr: 'il fait mauvais', en: 'the weather is bad', emoji: '😞', note: '"Il fait un temps de chien" (lit: dog\'s weather) = the weather is awful. A very French expression.' },
      { fr: 'le soleil', en: 'the sun / sunshine', emoji: '☀️', note: '"Prendre le soleil" = to sunbathe. "Au soleil" = in the sun. "Un coup de soleil" = a sunburn.' },
      { fr: 'il fait soleil / il y a du soleil', en: 'it is sunny', emoji: '🌞', note: 'Both forms are correct. "Ensoleillé" = sunny (adjective used in forecasts).' },
      { fr: 'le nuage', en: 'a cloud', emoji: '☁️', note: '"Nuageux" = cloudy. "Un ciel nuageux" = a cloudy sky. "Sans nuages" = cloudless / without problems (figurative).' },
      { fr: 'nuageux / couvert', en: 'cloudy / overcast', emoji: '🌥️', note: '"Couvert" = fully overcast. "Partiellement nuageux" = partly cloudy. "Le ciel se couvre" = the sky is clouding over.' },
      { fr: 'la pluie', en: 'rain', emoji: '🌧️', note: '"La saison des pluies" = the rainy season. "La pluie torrentielle" = torrential rain. "Sous la pluie" = in the rain.' },
      { fr: 'il pleut', en: 'it is raining', emoji: '🌧️', note: '"Il pleut des cordes" = it\'s raining cats and dogs (lit: it\'s raining ropes). "Pleuvoir à verse" = to pour down.' },
      { fr: 'une averse', en: 'a shower (rain)', emoji: '🌦️', note: '"Des risques d\'averses" = risk of showers (common in French forecasts). "Une averse soudaine" = a sudden shower.' },
      { fr: 'la neige', en: 'snow', emoji: '❄️', note: '"La neige fraîche" = fresh snow. "La neige fondue" = slush. "Un bonhomme de neige" = a snowman.' },
      { fr: 'il neige', en: 'it is snowing', emoji: '🌨️', note: '"Il a neigé" = it snowed (past). "Il va neiger" = it\'s going to snow. "La chute de neige" = snowfall.' },
      { fr: 'le brouillard', en: 'fog', emoji: '🌫️', note: '"Il y a du brouillard" = it is foggy. "Un épais brouillard" = thick fog. "La brume" = mist/haze (lighter than fog).' },
      { fr: 'le vent', en: 'wind', emoji: '🌬️', note: '"Le vent souffle fort" = the wind is blowing hard. "Un vent violent" = a strong wind. "Le vent du nord" = the north wind.' },
      { fr: 'il y a du vent / il fait du vent', en: 'it is windy', emoji: '💨', note: '"Un temps venteux" = windy weather. "Le mistral" = the famous Provençal north wind that can blow for days.' },
      { fr: 'la tempête', en: 'a storm', emoji: '⛈️', note: '"Une tempête de neige" = a blizzard. "La tempête fait rage" = the storm is raging. "Passer la tempête" = to weather the storm.' },
      { fr: 'la grêle', en: 'hail', emoji: '🌨️', note: '"Il tombe de la grêle" = it is hailing. "Un grêlon" = a hailstone. Hail causes enormous damage to French vineyards every year.' },
      { fr: 'le verglas', en: 'black ice / freezing rain on roads', emoji: '🧊', note: '"Attention au verglas !" = beware of black ice. "Une route verglacée" = an icy road. Verglas is a major road hazard in France.' },
      { fr: 'un arc-en-ciel', en: 'a rainbow', emoji: '🌈', note: '"Un arc-en-ciel double" = a double rainbow. The word means "arch in the sky". "Après la pluie le beau temps" = after the rain comes sunshine.' },
      { fr: 'un orage', en: 'a thunderstorm', emoji: '⚡', note: '"Un orage violent" = a violent thunderstorm. "L\'orage éclate" = the storm breaks. "Orageux" = stormy.' },
      { fr: 'le tonnerre', en: 'thunder', emoji: '🔊', note: '"Le tonnerre gronde" = the thunder rumbles. "Du tonnerre !" = awesome! (informal slang — lit: thunderous!).' },
      { fr: 'un éclair', en: 'a flash of lightning', emoji: '⚡', note: '"La foudre" = lightning (as a force). "Un éclair" = a flash. "Être foudroyé(e)" = to be struck by lightning. Also: a type of pastry!' },
    ],
  },
  {
    category: 'Temperature — La température',
    emoji: '🌡️',
    items: [
      { fr: 'la température', en: 'temperature', emoji: '🌡️', note: '"La température maximale / minimale" = the high/low temperature. France uses Celsius exclusively.' },
      { fr: 'il fait chaud', en: 'it is hot', emoji: '🥵', note: '"Il fait une chaleur étouffante" = it\'s stifling. "Une chaleur torride" = scorching heat.' },
      { fr: 'il fait froid', en: 'it is cold', emoji: '🥶', note: '"Il fait un froid de canard" = it\'s bitterly cold (lit: duck cold — from the duck-hunting season in cold weather).' },
      { fr: 'il fait frais', en: 'it is cool / chilly', emoji: '😌', note: '"Frais" is a welcome temperature — not cold. "L\'air est frais" = the air is cool.' },
      { fr: 'il fait doux', en: 'it is mild', emoji: '🙂', note: '"Doux" = gentle/mild. "Une température douce pour la saison" = a mild temperature for the time of year.' },
      { fr: 'une canicule', en: 'a heatwave', emoji: '🔥', note: 'The 2003 canicule killed 15,000 people in France — a national trauma that transformed French heatwave preparedness. "Les caniculaires" = the hottest weeks of summer.' },
      { fr: 'le gel', en: 'frost', emoji: '❄️', note: '"Le gel nocturne" = overnight frost. "Les gelées printanières" = spring frosts — a constant fear for French winegrowers.' },
      { fr: 'geler / il gèle', en: 'to freeze / it is freezing', emoji: '🧊', note: '"Ça caille !" = It\'s freezing! (very informal). "Il gèle à pierre fendre" = it\'s freezing hard (lit: stone-splitting frost).' },
      { fr: 'le degré Celsius (°C)', en: 'degree Celsius', emoji: '°', note: 'France (and virtually all the world) uses Celsius, not Fahrenheit. 0°C = freezing. 20°C = pleasant. 35°C+ = heatwave.' },
      { fr: 'au-dessus / en dessous de zéro', en: 'above / below zero', emoji: '🌡️', note: '"Il fait deux degrés en dessous de zéro" = it\'s -2°C. "Les températures négatives" = sub-zero temperatures.' },
      { fr: 'humide', en: 'humid / damp', emoji: '💦', note: '"Un climat humide" = a humid climate. "La chaleur humide" = humid heat. "L\'humidité" = humidity/dampness.' },
      { fr: 'sec / sèche', en: 'dry', emoji: '☀️', note: '"Un air sec" = dry air. "Un climat sec" = a dry climate. "La sécheresse" = drought — increasingly frequent in France.' },
    ],
  },
  {
    category: 'Forecasting — Les prévisions',
    emoji: '📊',
    items: [
      { fr: 'les prévisions météo', en: 'the weather forecast', emoji: '📊', note: '"Les prévisions" = forecasts (plural). "Les prévisions à 5 jours" = the 5-day forecast.' },
      { fr: 'un bulletin météo', en: 'a weather bulletin / report', emoji: '📰', note: '"Le bulletin de Météo-France" — France\'s national weather service. Very reliable for local forecasts.' },
      { fr: 'des risques d\'averse', en: 'risk of showers', emoji: '🌦️', note: 'Standard forecast language. "Des risques d\'orages" = risk of thunderstorms. "Des risques de verglas" = risk of black ice.' },
      { fr: 'ensoleillé', en: 'sunny', emoji: '☀️', note: '"De belles éclaircies" = sunny spells. "Un temps ensoleillé" = sunny weather. From "le soleil".' },
      { fr: 'partiellement nuageux', en: 'partly cloudy', emoji: '🌤️', note: 'Standard French forecast language. "Peu nuageux" = slightly cloudy. "Très nuageux" = very cloudy.' },
      { fr: 'se couvrir', en: 'to cloud over / to become overcast', emoji: '🌥️', note: '"Le ciel va se couvrir en fin d\'après-midi" = the sky will cloud over in the late afternoon.' },
      { fr: 'se dégager', en: 'to clear up / to brighten', emoji: '🌞', note: '"Ça va se dégager dans l\'après-midi" = it will clear up in the afternoon.' },
      { fr: 'variable', en: 'changeable / unsettled', emoji: '🔄', note: '"Un temps variable" = changeable weather. Very common in French Atlantic climate forecasts.' },
      { fr: 'une perturbation', en: 'a weather front / disturbance', emoji: '⚠️', note: '"Une perturbation atlantique" = an Atlantic weather front. A common occurrence in western France.' },
      { fr: 'une vague de froid', en: 'a cold snap', emoji: '🥶', note: '"La vague de froid touche le nord de la France" = the cold snap is affecting northern France. "Une vague de chaleur" = a heat wave.' },
    ],
  },
]

const WEATHER_PHRASES = [
  { fr: 'Quel temps fait-il aujourd\'hui ?', en: 'What is the weather like today?', note: '"Quel temps fait-il" is THE standard French weather question. "Le temps" = the weather.' },
  { fr: 'Il fait un temps de chien !', en: 'The weather is awful! (lit. dog\'s weather)', note: 'A very French expression — "temps de chien" = awful weather. "C\'est un temps à ne pas mettre un chien dehors" = too awful to put a dog outside.' },
  { fr: 'Ça caille ! / Il caille dehors.', en: 'It\'s freezing! (very informal)', note: '"Caillar" = informal for "freezing". "J\'ai les doigts gelés" = my fingers are frozen.' },
  { fr: 'Il tombe des cordes !', en: 'It\'s raining cats and dogs! (lit. it\'s raining ropes)', note: 'Also: "Il pleut à verse" = it\'s pouring. "Il pleut à torrents" = it\'s raining in torrents.' },
  { fr: 'On annonce de la pluie et des orages pour demain.', en: 'They\'re forecasting rain and thunderstorms for tomorrow.', note: '"Annoncer" = to forecast/announce. "La météo annonce" = the weather forecast says.' },
  { fr: 'N\'oublie pas ton parapluie — le temps est incertain.', en: 'Don\'t forget your umbrella — the weather is uncertain.', note: '"Un parapluie" = an umbrella. "Un imperméable" = a raincoat. "Un ciré" = a waterproof jacket.' },
  { fr: 'Le ciel se couvre — ça va se gâter.', en: 'The sky is clouding over — it\'s going to get worse.', note: '"Se gâter" = to deteriorate (weather). "Le temps se gâte" = the weather is turning.' },
  { fr: 'Il fait gris et maussade.', en: 'It\'s grey and gloomy.', note: '"Maussade" = gloomy/dull. "Un temps maussade" = dreary weather. Very appropriate for November in northern France.' },
  { fr: 'Les températures vont chuter cette nuit.', en: 'Temperatures are going to drop tonight.', note: '"Chuter" = to drop/fall sharply. "Une chute des températures" = a temperature drop.' },
  { fr: 'Il va faire bon ce week-end.', en: 'The weather will be nice this weekend.', note: '"Il fait bon" = the temperature is pleasant. More specific than "il fait beau" — implies comfortable warmth.' },
  { fr: 'Après la pluie, le beau temps !', en: 'Every cloud has a silver lining! (lit. after the rain, fine weather)', note: 'A classic French proverb — optimism about bad periods ending.' },
  { fr: 'Le mistral souffle fort — il va faire froid.', en: 'The Mistral is blowing hard — it\'s going to be cold.', note: '"Le mistral" = the powerful cold north wind of Provence — can blow at 100km/h for days.' },
]

const CLIMATE_CULTURE = [
  { emoji: '🗺️', title: 'France\'s diverse climate zones', detail: 'France has four main climate types: Oceanic (Atlantic coast — mild, rainy, the most typical "French" weather), Continental (Paris basin, northeast — cold winters, hot summers), Mediterranean (south — hot dry summers, mild wet winters), and Mountain (Alps, Pyrenees — heavy snowfall, extreme cold). France gets snow in winter in the north but averages 300+ sunny days in Nice. Paris\'s weather resembles London\'s but slightly sunnier.' },
  { emoji: '🔥', title: 'La canicule 2003 — a national trauma', detail: 'The August 2003 heatwave was the worst natural disaster in French peacetime history. Temperatures reached 40°C across France. Approximately 15,000 people died, mostly elderly people living alone. French society was profoundly shaken. Since then, France has developed an extensive canicule response system — cooling centres, neighbourhood checks on elderly residents, and mandatory heat action plans for cities.' },
  { emoji: '🌧️', title: 'The mistral and other regional winds', detail: 'France has famous named winds. "Le mistral" = the cold, powerful north wind of the Rhône valley and Provence (can reach 100km/h+). "La tramontane" = similar wind in Languedoc-Roussillon. "Le sirocco" (also called le sirocco) brings warm sand from North Africa to the south. "La bise" = a cold, dry north wind in the Alps and Jura. These winds profoundly shaped French architecture, agriculture, and culture.' },
  { emoji: '🌡️', title: 'Climate change in France', detail: 'France has warmed by 1.7°C since pre-industrial times — faster than the global average. Summers are longer and hotter; winters shorter. Southern France faces Mediterranean-style droughts and fires. Alpine glaciers are retreating dramatically. French wine regions are shifting northward as southern grapes ripen too early. The Rhine, Loire, and Rhône face lower summer water levels. France has committed to carbon neutrality by 2050.' },
]

export default function FrenchWeather() {
  const [tab, setTab] = useState('vocab')
  const [activeCat, setActiveCat] = useState(0)

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French Weather Vocabulary | SayBonjour!" description="French weather vocabulary — il pleut, la canicule, le mistral — with phrases and French climate culture." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">French Weather</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">La météo — talk about the weather like a local, across all of France's climates</p>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          {[
            { id: 'vocab', label: 'Vocabulary' },
            { id: 'phrases', label: 'Phrases' },
            { id: 'culture', label: 'Climate & Culture' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${tab === t.id ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'vocab' && (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
              {WEATHER_VOCAB.map((cat, i) => (
                <button key={cat.category} onClick={() => { setActiveCat(i); addXP(3, 'vocabulary') }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeCat === i ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
                  {cat.emoji} {cat.category.split('—')[0].trim()}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {WEATHER_VOCAB[activeCat].items.map((item, i) => (
                <motion.div key={item.fr} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="bg-white dark:bg-dark-warm-100 rounded-xl shadow border border-gray-100 dark:border-dark-warm-50 px-4 py-3 flex items-start gap-3"
                  onClick={() => addXP(2, 'vocabulary')}>
                  <span className="text-xl w-7 text-center shrink-0">{item.emoji}</span>
                  <SpeakButton text={item.fr} size="sm" />
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-burgundy-700 dark:text-burgundy-vibrant-300">{item.fr}</p>
                    <p className="text-xs text-gray-400">{item.en}</p>
                    {item.note && <p className="text-xs text-amber-600 dark:text-amber-400 italic mt-0.5">💡 {item.note}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {tab === 'phrases' && (
          <div className="space-y-3">
            {WEATHER_PHRASES.map((phrase, i) => (
              <motion.div key={phrase.fr} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="bg-white dark:bg-dark-warm-100 rounded-xl shadow border border-gray-100 dark:border-dark-warm-50 p-4 flex items-start gap-3"
                onClick={() => addXP(2, 'vocabulary')}>
                <SpeakButton text={phrase.fr} size="sm" />
                <div>
                  <p className="font-medium text-sm italic text-gray-800 dark:text-cream-50">"{phrase.fr}"</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{phrase.en}</p>
                  {phrase.note && <p className="text-xs text-amber-600 dark:text-amber-400 italic mt-0.5">💡 {phrase.note}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'culture' && (
          <div className="space-y-4">
            {CLIMATE_CULTURE.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-5 flex items-start gap-4"
                onClick={() => addXP(4, 'vocabulary')}>
                <span className="text-3xl shrink-0">{item.emoji}</span>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-cream-50 font-playfair mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
