// Simple auth context for student and admin login (localStorage-based for MVP)
export interface Student {
  name: string;
  targetExam: 'JEE' | 'NEET' | 'Both';
  preboard1: Record<string, number>;
  preboard2: Record<string, number>;
}

export interface TestResult {
  studentId: string;
  student: Student;
  answers: Record<string, any>;
  timeSpent: number;
  completedAt: string;
  sectionScores: Record<string, number>;
  stressTestData: {
    avgResponseTime: number;
    accuracyUnderStress: number;
    distractionRecovery: number;
  };
}

const ADMIN_PASSWORD = 'admin@2026';

export function verifyAdmin(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export function saveStudentSession(student: Student): string {
  const id = crypto.randomUUID();
  localStorage.setItem('current_student', JSON.stringify({ ...student, id }));
  return id;
}

export function getCurrentStudent(): (Student & { id: string }) | null {
  const data = localStorage.getItem('current_student');
  return data ? JSON.parse(data) : null;
}

export function clearStudentSession() {
  localStorage.removeItem('current_student');
}

export function saveTestResult(result: TestResult) {
  const existing = getTestResults();
  existing.push(result);
  localStorage.setItem('test_results', JSON.stringify(existing));
}

export function getTestResults(): TestResult[] {
  const data = localStorage.getItem('test_results');
  return data ? JSON.parse(data) : [];
}
