import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock } from 'lucide-react'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const DAYS = [
  { fr: 'lundi', en: 'Monday', abbr: 'lun.', note: 'Named after la lune (the moon). The first day of the French week.' },
  { fr: 'mardi', en: 'Tuesday', abbr: 'mar.', note: 'Named after Mars, the Roman god of war.' },
  { fr: 'mercredi', en: 'Wednesday', abbr: 'mer.', note: 'Named after Mercury — the messenger god. "Mercredi" = French children\'s favourite day (no school traditionally).' },
  { fr: 'jeudi', en: 'Thursday', abbr: 'jeu.', note: 'Named after Jupiter (Jove). "Jeudi" → "Jove\'s day" → Thursday.' },
  { fr: 'vendredi', en: 'Friday', abbr: 'ven.', note: 'Named after Venus. "Vendredi 13" = Friday 13th (unlucky in France too).' },
  { fr: 'samedi', en: 'Saturday', abbr: 'sam.', note: 'From Hebrew "Sabbat" via Latin. "Le week-end" = Saturday and Sunday.' },
  { fr: 'dimanche', en: 'Sunday', abbr: 'dim.', note: 'From Latin "Dies Dominica" = Lord\'s day. In France, Sunday is the last day of the week (not the first).' },
]

const MONTHS = [
  { fr: 'janvier', en: 'January', n: 1, note: 'Named after Janus, the two-faced Roman god. "La galette des Rois" = eaten in January.' },
  { fr: 'février', en: 'February', n: 2, note: 'The shortest month. "La Chandeleur" (Candlemas/Crêpe Day) is 2 February — crêpes are traditionally made.' },
  { fr: 'mars', en: 'March', n: 3, note: 'Named after Mars. "Le printemps commence en mars" = spring begins in March.' },
  { fr: 'avril', en: 'April', n: 4, note: '"Poisson d\'avril !" = April Fool! (lit. April fish — children stick paper fish on backs). "En avril, ne te découvre pas d\'un fil" = wrap up warm in April.' },
  { fr: 'mai', en: 'May', n: 5, note: '"Le 1er mai" = Labour Day (always a public holiday). "Le 8 mai" = VE Day. "Mai 68" = the famous student and worker uprising of May 1968.' },
  { fr: 'juin', en: 'June', n: 6, note: '"La fête de la musique" = 21 June (free outdoor concerts across France). "Les grandes vacances" begin in late June.' },
  { fr: 'juillet', en: 'July', n: 7, note: '"Le 14 juillet" = Bastille Day (national day). "Le Tour de France" takes place in July. France goes on holiday in July.' },
  { fr: 'août', en: 'August', n: 8, note: 'The "t" is often silent in speech. France functionally empties as the nation goes to the coast and countryside. "L\'exode estival" = the summer mass migration.' },
  { fr: 'septembre', en: 'September', n: 9, note: '"La rentrée" = back to school in early September — a massive national event.' },
  { fr: 'octobre', en: 'October', n: 10, note: '"Les vendanges" (grape harvest) happen in September–October in most wine regions. "La Toussaint" = All Saints\' Day (1 November).' },
  { fr: 'novembre', en: 'November', n: 11, note: '"Le 11 novembre" = Armistice Day (always a public holiday). "La Toussaint" (1 November) = All Saints\' Day — families visit graves.' },
  { fr: 'décembre', en: 'December', n: 12, note: '"Noël" (Christmas) = 25 December. "Le réveillon du Nouvel An" = New Year\'s Eve celebration.' },
]

const SEASONS = [
  { fr: 'le printemps', en: 'spring', prep: 'au printemps', emoji: '🌸', note: '"Au printemps" (not "en printemps"). "Il fait bon au printemps" = the weather is pleasant in spring.' },
  { fr: 'l\'été', en: 'summer', prep: 'en été', emoji: '☀️', note: '"En été" = in summer. "L\'été indien" = Indian summer (warm spell in autumn).' },
  { fr: 'l\'automne', en: 'autumn / fall', prep: 'en automne', emoji: '🍂', note: '"En automne" = in autumn. "Les feuilles tombent en automne" = leaves fall in autumn. "La forêt en automne" = a classic French tableau.' },
  { fr: 'l\'hiver', en: 'winter', prep: 'en hiver', emoji: '❄️', note: '"En hiver" = in winter. "Les sports d\'hiver" = winter sports. "La trêve hivernale" = winter truce (no tenant evictions Nov–March).' },
]

const TIME_EXPRESSIONS = [
  { fr: 'aujourd\'hui', en: 'today', note: '"C\'est pour aujourd\'hui ou pour demain ?" = hurry up! (lit. is it for today or tomorrow?)' },
  { fr: 'demain', en: 'tomorrow', note: '"À demain !" = see you tomorrow! "Demain matin" = tomorrow morning.' },
  { fr: 'hier', en: 'yesterday', note: '"Hier matin" = yesterday morning. "Avant-hier" = the day before yesterday.' },
  { fr: 'après-demain', en: 'the day after tomorrow', note: '"Après-demain" = in two days. Rare in English as a single word; very common in French.' },
  { fr: 'avant-hier', en: 'the day before yesterday', note: 'Compounds like this are more common in French than in English.' },
  { fr: 'la semaine prochaine', en: 'next week', note: '"La semaine dernière" = last week. "Cette semaine" = this week.' },
  { fr: 'le mois prochain', en: 'next month', note: '"Le mois dernier" = last month. "Le mois en cours" = the current month.' },
  { fr: 'l\'année prochaine', en: 'next year', note: '"L\'an prochain" = next year (shorter form). "L\'année dernière" = last year.' },
  { fr: 'dans une semaine', en: 'in a week\'s time', note: '"Dans" + time = in/within that time from now. "Dans un mois" = in a month\'s time.' },
  { fr: 'il y a trois jours', en: 'three days ago', note: '"Il y a" + time = ago. "Il y a deux ans" = two years ago.' },
  { fr: 'depuis', en: 'for / since (ongoing)', note: '"Depuis" + present tense = for/since (still happening). "J\'habite ici depuis 5 ans" = I\'ve lived here for 5 years.' },
  { fr: 'pendant', en: 'for / during (completed)', note: '"Pendant" = during/for (completed action). "J\'ai travaillé pendant trois heures" = I worked for three hours.' },
  { fr: 'en semaine', en: 'on weekdays / during the week', note: '"En semaine" = Monday to Friday. "Le week-end" = Saturday and Sunday.' },
  { fr: 'en avance / en retard', en: 'early / late', note: '"En avance" = early/ahead of schedule. "En retard" = late/delayed. "À l\'heure" = on time.' },
]

const DATE_RULES = [
  { rule: 'Format: le [number] [month] [year]', example: 'le 14 juillet 1789', note: 'No ordinals except the 1st: "le premier". All other dates use cardinal numbers: le 3, le 14, le 25.' },
  { rule: '"Le premier" for the 1st only', example: 'le premier janvier — le 14 février', note: 'Only the first of the month uses the ordinal "premier". 2nd onwards: le deux, le trois, etc.' },
  { rule: 'Saying the year: "en" + year', example: 'Je suis né(e) en 1992. — en deux mille vingt-cinq', note: 'Always "en" before a year, never "dans le" or "au". "En 2025" = in 2025.' },
  { rule: 'Days and months: lowercase in French', example: 'lundi 3 mai — en janvier — le vendredi soir', note: 'Unlike English, days and months are NOT capitalised in French — a common written error.' },
  { rule: 'The French week starts on Monday', example: 'lundi → mardi → … → dimanche', note: 'French calendars start on Monday (ISO standard). Sunday is the LAST day of the week.' },
  { rule: '"En" + month (no article needed)', example: 'en juillet — en mars — en décembre', note: '"En juillet" = in July. Never "dans le juillet" or "au juillet".' },
  { rule: '"Au" for spring (printemps) only', example: 'au printemps — en été — en automne — en hiver', note: '"Printemps" is masculine so takes "au". All other seasons use "en".' },
  { rule: 'Writing dates: DD/MM/YYYY format', example: '14/07/2025 = le 14 juillet 2025', note: 'France uses DD/MM/YYYY — opposite to US format (MM/DD/YYYY). Important for forms and official documents.' },
]

const DATE_PHRASES = [
  { fr: 'Quelle est la date aujourd\'hui ?', en: 'What is today\'s date?', note: '"On est quel jour ?" = what day is it? (informal). "Nous sommes le combien ?" = what\'s the date?' },
  { fr: 'Nous sommes le lundi 3 mai 2026.', en: 'It is Monday, the 3rd of May 2026.', note: '"Nous sommes le" = it is (giving the date). Also: "On est le 3 mai" = informal.' },
  { fr: 'C\'est le premier janvier — Bonne année !', en: 'It\'s the first of January — Happy New Year!', note: '"Bonne année !" = Happy New Year! "Bonne et heureuse année !" = more complete version.' },
  { fr: 'Mon anniversaire est le quinze août.', en: 'My birthday is the fifteenth of August.', note: '"Mon anniversaire" = my birthday. "Joyeux anniversaire !" = Happy Birthday!' },
  { fr: 'Le rendez-vous est vendredi prochain à dix heures.', en: 'The appointment is next Friday at 10am.', note: '"Vendredi prochain" = next Friday. "Vendredi matin" = Friday morning.' },
  { fr: 'Il est parti il y a trois jours.', en: 'He left three days ago.', note: '"Il y a" + time = ago. "Il y a longtemps" = a long time ago.' },
  { fr: 'Elle revient dans une semaine exactement.', en: 'She comes back in exactly a week.', note: '"Dans" + time = in / within (future). "Dans trois jours" = in three days.' },
  { fr: 'La réunion est en mars, pas en février.', en: 'The meeting is in March, not in February.', note: '"En" + month (no article needed).' },
  { fr: 'Je suis né(e) le 7 octobre 1995.', en: 'I was born on 7 October 1995.', note: '"Né(e) le" + date. Add agreement: "née" if feminine.' },
  { fr: 'Le magasin est ouvert du lundi au vendredi, de 9h à 18h.', en: 'The shop is open Monday to Friday, from 9am to 6pm.', note: '"Du lundi au vendredi" = from Monday to Friday. "De 9h à 18h" = from 9am to 6pm.' },
  { fr: 'Depuis combien de temps habites-tu ici ?', en: 'How long have you lived here?', note: '"Depuis combien de temps" + present tense. "J\'habite ici depuis deux ans" = I\'ve lived here for two years.' },
  { fr: 'C\'est la rentrée le 3 septembre.', en: 'Back to school is on 3 September.', note: '"La rentrée" is one of the most important dates in the French calendar — affects the whole country.' },
]

export default function FrenchDates() {
  const [tab, setTab] = useState('calendar')

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French Dates & Calendar | SayBonjour!" description="Learn dates, days, months, seasons, and time expressions in French — with format rules and cultural notes." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">Dates & the Calendar</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Les dates et le calendrier — days, months, seasons, time expressions, and date format rules</p>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          {[
            { id: 'calendar', label: 'Calendar' },
            { id: 'time', label: 'Time Expressions' },
            { id: 'rules', label: 'Date Rules' },
            { id: 'phrases', label: 'Phrases' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${tab === t.id ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'calendar' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-5">
              <h2 className="font-semibold text-gray-800 dark:text-cream-50 mb-4">Days of the week — Les jours de la semaine</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {DAYS.map((day, i) => (
                  <motion.div key={day.fr} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="bg-cream-50 dark:bg-dark-warm-200 rounded-xl p-3 text-center cursor-pointer"
                    onClick={() => addXP(2, 'vocabulary')}>
                    <SpeakButton text={day.fr} size="sm" />
                    <p className="font-medium text-sm text-burgundy-700 dark:text-burgundy-vibrant-300 mt-1">{day.fr}</p>
                    <p className="text-xs text-gray-400">{day.en}</p>
                    {day.note && <p className="text-xs text-amber-500 italic mt-1">{day.note}</p>}
                  </motion.div>
                ))}
              </div>
              <p className="text-xs text-amber-600 dark:text-amber-400 italic mt-3">💡 The French week starts on Monday (lundi). Days and months are NOT capitalised in French.</p>
            </div>

            <div className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-5">
              <h2 className="font-semibold text-gray-800 dark:text-cream-50 mb-4">Months — Les mois</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {MONTHS.map((m, i) => (
                  <motion.div key={m.fr} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className="bg-cream-50 dark:bg-dark-warm-200 rounded-xl px-3 py-2 flex items-start gap-2 cursor-pointer"
                    onClick={() => addXP(2, 'vocabulary')}>
                    <span className="w-5 text-xs text-gray-400 font-mono shrink-0 mt-0.5">{m.n}</span>
                    <SpeakButton text={m.fr} size="sm" />
                    <div>
                      <p className="font-medium text-sm text-burgundy-700 dark:text-burgundy-vibrant-300">{m.fr}</p>
                      <p className="text-xs text-gray-400">{m.en}</p>
                      {m.note && <p className="text-xs text-amber-500 italic mt-0.5">{m.note}</p>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-5">
              <h2 className="font-semibold text-gray-800 dark:text-cream-50 mb-4">Seasons — Les saisons</h2>
              <div className="grid grid-cols-2 gap-3">
                {SEASONS.map((s, i) => (
                  <motion.div key={s.fr} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                    className="bg-cream-50 dark:bg-dark-warm-200 rounded-xl px-3 py-3 flex items-start gap-2"
                    onClick={() => addXP(2, 'vocabulary')}>
                    <span className="text-xl shrink-0">{s.emoji}</span>
                    <div>
                      <SpeakButton text={s.fr} size="sm" />
                      <p className="font-medium text-sm text-burgundy-700 dark:text-burgundy-vibrant-300">{s.fr}</p>
                      <p className="text-xs text-gray-400">{s.en}</p>
                      <p className="text-xs text-amber-600 dark:text-amber-400 italic font-medium mt-0.5">{s.prep}</p>
                      {s.note && <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-0.5">{s.note}</p>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'time' && (
          <div className="space-y-2">
            {TIME_EXPRESSIONS.map((item, i) => (
              <motion.div key={item.fr} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="bg-white dark:bg-dark-warm-100 rounded-xl shadow border border-gray-100 dark:border-dark-warm-50 px-4 py-3 flex items-start gap-3"
                onClick={() => addXP(2, 'vocabulary')}>
                <SpeakButton text={item.fr} size="sm" />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm text-burgundy-700 dark:text-burgundy-vibrant-300">{item.fr}</span>
                    <span className="text-xs text-gray-400">— {item.en}</span>
                  </div>
                  {item.note && <p className="text-xs text-amber-600 dark:text-amber-400 italic mt-0.5">💡 {item.note}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'rules' && (
          <div className="space-y-4">
            {DATE_RULES.map((r, i) => (
              <motion.div key={r.rule} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-5"
                onClick={() => addXP(3, 'grammar')}>
                <h3 className="font-bold text-gray-900 dark:text-cream-50 font-playfair mb-2">{r.rule}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <SpeakButton text={r.example} size="sm" />
                  <span className="text-sm italic text-burgundy-700 dark:text-burgundy-vibrant-300">"{r.example}"</span>
                </div>
                <p className="text-xs text-amber-700 dark:text-amber-400 italic">💡 {r.note}</p>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'phrases' && (
          <div className="space-y-3">
            {DATE_PHRASES.map((p, i) => (
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
      </div>
    </div>
  )
}
