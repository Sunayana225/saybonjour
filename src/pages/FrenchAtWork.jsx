import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, Clock, Mail, Users } from 'lucide-react'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const WORK_SECTIONS = [
  {
    category: 'Job Titles — Les métiers',
    items: [
      { fr: 'un(e) médecin', en: 'a doctor', note: 'In France, doctors are addressed as "Docteur" — not "Monsieur/Madame". GPs are "médecins généralistes"; specialists are "spécialistes".' },
      { fr: 'un(e) infirmier / infirmière', en: 'a nurse', note: 'A highly respected profession in France. "L\'infirmière scolaire" = school nurse. Nursing has a strong union presence.' },
      { fr: 'un(e) avocat(e)', en: 'a lawyer', note: '"Un avocat au barreau de Paris" = a member of the Paris Bar. The "robe" (gown) worn in court is a distinctive part of French legal culture.' },
      { fr: 'un(e) comptable', en: 'an accountant', note: '"Un expert-comptable" = a chartered accountant — a protected professional title. Essential during French tax season ("la déclaration d\'impôts").' },
      { fr: 'un(e) enseignant(e) / professeur', en: 'a teacher', note: 'Teaching is a civil service role ("fonctionnaire") in France — excellent job security. "Le bac" (baccalauréat) is the key qualification teachers prepare students for.' },
      { fr: 'un(e) ingénieur(e)', en: 'an engineer', note: 'Engineering is a highly prestigious career in France. "Les grandes écoles d\'ingénieurs" (Polytechnique, Centrale, Mines) are the elite training grounds.' },
      { fr: 'un(e) informaticien(ne)', en: 'an IT professional', note: '"La tech" is a booming sector in France — "la French Tech" is the government brand for France\'s startup ecosystem, centred in Paris.' },
      { fr: 'un(e) développeur / développeuse', en: 'a developer', note: '"Un développeur full-stack / back-end / front-end." France produces world-class developers — École 42 (tuition-free, peer-learning coding school) is internationally famous.' },
      { fr: 'un(e) architecte', en: 'an architect', note: '"Un architecte DPLG" (Diplômé Par Le Gouvernement) — a protected title. French architecture is strictly regulated; the Bâtiments de France protect historical areas.' },
      { fr: 'un(e) journaliste', en: 'a journalist', note: 'French journalists hold a "carte de presse" — an official press card. France\'s media includes Le Monde, Le Figaro, Libération, and the satirical Le Canard Enchaîné.' },
      { fr: 'un(e) chef(fe) de projet', en: 'a project manager', note: '"Chef de projet" is a very common role across industries. "Chefferie de projet" = project management (as a discipline).' },
      { fr: 'un(e) commercial(e)', en: 'a sales representative', note: '"Un(e) commercial(e)" covers sales roles broadly. "Un VRP" (Voyageur Représentant Placier) = a travelling sales rep — a protected employment status.' },
      { fr: 'un(e) directeur / directrice', en: 'a director / manager', note: '"Directeur général" = general manager. "Directeur des ressources humaines (DRH)" = HR director. Leadership titles are specific in French organisations.' },
      { fr: 'un(e) PDG', en: 'a CEO', note: 'Président-Directeur Général. In France, the PDG combines the roles of chairman and CEO — unique to the French corporate structure.' },
      { fr: 'un(e) fonctionnaire', en: 'a civil servant', note: 'Around 20% of the French workforce is employed by the state. Civil servants have near-total job security — almost impossible to be made redundant. Hugely valued social status.' },
      { fr: 'un(e) entrepreneur(e)', en: 'an entrepreneur', note: '"La French Tech" has produced unicorns like BlaBlaCar, Doctolib, and Ledger. French entrepreneurship has grown dramatically — from a traditionally "employee culture" to a startup culture.' },
      { fr: 'un(e) freelance / indépendant(e)', en: 'a freelancer', note: '"Auto-entrepreneur" is the official simplified status for freelancers — introduced in 2009. Very easy to set up. "Portage salarial" = a hybrid employee/freelance status unique to France.' },
    ],
  },
  {
    category: 'Workplace Vocabulary — Au travail',
    items: [
      { fr: 'le bureau', en: 'office / desk', note: '"Aller au bureau" = to go to the office. "Travailler sur mon bureau" = to work at my desk. Same word — context distinguishes.' },
      { fr: 'le télétravail', en: 'remote working', note: 'Massively adopted after COVID-19. French law now requires employers to negotiate a "accord de télétravail" if remote work is regular. "Jour de télétravail" = a work-from-home day.' },
      { fr: 'une réunion', en: 'a meeting', note: '"Une réunion de service" = a departmental meeting. "Réunionite" = the French term for excessive meeting culture — a well-recognised workplace problem.' },
      { fr: 'un entretien', en: 'an interview / meeting', note: '"Un entretien d\'embauche" = a job interview. "Un entretien annuel" = an annual performance review — legally required in many French companies.' },
      { fr: 'un contrat', en: 'a contract', note: 'French employment law is heavily regulated — contracts are detailed legal documents. "Rompre un contrat" = to terminate a contract.' },
      { fr: 'le CDI', en: 'permanent contract', note: 'Contrat à Durée Indéterminée — the gold standard of French employment. Banks, landlords, and visa offices all prefer CDI holders. Extremely difficult for employers to terminate.' },
      { fr: 'le CDD', en: 'fixed-term contract', note: 'Contrat à Durée Déterminée — limited use strictly regulated by law. Cannot normally exceed 18 months. Must justify why a permanent contract wasn\'t offered.' },
      { fr: 'la période d\'essai', en: 'trial / probation period', note: 'Typically 2–4 months, renewable once. Either party can terminate without reason during this period — the only flexible moment in French employment law.' },
      { fr: 'le salaire', en: 'salary / wage', note: '"Le salaire brut" = gross salary. "Le salaire net" = take-home pay. French payslips ("fiches de paie") are notoriously complex — charges can reduce gross to net by 25-30%.' },
      { fr: 'le SMIC', en: 'minimum wage', note: 'Salaire Minimum Interprofessionnel de Croissance — indexed to inflation. In 2024: approximately €1,767 gross / month. Applies to ALL employees in France regardless of nationality.' },
      { fr: 'les congés payés', en: 'paid leave / holiday', note: 'France mandates 5 weeks (25 working days) paid annual leave — among the most generous in the world. "La cinquième semaine" = the famous 5th week.' },
      { fr: 'les RTT', en: 'extra days off (35-hour week system)', note: 'Réduction du Temps de Travail — additional days off generated when you work over 35 hours/week. Many French professionals accumulate 10–15 RTT days per year.' },
      { fr: 'licencier', en: 'to make redundant / fire (formal)', note: '"Un licenciement économique" = redundancy for economic reasons. French employment law makes dismissal extremely difficult — requires justification and generous severance.' },
      { fr: 'démissionner', en: 'to resign', note: '"Donner sa démission" = to hand in one\'s notice. Notice periods in France are often 3 months for managers. "Un préavis" = the notice period.' },
      { fr: 'une promotion', en: 'a promotion', note: '"Être promu(e)" = to be promoted. "Une promotion interne" = an internal promotion. French managers are often reluctant to discuss salary during performance reviews.' },
      { fr: 'le bilan de compétences', en: 'a skills assessment (govt-funded)', note: 'A state-funded programme giving employees 24 hours of professional coaching to assess skills and plan career changes. A uniquely French career development tool.' },
    ],
  },
  {
    category: 'Email & Communication — Courriel et communication',
    items: [
      { fr: 'Objet :', en: 'Subject: (email)', note: 'Always required and precise in formal French emails. A vague "Objet" is considered unprofessional.' },
      { fr: 'Madame, Monsieur,', en: 'Dear Sir/Madam,', note: 'Standard formal email opening when the recipient is unknown. "Madame," before "Monsieur," is now the recommended order in official French correspondence.' },
      { fr: 'Suite à notre entretien…', en: 'Following our interview/meeting…', note: '"Suite à" = following. Standard phrase for follow-up emails after meetings or interviews.' },
      { fr: 'Je me permets de vous contacter…', en: 'I am writing to contact you…', note: '"Je me permets de" = I take the liberty of. A polite way to initiate contact with someone who doesn\'t know you.' },
      { fr: 'Veuillez trouver en pièce jointe…', en: 'Please find attached…', note: '"La pièce jointe (PJ)" = an attachment. "Ci-joint" = attached/enclosed. "Je vous adresse en PJ" is also used.' },
      { fr: 'Dans l\'attente de votre réponse…', en: 'Looking forward to your reply…', note: '"Dans l\'attente de vous lire" (looking forward to reading you) is the more formal variant.' },
      { fr: 'Cordialement,', en: 'Kind regards, / Best regards,', note: 'The standard professional sign-off in France. Less formal than English "Yours sincerely" — perfectly appropriate for most business emails.' },
      { fr: 'Bien cordialement,', en: 'Best wishes, (slightly warmer)', note: 'Slightly warmer than "Cordialement" — used when you know the recipient a little.' },
      { fr: 'Bien à vous,', en: 'Yours sincerely, (formal)', note: 'More personal than "Cordialement". "À vous" implies a personal regard for the recipient.' },
      { fr: 'Je vous prie d\'agréer l\'expression de mes salutations distinguées.', en: 'Please accept my distinguished greetings. (very formal)', note: 'The most formal French email/letter closing — used in official letters, cover letters, and administrative correspondence. Never use in informal contexts.' },
      { fr: 'En attente de votre retour,', en: 'Awaiting your response,', note: 'Common in professional emails — "votre retour" (your return/response) is standard business French.' },
      { fr: 'N\'hésitez pas à me contacter si besoin.', en: 'Please don\'t hesitate to contact me if needed.', note: 'A standard polite email closing phrase — used in nearly every French professional email.' },
    ],
  },
]

const WORK_CULTURE = [
  { title: '35-hour working week', fr: 'la semaine de 35 heures', desc: 'France introduced the 35-hour working week (loi Aubry) in 2000. Hours beyond this generate RTT (extra days off) or overtime pay. In practice, many managers and executives work more — but the principle of work-life balance is enshrined in law and culture.', icon: '⏰' },
  { title: 'La pause déjeuner — sacred lunch', fr: 'the lunch break', desc: 'French workers typically take a proper 1–2 hour lunch break — eating at the desk is considered uncivilised. Many companies have a subsidised staff restaurant ("la cantine d\'entreprise" or "le restaurant inter-entreprises"). Lunch "tickets restaurant" (Swile, Edenred) are a standard workplace benefit.', icon: '🍽️' },
  { title: 'Les grandes vacances', fr: 'summer holidays', desc: 'France mandates 5 weeks minimum paid leave. August is when many businesses run at minimal capacity — avoid scheduling important meetings or negotiations in August. "C\'est le mois d\'août" is an explanation for everything being closed.', icon: '🏖️' },
  { title: 'Le CDI — France\'s golden contract', fr: 'permanent contract culture', desc: 'A CDI (permanent contract) is enormously prized in France. Banks require one to approve mortgages; landlords require one (or a guarantor) to rent a flat. Young workers on CDDs (fixed-term contracts) face significant life obstacles. CDI culture shapes major life decisions.', icon: '📄' },
  { title: 'Tutoyer vs. vouvoyer at work', fr: 'tu vs. vous in the office', desc: 'French work culture varies: start-ups and creative agencies may use "tu" immediately; traditional corporations, banking, law, and the civil service use "vous" with hierarchy and new colleagues. The shift from "vous" to "tu" ("le passage au tutoiement") is a social milestone. Always follow your colleagues\' lead — never initiate "tu" with a superior.', icon: '👔' },
  { title: 'La hiérarchie et la distance', fr: 'hierarchy and professional distance', desc: 'French workplaces tend to have clearer hierarchical structures than Anglo-Saxon cultures. Decisions often come from the top. Meetings can be more formal. However, intellectual debate and argument with superiors is culturally accepted — perhaps more so than in the UK or USA. The French value competence and eloquence over rank alone.', icon: '🏛️' },
  { title: 'Le droit du travail — powerful employment law', fr: 'French labour law', desc: 'France\'s Labour Code ("le Code du travail") runs to over 3,000 pages. It protects employees extensively: notice periods of 1–3 months, redundancy compensation ("indemnités de licenciement"), union rights, and works councils ("comités sociaux et économiques / CSE") with real power. Employers must negotiate major changes with employee representatives.', icon: '⚖️' },
]

const PHRASES = [
  { fr: 'Qu\'est-ce que vous faites dans la vie ?', en: 'What do you do for a living? (formal)', note: '"Dans la vie" = "in life" — a warmer way to ask than "Quel est votre métier ?" (more formal). Both are used.' },
  { fr: 'Je travaille pour une entreprise de logiciels à Paris.', en: 'I work for a software company in Paris.', note: '"Une entreprise de" + sector. "Une PME" = a small/medium enterprise (Petite et Moyenne Entreprise).' },
  { fr: 'Je suis en télétravail aujourd\'hui.', en: "I'm working from home today.", note: '"Télétravail" became universally used post-2020. "Je fais du distanciel" is also used in some sectors.' },
  { fr: 'On a une réunion à 14h — tu es disponible ?', en: "We have a meeting at 2pm — are you free?", note: '"Tu es disponible ?" assumes "tu" — use "vous êtes disponible ?" in formal settings.' },
  { fr: 'Je vais prendre ma pause déjeuner — à tout à l\'heure.', en: "I'm going to take my lunch break — see you in a bit.", note: '"À tout à l\'heure" = see you in a bit (same day). "À toute" = informal abbreviation.' },
  { fr: 'Je suis en congé la semaine prochaine — Lucie me remplace.', en: "I'm on leave next week — Lucie is covering for me.", note: '"Remplacer quelqu\'un" = to cover for someone. "Assurer l\'intérim" = to handle cover duties officially.' },
  { fr: 'Je cherche un nouveau poste — vous n\'auriez pas des contacts ?', en: "I'm looking for a new position — do you have any contacts?", note: 'Networking in France is very relationship-based. "Le réseau" (network) is crucial — often more than a CV.' },
  { fr: 'J\'ai décroché un CDI — je suis soulagé(e) !', en: "I've landed a permanent contract — I'm so relieved!", note: '"Décrocher" = to land/get (lit. to unhook). The relief of getting a CDI is a genuine cultural emotion in France.' },
  { fr: 'Le rapport est à rendre pour vendredi prochain au plus tard.', en: 'The report is due by next Friday at the latest.', note: '"Au plus tard" = at the latest. "À rendre" = to be submitted/handed in. Standard deadline language.' },
  { fr: 'Pouvez-vous me mettre en copie sur ce mail ?', en: 'Can you CC me on this email?', note: '"Mettre en copie" = to CC. "En copie cachée (CCC)" = BCC. French email etiquette around CC lists is taken seriously.' },
  { fr: 'On fait le point lors de notre prochain one-to-one ?', en: 'Shall we catch up in our next one-to-one?', note: '"Faire le point" = to take stock / catch up. "Un one-to-one" (English borrowed) = a one-to-one meeting.' },
  { fr: 'J\'ai posé une semaine de congés en août.', en: "I've booked a week's holiday in August.", note: '"Poser des congés" = to book/take leave. "Poser ses RTT" = to use your RTT days. The HR system ("SIRH") usually manages this.' },
]

const FRENCH_WORK_LAW = [
  { emoji: '📋', title: 'Le Code du travail', detail: 'France\'s Labour Code ("le Code du travail") is one of the world\'s most comprehensive — over 3,000 pages covering every aspect of employment. It protects workers extensively from dismissal, regulates working conditions, and mandates benefits. Employers must navigate it carefully. Labour lawyers ("avocats en droit du travail") are in high demand.' },
  { emoji: '🤝', title: 'Les syndicats (trade unions)', detail: 'France has a strong union tradition. Major unions: CGT (historically communist), CFDT (reformist), FO (independent), and others. Union membership is actually lower in France than in the UK or Germany (~11%) but their influence via works councils and national negotiations is disproportionately large. "Les partenaires sociaux" = unions + employer federations, who negotiate national agreements.' },
  { emoji: '🏢', title: 'Le CSE (Comité Social et Économique)', detail: 'The CSE (works council) is mandatory for companies with 11+ employees. It represents workers in negotiations on working conditions, restructuring, and redundancies. CSE members have significant legal protections against dismissal. In large companies, the CSE must be consulted before major decisions — a genuine check on management power.' },
  { emoji: '💰', title: 'Les avantages en nature (employee benefits)', detail: 'Beyond salary, French employers routinely provide: "tickets restaurant" (meal vouchers), "mutuelle" (health top-up insurance — mandatory since 2016), profit-sharing ("intéressement/participation"), transport subsidies (50% of public transport costs paid by law), and company savings plans ("PEE/PERCO"). The total compensation package can significantly exceed the headline salary.' },
  { emoji: '🔴', title: 'La grève et le droit syndical', detail: 'The right to strike is constitutionally guaranteed. Employees cannot be dismissed for going on strike (unless they commit a "faute lourde"). Unions must give 5 days\' notice of a strike in essential services. French strike rates are among Europe\'s highest — particularly in transport, education, and health. "Un piquet de grève" = a picket line.' },
]

export default function FrenchAtWork() {
  const [tab, setTab] = useState('vocab')
  const [activeCategory, setActiveCategory] = useState(0)

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French at Work | SayBonjour!" description="Learn French workplace vocabulary — job titles, office phrases, email etiquette, French work culture, and labour law." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">French at Work</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Le monde du travail — workplace vocabulary, work culture, and French labour law</p>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          {[
            { id: 'vocab', label: 'Vocabulary' },
            { id: 'culture', label: 'Work Culture' },
            { id: 'phrases', label: 'Phrases' },
            { id: 'law', label: 'Labour Law' },
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
              {WORK_SECTIONS.map((cat, i) => (
                <button key={cat.category} onClick={() => { setActiveCategory(i); addXP(3, 'vocabulary') }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeCategory === i ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
                  {cat.category.split('—')[0].trim()}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {WORK_SECTIONS[activeCategory].items.map((item, i) => (
                <motion.div key={item.fr} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="bg-white dark:bg-dark-warm-100 rounded-xl shadow border border-gray-100 dark:border-dark-warm-50 px-4 py-3 flex items-start gap-3 cursor-pointer"
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

        {tab === 'culture' && (
          <div className="space-y-4">
            {WORK_CULTURE.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-5 cursor-pointer"
                onClick={() => addXP(4, 'vocabulary')}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-cream-50">{item.title}</h3>
                    <p className="text-xs text-burgundy-600 dark:text-burgundy-vibrant-300 italic">{item.fr}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'phrases' && (
          <div className="space-y-3">
            {PHRASES.map((phrase, i) => (
              <motion.div key={phrase.fr} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="bg-white dark:bg-dark-warm-100 rounded-xl shadow border border-gray-100 dark:border-dark-warm-50 p-4 flex items-start gap-3 cursor-pointer"
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

        {tab === 'law' && (
          <div className="space-y-4">
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 mb-2 text-sm text-amber-800 dark:text-amber-300">
              French labour law is among the world\'s most comprehensive — understanding it is essential for anyone working in France.
            </div>
            {FRENCH_WORK_LAW.map((item, i) => (
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
