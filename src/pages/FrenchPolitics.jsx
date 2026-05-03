import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Flag, Building2 } from 'lucide-react'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const POLITICS_SECTIONS = [
  {
    category: 'Government Structure — La structure du gouvernement',
    emoji: '🏛️',
    items: [
      { fr: 'la République française', en: 'the French Republic', note: 'France is the 5th Republic (since 1958, de Gaulle). Previous republics: 1st (1792), 2nd (1848), 3rd (1870), 4th (1946).' },
      { fr: 'le Président de la République', en: 'the President of the Republic', note: 'Elected for 5-year terms by direct universal suffrage since 1962. Very powerful — can dissolve parliament, appoint PM, preside over Council of Ministers.' },
      { fr: 'le Premier ministre', en: 'the Prime Minister', note: 'Appointed by the President. Runs the government day-to-day. In "cohabitation" (different parties), tensions arise. "Matignon" = the PM\'s residence.' },
      { fr: 'le gouvernement / le Conseil des ministres', en: 'the government / cabinet', note: '"Le Conseil des ministres" meets weekly at the Élysée under the President\'s chairmanship. Ministers are appointed by the President.' },
      { fr: 'le Parlement', en: 'Parliament', note: 'Bicameral: two chambers. "L\'Assemblée nationale" (lower) + "le Sénat" (upper). Laws must pass both houses.' },
      { fr: 'l\'Assemblée nationale', en: 'the National Assembly (lower house)', note: '577 deputies elected by direct vote in 577 constituencies. Can pass a motion of no confidence to bring down the government.' },
      { fr: 'le Sénat', en: 'the Senate (upper house)', note: '348 senators, elected indirectly by "grands électeurs" (local elected officials). Traditionally conservative — nicknamed "le Grand Cimetière" (the great cemetery) for its pace.' },
      { fr: 'un député', en: 'a Member of Parliament (MP)', note: 'Elected to the "Assemblée nationale". "Un député européen" = an MEP (Member of European Parliament).' },
      { fr: 'un sénateur / une sénatrice', en: 'a senator', note: 'Elected for 6-year terms, renewable. France\'s senators are often former ministers, mayors, or regional councillors.' },
      { fr: 'le Conseil d\'État', en: 'the Council of State (top administrative court)', note: 'Advises the government on legislation AND is the supreme court for administrative law cases. A very French institution.' },
      { fr: 'le Conseil constitutionnel', en: 'the Constitutional Council', note: 'Ensures laws conform to the Constitution. 9 members (appointed by President, Assembly president, Senate president) for 9-year terms.' },
      { fr: 'l\'Élysée / le Palais de l\'Élysée', en: 'the Élysée Palace (President\'s official residence)', note: 'On the Rue du Faubourg Saint-Honoré, Paris. The President lives and works here. "L\'Élysée" often used as shorthand for the President.' },
      { fr: 'Matignon / l\'Hôtel de Matignon', en: 'the PM\'s official residence', note: 'Rue de Varenne, Paris. Has the largest private garden in Paris. "Matignon" = shorthand for the Prime Minister.' },
    ],
  },
  {
    category: 'Political Vocabulary — Vocabulaire politique',
    emoji: '🗳️',
    items: [
      { fr: 'une élection', en: 'an election', note: '"L\'élection présidentielle" = presidential election (every 5 years). "Les législatives" = parliamentary elections. "Les municipales" = local council elections.' },
      { fr: 'voter', en: 'to vote', note: '"Le droit de vote" = the right to vote. Voting age in France is 18. Voter turnout is falling — "l\'abstention" = abstention rate.' },
      { fr: 'le suffrage universel', en: 'universal suffrage', note: 'France granted universal male suffrage in 1848 — before most European countries. Women gained the vote in 1944.' },
      { fr: 'un parti politique', en: 'a political party', note: 'French parties: La France Insoumise (far-left), PS (socialist), Renaissance (centrist Macron), Les Républicains (centre-right), RN (far-right).' },
      { fr: 'la droite / la gauche', en: 'the right / the left (wing)', note: 'These terms originate from the French Revolution — deputies who supported the king sat to the right of the president of the Assembly; reformers to the left.' },
      { fr: 'le centre / centriste', en: 'the centre / centrist', note: 'Emmanuel Macron positioned himself as "ni droite ni gauche" (neither right nor left) — a centrist strategy that won in 2017.' },
      { fr: 'la laïcité', en: 'secularism / separation of religion and state', note: 'A fundamental French value — enshrined in the 1905 law separating Church and State. Religious symbols banned in public schools and for civil servants on duty.' },
      { fr: 'une manifestation (une manif)', en: 'a protest / demonstration', note: 'France has a very strong protest culture — "le droit de manifester" is protected. Major manifestations can paralyse Paris for days.' },
      { fr: 'une grève', en: 'a strike', note: '"Le droit de grève" (the right to strike) is constitutionally protected. France has one of Europe\'s highest strike rates — particularly SNCF (trains) and Air France.' },
      { fr: 'le référendum', en: 'a referendum', note: 'Used rarely but memorably: 1962 (direct election of President), 1992 (Maastricht), 2005 (EU Constitution — a "non" that embarrassed France).' },
      { fr: 'la Constitution', en: 'the Constitution', note: 'The current Constitution is from 1958. Article 1: "La France est une République indivisible, laïque, démocratique et sociale."' },
      { fr: 'la cohabitation', en: 'cohabitation (President + PM of different parties)', note: 'Unique to France — when the President and PM are political opponents. Happened in 1986–88, 1993–95, 1997–2002. Creates complex power dynamics.' },
      { fr: 'l\'opposition', en: 'the opposition', note: '"Le chef de l\'opposition" = the leader of the opposition. "L\'opposition s\'y oppose" = the opposition opposes it — a tautology used satirically.' },
    ],
  },
  {
    category: 'Discussing Current Affairs — L\'actualité',
    emoji: '📰',
    items: [
      { fr: 'l\'actualité', en: 'current affairs / the news', note: '"Les actualités" = news (also: "les infos" informal, "le journal télévisé" = TV news bulletin).' },
      { fr: 'un journal / les infos', en: 'a newspaper / the news (informal)', note: '"Le journal de 20h" (8pm TV news) — watched by millions. "Les infos de 13h" = the 1pm news.' },
      { fr: 'un débat', en: 'a debate', note: '"Un grand débat national" — Macron launched one in 2019 following the Gilets Jaunes protests. "Le débat télévisé" between presidential candidates is a major event.' },
      { fr: 'la politique étrangère', en: 'foreign policy', note: 'France has a strong foreign policy tradition — permanent UN Security Council member, nuclear power, member of NATO.' },
      { fr: 'la politique intérieure', en: 'domestic policy', note: '"La politique de l\'emploi" = employment policy. "La politique de santé" = health policy.' },
      { fr: 'une loi', en: 'a law', note: '"La loi du 9 décembre 1905" = the law of 1905 separating Church and State. "Une loi-cadre" = a framework law.' },
      { fr: 'un projet de loi', en: 'a bill (proposed law)', note: '"Un projet de loi" comes from the government. "Une proposition de loi" comes from a deputy — a distinction important in French political vocabulary.' },
      { fr: 'voter une loi', en: 'to pass a law', note: '"L\'Assemblée a voté la loi à 256 voix contre 178" = the Assembly passed the law 256 votes to 178.' },
      { fr: 'un sondage', en: 'a poll / survey', note: '"Un sondage d\'opinion" = an opinion poll. "Les sondages donnent le candidat X en tête" = polls show candidate X in the lead.' },
      { fr: 'la campagne électorale', en: 'the election campaign', note: '"Faire campagne" = to campaign. "Un meeting politique" = a political rally. "L\'entre-deux-tours" = the period between the first and second round of voting.' },
    ],
  },
]

const KEY_PRINCIPLES = [
  { title: 'Liberté, Égalité, Fraternité', desc: 'The French national motto since the Revolution (1789). Liberty, Equality, Fraternity — inscribed on all official buildings, printed on currency, and embedded in French constitutional identity. Often critiqued as an ideal imperfectly realised — but deeply felt.', emoji: '🇫🇷' },
  { title: 'La laïcité', desc: 'Strict separation of religion and state — enshrined in the 1905 law. Religious symbols may not be worn by civil servants on duty or pupils in public schools. Deeply contested: defenders see it as equality and neutrality; critics see it as discriminatory towards Muslims and others. One of the most debated topics in contemporary France.', emoji: '⚖️' },
  { title: 'Le droit de grève et de manifester', desc: 'The right to strike is constitutionally protected since 1946. France has one of Europe\'s highest strike rates — train strikes ("grèves SNCF"), civil servant strikes, and student protests ("manifs étudiantes") are regular features of French life. Protest is seen as a fundamental democratic right.', emoji: '✊' },
  { title: 'La 5e République et le présidentialisme', desc: 'France\'s 5th Republic (1958) gave the President extraordinary powers — more so than in most Western democracies. The President directs foreign policy ("le domaine réservé"), commands the armed forces, and can dissolve Parliament. Critics call this an "elected monarchy". It was designed by de Gaulle to prevent the governmental instability of the 4th Republic.', emoji: '🏛️' },
  { title: 'Le vote blanc et l\'abstention', desc: 'A "blank vote" (deliberately submitting an empty ballot) has been officially counted since 2014. It\'s a form of protest short of abstention. Abstention rates have surged in France — reaching 52% in the 2022 legislative elections. "L\'abstention" is now a major concern for French democracy.', emoji: '📋' },
  { title: 'La décentralisation', desc: 'France was historically one of Europe\'s most centralised states — "tout décide à Paris" (everything decided in Paris). Since the 1982 Defferre laws, regions and departments gained more autonomy. Today France has 18 regions and 101 departments. But Paris still dominates economically and politically.', emoji: '🗺️' },
]

const PHRASES = [
  { fr: 'Qu\'est-ce que tu penses de la politique actuelle ?', en: 'What do you think of current politics?', note: '"Penser de" = to think of (opinion). "Penser à" = to think about.' },
  { fr: 'Je ne suis pas politisé(e) — je m\'intéresse peu à la politique.', en: 'I\'m not very political — I take little interest in politics.', note: 'A common French response — though France is actually a very politically engaged society.' },
  { fr: 'Il y a des élections législatives en juin.', en: 'There are parliamentary elections in June.', note: '"Les législatives" = legislative elections. "Les présidentielles" = presidential elections.' },
  { fr: 'J\'ai voté pour la première fois à la dernière élection.', en: 'I voted for the first time at the last election.', note: 'Voting age: 18. "Voter" = to vote. "S\'inscrire sur les listes électorales" = to register to vote.' },
  { fr: 'La situation économique est préoccupante en ce moment.', en: 'The economic situation is worrying at the moment.', note: '"Préoccupant(e)" = worrying/concerning. "La conjoncture économique" = economic conditions.' },
  { fr: 'Ils vont faire grève la semaine prochaine — encore !', en: 'They\'re going to strike next week — again!', note: '"Faire grève" = to go on strike. "La grève perlée" = a go-slow. "La grève totale" = a full stoppage.' },
  { fr: 'Le taux de chômage a encore augmenté ce mois-ci.', en: 'The unemployment rate has risen again this month.', note: '"Le chômage" = unemployment. "Le chômeur / la chômeuse" = an unemployed person. "Pôle Emploi" = the French job centre.' },
  { fr: 'Le gouvernement a annoncé un plan d\'austérité.', en: 'The government has announced an austerity plan.', note: '"L\'austérité" = austerity. "Des coupes budgétaires" = budget cuts. "Le déficit public" = the public deficit.' },
  { fr: 'La crise du coût de la vie touche toutes les classes sociales.', en: 'The cost of living crisis affects all social classes.', note: '"Le pouvoir d\'achat" = purchasing power — one of the most politically charged phrases in France.' },
  { fr: 'Le débat sur l\'immigration est très polarisé.', en: 'The debate on immigration is very polarised.', note: '"Polarisé" = polarised. "Le débat identitaire" = identity politics debate. A highly contested area in French politics.' },
]

export default function FrenchPolitics() {
  const [tab, setTab] = useState('vocab')
  const [activeCategory, setActiveCategory] = useState(0)

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French Politics & Society | SayBonjour!" description="French politics vocabulary — government structure, political terms, key principles, and current affairs language." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">French Politics & Society</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">La politique et la société — government, elections, key principles, and civic vocabulary</p>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          {[
            { id: 'vocab', label: 'Vocabulary' },
            { id: 'principles', label: 'Key Principles' },
            { id: 'phrases', label: 'Phrases' },
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
              {POLITICS_SECTIONS.map((cat, i) => (
                <button key={cat.category} onClick={() => { setActiveCategory(i); addXP(3, 'vocabulary') }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeCategory === i ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
                  {cat.emoji} {cat.category.split('—')[0].trim()}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {POLITICS_SECTIONS[activeCategory].items.map((item, i) => (
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

        {tab === 'principles' && (
          <div className="space-y-4">
            {KEY_PRINCIPLES.map((p, i) => (
              <motion.div key={p.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-5 flex items-start gap-4"
                onClick={() => addXP(4, 'vocabulary')}>
                <span className="text-3xl shrink-0">{p.emoji}</span>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-cream-50 font-playfair mb-1">{p.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'phrases' && (
          <div className="space-y-3">
            {PHRASES.map((phrase, i) => (
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
      </div>
    </div>
  )
}
