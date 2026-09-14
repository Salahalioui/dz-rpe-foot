import type { Language } from '../types';

export interface TranslationDict {
  appName: string;
  appTagline: string;
  kioskMode: string;
  dashboard: string;
  sessions: string;
  players: string;
  reports: string;
  about: string;
  
  // Kiosk & Logger
  selectSession: string;
  loggedCount: string;
  tapToLog: string;
  toLog: string;
  alreadyLogged: string;
  pending: string;
  rpeScaleTitle: string;
  durationMin: string;
  sessionLoad: string;
  saveLog: string;
  loggingFor: string;
  hooperTitle: string;
  hooperDesc: string;
  sleepQuality: string;
  muscleSoreness: string;
  fatigueLevel: string;
  stressLevel: string;
  quickPinPrompt: string;
  pinPlaceholder: string;
  invalidPin: string;
  optionalNotes: string;
  logSuccess: string;
  nextPlayer: string;
  close: string;
  
  // Dashboard & Workload
  teamOverview: string;
  weeklyLoadAU: string;
  teamAvgACWR: string;
  dangerCount: string;
  optimalCount: string;
  sweetSpotDesc: string;
  dangerDesc: string;
  warningDesc: string;
  undertrainingDesc: string;
  acuteLoad: string;
  chronicLoad: string;
  acwrRatio: string;
  monotony: string;
  strain: string;
  readinessIndex: string;
  status: string;
  actions: string;
  filterByPosition: string;
  allPositions: string;
  playerDetails: string;
  loadTrends: string;
  last30Days: string;
  
  // Sessions
  createSession: string;
  sessionDate: string;
  sessionType: string;
  microcycleDay: string;
  plannedDuration: string;
  targetRpe: string;
  location: string;
  notes: string;
  saveSession: string;
  tactical: string;
  physical: string;
  match: string;
  recovery: string;
  gym: string;
  
  // Players
  addPlayer: string;
  firstName: string;
  lastName: string;
  jerseyNumber: string;
  position: string;
  pinCode: string;
  savePlayer: string;
  editPlayer: string;
  deletePlayer: string;
  active: string;
  inactive: string;
  
  // Reports
  exportPdf: string;
  exportExcel: string;
  backupData: string;
  restoreData: string;
  weeklyReportTitle: string;
  academicExportTitle: string;
  academicExportDesc: string;
  downloadStarted: string;
  restoreSuccess: string;
  resetToDefault: string;
  
  // Borg CR-10 Descriptions
  rpe0: string;
  rpe1: string;
  rpe2: string;
  rpe3: string;
  rpe4: string;
  rpe5: string;
  rpe6: string;
  rpe7: string;
  rpe8: string;
  rpe9: string;
  rpe10: string;
  
  // Common
  search: string;
  cancel: string;
  confirm: string;
  delete: string;
  save: string;
  loading: string;
  noData: string;
  offlineMode: string;
  onlineMode: string;
  minutes: string;
  auUnits: string;
}

export const translations: Record<Language, TranslationDict> = {
  fr: {
    appName: "DZ-RPE Foot",
    appTagline: "Suivi de Charge RPE, ACWR & Indice Hooper pour U17 Algérie",
    kioskMode: "Kiosque",
    dashboard: "Analyses",
    sessions: "Séances",
    players: "Effectif",
    reports: "Rapports",
    about: "À Propos",
    
    selectSession: "Sélectionner la séance :",
    loggedCount: "enregistrés sur",
    tapToLog: "Toucher un joueur pour noter sa séance (RPE)",
    toLog: "Toucher pour noter",
    alreadyLogged: "Déjà noté",
    pending: "En attente",
    rpeScaleTitle: "Échelle de Perception de l'Effort (Borg CR-10)",
    durationMin: "Durée réelle (minutes)",
    sessionLoad: "Charge de Séance (sRPE × Durée)",
    saveLog: "Valider l'enregistrement",
    loggingFor: "Saisie RPE pour :",
    hooperTitle: "Indice de Bien-Être (Hooper)",
    hooperDesc: "Évaluation pré-séance (1 = Optimal / 5 = Mauvais)",
    sleepQuality: "Sommeil",
    muscleSoreness: "Courbatures",
    fatigueLevel: "Fatigue générale",
    stressLevel: "Niveau de stress",
    quickPinPrompt: "Entrer le code PIN (4 chiffres)",
    pinPlaceholder: "PIN (ex: 1234)",
    invalidPin: "Code PIN incorrect",
    optionalNotes: "Remarques / Douleurs éventuelles...",
    logSuccess: "RPE enregistré avec succès !",
    nextPlayer: "Joueur suivant",
    close: "Fermer",
    
    teamOverview: "Aperçu de la Charge d'Équipe",
    weeklyLoadAU: "Charge Totale Semaine",
    teamAvgACWR: "Moyenne ACWR Équipe",
    dangerCount: "Joueurs en Zone Rouge",
    optimalCount: "Zone Optimale (Sweet Spot)",
    sweetSpotDesc: "Zone Optimale (0.8 - 1.3) : Développement et prévention blessures",
    dangerDesc: "Zone de Danger (≥ 1.5) : Risque élevé de blessure par surmenage",
    warningDesc: "Zone d'Avertissement (1.3 - 1.49) : Surveillance requise",
    undertrainingDesc: "Sous-entraînement (< 0.8) : Perte de condition physique",
    acuteLoad: "Charge Aiguë (7j)",
    chronicLoad: "Charge Chronique (28j)",
    acwrRatio: "Ratio ACWR",
    monotony: "Monotonie",
    strain: "Contrainte (Strain)",
    readinessIndex: "Indice Hooper",
    status: "État de Forme",
    actions: "Détails",
    filterByPosition: "Poste :",
    allPositions: "Tous les postes",
    playerDetails: "Profil de Charge Individuel",
    loadTrends: "Évolution de la Charge (30 jours)",
    last30Days: "30 derniers jours",
    
    createSession: "Nouvelle Séance",
    sessionDate: "Date de la séance",
    sessionType: "Type de séance",
    microcycleDay: "Jour du Microcycle",
    plannedDuration: "Durée prévue (min)",
    targetRpe: "RPE Cible attendu (0-10)",
    location: "Lieu / Stade",
    notes: "Objectifs tactiques & physiques",
    saveSession: "Enregistrer la séance",
    tactical: "Technico-Tactique",
    physical: "Préparation Physique",
    match: "Match Officiel / Amical",
    recovery: "Récupération / Décrassage",
    gym: "Renforcement / Salle",
    
    addPlayer: "Ajouter un Joueur",
    firstName: "Prénom",
    lastName: "Nom",
    jerseyNumber: "N° Maillot",
    position: "Poste",
    pinCode: "Code PIN (4 chiffres)",
    savePlayer: "Sauvegarder",
    editPlayer: "Modifier",
    deletePlayer: "Supprimer",
    active: "Actif",
    inactive: "Blessé / Inactif",
    
    exportPdf: "Générer Rapport PDF",
    exportExcel: "Exporter Excel (Jamovi / SPSS / XLSX)",
    backupData: "Sauvegarde JSON",
    restoreData: "Restaurer JSON",
    weeklyReportTitle: "Rapport Hebdomadaire de Charge Microcycle",
    academicExportTitle: "Données Prêtes pour la Recherche Scientifique",
    academicExportDesc: "Export complet avec RPE, sRPE, ACWR, Monotonie, Strain et Scores Hooper formaté pour SPSS et Jamovi.",
    downloadStarted: "Téléchargement généré !",
    restoreSuccess: "Données restaurées avec succès !",
    resetToDefault: "Réinitialiser aux données démo",
    
    rpe0: "0 - Repos total (Aucun effort)",
    rpe1: "1 - Très très facile (Échauffement léger)",
    rpe2: "2 - Facile (Rythme tranquille)",
    rpe3: "3 - Modéré (Effort aérobie standard)",
    rpe4: "4 - Un peu dur (Essoufflement léger)",
    rpe5: "5 - Dur (Séance physique soutenue)",
    rpe6: "6 - Dur+ (Intensité élevée)",
    rpe7: "7 - Très dur (Match difficile / VMA)",
    rpe8: "8 - Très très dur (Épuisement proche)",
    rpe9: "9 - Presque maximal (Au bout du rouleau)",
    rpe10: "10 - Effort Maximal (Totalement épuisé)",
    
    search: "Rechercher...",
    cancel: "Annuler",
    confirm: "Confirmer",
    delete: "Supprimer",
    save: "Enregistrer",
    loading: "Chargement...",
    noData: "Aucune donnée disponible",
    offlineMode: "Mode Hors-Ligne Actif",
    onlineMode: "Connecté",
    minutes: "min",
    auUnits: "UA"
  },
  
  ar: {
    appName: "DZ-RPE فوت",
    appTagline: "متابعة الحمل التدريبي RPE ومؤشر ACWR وهوبر لفئة أقل من 17 سنة بالجزائر",
    kioskMode: "الكشك",
    dashboard: "التحليلات",
    sessions: "الحصص",
    players: "اللاعبين",
    reports: "التقارير",
    about: "عن التطبيق",
    
    selectSession: "اختر الحصة التدريبية :",
    loggedCount: "مسجلين من أصل",
    tapToLog: "انقر على اسم/صورة اللاعب لتسجيل مقياس الجهد (RPE)",
    toLog: "اضغط للتسجيل",
    alreadyLogged: "تم التسجيل",
    pending: "في الانتظار",
    rpeScaleTitle: "مقياس الجهد المدرك لبورغ (Borg CR-10)",
    durationMin: "المدة الفعلية (بالدقائق)",
    sessionLoad: "الحمل التدريبي للحصة (RPE × المدة)",
    saveLog: "تأكيد وتسجيل الحصة",
    loggingFor: "تسجيل مقياس الجهد للاعب :",
    hooperTitle: "مؤشر الجاهزية والراحة (Hooper Index)",
    hooperDesc: "تقييم قبل الحصة (1 = ممتاز / 5 = تعبان بزاف)",
    sleepQuality: "جودة النوم",
    muscleSoreness: "ألم العضلات (Courbatures)",
    fatigueLevel: "التعب والإرهاق العام",
    stressLevel: "مستوى التوتر والضغط",
    quickPinPrompt: "أدخل الرمز السري (4 أرقام)",
    pinPlaceholder: "PIN (مثال: 1234)",
    invalidPin: "الرمز السري غير صحيح",
    optionalNotes: "ملاحظات / آلام موضعية...",
    logSuccess: "تم تسجيل الجهد بنجاح !",
    nextPlayer: "اللاعب التالي",
    close: "إغلاق",
    
    teamOverview: "نظرة عامة على الحمل البدني للفريق",
    weeklyLoadAU: "الحمل الأسبوعي الكلي",
    teamAvgACWR: "معدل ACWR للفريق",
    dangerCount: "لاعبين في المنطقة الحمراء (خطر)",
    optimalCount: "المنطقة المثالية (Sweet Spot)",
    sweetSpotDesc: "المنطقة المثالية (0.8 - 1.3): تطور بدني وتفادي الإصابات",
    dangerDesc: "منطقة الخطر (≥ 1.5): احتمال مرتفع جداً للإصابات العضلية",
    warningDesc: "منطقة الحذر (1.3 - 1.49): تتطلب تخفيف الحمل",
    undertrainingDesc: "نقص التحميل (< 0.8): تراجع في اللياقة البدنية",
    acuteLoad: "الحمل الحاد (7 أيام)",
    chronicLoad: "الحمل المزمن (28 يوم)",
    acwrRatio: "مؤشر ACWR",
    monotony: "الرتابة (Monotony)",
    strain: "الإجهاد الكلي (Strain)",
    readinessIndex: "مؤشر هوبر",
    status: "الحالة البدنية",
    actions: "التفاصيل",
    filterByPosition: "حسب المركز :",
    allPositions: "جميع المراكز",
    playerDetails: "الملف البدني الفردي للاعب",
    loadTrends: "تطور الحمل البدني (آخر 30 يوم)",
    last30Days: "آخر 30 يوم",
    
    createSession: "إضافة حصة جديدة",
    sessionDate: "تاريخ الحصة",
    sessionType: "نوع الحصة",
    microcycleDay: "يوم الدورة الصغرى",
    plannedDuration: "المدة المخططة (دقيقة)",
    targetRpe: "الجهد المستهدف (0-10)",
    location: "الملعب / القاعة",
    notes: "الأهداف التكتيكية والبدنية",
    saveSession: "حفظ الحصة",
    tactical: "فني - تكتيكي",
    physical: "إعداد بدني",
    match: "مباراة رسمية / ودية",
    recovery: "استرجاع واستشفاء",
    gym: "تقوية عضلية / قاعة",
    
    addPlayer: "إضافة لاعب جديد",
    firstName: "الاسم",
    lastName: "اللقب",
    jerseyNumber: "رقم القميص",
    position: "المركز",
    pinCode: "الرمز السري (PIN)",
    savePlayer: "حفظ اللاعب",
    editPlayer: "تعديل",
    deletePlayer: "حذف",
    active: "جاهز / نشط",
    inactive: "مصاب / غائب",
    
    exportPdf: "استخراج تقرير PDF",
    exportExcel: "تصدير إلى Excel (متوافق مع Jamovi و SPSS)",
    backupData: "حفظ نسخة احتياطية (JSON)",
    restoreData: "استرجاع نسخة احتياطية",
    weeklyReportTitle: "التقرير الأسبوعي للحمل التدريبي للدورة الصغرى",
    academicExportTitle: "بيانات جاهزة للبحث العلمي والإحصاء",
    academicExportDesc: "تصدير كامل لكافة المتغيرات (RPE, ACWR, Monotony, Strain, Hooper) مهيأة مباشرة للتحليل في برامج SPSS و Jamovi.",
    downloadStarted: "تم بدء التنزيل بنجاح !",
    restoreSuccess: "تم استرجاع البيانات بنجاح !",
    resetToDefault: "إعادة تعيين للبيانات النموذجية",
    
    rpe0: "0 - راحة تامة (لا يوجد أي مجهود)",
    rpe1: "1 - ساهل بزاف (إحماء خفيف)",
    rpe2: "2 - ساهل (ريتم هادئ)",
    rpe3: "3 - متوسط (مجهود هوائي عادي)",
    rpe4: "4 - شوية صعيب (بداية نهجة خفيفة)",
    rpe5: "5 - صعيب (حصة بدنية قوية)",
    rpe6: "6 - صعيب بزاف (شدة عالية)",
    rpe7: "7 - قاصح / متعب جداً (ماتش قوي أو VMA)",
    rpe8: "8 - عيّان بزاف (قريب الإرهاق التام)",
    rpe9: "9 - قريب الماكسيموم (جهد شاق جداً)",
    rpe10: "10 - أقصى جهد ممكن (استنزاف كامل للطاقة)",
    
    search: "بحث...",
    cancel: "إلغاء",
    confirm: "تأكيد",
    delete: "حذف",
    save: "حفظ",
    loading: "جاري التحميل...",
    noData: "لا توجد بيانات",
    offlineMode: "وضع العمل دون إنترنت نشط",
    onlineMode: "متصل بالإنترنت",
    minutes: "د",
    auUnits: "وحدة اعتباطية (AU)"
  },
  
  en: {
    appName: "DZ-RPE Foot",
    appTagline: "sRPE, ACWR & Hooper Load Monitoring for Algerian U17 Football",
    kioskMode: "Kiosk",
    dashboard: "Dashboard",
    sessions: "Sessions",
    players: "Squad",
    reports: "Reports",
    about: "About",
    
    selectSession: "Select Session:",
    loggedCount: "logged out of",
    tapToLog: "Tap a player card to log Session RPE",
    toLog: "Tap to log",
    alreadyLogged: "Already logged",
    pending: "Pending",
    rpeScaleTitle: "Borg CR-10 Rate of Perceived Exertion",
    durationMin: "Actual Duration (min)",
    sessionLoad: "Session Load (sRPE × Duration)",
    saveLog: "Submit Log",
    loggingFor: "Logging RPE for:",
    hooperTitle: "Hooper Wellness Index",
    hooperDesc: "Pre-training readiness (1 = Optimal / 5 = Very Poor)",
    sleepQuality: "Sleep Quality",
    muscleSoreness: "Muscle Soreness",
    fatigueLevel: "General Fatigue",
    stressLevel: "Stress Level",
    quickPinPrompt: "Enter 4-digit PIN",
    pinPlaceholder: "PIN (e.g. 1234)",
    invalidPin: "Invalid PIN code",
    optionalNotes: "Optional notes / soreness areas...",
    logSuccess: "RPE logged successfully!",
    nextPlayer: "Next Player",
    close: "Close",
    
    teamOverview: "Team Workload Overview",
    weeklyLoadAU: "Total Weekly Load",
    teamAvgACWR: "Team Mean ACWR",
    dangerCount: "Players in Red Zone",
    optimalCount: "Optimal Sweet Spot",
    sweetSpotDesc: "Optimal Zone (0.8 - 1.3): Fitness gains with low injury risk",
    dangerDesc: "Danger Zone (≥ 1.5): High relative risk of overuse injury",
    warningDesc: "Warning Zone (1.3 - 1.49): Load management recommended",
    undertrainingDesc: "Under-training (< 0.8): Loss of physical conditioning",
    acuteLoad: "Acute Load (7d)",
    chronicLoad: "Chronic Load (28d)",
    acwrRatio: "ACWR Ratio",
    monotony: "Monotony",
    strain: "Strain",
    readinessIndex: "Hooper Score",
    status: "Status",
    actions: "Details",
    filterByPosition: "Position:",
    allPositions: "All Positions",
    playerDetails: "Individual Workload Profile",
    loadTrends: "Workload Timeline (30 Days)",
    last30Days: "Last 30 Days",
    
    createSession: "New Session",
    sessionDate: "Session Date",
    sessionType: "Session Type",
    microcycleDay: "Microcycle Day",
    plannedDuration: "Planned Duration (min)",
    targetRpe: "Target RPE (0-10)",
    location: "Pitch / Facility",
    notes: "Tactical & Physical Objectives",
    saveSession: "Save Session",
    tactical: "Technical-Tactical",
    physical: "Physical Preparation",
    match: "Official Match / Friendly",
    recovery: "Recovery / Regeneration",
    gym: "Gym / Strength",
    
    addPlayer: "Add Player",
    firstName: "First Name",
    lastName: "Last Name",
    jerseyNumber: "Jersey #",
    position: "Position",
    pinCode: "PIN Code (4 digits)",
    savePlayer: "Save Player",
    editPlayer: "Edit",
    deletePlayer: "Delete",
    active: "Active",
    inactive: "Injured / Inactive",
    
    exportPdf: "Generate PDF Report",
    exportExcel: "Export Excel (Jamovi / SPSS / XLSX)",
    backupData: "Backup JSON",
    restoreData: "Restore JSON",
    weeklyReportTitle: "Microcycle Workload Report",
    academicExportTitle: "Research-Ready Data Export",
    academicExportDesc: "Full tabular export of RPE, sRPE, ACWR, Monotony, Strain, and Hooper scores formatted for SPSS and Jamovi.",
    downloadStarted: "Download generated!",
    restoreSuccess: "Data restored successfully!",
    resetToDefault: "Reset to Demo Squad",
    
    rpe0: "0 - Rest (No exertion at all)",
    rpe1: "1 - Very, Very Easy (Light warm-up)",
    rpe2: "2 - Easy (Comfortable pace)",
    rpe3: "3 - Moderate (Standard aerobic)",
    rpe4: "4 - Somewhat Hard (Light breathlessness)",
    rpe5: "5 - Hard (Strenuous physical drill)",
    rpe6: "6 - Hard+ (High intensity)",
    rpe7: "7 - Very Hard (Tough match / MAS / VMA)",
    rpe8: "8 - Very, Very Hard (Near exhaustion)",
    rpe9: "9 - Near Maximal (Exhausting)",
    rpe10: "10 - Maximal Exertion (Total fatigue)",
    
    search: "Search...",
    cancel: "Cancel",
    confirm: "Confirm",
    delete: "Delete",
    save: "Save",
    loading: "Loading...",
    noData: "No data available",
    offlineMode: "Offline Mode Active",
    onlineMode: "Online",
    minutes: "min",
    auUnits: "AU"
  }
};
