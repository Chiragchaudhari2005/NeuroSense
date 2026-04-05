import React, { useState, useEffect } from 'react';
import { MemoryTest } from './MemoryTest';
import { ReactionTest } from './ReactionTest';
import { LogicTest } from './LogicTest';
import { Activity } from 'lucide-react';

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
    }
  };

  const CurrentTest = tests[step].component;

  return (
    <div className="glass-panel animate-slide-up" style={{ maxWidth: '800px', margin: '0 auto', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity color="var(--primary)" />
          <h3 style={{ margin: 0 }}>Cognitive Assessment</h3>
        </div>
        <div style={{ color: 'var(--text-muted)' }}>
          Test {step + 1} of {tests.length}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <CurrentTest onComplete={handleTestComplete} />
      </div>
    </div>
  );
}
