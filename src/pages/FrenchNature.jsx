import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Leaf, Mountain, Droplets } from 'lucide-react'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const NATURE_GROUPS = [
  {
    category: 'Landscapes & Geography',
    emoji: '🏔️',
    items: [
      { fr: 'la montagne', en: 'the mountain', note: 'France has the Alps (highest: Mont Blanc 4,808m), Pyrenees, Massif Central, Vosges, and Jura.' },
      { fr: 'la mer', en: 'the sea', note: 'France has coastlines on the Atlantic, the Mediterranean, the English Channel, and the North Sea.' },
      { fr: 'l\'océan (m)', en: 'the ocean', note: '"L\'Océan Atlantique" — France\'s western coast faces the Atlantic.' },
      { fr: 'la plage', en: 'the beach', note: '"La plage de sable fin" = fine sand beach. "Les galets" = pebbles. Nice has pebble beaches; Atlantic coast has sandy.' },
      { fr: 'la forêt', en: 'the forest', note: 'France is 30% forest. "La Forêt des Landes" = Europe\'s largest planted forest. "En forêt" = in the forest.' },
      { fr: 'la campagne', en: 'the countryside', note: '"La vie à la campagne" = country life. "Les champs" = fields. "La campagne française" = iconic rolling farmland.' },
      { fr: 'la rivière', en: 'the river (smaller, flows into another river)', note: 'Key distinction: "rivière" flows into another river; "fleuve" flows to the sea.' },
      { fr: 'le fleuve', en: 'the river (large, flows to the sea)', note: 'France\'s major fleuves: la Seine, la Loire, le Rhône, la Garonne. "La Loire" = France\'s longest river.' },
      { fr: 'le lac', en: 'the lake', note: '"Le lac Léman" (Lake Geneva) — shared with Switzerland. "Le lac d\'Annecy" = one of Europe\'s purest lakes.' },
      { fr: 'la vallée', en: 'the valley', note: '"La Vallée du Rhône" = France\'s north-south wine corridor. "La vallée de la Loire" = UNESCO World Heritage Site.' },
      { fr: 'la colline', en: 'the hill', note: '"La colline de Montmartre" = Paris\'s famous hill. "Les collines" = rolling hills.' },
      { fr: 'la côte', en: 'the coast / coastline', note: '"La Côte d\'Azur" = the Azure/Riviera coast. "La Côte Sauvage" = the Wild Coast (Brittany).' },
      { fr: 'l\'île (f)', en: 'the island', note: '"La Corse" (Corsica) = France\'s largest island. "La Réunion", "la Martinique" = overseas islands.' },
      { fr: 'le désert', en: 'the desert', note: 'No true deserts in Metropolitan France, but the "Crau plain" in Provence approaches semi-arid.' },
      { fr: 'la falaise', en: 'the cliff', note: '"Les falaises d\'Étretat" in Normandy = iconic white chalk cliffs painted by Monet.' },
      { fr: 'le marais', en: 'the marsh / wetland', note: '"Le Marais Poitevin" = the Poitevin marsh — a network of green canals called the "Venise Verte".' },
    ],
  },
  {
    category: 'Plants & Trees',
    emoji: '🌳',
    items: [
      { fr: 'un arbre', en: 'a tree', note: '"Un arbre centenaire" = a hundred-year-old tree. France has some spectacular ancient oaks and chestnuts.' },
      { fr: 'une fleur', en: 'a flower', note: '"Cueillir des fleurs" = to pick flowers. "Un bouquet de fleurs" = a bunch of flowers.' },
      { fr: 'l\'herbe (f)', en: 'grass', note: '"Interdiction de marcher sur les pelouses" = keep off the grass (Paris parks). "Une pelouse" = lawn.' },
      { fr: 'un chêne', en: 'an oak tree', note: 'The oak is France\'s "national tree". "Le bois de chêne" is used in wine barrel ageing — essential for French wine.' },
      { fr: 'un peuplier', en: 'a poplar tree', note: '"Les peupliers le long de la route" — iconic in the French landscape, lining canals and roads. Van Gogh painted them obsessively.' },
      { fr: 'un platane', en: 'a plane tree', note: 'The dominant tree of southern France — lining village squares ("la place ombragée de platanes"). Often used as pétanque shade.' },
      { fr: 'un rosier', en: 'a rose bush', note: '"Une rose rouge" = a red rose. France is a major rose producer — the Grasse region for perfume.' },
      { fr: 'le tournesol', en: 'the sunflower', note: '"Tournesol" = turns with the sun. Vast sunflower fields cover the Midi and Dordogne in summer — an iconic French landscape.' },
      { fr: 'la lavande', en: 'lavender', note: '"Les champs de lavande" in Provence (Valensole, Sault) — July is peak flowering season. A globally iconic French image.' },
      { fr: 'le blé', en: 'wheat', note: 'Vast wheat fields cover northern France (La Beauce = the "breadbasket of France"). France is one of the world\'s largest wheat exporters.' },
      { fr: 'la vigne', en: 'the vine / grapevine', note: '"La vigne" = the vine. "Le vignoble" = the vineyard. France has 800,000 hectares of vines.' },
      { fr: 'la feuille', en: 'the leaf', note: '"Une feuille de platane / de chêne" = a plane/oak leaf. "La chute des feuilles" = the fall of leaves (autumn).' },
      { fr: 'la branche', en: 'the branch', note: '"Couper une branche" = to cut a branch. "Une branche d\'olivier" = an olive branch (peace).' },
      { fr: 'la mousse', en: 'moss', note: '"Le tronc recouvert de mousse" = the moss-covered trunk. Common in France\'s wet Atlantic forests.' },
    ],
  },
  {
    category: 'Animals & Wildlife',
    emoji: '🦅',
    items: [
      { fr: 'un aigle', en: 'an eagle', note: '"L\'aigle royal" = the golden eagle. Found in the Alps and Pyrenees.' },
      { fr: 'un renard', en: 'a fox', note: '"Maître Renard" = the fox in La Fontaine\'s famous fables. Very common across France.' },
      { fr: 'un sanglier', en: 'a wild boar', note: 'Symbol of Astérix\'s village! Very common in French forests — can be dangerous. Hunted in autumn.' },
      { fr: 'un cerf', en: 'a stag / red deer', note: '"Le brame du cerf" = the stag\'s roar (autumn). Heard in forests at dawn in September.' },
      { fr: 'une chouette', en: 'an owl', note: '"Chouette !" = great!/cool! (slang). The tawny owl ("la chouette hulotte") is common in French woodlands.' },
      { fr: 'un papillon', en: 'a butterfly', note: '"Chasser les papillons" = to chase butterflies — French idiom for being distracted/idle.' },
      { fr: 'une abeille', en: 'a bee', note: '"Travailleur comme une abeille" = hard-working as a bee. Beekeeping ("l\'apiculture") is a major French tradition.' },
      { fr: 'un dauphin', en: 'a dolphin', note: 'Dolphins are found in the Bay of Biscay and Mediterranean. "Le Dauphin" was the title of the heir to the French throne.' },
      { fr: 'un chamois', en: 'a chamois (mountain goat)', note: 'Found in the Alps and Pyrenees. "Souple comme un chamois" = as agile as a chamois.' },
      { fr: 'une cigogne', en: 'a stork', note: 'The stork is the symbol of Alsace. Strasbourg has a stork breeding programme — they nest on church towers.' },
    ],
  },
  {
    category: 'Environment',
    emoji: '🌍',
    items: [
      { fr: 'l\'environnement (m)', en: 'the environment', note: '"La protection de l\'environnement" = environmental protection. France has a Ministry of Ecological Transition.' },
      { fr: 'le réchauffement climatique', en: 'global warming', note: 'France signed the Paris Agreement in 2015 — a significant moment of national and global climate commitment.' },
      { fr: 'le changement climatique', en: 'climate change', note: '"Le dérèglement climatique" = climate disruption (more accurate term used in French media).' },
      { fr: 'la pollution', en: 'pollution', note: '"La pollution de l\'air" = air pollution. Paris occasionally bans cars on alternating days during pollution peaks.' },
      { fr: 'le recyclage', en: 'recycling', note: '"Trier ses déchets" = to sort your waste. France has a colour-coded bin system: jaune (yellow) = recyclables, verte (green) = glass.' },
      { fr: 'les énergies renouvelables', en: 'renewable energy', note: 'France generates 70% of its electricity from nuclear power — controversial but low-carbon. Wind and solar expanding rapidly.' },
      { fr: 'la biodiversité', en: 'biodiversity', note: 'France is one of the most biodiverse countries in Europe — 10 national parks, 55 regional nature parks.' },
      { fr: 'le développement durable', en: 'sustainable development', note: '"Durable" = sustainable (not the same as English "durable" meaning long-lasting). "Le développement durable" is a key French political concept.' },
      { fr: 'les espèces menacées', en: 'endangered species', note: '"En voie de disparition" = on the way to extinction. The wolf returned to France in the 1990s — controversial with farmers.' },
      { fr: 'une réserve naturelle', en: 'a nature reserve', note: 'France has 165 natural reserves. "La Camargue" = the Rhône delta — flamingos, wild horses, bulls.' },
    ],
  },
]

const NATURE_PHRASES = [
  { fr: 'Il fait beau — on va se promener dans la forêt ?', en: 'The weather\'s lovely — shall we go for a walk in the forest?', note: '"Se promener" = to take a walk. "Une balade" = a stroll/walk (informal).' },
  { fr: 'On va à la montagne ce week-end — j\'adore ça !', en: 'We\'re going to the mountains this weekend — I love it!', note: '"La montagne" = mountains. "Faire de la randonnée" = to hike.' },
  { fr: 'La Seine est le fleuve qui traverse Paris.', en: 'The Seine is the river that flows through Paris.', note: '"Traverser" = to cross / flow through. "La Seine fait 775 km de long."' },
  { fr: 'J\'adore me promener en forêt — ça me ressource.', en: 'I love walking in the forest — it recharges me.', note: '"Se ressourcer" = to recharge/restore oneself (in nature). A very French concept.' },
  { fr: 'La lavande pousse partout en Provence en juillet.', en: 'Lavender grows everywhere in Provence in July.', note: '"Pousser" = to grow (plants). "Partout" = everywhere.' },
  { fr: 'Protéger la nature, c\'est protéger notre avenir.', en: 'Protecting nature is protecting our future.', note: 'A slogan commonly heard in French environmental campaigns.' },
  { fr: 'Les champs de tournesols sont magnifiques en été.', en: 'The sunflower fields are magnificent in summer.', note: '"Un champ" = a field. "Les champs" = fields. Dordogne and Midi have spectacular sunflower fields.' },
  { fr: 'Le mont Blanc est le plus haut sommet d\'Europe occidentale.', en: 'Mont Blanc is the highest peak in Western Europe.', note: '"4 808 mètres" above sea level. Located on the France–Italy border.' },
]

export default function FrenchNature() {
  const [tab, setTab] = useState('nature')
  const [activeGroup, setActiveGroup] = useState(0)

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French Nature Vocabulary | SayBonjour!" description="French nature vocabulary — landscapes, plants, wildlife, environment, and phrases with French natural world notes." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">Nature in French</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">La nature — landscapes, plants, wildlife, and the environment in France</p>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          {[{ id: 'nature', label: 'Vocabulary' }, { id: 'phrases', label: 'Phrases' }, { id: 'seasons', label: 'Seasons' }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${tab === t.id ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'nature' && (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
              {NATURE_GROUPS.map((g, i) => (
                <button key={g.category} onClick={() => { setActiveGroup(i); addXP(3, 'vocabulary') }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeGroup === i ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
                  {g.emoji} {g.category}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {NATURE_GROUPS[activeGroup].items.map((item, i) => (
                <motion.div key={item.fr} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className="bg-white dark:bg-dark-warm-100 rounded-xl shadow border border-gray-100 dark:border-dark-warm-50 px-4 py-3 flex items-start gap-2"
                  onClick={() => addXP(2, 'vocabulary')}>
                  <SpeakButton text={item.fr} size="sm" />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm text-burgundy-700 dark:text-burgundy-vibrant-300">{item.fr}</p>
                      <span className="text-xs text-gray-400">— {item.en}</span>
                    </div>
                    {item.note && <p className="text-xs text-amber-600 dark:text-amber-400 italic mt-0.5">💡 {item.note}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {tab === 'phrases' && (
          <div className="space-y-3">
            {NATURE_PHRASES.map((p, i) => (
              <motion.div key={p.fr} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="bg-white dark:bg-dark-warm-100 rounded-xl shadow border border-gray-100 dark:border-dark-warm-50 p-4 flex items-start gap-3"
                onClick={() => addXP(2, 'vocabulary')}>
                <SpeakButton text={p.fr} size="sm" />
                <div>
                  <p className="font-medium text-sm italic text-gray-800 dark:text-cream-50">"{p.fr}"</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{p.en}</p>
                  {p.note && <p className="text-xs text-amber-600 dark:text-amber-400 italic mt-0.5">💡 {p.note}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'seasons' && (
          <div className="space-y-5">
            {[
              {
                name: 'Le printemps', en: 'Spring', emoji: '🌸', months: 'March–May',
                desc: 'Spring in France is a favourite season — mild temperatures, flowering orchards in Normandy and Provence, and the return of outdoor café terraces. Paris in April is celebrated in song and tourism.',
                vocab: [
                  { fr: 'la floraison', en: 'blossoming / flowering', note: '"La floraison des cerisiers" = cherry blossom — celebrated in Japanese communities in Paris.' },
                  { fr: 'une averse de printemps', en: 'a spring shower', note: '"Avril fait la fleur, mai a l\'honneur." (April makes the flower, May takes the credit) — French proverb.' },
                  { fr: 'le renouveau', en: 'renewal / rebirth', note: '"Le renouveau de la nature" = nature\'s renewal. Literary and poetic — used in speeches and songs.' },
                  { fr: 'les bourgeons', en: 'buds / leaf buds', note: '"Les bourgeons éclatent" = the buds are bursting. A sign that spring has truly arrived.' },
                ],
                phrases: [
                  { fr: 'Les cerisiers sont en fleurs — c\'est magnifique !', en: 'The cherry trees are in blossom — it\'s magnificent!' },
                  { fr: 'Je jardine chaque week-end au printemps.', en: 'I garden every weekend in spring.' },
                ],
              },
              {
                name: 'L\'été', en: 'Summer', emoji: '☀️', months: 'June–August',
                desc: 'Summer is the great French holiday season. France empties in August — beaches fill, cities hollow out, and the Tour de France winds through mountain passes. The Mediterranean coast, Brittany\'s beaches, and the Dordogne valleys draw millions.',
                vocab: [
                  { fr: 'la canicule', en: 'a heatwave', note: 'The 2003 canicule killed 15,000 people in France — a national trauma that triggered major public health reforms.' },
                  { fr: 'le solstice d\'été', en: 'the summer solstice', note: 'June 21st — the longest day. "La fête de la musique" (free outdoor concerts everywhere in France) is held on this day.' },
                  { fr: 'les grandes vacances', en: 'the long school holidays (summer)', note: 'French school summer holidays last 8–9 weeks — the longest in Europe. The entire country reorganises around them.' },
                  { fr: 'bronzer / se faire bronzer', en: 'to tan / to sunbathe', note: '"Avoir le teint hâlé" = to have a tan. "La plage" + August = the essential French summer ritual.' },
                ],
                phrases: [
                  { fr: 'On part en vacances au bord de la mer la semaine prochaine.', en: 'We\'re going on holiday to the seaside next week.' },
                  { fr: 'Il fait une chaleur écrasante — je reste à l\'ombre.', en: 'It\'s crushing heat — I\'m staying in the shade.' },
                ],
              },
              {
                name: 'L\'automne', en: 'Autumn', emoji: '🍂', months: 'September–November',
                desc: 'Autumn brings the grape harvest (les vendanges), mushroom foraging in forests, and the famous amber light of the Île-de-France. The return from summer holidays ("la rentrée") is a major cultural moment — the biggest reset of the French year.',
                vocab: [
                  { fr: 'la rentrée', en: 'return to school / work / normal life (September)', note: '"La rentrée" is much more than back-to-school — it\'s the reset of the entire country after August. New books, new TV shows, new political debates all launch in September.' },
                  { fr: 'les vendanges', en: 'the grape harvest', note: 'September–October across France\'s wine regions. Seasonal workers still participate in hand-picking in top vineyards.' },
                  { fr: 'les champignons', en: 'mushrooms (wild)', note: '"Aller aux champignons" = to go mushroom foraging — a beloved French autumn tradition. Pharmacies can identify edible from poisonous species.' },
                  { fr: 'la chute des feuilles', en: 'the fall of the leaves', note: '"L\'automne doré" = golden autumn. The Tuileries gardens and Bois de Boulogne in Paris are spectacular in late October.' },
                ],
                phrases: [
                  { fr: 'On ramasse des champignons en forêt ce matin.', en: 'We\'re picking mushrooms in the forest this morning.' },
                  { fr: 'La rentrée est toujours un peu stressante.', en: 'The September return is always a bit stressful.' },
                ],
              },
              {
                name: 'L\'hiver', en: 'Winter', emoji: '❄️', months: 'December–February',
                desc: 'Winter in France means snow in the Alps and Pyrenees (skiing season), Christmas markets in Alsace, and the most elaborate meal of the year — the réveillon. Temperatures in Paris average 5°C but the cultural warmth of December compensates.',
                vocab: [
                  { fr: 'le réveillon', en: 'Christmas Eve / New Year\'s Eve feast', note: '"Le réveillon de Noël" (24 December) and "le réveillon du Nouvel An" (31 December). Both are major family meals — often served at midnight.' },
                  { fr: 'les sports d\'hiver', en: 'winter sports', note: 'Skiing ("le ski") and snowboarding ("le snowboard"). France has the Alps (Chamonix, Courchevel, Méribel) and Pyrenees — world-class ski areas.' },
                  { fr: 'le verglas', en: 'black ice', note: '"Attention au verglas !" = watch out for black ice! A major winter hazard on French roads.' },
                  { fr: 'la bûche de Noël', en: 'Yule log cake', note: 'The traditional French Christmas dessert — a rolled sponge cake shaped like a log, decorated with cream and chocolate. Essential on every French table.' },
                ],
                phrases: [
                  { fr: 'Il neige dans les Alpes — on part faire du ski !', en: 'It\'s snowing in the Alps — we\'re going skiing!' },
                  { fr: 'Le réveillon en famille, c\'est ma soirée préférée de l\'année.', en: 'The Christmas Eve family feast is my favourite evening of the year.' },
                ],
              },
            ].map((season, i) => (
              <motion.div key={season.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-6"
                onClick={() => addXP(3, 'vocabulary')}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{season.emoji}</span>
                  <div>
                    <h3 className="font-bold text-lg font-playfair text-gray-900 dark:text-cream-50">{season.name} <span className="text-gray-400 font-normal text-base">— {season.en}</span></h3>
                    <p className="text-xs text-gray-400">{season.months}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{season.desc}</p>
                <div className="space-y-2 mb-4">
                  {season.vocab.map(v => (
                    <div key={v.fr} className="flex items-start gap-3 bg-cream-50 dark:bg-dark-warm-200 rounded-xl px-3 py-2">
                      <SpeakButton text={v.fr} size="sm" />
                      <div>
                        <span className="font-medium text-sm text-burgundy-700 dark:text-burgundy-vibrant-300">{v.fr}</span>
                        <span className="text-xs text-gray-400 ml-2">— {v.en}</span>
                        {v.note && <p className="text-xs text-amber-600 dark:text-amber-400 italic mt-0.5">💡 {v.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {season.phrases.map(p => (
                    <div key={p.fr} className="flex items-start gap-3 bg-burgundy-50 dark:bg-burgundy-vibrant-600/10 border border-burgundy-100 dark:border-burgundy-vibrant-600/20 rounded-xl px-3 py-2">
                      <SpeakButton text={p.fr} size="sm" />
                      <div>
                        <p className="text-sm italic text-burgundy-700 dark:text-burgundy-vibrant-300">"{p.fr}"</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{p.en}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
