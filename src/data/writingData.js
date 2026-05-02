export const emailTemplates = [
  {
    id: 'e1',
    title: 'Formal Business Email',
    titleFr: 'Email professionnel formel',
    level: 'B1',
    register: 'Formal',
    context: 'Writing to a colleague, manager, or client you do not know well.',
    template: `Objet : [Sujet de l'email]

Madame, Monsieur,

Je me permets de vous contacter au sujet de [raison du contact].

[Corps du message — expliquez votre demande ou vos informations de manière claire et concise.]

Je reste à votre disposition pour tout renseignement complémentaire.

Dans l'attente de votre réponse, veuillez agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

[Votre prénom et nom]
[Votre poste]
[Votre coordonnées]`,
    keyPhrases: [
      { fr: "Je me permets de vous contacter…", en: "I am writing to contact you about…" },
      { fr: "Je reste à votre disposition", en: "I remain at your disposal / I'm available for further info" },
      { fr: "Dans l'attente de votre réponse", en: "Awaiting your reply" },
      { fr: "Veuillez agréer… mes salutations distinguées", en: "Please accept my distinguished regards" },
      { fr: "Tout renseignement complémentaire", en: "Any further information" },
    ],
    notes: 'The closing formula is extremely important in French formal emails. "Salutations distinguées" is standard; "Cordiales salutations" is slightly warmer.'
  },
  {
    id: 'e2',
    title: 'Job Application Email',
    titleFr: "Email de candidature",
    level: 'B2',
    register: 'Formal',
    context: 'Applying for a job or internship position.',
    template: `Objet : Candidature pour le poste de [Intitulé du poste] — [Votre nom]

Madame, Monsieur,

Actuellement [étudiant(e) en / professionnel(le) dans], je vous adresse ma candidature pour le poste de [poste] que vous proposez.

Fort(e) d'une expérience de [X ans] dans le domaine de [secteur], je suis convaincu(e) que mon profil correspond aux compétences recherchées.

[Expliquez brièvement vos compétences clés et motivations.]

Vous trouverez ci-joint mon CV ainsi qu'une lettre de motivation détaillée.

Je serais ravi(e) de pouvoir vous rencontrer lors d'un entretien à votre convenance.

Cordialement,
[Votre prénom et nom]`,
    keyPhrases: [
      { fr: "Je vous adresse ma candidature", en: "I am submitting my application" },
      { fr: "Fort(e) d'une expérience de…", en: "With … years of experience" },
      { fr: "Vous trouverez ci-joint", en: "Please find attached" },
      { fr: "À votre convenance", en: "At your convenience" },
      { fr: "Je serais ravi(e) de vous rencontrer", en: "I would be delighted to meet you" },
    ],
    notes: 'Always attach a CV (curriculum vitae) and a "lettre de motivation" (cover letter). French applications are very formal.'
  },
  {
    id: 'e3',
    title: 'Informal Email to a Friend',
    titleFr: 'Email informel à un ami',
    level: 'A2',
    register: 'Informal',
    context: 'Writing to a French friend or someone you know well.',
    template: `Objet : [Sujet]

Salut [Prénom] !

J'espère que tu vas bien ! Ça fait un moment qu'on ne s'est pas parlé.

Je t'écris pour [raison — ex : te donner des nouvelles, t'inviter, te demander quelque chose].

[Corps du message — informel et naturel, tu peux utiliser des abréviations.]

En tout cas, donne-moi de tes nouvelles !

À bientôt,
[Ton prénom]`,
    keyPhrases: [
      { fr: "Salut !", en: "Hi!" },
      { fr: "J'espère que tu vas bien", en: "I hope you're doing well" },
      { fr: "Ça fait un moment", en: "It's been a while" },
      { fr: "Donne-moi de tes nouvelles", en: "Drop me a line / let me know how you are" },
      { fr: "À bientôt", en: "See you soon" },
    ],
    notes: 'In informal emails, use "tu" (not "vous"). Feel free to use "bisous" (kisses) as a sign-off with friends!'
  },
  {
    id: 'e4',
    title: 'Complaint Email',
    titleFr: 'Email de réclamation',
    level: 'B1',
    register: 'Formal',
    context: 'Complaining to a company or service provider.',
    template: `Objet : Réclamation — [Référence commande/service]

Madame, Monsieur,

Je me permets de vous adresser ce courrier afin de vous faire part de mon mécontentement concernant [problème].

En effet, le [date], j'ai [commandé / réservé / utilisé votre service], cependant [expliquez le problème].

Cette situation me cause un préjudice certain, et je vous saurais gré de bien vouloir [solution souhaitée — rembourser, réparer, remplacer].

Dans l'attente d'une réponse rapide de votre part, je reste disponible pour tout échange.

Cordialement,
[Votre nom]`,
    keyPhrases: [
      { fr: "Faire part de mon mécontentement", en: "To express my dissatisfaction" },
      { fr: "Cette situation me cause un préjudice", en: "This situation causes me harm / inconvenience" },
      { fr: "Je vous saurais gré de", en: "I would be grateful if you would…" },
      { fr: "Dans l'attente d'une réponse rapide", en: "Awaiting a prompt reply" },
      { fr: "Un courrier", en: "A letter / email (formal)" },
    ],
    notes: 'French complaint letters must be firm but very polite. Avoid emotional language — be factual and specific about dates, references, and desired outcomes.'
  },
]

export const letterTemplates = [
  {
    id: 'l1',
    title: 'Formal Letter (Lettre formelle)',
    titleFr: 'Lettre formelle',
    level: 'B2',
    register: 'Formal',
    context: 'Writing a formal letter to an institution, authority, or company.',
    template: `[Votre nom et prénom]
[Votre adresse]
[Ville, Code postal]

[Ville], le [date]

[Nom de l'organisme]
[Adresse]

Objet : [Objet de la lettre]

Madame, Monsieur,

[Paragraphe d'introduction — expliquez pourquoi vous écrivez]

[Développement — détaillez votre demande ou vos informations]

[Conclusion — ce que vous attendez en retour]

Veuillez agréer, Madame, Monsieur, l'expression de mes sentiments respectueux.

[Signature]
[Nom complet]`,
    keyPhrases: [
      { fr: "Objet :", en: "Subject / Re:" },
      { fr: "Veuillez agréer… mes sentiments respectueux", en: "Please accept my respectful regards" },
      { fr: "Je soussigné(e)", en: "I, the undersigned" },
      { fr: "Pièce jointe", en: "Attached document" },
      { fr: "Copie à", en: "CC (carbon copy to)" },
    ],
    notes: 'French formal letters always put the sender\'s address top-left, recipient top-right, and date on the right below recipient. This layout is strictly observed.'
  },
  {
    id: 'l2',
    title: 'Cover Letter (Lettre de motivation)',
    titleFr: 'Lettre de motivation',
    level: 'B2',
    register: 'Formal',
    context: 'Applying for a job, internship, or university place.',
    template: `[Votre nom]
[Votre adresse]

[Ville], le [date]

[Nom de l'entreprise / établissement]
À l'attention de [Nom du recruteur si connu]

Objet : Candidature pour le poste de [Intitulé]

Madame, Monsieur,

[Accroche — une phrase forte pour capter l'attention]

En effet, [décrivez votre parcours et vos compétences principales].

[Paragraphe sur votre motivation — pourquoi cette entreprise/école ?]

[Paragraphe sur vos atouts — ce que vous apportez].

Je souhaite vivement intégrer votre équipe et contribuer à [projet/mission]. Je serais disponible pour un entretien à votre convenance.

Dans l'attente de votre retour, je vous adresse mes cordiales salutations.

[Signature]`,
    keyPhrases: [
      { fr: "À l'attention de", en: "For the attention of" },
      { fr: "Je souhaite vivement", en: "I strongly wish to" },
      { fr: "Mon parcours", en: "My career/academic path" },
      { fr: "Mes atouts", en: "My strengths / assets" },
      { fr: "Contribuer à", en: "To contribute to" },
    ],
    notes: '"La lettre de motivation" is required for almost every job/university application in France. It should be exactly one page and show both skill AND personality.'
  },
]

export const essayStructures = [
  {
    id: 'es1',
    title: 'The Opinion Essay (La dissertation)',
    level: 'B2',
    context: 'Academic essays and DELF/DALF writing tasks.',
    structure: [
      {
        part: 'Introduction',
        label: 'Entrée en matière',
        description: 'Hook the reader, present the topic, and state your thesis (thèse).',
        phrases: [
          "De nos jours, il est indéniable que… (Nowadays, it is undeniable that…)",
          "La question de… suscite de nombreux débats. (The question of… sparks many debates.)",
          "Nous verrons dans quelle mesure… (We will see to what extent…)",
        ]
      },
      {
        part: 'Argument 1',
        label: 'Premier argument',
        description: 'Your strongest supporting argument with evidence.',
        phrases: [
          "Tout d'abord, il convient de souligner que… (First of all, it is worth noting that…)",
          "En effet,… (Indeed,…)",
          "Par exemple,… (For example,…)",
        ]
      },
      {
        part: 'Argument 2',
        label: 'Deuxième argument',
        description: 'A second point that builds on your argument.',
        phrases: [
          "De plus, on peut observer que… (Furthermore, one can observe that…)",
          "Il est également vrai que… (It is also true that…)",
          "À cet égard,… (In this regard,…)",
        ]
      },
      {
        part: 'Counter-argument',
        label: 'Nuance / contre-argument',
        description: 'Acknowledge the opposing view before refuting it.',
        phrases: [
          "Certes, certains affirment que… (Admittedly, some argue that…)",
          "Toutefois, on peut réfuter cet argument en disant que… (However, this can be refuted by saying…)",
          "Malgré cela,… (Despite this,…)",
        ]
      },
      {
        part: 'Conclusion',
        label: 'Conclusion',
        description: 'Summarise your argument and open to a broader question.',
        phrases: [
          "En conclusion, nous avons vu que… (In conclusion, we have seen that…)",
          "En définitive,… (Ultimately,…)",
          "Il serait intéressant de se demander si… (It would be interesting to ask whether…)",
        ]
      },
    ]
  },
  {
    id: 'es2',
    title: 'For & Against Essay (Pour et contre)',
    level: 'B1',
    context: 'Balanced essays presenting both sides of an argument.',
    structure: [
      {
        part: 'Introduction',
        label: 'Introduction',
        description: 'Present the topic and say you will examine both sides.',
        phrases: [
          "Le sujet de… est très controversé. (The subject of… is highly controversial.)",
          "Nous allons examiner les avantages et les inconvénients de… (We will examine the pros and cons of…)",
        ]
      },
      {
        part: 'For (Avantages)',
        label: 'Arguments pour',
        description: 'Arguments in favour.',
        phrases: [
          "D'un côté,… (On one hand,…)",
          "L'un des principaux avantages est que… (One of the main advantages is that…)",
          "Sans oublier que… (Not forgetting that…)",
        ]
      },
      {
        part: 'Against (Inconvénients)',
        label: 'Arguments contre',
        description: 'Arguments against.',
        phrases: [
          "D'un autre côté,… (On the other hand,…)",
          "En revanche,… (However / In contrast,…)",
          "Il ne faut pas négliger que… (We must not overlook that…)",
        ]
      },
      {
        part: 'Conclusion',
        label: 'Bilan',
        description: 'Give your personal balanced verdict.',
        phrases: [
          "En pesant le pour et le contre,… (Weighing up the pros and cons,…)",
          "Tout bien considéré,… (All things considered,…)",
          "Mon opinion personnelle est que… (My personal opinion is that…)",
        ]
      },
    ]
  },
]

export const usefulConnectors = [
  { category: 'Adding ideas', fr: 'De plus / En outre / Également', en: 'Furthermore / Moreover / Also' },
  { category: 'Contrasting', fr: 'Cependant / Toutefois / En revanche', en: 'However / Nevertheless / On the other hand' },
  { category: 'Giving examples', fr: 'Par exemple / C\'est-à-dire / Tel que', en: 'For example / That is to say / Such as' },
  { category: 'Cause & effect', fr: 'Donc / Ainsi / Par conséquent', en: 'So / Thus / Therefore' },
  { category: 'Concession', fr: 'Certes / Il est vrai que / Malgré', en: 'Admittedly / It is true that / Despite' },
  { category: 'Concluding', fr: 'En conclusion / En définitive / Finalement', en: 'In conclusion / Ultimately / Finally' },
  { category: 'Sequencing', fr: 'D\'abord / Ensuite / Enfin', en: 'First / Then / Finally' },
  { category: 'Emphasising', fr: 'Surtout / En particulier / Notamment', en: 'Above all / In particular / Notably' },
]
