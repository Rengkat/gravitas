// ================= USER==================
export enum UserRole {
  STUDENT = 'student',
  PARENT = 'parent',
  TUTOR = 'tutor',
  TEACHER = 'teacher',
  SCHOOL_ADMIN = 'school_admin',
  PROFESSIONAL = 'professional',
  SUPER_ADMIN = 'super_admin',
}

export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
  APPLE = 'apple',
  FACEBOOK = 'facebook',
  PHONE = 'phone',
  EMAIL = 'email',
}

export enum SubscriptionTier {
  FREE = 'free',
  PRO = 'pro',
  SCHOOL = 'school',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  TRIAL = 'trial',
}
// =================== EXAM /CBT=================

export enum ExamType {
  JAMB = 'jamb',
  WAEC = 'waec',
  NECO = 'neco',
  NABTEB = 'nabteb',
  BECE = 'bece',
  JUNIOR_NECO = 'junior_neco',
  ICAN = 'ican',
  NMCN = 'nmcn',
  CIPM = 'cipm',
  NIM = 'nim',
  NIESV = 'niesv',
  CIBN = 'cibn', // Chartered Institute of Bankers of Nigeria
  NSE = 'nse', // Nigerian Society of Engineers  NCS = "ncs", // Nigerian Computer Society
  ICEN = 'icen', // Institute of Chartered Economists of Nigeria
  NIQS = 'niqs', // Nigerian Institute of Quantity Surveyors
  ARCON = 'arcon', // Architects Registration Council of Nigeria
  MLSCN = 'mlscn', // Medical Laboratory Science Council of Nigeria
  PCN = 'pcn', // Pharmacists Council of Nigeria
}

export enum ExamMode {
  PRACTICE = 'practice',
  MOCK = 'mock',
  SCHOOL_EXAM = 'school_exam',
}

export enum QuestionType {
  MCQ = 'mcq',
  THEORY = 'theory',
  PRACTICAL = 'practical',
  TRUE_FALSE = 'true_false',
  FILL_BLANKS = 'fill_blanks',
  MATCHING = 'matching',
  ESSAY = 'essay',
  OBJECTIVE = 'objective',
}

export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}
export enum SessionStatus {
  IN_PROGRESS = 'in_progress',
  SUBMITTED = 'submitted',
  ABANDONED = 'abandoned',
  TIMED_OUT = 'timed_out',
}

// ============= SCHOOL===================

export enum ClassLevel {
  JSS1 = 'jss1',
  JSS2 = 'jss2',
  JSS3 = 'jss3',
  SS1 = 'ss1',
  SS2 = 'ss2',
  SS3 = 'ss3',
}

export enum EnrollmentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  GRADUATED = 'graduated',
  SUSPENDED = 'suspended',
}

export enum TestStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CLOSED = 'closed',
  ARCHIVED = 'archived',
}
// =============== TUTORING ================
export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled',
  NO_SHOW = 'no_show',
}

// ==================== SESSION & BOOKING ENUMS ====================

export enum SessionType {
  ONLINE = 'online',
  PHYSICAL = 'physical',
  HYBRID = 'hybrid',
  GROUP = 'group',
  ONE_ON_ONE = 'one_on_one',
}

export enum SessionStatus {
  SCHEDULED = 'scheduled',
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled',
  NO_SHOW = 'no_show',
  MISSED = 'missed',
}

export enum SessionMode {
  ONLINE = 'online',
  IN_PERSON = 'in_person',
  BOTH = 'both',
}

export enum SessionDuration {
  THIRTY_MIN = 30,
  FORTY_FIVE_MIN = 45,
  ONE_HOUR = 60,
  ONE_HOUR_THIRTY = 90,
  TWO_HOURS = 120,
  TWO_HOURS_THIRTY = 150,
  THREE_HOURS = 180,
}

export enum RecurringPattern {
  NONE = 'none',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  BI_WEEKLY = 'bi_weekly',
  MONTHLY = 'monthly',
  CUSTOM = 'custom',
}

// =============== PAYMENT================
export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
}

export enum PaymentPurpose {
  SUBSCRIPTION = 'subscription',
  TUTOR_SESSION = 'tutor_session',
  SCHOOL_PLAN = 'school_plan',
}
// ================== SUBJECTS ====================
export enum Subject {
  // ========== CORE SCIENCES ==========
  MATHEMATICS = 'mathematics',
  FURTHER_MATHEMATICS = 'further_mathematics',
  PHYSICS = 'physics',
  CHEMISTRY = 'chemistry',
  BIOLOGY = 'biology',
  GENERAL_SCIENCE = 'general_science',
  BASIC_SCIENCE = 'basic_science',
  INTEGRATED_SCIENCE = 'integrated_science',

  // ========== ENGLISH & LANGUAGES ==========
  ENGLISH = 'english',
  ENGLISH_LITERATURE = 'english_literature',
  LITERATURE_IN_ENGLISH = 'literature_in_english',
  YORUBA = 'yoruba',
  HAUSA = 'hausa',
  IGBO = 'igbo',
  FRENCH = 'french',
  ARABIC = 'arabic',
  GERMAN = 'german',
  LATIN = 'latin',

  // ========== HUMANITIES & SOCIAL SCIENCES ==========
  ECONOMICS = 'economics',
  GOVERNMENT = 'government',
  HISTORY = 'history',
  GEOGRAPHY = 'geography',
  CIVIC_EDUCATION = 'civic_education',
  SOCIAL_STUDIES = 'social_studies',
  RELIGIOUS_STUDIES = 'religious_studies',
  CHRISTIAN_RELIGIOUS_STUDIES = 'christian_religious_studies',
  ISLAMIC_RELIGIOUS_STUDIES = 'islamic_religious_studies',
  PHILOSOPHY = 'philosophy',
  PSYCHOLOGY = 'psychology',
  SOCIOLOGY = 'sociology',
  ANTHROPOLOGY = 'anthropology',

  // ========== COMMERCE & BUSINESS ==========
  COMMERCE = 'commerce',
  ACCOUNTING = 'accounting',
  FINANCIAL_ACCOUNTING = 'financial_accounting',
  BUSINESS_STUDIES = 'business_studies',
  BUSINESS_MANAGEMENT = 'business_management',
  MARKETING = 'marketing',
  INSURANCE = 'insurance',
  OFFICE_PRACTICE = 'office_practice',
  STORE_KEEPING = 'store_keeping',
  ENTREPRENEURSHIP = 'entrepreneurship',

  // ========== TECHNICAL & VOCATIONAL ==========
  TECHNICAL_DRAWING = 'technical_drawing',
  BUILDING_CONSTRUCTION = 'building_construction',
  WOODWORK = 'woodwork',
  METALWORK = 'metalwork',
  AUTO_MECHANICS = 'auto_mechanics',
  ELECTRICAL_INSTALLATION = 'electrical_installation',
  ELECTRONICS = 'electronics',
  COMPUTER_STUDIES = 'computer_studies',
  COMPUTER_SCIENCE = 'computer_science',
  DATA_PROCESSING = 'data_processing',
  INFORMATION_TECHNOLOGY = 'information_technology',
  PROGRAMMING = 'programming',
  WEB_DEVELOPMENT = 'web_development',

  // ========== ARTS & CREATIVE ==========
  FINE_ARTS = 'fine_arts',
  CREATIVE_ARTS = 'creative_arts',
  MUSIC = 'music',
  THEATRE_ARTS = 'theatre_arts',
  DANCE = 'dance',
  CULTURAL_AND_CREATIVE_ARTS = 'cultural_and_creative_arts',

  // ========== HOME ECONOMICS & PRACTICAL ==========
  HOME_ECONOMICS = 'home_economics',
  FOOD_AND_NUTRITION = 'food_and_nutrition',
  TEXTILES = 'textiles',
  CLOTHING_AND_TEXTILES = 'clothing_and_textiles',
  CATERING = 'catering',
  HOSPITALITY = 'hospitality',

  // ========== AGRICULTURE ==========
  AGRICULTURAL_SCIENCE = 'agricultural_science',
  ANIMAL_HUSBANDRY = 'animal_husbandry',
  CROP_PRODUCTION = 'crop_production',
  FISHERIES = 'fisheries',
  FORESTRY = 'forestry',

  // ========== HEALTH & PHYSICAL ==========
  HEALTH_EDUCATION = 'health_education',
  PHYSICAL_EDUCATION = 'physical_education',
  HUMAN_KINETICS = 'human_kinetics',
  NUTRITION = 'nutrition',
  PUBLIC_HEALTH = 'public_health',

  // ========== PROFESSIONAL EXAMS ==========
  // ICAN Subjects
  FINANCIAL_REPORTING = 'financial_reporting',
  MANAGEMENT_ACCOUNTING = 'management_accounting',
  TAXATION = 'taxation',
  AUDIT = 'audit',
  CORPORATE_LAW = 'corporate_law',
  PERFORMANCE_MANAGEMENT = 'performance_management',

  // Medical/Nursing Subjects
  ANATOMY = 'anatomy',
  PHYSIOLOGY = 'physiology',
  PHARMACOLOGY = 'pharmacology',
  PATHOLOGY = 'pathology',
  MICROBIOLOGY = 'microbiology',
  BIOCHEMISTRY = 'biochemistry',
  NURSING_FUNDAMENTALS = 'nursing_fundamentals',
  MIDWIFERY = 'midwifery',
  COMMUNITY_HEALTH = 'community_health',

  // Engineering Subjects
  ENGINEERING_MATHEMATICS = 'engineering_mathematics',
  STRENGTH_OF_MATERIALS = 'strength_of_materials',
  FLUID_MECHANICS = 'fluid_mechanics',
  THERMODYNAMICS = 'thermodynamics',
  STRUCTURAL_ANALYSIS = 'structural_analysis',
  GEOTECHNICAL_ENGINEERING = 'geotechnical_engineering',
  ELECTRICAL_CIRCUITS = 'electrical_circuits',
  DIGITAL_ELECTRONICS = 'digital_electronics',
  CONTROL_ENGINEERING = 'control_engineering',
  TELECOMMUNICATIONS = 'telecommunications',

  // Law Subjects
  CONSTITUTIONAL_LAW = 'constitutional_law',
  CRIMINAL_LAW = 'criminal_law',
  CONTRACT_LAW = 'contract_law',
  TORT_LAW = 'tort_law',
  PROPERTY_LAW = 'property_law',
  COMPANY_LAW = 'company_law',
  EVIDENCE_LAW = 'evidence_law',

  // ========== ADVANCED & SPECIALIZED ==========
  STATISTICS = 'statistics',
  QUANTITATIVE_METHODS = 'quantitative_methods',
  OPERATIONS_RESEARCH = 'operations_research',
  PROJECT_MANAGEMENT = 'project_management',
  RESEARCH_METHODS = 'research_methods',
  LOGIC = 'logic',
  ETHICS = 'ethics',

  // ========== TEST PREP ==========
  VERBAL_REASONING = 'verbal_reasoning',
  QUANTITATIVE_REASONING = 'quantitative_reasoning',
  GENERAL_KNOWLEDGE = 'general_knowledge',
  CURRENT_AFFAIRS = 'current_affairs',
  IQ_TEST = 'iq_test',
  APTITUDE_TEST = 'aptitude_test',
}
// =========== CONTNENT =============
export enum ContentType {
  EBOOK = 'ebook',
  VIDEO = 'video',
  IMAGE = 'image',
  DOCUMENT = 'document',
  AUDIO = 'audio',
  QUIZ = 'quiz',
  PRACTICE_SET = 'practice_set',
}

// ==================== ADDITIONAL ENUMS ====================
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say',
}

export enum NigerianState {
  ABIA = 'Abia',
  ADAMAWA = 'Adamawa',
  AKWA_IBOM = 'Akwa Ibom',
  ANAMBRA = 'Anambra',
  BAUCHI = 'Bauchi',
  BAYELSA = 'Bayelsa',
  BENUE = 'Benue',
  BORNO = 'Borno',
  CROSS_RIVER = 'Cross River',
  DELTA = 'Delta',
  EBONYI = 'Ebonyi',
  EDO = 'Edo',
  EKITI = 'Ekiti',
  ENUGU = 'Enugu',
  GOMBE = 'Gombe',
  IMO = 'Imo',
  JIGAWA = 'Jigawa',
  KADUNA = 'Kaduna',
  KANO = 'Kano',
  KATSINA = 'Katsina',
  KEBBI = 'Kebbi',
  KOGI = 'Kogi',
  KWARA = 'Kwara',
  LAGOS = 'Lagos',
  NASARAWA = 'Nasarawa',
  NIGER = 'Niger',
  OGUN = 'Ogun',
  ONDO = 'Ondo',
  OSUN = 'Osun',
  OYO = 'Oyo',
  PLATEAU = 'Plateau',
  RIVERS = 'Rivers',
  SOKOTO = 'Sokoto',
  TARABA = 'Taraba',
  YOBE = 'Yobe',
  ZAMFARA = 'Zamfara',
  FCT_ABUJA = 'Federal Capital Territory',
}
//======= FOR SCHOOL ===========
export enum AdminRole {
  SCHOOL_ADMIN = 'school_admin', // the school that signed up
  TEACHER = 'teacher', // can build tests and view results
}
