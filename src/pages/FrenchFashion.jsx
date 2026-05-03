import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const FASHION_VOCAB = [
  {
    category: 'Clothing — Les vêtements',
    items: [
      { fr: 'un manteau', en: 'a coat', note: '"Porter un beau manteau" = to wear a beautiful coat. France\'s winters call for stylish coats — the trench coat ("le trench") was popularised partly through French cinema.' },
      { fr: 'un imperméable', en: 'a raincoat / mac', note: 'Often called "le trench" informally. The classic Burberry trench has deep French fashion associations.' },
      { fr: 'une veste', en: 'a jacket', note: '"Une veste en cuir" = a leather jacket. "Ramasser une veste" (idiom) = to suffer a major defeat or humiliation.' },
      { fr: 'un blazer', en: 'a blazer', note: 'The blazer crossed from British navy dress into French fashion via the grandes écoles — still essential in smart-casual French dressing.' },
      { fr: 'un pull', en: 'a jumper / sweater', note: 'Short for "pull-over". "Un pull en cachemire" = a cashmere jumper — classic French quality dressing.' },
      { fr: 'un débardeur', en: 'a vest top / tank top', note: 'Essential in summer — "un débardeur rayé" (a striped vest) is associated with the classic French marinière look.' },
      { fr: 'une chemise', en: "a shirt (men\'s)", note: '"Une chemise blanche bien repassée" = a well-ironed white shirt — a pillar of French masculine elegance. "La chemise" also means blouse in older usage.' },
      { fr: 'un chemisier', en: "a blouse (women\'s)", note: '"Un chemisier en soie" = a silk blouse. The French blouse tradition emphasises refined cut over decoration.' },
      { fr: 'un pantalon', en: 'trousers / pants', note: 'Always singular in French even when referring to both legs. "Un pantalon de tailleur" = suit trousers. "Porter le pantalon" (idiom) = to wear the trousers (to be in charge).' },
      { fr: 'un jean', en: 'jeans', note: 'Pronounced "djinn" in French. Imported from American culture in the 1950s. "Un jean slim" = slim-fit jeans — the dominant French style.' },
      { fr: 'une jupe', en: 'a skirt', note: '"Une jupe plissée" = a pleated skirt. "Une minijupe" = a miniskirt — introduced to France via Mary Quant and Courréges in the 1960s.' },
      { fr: 'une robe', en: 'a dress', note: '"La petite robe noire" (the little black dress) was invented by Coco Chanel in 1926 — revolutionary in its simplicity.' },
      { fr: 'un short', en: 'shorts', note: '"Un short en jean" = denim shorts. Shorts are considered casual — French style generally reserves them for sport or beaches.' },
      { fr: 'un costume', en: "a suit (men\'s)", note: '"Un costume trois pièces" = a three-piece suit. French men\'s tailoring (from Paris\'s tailors on the Rue du Faubourg Saint-Honoré) is world-renowned.' },
      { fr: 'un tailleur', en: "a suit (women\'s)", note: '"Le tailleur" was revolutionised by Chanel — her tweed tailleur became an icon of women\'s professional dressing.' },
      { fr: 'des chaussettes', en: 'socks', note: '"Des chaussettes en laine" = wool socks. In French style, visible socks are a deliberate accessory, not an afterthought.' },
      { fr: 'des sous-vêtements', en: 'underwear', note: 'French lingerie brands (Chantelle, Simone Pérèle, Aubade) are world leaders in luxury lingerie — a distinct sector of French fashion.' },
      { fr: 'un pyjama', en: 'pyjamas', note: '"Le pyjama chic" has become a fashion trend — pyjama-style trousers worn as outerwear, embraced on French runways.' },
    ],
  },
  {
    category: 'Shoes & Accessories — Chaussures & Accessoires',
    items: [
      { fr: 'des chaussures', en: 'shoes', note: '"Des chaussures en cuir" = leather shoes. France is home to iconic shoemakers — Repetto (ballet flats), J.M. Weston (Goodyear-welted shoes).' },
      { fr: 'des baskets', en: 'trainers / sneakers', note: '"Baskets" is the standard French term. Sneaker culture is huge in France — limited-edition drops cause queues outside French boutiques.' },
      { fr: 'des talons hauts', en: 'high heels', note: '"Des escarpins" = court shoes / heels. Christian Louboutin (French) made the red-soled heel iconic globally.' },
      { fr: 'des bottes', en: 'boots', note: '"Des bottes en cuir" = leather boots. "Des bottes en caoutchouc" = wellington boots (rainboots). Autumn/winter staple in French wardrobes.' },
      { fr: 'des sandales', en: 'sandals', note: '"Des sandales plates" = flat sandals. Birkenstock and Mephisto sandals are both popular in France despite their non-French origins.' },
      { fr: 'un sac à main', en: 'a handbag', note: 'The French handbag market is dominated by luxury: the Hermès Birkin (waitlist: years), the Chanel 2.55, the Louis Vuitton Neverfull. "Un sac à main" is a serious cultural object.' },
      { fr: 'un portefeuille', en: 'a wallet', note: '"Un portefeuille en cuir" = a leather wallet. Longchamp (French brand) is famous for its leather goods.' },
      { fr: 'une ceinture', en: 'a belt', note: '"Une ceinture en cuir" = a leather belt. A quality leather belt is considered a wardrobe essential in France.' },
      { fr: 'un foulard', en: 'a silk scarf', note: 'The Hermès carré (square scarf) is one of the most recognisable fashion accessories in the world. Wearing a foulard is considered instantly chic.' },
      { fr: 'une écharpe', en: 'a wool scarf', note: 'Longer and warmer than a foulard — essential in French winters. "Mettre son écharpe" = to wrap up your scarf.' },
      { fr: 'des bijoux', en: 'jewellery', note: '"Les bijoux fantaisie" = costume jewellery. French women famously mix real and costume jewellery with supreme confidence.' },
      { fr: 'une montre', en: 'a watch', note: 'French watchmaking (Lip, Herbelin) is notable, though Switzerland dominates luxury. "Une montre de luxe" = a luxury watch.' },
      { fr: 'un chapeau', en: 'a hat', note: '"Un chapeau de paille" = a straw hat. French milliners (chapeliers) — especially in Paris — have a long tradition of haute millinery.' },
      { fr: 'une casquette', en: 'a cap', note: '"Une casquette en laine" = a wool cap. In France, the classic "casquette à visière" is associated with working-class chic — a look the fashion world has embraced.' },
      { fr: 'des lunettes de soleil', en: 'sunglasses', note: '"Des lunettes de soleil" — an essential French accessory year-round. Vuarnet (French brand, founded 1957) remains a cult favourite.' },
    ],
  },
  {
    category: 'Describing Clothes — Décrire les vêtements',
    items: [
      { fr: 'élégant(e)', en: 'elegant', note: '"L\'élégance" is a core French aesthetic value — restraint, proportion, and quality over trend.' },
      { fr: 'chic', en: 'chic / stylish', note: 'This French word has been adopted globally. "Être chic" means effortlessly stylish — but in France it implies an understated, considered look.' },
      { fr: 'décontracté(e)', en: 'casual / relaxed', note: '"Le style décontracté" = casual style. France prizes "le casual chic" — looking put-together even in relaxed clothes.' },
      { fr: 'sobre', en: 'understated / subdued', note: '"Sobre" is a compliment in French fashion — it implies refined restraint, not dullness. The opposite of garish.' },
      { fr: 'à la mode', en: 'fashionable / trendy', note: '"La mode" = fashion (also "fashion" as an industry). "À la mode" = in fashion right now — can become "démodé" very quickly.' },
      { fr: 'démodé(e)', en: 'old-fashioned / out of style', note: 'The Chanel quote captures it: "La mode se démode, le style jamais" (Fashion fades, style is eternal).' },
      { fr: 'uni(e)', en: 'plain / one-colour', note: '"Un pull uni" = a plain jumper. French style tends to favour solid colours and let accessories do the talking.' },
      { fr: 'à rayures', en: 'striped', note: '"La marinière" (Breton striped top) is a French fashion icon — made famous by Coco Chanel in 1917, still sold by Saint James.' },
      { fr: 'à pois', en: 'polka-dot', note: '"À pois" = with dots. Polka-dot prints are classic in French summer fashion — especially on flowing dresses.' },
      { fr: 'en cuir', en: 'leather', note: '"En cuir véritable" = genuine leather. French leather goods (maroquinerie) are a major luxury export — Hermès, Lancel, Longchamp.' },
      { fr: 'en coton', en: 'cotton', note: '"En coton biologique" = in organic cotton. France has strong regulations on textile labelling — "100% coton" must be verified.' },
      { fr: 'en soie', en: 'silk', note: 'Lyon (France\'s second city) was the capital of European silk weaving for centuries — Hermès still sources silk fabrics from Lyon workshops.' },
      { fr: 'en laine', en: 'wool', note: '"En laine mérinos" = merino wool. France imports most wool but produces some fine quality wool in the Pyrenees and Massif Central.' },
    ],
  },
  {
    category: 'Shopping — Faire du shopping',
    items: [
      { fr: 'faire du shopping', en: 'to go shopping', note: '"Faire du shopping" is the common phrase, using the English loan-word. "Faire les courses" = grocery shopping. "Faire du lèche-vitrines" = window-shopping (lit. to lick the windows).' },
      { fr: 'essayer', en: 'to try on', note: '"Est-ce que je peux l\'essayer ?" = Can I try it on? "La cabine d\'essayage" = the fitting room. An essential verb for clothes shopping.' },
      { fr: 'la cabine d\'essayage', en: 'the fitting room', note: 'In French shops, fitting room access can be restricted (some allow 3 items at a time). "Une cabine libre" = a free fitting room.' },
      { fr: 'la taille', en: 'the size (clothing)', note: 'French sizes differ from UK and US. A French 38 is a UK 10 / US 6 for women. Sizes run from 34 (XS) to 46+ (XL). Always check the conversion chart.' },
      { fr: 'la pointure', en: 'the shoe size', note: 'French shoe sizes use the European standard. A French 38 = UK 5 = US 7.5 (women). French 42 = UK 8 = US 9 (men).' },
      { fr: 'les soldes', en: 'the sales', note: '"Les soldes" in France are legally regulated: January sales (soldes d\'hiver) and July sales (soldes d\'été). Fixed 4–6 week periods — the entire retail calendar revolves around them.' },
      { fr: 'une réduction', en: 'a discount', note: '"Bénéficier d\'une réduction" = to get a discount. "Moins dix pour cent" = ten percent off. Loyalty cards ("cartes de fidélité") are very common.' },
      { fr: 'la caisse', en: 'the checkout / till', note: '"Passer à la caisse" = to go to the till. "La caissière / le caissier" = the cashier. Self-checkout ("caisse automatique") has spread widely.' },
      { fr: 'un reçu', en: 'a receipt', note: '"Gardez votre reçu" = keep your receipt. Essential for returns ("les retours") — France has clear consumer rights for returning items within 14 days online.' },
      { fr: 'rembourser', en: 'to refund', note: '"Se faire rembourser" = to get a refund. "Le service après-vente (SAV)" = after-sales service. Consumer rights ("droits du consommateur") are strong in France.' },
    ],
  },
]

const MAISONS = [
  { name: 'Chanel', founded: 1910, signature: 'The little black dress (1926), the quilted 2.55 bag, tweed jackets — simplicity as the ultimate sophistication.', founder: 'Gabrielle "Coco" Chanel', icon: '⬛', note: 'Chanel liberated women from corsets and introduced jersey into high fashion. Her quote "La mode se démode, le style jamais" defines French fashion philosophy.' },
  { name: 'Louis Vuitton', founded: 1854, signature: 'Monogrammed luggage, the LV canvas, the Neverfull tote — from steamer trunks to the world\'s most valuable luxury brand.', founder: 'Louis Vuitton', icon: '🌸', note: 'Founded as a trunk-maker for Empress Eugénie. Now part of LVMH (the world\'s largest luxury group). The monogram was designed in 1896 to prevent counterfeiting — it didn\'t work.' },
  { name: 'Dior', founded: 1946, signature: 'The New Look (1947) — nipped waist, padded hips, longer skirts. A revolution after wartime austerity. The Bar jacket.', founder: 'Christian Dior', icon: '🌹', note: 'Dior\'s 1947 debut was called the "New Look" by Carmel Snow of Harper\'s Bazaar. It scandalised those who saw it as retrograde — and thrilled those who saw it as a return to femininity.' },
  { name: 'Hermès', founded: 1837, signature: 'The Birkin bag (waitlist: years), the Kelly bag, the carré silk scarf — quality over trend, always.', founder: 'Thierry Hermès', icon: '🐎', note: 'Founded as a harness-maker. The Birkin bag was conceived on a Paris–London flight in 1984 when Jane Birkin complained to Hermès CEO Jean-Louis Dumas about her basket. A handbag was designed on the back of an air-sickness bag.' },
  { name: 'Yves Saint Laurent', founded: 1961, signature: 'Le Smoking tuxedo suit for women (1966) — redefining what women could wear. The Safari jacket. "Mondrian" shift dress.', founder: 'Yves Saint Laurent', icon: '🖤', note: 'YSL dressed Catherine Deneuve, Sophia Loren, and Bianca Jagger. He was the first designer to introduce plus-size models and openly acknowledge gay relationships in the fashion world.' },
  { name: 'Givenchy', founded: 1952, signature: 'Audrey Hepburn\'s black dress in Breakfast at Tiffany\'s — Hubert de Givenchy and Hepburn\'s partnership defined "Parisian elegance" for a generation.', founder: 'Hubert de Givenchy', icon: '💎', note: 'Givenchy met Audrey Hepburn in 1953. Their friendship lasted until her death in 1993. He said she was his muse and he was her ally.' },
  { name: 'Balenciaga', founded: 1917, signature: 'Structural avant-garde silhouettes — the sack dress (1957) liberated women from waist definition. Now provocatively modern under Demna.', founder: 'Cristóbal Balenciaga', icon: '🏛️', note: 'Coco Chanel called Balenciaga "the only true couturier". Christian Dior called him "the master of us all". His work is studied in fashion schools as the pinnacle of construction.' },
  { name: 'Coco Chanel', founded: null, signature: '"La mode se démode, le style jamais." — Fashion fades, style is eternal. The defining philosophy of French fashion.', founder: 'Coco Chanel', icon: '💬', note: 'Also: "Elegance is refusal." And: "A woman who cuts her hair is about to change her life." Chanel\'s aphorisms are as influential as her designs.' },
]

const USEFUL_PHRASES = [
  { fr: 'Est-ce que vous avez ça en taille 40 ?', en: 'Do you have this in size 40?', note: '"Quelle taille faites-vous ?" = What size are you? A shop assistant might ask this.' },
  { fr: 'Est-ce que je peux l\'essayer ?', en: 'Can I try it on?', note: 'Always polite to ask. "La cabine d\'essayage est par là" = the fitting room is that way.' },
  { fr: 'C\'est trop grand / trop petit.', en: "It\'s too big / too small.", note: '"Est-ce que vous avez une taille au-dessous ?" = do you have a size down? "Une taille au-dessus" = a size up.' },
  { fr: 'Ça me va bien / ça ne me va pas.', en: "It suits me / it doesn\'t suit me.", note: '"Me va" = suits me (fits my look). "M\'aller" = to suit/fit. Different from "ça me plaît" (I like it) — something can suit you without you liking it.' },
  { fr: 'Vous faites les soldes ?', en: 'Do you have a sale on?', note: 'The French word "soldes" specifically means official seasonal sales. "Promotions" covers non-sale discounts.' },
  { fr: 'C\'est soldé à combien ?', en: 'How much is it in the sale?', note: '"Quel est le prix soldé ?" is more formal. "Le prix d\'origine" = the original price. "La réduction" = the discount.' },
  { fr: 'Je cherche quelque chose de chic mais de décontracté.', en: "I\'m looking for something chic but casual.", note: '"Casual chic" is a very French concept — elevated informality. A shop assistant will understand exactly what you mean.' },
  { fr: 'Est-ce que c\'est du vrai cuir ?', en: 'Is it genuine leather?', note: '"Cuir véritable" = genuine leather. "Similicuir" = faux leather. French consumer law requires accurate labelling.' },
  { fr: 'Je peux vous payer par carte ?', en: 'Can I pay by card?', note: 'Most French shops accept card. "Sans contact" = contactless. "J\'ai mon code" = I have my PIN.' },
  { fr: 'Est-ce que c\'est possible de l\'échanger ?', en: 'Is it possible to exchange it?', note: '"Échanger" = to exchange. You generally need the receipt and tags. "Satisfait ou remboursé" = satisfaction or money back — a French retail guarantee.' },
  { fr: 'Avez-vous ce modèle dans une autre couleur ?', en: 'Do you have this style in another colour?', note: '"Ce modèle" = this style/model. "Dans d\'autres coloris" = in other colour options. A standard shopping question.' },
  { fr: 'C\'est pour offrir — est-ce que vous pouvez faire un paquet cadeau ?', en: "It\'s a gift — can you do gift wrapping?", note: 'Gift wrapping ("emballage cadeau") is a traditional service in French boutiques — often done beautifully with ribbon and tissue paper.' },
]

const FASHION_CULTURE = [
  { emoji: '✂️', title: 'La Semaine de la Mode de Paris', detail: 'Paris Fashion Week (Semaine de la Mode) is held twice yearly — February/March for autumn/winter collections and September/October for spring/summer. It is the apex of the global fashion calendar. The Fédération de la Haute Couture et de la Mode oversees access to the official calendar, which features around 100 shows over ten days.' },
  { emoji: '👗', title: 'Haute Couture vs. Prêt-à-Porter', detail: '"Haute couture" (high sewing) is legally defined in France: only 14–20 houses are officially accredited by the Chambre Syndicale each year. Garments must be made-to-measure, hand-sewn, requiring at least 700 hours of work. A haute couture dress can cost €20,000–€300,000. "Prêt-à-porter" (ready-to-wear) is high-quality mass production — the level most people buy.' },
  { emoji: '🛍️', title: 'Les Soldes — The Sacred Sales', detail: 'French sales ("les soldes") are legally regulated by the government. They occur twice a year: January (soldes d\'hiver) and July (soldes d\'été), lasting 4–6 weeks. Retailers can only discount items they already have in stock. The first day of sales ("le premier jour des soldes") is treated as a national event — queues form outside major stores from dawn.' },
  { emoji: '🇫🇷', title: 'Le Style Français — The Effortless Ideal', detail: 'The French fashion ideal is "l\'élégance désinvolte" — effortless elegance. The mythology: French women don\'t try too hard, never over-accessorise, mix high and low ("haut-de-gamme et low-cost"), and always have one deliberate "imperfection" (un défaut volontaire). This ideal is partly a cultural myth — but it drives global fashion consumption and the enduring appeal of French brands.' },
  { emoji: '🧵', title: 'Lyon — Capital of French Silk', detail: 'Lyon (France\'s second city) was the silk capital of the world from the 16th century until the Industrial Revolution. The Canuts (silk weavers) produced the finest fabrics for European royal courts. Hermès still sources its carré scarves from Lyon workshops. The city\'s Musée des Tissus (Textile Museum) holds one of the world\'s greatest fabric collections.' },
  { emoji: '♻️', title: 'La Mode Éthique — Sustainable Fashion', detail: 'France is at the forefront of sustainable fashion legislation. Since 2022, France bans the destruction of unsold textile goods (previously billions of euros of clothing were burned or landfilled). The "loi AGEC" (2020) introduced extended producer responsibility for textiles. Second-hand clothing ("friperies", "vide-greniers", Vinted) has exploded — young French consumers lead Europe in second-hand purchases.' },
]

export default function FrenchFashion() {
  const [tab, setTab] = useState('vocab')
  const [activeCategory, setActiveCategory] = useState(0)

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French Fashion Vocabulary | SayBonjour!" description="Learn French fashion vocabulary — clothing, accessories, shopping phrases, the great fashion houses, and French fashion culture." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">French Fashion</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">La mode française — clothing vocab, haute couture & fashion culture</p>
        </div>

        <div className="flex gap-3 mb-8 flex-wrap">
          {[
            { id: 'vocab', label: 'Vocabulary' },
            { id: 'maisons', label: 'Fashion Houses' },
            { id: 'phrases', label: 'Shopping Phrases' },
            { id: 'culture', label: 'Fashion Culture' },
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
              {FASHION_VOCAB.map((cat, i) => (
                <button key={cat.category} onClick={() => { setActiveCategory(i); addXP(3, 'vocabulary') }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeCategory === i ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
                  {cat.category.split('—')[0].trim()}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {FASHION_VOCAB[activeCategory].items.map((item, i) => (
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

        {tab === 'maisons' && (
          <div className="space-y-4">
            {MAISONS.map((m, i) => (
              <motion.div key={m.name} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-dark-warm-100 rounded-xl shadow border border-gray-100 dark:border-dark-warm-50 p-5 flex items-start gap-4 cursor-pointer"
                onClick={() => addXP(4, 'vocabulary')}>
                <div className="w-12 h-12 rounded-xl bg-cream-50 dark:bg-dark-warm-200 flex items-center justify-center text-2xl shrink-0">{m.icon}</div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-bold text-gray-900 dark:text-cream-50">{m.name}</h3>
                    {m.founded && <span className="text-xs text-gray-400">founded {m.founded}</span>}
                  </div>
                  {m.founder && <p className="text-xs text-gray-400 mb-1">Founder: {m.founder}</p>}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{m.signature}</p>
                  {m.note && <p className="text-xs text-amber-700 dark:text-amber-400 italic">💡 {m.note}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'phrases' && (
          <div className="space-y-3">
            {USEFUL_PHRASES.map((phrase, i) => (
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

        {tab === 'culture' && (
          <div className="space-y-4">
            <div className="bg-burgundy-50 dark:bg-burgundy-900/10 border border-burgundy-200 dark:border-burgundy-700 rounded-xl px-4 py-3 mb-2 text-sm text-burgundy-800 dark:text-burgundy-300">
              France is the world\'s fashion capital — a title earned not just by its great houses but by a distinct philosophy of dressing that values style over trend.
            </div>
            {FASHION_CULTURE.map((item, i) => (
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
