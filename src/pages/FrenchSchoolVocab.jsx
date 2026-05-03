import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, GraduationCap } from 'lucide-react'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const SCHOOL_VOCAB = [
  {
    category: 'School Supplies — La papeterie',
    emoji: '✏️',
    items: [
      { fr: 'un cahier', en: 'an exercise book', note: '"Un cahier de brouillon" = a rough work book. "Un cahier de textes" = the homework diary — every French student has one.' },
      { fr: 'un stylo', en: 'a pen (biro)', note: 'Bic is the iconic French brand — invented by Marcel Bich in Paris in 1945. French pupils traditionally use fountain pens ("un stylo plume") for cursive writing.' },
      { fr: 'un stylo à plume / un porte-plume', en: 'a fountain pen', note: 'French schools famously teach cursive handwriting ("l\'écriture cursive") — fountain pens and cartridges are school essentials in many primaries.' },
      { fr: 'un crayon', en: 'a pencil', note: '"Crayon de couleur" = coloured pencil. "Un crayon gras" = a wax crayon. Note: "crayon" comes from "craie" (chalk).' },
      { fr: 'une gomme', en: 'a rubber / eraser', note: '"La colle" also means detention in French slang — "mettre en colle" = to give a detention.' },
      { fr: 'une règle', en: 'a ruler', note: '30cm rulers are standard issue. "Une règle graduée" = a graduated ruler.' },
      { fr: 'un compas', en: 'a compass (drawing tool)', note: 'Essential for geometry — French pupils learn geometric construction early.' },
      { fr: 'un rapporteur', en: 'a protractor', note: 'For measuring angles ("les angles"). "Un angle aigu" = acute. "Un angle obtus" = obtuse.' },
      { fr: 'une équerre', en: 'a set square', note: 'For right angles — used alongside the ruler and compas in French geometry lessons.' },
      { fr: 'un classeur', en: 'a ring binder / folder', note: '"Un classeur à anneaux" = ring binder. French pupils keep loose sheets in classeurs rather than spiral notebooks.' },
      { fr: 'un livre / un manuel', en: 'a textbook', note: '"Le manuel scolaire" = the school textbook. In France, textbooks are usually provided by the school — not purchased.' },
      { fr: 'un dictionnaire', en: 'a dictionary', note: '"Le Larousse" and "le Robert" are the two great French dictionaries — both venerable cultural institutions.' },
      { fr: 'une colle / de la colle', en: 'glue', note: '"Colle" = glue, but also slang for detention ("une colle") and for an oral exam question. Richly polysemous!' },
      { fr: 'des ciseaux', en: 'scissors', note: 'Always plural in French — "une paire de ciseaux" = a pair of scissors.' },
      { fr: 'un taille-crayon', en: 'a pencil sharpener', note: '"Tailler" = to sharpen/cut. "Taille-crayon" = thing that sharpens pencils.' },
      { fr: 'un surligneur', en: 'a highlighter', note: '"Surligner" = to highlight. Colour-coded highlighting of course notes is a classic French student study technique.' },
    ],
  },
  {
    category: 'Subjects — Les matières',
    emoji: '📚',
    items: [
      { fr: 'le français', en: 'French (language & literature)', note: 'The most prestigious subject — compulsory throughout. The "épreuve de français" (French exam) at the bac is taken in Première (age 16-17).' },
      { fr: 'les mathématiques (les maths)', en: 'mathematics', note: '"Les maths" — feminine plural. France has a strong mathematics culture — Fields Medal recipients include many French mathematicians.' },
      { fr: 'l\'histoire-géographie', en: 'history and geography', note: 'Always taught together by the same teacher in France — unique to the French system. History and geographical knowledge are considered inseparable.' },
      { fr: 'les sciences (SVT)', en: 'biology & earth sciences', note: '"SVT" = Sciences de la Vie et de la Terre (life sciences and earth sciences). A crucial science subject alongside physique-chimie.' },
      { fr: 'la physique-chimie', en: 'physics and chemistry', note: 'Taught as a combined subject. French science education is theory-heavy — long on theory, shorter on practical work.' },
      { fr: 'l\'anglais', en: 'English (as a foreign language)', note: 'Almost universally the first foreign language (LV1 = Langue Vivante 1). 99% of French pupils study English.' },
      { fr: 'une langue vivante (LV1, LV2)', en: 'a modern language', note: '"LV1" = first language (from age 6). "LV2" = second language (from age 11). Options include German, Spanish, Chinese, Arabic, Italian.' },
      { fr: 'l\'éducation physique et sportive (EPS)', en: 'PE / physical education', note: '"EPS" is graded at the bac! Unusual in Europe — physical education is taken as seriously as academic subjects.' },
      { fr: 'les arts plastiques', en: 'visual arts / art', note: '"Arts plastiques" = fine arts/visual arts (painting, sculpture, design). "Arts appliqués" = applied arts.' },
      { fr: 'la musique', en: 'music', note: '"L\'éducation musicale" — taught to all pupils at collège. France has a strong tradition of music education.' },
      { fr: 'la philosophie', en: 'philosophy', note: 'COMPULSORY for all Terminale (final year) pupils. A uniquely French feature of secondary education — the bac philosophy essay ("la dissert de philo") is a cultural rite of passage.' },
      { fr: 'l\'éducation civique / l\'EMC', en: 'civics / citizenship education', note: '"EMC" = Enseignement Moral et Civique. Teaches republican values, laïcité, democracy, and citizens\' rights and duties.' },
      { fr: 'la technologie', en: 'technology / design & technology', note: 'Taught at collège — covers engineering, digital technology, CAD design.' },
      { fr: 'les sciences économiques et sociales (SES)', en: 'economics and social sciences', note: 'A prestigious choice for the Bac général — introduces pupils to economics, sociology, and political science.' },
    ],
  },
  {
    category: 'School System — Le système scolaire',
    emoji: '🏫',
    items: [
      { fr: 'la maternelle', en: 'nursery school (ages 3–6)', note: 'Three sections: "petite section" (3-4), "moyenne section" (4-5), "grande section" (5-6). Now compulsory from age 3 since 2019.' },
      { fr: 'l\'école primaire / l\'école élémentaire', en: 'primary school (ages 6–11)', note: 'Five levels: CP (6), CE1 (7), CE2 (8), CM1 (9), CM2 (10). "CP" = "cours préparatoire" — first year of reading.' },
      { fr: 'le collège', en: 'lower secondary school (ages 11–15)', note: 'Four classes: "sixième" (Year 7), "cinquième", "quatrième", "troisième" (Year 10). Ends with the "Brevet".' },
      { fr: 'le lycée', en: 'upper secondary school / sixth form (ages 15–18)', note: 'Three years: "seconde" (Year 11), "première" (Year 12), "terminale" (Year 13). Leads to the bac.' },
      { fr: 'le baccalauréat (le bac)', en: 'school-leaving exam (age 18)', note: 'The famous French leaving exam — exists since Napoleon (1808). The bac général, technologique, and professionnel are the three pathways. 88%+ pass rate now.' },
      { fr: 'les grandes écoles', en: 'elite higher education institutions', note: 'Sciences Po, HEC, Polytechnique ("l\'X"), ENS — more prestigious than universities. Require "les classes prépa" (2 years of intensive preparation).' },
      { fr: 'les classes préparatoires (les prépas)', en: 'intensive pre-grandes écoles courses', note: '"Les prépas" are 2 years of very intense post-bac study before competitive "concours" (entry exams) for grandes écoles.' },
      { fr: 'l\'université', en: 'university', note: 'Public French universities are inexpensive (≈€200/year). Acceptance is by file/grade — no interview. Competition for selective courses like medicine is fierce.' },
      { fr: 'la rentrée', en: 'return to school (early September)', note: '"La rentrée" is one of France\'s biggest cultural moments — shops stock school supplies, politicians make announcements. The entire country restructures itself.' },
      { fr: 'les grandes vacances', en: 'summer holidays (July–August)', note: 'France has one of Europe\'s longest school summers — July and August. The country functionally empties. "L\'exode estival" = the summer migration to the countryside and coast.' },
      { fr: 'la cantine', en: 'school canteen / cafeteria', note: 'French school lunches are famously nutritious — a proper multi-course meal. Lyon employs professional chefs. A model internationally envied.' },
      { fr: 'le brevet', en: 'lower secondary leaving exam (age 15)', note: 'Taken at the end of "troisième" (age 15) — a national exam in maths, French, and history-geography. A rite of passage.' },
    ],
  },
  {
    category: 'Classroom Language — En classe',
    emoji: '🗣️',
    items: [
      { fr: 'Asseyez-vous !', en: 'Sit down!', note: 'Imperative plural — formal. "Assieds-toi" = sit down (singular informal).' },
      { fr: 'Ouvrez vos livres à la page…', en: 'Open your books to page…', note: '"Ouvrir" = to open. "À la page 47" = at page 47.' },
      { fr: 'Faites l\'exercice numéro…', en: 'Do exercise number…', note: '"Faites" = do/make (imperative plural from "faire").' },
      { fr: 'Levez la main.', en: 'Put your hand up.', note: '"Levez" = raise (imperative plural). "Baisser la main" = put your hand down.' },
      { fr: 'Je ne comprends pas.', en: 'I don\'t understand.', note: '"Je n\'ai pas compris" = I didn\'t understand (past). "Pouvez-vous expliquer encore ?" = can you explain again?' },
      { fr: 'Pouvez-vous répéter, s\'il vous plaît ?', en: 'Can you repeat that, please?', note: '"Répéter" = to repeat. "Plus lentement, s\'il vous plaît" = more slowly, please.' },
      { fr: 'Comment dit-on… en français ?', en: 'How do you say… in French?', note: 'Invaluable question for language learners.' },
      { fr: 'Rendez vos devoirs.', en: 'Hand in your homework.', note: '"Rendre" = to hand in / return. "Les devoirs" = homework. "Les devoirs du soir" = evening homework.' },
      { fr: 'Taisez-vous !', en: 'Be quiet! / Silence!', note: '"Se taire" = to be quiet. "Silence !" is also used. "Chut !" = shush.' },
      { fr: 'Bon courage !', en: 'Good luck! / Keep going! / Hang in there!', note: '"Bon courage" is more supportive than "bonne chance" (good luck). Said before exams, hard tasks, and challenges.' },
      { fr: 'Prenez note.', en: 'Take notes.', note: '"Prendre des notes" = to take notes. "Notez bien" = note this carefully. "Relevez" = write down.' },
      { fr: 'Travaillez en binômes.', en: 'Work in pairs.', note: '"En binômes" = in pairs. "En groupes" = in groups. "Individuellement" = individually.' },
      { fr: 'Corrigez vos erreurs.', en: 'Correct your mistakes.', note: '"Une erreur" = a mistake. "Une faute" = a fault/error (sometimes more serious). "Corriger" = to correct.' },
    ],
  },
]

const GRADING = [
  { grade: '20/20', meaning: 'Perfect — virtually never given', mention: '—', equiv: 'A*', color: 'bg-emerald-100 dark:bg-emerald-900/20 border-emerald-300' },
  { grade: '16–19/20', meaning: 'Excellent — exceptional work', mention: 'Très bien', equiv: 'A', color: 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200' },
  { grade: '14–15/20', meaning: 'Very good', mention: 'Bien', equiv: 'B', color: 'bg-blue-50 dark:bg-blue-900/10 border-blue-100' },
  { grade: '12–13/20', meaning: 'Good (above average)', mention: 'Assez bien', equiv: 'C', color: 'bg-blue-50 dark:bg-blue-900/10 border-blue-100' },
  { grade: '10–11/20', meaning: 'Satisfactory pass', mention: 'Passable', equiv: 'D', color: 'bg-amber-50 dark:bg-amber-900/10 border-amber-100' },
  { grade: 'Below 10', meaning: 'Fail — retake required', mention: 'Insuffisant', equiv: 'F', color: 'bg-red-50 dark:bg-red-900/10 border-red-100' },
]

const EDUCATION_CULTURE = [
  { emoji: '📝', title: 'La philosophie au bac', detail: 'One of France\'s most famous cultural markers: every final-year pupil (around 700,000 students) sits a 4-hour philosophy essay in June. The question is announced on the news and discussed nationally. Typical questions: "La liberté est-elle une illusion ?" / "Peut-on se passer de l\'art ?" The bac philo essay ("la dissert") is a form of intellectual citizenship.' },
  { emoji: '🏛️', title: 'Les grandes écoles vs l\'université', detail: 'France has a dual higher education system. Universities are open (low fees, anyone with a bac can enroll) but have high dropout rates. The grandes écoles (HEC, Sciences Po, Polytechnique, ENS) are highly selective, prestigious, and produce France\'s élite. The system is often criticised for reproducing social inequality — those who attend grandes écoles disproportionately come from privileged Parisian backgrounds.' },
  { emoji: '🖊️', title: 'L\'écriture cursive et la dictée', detail: 'French schools still teach and enforce cursive handwriting. The "dictée" (dictation) is a uniquely French exercise: the teacher reads a text aloud and pupils write it — marked harshly for spelling and accents. "Le Championnat de France de dictée" (French Dictation Championship) is a nationally broadcast event. French spelling is notoriously difficult — each error costs points.' },
  { emoji: '🍽️', title: 'La cantine et le déjeuner scolaire', detail: 'French school lunches are a national institution — a proper sit-down meal with starter, main, cheese, and dessert. Lyon employs starred chefs to design school menus. Fresh, locally sourced food is emphasised. French children learn proper table manners and French cuisine culture at school. The cantine is partly a social institution — a structured moment of collective civilised eating.' },
]

export default function FrenchSchoolVocab() {
  const [activeCategory, setActiveCategory] = useState(0)
  const [tab, setTab] = useState('vocab')

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French School Vocabulary | SayBonjour!" description="Learn French school vocabulary — subjects, supplies, classroom phrases, grading, and the French education system." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">French School Vocabulary</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">L\'école en français — school life, subjects, system, and education culture</p>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          {[
            { id: 'vocab', label: 'Vocabulary' },
            { id: 'grading', label: 'French Grades' },
            { id: 'culture', label: 'Education Culture' },
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
              {SCHOOL_VOCAB.map((cat, i) => (
                <button key={cat.category} onClick={() => { setActiveCategory(i); addXP(3, 'vocabulary') }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeCategory === i ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
                  {cat.emoji} {cat.category.split('—')[0].trim()}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {SCHOOL_VOCAB[activeCategory].items.map((item, i) => (
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

        {tab === 'grading' && (
          <div className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-6">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap size={20} className="text-burgundy-600" />
              <h2 className="font-semibold text-gray-800 dark:text-cream-50">The French Grading System (sur 20)</h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">France grades out of 20 ("sur vingt"). A 10/20 is the minimum pass. Getting 16+ is considered excellent. 20/20 is almost never awarded — teachers reserve the right to always be able to improve. The bac mentions (distinctions) apply to the overall average across subjects.</p>
            <div className="space-y-3 mb-6">
              {GRADING.map((g, i) => (
                <motion.div key={g.grade} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                  className={`flex items-center gap-4 rounded-xl px-4 py-3 border ${g.color}`}
                  onClick={() => addXP(2, 'vocabulary')}>
                  <span className="font-bold text-base w-20 shrink-0 font-mono">{g.grade}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-cream-50">{g.meaning}</p>
                    {g.mention !== '—' && <p className="text-xs text-gray-500 dark:text-gray-400">Bac mention: {g.mention}</p>}
                  </div>
                  <span className="text-xs text-gray-400">≈ {g.equiv}</span>
                </motion.div>
              ))}
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
              💡 French teachers are notoriously rigorous. A 14/20 is considered a very good grade. "La moyenne" (10/20) is the psychological and legal threshold for passing. The expression "la moyenne est à dix" (the average is ten) defines the entire system.
            </div>
          </div>
        )}

        {tab === 'culture' && (
          <div className="space-y-4">
            {EDUCATION_CULTURE.map((item, i) => (
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
