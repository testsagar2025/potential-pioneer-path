import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { signOut } from '@/lib/auth';

const TestComplete = () => {
  const navigate = useNavigate();

  const handleDone = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-card text-center animate-fade-up">
        <CardContent className="p-8">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-3">Assessment Complete!</h1>
          <p className="font-body text-muted-foreground mb-2">
            Your responses have been recorded successfully.
          </p>
          <p className="font-body text-sm text-muted-foreground mb-8">
            Your detailed diagnostic report will be reviewed by the administration.
            Results are <strong>only accessible through the admin portal</strong>.
          </p>
          <Button onClick={handleDone} className="bg-gradient-hero text-primary-foreground font-body px-8 py-5">
            Return to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestComplete;
