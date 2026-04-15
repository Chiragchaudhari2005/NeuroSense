import { useState } from 'react';
import { Brain, ArrowRight } from 'lucide-react';
import { LandingPage } from './components/LandingPage';
import { DemographicsForm } from './components/DemographicsForm';
import { CognitiveTest } from './components/tests/CognitiveTest';
import { ResultDashboard } from './components/ResultDashboard';
import { MRIUpload } from './components/MRIUpload';
import { FullAssessment } from './components/FullAssessment';

function App() {
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<'test' | 'mri' | 'full' | null>(null);
  const [demoData, setDemoData] = useState<any>(null);
  const [cognitiveScore, setCognitiveScore] = useState<number | null>(null);

  const startAssessment = (selectedMode: 'test' | 'mri' | 'full') => {
    setMode(selectedMode);
    if (selectedMode === 'test' || selectedMode === 'full') {
      setStep(1);
    } else if (selectedMode === 'mri') {
      setStep(4);
    }
  };
  
  const handleDemoComplete = (data: any) => {
    setDemoData(data);
    setStep(2);
  };
  
  const handleTestComplete = (score: number) => {
    setCognitiveScore(score);
    if (mode === 'full') {
      setStep(5);
    } else {
      setStep(3);
    }
  };

  const restart = () => {
    setStep(0);
    setMode(null);
    setDemoData(null);
    setCognitiveScore(null);
  };

  // Landing page gets full-width layout; all other steps use the centred container
  if (step === 0) {
    return <LandingPage onStart={startAssessment} />;
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#ffffff', fontFamily: "'Inter', 'Arial', sans-serif", color: '#1a1a2e', display: 'flex', flexDirection: 'column' }}>

      {/* Navbar - same style as LandingPage */}
      <nav style={{
        width: '100%',
        backgroundColor: '#0047AB',
        padding: '1rem 2.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 12px rgba(0,71,171,0.3)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Brain size={28} color="#ffffff" />
          <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ffffff', letterSpacing: '-0.02em' }}>
            NeuroSense
          </span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className="btn btn-secondary" onClick={restart} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
            Home
          </button>
          <button
            onClick={() => startAssessment('test')}
            style={{ backgroundColor: '#ffffff', color: '#0047AB', border: 'none', borderRadius: '8px', padding: '0.5rem 1rem', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem' }}>
            Get Started <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      <main className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: '#ffffff' }}>
        {step === 1 && (mode === 'test' || mode === 'full') && <DemographicsForm onComplete={handleDemoComplete} />}
        {step === 2 && (mode === 'test' || mode === 'full') && <CognitiveTest onComplete={handleTestComplete} />}
        {step === 3 && mode === 'test' && (
          <ResultDashboard 
            data={{ ...demoData, cognitive_score: cognitiveScore }}
            onRestart={restart}
          />
        )}
        {step === 4 && mode === 'mri' && (
          <MRIUpload onRestart={restart} />
        )}
        {step === 5 && mode === 'full' && (
          <FullAssessment 
            demoData={demoData} 
            cognitiveScore={cognitiveScore!} 
            onRestart={restart} 
          />
        )}
      </main>

      {/* Footer - same as LandingPage footer */}
      <footer style={{
        width: '100%',
        backgroundColor: '#0a1628',
        color: '#94a3b8',
        textAlign: 'center',
        padding: '2rem 4rem',
        fontSize: '0.9rem',
        marginTop: 'auto',
      }}>
        <p>© {new Date().getFullYear()} NeuroSense. For Educational Purposes Only.</p>
      </footer>
    </div>
  );
}

export default App;
