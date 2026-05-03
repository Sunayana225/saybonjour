import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Heart, ChevronDown, ChevronUp, Music } from 'lucide-react'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const POEMS = [
  {
    title: 'Le Dormeur du val',
    author: 'Arthur Rimbaud',
    year: 1870,
    movement: 'Symbolisme',
    level: 'B2',
    text: `C'est un trou de verdure où chante une rivière
Accrochant follement aux herbes des haillons
D'argent; où le soleil, de la montagne fière,
Luit: c'est un petit val qui mousse de rayons.

Un soldat jeune, bouche ouverte, tête nue,
Et la nuque baignant dans le frais cresson bleu,
Dort; il est étendu dans l'herbe sous la nue,
Pâle dans son lit vert où la lumière pleut.

Les pieds dans les glaïeuls, il dort. Souriant comme
Sourirait un enfant malade, il fait un somme:
Nature, berce-le chaudement: il a froid.

Les parfums ne font pas frissonner sa narine;
Il dort dans le soleil, la main sur sa poitrine,
Tranquille. Il a deux trous rouges au côté droit.`,
    translation: `It is a green hollow where a river sings
Madly catching silver rags on the grasses;
Where the sun shines from the proud mountain:
It is a small valley, foamy with rays.

A young soldier, mouth open, bare-headed,
His neck bathing in cool blue watercress,
Sleeps; he lies stretched on the grass under sky,
Pale in his green bed where the light rains.

His feet in the gladiolas, he sleeps. Smiling as
A sick child would smile, he takes a nap:
Nature, rock him warmly: he is cold.

The perfumes do not make his nostril quiver;
He sleeps in the sunlight, one hand on his breast,
Quiet. He has two red holes in his right side.`,
    analysis: 'Written when Rimbaud was just 16, during the Franco-Prussian War. The poem\'s shocking final line reveals what the reader assumed was a sleeping soldier is actually dead. A masterclass in dramatic irony.',
    vocab: [
      { fr: 'le val', en: 'valley' },
      { fr: 'haillons', en: 'rags / tatters' },
      { fr: 'mousse', en: 'foams / froths' },
      { fr: 'la nue', en: 'the sky / clouds' },
      { fr: 'frissonner', en: 'to shiver' },
    ],
  },
  {
    title: 'Il pleure dans mon cœur',
    author: 'Paul Verlaine',
    year: 1874,
    movement: 'Symbolisme',
    level: 'B1',
    text: `Il pleure dans mon cœur
Comme il pleut sur la ville;
Quelle est cette langueur
Qui pénètre mon cœur?

Ô bruit doux de la pluie
Par terre et sur les toits!
Pour un cœur qui s'ennuie,
Ô le chant de la pluie!

Il pleure sans raison
Dans ce cœur qui s'écœure.
Quoi! nulle trahison?
Ce deuil est sans raison.

C'est bien la pire peine
De ne savoir pourquoi
Sans amour et sans haine
Mon cœur a tant de peine!`,
    translation: `It weeps in my heart
As rain falls on the town;
What is this languor
That pierces my heart?

O sweet sound of rain
On the ground and rooftops!
For a heart that is bored,
O the song of the rain!

It weeps without reason
In this disgusted heart.
What! No betrayal?
This grief is without reason.

Truly the worst pain
Is not to know why
Without love or hate
My heart has such pain!`,
    analysis: 'From Romances sans paroles. Verlaine blurs the boundary between external weather and internal emotion — a technique called correspondance, central to Symbolist poetry.',
    vocab: [
      { fr: 'la langueur', en: 'languor / listlessness' },
      { fr: 's\'ennuier', en: 'to be bored' },
      { fr: 's\'écœurer', en: 'to disgust / to sicken' },
      { fr: 'la trahison', en: 'betrayal / treason' },
      { fr: 'le deuil', en: 'grief / mourning' },
    ],
  },
  {
    title: 'Correspondances',
    author: 'Charles Baudelaire',
    year: 1857,
    movement: 'Symbolisme / Romantisme',
    level: 'C1',
    text: `La Nature est un temple où de vivants piliers
Laissent parfois sortir de confuses paroles;
L'homme y passe à travers des forêts de symboles
Qui l'observent avec des regards familiers.

Comme de longs échos qui de loin se confondent
Dans une ténébreuse et profonde unité,
Vaste comme la nuit et comme la clarté,
Les parfums, les couleurs et les sons se répondent.`,
    translation: `Nature is a temple where living pillars
Sometimes let slip confused words;
Man passes through forests of symbols
Which observe him with familiar glances.

Like long echoes which merge in the distance
Into a shadowy and profound unity,
Vast as night and as clarity,
Perfumes, colours and sounds correspond.`,
    analysis: 'The first of Baudelaire\'s Fleurs du Mal — the foundational poem of Symbolism. The concept of synesthesia (senses merging) revolutionised French and world poetry.',
    vocab: [
      { fr: 'les piliers', en: 'pillars / columns' },
      { fr: 'ténébreux / -euse', en: 'shadowy / gloomy' },
      { fr: 'la clarté', en: 'clarity / brightness' },
      { fr: 'se confondre', en: 'to merge / to blur' },
      { fr: 'se répondre', en: 'to correspond / echo each other' },
    ],
  },
  {
    title: 'Demain, dès l\'aube',
    author: 'Victor Hugo',
    year: 1856,
    movement: 'Romantisme',
    level: 'B1',
    text: `Demain, dès l'aube, à l'heure où blanchit la campagne,
Je partirai. Vois-tu, je sais que tu m'attends.
J'irai par la forêt, j'irai par la montagne.
Je ne puis demeurer loin de toi plus longtemps.

Je marcherai les yeux fixés sur mes pensées,
Sans rien voir au dehors, sans entendre aucun bruit,
Seul, inconnu, le dos courbé, les mains croisées,
Triste, et le jour pour moi sera comme la nuit.

Je ne regarderai ni l'or du soir qui tombe,
Ni les voiles au loin descendant vers Harfleur,
Et quand j'arriverai, je mettrai sur ta tombe
Un bouquet de houx vert et de bruyère en fleur.`,
    translation: `Tomorrow, at dawn, at the hour when the countryside whitens,
I will set off. You see, I know that you wait for me.
I will go through the forest, I will go through the mountains.
I can no longer stay far from you.

I will walk with my eyes fixed on my thoughts,
Seeing nothing outside, hearing no noise,
Alone, unknown, back bent, hands crossed,
Sad, and the day for me will be like night.

I will not look at the evening gold falling,
Nor the sails far off descending toward Harfleur,
And when I arrive, I will place on your grave
A bouquet of green holly and flowering heather.`,
    analysis: 'Written for his daughter Léopoldine, who drowned in 1843 aged 19. The grave is only revealed in the final word — one of the most devastating endings in French literature.',
    vocab: [
      { fr: 'l\'aube', en: 'dawn' },
      { fr: 'blanchir', en: 'to whiten / to grow pale' },
      { fr: 'demeurer', en: 'to remain / to live' },
      { fr: 'la tombe', en: 'the grave / tomb' },
      { fr: 'la bruyère', en: 'heather' },
    ],
  },
]

const LEVEL_COLORS = { B1: 'bg-yellow-100 text-yellow-700', B2: 'bg-orange-100 text-orange-700', C1: 'bg-purple-100 text-purple-700' }

export default function FrenchPoetry() {
  const [selected, setSelected] = useState(0)
  const [showTranslation, setShowTranslation] = useState(false)
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('saybonjour_poem_favs') || '[]') } catch { return [] }
  })

  const poem = POEMS[selected]

  const toggleFav = (title) => {
    setFavorites(prev => {
      const next = prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
      localStorage.setItem('saybonjour_poem_favs', JSON.stringify(next))
      if (!prev.includes(title)) addXP(10, 'vocabulary')
      return next
    })
  }

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French Poetry | SayBonjour!" description="Read and understand great French poems — Rimbaud, Verlaine, Baudelaire, Hugo — with translations and analysis." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">French Poetry</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">La poésie française — great poems with translation and analysis</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {POEMS.map((p, i) => (
            <button key={p.title} onClick={() => { setSelected(i); setShowTranslation(false); addXP(3, 'vocabulary') }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${selected === i ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
              {p.author}
            </button>
          ))}
        </div>

        <motion.div key={poem.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-8 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${LEVEL_COLORS[poem.level]}`}>{poem.level}</span>
                  <span className="text-xs text-gray-400 italic">{poem.movement}</span>
                </div>
                <h2 className="text-2xl font-bold font-playfair text-gray-900 dark:text-cream-50">{poem.title}</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{poem.author} · {poem.year}</p>
              </div>
              <div className="flex items-center gap-2">
                <SpeakButton text={poem.text.replace(/\n/g, ' ')} size="sm" />
                <button onClick={() => toggleFav(poem.title)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${favorites.includes(poem.title) ? 'text-rose-500' : 'text-gray-300 dark:text-gray-600 hover:text-rose-400'}`}>
                  <Heart size={16} fill={favorites.includes(poem.title) ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Français</p>
                <pre className="font-playfair text-gray-800 dark:text-cream-50 text-sm leading-relaxed whitespace-pre-wrap italic">{poem.text}</pre>
              </div>
              {showTranslation && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">English</p>
                  <pre className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">{poem.translation}</pre>
                </motion.div>
              )}
            </div>

            <button onClick={() => { setShowTranslation(t => !t); addXP(4, 'vocabulary') }}
              className="mt-6 px-4 py-2 bg-cream-50 dark:bg-dark-warm-200 border border-gray-200 dark:border-dark-warm-50 rounded-xl text-sm text-gray-600 dark:text-gray-300 hover:border-burgundy-300 transition-colors">
              {showTranslation ? 'Hide translation' : 'Show English translation'}
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-5">
              <h3 className="font-semibold text-gray-800 dark:text-cream-50 mb-3 text-sm">Analysis</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{poem.analysis}</p>
            </div>
            <div className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-5">
              <h3 className="font-semibold text-gray-800 dark:text-cream-50 mb-3 text-sm">Key vocabulary</h3>
              <div className="space-y-2">
                {poem.vocab.map(v => (
                  <div key={v.fr} className="flex items-center gap-2">
                    <SpeakButton text={v.fr} size="sm" />
                    <span className="text-sm font-medium text-burgundy-700 dark:text-burgundy-vibrant-300">{v.fr}</span>
                    <span className="text-xs text-gray-400">— {v.en}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
