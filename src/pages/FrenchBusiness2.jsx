import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, Mail } from 'lucide-react'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const BUSINESS_SECTIONS = [
  {
    category: 'Company & Organisation',
    emoji: '🏢',
    items: [
      { fr: 'une entreprise / une société', en: 'a company / business', note: '"Entreprise" = broader term. "Société" = company with a legal structure. "Une PME" (petite et moyenne entreprise) = an SME.' },
      { fr: 'une multinationale', en: 'a multinational corporation', note: 'France is home to many global multinationals: LVMH, Total Energies, Carrefour, BNP Paribas, Airbus, Renault.' },
      { fr: 'une start-up', en: 'a start-up', note: '"La French Tech" = France\'s tech start-up ecosystem. Paris\'s "Station F" (founded 2017) is the world\'s largest start-up campus.' },
      { fr: 'un groupe', en: 'a group / conglomerate', note: '"Le groupe LVMH" = the LVMH group. French companies often organise as groups of subsidiaries.' },
      { fr: 'une filiale', en: 'a subsidiary', note: '"Une filiale à 100%" = a wholly-owned subsidiary.' },
      { fr: 'un siège social', en: 'a registered office / headquarters', note: '"Le siège social est à Paris, 8e arrondissement" — many French HQs are in Paris\'s luxury business district.' },
      { fr: 'le conseil d\'administration', en: 'the board of directors', note: '"Un administrateur / une administratrice" = a board member. "Le président du conseil d\'administration" = the chairman.' },
      { fr: 'le PDG (président-directeur général)', en: 'CEO / MD', note: '"Le PDG" combines the roles of chairman and CEO — more concentrated power than Anglo-American structures.' },
      { fr: 'le DG (directeur général)', en: 'managing director / CEO', note: '"Directeur général" = general director, roughly equivalent to MD or CEO in French companies where chairman/CEO roles are separate.' },
      { fr: 'les ressources humaines (RH)', en: 'human resources (HR)', note: '"Le DRH" (directeur des ressources humaines) = HR director. "Passer par les RH" = to go through HR.' },
      { fr: 'la comptabilité', en: 'accounting / accounts', note: '"Un comptable / une comptable" = an accountant. "La compta" = informal term for the accounts department.' },
      { fr: 'le marketing', en: 'marketing', note: '"Le marketing digital" = digital marketing. "Un chef de produit" = a product manager.' },
    ],
  },
  {
    category: 'Contracts & Finance',
    emoji: '📊',
    items: [
      { fr: 'un CDI (contrat à durée indéterminée)', en: 'permanent / open-ended contract', note: 'The "holy grail" of French employment — extremely hard to dismiss a CDI employee. French labour law strongly protects permanent workers.' },
      { fr: 'un CDD (contrat à durée déterminée)', en: 'fixed-term contract', note: 'Maximum duration: 18 months (renewable once). Very common for seasonal, replacement, or project-based work.' },
      { fr: 'un contrat de travail', en: 'an employment contract', note: 'Must specify position, salary, working hours, notice period, and applicable collective agreement ("convention collective").' },
      { fr: 'le chiffre d\'affaires', en: 'turnover / revenue', note: '"Le CA" (abbreviation). "Notre CA a augmenté de 15% cette année" = our turnover grew 15% this year.' },
      { fr: 'le bilan', en: 'balance sheet', note: '"Déposer le bilan" = to file for bankruptcy. "Le bilan comptable" = the accounting balance sheet.' },
      { fr: 'le résultat net', en: 'net profit / bottom line', note: '"Le résultat net" = profit after tax. "Le résultat d\'exploitation" = operating profit (EBIT).' },
      { fr: 'une facture', en: 'an invoice', note: '"Établir / envoyer une facture" = to issue an invoice. "Régler une facture" = to pay an invoice. "Une facture pro forma" = a pro forma invoice.' },
      { fr: 'un devis', en: 'a quote / estimate', note: '"Faire un devis" = to prepare a quote. "Le devis est valable 30 jours" = the quote is valid for 30 days.' },
      { fr: 'un bon de commande', en: 'a purchase order', note: '"Le bon de commande" = the formal document authorising a purchase. "Passer une commande" = to place an order.' },
      { fr: 'un budget', en: 'a budget', note: '"Tenir le budget" = to stay within budget. "Dépasser le budget" = to go over budget. "Allouer un budget" = to allocate a budget.' },
      { fr: 'une prime', en: 'a bonus / premium', note: '"Une prime de performance" = a performance bonus. "La prime de Noël" = Christmas bonus. "Une prime de risque" = a risk premium.' },
      { fr: 'les charges sociales', en: 'employer\'s social contributions', note: 'France has high "charges sociales" — employers pay roughly 40-45% on top of gross salary in social contributions (pension, health, etc.).' },
    ],
  },
  {
    category: 'Employment & HR',
    emoji: '👥',
    items: [
      { fr: 'un entretien d\'embauche', en: 'a job interview', note: '"Passer un entretien" = to have an interview. "Le recruteur / la recruteuse" = the recruiter. "Un chasseur de têtes" = a headhunter.' },
      { fr: 'un CV (curriculum vitae)', en: 'a CV / résumé', note: 'French CVs: typically one page (experienced = two pages), always with a professional photo, and structured by chronological reverse order. NO date of birth required legally.' },
      { fr: 'une lettre de motivation', en: 'a cover letter', note: 'Very important in France — typically a formal, well-written letter demonstrating motivation and fit. Much more detailed than British-style covering letters.' },
      { fr: 'un stage', en: 'an internship / placement', note: '"Le stagiaire" = intern. Internships are mandatory in most French degree programmes. Even senior professionals have stages on their CV.' },
      { fr: 'un congé payé', en: 'paid leave / holiday', note: 'France legally mandates 5 weeks (25 days) of paid holiday — among the most generous in the world. "Les RTT" (réduction du temps de travail) = additional days off for those working over 35h.' },
      { fr: 'le congé maternité / paternité', en: 'maternity / paternity leave', note: 'Maternity leave: 16 weeks (longer for additional children). Paternity leave: 25 days. Fully paid through health insurance.' },
      { fr: 'les 35 heures', en: 'the 35-hour working week', note: 'France\'s famous 35-hour working week (introduced 2000, Jospin government). In practice, many professionals work longer and earn RTT days.' },
      { fr: 'le télétravail', en: 'remote working / working from home', note: '"Le télétravail" expanded dramatically post-COVID. "Un jour de télétravail" = a working-from-home day. Now a standard in French employment contracts.' },
      { fr: 'un syndicat', en: 'a trade union', note: 'France has a rich trade union tradition. Major unions: CGT, CFDT, FO, SUD. Union membership is low (10%) but unions have outsized influence through industry-wide negotiations.' },
      { fr: 'le licenciement', en: 'dismissal / redundancy', note: '"Être licencié(e)" = to be made redundant/dismissed. Very high legal protections — dismissal requires serious justification ("motif réel et sérieux").' },
    ],
  },
]

const EMAIL_PHRASES = [
  { context: 'Opening (formal)', phrases: [
    { fr: 'Madame, Monsieur,', en: 'Dear Sir / Madam,', note: 'When you don\'t know the gender of the recipient. Standard for official correspondence.' },
    { fr: 'Monsieur le Directeur,', en: 'Dear Director,', note: 'When writing to someone with a title — use the title after "Monsieur/Madame", not their name.' },
    { fr: 'Cher Monsieur Dupont,', en: 'Dear Mr Dupont,', note: '"Cher" (m) / "Chère" (f). If you know the person professionally but not intimately.' },
    { fr: 'Suite à notre entretien téléphonique d\'hier,', en: 'Following our telephone conversation yesterday,', note: '"Suite à" = following. Essential to reference previous contact.' },
    { fr: 'Je me permets de vous contacter au sujet de…', en: 'I am taking the liberty of contacting you regarding…', note: '"Je me permets" = I take the liberty — very polite and formal.' },
    { fr: 'En réponse à votre courriel du 15 mai,', en: 'In response to your email of 15 May,', note: '"Courriel" = the official French word for email (from "courrier électronique").' },
  ]},
  { context: 'Body phrases', phrases: [
    { fr: 'Veuillez trouver ci-joint le document demandé.', en: 'Please find attached the requested document.', note: '"Ci-joint" = attached (with documents). "En pièce jointe" = as an attachment.' },
    { fr: 'Je vous remercie de votre réponse rapide.', en: 'Thank you for your prompt reply.', note: '"Je vous remercie de" + infinitive = thank you for doing something.' },
    { fr: 'N\'hésitez pas à me contacter pour tout renseignement.', en: 'Please do not hesitate to contact me for any further information.', note: 'The standard French email sign-off phrase before the closing.' },
    { fr: 'Dans l\'attente de votre réponse, je reste à votre disposition.', en: 'While awaiting your reply, I remain at your disposal.', note: 'Elegant pre-closing phrase.' },
    { fr: 'Je me tiens à votre disposition pour tout complément d\'information.', en: 'I am at your disposal for any further information.', note: '"Se tenir à disposition" = to be available/ready.' },
    { fr: 'Pourriez-vous me confirmer la réception de cet email ?', en: 'Could you confirm receipt of this email?', note: '"Confirmer la réception" = to acknowledge receipt.' },
    { fr: 'Nous vous confirmons votre commande du 10 juin.', en: 'We confirm your order of 10 June.', note: 'Standard order acknowledgement opening.' },
  ]},
  { context: 'Closing (formal)', phrases: [
    { fr: 'Veuillez agréer, Madame, Monsieur, l\'expression de mes salutations distinguées.', en: 'Yours faithfully / sincerely (very formal)', note: 'The traditional full formal closing — still required for official and administrative letters. Very rarely seen in emails.' },
    { fr: 'Je vous prie d\'agréer, Monsieur le Directeur, l\'expression de ma considération distinguée.', en: 'Yours sincerely (very formal — to a person of authority)', note: 'The gender/title must match: Monsieur / Madame / Monsieur le Directeur. The formula must echo the opening.' },
    { fr: 'Cordialement,', en: 'Best regards / Kind regards (standard professional email)', note: 'The most common professional sign-off for emails — warm without being overly formal.' },
    { fr: 'Bien cordialement,', en: 'Best regards (slightly warmer than Cordialement)', note: '"Bien cordialement" = more personal. Used when you know the person reasonably well.' },
    { fr: 'Avec mes meilleures salutations,', en: 'With best wishes,', note: 'Warm but professional — a step above "Cordialement".' },
    { fr: 'Très cordialement,', en: 'Very warmly / With warm regards', note: 'When you have a friendly professional relationship.' },
  ]},
]

const MEETING_PHRASES = [
  { fr: 'Pouvons-nous fixer un rendez-vous la semaine prochaine ?', en: 'Can we set up a meeting next week?', note: '"Fixer un rendez-vous" = to arrange/fix a meeting. "Un rendez-vous" = a meeting or appointment in all contexts.' },
  { fr: 'Je suis disponible le mardi matin ou le jeudi après-midi.', en: 'I\'m available Tuesday morning or Thursday afternoon.', note: '"Disponible" = available. "Indisponible" = unavailable. Always offer alternatives.' },
  { fr: 'La réunion commence à 10h précises — soyez à l\'heure.', en: 'The meeting starts at 10am sharp — please be on time.', note: '"À 10h précises" = at exactly 10am. French professionals generally expect punctuality in meetings.' },
  { fr: 'Je n\'ai pas bien entendu — pourriez-vous répéter, s\'il vous plaît ?', en: 'I didn\'t quite catch that — could you repeat, please?', note: '"Je n\'ai pas bien entendu" = I didn\'t quite hear. "Je n\'ai pas compris" = I didn\'t understand.' },
  { fr: 'Pouvez-vous parler un peu plus lentement, s\'il vous plaît ?', en: 'Could you speak a little more slowly, please?', note: 'Essential for non-native French speakers in business meetings.' },
  { fr: 'Qu\'est-ce que vous entendez par là exactement ?', en: 'What exactly do you mean by that?', note: '"Entendre" here = to understand/mean, not "to hear". A clarification question.' },
  { fr: 'Je suis entièrement d\'accord avec vous.', en: 'I completely agree with you.', note: '"Entièrement d\'accord" = completely agree. "Tout à fait" = absolutely (emphatic agreement).' },
  { fr: 'Je ne partage pas tout à fait votre point de vue.', en: 'I don\'t entirely share your point of view.', note: 'A polite way to disagree in French professional context.' },
  { fr: 'Permettez-moi de résumer les points clés.', en: 'Allow me to summarise the key points.', note: '"Les points clés" = key points. "Le compte rendu" = the meeting minutes.' },
  { fr: 'Passons au point suivant de l\'ordre du jour.', en: 'Let\'s move to the next item on the agenda.', note: '"L\'ordre du jour" = the agenda. "À l\'ordre du jour" = on the agenda.' },
  { fr: 'Nous reviendrons sur ce point lors de la prochaine réunion.', en: 'We\'ll come back to this point at the next meeting.', note: '"Revenir sur" = to come back to / revisit.' },
  { fr: 'Je propose qu\'on reporte ce débat à plus tard.', en: 'I suggest we defer this discussion to later.', note: '"Reporter" = to defer/postpone. "Mettre de côté" = to set aside.' },
]

const WORK_CULTURE = [
  { emoji: '🥗', title: 'Le déjeuner professionnel', detail: 'Lunch in France is sacred — even in business. A 1.5–2 hour working lunch is normal, genuine, and important. French professionals build relationships over food. "Un déjeuner d\'affaires" = a business lunch. The restaurant chosen sends a signal about status and intent. Eating quickly at a desk is considered slightly pathetic.' },
  { emoji: '✉️', title: 'Les courriels formels', detail: 'French professional emails are famously elaborate — especially the sign-off. The "formule de politesse" at the end can be 2-3 lines. A simple "Merci" sign-off to a client or senior colleague is considered abrupt. Learning the formulas ("Veuillez agréer...", "Cordialement") is essential for professional credibility in France.' },
  { emoji: '🏖️', title: 'Les 5 semaines de congé', detail: 'French law mandates 5 weeks of paid holidays (25 working days) — one of the most generous in the world. Plus public holidays (11 per year). Plus potential RTT days. August is sacred for holidays — major companies operate with skeleton staff. Planning important business in August is futile — always warn clients and partners.' },
  { emoji: '🤝', title: 'La hiérarchie et le tutoiement', detail: 'French workplaces respect hierarchy more than many Northern European companies. Start-ups often use "tu" immediately; traditional companies (banking, law, luxury) may keep "vous" for months or years. Wait to be invited to switch. Calling senior colleagues by first name immediately, as is normal in UK/US offices, can seem presumptuous in France.' },
]

export default function FrenchBusiness2() {
  const [tab, setTab] = useState('vocab')
  const [emailSection, setEmailSection] = useState(0)
  const [activeCategory, setActiveCategory] = useState(0)

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="Business French | SayBonjour!" description="Professional French for the workplace — business vocabulary, formal email phrases, meeting language, and French work culture." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">Business French</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Le français professionnel — vocabulary, emails, meeting language, and work culture</p>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          {[
            { id: 'vocab', label: 'Business Vocab' },
            { id: 'emails', label: 'Email Phrases' },
            { id: 'meetings', label: 'Meeting Language' },
            { id: 'culture', label: 'Work Culture' },
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
              {BUSINESS_SECTIONS.map((s, i) => (
                <button key={s.category} onClick={() => { setActiveCategory(i); addXP(3, 'vocabulary') }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeCategory === i ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
                  {s.emoji} {s.category}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {BUSINESS_SECTIONS[activeCategory].items.map((item, i) => (
                <motion.div key={item.fr} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="bg-white dark:bg-dark-warm-100 rounded-xl shadow border border-gray-100 dark:border-dark-warm-50 px-4 py-3 flex items-start gap-3"
                  onClick={() => addXP(2, 'vocabulary')}>
                  <SpeakButton text={item.fr} size="sm" />
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className="font-medium text-sm text-burgundy-700 dark:text-burgundy-vibrant-300">{item.fr}</span>
                      <span className="text-xs text-gray-400">— {item.en}</span>
                    </div>
                    {item.note && <p className="text-xs text-amber-600 dark:text-amber-400 italic mt-0.5">💡 {item.note}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {tab === 'emails' && (
          <>
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 text-sm text-amber-800 dark:text-amber-300 mb-5">
              💡 French professional emails are more formal than English ones — especially the sign-off ("formule de politesse"). The opening must match the closing formula exactly. "Cordialement" is safe for most professional emails.
            </div>
            <div className="flex gap-2 mb-5 flex-wrap">
              {EMAIL_PHRASES.map((s, i) => (
                <button key={s.context} onClick={() => { setEmailSection(i); addXP(2, 'vocabulary') }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${emailSection === i ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
                  {s.context}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {EMAIL_PHRASES[emailSection].phrases.map((p, i) => (
                <motion.div key={p.fr} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
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
          </>
        )}

        {tab === 'meetings' && (
          <div className="space-y-3">
            {MEETING_PHRASES.map((p, i) => (
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

        {tab === 'culture' && (
          <div className="space-y-4">
            {WORK_CULTURE.map((item, i) => (
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
