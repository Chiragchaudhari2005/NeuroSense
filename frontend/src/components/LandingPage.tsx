import React from 'react';
import { Brain, ArrowRight } from 'lucide-react';

interface Props {
  onStart: () => void;
}

export function LandingPage({ onStart }: Props) {
  return (
    <div className="glass-panel animate-slide-up text-center" style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--bg-dark)', padding: '1.5rem', borderRadius: '50%', boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)' }}>
          <Brain size={64} color="var(--primary)" />
        </div>
      </div>
      
      <h1>Welcome to NeuroSense</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '3rem' }}>
        A modern, interactive platform for early cognitive assessment. 
        Take our scientifically inspired, user-friendly tests to evaluate your cognitive health in just a few minutes.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '3rem', textAlign: 'left' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--primary)', marginBottom: '1rem', fontWeight: 'bold' }}>1. Demographics</div>
          <p style={{ fontSize: '0.9rem', marginBottom: 0 }}>Provide basic information to baseline your results accurately.</p>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--secondary)', marginBottom: '1rem', fontWeight: 'bold' }}>2. Cognitive Test</div>
          <p style={{ fontSize: '0.9rem', marginBottom: 0 }}>Complete quick tasks measuring memory, attention, and logic.</p>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--success)', marginBottom: '1rem', fontWeight: 'bold' }}>3. AI Analysis</div>
          <p style={{ fontSize: '0.9rem', marginBottom: 0 }}>Receive instant, AI-driven insights on your cognitive wellbeing.</p>
        </div>
      </div>

      <button className="btn btn-primary" style={{ fontSize: '1.25rem', padding: '1rem 2.5rem' }} onClick={onStart}>
        Start Assessment <ArrowRight size={24} />
      </button>
    </div>
  );
}
