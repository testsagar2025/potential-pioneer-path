import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Calculator, Atom, FlaskConical, Leaf, BookOpen, Brain, Target, Zap, UserPlus, LogIn, Calendar, Quote } from 'lucide-react';
import aasokaLogo from '@/assets/aasoka-logo.png';
import lfgosLogo from '@/assets/lfgos-logo.png';

const sections = [
  { icon: Calculator, title: 'Mathematics', desc: 'Quadratic equations, AP, Trigonometry, Coordinate Geometry' },
  { icon: Atom, title: 'Physics', desc: 'Electricity, Light, Motion' },
  { icon: FlaskConical, title: 'Chemistry', desc: 'Chemical equations, Mole concept, Acids/Bases/Salts' },
  { icon: Leaf, title: 'Biology', desc: 'Life processes, Heredity, Human anatomy' },
  { icon: BookOpen, title: 'English Comprehension', desc: 'Reading and inference' },
  { icon: Brain, title: 'Situational Judgment', desc: 'Exam temperament scenarios' },
  { icon: Target, title: 'Self-Reflection', desc: 'Motivation and mindset' },
  { icon: Zap, title: 'Concentration Stress Test', desc: 'Rapid mental math challenges' },
];

const dates = [
  { event: 'Registration Opens', date: '7 March 2026' },
  { event: 'Last Date to Register', date: '15 March 2026' },
  { event: 'Examination Date', date: '20 March 2026' },
  { event: 'Results Declaration', date: 'Before 1st April 2026' },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header logos */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
        <img src={lfgosLogo} alt="LFGOS" className="h-12 md:h-16 object-contain" />
        <img src={aasokaLogo} alt="AASOKA" className="h-10 md:h-14 object-contain" />
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="px-4 py-16 md:py-24 text-center max-w-4xl mx-auto animate-fade-up">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
            LFGOS CAT Examination 2026
          </h1>
          <p className="mt-4 text-lg md:text-xl text-primary font-body font-medium">
            A Comprehensive Assessment for LFGOS Students
          </p>
          <p className="text-muted-foreground font-body italic">
            Under IIT Program with AASOKA Group
          </p>

          <p className="mt-8 text-muted-foreground font-body max-w-2xl mx-auto leading-relaxed">
            Little Flower Group of Schools & Hostel has collaborated with AASOKA to provide a free Foundation Course for JEE and NEET exams. This diagnostic test is designed specifically for LFGOS students who have completed Class 10 Board Exams to assess their readiness for this intensive program before Class 11 begins.
          </p>
          <p className="mt-4 text-muted-foreground font-body max-w-2xl mx-auto leading-relaxed text-sm">
            AASOKA is a premier learning platform providing blended solutions for competitive exam preparation, bringing Kota-style coaching expertise to Mau.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-hero text-primary-foreground font-body text-lg px-8 py-6 shadow-glow hover:opacity-90 transition-opacity"
              onClick={() => navigate('/register')}
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Register for Examination
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="font-body text-lg px-8 py-6 border-border hover:bg-muted transition-colors"
              onClick={() => navigate('/student-login')}
            >
              <LogIn className="mr-2 h-5 w-5" />
              Already registered? Login
            </Button>
          </div>
        </section>

        {/* Test Overview */}
        <section className="px-4 py-12 bg-card border-y border-border">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-8">Test Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Mode', value: 'Online (Computer/Mobile)' },
                { label: 'Type', value: 'MCQ + Written Response' },
                { label: 'Sections', value: '8 Comprehensive Modules' },
                { label: 'Result', value: 'Detailed Report Card' },
              ].map(item => (
                <Card key={item.label} className="shadow-card text-center">
                  <CardContent className="p-4">
                    <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">{item.label}</p>
                    <p className="font-body font-medium text-foreground mt-1 text-sm">{item.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Test Sections */}
        <section className="px-4 py-12 max-w-4xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-8">Test Sections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sections.map((s, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border shadow-card">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-body font-medium text-foreground">{i + 1}. {s.title}</p>
                  <p className="font-body text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quote */}
        <section className="px-4 py-12 bg-primary/5 border-y border-border">
          <div className="max-w-3xl mx-auto text-center">
            <Quote className="h-8 w-8 text-primary/40 mx-auto mb-4" />
            <blockquote className="font-display text-xl md:text-2xl text-foreground italic">
              "Every house in Mau will have a doctor or an IITian."
            </blockquote>
            <p className="mt-4 font-body text-muted-foreground font-medium">
              — Muralidhar Yadav, Director, Little Flower Group of Schools
            </p>
            <p className="mt-4 font-body text-sm text-muted-foreground">
              Join hundreds of LFGOS students who have already started their journey toward India's top engineering and medical colleges.
            </p>
          </div>
        </section>

        {/* Important Dates */}
        <section className="px-4 py-12 max-w-4xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
            <Calendar className="inline h-7 w-7 mr-2 text-primary" />
            Important Dates
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dates.map(d => (
              <Card key={d.event} className="shadow-card">
                <CardContent className="p-4 flex justify-between items-center">
                  <p className="font-body text-foreground font-medium">{d.event}</p>
                  <p className="font-body text-primary font-bold">{d.date}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How to Register */}
        <section className="px-4 py-12 bg-card border-y border-border">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">How to Register</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-left">
              {[
                { step: '1', text: 'Click the Register button' },
                { step: '2', text: 'Fill your name, roll number, and contact details' },
                { step: '3', text: 'Select your target exam (JEE/NEET/Both)' },
                { step: '4', text: 'Submit and receive confirmation' },
              ].map(s => (
                <div key={s.step} className="flex items-start gap-3 p-4 rounded-lg bg-background border border-border">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-hero text-primary-foreground flex items-center justify-center font-body font-bold text-sm">
                    {s.step}
                  </span>
                  <p className="font-body text-sm text-foreground">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="px-4 py-16 text-center">
          <Button
            size="lg"
            className="bg-gradient-hero text-primary-foreground font-body text-lg px-10 py-6 shadow-glow hover:opacity-90 transition-opacity"
            onClick={() => navigate('/register')}
          >
            <GraduationCap className="mr-2 h-5 w-5" />
            Register for Examination
          </Button>
          <p className="mt-4 font-body text-sm text-muted-foreground">
            Already registered? <button onClick={() => navigate('/student-login')} className="text-primary underline hover:opacity-80">Login here</button>
          </p>
        </section>
      </main>

      <footer className="text-center py-6 text-sm text-muted-foreground border-t border-border font-body bg-card space-y-1">
        <p>© 2026 Little Flower Group of Schools & Hostel has collaborated with AASOKA</p>
        <p>For queries: contact@lfgos.ac.in</p>
      </footer>
    </div>
  );
};

export default Landing;
