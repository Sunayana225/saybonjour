import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Star } from 'lucide-react'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import BookmarkButton from '../components/BookmarkButton'

const THEMES = [
  {
    id: 'food', name: 'Food & Drink', fr: 'La Nourriture et les Boissons', emoji: '🥐', color: 'bg-amber-50 border-amber-200',
    words: [
      { fr: 'le pain', en: 'bread' }, { fr: 'le fromage', en: 'cheese' }, { fr: 'le vin', en: 'wine' }, { fr: 'le beurre', en: 'butter' },
      { fr: 'l\'eau', en: 'water' }, { fr: 'le café', en: 'coffee' }, { fr: 'le thé', en: 'tea' }, { fr: 'la viande', en: 'meat' },
      { fr: 'le poisson', en: 'fish' }, { fr: 'les légumes', en: 'vegetables' }, { fr: 'les fruits', en: 'fruit' }, { fr: 'le sucre', en: 'sugar' },
      { fr: 'le sel', en: 'salt' }, { fr: 'l\'huile', en: 'oil' }, { fr: 'la farine', en: 'flour' }, { fr: 'l\'œuf', en: 'egg' },
      { fr: 'le lait', en: 'milk' }, { fr: 'la crème', en: 'cream' }, { fr: 'le croissant', en: 'croissant' }, { fr: 'la baguette', en: 'baguette' },
    ]
  },
  {
    id: 'body', name: 'The Body', fr: 'Le Corps Humain', emoji: '🫀', color: 'bg-red-50 border-red-200',
    words: [
      { fr: 'la tête', en: 'head' }, { fr: 'les yeux', en: 'eyes' }, { fr: 'le nez', en: 'nose' }, { fr: 'la bouche', en: 'mouth' },
      { fr: 'les oreilles', en: 'ears' }, { fr: 'les cheveux', en: 'hair' }, { fr: 'le cou', en: 'neck' }, { fr: 'les épaules', en: 'shoulders' },
      { fr: 'la main', en: 'hand' }, { fr: 'le bras', en: 'arm' }, { fr: 'le dos', en: 'back' }, { fr: 'le ventre', en: 'stomach' },
      { fr: 'la jambe', en: 'leg' }, { fr: 'le pied', en: 'foot' }, { fr: 'le genou', en: 'knee' }, { fr: 'le cœur', en: 'heart' },
    ]
  },
  {
    id: 'home', name: 'Home & House', fr: 'La Maison', emoji: '🏠', color: 'bg-blue-50 border-blue-200',
    words: [
      { fr: 'la cuisine', en: 'kitchen' }, { fr: 'le salon', en: 'living room' }, { fr: 'la chambre', en: 'bedroom' }, { fr: 'la salle de bains', en: 'bathroom' },
      { fr: 'la porte', en: 'door' }, { fr: 'la fenêtre', en: 'window' }, { fr: 'le canapé', en: 'sofa' }, { fr: 'la table', en: 'table' },
      { fr: 'la chaise', en: 'chair' }, { fr: 'le lit', en: 'bed' }, { fr: 'l\'armoire', en: 'wardrobe' }, { fr: 'le jardin', en: 'garden' },
      { fr: 'le toit', en: 'roof' }, { fr: 'l\'escalier', en: 'stairs' }, { fr: 'le couloir', en: 'hallway' }, { fr: 'le garage', en: 'garage' },
    ]
  },
  {
    id: 'family', name: 'Family', fr: 'La Famille', emoji: '👨‍👩‍👧‍👦', color: 'bg-purple-50 border-purple-200',
    words: [
      { fr: 'le père', en: 'father' }, { fr: 'la mère', en: 'mother' }, { fr: 'le frère', en: 'brother' }, { fr: 'la sœur', en: 'sister' },
      { fr: 'les parents', en: 'parents' }, { fr: 'le fils', en: 'son' }, { fr: 'la fille', en: 'daughter' }, { fr: 'le mari', en: 'husband' },
      { fr: 'la femme', en: 'wife' }, { fr: 'les grands-parents', en: 'grandparents' }, { fr: 'le grand-père', en: 'grandfather' }, { fr: 'la grand-mère', en: 'grandmother' },
      { fr: 'l\'oncle', en: 'uncle' }, { fr: 'la tante', en: 'aunt' }, { fr: 'le cousin / la cousine', en: 'cousin' }, { fr: 'les enfants', en: 'children' },
    ]
  },
  {
    id: 'animals', name: 'Animals', fr: 'Les Animaux', emoji: '🐘', color: 'bg-green-50 border-green-200',
    words: [
      { fr: 'le chien', en: 'dog' }, { fr: 'le chat', en: 'cat' }, { fr: 'le cheval', en: 'horse' }, { fr: 'la vache', en: 'cow' },
      { fr: 'le mouton', en: 'sheep' }, { fr: 'le cochon', en: 'pig' }, { fr: 'la poule', en: 'hen' }, { fr: 'le lapin', en: 'rabbit' },
      { fr: 'l\'oiseau', en: 'bird' }, { fr: 'le poisson', en: 'fish' }, { fr: 'le serpent', en: 'snake' }, { fr: 'le lion', en: 'lion' },
      { fr: 'l\'éléphant', en: 'elephant' }, { fr: 'la grenouille', en: 'frog' }, { fr: 'le papillon', en: 'butterfly' }, { fr: 'l\'abeille', en: 'bee' },
    ]
  },
  {
    id: 'clothing', name: 'Clothing', fr: 'Les Vêtements', emoji: '👗', color: 'bg-pink-50 border-pink-200',
    words: [
      { fr: 'le pantalon', en: 'trousers / pants' }, { fr: 'la chemise', en: 'shirt' }, { fr: 'la robe', en: 'dress' }, { fr: 'la jupe', en: 'skirt' },
      { fr: 'le manteau', en: 'coat' }, { fr: 'la veste', en: 'jacket' }, { fr: 'les chaussures', en: 'shoes' }, { fr: 'les chaussettes', en: 'socks' },
      { fr: 'le chapeau', en: 'hat' }, { fr: 'l\'écharpe', en: 'scarf' }, { fr: 'les gants', en: 'gloves' }, { fr: 'le pull', en: 'jumper / sweater' },
    ]
  },
  {
    id: 'colours', name: 'Colours', fr: 'Les Couleurs', emoji: '🎨', color: 'bg-yellow-50 border-yellow-200',
    words: [
      { fr: 'rouge', en: 'red' }, { fr: 'bleu(e)', en: 'blue' }, { fr: 'vert(e)', en: 'green' }, { fr: 'jaune', en: 'yellow' },
      { fr: 'orange', en: 'orange' }, { fr: 'violet(te)', en: 'purple' }, { fr: 'rose', en: 'pink' }, { fr: 'noir(e)', en: 'black' },
      { fr: 'blanc(he)', en: 'white' }, { fr: 'gris(e)', en: 'grey' }, { fr: 'marron', en: 'brown' }, { fr: 'beige', en: 'beige' },
    ]
  },
  {
    id: 'weather', name: 'Weather', fr: 'La Météo', emoji: '☀️', color: 'bg-sky-50 border-sky-200',
    words: [
      { fr: 'le soleil', en: 'sun' }, { fr: 'la pluie', en: 'rain' }, { fr: 'le vent', en: 'wind' }, { fr: 'la neige', en: 'snow' },
      { fr: 'le nuage', en: 'cloud' }, { fr: 'l\'orage', en: 'storm / thunderstorm' }, { fr: 'le brouillard', en: 'fog' }, { fr: 'la chaleur', en: 'heat' },
      { fr: 'le froid', en: 'cold' }, { fr: 'il fait beau', en: 'the weather is nice' }, { fr: 'il pleut', en: 'it is raining' }, { fr: 'il neige', en: 'it is snowing' },
    ]
  },
  {
    id: 'transport', name: 'Transport', fr: 'Les Transports', emoji: '🚂', color: 'bg-indigo-50 border-indigo-200',
    words: [
      { fr: 'la voiture', en: 'car' }, { fr: 'le train', en: 'train' }, { fr: 'l\'avion', en: 'plane' }, { fr: 'le bus', en: 'bus' },
      { fr: 'le métro', en: 'metro / subway' }, { fr: 'le vélo', en: 'bicycle' }, { fr: 'le taxi', en: 'taxi' }, { fr: 'le bateau', en: 'boat' },
      { fr: 'la moto', en: 'motorbike' }, { fr: 'le tramway', en: 'tram' }, { fr: 'la gare', en: 'train station' }, { fr: 'l\'aéroport', en: 'airport' },
    ]
  },
  {
    id: 'school', name: 'School & Study', fr: 'L\'École', emoji: '📚', color: 'bg-teal-50 border-teal-200',
    words: [
      { fr: 'le livre', en: 'book' }, { fr: 'le cahier', en: 'exercise book / notebook' }, { fr: 'le stylo', en: 'pen' }, { fr: 'le crayon', en: 'pencil' },
      { fr: 'la règle', en: 'ruler' }, { fr: 'le professeur', en: 'teacher' }, { fr: 'l\'élève', en: 'pupil / student' }, { fr: 'la classe', en: 'classroom / class' },
      { fr: 'le tableau', en: 'board / blackboard' }, { fr: 'les devoirs', en: 'homework' }, { fr: 'l\'examen', en: 'exam' }, { fr: 'la récréation', en: 'break time' },
    ]
  },
  {
    id: 'sports', name: 'Sports & Leisure', fr: 'Le Sport', emoji: '⚽', color: 'bg-orange-50 border-orange-200',
    words: [
      { fr: 'le football', en: 'football / soccer' }, { fr: 'le tennis', en: 'tennis' }, { fr: 'la natation', en: 'swimming' }, { fr: 'le cyclisme', en: 'cycling' },
      { fr: 'la course', en: 'running / race' }, { fr: 'le ski', en: 'skiing' }, { fr: 'le rugby', en: 'rugby' }, { fr: 'la piscine', en: 'swimming pool' },
      { fr: 'le stade', en: 'stadium' }, { fr: 'jouer', en: 'to play' }, { fr: 'nager', en: 'to swim' }, { fr: 'courir', en: 'to run' },
    ]
  },
  {
    id: 'emotions', name: 'Emotions', fr: 'Les Émotions', emoji: '😊', color: 'bg-rose-50 border-rose-200',
    words: [
      { fr: 'heureux / heureuse', en: 'happy' }, { fr: 'triste', en: 'sad' }, { fr: 'en colère', en: 'angry' }, { fr: 'fatigué(e)', en: 'tired' },
      { fr: 'surpris(e)', en: 'surprised' }, { fr: 'inquiet / inquiète', en: 'worried / anxious' }, { fr: 'amoureux / amoureuse', en: 'in love' }, { fr: 'fier / fière', en: 'proud' },
      { fr: 'déçu(e)', en: 'disappointed' }, { fr: 'effrayé(e)', en: 'scared / frightened' }, { fr: 'jaloux / jalouse', en: 'jealous' }, { fr: 'soulagé(e)', en: 'relieved' },
    ]
  },
]

export default function VocabularyThemes() {
  const [selected, setSelected] = useState('food')
  const [search, setSearch] = useState('')
  const [quiz, setQuiz] = useState(null)

  const theme = THEMES.find(t => t.id === selected)
  const filtered = theme?.words.filter(w => !search || w.fr.toLowerCase().includes(search.toLowerCase()) || w.en.toLowerCase().includes(search.toLowerCase())) || []

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="Vocabulary Themes | SayBonjour!" description="Learn French vocabulary by theme — food, family, home, animals, clothing, colours, and more." />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">Vocabulary by Theme</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Le Vocabulaire par Thème</p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-8">
          {THEMES.map(t => (
            <button key={t.id} onClick={() => { setSelected(t.id); setSearch('') }}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all text-center ${selected === t.id ? 'border-burgundy-500 bg-burgundy-50 dark:bg-burgundy-900/20' : 'border-gray-200 dark:border-dark-warm-50 bg-white dark:bg-dark-warm-100 hover:border-burgundy-300'}`}>
              <span className="text-2xl">{t.emoji}</span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 leading-tight">{t.name}</span>
            </button>
          ))}
        </div>

        {theme && (
          <motion.div key={selected} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-cream-50">{theme.emoji} {theme.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{theme.fr} · {theme.words.length} words</p>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter…"
                  className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 dark:border-dark-warm-50 rounded-lg bg-white dark:bg-dark-warm-100 text-gray-900 dark:text-cream-50 focus:outline-none w-40" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filtered.map((w, i) => (
                <motion.div key={w.fr} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                  className="bg-white dark:bg-dark-warm-100 rounded-xl border border-gray-100 dark:border-dark-warm-50 shadow-sm px-4 py-3 flex items-center justify-between gap-3 group hover:border-burgundy-200 transition-colors">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-cream-50">{w.fr}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{w.en}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <SpeakButton text={w.fr} lang="fr-FR" size="sm" />
                    <BookmarkButton item={{ id: `theme_${selected}_${i}`, type: 'vocabulary', title: w.fr, description: w.en }} size="sm" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
