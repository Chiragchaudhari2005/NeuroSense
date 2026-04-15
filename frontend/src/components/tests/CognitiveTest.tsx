import React, { useState } from 'react';
import { MemoryTest } from './MemoryTest';
import { ReactionTest } from './ReactionTest';
import { LogicTest } from './LogicTest';
import { Activity, Brain } from 'lucide-react';

interface Props {
  onComplete: (score: number) => void;
}

export function CognitiveTest({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({
    memory: 0,
    reaction: 0,
    logic: 0
  });

  const tests = [
    { name: "Memory Test", component: MemoryTest, key: 'memory', maxScore: 10 },
    { name: "Reaction Test", component: ReactionTest, key: 'reaction', maxScore: 10 },
    { name: "Logic Test", component: LogicTest, key: 'logic', maxScore: 10 }
  ];

  const handleTestComplete = (score: number) => {
    const currentTest = tests[step];
    setScores(prev => ({ ...prev, [currentTest.key]: score }));
    
    if (step < tests.length - 1) {
      setStep(step + 1);
    } else {
      // Calculate final mapped MMSE score.
      // Memory: weight 50% (15 points), Logic: weight 30% (9 points), Reaction: weight 20% (6 points)
      // Total 30 points.
      
      const newScores = { ...scores, [currentTest.key]: score };
      const memoryPoints = (newScores.memory / 10) * 15;
      const reactionPoints = (newScores.reaction / 10) * 6;
      const logicPoints = (newScores.logic / 10) * 9;
      
      const finalMmse = Math.round(memoryPoints + reactionPoints + logicPoints);
      onComplete(finalMmse);
      return;
    }
  };

  const CurrentTest = tests[step].component;

  return (
    <div className="animate-slide-up" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', color: '#1e293b' }}>
      {/* ── Step indicator ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '3rem' }}>
        {['Personal Info', 'Cognitive Test', 'Results'].map((stepName, i) => (
          <React.Fragment key={stepName}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '50%',
                background: i <= 1 ? 'linear-gradient(135deg,#3b82f6,#6366f1)' : '#f1f5f9',
                border: i <= 1 ? 'none' : '2px solid #cbd5e1',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem', fontWeight: '700',
                color: i <= 1 ? '#fff' : '#64748b',
                boxShadow: i <= 1 ? '0 6px 16px rgba(99,102,241,0.3)' : 'none',
              }}>{i + 1}</div>
              <span style={{ fontSize: '0.9rem', color: i <= 1 ? '#2563eb' : '#64748b', fontWeight: i <= 1 ? '700' : '500', whiteSpace: 'nowrap' }}>{stepName}</span>
            </div>
            {i < 2 && (
              <div style={{
                flex: 1, height: '3px', margin: '0 0.75rem',
                marginBottom: '1.75rem',
                background: i === 0
                  ? 'linear-gradient(to right,#3b82f6,#3b82f6)'
                  : '#e2e8f0',
                borderRadius: '2px'
              }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ── Card ── */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '24px',
        boxShadow: '0 24px 80px rgba(15,23,42,0.08)',
        overflow: 'hidden',
        minHeight: '480px',
        display: 'flex', flexDirection: 'column'
      }}>
        {/* Card header */}
        <div style={{
          padding: '2.5rem 3rem 1.5rem',
          borderBottom: '1px solid #f1f5f9',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          display: 'flex', alignItems: 'center', gap: '1rem',
        }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '16px',
            background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(99,102,241,0.4)',
          }}>
            <Activity size={24} color="#fff" />
          </div>
          <div>
            <h2 style={{
              margin: 0, fontSize: '1.6rem', fontWeight: '800',
              color: '#0f172a'
            }}>Cognitive Assessment</h2>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.95rem', color: '#475569' }}>
              Test {step + 1} of {tests.length} — {tests[step].name}
            </p>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <Brain size={24} color="#3b82f6" style={{ opacity: 0.15 }} />
          </div>
        </div>

        <div style={{ flex: 1, padding: '2.5rem 3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <CurrentTest onComplete={handleTestComplete} />
        </div>
      </div>
    </div>
  );
}
