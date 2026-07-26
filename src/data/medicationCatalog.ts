export interface DentalMedication {
  id: string;
  name: string;
  genericName: string;
  category: 'Antibiotique' | 'Antalgique / AINS' | 'Bain de bouche / Antiseptique' | 'Corticoïde' | 'Antifongique' | 'Hémostatique' | 'Autre';
  defaultForm: string; // e.g., 'Comprimés 1g', 'Gélules 500mg', 'Flacon 200ml'
  defaultDosage: string; // e.g., '1 comprimé matin et soir'
  defaultDuration: string; // e.g., '6 jours'
  defaultInstructions: string; // e.g., 'Au milieu des repas avec un grand verre d'eau'
  isPenicillin?: boolean;
  isNSAID?: boolean;
  warnings?: string;
}

export interface PrescriptionPreset {
  id: string;
  title: string;
  description: string;
  category: string;
  medications: {
    name: string;
    form: string;
    dosage: string;
    duration: string;
    instructions: string;
  }[];
}

export const fontDentalMedications: DentalMedication[] = [
  // ANTIBIOTIQUES
  {
    id: 'med-1',
    name: 'Amoxicilline 1g',
    genericName: 'Amoxicilline',
    category: 'Antibiotique',
    defaultForm: 'Comprimés dispersibles 1000mg',
    defaultDosage: '1 comprimé matin et soir (2g/jour)',
    defaultDuration: '6 jours',
    defaultInstructions: 'À prendre au début des repas. Respecter la durée du traitement.',
    isPenicillin: true,
    warnings: 'Contre-indiqué en cas d\'allergie connue aux Pénicillines / Bêta-lactamines.',
  },
  {
    id: 'med-2',
    name: 'Augmentin 1g (Amoxicilline / Acide Clavulanique)',
    genericName: 'Amoxicilline + Acide Clavulanique',
    category: 'Antibiotique',
    defaultForm: 'Sachets-doses 1000mg/125mg',
    defaultDosage: '1 sachet matin et soir',
    defaultDuration: '6 à 7 jours',
    defaultInstructions: 'Dissoudre dans un demi-verre d\'eau au cours des repas.',
    isPenicillin: true,
    warnings: 'Attention si antécédent d\'ictère ou d\'atteinte hépatique sous Augmentin.',
  },
  {
    id: 'med-3',
    name: 'Birodogyl (Spiramycine + Métronidazole)',
    genericName: 'Spiramycine 1.5 M UI + Métronidazole 250mg',
    category: 'Antibiotique',
    defaultForm: 'Comprimés pelliculés',
    defaultDosage: '1 comprimé 2 à 3 fois par jour',
    defaultDuration: '6 à 10 jours',
    defaultInstructions: 'Prendre pendant les repas. Éviter toute consommation d\'alcool (effet antabuse).',
    warnings: 'Aviser le patient d\'éviter absolument les boissons alcoolisées durant le traitement.',
  },
  {
    id: 'med-4',
    name: 'Clindamycine 300mg (Dalacine)',
    genericName: 'Clindamycine',
    category: 'Antibiotique',
    defaultForm: 'Gélules 300mg',
    defaultDosage: '1 gélule 3 à 4 fois par jour (1200mg/j)',
    defaultDuration: '6 jours',
    defaultInstructions: 'Avaler avec un grand verre d\'eau sans s\'allonger immédiatement.',
    warnings: 'Alternative de choix en cas d\'ALLERGIE À LA PÉNICILLINE.',
  },
  {
    id: 'med-5',
    name: 'Azithromycine 500mg',
    genericName: 'Azithromycine',
    category: 'Antibiotique',
    defaultForm: 'Comprimés pelliculés 500mg',
    defaultDosage: '1 comprimé par jour (500mg/j)',
    defaultDuration: '3 jours',
    defaultInstructions: 'Prise unique quotidienne au même moment de la journée.',
  },

  // ANTALGIQUES ET ANTI-INFLAMMATOIRES
  {
    id: 'med-6',
    name: 'Doliprane 1g (Paracétamol)',
    genericName: 'Paracétamol',
    category: 'Antalgique / AINS',
    defaultForm: 'Comprimés ou gélules 1000mg',
    defaultDosage: '1 comprimé toutes les 6 heures en cas de douleur (max 4g/jour)',
    defaultDuration: '4 à 5 jours',
    defaultInstructions: 'Espacer les prises d\'au moins 4 heures.',
  },
  {
    id: 'med-7',
    name: 'Bi-Profenid 150mg (Kétoprofène)',
    genericName: 'Kétoprofène',
    category: 'Antalgique / AINS',
    defaultForm: 'Comprimés sécables à libération prolongée 150mg',
    defaultDosage: '1 comprimé matin et soir au cours du repas',
    defaultDuration: '4 à 5 jours',
    defaultInstructions: 'Prendre impérativement au milieu du repas avec un grand verre d\'eau.',
    isNSAID: true,
    warnings: 'Contre-indiqué en cas d\'ulcère gastrique, d\'insuffisance rénale ou d\'allergie aux AINS.',
  },
  {
    id: 'med-8',
    name: 'Ibuprofène 400mg (Advile / Antadys)',
    genericName: 'Ibuprofène',
    category: 'Antalgique / AINS',
    defaultForm: 'Comprimés enrobés 400mg',
    defaultDosage: '1 comprimé 3 fois par jour si besoin',
    defaultDuration: '3 à 5 jours',
    defaultInstructions: 'Prendre avec de la nourriture.',
    isNSAID: true,
  },
  {
    id: 'med-9',
    name: 'Zaldiar (Tramadol 37.5mg / Paracétamol 325mg)',
    genericName: 'Tramadol / Paracétamol',
    category: 'Antalgique / AINS',
    defaultForm: 'Comprimés pelliculés',
    defaultDosage: '1 à 2 comprimés si douleur intense (max 8/jour)',
    defaultDuration: '3 jours',
    defaultInstructions: 'Réservé aux douleurs modérées à intenses résistant au paracétamol seul.',
    warnings: 'Peut provoquer somnolence ou vertiges.',
  },
  {
    id: 'med-10',
    name: 'Solupred 20mg (Prednisolone)',
    genericName: 'Prednisolone',
    category: 'Corticoïde',
    defaultForm: 'Comprimés orodispersibles 20mg',
    defaultDosage: '1 mg/kg/jour le matin au petit-déjeuner',
    defaultDuration: '3 jours',
    defaultInstructions: 'Prise unique le matin pour éviter la survenue d\'insomnie.',
  },

  // BAINS DE BOUCHE ET SOINS LOCAUX
  {
    id: 'med-11',
    name: 'Eludril Pro (Chlorhexidine + Chlorobutanol)',
    genericName: 'Chlorhexidine 0.10%',
    category: 'Bain de bouche / Antiseptique',
    defaultForm: 'Flacon 200ml',
    defaultDosage: '15ml pur ou dilué dans le gobelet doseur 2 à 3 fois par jour',
    defaultDuration: '7 à 10 jours',
    defaultInstructions: 'Bain de bouche pendant 1 minute après le brossage des dents. Ne pas avaler.',
  },
  {
    id: 'med-12',
    name: 'Paroex 0.12% (Chlorhexidine sans alcool)',
    genericName: 'Chlorhexidine 0.12%',
    category: 'Bain de bouche / Antiseptique',
    defaultForm: 'Flacon 500ml',
    defaultDosage: '10ml à 15ml 2 fois par jour',
    defaultDuration: '10 à 14 jours',
    defaultInstructions: 'Rincer la bouche pendant 30 secondes après le brossage du soir.',
  },
  {
    id: 'med-13',
    name: 'Hyalugel Gel Buccal (Acide Hyaluronique)',
    genericName: 'Acide Hyaluronique 0.2%',
    category: 'Bain de bouche / Antiseptique',
    defaultForm: 'Tube gel 20ml',
    defaultDosage: 'Application locale 3 à 4 fois par jour',
    defaultDuration: '7 jours',
    defaultInstructions: 'Masser délicatement les gencives lésées ou le site d\'extraction après brossage.',
  },
  {
    id: 'med-14',
    name: 'Daktarin Gel Buccal (Miconazole)',
    genericName: 'Miconazole',
    category: 'Antifongique',
    defaultForm: 'Tube gel buccal 40g',
    defaultDosage: '1 cuillère-mesure 4 fois par jour',
    defaultDuration: '7 à 14 jours',
    defaultInstructions: 'Garder le gel en bouche le plus longtemps possible avant de l\'avaler.',
    warnings: 'Indiqué en cas de candidose buccale ou stomatite sous prothèse.',
  },
  {
    id: 'med-15',
    name: 'Exacyl 500mg (Acide Tranexamique)',
    genericName: 'Acide Tranexamique',
    category: 'Hémostatique',
    defaultForm: 'Ampoules buvables 500mg/5ml',
    defaultDosage: '1 ampoule en bain de bouche local 3 fois par jour',
    defaultDuration: '2 à 3 jours',
    defaultInstructions: 'Conserver en bouche 2 minutes au niveau du site hémorragique puis recracher.',
  },
];

export const DENTAL_PRESCRIPTION_PRESETS: PrescriptionPreset[] = [
  {
    id: 'preset-1',
    title: ' Extraction Dentaire Simple / Soin invasif',
    description: 'Antalgique de niveau 1 + Bain de bouche antiseptique doux.',
    category: 'Extraction & Chirurgie',
    medications: [
      {
        name: 'Doliprane 1g (Paracétamol)',
        form: 'Comprimés 1000mg',
        dosage: '1 comprimé toutes les 6h si douleur',
        duration: '4 jours',
        instructions: 'Espacer d\'au moins 4h entre les prises. Ne pas dépasser 4g/jour.',
      },
      {
        name: 'Eludril Pro (Chlorhexidine)',
        form: 'Flacon 200ml',
        dosage: '15ml en bain de bouche 2 fois par jour',
        duration: '7 jours',
        instructions: 'Réaliser le bain de bouche à distance du brossage dentaire.',
      },
    ],
  },
  {
    id: 'preset-2',
    title: '🚨 Extraction Complexe / Sagesse / Implantologie',
    description: 'Couverture antibiotique + AINS anti-œdème + Antalgique + Bain de bouche.',
    category: 'Extraction & Chirurgie',
    medications: [
      {
        name: 'Amoxicilline 1g',
        form: 'Comprimés dispersibles 1000mg',
        dosage: '1 comprimé matin et soir',
        duration: '6 jours',
        instructions: 'À prendre au début des repas. Ne pas interrompre.',
      },
      {
        name: 'Bi-Profenid 150mg (Kétoprofène)',
        form: 'Comprimés 150mg',
        dosage: '1 comprimé matin et soir',
        duration: '4 jours',
        instructions: 'Prendre impérativement au milieu du repas.',
      },
      {
        name: 'Doliprane 1g (Paracétamol)',
        form: 'Comprimés 1000mg',
        dosage: '1 comprimé si douleur résiduelle',
        duration: '4 jours',
        instructions: 'En complément du Bi-Profenid si besoin.',
      },
      {
        name: 'Paroex 0.12%',
        form: 'Flacon 500ml',
        dosage: '10ml en bain de bouche 2 fois/jour',
        duration: '7 jours',
        instructions: 'Rincer la bouche délicatement sans cracher trop fort.',
      },
    ],
  },
  {
    id: 'preset-3',
    title: '🦷 Abscès Dentaire / Infection Périapicale Aiguë',
    description: 'Antibiotique à large spectre + Antalgique puissant.',
    category: 'Infections & Abscès',
    medications: [
      {
        name: 'Augmentin 1g (Amoxicilline/Acide Clavulanique)',
        form: 'Sachets-doses 1000mg',
        dosage: '1 sachet matin et soir',
        duration: '7 jours',
        instructions: 'Dissoudre dans l\'eau au début du repas.',
      },
      {
        name: 'Doliprane 1g (Paracétamol)',
        form: 'Comprimés 1000mg',
        dosage: '1 comprimé toutes les 6 heures',
        duration: '5 jours',
        instructions: 'Ne pas dépasser 4 comprimés par 24h.',
      },
    ],
  },
  {
    id: 'preset-4',
    title: '⚠️ Allergie Pénicilline — Infection / Extraction',
    description: 'Alternative par Clindamycine 300mg/600mg (sans pénicilline) + Paracétamol.',
    category: 'Sécurité & Allergies',
    medications: [
      {
        name: 'Clindamycine 300mg (Dalacine)',
        form: 'Gélules 300mg',
        dosage: '2 gélules matin et soir (1200mg/jour)',
        duration: '6 jours',
        instructions: 'Avaler avec un grand verre d\'eau.',
      },
      {
        name: 'Doliprane 1g (Paracétamol)',
        form: 'Comprimés 1000mg',
        dosage: '1 comprimé toutes les 6h',
        duration: '5 jours',
        instructions: 'Espacer les prises.',
      },
    ],
  },
  {
    id: 'preset-5',
    title: '🩸 Parodontite / Gingivite Ulcéronécrotique Aiguë',
    description: 'Birodogyl (Spiramycine + Métronidazole) + Gel Hyalugel + Bain de bouche.',
    category: 'Parodontologie',
    medications: [
      {
        name: 'Birodogyl (Spiramycine + Métronidazole)',
        form: 'Comprimés pelliculés',
        dosage: '1 comprimé 3 fois par jour',
        duration: '7 jours',
        instructions: 'Au milieu des repas. Éviter l\'alcool.',
      },
      {
        name: 'Hyalugel Gel Buccal',
        form: 'Tube 20ml',
        dosage: '3 applications par jour sur les gencives',
        duration: '10 jours',
        instructions: 'Masser doucement les gencives nettoyées.',
      },
      {
        name: 'Paroex 0.12%',
        form: 'Flacon 500ml',
        dosage: '10ml 2 fois par jour',
        duration: '10 jours',
        instructions: 'Bain de bouche après brossage.',
      },
    ],
  },
];
