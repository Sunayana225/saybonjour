import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Music } from 'lucide-react'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const MUSIC_VOCAB = [
  {
    category: 'Music Vocabulary',
    emoji: '🎵',
    items: [
      { fr: 'une chanson', en: 'a song', note: '"La chanson française" = a celebrated art form with centuries of tradition. Not just pop — storytelling through lyric and melody.' },
      { fr: 'un morceau', en: 'a piece / track', note: '"Un morceau de musique classique" = a classical piece. "Mon morceau préféré" = my favourite track.' },
      { fr: 'un album', en: 'an album', note: '"Sortir un album" = to release an album. "Le dernier album" = the latest album.' },
      { fr: 'un concert', en: 'a concert', note: '"Aller à un concert" = to go to a concert. "La salle de concert" = the concert hall. "L\'Olympia" in Paris is the most famous concert venue.' },
      { fr: 'un festival', en: 'a festival', note: '"Les Francofolies" (La Rochelle) = major French-language music festival. "Les Vieilles Charrues" (Brittany) = France\'s largest outdoor festival.' },
      { fr: 'un chanteur / une chanteuse', en: 'a singer', note: '"Chanter" = to sing. "Un grand chanteur" = a great singer. Piaf, Brel, and Brassens are the holy trinity of French chanson.' },
      { fr: 'un musicien / une musicienne', en: 'a musician', note: '"Jouer de la musique" = to play music. "Musicien(ne) professionnel(le)" = a professional musician.' },
      { fr: 'un groupe', en: 'a band / group', note: '"Faire partie d\'un groupe" = to be in a band.' },
      { fr: 'un orchestre', en: 'an orchestra', note: '"L\'Orchestre de Paris" = Paris\'s premier symphony orchestra. "Chef d\'orchestre" = conductor.' },
      { fr: 'la mélodie', en: 'the melody', note: '"Une mélodie inoubliable" = an unforgettable melody.' },
      { fr: 'le rythme', en: 'the rhythm', note: '"Suivre le rythme" = to keep the beat. "Le rythme est entraînant" = the rhythm is catchy.' },
      { fr: 'les paroles', en: 'the lyrics', note: '"Des paroles profondes" = profound lyrics. French chanson is celebrated for literary-quality lyrics.' },
      { fr: 'la voix', en: 'the voice', note: '"Une voix envoûtante" = a haunting voice. "Une voix de velours" = a velvet voice.' },
      { fr: 'le refrain', en: 'the chorus / refrain', note: '"Reprendre le refrain" = to join in the chorus. "Chanter le refrain" = to sing the chorus.' },
      { fr: 'le couplet', en: 'the verse', note: '"Le premier couplet" = the first verse. Between verses, the chorus ("le refrain") returns.' },
      { fr: 'la tournée', en: 'a (concert) tour', note: '"Partir en tournée" = to go on tour. "La tournée mondiale" = the world tour.' },
      { fr: 'enregistrer', en: 'to record', note: '"Enregistrer un album en studio" = to record an album in a studio. "Un enregistrement live" = a live recording.' },
      { fr: 'les droits d\'auteur', en: 'copyright / royalties', note: 'SACEM (Société des auteurs, compositeurs et éditeurs de musique) manages French music royalties — one of the world\'s oldest collecting societies (1851).' },
    ],
  },
  {
    category: 'Instruments',
    emoji: '🎸',
    items: [
      { fr: 'le piano', en: 'piano', note: '"Jouer du piano" = to play piano. Debussy, Satie, Fauré — French composers created a distinctly impressionist piano tradition.' },
      { fr: 'la guitare', en: 'guitar', note: '"Jouer de la guitare" = to play guitar. "Une guitare acoustique" = acoustic; "une guitare électrique" = electric.' },
      { fr: 'la guitare basse', en: 'bass guitar', note: '"Le bassiste" = the bassist. Essential in rock, jazz, and funk.' },
      { fr: 'la batterie', en: 'drum kit', note: '"Le batteur / la batteuse" = a drummer. Not to be confused with "une pile" = a battery (electrical).' },
      { fr: 'le violon', en: 'violin', note: '"Jouer du violon" = to play violin. "Un stradivarius" = a Stradivari violin (from the Italian maker).' },
      { fr: 'le violoncelle', en: 'cello', note: '"Le violoncelliste" = a cellist. "Le violoncelle" was central to the French Baroque.' },
      { fr: 'la flûte (traversière)', en: 'the (transverse) flute', note: 'The modern concert flute. "Jouer de la flûte" = to play flute.' },
      { fr: 'la trompette', en: 'trumpet', note: '"Le trompettiste" = a trumpeter. Miles Davis and many African-American jazz trumpeters found a home in Paris in the 1940s–60s.' },
      { fr: 'le saxophone', en: 'saxophone', note: 'Invented by Adolphe Sax (Belgian-French) in 1840 in Paris. Named after its inventor — a uniquely French-born instrument.' },
      { fr: 'l\'accordéon', en: 'accordion', note: 'The emblematic sound of traditional French "musette" and chanson. Yvette Horner, Jo Privat — and Yann Tiersen (Amélie film).' },
      { fr: 'le synthétiseur', en: 'synthesiser', note: 'France is a world leader in electronic music: Daft Punk, Jean-Michel Jarre (who created the largest outdoor concert in history).' },
      { fr: 'le banjo', en: 'banjo', note: 'Popular in traditional and Cajun French music. "La musique cajun" = the French-influenced music of Louisiana.' },
    ],
  },
  {
    category: 'Genres',
    emoji: '🎶',
    items: [
      { fr: 'la chanson française', en: 'French chanson', note: 'A rich tradition of poetic, narrative songs. Piaf, Brel, Brassens, Gainsbourg defined it. Still alive — Stromae and Grand Corps Malade continue the tradition.' },
      { fr: 'le jazz', en: 'jazz', note: 'Paris was the promised land for African-American jazz musicians (1920s–50s). Django Reinhardt invented "jazz manouche" (gypsy jazz) — uniquely French.' },
      { fr: 'la musette', en: 'French café accordion music', note: 'The musette waltz — the sound of Montmartre dance halls and Parisian bal-musette dances in the early 20th century.' },
      { fr: 'le classique', en: 'classical music', note: 'Debussy, Ravel, Fauré, Saint-Saëns — France developed a distinctive impressionist classical tradition. "La musique de chambre" = chamber music.' },
      { fr: 'le rock', en: 'rock', note: '"Le rock français" flourished in the 1960s with Johnny Hallyday — "le roi du rock français". Still going strong.' },
      { fr: 'le rap / le hip-hop', en: 'rap / hip-hop', note: 'France has the SECOND-LARGEST hip-hop scene in the world after the USA. NTM, IAM, MC Solaar pioneered it. Ninho, Niska dominate today.' },
      { fr: 'l\'électro / la musique électronique', en: 'electronic music', note: 'Daft Punk, Justice, Air, Cassius, Modjo — French house and electro has had global influence since the 1990s. "La French Touch" = a recognised style.' },
      { fr: 'la musique du monde', en: 'world music', note: 'Heavily influenced by North African (raï, gnawa) and West African traditions. France\'s FNAC World Music award is a major prize.' },
      { fr: 'le jazz manouche', en: 'gypsy jazz', note: 'Created by guitarist Django Reinhardt in 1930s Paris. A unique fusion of swing jazz and Romani guitar technique. Still very alive in Paris.' },
      { fr: 'la variété française', en: 'French pop / variety', note: 'The mainstream of French pop — Charles Aznavour, Mireille Mathieu, Céline Dion (Quebec). "Les Victoires de la Musique" = France\'s equivalent of the Grammys.' },
    ],
  },
]

const FRENCH_ARTISTS = [
  { name: 'Édith Piaf', era: '1940s–60s', genre: 'Chanson française', emoji: '🌹', known: '"Non, je ne regrette rien", "La Vie en rose" — the voice of France itself. Born on the streets of Paris (Belleville) in 1915. Her gravestone at Père-Lachaise is the most visited in France.' },
  { name: 'Jacques Brel', era: '1950s–70s', genre: 'Chanson belge-française', emoji: '🎭', known: '"Ne me quitte pas" — the most emotionally devastating song in the French language. Belgian, but central to French chanson. "Le Plat Pays" is a masterpiece of longing.' },
  { name: 'Georges Brassens', era: '1952–81', genre: 'Chanson satirique', emoji: '🎸', known: 'The philosophical anarchist of French song. "Les copains d\'abord", "La mauvaise réputation". His lyrics are taught in French schools as literature.' },
  { name: 'Serge Gainsbourg', era: '1958–91', genre: 'Chanson / Pop', emoji: '🚬', known: 'Provocateur, poet, and provocateur. "Je t\'aime moi non plus", "La Marseillaise" reggae version. His house at 5 bis rue de Verneuil in Paris is covered in fan graffiti.' },
  { name: 'Charles Aznavour', era: '1946–2018', genre: 'Chanson / Variété', emoji: '🇦🇲', known: '"She / Il faut savoir", "La Bohème". Armenian-French, he became one of the best-selling artists in history — more popular in France than the Beatles.' },
  { name: 'Daft Punk', era: '1993–2021', genre: 'French house / Électro', emoji: '🤖', known: '"Around the World", "Get Lucky", "One More Time". Invented French house music. Their robot personas changed how musicians could perform. Disbanded 2021.' },
  { name: 'Françoise Hardy', era: '1962–2024', genre: 'Yé-yé / Chanson', emoji: '🌷', known: '"Tous les garçons et les filles" — the cool, melancholic face of 1960s French pop. Bob Dylan reportedly said she was the most beautiful woman he\'d ever seen.' },
  { name: 'Stromae', era: '2009–present', genre: 'Électro-pop (Belgian francophone)', emoji: '🎤', known: 'Belgian French-language artist. "Alors on danse", "Papaoutai", "L\'enfer". His 2022 return album "Multitude" was a global critical sensation.' },
  { name: 'Christine and the Queens', era: '2008–present', genre: 'Synth-pop / Art-pop', emoji: '👑', known: 'Héloïse Letissier — a bilingual art-pop icon who reinvented gender in French pop. "Tilted", "5 dollars". Now performs as "Chris" or "Redcar".' },
  { name: 'Angèle', era: '2018–present', genre: 'Pop belge', emoji: '⭐', known: 'Belgian French-language pop sensation with feminist lyrics and catchy hooks. Sister of rapper Roméo Elvis. Multiple Victoires de la Musique winner.' },
  { name: 'Grand Corps Malade', era: '2006–present', genre: 'Slam / Spoken word', emoji: '🎙️', known: 'Fabien Marsaud — slam poetry meets chanson. "Comme sur des raquettes", "Midi 20". His poetic spoken word continues the literary French song tradition.' },
  { name: 'Jean-Michel Jarre', era: '1973–present', genre: 'Musique électronique', emoji: '🌌', known: '"Oxygène" (1976) — a pioneering electronic album. Organised the largest-ever outdoor concerts (1 million+ people in Houston, Moscow, Paris). Son of composer Maurice Jarre.' },
]

const USEFUL_PHRASES = [
  { fr: 'J\'adore écouter de la musique.', en: 'I love listening to music.', note: '"Écouter de la musique" = to listen to music. "Écouter une chanson" = to listen to a song.' },
  { fr: 'Quel genre de musique tu aimes ?', en: 'What kind of music do you like?', note: '"Quel genre" = what genre. "Je suis fan de..." = I\'m a fan of...' },
  { fr: 'Je joue de la guitare depuis cinq ans.', en: 'I\'ve been playing guitar for five years.', note: '"Jouer de" + instrument. "Depuis" + present tense = for (duration still ongoing).' },
  { fr: 'Tu as des billets pour le concert ?', en: 'Do you have tickets for the concert?', note: '"Des billets" = tickets. "La billetterie" = the ticket office. "Sold out" = complets / épuisés.' },
  { fr: 'Ce groupe est vraiment talentueux.', en: 'This band is really talented.', note: '"Talentueux / talentueuse" = talented. "Doué(e)" = gifted.' },
  { fr: 'La mélodie est vraiment accrocheuse.', en: 'The melody is really catchy.', note: '"Accrocheuse" = catchy (lit. "hooky"). "Un tube" = a hit song. "Un carton" = a massive hit.' },
  { fr: 'Les paroles sont magnifiques.', en: 'The lyrics are beautiful.', note: '"Les paroles" = the lyrics. "Apprendre les paroles" = to learn the lyrics.' },
  { fr: 'Je préfère la chanson française à la pop anglophone.', en: 'I prefer French chanson to English-language pop.', note: '"Préférer A à B" = to prefer A to B. "Anglophone" = English-speaking.' },
  { fr: 'Ce titre est en tête des charts depuis trois semaines.', en: 'This track has been at the top of the charts for three weeks.', note: '"Les charts" (or "le classement") = the charts. "Être numéro un" = to be number one.' },
  { fr: 'Elle a une voix extraordinaire — ça donne des frissons.', en: 'She has an extraordinary voice — it gives you goosebumps.', note: '"Donner des frissons" = to give goosebumps. "Avoir la chair de poule" = to get goosebumps.' },
  { fr: 'Je vais au Bataclan voir un concert vendredi soir.', en: 'I\'m going to the Bataclan to see a concert Friday evening.', note: 'The Bataclan is Paris\'s most iconic mid-sized concert venue — rebuilt and reopened after the 2015 attacks.' },
  { fr: 'Il chante faux / elle chante juste.', en: 'He sings out of tune / she sings in tune.', note: '"Chanter faux" = to sing out of tune (lit. false). "Chanter juste" = to sing correctly in tune.' },
]

export default function FrenchMusic() {
  const [tab, setTab] = useState('vocab')
  const [activeCategory, setActiveCategory] = useState(0)

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French Music | SayBonjour!" description="French music vocabulary, genres, iconic artists — from Piaf and Brel to Daft Punk and Stromae." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">French Music</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">La musique française — vocabulary, genres, iconic artists, and music phrases</p>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          {[
            { id: 'vocab', label: 'Vocabulary' },
            { id: 'artists', label: 'Iconic Artists' },
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
              {MUSIC_VOCAB.map((cat, i) => (
                <button key={cat.category} onClick={() => { setActiveCategory(i); addXP(3, 'vocabulary') }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeCategory === i ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
                  {cat.emoji} {cat.category}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {MUSIC_VOCAB[activeCategory].items.map((item, i) => (
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
          </>
        )}

        {tab === 'artists' && (
          <div className="space-y-4">
            {FRENCH_ARTISTS.map((artist, i) => (
              <motion.div key={artist.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-5 flex items-start gap-4"
                onClick={() => addXP(3, 'vocabulary')}>
                <span className="text-3xl shrink-0">{artist.emoji}</span>
                <div>
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <h3 className="font-bold text-gray-900 dark:text-cream-50 font-playfair">{artist.name}</h3>
                    <span className="text-xs text-gray-400">{artist.era}</span>
                  </div>
                  <p className="text-xs text-burgundy-600 dark:text-burgundy-vibrant-300 italic mb-1">{artist.genre}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{artist.known}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'phrases' && (
          <div className="space-y-3">
            {USEFUL_PHRASES.map((phrase, i) => (
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
