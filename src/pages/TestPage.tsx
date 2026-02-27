import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { testSections, correctAnswers, stressTestCorrectAnswers, type Question } from '@/lib/questions';
import { getCurrentStudent, saveTestResult, type TestResult } from '@/lib/auth';
import { Clock, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';

const TOTAL_TIME = 45 * 60; // 45 minutes in seconds

const TestPage = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [stressStartTime, setStressStartTime] = useState<Record<string, number>>({});
  const [stressResponseTimes, setStressResponseTimes] = useState<Record<string, number>>({});
  const [showDistraction, setShowDistraction] = useState(false);
  const [distractionType, setDistractionType] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const submitted = useRef(false);

  const student = getCurrentStudent();

  // Redirect if no student session
  useEffect(() => {
    if (!student) navigate('/');
  }, [student, navigate]);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-save every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem('test_autosave', JSON.stringify({ answers, timeLeft, currentSection, currentQuestion }));
    }, 30000);
    return () => clearInterval(interval);
  }, [answers, timeLeft, currentSection, currentQuestion]);

  // Stress test distractions
  useEffect(() => {
    if (testSections[currentSection]?.id !== 'stress') return;

    const distractionInterval = setInterval(() => {
      const type = Math.floor(Math.random() * 3);
      setDistractionType(type);
      if (type === 2) {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
      } else {
        setShowDistraction(true);
        setTimeout(() => setShowDistraction(false), 3000);
      }
    }, 8000);

    return () => clearInterval(distractionInterval);
  }, [currentSection]);

  // Track stress test question start time
  useEffect(() => {
    const section = testSections[currentSection];
    if (section?.id === 'stress') {
      const q = section.questions[currentQuestion];
      if (q && !stressStartTime[q.id]) {
        setStressStartTime(prev => ({ ...prev, [q.id]: Date.now() }));
      }
    }
  }, [currentSection, currentQuestion]);

  const handleSubmit = useCallback(() => {
    if (submitted.current) return;
    submitted.current = true;

    // Calculate scores
    const sectionScores: Record<string, number> = {};
    testSections.forEach(section => {
      if (section.id === 'situational' || section.id === 'reflection') return;
      let correct = 0;
      let total = 0;
      section.questions.forEach(q => {
        if (section.id === 'stress') {
          total++;
          if (answers[q.id]?.toString().trim() === stressTestCorrectAnswers[q.id]) correct++;
        } else if (q.type === 'mcq' && correctAnswers[q.id] !== undefined) {
          total++;
          if (answers[q.id] === correctAnswers[q.id]) correct++;
        }
      });
      if (total > 0) sectionScores[section.id] = Math.round((correct / total) * 100);
    });

    // Stress test analytics
    const stressTimes = Object.values(stressResponseTimes);
    const avgResponseTime = stressTimes.length ? stressTimes.reduce((a, b) => a + b, 0) / stressTimes.length : 0;
    
    let stressCorrect = 0;
    testSections.find(s => s.id === 'stress')?.questions.forEach(q => {
      if (answers[q.id]?.toString().trim() === stressTestCorrectAnswers[q.id]) stressCorrect++;
    });

    const result: TestResult = {
      studentId: student?.id || '',
      student: student!,
      answers,
      timeSpent: TOTAL_TIME - timeLeft,
      completedAt: new Date().toISOString(),
      sectionScores,
      stressTestData: {
        avgResponseTime: Math.round(avgResponseTime),
        accuracyUnderStress: Math.round((stressCorrect / 10) * 100),
        distractionRecovery: Math.round(avgResponseTime < 5000 ? 85 : avgResponseTime < 10000 ? 60 : 35),
      },
    };

    saveTestResult(result);
    localStorage.removeItem('test_autosave');
    navigate('/complete');
  }, [answers, timeLeft, student, stressResponseTimes, navigate]);

  const section = testSections[currentSection];
  const question = section?.questions[currentQuestion];

  const totalQuestions = testSections.reduce((sum, s) => sum + s.questions.length, 0);
  const answeredQuestions = testSections.reduce((sum, s, si) => {
    if (si < currentSection) return sum + s.questions.length;
    if (si === currentSection) return sum + currentQuestion;
    return sum;
  }, 0);
  const progress = (answeredQuestions / totalQuestions) * 100;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const setAnswer = (qId: string, value: any) => {
    // Track stress test response time
    if (section?.id === 'stress' && stressStartTime[qId]) {
      setStressResponseTimes(prev => ({ ...prev, [qId]: Date.now() - stressStartTime[qId] }));
    }
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const goNext = () => {
    if (currentQuestion < section.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else if (currentSection < testSections.length - 1) {
      setCurrentSection(prev => prev + 1);
      setCurrentQuestion(0);
    } else {
      handleSubmit();
    }
  };

  const goPrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    } else if (currentSection > 0) {
      const prevSection = testSections[currentSection - 1];
      setCurrentSection(prev => prev - 1);
      setCurrentQuestion(prevSection.questions.length - 1);
    }
  };

  const isLastQuestion = currentSection === testSections.length - 1 && currentQuestion === section.questions.length - 1;

  if (!question) return null;

  return (
    <div className={`min-h-screen bg-background flex flex-col ${isShaking ? 'animate-shake' : ''}`}>
      {/* Distraction overlays */}
      {showDistraction && distractionType === 0 && (
        <div className="fixed top-4 right-4 z-50 bg-card border border-border rounded-lg shadow-card-hover p-4 max-w-xs animate-fade-in">
          <p className="text-sm font-body text-foreground font-medium">📱 New message from Mom</p>
          <p className="text-xs text-muted-foreground mt-1">Don't forget to eat your lunch...</p>
          <Button variant="ghost" size="sm" className="mt-2 text-xs" onClick={() => setShowDistraction(false)}>Dismiss</Button>
        </div>
      )}
      {showDistraction && distractionType === 1 && (
        <div className="fixed bottom-4 left-4 z-50 bg-card border border-border rounded-lg shadow-card-hover p-4 max-w-xs animate-fade-in">
          <p className="text-sm font-body text-foreground font-medium">🔔 Instagram: Your friend posted a story!</p>
          <div className="flex gap-2 mt-2">
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => setShowDistraction(false)}>Ignore</Button>
            <Button variant="ghost" size="sm" className="text-xs text-primary" onClick={() => setShowDistraction(false)}>View</Button>
          </div>
        </div>
      )}

      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="font-body text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{section.title}</span>
            <span className="mx-2">•</span>
            <span>Q{currentQuestion + 1}/{section.questions.length}</span>
          </div>
          <div className={`flex items-center gap-2 font-body font-mono text-lg ${timeLeft < 300 ? 'text-destructive animate-pulse-soft' : 'text-foreground'}`}>
            <Clock className="h-4 w-4" />
            {formatTime(timeLeft)}
          </div>
        </div>
        <div className="max-w-4xl mx-auto mt-2">
          <Progress value={progress} className="h-1.5" />
        </div>
      </div>

      {/* Section tabs */}
      <div className="border-b border-border bg-card overflow-x-auto">
        <div className="max-w-4xl mx-auto flex px-4">
          {testSections.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { setCurrentSection(i); setCurrentQuestion(0); }}
              className={`px-3 py-2 text-xs font-body whitespace-nowrap border-b-2 transition-colors ${
                i === currentSection
                  ? 'border-primary text-primary font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Question area */}
      <main className="flex-1 flex items-start justify-center px-4 py-8">
        <Card className="w-full max-w-3xl shadow-card animate-fade-in">
          <CardContent className="p-6 md:p-8">
            {question.topic && (
              <span className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-body mb-4">
                {question.topic}
              </span>
            )}
            
            <h2 className="font-body text-lg md:text-xl leading-relaxed text-foreground whitespace-pre-line mb-6">
              {question.text}
            </h2>

            {/* MCQ options */}
            {question.type === 'mcq' && question.options && (
              <div className="space-y-3">
                {question.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setAnswer(question.id, i)}
                    className={`w-full text-left p-4 rounded-lg border transition-all font-body ${
                      answers[question.id] === i
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border hover:border-primary/30 hover:bg-muted/50'
                    }`}
                  >
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm mr-3 ${
                      answers[question.id] === i
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* Open-ended */}
            {question.type === 'open' && (
              <Textarea
                value={answers[question.id] || ''}
                onChange={e => setAnswer(question.id, e.target.value)}
                placeholder="Write your honest response here..."
                className="min-h-[150px] font-body"
              />
            )}

            {/* Calculation */}
            {question.type === 'calculation' && (
              <Input
                value={answers[question.id] || ''}
                onChange={e => setAnswer(question.id, e.target.value)}
                placeholder="Type your answer..."
                className="text-lg font-body"
                autoFocus
              />
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <Button
                variant="outline"
                onClick={goPrev}
                disabled={currentSection === 0 && currentQuestion === 0}
                className="font-body"
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>

              {section.id === 'stress' && (
                <div className="flex items-center gap-2 text-sm text-warning">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-body">Speed matters!</span>
                </div>
              )}

              <Button
                onClick={goNext}
                className={`font-body ${isLastQuestion ? 'bg-success hover:bg-success/90 text-success-foreground' : 'bg-gradient-hero text-primary-foreground'}`}
              >
                {isLastQuestion ? 'Submit Test' : 'Next'} <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Rough work reminder */}
      <div className="text-center py-2 text-xs text-muted-foreground font-body border-t border-border bg-card">
        📝 Use blank paper for rough calculations
      </div>
    </div>
  );
};

export default TestPage;
