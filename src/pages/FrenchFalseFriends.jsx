import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const FALSE_FRIENDS = [
  {
    category: 'Everyday Traps',
    items: [
      { french: 'un libraire / une librairie', falseEn: 'library', realEn: 'bookseller / bookshop', realFr: '"une bibliothèque" = library', danger: 'HIGH', example: '"Je vais à la librairie acheter un roman." (bookshop). "Je vais à la bibliothèque pour étudier." (library). One of the most frequent English-speaker errors in France.' },
      { french: 'sensible', falseEn: 'sensible (reasonable)', realEn: 'sensitive / emotionally touchy', realFr: '"raisonnable / sensé" = sensible', danger: 'HIGH', example: '"Elle est très sensible aux critiques" = She is very sensitive to criticism (not "sensible" in the English sense). "Sensé(e)" = sensible/reasonable.' },
      { french: 'actuel / actuellement', falseEn: 'actual / actually', realEn: 'current / at the moment / currently', realFr: '"en réalité / en fait" = actually; "réel / réelle" = actual', danger: 'HIGH', example: '"Le président actuel" = the CURRENT president. "En fait" = actually. "Actuellement, il travaille à Lyon" = He\'s currently working in Lyon.' },
      { french: 'rester', falseEn: 'to rest', realEn: 'to stay / to remain', realFr: '"se reposer" = to rest', danger: 'HIGH', example: '"Je reste à la maison" = I\'m staying at home. "Je me repose" = I\'m resting. A very common confusion for beginners.' },
      { french: 'passer un examen', falseEn: 'to pass an exam', realEn: 'to take / sit an exam', realFr: '"réussir un examen" = to pass an exam; "rater / échouer" = to fail', danger: 'HIGH', example: '"J\'ai passé mon bac en juin" = I sat my bac in June. "J\'ai réussi mon bac" = I passed my bac. "J\'ai raté mon bac" = I failed.' },
      { french: 'location', falseEn: 'location (place)', realEn: 'rental / hire', realFr: '"emplacement / endroit / lieu" = location (place)', danger: 'MEDIUM', example: '"Location de voitures" = car hire. "Agence de location" = rental agency. "L\'emplacement" is the place.' },
      { french: 'une monnaie', falseEn: 'money (general)', realEn: 'loose change / small change / a currency', realFr: '"de l\'argent" = money (general)', danger: 'MEDIUM', example: '"Vous avez de la monnaie ?" = Do you have change? "Quelle est la monnaie locale ?" = What is the local currency? Money in general = "de l\'argent".' },
      { french: 'décevoir', falseEn: 'to deceive (to trick)', realEn: 'to disappoint', realFr: '"tromper / duper" = to deceive/trick', danger: 'HIGH', example: '"Ce film m\'a vraiment déçu" = This film really disappointed me. "Je suis déçu(e)" = I\'m disappointed. Not deceived.' },
      { french: 'éventuellement', falseEn: 'eventually (in the end)', realEn: 'possibly / if need be / under some circumstances', realFr: '"finalement / à la fin / en fin de compte" = eventually', danger: 'HIGH', example: '"Il pourrait éventuellement accepter" = He might possibly accept. NOT "he will eventually accept". This is one of the most dangerous false friends for advanced learners.' },
      { french: 'sympathique / sympa', falseEn: 'sympathetic (understanding)', realEn: 'friendly / nice / pleasant', realFr: '"compatissant / compréhensif" = sympathetic (understanding)', danger: 'HIGH', example: '"Il est très sympa" = He\'s very nice/friendly. "Elle est très compréhensive" = She\'s very sympathetic/understanding.' },
      { french: 'prétendre', falseEn: 'to pretend (to fake)', realEn: 'to claim / to maintain (an assertion)', realFr: '"faire semblant de" = to pretend (to fake)', danger: 'HIGH', example: '"Il prétend être médecin" = He claims to be a doctor. "Il fait semblant d\'être malade" = He\'s pretending to be sick.' },
      { french: 'assister', falseEn: 'to assist (to help)', realEn: 'to attend / to be present at', realFr: '"aider / assister quelqu\'un" = to help someone', danger: 'HIGH', example: '"J\'ai assisté à la conférence" = I attended the conference. "J\'ai aidé mon collègue" = I helped my colleague.' },
    ],
  },
  {
    category: 'Work & Study',
    items: [
      { french: 'une conférence', falseEn: 'a conference (always a big professional event)', realEn: 'a lecture / a talk / a conference (any size)', realFr: 'Both meanings exist — context distinguishes them', danger: 'LOW', example: '"J\'ai une conférence à 14h" in a university context = I have a lecture at 2pm. "La conférence internationale" = a large professional conference.' },
      { french: 'une formation', falseEn: 'formation (military / group shape)', realEn: 'training / professional course / vocational education', realFr: '"une forme / une disposition" = a formation (shape)', danger: 'MEDIUM', example: '"Je suis en formation professionnelle" = I\'m on a training course. "Formation continue" = continuing professional development.' },
      { french: 'un stage', falseEn: 'a stage (theatre)', realEn: 'an internship / a work placement / a training period', realFr: '"une scène" = a (theatre) stage', danger: 'HIGH', example: '"Je fais un stage chez LVMH" = I\'m doing an internship at LVMH. "Un stagiaire" = an intern. Very common in French professional life.' },
      { french: 'un agenda', falseEn: 'an agenda (meeting list)', realEn: 'a diary / personal organiser / calendar', realFr: '"un ordre du jour" = a meeting agenda', danger: 'MEDIUM', example: '"Mon agenda est plein cette semaine" = My diary is full this week. A meeting agenda = "l\'ordre du jour de la réunion".' },
      { french: 'caution', falseEn: 'caution (care / prudence)', realEn: 'security deposit / bail / financial guarantee', realFr: '"prudence / précaution" = caution (care)', danger: 'HIGH', example: '"Verser une caution de deux mois" = to pay a two-month deposit. "Être sous caution" = to be out on bail.' },
      { french: 'une faculté (une fac)', falseEn: 'a faculty (inherent natural ability)', realEn: 'a university / a faculty of a university', realFr: '"une aptitude / une capacité" = an ability/faculty', danger: 'MEDIUM', example: '"Je vais à la fac" = I\'m going to university. "La fac de droit" = the law faculty.' },
      { french: 'une licence', falseEn: 'a driving licence / a license to do something', realEn: 'a bachelor\'s degree (3 years at university)', realFr: '"un permis de conduire" = a driving licence', danger: 'MEDIUM', example: '"J\'ai une licence en lettres modernes" = I have a degree in modern languages/literature. Driving licence = "le permis de conduire".' },
      { french: 'un candidat', falseEn: 'a candidate (politics only)', realEn: 'a candidate (elections, job applications, exams — all contexts)', realFr: 'More versatile than in English', danger: 'LOW', example: '"Un candidat à l\'examen" = an exam candidate. "Un candidat au poste" = a job applicant. "Un candidat à l\'élection" = election candidate.' },
      { french: 'contrôler', falseEn: 'to control (to dominate/manage)', realEn: 'to check / to inspect / to verify', realFr: '"maîtriser / gérer" = to control (manage)', danger: 'MEDIUM', example: '"Contrôlez vos billets" = Check your tickets. "Un contrôle qualité" = a quality check. Not necessarily about having control over something.' },
    ],
  },
  {
    category: 'Food & Daily Life',
    items: [
      { french: 'des chips', falseEn: 'chips (British — hot potato fries)', realEn: 'crisps / potato chips (in a packet)', realFr: '"des frites" = chips (British) / French fries', danger: 'MEDIUM', example: '"Un sachet de chips" = a bag of crisps. "Je voudrais des frites" = I\'d like chips/fries. Hot fried potatoes are always "frites" in French.' },
      { french: 'large', falseEn: 'large (big/great)', realEn: 'wide / broad (in measurement)', realFr: '"grand / gros" = large/big', danger: 'HIGH', example: '"Une rue large" = a wide street. "Un large sourire" = a broad smile. Never use "large" to mean big/great.' },
      { french: 'grave', falseEn: 'a grave (burial site)', realEn: 'serious / severe / deep (adjective)', realFr: '"une tombe" = a (burial) grave', danger: 'MEDIUM', example: '"C\'est grave !" = It\'s serious! Also youth slang: "Grave !" = Absolutely! The noun "une tombe" = a burial grave.' },
      { french: 'un car', falseEn: 'a car (automobile)', realEn: 'a coach / long-distance bus', realFr: '"une voiture" = a car', danger: 'HIGH', example: '"Je prends le car pour Lyon" = I\'m taking the coach to Lyon. "Je prends ma voiture" = I\'m taking my car. Classic mistake for anglophones.' },
      { french: 'une cave', falseEn: 'a cave (underground natural formation)', realEn: 'a cellar / wine cellar (in a building)', realFr: '"une grotte" = a natural cave', danger: 'MEDIUM', example: '"Il garde son vin dans la cave" = He keeps his wine in the cellar. "Les grottes de Lascaux" = the Lascaux caves.' },
      { french: 'propre', falseEn: 'proper / correct / appropriate', realEn: 'clean (after noun) OR own (before noun)', realFr: '"convenable / correct" = proper/appropriate', danger: 'MEDIUM', example: '"Ma propre voiture" = my own car. "Une voiture propre" = a clean car. Same word, completely different meanings by position!' },
      { french: 'le pétrole', falseEn: 'petrol / gasoline', realEn: 'crude oil / petroleum', realFr: '"l\'essence" = petrol (UK) / gasoline (US)', danger: 'MEDIUM', example: '"Le prix du pétrole a baissé" = The price of crude oil fell. "Le plein d\'essence, s\'il vous plaît" = Fill it up with petrol, please.' },
      { french: 'une prune', falseEn: 'a prune (dried fruit)', realEn: 'a plum (fresh fruit)', realFr: '"un pruneau" = a prune (dried)', danger: 'LOW', example: '"Une tarte aux prunes" = a plum tart (using fresh plums). "Un pruneau" = a dried prune. Also slang: "un pruneau" = a bullet!' },
      { french: 'une entrée', falseEn: 'an entrée (main course, US English)', realEn: 'a starter / first course', realFr: 'In American English, "entrée" = main course — the OPPOSITE!', danger: 'HIGH', example: '"Pour l\'entrée, je prends la salade niçoise" = For the starter, I\'ll have the Niçoise salad. In France, "l\'entrée" is always the FIRST course.' },
    ],
  },
  {
    category: 'Travel & Transport',
    items: [
      { french: 'le péage', falseEn: 'a page (of a book)', realEn: 'a toll / tollgate (on a motorway)', realFr: '"une page" = a page (of text)', danger: 'MEDIUM', example: '"Le péage de l\'autoroute A6" = the motorway toll on the A6. France has extensive toll motorways ("autoroutes à péage").' },
      { french: 'une correspondance', falseEn: 'correspondence (letters)', realEn: 'a transport connection / transfer (AND correspondence in letters)', realFr: 'Both meanings exist in French — context makes it clear', danger: 'MEDIUM', example: '"J\'ai une correspondance à Lyon" = I have a connection in Lyon. "La correspondance" = letters, but also transport transfers.' },
      { french: 'complet / complète', falseEn: 'complete (finished)', realEn: 'full (no spaces) / fully booked / sold out', realFr: '"terminé / fini" = complete/finished; "complet" = full', danger: 'MEDIUM', example: '"L\'hôtel est complet" = the hotel is fully booked. "Le menu" (set meal with all courses) is also called "le menu complet". "Complet" = full/sold out.' },
      { french: 'rentrer', falseEn: 'to enter (to go inside)', realEn: 'to go home / to return (to one\'s starting point)', realFr: '"entrer" = to enter; "rentrer" = to return home', danger: 'MEDIUM', example: '"Je rentre à la maison" = I\'m going home. "J\'entre dans le magasin" = I\'m going into the shop. "La rentrée" = back-to-school period in September.' },
      { french: 'un passage', falseEn: 'a passage (of text)', realEn: 'a crossing / a passageway / a passage (multiple meanings)', realFr: '"Un passage piéton" = pedestrian crossing; "un passage à niveau" = a level crossing', danger: 'LOW', example: '"Attendez au passage piéton" = Wait at the pedestrian crossing. "Le passage souterrain" = underpass.' },
      { french: 'une station', falseEn: 'a station (train station)', realEn: 'a metro/bus stop / a ski resort (NOT usually a train station)', realFr: '"une gare" = a train station; "une station" = metro/bus stop or ski resort', danger: 'MEDIUM', example: '"La station de métro Châtelet" = Châtelet metro station. "La station de ski" = the ski resort. Train stations = "la gare".' },
      { french: 'la circulation', falseEn: 'circulation (of blood/magazine)', realEn: 'traffic / road traffic', realFr: '"la circulation sanguine" = blood circulation; "la diffusion" = magazine circulation', danger: 'MEDIUM', example: '"La circulation est dense ce matin" = Traffic is heavy this morning. "Les embouteillages" = traffic jams.' },
    ],
  },
  {
    category: 'Body & Health',
    items: [
      { french: 'blesser', falseEn: 'to bless (religion)', realEn: 'to injure / to wound / to hurt', realFr: '"bénir" = to bless (religious)', danger: 'HIGH', example: '"Il s\'est blessé au genou en jouant au foot" = He injured his knee playing football. Blessings = "bénir" (a priest blesses).' },
      { french: 'une médecine', falseEn: 'a medicine (a pill or drug)', realEn: 'medicine (the science or profession)', realFr: '"un médicament" = a medicine/drug (tablet etc.)', danger: 'HIGH', example: '"Étudier la médecine" = to study medicine (the profession). "Prendre un médicament" = to take a medicine/tablet.' },
      { french: 'une ordonnance', falseEn: 'an ordinance (a local law)', realEn: 'a prescription (from a doctor)', realFr: '"une loi / un décret" = an ordinance (law)', danger: 'MEDIUM', example: '"Le médecin m\'a donné une ordonnance pour des antibiotiques" = The doctor gave me a prescription for antibiotics.' },
      { french: 'sensé(e)', falseEn: 'sensitive (emotionally)', realEn: 'sensible / reasonable', realFr: '"sensible" = sensitive/emotionally affected', danger: 'HIGH', example: '"C\'est une décision sensée" = It\'s a sensible/reasonable decision. "Il est très sensible" = He\'s very sensitive. Sensé/sensible — one letter apart, opposite meanings!' },
      { french: 'blesser', falseEn: 'to bless', realEn: 'to injure / to wound', realFr: '"bénir" = to bless', danger: 'HIGH', example: '"Je me suis blessé(e) au bras" = I hurt my arm. A priest blesses = "Le prêtre bénit". Injuries = "une blessure".' },
      { french: 'constipé', falseEn: 'constipated (reserved/uptight, slang)', realEn: 'constipated (medically)', realFr: 'Same as English but less often used metaphorically', danger: 'LOW', example: '"Je suis constipé(e)" = I\'m constipated. The English metaphorical usage ("he\'s so constipated" = uptight) doesn\'t work the same way in French.' },
    ],
  },
  {
    category: 'Advanced Traps',
    items: [
      { french: 'une chance', falseEn: 'chance (random opportunity)', realEn: 'luck / good fortune (positive connotation)', realFr: '"une opportunité / une occasion" = a chance/opportunity; "la chance" = luck', danger: 'HIGH', example: '"Quelle chance !" = What luck! / How lucky! "J\'ai eu de la chance" = I was lucky. "Il n\'y a pas de chance de réussir" = there\'s no chance of success (more formal).' },
      { french: 'assumer', falseEn: 'to assume (to suppose)', realEn: 'to take responsibility for / to own / to accept', realFr: '"supposer / présumer" = to assume/suppose', danger: 'HIGH', example: '"J\'assume mes choix" = I own my choices / I take responsibility for my decisions. "Il assume son style" = He owns his style. Very different from "supposer".' },
      { french: 'formidable', falseEn: 'formidable (intimidatingly impressive)', realEn: 'fantastic / wonderful / great', realFr: '"redoutable / intimidant" = formidable in the English sense', danger: 'MEDIUM', example: '"C\'est formidable !" = That\'s fantastic! "Un joueur formidable" = a fantastic player. Entirely positive in French, unlike English.' },
      { french: 'un car', falseEn: 'a car (automobile)', realEn: 'a coach / long-distance bus', realFr: '"une voiture" = a car', danger: 'HIGH', example: '"Prendre le car scolaire" = to take the school bus. "Aller à Paris en car" = to go to Paris by coach.' },
      { french: 'ignorer', falseEn: 'to ignore (to deliberately disregard)', realEn: 'to not know (to be unaware of) / to be ignorant of', realFr: '"ne pas tenir compte de" = to deliberately ignore', danger: 'HIGH', example: '"J\'ignore pourquoi il est parti" = I don\'t know why he left. "Faire semblant de ne pas voir quelqu\'un" = to deliberately ignore someone.' },
      { french: 'une veste', falseEn: 'a vest (underwear / waistcoat)', realEn: 'a jacket / blazer', realFr: '"un gilet" = a waistcoat; "un maillot de corps" = an undershirt/vest', danger: 'HIGH', example: '"Mets ta veste, il fait froid !" = Put on your jacket, it\'s cold! "Prendre une veste" = to suffer a defeat/humiliation (idiom).' },
    ],
  },
]

const DANGER_COLORS = {
  HIGH: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
  MEDIUM: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
  LOW: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
}

export default function FrenchFalseFriends() {
  const [activeGroup, setActiveGroup] = useState(0)

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French False Friends | SayBonjour!" description="Avoid common French false friends — 60+ words that look like English but mean something very different. With danger ratings and examples." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">French False Friends</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Les faux amis — 60+ words that look like English but mean something very different</p>
        </div>

        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 mb-6 flex items-start gap-2">
          <AlertTriangle size={16} className="text-red-600 shrink-0 mt-0.5" />
          <div className="text-sm text-red-800 dark:text-red-300">
            <strong>False friends (faux amis)</strong> look or sound similar in French and English but have different meanings. They cause some of the most embarrassing errors — even at advanced level. <strong>HIGH</strong> = very dangerous; <strong>MEDIUM</strong> = common confusion; <strong>LOW</strong> = subtle trap.
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {FALSE_FRIENDS.map((g, i) => (
            <button key={g.category} onClick={() => { setActiveGroup(i); addXP(4, 'vocabulary') }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeGroup === i ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
              {g.category}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {FALSE_FRIENDS[activeGroup].items.map((item, i) => (
            <motion.div key={item.french} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-5"
              onClick={() => addXP(3, 'vocabulary')}>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <SpeakButton text={item.french.split('/')[0].trim()} size="sm" />
                  <span className="font-bold text-lg font-playfair text-burgundy-700 dark:text-burgundy-vibrant-300">{item.french}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold shrink-0 ${DANGER_COLORS[item.danger]}`}>{item.danger}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-red-50 dark:bg-red-900/10 rounded-xl px-3 py-2">
                  <p className="text-xs text-red-500 font-bold mb-1">✗ NOT this</p>
                  <p className="text-sm text-red-700 dark:text-red-300">{item.falseEn}</p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-xl px-3 py-2">
                  <p className="text-xs text-emerald-500 font-bold mb-1">✓ MEANS</p>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">{item.realEn}</p>
                </div>
              </div>
              <p className="text-xs text-amber-600 dark:text-amber-400 italic mb-1">💡 {item.realFr}</p>
              {item.example && <p className="text-xs text-gray-500 dark:text-gray-400 italic bg-cream-50 dark:bg-dark-warm-200 rounded-lg px-3 py-1.5 mt-1">{item.example}</p>}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
