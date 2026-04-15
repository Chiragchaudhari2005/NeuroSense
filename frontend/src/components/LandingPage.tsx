import { Brain, ArrowRight, UploadCloud, Layers, Activity, Shield, Zap } from 'lucide-react';

interface Props {
  onStart: (mode: 'test' | 'mri' | 'full') => void;
}

export function LandingPage({ onStart }: Props) {
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      fontFamily: "'Inter', 'Arial', sans-serif",
      color: '#1a1a2e',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* ── Navbar ── */}
      <nav style={{
        width: '100%',
        backgroundColor: '#0047AB',
        padding: '1rem 4rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 12px rgba(0,71,171,0.3)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Brain size={28} color="#ffffff" />
          <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ffffff', letterSpacing: '-0.02em' }}>
            NeuroSense
          </span>
        </div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <button style={{ background: 'transparent', color: '#cce0ff', border: 'none', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '500', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={e => (e.currentTarget.style.color = '#cce0ff')}>
            Home
          </button>
          <button style={{ background: 'transparent', color: '#cce0ff', border: 'none', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '500', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={e => (e.currentTarget.style.color = '#cce0ff')}>
            About
          </button>
          <button
            onClick={() => onStart('test')}
            style={{ backgroundColor: '#ffffff', color: '#0047AB', border: 'none', borderRadius: '8px', padding: '0.55rem 1.3rem', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem', transition: 'transform 0.2s, box-shadow 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section style={{
        width: '100%',
        background: 'linear-gradient(135deg, #f0f6ff 0%, #e8f0fe 50%, #f5f0ff 100%)',
        padding: '6rem 4rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '3rem',
        flexWrap: 'wrap',
      }}>
        <div style={{ maxWidth: '560px', flex: '1 1 320px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            backgroundColor: '#dbeafe', color: '#0047AB', borderRadius: '20px',
            padding: '0.4rem 1rem', fontSize: '0.85rem', fontWeight: '600', marginBottom: '1.5rem',
          }}>
            <Activity size={14} /> AI-Powered Cognitive Health
          </div>
          <h1 style={{
            fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
            fontWeight: '800',
            lineHeight: '1.15',
            marginBottom: '1.5rem',
            color: '#0a1628',
            letterSpacing: '-0.03em',
          }}>
            Assess Cognitive Health with{' '}
            <span style={{ color: '#0047AB' }}>Confidence</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#4a5568', lineHeight: '1.7', marginBottom: '2.5rem' }}>
            NeuroSense combines advanced cognitive tests and AI-powered MRI analysis to give
            you clear, actionable insights about brain health — in minutes.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => onStart('test')}
              style={{
                backgroundColor: '#0047AB', color: '#ffffff',
                border: 'none', borderRadius: '10px',
                padding: '0.9rem 2rem', fontSize: '1rem', fontWeight: '600',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
                boxShadow: '0 4px 20px rgba(0,71,171,0.35)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,71,171,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,71,171,0.35)'; }}>
              Get Started Now <ArrowRight size={18} />
            </button>
            <button
              onClick={() => onStart('mri')}
              style={{
                backgroundColor: 'transparent', color: '#0047AB',
                border: '2px solid #0047AB', borderRadius: '10px',
                padding: '0.9rem 2rem', fontSize: '1rem', fontWeight: '600',
                cursor: 'pointer', transition: 'background 0.2s, color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#0047AB'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#0047AB'; }}>
              Upload MRI Scan
            </button>
          </div>
        </div>

        {/* Hero Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', flex: '0 0 auto' }}>
          {[
            { label: 'Accuracy Rate', value: '94%', icon: <Shield size={20} color="#0047AB" /> },
            { label: 'Tests Completed', value: '10,000+', icon: <Activity size={20} color="#28A745" /> },
            { label: 'Avg. Analysis Time', value: '< 3 min', icon: <Zap size={20} color="#FFC107" /> },
          ].map(stat => (
            <div key={stat.label} style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              padding: '1.2rem 1.8rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
              display: 'flex', alignItems: 'center', gap: '1rem',
              minWidth: '220px',
            }}>
              <div style={{ padding: '0.6rem', backgroundColor: '#f0f6ff', borderRadius: '10px' }}>{stat.icon}</div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0a1628' }}>{stat.value}</div>
                <div style={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: '500' }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature Cards ── */}
      <section style={{
        width: '100%',
        padding: '5rem 4rem',
        backgroundColor: '#ffffff',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#0a1628', marginBottom: '0.8rem' }}>
            Choose Your Assessment Path
          </h2>
          <p style={{ fontSize: '1rem', color: '#6b7280', maxWidth: '500px', margin: '0 auto' }}>
            Three specialised tools designed for comprehensive cognitive health evaluation.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          maxWidth: '1100px',
          margin: '0 auto',
        }}>
          {/* Card 1 */}
          <div
            onClick={() => onStart('test')}
            style={{
              borderRadius: '16px', padding: '2.5rem 2rem',
              border: '2px solid #e8f0fe', cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              transition: 'transform 0.25s, box-shadow 0.25s, border-color 0.25s',
              backgroundColor: '#ffffff',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,71,171,0.15)'; e.currentTarget.style.borderColor = '#0047AB'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = '#e8f0fe'; }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Brain size={28} color="#0047AB" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0a1628', marginBottom: '0.75rem' }}>Take the Assessment</h3>
            <p style={{ fontSize: '0.92rem', color: '#6b7280', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Complete our cognitive evaluation test by answering a series of logic and memory questions.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', color: '#0047AB', gap: '0.4rem', fontWeight: '600', fontSize: '0.92rem' }}>
              Start Test <ArrowRight size={15} />
            </div>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => onStart('mri')}
            style={{
              borderRadius: '16px', padding: '2.5rem 2rem',
              border: '2px solid #dcfce7', cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              transition: 'transform 0.25s, box-shadow 0.25s, border-color 0.25s',
              backgroundColor: '#ffffff',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(40,167,69,0.15)'; e.currentTarget.style.borderColor = '#28A745'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = '#dcfce7'; }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <UploadCloud size={28} color="#28A745" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0a1628', marginBottom: '0.75rem' }}>Upload MRI Report</h3>
            <p style={{ fontSize: '0.92rem', color: '#6b7280', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Upload an MRI scan image to be analyzed by our advanced AI model for early detection.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', color: '#28A745', gap: '0.4rem', fontWeight: '600', fontSize: '0.92rem' }}>
              Upload Image <ArrowRight size={15} />
            </div>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => onStart('full')}
            style={{
              borderRadius: '16px', padding: '2.5rem 2rem',
              border: '2px solid #fef9c3', cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              transition: 'transform 0.25s, box-shadow 0.25s, border-color 0.25s',
              backgroundColor: '#ffffff',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(255,193,7,0.2)'; e.currentTarget.style.borderColor = '#FFC107'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = '#fef9c3'; }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: '#fef9c3', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Layers size={28} color="#ca8a04" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0a1628', marginBottom: '0.75rem' }}>Full Assessment</h3>
            <p style={{ fontSize: '0.92rem', color: '#6b7280', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Combine demographics, clinical cognitive tests, and an MRI scan into one final unified workflow.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', color: '#ca8a04', gap: '0.4rem', fontWeight: '600', fontSize: '0.92rem' }}>
              Start Combined <ArrowRight size={15} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        width: '100%',
        backgroundColor: '#0a1628',
        color: '#94a3b8',
        padding: '3rem 4rem',
        fontSize: '0.95rem',
        marginTop: 'auto',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr 240px', gap: '1.5rem', alignItems: 'start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
              <Brain size={24} color="#94a3b8" />
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>NeuroSense</span>
            </div>
            <div style={{ color: '#94a3b8', lineHeight: 1.6 }}>AI-driven cognitive health assessments combining quick tests and MRI analysis. For educational and research use.</div>
          </div>

          <div style={{ display: 'flex', gap: '2rem' }}>
            <div>
              <div style={{ fontWeight: 700, color: '#ffffff', marginBottom: '0.6rem' }}>Product</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#94a3b8' }}>
                <li style={{ marginBottom: '0.4rem' }}>Assessment</li>
                <li style={{ marginBottom: '0.4rem' }}>MRI Analysis</li>
                <li style={{ marginBottom: '0.4rem' }}>Research</li>
              </ul>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#ffffff', marginBottom: '0.6rem' }}>Company</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#94a3b8' }}>
                <li style={{ marginBottom: '0.4rem' }}>About Us</li>
                <li style={{ marginBottom: '0.4rem' }}>Careers</li>
                <li style={{ marginBottom: '0.4rem' }}>Privacy</li>
              </ul>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 700, color: '#ffffff', marginBottom: '0.6rem' }}>Contact</div>
            <div style={{ color: '#94a3b8', marginBottom: '0.8rem' }}>hello@neurosense.example</div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', color: '#94a3b8' }}>
              <a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>GitHub</a>
              <a href="mailto:hello@neurosense.example" style={{ color: '#94a3b8', textDecoration: 'none' }}>Email</a>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1.25rem', textAlign: 'center', color: '#6b7280' }}>© {new Date().getFullYear()} NeuroSense. For Educational Purposes Only.</div>
      </footer>
    </div>
  );
}
