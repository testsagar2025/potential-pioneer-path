import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, BookOpen, Brain, AlertTriangle, Pencil } from 'lucide-react';

const instructions = [
  { icon: Clock, text: 'Total duration: 45 minutes. Timer starts once you begin.' },
  { icon: BookOpen, text: '8 sections: Math, Physics, Chemistry, Biology, English, Situational Judgment, Self-Reflection, and Concentration Stress Test.' },
  { icon: Brain, text: 'Questions adapt to your level — difficulty increases or decreases based on your performance.' },
  { icon: AlertTriangle, text: 'The stress test section includes simulated distractions. Stay focused!' },
  { icon: Pencil, text: 'Use blank paper for rough work. All answers must be typed.' },
];

const Instructions = () => {
  const navigate = useNavigate();

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

          <div className="bg-accent/30 border border-accent rounded-lg p-4 text-center">
            <p className="font-body text-sm text-accent-foreground">
              <strong>Important:</strong> Your answers are auto-saved every 30 seconds. 
              The test will auto-submit when the timer reaches zero. Reports are <strong>only visible to administrators</strong>.
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
