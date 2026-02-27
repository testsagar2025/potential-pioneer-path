import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

const StudentLogin = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !rollNumber.trim()) {
      setError('Please fill in all fields');
      return;
    }
    // Store basic info, move to onboarding
    localStorage.setItem('student_name', name.trim());
    localStorage.setItem('student_roll', rollNumber.trim());
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-card">
        <CardHeader className="text-center">
          <Button variant="ghost" size="sm" className="absolute left-4 top-4" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <CardTitle className="font-display text-2xl">Student Login</CardTitle>
          <CardDescription className="font-body">Enter your details to begin the assessment</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="name" className="font-body">Full Name</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your full name" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="roll" className="font-body">Roll Number</Label>
              <Input id="roll" value={rollNumber} onChange={e => setRollNumber(e.target.value)} placeholder="Enter your roll number" className="mt-1" />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full bg-gradient-hero text-primary-foreground font-body py-5">
              Continue to Assessment
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentLogin;
