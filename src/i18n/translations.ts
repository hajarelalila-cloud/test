export interface Translation {
  // Navigation
  mainTitle: string;
  subtitle: string;
  languageToggle: string;
  
  // Main Scene
  sceneTitle: string;
  sceneDescription: string;
  massControl: string;
  addPlanet: string;
  removePlanet: string;
  timeControl: string;
  tryYourself: string;
  
  // Falling Objects Section
  fallingTitle: string;
  fallingDescription: string;
  fallingStep1: string;
  fallingStep2: string;
  fallingStep3: string;
  fallingExplanation: string;
  replay: string;
  slowMotion: string;
  
  // Knowledge Section
  knowledgeTitle: string;
  whatIsRelativity: string;
  whatIsRelativityText: string;
  howGravityWorks: string;
  howGravityWorksText: string;
  realLifeUse: string;
  realLifeUseText: string;
  funFacts: string;
  funFact1: string;
  funFact2: string;
  funFact3: string;
  
  // Interactive Elements
  earth: string;
  sun: string;
  planet: string;
  spacetime: string;
  gravity: string;
  orbit: string;
  
  // Enhanced Controls
  dragToRotate: string;
  scrollToZoom: string;
  resetView: string;
  showGrid: string;
  showTrails: string;
  showForces: string;
  
  // Advanced Physics
  massEffect: string;
  timeDialation: string;
  lightBending: string;
  gravitationalWaves: string;
  eventHorizon: string;
  
  // Detailed Explanations
  spacetimeExplanation: string;
  curvatureDetails: string;
  orbitMechanics: string;
  realWorldApplications: string;
  
  // Interactive Labels
  clickToExplore: string;
  hoverForInfo: string;
  adjustParameters: string;
  
  // Controls
  increaseMass: string;
  decreaseMass: string;
  speedUp: string;
  slowDown: string;
  pause: string;
  play: string;
  reset: string;
}

export const translations: Record<'ar' | 'fr', Translation> = {
  ar: {
    // Navigation
    mainTitle: "رحلة في النسبية العامة",
    subtitle: "اكتشف كيف تعمل الجاذبية مع ألبرت أينشتاين",
    languageToggle: "FR",
    
    // Main Scene
    sceneTitle: "الزمكان والجاذبية",
    sceneDescription: "شاهد كيف تنحني الأجرام الضخمة للزمكان وتخلق الجاذبية",
    massControl: "تحكم في الكتلة",
    addPlanet: "إضافة كوكب",
    removePlanet: "إزالة كوكب",
    timeControl: "تحكم في الزمن",
    tryYourself: "جرب بنفسك",
    
    // Falling Objects Section
    fallingTitle: "لماذا تسقط الأشياء؟",
    fallingDescription: "اكتشف السبب الحقيقي وراء سقوط الأجسام نحو الأرض",
    fallingStep1: "جسم صغير في الفضاء",
    fallingStep2: "يبدأ بالسقوط تدريجياً",
    fallingStep3: "يتبع انحناء الزمكان",
    fallingExplanation: "الأرض لا 'تجذب' الأجسام، بل كتلتها الكبيرة تجعل الزمكان ينحني والأجسام تتبع هذا الانحناء!",
    replay: "إعادة التشغيل",
    slowMotion: "حركة بطيئة",
    
    // Knowledge Section
    knowledgeTitle: "تعرف أكثر",
    whatIsRelativity: "ما هي النسبية العامة؟",
    whatIsRelativityText: "نظرية أينشتاين التي تفسر الجاذبية كانحناء في الزمكان، وليس قوة جذب تقليدية. إنها تشبه وضع كرة ثقيلة على ترامبولين مشدود.",
    howGravityWorks: "كيف تعمل الجاذبية؟",
    howGravityWorksText: "الأجسام الضخمة تنحني الزمكان حولها. الأجسام الأخرى تتحرك في خطوط مستقيمة عبر هذا الزمكان المنحني، مما يبدو لنا كجاذبية.",
    realLifeUse: "أين نستخدمها؟",
    realLifeUseText: "أقمار GPS الصناعية تحتاج لتصحيحات النسبية العامة لتعطي موقعك الدقيق. بدونها، ستخطئ بعدة كيلومترات!",
    funFacts: "حقائق ممتعة",
    funFact1: "أينشتاين طور هذه النظرية وهو يتخيل نفسه يسقط في مصعد!",
    funFact2: "الضوء ينحني أيضاً بسبب الجاذبية القوية",
    funFact3: "الزمن يمر أبطأ في الجاذبية القوية",
    
    // Interactive Elements
    earth: "الأرض",
    sun: "الشمس",
    planet: "كوكب",
    spacetime: "الزمكان",
    gravity: "الجاذبية",
    orbit: "المدار",
    
    // Enhanced Controls
    dragToRotate: "اسحب للدوران",
    scrollToZoom: "مرر للتكبير",
    resetView: "إعادة تعيين العرض",
    showGrid: "إظهار الشبكة",
    showTrails: "إظهار المسارات",
    showForces: "إظهار القوى",
    
    // Advanced Physics
    massEffect: "تأثير الكتلة على انحناء الزمكان",
    timeDialation: "تمدد الزمن في الجاذبية القوية",
    lightBending: "انحناء الضوء حول الأجسام الضخمة",
    gravitationalWaves: "الموجات الجاذبية تنتشر عبر الزمكان",
    eventHorizon: "أفق الحدث - النقطة التي لا يمكن للضوء الهروب منها",
    
    // Detailed Explanations
    spacetimeExplanation: "الزمكان هو نسيج الكون المكون من ثلاثة أبعاد مكانية وبُعد زمني واحد. الأجسام الضخمة تنحني هذا النسيج مما يخلق ما نسميه الجاذبية.",
    curvatureDetails: "كلما زادت كتلة الجسم، زاد انحناء الزمكان حوله. هذا الانحناء يجبر الأجسام الأخرى على اتباع مسارات منحنية.",
    orbitMechanics: "الكواكب لا تدور حول الشمس بسبب قوة جذب، بل لأنها تتبع أقصر مسار في الزمكان المنحني.",
    realWorldApplications: "نستخدم هذه النظرية في أقمار GPS، دراسة الثقوب السوداء، واكتشاف الموجات الجاذبية.",
    
    // Interactive Labels
    clickToExplore: "انقر للاستكشاف",
    hoverForInfo: "مرر للمعلومات",
    adjustParameters: "اضبط المعاملات",
    
    // Controls
    increaseMass: "زيادة الكتلة",
    decreaseMass: "تقليل الكتلة",
    speedUp: "تسريع",
    slowDown: "إبطاء",
    pause: "إيقاف",
    play: "تشغيل",
    reset: "إعادة تعيين"
  },
  
  fr: {
    // Navigation
    mainTitle: "Voyage dans la Relativité Générale",
    subtitle: "Découvrez comment fonctionne la gravité avec Albert Einstein",
    languageToggle: "AR",
    
    // Main Scene
    sceneTitle: "L'Espace-Temps et la Gravité",
    sceneDescription: "Voyez comment les objets massifs courbent l'espace-temps et créent la gravité",
    massControl: "Contrôler la Masse",
    addPlanet: "Ajouter Planète",
    removePlanet: "Supprimer Planète",
    timeControl: "Contrôler le Temps",
    tryYourself: "Essayez Vous-Même",
    
    // Falling Objects Section
    fallingTitle: "Pourquoi les Choses Tombent-elles?",
    fallingDescription: "Découvrez la vraie raison pour laquelle les objets tombent vers la Terre",
    fallingStep1: "Un petit objet dans l'espace",
    fallingStep2: "Il commence à tomber graduellement",
    fallingStep3: "Il suit la courbure de l'espace-temps",
    fallingExplanation: "La Terre n'attire pas les objets, mais sa grande masse fait courber l'espace-temps et les objets suivent cette courbure!",
    replay: "Rejouer",
    slowMotion: "Ralenti",
    
    // Knowledge Section
    knowledgeTitle: "En Savoir Plus",
    whatIsRelativity: "Qu'est-ce que la Relativité Générale?",
    whatIsRelativityText: "La théorie d'Einstein qui explique la gravité comme une courbure de l'espace-temps, pas une force d'attraction traditionnelle. C'est comme poser une boule lourde sur un trampoline tendu.",
    howGravityWorks: "Comment fonctionne la Gravité?",
    howGravityWorksText: "Les objets massifs courbent l'espace-temps autour d'eux. Les autres objets se déplacent en lignes droites à travers cet espace-temps courbé, ce qui nous apparaît comme de la gravité.",
    realLifeUse: "Où l'utilisons-nous?",
    realLifeUseText: "Les satellites GPS ont besoin des corrections de la relativité générale pour donner votre position exacte. Sans elle, ils se tromperaient de plusieurs kilomètres!",
    funFacts: "Faits Amusants",
    funFact1: "Einstein a développé cette théorie en s'imaginant tomber dans un ascenseur!",
    funFact2: "La lumière se courbe aussi à cause de la gravité forte",
    funFact3: "Le temps passe plus lentement dans une gravité forte",
    
    // Interactive Elements
    earth: "Terre",
    sun: "Soleil",
    planet: "Planète",
    spacetime: "Espace-Temps",
    gravity: "Gravité",
    orbit: "Orbite",
    
    // Enhanced Controls
    dragToRotate: "Glisser pour Tourner",
    scrollToZoom: "Défiler pour Zoomer",
    resetView: "Réinitialiser Vue",
    showGrid: "Afficher Grille",
    showTrails: "Afficher Trajectoires",
    showForces: "Afficher Forces",
    
    // Advanced Physics
    massEffect: "Effet de la masse sur la courbure de l'espace-temps",
    timeDialation: "Dilatation du temps dans une gravité forte",
    lightBending: "Courbure de la lumière autour d'objets massifs",
    gravitationalWaves: "Les ondes gravitationnelles se propagent dans l'espace-temps",
    eventHorizon: "Horizon des événements - point où la lumière ne peut s'échapper",
    
    // Detailed Explanations
    spacetimeExplanation: "L'espace-temps est le tissu de l'univers composé de trois dimensions spatiales et d'une dimension temporelle. Les objets massifs courbent ce tissu, créant ce que nous appelons la gravité.",
    curvatureDetails: "Plus un objet est massif, plus il courbe l'espace-temps autour de lui. Cette courbure force les autres objets à suivre des trajectoires courbes.",
    orbitMechanics: "Les planètes ne tournent pas autour du soleil à cause d'une force d'attraction, mais parce qu'elles suivent le chemin le plus court dans l'espace-temps courbé.",
    realWorldApplications: "Nous utilisons cette théorie pour les satellites GPS, l'étude des trous noirs, et la détection des ondes gravitationnelles.",
    
    // Interactive Labels
    clickToExplore: "Cliquer pour Explorer",
    hoverForInfo: "Survoler pour Info",
    adjustParameters: "Ajuster Paramètres",
    
    // Controls
    increaseMass: "Augmenter Masse",
    decreaseMass: "Diminuer Masse",
    speedUp: "Accélérer",
    slowDown: "Ralentir",
    pause: "Pause",
    play: "Jouer",
    reset: "Réinitialiser"
  }
};