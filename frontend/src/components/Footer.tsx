import { Brain } from 'lucide-react';

export function Footer() {
  return (
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
  );
}

export default Footer;
