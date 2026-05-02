export const travelVocab = [
  { id: 'tv1', fr: "l'aéroport", en: 'airport', category: 'Airport' },
  { id: 'tv2', fr: "le passeport", en: 'passport', category: 'Airport' },
  { id: 'tv3', fr: "la carte d'embarquement", en: 'boarding pass', category: 'Airport' },
  { id: 'tv4', fr: "la douane", en: 'customs', category: 'Airport' },
  { id: 'tv5', fr: "le vol", en: 'flight', category: 'Airport' },
  { id: 'tv6', fr: "la valise", en: 'suitcase', category: 'Airport' },
  { id: 'tv7', fr: "le bagage à main", en: 'hand luggage', category: 'Airport' },
  { id: 'tv8', fr: "l'enregistrement", en: 'check-in', category: 'Airport' },
  { id: 'tv9', fr: "la porte d'embarquement", en: 'departure gate', category: 'Airport' },
  { id: 'tv10', fr: "l'arrivée", en: 'arrival', category: 'Airport' },

  { id: 'tv11', fr: "l'hôtel", en: 'hotel', category: 'Hotel' },
  { id: 'tv12', fr: "la chambre", en: 'room', category: 'Hotel' },
  { id: 'tv13', fr: "la réservation", en: 'reservation / booking', category: 'Hotel' },
  { id: 'tv14', fr: "le petit-déjeuner", en: 'breakfast', category: 'Hotel' },
  { id: 'tv15', fr: "la clé / la carte magnétique", en: 'key / key card', category: 'Hotel' },
  { id: 'tv16', fr: "la réception", en: 'front desk / reception', category: 'Hotel' },
  { id: 'tv17', fr: "l'ascenseur", en: 'elevator / lift', category: 'Hotel' },
  { id: 'tv18', fr: "le service de chambre", en: 'room service', category: 'Hotel' },

  { id: 'tv19', fr: "le restaurant", en: 'restaurant', category: 'Restaurant' },
  { id: 'tv20', fr: "la carte / le menu", en: 'menu', category: 'Restaurant' },
  { id: 'tv21', fr: "l'addition", en: 'the bill', category: 'Restaurant' },
  { id: 'tv22', fr: "le pourboire", en: 'tip / gratuity', category: 'Restaurant' },
  { id: 'tv23', fr: "la table", en: 'table', category: 'Restaurant' },
  { id: 'tv24', fr: "le serveur / la serveuse", en: 'waiter / waitress', category: 'Restaurant' },
  { id: 'tv25', fr: "une table pour deux", en: 'a table for two', category: 'Restaurant' },
  { id: 'tv26', fr: "sans gluten", en: 'gluten-free', category: 'Restaurant' },

  { id: 'tv27', fr: "le métro", en: 'subway / metro', category: 'Transport' },
  { id: 'tv28', fr: "le bus", en: 'bus', category: 'Transport' },
  { id: 'tv29', fr: "le taxi", en: 'taxi', category: 'Transport' },
  { id: 'tv30', fr: "la gare", en: 'train station', category: 'Transport' },
  { id: 'tv31', fr: "le billet", en: 'ticket', category: 'Transport' },
  { id: 'tv32', fr: "le plan", en: 'map', category: 'Transport' },
  { id: 'tv33', fr: "l'arrêt de bus", en: 'bus stop', category: 'Transport' },
  { id: 'tv34', fr: "tout droit", en: 'straight ahead', category: 'Transport' },
  { id: 'tv35', fr: "à gauche", en: 'to the left', category: 'Transport' },
  { id: 'tv36', fr: "à droite", en: 'to the right', category: 'Transport' },

  { id: 'tv37', fr: "au secours !", en: 'Help!', category: 'Emergency' },
  { id: 'tv38', fr: "la police", en: 'police', category: 'Emergency' },
  { id: 'tv39', fr: "l'hôpital", en: 'hospital', category: 'Emergency' },
  { id: 'tv40', fr: "le médecin", en: 'doctor', category: 'Emergency' },
  { id: 'tv41', fr: "une pharmacie", en: 'pharmacy', category: 'Emergency' },
  { id: 'tv42', fr: "j'ai besoin d'aide", en: 'I need help', category: 'Emergency' },
  { id: 'tv43', fr: "j'ai perdu mon passeport", en: 'I lost my passport', category: 'Emergency' },
  { id: 'tv44', fr: "appelez le 15 / 17 / 18", en: 'call medical/police/fire services', category: 'Emergency' },
]

export const travelPhrases = [
  {
    category: 'At the Airport',
    emoji: '✈️',
    phrases: [
      { fr: "Où est le terminal d'embarquement ?", en: "Where is the departure terminal?" },
      { fr: "Mon vol est à quelle heure ?", en: "What time is my flight?" },
      { fr: "J'ai un bagage à enregistrer.", en: "I have a bag to check in." },
      { fr: "Y a-t-il des retards ?", en: "Are there any delays?" },
      { fr: "Où est la sortie ?", en: "Where is the exit?" },
      { fr: "Je voudrais un siège côté fenêtre.", en: "I'd like a window seat." },
    ]
  },
  {
    category: 'At the Hotel',
    emoji: '🏨',
    phrases: [
      { fr: "J'ai une réservation au nom de…", en: "I have a reservation under the name of…" },
      { fr: "À quelle heure est le check-out ?", en: "What time is check-out?" },
      { fr: "Pouvez-vous m'appeler un taxi ?", en: "Can you call me a taxi?" },
      { fr: "La climatisation ne fonctionne pas.", en: "The air conditioning isn't working." },
      { fr: "Y a-t-il du wifi ?", en: "Is there wifi?" },
      { fr: "Je voudrais une chambre non-fumeur.", en: "I'd like a non-smoking room." },
    ]
  },
  {
    category: 'At the Restaurant',
    emoji: '🍽️',
    phrases: [
      { fr: "Une table pour deux, s'il vous plaît.", en: "A table for two, please." },
      { fr: "Qu'est-ce que vous recommandez ?", en: "What do you recommend?" },
      { fr: "Je suis végétarien(ne).", en: "I am vegetarian." },
      { fr: "L'addition, s'il vous plaît.", en: "The bill, please." },
      { fr: "C'était délicieux !", en: "It was delicious!" },
      { fr: "Vous avez une allergie au gluten ?", en: "Do you have a gluten allergy?" },
      { fr: "Je voudrais commander…", en: "I would like to order…" },
    ]
  },
  {
    category: 'Getting Around',
    emoji: '🗺️',
    phrases: [
      { fr: "Excusez-moi, où est… ?", en: "Excuse me, where is…?" },
      { fr: "C'est loin d'ici ?", en: "Is it far from here?" },
      { fr: "Comment aller à la Tour Eiffel ?", en: "How do I get to the Eiffel Tower?" },
      { fr: "Je voudrais aller à…", en: "I'd like to go to…" },
      { fr: "Pouvez-vous répéter plus lentement ?", en: "Can you repeat more slowly?" },
      { fr: "Un ticket, s'il vous plaît.", en: "One ticket, please." },
    ]
  },
  {
    category: 'Shopping',
    emoji: '🛍️',
    phrases: [
      { fr: "C'est combien ?", en: "How much is it?" },
      { fr: "Avez-vous ça en taille M ?", en: "Do you have this in size M?" },
      { fr: "Je cherche un cadeau.", en: "I'm looking for a gift." },
      { fr: "Puis-je essayer ça ?", en: "Can I try this on?" },
      { fr: "Je vais prendre ça.", en: "I'll take this." },
      { fr: "Vous acceptez les cartes ?", en: "Do you accept cards?" },
    ]
  },
  {
    category: 'Emergencies',
    emoji: '🚨',
    phrases: [
      { fr: "Appelez la police !", en: "Call the police!" },
      { fr: "J'ai besoin d'un médecin.", en: "I need a doctor." },
      { fr: "Où est l'hôpital le plus proche ?", en: "Where is the nearest hospital?" },
      { fr: "J'ai été volé(e).", en: "I've been robbed." },
      { fr: "Je ne me sens pas bien.", en: "I don't feel well." },
      { fr: "Je suis perdu(e).", en: "I'm lost." },
    ]
  },
]

export const travelScenarios = [
  {
    id: 'sc1',
    title: 'Clearing Customs',
    titleFr: 'Passer la douane',
    emoji: '🛂',
    level: 'A1',
    dialogue: [
      { speaker: 'Douanier', text: "Bonjour. Votre passeport, s'il vous plaît." },
      { speaker: 'Vous', text: "Le voici." },
      { speaker: 'Douanier', text: "Quel est le but de votre voyage ?" },
      { speaker: 'Vous', text: "Je suis en vacances." },
      { speaker: 'Douanier', text: "Combien de temps restez-vous en France ?" },
      { speaker: 'Vous', text: "Deux semaines." },
      { speaker: 'Douanier', text: "Très bien. Bienvenue en France !" },
    ],
    vocab: ["le douanier = customs officer", "le but = purpose", "rester = to stay", "bienvenue = welcome"],
    tip: "Always have your passport and return ticket ready. Officers may ask about accommodation — know your hotel name!"
  },
  {
    id: 'sc2',
    title: 'Ordering at a Café',
    titleFr: 'Commander au café',
    emoji: '☕',
    level: 'A1',
    dialogue: [
      { speaker: 'Serveur', text: "Bonjour ! Qu'est-ce que vous désirez ?" },
      { speaker: 'Vous', text: "Je voudrais un café et un croissant, s'il vous plaît." },
      { speaker: 'Serveur', text: "Très bien. Vous souhaitez autre chose ?" },
      { speaker: 'Vous', text: "Non merci. C'est tout." },
      { speaker: 'Serveur', text: "Ça fait 4 euros 50." },
      { speaker: 'Vous', text: "Voilà. Merci !" },
    ],
    vocab: ["désirer = to wish / want", "souhaiter = to wish", "c'est tout = that's all", "ça fait = that comes to"],
    tip: "In French cafés, you usually pay at the end. Say 'l'addition' when ready to leave!"
  },
  {
    id: 'sc3',
    title: 'Asking for Directions',
    titleFr: 'Demander son chemin',
    emoji: '🗺️',
    level: 'A2',
    dialogue: [
      { speaker: 'Vous', text: "Excusez-moi, je cherche le musée du Louvre." },
      { speaker: 'Passant', text: "Ah oui ! Continuez tout droit, puis tournez à gauche au feu rouge." },
      { speaker: 'Vous', text: "C'est loin ?" },
      { speaker: 'Passant', text: "Non, c'est à dix minutes à pied." },
      { speaker: 'Vous', text: "Merci beaucoup !" },
      { speaker: 'Passant', text: "De rien. Bonne visite !" },
    ],
    vocab: ["continuez tout droit = continue straight", "tournez = turn", "le feu rouge = red light", "à pied = on foot"],
    tip: "When asking for directions, repeat them back to confirm — 'Donc, tout droit puis à gauche ?' shows you understood!"
  },
  {
    id: 'sc4',
    title: 'Checking into a Hotel',
    titleFr: "L'enregistrement à l'hôtel",
    emoji: '🏨',
    level: 'A2',
    dialogue: [
      { speaker: 'Réceptionniste', text: "Bonsoir ! Vous avez une réservation ?" },
      { speaker: 'Vous', text: "Oui, au nom de Smith. J'ai réservé une chambre double." },
      { speaker: 'Réceptionniste', text: "Parfait. Puis-je voir votre passeport ?" },
      { speaker: 'Vous', text: "Bien sûr. Le voici." },
      { speaker: 'Réceptionniste', text: "Voici votre clé. Chambre 214 au deuxième étage." },
      { speaker: 'Vous', text: "À quelle heure est le petit-déjeuner ?" },
      { speaker: 'Réceptionniste', text: "De 7h à 10h dans la salle à manger." },
    ],
    vocab: ["au nom de = under the name of", "une chambre double = double room", "le deuxième étage = second floor", "la salle à manger = dining room"],
    tip: "French floors: rez-de-chaussée (ground), premier étage (1st floor), deuxième (2nd). UK '1st floor' = French 'premier étage'!"
  },
]

export const travelQuiz = [
  {
    q: 'How do you ask for the bill in a French restaurant?',
    options: ["Le menu, s'il vous plaît", "L'addition, s'il vous plaît", "La carte, s'il vous plaît", "Le pourboire, s'il vous plaît"],
    answer: 1,
    explanation: '"L\'addition" is the bill. "La carte" is the menu. "Le menu" is a set meal. Never ask for "le check" — that\'s not French!'
  },
  {
    q: 'What does "tout droit" mean when getting directions?',
    options: ['Turn right', 'Turn left', 'Straight ahead', 'Go back'],
    answer: 2,
    explanation: '"Tout droit" = straight ahead. "À droite" = to the right. "À gauche" = to the left.'
  },
  {
    q: 'You need urgent medical help. What do you shout?',
    options: ['Excusez-moi !', 'Au secours !', 'S\'il vous plaît !', 'Pardon !'],
    answer: 1,
    explanation: '"Au secours !" means "Help!" — the standard distress call in French.'
  },
  {
    q: 'At the airport, "l\'enregistrement" means:',
    options: ['Baggage claim', 'Security check', 'Check-in', 'Departure gate'],
    answer: 2,
    explanation: '"Enregistrement" literally means registration — in airport context it\'s "check-in".'
  },
  {
    q: 'How do you say "I have a reservation" at a hotel?',
    options: ["J'ai une réservation.", "Je veux une chambre.", "Avez-vous une chambre?", "Je cherche un hôtel."],
    answer: 0,
    explanation: '"J\'ai une réservation" = I have a reservation. Add "au nom de [name]" to give your name.'
  },
  {
    q: '"Je suis perdu(e)" means:',
    options: ["I'm bored", "I'm lost", "I'm tired", "I'm sick"],
    answer: 1,
    explanation: '"Perdu" is the past participle of "perdre" (to lose). "Je suis perdu(e)" = I am lost.'
  },
]
