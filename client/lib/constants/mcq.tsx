/* ─────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────── */
export type Question = {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  hasDiagram?: boolean;
  diagramSvg?: string;
  subjectId: string;
};

export type Answer = {
  selectedOption: string | null;
  isFlagged: boolean;
  isVisited: boolean;
};

// Answers keyed by subjectId so switching subjects never loses progress
export type SubjectId = string;
export type AllAnswers = Record<SubjectId, Answer[]>;

/* ─────────────────────────────────────────────────────────
   STATIC DATA — defined outside the component so it is
   never recreated on re-renders
───────────────────────────────────────────────────────── */
export const BASE_QUESTIONS: Record<string, Question[]> = {
  physics: [
    {
      id: 1,
      subjectId: "physics",
      text: "A body of mass 5 kg is acted upon by a constant force of 20 N for 4 seconds. Calculate the change in momentum of the body.",
      options: ["20 kgm/s", "40 kgm/s", "60 kgm/s", "80 kgm/s"],
      correctAnswer: "D",
      explanation:
        "Change in momentum = Force × Time = 20 N × 4 s = 80 kgm/s. Derived from Newton's second law: F = Δp/Δt.",
    },
    {
      id: 2,
      subjectId: "physics",
      text: "The diagram shows a plank RS pivoted at its centre of gravity O in equilibrium with weights P and Q. If a weight 2P is added to P, equilibrium is restored by:",
      options: [
        "Moving P nearer to O",
        "Adding a weight Q to O",
        "Moving Q nearer to O",
        "Moving P further away from O",
      ],
      correctAnswer: "C",
      explanation:
        "To maintain equilibrium when P increases, moving Q nearer to O reduces its moment arm, balancing the increased moment from P.",
      hasDiagram: true,
      diagramSvg: `<svg width="100%" height="120" viewBox="0 0 400 120" xmlns="http://www.w3.org/2000/svg">
        <text x="35" y="25" font-size="14" font-weight="600" fill="#1a4a2e">R</text>
        <text x="195" y="25" font-size="14" font-weight="600" fill="#1a4a2e">O</text>
        <text x="365" y="25" font-size="14" font-weight="600" fill="#1a4a2e">S</text>
        <rect x="25" y="30" width="350" height="20" rx="2" fill="none" stroke="#1a4a2e" stroke-width="2"/>
        <polygon points="200,50 185,90 215,90" fill="#1a4a2e"/>
        <rect x="15" y="90" width="45" height="25" rx="3" fill="none" stroke="#1a4a2e" stroke-width="2"/>
        <text x="37" y="107" font-size="14" font-weight="700" fill="#1a4a2e" text-anchor="middle">P</text>
        <rect x="340" y="90" width="45" height="25" rx="3" fill="none" stroke="#1a4a2e" stroke-width="2"/>
        <text x="362" y="107" font-size="14" font-weight="700" fill="#1a4a2e" text-anchor="middle">Q</text>
      </svg>`,
    },
    {
      id: 3,
      subjectId: "physics",
      text: "A ray of light strikes a plane mirror at an angle of 30° to the mirror surface. What is the angle of reflection?",
      options: ["30°", "60°", "90°", "120°"],
      correctAnswer: "B",
      explanation:
        "The angle of incidence is measured from the normal. If the ray is 30° to the mirror it is 60° to the normal. Angle of reflection = angle of incidence = 60°.",
    },
    {
      id: 4,
      subjectId: "physics",
      text: "Calculate the effective resistance of three resistors of 2 Ω, 3 Ω, and 5 Ω connected in parallel.",
      options: ["0.97 Ω", "1.03 Ω", "2.5 Ω", "10 Ω"],
      correctAnswer: "A",
      explanation: "1/R = 1/2 + 1/3 + 1/5 = 0.5 + 0.333 + 0.2 = 1.033. Therefore R ≈ 0.97 Ω.",
    },
    {
      id: 5,
      subjectId: "physics",
      text: "Which of the following is NOT a fundamental quantity?",
      options: ["Mass", "Time", "Velocity", "Temperature"],
      correctAnswer: "C",
      explanation:
        "Velocity is a derived quantity (length/time). The SI base quantities are mass, length, time, temperature, electric current, luminous intensity, and amount of substance.",
    },
    {
      id: 6,
      subjectId: "physics",
      text: "A stone is thrown vertically upward with a velocity of 20 m/s. Calculate the maximum height reached. (g = 10 m/s²)",
      options: ["10 m", "20 m", "30 m", "40 m"],
      correctAnswer: "B",
      explanation: "Using v² = u² − 2gh; at maximum height v = 0. So 0 = 400 − 20h → h = 20 m.",
    },
    {
      id: 7,
      subjectId: "physics",
      text: "Which of the following electromagnetic waves has the longest wavelength?",
      options: ["Gamma rays", "X-rays", "Ultraviolet", "Radio waves"],
      correctAnswer: "D",
      explanation:
        "Radio waves have the longest wavelength in the electromagnetic spectrum, ranging from millimetres to kilometres.",
    },
    {
      id: 8,
      subjectId: "physics",
      text: "A transformer has 200 turns in the primary coil and 50 turns in the secondary coil. If the primary voltage is 240 V, what is the secondary voltage?",
      options: ["60 V", "120 V", "480 V", "960 V"],
      correctAnswer: "A",
      explanation: "Vp/Vs = Np/Ns → 240/Vs = 200/50 = 4 → Vs = 60 V.",
    },
    {
      id: 9,
      subjectId: "physics",
      text: "Which of the following is NOT a method of heat transfer?",
      options: ["Conduction", "Convection", "Radiation", "Absorption"],
      correctAnswer: "D",
      explanation:
        "Absorption is a process that occurs during heat transfer, not a method of transfer. The three methods are conduction, convection, and radiation.",
    },
    {
      id: 10,
      subjectId: "physics",
      text: "A car accelerates uniformly from rest to 20 m/s in 10 seconds. What is its acceleration?",
      options: ["0.5 m/s²", "1 m/s²", "2 m/s²", "4 m/s²"],
      correctAnswer: "C",
      explanation: "a = (v − u) / t = (20 − 0) / 10 = 2 m/s².",
    },
  ],
  mathematics: [
    {
      id: 1,
      subjectId: "mathematics",
      text: "If log₁₀ 2 = 0.3010 and log₁₀ 3 = 0.4771, find log₁₀ 6.",
      options: ["0.1761", "0.7781", "0.7782", "1.7781"],
      correctAnswer: "B",
      explanation: "log₁₀ 6 = log₁₀ (2 × 3) = log₁₀ 2 + log₁₀ 3 = 0.3010 + 0.4771 = 0.7781.",
    },
    {
      id: 2,
      subjectId: "mathematics",
      text: "Solve the quadratic equation: x² − 5x + 6 = 0",
      options: ["x = 2, 3", "x = −2, −3", "x = 1, 6", "x = −1, −6"],
      correctAnswer: "A",
      explanation: "x² − 5x + 6 = (x − 2)(x − 3) = 0 → x = 2 or x = 3.",
    },
    {
      id: 3,
      subjectId: "mathematics",
      text: "Find the derivative of y = 3x² + 2x − 5",
      options: ["6x + 2", "3x + 2", "6x − 2", "3x² + 2"],
      correctAnswer: "A",
      explanation: "dy/dx = 6x + 2.",
    },
    {
      id: 4,
      subjectId: "mathematics",
      text: "Calculate the area of a circle with radius 7 cm. (π = 22/7)",
      options: ["154 cm²", "44 cm²", "88 cm²", "308 cm²"],
      correctAnswer: "A",
      explanation: "Area = πr² = (22/7) × 49 = 154 cm².",
    },
    {
      id: 5,
      subjectId: "mathematics",
      text: "What is the probability of getting a head when a fair coin is tossed?",
      options: ["0", "1/4", "1/2", "1"],
      correctAnswer: "C",
      explanation: "A fair coin has 2 equally likely outcomes. Probability = 1/2.",
    },
  ],
  english: [
    {
      id: 1,
      subjectId: "english",
      text: "Choose the word most nearly opposite in meaning to: 'BENEVOLENT'",
      options: ["Kind", "Generous", "Malevolent", "Charitable"],
      correctAnswer: "C",
      explanation:
        "Benevolent means kind and generous. Malevolent means wishing to do evil to others.",
    },
    {
      id: 2,
      subjectId: "english",
      text: "Select the word that best completes the sentence: 'The committee ___ agreed on the new policy.'",
      options: ["has", "have", "is", "are"],
      correctAnswer: "A",
      explanation: "Committee is a collective noun treated as singular, so 'has' is correct.",
    },
  ],
  chemistry: [
    {
      id: 1,
      subjectId: "chemistry",
      text: "What is the atomic number of carbon?",
      options: ["4", "6", "8", "12"],
      correctAnswer: "B",
      explanation: "Carbon has atomic number 6, meaning it has 6 protons in its nucleus.",
    },
    {
      id: 2,
      subjectId: "chemistry",
      text: "Which of the following is an alkali metal?",
      options: ["Calcium", "Sodium", "Aluminium", "Iron"],
      correctAnswer: "B",
      explanation: "Sodium is in Group 1 of the periodic table, making it an alkali metal.",
    },
  ],
};
