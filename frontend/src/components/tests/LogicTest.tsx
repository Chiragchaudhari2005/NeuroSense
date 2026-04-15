import React, { useState } from 'react';

interface Props {
  onComplete: (score: number) => void;
}

const QUESTION_POOL = [
  { question: "What is the next number in the sequence? 2, 4, 8, 16, ?", answer: "32" },
  { question: "If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops Lazzies?", answer: "yes", type: "mcq", options: ["yes", "no"] },
  { question: "What is the next number in the sequence? 1, 1, 2, 3, 5, ?", answer: "8" },
  { question: "If some apples are red and all red things are sweet, are some apples sweet?", answer: "yes", type: "mcq", options: ["yes", "no"] },
  { question: "A bat and a ball cost $1.10 total. The bat costs $1.00 more than the ball. How much does the ball cost in cents?", answer: "5" },
  { question: "Which word doesn't belong: Apple, Banana, Carrot, Orange?", answer: "carrot" }
];

export function LogicTest({ onComplete }: Props) {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [inputVal, setInputVal] = useState('');
  
  // Choose 2 random questions on mount
  const [testQuestions, setTestQuestions] = useState<typeof QUESTION_POOL>(() => {
    return [...QUESTION_POOL].sort(() => 0.5 - Math.random()).slice(0, 2);
  });

  const submitAnswer = (userAns: string) => {
    let newScore = score;
    if (userAns.toLowerCase().trim() === testQuestions[currentQ].answer.toLowerCase()) {
      newScore += 5; // 2 questions, 5 pts each = max 10
    }
    setScore(newScore);
    
    if (currentQ < testQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
      setInputVal('');
    } else {
      onComplete(newScore);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(inputVal) {
      submitAnswer(inputVal);
    }
  };

  if (testQuestions.length === 0) return null;

  const q = testQuestions[currentQ];

  return (
    <div className="text-center animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <h2 style={{ color: '#0f172a', fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.4rem' }}>Logic & Reasoning</h2>
      <p style={{ color: '#475569', fontSize: '1.05rem', marginBottom: '2rem' }}>Question {currentQ + 1} of {testQuestions.length}</p>
      
      <div style={{ 
        background: '#f8fafc', padding: '2rem 3rem', borderRadius: '14px', 
        marginBottom: '2.5rem', fontSize: '1.3rem', fontWeight: 600, color: '#1e293b',
        border: '1px solid #cbd5e1', boxShadow: '0 4px 12px rgba(15,23,42,0.03)',
        width: '100%', maxWidth: '640px', lineHeight: 1.6
      }}>
        {q.question}
      </div>

      {q.type === 'mcq' ? (
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', width: '100%' }}>
          {q.options?.map((opt: string) => (
            <button key={opt} style={{ 
              textTransform: 'capitalize', padding: '0.875rem 2rem', borderRadius: '10px',
              background: '#e2e8f0', color: '#334155', border: 'none',
              fontWeight: 700, fontSize: '1rem', cursor: 'pointer', transition: 'background 0.2s'
            }} 
            onMouseEnter={e => e.currentTarget.style.background = '#cbd5e1'}
            onMouseLeave={e => e.currentTarget.style.background = '#e2e8f0'}
            onClick={() => submitAnswer(opt)}>
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <form onSubmit={handleTextSubmit} style={{ display: 'flex', gap: '1rem', justifyContent: 'center', width: '100%', maxWidth: '500px' }}>
          <input 
            type="text" 
            value={inputVal} 
            onChange={e => setInputVal(e.target.value)}
            placeholder="Type your answer..."
            style={{ 
              flex: 1, padding: '0.875rem 1.1rem', borderRadius: '10px', 
              border: '2px solid #cbd5e1', background: '#f8fafc', 
              fontSize: '1.05rem', color: '#0f172a', outline: 'none'
            }}
            onFocus={e => e.target.style.borderColor = '#3b82f6'}
            onBlur={e => e.target.style.borderColor = '#cbd5e1'}
          />
          <button type="submit" style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            padding: '0.9rem 2.5rem', borderRadius: '10px',
            background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
            color: '#fff', border: 'none', fontWeight: '700',
            fontSize: '1.05rem', cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(99,102,241,0.4)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(99,102,241,0.55)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.4)'; }}>
            Next
          </button>
        </form>
      )}
    </div>
  );
}
