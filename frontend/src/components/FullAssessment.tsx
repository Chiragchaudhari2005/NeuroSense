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
      <div className="glass-panel animate-slide-up text-center" style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 2rem' }}>
        <h2 style={{ marginBottom: '2rem' }}>Combined Multimodal Assessment</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}><Activity size={24}/> Cognitive Result</h3>
            <div style={{ marginTop: '1rem', fontSize: '1.1rem' }}>
              <p><b>Risk Probability:</b> {(result.cognitive_result.probability * 100).toFixed(1)}%</p>
            </div>
          </div>
          
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary)' }}><Brain size={24}/> MRI Result</h3>
            <div style={{ marginTop: '1rem', fontSize: '1.1rem' }}>
              <p><b>Dementia Class:</b> {result.mri_result.risk}</p>
              <p><b>Model Confidence:</b> {(result.mri_result.probability * 100).toFixed(1)}%</p>
            </div>
          </div>
          
        </div>

        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '12px', border: `2px solid ${riskColor}`, marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', margin: 0, color: riskColor }}>{final_risk_category}</h2>
          <div style={{ fontSize: '1.5rem', marginTop: '1rem' }}>Overall AI Score: <b>{(final_score * 100).toFixed(1)}%</b></div>
          
          <div style={{ marginTop: '2rem', height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
             <div style={{ 
               position: 'absolute', top: 0, left: 0, height: '100%', 
               width: `${final_score * 100}%`, backgroundColor: riskColor,
               transition: 'width 1s ease-in-out'
             }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
             <span>Low (0%)</span><span>Medium (30-70%)</span><span>High (100%)</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={onRestart} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <RefreshCw size={20} /> New Assessment
          </button>
          
          {result.report_url && (
            <button className="btn btn-primary" onClick={() => window.open(`http://localhost:8000${result.report_url}`, '_blank')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Download size={20} /> Download Medical Report
            </button>
          )}
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
