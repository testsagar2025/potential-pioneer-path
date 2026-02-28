export interface Question {
  id: string;
  section: string;
  text: string;
  options?: string[];
  type: 'mcq' | 'open' | 'calculation';
  difficulty: number;
  topic: string;
}

// Static question bank (fallback / MVP - AI integration later)
const mathQuestions: Question[] = [
  { id: 'm1', section: 'math', text: 'Find the roots of the equation: 2x² - 7x + 3 = 0', options: ['x = 3, x = 1/2', 'x = 3, x = -1/2', 'x = -3, x = 1/2', 'x = 1, x = 3'], type: 'mcq', difficulty: 2, topic: 'Quadratic Equations' },
  { id: 'm2', section: 'math', text: 'The 10th term of the AP: 2, 7, 12, 17, ... is:', options: ['47', '52', '49', '45'], type: 'mcq', difficulty: 2, topic: 'Arithmetic Progressions' },
  { id: 'm3', section: 'math', text: 'From the top of a 15m building, the angle of depression of a car is 30°. How far is the car from the base?', options: ['15√3 m', '15/√3 m', '10√3 m', '30 m'], type: 'mcq', difficulty: 3, topic: 'Heights & Distances' },
  { id: 'm4', section: 'math', text: 'The distance between points (3, 4) and (-1, 2) is:', options: ['√20', '√18', '√10', '√8'], type: 'mcq', difficulty: 2, topic: 'Coordinate Geometry' },
  { id: 'm5', section: 'math', text: 'A cone has height 12 cm and slant height 13 cm. Its curved surface area is:', options: ['65π cm²', '60π cm²', '156π cm²', '130π cm²'], type: 'mcq', difficulty: 3, topic: 'Surface Areas & Volumes' },
  { id: 'm6', section: 'math', text: 'If the sum of first n terms of an AP is 3n² + 5n, find the common difference.', options: ['6', '5', '3', '8'], type: 'mcq', difficulty: 3, topic: 'Arithmetic Progressions' },
  { id: 'm7', section: 'math', text: 'For what value of k does the equation x² + 2kx + 4 = 0 have equal roots?', options: ['k = ±2', 'k = ±4', 'k = 2', 'k = -2'], type: 'mcq', difficulty: 4, topic: 'Quadratic Equations' },
  { id: 'm8', section: 'math', text: 'Find the area of a triangle with vertices (1,2), (4,6), and (7,2).', options: ['12 sq units', '9 sq units', '15 sq units', '6 sq units'], type: 'mcq', difficulty: 3, topic: 'Coordinate Geometry' },
];

const physicsQuestions: Question[] = [
  { id: 'p1', section: 'physics', text: 'A wire of resistance 10Ω is stretched to double its length. Its new resistance is:', options: ['40Ω', '20Ω', '10Ω', '5Ω'], type: 'mcq', difficulty: 3, topic: 'Electricity' },
  { id: 'p2', section: 'physics', text: 'An object is placed 20 cm from a concave mirror of focal length 15 cm. The image distance is:', options: ['60 cm', '30 cm', '-60 cm', '-30 cm'], type: 'mcq', difficulty: 3, topic: 'Light' },
  { id: 'p3', section: 'physics', text: 'A car moves with uniform velocity of 30 m/s for 5s. The distance covered is:', options: ['150 m', '6 m', '35 m', '25 m'], type: 'mcq', difficulty: 1, topic: 'Motion' },
  { id: 'p4', section: 'physics', text: 'Three resistors of 2Ω, 3Ω, and 6Ω are connected in parallel. The equivalent resistance is:', options: ['1Ω', '11Ω', '0.5Ω', '2Ω'], type: 'mcq', difficulty: 3, topic: 'Electricity' },
  { id: 'p5', section: 'physics', text: 'Power of a lens with focal length -50 cm is:', options: ['-2D', '2D', '-0.5D', '0.5D'], type: 'mcq', difficulty: 2, topic: 'Light' },
  { id: 'p6', section: 'physics', text: 'A body starts from rest and accelerates at 2 m/s² for 10s. Its final velocity is:', options: ['20 m/s', '10 m/s', '5 m/s', '100 m/s'], type: 'mcq', difficulty: 2, topic: 'Motion' },
];

const chemistryQuestions: Question[] = [
  { id: 'c1', section: 'chemistry', text: 'Balance: Fe + H₂O → Fe₃O₄ + H₂. The coefficient of H₂ is:', options: ['4', '3', '8', '2'], type: 'mcq', difficulty: 3, topic: 'Chemical Equations' },
  { id: 'c2', section: 'chemistry', text: 'The molar mass of CaCO₃ is:', options: ['100 g/mol', '84 g/mol', '120 g/mol', '40 g/mol'], type: 'mcq', difficulty: 2, topic: 'Mole Concept' },
  { id: 'c3', section: 'chemistry', text: 'Which is a strong acid?', options: ['HCl', 'CH₃COOH', 'H₂CO₃', 'H₃BO₃'], type: 'mcq', difficulty: 1, topic: 'Acids & Bases' },
  { id: 'c4', section: 'chemistry', text: 'The most reactive metal in the series is:', options: ['Potassium', 'Sodium', 'Calcium', 'Iron'], type: 'mcq', difficulty: 2, topic: 'Metals & Non-metals' },
  { id: 'c5', section: 'chemistry', text: 'pH of a neutral solution at 25°C is:', options: ['7', '0', '14', '1'], type: 'mcq', difficulty: 1, topic: 'Acids & Bases' },
  { id: 'c6', section: 'chemistry', text: 'How many moles of oxygen are in 64g of O₂?', options: ['2 mol', '1 mol', '4 mol', '0.5 mol'], type: 'mcq', difficulty: 2, topic: 'Mole Concept' },
];

const biologyQuestions: Question[] = [
  { id: 'b1', section: 'biology', text: 'In a cross Tt × Tt, the ratio of tall to short plants is:', options: ['3:1', '1:1', '1:3', '2:1'], type: 'mcq', difficulty: 2, topic: 'Heredity' },
  { id: 'b2', section: 'biology', text: 'Which chamber of the heart receives oxygenated blood from lungs?', options: ['Left atrium', 'Right atrium', 'Left ventricle', 'Right ventricle'], type: 'mcq', difficulty: 2, topic: 'Human Anatomy' },
  { id: 'b3', section: 'biology', text: 'The enzyme pepsin works best in which medium?', options: ['Acidic', 'Basic', 'Neutral', 'Alkaline'], type: 'mcq', difficulty: 2, topic: 'Life Processes' },
  { id: 'b4', section: 'biology', text: 'In a dihybrid cross (RrYy × RrYy), the phenotypic ratio is:', options: ['9:3:3:1', '3:1', '1:2:1', '1:1:1:1'], type: 'mcq', difficulty: 3, topic: 'Heredity' },
  { id: 'b5', section: 'biology', text: 'Which blood vessel carries blood from the heart to the lungs?', options: ['Pulmonary artery', 'Pulmonary vein', 'Aorta', 'Vena cava'], type: 'mcq', difficulty: 2, topic: 'Human Anatomy' },
];

const englishPassage = `The ancient library stood at the crossroads of civilization, its walls holding the collective wisdom of centuries. Scholars traveled from distant lands to study within its halls. The chief librarian, an elderly woman named Aria, had dedicated fifty years to preserving these texts. She believed that knowledge, unlike gold, multiplied when shared. In recent years, digital archives threatened the library's relevance. Young researchers preferred the convenience of online databases. Yet Aria noticed something the digital world could not replicate—the serendipity of discovery. A student searching for astronomical texts might stumble upon a philosophical treatise that changed their worldview. The library's physical arrangement encouraged unexpected connections between disciplines. When the city council proposed converting the building into a technology hub, Aria presented data showing that students who used the physical library performed 23% better in creative problem-solving assessments. The council paused. Perhaps the ancient and the modern could coexist, each enhancing the other.`;

const englishQuestions: Question[] = [
  { id: 'e1', section: 'english', text: `Read the passage:\n\n"${englishPassage}"\n\nWhat does Aria believe about knowledge?`, options: ['It should be guarded carefully', 'It multiplies when shared', 'It is more valuable than gold', 'It belongs to the elite'], type: 'mcq', difficulty: 2, topic: 'Comprehension' },
  { id: 'e2', section: 'english', text: 'What advantage does the physical library have over digital archives, according to the passage?', options: ['Serendipity of discovery', 'Faster access to information', 'Lower cost of maintenance', 'Better search algorithms'], type: 'mcq', difficulty: 3, topic: 'Comprehension' },
  { id: 'e3', section: 'english', text: 'What evidence did Aria present to the council?', options: ['23% better creative problem-solving scores', 'Increased student enrollment', 'Tourism revenue data', 'Historical significance certificates'], type: 'mcq', difficulty: 2, topic: 'Comprehension' },
  { id: 'e4', section: 'english', text: 'The word "serendipity" in the passage most nearly means:', options: ['Happy accident of discovery', 'Careful planning', 'Digital efficiency', 'Academic rigor'], type: 'mcq', difficulty: 3, topic: 'Vocabulary' },
];

const situationalQuestions: Question[] = [
  { id: 's1', section: 'situational', text: 'You spent 15 minutes on a question and realize your approach is wrong. You:', options: ['Start over with a new method immediately', 'Skip it and return later with fresh eyes', 'Feel frustrated and lose focus for 20+ minutes', 'Give up on it entirely'], type: 'mcq', difficulty: 0, topic: 'Exam Temperament' },
  { id: 's2', section: 'situational', text: 'Your friend scores higher than you in a surprise test. You:', options: ['Analyze what they did differently and learn', 'Feel motivated to work harder', 'Feel jealous and demotivated', 'Pretend you don\'t care'], type: 'mcq', difficulty: 0, topic: 'Pressure Handling' },
  { id: 's3', section: 'situational', text: 'During an exam, you notice a question from a chapter you skipped. You:', options: ['Attempt it using first principles and logic', 'Skip immediately and focus on known topics', 'Panic and lose confidence for remaining questions', 'Guess randomly and move on'], type: 'mcq', difficulty: 0, topic: 'Risk-Taking' },
  { id: 's4', section: 'situational', text: 'You have 15 minutes left and 10 questions unanswered. You:', options: ['Quickly scan all 10, attempt easiest first', 'Rush through all without checking', 'Focus on 5 questions properly, leave rest', 'Panic and freeze'], type: 'mcq', difficulty: 0, topic: 'Time Management' },
  { id: 's5', section: 'situational', text: 'Your study plan says "Physics today" but you feel like doing Math. You:', options: ['Stick to the plan—discipline over mood', 'Do Math since motivation is higher now', 'Do a bit of both to compromise', 'Skip studying entirely since you\'re conflicted'], type: 'mcq', difficulty: 0, topic: 'Discipline' },
  { id: 's6', section: 'situational', text: 'You get your phone notification while studying a complex derivation. You:', options: ['Ignore completely—phone is on silent during study', 'Glance quickly, takes 5 min to regain focus', 'Check it, end up scrolling for 15 minutes', 'Use it as a "reward break" for 30 minutes'], type: 'mcq', difficulty: 0, topic: 'Focus' },
  { id: 's7', section: 'situational', text: 'You fail a mock test badly. Next morning you:', options: ['Wake up early, analyze every wrong answer', 'Feel low but still show up to study', 'Skip studying for the day to recover emotionally', 'Question whether you should continue preparing'], type: 'mcq', difficulty: 0, topic: 'Resilience' },
  { id: 's8', section: 'situational', text: 'A difficult chapter has been pending for 2 weeks. You:', options: ['Schedule it as first task tomorrow—no escape', 'Break it into micro-topics and tackle one daily', 'Keep postponing—other chapters feel more urgent', 'Wait until a teacher explains it in class'], type: 'mcq', difficulty: 0, topic: 'Procrastination' },
];

const reflectionQuestions: Question[] = [
  { id: 'r1', section: 'reflection', text: 'Why do you want to crack JEE/NEET? Be completely honest—is it your dream or someone else\'s expectation?', type: 'open', difficulty: 0, topic: 'Motivation' },
  { id: 'r2', section: 'reflection', text: 'Describe your worst academic failure. How did you respond in the first 24 hours?', type: 'open', difficulty: 0, topic: 'Failure Response' },
  { id: 'r3', section: 'reflection', text: 'Describe your typical study day in detail—from waking up to sleeping. Be honest about distractions.', type: 'open', difficulty: 0, topic: 'Study Habits' },
];

const stressTestQuestions: Question[] = [
  { id: 'st1', section: 'stress', text: '47 + 86 = ?', type: 'calculation', difficulty: 1, topic: 'Mental Math' },
  { id: 'st2', section: 'stress', text: '15 × 12 = ?', type: 'calculation', difficulty: 2, topic: 'Mental Math' },
  { id: 'st3', section: 'stress', text: '144 ÷ 12 = ?', type: 'calculation', difficulty: 2, topic: 'Mental Math' },
  { id: 'st4', section: 'stress', text: '25² = ?', type: 'calculation', difficulty: 1, topic: 'Mental Math' },
  { id: 'st5', section: 'stress', text: '√225 = ?', type: 'calculation', difficulty: 2, topic: 'Mental Math' },
  { id: 'st6', section: 'stress', text: '73 - 48 = ?', type: 'calculation', difficulty: 1, topic: 'Mental Math' },
  { id: 'st7', section: 'stress', text: '64 × 7 = ?', type: 'calculation', difficulty: 2, topic: 'Mental Math' },
  { id: 'st8', section: 'stress', text: '999 + 456 = ?', type: 'calculation', difficulty: 2, topic: 'Mental Math' },
  { id: 'st9', section: 'stress', text: '2⁸ = ?', type: 'calculation', difficulty: 3, topic: 'Mental Math' },
  { id: 'st10', section: 'stress', text: '7! / 5! = ?', type: 'calculation', difficulty: 3, topic: 'Mental Math' },
];

export const stressTestCorrectAnswers: Record<string, string> = {
  st1: '133', st2: '180', st3: '12', st4: '625', st5: '15',
  st6: '25', st7: '448', st8: '1455', st9: '256', st10: '42',
};

export const correctAnswers: Record<string, number> = {
  m1: 0, m2: 0, m3: 0, m4: 0, m5: 0, m6: 0, m7: 0, m8: 1,
  p1: 0, p2: 2, p3: 0, p4: 0, p5: 0, p6: 0,
  c1: 0, c2: 0, c3: 0, c4: 0, c5: 0, c6: 0,
  b1: 0, b2: 0, b3: 0, b4: 0, b5: 0,
  e1: 1, e2: 0, e3: 0, e4: 0,
};

export interface TestSection {
  id: string;
  title: string;
  questions: Question[];
  timeLimit?: number;
}

export const testSections: TestSection[] = [
  { id: 'math', title: 'Mathematics', questions: mathQuestions, timeLimit: 10 },
  { id: 'physics', title: 'Physics', questions: physicsQuestions, timeLimit: 8 },
  { id: 'chemistry', title: 'Chemistry', questions: chemistryQuestions, timeLimit: 8 },
  { id: 'biology', title: 'Biology', questions: biologyQuestions, timeLimit: 6 },
  { id: 'english', title: 'English Comprehension', questions: englishQuestions, timeLimit: 3 },
  { id: 'situational', title: 'Situational Judgment', questions: situationalQuestions, timeLimit: 4 },
  { id: 'reflection', title: 'Self-Reflection', questions: reflectionQuestions, timeLimit: 2 },
  { id: 'stress', title: 'Concentration Stress Test', questions: stressTestQuestions, timeLimit: 5 },
];
