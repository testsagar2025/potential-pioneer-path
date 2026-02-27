import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, GraduationCap } from 'lucide-react';
import aasokaLogo from '@/assets/aasoka-logo.png';
import lfgosLogo from '@/assets/lfgos-logo.png';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header logos */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <img src={lfgosLogo} alt="LFGOS" className="h-12 md:h-16 object-contain" />
        <img src={aasokaLogo} alt="AASOKA" className="h-10 md:h-14 object-contain" />
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center animate-fade-up">
          <div className="mb-8">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
              LFGOS CAT<span className="text-primary">:</span> Premier
            </h1>
            <p className="mt-3 text-lg md:text-xl text-muted-foreground font-body italic">
              Where Potential Meets the Pedestal
            </p>
          </div>

          <p className="text-muted-foreground font-body mb-10 max-w-lg mx-auto leading-relaxed">
            A comprehensive 45-minute AI-powered diagnostic to assess your readiness 
            for JEE/NEET — covering academics, temperament, and cognitive stamina.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-hero text-primary-foreground font-body text-lg px-8 py-6 shadow-glow hover:opacity-90 transition-opacity"
              onClick={() => navigate('/student-login')}
            >
              <GraduationCap className="mr-2 h-5 w-5" />
              Student Login
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="font-body text-lg px-8 py-6 border-border hover:bg-muted transition-colors"
              onClick={() => navigate('/admin-login')}
            >
              <Shield className="mr-2 h-5 w-5" />
              Admin Portal
            </Button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">⏱ 45 Minutes</span>
            <span className="h-4 w-px bg-border" />
            <span className="flex items-center gap-1">📊 8 Sections</span>
            <span className="h-4 w-px bg-border" />
            <span className="flex items-center gap-1">🧠 AI Analysis</span>
          </div>
        </div>
      </main>

      <footer className="text-center py-4 text-sm text-muted-foreground border-t border-border font-body">
        © 2026 Little Flower Group of Schools & Hostel — Powered by AASOKA
      </footer>
    </div>
  );
};

export default Landing;
