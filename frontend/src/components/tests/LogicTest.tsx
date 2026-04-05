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
  const [testQuestions, setTestQuestions] = useState<typeof QUESTION_POOL>([]);
  
  React.useEffect(() => {
    const shuffled = [...QUESTION_POOL].sort(() => 0.5 - Math.random());
    setTestQuestions(shuffled.slice(0, 2));
  }, []);

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

  if (testQuestions.length === 0) return null; // Avoid rendering before questions are selected

  const q = testQuestions[currentQ];

  return (
    <div className="text-center animate-fade-in">
      <h2 style={{ color: 'var(--primary)' }}>Logic & Reasoning</h2>
      <p style={{ marginBottom: '2rem' }}>Question {currentQ + 1} of {testQuestions.length}</p>
      
      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '8px', marginBottom: '2rem', fontSize: '1.25rem' }}>
        {q.question}
      </div>

      {q.type === 'mcq' ? (
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {q.options?.map((opt: string) => (
            <button key={opt} className="btn btn-secondary" style={{ textTransform: 'capitalize' }} onClick={() => submitAnswer(opt)}>
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <form onSubmit={handleTextSubmit} style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <input 
            type="text" 
            value={inputVal} 
            onChange={e => setInputVal(e.target.value)}
            placeholder="Type your answer..."
            style={{ width: '200px' }}
          />
          <button type="submit" className="btn btn-primary">Next</button>
        </form>
      )}
    </div>
  );
}
