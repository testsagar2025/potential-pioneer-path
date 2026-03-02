import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { signUp } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !rollNumber.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, name.trim(), rollNumber.trim(), phone.trim());
      toast({
        title: 'Registration Successful!',
        description: 'You are now logged in. Redirecting...',
      });
      navigate('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md shadow-card">
        <CardHeader className="text-center">
          <Button variant="ghost" size="sm" className="absolute left-4 top-4" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <div className="mx-auto mb-2 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <UserPlus className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="font-display text-2xl">Student Registration</CardTitle>
          <CardDescription className="font-body">Create your account for the LFGOS CAT Examination</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label htmlFor="name" className="font-body">Full Name *</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your full name" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="roll" className="font-body">Roll Number *</Label>
              <Input id="roll" value={rollNumber} onChange={e => setRollNumber(e.target.value)} placeholder="Enter your roll number" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="phone" className="font-body">Phone Number</Label>
              <Input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Enter your phone number" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email" className="font-body">Email Address *</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="password" className="font-body">Password *</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password (min 6 chars)" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="font-body">Confirm Password *</Label>
              <Input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm your password" className="mt-1" />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full bg-gradient-hero text-primary-foreground font-body py-5">
              {loading ? 'Creating Account...' : 'Register'}
            </Button>
            <p className="text-center text-sm text-muted-foreground font-body">
              Already have an account?{' '}
              <button type="button" onClick={() => navigate('/student-login')} className="text-primary underline">Login here</button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
