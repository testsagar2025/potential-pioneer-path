import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { saveStudentOnboarding, getStudentOnboarding } from '@/lib/auth';

const subjects = ['Physics', 'Chemistry', 'Math', 'Biology', 'English'];

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [targetExam, setTargetExam] = useState<'JEE' | 'NEET' | 'Both'>('JEE');
  const [preboard1, setPreboard1] = useState<Record<string, number>>({});
  const [preboard2, setPreboard2] = useState<Record<string, number>>({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate('/student-login');
  }, [user, loading, navigate]);

  // Load existing onboarding data
  useEffect(() => {
    if (user) {
      getStudentOnboarding(user.id).then(data => {
        if (data) {
          setTargetExam(data.target_exam as 'JEE' | 'NEET' | 'Both');
          setPreboard1(data.preboard1 as Record<string, number> || {});
          setPreboard2(data.preboard2 as Record<string, number> || {});
        }
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      await saveStudentOnboarding(user.id, targetExam, preboard1, preboard2);
      navigate('/instructions');
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    } finally {
      setSubmitting(false);
    }
  };

  const updateMarks = (
    setter: React.Dispatch<React.SetStateAction<Record<string, number>>>,
    subject: string,
    value: string
  ) => {
    const num = parseInt(value) || 0;
    setter(prev => ({ ...prev, [subject]: Math.min(100, Math.max(0, num)) }));
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-2xl shadow-card">
        <CardHeader className="text-center">
          <CardTitle className="font-display text-2xl">Academic Profile</CardTitle>
          <CardDescription className="font-body">Help us understand your current standing</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Target Exam */}
            <div>
              <Label className="font-body font-medium">Target Exam</Label>
              <div className="flex gap-3 mt-2">
                {(['JEE', 'NEET', 'Both'] as const).map(exam => (
                  <Button
                    key={exam}
                    type="button"
                    variant={targetExam === exam ? 'default' : 'outline'}
                    className={targetExam === exam ? 'bg-gradient-hero text-primary-foreground' : ''}
                    onClick={() => setTargetExam(exam)}
                  >
                    {exam}
                  </Button>
                ))}
              </div>
            </div>

            {/* Preboard 1 */}
            <div>
              <Label className="font-body font-medium">Preboard 1 Marks (out of 100)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {subjects.map(sub => (
                  <div key={`pb1-${sub}`}>
                    <Label className="text-sm text-muted-foreground">{sub}</Label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={preboard1[sub] || ''}
                      onChange={e => updateMarks(setPreboard1, sub, e.target.value)}
                      placeholder="0-100"
                      className="mt-1"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Preboard 2 */}
            <div>
              <Label className="font-body font-medium">Preboard 2 Marks (out of 100)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {subjects.map(sub => (
                  <div key={`pb2-${sub}`}>
                    <Label className="text-sm text-muted-foreground">{sub}</Label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={preboard2[sub] || ''}
                      onChange={e => updateMarks(setPreboard2, sub, e.target.value)}
                      placeholder="0-100"
                      className="mt-1"
                    />
                  </div>
                ))}
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={submitting} className="w-full bg-gradient-hero text-primary-foreground font-body py-5 text-lg">
              {submitting ? 'Saving...' : 'Continue to Instructions'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
