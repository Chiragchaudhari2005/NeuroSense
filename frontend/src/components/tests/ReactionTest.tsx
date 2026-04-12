import { useState, useRef } from 'react';

interface Props {
  onComplete: (score: number) => void;
}

export function ReactionTest({ onComplete }: Props) {
  const [phase, setPhase] = useState<'intro' | 'waiting' | 'ready' | 'result'>('intro');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  
  const startTime = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startTest = () => {
    setPhase('waiting');
    const delay = Math.random() * 3000 + 1500; // 1.5s to 4.5s
    
    timeoutRef.current = setTimeout(() => {
      setPhase('ready');
      startTime.current = Date.now();
    }, delay);
  };

  const handleClick = () => {
    if (phase === 'waiting') {
      // Clicked too early
      clearTimeout(timeoutRef.current!);
      alert("Too early! Wait for the color to change.");
      setPhase('intro');
    } else if (phase === 'ready') {
      // Good click
      const timeTaken = Date.now() - startTime.current;
      setReactionTime(timeTaken);
      setPhase('result');
    }
  };

  const finish = () => {
    // Score based on reaction time (0 to 10 points)
    // < 300ms = 10, < 400ms = 8, < 500 = 6, < 600 = 4, else 2
    let score = 2;
    if (reactionTime! < 300) score = 10;
    else if (reactionTime! < 400) score = 8;
    else if (reactionTime! < 500) score = 6;
    else if (reactionTime! < 600) score = 4;
    
    onComplete(score);
  };

  if (phase === 'intro') {
    return (
      <div className="text-center animate-fade-in">
        <h2 style={{ color: 'var(--primary)' }}>Reaction Test</h2>
        <p>When the red box turns <strong style={{ color: 'var(--success)' }}>GREEN</strong>, click it as fast as you can.</p>
        <button className="btn btn-primary" onClick={startTest}>Start</button>
      </div>
    );
  }

  if (phase === 'result') {
    return (
      <div className="text-center animate-fade-in">
        <h2>Your time: {reactionTime} ms</h2>
        <button className="btn btn-primary" onClick={finish}>Continue</button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h2 style={{ marginBottom: '2rem' }}>Wait for green...</h2>
      <div 
        onClick={handleClick}
        style={{
          width: '100%',
          height: '250px',
          background: phase === 'waiting' ? 'var(--danger)' : 'var(--success)',
          borderRadius: 'var(--border-radius)',
          cursor: 'pointer',
          transition: phase === 'waiting' ? 'none' : 'background 0.1s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>
          {phase === 'waiting' ? "Wait..." : "CLICK!"}
        </span>
      </div>
    </div>
  );
}
