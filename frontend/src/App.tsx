import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { DemographicsForm } from './components/DemographicsForm';
import { CognitiveTest } from './components/tests/CognitiveTest';
import { ResultDashboard } from './components/ResultDashboard';
import { MRIUpload } from './components/MRIUpload';

function App() {
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<'test' | 'mri' | null>(null);
  const [demoData, setDemoData] = useState<any>(null);
  const [cognitiveScore, setCognitiveScore] = useState<number | null>(null);

  const startAssessment = (selectedMode: 'test' | 'mri') => {
    setMode(selectedMode);
    if (selectedMode === 'test') {
      setStep(1);
    } else {
      setStep(4); // 4 will be MRI Upload
    }
  };
  
  const handleDemoComplete = (data: any) => {
    setDemoData(data);
    setStep(2);
  };
  
  const handleTestComplete = (score: number) => {
    setCognitiveScore(score);
    setStep(3);
  };

  const restart = () => {
    setStep(0);
    setMode(null);
    setDemoData(null);
    setCognitiveScore(null);
  };

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', padding: '1rem 0', borderBottom: '1px solid var(--glass-border)' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: 'var(--primary)' }}>Neuro</span>Sense
        </div>
        <nav>
          <button className="btn btn-secondary" onClick={restart} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
            Home
          </button>
        </nav>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {step === 0 && <LandingPage onStart={startAssessment} />}
        {step === 1 && mode === 'test' && <DemographicsForm onComplete={handleDemoComplete} />}
        {step === 2 && mode === 'test' && <CognitiveTest onComplete={handleTestComplete} />}
        {step === 3 && mode === 'test' && (
          <ResultDashboard 
            data={{ ...demoData, cognitive_score: cognitiveScore }}
            onRestart={restart}
          />
        )}
        {step === 4 && mode === 'mri' && (
          <MRIUpload onRestart={restart} />
        )}
      </main>

      <footer style={{ marginTop: '3rem', textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)', fontSize: '0.9rem', borderTop: '1px solid var(--glass-border)' }}>
        <p>&copy; {new Date().getFullYear()} NeuroSense. For Educational Purposes.</p>
      </footer>
    </div>
  );
}

export default App;
