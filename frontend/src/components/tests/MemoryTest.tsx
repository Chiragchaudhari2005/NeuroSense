import React, { useState, useEffect } from 'react';

const WORDS = ["APPLE", "TABLE", "PEN", "DOG", "SUN"];
const SHOW_TIME_MS = 5000;

interface Props {
  onComplete: (score: number) => void;
}

export function MemoryTest({ onComplete }: Props) {
  const [phase, setPhase] = useState<'intro' | 'memorize' | 'recall'>('intro');
  const [inputWord, setInputWord] = useState('');
  const [recalledWords, setRecalledWords] = useState<string[]>([]);
  
  useEffect(() => {
    if (phase === 'memorize') {
      const timer = setTimeout(() => {
        setPhase('recall');
      }, SHOW_TIME_MS);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    const word = inputWord.trim().toUpperCase();
    if (word && !recalledWords.includes(word)) {
      setRecalledWords([...recalledWords, word]);
    }
    setInputWord('');
  };

  const handleFinish = () => {
    // Calculate score (0 to 10 points: 2 pts per correct word)
    let correctCount = 0;
    recalledWords.forEach(w => {
      if (WORDS.includes(w)) correctCount++;
    });
    onComplete(correctCount * 2);
  };

  if (phase === 'intro') {
    return (
      <div className="text-center animate-fade-in">
        <h2 style={{ color: 'var(--primary)' }}>Memory Test</h2>
        <p>You will be shown 5 words for 5 seconds. Try to memorize them as best as you can.</p>
        <button className="btn btn-primary" onClick={() => setPhase('memorize')}>
          Start
        </button>
      </div>
    );
  }

  if (phase === 'memorize') {
    return (
      <div className="text-center animate-fade-in">
        <h2 style={{ marginBottom: '2rem' }}>Memorize these words:</h2>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {WORDS.map((w, i) => (
            <div key={i} style={{ padding: '1rem 2rem', background: 'var(--glass-bg)', borderRadius: '8px', fontSize: '1.25rem', fontWeight: 'bold' }}>
              {w}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="text-center animate-fade-in">
      <h2>Recall Words</h2>
      <p>Type the words you remember and press enter/add.</p>
      
      <form onSubmit={handleAddWord} style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <input 
          type="text" 
          value={inputWord} 
          onChange={e => setInputWord(e.target.value)}
          placeholder="Enter a word..."
          style={{ width: '200px' }}
        />
        <button type="submit" className="btn btn-secondary">Add</button>
      </form>

      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {recalledWords.map((w, i) => (
          <span key={i} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>
            {w}
          </span>
        ))}
      </div>

      <button className="btn btn-primary" onClick={handleFinish}>Submit Memory Test</button>
    </div>
  );
}
