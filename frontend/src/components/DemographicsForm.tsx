import React, { useState } from 'react';
import { ArrowRight, User } from 'lucide-react';

interface DemographicsData {
  age: number;
  gender: number;
  education: number;
  ses: number;
}

interface Props {
  onComplete: (data: DemographicsData) => void;
}

export function DemographicsForm({ onComplete }: Props) {
  const [data, setData] = useState<DemographicsData>({
    age: 65,
    gender: 0,
    education: 12, // High school as default
    ses: 3, // Middle class as default
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(data);
  };

  return (
    <div className="glass-panel animate-slide-up" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <User size={32} color="var(--primary)" />
        <h2 style={{ margin: 0 }}>Personal Information</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Age</label>
          <input 
            type="number" 
            min="18" 
            max="120" 
            required 
            value={data.age}
            onChange={e => setData({...data, age: parseInt(e.target.value)})}
          />
        </div>

        <div className="form-group">
          <label>Gender</label>
          <select value={data.gender} onChange={e => setData({...data, gender: parseInt(e.target.value)})}>
            <option value={0}>Female</option>
            <option value={1}>Male</option>
          </select>
        </div>

        <div className="form-group">
          <label>Years of Education</label>
          <input 
            type="number" 
            min="0" 
            max="30" 
            required 
            value={data.education}
            onChange={e => setData({...data, education: parseInt(e.target.value)})}
          />
          <small style={{ color: 'var(--text-muted)' }}>e.g., 12 for High School, 16 for Bachelor's</small>
        </div>

        <div className="form-group">
          <label>Socioeconomic Status (Scale: 1 highest to 5 lowest)</label>
          <select value={data.ses} onChange={e => setData({...data, ses: parseInt(e.target.value)})}>
            <option value={1}>1 - Highest</option>
            <option value={2}>2 - High</option>
            <option value={3}>3 - Middle</option>
            <option value={4}>4 - Low</option>
            <option value={5}>5 - Lowest</option>
          </select>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'right' }}>
          <button type="submit" className="btn btn-primary">
            Continue to Tests <ArrowRight size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
