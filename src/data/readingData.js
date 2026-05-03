export const readingPassages = [
  {
    id: 'r1',
    level: 'A1',
    title: 'Ma Famille',
    englishTitle: 'My Family',
    text: `Je m'appelle Sophie. J'ai vingt-cinq ans. J'habite à Paris avec ma famille.

Ma famille est petite. J'ai un père, une mère et un frère. Mon père s'appelle Jean. Il est médecin. Ma mère s'appelle Marie. Elle est professeure. Mon frère s'appelle Paul. Il a dix-huit ans.

Nous avons aussi un chien. Il s'appelle Médor. Il est petit et marron.

J'aime ma famille!`,
    questions: [
      { q: 'What is the narrator\'s name?', options: ['Marie', 'Sophie', 'Paul', 'Jean'], answer: 1 },
      { q: 'How old is the narrator?', options: ['18', '21', '25', '30'], answer: 2 },
      { q: 'What does the father do?', options: ['Teacher', 'Doctor', 'Engineer', 'Chef'], answer: 1 },
      { q: 'What is the dog\'s name?', options: ['Fido', 'Rex', 'Médor', 'Bruno'], answer: 2 },
      { q: 'How many siblings does Sophie have?', options: ['None', 'One brother', 'One sister', 'Two brothers'], answer: 1 },
    ],
    vocab: [
      { word: 'la famille', def: 'the family' },
      { word: 'le père', def: 'the father' },
      { word: 'la mère', def: 'the mother' },
      { word: 'le frère', def: 'the brother' },
    ]
  },
  {
    id: 'r2',
    level: 'A2',
    title: 'Le Café Parisien',
    englishTitle: 'The Parisian Café',
    text: `À Paris, les cafés sont partout. Ils font partie de la vie quotidienne des Parisiens.

Le matin, les gens s'arrêtent au café pour prendre un express ou un crème. Beaucoup mangent aussi un croissant ou une tartine beurrée. Les cafés ouvrent tôt — souvent à sept heures du matin.

À midi, le café devient un restaurant. On peut manger un plat du jour, souvent une viande avec des légumes ou un plat de pâtes. Le service est rapide parce que les gens ont seulement une heure pour manger.

Le soir, c'est différent. Les gens restent plus longtemps. Ils boivent un verre de vin ou une bière et parlent avec leurs amis. Les terrasses sont très populaires en été.

Le café est un lieu social important en France.`,
    questions: [
      { q: 'When do cafés typically open?', options: ['6am', '7am', '8am', '9am'], answer: 1 },
      { q: 'What do people typically eat in the morning?', options: ['Sandwich', 'Croissant or buttered bread', 'Omelette', 'Salad'], answer: 1 },
      { q: 'What happens at the café at noon?', options: ['It closes', 'It becomes a restaurant', 'Only drinks are served', 'It gets very quiet'], answer: 1 },
      { q: 'What do people drink in the evening?', options: ['Coffee', 'Tea', 'Wine or beer', 'Water only'], answer: 2 },
      { q: 'What are popular in summer?', options: ['Indoor tables', 'Terraces (outdoor seating)', 'Private rooms', 'Rooftop bars'], answer: 1 },
    ],
    vocab: [
      { word: 'quotidien(ne)', def: 'daily / everyday' },
      { word: 'tôt', def: 'early' },
      { word: 'le plat du jour', def: 'dish of the day' },
      { word: 'la terrasse', def: 'outdoor seating area' },
    ]
  },
  {
    id: 'r3',
    level: 'A1',
    title: 'À la Boulangerie',
    englishTitle: 'At the Bakery',
    text: `Chaque matin, Marc va à la boulangerie. La boulangerie s'appelle "Chez Dupont". Elle est dans la rue principale.

Marc aime le pain. Il achète une baguette tous les jours. Parfois, il achète aussi des croissants pour le petit-déjeuner.

La boulangère s'appelle Madame Dupont. Elle est sympathique et souriante. Elle connaît bien Marc.

— Bonjour Marc! La baguette habituelle ?
— Oui, s'il vous plaît, et deux croissants aussi.
— Voilà! Ça fait deux euros cinquante.
— Merci, bonne journée !

Marc rentre chez lui. Il mange son croissant avec du café. Délicieux !`,
    questions: [
      { q: 'Where does Marc go every morning?', options: ['Supermarket', 'Bakery', 'School', 'Office'], answer: 1 },
      { q: 'What does Marc buy every day?', options: ['Croissants', 'Cake', 'Baguette', 'Bread rolls'], answer: 2 },
      { q: 'How much does the order cost?', options: ['€1.50', '€2.00', '€2.50', '€3.00'], answer: 2 },
      { q: 'What does Marc eat at home?', options: ['Baguette with butter', 'Croissant with coffee', 'Cake with tea', 'Nothing'], answer: 1 },
      { q: 'How is Madame Dupont described?', options: ['Strict and serious', 'Friendly and smiling', 'Tired', 'New to the job'], answer: 1 },
    ],
    vocab: [
      { word: 'la boulangerie', def: 'bakery' },
      { word: 'la baguette', def: 'French bread stick' },
      { word: 'le petit-déjeuner', def: 'breakfast' },
      { word: 'sympathique', def: 'friendly / nice' },
    ]
  },
  {
    id: 'r4',
    level: 'A2',
    title: 'Une Journée à Lyon',
    englishTitle: 'A Day in Lyon',
    text: `Lyon est la deuxième grande ville de France. Elle se trouve au confluent du Rhône et de la Saône, dans le sud-est du pays. Lyon est célèbre pour sa gastronomie, son architecture et son festival des Lumières.

Emma visite Lyon pour la première fois. Elle arrive tôt le matin à la gare de la Part-Dieu. Elle prend le métro jusqu'au Vieux-Lyon, le quartier historique.

Dans les petites rues pavées, elle découvre des "traboules" — des passages secrets qui traversent les immeubles depuis le Moyen Âge. C'est fascinant!

À midi, elle mange dans un "bouchon lyonnais" — les restaurants traditionnels de Lyon. Elle commande une quenelle de brochet et un verre de beaujolais. C'est son premier repas typiquement lyonnais.

L'après-midi, elle monte la colline de Fourvière pour visiter la basilique. La vue sur la ville est magnifique.

Le soir, Emma rentre à son hôtel, fatiguée mais ravie. Elle a adoré Lyon.`,
    questions: [
      { q: 'What two rivers meet at Lyon?', options: ['Seine and Loire', 'Rhône and Saône', 'Garonne and Dordogne', 'Rhine and Moselle'], answer: 1 },
      { q: 'What are "traboules"?', options: ['Traditional dishes', 'Old churches', 'Secret passages through buildings', 'Market stalls'], answer: 2 },
      { q: 'What is a "bouchon lyonnais"?', options: ['A wine cork', 'A traditional Lyon restaurant', 'A type of bread', 'A street festival'], answer: 1 },
      { q: 'What does Emma order for lunch?', options: ['Steak and red wine', 'Quenelle and beaujolais', 'Soup and baguette', 'Salad and water'], answer: 1 },
      { q: 'Where does Emma go in the afternoon?', options: ['The Roman ruins', 'The Fourvière basilica on the hill', 'A shopping centre', 'The river banks'], answer: 1 },
    ],
    vocab: [
      { word: 'le confluent', def: 'the confluence (where two rivers meet)' },
      { word: 'une traboule', def: 'a secret passage through a Lyonnais building' },
      { word: 'une quenelle', def: 'a Lyonnais dumpling (fish or meat)' },
      { word: 'la basilique', def: 'basilica (a type of church)' },
      { word: 'ravi(e)', def: 'delighted / thrilled' },
    ]
  },
  {
    id: 'r5',
    level: 'A2',
    title: 'Les Vacances de Lucie',
    englishTitle: 'Lucie\'s Holiday',
    text: `Pendant les grandes vacances, Lucie est allée en Bretagne avec ses parents. La Bretagne est une région au nord-ouest de la France, connue pour ses côtes sauvages, ses crêpes et sa culture celtique.

Ils ont loué une petite maison près de la mer pendant deux semaines. Chaque matin, Lucie se levait tôt et allait se promener sur la plage. Elle ramassait des coquillages et regardait les bateaux de pêche.

Un jour, ils ont visité le marché du village. Il y avait des étals de fruits de mer, de fromages locaux et de galettes bretonnes. Lucie a mangé une galette complète — une crêpe de sarrasin avec du jambon, du fromage et un œuf. C'était délicieux!

Le week-end, la famille a fait une randonnée sur les falaises. La vue sur l'Atlantique était impressionnante.

À la fin des vacances, Lucie était triste de rentrer chez elle. Elle avait adoré la Bretagne — l'air frais, la mer, et surtout les crêpes!`,
    questions: [
      { q: 'Where did Lucie go on holiday?', options: ['Normandy', 'Brittany', 'Provence', 'The Alps'], answer: 1 },
      { q: 'What did Lucie do each morning?', options: ['Went swimming', 'Walked on the beach', 'Visited museums', 'Went cycling'], answer: 1 },
      { q: 'What is a "galette complète"?', options: ['A sweet dessert crêpe', 'A buckwheat crêpe with ham, cheese and egg', 'A cheese platter', 'A type of pastry'], answer: 1 },
      { q: 'What did the family do at the weekend?', options: ['Went to a restaurant', 'Hiked on the cliffs', 'Visited a château', 'Went to the cinema'], answer: 1 },
      { q: 'How did Lucie feel at the end of the holiday?', options: ['Relieved', 'Bored', 'Sad to leave', 'Excited to go home'], answer: 2 },
    ],
    vocab: [
      { word: 'les grandes vacances', def: 'the summer holidays' },
      { word: 'un coquillage', def: 'a seashell' },
      { word: 'une galette de sarrasin', def: 'a buckwheat crêpe (savoury)' },
      { word: 'une falaise', def: 'a cliff' },
      { word: 'une randonnée', def: 'a hike / walk' },
    ]
  },
  {
    id: 'r6',
    level: 'B1',
    title: 'Le Système Éducatif Français',
    englishTitle: 'The French Education System',
    text: `Le système éducatif français est l'un des plus centralisés d'Europe. Géré principalement par l'État, il se distingue par un programme national uniforme appliqué dans toutes les écoles publiques du pays, qu'on soit à Paris ou dans un village de montagne.

La scolarité obligatoire commence à trois ans avec l'école maternelle et se poursuit jusqu'à seize ans. Elle se divise en plusieurs cycles : l'école primaire (de six à onze ans), le collège (de onze à quinze ans) et le lycée (de quinze à dix-huit ans).

À la fin du lycée, les élèves passent le baccalauréat — ou "le bac" — un examen national qui détermine l'accès à l'enseignement supérieur. Il existe plusieurs filières : générale, technologique ou professionnelle, chacune menant à des parcours différents.

L'enseignement supérieur français est original à plusieurs titres. En dehors des universités publiques, qui pratiquent des frais d'inscription très faibles, il existe les "grandes écoles" — des établissements d'élite très sélectifs comme l'École Polytechnique ou HEC — qui forment les cadres des grandes entreprises et de l'État.

Ce système est souvent critiqué pour son caractère élitiste et sa rigidité, mais ses défenseurs soulignent l'égalité d'accès à une éducation de qualité pour tous les citoyens.`,
    questions: [
      { q: 'When does compulsory schooling begin in France?', options: ['Age 4', 'Age 3', 'Age 5', 'Age 6'], answer: 1 },
      { q: 'What is "le bac"?', options: ['A type of school', 'A national exam at end of high school', 'A university entrance test', 'A vocational certificate'], answer: 1 },
      { q: 'What makes the French education system distinctive?', options: ['Private schools', 'A uniform national curriculum', 'Decentralisation', 'No exams'], answer: 1 },
      { q: 'What are "grandes écoles"?', options: ['Public universities', 'Primary schools', 'Selective elite institutions', 'International schools'], answer: 2 },
      { q: 'What is a common criticism of the French system?', options: ['Lack of structure', 'Elitism and rigidity', 'Too much sport', 'Poor maths teaching'], answer: 1 },
    ],
    vocab: [
      { word: 'le baccalauréat (le bac)', def: 'the French high school leaving exam' },
      { word: 'une grande école', def: 'a selective elite French higher education institution' },
      { word: 'une filière', def: 'a track / strand / pathway' },
      { word: 'les frais d\'inscription', def: 'enrolment / tuition fees' },
      { word: 'centralisé(e)', def: 'centralised' },
    ]
  },
  {
    id: 'r7',
    level: 'B1',
    title: 'L\'Intelligence Artificielle',
    englishTitle: 'Artificial Intelligence',
    text: `L'intelligence artificielle (IA) transforme notre société à une vitesse impressionnante. Des assistants vocaux aux voitures autonomes, les applications sont nombreuses et variées.

Dans le domaine médical, l'IA aide les médecins à diagnostiquer les maladies plus rapidement et avec plus de précision. Des algorithmes analysent des milliers d'images médicales pour détecter des anomalies que l'œil humain pourrait manquer.

Cependant, l'IA soulève également des questions éthiques importantes. Qui est responsable lorsqu'une décision automatisée cause du tort ? Comment protéger la vie privée des individus dont les données sont utilisées pour entraîner ces systèmes ?

Les experts s'accordent sur un point : l'IA ne remplacera pas entièrement les humains, mais elle changera profondément la nature du travail. Les emplois qui nécessitent de la créativité, de l'empathie et du jugement humain seront moins affectés que les tâches répétitives.

En fin de compte, c'est à nous — les citoyens, les législateurs et les entreprises — de façonner l'avenir de cette technologie de manière responsable.`,
    questions: [
      { q: 'In the medical field, what does AI help with?', options: ['Surgery', 'Diagnosing diseases more quickly', 'Prescribing medicine', 'Patient reception'], answer: 1 },
      { q: 'What ethical concern is mentioned?', options: ['AI being too expensive', 'Responsibility for automated decisions', 'AI replacing all jobs', 'Loss of internet access'], answer: 1 },
      { q: 'Which jobs will be LEAST affected by AI?', options: ['Repetitive tasks', 'Data entry', 'Creative and empathy-requiring roles', 'Manufacturing'], answer: 2 },
      { q: 'According to experts, what will AI do to work?', options: ['Replace humans entirely', 'Have no impact', 'Change the nature of work profoundly', 'Only affect science jobs'], answer: 2 },
      { q: 'Who should shape AI\'s future, according to the author?', options: ['Only scientists', 'Only governments', 'Citizens, legislators and companies', 'AI itself'], answer: 2 },
    ],
    vocab: [
      { word: 'l\'intelligence artificielle', def: 'artificial intelligence' },
      { word: 'diagnostiquer', def: 'to diagnose' },
      { word: 'soulever une question', def: 'to raise a question' },
      { word: 'la vie privée', def: 'privacy' },
      { word: 'façonner', def: 'to shape' },
    ]
  },
  {
    id: 'r8',
    level: 'B2',
    title: 'Le Changement Climatique',
    englishTitle: 'Climate Change',
    text: `Le changement climatique représente l'un des défis les plus complexes auxquels l'humanité ait jamais été confrontée. La communauté scientifique s'accorde aujourd'hui sur un consensus clair : les activités humaines, notamment la combustion des énergies fossiles et la déforestation, sont les principales causes du réchauffement planétaire observé depuis le XIXe siècle.

Les conséquences se font déjà sentir à l'échelle mondiale : élévation du niveau des mers, multiplication des événements climatiques extrêmes, perturbation des écosystèmes et menace sur la biodiversité. Ces transformations ne touchent pas uniformément les populations ; les régions les plus vulnérables, souvent les moins responsables historiquement des émissions, sont paradoxalement les premières à subir les effets les plus graves.

Face à ce constat, deux types de réponses s'imposent : l'atténuation, qui vise à réduire les émissions de gaz à effet de serre, et l'adaptation, qui cherche à préparer les sociétés aux changements inévitables. Ces deux approches nécessitent une coopération internationale sans précédent, mettant à l'épreuve les institutions mondiales et la volonté politique des États.

L'accord de Paris de 2015 constitue une avancée symbolique significative, mais les engagements pris restent insuffisants au regard des objectifs climatiques. La question fondamentale demeure : sommes-nous collectivement capables de transformer nos économies et nos modes de vie avant d'atteindre des seuils de non-retour ?`,
    questions: [
      { q: 'What does the scientific community agree on?', options: ['Climate change is not real', 'Human activities are the main cause', 'Nature is the main cause', 'The problem is exaggerated'], answer: 1 },
      { q: 'Which regions are paradoxically most affected?', options: ['The most industrialised', 'The most responsible for emissions', 'The most vulnerable, least responsible', 'Cold northern regions'], answer: 2 },
      { q: '"Atténuation" refers to:', options: ['Adapting to change', 'Reducing greenhouse gas emissions', 'Measuring temperature', 'Protecting coastal areas'], answer: 1 },
      { q: 'What does the author say about the Paris Agreement?', options: ['It is sufficient', 'It is symbolic but commitments are insufficient', 'It was rejected', 'It solved the problem'], answer: 1 },
      { q: 'What is the fundamental question at the end?', options: ['When was climate change first measured?', 'Whether we can transform before reaching tipping points', 'Who signed the Paris Agreement', 'How much adaptation will cost'], answer: 1 },
    ],
    vocab: [
      { word: 'le réchauffement planétaire', def: 'global warming' },
      { word: 'la déforestation', def: 'deforestation' },
      { word: 'l\'atténuation', def: 'mitigation / attenuation' },
      { word: 'les gaz à effet de serre', def: 'greenhouse gases' },
      { word: 'un seuil de non-retour', def: 'a tipping point / point of no return' },
    ]
  },
  {
    id: 'r9',
    level: 'B2',
    title: 'La Gastronomie Française: Patrimoine et Identité',
    englishTitle: 'French Gastronomy: Heritage and Identity',
    text: `En 2010, l'UNESCO a inscrit le repas gastronomique des Français au patrimoine culturel immatériel de l'humanité — une distinction unique qui reflète l'importance de la cuisine dans la culture et l'identité française.

Mais qu'est-ce qui distingue la gastronomie française de la simple cuisine ? Il ne s'agit pas uniquement des plats eux-mêmes — quoique leur diversité soit remarquable, des truffes du Périgord aux huîtres de Marennes — mais d'une manière d'être à table. Le repas français est un rituel social qui structure le temps : l'apéritif, l'entrée, le plat principal, le fromage, le dessert, le café. Chaque étape a son rôle, son rythme, ses conventions.

Cette culture culinaire repose sur des principes fondamentaux : le respect des saisons et des producteurs locaux, l'art de l'accord mets-vins, et la transmission des savoir-faire de génération en génération. Le marché hebdomadaire, la cave à vins, le carnet de recettes familiales — autant de symboles d'une relation intime avec la nourriture.

Paradoxalement, cette tradition est sous pression. La mondialisation des habitudes alimentaires, le développement de la restauration rapide et l'accélération du rythme de vie menacent les rituels du repas. Pourtant, les enquêtes montrent que les Français restent parmi les Européens qui consacrent le plus de temps à table — en moyenne, plus de deux heures par jour.

La gastronomie française n'est donc pas seulement une question de goût, mais de civilisation.`,
    questions: [
      { q: 'When was the French gastronomic meal inscribed by UNESCO?', options: ['2000', '2005', '2010', '2015'], answer: 2 },
      { q: 'What is the typical order of a French meal?', options: ['Starter, main, dessert', 'Starter, main, cheese, dessert', 'Apéritif, starter, main, cheese, dessert, coffee', 'Main, starter, dessert'], answer: 2 },
      { q: 'What is "l\'accord mets-vins"?', options: ['A food safety law', 'Matching food with wine', 'A cooking technique', 'A regional recipe book'], answer: 1 },
      { q: 'What pressures threaten French culinary culture?', options: ['Lack of ingredients', 'Globalisation, fast food, and faster pace of life', 'Government regulations', 'Too many restaurants'], answer: 1 },
      { q: 'How much time do the French spend at the table daily on average?', options: ['30 minutes', '1 hour', 'More than 2 hours', '3 hours'], answer: 2 },
    ],
    vocab: [
      { word: 'le patrimoine immatériel', def: 'intangible heritage' },
      { word: 'une truffe', def: 'a truffle (luxury mushroom)' },
      { word: 'l\'accord mets-vins', def: 'food and wine pairing' },
      { word: 'le savoir-faire', def: 'know-how / expertise (handed down)' },
      { word: 'la mondialisation', def: 'globalisation' },
    ]
  },
  {
    id: 'r10',
    level: 'C1',
    title: 'La Laïcité en France',
    englishTitle: 'Secularism in France',
    text: `La laïcité est l'un des principes fondateurs de la République française. Inscrite dans la loi de 1905 sur la séparation des Églises et de l'État, et consacrée dans la Constitution de 1958, elle constitue bien plus qu'une simple règle juridique : c'est un cadre philosophique qui définit le rapport entre la sphère publique et les convictions religieuses ou spirituelles.

Dans sa conception originelle, la laïcité repose sur trois piliers : la liberté de conscience et de culte, la neutralité de l'État face aux religions, et l'égalité de traitement entre toutes les croyances. Elle n'est ni anti-religieuse ni athée — elle est simplement indifférente à la religion dans l'espace public, au nom de l'universalisme républicain.

Or, ce principe fait aujourd'hui l'objet de débats intenses. La question du port de signes religieux ostensibles dans les établissements scolaires, tranchée par la loi de 2004, ou celle du voile intégral dans l'espace public, interdite en 2010, ont ravivé des tensions profondes. Pour certains, ces lois protègent l'espace commun de toute pression communautaire; pour d'autres, elles constituent une restriction injustifiable à la liberté individuelle.

Ces controverses révèlent une tension inhérente au projet républicain français : comment concilier l'universalisme abstrait de la citoyenneté avec la diversité concrète d'une société multiculturelle ? La réponse à cette question engage non seulement des choix juridiques et politiques, mais une vision de ce que signifie "vivre ensemble" dans une démocratie.`,
    questions: [
      { q: 'When was the law on separation of Church and State passed in France?', options: ['1789', '1848', '1905', '1958'], answer: 2 },
      { q: 'What are the three pillars of laïcité?', options: ['Atheism, secularism, equality', 'Freedom of conscience, State neutrality, equal treatment', 'Education, science, freedom', 'Law, equality, fraternity'], answer: 1 },
      { q: 'What did the 2004 law address?', options: ['Religious buildings', 'Conspicuous religious symbols in schools', 'Religious holidays', 'Church funding'], answer: 1 },
      { q: 'What is the core tension revealed by these debates?', options: ['Urban vs rural values', 'Conciling abstract universalism with multicultural diversity', 'Political left vs right', 'France vs its neighbours'], answer: 1 },
      { q: 'How is laïcité described in the text?', options: ['Anti-religious', 'Atheist', 'Indifferent to religion in public space', 'Pro-Christian'], answer: 2 },
    ],
    vocab: [
      { word: 'la laïcité', def: 'secularism / the French principle of separation of religion and state' },
      { word: 'la liberté de conscience', def: 'freedom of conscience' },
      { word: 'le culte', def: 'worship / religious practice' },
      { word: 'ostensible', def: 'conspicuous / visible (used of religious signs)' },
      { word: 'le communautarisme', def: 'communitarianism (organising society around communities)' },
    ]
  },
]
