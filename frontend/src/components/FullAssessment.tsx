import React, { useState } from 'react';
import { Upload, FileImage, RefreshCw, Layers, ArrowRight, Download, Activity, Brain } from 'lucide-react';

interface Props {
  demoData: any;
  cognitiveScore: number;
  onRestart: () => void;
}

interface FullAssessmentResult {
  patient: any;
  cognitive_result: { probability: number };
  mri_result: { risk: string; probability: number };
  final_assessment: { final_score: number; final_risk_category: string };
  report_url: string;
}

export function FullAssessment({ demoData, cognitiveScore, onRestart }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FullAssessmentResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload an MRI image.");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    const data = new FormData();
    data.append('age', demoData.age.toString());
    data.append('gender', demoData.gender.toString());
    data.append('education', demoData.education.toString());
    data.append('ses', demoData.ses.toString());
    data.append('cognitive_score', cognitiveScore.toString());
    data.append('mri_image', file);
    
    try {
      const response = await fetch('http://localhost:8000/full_assessment', {
        method: 'POST',
        body: data,
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze data.');
      }
      
      const resData = await response.json();
      if (resData.error) throw new Error(resData.error);
      
      setResult(resData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    const { final_score, final_risk_category } = result.final_assessment;
    let riskColor = 'var(--success)';
    if (final_risk_category === 'Medium Risk') riskColor = 'var(--warning)';
    if (final_risk_category === 'High Risk') riskColor = 'var(--danger)';

    return (
      <div style={{ maxWidth: '1100px', margin: '0 auto' }} className="animate-slide-up">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '1.75rem', alignItems: 'start' }}>
          {/* Left: Summary card */}
          <div style={{ background: '#ffffff', borderRadius: '14px', padding: '1.75rem', boxShadow: '0 12px 40px rgba(15,23,42,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <div>
                <h2 style={{ margin: 0, color: '#0b1220' }}>Combined Multimodal Assessment</h2>
                <div style={{ color: '#6b7280', marginTop: '0.4rem' }}>Summary of cognitive + MRI results</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Overall AI Score</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: riskColor }}>{(final_score * 100).toFixed(1)}%</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.25rem' }}>
              <div style={{ background: 'linear-gradient(180deg,#fbfdff,#f6f8ff)', padding: '1rem', borderRadius: '10px', border: '1px solid #e6eefc' }}>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Cognitive Result</div>
                <div style={{ fontWeight: 700, marginTop: '0.5rem', color: '#0b1220' }}>{(result.cognitive_result.probability * 100).toFixed(1)}%</div>
                <div style={{ marginTop: '0.5rem', color: '#6b7280', fontSize: '0.9rem' }}>Probability of cognitive impairment based on test score.</div>
              </div>

              <div style={{ background: 'linear-gradient(180deg,#fffaf6,#fffbf2)', padding: '1rem', borderRadius: '10px', border: '1px solid #fff1e6' }}>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>MRI Result</div>
                <div style={{ fontWeight: 700, marginTop: '0.5rem', color: '#0b1220' }}>{result.mri_result.risk}</div>
                <div style={{ marginTop: '0.5rem', color: '#6b7280', fontSize: '0.9rem' }}>Model confidence: {(result.mri_result.probability * 100).toFixed(1)}%</div>
              </div>
            </div>

            <div style={{ marginTop: '1.25rem', padding: '1rem', borderRadius: '10px', background: '#f8fafc', border: '1px solid #eef2ff', color: '#334155' }}>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>{final_risk_category}</h4>
              <p style={{ margin: 0, lineHeight: 1.6 }}>This combined assessment synthesizes demographic, cognitive testing and MRI imaging results. Use this as a guide for next steps and clinical discussion.</p>
            </div>

            {result.report_url && (
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.6rem' }}>
                <button className="btn btn-primary" onClick={() => window.open(`http://localhost:8000${result.report_url}`, '_blank')}><Download size={16}/> Download Full Report</button>
                <button className="btn btn-secondary" onClick={() => window.print()}>Print Summary</button>
              </div>
            )}
          </div>

          {/* Right: Risk card (glass) */}
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Layers size={28} color={riskColor} />
              <div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Final Risk</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: riskColor }}>{final_risk_category}</div>
              </div>
            </div>

            <div style={{ height: '12px', background: 'rgba(15,23,42,0.06)', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ width: `${final_score * 100}%`, height: '100%', background: riskColor, transition: 'width 1s ease' }} />
            </div>

            <div style={{ color: 'var(--text-muted)' }}>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>Recommended Actions</h4>
              <ul style={{ margin: 0, paddingLeft: '1.15rem' }}>
                <li>Discuss findings with a neurology specialist.</li>
                <li>Consider further clinical testing and imaging.</li>
                <li>Review lifestyle interventions and follow-up plan.</li>
              </ul>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-secondary" onClick={onRestart} style={{ flex: 1 }}>Start New Assessment</button>
              <button className="btn btn-primary" onClick={() => window.open(`http://localhost:8000${result.report_url}`, '_blank')} style={{ flex: 1 }}>Download Report</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel animate-slide-up" style={{ maxWidth: '700px', margin: '0 auto', padding: '3rem 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Layers size={32} color="var(--primary)" />
        <h2 style={{ margin: 0 }}>Multimodal Assessment</h2>
      </div>
      
      <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>
        Your demographic data and cognitive score ({cognitiveScore}/30) have been recorded. 
        Please upload an MRI scan to complete the comprehensive AI evaluation.
      </p>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group" style={{ marginBottom: '2rem' }}>
           <label>MRI Image</label>
           {!file ? (
             <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', border: '2px dashed var(--glass-border)', borderRadius: '12px', cursor: 'pointer', background: 'rgba(255,255,255,0.02)' }}>
               <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
               <Upload size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
               <div>Click or drag to upload MRI</div>
             </label>
           ) : (
             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
               <img src={preview!} alt="preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
               <div style={{ flex: 1, wordBreak: 'break-all' }}>{file.name}</div>
               <button type="button" onClick={() => { setFile(null); setPreview(null); }} className="btn" style={{ background: 'var(--danger)', padding: '0.5rem' }}>Change</button>
             </div>
           )}
        </div>

        <button type="submit" disabled={!file || loading} className="btn btn-primary" style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
          {loading ? <><RefreshCw size={20} className="animate-spin"/> Analyzing...</> : <><Layers size={20}/> Generate Full Assessment</>}
        </button>
      </form>
    </div>
  );
}
