import { supabase } from '@/integrations/supabase/client';

export interface Student {
  name: string;
  targetExam: 'JEE' | 'NEET' | 'Both';
  preboard1: Record<string, number>;
  preboard2: Record<string, number>;
}

export interface TestResult {
  id?: string;
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

// Auth functions
export async function signUp(email: string, password: string, fullName: string, rollNumber: string, phone: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: window.location.origin,
    },
  });
  if (error) throw error;

  // Update profile with roll number and phone after signup
  if (data.user) {
    await supabase.from('profiles').update({ roll_number: rollNumber, phone, full_name: fullName }).eq('user_id', data.user.id);
  }

  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase.from('profiles').select('*').eq('user_id', userId).single();
  if (error) throw error;
  return data;
}

export async function checkIsAdmin(userId: string): Promise<boolean> {
  const { data } = await supabase.from('user_roles').select('role').eq('user_id', userId).eq('role', 'admin');
  return (data && data.length > 0) || false;
}

export async function getStudentOnboarding(userId: string) {
  const { data } = await supabase.from('student_onboarding').select('*').eq('user_id', userId).single();
  return data;
}

export async function saveStudentOnboarding(userId: string, targetExam: string, preboard1: Record<string, number>, preboard2: Record<string, number>) {
  const { error } = await supabase.from('student_onboarding').upsert({
    user_id: userId,
    target_exam: targetExam,
    preboard1,
    preboard2,
  }, { onConflict: 'user_id' });
  if (error) throw error;
}

export async function saveTestResult(userId: string, result: Omit<TestResult, 'studentId'>) {
  const { error } = await supabase.from('test_results').insert({
    user_id: userId,
    answers: result.answers,
    section_scores: result.sectionScores,
    stress_test_data: result.stressTestData,
    time_spent: result.timeSpent,
  });
  if (error) throw error;
}

export async function getAllTestResults() {
  const { data: results, error } = await supabase.from('test_results').select('*').order('completed_at', { ascending: false });
  if (error) throw error;

  // Get all profiles and onboarding data
  const { data: profiles } = await supabase.from('profiles').select('*');
  const { data: onboarding } = await supabase.from('student_onboarding').select('*');

  return (results || []).map((r: any) => {
    const profile = profiles?.find((p: any) => p.user_id === r.user_id);
    const ob = onboarding?.find((o: any) => o.user_id === r.user_id);
    return {
      id: r.id,
      studentId: r.user_id,
      student: {
        name: profile?.full_name || 'Unknown',
        targetExam: ob?.target_exam || 'JEE',
        preboard1: ob?.preboard1 || {},
        preboard2: ob?.preboard2 || {},
      },
      answers: r.answers,
      timeSpent: r.time_spent,
      completedAt: r.completed_at,
      sectionScores: r.section_scores,
      stressTestData: r.stress_test_data,
    } as TestResult;
  });
}

// Legacy helpers kept for backward compat
export function clearStudentSession() {
  localStorage.removeItem('current_student');
}
