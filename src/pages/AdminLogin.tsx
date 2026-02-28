import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Lock } from 'lucide-react';
import { signIn, checkIsAdmin } from '@/lib/auth';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const { user } = await signIn(email, password);
      const isAdmin = await checkIsAdmin(user.id);
      if (!isAdmin) {
        setError('Access denied. This account does not have admin privileges.');
        return;
      }
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-card">
        <CardHeader className="text-center">
          <Button variant="ghost" size="sm" className="absolute left-4 top-4" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <div className="mx-auto mb-2 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="font-display text-2xl">Admin Portal</CardTitle>
          <CardDescription className="font-body">Login with admin credentials to access reports</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="font-body">Email Address</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter admin email" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="password" className="font-body">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter admin password" className="mt-1" />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full bg-gradient-hero text-primary-foreground font-body py-5">
              {loading ? 'Verifying...' : 'Access Dashboard'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
