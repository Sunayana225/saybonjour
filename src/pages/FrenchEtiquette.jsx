import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, AlertCircle } from 'lucide-react'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const ETIQUETTE_SECTIONS = [
  {
    title: 'Greetings & Politeness',
    icon: '🤝',
    rules: [
      { rule: 'Always say "Bonjour" first', desc: 'Enter any shop, doctor\'s office, lift, café, or small gathering and say "Bonjour" first — before anything else. Starting a transaction or conversation without a greeting is genuinely considered rude. "Bonjour Madame / Bonjour Monsieur" is even better.' },
      { rule: 'Use "vous" with strangers and authority figures', desc: 'The formal "vous" is essential with shop staff, officials, doctors, older people, teachers, and anyone you\'ve just met. Using "tu" too quickly can seem presumptuous or disrespectful. When in doubt, use "vous" and wait to be invited to switch.' },
      { rule: '"S\'il vous plaît" is non-negotiable', desc: 'Never order in a café without "s\'il vous plaît". "Un café" alone sounds brusque and rude. "Un café, s\'il vous plaît" is the minimum. "Je voudrais un café, s\'il vous plaît" is even better.' },
      { rule: '"Au revoir" when leaving', desc: 'Leaving a shop, café, doctor\'s surgery, or social gathering without "au revoir" is considered abrupt. Always take a moment to acknowledge your departure. "Bonne journée !" (Have a good day!) or "Bonne soirée !" (Good evening!) are excellent add-ons.' },
      { rule: 'The bisou — la bise (cheek kiss)', desc: 'Greeting between friends and acquaintances involves la bise — cheek kisses. The number varies by region: 1 in some areas, 2 in most of France, 3 in some regions (Provence), 4 in some areas (Normandy). The bise is always air-kiss cheek-to-cheek, never lips. Start right cheek in Paris. COVID changed some habits, but la bise is returning.' },
      { rule: 'Handshake in professional settings', desc: 'In professional contexts (meetings, introductions), a firm handshake is correct. Colleagues who see each other daily often shake hands in the morning. This is more formal than Anglo-American professional culture.' },
    ],
  },
  {
    title: 'Table & Dining Manners',
    icon: '🍽️',
    rules: [
      { rule: 'Wait for "Bon appétit!"', desc: 'Don\'t start eating until the host or someone at the table says "Bon appétit!" — or everyone is served. Beginning before others is considered impolite.' },
      { rule: 'Bread on the table, not a plate', desc: 'Bread goes directly on the table (or a small side plate if provided) — not on a bread plate (pain plate). It\'s a tradition, not bad manners. Feel free to use bread to soak up sauce (le saucer) — it\'s perfectly acceptable.' },
      { rule: 'Both forearms visible on the table', desc: 'Keep both wrists or forearms visible on the table — not in your lap. This dates from a historical tradition of showing you aren\'t hiding a weapon. Considered proper posture.' },
      { rule: 'Cheese before dessert — always', desc: 'In a French meal, cheese (le fromage) comes BEFORE dessert, not after. Never cut the tip off a triangular wedge of cheese (the "pointe") — take a slice from the side. With round cheeses, cut a wedge like a cake.' },
      { rule: 'Don\'t rush the meal', desc: 'French meals are long by intention. A Sunday lunch (le déjeuner du dimanche) can last 3–4 hours. Rushing indicates you aren\'t enjoying the food or company — both insults. The conversation is as important as the food.' },
      { rule: 'Asking for modifications is unusual', desc: 'Asking for extensive dish modifications ("no sauce, dressing on the side, gluten-free") is less common in traditional French restaurants and can be poorly received. Simple requests (vegetarian, allergy) are increasingly accepted.' },
    ],
  },
  {
    title: 'Social Etiquette',
    icon: '🥂',
    rules: [
      { rule: 'Bring a gift when invited to someone\'s home', desc: 'Wine, good chocolates, or flowers (not chrysanthemums — those are for funerals; not too many — 13 flowers is bad luck). Don\'t bring red roses (romantic). The host may not open the gift immediately in front of you.' },
      { rule: 'Don\'t discuss money, salary or the price of things', desc: 'Personal finances are private in France. Asking someone\'s salary is very impolite. Mentioning what you paid for something can feel boastful or inappropriate. The French find American-style salary transparency culturally strange.' },
      { rule: 'Arrive 10–15 minutes late for dinner', desc: '"Arriver en avance" (arriving early) embarrasses the host who isn\'t ready. For a social dinner invitation, 10–15 minutes late is correct. For professional appointments, be precisely on time or 2 minutes early.' },
      { rule: 'Debate and argument are social virtues', desc: 'Passionate disagreement about food, politics, philosophy, and culture is considered an intellectual pleasure, not a social problem. Don\'t be alarmed by vigorous debate at dinner — it means you\'re among people who respect your intelligence.' },
      { rule: 'Compliment the food, not the decor', desc: 'If invited for dinner, complimenting the food is always welcome. Gushing over the apartment or furniture can seem materialistic. Focus on the quality of what\'s been prepared for you.' },
    ],
  },
  {
    title: 'In Public',
    icon: '🏙️',
    rules: [
      { rule: 'Moderate your speaking volume', desc: 'Loud conversations in public — on the phone, in restaurants, on public transport — are seen as intrusive and inconsiderate. The French tend to speak at a moderate volume even in groups. Laughing loudly in the street can attract disapproving looks.' },
      { rule: 'Queue (faire la queue) properly', desc: 'The French take queueing seriously. Cutting in line (resquiller) is a genuine social offence. "Il y a une queue, Monsieur/Madame" (There is a queue, Sir/Madam) is the correct response to a queue-cutter.' },
      { rule: 'Dress with some thought', desc: 'The French tend to dress with care even for casual outings. Visiting churches or formal establishments requires covered shoulders and non-beach attire. Very casual dress (athletic wear) in a nice restaurant can feel out of place.' },
      { rule: 'Smiling at strangers is unusual', desc: 'Smiling at strangers on the street without cause is unusual in France (and in much of Europe). It can be misread as strange or flirtatious. Smiling in context — in conversation, as a greeting — is completely normal and warm.' },
      { rule: 'Keep streets and spaces clean', desc: 'Paris in particular has worked hard to improve cleanliness. Dropping litter is considered genuinely antisocial. Dogs\' mess (le crotin) is a longtime Parisian issue — less so now with better enforcement.' },
    ],
  },
  {
    title: 'Work & Professional',
    icon: '💼',
    rules: [
      { rule: '"Tutoyez-vous ?" — wait before using tu', desc: 'In most French workplaces, you use "vous" until your colleagues explicitly invite you to switch to "tu". Start-ups and younger companies default to "tu" quickly; traditional companies (law, finance) may keep "vous" indefinitely.' },
      { rule: 'Long lunches are not wasted time', desc: 'A 1.5–2 hour lunch is normal in French professional culture. The "déjeuner de travail" (working lunch) is genuine networking and relationship-building. Eating quickly at a desk is seen as somewhat sad.' },
      { rule: 'Email sign-offs are elaborate', desc: 'French professional emails end with formulas like "Veuillez agréer, Madame/Monsieur, l\'expression de mes salutations distinguées" or "Cordialement" (more informal). The sign-off is as important as the content. Ending with just "Merci" is abrupt.' },
      { rule: 'August is sacred', desc: 'Many French businesses — including major companies — operate with skeleton staff or close entirely in August. Planning any significant business for August is futile. "Il est en vacances" is the most common response to emails in August.' },
    ],
  },
]

const POLITE_PHRASES = [
  { fr: 'Bonjour Madame / Monsieur.', en: 'Hello, Madam / Sir.', note: 'Use this when entering shops, appointments, or meeting someone for the first time that day.' },
  { fr: 'S\'il vous plaît.', en: 'Please. (formal)', note: 'Essential. Never omit it in requests. "S\'il te plaît" = informal version.' },
  { fr: 'Merci beaucoup.', en: 'Thank you very much.', note: 'Also: "Je vous remercie" (formal, to a professional) or "C\'est très gentil" (very kind).' },
  { fr: 'Je vous en prie.', en: 'You\'re welcome. (formal)', note: '"De rien" is informal; "je vous en prie" is the polished version used in formal contexts.' },
  { fr: 'Excusez-moi de vous déranger.', en: 'Excuse me for disturbing you.', note: '"Excusez-moi" alone is fine; this longer form is extra polite when interrupting someone.' },
  { fr: 'Je suis désolé(e).', en: 'I\'m sorry.', note: 'More sincere apology than "pardon". "Toutes mes excuses" = my sincerest apologies.' },
  { fr: 'Avec plaisir.', en: 'With pleasure.', note: 'A gracious and warm way to say yes to a request — nicer than "oui".' },
  { fr: 'À votre santé !', en: 'Cheers! (lit. To your health!)', note: 'Always maintain eye contact when clinking glasses — breaking eye contact is considered rude.' },
  { fr: 'Bonne journée !', en: 'Have a good day!', note: 'Said when leaving a shop or ending a daytime interaction.' },
  { fr: 'Bonne soirée !', en: 'Have a good evening!', note: 'Used from late afternoon onwards.' },
  { fr: 'Bon appétit !', en: 'Enjoy your meal!', note: 'Always said before eating — the host says it first, then everyone repeats it.' },
  { fr: 'C\'est très gentil de votre part.', en: 'That\'s very kind of you.', note: '"Votre part" = formal. "Ta part" = informal. A warm and elegant thank-you phrase.' },
  { fr: 'Enchanté(e) de faire votre connaissance.', en: 'Delighted to meet you.', note: 'Slightly formal but always appreciated at a first meeting.' },
]

export default function FrenchEtiquette() {
  const [tab, setTab] = useState('rules')
  const [activeSection, setActiveSection] = useState(0)

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French Etiquette & Social Customs | SayBonjour!" description="Master French social etiquette — greetings, dining manners, la bise, professional customs, and polite phrases." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">French Etiquette</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Les bonnes manières — social customs, dining etiquette, and polite French behaviour</p>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 mb-6 flex items-start gap-2">
          <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-300">French politeness is precise and formal by international standards — but once mastered, it creates genuine warmth. The French distinguish sharply between those who know the codes and those who don't.</p>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          {[{ id: 'rules', label: 'Etiquette Rules' }, { id: 'phrases', label: 'Polite Phrases' }, { id: 'fauxpas', label: 'Faux Pas to Avoid' }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${tab === t.id ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'rules' && (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
              {ETIQUETTE_SECTIONS.map((s, i) => (
                <button key={s.title} onClick={() => { setActiveSection(i); addXP(3, 'vocabulary') }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeSection === i ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
                  {s.icon} {s.title}
                </button>
              ))}
            </div>
            <div className="space-y-4">
              {ETIQUETTE_SECTIONS[activeSection].rules.map((rule, i) => (
                <motion.div key={rule.rule} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-5"
                  onClick={() => addXP(3, 'vocabulary')}>
                  <div className="flex items-start gap-3">
                    <Star size={16} className="text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-cream-50 font-playfair mb-1">{rule.rule}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{rule.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {tab === 'phrases' && (
          <div className="space-y-3">
            {POLITE_PHRASES.map((p, i) => (
              <motion.div key={p.fr} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="bg-white dark:bg-dark-warm-100 rounded-xl shadow border border-gray-100 dark:border-dark-warm-50 p-4 flex items-start gap-3"
                onClick={() => addXP(2, 'vocabulary')}>
                <SpeakButton text={p.fr} size="sm" />
                <div>
                  <p className="font-medium text-sm italic text-gray-800 dark:text-cream-50">"{p.fr}"</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{p.en}</p>
                  {p.note && <p className="text-xs text-amber-600 dark:text-amber-400 italic mt-0.5">💡 {p.note}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'fauxpas' && (
          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-sm text-red-800 dark:text-red-300 mb-2">
              These are real social mistakes that foreigners (and sometimes French people from other regions) make in France. Knowing them helps you avoid awkwardness.
            </div>
            {[
              { title: 'Entering a shop without saying "Bonjour"', severity: 'High', detail: 'This is the single biggest mistake. Every French person you speak to — shop assistant, pharmacist, doctor\'s receptionist, boulangère — expects "Bonjour" first. Starting with "Excuse me..." or immediately asking your question feels abrupt and rude. "Bonjour Madame/Monsieur" buys you enormous goodwill.' },
              { title: 'Using "tu" too soon with strangers', severity: 'High', detail: '"Tu" with someone you\'ve just met can feel presumptuous or even insolent — especially with older people, professionals, or people in service roles. Always start with "vous" and wait to be invited. "On peut se tutoyer ?" = "Shall we use tu?"' },
              { title: 'Splitting restaurant bills down to the euro', severity: 'Medium', detail: 'In France, it\'s common for one person to pay and for others to pay them back later, or to split roughly. Going through every item on the bill to calculate exact individual amounts is seen as petty ("radin"). Round up generously, or take turns paying.' },
              { title: 'Cutting the tip off a wedge of cheese', severity: 'Medium', detail: 'The pointed tip ("la pointe") of a wedge of cheese concentrates the strongest flavour. Cutting it off for yourself is considered greedy and bad manners. Always slice parallel to the cut face — you take a proportional wedge, not the best part.' },
              { title: 'Bringing red roses to a host', severity: 'Medium', detail: 'Red roses are romantic — bringing them to your host\'s wife suggests you\'re attracted to her, not grateful for dinner. Yellow flowers can suggest infidelity. Safe flowers: white roses, mixed bouquet. Safe gifts: good wine, high-quality chocolates.' },
              { title: 'Bringing chrysanthemums', severity: 'High', detail: '"Les chrysanthèmes" are funeral flowers in France — placed on graves on Toussaint (All Saints\' Day, November 1st). Bringing a bunch to a dinner party is a genuine faux pas. Stick to spring or summer flowers.' },
              { title: 'Asking "Comment ça va ?" without expecting a real answer', severity: 'Low', detail: '"Ça va ?" is a greeting more than a question — the expected response is "Ça va, et toi ?" But French people can sometimes give a genuine, lengthy response about their health, work, and feelings. Don\'t look surprised — they feel you asked.' },
              { title: 'Smiling at strangers in the street', severity: 'Low', detail: 'In France, unprompted smiles at strangers can seem odd, empty, or flirtatious — quite different from the US or Canada. Smiling in context (when addressed, in conversation) is completely natural. Street smiles feel hollow to many French people.' },
              { title: 'Pouring your own drink at a dinner party', severity: 'Medium', detail: 'At a formal or semi-formal French dinner, you don\'t pour your own wine. You wait for the host or your neighbour to pour. Pouring your own (especially if it\'s the last of a bottle) seems greedy. Instead: offer to pour for others first.' },
              { title: 'Discussing salary or money openly', severity: 'High', detail: 'Money is deeply private in France. Asking what someone earns — even close friends — is genuinely intrusive. Mentioning the price of your holiday, your home, or your car can seem vulgar. The French are far more discrete about wealth than Anglo-Americans.' },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-5"
                onClick={() => addXP(3, 'vocabulary')}>
                <div className="flex items-start gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-bold text-gray-900 dark:text-cream-50 font-playfair">{item.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.severity === 'High' ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' : item.severity === 'Medium' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' : 'bg-gray-100 text-gray-500 dark:bg-dark-warm-200 dark:text-gray-400'}`}>
                        {item.severity} impact
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
