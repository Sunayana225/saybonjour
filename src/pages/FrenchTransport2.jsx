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
      { fr: 'le métro', en: 'the metro / underground', note: 'Paris has 16 metro lines — one of the world\'s busiest' },
      { fr: 'le bus', en: 'the bus' },
      { fr: 'le tramway / le tram', en: 'the tram' },
      { fr: 'le train', en: 'the train' },
      { fr: 'le TGV (Train à Grande Vitesse)', en: 'the high-speed train', note: 'France has one of the world\'s most extensive high-speed rail networks' },
      { fr: 'le RER', en: 'the suburban express train (Paris)', note: 'Rapid transit connecting Paris to suburbs — faster than metro for longer distances' },
      { fr: 'le car / le car interurbain', en: 'the coach / intercity bus' },
      { fr: 'le Transilien', en: 'the suburban rail (Île-de-France)' },
    ],
  },
  {
    category: 'Individual Transport',
    emoji: '🚗',
    items: [
      { fr: 'une voiture', en: 'a car' },
      { fr: 'une moto(cyclette)', en: 'a motorbike' },
      { fr: 'un vélo', en: 'a bicycle' },
      { fr: 'un vélo électrique (VAE)', en: 'an electric bike', note: 'Hugely popular in France — government subsidies available' },
      { fr: 'une trottinette électrique', en: 'an electric scooter', note: 'Very common in French cities — app-based rental popular' },
      { fr: 'un scooter', en: 'a scooter / moped' },
      { fr: 'un taxi', en: 'a taxi' },
      { fr: 'un VTC (Voiture de Transport avec Chauffeur)', en: 'a private hire car (like Uber)', note: '"Uber" is used informally but officially called VTC' },
    ],
  },
  {
    category: 'Air & Sea',
    emoji: '✈️',
    items: [
      { fr: 'un avion', en: 'a plane' },
      { fr: 'un vol', en: 'a flight' },
      { fr: 'l\'aéroport', en: 'the airport' },
      { fr: 'une compagnie aérienne', en: 'an airline' },
      { fr: 'un ferry / un bac', en: 'a ferry' },
      { fr: 'un bateau', en: 'a boat' },
      { fr: 'un paquebot de croisière', en: 'a cruise ship' },
    ],
  },
]

const TICKET_PHRASES = [
  { fr: 'Un aller simple pour Lyon, s\'il vous plaît.', en: 'A single to Lyon, please.' },
  { fr: 'Un aller-retour pour Nice.', en: 'A return to Nice.' },
  { fr: 'À quelle heure part le prochain train ?', en: 'What time does the next train leave?' },
  { fr: 'Le train est-il direct ?', en: 'Is the train direct?' },
  { fr: 'Je dois changer à Massy ?', en: 'Do I have to change at Massy?' },
  { fr: 'Où est le quai numéro 5 ?', en: 'Where is platform 5?' },
  { fr: 'Mon billet est valable jusqu\'à quand ?', en: 'Until when is my ticket valid?' },
  { fr: 'Y a-t-il une réduction pour étudiant ?', en: 'Is there a student discount?' },
  { fr: 'Le train a du retard.', en: 'The train is delayed.' },
  { fr: 'Composez votre billet avant de monter.', en: 'Validate/stamp your ticket before boarding.', note: 'Essential for SNCF trains — failure to validate can result in a fine' },
]

const SNCF_INFO = [
  { title: 'SNCF', desc: 'France\'s national rail company. Operates TGV, Intercités, and regional TER trains. The app "SNCF Connect" is essential for booking.' },
  { title: 'Composter votre billet', desc: 'On regional trains, you MUST stamp/validate (composter) your ticket in the yellow machines before boarding. Not needed for TGV tickets booked online.' },
  { title: 'La carte Navigo', desc: 'The Paris transport pass — like Oyster in London. Covers metro, RER, bus, tram in zones 1-5. Monthly or weekly passes available.' },
  { title: 'Le covoiturage', desc: 'Carpooling — very popular in France via BlaBlaCar. An affordable alternative to trains for medium distances.' },
]

export default function FrenchTransport2() {
  const [tab, setTab] = useState('vocab')
  const [activeGroup, setActiveGroup] = useState(0)

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark-warm-300">
      <SEO title="French Transport Vocabulary | SayBonjour!" description="French transport vocabulary — metro, train, TGV, bus, car — ticket phrases and travel tips." />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-playfair text-gray-900 dark:text-cream-50">Transport in French</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Les transports — public transport, vocabulary, tickets, and travel tips</p>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          {[{ id: 'vocab', label: 'Transport Vocab' }, { id: 'tickets', label: 'At the Station' }, { id: 'tips', label: 'Travel Tips' }].map(t => (
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
                  className="bg-white dark:bg-dark-warm-100 rounded-xl shadow border border-gray-100 dark:border-dark-warm-50 px-4 py-3 flex items-start gap-3">
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
                className="bg-white dark:bg-dark-warm-100 rounded-xl shadow border border-gray-100 dark:border-dark-warm-50 p-4 flex items-start gap-3">
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
                className="bg-white dark:bg-dark-warm-100 rounded-2xl shadow border border-gray-100 dark:border-dark-warm-50 p-5">
                <h3 className="font-bold text-gray-900 dark:text-cream-50 font-playfair mb-1">{info.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{info.desc}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
