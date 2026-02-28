import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { testSections, correctAnswers, stressTestCorrectAnswers, type Question } from '@/lib/questions';
import { saveTestResult } from '@/lib/auth';
import { useAuth } from '@/hooks/useAuth';
import { Clock, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';

// Section time limits in seconds
const SECTION_TIMES: Record<string, number> = {
  math: 10 * 60,
  physics: 8 * 60,
  chemistry: 8 * 60,
  biology: 6 * 60,
  english: 3 * 60,
  situational: 4 * 60,
  reflection: 2 * 60,
  stress: 5 * 60,
};

const STRESS_QUESTION_TIME = 30; // 30 seconds per stress question

const TestPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [sectionTimeLeft, setSectionTimeLeft] = useState<number>(SECTION_TIMES[testSections[0].id]);
  const [stressQuestionTime, setStressQuestionTime] = useState(STRESS_QUESTION_TIME);
  const [stressStartTime, setStressStartTime] = useState<Record<string, number>>({});
  const [stressResponseTimes, setStressResponseTimes] = useState<Record<string, number>>({});
  const [stressSpeedIndicators, setStressSpeedIndicators] = useState<Record<string, string>>({});
  const [showDistraction, setShowDistraction] = useState(false);
  const [distractionType, setDistractionType] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [questionStatus, setQuestionStatus] = useState<Record<string, 'not-visited' | 'visited' | 'answered'>>({});
  const submitted = useRef(false);

  useEffect(() => {
    if (!authLoading && !user) navigate('/');
  }, [user, authLoading, navigate]);

  // Section timer
  useEffect(() => {
    const sectionId = testSections[currentSection]?.id;
    if (!sectionId) return;

    // For stress test, use per-question timer instead
    if (sectionId === 'stress') return;

    setSectionTimeLeft(SECTION_TIMES[sectionId]);
  }, [currentSection]);

  useEffect(() => {
    const sectionId = testSections[currentSection]?.id;
    if (sectionId === 'stress') return;

    const interval = setInterval(() => {
      setSectionTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          autoSubmitSection();
          return 0;
        }
        // Show warning
        const warningThreshold = sectionId === 'english' ? 60 : 120;
        if (prev === warningThreshold + 1) {
          setShowTimeWarning(true);
          setTimeout(() => setShowTimeWarning(false), 3000);
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentSection]);

  // Stress test per-question timer
  useEffect(() => {
    const sectionId = testSections[currentSection]?.id;
    if (sectionId !== 'stress') return;

    setStressQuestionTime(STRESS_QUESTION_TIME);
    const interval = setInterval(() => {
      setStressQuestionTime(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          goNextStress();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentSection, currentQuestion]);

  // Track stress question start time
  useEffect(() => {
    const section = testSections[currentSection];
    if (section?.id === 'stress') {
      const q = section.questions[currentQuestion];
      if (q && !stressStartTime[q.id]) {
        setStressStartTime(prev => ({ ...prev, [q.id]: Date.now() }));
      }
    }
  }, [currentSection, currentQuestion]);

  // Mark question as visited
  useEffect(() => {
    const q = testSections[currentSection]?.questions[currentQuestion];
    if (q && !questionStatus[q.id]) {
      setQuestionStatus(prev => ({ ...prev, [q.id]: 'visited' }));
    }
  }, [currentSection, currentQuestion]);

  // Auto-save every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem('test_autosave', JSON.stringify({ answers, currentSection, currentQuestion }));
    }, 30000);
    return () => clearInterval(interval);
  }, [answers, currentSection, currentQuestion]);

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

  const autoSubmitSection = () => {
    if (currentSection < testSections.length - 1) {
      setCurrentSection(prev => prev + 1);
      setCurrentQuestion(0);
    } else {
      handleSubmit();
    }
  };

  const goNextStress = () => {
    const section = testSections[currentSection];
    if (currentQuestion < section.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else if (currentSection < testSections.length - 1) {
      setCurrentSection(prev => prev + 1);
      setCurrentQuestion(0);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = useCallback(async () => {
    if (submitted.current || !user) return;
    submitted.current = true;

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

    const stressTimes = Object.values(stressResponseTimes);
    const avgResponseTime = stressTimes.length ? stressTimes.reduce((a, b) => a + b, 0) / stressTimes.length : 0;

    let stressCorrect = 0;
    testSections.find(s => s.id === 'stress')?.questions.forEach(q => {
      if (answers[q.id]?.toString().trim() === stressTestCorrectAnswers[q.id]) stressCorrect++;
    });

    const totalTime = Object.values(SECTION_TIMES).reduce((a, b) => a + b, 0);

    try {
      await saveTestResult(user.id, {
        student: { name: '', targetExam: 'JEE', preboard1: {}, preboard2: {} },
        answers,
        timeSpent: totalTime,
        completedAt: new Date().toISOString(),
        sectionScores,
        stressTestData: {
          avgResponseTime: Math.round(avgResponseTime),
          accuracyUnderStress: Math.round((stressCorrect / 10) * 100),
          distractionRecovery: Math.round(avgResponseTime < 5000 ? 85 : avgResponseTime < 10000 ? 60 : 35),
        },
      });
    } catch (e) {
      console.error('Failed to save result', e);
    }

    localStorage.removeItem('test_autosave');
    navigate('/complete');
  }, [answers, user, stressResponseTimes, navigate]);

  const section = testSections[currentSection];
  const question = section?.questions[currentQuestion];
  const isStress = section?.id === 'stress';

  const totalQuestions = testSections.reduce((sum, s) => sum + s.questions.length, 0);
  const answeredQuestions = Object.keys(answers).length;
  const progress = (answeredQuestions / totalQuestions) * 100;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const setAnswer = (qId: string, value: any) => {
    if (isStress && stressStartTime[qId]) {
      const elapsed = Date.now() - stressStartTime[qId];
      setStressResponseTimes(prev => ({ ...prev, [qId]: elapsed }));
      const speed = elapsed < 10000 ? 'Fast 🟢' : elapsed < 20000 ? 'Good 🟡' : 'Slow 🔴';
      setStressSpeedIndicators(prev => ({ ...prev, [qId]: speed }));
    }
    setAnswers(prev => ({ ...prev, [qId]: value }));
    setQuestionStatus(prev => ({ ...prev, [qId]: 'answered' }));
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
    if (isStress) return; // No going back in stress test
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    } else if (currentSection > 0) {
      const prevSection = testSections[currentSection - 1];
      if (prevSection.id === 'stress') return; // Can't go back to stress test
      setCurrentSection(prev => prev - 1);
      setCurrentQuestion(prevSection.questions.length - 1);
    }
  };

  const jumpToQuestion = (sectionIdx: number, qIdx: number) => {
    if (testSections[sectionIdx].id === 'stress') return;
    setCurrentSection(sectionIdx);
    setCurrentQuestion(qIdx);
  };

  const isLastQuestion = currentSection === testSections.length - 1 && currentQuestion === section.questions.length - 1;
  const isTimeDanger = !isStress && sectionTimeLeft < (section?.id === 'english' ? 60 : 120);

  if (!question || authLoading) return null;

  // English side-by-side layout
  const isEnglish = section.id === 'english';
  const englishPassage = isEnglish ? testSections.find(s => s.id === 'english')?.questions[0]?.text.split('\n\n')[0] : '';

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

      {/* Time warning popup */}
      {showTimeWarning && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-destructive text-destructive-foreground rounded-lg p-6 shadow-lg animate-fade-in">
          <p className="font-body font-bold text-lg">⚠️ Less than {section.id === 'english' ? '1 minute' : '2 minutes'} remaining!</p>
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
          {isStress ? (
            <div className="flex items-center gap-2 font-body font-mono text-2xl font-bold text-destructive animate-pulse-soft">
              <Clock className="h-5 w-5" />
              {stressQuestionTime}s
            </div>
          ) : (
            <div className={`flex items-center gap-2 font-body font-mono text-lg ${isTimeDanger ? 'text-destructive animate-pulse-soft' : 'text-foreground'}`}>
              <Clock className="h-4 w-4" />
              {formatTime(sectionTimeLeft)}
            </div>
          )}
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
              onClick={() => { if (s.id !== 'stress') { setCurrentSection(i); setCurrentQuestion(0); } }}
              className={`px-3 py-2 text-xs font-body whitespace-nowrap border-b-2 transition-colors ${
                i === currentSection
                  ? 'border-primary text-primary font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              } ${s.id === 'stress' && i !== currentSection ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex max-w-6xl mx-auto w-full">
        {/* Question palette (hide for stress test) */}
        {!isStress && (
          <div className="hidden md:block w-48 border-r border-border bg-card p-4 shrink-0">
            <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-3">Questions</p>
            <div className="grid grid-cols-4 gap-2">
              {section.questions.map((q, qi) => {
                const status = questionStatus[q.id] || 'not-visited';
                const isCurrent = qi === currentQuestion;
                return (
                  <button
                    key={q.id}
                    onClick={() => jumpToQuestion(currentSection, qi)}
                    className={`w-8 h-8 rounded text-xs font-body font-medium transition-all ${
                      isCurrent ? 'ring-2 ring-primary' : ''
                    } ${
                      status === 'answered' ? 'bg-green-500 text-white' :
                      status === 'visited' ? 'bg-yellow-400 text-black' :
                      'bg-muted text-muted-foreground'
                    }`}
                  >
                    {qi + 1}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 space-y-1 text-xs font-body text-muted-foreground">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-muted inline-block" /> Not visited</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-yellow-400 inline-block" /> Visited</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-green-500 inline-block" /> Answered</div>
            </div>
          </div>
        )}

        {/* Question area */}
        <main className="flex-1 flex items-start justify-center px-4 py-8">
          {isEnglish ? (
            // Side-by-side layout for English
            <div className="w-full flex flex-col md:flex-row gap-6">
              <div className="md:w-3/5 bg-card border border-border rounded-lg p-6 overflow-y-auto max-h-[60vh]">
                <p className="font-body text-xs text-primary uppercase tracking-wider mb-3">Passage</p>
                <p className="font-body text-foreground leading-relaxed whitespace-pre-line">
                  {englishPassage}
                </p>
              </div>
              <Card className="md:w-2/5 shadow-card">
                <CardContent className="p-6">
                  {question.topic && (
                    <span className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-body mb-4">
                      {question.topic}
                    </span>
                  )}
                  <h2 className="font-body text-lg leading-relaxed text-foreground mb-6">
                    {question.text.includes('"') ? question.text.split('\n\n').pop() : question.text}
                  </h2>
                  {question.type === 'mcq' && question.options && (
                    <div className="space-y-3">
                      {question.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => setAnswer(question.id, i)}
                          className={`w-full text-left p-3 rounded-lg border transition-all font-body text-sm ${
                            answers[question.id] === i
                              ? 'border-primary bg-primary/5 shadow-sm'
                              : 'border-border hover:border-primary/30 hover:bg-muted/50'
                          }`}
                        >
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs mr-2 ${
                            answers[question.id] === i ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                          }`}>{String.fromCharCode(65 + i)}</span>
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-6">
                    <Button variant="outline" onClick={goPrev} disabled={currentQuestion === 0 && currentSection === 0} className="font-body" size="sm">
                      <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                    </Button>
                    <Button onClick={goNext} className="font-body bg-gradient-hero text-primary-foreground" size="sm">
                      {isLastQuestion ? 'Submit Test' : 'Next'} <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : isStress ? (
            // Full-screen stress test
            <Card className="w-full max-w-lg shadow-card animate-fade-in">
              <CardContent className="p-8 text-center">
                <div className={`text-6xl font-display font-bold mb-6 ${stressQuestionTime <= 10 ? 'text-destructive animate-pulse-soft' : 'text-foreground'}`}>
                  {stressQuestionTime}
                </div>
                <h2 className="font-body text-2xl md:text-3xl leading-relaxed text-foreground mb-8">
                  {question.text}
                </h2>
                <Input
                  type="number"
                  value={answers[question.id] || ''}
                  onChange={e => setAnswer(question.id, e.target.value)}
                  placeholder="Type your answer..."
                  className="text-2xl font-body text-center max-w-xs mx-auto"
                  autoFocus
                  inputMode="numeric"
                />
                {stressSpeedIndicators[question.id] && (
                  <p className="mt-4 font-body font-medium text-lg">{stressSpeedIndicators[question.id]}</p>
                )}
                <div className="mt-8">
                  <Button onClick={goNext} className="font-body bg-gradient-hero text-primary-foreground px-8" disabled={!answers[question.id]}>
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-body">Q{currentQuestion + 1}/10 • Speed matters!</span>
                </div>
              </CardContent>
            </Card>
          ) : (
            // Standard question layout
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
                          answers[question.id] === i ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}>{String.fromCharCode(65 + i)}</span>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {question.type === 'open' && (
                  <Textarea
                    value={answers[question.id] || ''}
                    onChange={e => setAnswer(question.id, e.target.value)}
                    placeholder="Write your honest response here..."
                    className="min-h-[150px] font-body"
                  />
                )}

                {question.type === 'calculation' && (
                  <Input
                    value={answers[question.id] || ''}
                    onChange={e => setAnswer(question.id, e.target.value)}
                    placeholder="Type your answer..."
                    className="text-lg font-body"
                    autoFocus
                  />
                )}

                <div className="flex items-center justify-between mt-8">
                  <Button variant="outline" onClick={goPrev} disabled={currentSection === 0 && currentQuestion === 0} className="font-body">
                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                  </Button>
                  <Button
                    onClick={goNext}
                    className={`font-body ${isLastQuestion ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gradient-hero text-primary-foreground'}`}
                  >
                    {isLastQuestion ? 'Submit Test' : 'Next'} <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      <div className="text-center py-2 text-xs text-muted-foreground font-body border-t border-border bg-card">
        📝 Use blank paper for rough calculations
      </div>
    </div>
  );
};

export default TestPage;
