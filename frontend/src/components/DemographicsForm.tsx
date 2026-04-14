import React, { useState } from 'react';
import { ArrowRight, User, BookOpen, DollarSign, Users, Brain, ChevronDown } from 'lucide-react';

interface DemographicsData {
  age: number;
  gender: number;
  education: number;
  ses: number;
}

interface Props {
  onComplete: (data: DemographicsData) => void;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.875rem 1.1rem',
  borderRadius: '12px',
  background: 'rgba(15, 23, 42, 0.55)',
  border: '1.5px solid rgba(255,255,255,0.1)',
  color: '#f1f5f9',
  fontSize: '1rem',
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
  transition: 'border-color 0.25s, box-shadow 0.25s',
  appearance: 'none' as const,
};

const focusStyle: React.CSSProperties = {
  borderColor: '#3b82f6',
  boxShadow: '0 0 0 3px rgba(59,130,246,0.2)',
};

function Field({
  icon,
  label,
  hint,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{
          width: '26px', height: '26px', borderRadius: '8px',
          background: 'rgba(59,130,246,0.15)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {icon}
        </span>
        <label style={{ fontWeight: '600', fontSize: '0.9rem', color: '#e2e8f0' }}>{label}</label>
      </div>
      {children}
      {hint && (
        <span style={{ fontSize: '0.78rem', color: '#64748b', paddingLeft: '0.25rem' }}>{hint}</span>
      )}
    </div>
  );
}

export function DemographicsForm({ onComplete }: Props) {
  const [data, setData] = useState<DemographicsData>({
    age: 65,
    gender: 0,
    education: 12,
    ses: 3,
  });
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(data);
  };

  const getInputStyle = (name: string) => ({
    ...inputStyle,
    ...(focused === name ? focusStyle : {}),
  });

  const educationLabel = (v: number) => {
    if (v <= 8) return 'Elementary';
    if (v <= 12) return 'High School';
    if (v <= 14) return 'Associate\'s';
    if (v <= 16) return 'Bachelor\'s';
    if (v <= 18) return 'Master\'s';
    return 'Doctorate';
  };

  return (
    <div className="animate-slide-up" style={{ width: '100%', maxWidth: '720px', margin: '0 auto' }}>

      {/* ── Step indicator ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '2.5rem' }}>
        {['Personal Info', 'Cognitive Test', 'Results'].map((step, i) => (
          <React.Fragment key={step}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: i === 0 ? 'linear-gradient(135deg,#3b82f6,#6366f1)' : 'rgba(255,255,255,0.07)',
                border: i === 0 ? 'none' : '1.5px solid rgba(255,255,255,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.85rem', fontWeight: '700',
                color: i === 0 ? '#fff' : '#475569',
                boxShadow: i === 0 ? '0 4px 14px rgba(99,102,241,0.4)' : 'none',
              }}>{i + 1}</div>
              <span style={{ fontSize: '0.72rem', color: i === 0 ? '#93c5fd' : '#475569', fontWeight: i === 0 ? '600' : '400', whiteSpace: 'nowrap' }}>{step}</span>
            </div>
            {i < 2 && (
              <div style={{
                flex: 1, height: '2px', margin: '0 0.5rem',
                marginBottom: '1.25rem',
                background: i === 0
                  ? 'linear-gradient(to right,#3b82f6,rgba(99,102,241,0.3))'
                  : 'rgba(255,255,255,0.07)',
              }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ── Card ── */}
      <div style={{
        background: 'rgba(15,23,42,0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1.5px solid rgba(255,255,255,0.09)',
        borderRadius: '24px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.45)',
        overflow: 'hidden',
      }}>

        {/* Card header */}
        <div style={{
          padding: '2rem 2.5rem 1.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(99,102,241,0.05) 100%)',
          display: 'flex', alignItems: 'center', gap: '1rem',
        }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '16px',
            background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(99,102,241,0.4)',
          }}>
            <User size={24} color="#fff" />
          </div>
          <div>
            <h2 style={{
              margin: 0, fontSize: '1.45rem', fontWeight: '700',
              background: 'linear-gradient(to right,#e2e8f0,#94a3b8)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Personal Information</h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
              Step 1 of 3 — Tell us about yourself
            </p>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <Brain size={20} color="#3b82f6" style={{ opacity: 0.5 }} />
          </div>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} style={{ padding: '2rem 2.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

            {/* Age */}
            <Field icon={<User size={13} color="#3b82f6" />} label="Age">
              <input
                type="number" min="18" max="120" required
                value={data.age}
                style={getInputStyle('age')}
                onFocus={() => setFocused('age')}
                onBlur={() => setFocused(null)}
                onChange={e => setData({ ...data, age: parseInt(e.target.value) })}
              />
            </Field>

            {/* Gender */}
            <Field icon={<Users size={13} color="#3b82f6" />} label="Gender">
              <div style={{ position: 'relative' }}>
                <select
                  value={data.gender}
                  style={{ ...getInputStyle('gender'), paddingRight: '2.5rem' }}
                  onFocus={() => setFocused('gender')}
                  onBlur={() => setFocused(null)}
                  onChange={e => setData({ ...data, gender: parseInt(e.target.value) })}>
                  <option value={0}>Female</option>
                  <option value={1}>Male</option>
                </select>
                <ChevronDown size={15} color="#64748b" style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </Field>

            {/* Education – spans full width */}
            <div style={{ gridColumn: '1 / -1' }}>
              <Field
                icon={<BookOpen size={13} color="#3b82f6" />}
                label="Years of Education"
                hint={`${data.education} years — ${educationLabel(data.education)}`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <input
                    type="range" min="4" max="25"
                    value={data.education}
                    onChange={e => setData({ ...data, education: parseInt(e.target.value) })}
                    style={{ width: '100%', accentColor: '#3b82f6', cursor: 'pointer', height: '4px' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#475569' }}>
                    <span>Elementary (4)</span>
                    <span>High School (12)</span>
                    <span>Doctorate (25)</span>
                  </div>
                </div>
              </Field>
            </div>

            {/* Socioeconomic Status – spans full width */}
            <div style={{ gridColumn: '1 / -1' }}>
              <Field icon={<DollarSign size={13} color="#3b82f6" />} label="Socioeconomic Status">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '0.6rem' }}>
                  {[
                    { val: 1, label: 'Highest' },
                    { val: 2, label: 'High' },
                    { val: 3, label: 'Middle' },
                    { val: 4, label: 'Low' },
                    { val: 5, label: 'Lowest' },
                  ].map(opt => {
                    const selected = data.ses === opt.val;
                    return (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => setData({ ...data, ses: opt.val })}
                        style={{
                          padding: '0.7rem 0.4rem',
                          borderRadius: '10px',
                          border: selected ? '2px solid #3b82f6' : '1.5px solid rgba(255,255,255,0.1)',
                          background: selected
                            ? 'linear-gradient(135deg,rgba(59,130,246,0.25),rgba(99,102,241,0.2))'
                            : 'rgba(15,23,42,0.45)',
                          color: selected ? '#93c5fd' : '#64748b',
                          fontWeight: selected ? '700' : '400',
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem',
                          boxShadow: selected ? '0 4px 12px rgba(59,130,246,0.2)' : 'none',
                        }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: '800', color: selected ? '#60a5fa' : '#334155' }}>{opt.val}</span>
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </Field>
            </div>
          </div>

          {/* Submit */}
          <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                padding: '0.9rem 2rem', borderRadius: '12px',
                background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
                color: '#fff', border: 'none', fontWeight: '600',
                fontSize: '1rem', cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(99,102,241,0.4)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                fontFamily: 'Inter, sans-serif',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(99,102,241,0.55)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.4)'; }}>
              Continue to Tests <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
