import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Hand, ChevronDown, ChevronUp } from 'lucide-react'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const GESTURES = [
  {
    name: 'La bise',
    emoji: '💋',
    category: 'Greetings',
    description: 'The air kiss on the cheek — the most essential French social gesture. Number of kisses varies by region: 1 in Paris, 2 in most of France, 3 in Provence, 4 in Brittany and some parts of Normandy.',
    howTo: 'Lean in, lightly touch cheeks (right cheek first in Paris), and make a kissing sound in the air. Warm smile. Never on the lips.',
    meaning: 'Affection, greeting between friends, family, and sometimes new acquaintances introduced at a gathering.',
    cultural: 'COVID changed this habit significantly — many French people hesitated from 2020. It\'s fully acceptable to extend a hand and say "Je fais plus la bise depuis le COVID." La bise is gradually returning but hand-shaking is now more accepted.',
    phrase: { fr: 'On fait la bise ?', en: 'Shall we do the cheek kiss?' },
    region: 'Nationwide (number varies by region)',
  },
  {
    name: 'La moue',
    emoji: '😬',
    category: 'Scepticism',
    description: 'The pursed lips / pout of doubt. Lips pushed forward, chin slightly raised, often accompanied by a soft inhale or a "Pfff..." sound.',
    howTo: 'Purse your lips as if blowing a tiny kiss but don\'t follow through. Raise chin slightly. Hold for a moment. Optional: a low "hmmm" or sharp "Pfff".',
    meaning: 'Doubt, uncertainty, mild disapproval, "I\'m not convinced", or "that seems unlikely to me."',
    cultural: 'An essential French expression. You\'ll see it at market stalls when a price is being considered, at wine tastings when a vintage is mediocre, and when a French colleague hears a questionable plan in a meeting.',
    phrase: { fr: 'Bof... je ne suis pas convaincu(e).', en: 'Hmm... I\'m not convinced.' },
    region: 'Nationwide',
  },
  {
    name: 'Le shrug gaulois',
    emoji: '🤷',
    category: 'Indifference',
    description: 'Raised shoulders, turned-down mouth corners, often with hands extended palm-up. The universal symbol of French philosophical resignation or indifference.',
    howTo: 'Raise both shoulders simultaneously, turn down the corners of your mouth, and optionally extend one or both palms upward. Hold for a beat, then release. Add "Bof" or silence.',
    meaning: '"What can you do?", "It\'s not my problem", "Who knows?", or dignified acceptance of life\'s vagaries.',
    cultural: 'Often accompanied by "C\'est comme ça", "Bof", "C\'est la vie", or silence. The Gallic shrug is considered a mark of sophistication — not rudeness. It conveys nuanced emotional intelligence rather than carelessness.',
    phrase: { fr: 'C\'est comme ça. Qu\'est-ce qu\'on peut faire ?', en: 'That\'s just how it is. What can you do?' },
    region: 'Nationwide — stereotypically Parisian',
  },
  {
    name: 'Mon œil',
    emoji: '👁️',
    category: 'Disbelief',
    description: 'Pulling the lower eyelid down with one finger — meaning "I\'m not fooled." Can be combined with a sceptical expression.',
    howTo: 'Place your index finger below your eye and gently pull the lower eyelid down, holding it for a moment while saying "Mon œil !"',
    meaning: '"Pull the other one!", "I don\'t believe you!", "Yeah, right!"',
    cultural: 'Equivalent to the British "yeah, right." Mostly used with friends — it\'s blunt and funny. A bit old-fashioned — younger French people may simply say "sérieusement ?" instead.',
    phrase: { fr: 'Mon œil !', en: 'My eye! / No way! / Pull the other one!' },
    region: 'Nationwide',
  },
  {
    name: 'Le pouce',
    emoji: '👍',
    category: 'Approval',
    description: 'Thumb up — broadly the same as in English-speaking cultures, but also used to indicate the number "one" in French counting (unlike in the US, where counting starts with the index finger).',
    howTo: 'Standard thumb up. Sometimes accompanied by "Nickel !", "Top !", or "C\'est bon !"',
    meaning: 'Good, approved, ready, excellent. Also: "one" when counting on fingers.',
    cultural: 'In France, thumbs up at a bar counter can mean "one please" (ordering one beer with loud music). French counting starts with the thumb — thumb = 1, not the index finger as in English-speaking countries.',
    phrase: { fr: 'Nickel !', en: 'Spot on! / Perfect!' },
    region: 'Nationwide',
  },
  {
    name: 'Les doigts en bouquet',
    emoji: '🤌',
    category: 'Emphasis',
    description: 'Fingertips brought together and flicked or tapped outward from the mouth or chin. Signals perfection, excellence — especially of food, an idea, or an experience.',
    howTo: 'Bring all fingertips together at the lips or chin, then flick them outward while saying "Magnifique!" or "C\'est parfait !" or "Exquis !"',
    meaning: 'Perfection, excellence — most associated with outstanding food or a brilliant idea.',
    cultural: 'This gesture is more Italian in origin but very much adopted in southern France and by food lovers everywhere. It became internet-famous through the 🤌 emoji — though the Italian version is more about emphasis, the French version signals quality.',
    phrase: { fr: 'C\'est exquis — absolument divin !', en: 'It\'s exquisite — absolutely divine!' },
    region: 'Especially Provence and southern France',
  },
  {
    name: 'Le barbu',
    emoji: '🙌',
    category: 'Humour',
    description: 'Both hands placed under the chin with fingers extended downward, mimicking a beard. Means someone is arrogant, full of themselves, or putting on airs.',
    howTo: 'Cup both hands under your chin, fingers pointing down. Optionally waggle them slightly.',
    meaning: '"He/she thinks they\'re amazing", "What a bighead!", "Look at this show-off."',
    cultural: 'A friendly, comic gesture used among friends to tease someone being pompous or excessively proud. Affectionate ribbing — not aggressive. Often combined with "Il se la pète !"',
    phrase: { fr: 'Il se la pète, celui-là !', en: 'He thinks he\'s all that! / What a show-off!' },
    region: 'Nationwide (mostly informal)',
  },
  {
    name: 'Le rond',
    emoji: '⭕',
    category: 'Warning',
    description: 'Making a circle with thumb and forefinger. Held in front of the eye like a monocle = "I\'m watching." Shown outward = "zero/nothing/worthless".',
    howTo: 'Make a circle with thumb and forefinger. Hold it up before one eye (= watching), OR show it outward to someone (= zero/null).',
    meaning: 'Context determines: "zero" / "it\'s worth nothing" (outward), OR "I\'m watching you closely" (at the eye).',
    cultural: 'Beware: the same gesture means "OK" in the US/UK but can mean "zero" or "worthless" in France (and in some cultures it\'s offensive). In France, be careful with this one — context is everything.',
    phrase: { fr: 'C\'est nul — zéro pointé !', en: 'It\'s rubbish — zero out of ten!' },
    region: 'Nationwide',
  },
  {
    name: 'La main qui tourne',
    emoji: '🔄',
    category: 'Scepticism',
    description: 'Rotating the hand from palm-up to palm-down repeatedly — means "so-so", "mixed feelings", or "it depends."',
    howTo: 'Hold one hand out, palm up, then rotate it back and forth — "comme ci, comme ça." Usually with a slight pout or neutral expression.',
    meaning: '"So-so", "It could go either way", "Mixed results", "I\'m not sure."',
    cultural: '"Comme ci, comme ça" with the hand rotation is one of the most recognisable French expressions to foreigners. Used when asked how something went, how you feel, or whether a plan is working.',
    phrase: { fr: 'Comme ci, comme ça — pas terrible.', en: 'So-so — not great.' },
    region: 'Nationwide',
  },
  {
    name: 'Tapoter la tempe',
    emoji: '🧠',
    category: 'Humour',
    description: 'Tapping the temple with one finger — meaning someone is clever, or (more often) that they\'re not quite right in the head.',
    howTo: 'Tap your temple (the side of your forehead) with your index finger once or twice. Direction of tap and context changes meaning.',
    meaning: 'Depending on context: "Smart thinking!" OR more commonly: "He/she is crazy / not right in the head."',
    cultural: '"T\'as pas une case" = "You\'re missing a cog/screw" (you\'re a bit crazy). Tapping the temple pointing toward someone else = you\'re calling them crazy. Tapping your own = self-deprecating or thinking aloud.',
    phrase: { fr: 'Il est complètement timbré, celui-là !', en: 'He\'s completely bonkers / nuts!' },
    region: 'Nationwide',
  },
  {
    name: 'L\'auriculaire tendu',
    emoji: '🤙',
    category: 'Humour',
    description: 'Extending the little finger ("l\'auriculaire") outward when holding a cup — historically meant to signal refinement or aristocratic pretension.',
    howTo: 'Hold a cup and deliberately extend the little finger. Often done with a smug expression to signal you\'re being fancy.',
    meaning: 'Ironic refinement — "look how sophisticated I am." Mainly comedic and self-aware.',
    cultural: 'A gesture that signals pretension or ironic posturing. Used humorously when someone is trying to seem posh. The French use it to mock both genuine and false refinement.',
    phrase: { fr: 'Il fait son snob !', en: 'He\'s being a snob!' },
    region: 'Nationwide (mostly comedic)',
  },
  {
    name: 'Se toucher le nez',
    emoji: '👃',
    category: 'Complicity',
    description: 'Tapping the nose with one finger — signals "I know something", "between us", or "this is our secret."',
    howTo: 'Tap the side of your nose once with your index finger, often with a knowing smile or wink.',
    meaning: '"Between us", "I\'m in the know", "I know something you might not", or "understood — no need to say more."',
    cultural: 'Used to signal shared insider knowledge or complicity — "on est entre nous" (we\'re among ourselves). Also used when someone has worked something out: "j\'ai deviné, hein ?"',
    phrase: { fr: 'Entre nous — t\'as compris !', en: 'Between us — you understood!' },
    region: 'Nationwide',
  },
]

const CATEGORIES = ['All', ...Array.from(new Set(GESTURES.map(g => g.category)))]

export default function FrenchGestures() {
  const [cat, setCat] = useState('All')
  const [expanded, setExpanded] = useState(null)

  const filtered = GESTURES.filter(g => cat === 'All' || g.category === cat)

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French Gestures | SayBonjour!" description="Understand essential French gestures — la bise, la moue, the Gallic shrug, les doigts en bouquet, and more." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">French Gestures</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">La gestuelle française — 12 gestures, their meanings, and cultural context</p>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 text-sm text-amber-800 dark:text-amber-300 mb-6 flex items-start gap-2">
          <Hand size={16} className="shrink-0 mt-0.5" />
          <span>French communication is as much physical as verbal. Understanding these gestures will help you follow real conversations — and blend in naturally.</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => { setCat(c); addXP(2, 'vocabulary') }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${cat === c ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
              {c}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.map((gesture, i) => {
            const isOpen = expanded === gesture.name
            return (
              <motion.div key={gesture.name} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 overflow-hidden">
                <button onClick={() => { setExpanded(isOpen ? null : gesture.name); addXP(3, 'vocabulary') }}
                  className="w-full text-left px-6 py-4 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-cream-50 dark:bg-dark-warm-200 flex items-center justify-center text-3xl shrink-0">
                    {gesture.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h2 className="font-bold text-gray-900 dark:text-cream-50">{gesture.name}</h2>
                      <span className="text-xs text-gray-400 bg-gray-50 dark:bg-dark-warm-200 px-2 py-0.5 rounded-full">{gesture.category}</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{gesture.meaning}</p>
                  </div>
                  {isOpen ? <ChevronUp size={15} className="text-gray-400 shrink-0" /> : <ChevronDown size={15} className="text-gray-400 shrink-0" />}
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                      <div className="px-6 pb-6 border-t border-gray-50 dark:border-dark-warm-200 pt-4 space-y-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{gesture.description}</p>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="bg-cream-50 dark:bg-dark-warm-200 rounded-xl p-3">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">How to do it</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{gesture.howTo}</p>
                          </div>
                          <div className="bg-cream-50 dark:bg-dark-warm-200 rounded-xl p-3">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Cultural note</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{gesture.cultural}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 bg-burgundy-50 dark:bg-burgundy-vibrant-600/10 border border-burgundy-200 dark:border-burgundy-vibrant-600/20 rounded-xl px-4 py-3">
                          <SpeakButton text={gesture.phrase.fr} size="sm" />
                          <div>
                            <p className="font-medium text-sm text-burgundy-700 dark:text-burgundy-vibrant-300 italic">"{gesture.phrase.fr}"</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{gesture.phrase.en}</p>
                          </div>
                        </div>

                        <p className="text-xs text-gray-400">📍 Region: {gesture.region}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
