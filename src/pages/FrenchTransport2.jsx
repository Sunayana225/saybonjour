import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Train, Car, Plane } from 'lucide-react'
import SEO from '../components/SEO'
import SpeakButton from '../components/SpeakButton'
import { addXP } from '../utils/progress'

const TRANSPORT_VOCAB = [
  {
    category: 'Public Transport',
    emoji: '🚇',
    items: [
      { fr: 'le métro', en: 'the metro / underground', note: 'Paris has 16 metro lines and 302 stations — one of the world\'s busiest. "Le dernier métro" = the last metro (also a famous Truffaut film). Night owls note: the Paris metro runs 24h on Friday/Saturday nights.' },
      { fr: 'le bus', en: 'the bus', note: '"Prendre le bus" = to take the bus. "Un arrêt de bus" = a bus stop. "La ligne" = the route/line number.' },
      { fr: 'le tramway / le tram', en: 'the tram', note: 'Paris expanded its tram network significantly from 2006. Many French cities (Lyon, Bordeaux, Strasbourg, Nantes) have modern tram systems.' },
      { fr: 'le train', en: 'the train', note: '"Prendre le train" = to take the train. "Rater le train" = to miss the train. "Monter dans le train" = to board the train.' },
      { fr: 'le TGV (Train à Grande Vitesse)', en: 'high-speed train', note: 'France\'s pride — Paris to Lyon in 2 hours (400km+). Max speed: 320km/h commercially (record: 574km/h). The TGV network connects Paris to all major French cities and Brussels, Amsterdam, London (via Eurostar).' },
      { fr: 'l\'Eurostar', en: 'Eurostar (Paris-London train)', note: 'Paris (Gare du Nord) to London (St Pancras) in 2h15. "Le tunnel sous la Manche" = the Channel Tunnel.' },
      { fr: 'le RER', en: 'suburban express rail (Paris region)', note: '"Réseau Express Régional" — faster than metro for longer distances; connects Paris to CDG airport, Versailles, Disneyland Paris. 5 lines (A-E).' },
      { fr: 'le TER (Transport Express Régional)', en: 'regional train', note: 'Regional rail networks — slower than TGV, connects smaller towns. Managed by SNCF but funded by regional governments.' },
      { fr: 'le Transilien', en: 'suburban rail (Île-de-France)', note: 'Paris commuter rail lines — lines H, J, K, L, N, P, R, U. Complement to the RER.' },
      { fr: 'le car interurbain', en: 'intercity coach / long-distance bus', note: '"FlixBus" and "Blablabus" operate in France. The "car" is cheaper than the train but slower.' },
    ],
  },
  {
    category: 'Individual Transport',
    emoji: '🚗',
    items: [
      { fr: 'une voiture', en: 'a car', note: 'France is home to Renault, Peugeot (Stellantis), and Citroën. "Conduire une voiture" = to drive a car. "Le permis de conduire" = driving licence.' },
      { fr: 'une moto(cyclette)', en: 'a motorbike', note: '"Un motard" = a biker. "Une moto" is very popular in French cities — and on French mountain roads.' },
      { fr: 'un vélo', en: 'a bicycle', note: '"Faire du vélo" = to go cycling. "Le Tour de France" = the world\'s most famous cycle race. Paris has "Vélib\'" — one of the world\'s largest bike-sharing schemes.' },
      { fr: 'un vélo électrique (VAE)', en: 'an e-bike / electric bicycle', note: 'France offers government subsidies ("bonus écologique") for e-bike purchases. Sales have exploded since 2020.' },
      { fr: 'une trottinette électrique', en: 'an electric scooter / e-scooter', note: 'Very common in French cities — app-based rental (Lime, Bird, Tier). Paris banned shared e-scooters from public roads in 2023 after a referendum.' },
      { fr: 'un taxi', en: 'a taxi', note: '"Appeler un taxi" = to call a taxi. "Héler un taxi" = to hail a taxi. "La borne de taxis" = taxi rank. In Paris, most taxis are G7 or Alpha.' },
      { fr: 'un VTC (Voiture de Transport avec Chauffeur)', en: 'private hire car (Uber etc.)', note: '"VTC" = the official French term. "Uber" is used informally. VTCs compete with taxis in French cities — "la guerre des taxis" was intense in 2015.' },
      { fr: 'le covoiturage', en: 'carpooling / ridesharing', note: '"BlaBlaCar" = the French-founded carpooling platform, now a global leader. Very popular for medium distances (2-4 hours). Much cheaper than trains.' },
      { fr: 'une trottinette', en: 'a (non-electric) scooter / kick scooter', note: 'For children and adults on pavements. "Faire de la trottinette" = to ride a scooter.' },
    ],
  },
  {
    category: 'Air & Sea',
    emoji: '✈️',
    items: [
      { fr: 'un avion', en: 'a plane', note: '"Prendre l\'avion" = to fly/take a plane. "Air France" = France\'s flag carrier. "L\'aéroport Charles de Gaulle (CDG)" = Paris\'s main airport.' },
      { fr: 'un vol', en: 'a flight', note: '"Un vol direct" = a direct flight. "Un vol avec escale" = a flight with a stopover. "Un vol annulé" = a cancelled flight.' },
      { fr: 'l\'aéroport de Roissy / CDG', en: 'Charles de Gaulle Airport', note: 'France\'s main international airport — 65+ million passengers annually. Also: Orly (southern Paris) and Lyon-Saint Exupéry.' },
      { fr: 'une compagnie aérienne', en: 'an airline', note: '"Air France", "Transavia" (budget), "easyJet", "Ryanair" (budget). "Pas de frais cachés" = no hidden charges (advertised claim).' },
      { fr: 'un ferry', en: 'a ferry', note: 'Key routes: Calais–Dover (Brittany Ferries/DFDS), Roscoff–Plymouth, Cherbourg–Poole. "La Manche" = the English Channel.' },
      { fr: 'un bateau', en: 'a boat / ship', note: '"Un bateau de croisière" = a cruise ship. "Un bateau-mouche" = sightseeing boat on the Seine — a Paris icon.' },
      { fr: 'un port', en: 'a port / harbour', note: 'Major French ports: Marseille (largest), Le Havre (commerce), Calais (cross-Channel). "Le vieux port" = the old port.' },
    ],
  },
  {
    category: 'On the Road — La route',
    emoji: '🛣️',
    items: [
      { fr: 'l\'autoroute', en: 'the motorway / highway', note: '"Les autoroutes" in France are mostly toll roads ("à péage"). Speed limit: 130km/h (110km/h in rain). France has one of Europe\'s largest motorway networks.' },
      { fr: 'le péage', en: 'the toll / tollgate', note: '"Payer le péage" = to pay the toll. "Un télépéage" = electronic toll (badge system — e.g. Télépéage Liber-t). Tolls are expensive on French motorways.' },
      { fr: 'une station-service', en: 'a petrol station / service station', note: '"Faire le plein" = to fill up. "De l\'essence" = petrol. "Du gasoil / gazole" = diesel. "De l\'électrique" = electric charging.' },
      { fr: 'le rond-point', en: 'a roundabout', note: 'France has more roundabouts than any other country — around 65% of the world\'s total. "Les Champs-Élysées" join the Arc de Triomphe roundabout (12 roads converging — Europe\'s most complex).' },
      { fr: 'la priorité à droite', en: 'priority to the right', note: 'The famous French driving rule — vehicles from the right have priority at many junctions unless otherwise signed. Catches out foreign drivers. Still active on many Paris streets.' },
      { fr: 'un embouteillage / un bouchon', en: 'a traffic jam', note: '"Un bouchon" (lit. a cork) = a traffic jam. "La circulation est dense" = traffic is heavy. The Paris périphérique is one of Europe\'s most congested roads.' },
    ],
  },
]

const TICKET_PHRASES = [
  { fr: 'Un aller simple pour Lyon, s\'il vous plaît.', en: 'A single (one-way) to Lyon, please.', note: '"Aller simple" = single/one-way. "Aller-retour" = return ticket. Always confirm the date/time.' },
  { fr: 'Un aller-retour pour Nice, deuxième classe.', en: 'A return ticket to Nice, second class.', note: '"Première classe" (1st) / "deuxième classe" (2nd). "En deuxième" = second class (more common).' },
  { fr: 'À quelle heure part le prochain train pour Bordeaux ?', en: 'What time does the next train to Bordeaux leave?', note: '"Partir" = to leave/depart. "Arriver" = to arrive. "L\'heure de départ" = departure time.' },
  { fr: 'Le train est-il direct ou dois-je changer ?', en: 'Is the train direct or do I have to change?', note: '"Direct" = no changes. "Avec correspondance" = with a connection. "Changer à Lyon" = change at Lyon.' },
  { fr: 'Où est le quai numéro 7 ?', en: 'Where is platform 7?', note: '"Un quai" = a platform. "La voie" = the track. "Le train est en voie 7, quai B" = the train is on track 7, platform B.' },
  { fr: 'Y a-t-il une réduction pour les moins de 26 ans ?', en: 'Is there a discount for under-26s?', note: '"La carte Avantage jeune" gives up to 60% off SNCF trains for under-27s.' },
  { fr: 'Composez votre billet avant de monter dans le train.', en: 'Validate/stamp your ticket before boarding.', note: 'ESSENTIAL on regional TER trains. Failure = fine ("une amende"). Online TGV tickets don\'t usually need stamping.' },
  { fr: 'Le train a du retard — il arrive avec 20 minutes de retard.', en: 'The train is delayed — it\'s arriving 20 minutes late.', note: '"Avoir du retard" = to be late/delayed. "Retard dû à un incident technique" = delay due to a technical fault.' },
  { fr: 'Je voudrais une place côté fenêtre, s\'il vous plaît.', en: 'I\'d like a window seat, please.', note: '"Côté fenêtre" = window side. "Côté couloir" = aisle side. "Une place réservée" = a reserved seat.' },
  { fr: 'Ce billet est valable jusqu\'à minuit.', en: 'This ticket is valid until midnight.', note: '"Valable" = valid. "La validité du billet" = the ticket\'s validity period.' },
]

const SNCF_INFO = [
  { title: 'SNCF — la Société Nationale des Chemins de Fer', desc: 'France\'s national rail company — operates TGV, Intercités, and regional TER trains. "SNCF Connect" (app) is essential for booking, managing tickets, and checking times. France has one of Europe\'s best rail networks — but also one of Europe\'s most strike-prone.', emoji: '🚄' },
  { title: 'Composter votre billet — why stamping matters', desc: 'On regional trains (TER, Transilien, Intercités), you must validate/stamp your ticket in the yellow machines (composteurs) on the platform before boarding. TGV tickets booked online with a seat reservation don\'t need composting. Inspectors fine passengers with un-stamped tickets — "voyager sans compostage" = travelling with an unvalidated ticket.', emoji: '🟨' },
  { title: 'La carte Navigo — Paris transport pass', desc: 'The rechargeable Navigo pass covers metro, RER, bus, tram, and Transilien within selected zones. Navigo Easy = reloadable card (T+ tickets, day passes). Navigo Mois/Semaine = monthly/weekly pass (best value for regular users). Zone 1-5 = all of Île-de-France including airports. "Navigo Liberté+" = pay-as-you-go.', emoji: '💳' },
  { title: 'Le covoiturage — BlaBlaCar & beyond', desc: 'Carpooling is hugely popular in France — BlaBlaCar (French company) has 100 million members globally. For trips of 2-5 hours, carpooling can be 50-70% cheaper than the train. Popular routes: Paris–Lyon, Paris–Bordeaux, Paris–Nantes. "BlaBlaBus" = BlaBlaCar\'s coach service.', emoji: '🤝' },
  { title: 'Paris transport tips for visitors', desc: 'Buy a Navigo Easy card (€2) and load 10 T+ tickets (carnet) for metro/bus/tram. At CDG airport: RER B connects directly to central Paris (30-40 min). For Orly: OrlyVal or Orly Bus. Avoid buying tickets from strangers outside stations. The "carte orange hebdomadaire" = the weekly pass (best for 5+ days).' , emoji: '🗺️' },
]

export default function FrenchTransport2() {
  const [tab, setTab] = useState('vocab')
  const [activeGroup, setActiveGroup] = useState(0)

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French Transport Vocabulary | SayBonjour!" description="French transport vocabulary — metro, TGV, bus, car — with ticket phrases, SNCF tips, and French road culture." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">Transport in French</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Les transports — public transport, road travel, tickets, and French transport culture</p>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          {[
            { id: 'vocab', label: 'Transport Vocab' },
            { id: 'tickets', label: 'At the Station' },
            { id: 'tips', label: 'Travel Tips' },
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
              {TRANSPORT_VOCAB.map((g, i) => (
                <button key={g.category} onClick={() => { setActiveGroup(i); addXP(3, 'vocabulary') }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeGroup === i ? 'bg-burgundy-600 text-white' : 'bg-white dark:bg-dark-warm-100 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-warm-50 hover:border-burgundy-300'}`}>
                  {g.emoji} {g.category}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {TRANSPORT_VOCAB[activeGroup].items.map((item, i) => (
                <motion.div key={item.fr} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
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

        {tab === 'tickets' && (
          <div className="space-y-3">
            {TICKET_PHRASES.map((p, i) => (
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

        {tab === 'tips' && (
          <div className="space-y-4">
            {SNCF_INFO.map((info, i) => (
              <motion.div key={info.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-5 flex items-start gap-4"
                onClick={() => addXP(3, 'vocabulary')}>
                <span className="text-3xl shrink-0">{info.emoji}</span>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-cream-50 font-playfair mb-1">{info.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{info.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
