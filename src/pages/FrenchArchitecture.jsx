import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const BUILDINGS = [
  {
    name: 'La Tour Eiffel',
    en: 'The Eiffel Tower',
    city: 'Paris',
    built: 1889,
    architect: 'Gustave Eiffel',
    style: 'Fer forgé / Art industriel',
    emoji: '🗼',
    description: 'Built as a temporary exhibit for the 1889 World\'s Fair, it was initially criticised as an "eyesore" by 300 artists and writers. Now the world\'s most visited paid monument — 7 million visitors a year. Stands 330m tall. It sparkles for 5 minutes every hour at night with 20,000 light bulbs installed in 2000.',
    vocab: [
      { fr: 'la tour', en: 'the tower' },
      { fr: 'le fer forgé', en: 'wrought iron' },
      { fr: 'l\'exposition universelle', en: 'the World\'s Fair / Universal Exhibition' },
      { fr: 'le sommet', en: 'the summit / top' },
      { fr: 'les rivets', en: 'rivets (the iron fasteners)' },
    ],
    phrase: { fr: 'La Tour Eiffel brille de mille feux chaque soir.', en: 'The Eiffel Tower sparkles with a thousand lights every evening.' },
    culturalNote: 'Gustave Eiffel defended the tower from critics as "an engineering poem". Originally rented for 20 years, it was saved from demolition because it doubled as a radio antenna — a crucial communications tool in WWI.',
  },
  {
    name: 'Notre-Dame de Paris',
    en: 'Notre-Dame Cathedral',
    city: 'Paris',
    built: '1163–1345',
    architect: 'Jean de Chelles (among others)',
    style: 'Gothique',
    emoji: '⛪',
    description: 'A masterpiece of French Gothic architecture — 850 years of history. Devastated by fire in April 2019 (the spire collapsed on live TV, watched by millions). Completely restored and reopened on 7 December 2024 — one of history\'s greatest restoration efforts. Victor Hugo\'s novel (1831) saved it from earlier demolition.',
    vocab: [
      { fr: 'le gothique', en: 'Gothic (style)' },
      { fr: 'les gargouilles', en: 'gargoyles' },
      { fr: 'le vitrail', en: 'stained glass window' },
      { fr: 'les arcs-boutants', en: 'flying buttresses' },
      { fr: 'la flèche', en: 'the spire' },
    ],
    phrase: { fr: 'Notre-Dame a rouvert ses portes en décembre 2024 après cinq ans de restauration.', en: 'Notre-Dame reopened its doors in December 2024 after five years of restoration.' },
    culturalNote: 'The 2019 fire shocked the world. €700 million was raised in donations within 48 hours. Over 150 artisans — charpentiers, tailleurs de pierre, vitraillistes — worked for 5 years to restore it.',
  },
  {
    name: 'Le Château de Versailles',
    en: 'Palace of Versailles',
    city: 'Versailles (Île-de-France)',
    built: '1661–1710',
    architect: 'Louis Le Vau, Jules Hardouin-Mansart',
    style: 'Baroque / Classicisme français',
    emoji: '🏰',
    description: 'Louis XIV\'s enormous palace — the ultimate statement of absolute royal power. The Hall of Mirrors (La Galerie des Glaces) has 357 mirrors reflecting 17 windows overlooking the gardens. Home to 20,000 people including the entire French court. The gardens by Le Nôtre cover 800 hectares.',
    vocab: [
      { fr: 'le château', en: 'castle / palace' },
      { fr: 'le baroque', en: 'Baroque (style)' },
      { fr: 'les jardins à la française', en: 'formal French gardens' },
      { fr: 'la galerie', en: 'the gallery / hall' },
      { fr: 'le classicisme', en: 'Classicism (style)' },
    ],
    phrase: { fr: 'La Galerie des Glaces est le symbole du pouvoir royal de Louis XIV.', en: 'The Hall of Mirrors is the symbol of Louis XIV\'s royal power.' },
    culturalNote: 'Versailles was built to keep the nobility busy and away from political plotting. Louis XIV required all noblemen to attend court — where elaborate etiquette kept them occupied for years. The Treaty of Versailles ending WWI was signed in the Hall of Mirrors in 1919.',
  },
  {
    name: 'Le Louvre',
    en: 'The Louvre',
    city: 'Paris',
    built: '1190 (fortress) / 1793 (museum)',
    architect: 'Pierre Lescot; I. M. Pei (pyramid, 1989)',
    style: 'Renaissance / Classique / Modernisme (pyramide)',
    emoji: '🔺',
    description: 'The world\'s largest art museum — 403,000m². Originally a royal fortress (1190), then palace of French kings, then revolutionary museum from 1793. The glass pyramid entrance by I. M. Pei caused fierce controversy in 1989 but is now iconic. Takes 100 days to see every artwork at 30 seconds each.',
    vocab: [
      { fr: 'la pyramide de verre', en: 'the glass pyramid' },
      { fr: 'le musée', en: 'the museum' },
      { fr: 'la Renaissance', en: 'the Renaissance' },
      { fr: 'l\'enceinte médiévale', en: 'the medieval fortress wall' },
      { fr: 'les œuvres d\'art', en: 'works of art' },
    ],
    phrase: { fr: 'Le Louvre abrite plus de 35 000 œuvres d\'art, dont la Joconde de Léonard de Vinci.', en: 'The Louvre houses more than 35,000 works of art, including Leonardo da Vinci\'s Mona Lisa.' },
    culturalNote: 'The Mona Lisa (La Joconde) takes up 800m² of display space. It\'s protected by bulletproof glass and draws 10 million visitors per year — more than any other painting in history. Yet it is quite small (77cm × 53cm).',
  },
  {
    name: 'Le Centre Pompidou',
    en: 'Pompidou Centre',
    city: 'Paris',
    built: 1977,
    architect: 'Renzo Piano & Richard Rogers',
    style: 'High-Tech / Architecture industrielle',
    emoji: '🏭',
    description: 'Notoriously "inside-out" — all structural and mechanical elements (pipes, ducts, escalators) are on the outside and colour-coded: blue = air, green = water, yellow = electricity, red = circulation. Caused outrage when built on the edge of Le Marais; now beloved. Houses Europe\'s largest modern art museum.',
    vocab: [
      { fr: 'les conduits', en: 'ducts / pipes' },
      { fr: 'l\'escalator', en: 'escalator' },
      { fr: 'l\'architecture contemporaine', en: 'contemporary architecture' },
      { fr: 'le musée d\'art moderne', en: 'modern art museum' },
      { fr: 'l\'art contemporain', en: 'contemporary art' },
    ],
    phrase: { fr: 'Le Centre Pompidou expose toutes les structures à l\'extérieur du bâtiment.', en: 'The Pompidou Centre exposes all its structures on the outside of the building.' },
    culturalNote: 'Piano and Rogers won the 1971 competition with the most radical design submitted. Critics called it "une raffinerie de pétrole" (an oil refinery). It has since been recognised as one of the 20th century\'s most influential buildings.',
  },
  {
    name: 'Le Mont Saint-Michel',
    en: 'Mont Saint-Michel',
    city: 'Normandie',
    built: '8th century onwards',
    architect: 'Various medieval architects',
    style: 'Romane et Gothique médiéval',
    emoji: '🏔️',
    description: 'A tidal island topped by a medieval abbey and village. Cut off at high tide — the sea rises 14m (one of the world\'s highest tidal ranges), covering 18km of bay in 6 hours. UNESCO World Heritage Site since 1979. 3.3 million visitors per year. 50 permanent residents.',
    vocab: [
      { fr: 'l\'abbaye', en: 'the abbey' },
      { fr: 'la marée (haute/basse)', en: 'the (high/low) tide' },
      { fr: 'l\'îlot', en: 'the islet' },
      { fr: 'médiéval(e)', en: 'medieval' },
      { fr: 'le moine', en: 'the monk' },
    ],
    phrase: { fr: 'La baie du Mont Saint-Michel a l\'une des plus fortes marées d\'Europe.', en: 'Mont Saint-Michel bay has one of the strongest tides in Europe.' },
    culturalNote: 'The abbey of Mont Saint-Michel was founded in 709 by Bishop Aubert of Avranches after the Archangel Michael appeared to him three times. The construction of a medieval monastery on a tidal rock is considered one of the greatest engineering feats of the Middle Ages.',
  },
  {
    name: 'La Basilique du Sacré-Cœur',
    en: 'Sacré-Cœur Basilica',
    city: 'Paris (Montmartre)',
    built: '1875–1914 (inaugurated 1919)',
    architect: 'Paul Abadie',
    style: 'Romano-Byzantine / Style éclectique',
    emoji: '🕍',
    description: 'Perched atop Montmartre hill (130m) — the highest point in Paris. Built as a national vow of penitence after France\'s humiliating defeat in the Franco-Prussian War (1870). The white stone (travertin de Châtillon) bleaches whiter over time as it reacts with rain. 11 million visitors per year.',
    vocab: [
      { fr: 'la basilique', en: 'the basilica' },
      { fr: 'la coupole', en: 'the dome' },
      { fr: 'le dôme', en: 'the dome' },
      { fr: 'la colline', en: 'the hill' },
      { fr: 'byzantin(e)', en: 'Byzantine (style)' },
    ],
    phrase: { fr: 'Le Sacré-Cœur domine le quartier de Montmartre depuis la colline.', en: 'Sacré-Cœur dominates the Montmartre quarter from the hill.' },
    culturalNote: 'Montmartre was the centre of the Paris Commune (1871) — the radical leftist government that briefly controlled Paris after the war. The Sacré-Cœur was explicitly built by the conservative government as a counter-statement — its political symbolism still divides Parisians.',
  },
]

const ARCH_VOCAB = [
  { fr: 'l\'arc', en: 'arch', note: '"L\'arc de triomphe" = the triumphal arch. "L\'Arc de Triomphe" in Paris honours Napoleon\'s armies.' },
  { fr: 'la voûte', en: 'vault / arch ceiling', note: '"La voûte étoilée" = the star vault (in Gothic churches). Gothic cathedrals pioneered the ribbed vault.' },
  { fr: 'le pilier', en: 'pillar / column', note: '"Les piliers de la société" = the pillars of society — a metaphor taken from architecture.' },
  { fr: 'la façade', en: 'façade / front face', note: '"Façade" entered English directly from French. "La façade haussmannienne" = the classic Parisian front.' },
  { fr: 'le portail', en: 'doorway / portal', note: 'Gothic church portals tell stories through sculpted scenes — a "Bible for the illiterate".' },
  { fr: 'la coupole', en: 'dome / cupola', note: '"La coupole du Panthéon" — the Panthéon in Paris has a 83m-high dome, based on Rome\'s Panthéon.' },
  { fr: 'la flèche', en: 'spire (church)', note: 'Also means "arrow" — the spire\'s pointed shape inspired the word. Notre-Dame\'s spire was 93m.' },
  { fr: 'le clocher', en: 'bell tower', note: '"Le son du clocher" = the sound of the bell tower — used to mean local identity ("le clocher" = the village).' },
  { fr: 'la nef', en: 'nave (of a church)', note: 'The long central hall of a church. "Nef" also gave us the English word "nave" and "navy" (ships were once stored in church naves).' },
  { fr: 'le transept', en: 'transept', note: 'The cross-arm of a cruciform church. The crossing where the nave and transept meet is typically topped by a tower.' },
  { fr: 'les arcs-boutants', en: 'flying buttresses', note: 'The revolutionary Gothic innovation — external arches that transfer the weight of the roof away from the walls, allowing huge windows.' },
  { fr: 'les gargouilles', en: 'gargoyles', note: 'Both decorative and functional — they channel rainwater away from the walls. "Gargouille" comes from "gorge" (throat).' },
  { fr: 'le donjon', en: 'keep (castle tower)', note: 'The central and strongest tower of a medieval castle — last line of defence. In French, "donjon" never means dungeon (= "cachot").' },
  { fr: 'les remparts', en: 'ramparts / city walls', note: 'Carcassonne has the best-preserved medieval ramparts in France — 3km of double walls with 52 towers.' },
  { fr: 'l\'hôtel de ville', en: 'town hall / city hall', note: 'The "hôtel" here is the old meaning: a large private mansion. Many city halls are in converted aristocratic hôtels particuliers.' },
  { fr: 'l\'immeuble haussmannien', en: 'Haussmann-style apartment block', note: 'The characteristic Parisian style — limestone façade, zinc roof, wrought-iron balconies, 6 storeys. Named after Baron Haussmann who rebuilt Paris 1853–1870.' },
]

const ARCH_STYLES = [
  {
    style: 'Gothique',
    period: '12th–16th century',
    features: ['Pointed arches (l\'arc brisé)', 'Flying buttresses (arcs-boutants)', 'Large stained-glass windows', 'Ribbed vaults', 'Soaring height'],
    examples: ['Notre-Dame de Paris (1163)', 'Cathédrale de Chartres (1194)', 'Sainte-Chapelle de Paris (1248)', 'Cathédrale d\'Amiens (1220)'],
    note: 'Gothic architecture was born in France — specifically in the Île-de-France. "Opus Francigenum" (French work) was its original name. The goal was to replace heavy stone walls with light and glass.',
  },
  {
    style: 'Renaissance française',
    period: '15th–17th century',
    features: ['Classical proportions', 'Dormer windows (lucarnes)', 'Round arches', 'Symmetrical façades', 'Italian influence merged with French medieval style'],
    examples: ['Château de Fontainebleau (1528)', 'Château de Chambord (1519)', 'Château de Chenonceau (1514)', 'Aile François Ier du Louvre (1546)'],
    note: 'French Renaissance arrived after Charles VIII\'s Italian campaigns (1494). The Loire Valley châteaux are its greatest expression — a blend of Italian elegance with French medieval château forms.',
  },
  {
    style: 'Classicisme / Baroque français',
    period: '17th century',
    features: ['Strict symmetry', 'Restrained ornament (vs Italian Baroque)', 'Grand scale', 'Classical columns and pilasters', 'Formal gardens (jardins à la française)'],
    examples: ['Château de Versailles (1661)', 'Les Invalides, Paris (1670)', 'Place Vendôme (1699)', 'Palais du Luxembourg (1615)'],
    note: 'French Classicism was a deliberate political art — glorifying the state and monarchy. Louis XIV used architecture as propaganda. The Académie royale d\'architecture (1671) codified the rules. More restrained than Italian Baroque.',
  },
  {
    style: 'Architecture haussmannienne',
    period: '1853–1870',
    features: ['6-7 storey uniform height', 'Limestone façades (pierre de taille)', 'Zinc mansard roofs', 'Continuous balconies on 2nd and 5th floors', 'Uniform cornice lines creating street rhythm'],
    examples: ['Boulevard Haussmann', 'Avenue de l\'Opéra', 'Most of central Paris\'s residential streets'],
    note: 'Baron Georges-Eugène Haussmann rebuilt 60% of Paris for Napoleon III. He demolished medieval Paris and built the grands boulevards — partly for beauty, partly to make barricade-building harder after the 1848 revolution.',
  },
  {
    style: 'Art Nouveau',
    period: '1890–1914',
    features: ['Organic, flowing lines', 'Nature-inspired motifs (flowers, insects)', 'Iron and glass', 'Decorative tiles and mosaics', 'Curved forms everywhere'],
    examples: ['Entrées du Métro de Paris by Guimard (1900)', 'Galeries Lafayette Paris (1912)', 'Opéra de Nice (1885)', 'Villa Majorelle, Nancy'],
    note: 'Art Nouveau flourished in France, Belgium, and Austria simultaneously. In France it\'s called "le style nouille" (noodle style) or "style 1900". The Paris Métro entrances by Hector Guimard are its most recognisable symbol.',
  },
  {
    style: 'Architecture contemporaine',
    period: '1960s–present',
    features: ['Daring structural innovation', 'Glass and steel', 'Questioning tradition', 'Public buildings as national statements', 'Grands Travaux de Mitterrand'],
    examples: ['Centre Pompidou (1977)', 'Grande Arche de la Défense (1989)', 'Pyramide du Louvre (1989)', 'Musée du Quai Branly (2006)', 'Philharmonie de Paris (2015)'],
    note: 'Mitterrand\'s Grands Travaux (1981–1995) commissioned 9 major public buildings to modernise Paris. France actively commissions avant-garde architecture for public institutions — the Ministry of Finance, the Bibliothèque nationale de France, the Opéra Bastille are all radical modernist statements.',
  },
]

const ARCH_CULTURE = [
  {
    emoji: '🏛️',
    title: 'Les Monuments Historiques',
    detail: 'France has the world\'s largest inventory of protected historic monuments: over 43,000 buildings classified or listed as "Monument Historique". The state pays 50% of restoration costs for listed buildings. The Direction des Affaires Culturelles (DRAC) in each region oversees the system. Notre-Dame\'s restoration was co-funded by the state and private donors worldwide.',
  },
  {
    emoji: '🎨',
    title: 'Architecture as Art de Vivre',
    detail: 'In France, architecture is considered one of the Beaux-Arts — alongside painting, sculpture, music, and literature. The École des Beaux-Arts in Paris trained generations of architects from across the world. The "Beaux-Arts style" that defines many 19th-century public buildings globally (Grand Central Terminal, New York; Boston Public Library) is named after this school.',
  },
  {
    emoji: '🔧',
    title: 'Les Grands Travaux',
    detail: 'François Mitterrand (President 1981–1995) commissioned nine massive architectural projects in Paris: the Pyramide du Louvre, Grande Arche de la Défense, Opéra Bastille, Institut du Monde Arabe, Bibliothèque nationale de France, Cité de la Musique, and others. Critics called them "pharaonic" — but they defined late 20th-century Paris and drew international architects to France.',
  },
  {
    emoji: '🌿',
    title: 'Haussmann\'s Legacy',
    detail: 'Baron Haussmann\'s rebuilding of Paris (1853–1870) remains the most ambitious urban transformation in history. He demolished 20,000 buildings and displaced 350,000 people. He built 600km of new roads, new sewers, street lighting, and parks. The result: the "Paris" most visitors see today. Critics called it "Haussmannisation" — and the word became international shorthand for top-down urban renewal.',
  },
]

export default function FrenchArchitecture() {
  const [expanded, setExpanded] = useState(null)
  const [activeStyle, setActiveStyle] = useState(0)
  const [tab, setTab] = useState('landmarks')

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French Architecture | SayBonjour!" description="Explore famous French buildings, architectural vocabulary, historical styles, and French architectural culture." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">French Architecture</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">L\'architecture française — from Gothic cathedrals to modernist icons</p>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          {[
            { id: 'landmarks', label: 'Landmarks' },
            { id: 'vocab', label: 'Vocabulary' },
            { id: 'styles', label: 'Architectural Styles' },
            { id: 'culture', label: 'Architecture & Culture' },
          ].map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); addXP(3, 'vocabulary') }}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${tab === t.id ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'landmarks' && (
          <div className="space-y-4">
            {BUILDINGS.map((building, i) => {
              const isOpen = expanded === building.name
              return (
                <motion.div key={building.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 overflow-hidden">
                  <button onClick={() => { setExpanded(isOpen ? null : building.name); addXP(3, 'vocabulary') }}
                    className="w-full text-left px-6 py-4 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-stone-100 to-gray-200 dark:from-stone-700/20 dark:to-gray-700/20 flex items-center justify-center text-3xl shrink-0">{building.emoji}</div>
                    <div className="flex-1">
                      <h2 className="font-bold text-gray-900 dark:text-cream-50 font-playfair">{building.name}</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{building.city} · {building.built} · <span className="italic">{building.style}</span></p>
                    </div>
                    {isOpen ? <ChevronUp size={15} className="text-gray-400 shrink-0" /> : <ChevronDown size={15} className="text-gray-400 shrink-0" />}
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                        <div className="px-6 pb-6 border-t border-gray-50 dark:border-dark-warm-200 pt-4 space-y-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{building.description}</p>
                          <p className="text-xs text-gray-400">Architect(s): {building.architect}</p>

                          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3">
                            <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-1">💡 Cultural Note</p>
                            <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">{building.culturalNote}</p>
                          </div>

                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Key vocabulary</p>
                            <div className="flex flex-wrap gap-2">
                              {building.vocab.map(v => (
                                <div key={v.fr} className="flex items-center gap-1.5 bg-cream-50 dark:bg-dark-warm-200 rounded-lg px-3 py-1.5 cursor-pointer"
                                  onClick={() => addXP(2, 'vocabulary')}>
                                  <SpeakButton text={v.fr} size="sm" />
                                  <span className="text-sm text-burgundy-700 dark:text-burgundy-vibrant-300 font-medium">{v.fr}</span>
                                  <span className="text-xs text-gray-400">— {v.en}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-start gap-2 bg-cream-50 dark:bg-dark-warm-200 rounded-xl px-4 py-3">
                            <SpeakButton text={building.phrase.fr} size="sm" />
                            <div>
                              <p className="text-sm italic text-gray-700 dark:text-gray-300">"{building.phrase.fr}"</p>
                              <p className="text-xs text-gray-400">{building.phrase.en}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        )}

        {tab === 'vocab' && (
          <div className="space-y-2">
            {ARCH_VOCAB.map((v, i) => (
              <motion.div key={v.fr} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="bg-white dark:bg-dark-warm-100 rounded-xl shadow border border-gray-100 dark:border-dark-warm-50 px-4 py-3 flex items-start gap-3 cursor-pointer"
                onClick={() => addXP(2, 'vocabulary')}>
                <SpeakButton text={v.fr} size="sm" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="font-medium text-sm text-burgundy-700 dark:text-burgundy-vibrant-300">{v.fr}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">— {v.en}</p>
                  </div>
                  {v.note && <p className="text-xs text-amber-600 dark:text-amber-400 italic">💡 {v.note}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'styles' && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {ARCH_STYLES.map((s, i) => (
                <button key={s.style} onClick={() => { setActiveStyle(i); addXP(3, 'vocabulary') }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeStyle === i ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
                  {s.style}
                </button>
              ))}
            </div>
            <div className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-6">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="font-bold text-xl font-playfair text-gray-900 dark:text-cream-50">{ARCH_STYLES[activeStyle].style}</h2>
              </div>
              <p className="text-xs text-burgundy-600 dark:text-burgundy-vibrant-300 font-medium mb-4">{ARCH_STYLES[activeStyle].period}</p>

              <div className="mb-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Key features</p>
                <ul className="space-y-1">
                  {ARCH_STYLES[activeStyle].features.map((f, i) => (
                    <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                      <span className="text-burgundy-500 shrink-0 mt-0.5">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Key examples</p>
                <div className="flex flex-wrap gap-2">
                  {ARCH_STYLES[activeStyle].examples.map((ex, i) => (
                    <span key={i} className="text-xs bg-cream-50 dark:bg-dark-warm-200 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full">{ex}</span>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3">
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-1">💡 Cultural Note</p>
                <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">{ARCH_STYLES[activeStyle].note}</p>
              </div>
            </div>
          </div>
        )}

        {tab === 'culture' && (
          <div className="space-y-4">
            {ARCH_CULTURE.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-5 flex items-start gap-4 cursor-pointer"
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
