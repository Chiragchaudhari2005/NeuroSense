
import { Brain, ArrowRight, UploadCloud } from 'lucide-react';

interface Props {
  onStart: (mode: 'test' | 'mri') => void;
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
      <p style={{ fontSize: '1.2rem', marginBottom: '3rem', color: 'var(--text-muted)' }}>
        A modern, interactive platform for early cognitive assessment. 
        Choose how you would like to proceed with your evaluation.
      </p>

      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div 
          className="glass-panel" 
          style={{ width: '300px', padding: '2rem', cursor: 'pointer', transition: 'transform 0.2s', textAlign: 'left' }}
          onClick={() => onStart('test')}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <Brain size={48} color="var(--secondary)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--secondary)' }}>Take the Assessment</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Complete our cognitive evaluation test by answering a series of logic and memory questions.</p>
          <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', color: 'var(--text)', gap: '0.5rem', fontWeight: 'bold' }}>
            Start Test <ArrowRight size={16} />
          </div>
        </div>

        <div 
          className="glass-panel" 
          style={{ width: '300px', padding: '2rem', cursor: 'pointer', transition: 'transform 0.2s', textAlign: 'left' }}
          onClick={() => onStart('mri')}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <UploadCloud size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>Upload MRI Report</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Upload an MRI scan image to be analyzed by our advanced AI model for early detection.</p>
          <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', color: 'var(--text)', gap: '0.5rem', fontWeight: 'bold' }}>
            Upload Image <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}
