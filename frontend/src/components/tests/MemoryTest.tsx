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
      <div className="text-center animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <h2 style={{ color: '#0f172a', fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem' }}>Memory Test</h2>
        <p style={{ color: '#475569', fontSize: '1.1rem', maxWidth: '700px', lineHeight: 1.6, marginBottom: '2rem' }}>You will be shown 5 words for 5 seconds. Try to memorize them as best as you can.</p>
        <button style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
          padding: '0.9rem 2.5rem', borderRadius: '12px',
          background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
          color: '#fff', border: 'none', fontWeight: '600',
          fontSize: '1.05rem', cursor: 'pointer',
          boxShadow: '0 6px 20px rgba(99,102,241,0.4)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }} 
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(99,102,241,0.55)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.4)'; }}
        onClick={() => setPhase('memorize')}>
          Start
        </button>
      </div>
    );
  }

  if (phase === 'memorize') {
    return (
      <div className="text-center animate-fade-in" style={{ width: '100%' }}>
        <h2 style={{ marginBottom: '2.5rem', color: '#0f172a', fontSize: '1.6rem', fontWeight: 800 }}>Memorize these words:</h2>
        <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
          {WORDS.map((w, i) => (
            <div key={i} style={{ 
              padding: '1.2rem 2.5rem', 
              background: '#f8fafc', 
              border: '2px solid #cbd5e1',
              borderRadius: '12px', 
              fontSize: '1.4rem', 
              fontWeight: '800',
              color: '#3b82f6',
              boxShadow: '0 4px 12px rgba(15,23,42,0.05)'
            }}>
              {w}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="text-center animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <h2 style={{ color: '#0f172a', fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.8rem' }}>Recall Words</h2>
      <p style={{ color: '#475569', fontSize: '1.05rem', marginBottom: '2rem' }}>Type the words you remember and press Add.</p>
      
      <form onSubmit={handleAddWord} style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', marginBottom: '2rem', width: '100%', maxWidth: '400px' }}>
        <input 
          type="text" 
          value={inputWord} 
          onChange={e => setInputWord(e.target.value)}
          placeholder="Enter a word..."
          style={{ 
            flex: 1, padding: '0.875rem 1.1rem', borderRadius: '10px', 
            border: '2px solid #cbd5e1', background: '#f8fafc', 
            fontSize: '1.05rem', color: '#0f172a', outline: 'none'
          }}
          onFocus={e => e.target.style.borderColor = '#3b82f6'}
          onBlur={e => e.target.style.borderColor = '#cbd5e1'}
        />
        <button type="submit" style={{
          padding: '0.875rem 1.5rem', borderRadius: '10px',
          background: '#e2e8f0', color: '#334155', border: 'none',
          fontWeight: 700, fontSize: '1rem', cursor: 'pointer', transition: 'background 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#cbd5e1'}
        onMouseLeave={e => e.currentTarget.style.background = '#e2e8f0'}>
          Add
        </button>
      </form>

      <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem', minHeight: '44px' }}>
        {recalledWords.map((w, i) => (
          <span key={i} style={{ 
            padding: '0.6rem 1.2rem', background: '#eff6ff', 
            color: '#1d4ed8', fontWeight: 700,
            border: '1px solid #bfdbfe', borderRadius: '8px', fontSize: '1.05rem' 
          }}>
            {w}
          </span>
        ))}
      </div>

      <button onClick={handleFinish} style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
        padding: '0.9rem 2.5rem', borderRadius: '12px',
        background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
        color: '#fff', border: 'none', fontWeight: '600',
        fontSize: '1.05rem', cursor: 'pointer',
        boxShadow: '0 6px 20px rgba(99,102,241,0.4)',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(99,102,241,0.55)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.4)'; }}>
        Submit Memory Test
      </button>
    </div>
  );
}
