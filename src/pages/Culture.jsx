import React, { useState } from 'react'
import { MapPin, Coffee, Utensils, Calendar, Users, Globe, Heart, Gift, ArrowLeft, Volume2, BookOpen, Star } from 'lucide-react'
import SEO from '../components/SEO'
import BookmarkButton from '../components/BookmarkButton'
import FlashcardButton from '../components/FlashcardButton'

const Culture = () => {
  const [activeRegion, setActiveRegion] = useState('france')
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [showTranslation, setShowTranslation] = useState(false)

  const regions = {
    france: {
      name: 'France',
      flag: '🇫🇷',
      description: 'The birthplace of the French language, rich in history, art, and culinary traditions.',
      highlights: [
        'Birthplace of French cuisine and wine culture',
        'Home to iconic landmarks like the Eiffel Tower and Louvre',
        'Strong emphasis on art, literature, and philosophy',
        'Formal greeting customs and dining etiquette'
      ]
    },
    quebec: {
      name: 'Quebec, Canada',
      flag: '🇨🇦',
      description: 'French-speaking province with unique North American French culture and expressions.',
      highlights: [
        'Distinct Quebecois French dialect and expressions',
        'Winter carnival traditions and maple syrup culture',
        'Blend of French and North American influences',
        'Strong preservation of French language and culture'
      ]
    },
    belgium: {
      name: 'Belgium',
      flag: '🇧🇪',
      description: 'Southern Belgium (Wallonia) speaks French with its own cultural nuances.',
      highlights: [
        'Famous for chocolate, waffles, and beer culture',
        'Unique Belgian French expressions and pronunciation',
        'Rich medieval history and architecture',
        'Multilingual society (French, Dutch, German)'
      ]
    }
  }

  const culturalArticles = [
    {
      id: 'cafe-culture',
      icon: Coffee,
      title: 'La Culture du Café',
      subtitle: 'Café Culture',
      description: 'Découvrez l\'importance des cafés dans la vie sociale française',
      readTime: '5 min',
      difficulty: 'Débutant',
      frenchContent: `
# La Culture du Café en France

Les cafés français sont bien plus que de simples endroits pour boire du café. Ils sont le cœur de la vie sociale française.

## L'Histoire des Cafés

Les premiers cafés ont ouvert à Paris au 17ème siècle. Ils sont rapidement devenus des lieux de rencontre pour les intellectuels, les artistes et les révolutionnaires.

## Les Règles du Café

**Au comptoir ou en terrasse ?**
- Au comptoir : plus rapide et moins cher
- En terrasse : plus cher mais plus détendu

**Comment commander :**
- "Un café, s'il vous plaît" (un espresso)
- "Un café allongé" (café américain)
- "Un café au lait" (avec du lait chaud)

## L'Étiquette

1. Toujours dire "Bonjour" en entrant
2. Ne pas s'asseoir sans commander
3. Prendre son temps - pas de précipitation
4. Le pourboire n'est pas obligatoire

## Vocabulaire Essentiel

- **Le comptoir** : the bar/counter
- **La terrasse** : the outdoor seating
- **L'addition** : the bill
- **Le garçon/La serveuse** : waiter/waitress
      `,
      englishContent: `
# Café Culture in France

French cafés are much more than simple places to drink coffee. They are the heart of French social life.

## The History of Cafés

The first cafés opened in Paris in the 17th century. They quickly became meeting places for intellectuals, artists, and revolutionaries.

## Café Rules

**At the counter or on the terrace?**
- At the counter: faster and cheaper
- On the terrace: more expensive but more relaxed

**How to order:**
- "Un café, s'il vous plaît" (an espresso)
- "Un café allongé" (American coffee)
- "Un café au lait" (with hot milk)

## Etiquette

1. Always say "Bonjour" when entering
2. Don't sit down without ordering
3. Take your time - no rushing
4. Tipping is not mandatory

## Essential Vocabulary

- **Le comptoir**: the bar/counter
- **La terrasse**: the outdoor seating
- **L'addition**: the bill
- **Le garçon/La serveuse**: waiter/waitress
      `
    },
    {
      id: 'dining-etiquette',
      icon: Utensils,
      title: 'L\'Art de la Table',
      subtitle: 'Dining Etiquette',
      description: 'Maîtrisez l\'étiquette française à table',
      readTime: '7 min',
      difficulty: 'Intermédiaire',
      frenchContent: `
# L'Art de la Table Française

En France, manger n'est pas seulement se nourrir, c'est un art de vivre. Voici les règles essentielles.

## Avant le Repas

**L'Apéritif**
L'apéritif est un moment convivial avant le repas. On boit généralement :
- Du champagne
- Du vin blanc
- Un kir (vin blanc + crème de cassis)

## À Table

**La Disposition**
- Les mains restent visibles sur la table
- Les coudes ne touchent jamais la table
- On attend que l'hôte commence

**Le Pain**
- Le pain se pose directement sur la table
- On le rompt avec les mains, jamais avec un couteau
- Chaque bouchée se beurre individuellement

## Les Courses du Repas

1. **L'Entrée** : le premier plat
2. **Le Plat Principal** : viande ou poisson avec légumes
3. **Le Fromage** : servi avant le dessert
4. **Le Dessert** : pour finir en beauté

## Expressions Utiles

- "Bon appétit !" : Good appetite!
- "C'est délicieux !" : It's delicious!
- "Puis-je avoir l'addition ?" : May I have the bill?
- "Service compris" : Service included
      `,
      englishContent: `
# The French Art of Dining

In France, eating is not just about nourishment, it's an art of living. Here are the essential rules.

## Before the Meal

**The Apéritif**
The apéritif is a convivial moment before the meal. We generally drink:
- Champagne
- White wine
- A kir (white wine + blackcurrant cream)

## At the Table

**The Setup**
- Hands remain visible on the table
- Elbows never touch the table
- We wait for the host to begin

**The Bread**
- Bread is placed directly on the table
- We break it with our hands, never with a knife
- Each bite is buttered individually

## The Meal Courses

1. **L'Entrée**: the first course
2. **Le Plat Principal**: meat or fish with vegetables
3. **Le Fromage**: served before dessert
4. **Le Dessert**: to finish beautifully

## Useful Expressions

- "Bon appétit!": Good appetite!
- "C'est délicieux!": It's delicious!
- "Puis-je avoir l'addition?": May I have the bill?
- "Service compris": Service included
      `
    },
    {
      id: 'social-customs',
      icon: Users,
      title: 'Les Codes Sociaux',
      subtitle: 'Social Customs',
      description: 'Comprenez les normes sociales françaises',
      readTime: '6 min',
      difficulty: 'Intermédiaire',
      frenchContent: `
# Les Codes Sociaux Français

La politesse française a ses propres règles. Voici comment naviguer dans les interactions sociales.

## Les Salutations

**Formelles :**
- "Bonjour Monsieur/Madame" (le matin et l'après-midi)
- "Bonsoir" (à partir de 18h)
- "Bonne nuit" (seulement au coucher)

**Informelles :**
- "Salut !" (entre amis)
- "Coucou !" (très familier)

## La Bise

La bise est un baiser sur les joues. Les règles :
- Entre femmes : toujours
- Homme-femme : si on se connaît bien
- Entre hommes : rarement, plutôt une poignée de main

**Combien de bises ?**
- Paris : 2 bises
- Provence : 3 bises
- Bretagne : 1 bise

## Vous ou Tu ?

**"Vous" (formel) :**
- Personnes âgées
- Supérieurs hiérarchiques
- Inconnus
- Situations professionnelles

**"Tu" (informel) :**
- Famille et amis
- Enfants
- Collègues proches

## Dans les Magasins

1. Toujours dire "Bonjour" en entrant
2. "Au revoir, bonne journée" en sortant
3. Attendre son tour patiemment
4. Dire "Excusez-moi" pour attirer l'attention
      `,
      englishContent: `
# French Social Codes

French politeness has its own rules. Here's how to navigate social interactions.

## Greetings

**Formal:**
- "Bonjour Monsieur/Madame" (morning and afternoon)
- "Bonsoir" (from 6 PM)
- "Bonne nuit" (only at bedtime)

**Informal:**
- "Salut!" (between friends)
- "Coucou!" (very familiar)

## La Bise

La bise is a kiss on the cheeks. The rules:
- Between women: always
- Man-woman: if we know each other well
- Between men: rarely, rather a handshake

**How many kisses?**
- Paris: 2 kisses
- Provence: 3 kisses
- Brittany: 1 kiss

## Vous or Tu?

**"Vous" (formal):**
- Elderly people
- Hierarchical superiors
- Strangers
- Professional situations

**"Tu" (informal):**
- Family and friends
- Children
- Close colleagues

## In Shops

1. Always say "Bonjour" when entering
2. "Au revoir, bonne journée" when leaving
3. Wait your turn patiently
4. Say "Excusez-moi" to get attention
      `
    },
    {
      id: 'celebrations',
      icon: Gift,
      title: 'Les Fêtes Françaises',
      subtitle: 'French Celebrations',
      description: 'Explorez les traditions festives françaises',
      readTime: '8 min',
      difficulty: 'Avancé',
      frenchContent: `
# Les Fêtes et Traditions Françaises

La France célèbre de nombreuses fêtes qui mélangent traditions religieuses, histoire nationale et joie familiale.

## Les Fêtes Nationales

**Le 14 Juillet - La Fête Nationale**
Commémoration de la prise de la Bastille en 1789.
- Défilé militaire sur les Champs-Élysées
- Feux d'artifice dans toute la France
- Bals populaires dans les rues

**Le 11 Novembre - L'Armistice**
Commémoration de la fin de la Première Guerre mondiale.

## Les Fêtes Religieuses

**Noël**
- Le Réveillon : grand repas du 24 décembre
- Messe de minuit pour les croyants
- Échange de cadeaux le 25 matin
- Repas traditionnel : dinde, bûche de Noël

**Pâques**
- Chasse aux œufs pour les enfants
- Les cloches "partent à Rome" et reviennent avec des chocolats
- Repas familial avec agneau pascal

## Les Fêtes Saisonnières

**La Chandeleur (2 février)**
On mange des crêpes en tenant une pièce dans la main gauche pour la prospérité.

**La Fête de la Musique (21 juin)**
Concerts gratuits dans toute la France. Tout le monde peut jouer dans la rue.

## Expressions Festives

- "Joyeux Noël !" : Merry Christmas!
- "Bonne année !" : Happy New Year!
- "Joyeuses Pâques !" : Happy Easter!
- "Bon anniversaire !" : Happy Birthday!
      `,
      englishContent: `
# French Celebrations and Traditions

France celebrates many holidays that blend religious traditions, national history, and family joy.

## National Holidays

**July 14th - National Day**
Commemoration of the storming of the Bastille in 1789.
- Military parade on the Champs-Élysées
- Fireworks throughout France
- Popular street dances

**November 11th - Armistice**
Commemoration of the end of World War I.

## Religious Holidays

**Christmas**
- Le Réveillon: big meal on December 24th
- Midnight mass for believers
- Gift exchange on the 25th morning
- Traditional meal: turkey, Yule log

**Easter**
- Egg hunt for children
- The bells "go to Rome" and return with chocolates
- Family meal with Easter lamb

## Seasonal Celebrations

**Candlemas (February 2nd)**
We eat crepes while holding a coin in the left hand for prosperity.

**Music Day (June 21st)**
Free concerts throughout France. Everyone can play in the street.

## Festive Expressions

- "Joyeux Noël!": Merry Christmas!
- "Bonne année!": Happy New Year!
- "Joyeuses Pâques!": Happy Easter!
- "Bon anniversaire!": Happy Birthday!
      `
    }
  ]

  const openArticle = (article) => {
    setSelectedArticle(article)
    setShowTranslation(false)
  }

  const closeArticle = () => {
    setSelectedArticle(null)
    setShowTranslation(false)
  }

  const toggleTranslation = () => {
    setShowTranslation(!showTranslation)
  }

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-warm-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          {/* Article Header */}
          <div className="mb-6 sm:mb-8">
            <button
              onClick={closeArticle}
              className="flex items-center text-burgundy-600 hover:text-burgundy-700 mb-3 sm:mb-4 text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux articles
            </button>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-burgundy-500 to-burgundy-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <selectedArticle.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-amber-50" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-cream-50 leading-tight">{selectedArticle.title}</h1>
                  <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mt-1">{selectedArticle.subtitle}</p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
                    <span className="text-xs sm:text-sm bg-burgundy-100 text-burgundy-700 px-2 py-1 rounded">
                      {selectedArticle.difficulty}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      📖 {selectedArticle.readTime}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <BookmarkButton
                  item={selectedArticle}
                  type="article"
                  size="sm"
                  variant="minimal"
                />
                <FlashcardButton
                  item={selectedArticle}
                  type="culture"
                  size="sm"
                  variant="minimal"
                />
                <button className="p-2 text-gray-400 hover:text-burgundy-600 transition-colors">
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={toggleTranslation}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                    showTranslation
                      ? 'bg-burgundy-600 text-amber-50'
                      : 'bg-amber-50 text-burgundy-600 border border-burgundy-600 hover:bg-burgundy-50'
                  }`}
                >
                  {showTranslation ? '🇫🇷 Français' : '🇬🇧 English'}
                </button>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="card p-4 sm:p-6 md:p-8">
            <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
              <div
                className="leading-relaxed text-gray-800 dark:text-gray-200 rich-content"
                style={{ fontFamily: 'Georgia, serif', fontSize: window.innerWidth < 640 ? '14px' : '16px', lineHeight: '1.7' }}
                dangerouslySetInnerHTML={{
                  __html: (showTranslation ? selectedArticle.englishContent : selectedArticle.frenchContent)
                    // First handle headers to avoid conflicts
                    .replace(/^# ([^\n]+)/gm, '<h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 mt-6 sm:mt-8 leading-tight">$1</h1>')
                    .replace(/^## ([^\n]+)/gm, '<h2 class="text-lg sm:text-xl md:text-2xl font-bold text-burgundy-700 mt-6 sm:mt-8 mb-3 sm:mb-4 border-l-4 border-burgundy-500 pl-3 sm:pl-4 leading-tight">$1</h2>')
                    .replace(/^### ([^\n]+)/gm, '<h3 class="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mt-4 sm:mt-6 mb-2 sm:mb-3 leading-tight">$1</h3>')
                    // Handle bold text
                    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-burgundy-800 bg-burgundy-50 px-1 sm:px-2 py-1 rounded text-sm sm:text-base">$1</strong>')
                    // Handle bullet points
                    .replace(/^- ([^\n]+)/gm, '<div class="flex items-start mb-2 sm:mb-3 ml-2 sm:ml-4"><span class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-burgundy-500 rounded-full mt-2 sm:mt-3 mr-3 sm:mr-4 flex-shrink-0"></span><span class="text-gray-700 text-sm sm:text-base">$1</span></div>')
                    // Handle numbered lists
                    .replace(/^(\d+)\. ([^\n]+)/gm, '<div class="flex items-start mb-2 sm:mb-3 ml-2 sm:ml-4"><span class="w-6 h-6 sm:w-7 sm:h-7 bg-burgundy-100 text-burgundy-700 rounded-full text-xs sm:text-sm font-bold flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0 mt-1">$1</span><span class="text-gray-700 text-sm sm:text-base">$2</span></div>')
                    // Handle line breaks and spacing
                    .replace(/\n\n/g, '<div class="mb-4 sm:mb-6"></div>')
                    .replace(/\n/g, '<br>')
                }}
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 mt-6 sm:mt-8">
            <button
              onClick={closeArticle}
              className="btn-secondary w-full sm:w-auto"
            >
              ← Tous les articles
            </button>
            <div className="text-xs sm:text-sm text-gray-500 text-center">
              Article {culturalArticles.findIndex(a => a.id === selectedArticle.id) + 1} sur {culturalArticles.length}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-warm-300">
      <SEO
        title="French Culture & Customs | Cultural Insights | SayBonjour!"
        description="Explore French culture through interactive articles — café etiquette, dining customs, social codes, national celebrations, and more. Learn the culture behind the language."
        keywords="french culture, french customs, café culture, french etiquette, french traditions, french celebrations, cultural insights french"
        url="/culture"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-cream-50 mb-3 sm:mb-4 px-2">Cultural Insights</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-2">
            Découvrez la richesse culturelle française à travers des articles interactifs en français avec traductions.
          </p>
        </div>

        {/* Regional Differences */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-cream-50 mb-4 sm:mb-6 px-2">French-Speaking Regions</h2>

          {/* Region Selector */}
          <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 px-2">
            {Object.entries(regions).map(([key, region]) => (
              <button
                key={key}
                onClick={() => setActiveRegion(key)}
                className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                  activeRegion === key
                    ? 'bg-burgundy-600 text-amber-50'
                    : 'bg-amber-50 dark:bg-dark-warm-100 text-gray-700 dark:text-gray-300 hover:bg-burgundy-50 border border-gray-200 dark:border-dark-warm-50'
                }`}
              >
                <span className="text-base sm:text-lg md:text-xl">{region.flag}</span>
                <span className="hidden xs:inline">{region.name}</span>
                <span className="xs:hidden">{region.name.split(',')[0]}</span>
              </button>
            ))}
          </div>

          {/* Region Details */}
          <div className="card p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
              <div className="text-3xl sm:text-4xl flex-shrink-0">{regions[activeRegion].flag}</div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-cream-50 mb-2">
                  {regions[activeRegion].name}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
                  {regions[activeRegion].description}
                </p>
                <ul className="space-y-1.5 sm:space-y-2">
                  {regions[activeRegion].highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-burgundy-600 mt-1 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Cultural Articles */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-cream-50 mb-4 sm:mb-6 px-2">Articles Culturels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {culturalArticles.map((article) => (
              <div
                key={article.id}
                className="card p-4 sm:p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                onClick={() => openArticle(article)}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-burgundy-500 to-burgundy-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform mx-auto sm:mx-0">
                    <article.icon className="w-6 h-6 sm:w-7 sm:h-7 text-amber-50" />
                  </div>
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 mb-2">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-cream-50 group-hover:text-burgundy-600 transition-colors">
                        {article.title}
                      </h3>
                      <BookOpen className="w-4 h-4 text-gray-400 group-hover:text-burgundy-600 transition-colors mx-auto sm:mx-0" />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2">{article.subtitle}</p>
                    <p className="text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed">
                      {article.description}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                      <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
                        <span className="text-xs bg-burgundy-100 text-burgundy-700 px-2 py-1 rounded-full font-medium">
                          {article.difficulty}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          📖 {article.readTime}
                        </span>
                      </div>
                      <div className="text-burgundy-600 group-hover:text-burgundy-700 font-medium text-xs sm:text-sm">
                        Lire l'article →
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Language in Context */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-cream-50 mb-4 sm:mb-6 px-2">Language in Cultural Context</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="card p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-cream-50 mb-3 sm:mb-4">Formal vs. Informal</h3>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <h4 className="font-medium text-burgundy-600 text-sm sm:text-base">Formal (Vous)</h4>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Used with strangers, elders, professionals, and in business settings.</p>
                  <p className="text-xs sm:text-sm italic text-gray-500 dark:text-gray-400">"Comment allez-vous?" (How are you?)</p>
                </div>
                <div>
                  <h4 className="font-medium text-burgundy-600 text-sm sm:text-base">Informal (Tu)</h4>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Used with friends, family, children, and peers.</p>
                  <p className="text-xs sm:text-sm italic text-gray-500 dark:text-gray-400">"Comment ça va?" (How's it going?)</p>
                </div>
              </div>
            </div>

            <div className="card p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-cream-50 mb-3 sm:mb-4">Regional Expressions</h3>
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <span className="font-medium text-burgundy-600 text-sm sm:text-base">France:</span>
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-2">"C'est le pied!" (That's awesome!)</span>
                </div>
                <div>
                  <span className="font-medium text-burgundy-600 text-sm sm:text-base">Quebec:</span>
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-2">"C'est le fun!" (That's fun!)</span>
                </div>
                <div>
                  <span className="font-medium text-burgundy-600 text-sm sm:text-base">Belgium:</span>
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-2">"Une fois" (used for emphasis)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cultural Calendar */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-cream-50 mb-4 sm:mb-6 px-2">Cultural Calendar</h2>
          <div className="card p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="text-center">
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-burgundy-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 dark:text-cream-50 text-sm sm:text-base">Spring</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Easter traditions, May Day celebrations</p>
              </div>
              <div className="text-center">
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-burgundy-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 dark:text-cream-50 text-sm sm:text-base">Summer</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Bastille Day, summer festivals</p>
              </div>
              <div className="text-center">
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-burgundy-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 dark:text-cream-50 text-sm sm:text-base">Autumn</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Harvest festivals, back to school</p>
              </div>
              <div className="text-center">
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-burgundy-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 dark:text-cream-50 text-sm sm:text-base">Winter</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Christmas markets, New Year traditions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Culture
