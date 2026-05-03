import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const REGIONS = [
  {
    name: 'Île-de-France',
    capital: 'Paris',
    emoji: '🗼',
    desc: 'The most populous region, centred on Paris. Home to Versailles, the Louvre, and the Eiffel Tower. The engine of French politics, culture, business, and media — and deeply resented for it by the rest of France.',
    known: ['Paris', 'Versailles', 'Fontainebleau', 'Disneyland Paris', 'Chartres'],
    food: ['Croissants (au beurre)', 'Baguettes', 'Macarons', 'Crème brûlée', 'Mille-feuille'],
    vocab: [
      { fr: 'la capitale', en: 'the capital', note: 'Paris is the political, economic, and cultural capital — an unusually centralised country.' },
      { fr: 'le Parisien / la Parisienne', en: 'a person from Paris', note: '"Les Parisiens" are stereotyped as cold and hurried — often unfair, but the gap between Paris and "la province" is real.' },
      { fr: 'les arrondissements', en: 'the districts (Paris has 20)', note: 'Paris is divided into 20 numbered arrondissements in a clockwise snail-shell spiral from the centre.' },
      { fr: 'la banlieue', en: 'the suburbs', note: '"La banlieue" = the suburbs (often the outer ring). "Les banlieues" has social/political connotations — often refers to deprived outer suburbs.' },
    ],
  },
  {
    name: 'Bretagne (Brittany)',
    capital: 'Rennes',
    emoji: '🏴',
    desc: 'Celtic heritage, rugged coastlines, and a fiercely independent identity. Brittany has its own language (Breton), Celtic traditions, and some of the best seafood in France. Its storms are legendary.',
    known: ['Mont Saint-Michel (border)', 'Saint-Malo', 'Carnac megaliths', 'Côte de Granit Rose', 'Brest'],
    food: ['Galettes (buckwheat crêpes)', 'Crêpes sucrées', 'Fruits de mer', 'Far breton', 'Cidre', 'Kouign-amann'],
    vocab: [
      { fr: 'le menhir', en: 'standing stone / menhir', note: 'A Celtic word used in French — and in Astérix & Obélix! Carnac has 3,000+ prehistoric standing stones.' },
      { fr: 'la galette de sarrasin', en: 'buckwheat crêpe (savoury)', note: 'Made with buckwheat flour (sarrasin). "Complète" = ham, egg, and cheese. Distinct from sweet crêpes.' },
      { fr: 'le cidre', en: 'cider', note: 'The drink of Brittany — not wine. Served in ceramic bowls ("bolées"). "Brut" = dry; "doux" = sweet.' },
      { fr: 'le breton', en: 'the Breton language', note: 'A Celtic language related to Welsh and Cornish — still spoken by 200,000 people. "Kenavo" = goodbye in Breton.' },
    ],
  },
  {
    name: 'Provence-Alpes-Côte d\'Azur',
    capital: 'Marseille',
    emoji: '🌻',
    desc: 'Sun, lavender fields, and the Mediterranean. From Marseille to Nice to the Alps — this region encapsulates a Mediterranean France of vivid colour, outdoor markets, and powerful cuisine.',
    known: ['Marseille', 'Nice', 'Cannes', 'Aix-en-Provence', 'Gorges du Verdon', 'Antibes'],
    food: ['Bouillabaisse', 'Ratatouille', 'Socca (Nice)', 'Pastis', 'Tapenade', 'Daube provençale'],
    vocab: [
      { fr: 'la lavande', en: 'lavender', note: 'The Luberon lavender fields bloom in June–July — a pilgrimage for photographers. The colour "lavande" is an iconic Provençal shade.' },
      { fr: 'le mistral', en: 'the mistral (strong north wind)', note: 'Cold, powerful, persistent — can blow at 90km/h+ for days. Shapes Provence\'s architecture, agriculture, and character.' },
      { fr: 'la bouillabaisse', en: 'Marseille fish stew', note: 'A strictly traditional recipe — must include rascasse, served in two parts (broth, then fish). Marseillais are ferocious guardians of authenticity.' },
      { fr: 'la pastèque / le pastis', en: 'watermelon / anise aperitif', note: '"Un pastis" is the drink of Provence — anise spirit diluted with water (turns cloudy). Essential in a sun-drenched café.' },
    ],
  },
  {
    name: 'Normandie (Normandy)',
    capital: 'Caen',
    emoji: '🏰',
    desc: 'D-Day beaches, Impressionist painters, Monet\'s garden at Giverny, extraordinary dairy produce, and the magical Mont Saint-Michel. Just 2 hours from Paris — a world apart.',
    known: ['D-Day beaches', 'Mont Saint-Michel', 'Étretat cliffs', 'Giverny (Monet\'s garden)', 'Rouen'],
    food: ['Camembert', 'Calvados (apple brandy)', 'Teurgoule', 'Sole normande', 'Crème fraîche', 'Livarot'],
    vocab: [
      { fr: 'le débarquement', en: 'the landing (D-Day)', note: 'June 6, 1944 — "le Jour J" (D-Day in French). The beaches: Utah, Omaha, Gold, Juno, Sword. A profound pilgrimage site for many.' },
      { fr: 'le calvados', en: 'calvados (apple brandy)', note: 'Named after the Calvados department — an apple spirit aged in oak barrels. "Un calva" = informal. 14 years minimum for XO grade.' },
      { fr: 'le trou normand', en: 'Norman hole (calvados mid-meal)', note: 'Traditional practice: a small glass of calvados between courses to "make room" — and stimulate digestion (or so the story goes).' },
      { fr: 'les falaises d\'Étretat', en: 'the Étretat cliffs', note: 'Dramatic chalk sea arches — Monet painted them 45 times. Arsène Lupin, the gentleman thief, is set there.' },
    ],
  },
  {
    name: 'Alsace',
    capital: 'Strasbourg',
    emoji: '🥨',
    desc: 'A fascinating bicultural borderland — alternating between France and Germany for centuries. Strasbourg hosts the European Parliament. Known for its fairy-tale villages, Route des Vins, and Germany-adjacent cuisine.',
    known: ['Strasbourg', 'Colmar', 'Route des Vins d\'Alsace', 'Haut-Kœnigsbourg castle'],
    food: ['Choucroute garnie', 'Flammekueche (Tarte flambée)', 'Baeckeoffe', 'Munster cheese', 'Riesling', 'Gewurztraminer'],
    vocab: [
      { fr: 'la choucroute', en: 'sauerkraut dish', note: 'Fermented cabbage with various pork cuts, sausages, and potatoes. The iconic dish — served in enormous quantities at brasseries.' },
      { fr: 'le marché de Noël', en: 'Christmas market', note: 'Strasbourg\'s "Christkindelsmarik" is one of the oldest in the world (since 1570). The city becomes a fairytale in December.' },
      { fr: 'l\'Alsacien', en: 'the Alsatian dialect', note: 'A Germanic dialect still spoken by some locals — closer to Alemannic German than to standard Hochdeutsch.' },
      { fr: 'le Parlement européen', en: 'the European Parliament', note: 'Strasbourg is the official seat of the European Parliament — shared with Brussels. A symbol of European reconciliation.' },
    ],
  },
  {
    name: 'Occitanie',
    capital: 'Toulouse',
    emoji: '🌹',
    desc: 'The sunny south-west, stretching from the Pyrénées to Montpellier. Once the heartland of the Cathar religion and troubadour poetry. Now France\'s fastest-growing region and aerospace capital.',
    known: ['Toulouse', 'Carcassonne', 'Montpellier', 'Pyrénées', 'Canal du Midi', 'Lourdes'],
    food: ['Cassoulet', 'Foie gras', 'Saucisse de Toulouse', 'Roquefort', 'Armagnac', 'Crêpe à la périgourdine'],
    vocab: [
      { fr: 'le cassoulet', en: 'bean and meat casserole', note: '"Disputed" between Toulouse, Carcassonne, and Castelnaudary — each claims the "real" version. All are slow-cooked with white beans and confit.' },
      { fr: 'la ville rose', en: 'the pink city (Toulouse)', note: 'Toulouse\'s distinctive pink terracotta brick gives it a warm glow at sunset. Entirely different from Paris\'s limestone grey.' },
      { fr: 'l\'occitan', en: 'the Occitan language', note: 'A Romance language ("langue d\'Oc") widespread in southern France in the Middle Ages. Still taught in some schools and signposted bilingually.' },
      { fr: 'Airbus', en: 'Airbus (aerospace giant)', note: 'Toulouse is headquarters to Airbus — France\'s biggest employer. "La ville rose" is also a global aerospace hub.' },
    ],
  },
  {
    name: 'Nouvelle-Aquitaine',
    capital: 'Bordeaux',
    emoji: '🍷',
    desc: 'France\'s largest region — from the Dordogne valleys to the Atlantic coast, the Basque Country, and some of the world\'s most celebrated wine châteaux. A vast, sun-drenched patchwork of cultures.',
    known: ['Bordeaux', 'Biarritz', 'Périgueux (foie gras country)', 'Dune du Pilat', 'Lascaux caves'],
    food: ['Bordeaux wine (Médoc, Saint-Émilion)', 'Canelé', 'Foie gras périgourdin', 'Bayonne ham', 'Basque pintxos', 'Oysters from Arcachon'],
    vocab: [
      { fr: 'un château viticole', en: 'a wine-producing estate', note: '"Château Pétrus", "Château Margaux", "Château Cheval Blanc" — some of the world\'s most expensive wines come from the Bordeaux châteaux.' },
      { fr: 'le canelé', en: 'a Bordeaux caramelised pastry', note: 'A small fluted pastry — caramelised outside, soft and custardy inside. The pride of Bordeaux\'s bakeries. Pronounced "canelay".' },
      { fr: 'le Pays Basque', en: 'the Basque Country', note: 'Biarritz, Bayonne, Saint-Jean-de-Luz. The Basques have their own ancient language (Basque/Euskara), cuisine, and identity.' },
      { fr: 'les Landes', en: 'the Landes forest region', note: 'The largest forest in Western Europe — 1 million hectares of pines. Also: "les Landes" = flat sandy plains. Famous for stilt-walkers (tradition).' },
    ],
  },
  {
    name: 'Auvergne-Rhône-Alpes',
    capital: 'Lyon',
    emoji: '⛷️',
    desc: 'From Lyon — the gastronomic capital of France — to Chamonix and the highest peak in the Alps (Mont Blanc, 4,808m). A region of extraordinary contrasts: urban sophistication and wild Alpine grandeur.',
    known: ['Lyon', 'Chamonix', 'Mont Blanc', 'Grenoble', 'Annecy (most beautiful lake in Europe)', 'Vercors plateau'],
    food: ['Quenelles lyonnaises', 'Salade lyonnaise', 'Gratin dauphinois', 'Tartiflette', 'Fondue savoyarde', 'Reblochon', 'Côtes du Rhône wine'],
    vocab: [
      { fr: 'le bouchon lyonnais', en: 'a traditional Lyon bistro', note: 'A "bouchon" = a small family-run bistro serving Lyonnais classics. Lyon has the densest concentration of restaurants in France.' },
      { fr: 'Mont Blanc', en: 'Mont Blanc (highest peak in Western Europe)', note: '4,808m — the roof of the Alps. The border between France and Italy runs along it. The "Mont Blanc" dessert (chestnut cream) is named after it.' },
      { fr: 'les Mères Lyonnaises', en: 'the Lyon Mothers (female chefs)', note: 'The legendary 19th-century women chefs who invented Lyonnais cuisine. Mère Brazier trained Paul Bocuse — one of the greatest chefs in history.' },
      { fr: 'la raclette', en: 'raclette (melted cheese dish)', note: 'A Savoyard tradition: a half-wheel of raclette cheese melted and scraped onto potatoes. Quintessential winter dish in the Alps.' },
    ],
  },
]

export default function FrenchRegionalFrance() {
  const [activeRegion, setActiveRegion] = useState(0)

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French Regions | SayBonjour!" description="Explore France's regions — Paris, Brittany, Provence, Normandy, Alsace, Occitanie, Bordeaux, Lyon and the Alps — culture, food, and vocabulary." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">France's Regions</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Les régions de France — 8 regions, their culture, food, and regional vocabulary</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {REGIONS.map((r, i) => (
            <button key={r.name} onClick={() => { setActiveRegion(i); addXP(3, 'vocabulary') }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${activeRegion === i ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
              {r.emoji} {r.name}
            </button>
          ))}
        </div>

        <motion.div key={activeRegion} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{REGIONS[activeRegion].emoji}</span>
            <div>
              <h2 className="font-bold text-xl font-playfair text-gray-900 dark:text-cream-50">{REGIONS[activeRegion].name}</h2>
              <p className="text-xs text-gray-400">Capital: <span className="font-medium text-gray-500 dark:text-gray-400">{REGIONS[activeRegion].capital}</span></p>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 leading-relaxed">{REGIONS[activeRegion].desc}</p>

          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">🗺️ Known for</p>
              <div className="flex flex-wrap gap-1.5">
                {REGIONS[activeRegion].known.map(k => (
                  <span key={k} className="text-xs bg-cream-100 dark:bg-dark-warm-200 px-2 py-0.5 rounded-full text-gray-600 dark:text-gray-300">{k}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">🍽️ Regional food & drink</p>
              <div className="flex flex-wrap gap-1.5">
                {REGIONS[activeRegion].food.map(f => (
                  <span key={f} className="text-xs bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full">{f}</span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">📖 Regional vocabulary</p>
            <div className="space-y-2">
              {REGIONS[activeRegion].vocab.map(v => (
                <div key={v.fr} className="flex items-start gap-3 bg-cream-50 dark:bg-dark-warm-200 rounded-xl px-3 py-2" onClick={() => addXP(2, 'vocabulary')}>
                  <SpeakButton text={v.fr} size="sm" />
                  <div>
                    <span className="font-medium text-sm text-burgundy-700 dark:text-burgundy-vibrant-300">{v.fr}</span>
                    <span className="text-xs text-gray-400 ml-2">— {v.en}</span>
                    {v.note && <p className="text-xs text-amber-600 dark:text-amber-400 italic mt-0.5">💡 {v.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="flex gap-2 mt-4">
          <button onClick={() => setActiveRegion(i => Math.max(0, i - 1))} disabled={activeRegion === 0}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-dark-warm-50 text-sm font-medium text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-dark-warm-200 transition-colors">
            ← Previous
          </button>
          <button onClick={() => setActiveRegion(i => Math.min(REGIONS.length - 1, i + 1))} disabled={activeRegion === REGIONS.length - 1}
            className="flex-1 py-2.5 rounded-xl bg-burgundy-600 text-white text-sm font-medium disabled:opacity-40 hover:bg-burgundy-700 transition-colors">
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}
