import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plane, Train, MapPin, AlertCircle } from 'lucide-react'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const TRAVEL_SECTIONS = [
  {
    category: 'Transport — Les transports',
    emoji: '🚆',
    items: [
      { fr: 'l\'avion', en: 'plane', note: '"Prendre l\'avion" = to fly. France\'s main hub is Paris-Charles de Gaulle (CDG), the second-busiest airport in Europe.' },
      { fr: 'le train', en: 'train', note: 'France has one of the world\'s most extensive rail networks — 30,000km of track operated by SNCF.' },
      { fr: 'le TGV', en: 'high-speed train', note: '"Train à Grande Vitesse" — up to 320km/h. Paris to Lyon in 2hrs. The TGV launched in 1981 and revolutionised French travel.' },
      { fr: 'l\'Eurostar', en: 'Eurostar (Channel Tunnel train)', note: 'Paris to London in 2h15 via the Channel Tunnel ("le Tunnel sous la Manche"). Up to 18 trains a day.' },
      { fr: 'le métro', en: 'the underground / metro', note: 'Paris has 16 metro lines and 302 stations. Line 1 was opened in 1900. The driverless Line 14 is the busiest.' },
      { fr: 'le RER', en: 'regional express network', note: 'Commuter trains connecting Paris suburbs — 5 lines (A–E). RER B connects CDG airport to central Paris.' },
      { fr: 'le bus', en: 'bus', note: '"Prendre le bus" = to take the bus. Paris\'s bus network covers 350 routes. Night buses = "les Noctiliens".' },
      { fr: 'le car / l\'autocar', en: 'coach (long-distance bus)', note: '"Car" = coach; "autocar" = full word. Low-cost coach services (BlaBlaBus, Flixbus) have boomed since 2015 deregulation.' },
      { fr: 'le taxi', en: 'taxi', note: '"Appeler un taxi" = to call a taxi. "G7" and "Taxis Bleus" are major Paris taxi companies. Uber also widely used.' },
      { fr: 'la voiture', en: 'car', note: '"Louer une voiture" = to rent a car. French motorways ("autoroutes") have tolls ("péages"). Speed limit: 130km/h.' },
      { fr: 'le vélo', en: 'bicycle / bike', note: '"Faire du vélo" = to cycle. Vélib\' = Paris\'s bike-share scheme (20,000+ bikes at 1,400+ stations). E-bikes available.' },
      { fr: 'la trottinette électrique', en: 'electric scooter', note: 'Paris banned dockless electric scooters in 2023 — the first major city to do so, following a public vote.' },
      { fr: 'le covoiturage', en: 'carpooling / ridesharing', note: 'BlaBlaCar — founded in Paris — is the world\'s largest long-distance carpooling platform with 100m+ users.' },
      { fr: 'le ferry / le bateau', en: 'ferry / boat', note: '"Prendre le ferry" = to take the ferry. Routes: Calais–Dover, Cherbourg–Portsmouth, Roscoff–Plymouth.' },
    ],
  },
  {
    category: 'At the Station / Airport — En gare / À l\'aéroport',
    emoji: '✈️',
    items: [
      { fr: 'un billet', en: 'a ticket', note: '"Un billet de train" = a train ticket. "Un billet d\'avion" = a plane ticket. "Un e-billet" = an e-ticket.' },
      { fr: 'un aller simple', en: 'a single ticket (one way)', note: '"Aller" = going. "Simple" = one-way. Only going to the destination, not returning.' },
      { fr: 'un aller-retour', en: 'a return ticket (round trip)', note: '"Aller-retour" = going and coming back. Often abbreviated "A/R" on booking sites.' },
      { fr: 'la première classe / la seconde classe', en: 'first class / second class', note: 'On TGV: "Première" and "Seconde". Business premier = TGV\'s premium class with wider seats and meal service.' },
      { fr: 'le quai', en: 'the platform (train)', note: '"Voie 3, quai B" = Track 3, Platform B. In French stations, "voie" = track number; "quai" = the physical platform.' },
      { fr: 'la voie', en: 'the track / platform number', note: '"Voie 3" = Track 3. Announced on departure boards. Always check — TGV platforms can be confirmed late.' },
      { fr: 'la salle d\'attente', en: 'the waiting room', note: 'Most French stations have comfortable waiting areas. Large stations (Gare de Lyon, Montparnasse) have cafés.' },
      { fr: 'le contrôle des passeports', en: 'passport control', note: 'EU citizens use the fast lane. Non-EU use the general lane. Biometric e-gates at CDG reduce wait times.' },
      { fr: 'l\'embarquement', en: 'boarding (flight or ferry)', note: '"L\'embarquement est ouvert" = boarding is open. "Embarquer" = to board. Typically opens 30–40 min before departure.' },
      { fr: 'la porte d\'embarquement', en: 'the departure gate', note: '"Rendez-vous à la porte 2B" = meet at gate 2B. Gates at CDG can be far apart — allow extra time.' },
      { fr: 'les bagages à main', en: 'hand luggage / carry-on', note: 'French carriers: 1 cabin bag (typically 55×35×25cm). Budget airlines (Transavia, easyJet) charge for overhead bin.' },
      { fr: 'une valise', en: 'a suitcase', note: '"Enregistrer sa valise" = to check in a suitcase. "Le tapis à bagages" = the baggage carousel.' },
      { fr: 'un retard', en: 'a delay', note: '"Le vol est en retard de 45 minutes" = the flight is 45 minutes late. "Retard" applies to trains and flights.' },
      { fr: 'annulé(e)', en: 'cancelled', note: '"Le vol est annulé" = the flight is cancelled. EU law (Regulation 261/2004) gives rights to compensation for long delays.' },
      { fr: 'à l\'heure', en: 'on time', note: '"Le TGV arrive à l\'heure" = the TGV arrives on time. SNCF punctuality target: 90%. Reality: somewhat lower on busy lines.' },
      { fr: 'la consigne (automatique)', en: 'luggage lockers', note: '"Déposer ses bagages à la consigne" = to leave luggage at lockers. Available at most large French stations.' },
    ],
  },
  {
    category: 'Accommodation — L\'hébergement',
    emoji: '🏨',
    items: [
      { fr: 'un hôtel', en: 'a hotel', note: 'French hotels are rated 1–5 stars. "Un palace" = an ultra-luxury hotel (Ritz, Crillon, Plaza Athénée). France has more Michelin-starred restaurant hotels than any other country.' },
      { fr: 'une chambre d\'hôtes', en: 'a bed and breakfast / guesthouse', note: 'Run by the owner ("le/la propriétaire"). Homemade breakfast ("le petit-déjeuner maison") included. Very common in rural France.' },
      { fr: 'un gîte', en: 'a self-catering holiday home', note: '"Gîtes de France" is the national label (150,000+ properties). Very popular in French rural tourism — often converted farmhouses or cottages.' },
      { fr: 'un camping', en: 'a campsite', note: 'France has 11,000+ campsites — more than any country in Europe. Campsites range from basic ("camping sauvage") to luxury ("camping glamping").' },
      { fr: 'une auberge de jeunesse', en: 'a youth hostel', note: 'HI (Hostelling International) and independent hostels available in most cities. "Fuaj" = main French hostel network. From €20/night.' },
      { fr: 'réserver', en: 'to book / reserve', note: '"Réserver en ligne" = to book online. "Réserver à l\'avance" = to book in advance. Essential in July–August and during major events.' },
      { fr: 'une réservation', en: 'a booking / reservation', note: '"Confirmer une réservation" = to confirm a booking. "Annuler une réservation" = to cancel. Check cancellation policy.' },
      { fr: 'l\'enregistrement / le check-in', en: 'check-in', note: '"Faire son check-in" = to check in. Typically from 3pm. Early check-in ("early check-in") usually costs extra.' },
      { fr: 'le départ / le check-out', en: 'check-out / departure', note: 'Typically by 11am–12pm. "Late check-out" may be available on request (often charged extra).' },
      { fr: 'une chambre simple / double', en: 'a single / double room', note: '"Chambre simple" = single room (one person). "Chambre double" = double room. "Chambre twin" = twin beds.' },
      { fr: 'la réception', en: 'reception desk', note: '"S\'adresser à la réception" = to go to reception. In smaller gîtes, the owner may live on-site.' },
      { fr: 'le petit-déjeuner inclus', en: 'breakfast included', note: 'French hotel breakfast typically: baguette, croissants, butter, jam, coffee/tea, orange juice. "Formule buffet" = buffet breakfast.' },
      { fr: 'la climatisation', en: 'air conditioning', note: '"La clim" = informal. Many older French hotels lack air conditioning — a common surprise for visitors from hot climates.' },
      { fr: 'le wifi inclus', en: 'WiFi included', note: 'Standard in almost all French hotels. "Le code wifi" = the WiFi password, usually at reception or on a card in the room.' },
    ],
  },
  {
    category: 'Sightseeing — Visites touristiques',
    emoji: '🗼',
    items: [
      { fr: 'un musée', en: 'a museum', note: 'France has 1,200+ museums. The Louvre (Paris) is the world\'s most visited museum — 9 million visitors/year. Entry: €22 adults, free for under-18s and EU under-26s.' },
      { fr: 'une exposition', en: 'an exhibition', note: '"Une expo temporaire" = a temporary exhibition. "Une expo permanente" = a permanent collection. Major Parisian museums run blockbuster temp exhibitions.' },
      { fr: 'un monument', en: 'a monument / landmark', note: 'France has 43,000 "monuments historiques" (listed historical buildings). More than any country in Europe.' },
      { fr: 'un château', en: 'a castle / palace / château', note: '"Le château de Versailles" is the most visited châau in France. The Loire Valley has 300+ châteaux — a UNESCO World Heritage Site.' },
      { fr: 'une cathédrale', en: 'a cathedral', note: '"Notre-Dame de Paris" (reopened December 2024 after 2019 fire). France has over 100 Gothic cathedrals — more than any country in the world.' },
      { fr: 'un quartier', en: 'a neighbourhood / district', note: 'Paris is divided into 20 "arrondissements" (districts). "Le Marais" = historic Jewish and LGBTQ+ quarter. "Montmartre" = artists\' hill.' },
      { fr: 'le centre-ville', en: 'the town / city centre', note: '"Le centre-ville" = downtown. In Paris: "Rive Gauche" (Left Bank, intellectual) vs "Rive Droite" (Right Bank, commercial).' },
      { fr: 'un guide touristique', en: 'a tour guide / guidebook', note: '"Un guide conférencier" = an officially certified guide. Guides at national museums must hold a professional card.' },
      { fr: 'une visite guidée', en: 'a guided tour', note: '"Une visite guidée gratuite" = a free guided tour. Many cities offer free walking tours (tip-based). Audio guides: "un audioguide".' },
      { fr: 'l\'entrée (gratuite / payante)', en: 'admission (free / paid)', note: 'Many French national museums are free on the first Sunday of the month. Under-18s always free. EU students under 26 often free.' },
      { fr: 'les horaires d\'ouverture', en: 'opening hours', note: '"Ouvert du mardi au dimanche" = open Tuesday to Sunday. Most French museums close on Mondays (national museums) or Tuesdays (some others).' },
      { fr: 'fermé le lundi', en: 'closed on Mondays', note: 'The Louvre, Musée d\'Orsay, Pompidou are closed on Tuesdays. The Musée d\'Orsay closes Mondays. Always check before visiting.' },
      { fr: 'une file d\'attente', en: 'a queue / waiting line', note: '"Faire la queue" = to queue. Book tickets online to avoid long queues at major sites (Eiffel Tower, Versailles, Louvre).' },
      { fr: 'un office de tourisme', en: 'a tourist information office', note: '"L\'OT" = informal abbreviation. Most French towns have one — excellent for maps, local tips, and booking tours.' },
    ],
  },
]

const TRAVEL_PHRASES = [
  { fr: 'Un aller-retour pour Lyon, s\'il vous plaît.', en: 'A return ticket to Lyon, please.', note: 'Add "en première / en seconde classe" to specify class.' },
  { fr: 'Le train est à quelle heure ?', en: 'What time is the train?', note: 'Also: "À quelle heure part le prochain train pour…?" = When does the next train to...leave?' },
  { fr: 'Est-ce que ce siège est libre ?', en: 'Is this seat free?', note: '"Libre" = free/available. "Occupé(e)" = occupied. "Réservé(e)" = reserved.' },
  { fr: 'Je cherche la gare routière.', en: 'I\'m looking for the bus station.', note: '"La gare SNCF" = train station. "La gare routière" = bus/coach station. "L\'aéroport" = airport.' },
  { fr: 'Le vol est retardé d\'une heure.', en: 'The flight is delayed by an hour.', note: '"Retardé de..." = delayed by... "Le vol est annulé" = the flight is cancelled.' },
  { fr: 'J\'ai perdu mes bagages.', en: 'I\'ve lost my luggage.', note: 'Go to "le comptoir des bagages perdus" = lost luggage desk. Report immediately — airline liability applies.' },
  { fr: 'Pouvez-vous m\'indiquer le chemin pour aller à…?', en: 'Can you show me the way to…?', note: 'More formal than "Où est…?". "Indiquer" = to indicate/show. Add the destination.' },
  { fr: 'C\'est à combien de temps à pied ?', en: 'How far is it on foot?', note: '"À pied" = on foot. "En métro" = by metro. "En taxi" = by taxi. Useful for planning.' },
  { fr: 'Je voudrais réserver une chambre pour deux nuits.', en: 'I\'d like to book a room for two nights.', note: '"Pour deux nuits" = for two nights. "À partir du..." = from the... Add the arrival date.' },
  { fr: 'À quelle heure est le petit-déjeuner ?', en: 'What time is breakfast?', note: 'Typical French hotel breakfast: 7am–10am. "En chambre" = room service breakfast option at some hotels.' },
  { fr: 'Y a-t-il un distributeur automatique près d\'ici ?', en: 'Is there an ATM nearby?', note: '"Un distributeur automatique" (or "un DAB" / "un ATM") = cashpoint. Cash is still useful in rural France.' },
  { fr: 'Je voudrais valider mon billet.', en: 'I\'d like to validate my ticket.', note: '"Composter son billet" = to punch/validate a train ticket. In France, you MUST validate paper tickets before boarding or face a fine.' },
  { fr: 'Avez-vous une carte de la ville ?', en: 'Do you have a map of the town?', note: 'Available free at most tourist offices. "Une carte" = a map. "Un plan" = a street map (more specifically urban).' },
  { fr: 'Je me suis perdu(e). Pouvez-vous m\'aider ?', en: 'I\'m lost. Can you help me?', note: '"Perdu(e)" = lost. "Perdu" (m) / "perdue" (f) — adjust for gender. French people are generally happy to help tourists.' },
]

const FRENCH_DESTINATIONS = [
  { name: 'Paris', emoji: '🗼', highlight: 'The Eiffel Tower, the Louvre, Montmartre, Notre-Dame (reopened 2024), the Marais, Seine River cruises', tip: 'Buy museum tickets in advance. Free entry to national museums on the 1st Sunday of the month.' },
  { name: 'Provence', emoji: '🌿', highlight: 'Lavender fields (July), the Camargue flamingos, Arles (Van Gogh), Aix-en-Provence, Avignon Palace of the Popes', tip: '"La lavande" blooms mid-June to mid-August. The Luberon villages (Gordes, Roussillon) are stunning.' },
  { name: 'Côte d\'Azur', emoji: '🌊', highlight: 'Nice, Cannes (film festival May), Monaco, Antibes, Saint-Tropez, the French Riviera beaches', tip: 'Avoid July–August crowds. May and September offer warm weather with fewer tourists.' },
  { name: 'Les Alpes', emoji: '⛷️', highlight: 'Chamonix (Mont Blanc 4,808m), Annecy (Europe\'s cleanest lake), skiing, paragliding, hiking', tip: 'Annecy\'s old town is picture-perfect. Mont Blanc cable car ("l\'Aiguille du Midi") is spectacular but books up fast.' },
  { name: 'Bretagne', emoji: '🦞', highlight: 'Celtic culture, crêpes and galettes, Carnac megaliths (older than Stonehenge), rugged coast, Saint-Malo', tip: '"La galette-saucisse" = sausage in a buckwheat crêpe — the region\'s beloved street food.' },
  { name: 'Bordeaux', emoji: '🍷', highlight: 'Wine capital of the world, UNESCO city, Dune du Pilat (Europe\'s largest sand dune), Cité du Vin wine museum', tip: 'The Cité du Vin is an extraordinary wine museum open all year. The dune is a stunning 30-min drive from Bordeaux.' },
  { name: 'Alsace', emoji: '🏡', highlight: 'Colmar (the "Little Venice"), Strasbourg (European Parliament), Route des Vins, Germanic-French culture, Christmas markets', tip: 'Alsace Christmas markets (December) are among Europe\'s best. Try "le vin chaud" (mulled wine) and "la flammekueche".' },
  { name: 'Normandie', emoji: '🏖️', highlight: 'D-Day beaches (Omaha, Utah), Mont Saint-Michel (tidal island), calvados apple brandy, camembert cheese', tip: 'Mont Saint-Michel is best at high tide and early morning before the crowds. A truly magical sight.' },
  { name: 'Loire Valley', emoji: '🏰', highlight: '300+ châteaux including Chambord and Chenonceau, cycling routes ("La Loire à Vélo"), fine wines, UNESCO listed', tip: '"La Loire à Vélo" is 800km of cycling paths along the river. Châteaux Chenonceau spans the river itself.' },
  { name: 'Dordogne', emoji: '🦆', highlight: 'Prehistoric cave art at Lascaux, medieval villages (Les Baux, Sarlat), foie gras, confit de canard, walnuts', tip: 'Lascaux IV is a perfect replica of the original Paleolithic caves — essential for prehistory lovers.' },
  { name: 'Lyon', emoji: '🍽️', highlight: 'Culinary capital of France, "Bouchons" (traditional Lyonnais restaurants), Vieux-Lyon (UNESCO), Fête des Lumières (December)', tip: '"Les Bouchons" are the soul of Lyonnais cuisine — try "quenelles", "tablier de sapeur", and "cervelle de canut".' },
  { name: 'Corse', emoji: '🏔️', highlight: 'Wild mountains, maquis scrubland, turquoise waters, charcuterie, cheese, Napoleon\'s birthplace (Ajaccio)', tip: 'Corsica is only accessible by ferry or plane. The GR20 hiking trail is one of Europe\'s most challenging and beautiful.' },
]

const SURVIVAL_TIPS = [
  {
    emoji: '🎫',
    title: 'Validate your train ticket!',
    detail: 'In France, paper train tickets MUST be validated ("compostés") in the yellow machines on the platform before boarding. Failure to validate = fine ("une amende") from the SNCF inspector. E-tickets on your phone don\'t need validating, but paper tickets do. This catches many tourists by surprise.',
  },
  {
    emoji: '💳',
    title: 'Cards and cash in France',
    detail: 'France is largely card-friendly but rural areas, markets ("marchés"), and some smaller restaurants still prefer cash. Contactless payment ("le paiement sans contact") is universal. Chip-and-PIN is standard — inform your bank before travelling. Some toll booths only accept cards.',
  },
  {
    emoji: '🏥',
    title: 'Healthcare in France',
    detail: 'France has one of the world\'s best healthcare systems. EU citizens: bring your EHIC (European Health Insurance Card). Non-EU: get travel insurance with medical cover. Pharmacies ("les pharmacies", marked by a green cross) can advise on minor ailments and are often open late. SOS Médecins = house-call doctor service.',
  },
  {
    emoji: '📞',
    title: 'Emergency numbers',
    detail: '15 = SAMU (medical emergency / ambulance). 17 = Police. 18 = Fire brigade ("les pompiers"). 112 = European emergency number (works on all phones). "Au secours !" = Help! "Appelez une ambulance !" = Call an ambulance! These numbers are all free to call.',
  },
  {
    emoji: '🛡️',
    title: 'Safety and pickpockets',
    detail: 'Paris is generally safe but tourist areas (Eiffel Tower, Metro lines 1 and 4, Montmartre) have pickpocketing. Keep bags zipped and at front. "Attention aux pickpockets" = watch for pickpockets. If robbed, report to "le commissariat de police" — you\'ll need a report ("un constat") for insurance.',
  },
  {
    emoji: '🍽️',
    title: 'Restaurant hours — don\'t get caught out',
    detail: 'French restaurants typically serve lunch 12pm–2pm and dinner 7pm–10pm. Arriving at 3pm expecting a full meal is futile — most kitchens are closed. "Le service est terminé" = service has ended. Look for brasseries, which often serve all day. "La brasserie" = always a safe bet for off-hours eating.',
  },
]

export default function FrenchTravel() {
  const [tab, setTab] = useState('vocab')
  const [activeCategory, setActiveCategory] = useState(0)

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French Travel Vocabulary | SayBonjour!" description="Learn French travel vocabulary — transport, airports, hotels, sightseeing, key destinations, and survival tips." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">Travel in French</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Les voyages en français — transport, accommodation, sightseeing, and practical survival tips</p>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          {[
            { id: 'vocab', label: 'Vocabulary' },
            { id: 'destinations', label: 'Destinations' },
            { id: 'phrases', label: 'Phrases' },
            { id: 'survival', label: 'Survival Tips' },
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
              {TRAVEL_SECTIONS.map((cat, i) => (
                <button key={cat.category} onClick={() => { setActiveCategory(i); addXP(3, 'vocabulary') }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeCategory === i ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
                  {cat.emoji} {cat.category.split('—')[0].trim()}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {TRAVEL_SECTIONS[activeCategory].items.map((item, i) => (
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

        {tab === 'destinations' && (
          <div className="grid sm:grid-cols-2 gap-4">
            {FRENCH_DESTINATIONS.map((dest, i) => (
              <motion.div key={dest.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-5"
                onClick={() => addXP(3, 'vocabulary')}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{dest.emoji}</span>
                  <h3 className="font-bold text-gray-900 dark:text-cream-50 font-playfair">{dest.name}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{dest.highlight}</p>
                <p className="text-xs text-amber-700 dark:text-amber-400 italic">💡 {dest.tip}</p>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'phrases' && (
          <div className="space-y-3">
            {TRAVEL_PHRASES.map((phrase, i) => (
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

        {tab === 'survival' && (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-700 rounded-xl px-4 py-3 text-sm text-blue-800 dark:text-blue-300 mb-2">
              Practical tips that every traveller in France needs to know — the things guidebooks often forget to mention.
            </div>
            {SURVIVAL_TIPS.map((tip, i) => (
              <motion.div key={tip.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-5 flex items-start gap-4"
                onClick={() => addXP(4, 'vocabulary')}>
                <span className="text-3xl shrink-0">{tip.emoji}</span>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-cream-50 font-playfair mb-1">{tip.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{tip.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
