import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getAllTestResults, checkIsAdmin, signOut, type TestResult } from '@/lib/auth';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Users, Eye, Download } from 'lucide-react';
import StudentReport from '@/components/StudentReport';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [results, setResults] = useState<TestResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingResults, setLoadingResults] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/admin-login'); return; }

    checkIsAdmin(user.id).then(isAdmin => {
      if (!isAdmin) { navigate('/admin-login'); return; }
      getAllTestResults().then(data => {
        setResults(data);
        setLoadingResults(false);
      });
    });
  }, [user, authLoading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const exportCSV = () => {
    const headers = ['Name', 'Roll No', 'Target Exam', 'Avg Score', 'Time (min)', 'Date'];
    const rows = filteredResults.map(r => {
      const scores = Object.values(r.sectionScores);
      const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
      return [r.student.name, '', r.student.targetExam, avg, Math.round(r.timeSpent / 60), new Date(r.completedAt).toLocaleDateString()];
    });
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'lfgos-cat-results.csv'; a.click();
  };

  const filteredResults = results.filter(r =>
    r.student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="font-display text-xl font-bold text-foreground">Admin Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportCSV} className="font-body">
              <Download className="h-4 w-4 mr-1" /> Export CSV
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
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <span className="text-lg">📊</span>
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
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <span className="text-lg">⏱</span>
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

        {/* Search & Results */}
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-lg">Student Results</CardTitle>
            <Input
              placeholder="Search by name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
          </CardHeader>
          <CardContent>
            {loadingResults ? (
              <div className="text-center py-12 text-muted-foreground font-body">Loading results...</div>
            ) : filteredResults.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground font-body">
                <p className="text-lg mb-2">No assessments found</p>
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
                    {filteredResults.map((r, i) => {
                      const scores = Object.values(r.sectionScores);
                      const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
                      return (
                        <tr key={r.id || i} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4 font-body font-medium text-foreground">{r.student.name}</td>
                          <td className="py-3 px-4 font-body text-muted-foreground">{r.student.targetExam}</td>
                          <td className="py-3 px-4">
                            <span className={`font-body font-medium ${avg >= 70 ? 'text-green-600' : avg >= 40 ? 'text-yellow-600' : 'text-destructive'}`}>
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
