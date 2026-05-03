export const stories = [
  {
    id: 'airport',
    title: 'Arrivée à Paris',
    englishTitle: 'Arriving in Paris',
    level: 'A2',
    intro: 'You\'ve just landed at Charles de Gaulle airport. Your French adventure begins!',
    coverEmoji: '✈️',
    nodes: {
      start: {
        text: 'Vous descendez de l\'avion à l\'aéroport Charles de Gaulle. Un agent de sécurité vous approche.',
        agent: '👮 Agent: "Bonjour! Votre passeport, s\'il vous plaît."',
        choices: [
          { label: 'Give your passport and say "Voilà, monsieur."', next: 'customs_polite', xp: 5 },
          { label: 'Say "Je l\'ai perdu!" (I lost it!)', next: 'customs_problem', xp: 2 },
        ]
      },
      customs_polite: {
        text: 'L\'agent vérifie votre passeport avec un sourire.',
        agent: '👮 Agent: "Merci. Bienvenue en France! Bonne visite!"',
        choices: [
          { label: 'Ask "Où est la sortie?" (Where is the exit?)', next: 'find_exit', xp: 5 },
          { label: 'Ask "Y a-t-il un bureau de change ici?" (Is there an exchange bureau here?)', next: 'exchange', xp: 5 },
        ]
      },
      customs_problem: {
        text: 'L\'agent est inquiet. Il appelle ses collègues.',
        agent: '👮 Agent: "Ne vous inquiétez pas. Venez avec moi au bureau."',
        tip: '💡 Tip: Always keep your passport safe when travelling!',
        choices: [
          { label: '"En fait, je l\'ai trouvé!" (Actually, I found it!)', next: 'customs_polite', xp: 3 },
        ]
      },
      find_exit: {
        text: 'L\'agent vous indique la direction.',
        agent: '👮 Agent: "Prenez l\'escalier roulant, puis tournez à gauche."',
        choices: [
          { label: 'Say "Merci beaucoup!" and follow the directions', next: 'taxi_stand', xp: 5 },
          { label: 'Say "Je ne comprends pas, pouvez-vous répéter?" (I don\'t understand, can you repeat?)', next: 'repeat_directions', xp: 5 },
        ]
      },
      exchange: {
        text: 'L\'agent vous montre une pancarte.',
        agent: '👮 Agent: "Oui, le bureau de change est au niveau 2, près des sorties."',
        choices: [
          { label: 'Go to the bureau de change', next: 'at_exchange', xp: 5 },
          { label: 'Decide to use an ATM instead — "Je vais chercher un distributeur."', next: 'taxi_stand', xp: 3 },
        ]
      },
      repeat_directions: {
        text: 'The agent speaks more slowly.',
        agent: '👮 Agent: "D\'accord. Escalier roulant... à gauche... et voilà — la sortie!"',
        choices: [
          { label: '"Ah, je comprends maintenant! Merci!"', next: 'taxi_stand', xp: 5 },
        ]
      },
      at_exchange: {
        text: 'Vous êtes au bureau de change.',
        agent: '💱 Employé: "Bonjour! Je peux vous aider?"',
        choices: [
          { label: '"Je voudrais changer 100 livres sterling en euros, s\'il vous plaît."', next: 'taxi_stand', xp: 10 },
          { label: '"Quel est le taux de change aujourd\'hui?" (What\'s the exchange rate today?)', next: 'taxi_stand', xp: 10 },
        ]
      },
      taxi_stand: {
        text: 'Vous êtes dehors. Il y a une file de taxis devant vous.',
        agent: '🚕 Chauffeur: "Bonjour! Où voulez-vous aller?"',
        choices: [
          { label: '"Je voudrais aller à l\'hôtel Lumière, dans le 9ème arrondissement."', next: 'in_taxi', xp: 10 },
          { label: 'Take the RER train instead — "Je cherche le RER B, s\'il vous plaît."', next: 'rer_train', xp: 10 },
        ]
      },
      in_taxi: {
        text: 'Dans le taxi, le chauffeur est bavard.',
        agent: '🚕 Chauffeur: "C\'est votre première fois à Paris?"',
        choices: [
          { label: '"Oui, c\'est ma première fois. Je suis très excité(e)!"', next: 'hotel_arrival', xp: 5 },
          { label: '"Non, je suis déjà venu(e) deux fois."', next: 'hotel_arrival', xp: 5 },
        ]
      },
      rer_train: {
        text: 'Un passant vous montre la direction du RER.',
        agent: '🧑 Passant: "Le RER B? C\'est par là, au fond du terminal."',
        choices: [
          { label: '"Merci infiniment!" and follow the signs', next: 'hotel_arrival', xp: 5 },
        ]
      },
      hotel_arrival: {
        text: 'Vous arrivez à votre hôtel. La réceptionniste vous accueille avec un grand sourire.',
        agent: '🏨 Réceptionniste: "Bonsoir et bienvenue! Vous avez une réservation?"',
        choices: [
          { label: '"Oui, au nom de [votre nom]. J\'ai réservé une chambre double."', next: 'end_success', xp: 10 },
          { label: '"Euh... j\'espère? Je crois avoir réservé en ligne."', next: 'end_success', xp: 5 },
        ]
      },
      end_success: {
        text: 'La réceptionniste vous remet votre clé.',
        agent: '🏨 Réceptionniste: "Voici votre clé — chambre 304, au 3ème étage. Bonne nuit et bonne visite à Paris!"',
        choices: [],
        isEnd: true,
        endMessage: '🎉 Bravo! You made it through your first evening in Paris! Your French carried you all the way from the airport to your hotel room.',
      },
    }
  },
  {
    id: 'cafe',
    title: 'Au Café Parisien',
    englishTitle: 'At a Parisian Café',
    level: 'A1',
    intro: 'It\'s morning in Paris. You want to enjoy a classic French breakfast at a local café.',
    coverEmoji: '☕',
    nodes: {
      start: {
        text: 'Vous entrez dans un petit café charmant. Le serveur vous voit arriver.',
        agent: '🧑‍🍳 Serveur: "Bonjour! Une table pour combien de personnes?"',
        choices: [
          { label: '"Pour une personne, s\'il vous plaît."', next: 'seated', xp: 5 },
          { label: '"Pour deux personnes — j\'attends un ami."', next: 'seated_two', xp: 5 },
        ]
      },
      seated: {
        text: 'Le serveur vous installe près de la fenêtre — quelle belle vue sur la rue!',
        agent: '🧑‍🍳 Serveur: "Voilà. Je vous apporte la carte."',
        choices: [
          { label: 'Order "Un café et un croissant, s\'il vous plaît."', next: 'order_basic', xp: 5 },
          { label: 'Ask "Qu\'est-ce que vous recommandez?" (What do you recommend?)', next: 'recommendation', xp: 5 },
        ]
      },
      seated_two: {
        text: 'Le serveur vous installe à une grande table.',
        agent: '🧑‍🍳 Serveur: "Très bien. Voilà la carte."',
        choices: [
          { label: 'Order for yourself: "Un café crème, s\'il vous plaît."', next: 'order_basic', xp: 5 },
        ]
      },
      recommendation: {
        text: 'The waiter smiles proudly.',
        agent: '🧑‍🍳 Serveur: "Notre spécialité, c\'est la tartine au beurre avec confiture maison et un grand café crème."',
        choices: [
          { label: '"Parfait! Je prends ça, merci."', next: 'order_special', xp: 10 },
          { label: '"Juste un espresso, merci."', next: 'order_basic', xp: 5 },
        ]
      },
      order_basic: {
        text: 'Le serveur note votre commande.',
        agent: '🧑‍🍳 Serveur: "Très bien. Ce sera prêt dans deux minutes."',
        choices: [
          { label: 'Wait and enjoy the atmosphere', next: 'food_arrives', xp: 3 },
          { label: 'Ask for the WiFi — "Avez-vous le WiFi?"', next: 'wifi', xp: 5 },
        ]
      },
      order_special: {
        text: 'Le serveur est ravi de votre choix.',
        agent: '🧑‍🍳 Serveur: "Excellent choix! Ce sera prêt dans cinq minutes."',
        choices: [
          { label: 'Wait and enjoy the view', next: 'food_arrives', xp: 3 },
        ]
      },
      wifi: {
        text: 'The waiter writes the password on a napkin.',
        agent: '🧑‍🍳 Serveur: "Bien sûr! Le code est café2024. Voilà!"',
        choices: [
          { label: '"Merci beaucoup!"', next: 'food_arrives', xp: 5 },
        ]
      },
      food_arrives: {
        text: 'Le serveur apporte votre commande.',
        agent: '🧑‍🍳 Serveur: "Voilà pour vous. Bon appétit!"',
        choices: [
          { label: '"Merci! C\'est délicieux!"', next: 'bill', xp: 5 },
          { label: 'Ask "Puis-je avoir un peu plus de sucre?" (Could I have a little more sugar?)', next: 'sugar', xp: 5 },
        ]
      },
      sugar: {
        text: 'The waiter quickly brings sugar.',
        agent: '🧑‍🍳 Serveur: "Mais bien sûr! Voilà."',
        choices: [
          { label: '"Merci, vous êtes gentil!"', next: 'bill', xp: 5 },
        ]
      },
      bill: {
        text: 'Vous avez fini. Il est temps de payer.',
        agent: '🧑‍🍳 Serveur: "Autre chose?"',
        choices: [
          { label: '"Non merci, l\'addition s\'il vous plaît!"', next: 'end_success', xp: 5 },
          { label: '"Un autre café, s\'il vous plaît."', next: 'second_coffee', xp: 3 },
        ]
      },
      second_coffee: {
        text: 'Le serveur vous apporte un deuxième café.',
        agent: '🧑‍🍳 Serveur: "Voilà!"',
        choices: [
          { label: '"L\'addition s\'il vous plaît!" (the bill)', next: 'end_success', xp: 5 },
        ]
      },
      end_success: {
        text: 'Le serveur vous apporte l\'addition. Vous laissez un pourboire.',
        agent: '🧑‍🍳 Serveur: "Merci beaucoup! Bonne journée et à bientôt!"',
        choices: [],
        isEnd: true,
        endMessage: '☕ Félicitations! You had a perfect French café experience. The croissants were délicieux and your French was magnifique!',
      },
    }
  },
  {
    id: 'market',
    title: 'Au Marché du Village',
    englishTitle: 'At the Village Market',
    level: 'A2',
    intro: 'It\'s Saturday morning. You visit a traditional French market to buy fresh produce for the week.',
    coverEmoji: '🥖',
    nodes: {
      start: {
        text: 'Vous arrivez au marché. Des étals colorés s\'étendent tout le long de la rue. Le bruit des vendeurs et les odeurs de pain frais vous accueillent.',
        agent: '🛒 Vous regardez les stands. Par où commencer?',
        choices: [
          { label: 'Go to the fruit and vegetable stall first', next: 'fruit_veg', xp: 3 },
          { label: 'Head to the cheese stall — "Je cherche le fromager."', next: 'cheese_stall', xp: 3 },
          { label: 'Ask someone for directions — "Excusez-moi, où est le stand de pain?"', next: 'ask_bread', xp: 5 },
        ]
      },
      fruit_veg: {
        text: 'Les légumes sont magnifiques — tomates rouges, courgettes vertes, herbes fraîches.',
        agent: '👩‍🌾 Marchande: "Bonjour! Qu\'est-ce qu\'il vous faut aujourd\'hui?"',
        choices: [
          { label: '"Je voudrais un kilo de tomates et une courgette, s\'il vous plaît."', next: 'pay_veg', xp: 10 },
          { label: '"C\'est combien les fraises ?" (How much are the strawberries?)', next: 'strawberries', xp: 5 },
        ]
      },
      strawberries: {
        text: 'The vendor points to a big basket of red strawberries.',
        agent: '👩‍🌾 Marchande: "Trois euros la barquette — elles sont excellentes ce matin!"',
        choices: [
          { label: '"Je prends deux barquettes, s\'il vous plaît!"', next: 'pay_veg', xp: 10 },
          { label: '"C\'est un peu cher. Merci quand même." (It\'s a bit expensive. Thanks anyway.)', next: 'cheese_stall', xp: 3 },
        ]
      },
      pay_veg: {
        text: 'Vous payez et remerciez la marchande.',
        agent: '👩‍🌾 Marchande: "Voilà votre monnaie. Bonne journée!"',
        choices: [
          { label: '"Merci, bonne journée à vous aussi!"', next: 'cheese_stall', xp: 5 },
        ]
      },
      cheese_stall: {
        text: 'Le fromagier propose une impressionnante sélection de fromages français.',
        agent: '🧀 Fromagier: "Bonjour! Vous connaissez le fromage français?"',
        choices: [
          { label: '"Un peu! Je voudrais essayer le camembert et le comté."', next: 'cheese_tasting', xp: 10 },
          { label: '"Pas vraiment — qu\'est-ce que vous recommandez pour un débutant?"', next: 'cheese_recommendation', xp: 10 },
        ]
      },
      cheese_recommendation: {
        text: 'The cheese seller is delighted to share his knowledge.',
        agent: '🧀 Fromagier: "Pour commencer, je recommande le brie — doux et crémeux. Et avec du vin rouge, un comté de 12 mois!"',
        choices: [
          { label: '"Parfait! Un morceau de brie et un morceau de comté, s\'il vous plaît."', next: 'cheese_tasting', xp: 10 },
        ]
      },
      cheese_tasting: {
        text: 'He cuts a small piece for you to try.',
        agent: '🧀 Fromagier: "Tenez — goûtez ça!" (Here, taste this!)',
        choices: [
          { label: '"Mmm, c\'est délicieux! Je prends 200g de camembert."', next: 'bread_stall', xp: 10 },
          { label: '"C\'est bien, mais c\'est un peu fort pour moi." (It\'s good, but a bit strong for me.)', next: 'bread_stall', xp: 5 },
        ]
      },
      ask_bread: {
        text: 'A local points the way with a smile.',
        agent: '🧑 Passant: "Le boulanger? C\'est au fond, à droite — vous ne pouvez pas le manquer!"',
        choices: [
          { label: '"Merci beaucoup!" and head to the bakery stall', next: 'bread_stall', xp: 5 },
        ]
      },
      bread_stall: {
        text: 'The baker\'s stall smells incredible — fresh baguettes, pain de campagne, and pastries.',
        agent: '👨‍🍳 Boulanger: "Bonjour! Une belle baguette tradition?"',
        choices: [
          { label: '"Oui, s\'il vous plaît! Et une tarte aux pommes aussi."', next: 'end_market', xp: 10 },
          { label: '"Deux baguettes, s\'il vous plaît — j\'invite des amis ce soir."', next: 'end_market', xp: 5 },
        ]
      },
      end_market: {
        text: 'Votre panier est plein de bonnes choses fraîches. Vous rentrez chez vous, satisfait(e).',
        agent: '🛒 Vous avez tout acheté. Mission accomplie!',
        choices: [],
        isEnd: true,
        endMessage: '🛒 Bravo! You navigated a traditional French market like a pro — bargaining, tasting, and chatting with locals. Your French is growing stronger every day!',
      },
    }
  },
  {
    id: 'doctor',
    title: 'Chez le Médecin',
    englishTitle: 'At the Doctor\'s',
    level: 'B1',
    intro: 'You\'ve been feeling unwell for a few days. Time to visit a French doctor.',
    coverEmoji: '🏥',
    nodes: {
      start: {
        text: 'Vous entrez dans le cabinet médical. La secrétaire vous accueille.',
        agent: '💼 Secrétaire: "Bonjour! Vous avez rendez-vous?"',
        choices: [
          { label: '"Oui, j\'ai rendez-vous à 10h avec le docteur Martin."', next: 'waiting_room', xp: 5 },
          { label: '"Non, mais c\'est urgent — je me sens très mal."', next: 'no_appointment', xp: 3 },
        ]
      },
      no_appointment: {
        text: 'La secrétaire consulte son agenda.',
        agent: '💼 Secrétaire: "Le docteur peut vous voir dans une heure. Voulez-vous attendre?"',
        choices: [
          { label: '"Oui, je vais attendre. Merci."', next: 'waiting_room', xp: 5 },
          { label: '"Ce n\'est pas possible d\'attendre — je souffre beaucoup."', next: 'urgent_case', xp: 5 },
        ]
      },
      urgent_case: {
        text: 'The secretary looks concerned and makes a call.',
        agent: '💼 Secrétaire: "D\'accord, je préviens le médecin immédiatement. Asseyez-vous, il arrive."',
        choices: [
          { label: '"Merci beaucoup." Sit down and wait.', next: 'waiting_room', xp: 5 },
        ]
      },
      waiting_room: {
        text: 'Vous attendez dans la salle d\'attente. Après quelques minutes, le médecin vous appelle.',
        agent: '👨‍⚕️ Docteur Martin: "Bonjour! Entrez. Qu\'est-ce qui vous amène?"',
        choices: [
          { label: '"J\'ai mal à la gorge et de la fièvre depuis trois jours."', next: 'throat', xp: 10 },
          { label: '"J\'ai des maux de tête intenses et je me sens épuisé(e)."', next: 'headache', xp: 10 },
          { label: '"J\'ai mal au ventre depuis ce matin."', next: 'stomach', xp: 10 },
        ]
      },
      throat: {
        text: 'The doctor examines your throat carefully.',
        agent: '👨‍⚕️ Docteur: "Ouvrez la bouche, s\'il vous plaît... Oui, c\'est rouge. Vous avez de la fièvre en ce moment?"',
        choices: [
          { label: '"Oui, 38,5 ce matin."', next: 'prescription', xp: 5 },
          { label: '"Je ne sais pas — je n\'ai pas de thermomètre."', next: 'temperature_check', xp: 5 },
        ]
      },
      headache: {
        text: 'The doctor asks more questions.',
        agent: '👨‍⚕️ Docteur: "Ces maux de tête — ils sont pulsatiles? Côté ou frontal? Avez-vous des nausées?"',
        choices: [
          { label: '"Ils sont du côté droit et j\'ai aussi des nausées."', next: 'migraine_diagnosis', xp: 10 },
          { label: '"Partout, surtout le matin."', next: 'prescription', xp: 5 },
        ]
      },
      stomach: {
        text: 'The doctor presses gently on your abdomen.',
        agent: '👨‍⚕️ Docteur: "Vous avez mangé quelque chose d\'inhabituel hier?"',
        choices: [
          { label: '"J\'ai mangé des moules hier soir au restaurant."', next: 'food_poisoning', xp: 10 },
          { label: '"Non, rien de spécial."', next: 'prescription', xp: 5 },
        ]
      },
      temperature_check: {
        text: 'The doctor takes your temperature.',
        agent: '👨‍⚕️ Docteur: "38,7 — vous avez de la fièvre effectivement."',
        choices: [
          { label: '"C\'est grave?"', next: 'prescription', xp: 5 },
        ]
      },
      migraine_diagnosis: {
        text: 'The doctor nods knowingly.',
        agent: '👨‍⚕️ Docteur: "Je pense que c\'est une migraine. Est-ce que vous en avez souvent?"',
        choices: [
          { label: '"Oui, environ deux fois par mois depuis un an."', next: 'prescription', xp: 10 },
          { label: '"Non, c\'est la première fois."', next: 'prescription', xp: 5 },
        ]
      },
      food_poisoning: {
        text: 'The doctor examines you carefully.',
        agent: '👨‍⚕️ Docteur: "C\'est probablement une intoxication alimentaire. Vous avez vomi?"',
        choices: [
          { label: '"Oui, plusieurs fois cette nuit."', next: 'prescription', xp: 5 },
          { label: '"Non, pas encore, mais j\'ai des nausées."', next: 'prescription', xp: 5 },
        ]
      },
      prescription: {
        text: 'The doctor writes a prescription.',
        agent: '👨‍⚕️ Docteur: "Je vous prescris un antibiotique. Prenez-le trois fois par jour pendant sept jours. Reposez-vous et buvez beaucoup d\'eau."',
        choices: [
          { label: '"Je suis allergique à la pénicilline — c\'est un problème?"', next: 'allergy_check', xp: 10 },
          { label: '"Merci docteur. Je vais aller à la pharmacie."', next: 'end_success', xp: 5 },
        ]
      },
      allergy_check: {
        text: 'The doctor pauses and checks his notes.',
        agent: '👨‍⚕️ Docteur: "Bonne chose que vous me le disiez! Je vous prescris autre chose. Pas de problème."',
        choices: [
          { label: '"Merci pour votre attention."', next: 'end_success', xp: 10 },
        ]
      },
      end_success: {
        text: 'Vous sortez du cabinet avec votre ordonnance.',
        agent: '💼 Secrétaire: "Au revoir! Bon rétablissement!"',
        choices: [],
        isEnd: true,
        endMessage: '🏥 Très bien! You successfully navigated a medical appointment in French. You described your symptoms clearly and understood the doctor\'s advice. Bon rétablissement!',
      },
    }
  },
  {
    id: 'apartment',
    title: 'Trouver un Appartement',
    englishTitle: 'Finding a Flat',
    level: 'B1',
    intro: 'You\'re moving to Lyon for work. You need to find a flat and deal with a French estate agent.',
    coverEmoji: '🏠',
    nodes: {
      start: {
        text: 'Vous entrez dans une agence immobilière à Lyon. Un agent vous accueille.',
        agent: '🏢 Agent: "Bonjour! Je suis Monsieur Renard. Je peux vous aider?"',
        choices: [
          { label: '"Bonjour! Je cherche un appartement à louer."', next: 'search_criteria', xp: 5 },
          { label: '"Oui — je viens de trouver un poste à Lyon et j\'ai besoin d\'un logement rapidement."', next: 'urgency', xp: 5 },
        ]
      },
      urgency: {
        text: 'The agent takes note of your situation.',
        agent: '🏢 Agent: "Très bien, nous allons trouver quelque chose rapidement. Quel est votre budget?"',
        choices: [
          { label: '"Maximum 800 euros par mois."', next: 'search_criteria', xp: 5 },
          { label: '"Ça dépend des prestations — entre 700 et 900 euros."', next: 'search_criteria', xp: 5 },
        ]
      },
      search_criteria: {
        text: 'The agent opens his database.',
        agent: '🏢 Agent: "Vous cherchez combien de pièces? Et quelle surface environ?"',
        choices: [
          { label: '"Un deux-pièces, environ 40m². Je travaille en centre-ville."', next: 'options', xp: 10 },
          { label: '"Un studio suffit — je ne suis pas souvent chez moi."', next: 'studio_option', xp: 5 },
        ]
      },
      studio_option: {
        text: 'The agent pulls up some options.',
        agent: '🏢 Agent: "J\'ai deux studios disponibles — un à Part-Dieu et un à Croix-Rousse. Le Croix-Rousse est plus charmant mais plus loin."',
        choices: [
          { label: '"Je préfère le Croix-Rousse — j\'aime le caractère des quartiers anciens."', next: 'visit_appointment', xp: 10 },
          { label: '"La Part-Dieu est plus pratique pour le travail."', next: 'visit_appointment', xp: 5 },
        ]
      },
      options: {
        text: 'He shows you photos on his screen.',
        agent: '🏢 Agent: "J\'ai un beau deux-pièces de 42m² en centre-ville — cuisine équipée, parquet, double vitrage. 780 euros charges comprises."',
        choices: [
          { label: '"Il y a un ascenseur ?"', next: 'apartment_details', xp: 5 },
          { label: '"Les charges, ça comprend quoi exactement?"', next: 'charges', xp: 10 },
        ]
      },
      apartment_details: {
        text: 'The agent checks.',
        agent: '🏢 Agent: "Oui, ascenseur et digicode. L\'appartement est au 4ème étage avec une belle vue sur les toits."',
        choices: [
          { label: '"Ça m\'intéresse. Je peux le visiter aujourd\'hui?"', next: 'visit_appointment', xp: 10 },
        ]
      },
      charges: {
        text: 'The agent explains clearly.',
        agent: '🏢 Agent: "Les charges comprennent l\'eau froide, l\'entretien des parties communes et l\'assurance de l\'immeuble. Le gaz et l\'électricité sont en plus."',
        choices: [
          { label: '"D\'accord. Je voudrais visiter cet appartement."', next: 'visit_appointment', xp: 5 },
        ]
      },
      visit_appointment: {
        text: 'The agent gets out his diary.',
        agent: '🏢 Agent: "Très bien! Je suis disponible demain à 14h ou après-demain à 10h. Vous préférez?"',
        choices: [
          { label: '"Demain à 14h, c\'est parfait."', next: 'deposit_question', xp: 5 },
          { label: '"Après-demain à 10h, je serai libre."', next: 'deposit_question', xp: 5 },
        ]
      },
      deposit_question: {
        text: 'You think ahead and ask an important question.',
        agent: '🏢 Agent: "Rendez-vous confirmé! Vous avez d\'autres questions?"',
        choices: [
          { label: '"Quel est le dépôt de garantie demandé?"', next: 'deposit_info', xp: 10 },
          { label: '"Non, à demain alors !"', next: 'end_success', xp: 5 },
        ]
      },
      deposit_info: {
        text: 'The agent explains the French rental rules.',
        agent: '🏢 Agent: "En France, le dépôt de garantie est limité à un mois de loyer hors charges pour un logement non meublé."',
        choices: [
          { label: '"Merci pour l\'information. À demain!"', next: 'end_success', xp: 5 },
        ]
      },
      end_success: {
        text: 'Vous quittez l\'agence avec un rendez-vous confirmé.',
        agent: '🏢 Agent Renard: "À demain! Bonne journée!"',
        choices: [],
        isEnd: true,
        endMessage: '🏠 Excellent! You navigated an estate agency in French with confidence — asking about amenities, charges, and deposits. Moving to Lyon is looking very promising!',
      },
    }
  },
]
