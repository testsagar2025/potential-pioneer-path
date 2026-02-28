import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, BookOpen, Brain, AlertTriangle, Pencil } from 'lucide-react';

const instructions = [
  { icon: Clock, text: 'Each section has its own timer. The section auto-submits when time runs out.' },
  { icon: BookOpen, text: '8 sections: Math (10 min), Physics (8 min), Chemistry (8 min), Biology (6 min), English (3 min), Situational Judgment (4 min), Self-Reflection (2 min), Concentration Stress Test (5 min).' },
  { icon: Brain, text: 'The stress test gives you 30 seconds per question with a visible countdown. Speed matters!' },
  { icon: AlertTriangle, text: 'The stress test section includes simulated distractions. Stay focused!' },
  { icon: Pencil, text: 'Use blank paper for rough work. All answers must be typed.' },
];

const Instructions = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) navigate('/student-login');
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-2xl shadow-card animate-fade-up">
        <CardHeader className="text-center">
          <CardTitle className="font-display text-3xl">Before You Begin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {instructions.map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                <div className="mt-0.5 w-10 h-10 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="font-body text-foreground leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
            <p className="font-body text-sm text-foreground">
              <strong>Important:</strong> Your answers are auto-saved every 30 seconds.
              Reports are <strong>only visible to administrators</strong>.
            </p>
          </div>

          <Button
            onClick={() => navigate('/test')}
            className="w-full bg-gradient-hero text-primary-foreground font-body py-6 text-lg shadow-glow hover:opacity-90 transition-opacity"
          >
            Start Assessment
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Instructions;
