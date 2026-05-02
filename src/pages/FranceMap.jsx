import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, X, MapPin, Utensils, Globe, Star, Map } from 'lucide-react'
import SEO from '../components/SEO'

/*
  Coordinate system  (viewBox "0 0 540 580")
  x = (lon + 4.5) * 40 + 20
  y = (51.5 - lat) * 58.9 + 10
  Key anchors:
    Brest      (-4.5°, 48.4°) → (20,  189)
    Dunkirk    ( 2.4°, 51.0°) → (295,  37)
    Strasbourg ( 7.7°, 48.6°) → (508, 181)
    Nice       ( 7.3°, 43.7°) → (492, 469)
    Perpignan  ( 2.9°, 42.7°) → (332, 540)  (clamped in viewBox)
    Hendaye    (-1.8°, 43.4°) → (129, 490)
*/

const FRANCE_OUTLINE =
  'M295,37 L324,63 L388,98 L436,92 L480,146 L508,181 ' +
  'L504,240 L460,275 L448,305 L476,346 L468,414 ' +
  'L500,460 L492,469 L436,505 L416,493 ' +
  'L340,492 L332,540 L240,523 ' +
  'L129,490 L143,473 L153,410 L154,323 ' +
  'L112,257 L64,234 L20,189 ' +
  'L48,181 L80,169 L120,181 ' +
  'L144,175 L184,140 L204,128 L244,104 L264,57 L276,40 Z'

const REGIONS = {
  'brittany': {
    name: 'Brittany',
    path: 'M20,189 L48,181 L80,169 L120,181 L132,210 L112,257 L64,234 Z',
    dot: [72, 215],
    color: '#5B21B6',
    capital: 'Rennes',
    dialect: 'Breton Influence',
    dialectInfo: 'Celtic language roots create a unique intonation and lilt not found elsewhere in France.',
    keyCity: 'Brest',
    cityInfo: 'Major naval port with a proud maritime heritage at the tip of the peninsula.',
    specialFood: 'Crêpes & Cider',
    foodInfo: 'Birthplace of the galette (buckwheat crêpe) and artisan cidre bouché.',
    funFact: 'Brittany has over 2,700 km of coastline — the longest of any French region.',
    pronunciation: 'bruh-TAHN-yuh',
  },
  'normandy': {
    name: 'Normandy',
    path: 'M120,181 L144,175 L184,140 L204,128 L220,155 L205,185 L168,195 L132,210 Z',
    dot: [170, 158],
    color: '#065F46',
    capital: 'Rouen',
    dialect: 'Norman French',
    dialectInfo: 'Softer consonants and distinct vowels shaped by centuries of Viking and Anglo-Norman contact.',
    keyCity: 'Caen',
    cityInfo: 'Historic city rebuilt after WWII; home to the Mémorial de Caen museum.',
    specialFood: 'Camembert & Calvados',
    foodInfo: 'World-famous creamy cheeses and apple brandy from the orchards of the Pays d\'Auge.',
    funFact: 'The D-Day landings of 6 June 1944 took place along 80 km of Normandy beaches.',
    pronunciation: 'nor-mahn-DEE',
  },
  'ile-de-france': {
    name: 'Île-de-France',
    path: 'M220,155 L252,130 L308,120 L328,150 L315,185 L272,195 L245,175 L205,185 Z',
    dot: [272, 155],
    color: '#9B1C1C',
    capital: 'Paris',
    dialect: 'Standard French',
    dialectInfo: 'The prestige accent taught in schools worldwide — clear, measured, and widely understood.',
    keyCity: 'Paris',
    cityInfo: 'The City of Light: political, cultural, and gastronomic heart of France.',
    specialFood: 'Croissants & Macarons',
    foodInfo: 'Home to world-famous pastries, haute cuisine, and Michelin-starred restaurants.',
    funFact: 'Paris has more dog owners per capita than any other city in France.',
    pronunciation: 'eel-duh-FRAHNSS',
  },
  'alsace': {
    name: 'Grand Est',
    path:
      'M308,120 L324,63 L388,98 L436,92 L480,146 L508,181 ' +
      'L504,240 L460,275 L420,240 L380,210 L345,185 L328,150 Z',
    dot: [492, 185],
    color: '#075985',
    capital: 'Strasbourg',
    dialect: 'Alsatian Accent',
    dialectInfo: 'Germanic cadence and vocabulary from centuries of cross-border culture along the Rhine.',
    keyCity: 'Colmar',
    cityInfo: 'A fairy-tale town of half-timbered houses and flower-lined canals.',
    specialFood: 'Choucroute & Kugelhopf',
    foodInfo: 'Sauerkraut braised with sausages and Riesling; sweet brioche-style Kugelhopf cake.',
    funFact: 'Alsace has changed nationality between France and Germany four times in 150 years.',
    pronunciation: 'ahl-ZAHSS',
  },
  'lyon': {
    name: 'Rhône-Alpes',
    path:
      'M315,185 L345,185 L380,210 L420,240 L460,275 ' +
      'L448,305 L476,346 L450,356 L415,346 ' +
      'L390,330 L358,325 L335,308 L316,278 Z',
    dot: [374, 332],
    color: '#9D174D',
    capital: 'Lyon',
    dialect: 'Lyonnais',
    dialectInfo: 'Rapid-fire speech with distinctive nasal tones; "vitre" and "voiture" sound quite different here.',
    keyCity: 'Lyon',
    cityInfo: 'The gastronomic capital of France, home to Paul Bocuse and hundreds of bouchons.',
    specialFood: 'Coq au Vin & Quenelles',
    foodInfo: 'Rich Lyonnaise bistro cuisine and delicate pike quenelles in Nantua sauce.',
    funFact: 'Lyon has more restaurants per capita than any other French city.',
    pronunciation: 'ree-ohn-AHLP',
  },
  'provence': {
    name: 'Provence',
    path:
      'M335,308 L358,325 L390,330 L415,346 L450,356 ' +
      'L476,346 L468,414 L500,460 L492,469 ' +
      'L436,505 L416,493 L370,478 L345,455 L335,400 L320,360 Z',
    dot: [418, 490],
    color: '#C05621',
    capital: 'Marseille',
    dialect: 'Provençal Accent',
    dialectInfo: 'Melodic, sun-warmed accent with Occitan substrate — final syllables are strongly voiced.',
    keyCity: 'Nice',
    cityInfo: 'The glamorous Côte d\'Azur capital with Italian architectural flair and the famous Promenade.',
    specialFood: 'Bouillabaisse & Ratatouille',
    foodInfo: 'Mediterranean seafood stew and the iconic vegetable ragout immortalised by Escoffier.',
    funFact: 'Provence produces around 40 % of all French lavender and lavender oil.',
    pronunciation: 'pro-VAHNSS',
  },
  'toulouse': {
    name: 'Occitanie',
    path:
      'M205,325 L245,308 L285,300 L316,278 L335,308 ' +
      'L320,360 L335,400 L345,455 L340,492 ' +
      'L240,523 L200,510 L200,420 Z',
    dot: [248, 455],
    color: '#6B21A8',
    capital: 'Toulouse',
    dialect: 'Occitan Influence',
    dialectInfo: 'A warm southern accent with nasal vowels and the famous "accent du Midi" rolling rs.',
    keyCity: 'Toulouse',
    cityInfo: 'The "Pink City" — so named for its terracotta brick buildings — and aerospace hub.',
    specialFood: 'Cassoulet & Saucisse',
    foodInfo: 'Slow-cooked white bean cassoulet with Toulouse sausage, duck confit, and pork rind.',
    funFact: 'Toulouse is headquarters to Airbus, making it Europe\'s aerospace capital.',
    pronunciation: 'ok-see-tah-NEE',
  },
  'bordeaux': {
    name: 'Nouvelle-Aquitaine',
    path:
      'M112,257 L200,248 L200,308 L205,325 L200,420 ' +
      'L200,510 L129,490 L143,473 L153,410 L154,323 Z',
    dot: [158, 392],
    color: '#7C2D12',
    capital: 'Bordeaux',
    dialect: 'Southwestern French',
    dialectInfo: 'Gascon-influenced with distinctive open vowels; "bien" sounds almost like "biang".',
    keyCity: 'Bordeaux',
    cityInfo: 'World wine capital; its 18th-century port quarter is a UNESCO World Heritage site.',
    specialFood: 'Foie Gras & Canelés',
    foodInfo: 'Silky duck foie gras and caramelised Bordeaux canelés with rum and vanilla.',
    funFact: 'The Bordeaux vineyard area produces around 960 million bottles of wine every year.',
    pronunciation: 'noo-vel-ah-kee-TEN',
  },
}

const CITIES = [
  { name: 'Paris',       x: 272, y: 155 },
  { name: 'Rennes',      x: 118, y: 206 },
  { name: 'Caen',        x: 182, y: 150 },
  { name: 'Strasbourg',  x: 496, y: 185 },
  { name: 'Lyon',        x: 374, y: 328 },
  { name: 'Marseille',   x: 416, y: 490 },
  { name: 'Nice',        x: 490, y: 462 },
  { name: 'Toulouse',    x: 248, y: 452 },
  { name: 'Bordeaux',    x: 158, y: 392 },
]

function speak(text) {
  if ('speechSynthesis' in window) {
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'fr-FR'
    u.rate = 0.8
    speechSynthesis.speak(u)
  }
}

export default function FranceMap() {
  const [selected, setSelected] = useState(null)
  const [hovered, setHovered]   = useState(null)

  const hov = hovered ? REGIONS[hovered] : null

  return (
    <>
      <SEO title="Map of France | SayBonjour" url="/france-map" />
      <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
        <div className="max-w-7xl mx-auto px-4 py-8">

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-burgundy-50 dark:bg-burgundy-900/20 text-burgundy-700 dark:text-burgundy-300 px-4 py-1.5 rounded-full text-sm font-medium mb-3 border border-burgundy-100 dark:border-burgundy-700/40">
              <Map className="w-4 h-4" />
              Exploration Géographique
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-cream-50 mb-2"
                style={{ fontFamily: 'Playfair Display, serif' }}>
              Interactive Map of France
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Click any region to explore its dialect, cuisine, and culture
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 items-start">

            {/* ── SVG Map ── */}
            <div className="flex-1 min-w-0 bg-white dark:bg-dark-warm-100 rounded-2xl shadow-lg overflow-hidden">
              <svg
                viewBox="0 0 540 580"
                className="w-full h-auto"
                style={{ display: 'block' }}
              >
                <defs>
                  {/* Sea gradient */}
                  <linearGradient id="sea" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%"   stopColor="#BAE6FD" />
                    <stop offset="100%" stopColor="#38BDF8" />
                  </linearGradient>
                  {/* Land base gradient */}
                  <linearGradient id="land" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%"   stopColor="#E8E4D4" />
                    <stop offset="100%" stopColor="#D6D0BC" />
                  </linearGradient>
                  {/* Drop shadow for the France shape */}
                  <filter id="mapShadow" x="-5%" y="-5%" width="115%" height="115%">
                    <feDropShadow dx="3" dy="4" stdDeviation="6" floodColor="#00000033" />
                  </filter>
                  {/* Clip to France outline */}
                  <clipPath id="franceClip">
                    <path d={FRANCE_OUTLINE} />
                  </clipPath>
                </defs>

                {/* Ocean background */}
                <rect width="540" height="580" fill="url(#sea)" />

                {/* Subtle wave texture lines */}
                {[60,120,180,240,300,360,420,480,540].map(y => (
                  <line key={y} x1="0" y1={y} x2="540" y2={y}
                        stroke="white" strokeWidth="0.4" strokeOpacity="0.25" />
                ))}

                {/* France landmass base */}
                <path d={FRANCE_OUTLINE} fill="url(#land)" filter="url(#mapShadow)" />

                {/* Colored regions — clipped to France */}
                <g clipPath="url(#franceClip)">
                  {Object.entries(REGIONS).map(([id, r]) => (
                    <path
                      key={id}
                      d={r.path}
                      fill={r.color}
                      fillOpacity={
                        selected?.id === id ? 1
                        : hovered === id    ? 0.92
                        : 0.78
                      }
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                      style={{ cursor: 'pointer', transition: 'fill-opacity .15s' }}
                      onMouseEnter={() => setHovered(id)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => setSelected(selected?.id === id ? null : { id, ...r })}
                    />
                  ))}
                </g>

                {/* France border outline (on top) */}
                <path
                  d={FRANCE_OUTLINE}
                  fill="none"
                  stroke="#6B7280"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />

                {/* City dots */}
                {CITIES.map(c => (
                  <g key={c.name}>
                    <circle cx={c.x} cy={c.y} r="3.5"
                      fill="white" stroke="#374151" strokeWidth="1.2" />
                  </g>
                ))}

                {/* City labels (always show Paris, show others only when not hovered) */}
                {CITIES.map(c => {
                  const isCapital = c.name === 'Paris'
                  const show = isCapital || !hov
                  if (!show) return null
                  return (
                    <text
                      key={`lbl-${c.name}`}
                      x={c.x + 5}
                      y={c.y - 5}
                      fontSize={isCapital ? '10' : '8'}
                      fontWeight={isCapital ? '700' : '500'}
                      fill={isCapital ? '#111827' : '#374151'}
                      style={{ pointerEvents: 'none', userSelect: 'none' }}
                    >
                      {c.name}
                    </text>
                  )
                })}

                {/* Hover tooltip bubble */}
                {hov && (() => {
                  const [dx, dy] = hov.dot
                  const flip = dy > 420
                  const ty   = flip ? dy - 42 : dy - 38
                  const name = hov.name
                  const w    = Math.max(name.length * 6.5 + 16, 80)
                  return (
                    <g style={{ pointerEvents: 'none' }}>
                      <rect
                        x={dx - w / 2} y={ty - 4}
                        width={w} height={22}
                        rx="5"
                        fill="rgba(17,24,39,.82)"
                      />
                      <text
                        x={dx} y={ty + 11}
                        textAnchor="middle"
                        fontSize="10.5"
                        fontWeight="bold"
                        fill="white"
                      >
                        {name}
                      </text>
                      {/* little arrow */}
                      <polygon
                        points={`${dx - 5},${ty + 18} ${dx + 5},${ty + 18} ${dx},${ty + 26}`}
                        fill="rgba(17,24,39,.82)"
                      />
                    </g>
                  )
                })()}

                {/* Sea labels */}
                <text x="265" y="22" textAnchor="middle" fontSize="9"
                      fill="#0369A1" fontStyle="italic" fontWeight="500"
                      style={{ pointerEvents: 'none' }}>
                  La Manche
                </text>
                <text x="40" y="310" textAnchor="middle" fontSize="9"
                      fill="#0369A1" fontStyle="italic" fontWeight="500"
                      transform="rotate(-90 40 310)"
                      style={{ pointerEvents: 'none' }}>
                  Atlantique
                </text>
                <text x="400" y="572" textAnchor="middle" fontSize="9"
                      fill="#0369A1" fontStyle="italic" fontWeight="500"
                      style={{ pointerEvents: 'none' }}>
                  Méditerranée
                </text>

                {/* Selected region highlight ring */}
                {selected && (
                  <path
                    d={selected.path}
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeDasharray="6 3"
                    clipPath="url(#franceClip)"
                    style={{ pointerEvents: 'none', opacity: 0.9 }}
                  />
                )}
              </svg>

              <p className="text-center text-xs text-gray-400 dark:text-gray-500 py-2">
                Click a coloured region to explore · {Object.keys(REGIONS).length} regions featured
              </p>
            </div>

            {/* ── Info Panel ── */}
            <div className="lg:w-80 shrink-0">
              <AnimatePresence mode="wait">
                {selected ? (
                  <motion.div
                    key={selected.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22 }}
                    className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow-lg overflow-hidden"
                  >
                    {/* Coloured header */}
                    <div className="px-5 pt-4 pb-4" style={{ backgroundColor: selected.color }}>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h2 className="text-lg font-bold text-white leading-tight">{selected.name}</h2>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-white/80 text-xs">{selected.capital}</span>
                            <button
                              onClick={() => speak(selected.name)}
                              className="text-white/70 hover:text-white transition-colors"
                              title="Hear pronunciation"
                            >
                              <Volume2 size={12} />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelected(null)}
                          className="text-white/70 hover:text-white mt-0.5 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      {/* Pronunciation badge */}
                      <div className="mt-3 inline-flex items-center gap-1.5 bg-white/20 rounded-lg px-2.5 py-1">
                        <span className="text-white/80 text-[10px] uppercase tracking-wide">Say it:</span>
                        <span className="text-white text-xs font-mono font-semibold">{selected.pronunciation}</span>
                        <button onClick={() => speak(selected.name)}>
                          <Volume2 size={11} className="text-white/80" />
                        </button>
                      </div>
                    </div>

                    {/* Detail cards */}
                    <div className="p-4 space-y-3">
                      {/* Dialect */}
                      <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-dark-warm-200 flex items-center justify-center shrink-0 mt-0.5">
                          <Globe size={13} className="text-gray-500 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Dialect</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-cream-50">{selected.dialect}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mt-0.5">{selected.dialectInfo}</p>
                        </div>
                      </div>

                      <hr className="border-gray-100 dark:border-gray-700" />

                      {/* Key City */}
                      <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-dark-warm-200 flex items-center justify-center shrink-0 mt-0.5">
                          <MapPin size={13} className="text-gray-500 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Key City</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-cream-50">{selected.keyCity}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mt-0.5">{selected.cityInfo}</p>
                        </div>
                      </div>

                      <hr className="border-gray-100 dark:border-gray-700" />

                      {/* Food */}
                      <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-dark-warm-200 flex items-center justify-center shrink-0 mt-0.5">
                          <Utensils size={13} className="text-gray-500 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Regional Food</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-cream-50">{selected.specialFood}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mt-0.5">{selected.foodInfo}</p>
                        </div>
                      </div>

                      {/* Fun fact */}
                      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 border border-amber-100 dark:border-amber-800/30 flex gap-2.5">
                        <Star size={14} className="text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">{selected.funFact}</p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow-lg p-4"
                  >
                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                      Featured Regions
                    </h3>
                    <div className="space-y-1">
                      {Object.entries(REGIONS).map(([id, r]) => (
                        <button
                          key={id}
                          onClick={() => setSelected({ id, ...r })}
                          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-warm-200 transition-colors text-left group"
                        >
                          <div className="w-3 h-3 rounded-full shrink-0 ring-2 ring-white dark:ring-dark-warm-100 shadow-sm"
                               style={{ backgroundColor: r.color }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-cream-50 truncate">{r.name}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">{r.capital}</p>
                          </div>
                          <span className="text-gray-300 dark:text-gray-600 group-hover:text-gray-400 text-xs">›</span>
                        </button>
                      ))}
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
                      <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                        <strong>Tip:</strong> Hover over the map to preview a region, then click to explore its dialect, food, and culture.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom info strip */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { emoji: '🗣️', title: 'Regional Accents', text: 'Each region has a distinct pronunciation shaped by local history and neighbouring languages.' },
              { emoji: '🍽️', title: 'Culinary Traditions', text: 'From Normandy\'s cream sauces to Provence\'s olive oil — French cuisine is radically regional.' },
              { emoji: '🏛️', title: 'Cultural Heritage', text: 'Celtic Brittany, Germanic Alsace, Occitan south — France\'s diversity is its greatest treasure.' },
            ].map(c => (
              <div key={c.title} className="bg-white dark:bg-dark-warm-100 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex gap-3">
                <span className="text-2xl leading-none">{c.emoji}</span>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-cream-50 mb-1">{c.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
