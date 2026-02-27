import { type TestResult } from '@/lib/auth';
import { testSections } from '@/lib/questions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  result: TestResult;
}

const riskColor = (score: number) => {
  if (score >= 70) return 'text-success';
  if (score >= 40) return 'text-warning';
  return 'text-destructive';
};

const riskLabel = (score: number) => {
  if (score >= 70) return '🟢 Green';
  if (score >= 40) return '🟡 Yellow';
  return '🔴 Red';
};

const StudentReport = ({ result }: Props) => {
  const { student, sectionScores, stressTestData, answers, timeSpent } = result;

  const allScores = Object.values(sectionScores);
  const overallAvg = allScores.length ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0;

  // Competitive readiness score (simplified calculation)
  const academicWeight = overallAvg * 0.5;
  const stressWeight = stressTestData.accuracyUnderStress * 0.2;
  const staminaWeight = stressTestData.distractionRecovery * 0.15;
  const timeWeight = Math.min(100, (timeSpent / (45 * 60)) * 100) * 0.15;
  const competitiveScore = Math.round(academicWeight + stressWeight + staminaWeight + timeWeight);

  // Derive personality insights from situational answers
  const situationalAnswers = testSections
    .find(s => s.id === 'situational')
    ?.questions.map(q => ({ topic: q.topic, answer: answers[q.id] }))
    .filter(a => a.answer !== undefined) || [];

  const reflectionAnswers = testSections
    .find(s => s.id === 'reflection')
    ?.questions.map(q => ({ topic: q.topic, answer: answers[q.id] }))
    .filter(a => a.answer) || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Diagnostic Report</h1>
        <p className="font-body text-muted-foreground mt-1">{student.name} • Target: {student.targetExam}</p>
        <p className="font-body text-sm text-muted-foreground">Completed: {new Date(result.completedAt).toLocaleString()}</p>
      </div>

      {/* Competitive Readiness Score */}
      <Card className="shadow-card">
        <CardContent className="p-8 text-center">
          <p className="font-body text-sm text-muted-foreground uppercase tracking-wider mb-2">Competitive Readiness Score</p>
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={competitiveScore >= 70 ? 'hsl(var(--success))' : competitiveScore >= 40 ? 'hsl(var(--warning))' : 'hsl(var(--destructive))'}
                strokeWidth="3"
                strokeDasharray={`${competitiveScore}, 100`}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-display text-3xl font-bold text-foreground">
              {competitiveScore}
            </span>
          </div>
          <p className={`font-body font-medium ${riskColor(competitiveScore)}`}>
            {competitiveScore >= 75 ? 'Strong Potential' : competitiveScore >= 50 ? 'Moderate Potential' : 'Needs Significant Development'}
          </p>
        </CardContent>
      </Card>

      {/* Subject-wise Risk Assessment */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-display text-xl">Subject-wise Risk Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['math', 'physics', 'chemistry', 'biology', 'english'].map(subj => {
              const score = sectionScores[subj] ?? 0;
              const label = testSections.find(s => s.id === subj)?.title || subj;
              return (
                <div key={subj} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-body font-medium text-foreground">{label}</p>
                    <p className="font-body text-sm text-muted-foreground">{riskLabel(score)}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-display text-2xl font-bold ${riskColor(score)}`}>{score}%</p>
                    <div className="w-24 h-2 rounded-full bg-muted mt-1 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${score >= 70 ? 'bg-success' : score >= 40 ? 'bg-warning' : 'bg-destructive'}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Preboard Trajectory */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-display text-xl">Preboard Trajectory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 font-body text-sm text-muted-foreground">Subject</th>
                  <th className="text-center py-2 px-3 font-body text-sm text-muted-foreground">Preboard 1</th>
                  <th className="text-center py-2 px-3 font-body text-sm text-muted-foreground">Preboard 2</th>
                  <th className="text-center py-2 px-3 font-body text-sm text-muted-foreground">Trend</th>
                </tr>
              </thead>
              <tbody>
                {['Physics', 'Chemistry', 'Math', 'Biology', 'English'].map(sub => {
                  const pb1 = student.preboard1[sub] ?? 0;
                  const pb2 = student.preboard2[sub] ?? 0;
                  const diff = pb2 - pb1;
                  return (
                    <tr key={sub} className="border-b border-border last:border-0">
                      <td className="py-2 px-3 font-body text-foreground">{sub}</td>
                      <td className="py-2 px-3 font-body text-center text-muted-foreground">{pb1}</td>
                      <td className="py-2 px-3 font-body text-center text-muted-foreground">{pb2}</td>
                      <td className={`py-2 px-3 font-body text-center font-medium ${diff > 0 ? 'text-success' : diff < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {diff > 0 ? `↑ +${diff}` : diff < 0 ? `↓ ${diff}` : '→ 0'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Cognitive Stamina Profile */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-display text-xl">Cognitive Stamina Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="font-body text-sm text-muted-foreground mb-1">Avg Response Time</p>
              <p className="font-display text-2xl font-bold text-foreground">{(stressTestData.avgResponseTime / 1000).toFixed(1)}s</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="font-body text-sm text-muted-foreground mb-1">Accuracy Under Stress</p>
              <p className={`font-display text-2xl font-bold ${riskColor(stressTestData.accuracyUnderStress)}`}>{stressTestData.accuracyUnderStress}%</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="font-body text-sm text-muted-foreground mb-1">Distraction Recovery</p>
              <p className={`font-display text-2xl font-bold ${riskColor(stressTestData.distractionRecovery)}`}>{stressTestData.distractionRecovery}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Situational Judgment Summary */}
      {situationalAnswers.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-xl">Personality & Temperament</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {situationalAnswers.map((sa, i) => {
                const section = testSections.find(s => s.id === 'situational');
                const q = section?.questions[i];
                const optionText = q?.options?.[sa.answer] || 'N/A';
                return (
                  <div key={i} className="p-3 rounded-lg bg-muted/50">
                    <p className="font-body text-xs text-primary font-medium uppercase tracking-wider mb-1">{sa.topic}</p>
                    <p className="font-body text-sm text-foreground">{optionText}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reflection Responses */}
      {reflectionAnswers.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-xl">Self-Reflection Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reflectionAnswers.map((ra, i) => (
                <div key={i} className="p-4 rounded-lg bg-muted/50">
                  <p className="font-body text-xs text-primary font-medium uppercase tracking-wider mb-2">{ra.topic}</p>
                  <p className="font-body text-sm text-foreground whitespace-pre-wrap">{ra.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Time Analysis */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <p className="font-body text-sm text-muted-foreground">
            Total time spent: <strong className="text-foreground">{Math.round(timeSpent / 60)} minutes</strong> out of 45 minutes
            ({Math.round((timeSpent / (45 * 60)) * 100)}% utilized)
          </p>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground font-body pb-8">
        This report is for administrative use only. No recommendations or study plans are included.
      </p>
    </div>
  );
};

export default StudentReport;
