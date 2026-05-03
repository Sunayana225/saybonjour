import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChefHat, ChevronDown, ChevronUp, UtensilsCrossed } from 'lucide-react'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const FOOD_CATEGORIES = {
  'Petit-déjeuner': {
    icon: '🥐',
    en: 'Breakfast',
    intro: 'The French breakfast is light — sweet bread or pastries, coffee, and juice. Unlike British breakfast, it\'s almost never cooked or savoury. The iconic image: a croissant and a café crème at a zinc café counter.',
    items: [
      { fr: 'le croissant', en: 'croissant', note: 'Buttery, flaky crescent pastry — the quintessential French breakfast. Despite its name ("crescent"), it originated in Austria. The croissant au beurre (butter croissant) is superior to the "croissant ordinaire" — look for the straight shape vs curved.' },
      { fr: 'la baguette', en: 'baguette', note: 'Long thin bread — eaten at every meal including breakfast with butter and jam. The baguette tradition ("la tradition française") is UNESCO Intangible Heritage since 2022. Must be eaten within hours of baking.' },
      { fr: 'le pain au chocolat', en: 'pain au chocolat / chocolatine', note: 'Chocolate-filled pastry. CRITICALLY: In southwest France ("le Grand Sud-Ouest"), it\'s called "une chocolatine" — calling it "pain au chocolat" there marks you as a Parisian. A real cultural divide.' },
      { fr: 'le café au lait / le café crème', en: 'coffee with milk / café crème', note: '"Café au lait" drunk at home from a bowl. "Un café crème" at a café = espresso with steamed milk. "Un café serré" = strong espresso. "Un déca" = decaf.' },
      { fr: 'le jus d\'orange pressé', en: 'freshly squeezed orange juice', note: '"Un jus d\'orange pressé" = freshly squeezed — always specified for quality. "Un jus" alone could mean bottled.' },
      { fr: 'la confiture', en: 'jam / preserve', note: '"Confiture de fraises" = strawberry jam. "Confiture d\'abricots" = apricot jam. Spread on "tartines" (slices of buttered bread).' },
      { fr: 'le pain grillé / la tartine grillée', en: 'toast / grilled bread', note: '"La tartine" = a slice of bread with butter/jam. "Faire griller" = to toast. Less common than in the UK — the French prefer fresh bread.' },
    ],
  },
  'Entrées': {
    icon: '🥗',
    en: 'Starters',
    intro: 'The entrée (starter) is a crucial false friend — it means the FIRST course, not the main course. French starters are often light and elegant, designed to stimulate the appetite.',
    items: [
      { fr: 'la soupe à l\'oignon', en: 'French onion soup', note: 'Slow-cooked onion broth topped with gruyère and croutons — a Parisian bistro classic. Originally a working-class dish from Les Halles market. Best consumed at midnight after theatre.' },
      { fr: 'les escargots de Bourgogne', en: 'snails in garlic herb butter', note: 'Baked in garlic and parsley butter, served in the shell with special tongs ("la pince") and a fork. A test of courage for visitors — most who try them love them.' },
      { fr: 'le foie gras', en: 'foie gras (duck or goose liver)', note: 'Served with toast ("des toasts") and fig or onion jam ("de la confiture de figues"). A French luxury — morally controversial due to force-feeding ("le gavage") but deeply embedded in French gastronomy.' },
      { fr: 'la salade niçoise', en: 'Niçoise salad', note: 'From Nice: tuna (or anchovies), hard-boiled egg, black olives, tomatoes, green beans, radishes. A full meal as a salad. The authentic version never has lettuce or potatoes.' },
      { fr: 'les crudités', en: 'raw vegetable platter', note: 'Assorted raw vegetables — grated carrots, celery remoulade, radishes — with vinaigrette. Light, fresh, very French.' },
      { fr: 'la terrine', en: 'terrine / pâté', note: '"Une terrine de campagne" = a rustic pork pâté. Served with cornichons and crusty bread. A classic French country starter.' },
      { fr: 'les moules marinières', en: 'mussels in white wine', note: 'A classic starter portion — mussels steamed in white wine, shallots, and parsley. Served with crusty bread.' },
    ],
  },
  'Plats principaux': {
    icon: '🍽️',
    en: 'Main courses',
    intro: 'The plat principal is the heart of the French meal. France\'s great classics represent different regions — each dish tells a story of terroir, climate, and culinary tradition.',
    items: [
      { fr: 'le coq au vin', en: 'chicken braised in red wine', note: 'Classic braised chicken in Burgundy wine with mushrooms, lardons, and onions. Originally made with old roosters. A French Sunday lunch classic.' },
      { fr: 'le bœuf bourguignon', en: 'beef braised in Burgundy wine', note: 'Rich slow-cooked beef stew with carrots, mushrooms and pearl onions — made famous internationally by Julia Child. Must use good Burgundy wine.' },
      { fr: 'le confit de canard', en: 'duck confit', note: 'Duck leg preserved and slow-cooked in its own fat — a southwest French speciality from Gascony and Dordogne. Traditionally served with "pommes sarladaises" (potatoes sautéed in duck fat).' },
      { fr: 'la bouillabaisse', en: 'Marseille fish and shellfish stew', note: 'A Marseille institution — multiple varieties of fish, served with "rouille" (spicy mayo), gruyère, and croutons. Authentic bouillabaisse requires the specific Provençal rockfish and costs €50+ for two.' },
      { fr: 'la quiche lorraine', en: 'Lorraine tart', note: 'Savoury egg and cream tart with lardons — from the Lorraine region. The authentic version has NO cheese (that\'s added in tourist versions). A French café and bakery staple.' },
      { fr: 'les moules-frites', en: 'mussels and chips', note: 'Steamed mussels ("moules marinières" or au curry) with French fries — hugely popular from Normandy to Belgium. Often served in a huge pot at the table.' },
      { fr: 'le steak-frites', en: 'steak and chips', note: '"Le plat quintessentiel du bistrot parisien". Served with Béarnaise or pepper sauce ("sauce au poivre"). Doneness: bleu → saignant → à point → bien cuit.' },
      { fr: 'le cassoulet', en: 'white bean and meat casserole', note: 'A hearty Languedoc dish — white beans ("haricots tarbais") with duck confit, Toulouse sausage, and pork. Three towns dispute the authentic version. Best in winter.' },
    ],
  },
  'Fromages': {
    icon: '🧀',
    en: 'Cheeses',
    intro: 'France has over 1,000 varieties of cheese — "De Gaulle\'s famous 246 varieties" (actually an undercount). The cheese course (le plateau de fromages) comes BEFORE dessert in France — a crucial difference from Anglo-Saxon custom.',
    items: [
      { fr: 'le camembert', en: 'Camembert', note: 'Soft creamy Normandy cheese with a white bloomy rind — named after the Norman village of Camembert. "Camembert de Normandie" (PDO) is made with raw milk; cheaper versions use pasteurised.' },
      { fr: 'le brie', en: 'Brie', note: 'Similar to Camembert but milder and flatter — from the Île-de-France region. "Brie de Meaux" (PDO) is the king of bries. "Le roi des fromages" — beloved by French kings.' },
      { fr: 'le roquefort', en: 'Roquefort', note: 'Sharp blue-veined cheese from Aveyron — aged in the natural caves of Roquefort-sur-Soulzon. One of the world\'s oldest documented cheeses (mentioned in 11th-century texts). Made with sheep\'s milk.' },
      { fr: 'le comté', en: 'Comté', note: 'Nutty, complex hard cheese from the Jura mountains — aged 12–36 months. The most consumed AOC cheese in France. Excellent melted in "une fondue comtoise".' },
      { fr: 'le chèvre', en: 'goat\'s cheese', note: 'Generic term for goat cheese — dozens of varieties. "Crottin de Chavignol" (Loire), "Sainte-Maure de Touraine". Warm chèvre salad = "salade de chèvre chaud" — a bistro staple.' },
      { fr: 'le munster', en: 'Munster', note: 'Pungent washed-rind cheese from Alsace — soft inside, powerful aroma. "Munster géromé" with caraway seeds. Strong cheese for strong constitutions.' },
      { fr: 'le reblochon', en: 'Reblochon', note: 'Creamy Savoyard cheese — the key ingredient of "la tartiflette" (potato, cream, and Reblochon gratin). Banned in the US — raw milk. A winter mountain delicacy.' },
    ],
  },
  'Desserts': {
    icon: '🍮',
    en: 'Desserts',
    intro: 'French pastry ("la pâtisserie") is an art form — the pastry chef ("le pâtissier") is as revered as the chef. These desserts represent the pinnacle of French confectionery craftsmanship.',
    items: [
      { fr: 'la crème brûlée', en: 'crème brûlée', note: 'Vanilla custard ("crème anglaise") with a caramelised sugar crust — cracked dramatically with a spoon. The "brûlée" (burned) crust is added last with a blowtorch ("un chalumeau").' },
      { fr: 'la tarte tatin', en: 'upside-down caramelised apple tart', note: 'Invented accidentally by the Tatin sisters at their Hôtel Tatin in Lamotte-Beuvron (1880s). Apples are cooked in butter and sugar, then covered with pastry and inverted when served.' },
      { fr: 'le macaron', en: 'French macaron', note: 'Delicate almond meringue shells sandwiching ganache or buttercream — NOT the coconut macaroon (un congolais). Ladurée and Pierre Hermé are the legendary Parisian macaroniers.' },
      { fr: 'le mille-feuille', en: 'mille-feuille / Napoleon', note: '"Thousand leaves" — layers of puff pastry and crème pâtissière, topped with fondant icing. The icing is traditionally patterned. Messy to eat, divine to taste.' },
      { fr: 'le profiterole', en: 'profiterole', note: 'Choux pastry balls filled with vanilla ice cream, drizzled with hot chocolate sauce. A French dinner party classic — often served in a tower ("un croquembouche" is the wedding version).' },
      { fr: 'le clafoutis', en: 'clafoutis', note: 'Cherry baked batter pudding from Limousin — traditional version uses unpitted cherries (the pits add flavour during baking). "Les cerises entières" = whole cherries.' },
      { fr: 'l\'île flottante', en: 'floating island', note: 'Poached meringue "floating" on crème anglaise — soft, light, delicate. A classic brasserie dessert. "Île flottante aux pralines" (with pink pralines) is the Lyon version.' },
    ],
  },
  'Boissons': {
    icon: '🍷',
    en: 'Drinks',
    intro: 'France is the world\'s most celebrated wine nation — but also produces exceptional spirits, ciders, and non-alcoholic drinks. The aperitif culture is as important as the food.',
    items: [
      { fr: 'le vin rouge / blanc / rosé', en: 'red / white / rosé wine', note: 'France produces 7 billion bottles annually. Main regions: Bordeaux (bold reds), Bourgogne (Pinot Noir, Chardonnay), Alsace (whites, Riesling), Rhône (Grenache), Loire, Provence (rosé).' },
      { fr: 'le champagne', en: 'Champagne', note: 'Sparkling wine that can legally only come from the Champagne region (Reims and Épernay). "Méthode champenoise" = secondary fermentation in bottle. Only 320 houses and 19,000 growers. Opening a sabre is "le sabrage".' },
      { fr: 'le cidre', en: 'cider (alcoholic)', note: 'Fermented apple cider — Normandy and Brittany specialties. Drunk in ceramic bowls ("bols") with galettes in Brittany. "Cidre doux" (sweet, low alcohol) vs "cidre brut" (dry, stronger).' },
      { fr: 'le pastis', en: 'pastis (anise-flavoured aperitif)', note: '"Pastis de Marseille" — diluted 1:5 with cold water, which turns it milky. Drunk before meals, especially in the south. Ricard and Pernod are the main brands. Never add ice before water.' },
      { fr: 'l\'apéritif (l\'apéro)', en: 'aperitif / pre-dinner drinks', note: '"Prendre l\'apéro" is a sacred French ritual — kir (white wine + blackcurrant liqueur), wine, or champagne with nibbles ("des amuse-bouches"). An apéritif can last 2 hours.' },
      { fr: 'le digestif', en: 'digestif (after-dinner drink)', note: 'After dessert and coffee: Cognac, Armagnac, Calvados (apple brandy from Normandy), or Chartreuse (the Chartreuse monks\'s secret herbal liqueur — 130 plants). Sipped slowly.' },
      { fr: 'le kir / kir royal', en: 'kir / kir royal (Champagne version)', note: '"Kir" = white Burgundy + blackcurrant liqueur ("crème de cassis"). "Kir royal" uses champagne. Named after Canon Félix Kir, wartime mayor of Dijon who popularised it.' },
    ],
  },
}

const RESTAURANT_PHRASES = [
  { fr: 'Une table pour deux, s\'il vous plaît.', en: 'A table for two, please.', note: 'Always specify number of people. "Avez-vous réservé ?" = have you reserved?' },
  { fr: 'Avez-vous une réservation ?', en: 'Do you have a reservation?', note: '"Une réservation" = a reservation. "Réserver une table" = to book a table.' },
  { fr: 'On peut avoir la carte, s\'il vous plaît ?', en: 'Can we have the menu, please?', note: 'Note: you ask for "la carte" (full menu). "Le menu" = set-price meal — a crucial distinction.' },
  { fr: 'C\'est quoi, la spécialité de la maison ?', en: 'What is the house speciality?', note: '"La maison" = the house/establishment. A great question that signals you\'re an engaged diner.' },
  { fr: 'Je suis allergique à… / Je ne mange pas de…', en: 'I\'m allergic to… / I don\'t eat…', note: 'Always tell the waiter — French kitchens can usually accommodate.' },
  { fr: 'Je voudrais la même chose que lui/elle.', en: 'I would like the same thing as him/her.', note: '"La même chose" = the same thing. Always "je voudrais" (I would like) not "je veux" (I want).' },
  { fr: 'L\'addition, s\'il vous plaît.', en: 'The bill, please.', note: '"L\'addition" = the bill. Service (15%) is always included. Tips are optional.' },
  { fr: 'C\'était délicieux — vous avez très bien cuisiné !', en: 'That was delicious — you cooked really well!', note: 'Always compliment the food — French cooks deeply appreciate it.' },
  { fr: 'Bon appétit !', en: 'Enjoy your meal! (lit. good appetite)', note: 'Said by the host or waiter before eating. Don\'t start until everyone has been served and "bon appétit" has been said.' },
  { fr: 'À votre santé ! / Santé !', en: 'Cheers! / To your health!', note: 'When toasting: always look into each other\'s eyes when clinking. Failure = 7 years\' bad luck (in French tradition).' },
]

const FOOD_CULTURE = [
  { emoji: '🏆', title: 'UNESCO Intangible Heritage', detail: 'In 2010, the "gastronomic meal of the French" was inscribed on UNESCO\'s Intangible Cultural Heritage list — the first time a food practice was recognised this way. The inscription covers not just food but the entire ritual: the choice of dishes, wine pairing, table setting, the progression of courses, the conversation. In 2022, the baguette tradition was added.' },
  { emoji: '⭐', title: 'The Michelin Guide', detail: 'Created in 1900 by the Michelin tyre company to encourage motoring (and thus tyre sales). One star = excellent. Two = worth a detour. Three = worth a journey. France has the second-most 3-star restaurants in the world after Japan. Losing a star has caused chefs to return them, resign, or fall into depression. The Michelin Red Guide is the most influential restaurant guide in history.' },
  { emoji: '🥖', title: 'Le pain quotidien — bread in France', detail: '"Le pain" is central to French identity. Every village has (or had) a boulangerie — their disappearance is mourned. French law requires a "boulangerie" to make bread on the premises — those who don\'t must call themselves a "dépôt de pain". 30 million baguettes are sold daily. 2022: the baguette tradition was inscribed as UNESCO Intangible Heritage.' },
  { emoji: '🧀', title: 'De Gaulle and the 246 cheeses', detail: '"Comment voulez-vous gouverner un pays qui a deux cent quarante-six variétés de fromage ?" (How can you govern a country that has 246 varieties of cheese?) — Charles de Gaulle. The actual number is over 1,200. France produces around 1.9 million tonnes of cheese annually. AOC/AOP certification protects 50+ French cheeses, guaranteeing their region and production method.' },
]

export default function FrenchFoodGuide() {
  const [activeSection, setActiveSection] = useState(null)
  const [tab, setTab] = useState('food')

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French Food Guide | SayBonjour!" description="French gastronomy vocabulary — breakfast to digestif, cheese, restaurant phrases, and French food culture." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">French Food Guide</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">La gastronomie française — from breakfast to digestif</p>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          {[
            { id: 'food', label: 'Food & Drink' },
            { id: 'phrases', label: 'Restaurant Phrases' },
            { id: 'culture', label: 'Food Culture' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${tab === t.id ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'food' && (
          <div className="space-y-4">
            {Object.entries(FOOD_CATEGORIES).map(([section, data], i) => {
              const isOpen = activeSection === section
              return (
                <motion.div key={section} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 overflow-hidden">
                  <button onClick={() => { setActiveSection(isOpen ? null : section); addXP(3, 'vocabulary') }}
                    className="w-full text-left px-6 py-4 flex items-center gap-4">
                    <span className="text-3xl">{data.icon}</span>
                    <div className="flex-1">
                      <h2 className="font-bold text-gray-900 dark:text-cream-50">{section}</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{data.en} · {data.items.length} items</p>
                    </div>
                    {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                        <div className="px-6 pb-6 border-t border-gray-50 dark:border-dark-warm-200 pt-4">
                          <p className="text-xs text-gray-500 dark:text-gray-400 italic mb-4">{data.intro}</p>
                          <div className="space-y-3">
                            {data.items.map(item => (
                              <div key={item.fr} className="flex items-start gap-3 bg-cream-50 dark:bg-dark-warm-200 rounded-xl px-4 py-3"
                                onClick={() => addXP(2, 'vocabulary')}>
                                <SpeakButton text={item.fr} size="sm" />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-semibold text-burgundy-700 dark:text-burgundy-vibrant-300 text-sm">{item.fr}</span>
                                    <span className="text-gray-500 dark:text-gray-400 text-xs">— {item.en}</span>
                                  </div>
                                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-1 italic">💡 {item.note}</p>
                                </div>
                              </div>
                            ))}
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

        {tab === 'phrases' && (
          <div className="space-y-3">
            {RESTAURANT_PHRASES.map((phrase, i) => (
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
            {FOOD_CULTURE.map((item, i) => (
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
