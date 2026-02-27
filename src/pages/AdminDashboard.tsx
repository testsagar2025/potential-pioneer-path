import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTestResults, type TestResult } from '@/lib/auth';
import { LogOut, Users, Eye, Trash2 } from 'lucide-react';
import StudentReport from '@/components/StudentReport';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<TestResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);

  useEffect(() => {
    const isAdmin = localStorage.getItem('admin_auth');
    if (!isAdmin) {
      navigate('/admin-login');
      return;
    }
    setResults(getTestResults());
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    navigate('/');
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all test results? This cannot be undone.')) {
      localStorage.removeItem('test_results');
      setResults([]);
    }
  };

  if (selectedResult) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Button variant="ghost" onClick={() => setSelectedResult(null)} className="font-body">
              ← Back to Results
            </Button>
            <span className="font-body text-sm text-muted-foreground">
              Report: {selectedResult.student.name}
            </span>
          </div>
        </div>
        <StudentReport result={selectedResult} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="font-display text-xl font-bold text-foreground">Admin Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleClearAll} className="font-body text-destructive">
              <Trash2 className="h-4 w-4 mr-1" /> Clear All
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="font-body">
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="shadow-card">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display text-foreground">{results.length}</p>
                <p className="text-sm text-muted-foreground font-body">Total Assessments</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <span className="text-success text-lg">📊</span>
              </div>
              <div>
                <p className="text-2xl font-bold font-display text-foreground">
                  {results.length > 0 ? Math.round(results.reduce((sum, r) => {
                    const scores = Object.values(r.sectionScores);
                    return sum + (scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0);
                  }, 0) / results.length) : 0}%
                </p>
                <p className="text-sm text-muted-foreground font-body">Avg Score</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-info/10 flex items-center justify-center">
                <span className="text-info text-lg">⏱</span>
              </div>
              <div>
                <p className="text-2xl font-bold font-display text-foreground">
                  {results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.timeSpent, 0) / results.length / 60) : 0} min
                </p>
                <p className="text-sm text-muted-foreground font-body">Avg Time</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results table */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg">Student Results</CardTitle>
          </CardHeader>
          <CardContent>
            {results.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground font-body">
                <p className="text-lg mb-2">No assessments completed yet</p>
                <p className="text-sm">Results will appear here once students complete their tests.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-body text-sm text-muted-foreground font-medium">Student</th>
                      <th className="text-left py-3 px-4 font-body text-sm text-muted-foreground font-medium">Target</th>
                      <th className="text-left py-3 px-4 font-body text-sm text-muted-foreground font-medium">Avg Score</th>
                      <th className="text-left py-3 px-4 font-body text-sm text-muted-foreground font-medium">Time</th>
                      <th className="text-left py-3 px-4 font-body text-sm text-muted-foreground font-medium">Date</th>
                      <th className="text-right py-3 px-4 font-body text-sm text-muted-foreground font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => {
                      const scores = Object.values(r.sectionScores);
                      const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
                      return (
                        <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4 font-body font-medium text-foreground">{r.student.name}</td>
                          <td className="py-3 px-4 font-body text-muted-foreground">{r.student.targetExam}</td>
                          <td className="py-3 px-4">
                            <span className={`font-body font-medium ${avg >= 70 ? 'text-success' : avg >= 40 ? 'text-warning' : 'text-destructive'}`}>
                              {avg}%
                            </span>
                          </td>
                          <td className="py-3 px-4 font-body text-muted-foreground">{Math.round(r.timeSpent / 60)} min</td>
                          <td className="py-3 px-4 font-body text-muted-foreground text-sm">{new Date(r.completedAt).toLocaleDateString()}</td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="outline" size="sm" onClick={() => setSelectedResult(r)} className="font-body">
                              <Eye className="h-4 w-4 mr-1" /> View Report
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
