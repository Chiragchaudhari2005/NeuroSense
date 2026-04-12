import { useEffect, useState } from 'react';
import { RefreshCw, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';

interface Props {
  data: {
    age: number;
    gender: number;
    education: number;
    ses: number;
    cognitive_score: number;
  };
  onRestart: () => void;
}

interface PredictionData {
  probability: number;
  risk: string;
}

export function ResultDashboard({ data, onRestart }: Props) {
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const response = await fetch('http://localhost:8000/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch prediction');
        }

        const result = await response.json();
        setPrediction(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [data]);

  if (loading) {
    return (
      <div className="glass-panel text-center" style={{ maxWidth: '600px', margin: '0 auto', padding: '4rem 2rem' }}>
        <RefreshCw size={48} color="var(--primary)" className="animate-spin" style={{ animation: 'spin 2s linear infinite' }} />
        <h2 style={{ marginTop: '1.5rem' }}>Analyzing Results...</h2>
        <p>Our AI is evaluating your cognitive tests and demographic factors securely.</p>
        <style>{`
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel text-center" style={{ maxWidth: '600px', margin: '0 auto', padding: '4rem 2rem' }}>
        <AlertCircle size={48} color="var(--danger)" />
        <h2 style={{ marginTop: '1.5rem', color: 'var(--danger)' }}>Analysis Failed</h2>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={onRestart}>Try Again</button>
      </div>
    );
  }

  const isHighRisk = prediction?.risk === "High Risk";
  const isMediumRisk = prediction?.risk === "Medium Risk";
  
  let riskColor = 'var(--success)';
  let Icon = CheckCircle;
  let summaryText = "Your cognitive assessment looks great! Keep up the healthy habits.";
  
  if (isHighRisk) {
    riskColor = 'var(--danger)';
    Icon = AlertCircle;
    summaryText = "We recommend consulting a healthcare professional for a comprehensive evaluation.";
  } else if (isMediumRisk) {
    riskColor = 'var(--warning)';
    Icon = HelpCircle;
    summaryText = "Your results suggest monitoring your cognitive health and discussing it with a doctor during your next visit.";
  }

  return (
    <div className="glass-panel animate-slide-up text-center" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Icon size={64} color={riskColor} style={{ marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '2.5rem', color: riskColor, margin: 0 }}>{prediction?.risk}</h2>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>AI Assessment Probability</h3>
        <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>
          {(prediction!.probability * 100).toFixed(1)}%
        </div>
        <p style={{ marginTop: '1rem', fontSize: '1.1rem' }}>{summaryText}</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', background: 'var(--bg-dark)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
        <div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Estimated MMSE</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{data.cognitive_score} / 30</div>
        </div>
        <div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Analyzed Metrics</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Demo + Cognitive</div>
        </div>
        <div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Accuracy</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>High</div>
        </div>
      </div>

      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Disclaimer: NeuroSense is a preliminary tool and does not provide a definitive clinical diagnosis. 
        Please consult a medical professional for medical advice.
      </p>

      <button className="btn btn-secondary" onClick={onRestart}>
        <RefreshCw size={20} /> Take Assessment Again
      </button>
    </div>
  );
}
