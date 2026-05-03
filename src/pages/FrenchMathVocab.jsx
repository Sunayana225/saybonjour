import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, Plus, Minus } from 'lucide-react'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const MATH_SECTIONS = [
  {
    category: 'Basic Operations — Les opérations de base',
    emoji: '➕',
    items: [
      { fr: 'l\'addition (f)', en: 'addition', note: '3 + 4 = 7 → "trois plus quatre égale sept" or "trois et quatre font sept".' },
      { fr: 'la soustraction', en: 'subtraction', note: '10 − 3 = 7 → "dix moins trois égale sept". "Soustraire" = to subtract.' },
      { fr: 'la multiplication', en: 'multiplication', note: '6 × 7 = 42 → "six fois sept égale quarante-deux". "Les tables de multiplication" = times tables (memorised in primary school).' },
      { fr: 'la division', en: 'division', note: '20 ÷ 4 = 5 → "vingt divisé par quatre égale cinq". "Le dividende" = dividend, "le diviseur" = divisor, "le quotient" = quotient.' },
      { fr: 'égale / font', en: 'equals', note: '"2 et 2 font 4" = 2 and 2 make 4 (common in speech). "égale" is also used: "2 + 2 égale 4".' },
      { fr: 'plus', en: 'plus', note: '"Plus" = plus (addition). But careful: "de plus en plus" = more and more. "Plus" alone can negate or add!' },
      { fr: 'moins', en: 'minus / less', note: '"Moins" = minus (subtraction). "Au moins" = at least. "À moins que" = unless.' },
      { fr: 'fois', en: 'times (multiplication)', note: '"Trois fois quatre" = three times four. "Combien de fois ?" = how many times? "Une fois" = once.' },
      { fr: 'divisé par', en: 'divided by', note: '"12 divisé par 3 égale 4". "Division euclidienne" = integer division (with remainder).' },
      { fr: 'le reste', en: 'the remainder', note: '"12 divisé par 5 = 2, reste 2" = 12 ÷ 5 = 2 remainder 2.' },
      { fr: 'la puissance', en: 'power / exponent', note: '"2 à la puissance 3" = 2³ = 8. "Au carré" = squared. "Au cube" = cubed.' },
      { fr: 'la racine carrée', en: 'square root', note: '"La racine carrée de 16 est 4." "√16 = 4." Symbol: √ (radical sign = le radical).' },
    ],
  },
  {
    category: 'Shapes & Geometry — Les formes et la géométrie',
    emoji: '📐',
    items: [
      { fr: 'un carré', en: 'a square', note: '"Un carré parfait" = a perfect square. Area = "côté²".' },
      { fr: 'un rectangle', en: 'a rectangle', note: 'Area = "longueur × largeur". "Un rectangle d\'or" = the golden rectangle.' },
      { fr: 'un triangle', en: 'a triangle', note: '"Équilatéral" (all sides equal), "isocèle" (two equal), "scalène" (none equal), "rectangle" (right-angled).' },
      { fr: 'un cercle', en: 'a circle', note: '"Le cercle" = the circle. "La circonférence" = circumference. "Le rayon" = radius. "Le diamètre" = diameter. "π (pi) ≈ 3,14159".' },
      { fr: 'un ovale', en: 'an oval / ellipse', note: '"Un ovale" in everyday speech. "Une ellipse" in formal mathematics.' },
      { fr: 'un pentagone', en: 'a pentagon', note: '5 sides. "Un pentagone régulier" = regular pentagon.' },
      { fr: 'un hexagone', en: 'a hexagon', note: 'France is nicknamed "l\'hexagone" because its territory (mainland) roughly resembles a hexagon!' },
      { fr: 'un cube', en: 'a cube', note: '6 square faces. Volume = côté³. "Un dé à jouer" = a die (also a cube shape).' },
      { fr: 'une sphère', en: 'a sphere', note: '"Le globe terrestre" is a sphere. Volume = (4/3)πr³.' },
      { fr: 'un cylindre', en: 'a cylinder', note: '"Une boîte de conserve" = a tin can (cylindrical shape).' },
      { fr: 'un cône', en: 'a cone', note: '"Un cornet de glace" = an ice cream cone. Volume = (1/3)πr²h.' },
      { fr: 'un angle', en: 'an angle', note: '"Un angle aigu" = acute (< 90°). "Un angle droit" = right (90°). "Un angle obtus" = obtuse (90–180°). "Un angle plat" = straight (180°).' },
      { fr: 'le périmètre', en: 'perimeter', note: '"Le périmètre du rectangle" = 2(longueur + largeur). "La circonférence" for circles.' },
      { fr: 'la surface / l\'aire (f)', en: 'area (surface area)', note: '"Calculer l\'aire du triangle" = calculate the area of the triangle. S = ½ × base × hauteur.' },
      { fr: 'le volume', en: 'volume', note: '"Le volume d\'une boîte" = the volume of a box. V = longueur × largeur × hauteur.' },
    ],
  },
  {
    category: 'Numbers & Types — Les types de nombres',
    emoji: '🔢',
    items: [
      { fr: 'un nombre entier', en: 'a whole number / integer', note: '"Entier" = whole/complete. Integers: …-3, -2, -1, 0, 1, 2, 3… "Entier naturel" = natural number (positive integers).' },
      { fr: 'un nombre pair', en: 'an even number', note: 'Divisible by 2: 2, 4, 6, 8… "Pair" also means even/equal in other contexts.' },
      { fr: 'un nombre impair', en: 'an odd number', note: 'Not divisible by 2: 1, 3, 5, 7… "Impair" = odd/uneven.' },
      { fr: 'un nombre premier', en: 'a prime number', note: 'Divisible only by 1 and itself: 2, 3, 5, 7, 11… "Est-ce que 17 est premier ?" Yes!' },
      { fr: 'une fraction', en: 'a fraction', note: '"Un tiers" = 1/3. "Un quart" = 1/4. "Trois quarts" = 3/4. "Une demi" = 1/2.' },
      { fr: 'le numérateur', en: 'the numerator', note: 'The top number of a fraction. "Numérateur" = numerator.' },
      { fr: 'le dénominateur', en: 'the denominator', note: 'The bottom number. "Mettre au même dénominateur" = to find a common denominator.' },
      { fr: 'un nombre décimal', en: 'a decimal number', note: 'In France, the decimal separator is a COMMA: 3,14 not 3.14. "La virgule" = decimal point (comma). Critically different from English!' },
      { fr: 'la virgule', en: 'decimal point (comma in French)', note: '"3,14" = 3.14 in French. "La virgule flottante" = floating point. "Arrondir à deux décimales" = round to 2 decimal places.' },
      { fr: 'un pourcentage (%)', en: 'a percentage', note: '"50% de 200 = 100." "En pourcentage" = as a percentage. "Calculer le taux de…" = calculate the rate of…' },
      { fr: 'un nombre positif / négatif', en: 'a positive / negative number', note: '"Un nombre positif" > 0. "Un nombre négatif" < 0. "La valeur absolue" = absolute value.' },
      { fr: 'l\'infini (∞)', en: 'infinity', note: '"Tendre vers l\'infini" = to approach infinity. "C\'est l\'infini !" Said in maths class and sometimes in everyday French for dramatic effect.' },
    ],
  },
  {
    category: 'Measurements — Les mesures',
    emoji: '📏',
    items: [
      { fr: 'le mètre (m)', en: 'metre', note: 'The metre was defined in France in 1793 as one ten-millionth of the distance from the North Pole to the equator through Paris.' },
      { fr: 'le centimètre (cm)', en: 'centimetre', note: '100cm = 1m. "Un centimètre de pluie" = a centimetre of rainfall.' },
      { fr: 'le kilomètre (km)', en: 'kilometre', note: '1km = 1,000m. Speed: "kilomètres à l\'heure (km/h)" — France uses km/h not mph.' },
      { fr: 'le kilogramme (kg)', en: 'kilogram', note: '1kg = 1,000g. "Peser 75 kilos" = to weigh 75 kg. France uses metric exclusively — no pounds or ounces.' },
      { fr: 'le gramme (g)', en: 'gram', note: '"50 grammes de beurre" = 50g of butter. "Une livre" = 500g in French markets (half a kilo — different from the English pound!).' },
      { fr: 'le litre (l)', en: 'litre', note: '1 litre of water = 1kg. "Un demi-litre" = half a litre = 50cl. "Un centilitre (cl)" = 0.01 litre.' },
      { fr: 'la longueur', en: 'length', note: '"La longueur" = length. "Mesurer la longueur" = to measure the length. "Quelle est la longueur ?" = what is the length?' },
      { fr: 'la largeur', en: 'width', note: '"La largeur" = width. "En largeur" = widthways.' },
      { fr: 'la hauteur', en: 'height', note: '"La hauteur" = height (of an object). "La taille" = height (of a person). "En hauteur" = vertically.' },
      { fr: 'la profondeur', en: 'depth', note: '"La profondeur de l\'océan" = the depth of the ocean. "En profondeur" = in depth (also figurative).' },
      { fr: 'la superficie', en: 'area / surface area', note: '"La superficie de la France" = 551,695 km². "La superficie du logement" = the floor area of the property.' },
    ],
  },
]

const CLASSROOM_PHRASES = [
  { fr: 'Combien font 7 et 8 ?', en: 'What is 7 and 8? / How much is 7 plus 8?', note: '"Font" = make/equal (from "faire"). "Combien font" is used for addition in French.' },
  { fr: 'Quelle est la réponse ?', en: 'What is the answer?', note: '"La réponse" = the answer. "La bonne réponse" = the correct answer.' },
  { fr: 'C\'est faux. La bonne réponse est…', en: 'That\'s wrong. The right answer is…', note: '"C\'est faux" = that\'s wrong. "C\'est juste" = that\'s right.' },
  { fr: 'Résoudre l\'équation.', en: 'Solve the equation.', note: '"Résoudre" = to solve. "Une équation du premier degré" = a linear equation.' },
  { fr: 'Calculez la surface du rectangle.', en: 'Calculate the area of the rectangle.', note: '"Calculer" = to calculate. "La surface / l\'aire" = area.' },
  { fr: 'Arrondir à deux décimales après la virgule.', en: 'Round to two decimal places.', note: '"Arrondir" = to round. "Arrondir au supérieur" = round up. "Arrondir à l\'inférieur" = round down.' },
  { fr: 'Posez votre règle et votre compas.', en: 'Put out your ruler and compass.', note: '"Poser" = to place/put down. Beginning of a geometry exercise.' },
  { fr: 'Faire la moyenne de ces résultats.', en: 'Find the average of these results.', note: '"La moyenne" = the average/mean. "La médiane" = the median. "Le mode" = the mode.' },
  { fr: 'Démontrez que ABC est un triangle rectangle.', en: 'Prove that ABC is a right-angled triangle.', note: '"Démontrer" = to prove/demonstrate. "Un triangle rectangle" = right-angled triangle.' },
  { fr: 'Posez l\'opération en colonne.', en: 'Set out the calculation in columns.', note: '"Poser en colonne" = to set out vertically (long multiplication/division method).' },
  { fr: 'Le résultat est approximativement égal à…', en: 'The result is approximately equal to…', note: '"Approximativement" = approximately. "≈" = approximately equal to.' },
]

const MATHS_CULTURE = [
  { emoji: '🏅', title: 'France and mathematics', detail: 'France has produced some of the world\'s greatest mathematicians — René Descartes (Cartesian coordinates), Blaise Pascal (probability theory), Pierre de Fermat (Fermat\'s Last Theorem), Henri Poincaré, and many more. More French mathematicians have won the Fields Medal (mathematics\' highest honour) than any other nationality. Mathematics is the most prestigious and competitive subject in French education.' },
  { emoji: ',', title: 'La virgule — the crucial decimal difference', detail: 'In France, the decimal separator is a comma, not a point: 3,14159 not 3.14159. Spaces (not commas) separate thousands: 1 000 000 not 1,000,000. This catches out many English speakers. In formal French maths, "la virgule flottante" = floating point. Getting this wrong in an exam costs marks.' },
  { emoji: '🇫🇷', title: 'France = L\'Hexagone', detail: 'Metropolitan France is nicknamed "l\'Hexagone" because its land borders and coastline roughly form a six-sided polygon — a hexagon. This is used affectionately and politically: "en Hexagone" = in mainland France (as opposed to overseas territories). It reflects how deeply mathematical language has penetrated French national identity.' },
  { emoji: '📐', title: 'The metric system — a French invention', detail: 'The metric system was invented in France during the Revolution (1795) as part of the drive for rational, universal measurement. France defined the metre, the kilogram, and the litre. The International System of Units (SI) descends directly from this French revolutionary project. Only the US, Myanmar and Liberia have not adopted the metric system.' },
]

export default function FrenchMathVocab() {
  const [activeCategory, setActiveCategory] = useState(0)
  const [tab, setTab] = useState('vocab')

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French Maths Vocabulary | SayBonjour!" description="Learn French maths vocabulary — operations, shapes, numbers, measurements, and French maths culture." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">French Maths Vocabulary</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Les mathématiques — numbers, shapes, operations, and French maths culture</p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-700 rounded-xl px-4 py-3 text-sm text-blue-800 dark:text-blue-300 mb-6 flex items-start gap-2">
          <Calculator size={16} className="shrink-0 mt-0.5" />
          <span>In France: decimal separator is a comma (virgule): <strong>3,14</strong>. Thousands use spaces: <strong>1 000 000</strong>. "Les maths" is feminine plural — "les maths sont passionnantes".</span>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          {[
            { id: 'vocab', label: 'Vocabulary' },
            { id: 'classroom', label: 'Classroom Phrases' },
            { id: 'culture', label: 'Maths Culture' },
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
              {MATH_SECTIONS.map((cat, i) => (
                <button key={cat.category} onClick={() => { setActiveCategory(i); addXP(3, 'vocabulary') }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeCategory === i ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
                  {cat.emoji} {cat.category.split('—')[0].trim()}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {MATH_SECTIONS[activeCategory].items.map((item, i) => (
                <motion.div key={item.fr} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="bg-white dark:bg-dark-warm-100 rounded-xl shadow border border-gray-100 dark:border-dark-warm-50 px-4 py-3 flex items-start gap-3"
                  onClick={() => addXP(2, 'vocabulary')}>
                  <SpeakButton text={item.fr} size="sm" />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm text-burgundy-700 dark:text-burgundy-vibrant-300">{item.fr}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">— {item.en}</span>
                    </div>
                    {item.note && <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5 italic">💡 {item.note}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {tab === 'classroom' && (
          <div className="space-y-3">
            {CLASSROOM_PHRASES.map((phrase, i) => (
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
            {MATHS_CULTURE.map((item, i) => (
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
